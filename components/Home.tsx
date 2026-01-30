import React, { useState, useEffect } from 'react';
import { Editor } from './Editor';
import { Button } from './Button';
import { validateJson, beautifyJson, minifyJson } from '../utils/jsonHelper';
import { fixJsonWithGemini, generateSampleJson } from '../services/geminiService';
import { SAMPLE_JSON } from '../constants';
import { ArrowRightLeft, AlignLeft, Minimize2, CheckCircle2, Wand2, FileCode2 } from 'lucide-react';

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
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">

      {/* Toolbar */}
      <div className="flex-none bg-slate-900 border-b border-slate-800 p-2 overflow-x-auto">
        <div className="max-w-[1920px] mx-auto flex items-center justify-center gap-2 min-w-max px-4">
          <Button onClick={handleBeautify} icon={<AlignLeft size={18} />}>Beautify</Button>
          <Button onClick={handleMinimize} variant="secondary" icon={<Minimize2 size={18} />}>Minimize</Button>
          <Button onClick={handleValidate} variant="secondary" icon={<CheckCircle2 size={18} />}>Validate</Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Panel: Input */}
          <div className="flex-1 h-1/2 md:h-full p-4 min-w-0">
            <Editor
              label="Input JSON"
              value={inputJson}
              onChange={setInputJson}
              isValid={inputValid}
              errorMessage={inputError}
              onAiFix={handleAiFix}
              isFixing={isFixing}
            />
          </div>

          {/* Mobile Splitter Visualization (Icon only) */}
          <div className="hidden md:flex flex-none items-center justify-center w-0 z-10 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 p-1.5 rounded-full shadow-xl">
              <ArrowRightLeft size={14} className="text-slate-400" />
            </div>
          </div>

          {/* Right Panel: Output */}
          <div className="flex-1 h-1/2 md:h-full p-4 min-w-0">
            <Editor
              label="Output / Result"
              value={outputJson}
              onChange={setOutputJson}
              isValid={outputValid}
              errorMessage={outputError}
              readOnly={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
