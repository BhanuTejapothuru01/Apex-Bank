import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MapPin, 
  Building2, 
  UserCheck, 
  TrendingUp, 
  Users, 
  Star,
  DollarSign,
  Briefcase,
  Search,
  MessageSquare,
  AlertTriangle,
  Activity,
  CheckCircle,
  Mail,
  Phone,
  Send,
  X,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  Volume2,
  Lock,
  Download,
  Calendar,
  FileCheck,
  Shield,
  History,
  BookOpen,
  ArrowLeftRight,
  ChevronRight,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Branch } from '../types/dashboard';
import { type IndianBranch, mergeDbBranchesWithDefaults } from '../lib/branchTransform';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface BranchNote {
  date: string;
  time: string;
  sentBy: string;
  message: string;
  type: 'Urgent Mandate' | 'Compliance Note' | 'Performance Warning' | 'Operational Instruction';
}

interface BranchManagementProps {
  branches?: Branch[];
}

// Helper format currency
const formatCur = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val * 83).replace('INR', '₹'); // Scale to Rupees for perfect realism
};

const formatShortIndian = (val: number) => {
  const rupees = val * 83; // Scale to Rupees for perfect realism
  if (rupees >= 1e12) {
    return `₹${(rupees / 1e12).toFixed(2)}T`;
  } else if (rupees >= 1e9) {
    return `₹${(rupees / 1e9).toFixed(2)}B`;
  } else if (rupees >= 1e7) {
    return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(rupees / 1e7)} Cr`;
  } else if (rupees >= 1e5) {
    return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(rupees / 1e5)} Lakh`;
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(rupees).replace('INR', '₹');
  }
};

