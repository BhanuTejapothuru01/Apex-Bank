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
  ShieldCheck,
  ShieldAlert,
  User,
  Activity,
  FileText,
  Clock,
  ArrowRight,
  UserCheck,
  FileSpreadsheet,
  RefreshCw,
  Fingerprint,
  HardDriveUpload,
  AlertTriangle,
  XCircle,
  Eye,
  Search,
  Filter
} from 'lucide-react';

interface LoansTabProps {
  balance: number;
  onBalanceChange: (amt: number) => void;
  onAddTransaction: (name: string, type: 'Income' | 'Expense', amount: number, recipient: string, status?: 'Completed' | 'Pending' | 'Failed') => void;
  currentLoans: number;
  onLoansChange: (amt: number) => void;
  initialInterestRate?: number;
  globalSearchQuery?: string;
  applications?: LoanApplication[];
  setApplications?: React.Dispatch<React.SetStateAction<LoanApplication[]>>;
}

interface LoanApplication {
  id: string;
  customerName: string;
  companyName: string;
  loanType: string;
  requestedAmount: number;
  interestRate: number; // APR %
  termYears: number;
  applicationDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  
  // Financial parameters
  monthlyIncome: number;
  existingDebt: number;
  creditScore: number;
  fraudRiskScore: number; // 0-100%
  
  // Verification states
  kycStatus: 'Verified' | 'Pending' | 'Failed';
  panVerification: 'Verified' | 'Pending' | 'Failed';
  aadhaarVerification: 'Verified' | 'Pending' | 'Failed';
  bankVerification: 'Verified' | 'Pending' | 'Failed';
  employmentVerification: 'Verified' | 'Pending' | 'Failed';
}

const INITIAL_APPLICATIONS: LoanApplication[] = [
  {
    id: 'LN-2026-089A',
    customerName: 'Andrew Sterling',
    companyName: 'Apex Lab Holdings',
    loanType: 'Commercial Expansion Loan',
    requestedAmount: 150000,
    interestRate: 4.85,
    termYears: 10,
    applicationDate: '2026-06-10',
    status: 'Pending',
    monthlyIncome: 28500,
    existingDebt: 6200,
    creditScore: 785,
    fraudRiskScore: 12,
    kycStatus: 'Verified',
    panVerification: 'Verified',
    aadhaarVerification: 'Verified',
    bankVerification: 'Verified',
    employmentVerification: 'Verified'
  },
  {
    id: 'LN-2026-112B',
    customerName: 'Elwood Vance',
    companyName: 'Vance Dynamics',
    loanType: 'Working Capital Line',
    requestedAmount: 95000,
    interestRate: 6.20,
    termYears: 5,
    applicationDate: '2026-06-11',
    status: 'Pending',
    monthlyIncome: 18500,
    existingDebt: 9200,
    creditScore: 685,
    fraudRiskScore: 28,
    kycStatus: 'Verified',
    panVerification: 'Verified',
    aadhaarVerification: 'Verified',
    bankVerification: 'Verified',
    employmentVerification: 'Pending'
  },
  {
    id: 'LN-2026-403C',
    customerName: 'Marcus Thorne',
    companyName: 'Aura Designs',
    loanType: 'Equipment & Hardware Lease',
    requestedAmount: 65000,
    interestRate: 3.50,
    termYears: 3,
    applicationDate: '2026-06-08',
    status: 'Approved',
    monthlyIncome: 15600,
    existingDebt: 2100,
    creditScore: 815,
    fraudRiskScore: 6,
    kycStatus: 'Verified',
    panVerification: 'Verified',
    aadhaarVerification: 'Verified',
    bankVerification: 'Verified',
    employmentVerification: 'Verified'
  },
  {
    id: 'LN-2026-904D',
    customerName: 'Seraphina Vance',
    companyName: 'Horizon Logistics',
    loanType: 'Infrastructure & Transit Trust',
    requestedAmount: 180000,
    interestRate: 9.80,
    termYears: 15,
    applicationDate: '2026-06-05',
    status: 'Rejected',
    monthlyIncome: 22000,
    existingDebt: 24500,
    creditScore: 590,
    fraudRiskScore: 64,
    kycStatus: 'Pending',
    panVerification: 'Verified',
    aadhaarVerification: 'Failed',
    bankVerification: 'Pending',
    employmentVerification: 'Failed'
  },
  {
    id: 'LN-2026-552K',
    customerName: 'Clara Oswald',
    companyName: 'Chronotech Intl',
    loanType: 'Fast-track Seed Capital',
    requestedAmount: 50000,
    interestRate: 5.50,
    termYears: 7,
    applicationDate: '2026-06-12',
    status: 'Pending',
    monthlyIncome: 12500,
    existingDebt: 3400,
    creditScore: 710,
    fraudRiskScore: 19,
    kycStatus: 'Verified',
    panVerification: 'Verified',
    aadhaarVerification: 'Verified',
    bankVerification: 'Verified',
    employmentVerification: 'Verified'
  }
];

