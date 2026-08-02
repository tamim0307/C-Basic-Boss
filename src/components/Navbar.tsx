import React, { useState } from 'react';
import { Terminal, BookOpen, Trophy, User as UserIcon, LogOut, Menu, X, Sparkles, HelpCircle, Info, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { user, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-1 transition-all"
          id="navbar-logo-btn"
        >
          <div className="w-8 h-8 bg-cyan-400 text-slate-950 rounded-lg flex items-center justify-center font-black italic shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-105 transition-transform text-lg">
            C
          </div>
          <div className="text-left">
            <div className="font-mono text-base font-extrabold tracking-wider text-white leading-none">
              C BASIC BOSS
            </div>
            <div className="uppercase tracking-[0.2em] text-[9px] text-slate-400 font-mono font-semibold block mt-0.5">
              Master C Fundamentals
            </div>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => navigate('home')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              currentView === 'home'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate('topics')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              currentView === 'topics'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            C Topics
          </button>
          <button
            onClick={() => navigate('how-it-works')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              currentView === 'how-it-works'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => navigate('final-test')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center gap-1.5 ${
              currentView === 'final-test'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40'
                : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Expert Test
          </button>
          <button
            onClick={() => navigate('about')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              currentView === 'about'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            About
          </button>
          <button
            onClick={() => navigate('support')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              currentView === 'support'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Support
          </button>
        </nav>

        {/* Right Action Menu */}
        <div className="flex items-center gap-3">
          {user && profile ? (
            <div className="relative">
              <div className="flex items-center gap-2">
                {/* Points Pill */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-400 font-mono text-xs font-bold shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{profile.progress?.totalPoints || 0} pts</span>
                </div>

                {/* Dashboard Shortcut */}
                <button
                  onClick={() => navigate('dashboard')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/40 hover:bg-blue-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>

                {/* User Dropdown Trigger */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  id="user-profile-dropdown-btn"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
                    <p className="text-xs text-slate-400 truncate">{profile.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('dashboard')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    Student Dashboard
                  </button>
                  <button
                    onClick={() => navigate('profile')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    My Progress & Profile
                  </button>
                  <button
                    onClick={() => navigate('topics')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    Explore C Topics
                  </button>
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate('home');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('login')}
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
                id="login-btn"
              >
                Login
              </button>
              <button
                onClick={() => navigate('signup')}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                id="signup-btn"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar / Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-2">
          <button
            onClick={() => navigate('home')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            Home
          </button>
          <button
            onClick={() => navigate('topics')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            C Topic Explorer
          </button>
          <button
            onClick={() => navigate('how-it-works')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            How It Works
          </button>
          <button
            onClick={() => navigate('final-test')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-500/10 flex items-center gap-2"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Final Expert Test
          </button>
          <button
            onClick={() => navigate('about')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Info className="w-4 h-4 text-slate-400" />
            About
          </button>
          <button
            onClick={() => navigate('support')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            Support
          </button>
        </div>
      )}
    </header>
  );
};
