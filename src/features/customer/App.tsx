import './index.css';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, ShieldCheck, Clock, Download, Search, Bell,
  HelpCircle, AlertTriangle, Sparkles, User, LogOut, LayoutDashboard,
  CreditCard, Landmark, Menu, X, Check, ArrowUpRight, Plus, 
  Trash2, Filter, AlertCircle, RefreshCw, Key, FileText, HelpCircle as SupportIcon,
  Activity, ArrowDownLeft, Send, Sparkle, Bot, Mail, Phone
} from 'lucide-react';

import { requireSupabase, supabase } from '@/lib/supabaseClient';
import { subscribeToStudent, type StudentRow } from '@/lib/realtime';
import { useSupabaseTable } from '@/hooks/useSupabaseTable';
import {
  mapCustomerTransactionRow,
  mapCustomerCardRow,
  mapSavingsVaultRow,
  customerTransactionToRow,
} from '@/lib/db/mappers';
import { persistStudentBalance } from '@/lib/db/sync';
import LiveBadge from '@/components/LiveBadge';
import { clearSession, getSessionPortal } from '@/auth/session';
import { Transaction, Card, SavingVault, UserWealthState } from './types';
import { 
  INITIAL_WEALTH, 
  INITIAL_CARDS, 
  INITIAL_SAVINGS_VAULTS, 
  INITIAL_TRANSACTIONS 
} from './data/mockData';

import CustomerProfile from './components/CustomerProfile';
import CustomerLoans from './components/CustomerLoans';
import CreateAccountModal from './components/CreateAccountModal';
import SavingsVaults from './components/SavingsVaults';
import DebitCards from './components/DebitCards';
import AIFinancialAdvisor from './components/AIFinancialAdvisor';
// @ts-ignore
import pinkCloudsBg from './assets/images/pink_clouds_bg_1781516156081.jpg';

