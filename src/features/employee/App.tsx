import './index.css';
import { useState, useEffect } from 'react';
import employeeCloudImg from './assets/images/pink_cloud_render_1781515943290.jpg';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  HelpCircle, 
  User, 
  ChevronDown, 
  Layers, 
  CreditCard, 
  Users, 
  History, 
  Activity, 
  ShieldAlert, 
  FileText, 
  PiggyBank, 
  FolderIcon, 
  Mail, 
  Award, 
  Settings,
  Sparkles,
  Info,
  Signpost,
  LogOut,
  AppWindow,
  BookOpen,
  MailCheck,
  Check,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clearSession } from '@/auth/session';
import LiveBadge from '@/components/LiveBadge';
import { useSupabaseTable } from '@/hooks/useSupabaseTable';
import {
  mapEmployeeLoanRow,
  mapEmployeeCustomerRow,
  mapEmployeeTransactionRow,
  mapFraudAlertRow,
  mapInvoiceRow,
  mapDocumentRow,
  mapInboxMessageRow,
  mapCreditProductRow,
  mapPaymentRow,
} from '@/lib/db/mappers';

// Models import
import { 
  ActiveTab, 
  WalletState, 
  PaymentItem, 
  LoanApplication, 
  CustomerCard, 
  TransactionItem, 
  FlaggedAlert, 
  InvoiceItem, 
  DocumentItem, 
  MessageItem, 
  CreditProduct, 
  SystemSyncItem 
} from './types';

// Static / dynamic datasets imports
import {
  initialWallet,
  initialPayments,
  initialLoans,
  initialCustomers,
  initialTransactions,
  initialFlaggedAlerts,
  initialInvoices,
  initialDocuments,
  initialMessages,
  initialCredits,
  initialSyncItems,
  helpGuides
} from './data';

