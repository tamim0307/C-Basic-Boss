import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, ArrowRight, Clock, AlertCircle, Award, HelpCircle, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ENRICHED_TOPICS } from '../data/topicDataEnricher';

interface TopicCompletionViewProps {
  topicId: number;
  setCurrentView: (view: string) => void;
  setSelectedTopicId: (topicId: number) => void;
}

export const TopicCompletionView: React.FC<TopicCompletionViewProps> = ({
  topicId,
  setCurrentView,
  setSelectedTopicId,
}) => {
  const { recordTopicCompletion, recordSkillCheckPassed } = useAuth();
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // 120 Seconds Countdown Timer
  const [timeLeft, setTimeLeft] = useState<number>(120);

  const topic = ENRICHED_TOPICS.find((t) => t.id === topicId) || ENRICHED_TOPICS[0];
  const questions = topic.skillCheckQuestions || [];

  // Countdown Effect
  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitSkillCheck();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, userAnswers]);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitSkillCheck = async () => {
    if (submitted) return;

    let calculated = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctOptionIndex) {
        calculated++;
      }
    });

    setScore(calculated);
    setSubmitted(true);

    const passPercentage = questions.length > 0 ? (calculated / questions.length) * 100 : 0;
    if (passPercentage >= 80) {
      await recordTopicCompletion(topic.id);
      await recordSkillCheckPassed(topic.id);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const timeUsed = 120 - timeLeft;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-center shadow-2xl mb-8 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-lg shadow-amber-500/10">
          <Trophy className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-block mb-2">
          TOPIC #{topic.id} EXPERT TEST
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{topic.name} Expert Test</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          30 MCQs • 120 Seconds Timer. Pass with 80%+ score to earn Topic Mastery & Points!
        </p>

        {/* Live Countdown Clock Bar */}
        {!submitted && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  timeLeft <= 30
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Time Remaining</span>
                <span
                  className={`font-mono text-xl font-extrabold ${
                    timeLeft <= 30 ? 'text-rose-400' : 'text-cyan-400'
                  }`}
                >
                  {formatTime(timeLeft)} ({timeLeft}s)
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Answered Questions</span>
              <span className="font-mono text-sm font-bold text-slate-200">
                {Object.keys(userAnswers).length} / {questions.length} Questions
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 30 MCQ Questions Form */}
      <div className="space-y-6 mb-8">
        {questions.map((q, qIdx) => {
          const isAnswered = userAnswers[qIdx] !== undefined;
          const userChoice = userAnswers[qIdx];
          const isCorrect = submitted && userChoice === q.correctOptionIndex;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl bg-slate-900 border transition-all shadow-xl space-y-4 ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-rose-500/50 bg-rose-950/10'
                  : isAnswered
                  ? 'border-cyan-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl border font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                      submitted
                        ? isCorrect
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : isAnswered
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Q{qIdx + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{q.question}</h3>
                </div>

                {submitted && (
                  <div>
                    {isCorrect ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Correct
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        <X className="w-3 h-3" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {q.codeSnippet && (
                <pre className="p-3 rounded-xl bg-[#05070c] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                  {q.codeSnippet}
                </pre>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (submitted) {
                    if (optIdx === q.correctOptionIndex) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && optIdx !== q.correctOptionIndex) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
                    } else {
                      btnStyle = 'bg-slate-950/60 border-slate-900 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-cyan-950/90 border-cyan-500 text-white font-bold ring-1 ring-cyan-400';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isSelected && !submitted && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans mt-2">
                  <span className="font-bold text-cyan-400 block mb-0.5 font-mono uppercase text-[10px]">
                    Concept Explanation:
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit or Results Summary */}
      {!submitted ? (
        <div className="sticky bottom-6 z-30 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300 font-mono">
            Answered: <span className="text-cyan-400 font-bold">{Object.keys(userAnswers).length}</span> of {questions.length} MCQs
          </div>
          <button
            onClick={handleSubmitSkillCheck}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all border border-cyan-400/30 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            id="submit-skill-check-btn"
          >
            Submit Expert Test ({questions.length} MCQs)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm font-bold text-cyan-400">
              Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm font-bold text-slate-300">
              Time Taken: {formatTime(timeUsed)}
            </div>
          </div>

          {(score / questions.length) * 100 >= 80 ? (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Congratulations! Topic Mastered!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                You passed the Expert Test with {Math.round((score / questions.length) * 100)}% accuracy! Your topic completion bonus and Topic Badge have been recorded in your profile!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/20">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Keep Practicing!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                You scored {Math.round((score / questions.length) * 100)}%. Pass mark is 80%+. Review your wrong answers above and try again!
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setUserAnswers({});
                setTimeLeft(120);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 transition-all"
            >
              Retake Expert Test (120s)
            </button>
            <button
              onClick={() => setCurrentView('topics')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
            >
              Choose Another Topic
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
