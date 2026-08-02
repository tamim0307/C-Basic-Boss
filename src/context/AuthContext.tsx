import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, saveUserProfileToDB, fetchUserProfileFromDB, initialProgress } from '../lib/firebase';
import { UserProfile, UserProgress } from '../types';
import { BADGES_LIST } from '../data/badgesData';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  recordSolvedProblem: (problemId: string, topicId: number, points: number, usedHintsCount: number) => Promise<void>;
  recordTopicCompletion: (topicId: number) => Promise<void>;
  recordSkillCheckPassed: (topicId: number) => Promise<void>;
  recordFinalTest: (score: number, total: number, answers: Record<number, number>) => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isAuthModalOpen: boolean;
  authModalMessage: string;
  openAuthModal: (msg?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auth Guard Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  const openAuthModal = (msg?: string) => {
    setAuthModalMessage(msg || 'C practice করার জন্য প্রথমে Sign Up বা Log In করতে হবে।');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fetchedProfile = await fetchUserProfileFromDB(currentUser.uid);
        if (fetchedProfile) {
          setProfile(fetchedProfile);
        } else {
          // Initialize profile if new user
          const newProf: UserProfile = {
            uid: currentUser.uid,
            name: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'C Student'),
            email: currentUser.email || '',
            joinedAt: new Date().toISOString(),
            progress: { ...initialProgress },
          };
          setProfile(newProf);
          await saveUserProfileToDB(currentUser.uid, newProf);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newProf: UserProfile = {
      uid: cred.user.uid,
      name,
      email,
      joinedAt: new Date().toISOString(),
      progress: { ...initialProgress },
    };
    setProfile(newProf);
    await saveUserProfileToDB(cred.user.uid, newProf);
    showToast(`Welcome to C Basic Boss, ${name}!`);
  };

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const userProf = await fetchUserProfileFromDB(cred.user.uid);
    if (userProf) setProfile(userProf);
    showToast(`Logged in successfully!`);
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
    showToast('Logged out');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    showToast(`Password reset link sent to ${email}`);
  };

  // Progress Helper: Record solved problem
  const recordSolvedProblem = async (
    problemId: string,
    topicId: number,
    basePoints: number,
    usedHintsCount: number
  ) => {
    if (!profile || !user) return;

    const currentProg = profile.progress || { ...initialProgress };
    const alreadySolved = !!currentProg.solvedProblems[problemId];

    // Points calculation: Bonus 5 pts if no hints used!
    const bonus = usedHintsCount === 0 ? 5 : 0;
    const pointsEarned = alreadySolved ? 0 : basePoints + bonus;

    const updatedSolved = {
      ...currentProg.solvedProblems,
      [problemId]: {
        solvedAt: new Date().toISOString(),
        usedHintsCount,
        pointsEarned,
      },
    };

    const topicInfo = currentProg.topicProgress[topicId] || { solvedCount: 0, isCompleted: false };
    const newTopicSolvedCount = alreadySolved ? topicInfo.solvedCount : topicInfo.solvedCount + 1;

    const updatedTopicProg = {
      ...currentProg.topicProgress,
      [topicId]: {
        ...topicInfo,
        solvedCount: newTopicSolvedCount,
      },
    };

    const newTotalSolved = Object.keys(updatedSolved).length;
    const newTotalPoints = currentProg.totalPoints + pointsEarned;

    // Evaluate Badge Unlocks
    const newlyUnlockedBadges = evaluateBadges({
      ...currentProg,
      totalProblemsSolved: newTotalSolved,
      totalPoints: newTotalPoints,
      solvedProblems: updatedSolved,
      topicProgress: updatedTopicProg,
    });

    const updatedProfile: UserProfile = {
      ...profile,
      progress: {
        ...currentProg,
        totalProblemsSolved: newTotalSolved,
        totalPoints: newTotalPoints,
        solvedProblems: updatedSolved,
        topicProgress: updatedTopicProg,
        unlockedBadges: Array.from(new Set([...currentProg.unlockedBadges, ...newlyUnlockedBadges])),
      },
    };

    setProfile(updatedProfile);
    await saveUserProfileToDB(user.uid, updatedProfile);

    if (pointsEarned > 0) {
      showToast(`+${pointsEarned} Points Earned! Problem Solved! 🎯`);
    }
  };

  // Progress Helper: Record topic completion
  const recordTopicCompletion = async (topicId: number) => {
    if (!profile || !user) return;

    const currentProg = profile.progress;
    const completedList = currentProg.completedTopics || [];

    if (!completedList.includes(topicId)) {
      const newCompleted = [...completedList, topicId];
      const bonusPoints = 50;

      const topicInfo = currentProg.topicProgress[topicId] || { solvedCount: 0, isCompleted: false };
      const updatedTopicProg = {
        ...currentProg.topicProgress,
        [topicId]: { ...topicInfo, isCompleted: true },
      };

      const newlyUnlockedBadges = evaluateBadges({
        ...currentProg,
        completedTopics: newCompleted,
        topicProgress: updatedTopicProg,
      });

      const updatedProfile: UserProfile = {
        ...profile,
        progress: {
          ...currentProg,
          completedTopics: newCompleted,
          totalPoints: currentProg.totalPoints + bonusPoints,
          topicProgress: updatedTopicProg,
          unlockedBadges: Array.from(new Set([...currentProg.unlockedBadges, ...newlyUnlockedBadges])),
        },
      };

      setProfile(updatedProfile);
      await saveUserProfileToDB(user.uid, updatedProfile);
      showToast(`🎉 Topic Completed! +50 Bonus Points!`);
    }
  };

  const recordSkillCheckPassed = async (topicId: number) => {
    if (!profile || !user) return;

    const currentProg = profile.progress;
    const topicInfo = currentProg.topicProgress[topicId] || { solvedCount: 0, isCompleted: false };

    const updatedProfile: UserProfile = {
      ...profile,
      progress: {
        ...currentProg,
        topicProgress: {
          ...currentProg.topicProgress,
          [topicId]: { ...topicInfo, skillCheckPassed: true },
        },
      },
    };

    setProfile(updatedProfile);
    await saveUserProfileToDB(user.uid, updatedProfile);
    showToast(`🏆 Skill Check Passed for Topic #${topicId}!`);
  };

  const recordFinalTest = async (score: number, total: number, answers: Record<number, number>) => {
    if (!profile || !user) return;

    const passed = score / total >= 0.8;
    const currentProg = profile.progress;

    const newlyUnlockedBadges = [...currentProg.unlockedBadges];
    if (passed && !newlyUnlockedBadges.includes('c_expert')) {
      newlyUnlockedBadges.push('c_expert');
    }

    const updatedProfile: UserProfile = {
      ...profile,
      progress: {
        ...currentProg,
        unlockedBadges: newlyUnlockedBadges,
        finalTest: {
          score,
          totalQuestions: total,
          passed,
          completedAt: new Date().toISOString(),
          answers,
        },
      },
    };

    setProfile(updatedProfile);
    await saveUserProfileToDB(user.uid, updatedProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        login,
        logout,
        resetPassword,
        recordSolvedProblem,
        recordTopicCompletion,
        recordSkillCheckPassed,
        recordFinalTest,
        toastMessage,
        showToast,
        isAuthModalOpen,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

function evaluateBadges(prog: UserProgress): string[] {
  const unlocked: string[] = [];

  // First Problem Solved
  if (prog.totalProblemsSolved >= 1) unlocked.push('first_problem');

  // First Topic Completed
  if (prog.completedTopics.length >= 1) unlocked.push('first_topic');

  // Independent Solver (5 problems with 0 hints)
  const noHintCount = Object.values(prog.solvedProblems).filter((sp) => sp.usedHintsCount === 0).length;
  if (noHintCount >= 5) unlocked.push('independent_solver');

  // Loop Explorer (Topics 23-27)
  const loopTopics = [23, 24, 25, 26, 27];
  if (loopTopics.some((tId) => prog.completedTopics.includes(tId))) unlocked.push('loop_explorer');

  // Condition Master (Topics 18-22)
  const condTopics = [18, 19, 20, 21, 22];
  if (condTopics.some((tId) => prog.completedTopics.includes(tId))) unlocked.push('condition_master');

  // Array Explorer (Topics 32-38)
  const arrTopics = [32, 33, 34, 35, 36, 37, 38];
  if (arrTopics.some((tId) => prog.completedTopics.includes(tId))) unlocked.push('array_explorer');

  // Problem Solver
  if (prog.totalProblemsSolved >= 25) unlocked.push('problem_solver');

  return unlocked;
}
