import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewerProps {
  value: string;
}

interface LineInfo {
  lineNumber: number;
  content: string;
  indent: number;
  hasOpenBracket: boolean; // { or [ at end
  hasCloseBracket: boolean; // } or ] at start
  bracketType?: 'object' | 'array';
  matchingLine?: number; // If this line opens a block, where does it close?
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ value }) => {
  const [collapsedLines, setCollapsedLines] = useState<Set<number>>(new Set());

  // Parse lines and determine hierarchy
  const lines = useMemo(() => {
    const rawLines = value.split('\n');
    const result: LineInfo[] = [];
    const stack: Array<{ line: number; type: 'object' | 'array' }> = [];

    rawLines.forEach((line, index) => {
      const trimmed = line.trim();
      const lineNumber = index + 1;
      const indent = line.search(/\S/);

      // Heuristic: check if line ends with open bracket
      // We accept trailing commas or comments, so we look for structure
      const opensObject = /\{\s*$/.test(trimmed) || /\{\s*\/\/.*/.test(trimmed) || /\{\s*,$/.test(trimmed);
      const opensArray = /\[\s*$/.test(trimmed) || /\[\s*\/\/.*/.test(trimmed) || /\[\s*,$/.test(trimmed);

      // Check if line starts with closing bracket
      const closesObject = /^\}/.test(trimmed);
      const closesArray = /^\]/.test(trimmed);

      let bracketType: 'object' | 'array' | undefined;

      if (opensObject) bracketType = 'object';
      if (opensArray) bracketType = 'array';

      const info: LineInfo = {
        lineNumber,
        content: line,
        indent: indent === -1 ? 0 : indent,
        hasOpenBracket: opensObject || opensArray,
        hasCloseBracket: closesObject || closesArray,
        bracketType
      };

      if (opensObject || opensArray) {
        stack.push({ line: lineNumber, type: opensObject ? 'object' : 'array' });
      }

      // If this line closes a block, try to pop from stack
      if (closesObject || closesArray) {
        let matchIndex = -1;
        // Search backwards for the nearest matching opener
        for (let i = stack.length - 1; i >= 0; i--) {
          const opener = stack[i];
          // Simple match logic: if closing object, find last object opener. Same for array.
          // This handles nested mixed types reasonably well even if malformed, usually.
          if ((closesObject && opener.type === 'object') || (closesArray && opener.type === 'array')) {
            matchIndex = i;
            break;
          }
        }

        if (matchIndex !== -1) {
          const opener = stack[matchIndex];

          // Link opener to this closer line
          // Currently result has lines 0 to (opener.line - 1) populated correctly in order
          // The opener is at index: opener.line - 1
          if (result[opener.line - 1]) {
            result[opener.line - 1].matchingLine = lineNumber;
          }

          // Remove the match from stack. We remove only the match to be robust to interleaving errors?
          // Actually standard parsing pops everything above. Let's do that for now.
          // If someone writes bad JSON, behavior is undefined anyway.
          stack.splice(matchIndex, 1);
        }
      }

      result.push(info);
    });

    return result;
  }, [value]);

  const toggleCollapse = (lineNumber: number) => {
    setCollapsedLines(prev => {
      const next = new Set(prev);
      if (next.has(lineNumber)) {
        next.delete(lineNumber);
      } else {
        next.add(lineNumber);
      }
      return next;
    });
  };

  const highlightLine = (text: string) => {
    // Reusing syntax highlight logic
    const patterns = [
      { regex: /"([^"\\]|\\.)*"(?=\s*:)/g, className: 'text-pink-600 dark:text-pink-400 font-semibold' },
      { regex: /"([^"\\]|\\.)*"/g, className: 'text-green-600 dark:text-green-400' },
      { regex: /\b(true|false|null)\b/g, className: 'text-purple-600 dark:text-purple-400 font-semibold' },
      { regex: /\b-?\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'text-orange-600 dark:text-orange-400' },
      { regex: /[{}[\]:,]/g, className: 'text-slate-600 dark:text-slate-400 font-bold' },
    ];

    const elements: React.JSX.Element[] = [];
    let currentIndex = 0;

    // Combine patterns
    const combinedRegex = new RegExp(
      patterns.map(p => `(${p.regex.source})`).join('|'),
      'g'
    );

    let match;
    const matches: Array<{ start: number; end: number; className: string; text: string }> = [];

    while ((match = combinedRegex.exec(text)) !== null) {
      const matchedText = match[0];
      let className = 'text-slate-800 dark:text-slate-300';
      if (/"([^"\\]|\\.)*"(?=\s*:)/.test(matchedText)) className = patterns[0].className;
      else if (/"([^"\\]|\\.)*"/.test(matchedText)) className = patterns[1].className;
      else if (/\b(true|false|null)\b/.test(matchedText)) className = patterns[2].className;
      else if (/\b-?\d+\.?\d*([eE][+-]?\d+)?\b/.test(matchedText)) className = patterns[3].className;
      else if (/[{}[\]:,]/.test(matchedText)) className = patterns[4].className;

      matches.push({ start: match.index, end: match.index + matchedText.length, className, text: matchedText });
    }

    matches.sort((a, b) => a.start - b.start);

    matches.forEach((m, i) => {
      if (m.start > currentIndex) {
        elements.push(<span key={i + 'pre'} className="text-slate-800 dark:text-slate-300">{text.substring(currentIndex, m.start)}</span>);
      }
      elements.push(<span key={i} className={m.className}>{m.text}</span>);
      currentIndex = m.end;
    });

    if (currentIndex < text.length) {
      elements.push(<span key="end" className="text-slate-800 dark:text-slate-300">{text.substring(currentIndex)}</span>);
    }

    return elements.length > 0 ? elements : <span className="text-slate-800 dark:text-slate-300">{text}</span>;
  };

  // Build a render list considering visibility
  interface RenderItem {
    line: LineInfo;
    isVisible: boolean;
    isCollapsed?: boolean;
    closingContent?: string;
  }

  // Determine visibility logic
  // A line is visible if no parent range covering it is collapsed.

  // We can do a single pass to map visibility.
  // Actually, we can just iterate.

  const toRender: React.ReactNode[] = [];

  // Find all collapsed ranges active
  // Map <startLine, endLine>
  const activeCollapsedRanges: [number, number][] = [];
  collapsedLines.forEach(startLine => {
    const line = lines[startLine - 1];
    if (line && line.matchingLine) {
      activeCollapsedRanges.push([startLine, line.matchingLine]);
    }
  });

  // Sort ranges by start line? Not strictly needed if we check all.
  // Optimization: For huge files, this double loop is bad. But for typical web JSON (couple MB), it's arguably okay.
  // Better: Maintain a `currentCollapse` depth or stack during render pass? No, because they can be nested.

  lines.forEach((line) => {
    let isVisible = true;
    let collapsedContent = '';

    // Check if this line is inside any collapsed range
    // A line L is hidden if there exists a range [S, E] in activeCollapsedRanges such that S < L <= E.
    // Note: We hide the closing brace line too (L == E) if we want to show it appended to S.

    for (const [start, end] of activeCollapsedRanges) {
      if (line.lineNumber > start && line.lineNumber <= end) {
        isVisible = false;
        break;
      }
    }

    const isCollapsable = !!line.matchingLine;
    const isCollapsed = collapsedLines.has(line.lineNumber);

    if (!isVisible) return;

    // If this line is the start of a collapse, we need the closing line content
    let closingContent = '';
    if (isCollapsed && line.matchingLine) {
      const closingLine = lines[line.matchingLine - 1];
      if (closingLine) {
        closingContent = closingLine.content.trim();
      }
    }

    toRender.push(
      <div key={line.lineNumber} className="group flex hover:bg-slate-50 dark:hover:bg-slate-800/50 min-h-[1.5rem] items-start">
        {/* Gutter with Line Number and Toggle */}
        <div className="w-12 pr-2 flex-shrink-0 flex justify-end gap-1 text-slate-400 select-none items-center pt-[2px]">
          <span className="text-xs text-slate-300 dark:text-slate-600 font-mono opacity-50">{line.lineNumber}</span>
          <div className="w-4 flex justify-center">
            {isCollapsable && (
              <button
                onClick={() => toggleCollapse(line.lineNumber)}
                className="hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none transition-colors"
              >
                {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 break-words break-all font-mono text-sm leading-6">
          <div className="flex flex-wrap items-center gap-1">
            <span className="whitespace-pre-wrap">{highlightLine(line.content)}</span>
            {isCollapsed && (
              <button
                onClick={() => toggleCollapse(line.lineNumber)}
                className="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs select-none hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center"
              >
                ... {closingContent}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="w-full h-full overflow-auto bg-white dark:bg-slate-900 pb-10">
      {toRender}
    </div>
  );
};
