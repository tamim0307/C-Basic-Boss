import React from 'react';
import { BookOpen, Trophy, ArrowRight, Sparkles, CheckCircle2, Layers, Cpu, Award, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ENRICHED_TOPICS } from '../data/topicDataEnricher';
import { BADGES_LIST } from '../data/badgesData';

interface DashboardViewProps {
  setCurrentView: (view: string) => void;
  setSelectedTopicId: (topicId: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setCurrentView, setSelectedTopicId }) => {
  const { profile } = useAuth();

  const prog = profile?.progress || {
    totalProblemsSolved: 0,
    totalPoints: 0,
    completedTopics: [],
    topicProgress: {},
    solvedProblems: {},
    unlockedBadges: [],
  };

  const name = profile?.name || 'Student';

  // Find active / in-progress topic
  const activeTopic = ENRICHED_TOPICS.find((t) => {
    const tp = prog.topicProgress[t.id];
    return tp && tp.solvedCount > 0 && !tp.isCompleted;
  }) || ENRICHED_TOPICS[0]; // fallback to first topic

  const activeTpInfo = prog.topicProgress[activeTopic.id] || { solvedCount: 0, isCompleted: false };

  // Calculate metrics
  const totalTopicsStarted = Object.keys(prog.topicProgress).filter(
    (k) => (prog.topicProgress[Number(k)]?.solvedCount || 0) > 0
  ).length;

  const unlockedBadgesCount = prog.unlockedBadges.length;

  const handleContinueTopic = (topicId: number) => {
    setSelectedTopicId(topicId);
    setCurrentView('topic-detail');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
              STUDENT DASHBOARD
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{name}</span>!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Keep practicing C topics to build strong problem-solving independence.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('topics')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <BookOpen className="w-4 h-4" />
            Explore C Topics
          </button>
          <button
            onClick={() => setCurrentView('profile')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            View My Progress
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">{prog.totalProblemsSolved}</span>
            <span className="text-xs text-slate-400 font-medium">Problems Solved</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-amber-400 block">{prog.totalPoints}</span>
            <span className="text-xs text-slate-400 font-medium">Total Points</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">{totalTopicsStarted}</span>
            <span className="text-xs text-slate-400 font-medium">Topics Started</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-400 block">{prog.completedTopics.length}</span>
            <span className="text-xs text-slate-400 font-medium">Topics Completed</span>
          </div>
        </div>
      </div>

      {/* Main Active Practice Banner */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-block mb-3">
              CURRENT PRACTICE TOPIC
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{activeTopic.name}</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed mb-4">
              {activeTopic.shortDescription}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">
                  {activeTpInfo.solvedCount} of {activeTopic.problems.length} problems completed
                </span>
                <span className="text-cyan-400 font-mono font-bold">
                  {Math.round((activeTpInfo.solvedCount / activeTopic.problems.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${(activeTpInfo.solvedCount / activeTopic.problems.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleContinueTopic(activeTopic.id)}
            className="px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all border border-cyan-400/30 flex items-center gap-2 shrink-0"
          >
            Continue Practice
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Two Column Grid: Recent Completed Topics & Earned Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recently Completed Topics */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Completed Topics
            </h3>
            <button
              onClick={() => setCurrentView('topics')}
              className="text-xs font-bold text-cyan-400 hover:underline"
            >
              View All
            </button>
          </div>

          {prog.completedTopics.length > 0 ? (
            <div className="space-y-3">
              {prog.completedTopics.slice(0, 5).map((tId) => {
                const topicObj = ENRICHED_TOPICS.find((t) => t.id === tId);
                if (!topicObj) return null;
                return (
                  <div
                    key={tId}
                    onClick={() => handleContinueTopic(tId)}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{topicObj.name}</h4>
                      <p className="text-[11px] text-slate-400">{topicObj.categoryName}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80">
              <Zap className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No topics completed yet. Solve all problems in a topic to earn completion!</p>
            </div>
          )}
        </div>

        {/* Earned Badges Showcase */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Earned Badges ({unlockedBadgesCount}/{BADGES_LIST.length})
            </h3>
            <button
              onClick={() => setCurrentView('profile')}
              className="text-xs font-bold text-cyan-400 hover:underline"
            >
              Showcase
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BADGES_LIST.map((badge) => {
              const isUnlocked = prog.unlockedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isUnlocked
                      ? 'bg-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-40 grayscale'
                  }`}
                >
                  <span className="text-2xl block mb-1">{badge.icon}</span>
                  <h4 className="text-xs font-bold text-white truncate">{badge.title}</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
