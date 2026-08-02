import React from 'react';
import { Terminal, Shield, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-cyan-400 text-slate-950 rounded flex items-center justify-center font-black italic shadow-[0_0_15px_rgba(34,211,238,0.5)] text-lg">
                C
              </div>
              <div>
                <span className="font-mono text-base font-extrabold text-white tracking-wider block leading-none">
                  C BASIC BOSS
                </span>
                <span className="uppercase tracking-[0.2em] text-[9px] text-slate-500 font-mono font-semibold block mt-0.5">
                  Master C Fundamentals
                </span>
              </div>
            </div>
            <p className="text-cyan-400 text-xs font-semibold mb-2">"Learn Anywhere. Practice Here. Master C."</p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Designed for students learning C programming in university, YouTube, or books who want to build real problem-solving confidence through structured practice.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-cyan-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('topics')} className="hover:text-cyan-400 transition-colors">
                  C Topic Explorer
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('how-it-works')} className="hover:text-cyan-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('final-test')} className="hover:text-amber-400 transition-colors text-amber-400/90 font-medium">
                  Final Expert Test
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Platform */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest mb-3">Platform & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('about')} className="hover:text-cyan-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('support')} className="hover:text-cyan-400 transition-colors">
                  Support & FAQ
                </button>
              </li>
              <li>
                <span className="text-slate-500">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-500">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Immersive UI Bottom Status Bar */}
      <div className="h-12 border-t border-slate-800 flex flex-wrap items-center justify-between px-4 sm:px-8 bg-slate-950 text-[10px] font-mono text-slate-500 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:inline">Server: learn-project-dca72-default-rtdb</span>
        </div>
        <p className="hidden md:block text-slate-500">
          © {new Date().getFullYear()} C BASIC BOSS • Do not just learn C. Practice until you solve problems independently.
        </p>
        <div className="flex items-center gap-2 text-cyan-400/80 font-bold">
          <span>V 2.0.4 — Build Stable</span>
        </div>
      </div>
    </footer>
  );
};