// Custom "apex bank" Brand Logo according to Client Image - Crafted to match image exactly
const BrandLogo = ({ className = "h-6" }) => (
  <div className={`flex items-center select-none ${className}`}>
    <span 
      className="font-display font-extrabold text-[24px] tracking-tight text-[#082157] lowercase"
      style={{ 
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: "-0.03em"
      }}
    >
      apex bank
    </span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'cards' | 'savings' | 'loans' | 'profile'>('dashboard');

  const [studentId, setStudentId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem('bank_user');
      if (!stored) return null;
      return JSON.parse(stored).id ?? null;
    } catch {
      return null;
    }
  });
  
  // Master states
  const [wealth, setWealth] = useState<UserWealthState>(INITIAL_WEALTH);

  const transactionsDb = useSupabaseTable({
    table: 'bank_transactions',
    mapRow: mapCustomerTransactionRow,
    fallback: INITIAL_TRANSACTIONS,
    filter: studentId ? { column: 'student_id', value: studentId } : undefined,
    enabled: Boolean(studentId),
  });
  const cardsDb = useSupabaseTable({
    table: 'bank_cards',
    mapRow: mapCustomerCardRow,
    fallback: INITIAL_CARDS,
    filter: studentId ? { column: 'student_id', value: studentId } : undefined,
    enabled: Boolean(studentId),
  });
  const vaultsDb = useSupabaseTable({
    table: 'savings_vaults',
    mapRow: mapSavingsVaultRow,
    fallback: INITIAL_SAVINGS_VAULTS,
    filter: studentId ? { column: 'student_id', value: studentId } : undefined,
    enabled: Boolean(studentId),
  });

  const transactions = transactionsDb.data;
  const setTransactions = transactionsDb.setData;
  const cards = cardsDb.data;
  const setCards = cardsDb.setData;
  const vaults = vaultsDb.data;
  const setVaults = vaultsDb.setData;
  
  // Extra client accounts spawned during simulation
  const [customAccounts, setCustomAccounts] = useState<any[]>([
    { accountNumber: 'XXXX8842', type: 'Savings Account', branchName: 'Metro High-Tech Branch', balance: '₹1,42,450.75' },
    { accountNumber: 'XXXX3157', type: 'Current Account', branchName: 'Corporate Hub Branch', balance: '₹0.00' }
  ]);

  // Search states
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txCategoryFilter, setTxCategoryFilter] = useState('All');
  const [txTypeFilter, setTxTypeFilter] = useState('All');
  
  // Navigation & triggers
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
  const [aiPopupOpen, setAiPopupOpen] = useState(false);

  // Online Deposit State
  const [showOnlineDeposit, setShowOnlineDeposit] = useState(false);
  const [onlineDepositAmount, setOnlineDepositAmount] = useState('');
  const [onlineDepositFrom, setOnlineDepositFrom] = useState('');
  const [onlineDepositTo, setOnlineDepositTo] = useState('main'); // 'main' or the account's index in state
  const [onlineDepositStep, setOnlineDepositStep] = useState(1); // 1 = details entry, 2 = double authentication
  const [onlineDepositEmailVerify, setOnlineDepositEmailVerify] = useState('');
  const [onlineDepositPhoneVerify, setOnlineDepositPhoneVerify] = useState('');
  const [onlineDepositOtpSimulated, setOnlineDepositOtpSimulated] = useState('');
  const [onlineDepositOtpUser, setOnlineDepositOtpUser] = useState('');
  const [onlineDepositMfaError, setOnlineDepositMfaError] = useState('');
  const [onlineDepositSendingOtp, setOnlineDepositSendingOtp] = useState(false);
  const [onlineDepositOtpSent, setOnlineDepositOtpSent] = useState(false);
  const [onlineDepositSourceMethod, setOnlineDepositSourceMethod] = useState<'internal' | 'external'>('external');
  const [onlineDepositExtBankName, setOnlineDepositExtBankName] = useState('State Bank of India');
  const [onlineDepositExtAccNum, setOnlineDepositExtAccNum] = useState('');
  const [onlineDepositExtIFSC, setOnlineDepositExtIFSC] = useState('');

  // Profile data values as instructed
  const [profile, setProfile] = useState({
    fullName: 'Andrew Forbist',
    customerId: 'APEX-8842-2026',
    dob: '1995-12-14',
    gender: 'Male',
    nationality: 'Indian',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    mobile: '+91 98765 43210',
    altMobile: '+91 91234 56789',
    email: 'andrew.forbist@apex.com',
    address: 'Floor 12, Cyber Heights, Sector V',
    city: 'Kolkata',
    state: 'West Bengal',
    pinCode: '700091',
    accountNumber: 'XXXX8842',
    accountType: 'Savings Account',
    branchName: 'Metro High-Tech Branch',
    ifscCode: 'APEX0008842',
    openingDate: '2021-04-12',
    aadhaarNumber: 'XXXX-XXXX-9902',
    panNumber: 'XXXXXX512R',
    kycStatus: 'Verified' as 'Verified' | 'Pending',
  });

  const [logs, setLogs] = useState<string[]>([
    'Secure initialization of Apex Ledger complete.',
    'Virtual security credentials loaded successfully (MFA online).',
    'Session established for client: Andrew Forbist.'
  ]);
  const [liveDbConnected, setLiveDbConnected] = useState(false);

  useEffect(() => {
    setLiveDbConnected(
      transactionsDb.connected || cardsDb.connected || vaultsDb.connected
    );
  }, [transactionsDb.connected, cardsDb.connected, vaultsDb.connected]);

  const syncBalanceToDb = (balance: number) => {
    if (studentId) void persistStudentBalance(studentId, balance);
  };

  const applyStudentRow = (student: StudentRow) => {
    setProfile(prev => ({
      ...prev,
      fullName: (student.full_name as string) || prev.fullName,
      customerId: (student.customer_id as string) || prev.customerId,
      email: (student.email_address as string) || prev.email,
      mobile: (student.mobile_number as string) || prev.mobile,
      panNumber: (student.pan_number as string) || prev.panNumber,
      kycStatus: ((student.kyc_status as string) || prev.kycStatus) as 'Verified' | 'Pending',
      accountNumber: (student.account_number as string) || prev.accountNumber,
      accountType: (student.account_type as string) || prev.accountType,
      branchName: (student.branch_name as string) || prev.branchName,
      ifscCode: (student.ifsc_code as string) || prev.ifscCode,
      city: (student.city as string) || prev.city,
      state: (student.state as string) || prev.state,
      dob: (student.date_of_birth as string) || prev.dob,
      gender: (student.gender as string) || prev.gender,
    }));

    const balance = Number(student.balance);
    if (!Number.isNaN(balance)) {
      setWealth(prev => ({ ...prev, balance }));
    }
  };

  // LocalStorage session check & live Supabase profile + realtime sync
  useEffect(() => {
    let realtimeChannel: ReturnType<typeof subscribeToStudent> = null;

    const fetchUserProfile = async () => {
      // Read bank_user from localStorage (set by landing.html on login)
      const storedUser = localStorage.getItem('bank_user');
      console.log('[Customer App] bank_user from localStorage:', storedUser);

      if (!storedUser || getSessionPortal() !== 'customer') {
        console.log('[Customer App] No valid customer session — redirecting to landing');
        clearSession();
        window.location.href = '/';
        return;
      }

      let userData;
      try {
        userData = JSON.parse(storedUser);
      } catch (e) {
        console.error('[Customer App] Failed to parse bank_user:', e);
        addSecurityLog('Session parse failed - using demo data');
        return;
      }

      console.log('[Customer App] Parsed userData:', userData);

      if (!userData.id) {
        console.log('[Customer App] No user ID in bank_user - using demo data');
        addSecurityLog('No user ID in session - using demo data');
        return;
      }

      setStudentId(String(userData.id));

      console.log('[Customer App] Fetching customer data for ID:', userData.id);

      let client;
      try {
        client = requireSupabase();
      } catch {
        addSecurityLog('Supabase not configured - using demo data');
        return;
      }

      // Fetch customer data from customers table
      const { data: customerData, error } = await client
        .from('students')
        .select('*')
        .eq('id', userData.id)
        .single();

      console.log('[Customer App] Customer data from Supabase:', customerData);
      console.log('[Customer App] Fetch error:', error);

      if (error || !customerData) {
        console.warn('[Customer App] Customer fetch failed:', error?.message);
        addSecurityLog('Customer data fetch failed - using demo data');
        return;
      }

      applyStudentRow(customerData);
      setLiveDbConnected(true);

      realtimeChannel = subscribeToStudent(String(userData.id), (row) => {
        applyStudentRow(row);
        setLiveDbConnected(true);
        addSecurityLog('Live sync — profile updated from database');
      });

      addSecurityLog(`Session established for: ${customerData.full_name || userData.full_name || 'Customer'}`);
      console.log('[Customer App] Profile updated with Supabase data + realtime active');
    };

    fetchUserProfile();

    return () => {
      if (realtimeChannel && supabase) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  // Live clock simulation
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const tInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(tInterval);
  }, []);


  const addSecurityLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [`[${timestamp}] ${text}`, ...prev.slice(0, 19)]);
  };

  // Transaction Ledger action triggers
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'date'>) => {
    const txId = `tx-${Date.now()}`;
    const txDate = new Date().toISOString();
    const createdTx: Transaction = {
      ...newTx,
      id: txId,
      date: txDate
    };

    setTransactions(prev => [createdTx, ...prev]);
    if (studentId) {
      void transactionsDb.upsert(customerTransactionToRow(createdTx, studentId));
    }

    // Recalculate Wealth balance indices
    setWealth(prev => {
      const isInc = newTx.type === 'income';
      const balanceDiff = isInc ? newTx.amount : -newTx.amount;
      const incomeDiff = isInc ? newTx.amount : 0;
      const expensesDiff = isInc ? 0 : newTx.amount;

      const nextBalance = prev.balance + balanceDiff;
      const nextIncome = prev.income + incomeDiff;
      const nextExpenses = prev.expenses + expensesDiff;
      const nextSavingsRate = nextIncome > 0 ? Math.max(0, Math.min(100, Math.round(((nextIncome - nextExpenses) / nextIncome) * 100))) : 0;

      syncBalanceToDb(nextBalance);

      return {
        balance: nextBalance,
        income: nextIncome,
        expenses: nextExpenses,
        savingsRate: nextSavingsRate
      };
    });

    addSecurityLog(`Ledger mutation registered: ${newTx.type === 'income' ? 'Credits' : 'Debits'} of ₹${newTx.amount.toLocaleString()} [${newTx.merchant}]`);
    triggerToast(`✓ ₹${newTx.amount.toLocaleString()} successfully recorded!`);
  };

  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find(t => t.id === id);
    if (!target) return;

    setTransactions(prev => prev.filter(t => t.id !== id));
    if (studentId) void transactionsDb.remove(id);

    setWealth(prev => {
      const isInc = target.type === 'income';
      const balanceRestore = isInc ? -target.amount : target.amount;
      const incomeRestore = isInc ? -target.amount : 0;
      const expensesRestore = isInc ? 0 : -target.amount;

      const nextBalance = prev.balance + balanceRestore;
      const nextIncome = prev.income + incomeRestore;
      const nextExpenses = prev.expenses + expensesRestore;
      const nextSavingsRate = nextIncome > 0 ? Math.max(0, Math.min(100, Math.round(((nextIncome - nextExpenses) / nextIncome) * 100))) : 0;

      syncBalanceToDb(nextBalance);

      return {
        balance: nextBalance,
        income: nextIncome,
        expenses: nextExpenses,
        savingsRate: nextSavingsRate
      };
    });

    addSecurityLog(`Ledger entry parsed out [Deleted: ${target.merchant} - ₹${target.amount}]`);
  };

  // Card triggers
  const handleToggleFreeze = (cardId: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextState = !c.isFrozen;
        addSecurityLog(`Card state lock: card terminating [${c.last4}] updated to: ${nextState ? 'FROZEN' : 'ACTIVE'}`);
        if (studentId) void cardsDb.upsert({ id: c.id, student_id: studentId, is_frozen: nextState });
        return { ...c, isFrozen: nextState };
      }
      return c;
    }));
  };

  const handleUpdateLimit = (cardId: string, limit: number) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        addSecurityLog(`NFC limit altered for card [${c.last4}] to budget limit: ₹${limit}`);
        if (studentId) void cardsDb.upsert({ id: c.id, student_id: studentId, daily_limit: limit });
        return { ...c, dailyLimit: limit };
      }
      return c;
    }));
  };

  const handleToggleContactless = (cardId: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextState = !c.contactlessEnabled;
        addSecurityLog(`Contactless toggle for card [${c.last4}]: state changed to ${nextState ? 'ENABLED' : 'DISABLED'}`);
        if (studentId) void cardsDb.upsert({ id: c.id, student_id: studentId, contactless_enabled: nextState });
        return { ...c, contactlessEnabled: nextState };
      }
      return c;
    }));
  };

  const handleNewVault = (name: string, target: number, category: string) => {
    const newV: SavingVault = {
      id: `vault-${Date.now()}`,
      name,
      targetAmount: target,
      currentAmount: 0,
      category
    };
    setVaults(prev => [...prev, newV]);
    if (studentId) {
      void vaultsDb.upsert({
        id: newV.id,
        student_id: studentId,
        name: newV.name,
        target_amount: newV.targetAmount,
        current_amount: 0,
        category: newV.category,
      });
    }
    addSecurityLog(`Deposit vault generated: "${name}" targeted at goal ceiling of ₹${target.toLocaleString()}`);
  };

  const handleDeleteVault = (vaultId: string) => {
    const target = vaults.find(v => v.id === vaultId);
    if (!target) return;

    if (target.currentAmount > 0) {
      setWealth(prev => ({ ...prev, balance: prev.balance + target.currentAmount }));
      addSecurityLog(`Closed savings goal "${target.name}". Returned principal ₹${target.currentAmount} to cash balance.`);
    } else {
      addSecurityLog(`Removed empty vault target: "${target.name}"`);
    }
    setVaults(prev => prev.filter(v => v.id !== vaultId));
  };

  const handleDepositToVault = (vaultId: string, amount: number) => {
    setVaults(prev => prev.map(v => {
      if (v.id === vaultId) return { ...v, currentAmount: v.currentAmount + amount };
      return v;
    }));

    setWealth(prev => ({ ...prev, balance: prev.balance - amount }));

    const vObj = vaults.find(v => v.id === vaultId);
    handleAddTransaction({
      merchant: `Goal Allocation: ${vObj?.name || 'Vault'}`,
      amount,
      category: 'Transfer',
      tag: '#savings',
      status: 'completed',
      type: 'expense',
      notes: 'Savings deposit partition'
    });
  };

  const handleWithdrawFromVault = (vaultId: string, amount: number) => {
    setVaults(prev => prev.map(v => {
      if (v.id === vaultId) return { ...v, currentAmount: v.currentAmount - amount };
      return v;
    }));

    setWealth(prev => ({ ...prev, balance: prev.balance + amount }));

    const vObj = vaults.find(v => v.id === vaultId);
    handleAddTransaction({
      merchant: `Goal recall: ${vObj?.name || 'Vault'}`,
      amount,
      category: 'Transfer',
      tag: '#savings-withdrawal',
      status: 'completed',
      type: 'income',
      notes: 'Savings withdrawal recovery'
    });
  };

  // Open / create custom bank accounts
  const handleAccountCreated = (accountType: string, customNumber: string) => {
    const newArr = [
      { accountNumber: customNumber, type: accountType, branchName: 'Metro High-Tech Branch', balance: '₹0.00' },
      ...customAccounts
    ];
    setCustomAccounts(newArr);
    addSecurityLog(`Provisioned new bank portfolio slot: ${accountType} (${customNumber})`);
    setShowCreateAccountModal(false);
    triggerToast(`🏦 Opened brand-new ${accountType}! Number: ${customNumber}`);
  };

  // Unified list of selectable transfer sources (Excluding Credit Cards as requested)
  const depositSources = React.useMemo(() => {
    const list: { id: string; type: 'card' | 'account'; name: string; numberLabel: string; fullDetails: string }[] = [];
    
    // 1. Add Bank Accounts
    customAccounts.forEach((acc, index) => {
      const cleanNum = acc.accountNumber.replace(/\s+/g, '').toUpperCase();
      let formatted = cleanNum;
      if (cleanNum.startsWith('XXXX')) {
        const suffix = cleanNum.slice(4);
        formatted = `3099 0821 ${suffix}`;
      } else if (cleanNum.includes('XXXX')) {
        const replaced = cleanNum.replace('XXXX', '5821');
        formatted = replaced.replace(/(.{4})/g, '$1 ').trim();
      } else {
        formatted = cleanNum.replace(/(.{4})/g, '$1 ').trim();
      }
      
      list.push({
        id: `account-${index}-${acc.accountNumber}`,
        type: 'account',
        name: acc.type || 'Savings Account',
        numberLabel: formatted,
        fullDetails: `🏦 ${acc.type} (${formatted})`
      });
    });

    // 2. Add Debit Cards (EXCLUDING Credit Cards)
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

  const handleStartOnlineDeposit = () => {
    const firstSource = depositSources[0]?.id || '';
    setOnlineDepositFrom(firstSource);
    setOnlineDepositTo('main');
    setOnlineDepositAmount('');
    setOnlineDepositStep(1);
    setOnlineDepositEmailVerify('');
    setOnlineDepositPhoneVerify('');
    setOnlineDepositOtpSimulated('');
    setOnlineDepositOtpUser('');
    setOnlineDepositMfaError('');
    setOnlineDepositOtpSent(false);
    setOnlineDepositSourceMethod('external'); // Pre-select "another bank" to directly address user preference!
    setOnlineDepositExtBankName('State Bank of India');
    setOnlineDepositExtAccNum('');
    setOnlineDepositExtIFSC('');
    setShowOnlineDeposit(true);
  };

  const handleSendOnlineDepositOtp = () => {
    setOnlineDepositSendingOtp(true);
    setOnlineDepositMfaError('');
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setOnlineDepositOtpSimulated(code);
      setOnlineDepositSendingOtp(false);
      setOnlineDepositOtpSent(true);
    }, 1000);
  };

  const handleVerifyAndExecuteOnlineDeposit = () => {
    setOnlineDepositMfaError('');
    const amt = parseFloat(onlineDepositAmount);
    if (isNaN(amt) || amt <= 0) {
      setOnlineDepositMfaError('❌ Please enter a valid deposit amount.');
      return;
    }

    if (onlineDepositSourceMethod === 'external') {
      if (!onlineDepositExtBankName.trim()) {
        setOnlineDepositMfaError('❌ Please specify the external bank name.');
        return;
      }
      if (!onlineDepositExtAccNum.trim() || onlineDepositExtAccNum.length < 8) {
        setOnlineDepositMfaError('❌ Please entry a valid external account number (minimum 8 digits).');
        return;
      }
      if (!onlineDepositExtIFSC.trim() || onlineDepositExtIFSC.length < 4) {
        setOnlineDepositMfaError('❌ Please specify a valid external IFSC Routing code.');
        return;
      }
    }

    const cleanEmail = onlineDepositEmailVerify.trim().toLowerCase();
    const cleanPhone = onlineDepositPhoneVerify.replace(/\D/g, '');

    const registeredEmail = profile.email.trim().toLowerCase();
    const rawMobile = profile.mobile.replace(/\D/g, '');
    const registeredPhoneSuffix = rawMobile.length >= 10 ? rawMobile.slice(-10) : rawMobile;

    if (!cleanEmail || cleanEmail !== registeredEmail) {
      setOnlineDepositMfaError('❌ Validation Failed: Provided email does not match registered profile inbox.');
      return;
    }

    if (!cleanPhone || !registeredPhoneSuffix.endsWith(cleanPhone)) {
      setOnlineDepositMfaError('❌ Validation Failed: Provided mobile ends-with did not match registered phone digits.');
      return;
    }

    if (onlineDepositOtpUser !== onlineDepositOtpSimulated) {
      setOnlineDepositMfaError('❌ Invalid 6-digit verification code. Please check code or request new dispatch.');
      return;
    }

    // Success - Execute
    if (onlineDepositTo === 'main') {
      setWealth(prev => ({
        ...prev,
        balance: prev.balance + amt,
        income: prev.income + amt
      }));
    } else {
      setCustomAccounts(prev => prev.map(acc => {
        if (acc.accountNumber === onlineDepositTo) {
          const currentNum = parseFloat(acc.balance.replace(/[^\d.]/g, '')) || 0;
          const updatedBalanceVal = currentNum + amt;
          return {
            ...acc,
            balance: `₹${updatedBalanceVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          };
        }
        return acc;
      }));
    }

    // Add real transaction
    const chosenSrc = depositSources.find(s => s.id === onlineDepositFrom);
    const sourceString = onlineDepositSourceMethod === 'external' 
      ? `🏦 External Bank: ${onlineDepositExtBankName} (A/C ••••${onlineDepositExtAccNum.slice(-4)})` 
      : `${chosenSrc ? chosenSrc.fullDetails : 'Saved Card/Account'}`;

    handleAddTransaction({
      merchant: `Online Deposit (${onlineDepositTo === 'main' ? 'Main Balance' : 'Acct ' + onlineDepositTo})`,
      amount: amt,
      category: 'Transfer',
      tag: '#online-deposit',
      status: 'completed',
      type: 'income',
      notes: `Approved secure gateway online deposit from ${sourceString}`
    });

    addSecurityLog(`Online Deposit Complete: Processed ₹${amt} into ${onlineDepositTo === 'main' ? 'Main balance' : 'Acct ' + onlineDepositTo} from ${onlineDepositSourceMethod === 'external' ? 'another bank' : 'internal source'}`);
    triggerToast(`✓ Deposited ₹${amt.toLocaleString()} successfully!`);

    // close and clean
    setShowOnlineDeposit(false);
  };

  const handleDownloadStatement = () => {
    if (filteredTxs.length === 0) {
      triggerToast("⚠️ No transactions found to export with current filters.");
      return;
    }

    const headers = ["Reference ID", "Merchant/Origin", "Category", "Date", "Entry Type", "Amount", "Settlement Status"];
    const rows = filteredTxs.map(tx => [
      tx.id,
      tx.merchant.replace(/"/g, '""'),
      tx.category,
      new Date(tx.date).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
      tx.type === 'income' ? 'CREDIT' : 'DEBIT',
      `₹${tx.amount.toLocaleString('en-IN')}`,
      tx.status
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(val => `"${val}"`).join(","))
    ].join("\n");
    
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Apex_Statement_${txCategoryFilter !== 'All' ? txCategoryFilter + '_' : ''}${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    addSecurityLog(`User compiled and downloaded statement: (${filteredTxs.length} records, format: CSV)`);
    triggerToast(`✓ Statement of Accounts CSV compiled & downloaded! (${filteredTxs.length} records)`);
  };

  const triggerToast = (msg: string) => {
    setShowSuccessToast(msg);
    setTimeout(() => {
      setShowSuccessToast(null);
    }, 4000);
  };

  // Helper values for categories in image 2
  const categoriesActivityData = [
    { title: 'Transfer', total: '₹42,050', actionLabel: 'Send funds', count: '14 transactions', color: 'bg-[#ff5e9c]/10 text-[#ff5e9c]' },
    { title: 'Pay Bill', total: '₹12,260', actionLabel: 'Recharge / Utilities', count: '8 transactions', color: 'bg-[#b03bfc]/10 text-[#b03bfc]' },
    { title: 'Shopping', total: '₹14,560', actionLabel: 'Merchant retail', count: '22 transactions', color: 'bg-[#00efd1]/10 text-[#00efd1]' },
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions History', icon: <Landmark className="w-4 h-4" /> },
    { id: 'cards', label: 'Card Control', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'savings', label: 'Savings Vaults', icon: <Building className="w-4 h-4" /> },
    { id: 'loans', label: 'Loans & Credits', icon: <Activity className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile & KYC', icon: <User className="w-4 h-4" /> }
  ] as const;

  // Filtered transactions for the transactions tab or inline list
  const filteredTxs = transactions.filter(tx => {
    const matchesSearch = tx.merchant.toLowerCase().includes(txSearchQuery.toLowerCase()) || 
                          tx.tag.toLowerCase().includes(txSearchQuery.toLowerCase());
    const matchesCategory = txCategoryFilter === 'All' || tx.category === txCategoryFilter;
    const matchesType = txTypeFilter === 'All' || tx.type === txTypeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="customer-dashboard portal-app-root h-full w-full max-w-full bg-[#fbf5f7] text-slate-100 flex flex-col lg:flex-row relative antialiased selection:bg-[#ec4899]/30 selection:text-[#2e1065] overflow-hidden">
      
      {/* 1. BACKGROUND DECORATION - EXACT REPLICATION OF PINK CLOUDS & SOFT BLUR FROM IMAGE 2 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Render the high resolution generated cloud asset as body backdrop */}
        <img 
          src={pinkCloudsBg} 
          alt="Dreamy Clouds Background"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover select-none scale-105"
        />
        
        {/* Floating gradient circles overlay for double layer frosted glass depth */}
        <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-pink-300/30 to-purple-400/20 blur-3xl animate-pulse mix-blend-multiply" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-[15%] right-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-400/35 to-rose-300/35 blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
      </div>

      {/* SUCCESS FLOATING TOAST */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-[calc(var(--demo-banner-height)+1.5rem)] left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-[#00efd1] px-6 py-3.5 rounded-2xl z-50 shadow-2xl flex items-center gap-3"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#00efd1] animate-ping" />
            <p className="text-xs font-bold text-slate-100 uppercase tracking-widest font-mono">
              {showSuccessToast}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A. LEFT SIDEBAR PANEL (Exact structure as Image 2 layout with neon highlights) */}
      <aside className="hidden lg:flex flex-col portal-sidebar-width shrink-0 h-full min-h-0 glass-sidebar lg:m-2 lg:rounded-3xl z-30 shadow-2xl border border-white/40 overflow-hidden">
        
        {/* Brand visual featuring Brand logo "apex bank" from client image */}
        <div className="p-6 border-b border-zinc-200/40 flex items-center justify-center">
          <BrandLogo className="h-7 w-auto" />
        </div>

        {/* Interactive Workspace Profile Card (Triggers Drawer View directly!) */}
        <div 
          onClick={() => {
            setActiveTab('profile');
            addSecurityLog('Requested full Customer Profile via left workspace sidebar widget.');
          }}
          className="p-4 mx-4 my-4 bg-white/60 hover:bg-white border border-white/40 hover:border-[#ff5e9c]/30 rounded-2xl shadow-soft flex flex-col items-center text-center cursor-pointer transition-all duration-300 group"
          title="Click to Edit Profile & Review Accounts"
        >
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-2xl border-2 border-[#ff5e9c]/40 bg-zinc-950 flex items-center justify-center overflow-hidden shadow-inner font-mono">
              {profile.photoUrl ? (
                <img 
                  src={profile.photoUrl} 
                  alt={profile.fullName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xl font-bold font-display text-gradient-neon">KS</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          
          <h3 className="font-display font-bold text-xs text-slate-100 group-hover:text-[#ff5e9c] transition-colors leading-none">
            {profile.fullName}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">{profile.customerId}</p>
          
          <div className="mt-3 text-[9px] bg-pink-500/20 text-[#ff5e9c] border border-[#ff5e9c]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
            ✓ SECURED CLIENT
          </div>
        </div>

        {/* Left Sidebar Links matching Image 2 with gorgeous filled active container as requested */}
        <nav className="flex-1 min-h-0 px-4 space-y-2 overflow-y-auto">
          <p className="px-3 text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-3 mt-1 font-display">
            Banking Operations
          </p>
          {navigationItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  addSecurityLog(`Shuffled view desk to section: ${item.label}`);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer hover:scale-[1.03] ${
                  active 
                    ? 'bg-gradient-to-r from-[#5b21b6] to-[#7c3aed] text-white shadow-lg shadow-[#2e1065]/10 font-bold' 
                    : 'text-[#2e1065]/70 hover:bg-white/40 hover:text-[#2e1065]'
                }`}
              >
                <div className={`${active ? 'text-white' : 'text-[#2e1065]/60'} w-4.5 h-4.5 flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Safety clearances log in bottom */}
        <div className="p-4 border-t border-zinc-200/30 text-center bg-white/40">
          <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            SECURE CHECKS OK
          </p>
          <p className="text-[8px] text-slate-500 leading-normal mt-0.5">
            Compliance sandbox actively certified under KYC guidelines.
          </p>
        </div>
      </aside>

      {/* B. MAIN VIEWPORT WRAPPER (shifts right on desktop for fixed sidebar) */}
      <div className="flex-1 flex flex-col z-10 w-full h-full min-h-0 overflow-hidden">
        
        {/* Top Header Controls Area (Search as in Image 2 + Create Account top banner + dynamic info) */}
        <header className="px-3 sm:px-5 py-2.5 sm:py-3 border border-white/40 backdrop-blur-[24px] flex flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0 z-30 bg-white/20 rounded-[20px] sm:rounded-[24px] mx-2 sm:mx-4 my-2 shadow-sm laptop-compact-y">
          
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 bg-white/40 border border-white/50 rounded-xl text-[#2e1065] hover:bg-white/60 lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Welcome banner and greeting */}
            <div className="hidden md:block">
              <h1 className="text-[20px] font-black font-display text-[#2e1065] flex items-center gap-1.5 leading-none">
                <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                <Sparkle className="w-3.5 h-3.5 text-[#ec4899] animate-pulse" />
              </h1>
              <p className="text-[10px] text-[#2e1065]/70 uppercase tracking-widest mt-1.5 font-mono font-bold">
                Welcome back, {profile.fullName.split(' ')[0]}
              </p>
            </div>
          </div>

          {/* Central Glass Search Bar per visual specs */}
            <div className="flex-1 max-w-sm hidden lg:flex items-center relative min-w-[8rem]">
            <Search className="w-4 h-4 text-[#2e1065]/50 absolute left-3.5" />
            <input 
              type="text" 
              placeholder="Search everything across all sections..." 
              className="w-full bg-white/20 border border-white/30 pl-10 pr-4 py-2 rounded-2xl text-[13px] text-[#2e1065] placeholder-[#2e1065]/50 focus:outline-none focus:bg-white/40 focus:border-white/60 transition-all font-display font-semibold shadow-inner"
            />
          </div>

          {/* Right Header Panel Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            {/* 🏦 Create New Account Action Button */}
            <button
              onClick={() => {
                setShowCreateAccountModal(true);
                addSecurityLog('Triggered instant bank portfolio creation drawer.');
              }}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#5b21b6] to-[#7c3aed] hover:from-[#4c1d95] hover:to-[#6d28d9] text-white rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-250 hover:scale-[1.04] active:scale-[0.96] flex items-center gap-1.5 shadow-md hover:shadow-[#5b21b6]/20 cursor-pointer text-center"
            >
              <Plus className="w-3.5 h-3.5 border border-white/50 rounded-md" />
              <span className="hidden sm:inline">Create Account</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* Live database sync indicator */}
            {liveDbConnected && <LiveBadge connected className="hidden sm:inline-flex" />}

            {/* Time Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/40 border border-white/50 px-3 py-2 rounded-xl text-[#2e1065] text-xs font-mono font-bold shadow-sm laptop-hide-short">
              <Clock className="w-3.5 h-3.5 text-[#ec4899] animate-pulse" />
              <span>{currentTime.toLocaleTimeString('en-US', { hour12: false })} UTC</span>
            </div>

            {/* Logout button at the top-right corner as requested! */}
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
                addSecurityLog('Requested client session termination logout.');
              }}
              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl transition-all hover:scale-[1.04] active:scale-[0.96] cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Logout Customer Account"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </header>

        {/* Mobile Flyout Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              className="fixed portal-fixed-below-banner-tight bottom-0 left-0 w-72 z-40 glass-sidebar p-6 flex flex-col justify-between border-r border-white/40 lg:hidden shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#2e1065]/10 pb-4">
                  <BrandLogo className="h-6 w-auto" />
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 bg-white/45 hover:bg-white/75 border border-white/55 rounded-full cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4 text-[#2e1065]" />
                  </button>
                </div>

                <div 
                  onClick={() => {
                    setActiveTab('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3.5 p-3.5 bg-white/50 border border-white/60 rounded-2xl cursor-pointer hover:bg-white transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2e1065]/10 border border-white/60 flex items-center justify-center font-bold text-[#ec4899] font-mono shadow-inner">
                    KS
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#2e1065] leading-none">{profile.fullName}</h3>
                    <p className="text-[9px] text-[#2e1065]/50 font-mono mt-1 font-bold">{profile.customerId}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {navigationItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-semibold text-left transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer hover:scale-[1.03] ${
                        activeTab === item.id 
                          ? 'bg-gradient-to-r from-[#5b21b6] to-[#7c3aed] text-white shadow-md shadow-[#2e1065]/10 font-bold' 
                          : 'text-[#2e1065]/70 hover:bg-white/40 hover:text-[#2e1065]'
                      }`}
                    >
                      <div className={`${activeTab === item.id ? 'text-white' : 'text-[#2e1065]/60'} w-4.5 h-4.5 flex items-center justify-center shrink-0`}>
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-3.5 bg-white/40 border border-white/50 rounded-2xl text-center text-[10px] text-[#2e1065]/60 font-mono font-bold shadow-sm">
                SECURED SYSTEM INTERACTIVE CHASSIS
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOGOUT CONFIRMATION DIALOG MODAL */}
        <AnimatePresence>
          {showLogoutConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-zinc-950 p-6 rounded-3xl border border-white/10 max-w-sm w-full text-center space-y-4 shadow-2xl"
              >
                <div className="w-12 h-12 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto text-xl">
                  <LogOut className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-slate-100 font-bold font-display text-sm">Secure Sign Out Request</h4>
                  <p className="text-xs text-slate-400">
                    Are you sure you would like to end your banking session? Any unsaved edits will be discarded.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="py-2 bg-[#FAF5F6]/5 hover:bg-[#FAF5F6]/10 text-slate-300 text-xs font-bold rounded-xl border border-white/5 transition-all cursor-pointer"
                  >
                    Hold Session
                  </button>
                  <button
                    onClick={() => {
                      clearSession();
                      window.location.href = '/';
                    }}
                    className="py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Confirm Exit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* C. GENERAL MAIN VIEWPORT PANEL */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 relative z-10 max-w-7xl mx-auto w-full min-h-0 overflow-y-auto overflow-x-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* -- 1. DASHBOARD VIEWPORT TAB -- */}
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dash" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* CENTRAL MAIN PANEL (Cards, Categories, Transactions) */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Welcome Box with Online Deposit Action */}
                    <div className="p-6 bg-zinc-900/40 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-[#ff5e9c] tracking-widest font-mono">
                          Active Client Account
                        </p>
                        <h2 className="text-2xl font-black font-display text-slate-100">
                          Welcome, {profile.fullName}
                        </h2>
                        <p className="text-xs text-slate-400">
                          Interactive customer-centric dark dashboard configured as requested. Manage savings rates and dynamic credits.
                        </p>
                      </div>
                      
                      <button
                        onClick={handleStartOnlineDeposit}
                        className="py-3 px-5 bg-gradient-to-r from-[#ff5e9c] to-[#b03bfc] text-white hover:opacity-95 text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto hover:scale-[1.03] active:scale-[0.98]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Online Deposit</span>
                      </button>
                    </div>

                    {/* My Card row matching Image 2 */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 font-display">
                          My Cards
                        </h3>
                        {cards.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => setActiveTab('cards')}
                            className="text-[10px] font-bold text-[#ff5e9c] hover:text-[#b03bfc] transition-all cursor-pointer flex items-center gap-1 bg-[#ff5e9c]/10 hover:bg-[#ff5e9c]/20 px-2.5 py-1 rounded-full border border-[#ff5e9c]/20 hover:border-[#ff5e9c]/40 font-mono"
                          >
                            More (+{cards.length - 1}) <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Card rendering identical to image 2 */}
                      {(() => {
                        const debitCard = cards.find(c => c.id === 'card-debit') || cards[0];
                        return (
                          <div 
                            onClick={() => setActiveTab('cards')}
                            className={`bg-gradient-to-br from-[#ff5e9c] to-[#b03bfc] p-6 rounded-3xl border border-pink-100/20 relative overflow-hidden shadow-2xl h-48 flex flex-col justify-between glow-card-pink cursor-pointer transition-all duration-200 hover:scale-[1.01] ${debitCard?.isFrozen ? 'opacity-80' : ''}`}
                          >
                            {/* Background glowing circle insignia matching the VISA gradient from Image 2 */}
                            <div className="absolute right-[-10%] top-[-20%] w-48 h-48 rounded-full bg-white/20 blur-2xl pointer-events-none" />
                            
                            {debitCard?.isFrozen && (
                              <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
                                <span className="px-3.5 py-1.5 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-rose-450">
                                  <span>❄️ Card Frozen</span>
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-[10px] text-pink-100 font-mono uppercase tracking-widest font-extrabold">{debitCard?.cardType?.toUpperCase() || 'VISA PLATINUM'}</p>
                                <p className="text-xs text-pink-100/80 font-mono mt-0.5">Debit Card</p>
                              </div>
                              {/* VISA Pink glowing overlay logo mimicking Image 2 */}
                              <div className="flex items-center gap-1 font-black text-white font-display italic text-lg tracking-tight select-none">
                                <span className="text-pink-100 opacity-90">V</span>ISA
                              </div>
                            </div>

                            <div>
                              <p className="text-[10px] text-pink-100/90 font-mono">Total balance</p>
                              <p className="text-2xl font-black text-white font-mono mt-1 tracking-tight">
                                ₹{wealth.balance.toLocaleString()} INR
                              </p>
                            </div>

                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[9px] text-pink-100/90 uppercase font-mono">Name</p>
                                <p className="text-xs font-bold text-white mt-0.5 font-display tracking-wide">{profile.fullName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[9px] text-pink-100/90 uppercase font-mono font-bold">Expiry</p>
                                <p className="text-xs font-bold text-white mt-0.5 font-mono">{debitCard?.expiry || '08/29'}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Secondary Cards mini shelf list */}
                      {cards.length > 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {cards.slice(1).map((c) => (
                            <div 
                              key={c.id}
                              onClick={() => setActiveTab('cards')}
                              className="p-3.5 bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/5 hover:border-[#ff5e9c]/30 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 group select-none"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-xs shadow-md ${
                                  c.colorType === 'classic-pink' ? 'bg-[#ff5e9c]' : 'bg-[#b03bfc]'
                                }`}>
                                  {c.network === 'Visa' ? 'V' : 'M'}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold text-slate-200 capitalize leading-none">{c.cardType}</p>
                                  <p className="text-[9px] text-[#ff5e9c] font-mono mt-1 font-bold">•••• {c.last4}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[8px] bg-white/5 text-slate-400 font-mono border border-white/5 px-1.5 py-0.5 rounded-md">
                                  Limit ${c.dailyLimit}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Category row matching Image 2 */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 font-display">
                        Category Quick actions
                      </h3>

                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {categoriesActivityData.map((cat, idx) => (
    <div 
      key={idx} 
      className="bg-white hover:bg-gray-50 border border-pink-200 rounded-2xl p-4 flex items-center gap-3.5 transition-all cursor-pointer"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
        {cat.title === 'Transfer' && <Send className="w-5 h-5" />}
        {cat.title === 'Pay Bill' && <Landmark className="w-5 h-5" />}
        {cat.title === 'Shopping' && <CreditCard className="w-5 h-5" />}
      </div>
      <div>
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{cat.title}</p>
        <p className="text-sm font-bold font-mono text-gray-800 mt-0.5">{cat.total}</p>
        <p className="text-[9px] text-gray-400 mt-0.5">{cat.count}</p>
      </div>
    </div>
  ))}
</div>
                      
                    </div>

                  </div>

                  {/* STATISTICS & GLOWING ANALYTICS COLUMN (Matching right of Image 2) */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 font-display">
                      Statistics
                    </h3>

                    {/* Statistics Box */}
                    <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 space-y-6 glow-card-purple">
                      
                      {/* 1. Large concentric donut representation */}
                      <div className="text-center space-y-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 leading-none">
                          Concentric Asset Ratio
                        </p>
                        
                        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                          {/* Beautiful CSS Circular representation representing concentric ring gauge from Image 2 */}
                       <div className="absolute inset-0 rounded-full border-[12px] border-[#5a0a2c]" />

{/* Bright Pink Rotating Ring */}
<div
  className="absolute inset-0 rounded-full border-[12px] border-dashed border-[#ff4d9d]/50 animate-spin"
  style={{ animationDuration: '40s' }}
/>

{/* Dark Pink Inner Ring */}
<div className="absolute inset-1 rounded-full border-4 border-dashed border-[#c2185b]/40" />
                          
                          <div className="z-10 text-center">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Total Balance</p>
                           <p className="text-base font-pink text-pink-500 font-mono mt-1">
  ₹{wealth.balance < 1000000 ? wealth.balance.toLocaleString() : '6,000'}
</p>
                            <span className="text-[9px] text-[#ff5e9c] font-bold bg-pink-500/20 px-2 py-0.5 rounded-full mt-1 inline-block border border-[#ff5e9c]/25">
                              +14.8% Active
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-center gap-4 text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#ff5e9c]" />
                            <span className="text-slate-400">Income Ledger</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#00efd1]" />
                            <span className="text-slate-400">Savings Vaults</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Monthly dynamic bar representation mimicking Image 2 under statistics */}
                      <div className="space-y-3 pt-4 border-t border-white/5 font-mono">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Monthly Volume Yields</span>
                          <span className="text-[#ff5e9c] font-bold">April highlight</span>
                        </div>

                        {/* Visual grid bars representing Image 2 statistics */}
                        <div className="h-32 flex items-end justify-between gap-1 pt-4 px-2">
                          <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-full bg-[#ff5e9c]/20 hover:bg-[#ff5e9c] rounded-t-lg transition-all" style={{ height: '35%' }} title="Jan - ₹12,050" />
                            <span className="text-[8px] text-slate-500">Jan</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-full bg-[#ff5e9c]/20 hover:bg-[#ff5e9c]/50 rounded-t-lg transition-all" style={{ height: '45%' }} title="Feb - ₹15,500" />
                            <span className="text-[8px] text-slate-500">Feb</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-full bg-[#ff5e9c]/20 hover:bg-[#ff5e9c]/50 rounded-t-lg transition-all" style={{ height: '60%' }} title="Mar - ₹22,000" />
                            <span className="text-[8px] text-slate-500">Mar</span>
                          </div>
                          
                          {/* HIGHLIGHTED TARGET APRIL BAR WITH GLOWING OVERLAY PIN */}
                          <div className="flex flex-col items-center gap-2 flex-1 relative">
                            <div className="absolute -top-7 bg-gradient-to-r from-[#ff5e9c] to-[#b03bfc] px-1.5 py-0.5 rounded-md text-[8px] text-white font-bold opacity-100 animate-bounce">
                              ₹6,482
                            </div>
                            <div className="w-full bg-gradient-to-t from-[#b03bfc] to-[#ff5e9c] rounded-t-lg pointer-events-none" style={{ height: '85%' }} />
                            <span className="text-[8px] text-slate-200 font-bold uppercase">Apr</span>
                          </div>

                          <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-full bg-slate-800 hover:bg-[#ff5e9c]/50 rounded-t-lg transition-all" style={{ height: '50%' }} title="May - ₹18,000" />
                            <span className="text-[8px] text-slate-500">May</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-full bg-slate-800 hover:bg-[#ff5e9c]/50 rounded-t-lg transition-all" style={{ height: '40%' }} title="Jun - ₹14,200" />
                            <span className="text-[8px] text-slate-500">Jun</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-full bg-slate-800 hover:bg-[#ff5e9c]/50 rounded-t-lg transition-all" style={{ height: '70%' }} title="Jul - ₹25,000" />
                            <span className="text-[8px] text-slate-500">Jul</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* --- TRANSACTIONS DIRECTLY BELOW THE DASHBOARD (CUSTOM REQUEST) --- */}
                <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-premium space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#ff5e9c] font-display">
                        Client Transaction Ledger
                      </h3>
                      <p className="text-xs text-slate-500">
                        Live dynamic bookkeeping stream mapped directly underneath active dashboard.
                      </p>
                    </div>

                    {/* Quick transactional action */}
                    <button
                      onClick={() => {
                        // Quick simulation of a spending action
                        handleAddTransaction({
                          merchant: 'Aura Premium Coffee',
                          amount: 320,
                          category: 'Dining',
                          tag: '#daily-caffeine',
                          status: 'completed',
                          type: 'expense',
                          notes: 'Assorted gift boxes'
                        });
                      }}
                      className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100/80 text-pink-700 text-[10px] font-bold rounded-xl border border-pink-200/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#ff5e9c]" />
                      Simulate ₹320 Coffee Buy
                    </button>
                  </div>

                  {/* Inline list of recent transactions */}
                  <div className="overflow-x-auto rounded-2xl border border-pink-100">
                    <table className="w-full text-left text-xs divide-y divide-pink-100/30">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                          <th className="p-3">Reference ID</th>
                          <th className="p-3">Merchant / Origin</th>
                          <th className="p-3">Category</th>
                          <th className="p-3 text-right">Value Amount</th>
                          <th className="p-3 text-center">Settlement Status</th>
                          <th className="p-3 text-center">Verification Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {transactions.slice(0, 5).map((tx) => (
                          <tr key={tx.id} className="hover:bg-pink-50/25 transition-colors">
                            <td className="p-3 font-mono text-slate-500">{tx.id}</td>
                            <td className="p-3 font-bold text-slate-800">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-[#ff5e9c]'}`} />
                                <span className="text-slate-800">{tx.merchant}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="bg-pink-50 text-[#ff5e9c] px-2 py-0.5 rounded-md text-[10px] font-bold border border-[#ff5e9c]/10">
                                {tx.category}
                              </span>
                            </td>
                            <td className={`p-3 text-right font-bold font-mono ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                              {tx.type === 'income' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-250">
                                {tx.status}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleDeleteTransaction(tx.id)}
                                className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                                title="Remove Item Recalculate Balance"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className="text-xs text-slate-600 hover:text-[#ff5e9c] font-bold transition-all flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <span>Explore complete Transactions Ledger</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </motion.div>
            )}

            {/* -- 2. TRANSACTIONS TAB (FULL RECALCULATING ARCHITECTURE) -- */}
            {activeTab === 'transactions' && (
              <motion.div key="tx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">Double-Entry Bookkeeping Ledger</h3>
                    <p className="text-xs text-slate-500">Filter, search, or add corporate Retainers to automatically compute liquidity ratios.</p>
                  </div>

                  {/* Download Statement Trigger */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleDownloadStatement}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#ff5e9c] to-[#b03bfc] hover:from-[#ff458a] hover:to-[#a12eec] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer text-center flex-1 sm:flex-none transition-all active:scale-95 flex items-center justify-center gap-2 border border-pink-100/10 hover:border-pink-100/20"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>Download Statement</span>
                    </button>
                  </div>
                </div>

                {/* Search / Filters Drawer shelf */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-pink-100 shadow-premium">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search transactions, tags (#luxury)..."
                      value={txSearchQuery}
                      onChange={(e) => setTxSearchQuery(e.target.value)}
                      className="w-full bg-white border border-pink-100 pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-800 focus:outline-[#ff5e9c] focus:ring-1 focus:ring-[#ff5e9c] shadow-sm select-none"
                    />
                  </div>
                  <div>
                    <select
                      value={txCategoryFilter}
                      onChange={(e) => setTxCategoryFilter(e.target.value)}
                      className="w-full bg-white border border-pink-100 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5e9c] focus:ring-1 focus:ring-[#ff5e9c] shadow-sm select-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Dining">Dining</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Tech">Tech</option>
                      <option value="Health">Health</option>
                      <option value="Salary">Salary</option>
                      <option value="Transfer">Transfer</option>
                      <option value="Investments">Investments</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={txTypeFilter}
                      onChange={(e) => setTxTypeFilter(e.target.value)}
                      className="w-full bg-white border border-pink-100 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5e9c] focus:ring-1 focus:ring-[#ff5e9c] shadow-sm select-none"
                    >
                      <option value="All">All Entry Types</option>
                      <option value="income">Credits (Income)</option>
                      <option value="expense">Debits (Expense)</option>
                    </select>
                  </div>
                </div>

                {/* Full Ledger Table listing */}
                <div className="bg-white rounded-3xl border border-pink-100/80 shadow-premium overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs divide-y divide-pink-100/30">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-mono text-[9.5px] uppercase tracking-wider border-b border-pink-100/30">
                          <th className="p-3">Reference No</th>
                          <th className="p-3">Transaction Origin</th>
                          <th className="p-3">Classification</th>
                          <th className="p-3">Time Stamped Date</th>
                          <th className="p-3 text-right">Credit Value Amount</th>
                          <th className="p-3 text-center">Settlement</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredTxs.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold italic">
                              No transactions match the selected filters. Change search parameters.
                            </td>
                          </tr>
                        ) : (
                          filteredTxs.map((tx) => (
                            <tr key={tx.id} className="hover:bg-pink-50/20 transition-colors">
                              <td className="p-3 font-mono text-slate-500">{tx.id}</td>
                              <td className="p-3">
                                <div>
                                  <p className="font-bold text-slate-800">{tx.merchant}</p>
                                  <span className="text-[9.5px] text-[#ff5e9c] font-mono">{tx.tag}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="bg-pink-50 text-[#ff5e9c] px-2.5 py-1 rounded-md text-[10px] font-bold border border-[#ff5e9c]/10">
                                  {tx.category}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600 font-mono font-medium">
                                {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString('en-US', { hour12: false })}
                              </td>
                              <td className={`p-3 text-right font-black font-mono ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                {tx.type === 'income' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                              </td>
                              <td className="p-3 text-center">
                                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {tx.status}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleDeleteTransaction(tx.id)}
                                  className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}

            {/* -- 3. CARDS MANAGEMENT TAB -- */}
            {activeTab === 'cards' && (
              <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-display">Secured Virtual Card Hub</h3>
                  <p className="text-xs text-slate-400">Lock, edit, or generate virtual debit limits with fast biometric simulation.</p>
                </div>

                <DebitCards 
                  cards={cards} 
                  onToggleFreeze={handleToggleFreeze}
                  onUpdateLimit={handleUpdateLimit}
                  onToggleContactless={handleToggleContactless}
                  customerName={profile.fullName}
                />
              </motion.div>
            )}

            {/* -- 4. SAVINGS VAULTS TAB -- */}
            {activeTab === 'savings' && (
              <motion.div key="savings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-display">Apex Goal Savings Vaults</h3>
                  <p className="text-xs text-slate-400">Store and allocate partition budgets to achieve liquid asset milestones.</p>
                </div>

                <SavingsVaults 
                  vaults={vaults}
                  onDeposit={handleDepositToVault}
                  onWithdraw={handleWithdrawFromVault}
                  onNewVault={handleNewVault}
                  onDeleteVault={handleDeleteVault}
                  userBalance={wealth.balance}
                  cards={cards}
                  customAccounts={customAccounts}
                  profile={profile}
                />
              </motion.div>
            )}

            {/* -- 5. LOANS & CREDIT HUB (REPLACES AI STRATEGY AND SECURITY CONTROL AS DIRECTED) -- */}
            {activeTab === 'loans' && (
              <motion.div key="loans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-display text-gradient-neon">Apex Credit & Mortgages Ledger</h3>
                  <p className="text-xs text-slate-400">Submit lightning-fast loan approvals with instantaneous principal disbursals into your primary savings layout.</p>
                </div>

                <CustomerLoans 
                  userBalance={wealth.balance}
                  onNewTransaction={handleAddTransaction}
                  addSecurityLog={addSecurityLog}
                />
              </motion.div>
            )}

            {/* -- 6. PROFILE & KYC MANAGER TAB -- */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CustomerProfile 
                  profile={profile}
                  onUpdateProfile={(updated) => {
                    setProfile(updated);
                    addSecurityLog('Customer Profile registry updated successfully.');
                    triggerToast('✓ Profile successfully updated!');
                  }}
                  onClose={() => setActiveTab('dashboard')}
                />
              </motion.div>
            )}

          </AnimatePresence>

        </main>

        {/* Elegant cyber luxury matte footer */}
       <footer className="shrink-0 bg-gradient-to-b from-rose-50/80 to-pink-50/80 border-t border-rose-200/50 py-4 sm:py-6 text-center text-xs relative z-10 backdrop-blur-sm laptop-hide-short">
  <p className="font-mono tracking-wider font-extrabold text-purple-600 text-gradient-neon uppercase text-[10px]">
    APEX DIGITAL BANKING CONSOLE © 2026
  </p>
  <p className="mt-1 text-[9px] text-slate-500 leading-normal max-w-lg mx-auto">
    Authorized and encrypted secure clearing sandbox running continuously under compliance regulations. All accounts, loans and cards are fully-simulated and editable instantly within this browser session.
  </p>
</footer>

      </div>

      {/* PERSISTENT FLOATING AI POPUP AT THE CORNER */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {aiPopupOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="mb-4 w-96 max-w-[calc(100vw-2rem)] h-[min(560px,calc(100dvh-var(--demo-banner-height)-4rem))] portal-constrained-panel bg-zinc-950/95 border border-[#ff5e9c]/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-xl"
            >
              {/* Header inside the popup */}
              <div className="bg-gradient-to-r from-[#ff5e9c]/20 via-[#b03bfc]/20 to-black p-4 border-b border-white/10 flex justify-between items-center select-none shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#ff5e9c]/20 text-[#ff5e9c] rounded-lg">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black font-display text-white tracking-wide uppercase">Apex AI Advisor</h4>
                    <p className="text-[9px] text-[#ff5e9c] font-mono leading-none mt-0.5">Autonomous Private Banker</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAiPopupOpen(false)}
                  className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="Close AI Assistant"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main AI Body */}
              <div className="flex-1 overflow-y-auto">
                <AIFinancialAdvisor 
                  transactions={transactions}
                  savingsVaults={vaults}
                  balance={wealth.balance}
                  onClose={() => setAiPopupOpen(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Button */}
        <motion.button
          onClick={() => setAiPopupOpen(!aiPopupOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer relative group border transition-all ${
            aiPopupOpen 
              ? 'bg-[#ff5e9c] text-white border-white/20 shadow-[#ff5e9c]/30' 
              : 'bg-zinc-950 text-[#ff5e9c] border-[#ff5e9c]/30 hover:border-[#ff5e9c]/60 shadow-black/80'
          }`}
          title="Ask Apex AI"
        >
          {aiPopupOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5e9c] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff5e9c]"></span>
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* CREATE NEW ACCOUNT DIALOG OVERLAY PORTAL */}
      <AnimatePresence>
        {showCreateAccountModal && (
          <CreateAccountModal 
            onClose={() => setShowCreateAccountModal(false)}
            onAccountCreated={handleAccountCreated}
          />
        )}
      </AnimatePresence>

      {/* ONLINE DEPOSIT DIALOG OVERLAY PORTAL */}
      <AnimatePresence>
        {showOnlineDeposit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
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
              
              {onlineDepositStep === 1 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-pink-500/10 text-[#ff5e9c] rounded-xl flex items-center justify-center">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-slate-100 text-sm leading-none">
                          Online Deposit
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold">Secure Clearing Module</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOnlineDeposit(false)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* DEPOSIT SOURCE METHOD TABS */}
                  <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5 gap-1">
                    <button
                      type="button"
                      onClick={() => setOnlineDepositSourceMethod('external')}
                      className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                        onlineDepositSourceMethod === 'external'
                          ? 'bg-gradient-to-r from-pink-500 to-[#b03bfc] text-white shadow-md font-sans'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 font-sans'
                      }`}
                    >
                      🏦 Another Bank
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnlineDepositSourceMethod('internal')}
                      className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                        onlineDepositSourceMethod === 'internal'
                          ? 'bg-gradient-to-r from-pink-500 to-[#b03bfc] text-white shadow-md font-sans'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 font-sans'
                      }`}
                    >
                      💳 Stored Portfolio
                    </button>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = parseFloat(onlineDepositAmount);
                      if (isNaN(val) || val <= 0) {
                        setOnlineDepositMfaError('Please specify a positive monetary amount.');
                        return;
                      }
                      if (onlineDepositSourceMethod === 'external') {
                        if (!onlineDepositExtBankName.trim()) {
                          setOnlineDepositMfaError('Please choose the issuing financial institution.');
                          return;
                        }
                        if (!onlineDepositExtAccNum.trim() || onlineDepositExtAccNum.length < 8) {
                          setOnlineDepositMfaError('Account number must contain at least 8 digits.');
                          return;
                        }
                        if (!onlineDepositExtIFSC.trim() || onlineDepositExtIFSC.length < 4) {
                          setOnlineDepositMfaError('Valid IFSC routing identifier is required.');
                          return;
                        }
                      }
                      setOnlineDepositStep(2);
                      setOnlineDepositMfaError('');
                    }}
                    className="space-y-4"
                  >
                    
                    {onlineDepositSourceMethod === 'external' ? (
                      /* EXTERNAL DEPOSIT SOURCE (ANOTHER BANK DETAILS) */
                      <div className="space-y-3 p-3 bg-zinc-900/60 border border-white/5 rounded-2xl animate-fade-in">
                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold uppercase text-slate-450 tracking-wider font-mono">
                            Select Issuing Bank
                          </label>
                          <select
                            required
                            value={onlineDepositExtBankName}
                            onChange={(e) => {
                              setOnlineDepositExtBankName(e.target.value);
                              const mapping: Record<string, string> = {
                                'State Bank of India': 'SBIN0001235',
                                'HDFC Bank': 'HDFC0000109',
                                'ICICI Bank': 'ICIC0000329',
                                'Axis Bank': 'UTIB0000021',
                                'Punjab National Bank': 'PUNB0102300',
                                'Citibank': 'CITI0000002',
                                'HSBC Bank': 'HSBC0900002'
                              };
                              if (mapping[e.target.value]) {
                                setOnlineDepositExtIFSC(mapping[e.target.value]);
                              }
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-zinc-950 rounded-lg border border-white/10 focus:border-pink-500 focus:outline-none font-semibold text-white/95 cursor-pointer"
                          >
                            <option value="State Bank of India">State Bank of India (SBI)</option>
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                            <option value="Citibank">Citibank</option>
                            <option value="HSBC Bank">HSBC Bank</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold uppercase text-slate-455 tracking-wider font-mono">
                            External Acc Number (Another Bank)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 30919283419"
                            value={onlineDepositExtAccNum}
                            onChange={(e) => setOnlineDepositExtAccNum(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-2.5 py-1.5 text-xs bg-zinc-950 rounded-lg border border-white/10 text-white font-mono focus:border-pink-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold uppercase text-slate-455 tracking-wider font-mono">
                            IFSC Routing Identification
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. SBIN0001235"
                            value={onlineDepositExtIFSC}
                            onChange={(e) => setOnlineDepositExtIFSC(e.target.value.toUpperCase())}
                            className="w-full px-2.5 py-1.5 text-xs bg-zinc-950 rounded-lg border border-white/10 text-white font-mono uppercase focus:border-pink-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      /* DEPOSIT FROM INTERNAL TRANSFERS */
                      <div className="space-y-1.5 animate-fade-in">
                        <label className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                          Source Transfer Instrument
                        </label>
                        <select
                          required
                          value={onlineDepositFrom}
                          onChange={(e) => setOnlineDepositFrom(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-zinc-900 rounded-xl border border-white/15 focus:outline-[#ff5e9c] font-semibold text-white/90 cursor-pointer"
                        >
                          {depositSources.map((s) => (
                            <option key={s.id} value={s.id} className="bg-zinc-950 text-slate-100 text-xs py-1">
                              {s.fullDetails}
                            </option>
                          ))}
                        </select>
                        <span className="text-[8px] text-slate-505 block text-slate-500">💳 Excludes credit instruments for security compliance.</span>
                      </div>
                    )}

                    {/* TO SELECTOR */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                        Destination Portfolio Account
                      </label>
                      <select
                        required
                        value={onlineDepositTo}
                        onChange={(e) => setOnlineDepositTo(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 rounded-xl border border-white/15 focus:outline-[#ff5e9c] font-semibold text-white/90 cursor-pointer"
                      >
                        <option value="main" className="bg-zinc-950 text-slate-100 text-xs py-1">
                          Main Wallet Balance (₹{wealth.balance.toLocaleString()})
                        </option>
                        {customAccounts.map((acc) => (
                          <option key={acc.accountNumber} value={acc.accountNumber} className="bg-zinc-950 text-slate-100 text-xs py-1">
                            🏦 {acc.type} ({acc.accountNumber}) - {acc.balance}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* AMOUNT INPUT */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                        Deposit Value Amount (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="Enter value in ₹"
                        value={onlineDepositAmount}
                        onChange={(e) => setOnlineDepositAmount(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-zinc-900 rounded-xl border border-white/10 focus:outline-[#ff5e9c] font-medium text-slate-100 font-mono text-center text-sm"
                      />
                    </div>

                    {onlineDepositMfaError && (
                      <p className="text-xs text-rose-500 bg-rose-500/10 p-2 rounded-lg text-center font-bold">
                        {onlineDepositMfaError}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowOnlineDeposit(false)}
                        className="py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Abort
                      </button>
                      <button
                        type="submit"
                        className="py-2.5 bg-gradient-to-r from-[#ff5e9c] to-[#b03bfc] text-white rounded-xl text-xs font-bold cursor-pointer hover:opacity-90"
                      >
                        Initiate Deposit
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                /* Step 2: APEX Double Authentication secure interface */
                <div className="space-y-4 animate-fade-in text-slate-100">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-pink-500/10 rounded-xl text-pink-500">
                        <ShieldCheck className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-xs text-slate-100 tracking-wider uppercase">
                          APEX GATEWAY SECURITY
                        </h3>
                        <p className="text-[10px] text-pink-400 font-bold font-mono">Multi-Factor Double Auth</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOnlineDeposit(false)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-zinc-900/60 border border-white/5 p-3.5 rounded-2xl text-[11px] leading-relaxed text-slate-300">
                    <span className="font-bold text-[#ff5e9c]">🔒 Secure Multi-channel Exchange</span>
                    <p className="mt-1">
                      To complete your secure online deposit of <span className="font-black text-white font-mono">₹{parseFloat(onlineDepositAmount).toLocaleString()}</span>, confirm your credentials below to generate dual tokens.
                    </p>
                  </div>

                  {/* Verification entries */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                        Verify Registered Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="andrew.forbist@apex.com"
                          value={onlineDepositEmailVerify}
                          onChange={(e) => setOnlineDepositEmailVerify(e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-pink-500"
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      </div>
                      <span className="text-[8px] text-slate-500 block">Registered: {profile.email}</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                        Verify Registered Mobile (10 Digits)
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={onlineDepositPhoneVerify}
                          onChange={(e) => setOnlineDepositPhoneVerify(e.target.value.replace(/\D/g, ''))}
                          maxLength={10}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      </div>
                      <span className="text-[8px] text-slate-500 block">Registered: {profile.mobile}</span>
                    </div>
                  </div>

                  {!onlineDepositOtpSent ? (
                    <button
                      type="button"
                      disabled={onlineDepositSendingOtp || !onlineDepositEmailVerify || !onlineDepositPhoneVerify}
                      onClick={handleSendOnlineDepositOtp}
                      className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-[#b03bfc] hover:opacity-90 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2"
                    >
                      {onlineDepositSendingOtp ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Constructing dual secure link...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Dispatch Dual Verifier OTP
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3.5 border-t border-white/5 pt-3 animate-fade-in">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono tracking-wider">
                            Dual Payload Verified
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                          Secure OTP token has been routed through our encrypted telecommunications framework.
                        </p>
                        
                        <div className="mt-2.5 p-1.5 bg-zinc-950 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                          <span className="text-[9px] text-emerald-400 font-mono font-bold tracking-wider uppercase ml-1">Simulated OTP:</span>
                          <span className="font-mono text-xs font-black text-white bg-emerald-500 px-2 py-0.5 rounded-lg tracking-widest">{onlineDepositOtpSimulated}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                          6-Digit Verification PIN
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="••••••"
                          value={onlineDepositOtpUser}
                          onChange={(e) => setOnlineDepositOtpUser(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-zinc-950 border border-pink-500/30 rounded-xl px-3 py-2 text-center text-lg font-black tracking-widest text-[#ff5e9c] focus:outline-none focus:border-pink-500 font-mono"
                        />
                      </div>

                      {onlineDepositMfaError && (
                        <p className="text-[10px] text-rose-500 bg-rose-500/10 p-2.5 rounded-xl font-medium text-center border border-rose-500/10">
                          {onlineDepositMfaError}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setOnlineDepositStep(1)}
                          className="py-2.5 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Modify Details
                        </button>
                        <button
                          type="button"
                          onClick={handleVerifyAndExecuteOnlineDeposit}
                          className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Finalize & Clear
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
