import React, { useMemo } from 'react';
import * as Diff from 'diff';
import { DiffPart, DiffMethod } from '../types';
import { Maximize2, Minimize2 } from 'lucide-react';

interface DiffViewerProps {
  original: string;
  modified: string;
  method: DiffMethod;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ original, modified, method }) => {

  const diffs: DiffPart[] = useMemo(() => {
    switch (method) {
      case DiffMethod.Chars:
        return Diff.diffChars(original, modified);
      case DiffMethod.Lines:
        return Diff.diffLines(original, modified);
      case DiffMethod.Words:
      default:
        return Diff.diffWords(original, modified);
    }
  }, [original, modified, method]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* Original View (Left) */}
      <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm h-full">
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <span className="font-semibold text-slate-700 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Original Text (Main)
          </span>
        </div>
        <div className="p-4 overflow-auto flex-1 font-mono text-sm whitespace-pre-wrap leading-relaxed text-slate-800">
          {diffs.map((part, index) => {
            // For the Left side:
            // - Show common text
            // - Show REMOVED text (Red)
            // - Do NOT show ADDED text
            if (part.added) return null;

            return (
              <span
                key={index}
                className={part.removed ? "bg-red-200 text-red-900 line-through decoration-red-400 decoration-2 opacity-80" : ""}
              >
                {part.value}
              </span>
            );
          })}
        </div>
      </div>

      {/* Modified View (Right) */}
      <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm h-full">
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <span className="font-semibold text-slate-700 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Modified Text (Secondary)
          </span>
        </div>
        <div className="p-4 overflow-auto flex-1 font-mono text-sm whitespace-pre-wrap leading-relaxed text-slate-800">
          {diffs.map((part, index) => {
            // For the Right side:
            // - Show common text
            // - Show ADDED text (Green)
            // - Do NOT show REMOVED text
            if (part.removed) return null;

            return (
              <span
                key={index}
                className={part.added ? "bg-green-200 text-green-900 font-medium" : ""}
              >
                {part.value}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};