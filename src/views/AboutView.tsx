import React from 'react';
import { Terminal, Target, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  setCurrentView: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setCurrentView }) => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-[2px] mx-auto mb-4 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Terminal className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          About C BASIC BOSS
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          The practice-first platform designed to bridge the gap between learning C syntax and solving real problems independently.
        </p>
      </div>

      {/* Main Mission Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-12 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-cyan-400" />
          Our Mission & Promise
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Many students watch hours of C programming videos or attend university lectures, yet struggle when opened with a blank code editor. <strong>C BASIC BOSS does not try to replace your course or teacher.</strong> Instead, it provides the dedicated practice environment you need after learning a topic.
        </p>
        <blockquote className="p-4 rounded-xl bg-cyan-950/40 border-l-4 border-cyan-400 text-cyan-200 text-sm italic font-medium">
          "Do not just learn C. Practice until you can solve problems independently."
        </blockquote>
      </div>

      {/* 4 Pillars of C Basic Boss */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {[
          {
            title: '1. Topic-Based Freedom',
            desc: 'Choose any C topic you learned today. No locked progression or artificial day-by-day barriers.',
          },
          {
            title: '2. 3-Tier Guided Hints',
            desc: 'Never get completely stuck. Get clues that guide your thinking step by step.',
          },
          {
            title: '3. Bangla Explanations',
            desc: 'Conceptual explanations written in clear Bangla paired with standard English C terms.',
          },
          {
            title: '4. Real Skill Verification',
            desc: 'Validate retention with unseen Topic Skill Checks and the 20-problem Final Expert Test.',
          },
        ].map((pillar, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-white mb-1">{pillar.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center p-8 rounded-3xl bg-slate-950 border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-2">Ready to Start Practicing?</h3>
        <p className="text-xs text-slate-400 mb-6">Select any of the 50 C practice topics now.</p>
        <button
          onClick={() => setCurrentView('topics')}
          className="px-8 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg inline-flex items-center gap-2"
        >
          Explore C Topics
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
