import React, { useState } from 'react';
import { Play, CheckCircle, RotateCcw, Copy, Check, Terminal as TerminalIcon, AlertCircle, Info } from 'lucide-react';
import { TestCase } from '../types';
import { evaluateCCode, EvaluationResult } from '../lib/cEvaluator';

interface CodeEditorProps {
  initialCode: string;
  testCases: TestCase[];
  onCheckSuccess?: (usedHintsCount: number) => void;
  hintsUsedCount: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  testCases,
  onCheckSuccess,
  hintsUsedCount,
}) => {
  const [code, setCode] = useState(initialCode || '');
  const [activeTab, setActiveTab] = useState<'terminal' | 'testcases'>('terminal');
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  React.useEffect(() => {
    setCode(initialCode || '');
    setEvalResult(null);
  }, [initialCode]);

  const handleRunCode = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const res = evaluateCCode(code || '', testCases || []);
      setEvalResult(res);
      setActiveTab('terminal');
      setIsEvaluating(false);
    }, 150);
  };

  const handleCheckAnswer = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const res = evaluateCCode(code || '', testCases || []);
      setEvalResult(res);
      setActiveTab('testcases');
      setIsEvaluating(false);

      if (res.success && onCheckSuccess) {
        onCheckSuccess(hintsUsedCount);
      }
    }, 200);
  };

  const handleReset = () => {
    setCode(initialCode || '');
    setEvalResult(null);
  };

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code || '');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = (code || '').split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col font-mono text-sm">
      {/* Editor Header */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-semibold text-slate-300 ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            main.c
          </span>
        </div>

        {/* Editor Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-all text-xs flex items-center gap-1"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-all text-xs flex items-center gap-1"
            title="Reset Starter Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Code Input Area with Line Numbers */}
      <div className="relative min-h-[260px] max-h-[420px] overflow-auto flex bg-[#070a12]">
        {/* Line Numbers Column */}
        <div className="select-none py-3 px-3 text-right text-slate-600 bg-[#05070d] border-r border-slate-800/60 text-xs font-mono leading-6 min-w-[40px]">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full min-h-[260px] p-3 bg-transparent text-slate-100 font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/30 selection:text-white"
          placeholder="// Write your C code here..."
        />
      </div>

      {/* Action Buttons Bar */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Practice Mode Notice Badge */}
        <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/90 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-full">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Browser practice mode active. Answer checked against test cases.</span>
        </div>

        {/* Execution Buttons */}
        <div className="flex items-center gap-2.5 ml-auto">
          <button
            onClick={handleRunCode}
            disabled={isEvaluating}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all active:scale-95 flex items-center gap-1.5 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            id="run-code-btn"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            Run Code
          </button>
          <button
            onClick={handleCheckAnswer}
            disabled={isEvaluating}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all border border-cyan-400/30 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            id="check-answer-btn"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            Check Answer
          </button>
        </div>
      </div>

      {/* Execution Results Terminal Panel */}
      {evalResult && (
        <div className="bg-slate-950 border-t border-slate-800 p-4 animate-in fade-in duration-200">
          {/* Output Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-2 mb-3">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'terminal'
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              Terminal Output
            </button>
            <button
              onClick={() => setActiveTab('testcases')}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'testcases'
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Test Cases ({evalResult.testCaseResults.filter((t) => t.passed).length}/{evalResult.testCaseResults.length})
            </button>
          </div>

          {/* Compilation Error Notice */}
          {evalResult.compilationError && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs font-mono space-y-1 mb-3">
              <div className="flex items-center gap-1.5 font-bold text-rose-400">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Compilation / Syntax Error
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed">{evalResult.compilationError}</pre>
            </div>
          )}

          {/* Tab Content: Terminal */}
          {activeTab === 'terminal' && (
            <div className="bg-[#05070c] rounded-xl p-3 border border-slate-800 font-mono text-xs text-emerald-400 leading-relaxed min-h-[80px]">
              {evalResult.stdout ? (
                <pre className="whitespace-pre-wrap">{evalResult.stdout}</pre>
              ) : (
                <span className="text-slate-500 italic">Program finished with output code 0 (No stdout generated).</span>
              )}
            </div>
          )}

          {/* Tab Content: Test Cases */}
          {activeTab === 'testcases' && (
            <div className="space-y-2">
              {evalResult.testCaseResults.map((tc, idx) => (
                <div
                  key={tc.testCaseId}
                  className={`p-3 rounded-xl border text-xs font-mono transition-all ${
                    tc.passed
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      {tc.passed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                      Test Case #{idx + 1}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        tc.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {tc.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>

                  {/* Expected vs Actual Output Details */}
                  {!tc.passed && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-rose-900/40">
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">Expected Output:</span>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-200">
                          {tc.expectedOutput || '(empty)'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">Your Output:</span>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800 text-rose-200">
                          {tc.actualOutput || '(empty)'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
