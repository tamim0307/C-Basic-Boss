import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ArrowRight, ArrowLeft, Lightbulb, AlertTriangle, HelpCircle, Code2, Trophy, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ENRICHED_TOPICS } from '../data/topicDataEnricher';

interface TopicDetailViewProps {
  topicId: number;
  setCurrentView: (view: string) => void;
  setSelectedTopicId: (topicId: number) => void;
  setSelectedProblemId: (problemId: string) => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topicId,
  setCurrentView,
  setSelectedProblemId,
}) => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'problems' | 'resource'>('problems');

  const topic = ENRICHED_TOPICS.find((t) => t.id === topicId) || ENRICHED_TOPICS[0];
  const prog = profile?.progress || {
    solvedProblems: {},
    topicProgress: {},
  };

  const tpInfo = prog.topicProgress[topic.id] || { solvedCount: 0, isCompleted: false };
  const solvedCount = tpInfo.solvedCount || 0;
  const isAllSolved = solvedCount >= topic.problems.length;

  const handleStartProblem = (problemId: string) => {
    setSelectedProblemId(problemId);
    setCurrentView('practice');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('topics')}
        className="mb-6 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to C Topics
      </button>

      {/* Topic Title Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-block mb-3">
              {topic.categoryName} • TOPIC #{topic.id}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{topic.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {topic.shortDescription}
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center shrink-0 min-w-[180px]">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Missions Solved</span>
            <span className="text-3xl font-black text-cyan-400 font-mono">
              {solvedCount} / {topic.problems.length}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              {Math.round((solvedCount / topic.problems.length) * 100)}% Progress
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              activeTab === 'problems'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Practice Missions ({topic.problems.length})
          </button>
          <button
            onClick={() => setActiveTab('resource')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              activeTab === 'resource'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Topic Summary & Rules
          </button>
        </div>
      </div>

      {/* TAB 1: PRACTICE MISSIONS */}
      {activeTab === 'problems' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Practice Missions ({topic.problems.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Solve structured C missions or challenge yourself with the Expert Test.</p>
            </div>
            <button
              onClick={() => setCurrentView('topic-completion')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all border border-amber-400/30 flex items-center gap-2 shrink-0"
              id="take-topic-expert-test-btn"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span>Topic Expert Test (30 MCQs • 120s)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {topic.problems.map((prob, idx) => {
              const isSolved = !!prog.solvedProblems[prob.id];

              let diffClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              if (prob.difficulty === 'Medium') diffClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
              if (prob.difficulty === 'Hard') diffClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

              return (
                <div
                  key={prob.id}
                  className={`p-5 rounded-2xl bg-slate-900 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isSolved ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-cyan-400 shrink-0 mt-0.5">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${diffClass}`}>
                          {prob.difficulty}
                        </span>
                        {isSolved && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Solved
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{prob.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{prob.statement}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartProblem(prob.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isSolved
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110'
                    }`}
                  >
                    {isSolved ? 'Solve Again' : 'Solve Mission'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: COMPACT TOPIC RESOURCE SUMMARY */}
      {activeTab === 'resource' && (
        <div className="space-y-6">
          {/* What & Why Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                What is this topic?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{topic.resource.whatIsIt}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                Why is it used?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{topic.resource.whyUseIt}</p>
            </div>
          </div>

          {/* Syntax Code Box */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <Code2 className="w-5 h-5 text-emerald-400" />
              Main C Syntax
            </h3>
            <pre className="p-4 rounded-xl bg-[#05070c] border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
              {topic.resource.syntax}
            </pre>
          </div>

          {/* Important Rules & Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                Important Rules
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {topic.resource.importantRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Common Mistakes
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {topic.resource.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5"></span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
