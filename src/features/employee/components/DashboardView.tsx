import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  TrendingUp, 
  Coins, 
  PiggyBank, 
  ArrowRight,
  Sparkles,
  Zap,
  Info,
  Calendar
} from 'lucide-react';
import { WalletState, PaymentItem, LoanApplication } from '../types';

interface DashboardViewProps {
  wallet: WalletState;
  setWallet: React.Dispatch<React.SetStateAction<WalletState>>;
  payments: PaymentItem[];
  loans: LoanApplication[];
  onNavigate: (tab: any) => void;
  userName: string;
}

export default function DashboardView({ 
  wallet, 
  setWallet, 
  payments, 
  loans, 
  onNavigate,
  userName
}: DashboardViewProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; income: number; expense: number } | null>(null);
  const [selectedYear, setSelectedYear] = useState('This Year');
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Cashflow Data (custom SVG coordinates)
  const chartData = [
    { name: 'Jan', income: 45000, expense: 28000 },
    { name: 'Feb', income: 52000, expense: 32000 },
    { name: 'Mar', income: 49000, expense: 30000 },
    { name: 'Apr', income: 68000, expense: 41000 },
    { name: 'May', income: 72000, expense: 39000 },
    { name: 'Jun', income: 78000, expense: 43000 }
  ];

  const maxVal = 90000;
  const height = 180;
  const width = 500;

  const getSvgCoords = (dataIndex: number, type: 'income' | 'expense') => {
    const x = (dataIndex / (chartData.length - 1)) * (width - 40) + 20;
    const val = chartData[dataIndex][type];
    const y = height - (val / maxVal) * (height - 30) - 10;
    return { x, y };
  };

  const incomePointsPath = chartData.map((_, i) => {
    const { x, y } = getSvgCoords(i, 'income');
    return `${x},${y}`;
  }).join(' ');

  const expensePointsPath = chartData.map((_, i) => {
    const { x, y } = getSvgCoords(i, 'expense');
    return `${x},${y}`;
  }).join(' ');

  // Fill paths for beautiful gradient underneath lines
  const incomeFillPath = `M 20,${height - 10} L ${chartData.map((_, i) => {
    const { x, y } = getSvgCoords(i, 'income');
    return `${x},${y}`;
  }).join(' L ')} L ${width - 20},${height - 10} Z`;

  const expenseFillPath = `M 20,${height - 10} L ${chartData.map((_, i) => {
    const { x, y } = getSvgCoords(i, 'expense');
    return `${x},${y}`;
  }).join(' L ')} L ${width - 20},${height - 10} Z`;

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (!isNaN(amount) && amount > 0) {
      setWallet(prev => ({
        ...prev,
        balance: prev.balance + amount,
        dailyTracker: Math.min(prev.dailyTracker + amount * 0.1, prev.dailyTarget)
      }));
      setTopUpAmount('');
      setTopUpOpen(false);
      triggerNotification(`Successfully added $${amount.toLocaleString()} to wallet!`);
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!isNaN(amount) && amount > 0 && amount <= wallet.balance) {
      setWallet(prev => ({
        ...prev,
        balance: prev.balance - amount
      }));
      setTransferAmount('');
      setTransferRecipient('');
      setTransferOpen(false);
      triggerNotification(`Transferred $${amount.toLocaleString()} to ${transferRecipient || 'External Recipient'}`);
    } else if (amount > wallet.balance) {
      alert('Insufficient wallet balance.');
    }
  };

  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Radial progress calculations
  const totalCategoryAllocation = 67; // average statistic percent
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalCategoryAllocation / 100) * circumference;

  return (
    <div id="dashboard-view-root" className="space-y-6">
      
      {/* Dynamic Toast System */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#24142F] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-pink-500/35 glow-magenta animate-bounce">
          <Sparkles className="w-5 h-5 text-pink-400" />
          <span className="font-sans font-medium text-sm">{showNotification}</span>
        </div>
      )}

      {/* Grid of Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Personal Wallet & Tracker */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* Card Layout matching video */}
          <div className="bg-gradient-to-br from-[#fff5f8] via-[#fce7f3] to-[#fbcfe8] rounded-3xl p-6 text-[#2e1065] shadow-xl flex flex-col justify-between relative overflow-hidden h-[240px] border border-pink-300/40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400 rounded-full filter blur-[70px] opacity-40"></div>
            
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="text-xs font-mono text-pink-700 font-bold tracking-widest uppercase">Personal Wallet</p>
                <p className="text-[10px] text-purple-950/60 font-semibold font-sans mt-2 tracking-wide">CARDHOLDER</p>
                <p className="text-base font-bold tracking-wide font-sans text-[#2e1065]">{userName}</p>
              </div>
              <div className="w-12 h-8 bg-[#2e1065]/10 rounded-lg flex items-center justify-center border border-[#2e1065]/15 font-mono text-[10px] uppercase font-bold text-[#2e1065] tracking-wider">
                APEX
              </div>
            </div>

            <div className="z-10 mt-4">
              <span className="text-[9px] text-pink-700 font-mono font-bold tracking-widest uppercase">VALUABLE DIGITS</span>
              <h2 className="text-3xl font-black tracking-tight font-sans mt-0.5 text-[#2e1065]">
                ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="flex justify-between items-end z-10 pt-2 border-t border-[#2e1065]/10 mt-2">
              <div className="flex gap-4">
                <div>
                  <p className="text-[9px] text-purple-950/60 font-mono uppercase">VALID THRU</p>
                  <p className="text-xs font-mono font-bold text-[#2e1065]">11/29</p>
                </div>
                <div>
                  <p className="text-[9px] text-purple-950/60 font-mono uppercase">SECRET KEY</p>
                  <p className="text-xs font-mono font-bold text-[#2e1065]">***</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-pink-700">VISA CORP</span>
            </div>
          </div>

          {/* Wallet Action Buttons Grid */}
          <div className="grid grid-cols-4 gap-2">
            <button 
              onClick={() => setTopUpOpen(true)}
              className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#FAF4F8] text-[#24142F] rounded-2xl border border-pink-500/10 shadow-sm transition-all duration-200 group active:scale-95"
            >
              <div className="p-2 bg-pink-500/10 text-pink-500 rounded-xl mb-1 group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-sans font-semibold tracking-wide">TOP UP</span>
            </button>

            <button 
              onClick={() => setTransferOpen(true)}
              className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#FAF4F8] text-[#24142F] rounded-2xl border border-pink-500/10 shadow-sm transition-all duration-200 group active:scale-95"
            >
              <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl mb-1 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-sans font-semibold tracking-wide">TRANSFER</span>
            </button>

            <button 
              onClick={() => {
                setWallet(prev => ({ ...prev, dailyTracker: prev.dailyTarget }));
                triggerNotification("Daily EFFORT target automatically synchronized to 100%!");
              }}
              className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#FAF4F8] text-[#24142F] rounded-2xl border border-pink-500/10 shadow-sm transition-all duration-200 group active:scale-95"
            >
              <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl mb-1 group-hover:scale-110 transition-transform">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-sans font-semibold tracking-wide">REQUEST</span>
            </button>

            <button 
              onClick={() => onNavigate('transactions')}
              className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#FAF4F8] text-[#24142F] rounded-2xl border border-pink-500/10 shadow-sm transition-all duration-200 group active:scale-95"
            >
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl mb-1 group-hover:scale-110 transition-transform">
                <History className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-sans font-semibold tracking-wide">HISTORY</span>
            </button>
          </div>

          {/* Daily Income/Effort Tracker */}
          <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">DAILY INCOME TRACKER</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <h3 className="text-xl font-bold font-sans text-gray-900">
                    ${wallet.dailyTracker.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                  <span className="text-xs text-pink-500 font-mono font-medium">/{Math.min(100, Math.round((wallet.dailyTracker / wallet.dailyTarget) * 100))}%</span>
                </div>
              </div>
              <div className="h-8 w-16 bg-pink-500/10 text-pink-600 text-[10px] font-semibold flex items-center justify-center rounded-full uppercase tracking-wider font-mono gap-1">
                <Zap className="w-3 h-3 fill-pink-500 text-pink-500" />
                TARGET
              </div>
            </div>

            {/* Custom styled progress loader aligned with video */}
            <div className="relative w-full h-3 bg-pink-100 rounded-full overflow-hidden mt-2">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (wallet.dailyTracker / wallet.dailyTarget) * 100)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-2">
              <span>$2,880.00 LIMIT</span>
              <span>$22,500.00 GOAL</span>
            </div>
          </div>

        </div>

        {/* Right Column: Key metrics and Charts */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top stats panels with pink/white cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Income */}
            <div className="bg-white rounded-2xl p-5 border border-pink-500/10 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-500 rounded-full filter blur-2xl opacity-10"></div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">TOTAL INCOME</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                  +15.2%
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <h4 className="text-2xl font-bold font-sans text-[#24142F]">
                  ${wallet.incomeThisMonth.toLocaleString('en-US')}
                </h4>
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Loans */}
            <div className="bg-white rounded-2xl p-5 border border-pink-500/10 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute right-0 top-0 w-20 h-20 bg-pink-500 rounded-full filter blur-2xl opacity-10"></div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">TOTAL LOANS</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full flex items-center gap-1">
                  +8.4%
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <h4 className="text-2xl font-bold font-sans text-[#24142F]">
                  ${wallet.loansThisMonth.toLocaleString('en-US')}
                </h4>
                <div className="p-1.5 bg-pink-100 text-pink-600 rounded-lg">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Deposits */}
            <div className="bg-white rounded-2xl p-5 border border-pink-500/10 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute right-0 top-0 w-20 h-20 bg-indigo-500 rounded-full filter blur-2xl opacity-10"></div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">TOTAL DEPOSITS</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-1">
                  +9.4%
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <h4 className="text-2xl font-bold font-sans text-[#24142F]">
                  ${wallet.depositsThisMonth.toLocaleString('en-US')}
                </h4>
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                  <PiggyBank className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>

          {/* Lower segment: Cashflow Chart (Interactive SVG!) & Distribution Radial gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Interactive SVG lines and bar composite chart */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold font-sans text-[#24142F]">Cashflow</h3>
                  <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">INCOME VS EXPENSES TRACKER</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-pink-500 inline-block"></span>
                  <span className="text-[10px] font-mono text-gray-600 mr-2">Income</span>
                  <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                  <span className="text-[10px] font-mono text-gray-600 mr-4">Expense</span>
                  
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="text-xs font-mono font-semibold bg-pink-50 border border-pink-200 text-[#24142F] rounded-lg px-2 py-1 outline-none"
                  >
                    <option>This Year</option>
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                </div>
              </div>

              {/* Dynamic SVG chart with interactive grid pointer */}
              <div className="relative pt-2">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal gridlines */}
                  {[0, 1, 2, 3, 4].map((grid, index) => {
                    const gridY = height - (grid / 4) * (height - 30) - 10;
                    return (
                      <g key={index}>
                        <line 
                          x1="20" 
                          y1={gridY} 
                          x2={width - 20} 
                          y2={gridY} 
                          stroke="#F0E5ED" 
                          strokeDasharray="4,4" 
                        />
                        <text 
                          x="10" 
                          y={gridY + 4} 
                          fill="#9CA3AF" 
                          fontSize="8px" 
                          fontFamily="monospace"
                          textAnchor="end"
                        >
                          {Math.round((grid / 4) * (maxVal / 1000))}k
                        </text>
                      </g>
                    );
                  })}

                  {/* Area Gradients */}
                  <path d={incomeFillPath} fill="url(#incomeGrad)" />
                  <path d={expenseFillPath} fill="url(#expenseGrad)" />

                  {/* Smooth Lines */}
                  <polyline 
                    fill="none" 
                    stroke="#ec4899" 
                    strokeWidth="3.5" 
                    points={incomePointsPath} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline 
                    fill="none" 
                    stroke="#6366f1" 
                    strokeWidth="2.5" 
                    points={expensePointsPath} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Intersecting vertical guide on hover */}
                  {hoveredPoint !== null && (
                    <g>
                      <line 
                        x1={(hoveredPoint.index / (chartData.length - 1)) * (width - 40) + 20} 
                        y1="10" 
                        x2={(hoveredPoint.index / (chartData.length - 1)) * (width - 40) + 20} 
                        y2={height - 10} 
                        stroke="#ec4899" 
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />
                      {/* Income circle pointer */}
                      <circle 
                        cx={getSvgCoords(hoveredPoint.index, 'income').x} 
                        cy={getSvgCoords(hoveredPoint.index, 'income').y} 
                        r="5" 
                        fill="#ec4899" 
                        stroke="#fff" 
                        strokeWidth="2" 
                      />
                      {/* Expense circle pointer */}
                      <circle 
                        cx={getSvgCoords(hoveredPoint.index, 'expense').x} 
                        cy={getSvgCoords(hoveredPoint.index, 'expense').y} 
                        r="5" 
                        fill="#6366f1" 
                        stroke="#fff" 
                        strokeWidth="2" 
                      />
                    </g>
                  )}

                  {/* Hover Interceptor bars */}
                  {chartData.map((d, i) => {
                    const colWidth = (width - 40) / (chartData.length - 1);
                    const interceptorX = (i * colWidth) + 10;
                    return (
                      <rect
                        key={i}
                        x={interceptorX}
                        y="0"
                        width={colWidth}
                        height={height}
                        fill="transparent"
                        className="cursor-crosshair"
                        onMouseEnter={() => setHoveredPoint({ index: i, income: d.income, expense: d.expense })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}

                  {/* X Axis Labels */}
                  {chartData.map((d, i) => {
                    const xLabel = (i / (chartData.length - 1)) * (width - 40) + 20;
                    return (
                      <text 
                        key={i} 
                        x={xLabel} 
                        y={height + 14} 
                        fill="#374151" 
                        fontSize="9px" 
                        fontWeight="semibold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {d.name}
                      </text>
                    );
                  })}
                </svg>

                {/* Simulated Tooltip */}
                {hoveredPoint !== null && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#24142F] text-white px-3 py-1.5 rounded-lg shadow-md flex items-center gap-3 font-mono text-[10px]">
                    <span className="font-sans font-bold">{chartData[hoveredPoint.index].name}:</span>
                    <span className="text-pink-400">Inc: ${hoveredPoint.income.toLocaleString()}</span>
                    <span className="text-indigo-300">Exp: ${hoveredPoint.expense.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Chart footer details matching video */}
              <div className="flex justify-between items-center bg-pink-50/50 rounded-xl p-3 mt-4 border border-pink-500/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></div>
                  <span className="text-[10px] font-mono tracking-wide text-[#24142F] uppercase">DYNAMIC FORECAST SYNCED</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                  <span>LAST RECALC: TODAY 08:00 AM</span>
                </div>
              </div>
            </div>

            {/* Statistic gauge Ring */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold font-sans text-[#24142F]">Statistic</h3>
                <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">This Month</p>
              </div>

              {/* Dynamic SVG Radial Arc Gauge */}
              <div className="relative flex justify-center items-center py-4">
                <svg width="120" height="120" className="transform -rotate-90">
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    fill="transparent" 
                    stroke="#F0E5ED" 
                    strokeWidth="10" 
                  />
                  <motion.circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    fill="transparent" 
                    stroke="url(#radialGrad)" 
                    strokeWidth="10" 
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeDashoffset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="radialGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Absolute nested content */}
                <div className="absolute text-center">
                  <h4 className="text-2xl font-bold font-sans text-[#24142F] leading-none">
                    $3,500
                  </h4>
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">USED LIMIT</p>
                </div>
              </div>

              {/* Category indicator columns */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    <span className="font-sans font-medium text-gray-700">Deposits Limit</span>
                  </div>
                  <span className="font-mono text-gray-500 font-medium">$2,500</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span className="font-sans font-medium text-gray-700">Payment Swaps</span>
                  </div>
                  <span className="font-mono text-gray-500 font-medium">$1,000</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MODALS segment */}
      
      {/* Top Up Modal */}
      {topUpOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
          {/* Dim & Blur Backstage Overlay (z-index 9998) */}
          <div 
            className="fixed inset-0 premium-overlay cursor-pointer" 
            style={{ zIndex: 9998 }}
            onClick={() => setTopUpOpen(false)}
          />
          
          {/* Main Modal Panel (Modal Dialogs: z-index 9999) */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="premium-popup-panel rounded-3xl p-6 max-w-sm w-full space-y-4 relative"
            style={{ zIndex: 9999 }}
          >
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold font-sans text-[#2e1065] font-display uppercase tracking-tight">Top Up Wallet</h3>
              <button 
                onClick={() => setTopUpOpen(false)}
                className="text-gray-400 hover:text-[#2e1065] font-mono text-sm p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleTopUp} className="space-y-4 pt-2">
              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Enter Amount ($)</label>
                <input 
                  type="number" 
                  autoFocus
                  placeholder="5000"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full text-base font-sans font-medium border border-pink-200 outline-none rounded-xl p-3 focus:ring-2 focus:ring-pink-500/20 bg-white"
                />
              </div>

              <div className="bg-pink-50 rounded-xl p-3 text-[11px] text-pink-700 font-sans flex items-start gap-2">
                <Info className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>Topping up this corporate wallet automatically increases daily effort parameters dynamically.</span>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#24142F] hover:bg-[#351b44] text-white font-sans font-bold tracking-wider rounded-xl transition duration-200"
              >
                EXECUTE TRANSACTION
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Transfer Modal */}
      {transferOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
          {/* Dim & Blur Backstage Overlay (z-index 9998) */}
          <div 
            className="fixed inset-0 premium-overlay cursor-pointer" 
            style={{ zIndex: 9998 }}
            onClick={() => setTransferOpen(false)}
          />

          {/* Main Modal Panel (Modal Dialogs: z-index 9999) */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="premium-popup-panel rounded-3xl p-6 max-w-sm w-full space-y-4 relative"
            style={{ zIndex: 9999 }}
          >
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold font-sans text-[#2e1065] font-display uppercase tracking-tight">Execute Wire Transfer</h3>
              <button 
                onClick={() => setTransferOpen(false)}
                className="text-gray-400 hover:text-[#2e1065] font-mono text-sm p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleTransfer} className="space-y-4 pt-2">
              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Recipient Name / Account</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="Kyros Lab Holdings"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full text-sm font-sans border border-pink-200 outline-none rounded-xl p-3 focus:ring-2 focus:ring-pink-500/20 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Enter Volume ($)</label>
                <input 
                  type="number" 
                  required
                  placeholder="15000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full text-base font-sans font-medium border border-pink-200 outline-none rounded-xl p-3 focus:ring-2 focus:ring-pink-500/20 bg-white"
                />
              </div>

              <div className="bg-purple-50 rounded-xl p-3 text-[11px] text-purple-700 font-sans flex items-start gap-2">
                <Info className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <span>Wire transfers must be cleared through our systemic fraud compliance filters.</span>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#24142F] hover:bg-[#351b44] text-white font-sans font-bold tracking-wider rounded-xl transition duration-200"
              >
                DISPATCH WIRE FUNDS
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
