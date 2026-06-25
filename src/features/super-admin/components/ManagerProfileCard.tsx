import React from 'react';
import { Users, MapPin, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { BranchManager } from '../data/managersData';

interface ManagerProfileCardProps {
  key?: string;
  manager: BranchManager;
  isSelected?: boolean;
  onViewProfile?: () => void;
  onContactEmployee?: () => void;
}

export default function ManagerProfileCard({
  manager,
  isSelected = false,
  onViewProfile
}: ManagerProfileCardProps) {
  return (
    <motion.div
      id={`manager-card-${manager.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(212, 175, 55, 0.25)' }}
      onClick={() => {
        if (onViewProfile) onViewProfile();
      }}
      className={`relative rounded-2xl bg-[#FCE7F3]/90 p-4 transition-all duration-300 flex flex-col justify-between box-border select-none w-full max-w-full h-[200px] text-[#4A044E] border shadow-2xl cursor-pointer ${
        isSelected
          ? 'border-[#d4af37] ring-2 ring-[#d4af37]/50 bg-[#FBCFE8]'
          : 'border-[#F9A8D4] hover:border-[#d4af37]'
      }`}
    >
      {/* Decorative Status Line */}
      <div
        className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl transition-all duration-300 ${
          manager.status === 'Active'
            ? 'bg-emerald-400'
            : manager.status === 'On Leave'
            ? 'bg-amber-400'
            : 'bg-rose-400'
        }`}
      />

      {/* Top Section: Profile & Status */}
      <div className="flex items-start justify-between w-full mt-1.5 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#FBCFE8] text-[#d4af37] border border-[#F9A8D4] flex items-center justify-center font-black text-sm select-none shadow-sm shrink-0 pb-0.5">
            {manager.avatarSeed}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-black text-[#4A044E] leading-tight tracking-tight truncate w-full max-w-[150px]">
              {manager.name}
            </h4>
            <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 mt-1 inline-block">
              {manager.id}
            </span>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider border shrink-0 ${
            manager.status === 'Active'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
              : manager.status === 'On Leave'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
          }`}
        >
          {manager.status}
        </span>
      </div>

      {/* Middle Section: Branch info */}
      <div className="space-y-1 mt-2.5 text-left flex-1 min-w-0 font-sans">
        <div className="flex items-center gap-1.5 text-xs text-[#4A044E]">
          <Building2 size={12} className="text-[#d4af37] shrink-0" />
          <span className="font-extrabold truncate text-[11px] leading-tight" title={manager.branchName}>
            {manager.branchName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#BE185D]/75">
          <MapPin size={12} className="text-[#BE185D]/75/80 shrink-0" />
          <span className="font-medium truncate leading-tight" title={manager.branchLocation}>
            {manager.branchLocation}
          </span>
        </div>
      </div>

      {/* Bottom Section: Total Staff Under Management */}
      <div className="pt-2 border-t border-[#F9A8D4]/30 flex items-center justify-between text-[#BE185D]/75 font-bold font-sans">
        <span className="text-[10px] uppercase tracking-wider text-[#BE185D]/75 flex items-center gap-1">
          <Users size={11} className="text-[#d4af37]" />
          <span>Staff Managed</span>
        </span>
        <span className="font-mono text-xs font-black text-[#831843] bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
          {manager.stats.totalStaff} Employees
        </span>
      </div>
    </motion.div>
  );
}

