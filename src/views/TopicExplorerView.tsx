import React, { useState } from 'react';
import { Search, CheckCircle2, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/topicsData';
import { ENRICHED_TOPICS } from '../data/topicDataEnricher';

interface TopicExplorerViewProps {
  setCurrentView: (view: string) => void;
  setSelectedTopicId: (topicId: number) => void;
}

export const TopicExplorerView: React.FC<TopicExplorerViewProps> = ({
  setCurrentView,
  setSelectedTopicId,
}) => {
  const { user, profile, openAuthModal } = useAuth();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const prog = profile?.progress || {
    completedTopics: [],
    topicProgress: {},
  };

  const filteredTopics = ENRICHED_TOPICS.filter((t) => {
    const matchesCategory = selectedCategoryId === 'all' || t.categoryId === selectedCategoryId;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTopic = (topicId: number) => {
    if (!user) {
      openAuthModal('C topic-এ practice করার জন্য প্রথমে Sign Up বা Log In করুন!');
      return;
    }
    setSelectedTopicId(topicId);
    setCurrentView('topic-detail');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          50 C Practice Topics
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
          Choose What You Want to Practice
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          Select any C topic you have already learned in class or online. Topics are not locked — jump straight to what you studied today!
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              selectedCategoryId === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            All Categories (50)
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                selectedCategoryId === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or concept..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const tpInfo = prog.topicProgress[topic.id] || { solvedCount: 0, isCompleted: false };
          const isCompleted = prog.completedTopics.includes(topic.id) || tpInfo.isCompleted;
          const isInProgress = tpInfo.solvedCount > 0 && !isCompleted;

          const progressPercent = Math.round((tpInfo.solvedCount / topic.problems.length) * 100);

          let statusBadge = (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
              Not Started
            </span>
          );
          let btnText = 'Start Practice';

          if (isCompleted) {
            statusBadge = (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </span>
            );
            btnText = 'Review Topic';
          } else if (isInProgress) {
            statusBadge = (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                In Progress
              </span>
            );
            btnText = 'Continue Practice';
          }

          return (
            <div
              key={topic.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Header Info */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Topic #{topic.id}
                  </span>
                  {statusBadge}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                  {topic.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {topic.shortDescription}
                </p>

                {/* Topic Metadata */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3 mb-4">
                  <span>{topic.problems.length} Missions</span>
                  <span>{topic.difficultyRange}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>Progress ({tpInfo.solvedCount}/{topic.problems.length})</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Practice Button */}
              <button
                onClick={() => handleSelectTopic(topic.id)}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                  isCompleted
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110'
                }`}
              >
                {btnText}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
