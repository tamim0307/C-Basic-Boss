import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { UserProfile, UserProgress } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCX4726Knaygk7bInDI7UvWTfVXFPGTMpw",
  authDomain: "learnproject-dca72.firebaseapp.com",
  databaseURL: "https://learnproject-dca72-default-rtdb.firebaseio.com",
  projectId: "learnproject-dca72",
  storageBucket: "learnproject-dca72.firebasestorage.app",
  messagingSenderId: "681867745042",
  appId: "1:681867745042:web:f55453f1c82708433e85cb"
};

// Initialize Firebase safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getDatabase(app);

const LOCAL_STORAGE_KEY = 'c_basic_boss_user_progress';

export const initialProgress: UserProgress = {
  totalProblemsSolved: 0,
  totalPoints: 0,
  completedTopics: [],
  topicProgress: {},
  solvedProblems: {},
  unlockedBadges: [],
};

// Save user profile to Firebase Realtime Database
export async function saveUserProfileToDB(userId: string, profile: UserProfile): Promise<void> {
  // Always save locally first for instant UI response
  localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(profile));
  try {
    const userRef = ref(db, `users/${userId}`);
    await set(userRef, profile);
  } catch (error) {
    console.warn('Firebase RTDB sync warning (saved locally):', error);
  }
}

// Fetch user profile from Firebase Realtime Database
export async function fetchUserProfileFromDB(userId: string): Promise<UserProfile | null> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${userId}`));
    if (snapshot.exists()) {
      const data = snapshot.val() as UserProfile;
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.warn('Firebase fetch error, falling back to local storage:', error);
  }

  // Fallback to local storage
  const localData = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${userId}`);
  if (localData) {
    try {
      return JSON.parse(localData) as UserProfile;
    } catch {
      return null;
    }
  }
  return null;
}
