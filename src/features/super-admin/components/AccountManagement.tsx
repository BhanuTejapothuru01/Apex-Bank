import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Wallet, 
  Lock, 
  Unlock, 
  Sliders, 
  Coins, 
  CheckCircle2, 
  RefreshCw,
  Percent,
  TrendingDown,
  User,
  Users,
  Shield,
  Activity,
  FileText,
  Calendar,
  MapPin,
  UserCheck,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  Building2,
  SlidersHorizontal,
  X,
  Plus
} from 'lucide-react';
import { Customer, Employee, Branch } from '../types/dashboard';

interface AccountManagementProps {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  employees?: Employee[];
  branches?: Branch[];
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
  setActiveTab?: (tab: string) => void;
}

interface AccountItem {
  id: string; // e.g. ACC-CUST-802 or ACC-EMP-001
  ownerId: string; // e.g. CUST-802 or EMP-001
  ownerName: string;
  ownerType: 'Customer' | 'Employee';
  accountNumber: string;
  accountType: 'Savings Account' | 'Current Account' | 'Corporate Account' | 'Salary Account' | 'Fixed Deposit' | 'Loan Account';
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Frozen';
  balance: number;
  availableBalance: number;
  email: string;
  phone: string;
  branchId: string;
  kycStatus: 'Approved' | 'Pending' | 'Rejected';
  riskProfile: string;
  riskScore: number;
  designation?: string;
  department?: string;
}

// Comprehensive Branch Details Directory
const BRANCH_DETAILS_DIRECTORY: Record<string, {
  name: string;
  code: string;
  location: string;
  zone: string;
  manager: {
    name: string;
    empId: string;
    designation: string;
    phone: string;
    email: string;
  }
}> = {
  "BR-ZH-01": {
    name: "Zurich Elite Vault",
    code: "BR-101",
    location: "Zurich, Switzerland",
    zone: "Central Europe Zone",
    manager: {
      name: "Maximilian Kael",
      empId: "EMP-0014",
      designation: "General Director & Zurich Branch Manager",
      phone: "+41 44 200 4567",
      email: "m.kael@apexbank.com"
    }
  },
  "BR-LDN-02": {
    name: "London Square Premium",
    code: "BR-581",
    location: "London, United Kingdom",
    zone: "Western Europe Region",
    manager: {
      name: "Alistair Sterling",
      empId: "EMP-0092",
      designation: "Executive Director & London Manager",
      phone: "+44 20 7946 0192",
      email: "a.sterling@apexbank.com"
    }
  },
  "BR-NYC-01": {
    name: "New York Wall St. Flagship",
    code: "BR-021",
    location: "New York, USA",
    zone: "North America Zone",
    manager: {
      name: "Donald Vance",
      empId: "EMP-0011",
      designation: "Senior Branch Director & Wall St. lead",
      phone: "+1 (555) 014-9988",
      email: "d.vance@apexbank.com"
    }
  },
  "BR-TKY-03": {
    name: "Tokyo Neo Skyline",
    code: "BR-039",
    location: "Tokyo, Japan",
    zone: "East Asia Region",
    manager: {
      name: "Masami Tanaka",
      empId: "EMP-0205",
      designation: "Tokyo Branch General Manager",
      phone: "+81 90 1234 5678",
      email: "m.tanaka@apexbank.com"
    }
  },
  "BR-SGP-04": {
    name: "Singapore Wharf Hub",
    code: "BR-882",
    location: "Marina Bay, Singapore",
    zone: "Southeast Asia Zone",
    manager: {
      name: "Lawrence Wong",
      empId: "EMP-0044",
      designation: "Executive Director & Singapore Custodian",
      phone: "+65 6123 4567",
      email: "l.wong@apexbank.com"
    }
  },
  "BR-HYD-01": {
    name: "Hyderabad HQ & Flagship",
    code: "BR-101",
    location: "Hyderabad, Telangana",
    zone: "South India Region",
    manager: {
      name: "Mohammed Rahman",
      empId: "EMP-0007",
      designation: "Branch Manager",
      phone: "+91 90001 02345",
      email: "m.rahman@apexbank.com"
    }
  },
  "BR-MUM-02": {
    name: "Mumbai Capital Hub",
    code: "BR-102",
    location: "Mumbai, Maharashtra",
    zone: "West India Region",
    manager: {
      name: "Donald Vance",
      empId: "EMP-0011",
      designation: "Branch Manager",
      phone: "+91 98220 54321",
      email: "d.vance@apexbank.com"
    }
  },
  "BR-DEL-03": {
    name: "Delhi Sovereign Plaza",
    code: "BR-103",
    location: "New Delhi, NCR",
    zone: "North India Region",
    manager: {
      name: "Alistair Sterling",
      empId: "EMP-0033",
      designation: "Branch Manager",
      phone: "+91 98110 12345",
      email: "a.sterling@apexbank.com"
    }
  },
  "BR-BLR-04": {
    name: "Bengaluru Tech Park",
    code: "BR-104",
    location: "Bengaluru, Karnataka",
    zone: "South India Region",
    manager: {
      name: "Lawrence Wong",
      empId: "EMP-0044",
      designation: "Branch Manager",
      phone: "+91 90123 45678",
      email: "l.wong@apexbank.com"
    }
  },
  "BR-MAA-05": {
    name: "Chennai Business Hub",
    code: "BR-105",
    location: "Chennai, Tamil Nadu",
    zone: "South India Region",
    manager: {
      name: "Masami Tanaka",
      empId: "EMP-0055",
      designation: "Branch Manager",
      phone: "+91 94440 98765",
      email: "m.tanaka@apexbank.com"
    }
  },
  "BR-CCU-06": {
    name: "Kolkata Corporate Branch",
    code: "BR-106",
    location: "Kolkata, West Bengal",
    zone: "East India Region",
    manager: {
      name: "Elena Rostova",
      empId: "EMP-0066",
      designation: "Branch Manager",
      phone: "+91 98300 11223",
      email: "e.rostova@apexbank.com"
    }
  },
  "BR-AMD-07": {
    name: "Ahmedabad Mercantile",
    code: "BR-107",
    location: "Ahmedabad, Gujarat",
    zone: "West India Region",
    manager: {
      name: "Kenji Takahashi",
      empId: "EMP-0077",
      designation: "Branch Manager",
      phone: "+91 98790 33445",
      email: "k.takahashi@apexbank.com"
    }
  },
  "BR-VGA-08": {
    name: "Vijayawada Premium",
    code: "BR-108",
    location: "Vijayawada, Andhra Pradesh",
    zone: "South India Region",
    manager: {
      name: "Vikram Naidu",
      empId: "EMP-0088",
      designation: "Branch Manager",
      phone: "+91 98660 55667",
      email: "v.naidu@apexbank.com"
    }
  },
  "BR-LKO-09": {
    name: "Lucknow Regional",
    code: "BR-109",
    location: "Lucknow, Uttar Pradesh",
    zone: "North India Region",
    manager: {
      name: "Chloe Dupont",
      empId: "EMP-0099",
      designation: "Branch Manager",
      phone: "+91 99350 44556",
      email: "c.dupont@apexbank.com"
    }
  },
  "BR-COK-10": {
    name: "Kochi International",
    code: "BR-110",
    location: "Kochi, Kerala",
    zone: "South India Region",
    manager: {
      name: "Hassan Al-Saeed",
      empId: "EMP-0110",
      designation: "Branch Manager",
      phone: "+91 98460 77889",
      email: "h.alsaeed@apexbank.com"
    }
  }
};

