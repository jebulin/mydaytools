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

  const [inputValid, setInputValid] = useState(true);
  const [inputError, setInputError] = useState<string>('');

  const [outputValid, setOutputValid] = useState(true);
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

        <section className="hidden">
          <h2>About JSON Master</h2>
          <p>
            JSON Master is a powerful, browser-based JSON utility designed for developers.
            Whether you need to beautify messy JSON, minify it for production, or validate
            its structure against specifications, JSON Master has you covered.
            Our tool also features AI-powered fixing to help you identify and correct common
            syntax errors instantly.
          </p>
          <ul>
            <li>Beautify JSON with customizable indentation.</li>
            <li>Minify JSON to reduce payload size.</li>
            <li>Validate JSON and get detailed error messages.</li>
            <li>AI-assisted JSON repair.</li>
            <li>Privacy-focused: Your data remains in your browser.</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Home;
