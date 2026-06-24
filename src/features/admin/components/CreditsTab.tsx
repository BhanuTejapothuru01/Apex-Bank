import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Percent, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  TrendingUp, 
  Sparkles, 
  Info,
  ChevronRight,
  Calculator,
  Zap,
  Crown,
  Lock,
  Unlock,
  Settings,
  ShieldCheck
} from 'lucide-react';

interface CreditsTabProps {
  balance: number;
  onBalanceChange: (amt: number) => void;
  onAddTransaction: (name: string, type: 'Income' | 'Expense', amount: number, recipient: string, status?: 'Completed' | 'Pending' | 'Failed') => void;
  currentLoans: number;
  onLoansChange: (amt: number) => void;
  onSyncInterestRate?: (rate: number) => void;
}

interface Tier {
  name: string;
  limit: number;
  discount: number;
  color: string;
  badgeBg: string;
  badgeTextColor: string;
  minBalance: number;
  perks: string[];
}

const TIERS: Tier[] = [
  { 
    name: 'Gold Standard Dark Pink', 
    limit: 50000, 
    discount: 0.50, 
    color: 'from-pink-500 via-pink-600 to-pink-700', 
    badgeBg: 'bg-pink-500/10', 
    badgeTextColor: 'text-pink-800', 
    minBalance: 0,
    perks: ['0.50% APR discount', 'Standard airport lounge access', '$5k overdraft protection']
  },
  { 
    name: 'Platinum Elite', 
    limit: 150000, 
    discount: 1.25, 
    color: 'from-pink-500 via-indigo-500 to-purple-600', 
    badgeBg: 'bg-pink-500/10', 
    badgeTextColor: 'text-pink-800', 
    minBalance: 200000,
    perks: ['1.25% APR discount', 'Elite travel tier clearance', '$15k overdraft protection']
  },
  { 
    name: 'Master Infinite', 
    limit: 300000, 
    discount: 2.20, 
    color: 'from-purple-800 via-purple-900 to-pink-700', 
    badgeBg: 'bg-indigo-500/10', 
    badgeTextColor: 'text-indigo-800', 
    minBalance: 400000,
    perks: ['2.20% APR discount', '24/7 dedicated private concierge', '$50k overdraft protection']
  },
  { 
    name: 'Sovereign Apex', 
    limit: 600000, 
    discount: 3.50, 
    color: 'from-fuchsia-950 via-purple-900 to-pink-800', 
    badgeBg: 'bg-purple-950/20', 
    badgeTextColor: 'text-purple-950', 
    minBalance: 550000,
    perks: ['3.50% APR discount', 'Custom metal physical block key', 'Uncapped corporate overdraft']
  },
];

