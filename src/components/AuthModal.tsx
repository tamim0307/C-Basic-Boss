import React from 'react';
import { Lock, UserPlus, LogIn, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  setCurrentView: (view: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ setCurrentView }) => {
  const { isAuthModalOpen, closeAuthModal, authModalMessage } = useAuth();

  if (!isAuthModalOpen) return null;

  const handleAction = (view: 'login' | 'signup') => {
    closeAuthModal();
    setCurrentView(view);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
            <Lock className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
            Sign Up or Log In Required
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            C Practice করার জন্য Sign Up করুন!
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-sm">
            {authModalMessage ||
              'Learning and practicing C topics requires an account. Log in or create a free account to solve missions, save progress, and take topic expert tests!'}
          </p>
        </div>

        {/* Key Benefits List */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300 font-sans">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Track completed C practice missions</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Take 30-MCQ Topic Expert Tests with 120s timer</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sync profile progress with Firebase Realtime DB</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleAction('signup')}
            className="w-full py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all border border-cyan-400/30 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Create Free Account (Sign Up)
          </button>
          <button
            onClick={() => handleAction('login')}
            className="w-full py-3.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-cyan-400" />
            Already Have an Account? Log In
          </button>
        </div>
      </div>
    </div>
  );
};
