import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  TrendingUp, 
  Wallet, 
  Coins, 
  Activity, 
  FileCheck, 
  UserPlus, 
  ArrowUpRight, 
  ArrowDownRight,
  Server, 
  Cpu, 
  Wifi, 
  RefreshCw,
  Bell,
  Dot,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { motion } from 'motion/react';
import { Customer, Employee, Branch, Transaction, Loan, CreditCard, FixedDeposit, AuditLog } from '../types/dashboard';
import { useTranslation } from './LanguageContext';
import BrandLogo from './BrandLogo';

interface DashboardOverviewProps {
  customers: Customer[];
  employees: Employee[];
  branches: Branch[];
  transactions: Transaction[];
  loans: Loan[];
  cards: CreditCard[];
  fixedDeposits: FixedDeposit[];
  logs: AuditLog[];
  searchQuery: string;
  setCustomers?: React.Dispatch<React.SetStateAction<Customer[]>>;
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addAuditLog?: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

export default function DashboardOverview({
  customers,
  employees,
  branches,
  transactions,
  loans,
  cards,
  fixedDeposits,
  logs,
  searchQuery,
  setCustomers,
  setTransactions,
  addAuditLog
}: DashboardOverviewProps) {
  const [activeChartTab, setActiveChartTab] = useState<'revenue' | 'customers' | 'transactions'>('revenue');
  const { t } = useTranslation();

  // Online Deposit states
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositChannel, setDepositChannel] = useState('ACH');
  const [depositStatusMsg, setDepositStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);

  // Math calculated metrics based on current live state! This means updates are dynamic!
  const totalCustomersCount = customers.length;
  const totalEmployeesCount = employees.length;
  const activeAccountsCount = customers.filter(c => c.status === 'Active').length;
  const pendingKycCount = customers.filter(c => c.kycStatus === 'Pending').length;
  const newRegistrationsCount = customers.filter(c => new Date(c.joinDate) >= new Date('2024-01-01')).length;
  
  const totalDeposits = customers.reduce((sum, c) => sum + c.balance, 0) + fixedDeposits.reduce((sum, f) => sum + f.amount, 0);
  const totalLoansIssued = loans.filter(l => l.status === 'Approved').reduce((sum, l) => sum + l.amount, 0);
  
  // Real time calculated transaction volume based on today
  const todayTxCount = transactions.length + 42; // static base + simulation
  const revenueGenerated = totalDeposits * 0.043; // ~4.3% revenue fee yield rate
  const fraudAlertsCount = transactions.filter(t => t.status === 'Suspicious').length;

  // Search logic
  const filteredTransactions = transactions.filter(t => 
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      setDepositStatusMsg({ type: 'error', text: 'Please enter a valid deposit amount greater than $0.' });
      return;
    }

    const targetId = selectedCustomerId || (customers.length > 0 ? customers[0].id : '');
    if (!targetId) {
      setDepositStatusMsg({ type: 'error', text: 'Select a valid customer sequence target.' });
      return;
    }

    const customer = customers.find(c => c.id === targetId);
    if (!customer) {
      setDepositStatusMsg({ type: 'error', text: 'Customer target record not found in live registers.' });
      return;
    }

    setIsDepositing(true);
    setDepositStatusMsg(null);

