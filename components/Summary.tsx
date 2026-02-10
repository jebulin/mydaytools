import React, { useMemo } from 'react';
import { ReceiptData, PersonSummary } from '../types';

interface SummaryProps {
  receipt: ReceiptData;
}

export const Summary: React.FC<SummaryProps> = ({ receipt }) => {
  const summary = useMemo<PersonSummary[]>(() => {
    const peopleMap = new Map<string, PersonSummary>();
    
    // Initializing people from assignments
    receipt.items.forEach(item => {
      item.assignedTo.forEach(person => {
        if (!peopleMap.has(person)) {
          peopleMap.set(person, {
            name: person,
            items: [],
            subtotal: 0,
            taxShare: 0,
            tipShare: 0,
            totalOwed: 0
          });
        }
      });
    });

    // Calculate shares
    receipt.items.forEach(item => {
      const splitCount = item.assignedTo.length;
      if (splitCount === 0) return; // Unassigned items are ignored in split for now

      const sharePrice = item.price / splitCount;

      item.assignedTo.forEach(person => {
        const personData = peopleMap.get(person)!;
        personData.items.push(item);
        personData.subtotal += sharePrice;
      });
    });

    // Calculate tax and tip distribution
    // We distribute tax/tip proportionally based on the person's subtotal share of the assigned subtotal
    // Note: If some items are unassigned, the total 'calculated' subtotal might be less than receipt.subtotal.
    // We distribute the TOTAL tax/tip based on the ratio of (PersonSubtotal / TotalAssignedSubtotal).
    
    const totalAssignedSubtotal = Array.from(peopleMap.values()).reduce((sum, p) => sum + p.subtotal, 0);

    Array.from(peopleMap.values()).forEach(person => {
      if (totalAssignedSubtotal > 0) {
        const ratio = person.subtotal / totalAssignedSubtotal;
        person.taxShare = receipt.tax * ratio;
        person.tipShare = receipt.tip * ratio;
        person.totalOwed = person.subtotal + person.taxShare + person.tipShare;
      }
    });

    return Array.from(peopleMap.values());
  }, [receipt]);

  const totalAssigned = summary.reduce((acc, curr) => acc + curr.totalOwed, 0);
  const percentCovered = receipt.total > 0 ? (totalAssigned / receipt.total) * 100 : 0;

  return (
    <div className="bg-white border-t border-slate-200 shadow-lg md:rounded-t-xl overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Summary</h3>
        <div className="text-sm font-medium text-slate-600">
          Covered: <span className={percentCovered >= 99 ? "text-green-600" : "text-amber-600"}>
            {percentCovered.toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="p-4 max-h-48 overflow-y-auto space-y-3">
        {summary.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-2">Start assigning items to see the split.</p>
        ) : (
          summary.map((person) => (
            <div key={person.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-700">{person.name}</span>
                <span className="text-xs text-slate-400">({person.items.length} items)</span>
              </div>
              <span className="font-bold text-slate-900">
                {receipt.currency}{person.totalOwed.toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>
      {summary.length > 0 && (
         <div className="bg-slate-50 px-4 py-2 text-xs text-slate-500 border-t border-slate-100 flex justify-between">
           <span>Total Assigned: {receipt.currency}{totalAssigned.toFixed(2)}</span>
           <span>Receipt Total: {receipt.currency}{receipt.total.toFixed(2)}</span>
         </div>
      )}
    </div>
  );
};
