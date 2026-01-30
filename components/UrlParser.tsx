import React from 'react';
import { ParsedUrlData } from '../types';

interface UrlParserProps {
  data: ParsedUrlData | null;
}

const UrlParser: React.FC<UrlParserProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          URL Breakdown
        </h3>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
          Valid URL
        </span>
      </div>

      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Segments */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Segments</h4>
          <div className="space-y-3">
            <div className="group">
              <label className="text-xs text-slate-500 block mb-1">Protocol</label>
              <div className="font-mono text-sm text-sky-300 bg-slate-950 p-2 rounded border border-slate-800 break-all">
                {data.protocol || <span className="text-slate-700">-</span>}
              </div>
            </div>
            <div className="group">
              <label className="text-xs text-slate-500 block mb-1">Host</label>
              <div className="font-mono text-sm text-sky-300 bg-slate-950 p-2 rounded border border-slate-800 break-all">
                {data.host || <span className="text-slate-700">-</span>}
              </div>
            </div>
            <div className="group">
              <label className="text-xs text-slate-500 block mb-1">Path</label>
              <div className="font-mono text-sm text-sky-300 bg-slate-950 p-2 rounded border border-slate-800 break-all">
                {data.pathname || <span className="text-slate-700">-</span>}
              </div>
            </div>
            {data.hash && (
               <div className="group">
               <label className="text-xs text-slate-500 block mb-1">Hash</label>
               <div className="font-mono text-sm text-pink-300 bg-slate-950 p-2 rounded border border-slate-800 break-all">
                 {data.hash}
               </div>
             </div>
            )}
          </div>
        </div>

        {/* Query Params */}
        <div className="md:col-span-2 lg:col-span-2">
          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Query Parameters</h4>
          
          {Object.keys(data.params).length === 0 ? (
             <div className="text-slate-600 text-sm italic">No query parameters found.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 font-semibold w-1/3">Key</th>
                    <th className="px-4 py-3 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950">
                  {Object.entries(data.params).map(([key, value]) => (
                    <tr key={key} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-amber-200 break-all">{key}</td>
                      <td className="px-4 py-3 font-mono text-slate-300 break-all">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlParser;