    // Dynamic 1.2 second secure handshake delay simulation
    setTimeout(() => {
      // 1. Update customer balance
      if (setCustomers) {
        setCustomers(prev => prev.map(c => {
          if (c.id === targetId) {
            return {
              ...c,
              balance: c.balance + amount
            };
          }
          return c;
        }));
      }

      // 2. Generate and append new transaction
      const txId = `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const newTx: Transaction = {
        id: txId,
        customerId: targetId,
        customerName: customer.name,
        amount: amount,
        type: 'Deposit',
        category: `Online Deposit (${depositChannel})`,
        timestamp: new Date().toISOString(),
        status: 'Success',
        fraudRiskScore: Math.floor(Math.random() * 8), // low threat risk
        sourceBranchId: customer.branchId || 'BR-01'
      };

      if (setTransactions) {
        setTransactions(prev => [newTx, ...prev]);
      }

      // 3. Log into security audit trails
      if (addAuditLog) {
        addAuditLog(`ONLINE DEPOSIT: Authorized receipt of $${amount.toLocaleString()} into Customer ID ${targetId} via ${depositChannel}`, 'Info');
      }

      setIsDepositing(false);
      setDepositAmount('');
      setDepositStatusMsg({ 
        type: 'success', 
        text: `DEPOSIT LOGGED: Successfully credited $${amount.toLocaleString()} to ${customer.name}. New Bal: $${(customer.balance + amount).toLocaleString()} (Tx ID: ${txId})` 
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Welcome Title Grid - Elite Command Center Style */}
      <div id="apex-core-command-banner" className="relative overflow-hidden luxury-glass border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-5 sm:p-10 group transition-all duration-500">
        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,185,205,0.4),transparent)] backdrop-blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-[#3a2072] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 font-display justify-center sm:justify-start">
                {t('apex_core_operational_command', 'Apex Elite Command Center')}
                <span className="text-[10px] uppercase font-black px-4 py-1.5 bg-[#6d28d9]/10 backdrop-blur-md border border-[#6d28d9]/20 text-[#6d28d9] rounded-full tracking-widest w-fit mx-auto sm:mx-0">SOVEREIGN NODE</span>
              </h1>
              <p className="text-[#3a2072]/70 text-xs sm:text-sm mt-2 font-bold tracking-tight max-w-2xl leading-relaxed">
                {t('live_metrics_sub', 'Overseeing decentralized global liquidity clusters, institutional compliance, and sovereign risk protocols with real-time intelligence.')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#3a2072] bg-white/40 backdrop-blur-md border border-white/60 px-5 py-2.5 rounded-full font-black text-[9px] sm:text-[10px] tracking-[0.25em] self-center md:self-auto shadow-sm">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
            <span className="uppercase">
              {t('all_sectors_online', 'NETWORK INTEGRITY: OPTIMAL')}
            </span>
          </div>
        </div>
      </div>

      {/* Sovereign Online Deposit Terminal */}
      <div className="bg-white/40 backdrop-blur-3xl p-8 border border-white/60 rounded-[32px] shadow-2xl relative overflow-hidden group">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-6 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#3a2072]/10 pb-4">
          <div>
            <span className="text-[#6d28d9] text-[10px] tracking-widest uppercase font-black block">Super Admin Utility</span>
            <h3 className="text-lg font-black text-[#3a2072] mt-1 flex items-center gap-2">
              <span className="p-1 px-2 rounded-lg bg-purple-500/10 text-[#6d28d9] text-[10px] font-black uppercase font-mono">CORE FLUID_GATE</span>
              {t('online_deposit_terminal', 'Online Deposit Core Terminal')}
            </h3>
          </div>
          <div className="text-[10px] text-[#9D174D]/85 font-mono font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Bank Ledger Connection Armed
          </div>
        </div>

        <form onSubmit={handleDepositSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#3a2072]/65 mb-1.5 ml-0.5">
                  Select Target Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    setDepositStatusMsg(null);
                  }}
                  className="w-full text-xs bg-white text-[#3a2072] font-semibold border border-[#3a2072]/25 rounded-xl px-3.5 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#6d28d9] transition-all shadow-sm"
                >
                  <option value="">-- Click to Target Account --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (ID: {c.id} · Bal: ${c.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#3a2072]/65 mb-1.5 ml-0.5">
                  Deposit Gateway Channel
                </label>
                <select
                  value={depositChannel}
                  onChange={(e) => setDepositChannel(e.target.value)}
                  className="w-full text-xs bg-white text-[#3a2072] font-semibold border border-[#3a2072]/25 rounded-xl px-3.5 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#6d28d9] transition-all shadow-sm"
                >
                  <option value="ACH">ACH Instant Direct</option>
                  <option value="SWIFT">SWIFT Inflow Transit</option>
                  <option value="FedWire">FedWire Settlement Bridge</option>
                  <option value="Cash HAND">Cash Gate Desk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#3a2072]/65 mb-1.5 ml-0.5">
                Deposit Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#3a2072]/50">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => {
                    setDepositAmount(e.target.value);
                    setDepositStatusMsg(null);
                  }}
                  className="w-full text-xs pl-8 pr-3.5 py-3 bg-white text-[#3a2072] font-bold border border-[#3a2072]/25 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#6d28d9] transition-all shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Quick pre-sets row */}
            <div>
              <span className="block text-[9px] font-black uppercase tracking-wider text-[#9D174D]/85 mb-1.5 ml-0.5">Quick Dollar Inflow Presets</span>
              <div className="flex flex-wrap gap-2">
                {[5000, 25000, 100000, 1000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setDepositAmount(preset.toString());
                      setDepositStatusMsg(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-[10px] font-mono font-bold bg-[#6d28d9]/5 text-[#6d28d9] border border-[#6d28d9]/10 hover:bg-[#6d28d9] hover:text-[#4A044E] transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    +${preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Action Trigger / Status Feedback Pane */}
          <div className="lg:col-span-5 bg-purple-50/50 rounded-xl p-4.5 border border-purple-100/30 flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="block text-[9px] font-black uppercase tracking-wider text-purple-400 mb-2">Security Handshake Console</span>
              
              {/* Show Status message if present */}
              {depositStatusMsg ? (
                <div className={`p-3 rounded-lg text-xs leading-normal ${
                  depositStatusMsg.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                    : 'bg-rose-50 text-rose-800 border border-rose-100'
                }`}>
                  <p className="font-bold flex items-center gap-1.5">
                    {depositStatusMsg.type === 'success' ? (
                      <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
                    ) : (
                      <AlertTriangle size={13} className="shrink-0 text-rose-600" />
                    )}
                    {depositStatusMsg.type === 'success' ? 'SYSTEM SECURED' : 'HANDSHAKE DISRUPTED'}
                  </p>
                  <p className="mt-1 opacity-90">{depositStatusMsg.text}</p>
                </div>
              ) : (
                <div className="text-[11px] text-[#9D174D]/75 leading-relaxed font-mono">
                  <p className="opacity-70">&gt; awaiting transaction parameters...</p>
                  <p className="opacity-50 mt-1">&gt; quantum authorization token armed</p>
                  <p className="opacity-50">&gt; secure channel audit enabled</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isDepositing}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-[#4A044E] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDepositing 
                  ? 'bg-purple-800/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#6d28d9] to-[#ec4899] hover:brightness-[1.1] active:scale-[0.98]'
              }`}
            >
              {isDepositing ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-white" />
                  <span>Configuring Ledger Sync...</span>
                </>
              ) : (
                <>
                  <Activity size={14} />
                  <span>Transmit Online Deposit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 10 Animated Luxury KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* KPI 1: Customers */}
        <div className="glass-card bg-white/75 p-6 border border-white/60 hover:scale-[1.05] transition-all duration-500 group shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-[#4A044E] transition-all duration-500">
              <Users size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <ArrowUpRight size={14} />
              <span>14%</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-[#3a2072]/65 uppercase tracking-[0.2em] mb-1">{t('total_customers', 'Total Customers')}</p>
          <h4 className="text-2xl font-black text-[#3a2072] tracking-tighter font-display leading-none">{totalCustomersCount}</h4>
        </div>

        {/* KPI 2: Personnel Force */}
        <div className="glass-card bg-white/75 p-6 border border-white/60 hover:scale-[1.05] transition-all duration-500 group shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-[#4A044E] transition-all duration-500">
              <UserCheck size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <ArrowUpRight size={14} />
              <span>2%</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-[#3a2072]/65 uppercase tracking-[0.2em] mb-1">{t('total_employees', 'Personnel Force')}</p>
          <h4 className="text-2xl font-black text-[#3a2072] tracking-tighter font-display leading-none">{totalEmployeesCount}</h4>
        </div>

        {/* KPI 3: Total Deposits */}
        <div className="glass-card bg-white/75 p-6 border border-white/60 hover:scale-[1.05] transition-all duration-500 group shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-[#4A044E] transition-all duration-500">
              <Wallet size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <ArrowUpRight size={14} />
              <span>8.9%</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-[#3a2072]/65 uppercase tracking-[0.2em] mb-1">{t('total_deposits', 'Total Deposits')}</p>
          <h4 className="text-2xl font-black text-[#3a2072] tracking-tighter font-display leading-none">
            ${(totalDeposits / 1000000).toFixed(2)}M
          </h4>
        </div>

        {/* KPI 4: Ledger Activity */}
        <div className="glass-card bg-white/75 p-6 border border-white/60 hover:scale-[1.05] transition-all duration-500 group shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-pink-500/10 text-[#ec4899] group-hover:bg-[#ec4899] group-hover:text-[#4A044E] transition-all duration-500">
              <Activity size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <ArrowUpRight size={14} />
              <span>18%</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-[#3a2072]/65 uppercase tracking-[0.2em] mb-1">{t('today_transactions', "Ledger Activity")}</p>
          <h4 className="text-2xl font-black text-[#3a2072] tracking-tighter font-display leading-none">{todayTxCount}</h4>
        </div>

        {/* KPI 5: Threat Vectors */}
        <div className="glass-card bg-white/75 p-6 border border-white/60 hover:scale-[1.05] transition-all duration-500 group shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl transition-all duration-500 ${fraudAlertsCount > 0 ? 'bg-red-500/20 text-red-600 group-hover:bg-red-600' : 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600'} group-hover:text-white`}>
              <ShieldAlert size={20} />
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${fraudAlertsCount > 0 ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'}`}>
              {fraudAlertsCount > 0 ? 'CRITICAL' : 'SECURE'}
            </div>
          </div>
          <p className="text-[10px] font-black text-[#3a2072]/65 uppercase tracking-[0.2em] mb-1">{t('fraud_alerts', 'Threat Vectors')}</p>
          <h4 className={`text-2xl font-black tracking-tighter font-display leading-none ${fraudAlertsCount > 0 ? 'text-rose-600' : 'text-[#3a2072]'}`}>{fraudAlertsCount}</h4>
        </div>

        {/* KPI 6: Capital Yield */}
        <div className="glass-card bg-white/75 p-6 border border-white/60 hover:scale-[1.05] transition-all duration-500 group shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-[#7c3aed]/10 text-[#7c3aed] group-hover:bg-[#7c3aed] group-hover:text-[#4A044E] transition-all duration-500">
              <TrendingUp size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <ArrowUpRight size={14} />
              <span>11%</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-[#3a2072]/65 uppercase tracking-[0.2em] mb-1">{t('revenue_generated', 'Capital Yield')}</p>
          <h4 className="text-2xl font-black text-[#3a2072] tracking-tighter font-display leading-none">
            ${(revenueGenerated / 1000000).toFixed(3)}M
          </h4>
        </div>

        {/* KPI 7: Compliance Queue */}
        <div className="glass-card bg-white/75 p-6 border border-white/60 hover:scale-[1.05] transition-all duration-500 group shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-600 group-hover:text-[#4A044E] transition-all duration-500">
              <FileCheck size={20} />
            </div>
            <div className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-500 border border-amber-100">
              PENDING
            </div>
          </div>
          <p className="text-[10px] font-black text-[#3a2072]/65 uppercase tracking-[0.2em] mb-1">{t('pending_kyc', 'Compliance Queue')}</p>
          <h4 className="text-2xl font-black text-[#3a2072] tracking-tighter font-display leading-none">{pendingKycCount}</h4>
        </div>

        {/* KPI 8: Core Stability */}
        <div className="glass-card bg-white/75 p-6 border border-white/60 hover:scale-[1.05] transition-all duration-500 group shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-[#4A044E] transition-all duration-500">
              <CheckCircle2 size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <span>95%</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-[#3a2072]/65 uppercase tracking-[0.2em] mb-1">{t('active_accounts', 'Core Stability')}</p>
          <h4 className="text-2xl font-black text-[#3a2072] tracking-tighter font-display leading-none">{activeAccountsCount}</h4>
        </div>

        {/* KPI 9: Loan Management */}
        <div className="glass-card bg-white/75 p-6 border border-white/60 hover:scale-[1.05] transition-all duration-500 group shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 group-hover:bg-rose-600 group-hover:text-[#4A044E] transition-all duration-500">
              <Coins size={20} />
            </div>
            <div className="flex items-center gap-1 text-rose-500 text-[10px] font-black uppercase tracking-widest">
              <span>6.1%</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-[#3a2072]/65 uppercase tracking-[0.2em] mb-1">{t('loans', 'Loan Management')}</p>
          <h4 className="text-2xl font-black text-[#3a2072] tracking-tighter font-display leading-none">
            ${(totalLoansIssued / 1000000).toFixed(2)}M
          </h4>
        </div>

        {/* KPI 10: Growth Velocity */}
        <div className="glass-card bg-white/75 p-6 border border-white/60 hover:scale-[1.05] transition-all duration-500 group shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-[#4A044E] transition-all duration-500">
              <UserPlus size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <ArrowUpRight size={14} />
              <span>34%</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-[#3a2072]/65 uppercase tracking-[0.2em] mb-1">{t('new_registrations', 'Growth Velocity')}</p>
          <h4 className="text-2xl font-black text-[#3a2072] tracking-tighter font-display leading-none">{newRegistrationsCount}</h4>
        </div>
      </div>


      {/* Analytics Visualization Section & Map Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Interactive Custom Graph Area */}
        <div className="xl:col-span-2 p-6 rounded-3xl glass-card relative flex flex-col justify-between h-full z-10 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[#3a2072]/60 text-[10px] tracking-widest uppercase font-mono font-bold block">{t('consolidated_analytics', 'Consolidated Analytics')}</span>
              <h3 className="text-lg font-bold text-[#3a2072] mt-1">
                {activeChartTab === 'revenue' && t('revenue_projection', 'Revenue & Capital Inflow Projection')}
                {activeChartTab === 'customers' && t('customer_ingress', 'Customer Ingress Demographics')}
                {activeChartTab === 'transactions' && t('transaction_speed', 'Dynamic Transaction Speed Index')}
              </h3>
            </div>
            
            {/* Tab Controllers */}
            <div className="flex bg-white/30 backdrop-blur-md p-1.5 rounded-[50px] border border-white/60 shadow-sm">
              <button 
                onClick={() => setActiveChartTab('revenue')}
                className={`px-4 py-2 rounded-[50px] text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  activeChartTab === 'revenue' 
                    ? 'bg-[#3a2072] text-[#4A044E] shadow-lg active' 
                    : 'text-[#3a2072]/60 hover:bg-white/40 hover:text-[#3a2072]'
                }`}
              >
                <TrendingUp size={14} className={activeChartTab === 'revenue' ? 'text-[#4A044E]' : 'text-[#6366f1]'} />
                <span>{t('revenue_flow', 'Revenue Flow')}</span>
              </button>
              <button 
                onClick={() => setActiveChartTab('customers')}
                className={`px-4 py-2 rounded-[50px] text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  activeChartTab === 'customers' 
                    ? 'bg-[#3a2072] text-[#4A044E] shadow-lg active' 
                    : 'text-[#3a2072]/60 hover:bg-white/40 hover:text-[#3a2072]'
                }`}
              >
                <Users size={14} className={activeChartTab === 'customers' ? 'text-[#4A044E]' : 'text-[#6366f1]'} />
                <span>{t('customer_base', 'Customer Base')}</span>
              </button>
              <button 
                onClick={() => setActiveChartTab('transactions')}
                className={`px-4 py-2 rounded-[50px] text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  activeChartTab === 'transactions' 
                    ? 'bg-[#3a2072] text-[#4A044E] shadow-lg active' 
                    : 'text-[#3a2072]/60 hover:bg-white/40 hover:text-[#3a2072]'
                }`}
              >
                <Activity size={14} className={activeChartTab === 'transactions' ? 'text-[#4A044E]' : 'text-[#6366f1]'} />
                <span>{t('tx_speed', 'Tx Speed')}</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl border border-[#F9A8D4]/400 bg-white/20 backdrop-blur-xl shadow-inner shadow-white/10">
            {/* Premium Vector Chart Representation with Glow effects */}
            <div className="relative h-64 w-full flex items-end justify-center">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-[#3a2072]/20 w-full" />
                <div className="border-b border-[#3a2072]/20 w-full" />
                <div className="border-b border-[#3a2072]/20 w-full" />
                <div className="border-b border-[#3a2072]/20 w-full" />
                <div className="border-b border-[#3a2072]/20 w-full" />
              </div>

              {/* Simulated Live Tooltip Anchor Point */}
              <div className="absolute top-12 left-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-white border border-[#F7B6D8] shadow-[0_4px_15px_rgba(0,0,0,0.05)] z-10 pointer-events-none text-[#3a2072]">
                <p className="text-[9px] uppercase font-bold tracking-widest opacity-60">{t('active_metric_level', 'Active Metric Level')}</p>
                <p className="text-xs font-bold font-mono mt-0.5">$14.2B USD Managed (+4.5%)</p>
              </div>

              {/* Custom Interactive SVG Graph Paths */}
              <svg viewBox="0 0 500 200" className="w-full h-full text-[#3a2072] overflow-visible">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3a2072" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3a2072" stopOpacity="0.0" />
                  </linearGradient>
                  {/* ... other gradients ... */}
                </defs>

                {activeChartTab === 'revenue' && (
                  <>
                    <path 
                      d="M 0 150 Q 80 120 160 140 T 320 80 T 500 40 L 500 200 L 0 200 Z" 
                      fill="url(#chartGlow)"
                    />
                    <path 
                      d="M 0 150 Q 80 120 160 140 T 320 80 T 500 40" 
                      fill="none" 
                      stroke="#3a2072" 
                      strokeWidth="3.5" 
                    />
                    <path 
                      d="M 0 160 Q 80 170 160 110 T 320 120 T 500 80" 
                      fill="none" 
                      stroke="#3a2072" 
                      strokeWidth="1" 
                      strokeDasharray="4 4" 
                      opacity="0.3"
                    />
                  </>
                )}

                {activeChartTab === 'customers' && (
                  <>
                    <path 
                      d="M 0 170 Q 100 130 200 120 T 400 90 T 500 20 L 500 200 L 0 200 Z" 
                      fill="url(#chartGlow)"
                    />
                    <path 
                      d="M 0 170 Q 100 130 200 120 T 400 90 T 500 20" 
                      fill="none" 
                      stroke="#3a2072" 
                      strokeWidth="4" 
                    />
                  </>
                )}

                {activeChartTab === 'transactions' && (
                  <>
                    <path 
                      d="M 0 120 L 50 140 L 100 80 L 150 160 L 200 90 L 250 100 L 300 50 L 350 120 L 400 60 L 450 70 L 500 30" 
                      fill="none" 
                      stroke="#3a2072" 
                      strokeWidth="3.5" 
                    />
                    <circle cx="300" cy="50" r="4" fill="#3a2072" />
                    <circle cx="500" cy="30" r="4" fill="#3a2072" />
                  </>
                )}
              </svg>
            </div>
            
            {/* X Axis Time Marks */}
            <div className="flex justify-between mt-3 text-[10px] text-[#3a2072]/50 font-mono leading-none">
              <span>Jan 2026</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun (Today)</span>
            </div>
          </div>
        </div>

        {/* Core Banking Infrastructure Health Panel */}
        <div className="p-6 rounded-3xl glass-card flex flex-col justify-between h-full relative z-10 transition-all duration-300 hover:shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-[#3a2072] tracking-tight">{t('core_banking_infrastructure_health', 'Core Banking Infrastructure Health')}</h3>
          </div>

          <div className="space-y-4 flex-grow flex flex-col justify-between">
            
            {/* Widget 1: Digital Banking Gateway */}
            <div className="p-4 rounded-2xl bg-white/45 border border-white/80 shadow-sm hover:translate-x-1 hover:bg-white/60 transition-all duration-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/10">
                  <Server size={20} />
                </div>
                <div className="leading-tight text-left">
                  <p className="text-xs font-black text-[#3a2072]">Digital Banking Gateway</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider">Active</span>
                  </div>
                </div>
              </div>
              <div className="text-right leading-tight font-mono shrink-0">
                <p className="text-[11px] font-black text-emerald-600">99.98% Uptime</p>
                <p className="text-[9px] text-[#3a2072]/50 mt-0.5">Response Time</p>
                <p className="text-[10px] text-[#3a2072]/85 font-black">4ms</p>
              </div>
            </div>

            {/* Widget 2: Secure Transaction Engine */}
            <div className="p-4 rounded-2xl bg-white/45 border border-white/80 shadow-sm hover:translate-x-1 hover:bg-white/60 transition-all duration-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/10">
                  <Shield size={20} />
                </div>
                <div className="leading-tight text-left">
                  <p className="text-xs font-black text-[#3a2072]">Secure Transaction Engine</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Protected</span>
                  </div>
                </div>
              </div>
              <div className="text-right leading-tight font-mono shrink-0">
                <p className="text-[11px] font-black text-emerald-600">Integrity OK</p>
                <p className="text-[9px] text-[#3a2072]/50 mt-0.5">Encryption Level</p>
                <p className="text-[10px] text-[#3a2072]/85 font-black">100%</p>
              </div>
            </div>

            {/* Widget 3: Payment Network Synchronization */}
            <div className="p-4 rounded-2xl bg-white/45 border border-white/80 shadow-sm hover:translate-x-1 hover:bg-white/60 transition-all duration-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-500/10">
                  <Wifi size={20} />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-black text-[#3a2072]">Payment Network Sync</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider">Connected</span>
                  </div>
                </div>
              </div>
              <div className="text-right leading-tight font-mono shrink-0">
                <p className="text-[11px] font-black text-blue-600">Health: Excellent</p>
                <p className="text-[9px] text-[#3a2072]/50 mt-0.5">Daily Transactions</p>
                <p className="text-[10px] text-[#3a2072]/85 font-black">9.4B Txns</p>
              </div>
            </div>

            {/* Widget 4: Security Monitoring Center */}
            <div className="p-4 rounded-2xl bg-white/45 border border-white/80 shadow-sm hover:translate-x-1 hover:bg-white/60 transition-all duration-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 border border-rose-500/10">
                  <ShieldAlert size={20} />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-black text-[#3a2072]">Security Monitoring Center</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider">Real-Time</span>
                  </div>
                </div>
              </div>
              <div className="text-right leading-tight font-mono shrink-0">
                <p className="text-[10px] font-bold text-rose-700 bg-rose-50/90 px-1.5 py-0.5 rounded border border-rose-250 uppercase tracking-widest inline-block text-[9px]">1 Active Alert</p>
                <p className="text-[9px] text-[#3a2072]/50 mt-0.5">Firewall Status</p>
                <p className="text-[10px] text-emerald-600 font-black">Active</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Real-time Feeds and Activity Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Live Ledger Transactions Monitor */}
        <div className="xl:col-span-2 p-6 rounded-2xl border border-[#F3D6E8] bg-white/75 backdrop-blur-md shadow-[0_10px_30px_rgba(255,94,207,0.12)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[#FF5ECF] text-[10px] tracking-widest uppercase font-mono font-bold block">{t('integrity_monitor', 'Integrity Monitor')}</span>
              <h3 className="text-lg font-bold text-[#2D2438] mt-1">{t('live_bank_ledger', 'Live Bank Ledger Feed')}</h3>
            </div>
            
            <button 
              onClick={() => console.log("Simulation Refreshed.")}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#FF70D9]/30 bg-white hover:border-[#FF5ECF] hover:text-[#FF3EB5] rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm text-[#5D437A]"
            >
              <RefreshCw size={13} />
              <span>{t('refresh_ledger', 'Refresh Ledger')}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F3D6E8] text-[10px] text-[#5D437A] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">{t('tx_hash_id', 'Tx Hash ID')}</th>
                  <th className="py-3 px-4">{t('customer_name', 'Customer Name')}</th>
                  <th className="py-3 px-4">{t('type', 'Type')}</th>
                  <th className="py-3 px-4">{t('category', 'Category')}</th>
                  <th className="py-3 px-4 text-right">{t('amount', 'Amount')}</th>
                  <th className="py-3 px-4 text-center">{t('threat_risk', 'Threat Risk')}</th>
                  <th className="py-3 px-4 text-right">{t('status', 'Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3D6E8]/70">
                {filteredTransactions.slice(0, 5).map((txn) => (
                  <tr key={txn.id} className="text-xs hover:bg-[#FF70D9]/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#FF3EB5]">{txn.id}</td>
                    <td className="py-3 px-4 font-medium text-[#2D2438]">{txn.customerName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border border-[#F3D6E8] text-[#5D437A]">
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5D437A]">{txn.category}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#2D2438]">
                      ${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        txn.fraudRiskScore > 75 
                          ? 'bg-rose-500/20 text-rose-500 border border-rose-200' 
                          : txn.fraudRiskScore > 40
                            ? 'bg-amber-500/10 text-[#FFB800] border border-amber-200'
                            : 'bg-[#00D68F]/10 text-[#00D68F] border border-emerald-200'
                      }`}>
                        {txn.fraudRiskScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {txn.status === 'Success' ? (
                        <span className="text-[#00D68F] font-bold flex items-center gap-1 justify-end">
                          <CheckCircle2 size={12} /> {t('success', 'Success')}
                        </span>
                      ) : txn.status === 'Suspicious' ? (
                        <span className="text-[#FFB800] font-bold flex items-center gap-1 justify-end animate-pulse">
                          <AlertTriangle size={12} /> {t('flags_up', 'Flags Up')}
                        </span>
                      ) : (
                        <span className="text-[#FF5A7A] font-bold flex items-center gap-1 justify-end">
                          <XCircle size={12} /> {t('failed', 'Failed')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit Logs Timeline */}
        <div className="p-6 rounded-2xl border border-[#F3D6E8] bg-white/75 backdrop-blur-md shadow-[0_10px_30px_rgba(255,94,207,0.12)] space-y-5">
          <div>
            <span className="text-[#FF3EB5] text-[10px] tracking-widest uppercase font-mono font-bold block">{t('immutable_evidence', 'Immutable Evidence')}</span>
            <h3 className="text-lg font-bold text-[#2D2438] mt-1">{t('audit_trail_timeline', 'Audit Trail Timeline')}</h3>
          </div>

          <div className="relative border-l border-[#F3D6E8] pl-5 ml-2.5 space-y-5">
            {logs.slice(0, 4).map((log) => (
              <div key={log.id} className="relative group">
                {/* Visual node locator */}
                <div className={`absolute -left-7 top-1 w-3 h-3 rounded-full border-2 border-white ${
                  log.severity === 'Critical' 
                    ? 'bg-[#FF5A7A] shadow-[0_0_10px_rgba(255,90,122,0.45)]' 
                    : log.severity === 'Warning'
                      ? 'bg-[#FFB800] shadow-[0_0_10px_rgba(255,184,0,0.45)]'
                      : 'bg-[#00D68F]'
                }`} />

                <div className="text-[10px] font-mono font-semibold text-[#6C557C]">
                  {new Date(log.timestamp).toLocaleTimeString()} · {log.ipAddress}
                </div>
                <h4 className="text-xs font-bold text-[#2D2438] mt-1 group-hover:text-[#FF3EB5] transition-colors">
                  {log.action}
                </h4>
                <p className="text-[10px] text-[#5D437A] mt-0.5">{log.user}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
