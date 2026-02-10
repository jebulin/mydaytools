import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, InputMode, AssignmentData } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  disabled: boolean;

  onFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Guided Flow Props
  inputMode: InputMode;
  onModeSelect: (mode: 'chat' | 'guided') => void;
  onCountSubmit: (count: number) => void;
  onNamesSubmit: (names: string[]) => void;
  onAssignmentSubmit: (selectedPeople: string[]) => void;
  assignmentData?: AssignmentData;

  // Undo
  onUndo: () => void;
  canUndo: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onFileUpload,
  isProcessing,
  disabled,
  inputMode,
  onModeSelect,
  onCountSubmit,
  onNamesSubmit,
  onAssignmentSubmit,
  assignmentData,
  onUndo,
  canUndo
}) => {
  const [inputText, setInputText] = useState('');
  const [countInput, setCountInput] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, inputMode, assignmentData]);

  // Reset assignment selection when item changes, or load existing assignments
  useEffect(() => {
    if (inputMode === 'assignment' && assignmentData) {
      setSelectedPeople(assignmentData.item.assignedTo || []);
    } else {
      setSelectedPeople([]);
    }
  }, [assignmentData?.item.id, inputMode]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isProcessing && !disabled) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleCountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(countInput);
    if (count > 0) {
      onCountSubmit(count);
      setCountInput('');
    }
  };

  const handleNamesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = inputText.split(',').map(n => n.trim()).filter(n => n.length > 0);
    if (names.length > 0) {
      onNamesSubmit(names);
      setInputText('');
    }
  };

  const togglePersonSelection = (person: string) => {
    setSelectedPeople(prev =>
      prev.includes(person)
        ? prev.filter(p => p !== person)
        : [...prev, person]
    );
  };

  const renderInputArea = () => {
    switch (inputMode) {
      case 'choice':
        return (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onModeSelect('chat')}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all text-left group"
            >
              <span className="block font-semibold text-slate-800 group-hover:text-indigo-600">Free Chat</span>
              <span className="text-xs text-slate-500">Type assignments manually</span>
            </button>
            <button
              onClick={() => onModeSelect('guided')}
              className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all text-left group"
            >
              <span className="block font-semibold text-indigo-900">Guided Mode</span>
              <span className="text-xs text-indigo-600">Answer questions step-by-step</span>
            </button>
          </div>
        );

      case 'count':
        return (
          <form onSubmit={handleCountSubmit} className="flex gap-2">
            <input
              type="number"
              min="1"
              max="50"
              value={countInput}
              onChange={(e) => setCountInput(e.target.value)}
              placeholder="Number of people..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={!countInput}
              className="px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
              Next
            </button>
          </form>
        );

      case 'names':
        return (
          <form onSubmit={handleNamesSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Alice, Bob, Charlie"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
              Start
            </button>
          </form>
        );

      case 'assignment':
        if (!assignmentData) return null;
        return (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end mb-1">
              <div className="text-xs text-indigo-500 uppercase font-bold tracking-wider bg-indigo-50 px-2 py-1 rounded">Assign Item</div>
              {canUndo && (
                <button
                  onClick={onUndo}
                  className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Undo
                </button>
              )}
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-lg">{assignmentData.item.name}</span>
                <span className="font-mono text-indigo-700 bg-white px-2 py-1 rounded border border-indigo-100">
                  {assignmentData.item.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Select People</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPeople(assignmentData.people)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeople([])}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {assignmentData.people.length > 0 ? assignmentData.people.map(person => (
                <button
                  key={person}
                  onClick={() => togglePersonSelection(person)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${selectedPeople.includes(person)
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                >
                  {person}
                </button>
              )) : (
                <div className="text-sm text-slate-400 italic py-2 w-full text-center">
                  No people added yet. Switch to chat to add names or edit another item.
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onAssignmentSubmit([])} // Skip/Next
                className="flex-1 py-3 text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
              >
                Skip
              </button>
              <button
                onClick={() => onAssignmentSubmit(selectedPeople)}
                className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm font-medium transition-colors"
              >
                {selectedPeople.length > 0 ? `Assign to ${selectedPeople.length}` : 'Save'}
              </button>
            </div>
          </div>
        );

      case 'chat':
      default:
        return (
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo || isProcessing || disabled}
              className="p-3 bg-white text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm group shrink-0"
              title="Undo last change"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={disabled ? "Upload a receipt to start... ➡️" : "Type e.g., 'Tom had the burger'..."}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 placeholder-slate-400"
              disabled={disabled || isProcessing}
            />
            {disabled && onFileUpload ? (
              <label
                className={`p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm transition-colors flex items-center justify-center shrink-0 ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                title="Upload Receipt"
              >
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onFileUpload}
                  disabled={isProcessing}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </label>
            ) : (
              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing || disabled}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            )}
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none'
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-500 border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none text-sm shadow-sm flex items-center space-x-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 min-h-[80px] transition-all">
        {renderInputArea()}
      </div>
    </div>
  );
};