// Component imports
import DashboardView from './components/DashboardView';
import PaymentsView from './components/PaymentsView';
import LoansView from './components/LoansView';
import CustomersView from './components/CustomersView';
import TransactionsView from './components/TransactionsView';
import FraudView from './components/FraudView';
import InvoicesView from './components/InvoicesView';
import DepositsView from './components/DepositsView';
import DocumentsView from './components/DocumentsView';
import InboxView from './components/InboxView';
import CreditsView from './components/CreditsView';
import SettingsView from './components/SettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const loansDb = useSupabaseTable({ table: 'bank_loans', mapRow: mapEmployeeLoanRow, fallback: initialLoans });
  const customersDb = useSupabaseTable({ table: 'employee_customers', mapRow: mapEmployeeCustomerRow, fallback: initialCustomers, orderColumn: 'name' });
  const transactionsDb = useSupabaseTable({ table: 'bank_transactions', mapRow: mapEmployeeTransactionRow, fallback: initialTransactions });
  const alertsDb = useSupabaseTable({ table: 'fraud_alerts', mapRow: mapFraudAlertRow, fallback: initialFlaggedAlerts });
  const invoicesDb = useSupabaseTable({ table: 'invoices', mapRow: mapInvoiceRow, fallback: initialInvoices });
  const documentsDb = useSupabaseTable({ table: 'documents', mapRow: mapDocumentRow, fallback: initialDocuments });
  const messagesDb = useSupabaseTable({ table: 'inbox_messages', mapRow: mapInboxMessageRow, fallback: initialMessages });
  const creditsDb = useSupabaseTable({ table: 'credit_products', mapRow: mapCreditProductRow, fallback: initialCredits });
  const paymentsDb = useSupabaseTable({ table: 'employee_payments', mapRow: mapPaymentRow, fallback: initialPayments });

  const loans = loansDb.data;
  const setLoans = loansDb.setData;
  const customers = customersDb.data;
  const setCustomers = customersDb.setData;
  const transactions = transactionsDb.data;
  const setTransactions = transactionsDb.setData;
  const alerts = alertsDb.data;
  const setAlerts = alertsDb.setData;
  const invoices = invoicesDb.data;
  const setInvoices = invoicesDb.setData;
  const documents = documentsDb.data;
  const setDocuments = documentsDb.setData;
  const messages = messagesDb.data;
  const setMessages = messagesDb.setData;
  const credits = creditsDb.data;
  const setCredits = creditsDb.setData;
  const payments = paymentsDb.data;
  const setPayments = paymentsDb.setData;

  const liveConnected = loansDb.connected || customersDb.connected || transactionsDb.connected || alertsDb.connected;

  const [userName, setUserName] = useState('Andrew Forbist');
  const [userEmail, setUserEmail] = useState('andrew.forbist@apexbank.com');
  const [wallet, setWallet] = useState<WalletState>(initialWallet);
  const [syncItems, setSyncItems] = useState<SystemSyncItem[]>(initialSyncItems);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomers[0]?.id || '');
  const [selectedLoanId, setSelectedLoanId] = useState<string>(initialLoans[0]?.id || '');
  const [searchIsLoading, setSearchIsLoading] = useState(false);

  // Layout UI Toggles
  const [searchQuery, setSearchQuery] = useState('');
  const [syncDropdownOpen, setSyncDropdownOpen] = useState(false);
  const [helpPaneOpen, setHelpPaneOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [syncAllStatus, setSyncAllStatus] = useState<'synced' | 'Syncing'>('synced');

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchIsLoading(true);
      const timer = setTimeout(() => {
        setSearchIsLoading(false);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setSearchIsLoading(false);
    }
  }, [searchQuery]);

  // Trigger Full Database Synchronization
  const triggerFullSync = () => {
    setSyncAllStatus('Syncing');
    setSyncItems(prev => prev.map(item => ({ ...item, status: 'Syncing' })));
    
    setTimeout(() => {
      setSyncAllStatus('synced');
      setSyncItems(prev => 
        prev.map(item => ({ 
          ...item, 
          status: 'synced', 
          lastSync: new Date().toLocaleTimeString('en-US', { hour12: false }) 
        }))
      );
      alert('SYSTEM COMPLIANCE: Central database mainframe synchronized successfully.');
    }, 1500);
  };

  // Switch to Customers/Loans active profiles
  const handleSelectCustomerByName = (name: string) => {
    // Check if they have a loan application
    const foundLoan = loans.find(l => 
      l.applicantName.toLowerCase() === name.toLowerCase() ||
      l.applicantName.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(l.applicantName.toLowerCase())
    );
    if (foundLoan) {
      setSelectedLoanId(foundLoan.id);
      setActiveTab('loans');
      return;
    }

    const found = customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setSelectedCustomerId(found.id);
      setActiveTab('customers');
      return;
    }
    // Substring fallback (e.g. if name is "Andrew Forbist Wallet" or similar)
    const foundSub = customers.find(c => 
      c.name.toLowerCase().includes(name.toLowerCase()) || 
      name.toLowerCase().includes(c.name.toLowerCase()) ||
      c.company.toLowerCase().includes(name.toLowerCase())
    );
    if (foundSub) {
      setSelectedCustomerId(foundSub.id);
      setActiveTab('customers');
    }
  };

  // Transaction appender utility
  const addTransaction = (
    sender: string, 
    recipient: string, 
    amount: number, 
    category: TransactionItem['category']
  ) => {
    const reference = `REF-TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const date = new Date().toISOString().split('T')[0];

    const newTx: TransactionItem = {
      id: `tx-${Date.now()}`,
      sender,
      recipient,
      amount,
      date,
      time,
      status: 'Completed',
      category,
      reference
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Side bar highlight helper
  const sidebarItems: Array<{ id: ActiveTab; label: string; icon: any; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'loans', label: 'Loans', icon: Users },
    { id: 'customers', label: 'Customers', icon: ChevronDown },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'fraud', label: 'Fraud Detection', icon: ShieldAlert, badge: alerts.filter(a => a.status === 'Pending').length },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'deposits', label: 'Deposits', icon: PiggyBank },
    { id: 'documents', label: 'Documents', icon: FolderIcon },
    { id: 'inbox', label: 'Inbox', icon: Mail, badge: messages.filter(m => !m.isRead).length },
    { id: 'credits', label: 'Credits', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Filter items based on searchQuery
  const filteredCustomers = searchQuery.trim() ? customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredLoans = searchQuery.trim() ? loans.filter(l => 
    l.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.loanType.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredTransactions = searchQuery.trim() ? transactions.filter(t => 
    t.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.recipient.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.reference.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredDocs = searchQuery.trim() ? documents.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const totalResultsCount = filteredCustomers.length + filteredLoans.length + filteredTransactions.length + filteredDocs.length;

  return (
    <div id="apex-portal-root" className="employee-dashboard portal-app-root h-full w-full max-w-full bg-[#fbf5f7] flex flex-col xl:flex-row p-3 sm:p-4 xl:p-5 gap-3 sm:gap-4 xl:gap-6 font-sans relative overflow-hidden antialiased select-none box-border">

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-[#2e1065]/25 backdrop-blur-[2px] xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 0. Full-screen dreamy luxury backdrop layer with floating animated baby pink clouds & subtle orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Soft Pink Cloud Formations & Drift Blobs */}
        <div className="absolute top-[10%] left-[5%] w-[420px] h-[180px] rounded-full bg-[#fbcfe8]/40 blur-[80px] animate-float" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[40%] right-[-5%] w-[520px] h-[240px] rounded-full bg-[#f472b6]/25 blur-[95px] animate-float" style={{ animationDuration: '18s', animationDelay: '2s' }} />
        <div className="absolute bottom-[15%] left-[15%] w-[480px] h-[220px] rounded-full bg-[#fce7f3]/50 blur-[90px] animate-float" style={{ animationDuration: '16s', animationDelay: '1s' }} />
        <div className="absolute bottom-[-5%] right-[25%] w-[450px] h-[190px] rounded-full bg-[#fbcfe8]/45 blur-[85px] animate-float" style={{ animationDuration: '14s', animationDelay: '3s' }} />
        
        {/* Supporting soft purple/lavender depth orbs to maintain standard premium visual quality */}
        <div className="absolute top-[-5%] left-[25%] w-[50%] h-[50%] rounded-full bg-[#f472b6]/15 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[55%] h-[55%] rounded-full bg-[#c084fc]/14 blur-[130px] animate-pulse" style={{ animationDuration: '15s' }} />
        <div className="absolute top-[35%] right-[15%] w-[40%] h-[40%] rounded-full bg-[#ec4899]/12 blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[20%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#6d28d9]/10 blur-[120px] animate-pulse" style={{ animationDuration: '18s' }} />

        {/* Real High-Fidelity 3D Baby Pink Clouds - Matching Uploaded Image Exactly with Mist Fog Movement */}
        {/* Top-Left/Left border cloud cluster drifting like slow fog */}
        <img 
          src={employeeCloudImg} 
          alt="" 
          referrerPolicy="no-referrer"
          className="absolute -top-16 -left-28 w-[480px] h-[480px] object-contain opacity-90 mix-blend-multiply pointer-events-none select-none z-10 filter saturate-110 contrast-[1.05] animate-fog-left"
        />

        {/* Bottom-Right cloud cluster rising up and migrating gently across the screen */}
        <img 
          src={employeeCloudImg} 
          alt="" 
          referrerPolicy="no-referrer"
          className="absolute -bottom-36 -right-24 w-[750px] h-[750px] object-contain opacity-[0.92] mix-blend-multiply pointer-events-none select-none z-10 filter saturate-[1.15] contrast-[1.05] animate-fog-right"
        />

        {/* Ambient background fog layers drifting across the entire workspace center layer */}
        <img 
          src={employeeCloudImg} 
          alt="" 
          referrerPolicy="no-referrer"
          className="absolute top-[20%] left-[20%] w-[600px] h-[600px] object-contain opacity-[0.14] mix-blend-multiply pointer-events-none select-none z-0 filter saturate-100 contrast-[1.02] animate-fog-center"
        />
      </div>

      {/* 1. Left Persistent Sidebar: Floating glass panel with precise dimensions and interactions */}
      <aside className={`portal-sidebar-width glass-sidebar text-[#2e1065] shrink-0 flex-col justify-between p-4 xl:p-6 relative z-40 h-full min-h-0
        fixed portal-fixed-below-banner-tight left-3 shadow-2xl xl:shadow-none xl:static
        ${sidebarOpen ? 'flex' : 'hidden'} xl:flex`}>
        
        {/* Core Sidebar Header Logo decoration */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="px-3 mb-8 select-none">
            <span className="font-display text-[28px] font-extrabold tracking-tight text-[#0f2942] leading-none lowercase block">
              apex bank
            </span>
          </div>

          {/* Nav links list with 12px vertical spacing and slight hover micro-interactions */}
          <nav className="space-y-2.5 flex-1 min-h-0 overflow-y-auto pr-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-[14px] font-sans transition-all duration-200 group active:scale-[0.96] nav-item ${
                    isActive
                      ? 'bg-gradient-to-r from-[#5b21b6] to-[#7c3aed] text-white shadow-lg shadow-purple-500/20 scale-[1.02]'
                      : 'text-[#2e1065] hover:bg-white/40 hover:scale-[1.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110 duration-200 ${
                      isActive ? 'text-white' : 'text-[#6d28d9]'
                    }`} />
                    <span className="tracking-wide">{item.label}</span>
                  </div>

                  {item.badge && item.badge > 0 ? (
                    <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-white text-[#5b21b6]' : 'bg-[#ec4899] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-[#6d28d9]/10 px-2 space-y-1.5 select-none">
          <div className="flex justify-between text-[10px] font-mono text-[#2e1065]/50 font-bold">
            <span>SECURE LINK:</span>
            <span className="text-[#ec4899] font-bold">APEX-PORT-18</span>
          </div>
          <p className="text-[10px] font-mono text-[#2e1065]/40 text-center font-bold">
            © 2026 APEX BANKING GROUP
          </p>
        </div>
      </aside>

      {/* 2. Main Content Frame (Floating next to Sidebar) */}
      <div className="flex-1 flex flex-col h-full gap-5 relative z-[1000] overflow-hidden">
        
        {/* Floating Top Header bar with exact responsive options */}
        <header className="glass-header px-4 sm:px-6 xl:px-8 py-2.5 xl:py-3.5 flex items-center justify-between gap-2 sm:gap-3 shrink-0 select-none relative z-50 laptop-compact-y">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="xl:hidden p-2 rounded-xl bg-white/40 border border-white/50 text-[#2e1065] hover:bg-white/60 shrink-0 cursor-pointer"
              aria-label="Open navigation menu"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="min-w-0">
            <h2 className="text-lg sm:text-xl xl:text-2xl font-black text-[#2e1065] font-display uppercase tracking-tight truncate">
              {activeTab === 'dashboard' ? 'Overview' : sidebarItems.find(s => s.id === activeTab)?.label}
            </h2>
            <p className="text-[10px] text-[#6d28d9] font-mono tracking-[0.16em] uppercase mt-0.5 font-extrabold truncate laptop-hide-short">
              {activeTab === 'dashboard' ? `WELCOME BACK, ${userName.split(' ')[0]}` : `SYSTEM PORTAL ZONE`}
            </p>
            </div>
          </div>

          {/* Operational tools: Search, sync dropdown triggers, profiles */}
          <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0">
            <LiveBadge connected={liveConnected} className="hidden sm:inline-flex" />
            
             {/* Elegant glass search bar as requested */}
             <div className="relative hidden md:block w-44 lg:w-52 xl:w-64 2xl:w-80" style={{ zIndex: searchQuery ? 9999 : 'auto' }}>
               <form 
                 onSubmit={(e) => {
                   e.preventDefault();
                   if (!searchQuery.trim()) return;
                   const matchedLoan = loans.find(l => l.applicantName.toLowerCase().includes(searchQuery.toLowerCase()));
                   if (matchedLoan) {
                     setSelectedLoanId(matchedLoan.id);
                     setActiveTab('loans');
                     setSearchQuery('');
                     return;
                   }
                   const matchedCust = customers.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
                   if (matchedCust) {
                     const matchingLoan = loans.find(l => l.applicantName.toLowerCase() === matchedCust.name.toLowerCase());
                     if (matchingLoan) {
                       setSelectedLoanId(matchingLoan.id);
                       setActiveTab('loans');
                     } else {
                       setSelectedCustomerId(matchedCust.id);
                       setActiveTab('customers');
                     }
                     setSearchQuery('');
                   }
                 }}
                 className="relative w-full"
               >
                 <button type="submit" className="absolute left-3 top-2.5 p-0.5 hover:scale-110 active:scale-90 transition-transform">
                   <Search className="w-4 h-4 text-[#6d28d9]/60" />
                 </button>
                 <input 
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search everything across all sections..."
                   className="w-full pl-10 pr-4 py-2 text-xs font-sans placeholder-[#6d28d9]/50 bg-white/20 hover:bg-white/30 transition-colors border border-white/40 focus:border-[#7c3aed]/40 rounded-full outline-none text-[#2e1065]"
                 />
               </form>
               {searchQuery && (
                 <>
                   {/* Clean click-outside handler plane */}
                   <div 
                     className="fixed inset-0"
                     style={{ zIndex: 9998 }}
                     onClick={() => setSearchQuery('')}
                   />
                   
                   {/* Search Dropdown with Solid White Background to prevent transparency clash */}
                   <div 
                     className="absolute left-0 mt-2 w-96 max-w-md rounded-2xl border border-pink-300/60 p-5 shadow-2xl space-y-4 max-h-[460px] overflow-y-auto text-xs text-[#2e1065]"
                     style={{ zIndex: 9999, backgroundColor: '#ffffff', opacity: 1 }}
                   >
                     <div className="flex justify-between items-center border-b border-[#2e1065]/10 pb-2">
                       <span className="font-bold uppercase tracking-wider text-[10px] text-pink-700">SEARCH RESULTS ({totalResultsCount})</span>
                       <button 
                         onClick={() => setSearchQuery('')} 
                         className="text-[#2e1065]/50 hover:text-pink-600 font-bold transition-all text-[11px]"
                       >
                         Clear
                       </button>
                     </div>

                     {searchIsLoading ? (<div className="flex flex-col items-center justify-center py-6"><div className="w-8 h-8 border-[3px] border-pink-100 border-t-pink-700 rounded-full animate-spin mb-2" /><p className="text-[10px] font-mono text-pink-700 animate-pulse font-bold uppercase tracking-wider">Scanning secure ledgers...</p></div>) : totalResultsCount === 0 ? (
                       <div className="text-center py-6"><ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-2 animate-bounce" /><p className="text-xs font-bold text-[#2e1065] font-sans">No Customer Found</p><p className="text-[10px] text-rose-600/70 mt-1">No active credit matches found for "{searchQuery}"</p></div>
                     ) : (
                       <div className="space-y-4">
                         {/* Customers */}
                         {filteredCustomers.length > 0 && (
                           <div className="space-y-1.5">
                             <div className="flex items-center justify-between">
                               <span className="text-[10px] uppercase font-bold text-pink-700 tracking-wider">Customers</span>
                               <span className="text-[9px] font-mono font-semibold text-gray-400 bg-gray-50 px-1.5 py-0.2 rounded">{filteredCustomers.length} Matches</span>
                             </div>
                             <div className="space-y-1">
                               {filteredCustomers.map(c => (
                                 <div 
                                   key={c.id} 
                                   onClick={() => {
                                     const matchingLoan = loans.find(l => l.applicantName.toLowerCase() === c.name.toLowerCase()); if (matchingLoan) { setSelectedLoanId(matchingLoan.id); setActiveTab('loans'); } else { setSelectedCustomerId(c.id); setActiveTab('customers'); } setSearchQuery('');
                                   }}
                                   className="p-2.5 bg-pink-50/40 rounded-xl hover:bg-pink-100/60 border border-transparent hover:border-pink-200/40 cursor-pointer transition flex justify-between items-center"
                                 >
                                   <div>
                                     <p className="font-bold text-[#2e1065]">{c.name}</p>
                                     <p className="text-[10px] text-[#2e1065]/60">{c.company}</p>
                                   </div>
                                   <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                                     c.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                   }`}>
                                     {c.status}
                                   </span>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Loans */}
                         {filteredLoans.length > 0 && (
                           <div className="space-y-1.5">
                             <div className="flex items-center justify-between">
                               <span className="text-[10px] uppercase font-bold text-pink-700 tracking-wider">Loans / Borrowers</span>
                               <span className="text-[9px] font-mono font-semibold text-gray-400 bg-gray-50 px-1.5 py-0.2 rounded">{filteredLoans.length} Matches</span>
                             </div>
                             <div className="space-y-1">
                               {filteredLoans.map(l => (
                                 <div 
                                   key={l.id} 
                                   onClick={() => {
                                     setSelectedLoanId(l.id);
                                     setActiveTab('loans');
                                     setSearchQuery('');
                                   }}
                                   className="p-2.5 bg-pink-50/40 rounded-xl hover:bg-pink-100/60 border border-transparent hover:border-pink-200/40 cursor-pointer transition flex justify-between items-center"
                                 >
                                   <div>
                                     <p className="font-bold text-[#2e1065]">{l.applicantName}</p>
                                     <p className="text-[10px] text-[#2e1065]/60">{l.companyName} • {l.loanType}</p>
                                   </div>
                                   <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                                     l.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 
                                     l.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                   }`}>
                                     {l.status}
                                   </span>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Transactions */}
                         {filteredTransactions.length > 0 && (
                           <div className="space-y-1.5">
                             <div className="flex items-center justify-between">
                               <span className="text-[10px] uppercase font-bold text-pink-700 tracking-wider">Transactions</span>
                               <span className="text-[9px] font-mono font-semibold text-gray-400 bg-gray-50 px-1.5 py-0.2 rounded">{filteredTransactions.length} Matches</span>
                             </div>
                             <div className="space-y-1">
                               {filteredTransactions.map(t => (
                                 <div 
                                   key={t.id} 
                                   onClick={() => {
                                     setActiveTab('transactions');
                                     setSearchQuery('');
                                   }}
                                   className="p-2.5 bg-pink-50/40 rounded-xl hover:bg-pink-100/60 border border-transparent hover:border-pink-200/40 cursor-pointer transition flex justify-between items-center"
                                 >
                                   <div>
                                     <p className="font-bold text-[#2e1065]">{t.sender} ➔ {t.recipient}</p>
                                     <p className="text-[10px] text-[#2e1065]/60">{t.reference} • {t.date}</p>
                                   </div>
                                   <span className="font-mono font-bold text-pink-700">
                                     ${t.amount.toLocaleString()}
                                   </span>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Documents */}
                         {filteredDocs.length > 0 && (
                           <div className="space-y-1.5">
                             <div className="flex items-center justify-between">
                               <span className="text-[10px] uppercase font-bold text-pink-700 tracking-wider">Documents / Audits</span>
                               <span className="text-[9px] font-mono font-semibold text-gray-400 bg-gray-50 px-1.5 py-0.2 rounded">{filteredDocs.length} Matches</span>
                             </div>
                             <div className="space-y-1">
                               {filteredDocs.map(d => (
                                 <div 
                                   key={d.id} 
                                   onClick={() => {
                                     setActiveTab('documents');
                                     setSearchQuery('');
                                   }}
                                   className="p-2.5 bg-pink-50/40 rounded-xl hover:bg-pink-100/60 border border-transparent hover:border-pink-200/40 cursor-pointer transition flex justify-between items-center"
                                 >
                                   <div>
                                     <p className="font-bold text-[#2e1065]">{d.name}</p>
                                     <p className="text-[10px] text-[#2e1065]/60">{d.category} • {d.size}</p>
                                   </div>
                                   <span className="text-[10px] font-mono text-[#2e1065]/50 font-bold uppercase">
                                     {d.extension}
                                   </span>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                 </>
               )}
             </div>

            {/* Mainframe Sync button dropdown */}
            <div className="relative" style={{ zIndex: syncDropdownOpen ? 9999 : 'auto' }}>
              <button
                type="button"
                onClick={() => setSyncDropdownOpen(!syncDropdownOpen)}
                className="p-2.5 bg-white/30 hover:bg-white/50 border border-white/50 text-[#2e1065] rounded-2xl flex items-center justify-center gap-1.5 transition-all text-xs font-sans font-bold"
              >
                <RefreshCw className={`w-4 h-4 ${syncAllStatus === 'Syncing' ? 'animate-spin text-[#ec4899]' : 'text-[#6d28d9]'}`} />
                <span>SYNC CONSOLE</span>
              </button>

              <AnimatePresence>
                {syncDropdownOpen && (
                  <>
                    {/* Dim & Blur Overlay */}
                    <div 
                      className="fixed inset-0 premium-overlay" 
                      style={{ zIndex: 9998 }}
                      onClick={() => setSyncDropdownOpen(false)} 
                    />
                    
                    {/* Sync Panel Card (Refresh Panel: z-index 9999) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-80 premium-popup-panel rounded-3xl p-5 space-y-3"
                      style={{ zIndex: 9999 }}
                    >
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-bold text-[#2e1065] uppercase font-display tracking-wider">SYSTEM BACKPLANE</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          syncAllStatus === 'Syncing' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {syncAllStatus === 'Syncing' ? 'UPDATING...' : 'SYNCHRONIZED'}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 text-xs text-[#2e1065]/80 font-sans">
                        {syncItems.map((sync) => (
                          <div key={sync.id} className="flex justify-between text-[11px] py-1 border-b border-[#2e1065]/10">
                            <span>{sync.name}</span>
                            <span className="font-mono text-[#2e1065]/50 font-bold">{sync.lastSync}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          triggerFullSync();
                          setSyncDropdownOpen(false);
                        }}
                        className="w-full py-2 bg-gradient-to-r from-[#5b21b6] to-[#7c3aed] text-white font-sans font-bold text-xs tracking-wider rounded-xl uppercase hover:opacity-90 transition"
                      >
                        Sync All Records
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications trigger button */}
            <div className="relative" style={{ zIndex: notificationsOpen ? 9999 : 'auto' }}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 bg-white/30 hover:bg-white/50 border border-white/50 text-[#2e1065] rounded-2xl flex items-center justify-center gap-1.5 transition-all text-xs font-sans font-bold relative"
              >
                <Bell className="w-4.5 h-4.5 text-[#6d28d9]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ec4899] rounded-full animate-pulse" />
                <span>NOTICES</span>
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    {/* Dim & Blur Overlay */}
                    <div 
                      className="fixed inset-0 premium-overlay" 
                      style={{ zIndex: 9998 }}
                      onClick={() => setNotificationsOpen(false)} 
                    />
                    
                    {/* Notification Panel Card (Notifications: z-index 9999) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-80 premium-popup-panel rounded-3xl p-5 space-y-4 text-xs font-sans"
                      style={{ zIndex: 9999 }}
                    >
                      <div className="flex justify-between items-center border-b border-[#2e1065]/10 pb-2">
                        <span className="font-bold text-[#2e1065] uppercase font-display tracking-wider">SYSTEM NOTICES ({alerts.filter(a => a.status === 'Pending').length + 1})</span>
                        <button 
                          onClick={() => setNotificationsOpen(false)} 
                          className="text-[#2e1065]/50 hover:text-[#2e1065] font-mono text-sm"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        <div className="p-3 bg-pink-50/50 border border-pink-200/50 rounded-xl">
                          <p className="font-bold text-pink-600 font-mono text-[9px] uppercase tracking-wide">CRITICAL COMPLIANCE NOTICE</p>
                          <p className="text-[#2e1065]/90 mt-1 font-sans font-medium text-[11px]">Central database synchronizer cleared through system audits successfully.</p>
                          <span className="text-[9px] font-mono text-[#2e1065]/50 block mt-1.5">JUST NOW</span>
                        </div>

                        {alerts.map((alert) => (
                          <div key={alert.id} className="p-3 bg-[#2e1065]/5 border border-[#2e1065]/10 rounded-xl">
                            <span className="font-bold text-purple-700 font-mono text-[9px] uppercase tracking-wide">FRAUD WATCH: {alert.source}</span>
                            <p className="text-[#2e1065]/90 mt-1 font-sans text-[11px] leading-relaxed">{alert.reason}</p>
                            <span className="text-[9px] font-mono text-[#2e1065]/50 block mt-1.5">RISK SCORE: {alert.riskProbability}%</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('fraud');
                          setNotificationsOpen(false);
                        }}
                        className="w-full py-2 bg-gradient-to-r from-[#5b21b6] to-[#7c3aed] text-white font-sans font-bold text-xs tracking-wider rounded-xl uppercase hover:opacity-90 transition text-center block"
                      >
                        Launch Fraud Desk
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Help Guides Trigger button */}
            <button
              onClick={() => setHelpPaneOpen(true)}
              className="p-2.5 bg-white/30 hover:bg-white/50 border border-white/50 text-[#2e1065] rounded-2xl flex items-center justify-center gap-1.5 transition-all text-xs font-sans font-bold"
            >
              <HelpCircle className="w-4.5 h-4.5 text-[#6d28d9]" />
              <span>HELP DESK</span>
            </button>

            {/* Employee profile avatar layout */}
            <div className="relative" style={{ zIndex: profileDropdownOpen ? 9999 : 'auto' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-3.5 bg-white/20 hover:bg-white/40 border border-white/30 rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6d28d9] to-[#ec4899] text-white flex items-center justify-center font-bold text-sm border border-white/40 shadow-sm shrink-0">
                  {userName[0]}
                </div>
                <div className="text-left leading-none shrink-0 hidden md:block">
                  <p className="text-[11px] font-sans font-bold text-[#2e1065]">{userName}</p>
                  <p className="text-[8px] font-mono text-[#2e1065]/60 font-semibold uppercase mt-0.5">Senior Administrator</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#2e1065]/70 ml-1 shrink-0" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                    {/* Dim & Blur Overlay */}
                    <div 
                      className="fixed inset-0 premium-overlay" 
                      style={{ zIndex: 9998 }}
                      onClick={() => setProfileDropdownOpen(false)} 
                    />
                    
                    {/* Profile Panel Card (Profile Panel: z-index 9999) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-[280px] premium-popup-panel rounded-3xl p-5 space-y-4 text-xs font-sans"
                      style={{ zIndex: 9999 }}
                    >
                      <div className="border-b border-[#2e1065]/10 pb-2">
                        <p className="font-bold text-[#2e1065] text-sm leading-tight font-display">{userName}</p>
                        <p className="text-[#2e1065]/50 font-bold tracking-wide uppercase text-[9px] mt-0.5">
                          Senior Banking Administrator
                        </p>
                        <p className="text-[#2e1065]/40 font-mono text-[10px] mt-1 break-all">{userEmail}</p>
                      </div>

                      <div className="space-y-1.5 text-[#2e1065]/80">
                        <div className="flex justify-between text-[11px]">
                          <span>SECURE SESSIONS:</span>
                          <span className="font-mono text-[#ec4899] font-bold">128-BIT VERIFIED</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span>CREDITS LIMITS:</span>
                          <span className="font-mono font-bold text-[#2e1065]">$562,000.00</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span>LAST LOGIN RECORD:</span>
                          <span className="font-mono text-[#2e1065]/50">12 JUN 2026</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-[#2e1065]/10 font-bold tracking-wider">
                        <button
                          onClick={() => {
                            setActiveTab('settings');
                            setProfileDropdownOpen(false);
                          }}
                          className="py-1.5 bg-[#6d28d9]/10 text-[#6d28d9] rounded-lg hover:bg-[#6d28d9]/20 transition uppercase"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => {
                            clearSession();
                            window.location.href = '/';
                          }}
                          className="py-1.5 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 border border-rose-200 transition uppercase flex items-center justify-center gap-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>

        </header>

        {/* 3. Floating Glass Viewport Container displaying active views */}
        <div className="flex-1 glass-card p-6 md:p-8 overflow-y-auto relative min-h-0 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView 
                  wallet={wallet} 
                  setWallet={setWallet} 
                  payments={payments} 
                  loans={loans} 
                  onNavigate={setActiveTab}
                  userName={userName}
                />
              )}

              {activeTab === 'payments' && (
                <PaymentsView 
                  payments={payments} 
                  setPayments={setPayments} 
                  wallet={wallet} 
                  setWallet={setWallet}
                  addTransaction={addTransaction}
                />
              )}

              {activeTab === 'loans' && (
                <LoansView 
                  loans={loans} 
                  setLoans={setLoans} 
                  walletBalance={wallet.balance} 
                  onSelectCustomerByName={handleSelectCustomerByName}
                  selectedLoanId={selectedLoanId}
                  setSelectedLoanId={setSelectedLoanId}
                />
              )}

              {activeTab === 'customers' && (
                <CustomersView 
                  customers={customers} 
                  setCustomers={setCustomers} 
                  selectedCustomerId={selectedCustomerId}
                  setSelectedCustomerId={setSelectedCustomerId}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionsView 
                  transactions={transactions} 
                  userName={userName}
                  onSelectCustomerByName={handleSelectCustomerByName}
                />
              )}

              {activeTab === 'fraud' && (
                <FraudView 
                  alerts={alerts} 
                  setAlerts={setAlerts}
                  addTransaction={addTransaction}
                />
              )}

              {activeTab === 'invoices' && (
                <InvoicesView 
                  invoices={invoices} 
                  setInvoices={setInvoices} 
                />
              )}

              {activeTab === 'deposits' && (
                <DepositsView 
                  wallet={wallet}
                  setWallet={setWallet}
                  transactions={transactions}
                  addTransaction={addTransaction}
                  customers={customers}
                  setCustomers={setCustomers}
                />
              )}

              {activeTab === 'documents' && (
                <DocumentsView 
                  documents={documents} 
                  setDocuments={setDocuments} 
                />
              )}

              {activeTab === 'inbox' && (
                <InboxView 
                  messages={messages} 
                  setMessages={setMessages} 
                />
              )}

              {activeTab === 'credits' && (
                <CreditsView 
                  products={credits} 
                  setProducts={setCredits} 
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView 
                  userName={userName}
                  setUserName={setUserName}
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                  syncItems={syncItems}
                  setSyncItems={setSyncItems}
                  onFullSync={triggerFullSync}
                  syncAllStatus={syncAllStatus}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* 4. Sliding Help Guides panel drawer (APEX Operations Help Desk) */}
      <AnimatePresence>
        {helpPaneOpen && (
          <>
            {/* Dim & Blur Overlay */}
            <div 
              className="fixed inset-0 premium-overlay cursor-pointer" 
              style={{ zIndex: 9998 }}
              onClick={() => setHelpPaneOpen(false)} 
            />
            
            {/* Help Drawer (Help Center: z-index 9999) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-96 premium-popup-panel shadow-2xl p-6 flex flex-col justify-between border-l border-white/50"
              style={{ zIndex: 9999 }}
            >
              <div className="space-y-6 flex-1 overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-[#2e1065]/10">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#6d28d9] shrink-0" />
                    <h3 className="text-base font-black font-display text-[#2e1065]">Apex Operations Help Desk</h3>
                  </div>
                  <button 
                    onClick={() => setHelpPaneOpen(false)}
                    className="text-[#2e1065]/50 hover:text-[#2e1065] p-1 font-mono text-sm outline-none transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#2e1065] bg-[#6d28d9]/10 px-3 py-1.5 rounded-lg w-fit">
                    SYSTEM OPERATIONAL GUIDES
                  </h4>

                  <div className="space-y-4 font-sans">
                    {helpGuides.map((guide) => (
                      <div key={guide.id} className="p-4 border border-[#2e1065]/10 rounded-2xl bg-[#6d28d9]/5 text-xs text-[#2e1065]">
                        <span className="text-[9px] font-mono font-bold text-[#ec4899] uppercase tracking-[0.15em] block mb-1">
                          {guide.category}
                        </span>
                        <h4 className="font-display font-bold text-[#2e1065] leading-tight mb-1.5">{guide.title}</h4>
                        <p className="text-[#2e1065]/80 font-sans leading-relaxed">{guide.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2e1065]/10 mt-6 select-none font-sans flex items-center justify-between text-[11px] text-[#2e1065]/40 uppercase tracking-wider font-bold">
                <span>PORTAL SYSTEM HELPDESK</span>
                <span>SECURED V3</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

