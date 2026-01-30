import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, ChevronUp, Copy, Check, Trash2, Sparkles, Code2, Network } from 'lucide-react';
import { JsonTree } from './JsonTree';

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
  const [viewMode, setViewMode] = useState<'code' | 'tree'>('code');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatically switch to code view if invalid JSON is typed/detected
  useEffect(() => {
    if (!isValid && viewMode === 'tree') {
      // Optional: enforce switch back? 
      // User might be editing, better to let them stay in code view usually.
      // But if they are in tree view, they can't edit anyway (readOnly for now in tree).
    }
  }, [isValid, viewMode]);

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
        if(textareaRef.current) {
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

  // Render Tree View Logic
  let treeData = null;
  let canShowTree = isValid && value.trim().length > 0;
  if (viewMode === 'tree' && canShowTree) {
    try {
      treeData = JSON.parse(value);
    } catch (e) {
      canShowTree = false;
    }
  }

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg border ${isValid ? 'border-slate-200 dark:border-slate-700' : 'border-red-500/50'} shadow-lg dark:shadow-xl overflow-hidden transition-colors duration-200`}>
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
          {/* View Mode Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-700 rounded p-0.5 mr-2">
            <button
                onClick={() => setViewMode('code')}
                className={`p-1 rounded text-xs flex items-center gap-1 ${viewMode === 'code' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                title="Code View"
            >
                <Code2 size={14} />
            </button>
            <button
                onClick={() => setViewMode('tree')}
                className={`p-1 rounded text-xs flex items-center gap-1 ${viewMode === 'tree' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                title="Tree View"
                disabled={!isValid || !value.trim()}
            >
                <Network size={14} />
            </button>
          </div>

          {viewMode === 'code' && (
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
            {copied ? <Check size={16} className="text-green-600 dark:text-green-500"/> : <Copy size={16} />}
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

      {/* Find & Replace Bar (Only in Code Mode) */}
      {showSearch && viewMode === 'code' && (
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
                <button onClick={findPrev} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><ChevronUp size={14}/></button>
                <button onClick={findNext} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><ChevronDown size={14}/></button>
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

      {/* Editor Area */}
      <div className="relative flex-1 bg-white dark:bg-slate-900 overflow-hidden group">
        {viewMode === 'code' || !canShowTree ? (
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                readOnly={readOnly}
                className={`w-full h-full p-4 bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-slate-800 dark:text-slate-300 selection:bg-blue-100 dark:selection:bg-blue-500/30 ${readOnly ? 'cursor-text' : ''}`}
                spellCheck={false}
                placeholder={readOnly ? "Output will appear here..." : "Paste your JSON here..."}
            />
        ) : (
            <div className="w-full h-full p-4 overflow-auto bg-slate-50 dark:bg-slate-900/50">
                <JsonTree data={treeData} />
            </div>
        )}
        
        {/* Error Overlay */}
        {!isValid && errorMessage && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-100 dark:bg-red-900/90 border-t border-red-200 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-2 text-xs font-mono flex items-start gap-2 backdrop-blur-sm z-10">
                <X size={14} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
            </div>
        )}
      </div>
      
      {/* Status Bar */}
      <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-3 py-1 text-xs text-slate-500 flex justify-between items-center transition-colors">
         <span>{viewMode === 'tree' && canShowTree ? 'Tree View' : `${value.length} chars`}</span>
         <span className={isValid ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}>
            {isValid ? 'Valid JSON' : 'Invalid syntax'}
         </span>
      </div>
    </div>
  );
};
