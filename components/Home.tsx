import React, { useState, useEffect } from 'react';
import { Editor } from './Editor';
import { Button } from './Button';
import { validateJson, beautifyJson, minifyJson } from '../utils/jsonHelper';
import { fixJsonWithGemini, generateSampleJson } from '../services/geminiService';
import { SAMPLE_JSON } from '../constants';
import { ArrowRightLeft, AlignLeft, Minimize2, CheckCircle2, Wand2, FileCode2 } from 'lucide-react';
import SEO from './SEO';

const Home: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON);
  const [outputJson, setOutputJson] = useState<string>('');

  const [inputValid, setInputValid] = useState(false);
  const [inputError, setInputError] = useState<string>('');

  const [outputValid, setOutputValid] = useState(false);
  const [outputError, setOutputError] = useState<string>('');

  const [isFixing, setIsFixing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Validation Effect
  useEffect(() => {
    const result = validateJson(inputJson);
    setInputValid(result.isValid);
    setInputError(result.error || '');
  }, [inputJson]);

  useEffect(() => {
    const result = validateJson(outputJson);
    setOutputValid(result.isValid);
    setOutputError(result.error || '');
  }, [outputJson]);

  // Auto-fill output when valid JSON is entered in input
  useEffect(() => {
    if (inputValid && inputJson.trim()) {
      const beautified = beautifyJson(inputJson);
      try {
        JSON.parse(beautified);
        setOutputJson(beautified);
      } catch (err) {
        setOutputJson("");
      }
    } else if (!inputJson.trim()) {
      // Clear output if input is empty
      setOutputJson('');
    }
  }, [inputJson, inputValid]);

  // Actions
  const handleBeautify = () => {
    if (!inputValid) {
      setOutputJson(inputJson);
      return;
    }
    const result = beautifyJson(inputJson);
    setOutputJson(result);
  };

  const handleMinimize = () => {
    if (!inputValid) {
      setOutputJson(inputJson);
      return;
    }
    const result = minifyJson(inputJson);
    setOutputJson(result);
  };

  const handleValidate = () => {
    if (inputValid) {
      setOutputJson(inputJson);
    } else {
      setOutputJson('');
    }
  };

  const handleAiFix = async () => {
    if (!inputError) return;
    setIsFixing(true);
    try {
      const fixed = await fixJsonWithGemini(inputJson, inputError);
      setInputJson(fixed);
    } catch (e) {
      alert('Failed to fix JSON with AI. Please check your API key or try again.');
    } finally {
      setIsFixing(false);
    }
  };

  const handleGenerateSample = async () => {
    const topic = prompt("What kind of JSON data do you need? (e.g., 'User Profile', 'E-commerce Products')", "Space Mission Manifest");
    if (!topic) return;
    setIsGenerating(true);
    try {
      const sample = await generateSampleJson(topic);
      setInputJson(sample);
    } catch (e) {
      alert('Failed to generate data.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <SEO
        title="JSON Master - Format, Validate & Beautify JSON"
        description="Free online JSON tool to format, validate, minify, and beautify your JSON data. AI-powered JSON fixing and sample generation included."
        canonical="/json-master"
      />
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
        <header className="sr-only">
          <h1>JSON Master: The Ultimate JSON Formatter and Validator</h1>
        </header>

        {/* Toolbar */}
        <div className="flex-none bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 overflow-x-auto transition-colors duration-300">
          <div className="max-w-[1920px] mx-auto flex items-center justify-center gap-2 min-w-max px-4">
            <Button onClick={handleBeautify} icon={<AlignLeft size={18} />}>Beautify</Button>
            <Button onClick={handleMinimize} variant="secondary" icon={<Minimize2 size={18} />}>Minimize</Button>
            <Button onClick={handleValidate} variant="secondary" icon={<CheckCircle2 size={18} />}>Validate</Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
          <div className="h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 transition-colors duration-300">
            {/* Left Panel: Input */}
            <section className="flex-1 h-1/2 md:h-full p-4 min-w-0" aria-label="JSON Input">
              <Editor
                label="Input JSON"
                value={inputJson}
                onChange={setInputJson}
                isValid={inputValid}
                errorMessage={inputError}
                onAiFix={handleAiFix}
                isFixing={isFixing}
              />
            </section>

            {/* Mobile Splitter Visualization (Icon only) */}
            <div className="hidden md:flex flex-none items-center justify-center w-0 z-10 relative" aria-hidden="true">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1.5 rounded-full shadow-xl transition-colors">
                <ArrowRightLeft size={14} className="text-slate-600 dark:text-slate-400" />
              </div>
            </div>

            {/* Right Panel: Output */}
            <section className="flex-1 h-1/2 md:h-full p-4 min-w-0" aria-label="JSON Result">
              <Editor
                label="Output / Result"
                value={outputJson}
                onChange={setOutputJson}
                isValid={outputValid}
                errorMessage={outputError}
                readOnly={false}
              />
            </section>
          </div>
        </main>

        {/* Content Section for AdSense & SEO */}
        {/* <div>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">What is JSON?</h2>
                <div className="prose dark:prose-invert text-slate-600 dark:text-slate-400">
                  <p>
                    JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. It is based on a subset of the JavaScript Programming Language Standard ECMA-262 3rd Edition - December 1999.
                  </p>
                  <p>
                    Despite its name, JSON is language-independent, and code for reading and generating JSON data is available in many programming languages. This makes it an ideal format for exchanging data between client and server applications.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why use JSON Master?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                      <Wand2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">AI-Powered Fixing</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Automatically detect and fix common JSON syntax errors with a single click using Gemini AI.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Instant Validation</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Get real-time feedback on your JSON structure with precise error line numbers.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                      <FileCode2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Beautify & Minify</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Format your JSON for readability or compress it to save space for production use.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Common JSON Errors & How to Fix Them</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Trailing Commas</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    JSON does not allow a comma after the last element in an array or object.
                    <br />
                    <code className="text-xs bg-red-100 dark:bg-red-900/20 px-1 py-0.5 rounded text-red-700 dark:text-red-300 block mt-2">{"{\"a\": 1,}"} // Invalid</code>
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Single Quotes</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    JSON strings and keys must be enclosed in double quotes, not single quotes.
                    <br />
                    <code className="text-xs bg-red-100 dark:bg-red-900/20 px-1 py-0.5 rounded text-red-700 dark:text-red-300 block mt-2">{"{'a': 1}"} // Invalid</code>
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Missing Quotes on Keys</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    All keys in a JSON object must be strings enclosed in double quotes.
                    <br />
                    <code className="text-xs bg-red-100 dark:bg-red-900/20 px-1 py-0.5 rounded text-red-700 dark:text-red-300 block mt-2">{'{a: 1}'} // Invalid</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Is my data secure?</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Yes, absolutely. JSON Master processes all data locally in your browser using JavaScript. Your JSON data is never sent to our servers unless you explicitly use the "AI Fix" feature, which securely sends the snippet to Google's Gemini API for correction.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">What is JSON Minification?</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Minification removes all unnecessary whitespace, newlines, and comments from the JSON code. This reduces the file size, making it faster to transmit over the network, which is crucial for high-performance web applications.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Can I convert XML to JSON?</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Currently, this tool focuses on JSON validation and formatting. We are working on adding XML to JSON conversion features in future updates.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Why is my JSON invalid?</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Common reasons include missing quotes around keys, trailing commas, using single quotes instead of double quotes, or undefined values (JSON does not support 'undefined', 'function', or 'date' types natively). Use our Validate button to find the exact error.
                  </p>
                </div>
              </div>
            </div>

          </section>
        </div> */}
      </div>
    </>
  );
};

export default Home;
