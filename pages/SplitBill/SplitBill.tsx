import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ReceiptData, ChatMessage, InputMode } from '@/types';
import { parseReceiptImage, processChatCommand, fileToGenerativePart } from '@/services/geminiService';
import { ReceiptView } from '@/components/ReceiptView';
import { ChatInterface } from '@/components/ChatInterface';
import { Summary } from '@/components/Summary';
import SEO from '@/components/SEO';
interface HistoryState {
  receipt: ReceiptData;
  currentItemIndex: number;
  people: string[];
}

const SplitBill: React.FC = () => {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! Upload a receipt image to get started.',
      timestamp: new Date(),
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Guided Flow State
  const [inputMode, setInputMode] = useState<InputMode>('chat');
  const [people, setPeople] = useState<string[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);

  // Undo History
  const [history, setHistory] = useState<HistoryState[]>([]);

  // Derived list of all known people (from manual entry + receipt assignments)
  const knownPeople = useMemo(() => {
    const set = new Set(people);
    if (receipt) {
      receipt.items.forEach(item => {
        item.assignedTo.forEach(p => set.add(p));
      });
    }
    return Array.from(set).sort();
  }, [people, receipt]);

  const addMessage = (role: 'user' | 'model', text: string) => {
    setChatMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role, text, timestamp: new Date() }
    ]);
  };

  const saveHistory = () => {
    if (receipt) {
      setHistory(prev => [...prev, {
        receipt: JSON.parse(JSON.stringify(receipt)),
        currentItemIndex,
        people: [...people]
      }]);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prevState = history[history.length - 1];
    setReceipt(prevState.receipt);
    setCurrentItemIndex(prevState.currentItemIndex);
    setPeople(prevState.people);
    setHistory(prev => prev.slice(0, -1));
    addMessage('model', 'Undid last change.');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Reset state
    setPeople([]);
    setCurrentItemIndex(0);
    setInputMode('chat');
    setHistory([]); // Clear history on new upload

    addMessage('user', `Uploaded ${file.name}`);
    addMessage('model', 'Analyzing receipt... please wait.');

    try {
      const base64 = await fileToGenerativePart(file);
      const data = await parseReceiptImage(base64, file.type);
      setReceipt(data);
      addMessage('model', `Receipt parsed! Found ${data.items.length} items. How would you like to proceed?`);
      setInputMode('choice');
    } catch (error) {
      console.error(error);
      addMessage('model', 'Sorry, I had trouble parsing that receipt. Please ensure the image is clear.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearAssignment = (itemId: string) => {
    if (!receipt) return;
    saveHistory();
    const updatedItems = receipt.items.map(item =>
      item.id === itemId ? { ...item, assignedTo: [] } : item
    );
    setReceipt({ ...receipt, items: updatedItems });
  };

  const handleEditAssignment = (itemId: string) => {
    if (!receipt) return;
    const index = receipt.items.findIndex(i => i.id === itemId);
    if (index >= 0) {
      setCurrentItemIndex(index);
      setInputMode('assignment');
      // No history save for view/mode change unless we want to undo navigation
    }
  };

  // --- Guided Mode Handlers ---

  const handleModeSelect = (mode: 'chat' | 'guided') => {
    if (mode === 'chat') {
      setInputMode('chat');
      addMessage('user', 'I will type commands manually.');
      addMessage('model', 'Sure! Just say things like "Tom had the burger".');
    } else {
      setInputMode('count');
      addMessage('user', 'Guide me through it.');
      addMessage('model', 'Great! First, how many people are splitting this bill?');
    }
  };

  const handleCountSubmit = (count: number) => {
    addMessage('user', count.toString());
    addMessage('model', `Okay, ${count} people. Please enter their names (comma separated).`);
    setInputMode('names');
  };

  const handleNamesSubmit = (names: string[]) => {
    setPeople(names);
    addMessage('user', names.join(', '));
    addMessage('model', `Got it: ${names.join(', ')}. Let's go through the items.`);

    // Find first unassigned item
    if (receipt) {
      const firstUnassigned = receipt.items.findIndex(i => i.assignedTo.length === 0);
      const startIdx = firstUnassigned >= 0 ? firstUnassigned : 0;
      setCurrentItemIndex(startIdx);

      if (startIdx < receipt.items.length) {
        setInputMode('assignment');
      } else {
        addMessage('model', "It looks like all items are already assigned!");
        setInputMode('chat');
      }
    }
  };

  const handleAssignmentSubmit = (selectedPeople: string[]) => {
    if (!receipt) return;
    saveHistory();

    const currentItem = receipt.items[currentItemIndex];

    // Update Receipt
    const updatedItems = [...receipt.items];
    updatedItems[currentItemIndex] = {
      ...currentItem,
      assignedTo: selectedPeople
    };

    setReceipt({ ...receipt, items: updatedItems });

    if (selectedPeople.length > 0) {
      // addMessage('user', `Assigned ${currentItem.name} to ${selectedPeople.join(', ')}`);
    }

    const nextIndex = currentItemIndex + 1;
    if (nextIndex < receipt.items.length) {
      setCurrentItemIndex(nextIndex);
    } else {
      setInputMode('chat');
      addMessage('model', "That's the last item! Check the summary to see what everyone owes.");
    }
  };

  // --- Manual Chat Handler ---

  const handleSendMessage = useCallback(async (text: string) => {
    if (!receipt) return;
    saveHistory(); // Save history before processing (optimistic) or wait? 
    // Wait: processChatCommand is async. User sends message. 
    // If we save history here, we save the state BEFORE the command effect. Correct.

    addMessage('user', text);
    setIsProcessing(true);

    try {
      const { responseText, updatedReceiptItems } = await processChatCommand(receipt, text);

      setReceipt(prev => prev ? { ...prev, items: updatedReceiptItems } : null);
      addMessage('model', responseText);
    } catch (error) {
      console.error(error);
      addMessage('model', "I'm having trouble connecting to the brain. Please try again.");
      // If error, we might want to pop history? 
      // If we don't change receipt state on error, having an extra history entry that is identical to current state is redundant but harmless.
      // However, saveHistory captures 'receipt' at the moment of call.
      // If error occurs, setReceipt is NOT called. 
      // So 'history' has an entry [State A]. Current state is [State A].
      // Undo would set state to [State A] and pop history. 
      // This effectively does nothing to the data, which is fine.
      // To be cleaner, we could remove the history entry on error, but complexity/benefit ratio is low.
    } finally {
      setIsProcessing(false);
    }
  }, [receipt, people, currentItemIndex]); // Added dependencies for closure capture

  return (
    <>
      <SEO
        title="Split Bill Calculator - AI Receipt Scanner"
        description="Easily split restaurant bills among friends. Upload a receipt photo and let AI extract items automatically. Fair, proportional bill splitting made simple."
        canonical="/split-bill"
      />
      <div className="flex flex-col md:flex-row h-screen bg-slate-100">
        <div className="flex-1 flex flex-col min-w-0 md:border-r border-slate-200 bg-white relative">
          <div className="flex-1 overflow-y-auto">
            <header className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-20 sticky top-0">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 36v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">SplitSmart</h1>
              </div>
              <label className={`cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${inputMode !== 'chat' && inputMode !== 'choice' ? 'opacity-50 pointer-events-none' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>{receipt ? 'Replace Receipt' : 'Upload Receipt'}</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={inputMode !== 'chat' && inputMode !== 'choice'}
                />
              </label>
            </header>
            {!receipt && !isUploading && (
              <div className="p-8 max-w-3xl mx-auto space-y-12 pb-24">
                <section className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-slate-800">The Easiest Way to Split Bills</h2>
                  <p className="text-slate-600">Stop doing math at the dinner table. Upload your receipt and let AI do the work.</p>
                </section>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2">1. Upload Receipt</h3>
                    <p className="text-sm text-slate-600">Take a photo of your receipt. Our AI automatically reads items and prices.</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2">2. Assign Items</h3>
                    <p className="text-sm text-slate-600">Tap items to assign them to friends. Split shared appetizers easily.</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2">3. Share & Pay</h3>
                    <p className="text-sm text-slate-600">Get a clear summary of exactly what everyone owes, including tax and tip.</p>
                  </div>
                </div>

                <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <h3 className="font-bold text-indigo-900 mb-4">Why use SplitSmart?</h3>
                  <ul className="space-y-2 text-indigo-800 text-sm">
                    <li className="flex items-center gap-2">✔ No app download required - runs in your browser.</li>
                    <li className="flex items-center gap-2">✔ Works with any currency found on the receipt.</li>
                    <li className="flex items-center gap-2">✔ Secure and private - receipts aren't stored permanently.</li>
                  </ul>
                </section>
              </div>
            )}
            <ReceiptView
              items={receipt?.items || []}
              currency={receipt?.currency || '$'}
              loading={isUploading}
              highlightedItemId={
                (inputMode === 'assignment' && receipt?.items[currentItemIndex])
                  ? receipt.items[currentItemIndex].id
                  : undefined
              }
              onClearAssignment={handleClearAssignment}
              onEditAssignment={handleEditAssignment}
            />


          </div>

          {/* Floating/Fixed Summary at bottom of Left Pane */}
          {receipt && (
            <div className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200">
              <Summary receipt={receipt} />
            </div>
          )}
        </div>

        {/* Right Pane: Chat */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 md:max-w-md lg:max-w-lg shadow-xl z-10">
          <header className="p-4 bg-white border-b border-slate-200 md:hidden shadow-sm">
            <h2 className="font-bold text-slate-800">Chat Assistant</h2>
          </header>
          <ChatInterface
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
            disabled={!receipt || isUploading}
            inputMode={inputMode}
            onModeSelect={handleModeSelect}
            onCountSubmit={handleCountSubmit}
            onNamesSubmit={handleNamesSubmit}
            onAssignmentSubmit={handleAssignmentSubmit}
            assignmentData={
              (inputMode === 'assignment' && receipt)
                ? { item: receipt.items[currentItemIndex], people: knownPeople }
                : undefined
            }
            onUndo={handleUndo}
            canUndo={history.length > 0}
          />
        </div>
      </div>
    </>
  );
};

export default SplitBill;