import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface CollapsibleJsonProps {
  value: string;
  isValid: boolean;
}

interface JsonLine {
  lineNumber: number;
  content: string;
  indent: number;
  type: 'opening' | 'closing' | 'property' | 'value' | 'empty';
  isCollapsible?: boolean;
  collapsibleId?: string;
  closingLine?: number;
}

export const CollapsibleJson: React.FC<CollapsibleJsonProps> = ({ value, isValid }) => {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const parsedLines = useMemo(() => {
    if (!isValid || !value.trim()) {
      return null;
    }

    try {
      const lines = value.split('\n');
      const result: JsonLine[] = [];
      const stack: Array<{ lineNumber: number; id: string }> = [];
      let idCounter = 0;

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        const indent = line.search(/\S/);
        const lineNumber = index + 1;

        // Check if this line opens a collapsible section (object or array)
        const opensObject = trimmed.endsWith('{') || trimmed.endsWith('[');
        const closesObject = trimmed.startsWith('}') || trimmed.startsWith(']');

        let lineType: JsonLine['type'] = 'value';
        let isCollapsible = false;
        let collapsibleId: string | undefined;
        let closingLine: number | undefined;

        if (opensObject) {
          lineType = 'opening';
          isCollapsible = true;
          collapsibleId = `collapse-${idCounter++}`;
          stack.push({ lineNumber, id: collapsibleId });
        } else if (closesObject) {
          lineType = 'closing';
          const opener = stack.pop();
          if (opener) {
            // Update the opening line with closing line info
            const openingLineIndex = result.findIndex(l => l.lineNumber === opener.lineNumber);
            if (openingLineIndex !== -1) {
              result[openingLineIndex].closingLine = lineNumber;
            }
          }
        } else if (trimmed === '') {
          lineType = 'empty';
        } else if (trimmed.includes(':')) {
          lineType = 'property';
        }

        result.push({
          lineNumber,
          content: line,
          indent: indent === -1 ? 0 : indent,
          type: lineType,
          isCollapsible,
          collapsibleId,
          closingLine,
        });
      });

      return result;
    } catch (e) {
      return null;
    }
  }, [value, isValid]);

  const toggleCollapse = (id: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderLine = (line: JsonLine) => {
    const isCollapsed = line.collapsibleId && collapsedSections.has(line.collapsibleId);

    // Skip lines that are inside a collapsed section
    if (parsedLines) {
      for (const l of parsedLines) {
        if (l.collapsibleId && collapsedSections.has(l.collapsibleId)) {
          if (line.lineNumber > l.lineNumber && line.lineNumber <= (l.closingLine || Infinity)) {
            return null;
          }
        }
      }
    }

    const highlightedContent = highlightJsonLine(line.content);

    return (
      <div key={line.lineNumber} className="flex items-start">
        {line.isCollapsible ? (
          <button
            onClick={() => line.collapsibleId && toggleCollapse(line.collapsibleId)}
            className="flex-shrink-0 w-4 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 focus:outline-none"
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          </button>
        ) : (
          <span className="flex-shrink-0 w-4" />
        )}
        <span className="flex-1">
          {highlightedContent}
          {isCollapsed && line.closingLine && (
            <span className="text-slate-400 dark:text-slate-600 text-xs ml-2">
              ... {parsedLines?.[line.closingLine - 1]?.content.trim()}
            </span>
          )}
        </span>
      </div>
    );
  };

  const highlightJsonLine = (line: string) => {
    // Apply syntax highlighting to a single line
    const elements: React.JSX.Element[] = [];
    let currentIndex = 0;

    const patterns = [
      { regex: /"([^"\\]|\\.)*"(?=\s*:)/g, className: 'text-blue-600 dark:text-blue-400 font-semibold' }, // Keys
      { regex: /"([^"\\]|\\.)*"/g, className: 'text-green-600 dark:text-green-400' }, // String values
      { regex: /\b(true|false|null)\b/g, className: 'text-purple-600 dark:text-purple-400 font-semibold' }, // Booleans and null
      { regex: /\b-?\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'text-orange-600 dark:text-orange-400' }, // Numbers
      { regex: /[{}[\]:,]/g, className: 'text-slate-600 dark:text-slate-400 font-bold' }, // Punctuation
    ];

    const combinedRegex = new RegExp(
      patterns.map(p => `(${p.regex.source})`).join('|'),
      'g'
    );

    let match;
    const matches: Array<{ start: number; end: number; className: string; text: string }> = [];

    while ((match = combinedRegex.exec(line)) !== null) {
      const matchedText = match[0];
      const start = match.index;
      const end = start + matchedText.length;

      let className = 'text-slate-800 dark:text-slate-300';

      if (/"([^"\\]|\\.)*"(?=\s*:)/.test(matchedText)) {
        className = 'text-blue-600 dark:text-blue-400 font-semibold';
      } else if (/"([^"\\]|\\.)*"/.test(matchedText)) {
        className = 'text-green-600 dark:text-green-400';
      } else if (/\b(true|false|null)\b/.test(matchedText)) {
        className = 'text-purple-600 dark:text-purple-400 font-semibold';
      } else if (/\b-?\d+\.?\d*([eE][+-]?\d+)?\b/.test(matchedText)) {
        className = 'text-orange-600 dark:text-orange-400';
      } else if (/[{}[\]:,]/.test(matchedText)) {
        className = 'text-slate-600 dark:text-slate-400 font-bold';
      }

      matches.push({ start, end, className, text: matchedText });
    }

    matches.sort((a, b) => a.start - b.start);

    matches.forEach((match, index) => {
      if (match.start > currentIndex) {
        const beforeText = line.substring(currentIndex, match.start);
        elements.push(
          <span key={`text-${index}`} className="text-slate-800 dark:text-slate-300">
            {beforeText}
          </span>
        );
      }

      elements.push(
        <span key={`match-${index}`} className={match.className}>
          {match.text}
        </span>
      );

      currentIndex = match.end;
    });

    if (currentIndex < line.length) {
      elements.push(
        <span key="text-end" className="text-slate-800 dark:text-slate-300">
          {line.substring(currentIndex)}
        </span>
      );
    }

    return <>{elements}</>;
  };

  if (!parsedLines) {
    // Fallback to non-collapsible syntax highlighting
    return (
      <div className="whitespace-pre-wrap break-words">
        {value.split('\n').map((line, i) => (
          <div key={i} className="flex items-start">
            <span className="flex-shrink-0 w-4" />
            <span className="flex-1">{highlightJsonLine(line)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="whitespace-pre-wrap break-words">
      {parsedLines.map(line => renderLine(line))}
    </div>
  );
};