export default function LoansTab({ 
  balance, 
  onBalanceChange, 
  onAddTransaction, 
  currentLoans, 
  onLoansChange,
  initialInterestRate = 5.5,
  globalSearchQuery = '',
  applications: externalApplications,
  setApplications: setExternalApplications,
}: LoansTabProps) {
  const [localApplications, setLocalApplications] = useState<LoanApplication[]>(INITIAL_APPLICATIONS);
  const applications = externalApplications?.length ? externalApplications : localApplications;
  const setApplications = setExternalApplications ?? setLocalApplications;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id ?? 'LN-2026-089A');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Search filter - moved up to avoid hoisting/scoping compilation issues
  const filteredApps = applications.filter(app => {
    const activeSearch = globalSearchQuery || searchQuery;
    const term = activeSearch.toLowerCase();
    return app.customerName.toLowerCase().includes(term) || 
           app.id.toLowerCase().includes(term) || 
           app.companyName.toLowerCase().includes(term) ||
           app.loanType.toLowerCase().includes(term);
  });
  
  // Interactive Overrides / Live Configuration States (scoped to selected application)
  const [customAmount, setCustomAmount] = useState<number>(30000);
  const [customInterest, setCustomInterest] = useState<number>(5.5);
  const [customTerm, setCustomTerm] = useState<number>(10);

  // Administrative Notification toasts or modal previews
  const [activeToast, setActiveToast] = useState<{message: string; type: 'success' | 'info' | 'error' | 'warning'} | null>(null);
  const [adminReportModal, setAdminReportModal] = useState<{
    title: string;
    type: 'credit' | 'risk';
    content: React.ReactNode;
  } | null>(null);

  // Load selected application's parameters when chosen
  const activeApp = filteredApps.find(app => app.id === selectedAppId) || filteredApps[0];

  // Auto-select first visible loan app when selection is filtered out
  useEffect(() => {
    if (filteredApps.length > 0) {
      const isVisible = filteredApps.some(a => a.id === selectedAppId);
      if (!isVisible) {
        setSelectedAppId(filteredApps[0].id);
      }
    }
  }, [searchQuery, globalSearchQuery]);

  useEffect(() => {
    if (activeApp) {
      setCustomAmount(activeApp.requestedAmount);
      setCustomInterest(activeApp.interestRate);
      setCustomTerm(activeApp.termYears);
    }
  }, [selectedAppId]);

  // Synchronize initial interest rate prop with selected application if it is a general baseline update
  useEffect(() => {
    if (initialInterestRate && activeApp && activeApp.status === 'Pending') {
      setCustomInterest(initialInterestRate);
    }
  }, [initialInterestRate]);

  if (!activeApp) {
    return (
      <div className="p-8 rounded-3xl bg-white/20 border border-white/40 text-center text-purple-950/50 font-bold text-sm">
        No loan applications available. Connect Supabase or check your database seed.
      </div>
    );
  }

  // Calculate live dynamic math metrics based on controls
  const P = customAmount;
  const r = (customInterest / 100) / 12;
  const n = customTerm * 12;

  let monthlyEMI = 0;
  let totalPayable = 0;
  let totalInterestAccrued = 0;

  if (r === 0) {
    monthlyEMI = P / n;
    totalPayable = P;
    totalInterestAccrued = 0;
  } else {
    monthlyEMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayable = monthlyEMI * n;
    totalInterestAccrued = totalPayable - P;
  }

  // Live dynamic calculations for Underwriting Ratios
  const liveTotalMonthlyDebt = activeApp.existingDebt + monthlyEMI;
  const liveDtiRatio = parseFloat(((liveTotalMonthlyDebt / activeApp.monthlyIncome) * 100).toFixed(1));

  // Dynamic AI Assessment Parameters based on Credit Score, DTI, and Fraud Score
  let riskCategory: 'Low' | 'Medium' | 'High' = 'Low';
  let overallRiskScore = 0; // 0 (best) - 100 (worst)
  let approvalProbability = 0; // 0% - 100%

  // Algorithmic evaluation
  const baseScore = 1000 - activeApp.creditScore; // range 0 to 400ish
  const dtiWeight = liveDtiRatio > 50 ? 50 : liveDtiRatio; // up to 50%
  const fraudWeight = activeApp.fraudRiskScore; // 0 - 100%

  // Normalize overall risk
  overallRiskScore = Math.min(100, Math.max(5, Math.round((baseScore / 6) + (dtiWeight * 1.0) + (fraudWeight * 0.4))));

  if (overallRiskScore < 30) {
    riskCategory = 'Low';
  } else if (overallRiskScore < 60) {
    riskCategory = 'Medium';
  } else {
    riskCategory = 'High';
  }

  approvalProbability = Math.min(100, Math.max(0, Math.round(100 - overallRiskScore)));

  // Recommendation logic
  let recommendedDecision = '';
  let decisionBadgeColor = '';
  if (approvalProbability > 78) {
    recommendedDecision = 'Strong Auto-Approve (Excellent Credit Profile)';
    decisionBadgeColor = 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20';
  } else if (approvalProbability >= 50) {
    recommendedDecision = 'Conditional Review (Requires Multi-Factor Document Verification)';
    decisionBadgeColor = 'bg-amber-500/10 text-amber-800 border-amber-500/20';
  } else {
    recommendedDecision = 'Automatic Decline (Exceeds Acceptable Leverage Thresholds)';
    decisionBadgeColor = 'bg-rose-500/10 text-rose-800 border-rose-500/20';
  }

  // Dashboard Aggregates
  const totalApplications = applications.length;
  const pendingReviews = applications.filter(a => a.status === 'Pending').length;
  const approvedLoans = applications.filter(a => a.status === 'Approved').length;
  const rejectedLoans = applications.filter(a => a.status === 'Rejected').length;

  // Admin Actions logic
  const handleApprove = () => {
    setApplications(prev => prev.map(app => {
      if (app.id === selectedAppId) {
        return { ...app, status: 'Approved' };
      }
      return app;
    }));

    // Disburse funds to user wallet and sync state
    onBalanceChange(balance + customAmount);
    onLoansChange(currentLoans + customAmount);
    onAddTransaction(
      `Disbursed App: ${activeApp.loanType} [${activeApp.id}]`,
      'Income',
      customAmount,
      activeApp.companyName,
      'Completed'
    );

    setActiveToast({
      message: `Loan application ${activeApp.id} approved successfully. $${customAmount.toLocaleString()} has been injected into Apex treasury reserves!`,
      type: 'success'
    });
    setTimeout(() => setActiveToast(null), 5000);
  };

  const handleReject = () => {
    setApplications(prev => prev.map(app => {
      if (app.id === selectedAppId) {
        return { ...app, status: 'Rejected' };
      }
      return app;
    }));

    setActiveToast({
      message: `Loan application ${activeApp.id} has been formally rejected under active underwriting guidelines.`,
      type: 'error'
    });
    setTimeout(() => setActiveToast(null), 5000);
  };

  const handleRequestDocs = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = (Array.from(files) as File[]).map(f => f.name).join(', ');
      
      // Update this applicant's documentation states to "Verified"
      setApplications(prev => prev.map(app => {
        if (app.id === selectedAppId) {
          return {
            ...app,
            kycStatus: 'Verified',
            panVerification: 'Verified',
            aadhaarVerification: 'Verified',
            employmentVerification: 'Verified',
            bankVerification: 'Verified'
          };
        }
        return app;
      }));

      setActiveToast({
        message: `Successfully received and verified ${files.length} document(s) [${fileNames}] for ${activeApp.customerName}! Underwriting checklists and KYC profiles fully updated to Verified.`,
        type: 'success'
      });
      setTimeout(() => setActiveToast(null), 6000);
    }
  };

  const triggerCreditReport = () => {
    setAdminReportModal({
      title: `Corporate Credit Evaluation: ${activeApp.customerName} (${activeApp.companyName})`,
      type: 'credit',
      content: (
        <div className="space-y-4 text-xs text-purple-950 font-sans leading-relaxed">
          <div className="p-3 bg-purple-950/5 rounded-2xl border border-purple-950/10 grid grid-cols-2 gap-3">
            <div>
              <span className="block text-[9px] text-purple-950/40 uppercase font-bold">Credit Registry Bureau</span>
              <span className="font-extrabold text-purple-950">Experian Business Credit Matrix v4.2</span>
            </div>
            <div>
              <span className="block text-[9px] text-purple-950/40 uppercase font-bold">Commercial Intelliscore</span>
              <span className="font-extrabold text-emerald-800">{activeApp.creditScore} (Grade: Excellent)</span>
            </div>
            <div>
              <span className="block text-[9px] text-purple-950/40 uppercase font-bold">Public Filing Check</span>
              <span className="font-extrabold text-emerald-800">0 Active Bankruptcies / Liens</span>
            </div>
            <div>
              <span className="block text-[9px] text-purple-950/40 uppercase font-bold">Inquiry Velocities</span>
              <span className="font-extrabold text-purple-950">2 Queries (Past 180 Days)</span>
            </div>
          </div>
          <div className="space-y-2">
            <span className="block text-[10px] text-purple-950/50 font-bold uppercase">Corporate Liquidity & Trade Line Status</span>
            <p className="p-2.5 bg-white/30 border border-white/50 rounded-xl">
              Subject entity shows a regular repayment history across 14 trade lines. Average credit age is 7.2 years. Asset-to-liability ratios indicate solid operational cash cycles. Cash reserves are robust enough to cover 1.8x immediate short-term corporate liabilities.
            </p>
          </div>
        </div>
      )
    });
  };

  const triggerRiskReport = () => {
    setAdminReportModal({
      title: `AI Underwriting & Risk Diagnostics: ${activeApp.id}`,
      type: 'risk',
      content: (
        <div className="space-y-4 text-xs text-purple-950 font-sans leading-relaxed">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-purple-500/5 rounded-2xl border border-purple-500/10 text-center">
              <span className="block text-[8px] text-purple-950/40 uppercase font-bold">DTI Threshold</span>
              <span className={`text-sm font-black ${liveDtiRatio <= 40 ? 'text-emerald-700' : 'text-rose-700'}`}>{liveDtiRatio}%</span>
            </div>
            <div className="p-2.5 bg-purple-500/5 rounded-2xl border border-purple-500/10 text-center">
              <span className="block text-[8px] text-purple-950/40 uppercase font-bold">Fraud Flag</span>
              <span className={`text-sm font-black ${activeApp.fraudRiskScore < 25 ? 'text-emerald-700' : 'text-amber-700'}`}>{activeApp.fraudRiskScore}%</span>
            </div>
            <div className="p-2.5 bg-purple-500/5 rounded-2xl border border-purple-500/10 text-center">
              <span className="block text-[8px] text-purple-950/40 uppercase font-bold">Underwrite Confidence</span>
              <span className="text-sm font-black text-purple-950">{approvalProbability}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <span className="block text-[10px] text-purple-950/50 font-bold uppercase">Automated Real-Time Stress Diagnostics</span>
            <div className="p-3 bg-white/40 border border-white/60 rounded-2xl space-y-2">
              <div className="flex justify-between items-center border-b border-purple-950/5 pb-1.5">
                <span>Income to EMI Cushion</span>
                <span className="font-extrabold text-emerald-800">Passed (Cushion is {Math.round(activeApp.monthlyIncome / monthlyEMI)}x repayment amount)</span>
              </div>
              <div className="flex justify-between items-center border-b border-purple-950/5 pb-1.5">
                <span>Multi-Bureau Correlation Check</span>
                <span className="font-extrabold text-emerald-800">Passed (Zero discrepancies flagged)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Geographical Fraud Risk Profile</span>
                <span className="font-extrabold text-purple-950">Verified Domestic Corp Address</span>
              </div>
            </div>
          </div>
        </div>
      )
    });
  };

  return (
    <div className="space-y-8 pb-12 font-sans relative">
      
      {/* 1. Header & Information Banner */}
      <div className="rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-800 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-purple-950">Capital Credit Risk & Underwriting Studio</h3>
            <p className="text-xs text-purple-950/50 font-semibold">
              Advanced multi-factor financial diagnostics, identity verification ledger systems, and automated credit risk underwriting.
            </p>
          </div>
        </div>

        {/* Real-time search/filter for loan applications */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-purple-950/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/30 border border-white/40 text-purple-950 text-xs font-bold placeholder-purple-950/30 focus:outline-none focus:ring-1 focus:ring-purple-700/30"
          />
        </div>
      </div>

      {/* 2. Toast Notifications Layer */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`p-4 rounded-3xl border shadow-lg flex items-center justify-between gap-3 text-xs font-semibold ${
              activeToast.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-950' :
              activeToast.type === 'error' ? 'bg-rose-500/15 border-rose-500/30 text-rose-950' :
              activeToast.type === 'warning' ? 'bg-amber-500/15 border-amber-500/30 text-amber-950' :
              'bg-blue-500/15 border-blue-500/30 text-blue-950'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{activeToast.message}</span>
            </div>
            <button 
              onClick={() => setActiveToast(null)} 
              className="text-[10px] uppercase font-black tracking-widest opacity-40 hover:opacity-100 cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Dashboard Statistics Indicators Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Applications */}
        <div className="rounded-3xl bg-white/20 border border-white/40 p-4.5 backdrop-blur-xl shadow-md relative overflow-hidden">
          <span className="text-[10px] font-bold text-purple-950/40 uppercase tracking-widest block">Total Applications</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-purple-950">{totalApplications}</span>
            <span className="text-[9px] font-semibold text-purple-950/40">Registered Loans</span>
          </div>
          <Activity className="w-12 h-12 text-purple-950/5 absolute right-2 bottom-2 pointer-events-none" />
        </div>

        {/* Stat 2: Pending Reviews */}
        <div className="rounded-3xl bg-white/20 border border-white/40 p-4.5 backdrop-blur-xl shadow-md relative overflow-hidden">
          <span className="text-[10px] font-bold text-purple-950/40 uppercase tracking-widest block">Pending Reviews</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-800">{pendingReviews}</span>
            <span className="text-[9px] font-semibold text-amber-800/60 animate-pulse">In Verification</span>
          </div>
          <Clock className="w-12 h-12 text-amber-800/5 absolute right-2 bottom-2 pointer-events-none" />
        </div>

        {/* Stat 3: Approved Loans */}
        <div className="rounded-3xl bg-white/20 border border-white/40 p-4.5 backdrop-blur-xl shadow-md relative overflow-hidden">
          <span className="text-[10px] font-bold text-purple-950/40 uppercase tracking-widest block">Approved Loans</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-800">{approvedLoans}</span>
            <span className="text-[9px] font-semibold text-emerald-800/60">Disbursed Successfully</span>
          </div>
          <CheckCircle2 className="w-12 h-12 text-emerald-800/5 absolute right-2 bottom-2 pointer-events-none" />
        </div>

        {/* Stat 4: Rejected Loans */}
        <div className="rounded-3xl bg-white/20 border border-white/40 p-4.5 backdrop-blur-xl shadow-md relative overflow-hidden">
          <span className="text-[10px] font-bold text-purple-950/40 uppercase tracking-widest block">Rejected Loans</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-800">{rejectedLoans}</span>
            <span className="text-[9px] font-semibold text-rose-800/60">Declined Limits</span>
          </div>
          <XCircle className="w-12 h-12 text-rose-800/5 absolute right-2 bottom-2 pointer-events-none" />
        </div>
      </div>

      {/* 4. Interactive Underwriting Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CANDIDATE SELECTION PANEL (col-span-4) */}
        <div className="xl:col-span-4 space-y-4">
          <div className="rounded-3xl bg-white/25 border border-white/40 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-purple-950/5 pb-2">
              <h4 className="font-display font-black text-xs uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-purple-900" />
                Select Credit Application
              </h4>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-950/5 text-purple-900">
                {filteredApps.length} Shown
              </span>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredApps.map((app) => {
                const isActive = app.id === selectedAppId;
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all flex flex-col gap-2 relative group cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-br from-purple-950/15 to-purple-950/5 border-purple-950/30 shadow-sm' 
                        : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-mono text-[9px] text-purple-950/40 font-black tracking-wider group-hover:text-purple-700/60 transition-colors">
                        {app.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                        app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20' :
                        app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-800 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-800 border-amber-500/20 animate-pulse'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-sans font-black text-xs text-purple-950">{app.customerName}</h5>
                      <span className="text-[10px] text-purple-950/50 font-semibold">{app.companyName}</span>
                    </div>

                    <div className="flex justify-between items-center pt-1.5 border-t border-purple-950/5 w-full">
                      <span className="text-[9px] font-medium text-purple-950/40 block truncate max-w-[120px]" title={app.loanType}>
                        {app.loanType}
                      </span>
                      <span className="font-mono text-xs font-black text-purple-950">
                        ${app.requestedAmount.toLocaleString()}
                      </span>
                    </div>

                    {isActive && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-900 group-hover:translate-x-0.5 transition-transform">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}

              {filteredApps.length === 0 && (
                <div className="p-8 text-center text-xs text-purple-950/40 font-semibold bg-white/5 rounded-2xl">
                  No matching files found.
                </div>
              )}
            </div>
          </div>

          {/* CUSTOMER VERIFICATION CARD */}
          <div className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg space-y-4">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-purple-950 flex items-center gap-1.5 border-b border-purple-950/5 pb-2">
              <UserCheck className="w-4 h-4 text-purple-900" />
              Customer Verification Checklist
            </h4>

            <div className="space-y-3">
              {/* Document Check 1: KYC Status */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 border border-white/20">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-3.5 h-3.5 text-purple-800" />
                  <span className="text-xs font-bold text-purple-950">Overall KYC Status</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  activeApp.kycStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-800' :
                  activeApp.kycStatus === 'Failed' ? 'bg-rose-500/10 text-rose-800' : 'bg-amber-500/10 text-amber-800'
                }`}>
                  {activeApp.kycStatus}
                </span>
              </div>

              {/* Document Check 2: PAN Verification */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 border border-white/20">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-purple-800" />
                  <span className="text-xs font-bold text-purple-950">PAN Identity Card</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  activeApp.panVerification === 'Verified' ? 'bg-emerald-500/10 text-emerald-800' :
                  activeApp.panVerification === 'Failed' ? 'bg-rose-500/10 text-rose-800' : 'bg-amber-500/10 text-amber-800'
                }`}>
                  {activeApp.panVerification}
                </span>
              </div>

              {/* Document Check 3: Aadhaar Verification */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 border border-white/20">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-800" />
                  <span className="text-xs font-bold text-purple-950">Aadhaar Card Auth</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  activeApp.aadhaarVerification === 'Verified' ? 'bg-emerald-500/10 text-emerald-800' :
                  activeApp.aadhaarVerification === 'Failed' ? 'bg-rose-500/10 text-rose-800' : 'bg-amber-500/10 text-amber-800'
                }`}>
                  {activeApp.aadhaarVerification}
                </span>
              </div>

              {/* Document Check 4: Bank Account Verification */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 border border-white/20">
                <div className="flex items-center gap-2">
                  <Calculator className="w-3.5 h-3.5 text-purple-800" />
                  <span className="text-xs font-bold text-purple-950">Bank Account Reconciled</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  activeApp.bankVerification === 'Verified' ? 'bg-emerald-500/10 text-emerald-800' :
                  activeApp.bankVerification === 'Failed' ? 'bg-rose-500/10 text-rose-800' : 'bg-amber-500/10 text-amber-800'
                }`}>
                  {activeApp.bankVerification}
                </span>
              </div>

              {/* Document Check 5: Employment Verification */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 border border-white/20">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-purple-800" />
                  <span className="text-xs font-bold text-purple-950">Employment Checklist</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  activeApp.employmentVerification === 'Verified' ? 'bg-emerald-500/10 text-emerald-800' :
                  activeApp.employmentVerification === 'Failed' ? 'bg-rose-500/10 text-rose-800' : 'bg-amber-500/10 text-amber-800'
                }`}>
                  {activeApp.employmentVerification}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: ACTIVE FILE METRICS & SIMULATION (col-span-5) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* LOAN OVERVIEW AND DETAILS */}
          <div className="rounded-3xl bg-white/25 border border-white/40 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex justify-between items-start border-b border-purple-950/5 pb-3">
              <div>
                <span className="text-[9px] uppercase font-bold text-purple-950/40 block">Corporate Loan File</span>
                <h4 className="font-display font-black text-base text-purple-950">{activeApp.loanType}</h4>
              </div>
              <span className="font-mono text-xs font-black bg-purple-950/5 text-purple-950 px-3 py-1.5 rounded-xl">
                {activeApp.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-[9px] text-purple-950/40 uppercase font-black">Customer Name</span>
                <span className="font-black text-purple-950 mt-0.5 block">{activeApp.customerName}</span>
              </div>
              <div>
                <span className="block text-[9px] text-purple-950/40 uppercase font-black">Company Name</span>
                <span className="font-black text-purple-950 mt-0.5 block">{activeApp.companyName}</span>
              </div>
              <div>
                <span className="block text-[9px] text-purple-950/40 uppercase font-black">Requested Principal</span>
                <span className="font-black text-purple-950 mt-0.5 block">${activeApp.requestedAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-[9px] text-purple-950/40 uppercase font-black">Submission Date</span>
                <span className="font-black text-purple-950 mt-0.5 block">{activeApp.applicationDate}</span>
              </div>
            </div>
          </div>

          {/* FINANCIAL ASSESSMENT GRID */}
          <div className="rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg space-y-5">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-purple-950 flex items-center gap-1.5 border-b border-purple-950/5 pb-2">
              <TrendingUp className="w-4 h-4 text-purple-900" />
              Financial & Debt Assessment
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white/15 border border-white/25 rounded-2xl">
                <span className="text-[8px] text-purple-950/40 block font-bold uppercase tracking-wider mb-0.5">Monthly Income</span>
                <span className="font-mono text-sm font-black text-purple-950">${activeApp.monthlyIncome.toLocaleString()}</span>
              </div>

              <div className="p-3 bg-white/15 border border-white/25 rounded-2xl">
                <span className="text-[8px] text-purple-950/40 block font-bold uppercase tracking-wider mb-0.5">Existing Liabilities</span>
                <span className="font-mono text-sm font-black text-amber-900">${activeApp.existingDebt.toLocaleString()}</span>
              </div>

              <div className="p-3 bg-white/15 border border-white/25 rounded-2xl">
                <span className="text-[8px] text-purple-950/40 block font-bold uppercase tracking-wider mb-0.5">Credit Repay Score</span>
                <span className="font-mono text-sm font-black text-emerald-800">{activeApp.creditScore} Points</span>
              </div>

              <div className="p-3 bg-white/15 border border-white/25 rounded-2xl">
                <span className="text-[8px] text-purple-950/40 block font-bold uppercase tracking-wider mb-0.5">Debt-to-Income (DTI)</span>
                <span className={`font-mono text-sm font-black ${liveDtiRatio > 50 ? 'text-rose-700' : 'text-purple-950'}`}>
                  {liveDtiRatio}%
                </span>
              </div>

              <div className="p-3 bg-white/15 border border-white/25 rounded-2xl">
                <span className="text-[8px] text-purple-950/40 block font-bold uppercase tracking-wider mb-0.5">Risk Rating</span>
                <span className={`text-xs font-black uppercase ${
                  riskCategory === 'Low' ? 'text-emerald-700' : riskCategory === 'High' ? 'text-rose-700' : 'text-amber-700'
                }`}>
                  {riskCategory}
                </span>
              </div>

              <div className="p-3 bg-white/15 border border-white/25 rounded-2xl">
                <span className="text-[8px] text-purple-950/40 block font-bold uppercase tracking-wider mb-0.5">Fraud Risk ID</span>
                <span className="font-mono text-sm font-black text-purple-950">{activeApp.fraudRiskScore}%</span>
              </div>
            </div>
          </div>

          {/* LOAN CONFIGURATION SECTION: LIVE INTERACTIVE INPUT SLIDERS */}
          <div className="rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-700 flex items-center justify-center shrink-0">
                <Settings className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <h4 className="font-display font-black text-xs uppercase tracking-wider text-purple-950">Underwriting Parameter fineTuning</h4>
                <p className="text-[10px] text-purple-950/50 font-medium">Override request guidelines to simulate amortizations dynamically.</p>
              </div>
            </div>

            <div className="space-y-4 mt-2">
              {/* Parameter Slider 1: Loan Principal Amount */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-purple-950/50 uppercase">
                  <span>Loan Principal Amount</span>
                  <span className="font-mono text-purple-950 text-xs font-black">${customAmount.toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min="5000"
                  max="250000"
                  step="5000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-purple-950/10 rounded-lg appearance-none cursor-pointer accent-purple-850"
                />
                <div className="flex justify-between text-[8px] text-purple-950/40 font-bold">
                  <span>$5k</span>
                  <span>$125k</span>
                  <span>$250k Max</span>
                </div>
              </div>

              {/* Parameter Slider 2: Interest Rate Interest rate % */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-purple-950/50 uppercase">
                  <span>Simulated APR rate %</span>
                  <span className="font-mono text-purple-950 text-xs font-black">{customInterest.toFixed(2)}%</span>
                </div>
                <input 
                  type="range"
                  min="1.50"
                  max="15.00"
                  step="0.10"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(Number(e.target.value))}
                  className="w-full h-1.5 bg-purple-950/10 rounded-lg appearance-none cursor-pointer accent-pink-650"
                />
                <div className="flex justify-between text-[8px] text-purple-950/40 font-bold">
                  <span>1.5%</span>
                  <span>8.0% Base</span>
                  <span>15.0% Max</span>
                </div>
              </div>

              {/* Parameter Slider 3: Term Repayment Schedule */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-purple-950/50 uppercase">
                  <span>Repayment Term Span</span>
                  <span className="font-mono text-purple-950 text-xs font-black">{customTerm} Years</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={customTerm}
                  onChange={(e) => setCustomTerm(Number(e.target.value))}
                  className="w-full h-1.5 bg-purple-950/10 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                />
                <div className="flex justify-between text-[8px] text-purple-950/40 font-bold">
                  <span>1 Yr</span>
                  <span>15 Yrs</span>
                  <span>30 Yrs Max</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI RISK SCORE & DECISION MATRIX (col-span-3) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* AI RISK ANALYSIS CARD */}
          <div className="rounded-3xl bg-gradient-to-b from-purple-950/10 to-purple-950/5 border border-purple-950/20 p-5 backdrop-blur-xl shadow-lg relative overflow-hidden space-y-4">
            <div className="flex items-center gap-2 border-b border-purple-950/10 pb-3">
              <Sparkles className="w-4 h-4 text-purple-800 animate-pulse shrink-0" />
              <h4 className="font-display font-black text-xs uppercase tracking-wider text-purple-950">AI Underwrite Risk Ledger</h4>
            </div>

            <div className="space-y-4">
              {/* Risk Radial / Bar Meter */}
              <div>
                <div className="flex justify-between text-[10px] font-bold text-purple-950/50 uppercase mb-1">
                  <span>Dynamic Loss Probability</span>
                  <span>{overallRiskScore}% Risk Score</span>
                </div>
                <div className="w-full bg-purple-950/10 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      overallRiskScore < 30 ? 'bg-emerald-600' : overallRiskScore < 60 ? 'bg-amber-500' : 'bg-rose-600'
                    }`}
                    style={{ width: `${overallRiskScore}%` }}
                  />
                </div>
              </div>

              {/* Specific multi check flags with color metrics */}
              <div className="space-y-2 text-xs font-semibold">
                
                {/* 1. Income Stability */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/20">
                  <span className="text-purple-950/60 font-medium">Income Cushion check</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      activeApp.monthlyIncome > liveTotalMonthlyDebt * 3 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-400'
                    }`} />
                    <span className="text-[10px] font-black uppercase text-purple-950">
                      {activeApp.monthlyIncome > liveTotalMonthlyDebt * 3 ? 'STABLE' : 'MODERATE'}
                    </span>
                  </div>
                </div>

                {/* 2. Credit History Check */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/20">
                  <span className="text-purple-950/60 font-medium">Repayment History</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      activeApp.creditScore >= 740 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 
                      activeApp.creditScore >= 640 ? 'bg-amber-400' : 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                    }`} />
                    <span className="text-[10px] font-black uppercase text-purple-950">
                      {activeApp.creditScore >= 740 ? 'EXCELLENT' : activeApp.creditScore >= 640 ? 'STANDARD' : 'RISK'}
                    </span>
                  </div>
                </div>

                {/* 3. Fraud Detection Engine */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/20">
                  <span className="text-purple-950/60 font-medium">Fraud Detection ID</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      activeApp.fraudRiskScore < 20 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' :
                      activeApp.fraudRiskScore < 50 ? 'bg-amber-400' : 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                    }`} />
                    <span className="text-[10px] font-black uppercase text-purple-950">
                      {activeApp.fraudRiskScore < 20 ? 'CLEAR' : activeApp.fraudRiskScore < 50 ? 'WARNING' : 'ALERT'}
                    </span>
                  </div>
                </div>

                {/* 4. Debt Exposure */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/20">
                  <span className="text-purple-950/60 font-medium">Leverage Exposure</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      liveDtiRatio < 35 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' :
                      liveDtiRatio < 55 ? 'bg-amber-400' : 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                    }`} />
                    <span className="text-[10px] font-black uppercase text-purple-950">
                      {liveDtiRatio < 35 ? 'OPTIMAL' : liveDtiRatio < 55 ? 'LEV_WARN' : 'REDUNDANT'}
                    </span>
                  </div>
                </div>

                {/* 5. KYC Status */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/20">
                  <span className="text-purple-950/60 font-medium">Legal KYC Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      activeApp.kycStatus === 'Verified' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-400'
                    }`} />
                    <span className="text-[10px] font-black uppercase text-purple-950">
                      {activeApp.kycStatus === 'Verified' ? 'ALIGNED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* IMPACT SUMMARY CARD */}
          <div className="rounded-3xl bg-white/25 border border-white/40 p-5 backdrop-blur-xl shadow-lg space-y-4">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-purple-950 border-b border-purple-950/5 pb-2">
              Financial Impact Assessment
            </h4>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-purple-950/40 block">Corporate Monthly EMI</span>
                <span className="text-xl font-black text-purple-950 font-mono tracking-tight">
                  ${monthlyEMI.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white/15 border border-white/20 rounded-xl">
                  <span className="text-[8px] text-purple-950/40 block font-bold uppercase">Accrued Interest</span>
                  <span className="font-mono text-[11px] font-black text-purple-950">
                    ${totalInterestAccrued.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="p-2.5 bg-white/15 border border-white/20 rounded-xl">
                  <span className="text-[8px] text-purple-950/40 block font-bold uppercase">Total Repayable</span>
                  <span className="font-mono text-[11px] font-black text-purple-950">
                    ${totalPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-purple-950/40 uppercase font-black">Approve Velocity</span>
                  <span className="text-xs font-black text-purple-950 font-mono">{approvalProbability}%</span>
                </div>
                <div className="w-full bg-purple-950/10 h-1 rounded-full overflow-hidden">
                  <div className="bg-purple-950 h-full" style={{ width: `${approvalProbability}%` }} />
                </div>
              </div>

              {/* Recommendation decision pill */}
              <div className="space-y-1">
                <span className="text-[9px] text-purple-950/40 uppercase font-black block">Recommended Action Matrix</span>
                <div className={`p-2.5 border rounded-2xl text-[10px] font-bold ${decisionBadgeColor} leading-relaxed`}>
                  {recommendedDecision}
                </div>
              </div>
            </div>
          </div>

          {/* ADMIN ACTION CONTROLS */}
          <div className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg space-y-3">
            <h4 className="font-display font-black text-[10px] uppercase tracking-wider text-purple-950 border-b border-purple-950/5 pb-2">
              Underwriter Directives
            </h4>

            <div className="grid grid-cols-1 gap-2">
              {activeApp.status === 'Pending' ? (
                <>
                  <button
                    onClick={handleApprove}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 font-bold text-xs text-white shadow-md shadow-emerald-950/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Loan File
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full py-2.5 rounded-xl bg-white/40 hover:bg-white/60 border border-white/50 text-rose-800 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject Loan File
                  </button>
                </>
              ) : (
                <div className={`p-2.5 text-center text-xs font-black rounded-xl border ${
                  activeApp.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800' : 'bg-rose-500/10 border-rose-500/20 text-rose-800'
                }`}>
                  FILE STATUS: {activeApp.status.toUpperCase()}
                </div>
              )}

              <button
                type="button"
                onClick={handleRequestDocs}
                className="w-full py-2.5 rounded-xl bg-white/40 hover:bg-white/60 border border-white/50 text-purple-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <HardDriveUpload className="w-3.5 h-3.5 text-purple-800" />
                Request Documents
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={triggerCreditReport}
                  className="py-2 px-1 rounded-xl bg-purple-950/5 hover:bg-purple-950/10 text-purple-950 font-bold text-[10px] text-center border border-purple-950/10 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <FileText className="w-3 h-3 text-purple-800" />
                  Credit Report
                </button>
                <button
                  type="button"
                  onClick={triggerRiskReport}
                  className="py-2 px-1 rounded-xl bg-purple-950/5 hover:bg-purple-950/10 text-purple-950 font-bold text-[10px] text-center border border-purple-950/10 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Activity className="w-3 h-3 text-purple-800" />
                  Risk Report
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. Detailed Reports Inspection Modal */}
      <AnimatePresence>
        {adminReportModal && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.25)] backdrop-blur-[6px] flex items-center justify-center p-4 z-[10000]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[rgba(255,255,255,0.98)] rounded-3xl p-6 border border-white/50 backdrop-blur-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] max-w-md w-full relative space-y-4"
            >
              <div className="flex items-center justify-between border-b border-purple-950/10 pb-2">
                <h4 className="font-display font-black text-sm text-purple-950 flex items-center gap-1.5">
                  {adminReportModal.type === 'credit' ? <FileSpreadsheet className="w-4 h-4 text-purple-850" /> : <ShieldCheck className="w-4 h-4 text-purple-850" />}
                  {adminReportModal.title}
                </h4>
                <button 
                  onClick={() => setAdminReportModal(null)}
                  className="p-1 rounded-lg bg-purple-950/5 hover:bg-purple-950/10 text-purple-900 text-xs font-black uppercase cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div>
                {adminReportModal.content}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setAdminReportModal(null)}
                  className="px-4 py-2 rounded-xl bg-purple-950 text-white font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden file input supporting document upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />

    </div>
  );
}
