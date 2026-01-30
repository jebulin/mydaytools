import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonTreeProps {
  data: any;
  name?: string; // Key name if parent is object
  isLast?: boolean; // To show comma
  initiallyExpanded?: boolean;
}

export const JsonTree: React.FC<JsonTreeProps> = ({ data, name, isLast = true, initiallyExpanded = true }) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  const isObject = data !== null && typeof data === 'object';
  const isArray = Array.isArray(data);
  const isEmpty = isObject && Object.keys(data).length === 0;

  // Render Primitive
  if (!isObject) {
    let valueColor = 'text-green-600 dark:text-green-400'; // Default string
    if (typeof data === 'number') valueColor = 'text-orange-600 dark:text-orange-400';
    if (typeof data === 'boolean') valueColor = 'text-blue-600 dark:text-blue-400';
    if (data === null) valueColor = 'text-gray-500 dark:text-gray-400';
    
    const valueDisplay = typeof data === 'string' ? `"${data}"` : String(data);

    return (
      <div className="font-mono text-sm leading-6 hover:bg-slate-100 dark:hover:bg-white/5 pl-4 rounded transition-colors duration-150">
        {name && <span className="text-purple-700 dark:text-purple-300 mr-1">"{name}":</span>}
        <span className={`${valueColor} break-words`}>{valueDisplay}</span>
        {!isLast && <span className="text-slate-500">,</span>}
      </div>
    );
  }

  // Render Object/Array
  const keys = Object.keys(data);
  const opening = isArray ? '[' : '{';
  const closing = isArray ? ']' : '}';
  const lengthInfo = isArray ? `${keys.length} items` : `${keys.length} keys`;

  if (isEmpty) {
     return (
        <div className="font-mono text-sm leading-6 hover:bg-slate-100 dark:hover:bg-white/5 pl-4 rounded transition-colors duration-150">
            {name && <span className="text-purple-700 dark:text-purple-300 mr-1">"{name}":</span>}
            <span className="text-slate-600 dark:text-slate-400">{opening}{closing}</span>
            {!isLast && <span className="text-slate-500">,</span>}
        </div>
     );
  }

  return (
    <div className="font-mono text-sm leading-6">
      <div className="flex items-start hover:bg-slate-100 dark:hover:bg-white/5 rounded pl-1 transition-colors duration-150">
        <button 
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="p-0.5 mt-1 mr-1 text-slate-500 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        
        <div className="flex-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
           {name && <span className="text-purple-700 dark:text-purple-300 mr-1">"{name}":</span>}
           <span className="text-slate-600 dark:text-slate-400">{opening}</span>
           
           {!expanded && (
             <span className="text-slate-400 dark:text-slate-500 text-xs ml-2 select-none bg-slate-200 dark:bg-slate-800/50 px-1 rounded inline-block">
                {lengthInfo} ... {closing}{!isLast && ','}
             </span>
           )}
        </div>
      </div>

      {expanded && (
        <div className="pl-2 border-l border-slate-200 dark:border-slate-700/50 ml-2.5">
          {keys.map((key, index) => (
            <JsonTree 
              key={key} 
              name={isArray ? undefined : key} 
              data={data[key]} 
              isLast={index === keys.length - 1} 
            />
          ))}
          <div className="text-slate-600 dark:text-slate-400 pl-4">{closing}{!isLast && ','}</div>
        </div>
      )}
    </div>
  );
};
