import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  HandCoins, 
  History, 
  TrendingUp, 
  Coins, 
  PiggyBank, 
  Home, 
  CheckCircle2, 
  CreditCard as CardIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SavingTarget } from '../types';

interface MainCardsProps {
  balance: number;
  onBalanceChange: (amt: number) => void;
  savingTargets: SavingTarget[];
  onAddTransaction: (name: string, type: 'Income' | 'Expense', amount: number, recipient: string, status?: 'Completed' | 'Pending' | 'Failed') => void;
  onAddSavingTarget?: (name: string, targetValue: number, current: number, color: string) => void;
}

export default function MainCards({ balance, onBalanceChange, savingTargets, onAddTransaction, onAddSavingTarget }: MainCardsProps) {
  const [activeModal, setActiveModal] = useState<'topUp' | 'transfer' | 'request' | 'history' | 'addTarget' | null>(null);
  const [inputAmount, setInputAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [customName, setCustomName] = useState('');
  const [targetName, setTargetName] = useState('Loans');
  const [newTargetCap, setNewTargetCap] = useState('');
  const [newTargetColor, setNewTargetColor] = useState('#8b5cf6');
  const [cardTheme, setCardTheme] = useState<'violet' | 'emerald'>('violet');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(inputAmount);
    if (isNaN(amt) || amt <= 0) return;
    
    onBalanceChange(balance + amt);
    onAddTransaction('Top Up Account', 'Income', amt, 'Self');
    setActiveModal(null);
    setInputAmount('');
    showToast(`Successfully topped up $${amt.toLocaleString()}!`);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(inputAmount);
    if (isNaN(amt) || amt <= 0 || amt > balance) return;

    onBalanceChange(balance - amt);
    onAddTransaction(customName || 'Funds Transfer', 'Expense', amt, recipient || 'Unknown');
    setActiveModal(null);
    setInputAmount('');
    setRecipient('');
    setCustomName('');
    showToast(`Successfully sent $${amt.toLocaleString()} to ${recipient || 'recipient'}!`);
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(inputAmount);
    if (isNaN(amt) || amt <= 0) return;

    onAddTransaction(customName || 'Payment Request', 'Income', amt, recipient || 'Requestee');
    setActiveModal(null);
    setInputAmount('');
    setRecipient('');
    setCustomName('');
    showToast(`Requested $${amt.toLocaleString()} from ${recipient}! Status is set to Pending.`);
  };

  const handleAddTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cap = parseFloat(newTargetCap);
    const initialAmt = parseFloat(inputAmount);
    if (!targetName.trim() || isNaN(cap) || cap <= 0) {
      showToast("Please provide valid Target details.");
      return;
    }
    const validatedInitial = isNaN(initialAmt) ? 0 : initialAmt;
    if (onAddSavingTarget) {
      onAddSavingTarget(targetName, cap, validatedInitial, newTargetColor);
    } else {
      showToast(`Added financial target ${targetName}!`);
    }
    setActiveModal(null);
    setTargetName('Deposits');
    setNewTargetCap('');
    setInputAmount('');
  };

  return (
    <div className="space-y-6">
      {/* CARD & HERO SECTION WITH AMBIENT GLASSMORPHISM */}
      <div className="relative overflow-hidden rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-purple-950/50 uppercase tracking-widest font-sans">
            Personal Wallet
          </span>
          {/* Card Style Customizer inside preview! */}
          <div className="flex gap-1.5 p-1 bg-purple-950/5 rounded-lg border border-purple-950/10 scale-90">
            <button 
              onClick={() => setCardTheme('violet')}
              className={`w-4 h-4 rounded-full bg-indigo-600 transition-transform ${cardTheme === 'violet' ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
              title="Purple Glass Theme"
            />
            <button 
              onClick={() => setCardTheme('emerald')}
              className={`w-4 h-4 rounded-full bg-teal-700 transition-transform ${cardTheme === 'emerald' ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
              title="Emerald Deep Theme"
            />
          </div>
        </div>

        {/* Andrew Forbist High fidelity Card */}
        <div className="relative">
          <motion.div
            animate={{ 
              background: cardTheme === 'violet' 
                ? 'linear-gradient(135deg, rgba(76, 29, 149, 0.9) 0%, rgba(139, 92, 246, 0.75) 50%, rgba(236, 72, 153, 0.7) 100%)' 
                : 'linear-gradient(135deg, rgba(13, 79, 63, 0.9) 0%, rgba(20, 110, 90, 0.75) 50%, rgba(34, 197, 94, 0.7) 100%)'
            }}
            transition={{ duration: 0.5 }}
            className="w-full aspect-[1.65/1] rounded-2xl p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-xl shadow-purple-950/10 border border-white/25"
          >
            {/* Hologram waves & chip styling reflecting images */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -z-10 translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-pink-500/10 rounded-full blur-2xl -z-10 -translate-x-10 translate-y-10"></div>
            
            {/* Wave Pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 C30,70 70,30 100,50 L100,100 L0,100 Z" fill="currentColor"></path>
            </svg>

            {/* Top row */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/70">Cardholder</p>
                <h3 className="font-display font-bold text-lg leading-tight tracking-wide drop-shadow-sm">Andrew Forbist</h3>
              </div>
              
              {/* Metallic Chip & Wireless Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-6 bg-gradient-to-tr from-amber-200 to-yellow-400/90 rounded-md shadow-inner border border-amber-300 relative overflow-hidden">
                  <div className="absolute inset-x-1.5 inset-y-1 border-r border-amber-600/40"></div>
                  <div className="absolute inset-y-1.5 inset-x-1 border-b border-amber-600/40"></div>
                </div>
                <svg className="w-4 h-4 text-white/55 rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M2.25 21h19.5M2.25 21V14.14M22.5 14.14M12 9.75v3.25m0 0H9m3 0h3"></path>
                </svg>
              </div>
            </div>

            {/* Middle Balance Amount */}
            <div className="mt-2.5">
              <p className="text-[9px] uppercase font-bold tracking-widest text-white/60">Balance Amount</p>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl lg:text-3xl font-extrabold tracking-tight">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Bottom Card details */}
            <div className="flex justify-between items-end mt-2">
              <div className="flex gap-4">
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-white/50">Expiry</p>
                  <p className="font-mono text-xs font-semibold">11/29</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-white/50">CVV</p>
                  <p className="font-mono text-xs font-semibold">323</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-90">
                <div className="w-6 h-6 rounded-full bg-pink-500/70 translate-x-2"></div>
                <div className="w-6 h-6 rounded-full bg-purple-500/80"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Shortcut Buttons matching image 1 */}
        <div className="grid grid-cols-4 gap-2.5 mt-5">
          {[
            { id: 'topUp', label: 'Top Up', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-900', icon: Plus },
            { id: 'transfer', label: 'Transfer', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-900', icon: ArrowUpRight },
            { id: 'request', label: 'Request', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-900', icon: HandCoins },
            { id: 'history', label: 'History', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-900', icon: History }
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                id={`card-action-${btn.id}`}
                onClick={() => {
                  if (btn.id === 'history') {
                    showToast("Navigation is maintained in the central Dashboard! Tap on uncompleted steps.");
                  } else {
                    setActiveModal(btn.id as any);
                  }
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border bg-white/20 hover:bg-white/40 transition-all duration-300 group`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-950/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-4.5 h-4.5 text-purple-950/80" />
                </div>
                <span className="text-[10px] font-bold text-purple-950/70 uppercase tracking-wider">{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DAILY INCOME PROGRESS CARD WITH EXQUISITE GRAPHICS */}
      <div className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-bold text-purple-950/40 uppercase tracking-widest font-sans">
              Daily Income Tracker
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-lg font-extrabold text-purple-950">$2,800.00</span>
              <span className="text-[10px] font-bold text-muted-foreground">spent of $20,000.00</span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-100/70 border border-emerald-200/50 px-2 py-0.5 rounded-full">
            12.8%
          </span>
        </div>

        {/* Exquisite custom progress track */}
        <div className="w-full h-3 bg-purple-950/10 rounded-full overflow-hidden relative border border-white/35">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '12.8%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-xs animate-pulse"></div>
          </motion.div>
        </div>
      </div>

      {/* MONEY FLOW / SAVINGS TARGETS */}
      <div className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-display font-bold text-sm text-purple-950/80 uppercase tracking-wider">Money Flow Targets</h4>
          <button 
            type="button"
            onClick={() => setActiveModal('addTarget')}
            className="text-[10px] font-black text-purple-900 bg-purple-950/5 hover:bg-purple-950/10 border border-purple-900/10 px-2 py-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
          >
            + Target
          </button>
        </div>

        <div className="space-y-4">
          {savingTargets.map((target) => {
            // Determine icons according to type name
            let IconComp = Coins;
            if (target.name.toLowerCase().includes('loan')) IconComp = HandCoins;
            if (target.name.toLowerCase().includes('deposit')) IconComp = PiggyBank;
            if (target.name.toLowerCase().includes('home')) IconComp = Home;

            return (
              <div key={target.id} className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/25 border border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-950/5 flex items-center justify-center">
                      <IconComp className="w-4.5 h-4.5 text-purple-950/70" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-purple-950 leading-none">{target.name}</h5>
                      <span className="text-[9px] font-medium text-purple-950/50">Target ${target.target.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-purple-950/80">
                      ${target.current.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 block leading-none">{target.percentage}%</span>
                  </div>
                </div>

                {/* Progress bar matching specific index targets */}
                <div className="w-full h-2.5 bg-purple-950/5 rounded-full overflow-hidden border border-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${target.percentage}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${target.color} 0%, #ec4899 100%)` 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PORTALS & DIALOGS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-[rgba(0,0,0,0.25)] backdrop-blur-[6px]"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-[rgba(255,255,255,0.98)] border border-white/50 backdrop-blur-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] rounded-3xl p-6 z-10 text-purple-950 font-sans"
            >
              {activeModal === 'topUp' && (
                <form onSubmit={handleTopUp} className="space-y-4">
                  <h3 className="font-display font-black text-xl text-purple-950">Top Up Balance</h3>
                  <p className="text-xs text-purple-950/60">Load simulated currency into your Loanes account balance immediately.</p>
                  
                  <div>
                    <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">Top Up Amount ($)</label>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 5000"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 text-xs font-bold text-purple-950/70 hover:bg-purple-950/5 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-700 rounded-xl shadow-lg shadow-purple-950/10 transition-all"
                    >
                      Process Top Up
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'transfer' && (
                <form onSubmit={handleTransfer} className="space-y-4">
                  <h3 className="font-display font-black text-xl text-purple-950">Send Money / Transfer</h3>
                  <p className="text-xs text-purple-950/60">Transfer funds safely. Maximum limit: your card wallet balance.</p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">Recipient Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Alexis Vance"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-4 py-3 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-sans text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">Transaction Label</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Consultant Fees, Bill payment"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-4 py-3 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-sans text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">Amount ($)</label>
                      <input 
                        type="number" 
                        required
                        max={balance}
                        placeholder="e.g. 1500"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 text-xs font-bold text-purple-950/70 hover:bg-purple-950/5 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-700 rounded-xl shadow-lg shadow-purple-950/10 transition-all"
                    >
                      Send Payment
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'request' && (
                <form onSubmit={handleRequest} className="space-y-4">
                  <h3 className="font-display font-black text-xl text-purple-950">Inbound Request</h3>
                  <p className="text-xs text-purple-950/60">Generate an automated billing or loan transfer request for a recipient.</p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">From Contact (Name)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Johnathan Hill"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-4 py-3 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-sans text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">Request Reason</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Rent reimbursement"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-4 py-3 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-sans text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">Request Amount ($)</label>
                      <input 
                        type="number" 
                        required
                        placeholder="e.g. 750"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 text-xs font-bold text-purple-950/70 hover:bg-purple-950/5 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-700 rounded-xl shadow-lg shadow-purple-950/10 transition-all"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'addTarget' && (
                <form onSubmit={handleAddTargetSubmit} className="space-y-4">
                  <h3 className="font-display font-black text-xl text-purple-950">New Savings Target</h3>
                  <p className="text-xs text-purple-950/60 font-medium">Define a custom financial target with progress thresholds and color pairings.</p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">Target Description / Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Tesla Model S, Summer Vacation"
                        value={targetName}
                        onChange={(e) => setTargetName(e.target.value)}
                        className="w-full px-4 py-3 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-sans text-sm font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">Threshold Goal ($)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="e.g. 15000"
                          value={newTargetCap}
                          onChange={(e) => setNewTargetCap(e.target.value)}
                          className="w-full px-4 py-3 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">Initial Saved ($)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 2500"
                          value={inputAmount}
                          onChange={(e) => setInputAmount(e.target.value)}
                          className="w-full px-4 py-3 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-purple-950/70 block mb-1">Anchor Theme Color</label>
                      <div className="flex gap-2 p-1.5 bg-purple-950/5 rounded-xl border border-purple-950/10 justify-around">
                        {[
                          { title: 'Violet', hex: '#8b5cf6', bg: 'bg-[#8b5cf6]' },
                          { title: 'Pink', hex: '#ec4899', bg: 'bg-[#ec4899]' },
                          { title: 'Emerald', hex: '#10b981', bg: 'bg-[#10b981]' },
                          { title: 'Amber', hex: '#f59e0b', bg: 'bg-[#f59e0b]' },
                          { title: 'Blue', hex: '#3b82f6', bg: 'bg-[#3b82f6]' },
                        ].map((colorObj) => (
                          <button
                            key={colorObj.hex}
                            type="button"
                            onClick={() => setNewTargetColor(colorObj.hex)}
                            className={`w-6 h-6 rounded-full ${colorObj.bg} transition-all ${
                              newTargetColor === colorObj.hex 
                                ? 'ring-3 ring-purple-950 scale-110' 
                                : 'opacity-85 hover:opacity-100 hover:scale-105'
                            }`}
                            title={colorObj.title}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-3">
                    <button 
                      type="button" 
                      onClick={() => {
                        setActiveModal(null);
                        setTargetName('Deposits');
                        setNewTargetCap('');
                        setInputAmount('');
                      }}
                      className="px-4 py-2 text-xs font-bold text-purple-950/70 hover:bg-purple-950/5 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-700 rounded-xl shadow-lg shadow-purple-950/10 transition-all"
                    >
                      Publish Target
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP ALERT BAR */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 px-4 py-3 bg-purple-950 backdrop-blur-xl border border-purple-600/30 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
