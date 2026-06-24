import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gauge, 
  CreditCard, 
  Sparkles, 
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Bell,
  Check,
  X,
  FileText,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  Fingerprint,
  Info,
  Building,
  Landmark,
  Wallet,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface CustomersTabProps {
  balance: number;
  onBalanceChange: (amt: number) => void;
  currentLoans: number;
  onLoansChange: (amt: number) => void;
  onAddTransaction: (
    name: string,
    type: 'Income' | 'Expense',
    amount: number,
    recipient: string,
    status: 'Completed' | 'Pending' | 'Failed'
  ) => void;
  searchQuery?: string;
}

interface Customer {
  id: string;
  name: string;
  company: string;
  avatar: string;
  cardBrand: string;
  cardNumber: string;
  cardExpiry: string;
  bankName: string;
  bankAddress: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic: string;
  accountType: string;
  availableBalance: number;
  currentLoans: number;
  creditLimit: number;
  passportId: string;
  delawareStamp: string;
  filingNumber: string;
  adminMemo: string;
  loanStatus: 'pending' | 'approved' | 'rejected';
  loanAmountRequested: number;
  businessDocAudited: boolean;
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Andrew Forbist',
    company: 'Andrew Forbist LLC',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    cardBrand: 'Apex Mastercard Platinum',
    cardNumber: '4012  8830  11d9  6317',
    cardExpiry: '08 / 32',
    bankName: 'Apex Union & Trust, N.A.',
    bankAddress: '120 Wall Street, Financial District, New York, NY',
    accountNumber: '9941129-C-490',
    routingNumber: '021000021',
    swiftBic: 'APEXUS33XXX',
    accountType: 'Corporate High-Yield Checking',
    availableBalance: 562000,
    currentLoans: 43000,
    creditLimit: 150000,
    passportId: 'UA-98441-AF',
    delawareStamp: '#883-011-1d9-6317',
    filingNumber: 'DEL-9941129-C',
    adminMemo: 'Pre-authorized by Super Admin pending proof of Delaware incorporation.',
    loanStatus: 'pending',
    loanAmountRequested: 75000,
    businessDocAudited: false,
  },
  {
    id: 'cust-2',
    name: 'Sarah Jenkins',
    company: 'Aura Design Group Inc',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    cardBrand: 'Visa Corporate Principal',
    cardNumber: '4532  9012  5422  9920',
    cardExpiry: '11 / 30',
    bankName: 'Delaware Federal Trust',
    bankAddress: '1209 North Orange St, Wilmington, DE',
    accountNumber: '1102948-D-121',
    routingNumber: '031100124',
    swiftBic: 'DEFTUS33XXX',
    accountType: 'Capital Reserve Vault Account',
    availableBalance: 420500,
    currentLoans: 0,
    creditLimit: 250000,
    passportId: 'US-22481-SJ',
    delawareStamp: '#421-984-5422-9920',
    filingNumber: 'DEL-1102948-D',
    adminMemo: 'Aura Design account in excellent standing. Target achieved, ready for facility disbursement.',
    loanStatus: 'pending',
    loanAmountRequested: 50000,
    businessDocAudited: false,
  },
  {
    id: 'cust-3',
    name: 'Marcus Vance',
    company: 'Vance Dynamics Corp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    cardBrand: 'Amex Corporate Black Card',
    cardNumber: '3782  1102  9483  1028',
    cardExpiry: '04 / 31',
    bankName: 'Manhattan Global Funding',
    bankAddress: '270 Park Avenue, Midtown Manhattan, NY',
    accountNumber: '5403912-X-880',
    routingNumber: '021102931',
    swiftBic: 'MGCHUS33XXX',
    accountType: 'Treasury Draft Liquidity Port',
    availableBalance: 985000,
    currentLoans: 85000,
    creditLimit: 500000,
    passportId: 'UA-88390-MV',
    delawareStamp: '#993-412-9483-1028',
    filingNumber: 'DEL-5403912-M',
    adminMemo: 'Vance Dynamics high-net profile with vetted assets. Recommend approving operational limit increase.',
    loanStatus: 'pending',
    loanAmountRequested: 150000,
    businessDocAudited: false,
  },
  {
    id: 'cust-4',
    name: 'Sophia Al-Thani',
    company: 'Horizon Logistics Group',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    cardBrand: 'Apex Mastercard Infinite',
    cardNumber: '5243  7721  0392  4481',
    cardExpiry: '04 / 33',
    bankName: 'Pacific Trust & Vault',
    bankAddress: '455 Market Street, San Francisco, CA',
    accountNumber: '2294103-W-912',
    routingNumber: '121000248',
    swiftBic: 'PTAVUS66XXX',
    accountType: 'Operations Operating Escrow',
    availableBalance: 143200,
    currentLoans: 12000,
    creditLimit: 100000,
    passportId: 'FR-91024-SA',
    delawareStamp: '#551-094-0392-4481',
    filingNumber: 'DEL-2294103-H',
    adminMemo: 'Horizon Logistics transit profile. Check international maritime clearing parameters.',
    loanStatus: 'pending',
    loanAmountRequested: 35000,
    businessDocAudited: false,
  }
];

