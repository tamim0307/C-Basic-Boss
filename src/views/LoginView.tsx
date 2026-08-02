import React, { useState } from 'react';
import { Terminal, Lock, Mail, AlertCircle, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginViewProps {
  setCurrentView: (view: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ setCurrentView }) => {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      setCurrentView('dashboard');
    } catch (err: any) {
      const code = err.code || '';
      if (code.includes('user-not-found')) {
        setError('No user account found with this email.');
      } else if (code.includes('wrong-password') || code.includes('invalid-credential')) {
        setError('Incorrect password. Please try again or reset your password.');
      } else if (code.includes('invalid-email')) {
        setError('Invalid email address format.');
      } else {
        setError(err.message || 'Login failed. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    try {
      await resetPassword(resetEmail);
      setResetMessage(`Password reset link sent to ${resetEmail}. Check your inbox.`);
    } catch (err: any) {
      setResetMessage(`Failed to send reset link: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-[2px] mb-3 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Terminal className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to continue your C practice progress.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(true);
                  setResetEmail(email);
                }}
                className="text-[11px] text-cyan-400 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            id="login-submit-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          Don't have an account yet?{' '}
          <button
            onClick={() => setCurrentView('signup')}
            className="text-cyan-400 font-bold hover:underline ml-1"
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your account email to receive a password reset link.
            </p>

            {resetMessage && (
              <div className="mb-4 p-2.5 rounded-lg bg-blue-950/60 border border-blue-800 text-blue-300 text-xs">
                {resetMessage}
              </div>
            )}

            <form onSubmit={handleSendReset} className="space-y-3">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