export default function BranchManagement({ branches: dbBranches = [] }: BranchManagementProps) {
  // Core branch locations requested by user
  const [branches, setBranches] = useState<IndianBranch[]>([
    {
      id: "BR-HYD-01",
      code: "AX-HYD-01",
      name: "Hyderabad HQ",
      state: "Telangana",
      city: "Hyderabad",
      category: "Headquarters",
      status: "Operational",
      manager: {
        name: "Mohammed Rahman",
        avatarSeed: "MR",
        phone: "+91 90001 02345",
        email: "m.rahman@apexbank.com",
        rating: 4.9,
        performance: 98,
        accountsCount: 24800,
      },
      employeeCount: 145,
      customerCount: 42100,
      deposits: 850320000,
      loans: 312450000,
      fixedDeposits: 142000000,
      investmentPortfolio: 85000000,
      riskRating: "Low",
      performanceRating: 4.9,
      openDate: "2015-08-15",
      lastAuditDate: "2026-05-10",
      revenue: 95040000,
      profit: 52000000,
      loss: 1200000,
      coordinates: { x: 275, y: 425 },
      notes: []
    },
    {
      id: "BR-MUM-02",
      code: "AX-MUM-02",
      name: "Mumbai Financial Hub",
      state: "Maharashtra",
      city: "Mumbai",
      category: "Regional Office",
      status: "Operational",
      manager: {
        name: "Donald Vance",
        avatarSeed: "DV",
        phone: "+91 98220 54321",
        email: "d.vance@apexbank.com",
        rating: 4.8,
        performance: 96,
        accountsCount: 18500,
      },
      employeeCount: 210,
      customerCount: 54000,
      deposits: 1420500000,
      loans: 485900000,
      fixedDeposits: 280000000,
      investmentPortfolio: 155000000,
      riskRating: "Medium",
      performanceRating: 4.8,
      openDate: "2016-04-20",
      lastAuditDate: "2026-06-01",
      revenue: 125000000,
      profit: 42000000,
      loss: 3400000,
      coordinates: { x: 200, y: 365 },
      notes: []
    },
    {
      id: "BR-DEL-03",
      code: "AX-DEL-03",
      name: "Delhi Corporate Center",
      state: "Delhi",
      city: "New Delhi",
      category: "Regional Office",
      status: "Operational",
      manager: {
        name: "Alistair Sterling",
        avatarSeed: "AS",
        phone: "+91 98110 12345",
        email: "a.sterling@apexbank.com",
        rating: 4.7,
        performance: 94,
        accountsCount: 14200,
      },
      employeeCount: 165,
      customerCount: 38200,
      deposits: 1105000000,
      loans: 520000000,
      fixedDeposits: 210000000,
      investmentPortfolio: 115000000,
      riskRating: "Low",
      performanceRating: 4.7,
      openDate: "2017-01-10",
      lastAuditDate: "2026-05-18",
      revenue: 108000000,
      profit: 48000000,
      loss: 2800000,
      coordinates: { x: 220, y: 180 },
      notes: []
    },
    {
      id: "BR-BLR-04",
      code: "AX-BLR-04",
      name: "Bengaluru Technology Hub",
      state: "Karnataka",
      city: "Bengaluru",
      category: "Branch",
      status: "Operational",
      manager: {
        name: "Lokesh Kumar",
        avatarSeed: "LK",
        phone: "+91 80221 00000",
        email: "l.kumar@apexbank.com",
        rating: 4.7,
        performance: 96,
        accountsCount: 12000,
      },
      employeeCount: 115,
      customerCount: 29500,
      deposits: 980000000,
      loans: 450000000,
      fixedDeposits: 175000000,
      investmentPortfolio: 98000000,
      riskRating: "Low",
      performanceRating: 4.7,
      openDate: "2019-11-20",
      lastAuditDate: "2026-04-22",
      revenue: 95000000,
      profit: 35000000,
      loss: 1500000,
      coordinates: { x: 205, y: 460 },
      notes: []
    },
    {
      id: "BR-CHE-05",
      code: "AX-CHE-05",
      name: "Chennai Operations Hub",
      state: "Tamil Nadu",
      city: "Chennai",
      category: "Branch",
      status: "Operational",
      manager: {
        name: "Suresh Pillai",
        avatarSeed: "SP",
        phone: "+91 44230 98765",
        email: "s.pillai@apexbank.com",
        rating: 4.6,
        performance: 92,
        accountsCount: 11000,
      },
      employeeCount: 98,
      customerCount: 24500,
      deposits: 670000000,
      loans: 280000000,
      fixedDeposits: 120000000,
      investmentPortfolio: 65000000,
      riskRating: "Medium",
      performanceRating: 4.6,
      openDate: "2018-09-12",
      lastAuditDate: "2026-03-30",
      revenue: 72000000,
      profit: 25000000,
      loss: 1800000,
      coordinates: { x: 255, y: 535 },
      notes: []
    },
    {
      id: "BR-KOL-06",
      code: "AX-KOL-06",
      name: "Kolkata Eastern Command",
      state: "West Bengal",
      city: "Kolkata",
      category: "Regional Office",
      status: "Operational",
      manager: {
        name: "Sujata Ray",
        avatarSeed: "SR",
        phone: "+91 33245 67890",
        email: "s.ray@apexbank.com",
        rating: 4.4,
        performance: 88,
        accountsCount: 9500,
      },
      employeeCount: 120,
      customerCount: 26000,
      deposits: 750000000,
      loans: 320000000,
      fixedDeposits: 150000000,
      investmentPortfolio: 72000000,
      riskRating: "Medium",
      performanceRating: 4.4,
      openDate: "2018-05-14",
      lastAuditDate: "2026-04-10",
      revenue: 65000000,
      profit: 22000000,
      loss: 4500000,
      coordinates: { x: 425, y: 288 },
      notes: []
    },
    {
      id: "BR-AHM-07",
      code: "AX-AHM-07",
      name: "Ahmedabad Trade Hub",
      state: "Gujarat",
      city: "Ahmedabad",
      category: "Branch",
      status: "Attention Required",
      manager: {
        name: "Amit Patel",
        avatarSeed: "AP",
        phone: "+91 79265 12345",
        email: "a.patel@apexbank.com",
        rating: 4.1,
        performance: 79,
        accountsCount: 8800,
      },
      employeeCount: 84,
      customerCount: 21000,
      deposits: 580000000,
      loans: 240000000,
      fixedDeposits: 95000000,
      investmentPortfolio: 48000000,
      riskRating: "High",
      performanceRating: 4.1,
      openDate: "2020-07-22",
      lastAuditDate: "2026-06-12",
      revenue: 52000000,
      profit: 12000000,
      loss: 8200000,
      coordinates: { x: 110, y: 285 },
      notes: []
    },
    {
      id: "BR-PUN-08",
      code: "AX-PUN-08",
      name: "Pune Business Center",
      state: "Maharashtra",
      city: "Pune",
      category: "Branch",
      status: "Operational",
      manager: {
        name: "Rohan Deshmukh",
        avatarSeed: "RD",
        phone: "+91 20244 55667",
        email: "r.deshmukh@apexbank.com",
        rating: 4.5,
        performance: 91,
        accountsCount: 8200,
      },
      employeeCount: 92,
      customerCount: 19800,
      deposits: 450000000,
      loans: 210000000,
      fixedDeposits: 85000000,
      investmentPortfolio: 42000000,
      riskRating: "Low",
      performanceRating: 4.5,
      openDate: "2020-03-12",
      lastAuditDate: "2026-05-15",
      revenue: 42000000,
      profit: 18000000,
      loss: 1200000,
      coordinates: { x: 200, y: 385 },
      notes: []
    },
    {
      id: "BR-LUC-09",
      code: "AX-LUC-09",
      name: "Lucknow Regional Office",
      state: "Uttar Pradesh",
      city: "Lucknow",
      category: "Regional Office",
      status: "Attention Required",
      manager: {
        name: "Vikas Pandey",
        avatarSeed: "VP",
        phone: "+91 52240 11223",
        email: "v.pandey@apexbank.com",
        rating: 4.0,
        performance: 81,
        accountsCount: 7500,
      },
      employeeCount: 78,
      customerCount: 16200,
      deposits: 390000000,
      loans: 180000000,
      fixedDeposits: 75000000,
      investmentPortfolio: 35000000,
      riskRating: "High",
      performanceRating: 3.9,
      openDate: "2021-02-15",
      lastAuditDate: "2026-06-05",
      revenue: 38050000,
      profit: 11000000,
      loss: 6800000,
      coordinates: { x: 280, y: 220 },
      notes: []
    },
    {
      id: "BR-JAI-10",
      code: "AX-JAI-10",
      name: "Jaipur Regional Office",
      state: "Rajasthan",
      city: "Jaipur",
      category: "Branch",
      status: "Operational",
      manager: {
        name: "Virendra Singh",
        avatarSeed: "VS",
        phone: "+91 14120 44556",
        email: "v.singh@apexbank.com",
        rating: 4.5,
        performance: 90,
        accountsCount: 6900,
      },
      employeeCount: 70,
      customerCount: 15000,
      deposits: 320000000,
      loans: 155000000,
      fixedDeposits: 60000000,
      investmentPortfolio: 28000000,
      riskRating: "Medium",
      performanceRating: 4.5,
      openDate: "2021-09-01",
      lastAuditDate: "2026-04-18",
      revenue: 31010000,
      profit: 14000000,
      loss: 900000,
      coordinates: { x: 160, y: 215 },
      notes: []
    }
  ]);

  const [selectedBranchId, setSelectedBranchId] = useState<string>("BR-HYD-01");

  useEffect(() => {
    if (dbBranches.length > 0) {
      setBranches((prev) => mergeDbBranchesWithDefaults(dbBranches, prev));
      setSelectedBranchId((id) =>
        dbBranches.some((b) => b.id === id) ? id : dbBranches[0].id
      );
    }
  }, [dbBranches]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerMultiplier, setTickerMultiplier] = useState(1.0);
  const [selectedKpiCardId, setSelectedKpiCardId] = useState<string | null>(null);
  const [kpiModalNotification, setKpiModalNotification] = useState<string | null>(null);
  
  // Functional Action Modals trigger state
  const [activeModal, setActiveModal] = useState<'view' | 'contact' | 'analytics' | 'employees' | 'transfer' | 'audit' | 'perf' | null>(null);
  
  // Dynamic form states
  const [transferAmount, setTransferAmount] = useState('500000');
  const [transferTargetId, setTransferTargetId] = useState('BR-MUM-02');
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [voipActive, setVoipActive] = useState(false);
  const [voipTimer, setVoipTimer] = useState(0);

  // Dispatch live notes
  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickNoteType, setQuickNoteType] = useState<BranchNote['type']>('Compliance Note');
  const [noteSuccessFed, setNoteSuccessFed] = useState(false);

  // Auto-ticking live dashboard fluctuations simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerMultiplier(prev => prev + (Math.random() - 0.49) * 0.003);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Connected voip timer increment
  useEffect(() => {
    let voipInt: any;
    if (voipActive) {
      voipInt = setInterval(() => {
        setVoipTimer(t => t + 1);
      }, 1000);
    } else {
      setVoipTimer(0);
    }
    return () => clearInterval(voipInt);
  }, [voipActive]);

  // Find currently active primary selected node
  const selectedBranch = useMemo(() => {
    return branches.find(b => b.id === selectedBranchId) || branches[0] || null;
  }, [branches, selectedBranchId]);

  // Calculate live ticker metrics
  const stats = useMemo(() => {
    let totalDeposits = 0;
    let totalLoans = 0;
    let totalFixedDeposits = 0;
    let totalRevenue = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let countOperational = 0;
    let countAttention = 0;

    branches.forEach(b => {
      totalDeposits += b.deposits;
      totalLoans += b.loans;
      totalFixedDeposits += b.fixedDeposits;
      totalRevenue += b.revenue;
      totalProfit += b.profit;
      totalLoss += b.loss;
      if (b.status === 'Operational') {
        countOperational++;
      } else {
        countAttention++;
      }
    });

    return {
      totalBranches: branches.length,
      totalDeposits: Math.round(totalDeposits * tickerMultiplier),
      totalLoans: Math.round(totalLoans * tickerMultiplier),
      totalFixedDeposits: Math.round(totalFixedDeposits * tickerMultiplier),
      totalRevenue: Math.round(totalRevenue * tickerMultiplier),
      totalProfit: Math.round(totalProfit * tickerMultiplier),
      totalLoss: Math.round(totalLoss * tickerMultiplier),
      countOperational,
      countAttention
    };
  }, [branches, tickerMultiplier]);

  // Dynamic Memo list of fully details KPI summary cards
  const kpiCardsList = useMemo(() => {
    return [
      {
        id: "total_branches",
        label: "Total Branches",
        value: stats.totalBranches,
        valueString: String(stats.totalBranches),
        badgeText: "ACTIVE",
        badgeStyle: "bg-indigo-50 text-indigo-800 border-indigo-200",
        color: "text-slate-800",
        details: {
          title: "TOTAL BRANCHES",
          totalAmount: `${stats.totalBranches}`,
          monthlyGrowth: "+0.0% (Stable)",
          contributingBranches: `${stats.totalBranches} Active States`,
          topRegion: "Telangana HQ & Maharashtra (2 Nodes)",
          lastUpdated: "Today 09:45 AM",
        }
      },
      {
        id: "total_deposits",
        label: "Total Deposits",
        value: stats.totalDeposits,
        valueString: formatShortIndian(stats.totalDeposits),
        badgeText: "SECURED",
        badgeStyle: "bg-emerald-50 text-emerald-800 border-emerald-200",
        color: "text-emerald-700",
        details: {
          title: "TOTAL DEPOSITS",
          totalAmount: formatCur(stats.totalDeposits),
          monthlyGrowth: "+12.8%",
          contributingBranches: `${stats.totalBranches}`,
          topRegion: "Mumbai Financial Hub",
          lastUpdated: "Today 09:45 AM",
        }
      },
      {
        id: "total_loans",
        label: "Total Loans",
        value: stats.totalLoans,
        valueString: formatShortIndian(stats.totalLoans),
        badgeText: "YIELD ASSET",
        badgeStyle: "bg-sky-50 text-sky-800 border-sky-200",
        color: "text-slate-800",
        details: {
          title: "TOTAL LOANS",
          totalAmount: formatCur(stats.totalLoans),
          monthlyGrowth: "+8.2%",
          contributingBranches: `${stats.totalBranches}`,
          topRegion: "Delhi Corporate Center",
          lastUpdated: "Today 09:45 AM",
        }
      },
      {
        id: "total_fixed_deposits",
        label: "Total Fixed Deposits",
        value: stats.totalFixedDeposits,
        valueString: formatShortIndian(stats.totalFixedDeposits),
        badgeText: "GUARANTEED",
        badgeStyle: "bg-amber-50 text-amber-800 border-amber-200",
        color: "text-slate-800",
        details: {
          title: "TOTAL FIXED DEPOSITS",
          totalAmount: formatCur(stats.totalFixedDeposits),
          monthlyGrowth: "+15.1%",
          contributingBranches: `${stats.totalBranches}`,
          topRegion: "Hyderabad HQ",
          lastUpdated: "Today 09:45 AM",
        }
      },
      {
        id: "total_revenue",
        label: "Total Revenue",
        value: stats.totalRevenue,
        valueString: formatShortIndian(stats.totalRevenue),
        badgeText: "PEAKING",
        badgeStyle: "bg-pink-50 text-pink-800 border-pink-200",
        color: "text-[#db2777]",
        details: {
          title: "TOTAL REVENUE",
          totalAmount: formatCur(stats.totalRevenue),
          monthlyGrowth: "+18.4%",
          contributingBranches: `${stats.totalBranches}`,
          topRegion: "Mumbai Financial Hub",
          lastUpdated: "Today 09:45 AM",
        }
      },
      {
        id: "total_profit",
        label: "Total Profit",
        value: stats.totalProfit,
        valueString: formatShortIndian(stats.totalProfit),
        badgeText: "OPTIMAL",
        badgeStyle: "bg-teal-50 text-teal-800 border-teal-200",
        color: "text-emerald-600",
        details: {
          title: "TOTAL PROFIT",
          totalAmount: formatCur(stats.totalProfit),
          monthlyGrowth: "+11.2%",
          contributingBranches: `${stats.totalBranches}`,
          topRegion: "Mumbai Financial Hub",
          lastUpdated: "Today 09:45 AM",
        }
      },
      {
        id: "total_loss",
        label: "Total Loss",
        value: stats.totalLoss,
        valueString: formatShortIndian(stats.totalLoss),
        badgeText: "MINIMIZED",
        badgeStyle: "bg-rose-50 text-rose-800 border-rose-200",
        color: "text-rose-600",
        details: {
          title: "TOTAL LOSS",
          totalAmount: formatCur(stats.totalLoss),
          monthlyGrowth: "-4.5% (YoY decrease)",
          contributingBranches: `${stats.totalBranches}`,
          topRegion: "Chennai South",
          lastUpdated: "Today 09:45 AM",
        }
      },
      {
        id: "operational_nodes",
        label: "Operational Nodes",
        value: stats.countOperational,
        valueString: `${stats.countOperational} Nodes`,
        badgeText: "ONLINE",
        badgeStyle: "bg-emerald-50 text-emerald-800 border-emerald-200",
        color: "text-emerald-600",
        details: {
          title: "OPERATIONAL NODES",
          totalAmount: `${stats.countOperational} of ${stats.totalBranches} Nodes Online`,
          monthlyGrowth: "100% Core SLA",
          contributingBranches: `${stats.countOperational}`,
          topRegion: "North, West, South Zones",
          lastUpdated: "Today 09:45 AM",
        }
      },
      {
        id: "attention_required",
        label: "Attention Required",
        value: stats.countAttention,
        valueString: `${stats.countAttention} Nodes`,
        badgeText: "AUDITING",
        badgeStyle: "bg-rose-50 text-rose-800 border-rose-200 animate-pulse",
        color: "text-rose-600",
        details: {
          title: "ATTENTION REQUIRED",
          totalAmount: `${stats.countAttention} Branch Node`,
          monthlyGrowth: "Risk Mitigation Flow Enabled",
          contributingBranches: `${stats.countAttention} Node`,
          topRegion: "Kolkata Regional Branch",
          lastUpdated: "Today 09:45 AM",
        }
      }
    ];
  }, [stats]);

  // Filter list of branches based on search query
  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.state.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.manager.name.toLowerCase().includes(q)
      );
    });
  }, [branches, searchQuery]);

  const profitTrend = useMemo(() => {
    if (!selectedBranch) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((m, i) => {
      const factor = 0.85 + (i * 0.04) + (Math.sin(i) * 0.05);
      return {
        month: m,
        Revenue: Math.round(selectedBranch.revenue * factor * tickerMultiplier * 0.1) * 10,
        Profit: Math.round(selectedBranch.profit * factor * tickerMultiplier * 0.1) * 10,
        Loss: Math.round(selectedBranch.loss * (1.15 - i * 0.03) * tickerMultiplier * 0.1) * 10
      };
    });
  }, [selectedBranch, tickerMultiplier]);

  const handleDispatchNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch || !quickNoteText.trim()) return;

    const newNote: BranchNote = {
      date: new Date().toLocaleDateString('en-CA'),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      sentBy: "Super Administrator",
      message: quickNoteText,
      type: quickNoteType
    };

    setBranches(prev => prev.map(b => {
      if (b.id === selectedBranch.id) {
        return {
          ...b,
          notes: [newNote, ...b.notes]
        };
      }
      return b;
    }));

    setQuickNoteText('');
    setNoteSuccessFed(true);
    setTimeout(() => setNoteSuccessFed(false), 3000);
  };

  const handleFundTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) return;
    const amount = Number(transferAmount);
    if (isNaN(amount) || amount <= 0) return;

    // Simulate deposits reduction in source, increase in target
    setBranches(prev => prev.map(b => {
      if (b.id === selectedBranch.id) {
        return { ...b, deposits: Math.max(0, b.deposits - amount) };
      }
      if (b.id === transferTargetId) {
        return { ...b, deposits: b.deposits + amount };
      }
      return b;
    }));

    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setActiveModal(null);
    }, 2500);
  };

  return (
    <div id="branch-command-center" className="space-y-6 text-[#1e293b] select-text">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-pink-200 bg-white shadow-sm shadow-pink-100/50">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-pink-50 border border-pink-100 text-[#db2777]">
            <Activity size={24} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
              India Command Operations Center
            </h1>
            <p className="text-xs text-[#9D174D]/75 font-medium">
              Sovereign Real-Time Branch Network & Node Verification Station. Port: <span className="font-mono">3000</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold font-mono uppercase bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100">
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* 2. Branch List & Details Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Branch List Panel */}
        <div className="lg:col-span-1 p-3 sm:p-5 lg:p-6 rounded-2xl border border-pink-200 bg-white shadow-sm shadow-pink-100/50 flex flex-col min-h-[500px]">
          
          <div className="flex justify-between items-center pb-4 border-b border-pink-50">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-mono font-black text-[#db2777] block">
                NATIONAL GEOGRAPHIC NODAL NET
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Branch Directory
              </h3>
            </div>
          </div>
          
          <div className="mt-4 relative shrink-0">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9D174D]/85 w-4 h-4" />
             <input
               type="text"
               placeholder="Search branches..."
               className="w-full pl-9 pr-4 py-2 bg-pink-50/50 border border-pink-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-slate-700 placeholder:text-[#9D174D]/85"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-2 custom-scrollbar">
            {filteredBranches.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBranchId(b.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedBranchId === b.id 
                  ? 'bg-pink-50 border-pink-300 shadow-sm' 
                  : 'bg-white border-slate-100 hover:border-pink-200 hover:bg-pink-50/50'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">{b.name}</span>
                  <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded tracking-wider uppercase whitespace-nowrap ml-2 ${
                    b.status === 'Operational' 
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}>
                    {b.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#9D174D]/75">
                  <MapPin size={10} className="text-pink-400" />
                  {b.city}, {b.state}
                </div>
              </button>
            ))}
            {filteredBranches.length === 0 && (
              <div className="text-center py-8 text-[#9D174D]/85 text-sm">
                No branches found for "{searchQuery}"
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-[#9D174D]/75 font-mono pt-3 border-t border-pink-50 mt-2 shrink-0">
            <span>TERRITORIES MONITORED: 28 STATES & UTs</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
              <span>LIVE</span>
            </span>
          </div>

        </div>

        {/* Dynamic Right Information Panel */}
        <div className="lg:col-span-2 rounded-2xl border border-pink-200 bg-white shadow-sm shadow-pink-100/50 p-4 sm:p-5 lg:p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-300 via-pink-500 to-pink-300" />
          
          {!selectedBranch ? (
            <p className="text-sm text-[#9D174D]/75 py-8 text-center">No branch selected.</p>
          ) : (
          <>
          <div className="space-y-4">
            
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-pink-50 text-[#db2777] border border-pink-100 px-3 py-1 rounded-full">
                {selectedBranch.category}
              </span>
              <span className={`text-[9px] font-mono font-black px-2.5 py-1 rounded-full tracking-wider uppercase ${
                selectedBranch.status === 'Operational' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {selectedBranch.status}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5 uppercase">
                <Building2 size={18} className="text-[#db2777]" />
                {selectedBranch.name}
              </h3>
              <p className="text-xs text-[#9D174D]/75 font-bold flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-pink-400" />
                {selectedBranch.city}, {selectedBranch.state}
              </p>
            </div>

            {/* Core Financial Ticker Block */}
            <div className="p-4 rounded-xl border border-pink-100 bg-pink-50/20 text-slate-900 space-y-1">
              <span className="text-[9px] text-[#db2777] uppercase font-mono font-black tracking-wider">
                Consolidated Branch Deposits
              </span>
              <p className="text-lg font-black font-mono tracking-tight text-slate-900">
                {formatCur(selectedBranch.deposits * tickerMultiplier)}
              </p>
            </div>

            {/* Comprehensive details table */}
            <div className="divide-y divide-pink-50 space-y-2 mt-4 text-xs font-medium">
              
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/75">Branch Code:</span>
                <span className="font-mono text-slate-900 font-extrabold">{selectedBranch.code}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/75">Branch Manager:</span>
                <span className="text-slate-900 font-extrabold flex items-center gap-1">
                  <UserCheck size={12} className="text-[#db2777]" />
                  {selectedBranch.manager.name}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/75">Manager Contact:</span>
                <span className="text-slate-900 font-mono font-bold text-[11px]">
                  {selectedBranch.manager.phone}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/75">Employee Count:</span>
                <span className="text-slate-900 font-bold">{selectedBranch.employeeCount} Experts</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/75">Customer Count:</span>
                <span className="text-slate-900 font-bold">{selectedBranch.customerCount.toLocaleString()} Users</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/85">Total Loans Outstanding:</span>
                <span className="font-mono text-slate-900 font-bold">{formatCur(selectedBranch.loans * tickerMultiplier)}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/85">Fixed Deposits Ledger:</span>
                <span className="font-mono text-slate-900 font-bold">{formatCur(selectedBranch.fixedDeposits * tickerMultiplier)}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/85">Wealth Investment Portfolio:</span>
                <span className="font-mono text-slate-900 font-bold">{formatCur(selectedBranch.investmentPortfolio * tickerMultiplier)}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/75">Audit Risk Rating:</span>
                <span className={`font-mono font-black px-2 py-0.5 rounded text-[10px] ${
                  selectedBranch.riskRating === 'Low' ? 'bg-emerald-50 text-emerald-600' :
                  selectedBranch.riskRating === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {selectedBranch.riskRating}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/75">Performance Rating:</span>
                <span className="text-slate-900 font-bold flex items-center gap-0.5">
                  <Star size={12} className="fill-[#fbbf24] text-[#fbbf24]" />
                  {selectedBranch.performanceRating.toFixed(1)} / 5.0
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/75">Opening Date:</span>
                <span className="font-mono text-slate-600">{selectedBranch.openDate}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#9D174D]/75">Last Audit Inspection Date:</span>
                <span className="font-mono text-[#db2777] font-bold">{selectedBranch.lastAuditDate}</span>
              </div>

              {/* Three detailed yield stats fields */}
              <div className="grid grid-cols-3 gap-2 pt-2.5">
                <div className="text-center p-2 rounded bg-pink-50/30">
                  <span className="text-[8px] text-[#9D174D]/85 block font-bold uppercase">Live Revenue</span>
                  <span className="text-[10px] font-mono font-bold text-slate-800">{formatCur(selectedBranch.revenue * tickerMultiplier)}</span>
                </div>
                <div className="text-center p-2 rounded bg-emerald-50/40">
                  <span className="text-[8px] text-[#9D174D]/85 block font-bold uppercase">Live Profit</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600">+{formatCur(selectedBranch.profit * tickerMultiplier)}</span>
                </div>
                <div className="text-center p-2 rounded bg-rose-50/40">
                  <span className="text-[8px] text-[#9D174D]/85 block font-bold uppercase">Live Loss</span>
                  <span className="text-[10px] font-mono font-bold text-rose-600">-{formatCur(selectedBranch.loss * tickerMultiplier)}</span>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-pink-50 mt-4 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9D174D]/85 font-black block">COMMAND ACTIONS</span>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Row 1 */}
              <button 
                onClick={() => setActiveModal('view')}
                className="h-[56px] px-4 text-center text-xs font-bold bg-gradient-to-r from-purple-200 to-indigo-200 hover:from-purple-300 hover:to-indigo-300 text-[#3a2072] rounded-[14px] transition-all duration-200 hover:scale-[1.03] hover:shadow-md hover:shadow-purple-100/50 flex items-center justify-center border border-purple-300/20 shadow-sm"
              >
                View Branch
              </button>
              
              <button 
                onClick={() => {
                  setVoipActive(true);
                  setActiveModal('contact');
                }}
                className="h-[56px] px-4 text-center text-xs font-bold bg-gradient-to-r from-purple-200 to-indigo-200 hover:from-purple-300 hover:to-indigo-300 text-[#3a2072] rounded-[14px] transition-all duration-200 hover:scale-[1.03] hover:shadow-md hover:shadow-purple-100/50 flex items-center justify-center border border-purple-300/20 shadow-sm"
              >
                Contact Manager
              </button>

              {/* Row 2 */}
              <button 
                onClick={() => setActiveModal('analytics')}
                className="h-[56px] px-4 text-center text-xs font-bold bg-gradient-to-r from-purple-200 to-indigo-200 hover:from-purple-300 hover:to-indigo-300 text-[#3a2072] rounded-[14px] transition-all duration-200 hover:scale-[1.03] hover:shadow-md hover:shadow-purple-100/50 flex items-center justify-center border border-purple-300/20 shadow-sm"
              >
                Branch Analytics
              </button>

              <button 
                onClick={() => setActiveModal('employees')}
                className="h-[56px] px-4 text-center text-xs font-bold bg-gradient-to-r from-purple-200 to-indigo-200 hover:from-purple-300 hover:to-indigo-300 text-[#3a2072] rounded-[14px] transition-all duration-200 hover:scale-[1.03] hover:shadow-md hover:shadow-purple-100/50 flex items-center justify-center border border-purple-300/20 shadow-sm"
              >
                View Employees
              </button>

              {/* Row 3 */}
              <button 
                onClick={() => setActiveModal('transfer')}
                className="h-[56px] px-4 text-center text-xs font-bold bg-gradient-to-r from-purple-200 to-indigo-200 hover:from-purple-300 hover:to-indigo-300 text-[#3a2072] rounded-[14px] transition-all duration-200 hover:scale-[1.03] hover:shadow-md hover:shadow-purple-100/50 flex items-center justify-center border border-purple-300/20 shadow-sm"
              >
                Transfer Funds
              </button>

              <button 
                onClick={() => setActiveModal('audit')}
                className="h-[56px] px-4 text-center text-xs font-bold bg-gradient-to-r from-purple-200 to-indigo-200 hover:from-purple-300 hover:to-indigo-300 text-[#3a2072] rounded-[14px] transition-all duration-200 hover:scale-[1.03] hover:shadow-md hover:shadow-purple-100/50 flex items-center justify-center border border-purple-300/20 shadow-sm"
              >
                Audit Reports
              </button>
            </div>

            <button 
              onClick={() => setActiveModal('perf')}
              className="w-full h-[56px] px-4 text-center text-xs font-bold bg-gradient-to-r from-purple-200 to-indigo-200 hover:from-purple-300 hover:to-indigo-300 text-[#3a2072] rounded-[14px] transition-all duration-200 hover:scale-[1.03] hover:shadow-md hover:shadow-purple-100/50 flex items-center justify-center border border-purple-300/20 shadow-sm uppercase tracking-wider"
            >
              Performance History
            </button>
          </div>
          </>
          )}

        </div>

      </div>

      {/* 3. Responsive Live Analytics KPI Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCardsList.map((card) => (
          <motion.div
            key={card.id}
            id={`kpi-card-${card.id}`}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(247, 168, 216, 0.25)' }}
            onClick={() => {
              setKpiModalNotification(null);
              setSelectedKpiCardId(card.id);
            }}
            className="h-[140px] p-6 rounded-2xl border-2 border-[#F7A8D8] bg-white text-left flex flex-col justify-between transition-all cursor-pointer box-border overflow-hidden select-none"
            style={{ boxShadow: '0 4px 12px rgba(247, 168, 216, 0.08)' }}
          >
            <div className="flex items-start justify-between gap-2.5 w-full">
              <span className="text-xs font-black text-[#111111] uppercase tracking-wider overflow-wrap-break-word break-words whitespace-normal leading-tight [word-break:break-word] [overflow-wrap:break-word]">
                {card.label}
              </span>
              <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-widest shrink-0 border ${card.badgeStyle}`}>
                {card.badgeText}
              </span>
            </div>

            <div className="mt-2 flex flex-col justify-end">
              <span className="font-mono text-xl font-black text-[#222222] tracking-tight leading-none overflow-wrap-break-word break-words whitespace-normal [word-break:break-word] [overflow-wrap:break-word]">
                {card.valueString}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 4. State-Wise Branch Table */}
      <div className="p-3 sm:p-5 lg:p-6 rounded-2xl border border-pink-200 bg-white shadow-sm shadow-pink-100/50 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-pink-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">State-wise Administrative Terminal Index</h3>
            <p className="text-xs text-[#9D174D]/75">Click a record below to immediately synchronize navigation, focus, and state telemetry map visualization.</p>
          </div>
          
          {/* Search bar helper */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search terminals, state, manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#db2777] font-semibold"
            />
            <Search size={14} className="absolute right-3.5 top-2 text-[#9D174D]/85" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-pink-100 text-[10px] text-[#9D174D]/75 uppercase tracking-wider font-extrabold font-mono">
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Branch Name</th>
                <th className="py-3 px-4">Branch Code</th>
                <th className="py-3 px-4">Branch Manager</th>
                <th className="py-3 px-4 text-center">Employees</th>
                <th className="py-3 px-4 text-center">Customers</th>
                <th className="py-3 px-4 text-right">Deposits Ledger</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50/50 text-xs">
              {filteredBranches.map((b) => {
                const isSelected = selectedBranchId === b.id;
                return (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`cursor-pointer transition-colors duration-150 ${
                      isSelected 
                        ? 'bg-rose-50/50 border-l-4 border-[#db2777] font-semibold text-slate-900' 
                        : 'hover:bg-pink-50/30 text-slate-700'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-black text-[#db2777]">
                      {b.state}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        {b.category === 'Headquarters' ? (
                          <Star size={13} className="fill-[#fbbf24] text-[#fbbf24]" />
                        ) : (
                          <Building2 size={13} className="text-pink-400" />
                        )}
                        {b.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#9D174D]/75 font-extrabold">{b.code}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-medium">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center font-bold text-[9px] text-[#db2777] font-mono">
                          {b.manager.avatarSeed}
                        </div>
                        {b.manager.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-800 font-bold">{b.employeeCount}</td>
                    <td className="py-3.5 px-4 text-center text-slate-800 font-bold">{b.customerCount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCur(b.deposits * tickerMultiplier)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                        b.status === 'Operational' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* 5. Modals Overlays (Functional action buttons) */}
      <AnimatePresence>
        
        {/* VIEW DETAILED OVERLAY */}
        {activeModal === 'view' && (
          <div className="fixed inset-0 bg-[#3a2072]/35 backdrop-blur-[6px] z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-pink-200 p-6 w-[75%] h-[80vh] shadow-xl relative flex flex-col overflow-hidden text-slate-800"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-[#9D174D]/85 hover:text-slate-600 z-10"
              >
                <X size={20} />
              </button>

              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-50 rounded-xl text-[#db2777] border border-pink-100">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 uppercase">{selectedBranch.name} Dossier</h3>
                    <p className="text-xs text-[#9D174D]/75">Established {selectedBranch.openDate} • Standard Code: {selectedBranch.code}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-3 text-xs leading-relaxed text-slate-600">
                  <div className="flex items-center justify-between text-slate-900 font-extrabold border-b pb-2">
                    <span>PARAMETRIC LEVEL</span>
                    <span className="text-[#db2777] uppercase font-mono">{selectedBranch.category}</span>
                  </div>
                  <p>
                    This nodal registry governs high-frequency capital streams traversing Indian currency grids. Built-in security architecture handles local client ledger operations with cryptographic precision.
                  </p>
                  <p>
                    <strong>State Operations Jurisdiction:</strong> {selectedBranch.state} Region Core. All current assets maintain 100% liquified backup aligned with Indian central regulations.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-pink-100 text-[#db2777] font-bold text-center">
                    <span className="text-[10px] text-[#9D174D]/85 block font-normal uppercase">Active Loans Yield</span>
                    {formatCur(selectedBranch.loans)}
                  </div>
                  <div className="p-3 rounded-lg border border-pink-100 text-slate-800 font-bold text-center">
                    <span className="text-[10px] text-[#9D174D]/85 block font-normal uppercase">Deposits Held</span>
                    {formatCur(selectedBranch.deposits)}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 bg-[#FFF1F5] hover:bg-[#FDF2F8] text-[#4A044E] font-bold rounded-xl text-xs uppercase"
                >
                  Terminate Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* COMPLIANCE AUDIT OVERLAY */}
        {activeModal === 'audit' && (
          <div className="fixed inset-0 bg-[#3a2072]/35 backdrop-blur-[6px] z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-pink-200 p-6 w-[75%] h-[80vh] shadow-xl relative flex flex-col overflow-hidden text-slate-800"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-[#9D174D]/85 hover:text-slate-600 z-10"
              >
                <X size={20} />
              </button>

              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-50 rounded-xl text-[#db2777] border border-pink-100">
                    <FileCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 uppercase">Compliance Audit Report</h3>
                    <p className="text-xs text-[#9D174D]/75">Inspection: verified until {selectedBranch.lastAuditDate}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 text-xs space-y-2">
                  <div className="flex justify-between items-center text-emerald-800 font-black">
                    <span>COMPLIANCE STATUS: STABLE</span>
                    <span className="text-[10px]">99.8% ACCURACY score</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Automated terminal reconciliation matches regional ledger values. Verification logs show no unresolved balance anomalies.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#9D174D]/85 block font-bold uppercase">AUDITED METRICS TRACKER</span>
                  <div className="text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Reserve Cash Ratio:</span>
                      <strong className="text-slate-900">4.12% (COMPLIANT)</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>KYC Verification Ratio:</span>
                      <strong className="text-slate-900">100.0% Approved</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Risk Assessment Index:</span>
                      <strong className="text-emerald-600 font-mono">0.02 Deviation</strong>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => console.log("Audit ledger exported to terminal download spooler.")}
                    className="flex-1 py-2.5 border border-pink-200 hover:bg-pink-50 text-[#db2777] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} /> Download Ledger
                  </button>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 bg-[#FFF1F5] hover:bg-[#FDF2F8] text-[#4A044E] font-bold rounded-xl text-xs uppercase"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* BRANCH ANALYTICS RECHARTS CHARTS OVERLAY */}
        {activeModal === 'analytics' && (
          <div className="fixed inset-0 bg-[#3a2072]/35 backdrop-blur-[6px] z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-pink-200 p-6 w-[75%] h-[80vh] shadow-xl relative text-[#1e293b] flex flex-col overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-[#9D174D]/85 hover:text-slate-600 z-10"
              >
                <X size={20} />
              </button>

              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="flex justify-between items-center border-b pb-3 border-pink-50">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 uppercase flex items-center gap-2">
                      <TrendingUp size={18} className="text-[#db2777]" />
                      {selectedBranch.name} Analytical Plots
                    </h3>
                    <p className="text-xs text-[#9D174D]/75">6-Month historical yield, revenue and capital performance projection</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-pink-50 text-[#db2777] px-3 py-1 rounded-full">
                    {selectedBranch.code} Ledger
                  </span>
                </div>

                {/* Plot Area */}
                <div className="h-64 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={profitTrend}
                      margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenuePink" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#db2777" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#db2777" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorProfitEmerald" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        tickFormatter={(v) => `₹${(v / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #fbcfe8', borderRadius: '12px' }}
                        labelStyle={{ color: '#1e293b', fontSize: '11px', fontWeight: 'bold' }}
                        itemStyle={{ fontSize: '10px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="Revenue" 
                        stroke="#db2777" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRevenuePink)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="Profit" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorProfitEmerald)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-6 text-[11px] font-mono font-bold text-[#9D174D]/75 py-2 border-t border-pink-50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-[#db2777]" />
                    <span>TRAVERSING REVENUE</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-[#10b981]" />
                    <span>LIVE PROFITS RATIO</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 bg-[#FFF1F5] hover:bg-[#FDF2F8] text-[#4A044E] font-bold rounded-xl text-xs uppercase"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* VIEW EMPLOYEES GRID OVERLAY */}
        {activeModal === 'employees' && (
          <div className="fixed inset-0 bg-[#3a2072]/35 backdrop-blur-[6px] z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-pink-200 p-6 w-[75%] h-[80vh] shadow-xl relative text-[#1e293b] flex flex-col overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-[#9D174D]/85 hover:text-slate-600 z-10"
              >
                <X size={20} />
              </button>

              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="border-b pb-3 border-pink-50">
                  <h3 className="font-extrabold text-slate-900 uppercase flex items-center gap-2">
                    <Users size={18} className="text-[#db2777]" />
                    Nodal Human Resource Matrix
                  </h3>
                  <p className="text-xs text-[#9D174D]/75">Currently active expert staff stationed at {selectedBranch.name}</p>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {[
                    { name: "Ananya Sharma", role: "Associate Director", rating: 4.8 },
                    { name: "Pranav Iyer", role: "Lead Devops Architect", rating: 4.9 },
                    { name: "Meera Nair", role: "KYC Analyst Specialist", rating: 4.6 },
                    { name: "Vikram Malhotra", role: "Vault Supervisor Officer", rating: 4.7 }
                  ].map((emp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-pink-50 bg-pink-50/10 hover:bg-pink-50/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center font-bold text-xs text-[#db2777] font-mono">
                          {emp.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{emp.name}</p>
                          <p className="text-[10px] text-[#9D174D]/85 font-bold">{emp.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-mono font-bold text-[#db2777] flex items-center gap-0.5 justify-end">
                          <Star size={11} className="fill-[#fbbf24] text-[#fbbf24]" />
                          {emp.rating}
                        </span>
                        <span className="text-[8px] uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded font-black mt-1 block">STABLE REGISTERED</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 bg-[#FFF1F5] hover:bg-[#FDF2F8] text-[#4A044E] font-bold rounded-xl text-xs uppercase"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* VOIP CONTACT DIALING OVERLAY */}
        {activeModal === 'contact' && (
          <div className="fixed inset-0 bg-[#3a2072]/35 backdrop-blur-[6px] z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-pink-200 p-6 w-[75%] h-[80vh] shadow-xl text-center flex flex-col justify-center items-center space-y-6 relative overflow-hidden"
            >
              <button 
                onClick={() => {
                  setVoipActive(false);
                  setActiveModal(null);
                }}
                className="absolute top-4 right-4 text-[#9D174D]/85 hover:text-slate-600 hover:bg-slate-50 p-1 rounded-full"
              >
                <X size={18} />
              </button>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono bg-pink-50 text-[#db2777] border border-pink-100 px-3 py-1 rounded-full font-black uppercase tracking-widest inline-block">
                  SECURE VOIP CLIENT PORT
                </span>
                <p className="text-[10px] text-[#9D174D]/85 font-bold uppercase tracking-wider font-mono">
                  AES-256 SENDER-TUNNEL HOOK
                </p>
              </div>

              {/* Dialing circular avatar */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-pink-50 rounded-full border border-pink-100">
                <div className="absolute -inset-3 rounded-full border border-pink-400/20 animate-ping duration-[2500ms]" />
                <div className="absolute -inset-6 rounded-full border border-pink-300/10 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-[#db2777]/10 border border-[#db2777]/30 flex items-center justify-center font-black text-xl text-[#db2777] font-mono">
                  {selectedBranch.manager.avatarSeed}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-900">{selectedBranch.manager.name}</h4>
                <p className="text-xs text-pink-600 font-bold">Authorized Station Officer</p>
                <p className="text-xs text-[#9D174D]/85 flex items-center justify-center gap-1.5 font-mono">
                  <Volume2 size={13} className="text-[#db2777] animate-bounce" />
                  STATUS: ESTABLISHED STREAM
                </p>
              </div>

              {/* Live dial timer */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-[8px] text-[#9D174D]/85 font-mono font-black uppercase tracking-wider">SECURE LINK BROADCAST SECONDS</div>
                <div className="text-2xl font-mono font-black text-slate-800 tracking-widest">
                  {Math.floor(voipTimer / 60).toString().padStart(2, '0')}:{(voipTimer % 60).toString().padStart(2, '0')}
                </div>
              </div>

              <button 
                onClick={() => {
                  setVoipActive(false);
                  setActiveModal(null);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-[#4A044E] font-bold rounded-xl text-xs uppercase shadow-lg shadow-rose-100"
              >
                Disconnect Stream
              </button>
            </motion.div>
          </div>
        )}

        {/* PERFORMANCE HISTORY OVERLAY */}
        {activeModal === 'perf' && (
          <div className="fixed inset-0 bg-[#3a2072]/35 backdrop-blur-[6px] z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-pink-200 p-6 w-[75%] h-[80vh] shadow-xl relative text-[#1e293b] flex flex-col overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-[#9D174D]/85 hover:text-slate-600 z-10"
              >
                <X size={20} />
              </button>

              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="flex items-center gap-3 border-b pb-3 border-pink-50">
                  <div className="p-3 bg-pink-50 rounded-xl text-[#db2777] border border-pink-100">
                    <History size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 uppercase">Performance History Logs</h3>
                    <p className="text-xs text-[#9D174D]/75">Executive ranking evaluations for {selectedBranch.manager.name}</p>
                  </div>
                </div>

                {/* Plot bars */}
                <div className="p-4 rounded-xl border border-pink-50 bg-pink-50/10 space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9D174D]/75">Operational Margin Yield:</span>
                    <strong className="text-slate-900 font-mono">92.4% Optimal</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#db2777] h-full rounded-full" style={{ width: '92.4%' }} />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9D174D]/75">Local Auditing Level score:</span>
                    <strong className="text-slate-900 font-mono">98% Satisfactory</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#10b981] h-full rounded-full" style={{ width: '98%' }} />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9D174D]/75">Capital growth speed index:</span>
                    <strong className="text-slate-900 font-mono">Stable growth (+4.2%)</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                {/* Live notes dispatcher form inside performance */}
                <form onSubmit={handleDispatchNoteSubmit} className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#9D174D]/85 font-black">
                    <span>LAUNCH EXECUTIVE DIRECTIVE DIRECT</span>
                    <span>PG-9 PROTOCOL LOCK</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={quickNoteType} 
                      onChange={(e) => setQuickNoteType(e.target.value as any)}
                      className="px-2 py-1.5 text-xs rounded border border-pink-200 bg-white"
                    >
                      <option value="Compliance Note">Compliance Note</option>
                      <option value="Urgent Mandate">Urgent Mandate</option>
                      <option value="Performance Warning">Performance Warning</option>
                    </select>
                    <span className="text-xs font-mono text-[#9D174D]/75 flex items-center justify-end font-bold uppercase">{selectedBranch.code} Hook</span>
                  </div>

                  <textarea
                    required
                    value={quickNoteText}
                    onChange={(e) => setQuickNoteText(e.target.value)}
                    placeholder="Input administrative order message..."
                    rows={2}
                    className="w-full p-2.5 text-xs rounded-xl border border-pink-200 outline-none focus:border-[#db2777]"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-emerald-600 font-mono text-[10px] font-bold">
                      {noteSuccessFed ? "Directive dispatched successfully!" : ""}
                    </span>
                    <button 
                      type="submit"
                      className="py-1.5 px-3 bg-[#db2777] text-[#4A044E] font-bold text-xs rounded-lg uppercase"
                    >
                      Dispatch
                    </button>
                  </div>
                </form>

                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 bg-[#FFF1F5] hover:bg-[#FDF2F8] text-[#4A044E] font-bold rounded-xl text-xs uppercase mt-2"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* TRANSFER FUNDS SECURE SIMULATOR */}
        {activeModal === 'transfer' && (
          <div className="fixed inset-0 bg-[#3a2072]/35 backdrop-blur-[6px] z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-pink-200 p-6 w-[75%] h-[80vh] shadow-xl relative text-[#1e293b] flex flex-col overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-[#9D174D]/85 hover:text-slate-600 z-10"
              >
                <X size={20} />
              </button>

              <form onSubmit={handleFundTransferSubmit} className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-50 rounded-xl text-[#db2777] border border-pink-100">
                    <ArrowLeftRight size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 uppercase">Transfer Funds Between Nodes</h3>
                    <p className="text-xs text-[#9D174D]/75">Liquid reserve distribution mechanism</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-pink-50/20 border border-pink-100 space-y-1 text-xs">
                  <p className="text-[#9D174D]/85 font-bold uppercase text-[9px] tracking-wider font-mono">SOURCE COMMAND NODE</p>
                  <p className="font-bold text-slate-800">{selectedBranch.name}</p>
                  <p className="font-mono text-[#9D174D]/85">Available deposits: {formatCur(selectedBranch.deposits)}</p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] text-[#9D174D]/75 font-bold uppercase tracking-wider block mb-1">TARGET RECIPIENT NODE</label>
                    <select
                      value={transferTargetId}
                      onChange={(e) => setTransferTargetId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-white text-xs outline-none font-semibold text-slate-800"
                    >
                      {branches.filter(b => b.id !== selectedBranch.id).map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.state})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#9D174D]/75 font-bold uppercase tracking-wider block mb-1">TRANSFER IN-FLOW AMOUNT (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 font-bold text-[#9D174D]/85 font-mono">₹</span>
                      <input
                        type="number"
                        required
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 rounded-xl border border-pink-200 outline-none focus:border-[#db2777] text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {transferSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 font-mono text-[10px] text-center">
                    ✔ LIQUIDITY SHIFT AUTHORIZED SECURELY! METRICS UPDATING IN BACKGROUND.
                  </div>
                )}

                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-1.5 border border-pink-200 text-[#9D174D]/75 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-1.5 bg-[#db2777] text-[#4A044E] font-bold rounded-lg text-xs uppercase shadow-sm"
                  >
                    Authorize Shift
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* 4. Centered High Fidelity KPI Statistics Details Modal */}
        {(() => {
          const selectedKpi = kpiCardsList.find(c => c.id === selectedKpiCardId);
          if (!selectedKpi) return null;

          return (
            <div className="fixed inset-0 bg-[#3a2072]/60 backdrop-blur-[8px] flex items-center justify-center p-4 z-[9999]" onClick={() => setSelectedKpiCardId(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative max-w-[700px] w-full bg-white border-2 border-[#F7A8D8] rounded-[24px] p-8 shadow-[0_12px_40px_rgba(247,168,216,0.3)] text-[#111111] overflow-hidden box-border max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Section */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-[#F7A8D8]/50">
                  <div>
                    <span className={`px-2.5 py-0.5 text-[9px] font-black rounded uppercase tracking-wider border mb-1.5 inline-block ${selectedKpi.badgeStyle}`}>
                      {selectedKpi.badgeText}
                    </span>
                    <h3 className="text-xl font-black text-[#111111] uppercase tracking-wide">
                      {selectedKpi.details.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedKpiCardId(null)}
                    className="p-2 rounded-full hover:bg-pink-50 border border-slate-200 transition-colors cursor-pointer text-[#111111] hover:text-pink-600 shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Notification Area (Replaces blocking alert APIs) */}
                {kpiModalNotification && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-xl bg-pink-50 border border-[#F7A8D8]/45 text-pink-700 font-mono text-[10.5px] text-left uppercase font-bold tracking-tight"
                  >
                    {kpiModalNotification}
                  </motion.div>
                )}

                {/* Universal Information Grid - 35% / 65% Column Layout */}
                <div className="space-y-4 py-6">
                  
                  <div className="flex flex-col sm:flex-row items-baseline gap-2 py-2.5 border-b border-[#F7A8D8]/30">
                    <span className="w-full sm:w-[35%] text-[#111111] font-bold text-left tracking-wide select-none shrink-0 min-w-[180px]">
                      Total Amount:
                    </span>
                    <span className="w-full sm:w-[65%] text-[#222222] font-mono font-black text-left leading-normal break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal text-lg">
                      {selectedKpi.details.totalAmount}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-baseline gap-2 py-2.5 border-b border-[#F7A8D8]/30">
                    <span className="w-full sm:w-[35%] text-[#111111] font-bold text-left tracking-wide select-none shrink-0 min-w-[180px]">
                      Monthly Growth:
                    </span>
                    <span className="w-full sm:w-[65%] text-emerald-600 font-mono font-extrabold text-left leading-normal break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">
                      {selectedKpi.details.monthlyGrowth}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-baseline gap-2 py-2.5 border-b border-[#F7A8D8]/30">
                    <span className="w-full sm:w-[35%] text-[#111111] font-bold text-left tracking-wide select-none shrink-0 min-w-[180px]">
                      Contributing Branches:
                    </span>
                    <span className="w-full sm:w-[65%] text-[#222222] font-bold text-left leading-normal break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">
                      {selectedKpi.details.contributingBranches} branches contributing active ledger data
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-baseline gap-2 py-2.5 border-b border-[#F7A8D8]/30">
                    <span className="w-full sm:w-[35%] text-[#111111] font-bold text-left tracking-wide select-none shrink-0 min-w-[180px]">
                      Top Region:
                    </span>
                    <span className="w-full sm:w-[65%] text-[#222222] font-medium text-left leading-normal break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">
                      {selectedKpi.details.topRegion}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-baseline gap-2 py-2.5 border-b border-[#F7A8D8]/30">
                    <span className="w-full sm:w-[35%] text-[#111111] font-bold text-left tracking-wide select-none shrink-0 min-w-[180px]">
                      Last Updated:
                    </span>
                    <span className="w-full sm:w-[65%] text-[#555555] font-mono font-bold text-left leading-normal break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">
                      {selectedKpi.details.lastUpdated}
                    </span>
                  </div>

                </div>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#F7A8D8]/40">
                  <button
                    type="button"
                    onClick={() => {
                      setKpiModalNotification("✔ SECURE ANALYTICS CORE INITIALIZED! PARSING DEEP METRICS GRAPH...");
                    }}
                    className="py-2.5 px-5 bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-[#4A044E] rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md"
                  >
                    View Analytics
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setKpiModalNotification("✔ REPORT BUNDLED SECURELY! CRYPTOGRAPHIC EXPORT COMPLETED FOR ADM-2 LEVEL.");
                    }}
                    className="py-2.5 px-5 bg-white hover:bg-slate-50 border border-[#F7A8D8] text-[#111111] rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
                  >
                    Download Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedKpiCardId(null)}
                    className="py-2.5 px-5 bg-slate-150 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Close
                  </button>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
