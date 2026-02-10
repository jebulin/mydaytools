import React, { useEffect, useRef } from 'react';
import { ReceiptItem } from '../types';

interface ReceiptViewProps {
  items: ReceiptItem[];
  currency: string;
  loading?: boolean;
  highlightedItemId?: string;
  onClearAssignment?: (itemId: string) => void;
  onEditAssignment?: (itemId: string) => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({ items, currency, loading, highlightedItemId, onClearAssignment, onEditAssignment }) => {
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (highlightedItemId) {
      const element = itemRefs.current.get(highlightedItemId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedItemId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p>Analyzing receipt...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <p className="text-lg font-medium">No receipt loaded</p>
        <p className="text-sm">Upload an image to get started</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3 pb-24">
      <h2 className="text-xl font-bold text-slate-800 mb-4 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10 border-b">
        Receipt Items
      </h2>
      {items.map((item) => {
        const isHighlighted = item.id === highlightedItemId;
        return (
          <div 
            key={item.id}
            ref={(el) => {
              if (el) itemRefs.current.set(item.id, el);
              else itemRefs.current.delete(item.id);
            }} 
            className={`p-3 rounded-lg border transition-all duration-300 ${
              isHighlighted
                ? 'ring-2 ring-indigo-500 shadow-lg bg-indigo-50 relative z-10 scale-[1.02]'
                : item.assignedTo.length > 0 
                  ? 'bg-indigo-50/50 border-indigo-200' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className={`font-medium transition-colors ${isHighlighted ? 'text-indigo-900 font-bold' : 'text-slate-800'}`}>
                  {item.name}
                </h3>
                <div className="flex flex-wrap gap-1 mt-2 items-center">
                  {item.assignedTo.length > 0 ? (
                    <>
                      {item.assignedTo.map((person, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          {person}
                        </span>
                      ))}
                      <div className="flex items-center ml-2 border-l border-indigo-200 pl-2 space-x-1">
                        {onEditAssignment && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditAssignment(item.id);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
                            title="Edit assignment"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        )}
                        {onClearAssignment && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClearAssignment(item.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors"
                            title="Clear assignments"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Unassigned</span>
                  )}
                </div>
              </div>
              <div className="text-right ml-4 flex flex-col items-end">
                <span className={`font-semibold ${isHighlighted ? 'text-indigo-700' : 'text-slate-900'}`}>
                  {currency}{item.price.toFixed(2)}
                </span>
                {item.assignedTo.length > 1 && (
                  <div className="text-xs text-slate-600 mt-1 font-medium bg-white/50 px-1.5 py-0.5 rounded border border-slate-100 inline-block">
                    {currency}{(item.price / item.assignedTo.length).toFixed(2)} <span className="text-slate-400">/ person</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};