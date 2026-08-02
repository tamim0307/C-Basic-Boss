import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, CheckCircle2, Eye, X, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ENRICHED_TOPICS } from '../data/topicDataEnricher';
import { CodeEditor } from '../components/CodeEditor';

interface PracticeViewProps {
  topicId: number;
  problemId: string;
  setCurrentView: (view: string) => void;
  setSelectedTopicId: (topicId: number) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  topicId,
  problemId,
  setCurrentView,
  setSelectedTopicId,
}) => {
  const { recordSolvedProblem } = useAuth();
  const [hintLevel, setHintLevel] = useState<number>(0); // 0 = no hint, 1, 2, 3
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [isSolvedLocally, setIsSolvedLocally] = useState(false);

  const topic = ENRICHED_TOPICS.find((t) => t.id === topicId) || ENRICHED_TOPICS[0];
  const problem = topic.problems.find((p) => p.id === problemId) || topic.problems[0];

  const handleCheckSuccess = (usedHintsCount: number) => {
    setIsSolvedLocally(true);
    let points = 10;
    if (problem.difficulty === 'Medium') points = 20;
    if (problem.difficulty === 'Hard') points = 30;

    recordSolvedProblem(problem.id, topic.id, points, usedHintsCount);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <button
          onClick={() => {
            setSelectedTopicId(topic.id);
            setCurrentView('topic-detail');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {topic.name}
        </button>

        <div className="flex items-center gap-2">
          {/* Hint Trigger Button */}
          <button
            onClick={() => setHintLevel((prev) => Math.min(prev + 1, 3))}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
            id="hint-btn"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            {hintLevel === 0 ? 'Need Hint?' : `Hint Level ${hintLevel}/3`}
          </button>

          {/* View Solution Trigger Button */}
          <button
            onClick={() => setShowSolutionModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-cyan-400 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            id="view-solution-btn"
          >
            <Eye className="w-4 h-4" />
            View Full Solution
          </button>
        </div>
      </div>

      {/* Main Grid: Problem Description & Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Problem Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                MISSION #{problem.missionNumber}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase ${
                  problem.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : problem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {problem.difficulty}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-white">{problem.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{problem.statement}</p>

            {/* Formats and Input/Output Examples */}
            {problem.inputFormat && (
              <div className="text-xs text-slate-400">
                <span className="font-bold text-slate-300 block mb-0.5">Input Format:</span>
                <p>{problem.inputFormat}</p>
              </div>
            )}

            {problem.outputFormat && (
              <div className="text-xs text-slate-400">
                <span className="font-bold text-slate-300 block mb-0.5">Output Format:</span>
                <p>{problem.outputFormat}</p>
              </div>
            )}

            {problem.exampleInput !== undefined && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Example Input:</span>
                <pre className="text-slate-200 whitespace-pre-wrap">{problem.exampleInput}</pre>
              </div>
            )}

            {problem.exampleOutput !== undefined && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Example Output:</span>
                <pre className="text-emerald-400 whitespace-pre-wrap">{problem.exampleOutput}</pre>
              </div>
            )}
          </div>

          {/* 3-Tier Hint System Panel */}
          {hintLevel > 0 && (
            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-800/60 text-amber-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-amber-800/40 pb-2">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  Hint Level {hintLevel} of 3
                </h4>
                <button
                  onClick={() => setHintLevel(0)}
                  className="text-amber-400 hover:text-white text-xs"
                >
                  Hide
                </button>
              </div>

              {hintLevel >= 1 && (
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-amber-300 block mb-1">Hint 1 (Clue):</span>
                  <p className="bg-amber-950/40 p-2.5 rounded-lg border border-amber-900/50">
                    {problem.hints?.[0] || 'Review the core concept of this topic and check your program logic.'}
                  </p>
                </div>
              )}

              {hintLevel >= 2 && (
                <div className="text-xs leading-relaxed pt-2 border-t border-amber-900/40">
                  <span className="font-bold text-amber-300 block mb-1">Hint 2 (Strong Clue):</span>
                  <p className="bg-amber-950/40 p-2.5 rounded-lg border border-amber-900/50">
                    {problem.hints?.[1] || 'Check format specifiers (%d, %f, %s) and ensure variable types match.'}
                  </p>
                </div>
              )}

              {hintLevel >= 3 && (
                <div className="text-xs leading-relaxed pt-2 border-t border-amber-900/40">
                  <span className="font-bold text-amber-300 block mb-1">Hint 3 (Near-Solution Explanation):</span>
                  <p className="bg-amber-950/40 p-2.5 rounded-lg border border-amber-900/50">
                    {problem.hints?.[2] || 'Ensure output formatting, space separators, and semicolons match the expected output.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Solved Success Banner */}
          {isSolvedLocally && (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Mission Solved Successfully!</h4>
                <p className="text-xs text-emerald-400">Great job! Your answer passed all test cases.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor Component (7 Cols) */}
        <div className="lg:col-span-7">
          <CodeEditor
            initialCode={problem.starterCode}
            testCases={problem.testCases}
            onCheckSuccess={handleCheckSuccess}
            hintsUsedCount={hintLevel}
          />
        </div>
      </div>

      {/* SOLUTION SYSTEM MODAL */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full my-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSolutionModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                FULL SOLUTION & EXPLANATION
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6">{problem.title}</h3>

            {/* Solution C Code */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Complete Correct C Code
              </h4>
              <pre className="p-4 rounded-xl bg-[#05070c] border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
                {problem.solutionCode}
              </pre>
            </div>

            {/* Bangla Conceptual Explanation */}
            <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                ব্যাখ্যা (Bangla Concept Explanation)
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {problem.explanationBangla}
              </p>
            </div>

            {/* Line-by-Line Table Explanation */}
            {problem.lineByLineExplanation && problem.lineByLineExplanation.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                  Line-by-Line Breakdown
                </h4>
                <div className="space-y-2">
                  {problem.lineByLineExplanation.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                      <div className="text-cyan-400 font-bold mb-0.5">{item.code}</div>
                      <div className="text-slate-400 text-[11px] font-sans">{item.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Mistakes & Key Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/40">
                <h5 className="font-bold text-rose-400 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Common Pitfalls
                </h5>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {(problem.commonMistakes || ['Syntax errors', 'Incorrect format specifiers']).map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                <h5 className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Summary
                </h5>
                <p className="text-slate-300">{problem.keyConceptSummary || 'Practice regularly to master this C concept!'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
