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
import SEO from './SEO';

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const loadSampleData = () => {
    setOriginalText(`The quick brown fox jumps over the lazy dog.\nThis is a simple text comparison tool.\nIt is very useful for developers.`);
    setModifiedText(`The quick red fox jumped over the lazy dog.\nThis is an advanced text comparison web app.\nIt is extremely useful for developers and writers.`);
  };

  return (
    <>
      <SEO
        title="Text Compare - Diff Checker Online"
        description="Compare two text snippets online and highlight differences. Free, secure, and privacy-focused text diff checker for developers and writers."
        canonical="/text-compare"
      />
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-y-auto transition-colors duration-300">
        <header className="sr-only">
          <h1>Text Compare: Advanced Online Diff Checker</h1>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Text Comparison</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Identify differences between two versions of text instantly.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg transition-colors">
                <button
                  onClick={() => setDiffMethod(DiffMethod.Words)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${diffMethod === DiffMethod.Words ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  Words
                </button>
                <button
                  onClick={() => setDiffMethod(DiffMethod.Chars)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${diffMethod === DiffMethod.Chars ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  Chars
                </button>
                <button
                  onClick={() => setDiffMethod(DiffMethod.Lines)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${diffMethod === DiffMethod.Lines ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  Lines
                </button>
              </div>

              <button
                onClick={loadSampleData}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              >
                Sample
              </button>
            </div>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="flex flex-col gap-2" aria-label="Original Text Input">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Original Text</label>
                <button onClick={() => copyToClipboard(originalText)} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Copy to clipboard">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <textarea
                className="w-full h-64 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none shadow-inner resize-none font-mono text-sm text-slate-900 dark:text-slate-200 transition-all placeholder:text-slate-400"
                placeholder="Paste original text here..."
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
              />
            </section>

            <section className="flex flex-col gap-2" aria-label="Modified Text Input">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Modified Text</label>
                <button onClick={() => copyToClipboard(modifiedText)} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Copy to clipboard">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <textarea
                className="w-full h-64 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none shadow-inner resize-none font-mono text-sm text-slate-900 dark:text-slate-200 transition-all placeholder:text-slate-400"
                placeholder="Paste modified text here..."
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
              />
            </section>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4 py-4 border-t border-slate-200 dark:border-slate-800 mt-4 transition-colors">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Difference Visualization</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 uppercase tracking-widest font-bold">Real-time</span>
            </div>

            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/5 hover:bg-red-100 dark:hover:bg-red-400/10 border border-red-200 dark:border-red-400/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>

          {/* Diff Output Section */}
          <section className="flex-1 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden min-h-[400px] transition-colors" aria-label="Comparison Results">
            <DiffViewer
              original={originalText}
              modified={modifiedText}
              method={diffMethod}
            />
          </section>

          <section className="mt-12 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl mx-auto transition-colors">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-blue-600 dark:text-blue-400 font-semibold mb-2">How does the comparison work?</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  We use an optimized diff algorithm to identify additions, deletions, and modifications.
                  You can compare text at the word level, character level, or line level depending on your needs.
                </p>
              </div>
              <div>
                <h4 className="text-blue-600 dark:text-blue-400 font-semibold mb-2">Is my data secure?</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Yes! All text comparison happens directly in your browser using JavaScript.
                  Your text never leaves your machine and is never sent to our servers.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default TextCompareHome;
