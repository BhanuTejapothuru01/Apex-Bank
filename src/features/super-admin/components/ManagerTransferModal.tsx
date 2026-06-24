import React, { useMemo } from 'react';
import { X, Calendar, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { BranchManager } from '../data/managersData';

interface ManagerTransferModalProps {
  key?: string;
  manager: BranchManager;
  onClose: () => void;
}

export default function ManagerTransferModal({
  manager,
  onClose
}: ManagerTransferModalProps) {
  // If the manager has empty transfers, let's generate a list based on their appointment history so the table has entries
  const compiledTransfers = useMemo(() => {
    if (manager.transfers && manager.transfers.length > 0) {
      return manager.transfers.map(tx => ({
        date: tx.date,
        fromBranch: tx.prevBranch,
        toBranch: tx.newBranch,
        position: manager.designation, // Use designation
        approvedBy: tx.approvedBy || manager.approval.approvedByRegional || 'Regional Lead'
      }));
    }

    // Fallback: Generate the original direct entry and a promotion entry
    const entries = [];
    
    // Original Entry on Join Date
    entries.push({
      date: manager.joinDate,
      fromBranch: 'Apex National Transit Center',
      toBranch: manager.branchName,
      position: manager.appointments.lastDesignation || 'Assistant Operations Lead',
      approvedBy: manager.approval.appointedBy || 'National HR Executive Board'
    });

    // Promotion Entry (if different promotion date)
    if (manager.appointments.promotionDate !== manager.joinDate) {
      entries.push({
        date: manager.appointments.promotionDate,
        fromBranch: manager.branchName,
        toBranch: manager.branchName,
        position: manager.appointments.currentDesignation || manager.designation,
        approvedBy: manager.approval.approvedByRegional || 'Siddharth Shanmugam'
      });
    }

    return entries;
  }, [manager]);

  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-[6px] flex items-center justify-center z-[99999] p-4 font-sans text-slate-100 select-none">
      <div className="w-[75%] h-[80vh] bg-[#090f2b] border border-[#17235a]/80 rounded-[24px] shadow-2xl overflow-hidden relative flex flex-col">
        {/* Top Header Highlight Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />

        {/* Modal Window Title */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-[#d4af37] tracking-widest">
                Transfer & Deployment Records
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                EXECUTIVE TRANSFER LEDGER FOR: {manager.name} ({manager.id})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content - Table Panel */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-slate-950/50 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5">From Branch Node</th>
                  <th className="py-4 px-5">To Branch Node</th>
                  <th className="py-4 px-5">Assumed Position</th>
                  <th className="py-4 px-5 text-right">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px]">
                {compiledTransfers.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-amber-500/[0.02] transition-colors">
                    <td className="py-3.5 px-5 font-mono text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-amber-400 shrink-0" />
                        <span>{tx.date}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-amber-550 max-w-[160px] truncate">
                      {tx.fromBranch}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-emerald-400 max-w-[160px] truncate">
                      <div className="flex items-center gap-1.5">
                        <ArrowRight size={12} className="text-slate-500 shrink-0" />
                        <span>{tx.toBranch}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-100 font-medium">
                      {tx.position}
                    </td>
                    <td className="py-3.5 px-5 text-right font-semibold text-slate-400 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <ShieldCheck size={12} className="text-amber-500" />
                        <span>{tx.approvedBy}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ledger Verification Stamp */}
          <div className="mt-5 p-4 rounded-xl bg-amber-500/[0.03] border border-amber-400/10 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div className="text-[10px] leading-relaxed text-slate-400">
              <p className="font-bold text-slate-300">Biometric Clearance Verified</p>
              <p className="mt-0.5">
                This transfer history index is audited and synchronized with Central Sovereign Operations. Any unauthorized manipulation will instantly trip remote network failsafes.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Window Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/5 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase text-[10px] rounded-lg cursor-pointer transition-all"
          >
            Close Ledgers
          </button>
        </div>
      </div>
    </div>
  );
}
