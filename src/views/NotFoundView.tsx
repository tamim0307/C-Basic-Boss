import React from 'react';
import { Terminal, ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  setCurrentView: (view: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ setCurrentView }) => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto mb-4 font-mono font-bold text-xl">
          404
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Segmentation Fault: Page Not Found</h1>
        <p className="text-xs text-slate-400 mb-6 font-mono">
          Error 404: The pointer referenced an invalid view state in memory.
        </p>

        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Safety (Homepage)
        </button>
      </div>
    </div>
  );
};
