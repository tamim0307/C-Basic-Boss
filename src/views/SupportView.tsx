import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2 } from 'lucide-react';

export const SupportView: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How do I start practicing C programming?',
      a: 'Go to C Topic Explorer, pick any topic you have studied recently (such as printf, variables, if-else, or loops), and click "Start Practice" to open its practice missions.',
    },
    {
      q: 'How is my progress saved?',
      a: 'Your progress (solved problems, points, completed topics, earned badges) is automatically synced in real time to your account in Firebase Realtime Database. If you log in from a phone or another laptop, your progress will be restored automatically.',
    },
    {
      q: 'How do hints work?',
      a: 'Every problem has a 3-tier hint system. Click "Need Hint?" to unlock Hint Level 1 (small clue). If you need more help, click again for Level 2 (stronger clue) or Level 3 (near-solution explanation). Solving without hints awards bonus points!',
    },
    {
      q: 'Are solutions available for every problem?',
      a: 'Yes! Click "View Full Solution" on any practice problem to view the complete C code, line-by-line breakdown, and conceptual explanation in clear Bangla.',
    },
    {
      q: 'What is the Final C Basic Expert Test?',
      a: 'The Final Test contains 20 mixed C questions covering all categories with a 90-minute timer. Scoring 80%+ awards the C Fundamentals Expert Badge on your profile!',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Support & Frequently Asked Questions
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Need help navigating C Basic Boss? Find quick answers below or drop us a message.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          Frequently Asked Questions
        </h2>

        {faqs.map((faq, idx) => {
          const isOpen = openFaqIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left text-sm font-bold text-white flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {isOpen && (
                <div className="p-5 pt-0 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 leading-relaxed bg-slate-950/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support Contact Form */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-2">Have a Question or Feedback?</h2>
        <p className="text-xs text-slate-400 mb-6">
          Send your inquiry or suggestion to our education team.
        </p>

        {formSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Thank you for reaching out!</h3>
            <p className="text-xs text-slate-300">
              Your message has been logged locally. (Support form API integration can be added in future updates.)
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahat Ahmed"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message / Question</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about a problem, request a feature, or report a issue..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Note: Support form integration can be added later.
            </p>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Support Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