export default function CustomersTab({ 
  balance, 
  onBalanceChange,
  currentLoans, 
  onLoansChange,
  onAddTransaction,
  searchQuery = ''
}: CustomersTabProps) {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [selectedId, setSelectedId] = useState<string>('cust-1');
  const [showScore, setShowScore] = useState<boolean>(false);
  const [showDocInspector, setShowDocInspector] = useState<boolean>(false);
  const [showAccNumber, setShowAccNumber] = useState<boolean>(false);
  
  // Local state for non-Andrew dynamic states to simulate audits
  const [businessDocAudited, setBusinessDocAudited] = useState<boolean>(false);
  const [loanStatus, setLoanStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [adminMemo, setAdminMemo] = useState<string>('');

  const filteredCustomers = customers.filter(cust => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      cust.name.toLowerCase().includes(q) ||
      cust.company.toLowerCase().includes(q) ||
      cust.id.toLowerCase().includes(q) ||
      cust.bankName.toLowerCase().includes(q) ||
      cust.accountNumber.toLowerCase().includes(q) ||
      cust.swiftBic.toLowerCase().includes(q)
    );
  });

  // Auto-select first visible customer when selection is filtered out
  React.useEffect(() => {
    if (filteredCustomers.length > 0) {
      const isVisible = filteredCustomers.some(c => c.id === selectedId);
      if (!isVisible) {
        setSelectedId(filteredCustomers[0].id);
      }
    }
  }, [searchQuery]);

  // Find active customer info
  const activeCust = filteredCustomers.find(c => c.id === selectedId) || filteredCustomers[0];
  const isAndrew = activeCust.id === 'cust-1';

  // Synchronize state value based on selection
  React.useEffect(() => {
    setShowAccNumber(false);
    if (isAndrew) {
      setAdminMemo(activeCust.adminMemo);
    } else {
      setAdminMemo(activeCust.adminMemo);
      setLoanStatus(activeCust.loanStatus);
      setBusinessDocAudited(activeCust.businessDocAudited);
    }
  }, [selectedId]);

  // Read current active figures
  const activeBalance = isAndrew ? balance : activeCust.availableBalance;
  const activeLoans = isAndrew ? currentLoans : activeCust.currentLoans;
  const activeLimit = activeCust.creditLimit;

  // Dynamic Score calculation
  const getDynamicScore = () => {
    const utilization = activeLimit > 0 ? (activeLoans / activeLimit) : 0;
    let base = 810;
    
    // Impact of high utilization
    if (utilization > 0.4) {
      base -= 75;
    } else if (utilization > 0.2) {
      base -= 40;
    } else if (utilization > 0.05) {
      base -= 15;
    } else if (utilization === 0) {
      base += 15;
    }

    // Impact of cash liquidity
    if (activeBalance > 600000) {
      base += 20;
    } else if (activeBalance > 400000) {
      base += 10;
    } else if (activeBalance < 100000) {
      base -= 35;
    }

    return Math.max(300, Math.min(850, base));
  };

  const dynamicScore = getDynamicScore();
  const scorePercent = (dynamicScore - 300) / 550; // percentage of 300 to 850 range

  const getScoreRating = () => {
    if (dynamicScore >= 800) return { text: 'Exceptional', color: 'text-emerald-700', bg: 'bg-emerald-500/10' };
    if (dynamicScore >= 740) return { text: 'Very Good', color: 'text-emerald-600', bg: 'bg-emerald-500/10' };
    if (dynamicScore >= 670) return { text: 'Good', color: 'text-amber-600', bg: 'bg-amber-500/10' };
    if (dynamicScore >= 580) return { text: 'Fair', color: 'text-pink-600', bg: 'bg-pink-500/10' };
    return { text: 'Poor', color: 'text-rose-700', bg: 'bg-rose-500/10' };
  };

  const scoreRating = getScoreRating();

  // Super Admin Action triggers
  const handleApproveLoan = () => {
    const currentAValue = isAndrew ? businessDocAudited : businessDocAudited;
    if (!currentAValue) {
      alert(`⚠️ Compliance Alert: You must inspect and verify the Corporate Delaware Certificate for ${activeCust.name} in the KYC document list first!`);
      return;
    }
    
    const approvalAmount = activeCust.loanAmountRequested;

    if (isAndrew) {
      setLoanStatus('approved');
      onLoansChange(currentLoans + approvalAmount);
      onBalanceChange(balance + approvalAmount);
      onAddTransaction(
        `Super Admin Order: Approved $${Math.round(approvalAmount / 1000)}K Capital Facility`,
        'Income',
        approvalAmount,
        `${activeCust.name} Corporate Ledger`,
        'Completed'
      );
    } else {
      setLoanStatus('approved');
      setCustomers(prev => prev.map(c => {
        if (c.id === activeCust.id) {
          return {
            ...c,
            loanStatus: 'approved',
            availableBalance: c.availableBalance + approvalAmount,
            currentLoans: c.currentLoans + approvalAmount,
            businessDocAudited: true
          };
        }
        return c;
      }));
      onAddTransaction(
        `Super Admin Order: Approved $${Math.round(approvalAmount / 1000)}K Capital Facility`,
        'Income',
        approvalAmount,
        `${activeCust.name} Corporate Ledger`,
        'Completed'
      );
    }
  };

  const handleRejectLoan = () => {
    const approvalAmount = activeCust.loanAmountRequested;

    if (isAndrew) {
      setLoanStatus('rejected');
      onAddTransaction(
        `Admin Flag: Declined $${Math.round(approvalAmount / 1000)}K Facility (KYC Failure)`,
        'Expense',
        0,
        `${activeCust.name} Compliance Registry`,
        'Failed'
      );
    } else {
      setLoanStatus('rejected');
      setCustomers(prev => prev.map(c => {
        if (c.id === activeCust.id) {
          return {
            ...c,
            loanStatus: 'rejected'
          };
        }
        return c;
      }));
      onAddTransaction(
        `Admin Flag: Declined $${Math.round(approvalAmount / 1000)}K Facility (KYC Failure)`,
        'Expense',
        0,
        `${activeCust.name} Compliance Registry`,
        'Failed'
      );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-white/20 border border-white/40 backdrop-blur-xl shadow-lg">
        <div>
          <h3 className="font-display font-black text-xl text-purple-950">Corporate Customer Oversight & KYC Desk</h3>
          <p className="text-xs text-purple-950/60 font-semibold leading-relaxed mt-0.5">
            Admin Workspace • Authorized agent view for credential validation, credit verification and super admin disbursement approval orders.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950 text-white text-[10px] font-black uppercase tracking-widest shrink-0">
          <Fingerprint className="w-3.5 h-3.5 text-pink-400" />
          Secured Agent Mode: Live
        </div>
      </div>

      {/* 1. INTERACTIVE CORPORATE CLIENTS DIRECTORY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {filteredCustomers.map((cust) => {
          const isActive = cust.id === selectedId;
          const isAndrewClient = cust.id === 'cust-1';
          const displayBalance = isAndrewClient ? balance : cust.availableBalance;
          
          const badgeColors = cust.id === selectedId 
            ? loanStatus === 'approved' 
              ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30' 
              : loanStatus === 'rejected'
                ? 'bg-rose-500/20 text-rose-800 border-rose-500/30'
                : 'bg-amber-500/20 text-amber-800 border-amber-500/30 font-black animate-pulse'
            : cust.loanStatus === 'approved' 
              ? 'bg-emerald-500/10 text-emerald-850 border-emerald-500/20' 
              : cust.loanStatus === 'rejected' 
                ? 'bg-rose-500/10 text-rose-850 border-rose-500/20' 
                : 'bg-amber-500/10 text-amber-850 border-amber-500/20';

          return (
            <motion.div
              type="button"
              role="button"
              key={cust.id}
              onClick={() => {
                setSelectedId(cust.id);
                setShowScore(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-3xl backdrop-blur-xl border transition-all duration-300 cursor-pointer select-none text-left ${
                isActive 
                  ? 'bg-gradient-to-br from-purple-900/15 via-pink-500/10 to-purple-800/20 border-pink-500/50 shadow-md shadow-pink-500/5' 
                  : 'bg-white/20 border-white/40 hover:bg-white/30 hover:border-white/50 shadow-sm'
              }`}
            >
              {isActive && (
                <span className="absolute -inset-px rounded-3xl border border-pink-500/30 pointer-events-none" />
              )}
              
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img 
                    src={cust.avatar} 
                    alt={cust.name} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-purple-300/30"
                  />
                  {isActive && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-pink-550 border border-white animate-pulse" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] uppercase font-black tracking-widest text-pink-700 block truncate">
                    {cust.company}
                  </span>
                  <h5 className="font-sans font-black text-xs text-purple-950 truncate max-w-[130px] leading-tight">
                    {cust.name}
                  </h5>
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-purple-950/5 flex items-center justify-between">
                <div>
                  <span className="text-[8px] text-purple-950/40 block font-bold uppercase leading-none">Vault Liquidity</span>
                  <span className="font-mono text-[10px] font-black text-purple-950 mt-1 block">
                    ${displayBalance.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${badgeColors}`}>
                    {cust.id === selectedId ? loanStatus : cust.loanStatus}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-16 text-center text-xs font-bold text-purple-950/40 bg-white/10 rounded-3xl border border-dashed border-purple-950/15">
            No customer profiles match "{searchQuery}". Try searching for details like "Andrew" or "Aura".
          </div>
        )}
      </div>

      {/* Primary layout grid (arranged elegantly from left to right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Customer Card Credentials & Speedometer (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-4">
          <div className="text-center w-full max-w-sm space-y-1">
            <h4 className="font-display font-black text-sm text-purple-950 uppercase tracking-widest">Customer Card Credentials</h4>
            <p className="text-[10px] text-purple-950/50 font-bold">
              Click the Mastercard below to trigger the FICO Speedometer check.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showScore ? (
              /* CREDIT CARD VIEW CARD */
              <motion.div
                key="credit-card"
                initial={{ opacity: 0, rotateY: -90, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 90, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                onClick={() => setShowScore(true)}
                className="relative w-full max-w-[400px] aspect-[1.586/1] rounded-3xl p-6 overflow-hidden bg-gradient-to-br from-purple-800 via-purple-900 to-pink-700 shadow-xl shadow-purple-950/30 border border-white/20 flex flex-col justify-between cursor-pointer select-none group transform hover:scale-[1.02] transition-transform duration-300 active:scale-[0.98] mr-auto ml-auto"
              >
                {/* Ambient glows behind card */}
                <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-pink-500/35 blur-3xl group-hover:bg-pink-400/40 transition-colors duration-500" />
                <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-purple-500/30 blur-3xl group-hover:bg-purple-400/35 transition-colors duration-500" />

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-pink-200/60">{activeCust.cardBrand}</p>
                    <h4 className="font-display font-black text-sm text-white tracking-wide mt-1">Corporate Client Card</h4>
                  </div>
                  
                  {/* Premium holographic chip */}
                  <div className="w-10 h-8 rounded-lg bg-gradient-to-tr from-yellow-105 via-amber-200 to-yellow-50 relative overflow-hidden border border-amber-300 flex items-center justify-center shadow-inner">
                    <div className="absolute inset-x-2 top-0 bottom-0 border-r border-amber-800/30" />
                    <div className="absolute inset-y-2 left-0 right-0 border-b border-amber-800/30" />
                    <div className="w-3.5 h-3.5 rounded-md border border-amber-800/40" />
                  </div>
                </div>

                {/* Central spacing with metallic silver accents */}
                <div className="my-1">
                  <span className="font-mono text-base text-white font-extrabold tracking-widest block text-shadow">
                    {activeCust.cardNumber}
                  </span>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/50 block">Cardholder</span>
                    <span className="font-display font-bold text-xs text-white uppercase tracking-wide">{activeCust.name}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-white/50 block">Expires</span>
                      <span className="font-mono font-black text-[11px] text-white">{activeCust.cardExpiry}</span>
                    </div>
                    
                    <div className="flex items-center -space-x-3 select-none shrink-0">
                      <div className="w-7 h-7 rounded-full bg-red-500/90 mix-blend-screen" />
                      <div className="w-7 h-7 rounded-full bg-amber-500/90 mix-blend-screen" />
                    </div>
                  </div>
                </div>

                {/* Pulsing prompt text block */}
                <div className="absolute bottom-1.5 inset-x-0 flex justify-center">
                  <span className="text-[8px] text-pink-200/70 font-black uppercase tracking-widest animate-pulse flex items-center gap-1 bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-white/5">
                    <Sparkles className="w-2 h-2 text-pink-400" /> Click to read credit score
                  </span>
                </div>
              </motion.div>
            ) : (
              /* SPEEDOMETER CREDIT SCORE SPEEDOMETER VIEW */
              <motion.div
                key="speedometer"
                initial={{ opacity: 0, rotateY: 90, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -90, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                className="w-full max-w-[400px] rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-xl shadow-purple-950/10 flex flex-col justify-between space-y-4 mr-auto ml-auto"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-800 flex items-center justify-center">
                        <Gauge className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-sm text-purple-950">FICO Score Performance</h3>
                        <p className="text-[10px] text-purple-950/50 font-semibold font-sans">Underwriting agency audit profile</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${scoreRating.bg} ${scoreRating.color}`}>
                      {scoreRating.text}
                    </span>
                  </div>
                </div>

                {/* Gauge Graphic */}
                <div className="flex flex-col items-center py-1">
                  <div className="relative w-52 h-32">
                    <svg className="w-full h-full" viewBox="0 0 200 120">
                      <defs>
                        <linearGradient id="scoreGaugeGradCust" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="50%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                      {/* Outer track */}
                      <path
                        d="M 30 100 A 70 70 0 0 1 170 100"
                        fill="none"
                        stroke="rgba(74, 4, 78, 0.08)"
                        strokeWidth="11"
                        strokeLinecap="round"
                      />
                      {/* Gauge active speed */}
                      <path
                        d="M 30 100 A 70 70 0 0 1 170 100"
                        fill="none"
                        stroke="url(#scoreGaugeGradCust)"
                        strokeWidth="11"
                        strokeLinecap="round"
                        strokeDasharray="219.9"
                        strokeDashoffset={219.9 - 219.9 * scorePercent}
                        className="transition-all duration-1000 ease-out"
                      />
                      {/* Pointer Needle */}
                      <g transform={`rotate(${180 * scorePercent - 180}, 100, 100)`}>
                        <line x1="100" y1="100" x2="45" y2="100" stroke="#4a044e" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="100" cy="100" r="5" fill="#4a044e" />
                      </g>
                    </svg>
                    
                    {/* Labels in speedometer */}
                    <div className="absolute inset-0 top-[60px] flex flex-col items-center justify-center">
                      <span className="text-3xl font-mono font-black text-purple-950 tracking-tight">{dynamicScore}</span>
                      <span className="text-[8px] text-purple-950/40 uppercase tracking-widest font-extrabold">FICO Index</span>
                    </div>
                    
                    <div className="absolute left-6 bottom-[14px] text-[9px] font-bold text-purple-950/40 font-mono">300</div>
                    <div className="absolute right-6 bottom-[14px] text-[9px] font-bold text-purple-950/40 font-mono">850</div>
                  </div>
                </div>

                {/* Metrics Checklist */}
                <div className="space-y-1.5 pt-2 border-t border-purple-950/5">
                  <h4 className="text-[9px] font-bold uppercase tracking-wider text-purple-950/50">Underwriting Merits</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-purple-950/5 rounded-xl border border-purple-950/5">
                      <span className="text-[8px] text-purple-950/40 block font-bold uppercase leading-none">On-Time Payments</span>
                      <span className="text-[10px] font-extrabold text-emerald-800 mt-1 block">100% Perfect</span>
                    </div>
                    <div className="p-2 bg-purple-950/5 rounded-xl border border-purple-950/5">
                      <span className="text-[8px] text-purple-950/40 block font-bold uppercase leading-none">Available Limit</span>
                      <span className="text-[10px] font-extrabold text-purple-950 mt-1 block">${(activeLimit - activeLoans).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Return action button with neat transition */}
                <button
                  onClick={() => setShowScore(false)}
                  className="w-full py-2 px-4 rounded-xl bg-purple-950 hover:bg-purple-900 text-white font-extrabold text-[10px] tracking-wide shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Return to Card Front
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. NEW DETAIL PANEL: BANK & ACCOUNT SPECIFICATIONS LEDGER (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="w-full h-full rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between space-y-4">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 border-b border-purple-950/5 pb-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-700 flex items-center justify-center border border-pink-500/20 shrink-0">
                  <Landmark className="w-4 h-4 text-pink-700" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-purple-950 tracking-wide uppercase">Bank & Account Details</h4>
                  <p className="text-[9px] text-purple-950/50 font-bold font-sans">Validated routing specifications ledger</p>
                </div>
              </div>

              {/* Institution spec banner */}
              <div className="mt-3 p-3 bg-white/35 rounded-2xl border border-white/50 shadow-sm space-y-1">
                <span className="text-[8px] font-black uppercase text-[#a855f7] tracking-wider block">Clearing Bank Institution</span>
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-purple-900 shrink-0" />
                  <span className="text-xs font-black text-purple-950 font-sans">{activeCust.bankName}</span>
                </div>
                <p className="text-[9px] text-purple-950/60 font-semibold">{activeCust.bankAddress}</p>
              </div>

              {/* Account Parameter Ledger grids */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                {/* Bank Name */}
                <div className="col-span-2 p-2.5 bg-white/20 rounded-2xl border border-white/30 truncate">
                  <span className="text-[8px] text-purple-950/40 block font-bold uppercase leading-none mb-1">Bank Name</span>
                  <span className="text-[11px] font-black text-purple-950 block truncate">{activeCust.bankName}</span>
                </div>

                {/* Account Number with Eye Button */}
                <div className="col-span-2 p-2.5 bg-white/20 rounded-2xl border border-white/30 flex items-center justify-between gap-2 overflow-hidden">
                  <div className="truncate">
                    <span className="text-[8px] text-purple-950/40 block font-bold uppercase leading-none mb-1">Account Number</span>
                    <span className="font-mono text-[10px] font-black text-purple-950 truncate block select-all">
                      {showAccNumber ? activeCust.accountNumber : '•••• •••• ' + activeCust.accountNumber.split('-').pop()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAccNumber(prev => !prev)}
                    className="p-1 px-1.5 rounded-lg bg-purple-950/5 hover:bg-purple-950/10 text-purple-900 transition-colors shrink-0 cursor-pointer"
                    title={showAccNumber ? "Hide Account Number" : "Show Account Number"}
                  >
                    {showAccNumber ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Account Type */}
                <div className="col-span-1 p-2.5 bg-white/20 rounded-2xl border border-white/30 truncate flex flex-col justify-between">
                  <span className="text-[8px] text-purple-950/40 block font-bold uppercase leading-none mb-1 mr-[-2px]">Account Type</span>
                  <span className="text-[9px] font-extrabold text-pink-850 leading-tight block truncate" title={activeCust.accountType}>
                    {activeCust.accountType}
                  </span>
                </div>

                {/* Transit Routing / SWIFT */}
                <div className="col-span-1 p-2.5 bg-white/20 rounded-2xl border border-white/30 truncate">
                  <span className="text-[8px] text-purple-950/40 block font-bold uppercase leading-none mb-1">Transit Routing</span>
                  <span className="font-mono text-[10px] font-black text-purple-950 select-all truncate block">{activeCust.routingNumber}</span>
                </div>

                {/* Current Balance */}
                <div className="col-span-1 p-2.5 bg-white/20 rounded-2xl border border-white/30 truncate">
                  <span className="text-[8px] text-purple-950/40 block font-bold uppercase leading-none mb-1">Current Balance</span>
                  <span className="font-mono text-[10px] font-black text-emerald-800 block">
                    ${activeBalance.toLocaleString()}
                  </span>
                </div>

                {/* Credit Limit */}
                <div className="col-span-1 p-2.5 bg-white/20 rounded-2xl border border-white/30 truncate">
                  <span className="text-[8px] text-purple-950/40 block font-bold uppercase leading-none mb-1">Credit Limit</span>
                  <span className="font-mono text-[10px] font-black text-purple-950 block">
                    ${activeCust.creditLimit.toLocaleString()}
                  </span>
                </div>

                {/* KYC Status */}
                <div className="col-span-2 p-2.5 bg-white/20 rounded-2xl border border-white/30 flex items-center justify-between gap-1 overflow-hidden">
                  <div>
                    <span className="text-[8px] text-purple-950/40 block font-bold uppercase leading-none mb-1">KYC Status</span>
                    <span className="text-[10px] font-extrabold text-purple-950 block">
                      {businessDocAudited ? 'Cleared / Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  {businessDocAudited ? (
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border shrink-0 bg-emerald-500/10 text-emerald-800 border-emerald-500/20">
                      Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDocInspector(true)}
                      className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border shrink-0 bg-amber-500 hover:bg-amber-600 text-amber-950 border-amber-500/20 cursor-pointer animate-pulse transition-all hover:scale-105 active:scale-95"
                      title="Inspect Document to Verify KYC"
                    >
                      Required
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* B. DETAILED KYC VERIFICATION DESK */}
      <div className="rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg space-y-6 w-full mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-purple-950/5 pb-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-black text-sm text-purple-950">Audit & KYC Verification Checklist</h4>
              <p className="text-[10px] text-purple-950/40 font-bold">Standard customer compliance verification board</p>
            </div>
          </div>
          
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
            businessDocAudited ? 'bg-emerald-500/10 text-emerald-800' : 'bg-amber-500/10 text-amber-800 animate-pulse'
          }`}>
            {businessDocAudited ? 'KYC Cleared' : 'Requires Manual Inspection'}
          </span>
        </div>

        {/* KYC checklist items arranged horizontally */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {/* Item 1: Passport Verification */}
          <div className="flex flex-col justify-between p-4 bg-white/30 border border-white/40 rounded-2xl min-h-[110px] gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-purple-950 block">Identity Passport / Registry</span>
                <span className="text-[10px] text-purple-950/50 font-semibold block mt-1 leading-normal">
                  Passport ID: {activeCust.passportId} • Matches {activeCust.name} biometric signature
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-lg select-none border border-emerald-500/10">
                Auto-Passed
              </span>
            </div>
          </div>

          {/* Item 2: AML Blacklist clearance */}
          <div className="flex flex-col justify-between p-4 bg-white/30 border border-white/40 rounded-2xl min-h-[110px] gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-purple-950 block">AML Database Audit</span>
                <span className="text-[10px] text-purple-950/50 font-semibold block mt-1 leading-normal">
                  No sanctions or adverse media detected across international monitoring lists
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded-lg select-none border border-emerald-500/10">
                Cleared
              </span>
            </div>
          </div>

          {/* Item 3: Credit FICO score threshold */}
          <div className="flex flex-col justify-between p-4 bg-white/30 border border-white/40 rounded-2xl min-h-[110px] gap-3">
            <div className="flex items-start gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                dynamicScore >= 700 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {dynamicScore >= 700 ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </div>
              <div>
                <span className="text-xs font-extrabold text-purple-950 block">Underwriter FICO Standard</span>
                <span className="text-[10px] text-purple-950/50 font-semibold block mt-1 leading-normal">
                  Minimum requirement: &gt; 700 points. Dynamic assessment indicator: <strong className="text-purple-950 font-black">{dynamicScore}</strong>
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg select-none border ${
                dynamicScore >= 700 
                  ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/10' 
                  : 'bg-rose-500/10 text-rose-800 border-rose-500/10'
              }`}>
                {dynamicScore >= 700 ? 'Target Achieved' : 'FICO Alert'}
              </span>
            </div>
          </div>

          {/* Item 4: Business registration audit (STATE DRIVEN TRIGGER) */}
          <div className={`flex flex-col justify-between p-4 rounded-2xl border transition-colors min-h-[110px] gap-3 ${
            businessDocAudited 
              ? 'bg-white/30 border-white/40' 
              : 'bg-amber-500/5 border-amber-500/20'
          }`}>
            <div className="flex items-start gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                businessDocAudited ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-950'
              }`}>
                {businessDocAudited ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <AlertTriangleIcon className="w-3.5 h-3.5" />
                )}
              </div>
              <div>
                <span className="text-xs font-extrabold text-purple-950 block">Delaware Incorporation Cert</span>
                <span className="text-[10px] text-purple-950/50 font-semibold block mt-1 leading-normal">
                  {businessDocAudited 
                    ? 'Delaware Incorporating Stamp verified & linked successfully.' 
                    : `Requires manual verification of registered ${activeCust.company} details.`}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowDocInspector(true)}
                className={`py-1 px-2.5 rounded-lg font-extrabold text-[9px] tracking-wide transition-all uppercase flex items-center gap-1 shrink-0 cursor-pointer ${
                  businessDocAudited 
                    ? 'bg-purple-950/5 text-purple-950 hover:bg-purple-950/10 border border-purple-950/10' 
                    : 'bg-amber-500 hover:bg-amber-600 text-amber-950 ring-2 ring-amber-400/10'
                }`}
              >
                <FileText className="w-2.5 h-2.5" />
                {businessDocAudited ? 'Inspect Again' : 'Inspect Document'}
              </button>
            </div>
          </div>

        </div>

        {/* C. ADMINISTRATIVE REQUISITION DECISION BOARD */}
        <div className="pt-5 border-t border-purple-950/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            
            {/* Memo & remarks (spans 5 cols) */}
            <div className="lg:col-span-5 space-y-1.5">
              <label className="text-[10px] font-bold text-purple-950/50 uppercase tracking-wider block">Admin Compliance Memo & Remarks</label>
              <input 
                type="text" 
                value={adminMemo}
                onChange={(e) => setAdminMemo(e.target.value)}
                disabled={loanStatus !== 'pending'}
                className="w-full px-3.5 py-2.5 bg-white/40 focus:bg-white text-xs font-semibold text-purple-950 placeholder-purple-950/30 rounded-xl border border-white/50 focus:outline-none focus:ring-1 focus:ring-purple-700 transition-all shadow-inner"
                placeholder="Enter dynamic review notes..."
              />
            </div>

            {/* Decision Actions (spans 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Reject Option */}
                <button
                  type="button"
                  onClick={handleRejectLoan}
                  disabled={loanStatus !== 'pending'}
                  className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                    loanStatus === 'rejected'
                      ? 'bg-rose-600 text-white border-transparent'
                      : loanStatus === 'approved'
                        ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed opacity-60'
                        : 'bg-white/40 text-rose-700 border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-800'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  {loanStatus === 'rejected' ? 'Application Flagged / Rejected' : 'Decline & Reject Request'}
                </button>

                {/* Approve Option */}
                <button
                  type="button"
                  onClick={handleApproveLoan}
                  disabled={loanStatus !== 'pending'}
                  className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all ${
                    loanStatus === 'approved'
                      ? 'bg-emerald-600 text-white border-transparent shadow shadow-emerald-500/20'
                      : loanStatus === 'rejected'
                        ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed opacity-60'
                        : !businessDocAudited
                          ? 'bg-purple-950/35 text-white/50 border-transparent cursor-not-allowed'
                          : 'bg-purple-950 hover:bg-purple-900 border-transparent text-white ring-2 ring-purple-500/10'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {loanStatus === 'approved' ? 'Disbursed / Authorized' : `Approve & Disburse $${(activeCust.loanAmountRequested / 1000).toFixed(0)}K`}
                </button>
              </div>

              {/* Smart guidance tip */}
              {loanStatus === 'pending' && !businessDocAudited && (
                <div className="p-2.5 rounded-xl bg-purple-950/5 border border-purple-950/5 flex items-start gap-2 text-[10px] text-purple-950/50 font-bold leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
                  <span>Compliance guideline: Manual verification of corporate status is mandatory before disbursement button unlocks.</span>
                </div>
              )}
            </div>

          </div>

          {/* Status Outcome Banner */}
          <AnimatePresence>
            {loanStatus !== 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 mt-4 ${
                  loanStatus === 'approved'
                    ? 'bg-emerald-50 border-emerald-500/20 text-emerald-950'
                    : 'bg-rose-50 border-rose-500/20 text-rose-950'
                }`}
              >
                <span className="uppercase text-[9px] font-black tracking-widest">
                  Decision Logged & Published to Ledger
                </span>
                <span className="font-semibold text-xs leading-relaxed max-w-2xl text-center font-sans text-purple-950">
                  {loanStatus === 'approved'
                    ? `✅ Success! The $${activeCust.loanAmountRequested.toLocaleString()} corporate facility has been disbursed directly to ${activeCust.name}'s account layout. Dynamic liabilities updated to $${(activeLoans + activeCust.loanAmountRequested).toLocaleString()}.`
                    : `❌ Rejected! Loan application declined. ${activeCust.name} KYC failed manually audited status parameters. Corporate registry flagged.`}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* D. INTERACTIVE COMPLIANCE DOCUMENT VIEWER MODAL */}
      <AnimatePresence>
        {showDocInspector && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.25)] backdrop-blur-[6px]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg overflow-hidden rounded-3xl bg-[rgba(255,255,255,0.98)] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-white/50 backdrop-blur-[20px]"
            >
              <div className="flex justify-between items-center border-b border-purple-950/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-900" />
                  <span className="font-display font-black text-sm text-purple-950">KYC Auditor: Document Inspection</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDocInspector(false)}
                  className="p-1.5 rounded-lg bg-purple-950/5 text-purple-950 hover:bg-purple-950/15 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 font-sans">
                
                {/* Simulated Certificate Graphic build */}
                <div className="p-5 rounded-2xl bg-[#faf5f6] border border-dashed border-purple-300 relative overflow-hidden flex flex-col justify-between h-56 font-serif">
                  
                  {/* Holographic Watermark stamp */}
                  <div className="absolute right-4 bottom-4 w-20 h-20 rounded-full border-4 border-dashed border-purple-900/10 flex items-center justify-center text-[7px] font-black text-purple-900/10 uppercase tracking-widest rotate-12 pointer-events-none select-none">
                    Verified Signature
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[8px] uppercase tracking-[0.25em] text-purple-950/40 font-sans font-extrabold block">
                      State of Delaware
                    </span>
                    <h5 className="font-bold text-sm text-purple-950 uppercase tracking-widest leading-none">
                      Certificate of Incorporation
                    </h5>
                    <div className="w-24 h-0.5 bg-purple-950/10 mx-auto mt-1" />
                  </div>

                  <div className="text-[10px] text-purple-950/70 text-center leading-relaxed space-y-1 mt-3 font-sans font-semibold">
                    <p>This certifies that <strong className="text-purple-950 font-black">{activeCust.company.toUpperCase()}</strong> is formed and registered.</p>
                    <p className="font-mono text-[9px] text-purple-950/40">Filing Number: {activeCust.delawareStamp}</p>
                  </div>

                  <div className="flex justify-between items-end border-t border-purple-950/5 pt-3 mt-4 text-[8px] font-sans font-bold text-purple-950/40">
                    <div className="text-left space-y-0.5">
                      <span>Registrar of Corporations</span>
                      <span className="font-mono block uppercase">Authenticated</span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span>Document ID</span>
                      <span className="font-mono block">{activeCust.filingNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Audit details metadata */}
                <div className="p-3 bg-purple-950/5 rounded-xl text-[11px] font-semibold text-purple-950/70 leading-relaxed">
                  <span className="font-extrabold text-purple-950 block mb-1">Verify metadata matches:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Company Entity: <strong className="text-purple-950">{activeCust.company.toUpperCase()}</strong></li>
                    <li>Status Code: Active Good Standing</li>
                    <li>Authorized Agent: <strong className="text-purple-950">{activeCust.name}</strong> (verified cardholder match)</li>
                  </ul>
                </div>

              </div>

              {/* Action Buttons inside inspector */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDocInspector(false)}
                  className="py-2.5 px-4 rounded-xl border border-purple-900/10 hover:bg-purple-950/5 text-purple-950 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel Review
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBusinessDocAudited(true);
                    setCustomers(prev => prev.map(c => {
                      if (c.id === activeCust.id) {
                        return {
                          ...c,
                          businessDocAudited: true
                        };
                      }
                      return c;
                    }));
                    setShowDocInspector(false);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <UserCheck className="w-4 h-4 text-pink-400" /> Verify & Authorize
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Micro fallback icon to avoid any import discrepancies
function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={props.className || "w-4 h-4"}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  );
}
