/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PiggyBank, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  CheckCircle, 
  Info,
  ShieldCheck,
  Mail,
  Phone,
  Sparkles,
  Check,
  Lock,
  X
} from 'lucide-react';
import { SavingVault, Card } from '../types';

interface SavingsVaultsProps {
  vaults: SavingVault[];
  onDeposit: (vaultId: string, amount: number) => void;
  onWithdraw: (vaultId: string, amount: number) => void;
  onNewVault: (name: string, target: number, category: string) => void;
  onDeleteVault: (vaultId: string) => void;
  userBalance: number;
  cards?: Card[];
  customAccounts?: any[];
  profile?: any;
}

const getNicerAccountNumber = (accNum: string) => {
  if (!accNum) return '••••••••';
  const cleanNum = accNum.replace(/\s+/g, '').toUpperCase();
  if (cleanNum.startsWith('XXXX')) {
    const suffix = cleanNum.slice(4);
    return `3099 0821 ${suffix}`;
  } else if (cleanNum.includes('XXXX')) {
    const replaced = cleanNum.replace('XXXX', '5821');
    return replaced.replace(/(.{4})/g, '$1 ').trim();
  }
  return cleanNum.replace(/(.{4})/g, '$1 ').trim();
};

export default function SavingsVaults({ 
  vaults, 
  onDeposit, 
  onWithdraw, 
  onNewVault, 
  onDeleteVault, 
  userBalance, 
  cards = [], 
  customAccounts = [],
  profile = null
}: SavingsVaultsProps) {
  const [showAddVault, setShowAddVault] = useState(false);
  const [vaultName, setVaultName] = useState('');
  const [vaultTarget, setVaultTarget] = useState('');
  const [vaultCategory, setVaultCategory] = useState('Travel');
  
  // Deposit / Withdraw popups
  const [activeVaultForFund, setActiveVaultForFund] = useState<SavingVault | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [fundAction, setFundAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [errorMessage, setErrorMessage] = useState('');

  // Selected funding instrument state
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>('');

  // Multi-channel Double Authentication Handshake states
  const [isDoubleAuthActive, setIsDoubleAuthActive] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [enteredEmailConfirmation, setEnteredEmailConfirmation] = useState('');
  const [enteredPhoneConfirmation, setEnteredPhoneConfirmation] = useState('');
  const [otpVerifyError, setOtpVerifyError] = useState('');

  // Clean registered profile details for secure check
  const registeredEmail = (profile?.email || 'andrew.forbist@apex.com').trim().toLowerCase();
  const rawMobile = (profile?.mobile || '9876543210').replace(/\D/g, '');
  const registeredPhoneSuffix = rawMobile.length >= 10 ? rawMobile.slice(-10) : rawMobile;

  // Unified list of selectable transfer sources/destinations
  const availableInstruments = React.useMemo(() => {
    const list: { id: string; type: 'card' | 'account'; name: string; numberLabel: string; fullDetails: string }[] = [];
    
    // 1. Add Bank Accounts
    customAccounts.forEach((acc, index) => {
      const formatted = getNicerAccountNumber(acc.accountNumber);
      list.push({
        id: `acc-${index}-${acc.accountNumber}`,
        type: 'account',
        name: acc.type || 'Savings Account',
        numberLabel: formatted,
        fullDetails: `🏦 ${acc.type} (${formatted})`
      });
    });

    // 2. Add Debit/Credit Cards (Excluding Credit Cards)
    cards.filter(c => !c.cardType?.toLowerCase().includes('credit')).forEach((c) => {
      list.push({
        id: `card-${c.id}`,
        type: 'card',
        name: c.cardType || 'Visa Platinum Debit',
        numberLabel: `•••• •••• •••• ${c.last4}`,
        fullDetails: `💳 ${c.cardType || 'Visa'} (•••• ${c.last4})`
      });
    });

    return list;
  }, [cards, customAccounts]);

  // Set default instrument when modal changes
  React.useEffect(() => {
    if (activeVaultForFund && availableInstruments.length > 0) {
      setSelectedInstrumentId(availableInstruments[0].id);
    }
  }, [activeVaultForFund, availableInstruments]);

  const handleCreateVault = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVal = parseFloat(vaultTarget);
    if (!vaultName.trim() || isNaN(targetVal) || targetVal <= 0) return;

    onNewVault(vaultName.trim(), targetVal, vaultCategory);
    setVaultName('');
    setVaultTarget('');
    setVaultCategory('Travel');
    setShowAddVault(false);
  };

  // Form submit for first step (Amount and account validation before double auth)
  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!activeVaultForFund) return;

    const amt = parseFloat(fundAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMessage('Please enter a valid monetary amount.');
      return;
    }

    if (fundAction === 'deposit') {
      if (amt > userBalance) {
        setErrorMessage('Insufficient available account funds to deposit.');
        return;
      }
    } else {
      if (amt > activeVaultForFund.currentAmount) {
        setErrorMessage('Cannot withdraw more than current vault balance.');
        return;
      }
    }

    // Trigger Double Authentication handshaking mode!
    setIsDoubleAuthActive(true);
    setOtpSent(false);
    setGeneratedOtp('');
    setUserEnteredOtp('');
    setOtpVerifyError('');
    setEnteredEmailConfirmation('');
    setEnteredPhoneConfirmation('');
  };

  // Trigger dispatch of simulated cryptographic verification keys to email/sms
  const handleSendOtpHandshake = () => {
    setSendingOtp(true);
    setOtpVerifyError('');
    
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setSendingOtp(false);
      setOtpSent(true);
    }, 1000);
  };

  // Perform multi-channel matching double verification
  const handleVerifyOtpHandshakeAndComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpVerifyError('');
    if (!activeVaultForFund) return;

    const amt = parseFloat(fundAmount);
    if (isNaN(amt) || amt <= 0) return;

    const cleanConfirmEmail = enteredEmailConfirmation.trim().toLowerCase();
    const cleanConfirmPhone = enteredPhoneConfirmation.replace(/\D/g, '');

    if (!cleanConfirmEmail || cleanConfirmEmail !== registeredEmail) {
      setOtpVerifyError('❌ Validation Failed: Provided email does not match registered profile inbox.');
      return;
    }

    if (!cleanConfirmPhone || !registeredPhoneSuffix.endsWith(cleanConfirmPhone)) {
      setOtpVerifyError('❌ Validation Failed: Provided mobile ends-with did not match registered phone digits.');
      return;
    }

    if (userEnteredOtp !== generatedOtp) {
      setOtpVerifyError('❌ Invalid 6-digit verification code. Please check code or request new dispatch.');
      return;
    }

    // Handshake verification succeeded! Finalize and commit funds movement
    if (fundAction === 'deposit') {
      onDeposit(activeVaultForFund.id, amt);
    } else {
      onWithdraw(activeVaultForFund.id, amt);
    }

    // Clean up states
    setFundAmount('');
    setIsDoubleAuthActive(false);
    setOtpSent(false);
    setGeneratedOtp('');
    setUserEnteredOtp('');
    setEnteredEmailConfirmation('');
    setEnteredPhoneConfirmation('');
    setActiveVaultForFund(null);
  };

  const handleAbortFund = () => {
    setActiveVaultForFund(null);
    setIsDoubleAuthActive(false);
    setOtpSent(false);
    setGeneratedOtp('');
    setUserEnteredOtp('');
    setEnteredEmailConfirmation('');
    setEnteredPhoneConfirmation('');
    setOtpVerifyError('');
    setErrorMessage('');
  };

  return (
    <div className="glass-panel p-6 rounded-[28px] space-y-6 shadow-premium flex flex-col h-full text-[#2e1065]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-[#ff5e9c]" />
            <span>Apex Money Vaults</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Segregated funds targeting customized goals denominated in ₹ (INR)</p>
        </div>

        <button
          onClick={() => setShowAddVault(true)}
          className="py-1.5 px-3 bg-gradient-to-r from-[#ff5e9c] to-[#b03bfc] text-white hover:opacity-95 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
          title="Create New Vault"
        >
          <Plus className="w-3.5 h-3.5 border border-white/50 rounded-md" />
          <span>New Savings Directive</span>
        </button>
      </div>

      {/* Grid of Vault items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vaults.length === 0 ? (
          <div className="md:col-span-2 text-center p-8 bg-slate-50 rounded-2xl border border-pink-100 text-slate-400 font-semibold italic">
            No active savings goals declared yet. Formulate a goal above!
          </div>
        ) : (
          vaults.map((v) => {
            const percentage = Math.min(Math.round((v.currentAmount / v.targetAmount) * 100), 100);
            
            return (
              <div key={v.id} className="p-5 rounded-2xl bg-slate-50/50 border border-pink-100 space-y-4 hover:border-pink-200 hover:bg-white hover:shadow-premium transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#ff5e9c]/15 text-[#ff5e9c] rounded-xl shrink-0">
                      <PiggyBank className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{v.name}</h4>
                      <span className="text-[9px] bg-pink-50 px-2 py-0.5 border border-pink-100 text-[#ff5e9c] font-bold rounded-full mt-1 inline-block">
                        {v.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => {
                        setFundAction('deposit');
                        setActiveVaultForFund(v);
                        setErrorMessage('');
                        setIsDoubleAuthActive(false);
                      }}
                      className="p-1 px-2.5 bg-[#ff5e9c]/10 hover:bg-[#ff5e9c]/15 border border-[#ff5e9c]/20 text-[#ff5e9c] rounded-lg text-[10px] font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                    >
                      <ArrowUpRight className="w-3 h-3" /> DEP
                    </button>
                    <button
                      onClick={() => {
                        setFundAction('withdraw');
                        setActiveVaultForFund(v);
                        setErrorMessage('');
                        setIsDoubleAuthActive(false);
                      }}
                      className="p-1 px-2.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-600 rounded-lg text-[10px] font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                    >
                      <ArrowDownLeft className="w-3 h-3" /> WITH
                    </button>
                    <button
                      onClick={() => onDeleteVault(v.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer hover:bg-pink-50"
                      title="Liquidate Vault Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span className="font-bold text-slate-800">₹{v.currentAmount.toLocaleString()} saved</span>
                    <span>₹{v.targetAmount.toLocaleString()} Goal ({percentage}%)</span>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-250/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-gradient-to-r from-[#ff5e9c] to-[#b03bfc] h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Vault creation modal */}
      <AnimatePresence>
        {showAddVault && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 p-6 rounded-3xl border border-white/10 max-w-sm w-full shadow-2xl space-y-4 animate-fade-in"
            >
              <h3 className="font-display font-bold text-slate-100 text-lg mb-2">Set Savings Directive</h3>
              
              <form onSubmit={handleCreateVault} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Vault Goal Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dream Retreat"
                    value={vaultName}
                    onChange={(e) => setVaultName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-zinc-900 rounded-xl border border-white/10 focus:outline-[#ff5e9c] font-medium text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Target (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="Goal Limit"
                      value={vaultTarget}
                      onChange={(e) => setVaultTarget(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-zinc-900 rounded-xl border border-white/10 focus:outline-[#ff5e9c] font-medium text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Class Type</label>
                    <select
                      value={vaultCategory}
                      onChange={(e) => setVaultCategory(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-zinc-900 rounded-xl border border-white/10 focus:outline-[#ff5e9c] font-semibold text-slate-350"
                    >
                      <option value="Travel">Travel</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Leisure">Leisure</option>
                      <option value="Finance">Finance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddVault(false)}
                    className="py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Abandon Goal
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 bg-gradient-to-r from-[#ff5e9c] to-[#b03bfc] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Establish Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Deposit/Withdraw pop up with integrated Double Authentication */}
        {activeVaultForFund && (() => {
          const chosenInstrument = availableInstruments.find(item => item.id === selectedInstrumentId) || availableInstruments[0];
          
          return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  y: 0,
                  transition: { type: "spring", stiffness: 350, damping: 25 }
                }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="bg-zinc-950 p-6 rounded-3xl border border-white/10 max-w-sm w-full shadow-2xl relative overflow-hidden text-slate-100 font-sans"
              >
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-pink-500 via-[#b03bfc] to-purple-500" />
                
                {/* Conditionally render content: Step 1 vs Double Authentication Step 2 */}
                {!isDoubleAuthActive ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#ff5e9c]/10 text-[#ff5e9c] rounded-xl flex items-center justify-center">
                          <PiggyBank className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-slate-100 text-sm capitalize leading-none">
                            {fundAction} Funds
                          </h3>
                          <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold">Goal Target: {activeVaultForFund.name}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAbortFund}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3 bg-zinc-900 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-mono text-[10px]">Vault Current Balance:</span>
                      <span className="font-mono font-black text-rose-450">₹{activeVaultForFund.currentAmount.toLocaleString()}</span>
                    </div>

                    <form onSubmit={handleFundSubmit} className="space-y-4">
                      {/* Select source/dest accounts and card type */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                          {fundAction === 'deposit' ? 'From (Select Source Account/Card)' : 'To (Select Destination Account/Card)'}
                        </label>
                        <select
                          value={selectedInstrumentId}
                          onChange={(e) => setSelectedInstrumentId(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-zinc-900 rounded-xl border border-white/10 focus:outline-[#ff5e9c] font-semibold text-white cursor-pointer"
                        >
                          {availableInstruments.map((instrument) => (
                            <option key={instrument.id} value={instrument.id} className="bg-zinc-950 text-slate-100 text-xs py-1">
                              {instrument.fullDetails}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Flow Summary display */}
                      <div className="p-3 bg-zinc-900/60 border border-white/5 rounded-2xl space-y-2 text-[10px] font-mono leading-relaxed">
                        <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                          <span className="text-purple-400 font-bold uppercase text-[9px]">FROM:</span>
                          <span className="font-bold text-slate-200 text-right truncate max-w-[210px]">
                            {fundAction === 'deposit' 
                              ? (chosenInstrument ? chosenInstrument.fullDetails : 'Selected Account/Card')
                              : `✨ Savings Vault: ${activeVaultForFund.name}`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-pink-400 font-bold uppercase text-[9px]">TO:</span>
                          <span className="font-bold text-slate-200 text-right truncate max-w-[210px]">
                            {fundAction === 'deposit'
                              ? `✨ Savings Vault: ${activeVaultForFund.name}`
                              : (chosenInstrument ? chosenInstrument.fullDetails : 'Selected Account/Card')
                            }
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider font-mono">Transfer Amount (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="Enter value"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-zinc-900 rounded-xl border border-white/10 focus:outline-[#ff5e9c] font-medium text-slate-100 font-mono text-center text-sm"
                        />
                      </div>

                      {errorMessage && (
                        <p className="text-xs text-rose-450 font-medium bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg text-center">
                          {errorMessage}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleAbortFund}
                          className="py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Abort
                        </button>
                        <button
                          type="submit"
                          className="py-2.5 bg-gradient-to-r from-[#ff5e9c] to-[#b03bfc] text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Confirm Action
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Step 2: APEX Double Authentication secure viewport */
                  <div className="space-y-4 animate-fade-in text-slate-100">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-pink-500/10 rounded-xl text-pink-500">
                          <ShieldCheck className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-xs text-slate-100 tracking-wider uppercase">
                            APEX SECURITIES GATEWAY
                          </h3>
                          <p className="text-[10px] text-pink-400 font-bold font-mono">Multi-Factor Double Auth</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAbortFund}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="bg-zinc-900/60 border border-white/5 p-3.5 rounded-2xl text-[11px] leading-relaxed text-slate-300">
                      <span className="font-bold text-[#ff5e9c]">🔒 Secure Transfer Authorization Required</span>
                      <p className="mt-1">
                        To authorize a {fundAction} transfer of <span className="font-black text-white font-mono">₹{parseFloat(fundAmount).toLocaleString()}</span>, you must complete a multi-channel double-authentication handshake verification.
                      </p>
                    </div>

                    {/* Double Validation Inputs */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                          Verify Registered Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="e.g. andrew.forbist@apex.com"
                            value={enteredEmailConfirmation}
                            onChange={(e) => setEnteredEmailConfirmation(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-pink-500"
                          />
                          <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        </div>
                        <span className="text-[8px] text-slate-500 block">Registered: {profile?.email || 'andrew.forbist@apex.com'}</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                          Verify Registered Mobile Number (10 Digits)
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            value={enteredPhoneConfirmation}
                            onChange={(e) => setEnteredPhoneConfirmation(e.target.value.replace(/\D/g, ''))}
                            maxLength={10}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                          />
                          <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        </div>
                        <span className="text-[8px] text-slate-500 block">Registered: {profile?.mobile || '+91 98765 43210'}</span>
                      </div>
                    </div>

                    {!otpSent ? (
                      <button
                        type="button"
                        disabled={sendingOtp || !enteredEmailConfirmation || !enteredPhoneConfirmation}
                        onClick={handleSendOtpHandshake}
                        className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-[#b03bfc] hover:opacity-90 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2"
                      >
                        {sendingOtp ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating security keys...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" /> Generate Dual OTP Handshake
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3.5 border-t border-white/5 pt-3 animate-fade-in">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 rounded-xl">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono tracking-wider">
                              MFA Payloads Dispatched
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                            Secure transaction tokens have been multiplexed to your confirmed inbox and mobile SMS streams.
                          </p>
                          
                          <div className="mt-2.5 p-1.5 bg-zinc-950 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                            <span className="text-[9px] text-emerald-400 font-mono font-bold tracking-wider uppercase ml-1">Simulated OTP:</span>
                            <span className="font-mono text-xs font-black text-white bg-emerald-500 px-2 py-0.5 rounded-lg tracking-widest">{generatedOtp}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                            Enter 6-Digit Handshake OTP
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="••••••"
                            value={userEnteredOtp}
                            onChange={(e) => setUserEnteredOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-zinc-950 border border-pink-500/30 rounded-xl px-3 py-2 text-center text-lg font-black tracking-widest text-[#ff5e9c] focus:outline-none focus:border-pink-500 font-mono"
                          />
                        </div>

                        {otpVerifyError && (
                          <p className="text-[10px] text-rose-500 bg-rose-500/10 p-2.5 rounded-xl font-medium text-center border border-rose-500/10 leading-relaxed whitespace-pre-line">
                            {otpVerifyError}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setIsDoubleAuthActive(false)}
                            className="py-2.5 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handleVerifyOtpHandshakeAndComplete}
                            className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 animate-pulse"
                          >
                            <Check className="w-4 h-4" /> Verify & Transfer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
