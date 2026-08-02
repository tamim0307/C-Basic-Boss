import React from 'react';
import { BookOpen, Layers, Terminal, Zap, Code2, Trophy, ArrowRight } from 'lucide-react';

interface HowItWorksViewProps {
  setCurrentView: (view: string) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ setCurrentView }) => {
  const steps = [
    {
      num: '01',
      title: 'Learn C Anywhere',
      desc: 'Attend your university class, watch a YouTube video, or read a book chapter on a specific C topic (e.g. for loops or arrays).',
      icon: BookOpen,
    },
    {
      num: '02',
      title: 'Choose Your Topic in C Basic Boss',
      desc: 'Open C Basic Boss and select the matching topic from our 50 structured C topics. No locked topics!',
      icon: Layers,
    },
    {
      num: '03',
      title: 'Solve Structured Missions',
      desc: 'Tackle 10-15 missions ranging from Easy to Challenge problems. Code directly in the browser editor.',
      icon: Terminal,
    },
    {
      num: '04',
      title: 'Use 3-Tier Hints When Stuck',
      desc: 'If stuck, open Hint 1 for a small clue, Hint 2 for a stronger clue, or Hint 3 for near-solution guidance.',
      icon: Zap,
    },
    {
      num: '05',
      title: 'Study Line-by-Line Solutions',
      desc: 'Compare your code with the full correct solution. Read Bangla conceptual explanations and line breakdowns.',
      icon: Code2,
    },
    {
      num: '06',
      title: 'Earn Badges & Take Final Test',
      desc: 'Earn points, unlock topic badges, pass the Topic Skill Check, and certify your skills with the 90-min Final Expert Test!',
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          How It Works
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          The step-by-step roadmap to building independent C programming problem-solving skills.
        </p>
      </div>

      <div className="space-y-6 mb-12">
        {steps.map((s) => (
          <div
            key={s.num}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 font-mono text-xl font-extrabold shrink-0">
              {s.num}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => setCurrentView('topics')}
          className="px-8 py-4 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl hover:brightness-110 transition-all inline-flex items-center gap-2"
        >
          Start Practicing Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
