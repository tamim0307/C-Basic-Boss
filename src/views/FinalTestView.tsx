import React, { useState, useEffect } from 'react';
import { Trophy, Clock, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, ShieldCheck, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FINAL_TEST_QUESTIONS } from '../data/finalTestData';

interface FinalTestViewProps {
  setCurrentView: (view: string) => void;
}

export const FinalTestView: React.FC<FinalTestViewProps> = ({ setCurrentView }) => {
  const { recordFinalTest } = useAuth();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(90 * 60); // 90 minutes in seconds
  const [testFinished, setTestFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    if (testFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testFinished]);

  const handleSelectOption = (qId: number, optIndex: number) => {
    if (testFinished) return;
    setUserAnswers({ ...userAnswers, [qId]: optIndex });
  };

  const handleFinishTest = async () => {
    let calculated = 0;
    FINAL_TEST_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        calculated++;
      }
    });

    setScore(calculated);
    setTestFinished(true);
    await recordFinalTest(calculated, FINAL_TEST_QUESTIONS.length, userAnswers);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const currentQ = FINAL_TEST_QUESTIONS[currentQIndex];
  const totalQuestions = FINAL_TEST_QUESTIONS.length;
  const passScorePercent = Math.round((score / totalQuestions) * 100);
  const isPassed = passScorePercent >= 80;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {!testFinished ? (
        <div>
          {/* Test Header with Timer */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-block mb-1">
                C FUNDAMENTALS EXPERT EXAM
              </span>
              <h1 className="text-2xl font-bold text-white">Final Comprehensive C Test</h1>
            </div>

            {/* Timer Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-amber-500/40 text-amber-400 font-mono text-base font-bold shadow-lg shadow-amber-500/10">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
              <span>Time Remaining: {timeString}</span>
            </div>
          </div>

          {/* Question Stepper */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {FINAL_TEST_QUESTIONS.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all shrink-0 flex items-center justify-center ${
                    isCurrent
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg ring-2 ring-cyan-400'
                      : isAnswered
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Display */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 mb-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                QUESTION #{currentQIndex + 1} OF {totalQuestions} • {currentQ.category}
              </span>
              <span className="text-xs text-slate-400">Select one correct answer</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {currentQ.codeSnippet && (
              <pre className="p-4 rounded-xl bg-[#05070c] border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
                {currentQ.codeSnippet}
              </pre>
            )}

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`p-4 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-900/60 to-cyan-900/60 border-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentQIndex === 0}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 disabled:opacity-40"
            >
              Previous Question
            </button>

            {currentQIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all flex items-center gap-1.5"
              >
                Next Question
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishTest}
                className="px-8 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/25 hover:brightness-110 transition-all flex items-center gap-2"
                id="finish-final-test-btn"
              >
                <Trophy className="w-4 h-4" />
                Submit Final Test
              </button>
            )}
          </div>
        </div>
      ) : (
        /* TEST RESULTS REPORT PAGE */
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-xl shadow-amber-500/20">
              <Award className="w-10 h-10" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-block mb-3">
              FINAL TEST COMPLETED
            </span>

            <h2 className="text-3xl font-black text-white mb-2">Final Exam Score: {score} / {totalQuestions}</h2>
            <div className="text-2xl font-mono font-bold text-amber-400 mb-6">{passScorePercent}% Score</div>

            {isPassed ? (
              <div className="max-w-xl mx-auto p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 space-y-2">
                <h3 className="text-lg font-bold text-emerald-300 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Congratulations! You passed the C Fundamentals Expert Test.
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You have demonstrated solid mastery across C foundation, operators, logic, loops, arrays, and problem solving. You earned the <strong className="text-amber-400">C Fundamentals Expert Badge</strong>!
                </p>
              </div>
            ) : (
              <div className="max-w-xl mx-auto p-6 rounded-2xl bg-amber-950/40 border border-amber-800/80 space-y-2">
                <h3 className="text-lg font-bold text-amber-300 flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  Keep Practicing! Your progress is saved.
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You scored under 80%. Review the topics where you missed answers and retake the practice missions to build confidence!
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentView('topics')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
              >
                Review Topics
              </button>
              <button
                onClick={() => {
                  setTestFinished(false);
                  setUserAnswers({});
                  setTimeLeft(90 * 60);
                  setCurrentQIndex(0);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700"
              >
                Retake Exam
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white">Question Review & Explanations</h3>

            <div className="space-y-4">
              {FINAL_TEST_QUESTIONS.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctOptionIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border text-xs font-mono space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-800/50 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>Q{idx + 1}: {q.category}</span>
                      <span>{isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}</span>
                    </div>

                    <p className="font-sans text-slate-200 text-sm font-semibold">{q.question}</p>

                    <div className="text-[11px] font-sans text-slate-400 border-t border-slate-800 pt-2 mt-2">
                      <span className="font-bold text-slate-300 block mb-0.5">Explanation:</span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
