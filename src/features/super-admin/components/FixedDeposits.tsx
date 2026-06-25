import React, { useState, useMemo, useEffect } from 'react';
import { 
  PiggyBank, 
  MapPin, 
  Building, 
  User, 
  Users, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  Percent,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { FixedDeposit, Customer, Employee, Branch } from '../types/dashboard';

interface FixedDepositsProps {
  fixedDeposits: FixedDeposit[];
  setFixedDeposits: (deposits: FixedDeposit[]) => void;
  customers: Customer[];
  employees: Employee[];
  branches: Branch[];
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

// Rich detailed metadata structure for every fixed deposit
interface FDRichDetails {
  id: string;
  fdNumber: string;
  customerName: string;
  customerId: string;
  mobileNumber: string;
  emailAddress: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  status: 'Active' | 'Matured' | 'Premature' | 'Pending' | 'Closed';
  fdType: 'Regular FD' | 'Tax Saver FD' | 'Senior Citizen FD' | 'Corporate FD' | 'Employee FD';
  isEmployee: boolean;

  // Branch Information
  branchName: string;
  branchCode: string;
  branchLocation: string;
  branchManagerName: string;

  // FD Creation Information
  createdByEmployee: string;
  createdByEmployeeId: string;
  creatorDesignation: string;
  dateCreated: string;
  timeCreated: string;

  // Approval Information
  approvedBy: string;
  approvalBranchManager: string;
  approvalDate: string;
  approvalTime: string;

  // Transaction History
  transactions: Array<{
    type: 'FD Opening Transaction' | 'Additional Deposit Transactions' | 'Interest Credit History' | 'Premature Withdrawal History';
    amount: number;
    date: string;
    time: string;
    branch: string;
  }>;
}

// Seed complete, high-fidelity FDIC insured fixed deposits for Customers and Employees
const RICH_FD_PRESETS: FDRichDetails[] = [
  {
    id: "FD-501",
    fdNumber: "FD-ACT-8821902",
    customerName: "Alistair Sterling",
    customerId: "CUST-802",
    mobileNumber: "+41 44 213 4102",
    emailAddress: "a.sterling@sterlingholdings.ch",
    amount: 5000000.00,
    interestRate: 5.25,
    durationMonths: 24,
    startDate: "2025-01-10",
    maturityDate: "2027-01-10",
    maturityAmount: 5525000.00,
    status: "Active",
    fdType: "Corporate FD",
    isEmployee: false,
    branchName: "Zurich Elite Vault",
    branchCode: "BR-ZH-01",
    branchLocation: "Zurich, Switzerland",
    branchManagerName: "Maximilian Kael",
    createdByEmployee: "Hassan Al-Saeed",
    createdByEmployeeId: "EMP-155",
    creatorDesignation: "Wealth Management Advisor",
    dateCreated: "2025-01-09",
    timeCreated: "10:14 AM",
    approvedBy: "Maximilian Kael",
    approvalBranchManager: "Maximilian Kael",
    approvalDate: "2025-01-09",
    approvalTime: "02:30 PM",
    transactions: [
      { type: "FD Opening Transaction", amount: 5000000.00, date: "2025-01-10", time: "09:00 AM", branch: "Zurich Elite Vault" },
      { type: "Interest Credit History", amount: 131250.00, date: "2025-07-10", time: "11:59 PM", branch: "Zurich Elite Vault" },
      { type: "Interest Credit History", amount: 131250.00, date: "2026-01-10", time: "11:59 PM", branch: "Zurich Elite Vault" }
    ]
  },
  {
    id: "FD-502",
    fdNumber: "FD-ACT-9910243",
    customerName: "Kenji Takahashi",
    customerId: "CUST-901",
    mobileNumber: "+81 3 5555 0147",
    emailAddress: "kenji@takahashi-corp.jp",
    amount: 10000000.00,
    interestRate: 5.75,
    durationMonths: 36,
    startDate: "2024-06-15",
    maturityDate: "2027-06-15",
    maturityAmount: 11725000.00,
    status: "Active",
    fdType: "Senior Citizen FD",
    isEmployee: false,
    branchName: "Tokyo Shinjuku Node",
    branchCode: "BR-TKY-03",
    branchLocation: "Tokyo, Japan",
    branchManagerName: "Kenji Takahashi (Self-Signed)",
    createdByEmployee: "Yuki Sato",
    createdByEmployeeId: "EMP-108",
    creatorDesignation: "IT Systems Admin",
    dateCreated: "2024-06-14",
    timeCreated: "11:05 AM",
    approvedBy: "Donald Vance",
    approvalBranchManager: "Donald Vance",
    approvalDate: "2024-06-14",
    approvalTime: "04:15 PM",
    transactions: [
      { type: "FD Opening Transaction", amount: 10000000.00, date: "2024-06-15", time: "10:00 AM", branch: "Tokyo Shinjuku Node" },
      { type: "Interest Credit History", amount: 287500.00, date: "2025-06-15", time: "11:59 PM", branch: "Tokyo Shinjuku Node" }
    ]
  },
  {
    id: "FD-503",
    fdNumber: "FD-MAT-3190248",
    customerName: "Elena Rostova",
    customerId: "CUST-415",
    mobileNumber: "+7 495 281 9021",
    emailAddress: "elena.rostova@rostova-cargo.ru",
    amount: 2500000.00,
    interestRate: 6.10,
    durationMonths: 12,
    startDate: "2025-06-10",
    maturityDate: "2026-06-10",
    maturityAmount: 2652500.00,
    status: "Matured",
    fdType: "Regular FD",
    isEmployee: false,
    branchName: "Zurich Elite Vault",
    branchCode: "BR-ZH-01",
    branchLocation: "Zurich, Switzerland",
    branchManagerName: "Maximilian Kael",
    createdByEmployee: "Maximilian Kael",
    createdByEmployeeId: "EMP-014",
    creatorDesignation: "Zurich Branch Manager",
    dateCreated: "2025-06-10",
    timeCreated: "08:15 AM",
    approvedBy: "Maximilian Kael",
    approvalBranchManager: "Maximilian Kael",
    approvalDate: "2025-06-10",
    approvalTime: "08:45 AM",
    transactions: [
      { type: "FD Opening Transaction", amount: 2500000.00, date: "2025-06-10", time: "09:00 AM", branch: "Zurich Elite Vault" },
      { type: "Interest Credit History", amount: 152500.00, date: "2026-06-10", time: "11:59 PM", branch: "Zurich Elite Vault" }
    ]
  },
  {
    id: "FD-504",
    fdNumber: "FD-PRE-1122839",
    customerName: "Marcus Vance",
    customerId: "CUST-293",
    mobileNumber: "+1 212 555 0192",
    emailAddress: "marcus@vance-ventures.com",
    amount: 1500000.00,
    interestRate: 4.85,
    durationMonths: 18,
    startDate: "2026-01-15",
    maturityDate: "2027-07-15",
    maturityAmount: 1609125.00,
    status: "Premature",
    fdType: "Tax Saver FD",
    isEmployee: false,
    branchName: "New York Wall St. Flagship",
    branchCode: "BR-NYC-01",
    branchLocation: "New York, USA",
    branchManagerName: "Donald Vance",
    createdByEmployee: "Sarah Jenkins",
    createdByEmployeeId: "EMP-001",
    creatorDesignation: "Senior Compliance Officer",
    dateCreated: "2026-01-14",
    timeCreated: "03:45 PM",
    approvedBy: "Donald Vance",
    approvalBranchManager: "Donald Vance",
    approvalDate: "2026-01-14",
    approvalTime: "05:00 PM",
    transactions: [
      { type: "FD Opening Transaction", amount: 1500000.00, date: "2026-01-15", time: "09:30 AM", branch: "New York Wall St. Flagship" },
      { type: "Premature Withdrawal History", amount: 1500000.00, date: "2026-06-01", time: "12:15 PM", branch: "New York Wall St. Flagship" }
    ]
  },
  {
    id: "FD-505",
    fdNumber: "FD-EMP-4458912",
    customerName: "Sarah Jenkins",
    customerId: "EMP-001",
    mobileNumber: "+1 212 555 4901",
    emailAddress: "s.jenkins@apexbank.com",
    amount: 800000.00,
    interestRate: 7.25, // Staff special benefit
    durationMonths: 24,
    startDate: "2025-03-01",
    maturityDate: "2027-03-01",
    maturityAmount: 916000.00,
    status: "Active",
    fdType: "Employee FD",
    isEmployee: true,
    branchName: "New York Wall St. Flagship",
    branchCode: "BR-NYC-01",
    branchLocation: "New York, USA",
    branchManagerName: "Donald Vance",
    createdByEmployee: "Sarah Jenkins",
    createdByEmployeeId: "EMP-001",
    creatorDesignation: "Senior Compliance Officer",
    dateCreated: "2025-02-28",
    timeCreated: "09:00 AM",
    approvedBy: "Donald Vance",
    approvalBranchManager: "Donald Vance",
    approvalDate: "2025-02-28",
    approvalTime: "11:30 AM",
    transactions: [
      { type: "FD Opening Transaction", amount: 800000.00, date: "2025-03-01", time: "10:00 AM", branch: "New York Wall St. Flagship" },
      { type: "Interest Credit History", amount: 58000.00, date: "2026-03-01", time: "11:59 PM", branch: "New York Wall St. Flagship" }
    ]
  },
  {
    id: "FD-506",
    fdNumber: "FD-EMP-7711204",
    customerName: "Maximilian Kael",
    customerId: "EMP-014",
    mobileNumber: "+41 44 912 8831",
    emailAddress: "m.kael@apexbank.com",
    amount: 4000000.00,
    interestRate: 7.50, // Staff special rate
    durationMonths: 12,
    startDate: "2026-02-15",
    maturityDate: "2027-02-15",
    maturityAmount: 4300000.00,
    status: "Active",
    fdType: "Employee FD",
    isEmployee: true,
    branchName: "Zurich Elite Vault",
    branchCode: "BR-ZH-01",
    branchLocation: "Zurich, Switzerland",
    branchManagerName: "Maximilian Kael",
    createdByEmployee: "Hassan Al-Saeed",
    createdByEmployeeId: "EMP-155",
    creatorDesignation: "Wealth Management Advisor",
    dateCreated: "2026-02-14",
    timeCreated: "10:14 AM",
    approvedBy: "Maximilian Kael (Self-Signed)",
    approvalBranchManager: "Maximilian Kael",
    approvalDate: "2026-02-14",
    approvalTime: "12:00 PM",
    transactions: [
      { type: "FD Opening Transaction", amount: 4000000.00, date: "2026-02-15", time: "09:00 AM", branch: "Zurich Elite Vault" }
    ]
  },
  {
    id: "FD-507",
    fdNumber: "FD-EMP-5511221",
    customerName: "Vikram Naidu",
    customerId: "EMP-045",
    mobileNumber: "+1 212 555 9201",
    emailAddress: "v.naidu@apexbank.com",
    amount: 150000.00,
    interestRate: 6.80,
    durationMonths: 12,
    startDate: "2025-06-01",
    maturityDate: "2026-06-01",
    maturityAmount: 160200,
    status: "Closed",
    fdType: "Employee FD",
    isEmployee: true,
    branchName: "New York Wall St. Flagship",
    branchCode: "BR-NYC-01",
    branchLocation: "New York, USA",
    branchManagerName: "Donald Vance",
    createdByEmployee: "Sarah Jenkins",
    createdByEmployeeId: "EMP-001",
    creatorDesignation: "Senior Compliance Officer",
    dateCreated: "2025-05-30",
    timeCreated: "02:15 PM",
    approvedBy: "Donald Vance",
    approvalBranchManager: "Donald Vance",
    approvalDate: "2025-05-30",
    approvalTime: "04:30 PM",
    transactions: [
      { type: "FD Opening Transaction", amount: 150000.00, date: "2025-06-01", time: "10:00 AM", branch: "New York Wall St. Flagship" },
      { type: "Interest Credit History", amount: 10200.00, date: "2026-06-01", time: "11:59 PM", branch: "New York Wall St. Flagship" }
    ]
  },
  {
    id: "FD-508",
    fdNumber: "FD-EMP-2281920",
    customerName: "Chloe Dupont",
    customerId: "EMP-092",
    mobileNumber: "+33 1 4227 7561",
    emailAddress: "c.dupont@apexbank.com",
    amount: 500000.00,
    interestRate: 7.20,
    durationMonths: 36,
    startDate: "2026-06-12",
    maturityDate: "2029-06-12",
    maturityAmount: 608000.00,
    status: "Pending",
    fdType: "Employee FD",
    isEmployee: true,
    branchName: "London Canary Wharf",
    branchCode: "BR-LDN-02",
    branchLocation: "London, Great Britain",
    branchManagerName: "Donald Vance",
    createdByEmployee: "Chloe Dupont",
    createdByEmployeeId: "EMP-092",
    creatorDesignation: "Senior Loan Underwriter",
    dateCreated: "2026-06-12",
    timeCreated: "10:45 AM",
    approvedBy: "Awaiting Admin Action",
    approvalBranchManager: "Underwriter Committee",
    approvalDate: "—",
    approvalTime: "—",
    transactions: [
      { type: "FD Opening Transaction", amount: 500000.00, date: "2026-06-12", time: "11:00 AM", branch: "London Canary Wharf" }
    ]
  }
];

export default function FixedDeposits({
  fixedDeposits,
  setFixedDeposits,
  customers,
  employees,
  branches,
  addAuditLog
}: FixedDepositsProps) {
  // Advanced evaluation calculator state
  const [calcInput, setCalcInput] = useState({ principal: 100000, duration: 12, rate: 5.50 });
  const [interestResult, setInterestResult] = useState(5500);

  // Initialize and track active filtered Fixed Deposits database
  const [fdData, setFdData] = useState<FDRichDetails[]>(RICH_FD_PRESETS);

  const [selectedFdId, setSelectedFdId] = useState<string | null>("FD-501");

  useEffect(() => {
    if (fixedDeposits.length === 0) return;
    const mapped: FDRichDetails[] = fixedDeposits.map((fd) => {
      const customer = customers.find((c) => c.name === fd.customerName);
      const branch = branches.find((b) => b.id === customer?.branchId) || branches[0];
      const months = fd.durationMonths || 12;
      const start = fd.startDate && !Number.isNaN(Date.parse(fd.startDate))
        ? new Date(fd.startDate)
        : new Date();
      const maturity = new Date(start);
      maturity.setMonth(maturity.getMonth() + months);
      const maturityDate = Number.isNaN(maturity.getTime())
        ? start.toISOString().slice(0, 10)
        : maturity.toISOString().slice(0, 10);
      const maturityAmount = fd.amount * (1 + (fd.interestRate / 100) * (months / 12));
      return {
        id: fd.id,
        fdNumber: fd.id,
        customerName: fd.customerName,
        customerId: customer?.id || 'CUST-000',
        mobileNumber: customer?.phone || '+91 90000 00000',
        emailAddress: customer?.email || 'client@apexbank.com',
        amount: fd.amount,
        interestRate: fd.interestRate,
        durationMonths: months,
        startDate: fd.startDate || start.toISOString().slice(0, 10),
        maturityDate,
        maturityAmount,
        status: fd.status,
        fdType: 'Regular FD',
        isEmployee: false,
        branchName: branch?.name || 'Hyderabad Main Branch',
        branchCode: branch?.id || 'BR-HYD-01',
        branchLocation: branch?.location || 'Hyderabad, Telangana',
        branchManagerName: branch?.manager || 'Branch Manager',
        createdByEmployee: employees[0]?.name || 'System Admin',
        createdByEmployeeId: employees[0]?.id || 'EMP-001',
        creatorDesignation: employees[0]?.role || 'Operations Officer',
        dateCreated: fd.startDate,
        timeCreated: '09:00 AM',
        approvedBy: branch?.manager || 'Branch Manager',
        approvalBranchManager: branch?.manager || 'Branch Manager',
        approvalDate: fd.startDate,
        approvalTime: '10:00 AM',
        transactions: [
          {
            type: 'FD Opening Transaction' as const,
            amount: fd.amount,
            date: fd.startDate,
            time: '09:00 AM',
            branch: branch?.name || 'Main Branch',
          },
        ],
      };
    });
    setFdData(mapped);
    if (mapped[0]) setSelectedFdId(mapped[0].id);
  }, [fixedDeposits, customers, employees, branches]);

  // Filters state
  const [holderFilter, setHolderFilter] = useState<'All' | 'Customers' | 'Employees'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Keep selected item synchronized to matching data
  const selectedFdDetail = useMemo(() => {
    return fdData.find(fd => fd.id === selectedFdId) || fdData[0] || null;
  }, [fdData, selectedFdId]);

  // Handle calculator evaluation
  const calculateCompoundInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const p = Math.max(100, Number(calcInput.principal));
    const t = Math.max(1, Number(calcInput.duration));
    const r = Math.max(0.1, Number(calcInput.rate));

    const compoundingYield = p * (r / 100) * (t / 12);
    setInterestResult(compoundingYield);
    addAuditLog(`Compounding calculator evaluated for Principal $${p.toLocaleString()} Yielding $${compoundingYield.toLocaleString()}`, 'Info');
  };

  // Perform filtering logic
  const filteredFDs = useMemo(() => {
    return fdData.filter(fd => {
      // 1. Applicant/Holder Filter
      if (holderFilter === 'Customers' && fd.isEmployee) return false;
      if (holderFilter === 'Employees' && !fd.isEmployee) return false;

      // 2. Status Filter
      if (statusFilter !== 'All') {
        const checkMap: Record<string, string> = {
          'Active FD': 'Active',
          'Matured FD': 'Matured',
          'Premature Closure': 'Premature',
          'Pending Approval': 'Pending',
          'Closed FD': 'Closed'
        };
        const target = checkMap[statusFilter];
        if (target && fd.status !== target) return false;
      }

      // 3. Type Filter
      if (typeFilter !== 'All') {
        if (fd.fdType !== typeFilter) return false;
      }

      return true;
    });
  }, [fdData, holderFilter, statusFilter, typeFilter]);

  // Dynamically synchronize right details when filters remove target from list
  useEffect(() => {
    if (filteredFDs.length > 0) {
      const match = filteredFDs.find(f => f.id === selectedFdId);
      if (!match) {
        setSelectedFdId(filteredFDs[0].id);
      }
    }
  }, [filteredFDs, selectedFdId]);

  // Quick Action Handler to simulate approving a pending FD, closing an active, etc.
  const handleStatusUpdate = (id: string, transition: 'Active' | 'Closed' | 'Premature') => {
    const matched = fdData.map(fd => {
      if (fd.id === id) {
        const currentAmount = fd.amount;
        let finalMaturity = fd.maturityAmount;
        if (transition === 'Premature') {
          finalMaturity = currentAmount * 1.015; // Penalty applied
        }
        return {
          ...fd,
          status: transition,
          approvedBy: transition === 'Active' ? 'AUTHORIZED SUPER_ADMIN' : fd.approvedBy,
          approvalDate: transition === 'Active' ? new Date().toISOString().split('T')[0] : fd.approvalDate,
          approvalTime: transition === 'Active' ? '02:00 PM' : fd.approvalTime,
          transactions: [
            ...fd.transactions,
            { 
              type: transition === 'Premature' ? "Premature Withdrawal History" as const : "Additional Deposit Transactions" as const, 
              amount: finalMaturity, 
              date: new Date().toISOString().split('T')[0], 
              time: '02:00 PM', 
              branch: fd.branchName 
            }
          ]
        };
      }
      return fd;
    });

    setFdData(matched);
    addAuditLog(`Fixed Deposit Reference ${id} updated to status state: ${transition.toUpperCase()}`, 'Info');
  };

  return (
    <div className="space-y-6" id="fixeddeposits-module">

      {/* Advanced Filter Control Center */}
      <div className="p-5 rounded-xl border border-[#F9A8D4]/80 bg-[#FCE7F3] shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-[#FBCFE8]">
          <Filter size={14} className="text-amber-400" />
          <h4 className="text-xs font-bold text-[#4A044E] uppercase tracking-wider">Fixed Deposit Ledger Control workbench</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Applicant/Holder filters */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#BE185D]/75 uppercase tracking-wide font-bold">Applicant Category</label>
            <div className="flex flex-wrap gap-1.5">
              {(['All', 'Customers', 'Employees'] as const).map((type) => (
                <button
                  key={type}
                  id={`fd-filter-holder-${type}`}
                  onClick={() => {
                    setHolderFilter(type);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    holderFilter === type
                      ? 'bg-amber-500/10 border-amber-500/60 text-amber-400 hover:bg-amber-500/25'
                      : 'bg-[#FFF1F5]/60 border-[#F9A8D4] text-[#BE185D]/75 hover:bg-[#FFF1F5] hover:text-[#4A044E]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {type === 'Customers' && <User size={11} />}
                    {type === 'Employees' && <Users size={11} />}
                    {type === 'All' ? 'All FD Holders' : type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. FD Status Filters */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#BE185D]/75 uppercase tracking-wide font-bold font-mono">FD Verification Status</label>
            <div className="relative">
              <select
                id="fd-status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs font-medium bg-[#FFF1F5]/60 border border-[#F9A8D4] text-[#4A044E] hover:border-[#F9A8D4] rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-500/40 cursor-pointer"
              >
                <option value="All">All FD Statuses</option>
                <option value="Active FD">Active FD</option>
                <option value="Matured FD">Matured FD</option>
                <option value="Premature Closure">Premature Closure</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Closed FD">Closed FD</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#BE185D]/75">
                ▼
              </div>
            </div>
          </div>

          {/* 3. FD Type Filters */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#BE185D]/75 uppercase tracking-wide font-bold">FD Investment Type</label>
            <div className="relative">
              <select
                id="fd-type-filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full text-xs font-medium bg-[#FFF1F5]/60 border border-[#F9A8D4] text-[#4A044E] hover:border-[#F9A8D4] rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-500/40 cursor-pointer"
              >
                <option value="All">All FD Types</option>
                <option value="Regular FD">Regular FD</option>
                <option value="Tax Saver FD">Tax Saver FD</option>
                <option value="Senior Citizen FD">Senior Citizen FD</option>
                <option value="Corporate FD">Corporate FD</option>
                <option value="Employee FD">Employee FD</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#BE185D]/75">
                ▼
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main split dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column split span (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Deposits Table */}
          <div className="p-5 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#FBCFE8]">
              <div>
                <h3 className="text-xs font-bold text-[#4A044E] uppercase tracking-wider">Active Long-Term Reserves Ledger</h3>
                <p className="text-[11px] text-[#9D174D]/80">A list of premium physical investment certificates assigned to Apex client portfolios.</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded uppercase shrink-0">
                {filteredFDs.length} FD Records
              </span>
            </div>

            <div className="overflow-x-auto select-text">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#FBCFE8] text-[9px] text-[#BE185D]/75 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">FD Ref ID</th>
                    <th className="py-2.5 px-3">Owner of record</th>
                    <th className="py-2.5 px-3">FD Type</th>
                    <th className="py-2.5 px-3 text-right">Certificate Capital</th>
                    <th className="py-2.5 px-3 text-center">APY Rate</th>
                    <th className="py-2.5 px-3 text-right">Status State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141c48]">
                  {filteredFDs.length > 0 ? (
                    filteredFDs.map((fd) => {
                      const isSelected = selectedFdId === fd.id;

                      const badgeStyles: Record<string, string> = {
                        'Active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                        'Matured': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                        'Premature': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                        'Pending': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                        'Closed': 'bg-stone-500/10 text-stone-400 border-stone-500/20'
                      };

                      return (
                        <tr 
                          key={fd.id}
                          onClick={() => setSelectedFdId(fd.id)}
                          className={`text-xs hover:bg-[#FBCFE8]/70 transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#FDF2F8] border-l-2 border-amber-500' : ''
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-bold text-[#831843] flex items-center gap-1">
                            {fd.isEmployee ? <Users size={11} className="text-amber-500" /> : <User size={11} className="text-zinc-400" />}
                            <span>{fd.id}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-[#4A044E] block truncate max-w-[120px]">{fd.customerName}</span>
                            <span className="text-[8px] text-[#9D174D]/80 font-mono leading-none">{fd.customerId}</span>
                          </td>
                          <td className="py-3 px-3 text-[#BE185D]/75 font-medium text-[10px]">{fd.fdType}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-[#4A044E]">
                            ${fd.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-center text-amber-500 font-bold font-mono">{fd.interestRate}%</td>
                          <td className="py-3 px-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${badgeStyles[fd.status]}`}>
                              {fd.status === 'Premature' ? 'PREMATURE CLOSURE' : fd.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-[#9D174D]/80 font-mono text-xs">
                        No Fixed Deposits found matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compounding Interest Calculator Form */}
          <div className="p-5 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-4">
            <div>
              <span className="text-amber-500 text-[9px] font-mono tracking-widest uppercase font-bold block">Reserve Forecasting</span>
              <h3 className="text-sm font-bold text-[#4A044E] mt-1 font-sans">Compounding Yield Calculator</h3>
              <p className="text-xs text-[#BE185D]/75">Pre-evaluate passive wealth generation payouts based on active baseline metrics.</p>
            </div>

            <form onSubmit={calculateCompoundInterest} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#BE185D]/75 font-semibold uppercase tracking-wide">Principal Sum ($):</label>
                <input 
                  id="fd-calc-principal"
                  type="number"
                  value={calcInput.principal}
                  onChange={(e) => setCalcInput({ ...calcInput, principal: Number(e.target.value) })}
                  className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] p-2.5 rounded-xl outline-none font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#BE185D]/75 font-semibold uppercase tracking-wide">Term (Months):</label>
                <input 
                  id="fd-calc-duration"
                  type="number"
                  value={calcInput.duration}
                  onChange={(e) => setCalcInput({ ...calcInput, duration: Number(e.target.value) })}
                  className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] p-2.5 rounded-xl outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#BE185D]/75 font-semibold uppercase tracking-wide">APR Rate (%):</label>
                <div className="flex gap-2">
                  <input 
                    id="fd-calc-rate"
                    type="number"
                    step="0.05"
                    value={calcInput.rate}
                    onChange={(e) => setCalcInput({ ...calcInput, rate: Number(e.target.value) })}
                    className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] p-2.5 rounded-xl outline-none font-mono"
                  />
                  <button
                    id="fd-calc-submit"
                    type="submit"
                    style={{
                      backgroundColor: '#FBCFE8',
                      borderColor: '#F9A8D4',
                      color: '#4A044E'
                    }}
                    className="px-4 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border transition-all duration-200 cursor-pointer shrink-0 hover:bg-[#FCE7F3] active:bg-[#EC4899] active:text-white"
                  >
                    Evaluate
                  </button>
                </div>
              </div>
            </form>

            {/* Results Block */}
            <div className="p-3 rounded-xl border border-[#2e1d10] bg-[#1a0e03]/80 text-amber-500 text-xs flex justify-between items-center">
              <span className="uppercase text-[9px] font-bold tracking-widest text-[#BE185D]/75">Projected Compounding Yield:</span>
              <p className="text-base font-bold font-mono text-[#4A044E]">${interestResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

        </div>

        {/* Right detailed Fixed Deposit profile panel (5/12) */}
        <div className="lg:col-span-5">
          {selectedFdDetail ? (
            <div className="p-5 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-5 select-text">
              
              {/* Card Header information */}
              <div className="pb-3 border-b border-[#FBCFE8] flex items-center justify-between">
                <div>
                  <span className="text-amber-500 text-[9px] font-mono tracking-widest uppercase font-bold block">Reserve Document Profile</span>
                  <h3 className="text-sm font-bold text-[#4A044E] uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <PiggyBank size={14} className="text-amber-400" />
                    Inspection Dashboard
                  </h3>
                </div>
                <span className={`px-2 py-0.5 text-[8.5px] font-black uppercase rounded ${
                  selectedFdDetail.isEmployee ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                }`}>
                  {selectedFdDetail.isEmployee ? 'Employee Holder' : 'VIP Customer'}
                </span>
              </div>

              {/* FD Holder Information block */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-500 block tracking-wider">
                  FD Holder Information
                </span>
                
                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 text-xs space-y-2 font-mono">
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Full Name:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.customerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">{selectedFdDetail.isEmployee ? 'Employee ID' : 'Customer ID'}:</span>
                    <span className="font-bold text-amber-400 text-right">{selectedFdDetail.customerId}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Mobile Number:</span>
                    <a href={`tel:${selectedFdDetail.mobileNumber}`} className="font-bold text-[#4A044E] text-right hover:text-amber-500 cursor-pointer">{selectedFdDetail.mobileNumber}</a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BE185D]/75 font-sans">Email Address:</span>
                    <a href={`mailto:${selectedFdDetail.emailAddress}`} className="font-bold text-emerald-400 text-right overflow-hidden text-ellipsis whitespace-nowrap block max-w-[170px] hover:underline cursor-pointer">{selectedFdDetail.emailAddress}</a>
                  </div>
                </div>
              </div>

              {/* Fixed Deposit details */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 block tracking-wider">
                  Fixed Deposit Information
                </span>

                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 text-xs space-y-2 font-mono">
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">FD Number:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.fdNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">FD Type:</span>
                    <span className="font-bold text-indigo-300 text-right">{selectedFdDetail.fdType}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Deposit Amount:</span>
                    <span className="font-bold text-[#4A044E] text-right text-sm">
                      ${selectedFdDetail.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Interest Rate (APY):</span>
                    <span className="font-bold text-amber-500 text-right">{selectedFdDetail.interestRate}%</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Deposit Date:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.startDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Maturity Date:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.maturityDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Maturity Amount:</span>
                    <span className="font-bold text-emerald-400 text-right">
                      ${selectedFdDetail.maturityAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-0.5">
                    <span className="text-[#BE185D]/75 font-sans">Current FD Status:</span>
                    <span className="px-2 py-0.5 border border-amber-500/30 bg-amber-500/5 text-amber-400 rounded text-[9px] font-bold font-mono">
                      {selectedFdDetail.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Branch details */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-[#9D174D]/85 block tracking-wider">
                  Branch Information
                </span>

                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 text-xs space-y-2 font-mono">
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Branch Name:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.branchName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Branch Code:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.branchCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Branch Location:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.branchLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BE185D]/75 font-sans">Branch Manager Name:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.branchManagerName}</span>
                  </div>
                </div>
              </div>

              {/* FD Creation Information */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-[#818cf8] block tracking-wider">
                  FD Creation Information
                </span>

                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 text-xs space-y-2 font-mono">
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Created By Employee:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.createdByEmployee}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Employee ID:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.createdByEmployeeId}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Designation:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.creatorDesignation}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Date Created:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.dateCreated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BE185D]/75 font-sans">Time Created:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.timeCreated}</span>
                  </div>
                </div>
              </div>

              {/* Approval Info */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-wider">
                  Approval Information
                </span>

                <div className="p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 text-xs space-y-2 font-mono">
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Approved By:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.approvedBy}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Branch Manager:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.approvalBranchManager}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FBCFE8]/40 pb-1.5">
                    <span className="text-[#BE185D]/75 font-sans">Approval Date:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.approvalDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BE185D]/75 font-sans">Approval Time:</span>
                    <span className="font-bold text-[#4A044E] text-right">{selectedFdDetail.approvalTime}</span>
                  </div>
                </div>
              </div>

              {/* Transaction History display */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-500 block tracking-wider">
                  Transaction History
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedFdDetail.transactions.map((tx, idx) => (
                    <div key={idx} className="p-3 border border-[#FBCFE8]/60 bg-[#FFF5F8] rounded-xl text-xs space-y-1 font-mono">
                      <div className="flex justify-between items-center border-b border-[#FBCFE8]/30 pb-1">
                        <span className="font-bold text-amber-400 text-[10px]">{tx.type}</span>
                        <span className="text-[#4A044E] font-bold">${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-[#BE185D]/75">
                        <span>{tx.date} • {tx.time}</span>
                        <span className="font-sans text-stone-400">{tx.branch}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Actions */}
              {selectedFdDetail.status === 'Pending' && (
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedFdDetail.id, 'Active')}
                    className="flex-1 py-2 text-[10px] font-bold uppercase transition-all bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 rounded-lg cursor-pointer"
                  >
                    Approve FD Certificate
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedFdDetail.id, 'Closed')}
                    className="flex-1 py-2 text-[10px] font-bold uppercase transition-all bg-rose-500/10 border border-rose-500/40 text-rose-400 hover:bg-rose-500/25 rounded-lg cursor-pointer"
                  >
                    Reject Certificate
                  </button>
                </div>
              )}

              {selectedFdDetail.status === 'Active' && (
                <div className="pt-1">
                  <button
                    onClick={() => handleStatusUpdate(selectedFdDetail.id, 'Premature')}
                    className="w-full py-2.5 text-[10px] font-bold uppercase transition-all bg-amber-500/10 border border-amber-500/35 text-amber-400 hover:border-amber-400 rounded-lg cursor-pointer"
                  >
                    Trigger Premature Closure
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="py-24 text-center text-xs text-[#9D174D]/80 border border-dashed border-[#F9A8D4]/50 rounded-2xl bg-[#FCE7F3]/60 p-6 space-y-2">
              <PiggyBank size={32} className="mx-auto text-[#9D174D]/75 opacity-40" />
              <p className="font-bold text-[#4A044E]">No Record Inspected</p>
              <p className="text-[#9D174D]/80">Select any account to load sovereign reserve certificates.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
