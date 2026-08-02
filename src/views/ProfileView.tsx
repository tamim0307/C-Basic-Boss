import React from 'react';
import { User as UserIcon, Trophy, Sparkles, CheckCircle2, Layers, BookOpen, LogOut, Award, Calendar, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BADGES_LIST } from '../data/badgesData';
import { TOPICS } from '../data/topicsData';

interface ProfileViewProps {
  setCurrentView: (view: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ setCurrentView }) => {
  const { profile, logout } = useAuth();

  const name = profile?.name || 'Student';
  const email = profile?.email || 'student@example.com';
  const joinedAt = profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : 'Recent';

  const prog = profile?.progress || {
    totalProblemsSolved: 0,
    totalPoints: 0,
    completedTopics: [],
    topicProgress: {},
    solvedProblems: {},
    unlockedBadges: [],
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      {/* Profile Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-[2px] shadow-lg shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-2xl text-cyan-400">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Joined {joinedAt}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('topics')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            Explore C Topics
          </button>
          <button
            onClick={() => {
              logout();
              setCurrentView('home');
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-950/40 text-rose-300 border border-rose-900/60 hover:bg-rose-950/60 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Progress Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Solved</span>
          <span className="text-3xl font-black text-white font-mono">{prog.totalProblemsSolved}</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-semibold block mb-1 font-mono">Total Points</span>
          <span className="text-3xl font-black text-amber-400 font-mono">{prog.totalPoints} pts</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Topics Completed</span>
          <span className="text-3xl font-black text-emerald-400 font-mono">{prog.completedTopics.length} / 50</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Badges Unlocked</span>
          <span className="text-3xl font-black text-cyan-400 font-mono">{prog.unlockedBadges.length} / {BADGES_LIST.length}</span>
        </div>
      </div>

      {/* Earned Badges Showcase */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Achievement Badges Showcase
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = prog.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/40 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-40 grayscale'
                }`}
              >
                <span className="text-3xl shrink-0 p-2 rounded-xl bg-slate-900 border border-slate-800">
                  {badge.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">{badge.title}</h3>
                    {isUnlocked && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Test History if available */}
      {prog.finalTest && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Final C Basic Expert Test Results
          </h2>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">
                Completed on {new Date(prog.finalTest.completedAt).toLocaleDateString()}
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {prog.finalTest.score} / {prog.finalTest.totalQuestions} ({Math.round((prog.finalTest.score / prog.finalTest.totalQuestions) * 100)}%)
              </span>
            </div>

            <span
              className={`px-4 py-2 rounded-xl text-xs font-bold border uppercase tracking-wider ${
                prog.finalTest.passed
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}
            >
              {prog.finalTest.passed ? 'PASSED (C Fundamentals Expert)' : 'KEEP PRACTICING'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
