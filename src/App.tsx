import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Views
import { HomeView } from './views/HomeView';
import { SignUpView } from './views/SignUpView';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { TopicExplorerView } from './views/TopicExplorerView';
import { TopicDetailView } from './views/TopicDetailView';
import { PracticeView } from './views/PracticeView';
import { TopicCompletionView } from './views/TopicCompletionView';
import { ProfileView } from './views/ProfileView';
import { FinalTestView } from './views/FinalTestView';
import { AboutView } from './views/AboutView';
import { HowItWorksView } from './views/HowItWorksView';
import { SupportView } from './views/SupportView';
import { NotFoundView } from './views/NotFoundView';

const PROTECTED_VIEWS = ['dashboard', 'topic-detail', 'practice', 'topic-completion', 'profile', 'final-test'];

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedTopicId, setSelectedTopicId] = useState<number>(1);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('p1_1');

  const { user, toastMessage, openAuthModal } = useAuth();

  // Enforce Sign Up / Login Gate for protected views
  useEffect(() => {
    if (!user && PROTECTED_VIEWS.includes(currentView)) {
      setCurrentView('login');
      openAuthModal('C practice করার জন্য প্রথমে Sign Up বা Log In করতে হবে।');
    }
  }, [currentView, user]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView setCurrentView={setCurrentView} setSelectedTopicId={setSelectedTopicId} />;
      case 'signup':
        return <SignUpView setCurrentView={setCurrentView} />;
      case 'login':
        return <LoginView setCurrentView={setCurrentView} />;
      case 'dashboard':
        return <DashboardView setCurrentView={setCurrentView} setSelectedTopicId={setSelectedTopicId} />;
      case 'topics':
        return <TopicExplorerView setCurrentView={setCurrentView} setSelectedTopicId={setSelectedTopicId} />;
      case 'topic-detail':
        return (
          <TopicDetailView
            topicId={selectedTopicId}
            setCurrentView={setCurrentView}
            setSelectedTopicId={setSelectedTopicId}
            setSelectedProblemId={setSelectedProblemId}
          />
        );
      case 'practice':
        return (
          <PracticeView
            topicId={selectedTopicId}
            problemId={selectedProblemId}
            setCurrentView={setCurrentView}
            setSelectedTopicId={setSelectedTopicId}
          />
        );
      case 'topic-completion':
        return (
          <TopicCompletionView
            topicId={selectedTopicId}
            setCurrentView={setCurrentView}
            setSelectedTopicId={setSelectedTopicId}
          />
        );
      case 'profile':
        return <ProfileView setCurrentView={setCurrentView} />;
      case 'final-test':
        return <FinalTestView setCurrentView={setCurrentView} />;
      case 'about':
        return <AboutView setCurrentView={setCurrentView} />;
      case 'how-it-works':
        return <HowItWorksView setCurrentView={setCurrentView} />;
      case 'support':
        return <SupportView />;
      default:
        return <NotFoundView setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Immersive UI Background Atmosphere Radial Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1">{renderView()}</main>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-cyan-500/50 text-white font-mono text-xs shadow-2xl shadow-cyan-500/20 animate-in slide-in-from-bottom-5 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Auth Modal */}
      <AuthModal setCurrentView={setCurrentView} />

      <Footer setCurrentView={setCurrentView} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
