import React from 'react';

interface SyntaxHighlightedJsonProps {
  value: string;
  isValid: boolean;
}

export const SyntaxHighlightedJson: React.FC<SyntaxHighlightedJsonProps> = ({ value, isValid }) => {
  if (!value.trim()) {
    return <span className="text-slate-800 dark:text-slate-300">{value}</span>;
  }

  const highlightJson = (jsonString: string): React.JSX.Element[] => {
    const elements: React.JSX.Element[] = [];
    let currentIndex = 0;

    // Regex patterns for different JSON elements
    const patterns = [
      { regex: /"([^"\\]|\\.)*"(?=\s*:)/g, className: 'text-pink-600 dark:text-pink-400 font-semibold' }, // Keys
      { regex: /"([^"\\]|\\.)*"/g, className: 'text-green-600 dark:text-green-400' }, // String values
      { regex: /\b(true|false|null)\b/g, className: 'text-purple-600 dark:text-purple-400 font-semibold' }, // Booleans and null
      { regex: /\b-?\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'text-orange-600 dark:text-orange-400' }, // Numbers
      { regex: /[{}[\]:,]/g, className: 'text-slate-600 dark:text-slate-400 font-bold' }, // Punctuation
    ];

    // Create a combined regex to find all matches
    const combinedRegex = new RegExp(
      patterns.map(p => `(${p.regex.source})`).join('|'),
      'g'
    );

    let match;
    const matches: Array<{ start: number; end: number; className: string; text: string }> = [];

    // Find all matches
    while ((match = combinedRegex.exec(jsonString)) !== null) {
      const matchedText = match[0];
      const start = match.index;
      const end = start + matchedText.length;

      // Determine which pattern matched
      let className = 'text-slate-800 dark:text-slate-300';

      if (/"([^"\\]|\\.)*"(?=\s*:)/.test(matchedText)) {
        className = 'text-pink-600 dark:text-pink-400 font-semibold'; // Keys
      } else if (/"([^"\\]|\\.)*"/.test(matchedText)) {
        className = 'text-green-600 dark:text-green-400'; // String values
      } else if (/\b(true|false|null)\b/.test(matchedText)) {
        className = 'text-purple-600 dark:text-purple-400 font-semibold'; // Booleans/null
      } else if (/\b-?\d+\.?\d*([eE][+-]?\d+)?\b/.test(matchedText)) {
        className = 'text-orange-600 dark:text-orange-400'; // Numbers
      } else if (/[{}[\]:,]/.test(matchedText)) {
        className = 'text-slate-600 dark:text-slate-400 font-bold'; // Punctuation
      }

      matches.push({ start, end, className, text: matchedText });
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Build the highlighted output
    matches.forEach((match, index) => {
      // Add text before this match
      if (match.start > currentIndex) {
        const beforeText = jsonString.substring(currentIndex, match.start);
        elements.push(
          <span key={`text-${index}`} className="text-slate-800 dark:text-slate-300">
            {beforeText}
          </span>
        );
      }

      // Add the highlighted match
      elements.push(
        <span key={`match-${index}`} className={match.className}>
          {match.text}
        </span>
      );

      currentIndex = match.end;
    });

    // Add any remaining text
    if (currentIndex < jsonString.length) {
      elements.push(
        <span key="text-end" className="text-slate-800 dark:text-slate-300">
          {jsonString.substring(currentIndex)}
        </span>
      );
    }

    return elements;
  };

  return <>{highlightJson(value)}</>;
};
