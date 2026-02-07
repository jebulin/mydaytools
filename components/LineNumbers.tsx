import React from 'react';

interface LineNumbersProps {
  value: string;
}

export const LineNumbers: React.FC<LineNumbersProps> = ({ value }) => {
  const lineCount = value ? value.split('\n').length : 1;

  return (
    <div className="flex flex-col text-right pr-3 select-none text-slate-400 dark:text-slate-600 text-sm leading-relaxed font-mono">
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i + 1} className="min-h-[1.5rem]">
          {i + 1}
        </div>
      ))}
    </div>
  );
};
