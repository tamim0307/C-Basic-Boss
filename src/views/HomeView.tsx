import React from 'react';
import { Terminal, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, BookOpen, Code2, Trophy, HelpCircle, Layers, Cpu, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/topicsData';

interface HomeViewProps {
  setCurrentView: (view: string) => void;
  setSelectedTopicId: (topicId: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentView, setSelectedTopicId }) => {
  const { user } = useAuth();

  const handleStartPracticing = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800/60">
        {/* Subtle Background Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-transparent blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-6 shadow-xl shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Learn Anywhere. Practice Here. Master C.
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight font-sans">
            Become Strong in C Programming Through{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Structured Practice.
            </span>
          </h1>

          {/* Hero Mission Description */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Learn C from university classes, YouTube, or books — then come here to practice what you learned. Solve structured missions, understand your mistakes with Bangla explanations, and build real C problem-solving confidence.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartPracticing}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all border border-cyan-400/30 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              id="hero-start-btn"
            >
              Start Practicing Free
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setCurrentView('topics')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 transition-all active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              id="hero-explore-btn"
            >
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Explore 50 C Topics
            </button>
          </div>
        </div>
      </section>

      {/* SECTION A: How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">How C Basic Boss Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            A simple 6-step practice system designed to turn passive watching into active problem-solving mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Learn C Anywhere',
              desc: 'Study your C lectures from university, YouTube tutorials, or books.',
              icon: BookOpen,
            },
            {
              step: '02',
              title: 'Choose a C Topic',
              desc: 'Select any topic you learned today — printf, loops, arrays, strings, or math.',
              icon: Layers,
            },
            {
              step: '03',
              title: 'Solve Practice Missions',
              desc: 'Tackle 10-15 structured missions per topic ranging from Easy to Challenge.',
              icon: Terminal,
            },
            {
              step: '04',
              title: 'Use 3-Tier Hints',
              desc: 'Stuck on logic? Get a small clue, a stronger clue, or a near-solution hint.',
              icon: Zap,
            },
            {
              step: '05',
              title: 'Study Detailed Solutions',
              desc: 'Read line-by-line C code explanations written in clear Bangla & English terms.',
              icon: Code2,
            },
            {
              step: '06',
              title: 'Build Real C Skills',
              desc: 'Track points, earn topic badges, and pass the Final Expert Test!',
              icon: Trophy,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-mono text-2xl font-black text-slate-700 group-hover:text-cyan-500/40 transition-colors">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION B: Why C Basic Boss */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Why Practice Here?</h2>
            <p className="text-slate-400 text-sm">Everything built specifically for C programming foundation excellence.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Practice by Topic', desc: 'Jump directly to the topic you studied today without locked levels.' },
              { title: 'Easy to Hard Missions', desc: 'Gradually builds confidence from Hello World to complex arrays.' },
              { title: 'Helpful 3-Tier Hints', desc: 'Clues that guide your thinking without giving away the answer.' },
              { title: 'Line-by-Line Explanations', desc: 'Understand every printf, scanf, loop, and variable in detail.' },
              { title: 'Clear Bangla Language', desc: 'Concept explanations in Bangla alongside English programming terms.' },
              { title: 'Progress Auto-Saving', desc: 'Saved securely in Firebase Realtime DB across all your devices.' },
              { title: 'Skill Check & Badges', desc: 'Prove topic mastery with unseen tests and earn achievement badges.' },
              { title: 'Final Expert Test', desc: '90-minute 20-problem exam to certify your C Fundamentals.' },
            ].map((feature, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{feature.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION C: Practice Preview Card */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Practice Preview</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Here is a sample problem card from Topic #19: if-else Statements.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                TOPIC 19 • MISSION 1
              </span>
              <h3 className="text-lg font-bold text-white">Even or Odd Number Checker</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Easy • 10 Points
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            Read an integer from standard input. If the number is even, print <code className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300">Even</code>. Otherwise, print <code className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300">Odd</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs mb-6">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">Example Input:</span>
              <span className="text-slate-200">14</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">Example Output:</span>
              <span className="text-emerald-400">Even</span>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedTopicId(19);
              setCurrentView('practice');
            }}
            className="w-full py-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 transition-all flex items-center justify-center gap-2"
          >
            Try This Problem Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION D: Topic Categories Preview */}
      <section className="py-16 bg-slate-950/40 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">9 Comprehensive C Categories</h2>
              <p className="text-slate-400 text-sm">Covering all C fundamentals across 50 topics.</p>
            </div>
            <button
              onClick={() => setCurrentView('topics')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-cyan-400 border border-cyan-500/40 hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              View All 50 Topics
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <div
                key={cat.id}
                onClick={() => setCurrentView('topics')}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                      Category #{cat.id}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{cat.description}</p>
                <span className="text-xs font-semibold text-cyan-400/90 flex items-center gap-1">
                  {cat.topicIds.length} Practice Topics →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Master C Fundamentals?</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Create your free account to track your progress, save completed missions, earn achievement badges, and take the C Basic Expert Test.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl hover:brightness-110 transition-all border border-cyan-400/30"
            >
              Create Free Account
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
            >
              Login to Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
