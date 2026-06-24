import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PiggyBank, 
  Landmark, 
  ShieldCheck, 
  ArrowRightLeft, 
  Sparkles, 
  HelpCircle, 
  CreditCard, 
  CheckCircle2, 
  DollarSign, 
  User, 
  ArrowUpRight, 
  Lock, 
  Building,
  Search,
  Check,
  ChevronDown
} from 'lucide-react';
import { WalletState, TransactionItem, CustomerCard } from '../types';

interface DepositsViewProps {
  wallet?: WalletState;
  setWallet?: React.Dispatch<React.SetStateAction<WalletState>>;
  transactions?: TransactionItem[];
  addTransaction?: (sender: string, recipient: string, amount: number, category: TransactionItem['category']) => void;
  customers?: CustomerCard[];
  setCustomers?: React.Dispatch<React.SetStateAction<CustomerCard[]>>;
}

export default function DepositsView({
  wallet,
  setWallet,
  transactions,
  addTransaction,
  customers = [],
  setCustomers
}: DepositsViewProps) {
  // Local fallbacks in case props are absent
  const [localWallet, setLocalWallet] = useState<WalletState>({
    balance: 562000.00,
    incomeThisMonth: 78000.00,
    loansThisMonth: 43000.00,
    depositsThisMonth: 56000.00,
    dailyTracker: 2880.00,
    dailyTarget: 10000.00
  });

  const activeWallet = wallet || localWallet;
  const updateWallet = setWallet || setLocalWallet;

  // Track dynamic total session deposits to make the overview total responsive
  const [sessionDepositsAdded, setSessionDepositsAdded] = useState<number>(0);

  // Sweep configurations
  const [sweepActive, setSweepActive] = useState(true);
  const [interestBearingPct, setInterestBearingPct] = useState(4.25);
  const [sweepNotification, setSweepNotification] = useState<string | null>(null);

  // Online deposit form state
  const [depositTo, setDepositTo] = useState<'employee' | 'customer'>('employee');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [typedAmount, setTypedAmount] = useState<string>('');
  const [fundingSource, setFundingSource] = useState<string>('Personal Checking ACH');
  const [depositCategory, setDepositCategory] = useState<string>('Electronic Transfer');
  const [depositReference, setDepositReference] = useState<string>('Online Wallet Top-up');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState<boolean>(false);
  
  // Simulation states
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  const [depositSuccessResult, setDepositSuccessResult] = useState<{
    amount: number;
    destinationName: string;
    reference: string;
    date: string;
    time: string;
  } | null>(null);

  const handleSweepTrigger = () => {
    const nextState = !sweepActive;
    setSweepActive(nextState);
    setSweepNotification(`RESERVE SWEEP CONFIG: Automatic Lockbox Sweep status is now ${nextState ? 'ACTIVE' : 'DEACTIVATED'}.`);
    setTimeout(() => setSweepNotification(null), 4000);
  };

  // Preset quick deposit amounts
  const presets = [500, 1000, 5000, 10000, 25000];

  // Selected customer card helper
  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Perform secure online deposit operation
  const handleInitiateOnlineDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(typedAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert('VALIDATION ERROR: Please input a valid positive deposit amount.');
      return;
    }

    setIsDepositing(true);
    setDepositSuccessResult(null);

    // Simulate cryptographic clears on ACH bridge routing
    setTimeout(() => {
      const generatedRef = `REF-DEP-${Math.floor(100000 + Math.random() * 900000)}`;
      const currentDate = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const destinationName = depositTo === 'employee' ? 'Andrew Forbist' : (activeCustomer?.name || 'Inbound Ledger Beneficiary');

      // Update state dynamically
      if (depositTo === 'employee') {
        updateWallet(prev => ({
          ...prev,
          balance: prev.balance + amount,
          depositsThisMonth: prev.depositsThisMonth + amount
        }));
      } else if (depositTo === 'customer' && activeCustomer && setCustomers) {
        setCustomers(prev => 
          prev.map(c => c.id === activeCustomer.id ? { ...c, balance: c.balance + amount } : c)
        );
      }

      // Add to session tracking to increase the total reserve display cleanly
      setSessionDepositsAdded(prev => prev + amount);

      // Add to system-wide global transactions
      if (addTransaction) {
        if (depositTo === 'employee') {
          addTransaction(fundingSource, 'Andrew Forbist Wallet', amount, 'Transfer');
        } else {
          addTransaction(fundingSource, `${destinationName} Ledger`, amount, 'Transfer');
        }
      }

      // Trigger visual success notification block
      setDepositSuccessResult({
        amount,
        destinationName,
        reference: generatedRef,
        date: currentDate,
        time: currentTime
      });

      // Clear input amount
      setTypedAmount('');
      setIsDepositing(false);
    }, 1200);
  };

  // Filter customers for dropdown search option
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const baseReserves = 18452000.00;
  const computedReserves = baseReserves + sessionDepositsAdded;

  return (
    <div id="deposits-view-root" className="space-y-6">
      
      {/* Sweep activation toast / alert if updated */}
      <AnimatePresence>
        {sweepNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-pink-50 border border-pink-200 text-pink-800 text-xs font-sans rounded-2xl flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-pink-500 animate-pulse" />
              <span>{sweepNotification}</span>
            </div>
            <button 
              onClick={() => setSweepNotification(null)}
              className="text-[10px] text-pink-400 hover:text-pink-600 font-bold uppercase transition"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview Block */}
      <div className="bg-white rounded-3xl p-6 border border-pink-500/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-[#24142F]">Deposit & Liquidity Vaults</h2>
          <p className="text-sm text-gray-500 font-sans mt-1">
            Oversee corporate liquid checking, secure direct locks, and instant online staff collateral deposits.
          </p>
        </div>
        <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 flex items-center gap-3">
          <PiggyBank className="w-5 h-5 text-pink-500 animate-bounce" style={{ animationDuration: '3s' }} />
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">SYSTEMIC VAULT RESERVES</p>
            <p className="text-base font-bold font-sans text-gray-950">
              ${computedReserves.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Online Deposits Portal */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-pink-500/10 shadow-sm space-y-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-mono bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Instant Online Clearance
              </span>
              <h3 className="text-base font-bold font-sans text-gray-950">Secure Online Deposit Terminal</h3>
              <p className="text-xs text-gray-400 font-sans">
                Initiate self-service deposit routing to increase either personal wallet funds or an active customer's ledger bankroll.
              </p>
            </div>
            <span className="p-3 bg-pink-50 border border-pink-100 text-pink-500 rounded-2xl shrink-0">
              <ArrowRightLeft className="w-5 h-5 text-pink-500" />
            </span>
          </div>

          <form onSubmit={handleInitiateOnlineDeposit} className="space-y-4">
            
            {/* Toggle Beneficiary Destination */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
                1. Select Deposit Beneficiary Destination
              </label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Employee Wallet Capsule */}
                <button
                  type="button"
                  onClick={() => {
                    setDepositTo('employee');
                    setDepositReference('Online Wallet Top-up');
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    depositTo === 'employee'
                      ? 'border-pink-500 bg-pink-50/40 text-[#24142F] ring-2 ring-pink-500/10'
                      : 'border-pink-500/10 hover:bg-[#FAF4F8] bg-white text-gray-500'
                  }`}
                >
                  <span className={`p-2 rounded-xl shrink-0 ${depositTo === 'employee' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <User className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold font-sans">Employee Personal Wallet</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Andrew Forbist (${activeWallet.balance.toLocaleString()})</div>
                  </div>
                </button>

                {/* Customer Account Capsule */}
                <button
                  type="button"
                  onClick={() => {
                    setDepositTo('customer');
                    setDepositReference('Secure Client Inbound Payment');
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    depositTo === 'customer'
                      ? 'border-pink-500 bg-pink-50/40 text-[#24142F] ring-2 ring-pink-500/10'
                      : 'border-pink-500/10 hover:bg-[#FAF4F8] bg-white text-gray-500'
                  }`}
                >
                  <span className={`p-2 rounded-xl shrink-0 ${depositTo === 'customer' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Building className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold font-sans">Active Client Account</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {customers.length > 0 ? `Select from ${customers.length} clients` : "No clients configured"}
                    </div>
                  </div>
                </button>

              </div>
            </div>

            {/* Customer dropdown list selector (Shown conditionally) */}
            {depositTo === 'customer' && customers.length > 0 && (
              <div className="p-4 bg-[#FAF4F8]/50 border border-pink-100 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-pink-700 uppercase tracking-wider">
                    Beneficiary Client Directory
                  </span>
                  <span className="text-[10px] text-gray-400">Ledger details instantly synced</span>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                    className="w-full flex justify-between items-center p-3 bg-white border border-pink-500/10 rounded-xl text-xs hover:border-pink-500/35 transition text-left"
                  >
                    {activeCustomer ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${activeCustomer.avatarColor || 'from-pink-500 to-rose-500'}`} />
                        <div>
                          <span className="font-bold text-gray-900">{activeCustomer.name}</span>
                          <span className="text-gray-400 text-[10px] ml-2">({activeCustomer.company})</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Choose a client...</span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCustomerDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCustomerDropdownOpen && (
                    <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-[190px] overflow-y-auto p-2 space-y-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 mb-1.5 border-b border-gray-50">
                        <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search customer catalog..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full text-xs outline-none bg-transparent"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {filteredCustomers.length === 0 ? (
                        <div className="text-[10px] text-gray-400 py-3 text-center">No matching clients</div>
                      ) : (
                        filteredCustomers.map((cust) => (
                          <button
                            key={cust.id}
                            type="button"
                            onClick={() => {
                              setSelectedCustomerId(cust.id);
                              setIsCustomerDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between hover:bg-pink-50 transition-colors ${
                              selectedCustomerId === cust.id ? 'bg-pink-50/50 font-bold text-pink-700' : 'text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-tr ${cust.avatarColor || 'from-pink-500 to-rose-500'}`} />
                              <span>{cust.name}</span>
                              <span className="text-gray-400 text-[9px]">({cust.company})</span>
                            </div>
                            <span className="font-mono text-[10px] text-gray-500">
                              ${cust.balance.toLocaleString()}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {activeCustomer && (
                  <div className="grid grid-cols-2 gap-3 bg-white p-2.5 rounded-xl border border-pink-500/5 text-[10px] text-gray-400">
                    <div>
                      <span className="block uppercase text-[8px] tracking-wider text-pink-500 font-mono">Current Balance</span>
                      <span className="font-mono text-xs font-bold text-gray-700">${activeCustomer.balance.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block uppercase text-[8px] tracking-wider text-pink-500 font-mono">Designated Card</span>
                      <span className="font-mono text-xs font-bold text-gray-700">MC {activeCustomer.cardNum?.slice(-4) || '3891'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Deposit Amount Routing */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
                  2. Deposit Amount & Funding Presets
                </label>
                <span className="text-[10px] text-pink-700 font-semibold">USD Currency Clear</span>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm font-bold">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="1"
                  required
                  value={typedAmount}
                  onChange={(e) => setTypedAmount(e.target.value)}
                  className="w-full pl-8 pr-12 py-3 bg-gray-50 hover:bg-gray-100/50 focus:bg-white text-gray-800 font-mono font-bold text-sm border border-gray-200 focus:border-pink-500 outline-none rounded-2xl transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono font-bold uppercase">USD</span>
              </div>

              {/* Presets Grid */}
              <div className="flex flex-wrap gap-2 pt-1">
                {presets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTypedAmount(val.toString())}
                    className="px-3 py-1.5 rounded-xl border border-pink-500/10 hover:border-pink-300 bg-[#FAF4F8]/20 hover:bg-pink-50 text-[11px] font-mono text-pink-700 transition"
                  >
                    +${val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Metadata fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">External Source</label>
                <select
                  value={fundingSource}
                  onChange={(e) => setFundingSource(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-pink-400 transition"
                >
                  <option value="Personal Checking ACH">Personal Checking ACH</option>
                  <option value="External Capital Account Link">External Capital Link</option>
                  <option value="Visa Secured Card *9901">Visa Secured Card *9901</option>
                  <option value="Crypto FDIC Liquidity Broker">USDT/USDC FDIC Liquidity Link</option>
                  <option value="Federal Wire Settlement System">Federal Reserve Wire Gateway</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">Settlement Reference Note</label>
                <input
                  type="text"
                  placeholder="Optional reference memo..."
                  value={depositReference}
                  onChange={(e) => setDepositReference(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-pink-400 transition"
                />
              </div>
            </div>

            {/* Federal verification guideline banner */}
            <div className="p-3 bg-slate-50 border border-slate-100/80 rounded-2xl flex items-start gap-2.5">
              <input
                id="aml-confirm"
                type="checkbox"
                required
                defaultChecked
                className="mt-0.5 rounded accent-pink-500 h-3.5 w-3.5 cursor-pointer"
              />
              <label htmlFor="aml-confirm" className="text-[10px] text-gray-500 cursor-pointer select-none">
                I hereby declare that this online deposits clearing is verified in compliance with the Federal anti-money laundering regulations and cleared source of liquidity acts.
              </label>
            </div>

            {/* Submit Button trigger */}
            <button
              type="submit"
              disabled={isDepositing}
              className={`w-full py-3.5 rounded-2xl font-sans font-bold text-xs text-white tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 ${
                isDepositing 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-[#24142F] hover:bg-[#1a0e22] active:scale-[0.99] hover:shadow-lg'
              }`}
            >
              {isDepositing ? (
                <>
                  <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Clearing Security ACH Bridge...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-pink-300" />
                  <span>Confirm Secured Online Deposit</span>
                </>
              )}
            </button>

          </form>

          {/* Inline Deposit success receipt */}
          <AnimatePresence>
            {depositSuccessResult && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-3 p-4 bg-emerald-50 border border-emerald-200/60 rounded-2xl space-y-3 shadow-inner"
              >
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Online Deposit Successfully Settlement Confirmed!</span>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-mono text-emerald-900 bg-white/40 p-2.5 rounded-xl border border-emerald-100">
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase">Destination</span>
                    <span className="font-bold font-sans text-gray-800">{depositSuccessResult.destinationName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase">Amount Settled</span>
                    <span className="font-bold text-pink-700">${depositSuccessResult.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase">Reference Code</span>
                    <span className="font-bold text-slate-700">{depositSuccessResult.reference}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase">TimeStamp</span>
                    <span className="text-gray-700 font-sans">{depositSuccessResult.date} {depositSuccessResult.time}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-emerald-800/80">
                  <span>Funds are immediately available in the active banking stream and registered inside the central logs file.</span>
                  <button 
                    onClick={() => setDepositSuccessResult(null)}
                    className="font-bold underline hover:text-emerald-950 uppercase shrink-0 font-sans"
                  >
                    OK
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Column: Original Sweeps & Resource analytics stack */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Box 1: Sweep Manager */}
          <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold font-sans text-gray-900">Lockbox Sweep Configuration</h3>
                <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                  Automatically sweep residual balances into high-yield collateral indexes at market close.
                </p>
              </div>
              <span className="p-2 bg-pink-100 text-pink-500 rounded-xl shrink-0">
                <Landmark className="w-4.5 h-4.5" />
              </span>
            </div>

            <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3.5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-sans font-bold text-gray-900">Sweep reserves automatically</p>
                  <p className="text-[10px] text-gray-400 font-sans">Minimizes uninvested corporate overnight balances</p>
                </div>
                <button
                  type="button"
                  onClick={handleSweepTrigger}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors focus:ring-2 focus:ring-[#24142F]/10 ${sweepActive ? 'bg-pink-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    sweepActive ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-sans text-gray-700">Accumulated Compound APR</span>
                <span className="font-mono font-bold text-pink-500">{interestBearingPct}% APY</span>
              </div>
              <input 
                type="range" 
                min={2.0}
                max={6.5}
                step={0.05}
                value={interestBearingPct}
                onChange={(e) => setInterestBearingPct(Number(e.target.value))}
                className="w-full accent-pink-500 h-1.5 cursor-pointer bg-pink-100 rounded-lg"
              />
            </div>

            <div className="text-[10px] text-pink-700 bg-pink-50 p-3.5 rounded-xl font-sans flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
              <span>Vault parameters are FDIC protected and continuously verified against legal leverage guidelines.</span>
            </div>
          </div>

          {/* Box 2: Liquidity Allocation status */}
          <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold font-sans text-gray-900">Reserve Indexing Indicators</h3>
              <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                Current systemic indexing statistics for liquid banking pools.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 border border-pink-500/5 bg-[#FAF4F8] rounded-xl font-mono">
                <span className="text-gray-500 font-semibold uppercase text-[10px]">Overnight Sweep Target</span>
                <span className="text-gray-900 font-bold">$12,000,000</span>
              </div>

              <div className="flex justify-between items-center p-3 border border-pink-500/5 bg-[#FAF4F8] rounded-xl font-mono">
                <span className="text-gray-500 font-semibold uppercase text-[10px]">Escrow Collateral Locklist</span>
                <span className="text-gray-900 font-bold">$3,500,000</span>
              </div>

              <div className="flex justify-between items-center p-3 border border-pink-500/5 bg-[#FAF4F8] rounded-xl font-mono">
                <span className="text-gray-500 font-semibold uppercase text-[10px]">Unrestricted Spot Liquidity</span>
                <span className="text-gray-900 font-bold">$2,952,000</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-purple-50/50 border border-purple-100/50 p-3 rounded-xl font-sans">
              <div className="flex items-center gap-1.5 text-[10px] text-purple-700 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TREASURY AUDIT REPORT SEALED</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">TODAY 08:00</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
