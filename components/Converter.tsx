import React, { useState, useEffect, useCallback } from 'react';
import { ConversionMode, StringType, ParsedUrlData } from '../types';
import { Icons } from './Icon';
import UrlParser from './UrlParser';

const Converter: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<ConversionMode>(ConversionMode.ENCODE);
  const [stringType, setStringType] = useState<StringType>(StringType.FULL_URL);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedUrlData | null>(null);

  // Parse URL for the breakdown view
  const parseUrl = useCallback((urlToParse: string) => {
    try {
      const url = new URL(urlToParse);
      const params: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      setParsedData({
        protocol: url.protocol,
        host: url.host,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        params
      });
    } catch (e) {
      setParsedData(null);
    }
  }, []);

  // Main processing logic
  const process = useCallback(() => {
    setError(null);
    if (!input) {
      setOutput('');
      setParsedData(null);
      return;
    }

    try {
      let result = '';

      if (mode === ConversionMode.ENCODE) {
        if (stringType === StringType.FULL_URL) {
          result = encodeURI(input);
        } else {
          result = encodeURIComponent(input);
        }
      } else {
        // Decode
        result = decodeURIComponent(input);
      }

      setOutput(result);
      
      // Attempt to parse the valid URL version
      // If we are decoding, we parse the RESULT.
      // If we are encoding, we parse the INPUT (if it's a URL).
      const textToParse = mode === ConversionMode.ENCODE ? input : result;
      // Simple heuristic to avoid throwing excessive URL errors on partial text
      if (textToParse.includes('://') || textToParse.startsWith('www')) {
         parseUrl(textToParse.startsWith('www') ? `http://${textToParse}` : textToParse);
      } else {
        setParsedData(null);
      }

    } catch (err: any) {
      setError("Unable to process string. It may be malformed.");
      setOutput('');
      setParsedData(null);
    }
  }, [input, mode, stringType, parseUrl]);

  useEffect(() => {
    process();
  }, [process]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        
        {/* Mode Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shadow-inner">
          <button
            onClick={() => setMode(ConversionMode.ENCODE)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              mode === ConversionMode.ENCODE 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Encoder
          </button>
          <button
            onClick={() => setMode(ConversionMode.DECODE)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              mode === ConversionMode.DECODE 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Decoder
          </button>
        </div>

        {/* String Type Toggle (Only relevant for Encode mainly, but can clarify intent) */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm font-medium">Treat as:</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setStringType(StringType.FULL_URL)}
              className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                stringType === StringType.FULL_URL 
                  ? 'bg-slate-800 text-slate-100 border border-slate-700' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Uses encodeURI() - preserves URL structure characters"
            >
              Full URL
            </button>
            <button
              onClick={() => setStringType(StringType.COMPONENT)}
              className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                stringType === StringType.COMPONENT 
                  ? 'bg-slate-800 text-slate-100 border border-slate-700' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Uses encodeURIComponent() - encodes everything"
            >
              Component
            </button>
          </div>
        </div>
      </div>

      {/* Main IO Area */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Icons.Link className="w-4 h-4 text-indigo-400" />
              Input
            </label>
            <button 
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-900"
            >
              <Icons.Clear className="w-3 h-3" /> Clear
            </button>
          </div>
          
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === ConversionMode.ENCODE ? "Paste URL or text to encode..." : "Paste encoded string to decode..."}
              className="w-full h-64 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono text-sm leading-relaxed resize-none shadow-sm"
              spellCheck={false}
            />
            <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-slate-800/50 group-focus-within:ring-indigo-500/20"></div>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Icons.Globe className="w-4 h-4 text-emerald-400" />
              Output
            </label>
            <div className="h-6">
              {copied && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 animate-fade-in">
                  <Icons.Check className="w-3 h-3" /> Copied!
                </span>
              )}
            </div>
          </div>

          <div className="relative group">
            <textarea
              readOnly
              value={output}
              placeholder="Result will appear here..."
              className={`w-full h-64 bg-slate-950 border rounded-xl p-4 text-slate-100 placeholder-slate-700 focus:outline-none transition-all font-mono text-sm leading-relaxed resize-none shadow-sm ${
                error ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-slate-800'
              }`}
            />
             {/* Copy Button Overlay */}
            <div className="absolute top-3 right-3">
               <button
                onClick={handleCopy}
                disabled={!output}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 shadow-lg"
                title="Copy to clipboard"
               >
                 <Icons.Copy className="w-4 h-4" />
               </button>
            </div>
            
            {/* Error Overlay */}
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-red-950/90 text-red-200 px-4 py-3 rounded-lg border border-red-900/50 flex items-start gap-3 text-sm backdrop-blur-sm">
                <Icons.Error className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown / Info Section */}
      <UrlParser data={parsedData} />

      {/* Info Footer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-slate-600 max-w-2xl mx-auto">
          <span className="font-semibold text-slate-500">Note:</span> Use 
          <code className="mx-1 bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400">Full URL</code> 
          mode (`encodeURI`) when you want to convert a complete URL while keeping structure like 
          <span className="text-slate-500"> :// </span> and <span className="text-slate-500">?</span> intact. 
          Use <code className="mx-1 bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400">Component</code> 
          mode (`encodeURIComponent`) to safely encode parameters values containing special characters.
        </p>
      </div>
    </div>
  );
};

export default Converter;