export default function CreditsTab({ 
  balance, 
  onBalanceChange, 
  onAddTransaction, 
  currentLoans, 
  onLoansChange,
  onSyncInterestRate
 }: CreditsTabProps) {
  // Creative Credit Limit states
  const [selectedTierIdx, setSelectedTierIdx] = useState<number>(0);
  const [allocationRatio, setAllocationRatio] = useState<number>(65); // percentage allocated to Corporate Purchases vs Liquid Cash (rest)
  const [extraOverdraftBoost, setExtraOverdraftBoost] = useState<number>(0);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  const [boostToast, setBoostToast] = useState<string | null>(null);

  // Auto-apply tier APR discount from active standard tier to calculator
  const applyTierDiscount = () => {
    const discount = TIERS[selectedTierIdx].discount;
    const baseRate = 7.5; // Standard base rate
    const finalRate = Math.max(1.5, baseRate - discount);
    if (onSyncInterestRate) {
      onSyncInterestRate(finalRate);
    }
    setBoostToast(`Applied standard APR discount of -${discount}% from your "${TIERS[selectedTierIdx].name}" tier settings! Synced to Loans Studio.`);
    setTimeout(() => setBoostToast(null), 3500);
  };

  // Run dynamic limit elevation trigger
  const handleOverdraftActivation = () => {
    setIsBoosting(true);
    setBoostToast(null);
    setTimeout(() => {
      setIsBoosting(false);
      setExtraOverdraftBoost(prev => prev + 15000);
      setBoostToast("Apex Treasury has provisioned an instantaneous +$15,000 overdraft asset cushion!");
      onAddTransaction(
        `Dynamic Limit elevation: Approved +$15k Overdraft Buffer`,
        'Income',
        0,
        'Apex Sovereign Line Desk',
        'Completed'
      );
      setTimeout(() => setBoostToast(null), 4000);
    }, 1200);
  };

  // Calculate customized limits
  const activeTier = TIERS[selectedTierIdx];
  const totalApprovedLimit = activeTier.limit + extraOverdraftBoost;
  const corporateLimitVal = Math.round(totalApprovedLimit * (allocationRatio / 100));
  const liquidCashLimitVal = totalApprovedLimit - corporateLimitVal;

  return (
    <div className="space-y-8">
      
      {/* 1. CREATIVE CREDIT STRATOSPHERE LIMIT MODULE */}
      <div className="rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-800 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-purple-950">Dynamic Capital Lines & Premium Tiers</h3>
              <p className="text-xs text-purple-950/50 font-semibold">Calibrate credit headroom, define custom usage parameters, and synchronize special APR reductions.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleOverdraftActivation}
              disabled={isBoosting}
              className="py-2 px-3.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-900 font-extrabold text-[11px] text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              {isBoosting ? "Synthesizing Buffer..." : "Inject $15K Overdraft Buffer"}
            </button>
          </div>
        </div>

        {/* Dynamic Cardholders Tier Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((tier, index) => {
            const isSelected = selectedTierIdx === index;
            const isLocked = balance < tier.minBalance;
            return (
              <div
                key={tier.name}
                onClick={() => {
                  if (!isLocked) {
                    setSelectedTierIdx(index);
                  }
                }}
                className={`relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between h-44 select-none ${
                  isLocked 
                    ? 'bg-purple-950/5 border-purple-950/5 opacity-60 cursor-not-allowed' 
                    : isSelected
                      ? 'bg-gradient-to-br text-white shadow-md cursor-pointer ' + tier.color + ' border-transparent scale-[1.01]'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 cursor-pointer text-purple-950'
                }`}
              >
                {/* Locking status symbol */}
                <div className="absolute top-3.5 right-3.5">
                  {isLocked ? (
                    <div className="w-6 h-6 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  ) : isSelected ? (
                    <div className="w-6 h-6 rounded-lg bg-white/20 text-white flex items-center justify-center">
                      <Crown className="w-3.5 h-3.5 animate-bounce" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-purple-950/5 text-purple-950/40 flex items-center justify-center">
                      <Unlock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 pr-6">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-purple-950/40'}`}>
                    Active Level {index + 1}
                  </span>
                  <h4 className="font-display font-black text-sm tracking-tight">{tier.name}</h4>
                </div>

                <div className="space-y-1">
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-pink-100' : 'text-purple-950/50'}`}>Authorized Base Limit</span>
                  <span className="text-xl font-mono font-black block leading-none tracking-tight">
                    ${tier.limit.toLocaleString()}
                  </span>
                </div>

                {/* Micro details or locks */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] font-extrabold tracking-wide uppercase">
                    {isLocked ? `Requires $${tier.minBalance.toLocaleString()}` : `APR Discount -${tier.discount}%`}
                  </span>
                  {!isLocked && isSelected && (
                    <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-black">Applied</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tier Management Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-purple-950/5 rounded-2xl p-5 border border-purple-950/5">
          
          {/* Section A: Allocation calibration sliders */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-950/60 font-sans">
                Line Allocation Strategy
              </span>
              <span className="text-xs font-bold text-purple-950 uppercase bg-purple-950/10 px-2.5 py-1 rounded-full">
                {allocationRatio}% Purchase / {100 - allocationRatio}% Cash split
              </span>
            </div>

            <input 
              type="range"
              min="20"
              max="90"
              value={allocationRatio}
              onChange={(e) => setAllocationRatio(Number(e.target.value))}
              className="w-full h-2 bg-purple-950/10 rounded-lg appearance-none cursor-pointer accent-purple-800"
            />

            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Asset Box 1 */}
              <div className="bg-white/40 p-3 rounded-xl border border-white/60">
                <span className="text-[9px] font-bold text-purple-950/40 uppercase block">In-Store Corporate Purchases limit</span>
                <span className="font-mono text-base font-black text-purple-950 block mt-1">
                  ${corporateLimitVal.toLocaleString()}
                </span>
                <div className="w-full h-1.5 bg-purple-950/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-purple-800" style={{ width: `${allocationRatio}%` }}></div>
                </div>
              </div>

              {/* Asset Box 2 */}
              <div className="bg-white/40 p-3 rounded-xl border border-white/60">
                <span className="text-[9px] font-bold text-purple-950/40 uppercase block">Liquid Cash Advances limit</span>
                <span className="font-mono text-base font-black text-purple-950 block mt-1">
                  ${liquidCashLimitVal.toLocaleString()}
                </span>
                <div className="w-full h-1.5 bg-purple-950/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-pink-600" style={{ width: `${100 - allocationRatio}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Perks sync stats indicator */}
          <div className="p-4 bg-white/30 border border-white/60 rounded-xl flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-purple-950 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
                Active Tier Credentials
              </div>
              <ul className="text-[11px] text-purple-950/60 font-semibold space-y-1 list-disc pl-4 mt-2">
                {activeTier.perks.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={applyTierDiscount}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-purple-950 hover:bg-purple-900 hover:shadow text-white text-[10.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Percent className="w-3.5 h-3.5" /> Sync APR Discount to Studio
            </button>
          </div>
        </div>

        {/* Visual toast message inside container */}
        <AnimatePresence>
          {boostToast && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-50/75 text-emerald-950 text-xs font-bold text-center leading-relaxed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              {boostToast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
