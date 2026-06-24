import React from 'react';
import { 
  X, User, ShieldAlert, Award, Calendar, FolderHeart, Activity, CheckCircle2 
} from 'lucide-react';
import { BranchManager } from '../data/managersData';

interface ManagerDossierModalProps {
  key?: string;
  manager: BranchManager;
  onClose: () => void;
}

export default function ManagerDossierModal({
  manager,
  onClose
}: ManagerDossierModalProps) {
  // Setup realistic mock certifications grouped by manager specialization
  const certifications = [
    { name: "CAMS - Certified Anti-Money Laundering Specialist", date: "2018-04", id: "CAMS-9022" },
    { name: "CFP - Certified Financial Sovereign Planner", date: "2016-11", id: "CFP-4402" },
    { name: "Apex Senior Treasury Controller Accreditation", date: "2020-08", id: "ASTC-110" },
    { name: "Global Wealth Allocation Risk Auditor (GWARA)", date: "2022-01", id: "GWA-883" }
  ];

  // Helper score multipliers
  const performanceMilestones = [
    { year: "2025", rating: "4.9 / 5.0", status: "Outstanding", comments: "Exceeded all deposit collection goals. Named Regional Manager of the Year." },
    { year: "2024", rating: "4.8 / 5.0", status: "Outstanding", comments: "Secured platinum vault compliance marks with zero security deviations." },
    { year: "2023", rating: "4.7 / 5.0", status: "Exceeds Expectations", comments: "Successfully stabilized local cash clearing nodes during restructuring." }
  ];

  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-[6px] flex items-center justify-center z-[99999] p-4 font-sans text-slate-100 select-none overflow-y-auto">
      <div className="w-[75%] h-[80vh] bg-[#090f2b] border border-[#17235a]/80 rounded-[28px] shadow-2xl relative flex flex-col overflow-hidden">
        {/* Top Header Highlight Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />

        {/* Modal Window Title Area */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#131b45] text-[#d4af37] border border-[#1b2559] flex items-center justify-center font-black text-sm select-none shadow-sm shrink-0 pb-0.5">
              {manager.avatarSeed}
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-[#d4af37] tracking-widest">
                System Dossier & Security clearance
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                VERIFIED CREDENTIAL DIRECTORY FOR: {manager.name} ({manager.id})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all animate-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content - Scrollable sections */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-2">
          
          {/* Header statistics banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#070b28] to-amber-500/5 border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Security Clearance</span>
              <span className="font-mono text-rose-450 font-bold text-[11px] uppercase tracking-wide bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 inline-block mt-0.5">
                {manager.clearance}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Assigned Grade</span>
              <span className="text-amber-400 font-black">{manager.grade}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Authority Directs</span>
              <span className="text-white font-bold">{manager.stats.totalStaff} Subordinates</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Joining Date</span>
              <span className="font-mono text-slate-300">{manager.joinDate}</span>
            </div>
          </div>

          {/* Detailed sections split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* COLUMN 1 Left: Detailed Personal & Employment history */}
            <div className="space-y-5">
              
              {/* Personal details frame */}
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3 text-xs">
                <h4 className="font-black text-[#d4af37] uppercase tracking-widest text-[10px] border-b border-white/5 pb-2 flex items-center gap-2">
                  <User size={12} className="text-[#d4af37]" />
                  <span>Personal Identification File</span>
                </h4>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gender:</span>
                    <span className="text-white font-medium">{manager.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SMTP Address:</span>
                    <span className="text-amber-450 font-mono tracking-tight font-medium text-slate-200">{manager.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Secured Phone Number:</span>
                    <span className="text-slate-300 font-mono">{manager.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Employment Type:</span>
                    <span className="text-white font-bold">Permanent Full-Time Office</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reporting Authority Lead:</span>
                    <span className="text-slate-300 font-medium text-right">{manager.reportingAuthority}</span>
                  </div>
                </div>
              </div>

              {/* Chronological Employment timeline list */}
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3 text-xs">
                <h4 className="font-black text-[#d4af37] uppercase tracking-widest text-[10px] border-b border-white/5 pb-2 flex items-center gap-2">
                  <Calendar size={12} className="text-[#d4af37]" />
                  <span>Employment Timeline history</span>
                </h4>
                <div className="space-y-4 pl-3 relative border-l border-white/10 text-[11px] pt-1">
                  {manager.appointments.history.map((h, idx) => (
                    <div key={idx} className="relative space-y-0.5">
                      {/* Timeline Bullet mark */}
                      <span className="absolute -left-[16.5px] top-1.5 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-[#090f2b]" />
                      <div className="flex justify-between">
                        <span className="font-mono text-[#d4af37] font-black">{h.year}</span>
                        <span className="text-xs text-slate-500">Corporate Assignment</span>
                      </div>
                      <p className="text-white font-bold leading-relaxed">{h.designation}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* COLUMN 2 Right: Certifications & Performance index history */}
            <div className="space-y-5">
              
              {/* Professional Certifications list */}
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3 text-xs">
                <h4 className="font-black text-[#d4af37] uppercase tracking-widest text-[10px] border-b border-white/5 pb-2 flex items-center gap-2">
                  <Award size={12} className="text-[#d4af37]" />
                  <span>Regulatory Certifications</span>
                </h4>
                <div className="space-y-2.5">
                  {certifications.map((c, i) => (
                    <div key={i} className="p-2 bg-slate-900/60 rounded-xl border border-white/5 flex items-start gap-2 text-[10.5px]">
                      <CheckCircle2 size={13} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={3} />
                      <div className="min-w-0">
                        <p className="font-bold text-white leading-normal">{c.name}</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                          ISSUED: {c.date} | ID: {c.id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Audit history metrics */}
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3 text-xs">
                <h4 className="font-black text-[#d4af37] uppercase tracking-widest text-[10px] border-b border-white/5 pb-2 flex items-center gap-2">
                  <Activity size={12} className="text-[#d4af37]" />
                  <span>Performance Audit Scorecards</span>
                </h4>
                <div className="space-y-3 text-[11px]">
                  {performanceMilestones.map((m, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900 border border-white/5 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-mono text-[#d4af37] font-black">Audit Milestone: {m.year}</span>
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {m.rating}
                        </span>
                      </div>
                      <p className="text-white font-bold uppercase text-[9px] tracking-wider">{m.status}</p>
                      <p className="text-slate-400 leading-normal text-[10px] italic">
                        "{m.comments}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Secure Biometric Stamp of authenticity */}
          <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-400/10 flex items-center gap-3.5 mt-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <FolderHeart size={18} />
            </div>
            <div className="text-[10px] leading-relaxed text-slate-400">
              <p className="font-bold text-slate-300">Confidentiality level: Alpha-9 Restricted</p>
              <p className="mt-0.5">
                This document is a certified digital photocopy dossier of Apex Bank employee records. All timestamps are hashed and archived inside the auditing database systems under security code protocol clearance.
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
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
