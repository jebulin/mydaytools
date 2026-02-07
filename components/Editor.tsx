import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, ChevronUp, Copy, Check, Trash2, Code2, ScanEye } from 'lucide-react';
import { JsonViewer } from './JsonViewer';

import { SyntaxHighlightedJson } from './SyntaxHighlightedJson';
import { LineNumbers } from './LineNumbers';


interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  readOnly?: boolean;
  isValid: boolean;
  errorMessage?: string;
  onAiFix?: () => void;
  isFixing?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  label,
  readOnly = false,
  isValid,
  errorMessage,
  onAiFix,
  isFixing
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isViewerMode, setIsViewerMode] = useState(false);


  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Ctrl+F keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the event target is within this editor's container
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
          e.preventDefault();
          if (!isViewerMode) {
            setShowSearch(true);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isViewerMode]);

  // Sync scroll between textarea and highlight div
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current && lineNumbersRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };





  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear this editor?')) {
      onChange('');
    }
  };

  // Find Functionality
  const findNext = () => {
    if (!textareaRef.current || !findText) return;

    const text = textareaRef.current.value;
    const currentPos = textareaRef.current.selectionEnd;
    const nextIndex = text.indexOf(findText, currentPos);

    if (nextIndex !== -1) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(nextIndex, nextIndex + findText.length);
    } else {
      // Loop back to start
      const firstIndex = text.indexOf(findText);
      if (firstIndex !== -1) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(firstIndex, firstIndex + findText.length);
      }
    }
  };

  const findPrev = () => {
    if (!textareaRef.current || !findText) return;

    const text = textareaRef.current.value;
    const currentPos = textareaRef.current.selectionStart;
    const prevIndex = text.lastIndexOf(findText, currentPos - 1);

    if (prevIndex !== -1) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(prevIndex, prevIndex + findText.length);
    } else {
      // Loop to end
      const lastIndex = text.lastIndexOf(findText);
      if (lastIndex !== -1) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(lastIndex, lastIndex + findText.length);
      }
    }
  };

  // Replace Functionality
  const replaceCurrent = () => {
    if (!textareaRef.current || !findText || readOnly) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);

    if (selectedText === findText) {
      const newValue = value.substring(0, start) + replaceText + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start, start + replaceText.length);
        }
      }, 0);
    } else {
      findNext();
    }
  };

  const replaceAll = () => {
    if (!findText || readOnly) return;
    const newValue = value.split(findText).join(replaceText);
    onChange(newValue);
  };



  return (
    <div ref={containerRef} className={`flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg border ${isValid ? 'border-slate-200 dark:border-slate-700' : 'border-red-500/50'} shadow-lg dark:shadow-xl overflow-hidden transition-colors duration-200`}>
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
          {!isValid && (
            <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 px-2 py-0.5 rounded">
              Invalid JSON
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Viewer Mode Toggle */}
          <button
            onClick={() => setIsViewerMode(!isViewerMode)}
            className={`p-1.5 rounded transition-colors mr-2 ${isViewerMode ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            title={isViewerMode ? "Switch to Editor" : "Switch to Viewer Mode via Brackets"}
          >
            {isViewerMode ? <Code2 size={16} /> : <ScanEye size={16} />}
          </button>

          {!isViewerMode && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${showSearch ? 'text-blue-600 dark:text-blue-400 bg-slate-200 dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400'}`}
              title="Find & Replace"
            >
              <Search size={16} />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
            title="Copy to Clipboard"
          >
            {copied ? <Check size={16} className="text-green-600 dark:text-green-500" /> : <Copy size={16} />}
          </button>
          {!readOnly && (
            <button
              onClick={handleClear}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
              title="Clear"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Find & Replace Bar */}
      {showSearch && !isViewerMode && (
        <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 flex flex-wrap gap-2 items-center text-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 focus-within:border-blue-500 overflow-hidden">
            <input
              type="text"
              placeholder="Find..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && findNext()}
              className="bg-transparent border-none text-slate-900 dark:text-slate-200 px-2 py-1 focus:outline-none w-32 md:w-48 placeholder-slate-400"
            />
            <div className="flex border-l border-slate-300 dark:border-slate-700">
              <button onClick={findPrev} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><ChevronUp size={14} /></button>
              <button onClick={findNext} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><ChevronDown size={14} /></button>
            </div>
          </div>

          {!readOnly && (
            <>
              <div className="flex items-center bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 focus-within:border-blue-500 overflow-hidden">
                <input
                  type="text"
                  placeholder="Replace..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="bg-transparent border-none text-slate-900 dark:text-slate-200 px-2 py-1 focus:outline-none w-32 md:w-48 placeholder-slate-400"
                />
              </div>
              <button onClick={replaceCurrent} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-200 text-xs font-medium">Replace</button>
              <button onClick={replaceAll} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-200 text-xs font-medium">All</button>
            </>
          )}
          <button onClick={() => setShowSearch(false)} className="ml-auto p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="relative flex-1 bg-white dark:bg-slate-900 overflow-hidden group">
        {isViewerMode ? (
          <div className="w-full h-full overflow-hidden p-2">
            <JsonViewer value={value} />
          </div>
        ) : (
          <div className="flex w-full h-full">
            {/* Line Numbers */}
            <div
              ref={lineNumbersRef}
              className="flex-shrink-0 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 overflow-hidden py-4 pl-4"
              style={{ width: '3.5rem' }}
            >
              <div className="overflow-hidden">
                <LineNumbers value={value} />
              </div>
            </div>

            {/* Editor Content Area */}
            <div className="relative flex-1 overflow-hidden">
              {/* Editable View with Syntax Highlighting */}
              <>
                {/* Syntax Highlighted Background */}
                <div
                  ref={highlightRef}
                  className="absolute inset-0 p-4 overflow-auto pointer-events-none whitespace-pre-wrap break-words text-sm leading-relaxed font-mono"
                  aria-hidden="true"
                >
                  <SyntaxHighlightedJson value={value} isValid={isValid} />
                </div>

                {/* Transparent Textarea Overlay */}
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onScroll={handleScroll}
                  className={`absolute inset-0 w-full h-full p-4 bg-transparent resize-none focus:outline-none text-sm leading-relaxed font-mono text-transparent caret-slate-800 dark:caret-slate-200 selection:bg-blue-500/70 selection:text-white dark:selection:bg-blue-400/70 dark:selection:text-white ${readOnly ? 'cursor-text' : ''}`}
                  spellCheck={false}
                  placeholder={readOnly ? "Output will appear here..." : "Paste your JSON here..."}
                />
              </>
            </div>
          </div>
        )}
      </div>

      {/* Error Message Section */}
      {!isValid && errorMessage && (
        <div className="bg-red-100 dark:bg-red-900/90 border-t border-red-200 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-2 text-xs font-mono flex items-start gap-2">
          <X size={14} className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-3 py-1 text-xs text-slate-500 flex justify-between items-center transition-colors">
        <span>{`${value.length} chars`}</span>
        <span className={isValid ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}>
          {isValid ? 'Valid JSON' : 'Invalid syntax'}
        </span>
      </div>
    </div>
  );
};
