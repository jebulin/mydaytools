import React, { useState, useEffect } from 'react';
import { DiffViewer } from '../components/DiffViewer';
import { DiffMethod } from '../types';
import {
  ArrowRightLeft,
  Sparkles,
  Trash2,
  AlignLeft,
  Type,
  FileText,
  Copy
} from 'lucide-react';

const TextCompareHome: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>('');
  const [modifiedText, setModifiedText] = useState<string>('');
  const [diffMethod, setDiffMethod] = useState<DiffMethod>(DiffMethod.Words);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Clear analysis when text changes to avoid stale data
  useEffect(() => {
    if (aiSummary) setAiSummary(null);
  }, [originalText, modifiedText]);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear both text fields?")) {
      setOriginalText('');
      setModifiedText('');
      setAiSummary(null);
    }
  };

  const handleAnalyze = async () => {
    if (!originalText && !modifiedText) return;
    setIsAnalyzing(true);
    // const result = await analyzeDifferences(originalText, modifiedText);
    // setAiSummary(result);
    setIsAnalyzing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Sample data for quick testing
  const loadSampleData = () => {
    setOriginalText(`The quick brown fox jumps over the lazy dog.\nThis is a simple text comparison tool.\nIt is very useful for developers.`);
    setModifiedText(`The quick red fox jumped over the lazy dog.\nThis is an advanced text comparison web app.\nIt is extremely useful for developers and writers.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">TextDiff AI</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setDiffMethod(DiffMethod.Words)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${diffMethod === DiffMethod.Words ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Words
              </button>
              <button
                onClick={() => setDiffMethod(DiffMethod.Chars)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${diffMethod === DiffMethod.Chars ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Chars
              </button>
              <button
                onClick={() => setDiffMethod(DiffMethod.Lines)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${diffMethod === DiffMethod.Lines ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Lines
              </button>
            </div>

            <button
              onClick={loadSampleData}
              className="text-sm text-slate-500 hover:text-indigo-600 font-medium hidden sm:block"
            >
              Load Sample
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Left Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600 flex justify-between items-center">
              Original Text
              <button onClick={() => copyToClipboard(originalText)} className="text-slate-400 hover:text-indigo-600" title="Copy">
                <Copy className="w-4 h-4" />
              </button>
            </label>
            <textarea
              className="w-full h-48 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm resize-none font-mono text-sm transition-all"
              placeholder="Paste original text here..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
            />
          </div>

          {/* Right Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600 flex justify-between items-center">
              Modified Text
              <button onClick={() => copyToClipboard(modifiedText)} className="text-slate-400 hover:text-indigo-600" title="Copy">
                <Copy className="w-4 h-4" />
              </button>
            </label>
            <textarea
              className="w-full h-48 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm resize-none font-mono text-sm transition-all"
              placeholder="Paste modified text here..."
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
            />
          </div>
        </div>

        {/* Action Bar (Sticky on mobile bottom, normal on desktop) */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-200 sticky top-20 z-10 bg-slate-50/95 backdrop-blur-sm p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">Comparison Result</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 hidden sm:inline-block">Auto-updates</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>

          </div>
        </div>

        {/* Diff Output Section */}
        <div className="flex-1 min-h-[400px]">
          <DiffViewer
            original={originalText}
            modified={modifiedText}
            method={diffMethod}
          />
        </div>

      </main>

    </div>
  );
};

export default TextCompareHome;