export default function AccountManagement({
  customers,
  setCustomers,
  employees = [],
  branches = [],
  addAuditLog,
  setActiveTab
}: AccountManagementProps) {
  // State variables for selections and limits
  const [selectedAccountId, setSelectedAccountId] = useState<string>("ACC-CUST-802"); // default Alistair Sterling
  const [rateSavings, setRateSavings] = useState(4.25);
  const [limitInput, setLimitInput] = useState(250000);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Filter States
  const [accountTypeFilter, setAccountTypeFilter] = useState<'All' | 'Savings Account' | 'Current Account' | 'Fixed Deposit' | 'Loan Account'>('All');
  const [userFilter, setUserFilter] = useState<'All' | 'Customer' | 'Employee'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Suspended' | 'Frozen'>('All');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Combine dynamic customers and employees database into unified highly accountable dataset
  const combinedAccountsList = useMemo<AccountItem[]>(() => {
    const getAccountTypePrefix = (type: string): string => {
      if (type === 'Savings Account') return 'SAV';
      if (type === 'Current Account') return 'CUR';
      if (type === 'Corporate Account') return 'COR';
      if (type === 'Salary Account') return 'SAL';
      if (type === 'Fixed Deposit') return 'FDP';
      return 'LON';
    };

    // 1. Map customers
    const custAccs = customers.map(c => {
      let accountType: AccountItem['accountType'] = 'Savings Account';
      if (c.type === 'Corporate') accountType = 'Corporate Account';
      else if (c.type === 'VIP') accountType = 'Corporate Account';
      
      // Exact alignment to user examples and requests
      if (c.id === 'CUST-802') accountType = 'Savings Account';
      if (c.id === 'CUST-415') accountType = 'Current Account';
      if (c.id === 'CUST-293') accountType = 'Corporate Account';
      if (c.id === 'CUST-901') accountType = 'Savings Account';
      if (c.id === 'CUST-104') accountType = 'Loan Account';
      if (c.id === 'CUST-089') accountType = 'Fixed Deposit';
      if (c.id === 'CUST-331') accountType = 'Corporate Account';
      if (c.id === 'CUST-512') accountType = 'Savings Account';
      if (c.id === 'CUST-887') accountType = 'Current Account';
      if (c.id === 'CUST-445') accountType = 'Fixed Deposit';

      const numPrefix = getAccountTypePrefix(accountType);
      const accountNumber = `AP-${numPrefix}-${c.id.replace("CUST-", "")}8391`;

      return {
        id: `ACC-CUST-${c.id}`,
        ownerId: c.id,
        ownerName: c.name,
        ownerType: 'Customer' as const,
        accountNumber,
        accountType,
        joinDate: c.joinDate || '2021-04-12',
        status: (c.status === 'Active' ? 'Active' : c.status === 'Frozen' ? 'Frozen' : 'Suspended') as any,
        balance: c.balance,
        availableBalance: Math.max(0, c.balance - 100), // available balance model
        email: c.email,
        phone: c.phone || '+1 (555) 019-2831',
        branchId: c.branchId || 'BR-HYD-01',
        kycStatus: c.kycStatus || 'Approved',
        riskProfile: c.riskProfile || 'Medium',
        riskScore: c.riskScore || 20,
      };
    });

    // 2. Map employees
    const empAccs = employees.map(e => {
      let balance = 45000.00;
      if (e.id === 'EMP-001') balance = 92000.00;
      if (e.id === 'EMP-014') balance = 125032.00;
      if (e.id === 'EMP-045') balance = 85000.00;
      if (e.id === 'EMP-092') balance = 62450.00;

      let accountType: AccountItem['accountType'] = 'Salary Account';
      if (e.id === 'EMP-045') accountType = 'Current Account';
      if (e.id === 'EMP-092') accountType = 'Savings Account';

      const numPrefix = getAccountTypePrefix(accountType);
      const accountNumber = `AP-${numPrefix}-${e.id.replace("EMP-", "")}1024`;

      return {
        id: `ACC-EMP-${e.id}`,
        ownerId: e.id,
        ownerName: e.name,
        ownerType: 'Employee' as const,
        accountNumber,
        accountType,
        joinDate: e.joinDate || '2019-06-15',
        status: (e.status === 'Active' ? 'Active' : 'Inactive') as any,
        balance,
        availableBalance: Math.max(0, balance - 50),
        email: e.email,
        phone: '+91 99000 88776',
        branchId: e.branchId || 'BR-HYD-01',
        kycStatus: 'Approved' as const,
        riskProfile: 'Low',
        riskScore: 5,
        designation: e.role,
        department: e.department,
      };
    });

    return [...custAccs, ...empAccs];
  }, [customers, employees]);

  // Find the currently selected account item
  const activeAccount = useMemo(() => {
    return combinedAccountsList.find(acc => acc.id === selectedAccountId) || combinedAccountsList[0] || null;
  }, [combinedAccountsList, selectedAccountId]);

  // Filter and search computation
  const filteredAccounts = useMemo(() => {
    return combinedAccountsList.filter(acc => {
      // 1. User Filter (All, Customers, Employees)
      if (userFilter !== 'All' && acc.ownerType !== userFilter) {
        return false;
      }

      // 2. Account Type Filter
      if (accountTypeFilter !== 'All') {
        if (accountTypeFilter === 'Savings Account' && acc.accountType !== 'Savings Account') return false;
        if (accountTypeFilter === 'Current Account' && acc.accountType !== 'Current Account') return false;
        if (accountTypeFilter === 'Fixed Deposit' && acc.accountType !== 'Fixed Deposit') return false;
        if (accountTypeFilter === 'Loan Account' && acc.accountType !== 'Loan Account') return false;
      }

      // 3. Status Filter (Active, Inactive, Suspended, Frozen)
      if (statusFilter !== 'All' && acc.status !== statusFilter) {
        return false;
      }

      // 4. Search Functionality
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const branchInfo = BRANCH_DETAILS_DIRECTORY[acc.branchId] || BRANCH_DETAILS_DIRECTORY["BR-HYD-01"];
        
        const matchesAccountNumber = acc.accountNumber.toLowerCase().includes(query);
        const matchesOwnerName = acc.ownerName.toLowerCase().includes(query);
        const matchesMobile = acc.phone.toLowerCase().includes(query);
        const matchesBranchName = branchInfo.name.toLowerCase().includes(query);

        if (!matchesAccountNumber && !matchesOwnerName && !matchesMobile && !matchesBranchName) {
          return false;
        }
      }

      return true;
    });
  }, [combinedAccountsList, userFilter, accountTypeFilter, statusFilter, searchQuery]);

  // Handle limits and interest adjustments
  const handleUpdateLimit = () => {
    if (!activeAccount) return;
    addAuditLog(`Elevated secure electronic transfer limit for ${activeAccount.ownerName} to $${limitInput.toLocaleString()}`, 'Warning');
    showFeedback(`Wire limit for ${activeAccount.ownerName} updated to $${limitInput.toLocaleString()}`);
  };

  const handleRateAdjustment = () => {
    addAuditLog(`Enterprise rate adjustment applied globally. Savings base APR set to ${rateSavings}%`, 'Critical');
    showFeedback(`Apex savings yield baseline adjusted globally to ${rateSavings}% APR`);
  };

  // Helper actions
  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleFreezeToggle = (freeze: boolean) => {
    if (!activeAccount) return;
    
    // Check if the holder is a Customer or Employee
    if (activeAccount.ownerType === 'Customer') {
      const updatedCustomers = customers.map(c => {
        if (c.id === activeAccount.ownerId) {
          return { ...c, status: (freeze ? 'Frozen' : 'Active') as any };
        }
        return c;
      });
      setCustomers(updatedCustomers);
      addAuditLog(`Super Admin set status of Customer account ${activeAccount.ownerId} to ${freeze ? 'FROZEN' : 'ACTIVE'}`, freeze ? 'Critical' : 'Info');
      showFeedback(`Account ${activeAccount.accountNumber} successfully ${freeze ? 'Frozen' : 'Activated'}.`);
    } else {
      // Show feedback for employees
      addAuditLog(`Super Admin set status of Employee account ${activeAccount.ownerId} to ${freeze ? 'FROZEN' : 'ACTIVE'}`, freeze ? 'Critical' : 'Info');
      showFeedback(`Security Clearance: Employee account ${activeAccount.ownerId} set to ${freeze ? 'FROZEN' : 'ACTIVE'}`);
    }
  };

  // Safe lookups for branch definitions
  const branchDetail = useMemo(() => {
    if (!activeAccount) return BRANCH_DETAILS_DIRECTORY["BR-HYD-01"];
    return BRANCH_DETAILS_DIRECTORY[activeAccount.branchId] || BRANCH_DETAILS_DIRECTORY["BR-HYD-01"];
  }, [activeAccount]);

  // Formatting currency helper
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div id="account-management-module" className="space-y-6">
      
      {actionFeedback && (
        <div id="toast-notification" className="fixed bottom-5 right-5 z-50 p-4 rounded-xl border border-amber-500/30 bg-[#FDF2F8] shadow-2xl animate-bounce flex items-center gap-2.5 max-w-sm">
          <Shield className="text-amber-500 animate-pulse" size={18} />
          <div>
            <p className="text-xs font-bold text-[#4A044E] uppercase tracking-wider">System Broadcast</p>
            <p className="text-[11px] text-[#831843] mt-0.5">{actionFeedback}</p>
          </div>
          <button onClick={() => setActionFeedback(null)} className="ml-auto text-[#9D174D]/85 hover:text-[#4A044E]">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Parameter Adjustment Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Global Interest Rate Setter */}
        <div className="p-5 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl relative">
          <span className="text-amber-500 text-[9px] font-mono tracking-widest uppercase font-bold block">Reserve Controller</span>
          <h3 className="text-sm font-bold text-[#4A044E] mt-1">Apex Sovereign Interest Adjustment</h3>
          <p className="text-[#9D174D]/80 text-xs mt-1">Configure structural compounding yields across checking/savings accounts.</p>

          <div className="mt-5 flex items-center gap-4">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9D174D]/75 font-mono text-xs font-semibold">% APR</span>
              <input 
                id="rate-adjustment-input"
                type="number" 
                step="0.05"
                value={rateSavings}
                onChange={(e) => setRateSavings(Number(e.target.value))}
                className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] pl-[4.5rem] pr-4 py-2.5 rounded-xl outline-none font-mono text-sm"
              />
            </div>
            <button 
              id="rate-adjustment-apply-btn"
              onClick={handleRateAdjustment}
              className="px-4 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#bca030] text-[#050920] text-xs font-bold rounded-xl uppercase hover:from-[#eec84c] transition-all cursor-pointer"
            >
              Apply APR
            </button>
          </div>
        </div>

        {/* Individual Client Limits Controller */}
        <div className="p-5 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl relative">
          <span className="text-blue-400 text-[9px] font-mono tracking-widest uppercase font-bold block">Limit Adjuster</span>
          <h3 className="text-sm font-bold text-[#4A044E] mt-1">Secure Electronic Transfer limits</h3>
          <p className="text-[#9D174D]/80 text-xs mt-1">Assign max daily wire transfer allowances across client profiles.</p>

          <div className="mt-5 flex items-center gap-4">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37] font-bold font-mono text-xs">$ USD</span>
              <input 
                id="limit-adjustment-input"
                type="number" 
                value={limitInput}
                onChange={(e) => setLimitInput(Number(e.target.value))}
                className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] pl-[4.5rem] pr-4 py-2.5 rounded-xl outline-none font-mono text-sm font-bold"
              />
            </div>
            <button 
              id="limit-adjustment-apply-btn"
              onClick={handleUpdateLimit}
              disabled={!activeAccount}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                activeAccount 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg cursor-pointer' 
                  : 'bg-[#12183c] text-[#42527b] cursor-not-allowed'
              }`}
            >
              Update Wire Max
            </button>
          </div>
        </div>

      </div>

      {/* Grid Accounts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table representation with filters */}
        <div className="lg:col-span-2 p-3 sm:p-5 lg:p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-5">
          
          {/* Header section with search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#4A044E] uppercase tracking-wider">Operational Portfolios Ledger</h3>
              <p className="text-[#9D174D]/80 text-xs">A comprehensive ledger syncing checking, savings, salary, and high-yield reserve accounts.</p>
            </div>
            
            <div className="relative max-w-xs w-full">
              <input
                id="ledger-search-input"
                type="text"
                placeholder="Search Account, Owner, mobile, branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFF5F8] border border-[#FBCFE8] focus:border-amber-500 text-xs px-3.5 py-2 pl-9 rounded-xl text-[#4A044E] outline-none placeholder-slate-500"
              />
              <Search size={14} className="absolute left-3.5 top-3 text-[#9D174D]/75" />
            </div>
          </div>

          {/* Premium Filter Controls Area */}
          <div id="filter-controls-pnl" className="p-4 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/85 space-y-3">
            
            {/* Row 1: User Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-500 tracking-wider w-24">User Filter:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Customer', 'Employee'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setUserFilter(u)}
                    className={`px-3 py-1 text-[10px] rounded-lg border font-mono font-bold transition-all ${
                      userFilter === u 
                        ? 'bg-amber-500/20 text-[#d4af37] border-amber-500/50' 
                        : 'bg-[#FDF2F8]/90 text-[#9D174D]/85 border-[#FBCFE8] hover:border-slate-700 hover:text-[#701a75]'
                    }`}
                  >
                    {u === 'All' ? 'All Users' : u === 'Customer' ? 'Customers' : 'Employees'}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Account Type Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold text-blue-400 tracking-wider w-24">Account Card:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Savings Account', 'Current Account', 'Fixed Deposit', 'Loan Account'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setAccountTypeFilter(t)}
                    className={`px-3 py-1 text-[10px] rounded-lg border font-mono font-bold transition-all ${
                      accountTypeFilter === t 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' 
                        : 'bg-[#FDF2F8]/90 text-[#9D174D]/85 border-[#FBCFE8] hover:border-slate-700 hover:text-[#701a75]'
                    }`}
                  >
                    {t === 'All' ? 'All Accounts' : t === 'Savings Account' ? 'Savings Accounts' : t === 'Current Account' ? 'Current Accounts' : t === 'Fixed Deposit' ? 'Fixed Deposits' : 'Loan Accounts'}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Status Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold text-[#9D174D]/85 tracking-wider w-24">Status Gate:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Active', 'Inactive', 'Suspended', 'Frozen'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 text-[10px] rounded-lg border font-mono font-bold transition-all ${
                      statusFilter === s 
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' 
                        : 'bg-[#FDF2F8]/90 text-[#9D174D]/85 border-[#FBCFE8] hover:border-slate-700 hover:text-[#701a75]'
                    }`}
                  >
                    {s === 'All' ? 'All Status' : s}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#FBCFE8] text-[9px] text-[#BE185D]/75 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Account Reference</th>
                  <th className="py-2.5 px-3">Authorised Owner</th>
                  <th className="py-2.5 px-3">Category Type</th>
                  <th className="py-2.5 px-3">User Role</th>
                  <th className="py-2.5 px-3 text-right">Ledger Balance</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141c48]">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-xs text-[#9D174D]/75">
                      No accounts matched your active filter selections.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc) => {
                    const isSelected = selectedAccountId === acc.id;
                    return (
                      <tr 
                        id={`account-row-${acc.id}`}
                        key={acc.id} 
                        onClick={() => {
                          setSelectedAccountId(acc.id);
                          setLimitInput(acc.accountType === 'Corporate Account' ? 5000000 : 250000);
                        }}
                        className={`text-xs hover:bg-[#FBCFE8]/70 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#152361]/60 border-l-2 border-amber-500' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 font-mono font-bold text-[#831843]">
                          {acc.accountNumber}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-[#4A044E]">{acc.ownerName}</div>
                          <span className="text-[9px] text-[#9D174D]/75 font-mono">{acc.ownerId}</span>
                        </td>
                        <td className="py-3.5 px-3 text-indigo-300 font-medium">
                          {acc.accountType}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            acc.ownerType === 'Employee' 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' 
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                          }`}>
                            {acc.ownerType}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-[#4A044E]">
                          {formatUSD(acc.balance)}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            acc.status === 'Active' 
                              ? 'bg-emerald-500/15 text-emerald-400' 
                              : acc.status === 'Frozen' 
                                ? 'bg-rose-500/20 text-rose-400' 
                                : 'bg-slate-700/30 text-[#9D174D]/85'
                          }`}>
                            {acc.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Context Profile Panel on Right Column */}
        <div id="account-secure-details-box" className="rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between relative overflow-y-auto max-h-[1200px] scrollbar-thin">
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          
          {activeAccount ? (
            <div className="space-y-6">
              
              {/* Header profile info */}
              <div className="flex items-center gap-4 border-b border-[#FBCFE8] pb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#d4af37]/30 to-indigo-600/40 border-2 border-[#d4af37] flex items-center justify-center font-bold text-[#4A044E] shadow-lg text-lg">
                  {activeAccount.ownerName.split(' ')[0][0]}{activeAccount.ownerName.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest block">Account Holder Profile</span>
                  <h4 className="text-md font-bold text-[#4A044E]">{activeAccount.ownerName}</h4>
                  <p className="text-[10px] font-mono text-[#9D174D]/85">{activeAccount.ownerType} ID: {activeAccount.ownerId}</p>
                </div>
              </div>

              {/* SECTION: Account Holder Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#9D174D]/85 font-bold">1. Account Holder Information</p>
                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Full Name:</span>
                    <span className="w-[65%] text-[#4A044E] font-medium text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeAccount.ownerName}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Registration ID:</span>
                    <span className="w-[65%] text-[#4A044E] font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeAccount.ownerId}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Mobile Number:</span>
                    <span className="w-[65%] text-[#831843] font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeAccount.phone}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Email Address:</span>
                    <span className="w-[65%] text-[#831843] font-mono text-[11px] text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal" title={activeAccount.email}>{activeAccount.email}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Joining Date:</span>
                    <span className="w-[65%] text-[#831843] font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeAccount.joinDate}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Account status:</span>
                    <div className="w-[65%] text-left">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        activeAccount.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>{activeAccount.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Account Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#9D174D]/85 font-bold">2. Account Information</p>
                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Account Number:</span>
                    <span className="w-[65%] text-[#4A044E] font-mono font-bold tracking-wide text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeAccount.accountNumber}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Account Type:</span>
                    <span className="w-[65%] text-indigo-300 font-bold text-[11px] text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeAccount.accountType}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Opening Date:</span>
                    <span className="w-[65%] text-slate-350 font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeAccount.joinDate || '12 June 2024'}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5 border-t border-[#FBCFE8] pt-2 mt-1.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Current Balance:</span>
                    <span className="w-[65%] text-amber-500 font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{formatUSD(activeAccount.balance)}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Available Balance:</span>
                    <span className="w-[65%] text-[#10b981] font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{formatUSD(activeAccount.availableBalance)}</span>
                  </div>
                </div>
              </div>

              {/* SECTION: Branch Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#9D174D]/85 font-bold">3. Branch Information</p>
                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Branch Name:</span>
                    <span className="w-[65%] text-[#4A044E] font-semibold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{branchDetail.name}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Branch Code:</span>
                    <span className="w-[65%] text-amber-500 font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{branchDetail.code}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Branch Location:</span>
                    <span className="w-[65%] text-[#831843] text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{branchDetail.location}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Regional Zone:</span>
                    <span className="w-[65%] text-indigo-400 font-mono text-[11px] text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{branchDetail.zone}</span>
                  </div>
                </div>
              </div>

              {/* SECTION: Branch Manager Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#9D174D]/85 font-bold">4. Branch Manager Information</p>
                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Manager Name:</span>
                    <span className="w-[65%] text-[#4A044E] font-semibold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{branchDetail.manager.name}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Employee ID:</span>
                    <span className="w-[65%] text-[#4A044E] font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{branchDetail.manager.empId}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Designation:</span>
                    <span className="w-[65%] text-[#831843] font-mono font-bold text-[10px] bg-[#FDF2F8]/60 px-1.5 py-0.5 rounded text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{branchDetail.manager.designation}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Contact Number:</span>
                    <span className="w-[65%] text-[#831843] font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{branchDetail.manager.phone}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Email Address:</span>
                    <span className="w-[65%] text-[#831843] text-[10px] text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal" title={branchDetail.manager.email}>{branchDetail.manager.email}</span>
                  </div>
                </div>
              </div>

              {/* SECTION: Account Opening Audit Details */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#9D174D]/85 font-bold">5. Account Opening Audit information</p>
                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 space-y-2.5 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5 border-b border-[#FBCFE8]/55 pb-1.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Opened By:</span>
                    <div className="w-[65%] text-left">
                      <span className="text-[#4A044E] font-bold block">Sarah Jenkins</span>
                      <span className="text-[10px] font-mono text-[#9D174D]/85 block break-words [word-break:break-word] [overflow-wrap:break-word]">Senior Banking Officer (EMP-0101)</span>
                    </div>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5 border-b border-[#FBCFE8]/55 pb-1.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Opening Timestamp:</span>
                    <span className="w-[65%] text-[#4A044E] font-mono text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">12 June 2024 at 10:45:32 AM IST</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Approved By:</span>
                    <div className="w-[65%] text-left">
                      <span className="text-[#d4af37] font-bold block">{branchDetail.manager.name}</span>
                      <span className="text-[10px] font-mono text-[#9D174D]/85 block break-words [word-break:break-word] [overflow-wrap:break-word]">{branchDetail.manager.designation} ({branchDetail.manager.empId})</span>
                      <span className="text-[10px] font-mono text-[#d4af37] block mt-0.5 break-words [word-break:break-word] [overflow-wrap:break-word]">Approved: 12 June 2024 at 11:20:15 AM IST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: KYC Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#9D174D]/85 font-bold">6. KYC Verification Profile</p>
                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">KYC Status:</span>
                    <div className="w-[65%] text-left">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        activeAccount.kycStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/15 text-amber-500'
                      }`}>{activeAccount.kycStatus}</span>
                    </div>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-mono font-semibold text-left flex-shrink-0 select-none">Verified By:</span>
                    <span className="w-[65%] text-[#4A044E] font-medium text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">Sarah Jenkins</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-mono font-semibold text-left flex-shrink-0 select-none">Compliance ID:</span>
                    <span className="w-[65%] text-[#831843] font-mono text-[10px] text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">EMP-001</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-mono font-semibold text-left flex-shrink-0 select-none">Verification Date:</span>
                    <span className="w-[65%] text-[#831843] font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">12 June 2024</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-mono font-semibold text-left flex-shrink-0 select-none">Verification Time:</span>
                    <span className="w-[65%] text-[#831843] font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">10:55:00 AM IST</span>
                  </div>
                </div>
              </div>

              {/* SECTION: Account Activity Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#9D174D]/85 font-bold">7. Account Activity Information</p>
                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Last Secure Login:</span>
                    <span className="w-[65%] text-[#4A044E] font-mono mt-0.5 text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">12 June 2026, 09:30:11 AM IST</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5 border-t border-[#FBCFE8]/50 pt-1.5 mt-1">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Last Ledger Transaction:</span>
                    <span className="w-[65%] text-indigo-400 font-mono font-semibold mt-0.5 text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">11 June 2026, 04:12:45 PM IST</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5 border-t border-[#FBCFE8]/50 pt-1.5 mt-1">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Last Deposit:</span>
                    <span className="w-[65%] text-[#10b981] font-mono text-[11px] text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">10 June 2026, 11:00:22 AM</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Last Withdrawal:</span>
                    <span className="w-[65%] text-rose-400 font-mono text-[11px] text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">09 June 2026, 02:30:15 PM</span>
                  </div>
                </div>
              </div>

              {/* SECTION: Transaction Summary */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#9D174D]/85 font-bold">8. Transaction Summary</p>
                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Total Deposits:</span>
                    <span className="w-[65%] text-emerald-400 font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{formatUSD(activeAccount.balance * 1.35)}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-[#9D174D]/85 font-semibold text-left flex-shrink-0 select-none">Total Withdrawals:</span>
                    <span className="w-[65%] text-rose-400 font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{formatUSD(activeAccount.balance * 0.35)}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5 border-t border-[#FBCFE8]/60 pt-2 font-black">
                    <span className="w-[35%] text-slate-350 font-semibold text-left flex-shrink-0 select-none">Current Balance:</span>
                    <span className="w-[65%] text-[#4A044E] font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{formatUSD(activeAccount.balance)}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-350 font-semibold text-left flex-shrink-0 select-none">Available Balance:</span>
                    <span className="w-[65%] text-[#10b981] font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{formatUSD(activeAccount.availableBalance)}</span>
                  </div>
                </div>
              </div>

              {/* SECTION: Account History Timeline */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#9D174D]/85 font-bold">9. Account History Timeline</p>
                
                <div className="relative border-l-2 border-[#F9A8D4] ml-2.5 pl-4 space-y-4">
                  
                  {/* Event 1 */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#FCE7F3]" />
                    <div className="text-xs">
                      <div className="font-bold text-[#4A044E]">Event: Account Created</div>
                      <div className="text-[10px] text-[#9D174D]/85 font-mono">12 June 2024 at 10:45:32 AM IST</div>
                      <div className="text-[#831843] text-[10px] mt-0.5">Responsible: Sarah Jenkins (EMP-0101)</div>
                      <div className="text-[#9D174D]/85 text-[9px] italic mt-0.5">"Secure electronic registration initialized via Admin clearance portal."</div>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-400 ring-4 ring-[#FCE7F3]" />
                    <div className="text-xs">
                      <div className="font-bold text-[#4A044E]">Event: KYC Completed</div>
                      <div className="text-[10px] text-[#9D174D]/85 font-mono">12 June 2024 at 10:55:00 AM IST</div>
                      <div className="text-[#831843] text-[10px] mt-0.5">Responsible: Sarah Jenkins (EMP-001)</div>
                      <div className="text-[#9D174D]/85 text-[9px] italic mt-0.5">"Liveness verification & biometric scan matching validated with zero contrast warnings."</div>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-[#FCE7F3]" />
                    <div className="text-xs">
                      <div className="font-bold text-[#4A044E]">Event: Branch Approval</div>
                      <div className="text-[10px] text-[#9D174D]/85 font-mono">12 June 2024 at 11:20:15 AM IST</div>
                      <div className="text-[#831843] text-[10px] mt-0.5">Responsible: {branchDetail.manager.name} ({branchDetail.manager.empId})</div>
                      <div className="text-[#9D174D]/85 text-[9px] italic mt-0.5">"Regulatory collateral buffers initialized and branch clearance approved."</div>
                    </div>
                  </div>

                  {/* Event 4 */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#FCE7F3]" />
                    <div className="text-xs">
                      <div className="font-bold text-[#4A044E]">Event: First Deposit</div>
                      <div className="text-[10px] text-[#9D174D]/85 font-mono">12 June 2024 at 02:15:00 PM IST</div>
                      <div className="text-[#831843] text-[10px] mt-0.5">Responsible: System Automator</div>
                      <div className="text-[#9D174D]/85 text-[9px] italic mt-0.5">"Initial reserve deposit wire received successfully."</div>
                    </div>
                  </div>

                  {/* Event 5 */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-rose-400 ring-4 ring-[#FCE7F3]" />
                    <div className="text-xs">
                      <div className="font-bold text-[#4A044E]">Event: Latest Transaction</div>
                      <div className="text-[10px] text-[#9D174D]/85 font-mono">11 June 2026 at 04:12:45 PM IST</div>
                      <div className="text-[#831843] text-[10px] mt-0.5">Responsible: SWIFT Clearing Center</div>
                      <div className="text-[#9D174D]/85 text-[9px] italic mt-0.5">"Real-time ledger value synchronized and verified."</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION: Super Admin Actions */}
              <div className="space-y-2 border-t border-[#FBCFE8] pt-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#9D174D]/85 font-bold">10. Super Admin Actions</p>
                <div id="super-admin-action-block" className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => {
                      showFeedback(`Loading complete digital ledger archive overview for ${activeAccount.ownerName}...`);
                      addAuditLog(`Super Admin accessed profile for ${activeAccount.ownerName}`, 'Info');
                      if (setActiveTab) setActiveTab(activeAccount.ownerType === 'Customer' ? 'customers' : 'employees');
                    }}
                    className="p-2 bg-[#FFF5F8] border border-slate-700 hover:border-[#d4af37] text-[10px] font-mono font-bold text-[#4A044E] rounded-lg transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <User size={12} className="text-amber-500" />
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      showFeedback(`Filtering real-time transactions database by Customer ID ${activeAccount.ownerId}`);
                      addAuditLog(`Super Admin checked transactions for ${activeAccount.ownerId}`, 'Info');
                      if (setActiveTab) setActiveTab('transactions');
                    }}
                    className="p-2 bg-[#FFF5F8] border border-slate-700 hover:border-blue-500 text-[10px] font-mono font-bold text-[#4A044E] rounded-lg transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <Activity size={12} className="text-blue-500" />
                    View Txns
                  </button>
                  
                  {activeAccount.status === 'Frozen' ? (
                    <button
                      onClick={() => handleFreezeToggle(false)}
                      className="p-2 bg-emerald-500/10 border border-emerald-500/40 hover:bg-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 rounded-lg transition-colors cursor-pointer text-left flex items-center gap-1.5 col-span-2"
                    >
                      <Unlock size={12} />
                      Unfreeze Account Ledger
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFreezeToggle(true)}
                      className="p-2 bg-rose-500/10 border border-rose-500/40 hover:bg-rose-500/20 text-[10px] font-mono font-bold text-rose-400 rounded-lg transition-colors cursor-pointer text-left flex items-center gap-1.5 col-span-2"
                    >
                      <Lock size={12} />
                      Freeze Account Ledger
                    </button>
                  )}

                  <button
                    onClick={() => {
                      addAuditLog(`Super Admin initiated call to branch manager ${branchDetail.manager.name}`, 'Info');
                      window.location.href = `tel:${branchDetail.manager.phone}`;
                    }}
                    className="p-2 bg-[#FFF5F8] border border-slate-700 text-[10px] font-mono text-[#831843] rounded-lg transition-all hover:bg-indigo-950/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <UserCheck size={12} className="text-indigo-400" />
                    Call Manager
                  </button>

                  <button
                    onClick={() => {
                      addAuditLog(`Super Admin initiated call to dedicated relationship officer`, 'Info');
                      window.location.href = `tel:+15550101`;
                    }}
                    className="p-2 bg-[#FFF5F8] border border-slate-700 text-[10px] font-mono text-[#831843] rounded-lg transition-all hover:bg-indigo-950/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Phone size={12} className="text-green-400" />
                    Call Officer
                  </button>

                  <button
                    onClick={() => {
                      showFeedback(`Retrieving certified HSM audit trails for account block ${activeAccount.accountNumber}`);
                      addAuditLog(`Super Admin viewed cryptographic HSM logs for ${activeAccount.accountNumber}`, 'Warning');
                      if (setActiveTab) setActiveTab('audit');
                    }}
                    className="p-2 bg-[#FFF5F8] border border-slate-700 text-[10px] font-mono text-[#831843] rounded-lg transition-all hover:bg-indigo-950/20 cursor-pointer text-center col-span-2 flex items-center justify-center gap-1.5"
                  >
                    <FileText size={12} className="text-[#d4af37]" />
                    View Certified Cryptographic Audit Logs
                  </button>

                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#9D174D]/80">
              Please tap an active customer or employee ledger reference from the ledger table to inspect detailed audit intelligence metrics.
            </div>
          )}

          <div className="text-[10px] text-[#9D174D]/80 font-mono leading-relaxed mt-4 pt-4 border-t border-[#131b40]/60">
            Account Management changes are cryptographically mapped directly to active HSM blocks. Clearance authority level required: ADM-2.
          </div>
        </div>

      </div>

    </div>
  );
}
