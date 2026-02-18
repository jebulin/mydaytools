/**
 * Lightweight markdown-to-HTML renderer for blog content.
 * Supports: headings (###), bold (**), italic (*), inline code (`),
 * code blocks (```), unordered lists (- ), ordered lists (1. ), and links.
 */
export function renderMarkdown(md: string): string {
  if (!md) return '';

  // Escape HTML entities first
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    return `<pre class="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 overflow-x-auto border border-slate-200 dark:border-slate-700"><code class="text-sm">${code.trim()}</code></pre>`;
  });

  // Split into paragraphs by double newlines
  const rawBlocks = html.split(/\n\n+/);

  // Further split blocks that contain headings mid-block
  const blocks: string[] = [];
  for (const rawBlock of rawBlocks) {
    const trimmed = rawBlock.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('<pre')) {
      blocks.push(trimmed);
      continue;
    }
    // Split lines, then group: heading lines become their own block
    const lines = trimmed.split('\n');
    let current: string[] = [];
    for (const line of lines) {
      if (/^#{2,3}\s/.test(line.trim())) {
        // Flush any accumulated lines as a block
        if (current.length > 0) {
          blocks.push(current.join('\n'));
          current = [];
        }
        // Heading is its own block
        blocks.push(line);
      } else {
        current.push(line);
      }
    }
    if (current.length > 0) {
      blocks.push(current.join('\n'));
    }
  }

  const rendered = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';

    // Already a code block
    if (trimmed.startsWith('<pre')) return trimmed;

    // Headings
    if (trimmed.startsWith('### ')) {
      const text = processInline(trimmed.slice(4));
      return `<h3 class="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-3">${text}</h3>`;
    }
    if (trimmed.startsWith('## ')) {
      const text = processInline(trimmed.slice(3));
      return `<h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">${text}</h2>`;
    }

    // Check if it's a list block (unordered or ordered)
    const lines = trimmed.split('\n');
    const isUnorderedList = lines.every(l => /^\s*[-*]\s+/.test(l.trim()) || l.trim() === '');
    const isOrderedList = lines.every(l => /^\s*\d+\.\s+/.test(l.trim()) || l.trim() === '');

    if (isUnorderedList && lines.some(l => /^\s*[-*]\s+/.test(l.trim()))) {
      const items = lines
        .filter(l => l.trim())
        .map(l => {
          const content = l.replace(/^\s*[-*]\s+/, '');
          const indent = l.match(/^\s*/)?.[0].length || 0;
          const cls = indent >= 4 ? ' class="ml-6"' : '';
          return `<li${cls}>${processInline(content)}</li>`;
        });
      return `<ul class="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">${items.join('')}</ul>`;
    }

    if (isOrderedList && lines.some(l => /^\s*\d+\.\s+/.test(l.trim()))) {
      const items = lines
        .filter(l => l.trim())
        .map(l => {
          const content = l.replace(/^\s*\d+\.\s+/, '');
          return `<li>${processInline(content)}</li>`;
        });
      return `<ol class="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">${items.join('')}</ol>`;
    }

    // Regular paragraph — process inline elements and handle single newlines
    const processed = lines.map(l => processInline(l)).join('<br/>');
    return `<p class="text-slate-700 dark:text-slate-300 leading-relaxed">${processed}</p>`;
  });

  return rendered.filter(Boolean).join('\n');
}

/** Process inline markdown: bold, italic, code, links */
function processInline(text: string): string {
  let result = text;

  // Inline code
  result = result.replace(/`([^`]+)`/g,
    '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-slate-700">$1</code>'
  );

  // Bold + italic
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-semibold">$1</strong>');

  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-500" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return result;
}
