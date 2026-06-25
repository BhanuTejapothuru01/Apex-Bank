import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  CreditCard as CardIcon, 
  Lock, 
  Unlock, 
  Plus, 
  Sliders, 
  Trash2, 
  CheckCircle2,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Ban,
  User,
  Briefcase,
  Filter,
  Download,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building,
  AlertTriangle,
  Award,
  ChevronRight,
  Info,
  Calendar,
  DollarSign,
  FileText,
  Activity,
  History,
  AlertCircle,
  ArrowUpRight,
  ShieldAlert,
  Terminal,
  LayoutDashboard,
  Globe,
  Wallet,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { CreditCard } from '../types/dashboard';

interface CreditCardsProps {
  cards: CreditCard[];
  setCards: (cards: CreditCard[]) => void;
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

// Complete embedded master dataset containing exhaustive attributes to satisfy all filter combinations, details, sub-sections, etc.
const MasterCreditCardDetails: CreditCard[] = [
  {
    id: "CARD-4401",
    customerId: "CUST-802",
    customerName: "Alistair Sterling",
    cardNumber: "4001 8829 0192 4821",
    limit: 2000000,
    balance: 85200,
    status: "Active",
    expiryDate: "2029-12",
    isEmployee: false,
    cardType: "Visa Infinite",
    cardCategory: "Customer",
    availableLimit: 1914800,
    outstandingBalance: 85200,
    mobileNumber: "+91 98450 11223",
    emailAddress: "a.sterling@sterling-holdings.co.uk",
    linkedAccountNumber: "ACT-902148201",
    accountType: "Wealth Private Account",
    accountBalance: 105441010,
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    branchManagerName: "Mohammed Rahman",
    branchManagerEmployeeId: "EMP-0007",
    branchManagerDesignation: "Branch Manager",
    branchManagerMobile: "+91 99012 34567",
    branchManagerEmail: "m.rahman@apexbank.com",
    cardIssuedByName: "Sarah Jenkins",
    cardIssuedByEmployeeId: "EMP-001",
    cardIssuedByDesignation: "Senior Compliance Officer",
    cardIssueDate: "12 June 2026",
    cardIssueTime: "10:45:32 AM IST",
    cardActivationDate: "14 June 2026",
    cardActivationTime: "11:20:15 AM IST",
    cardActivatedByName: "Sarah Jenkins",
    approvedByName: "Chloe Dupont",
    approvalRole: "Senior Loan Underwriter",
    approvalDate: "13 June 2026",
    approvalTime: "09:15:00 AM IST",
    creditScore: 780,
    creditRating: "Excellent",
    creditUtilizationRatio: 4,
    paymentHistory: { onTime: 48, missed: 0, delayed: 1 },
    riskProfile: "Low Risk",
    creditHealthTrend: [740, 750, 755, 762, 770, 780],
    creditAnalytics: {
      monthlySpending: 125000,
      yearlySpending: 1540000,
      avgTransaction: 8500,
      highestTransaction: 154900,
      lowestTransaction: 120,
      totalTransactions: 142
    },
    cardActivity: {
      lastTransaction: { date: "2026-06-12", time: "04:12 PM", amount: 4500, location: "Tata Power Grid, Hyderabad" },
      lastATM: { date: "2026-06-08", time: "02:30 PM", amount: 10000, location: "Apex Bank ATM, Banjara Hills" },
      lastOnline: { date: "2026-06-10", time: "02:45 PM", amount: 154900, location: "Apple Store India HQ" },
      lastPOS: { date: "2026-06-11", time: "09:30 AM", amount: 12000, location: "Grand Hyatt Hyderabad" },
      lastInternational: { date: "2026-05-20", time: "11:15 AM", amount: 45000, location: "Lufthansa AG, Frankfurt" }
    },
    riskAssessment: {
      fraudRiskScore: 12,
      creditHealthStatus: 'Good',
      repaymentPerformance: "Excellent - 100% On-time",
      emiPerformance: "Stable",
      missedPaymentsCount: 0
    },
    paymentSummary: {
      totalOutstandingBalance: 85200,
      dueAmount: 12500,
      nextPaymentDate: "2026-07-05",
      minimumDue: 2500,
      lastPaymentDate: "2026-06-05",
      lastPaymentAmount: 48000
    },
    cardTransactions: [
      { id: "TX-40102", type: "Utility", merchant: "Tata Power Grid", amount: 4500, date: "2026-06-12", time: "04:12:00 PM IST", status: "Completed" },
      { id: "TX-40103", type: "Travel", merchant: "Grand Hyatt Hyderabad", amount: 12000, date: "2026-06-11", time: "09:30:15 AM IST", status: "Completed" },
      { id: "TX-40104", type: "Purchase", merchant: "Apple Store India HQ", amount: 154900, date: "2026-06-10", time: "02:45:00 PM IST", status: "Completed" },
      { id: "TX-40105", type: "Subscription", merchant: "Bloomberg Finance LP", amount: 24000, date: "2026-06-05", time: "11:00:00 AM IST", status: "Completed" }
    ],
    cardTimeline: [
      { id: "1", event: "Card Requested", date: "2026-06-08", time: "09:00:00 AM IST", employee: "Customer Self-Service", remarks: "Digital application submitted via VIP portal." },
      { id: "2", event: "Verification Completed", date: "2026-06-09", time: "02:30:00 PM IST", employee: "Sarah Jenkins (EMP-001)", remarks: "Biometrics and collateral assets verified." },
      { id: "3", event: "Card Approved", date: "2026-06-10", time: "11:20:00 AM IST", employee: "Chloe Dupont (EMP-092)", remarks: "Authorized private limit parameter set." },
      { id: "4", event: "Card Issued", date: "2026-06-12", time: "10:45:32 AM IST", employee: "System Courier Desk", remarks: "Mailed with high security dynamic CVV parameters." },
      { id: "5", event: "Card Activated", date: "2026-06-14", time: "11:20:15 AM IST", employee: "Sarah Jenkins (EMP-001)", remarks: "NFC client interface handshake activated." }
    ]
  },
  {
    id: "CARD-5511",
    customerId: "CUST-415",
    customerName: "Elena Rostova",
    cardNumber: "5109 4432 1192 8823",
    limit: 1000000,
    balance: 245000,
    status: "Active",
    expiryDate: "2028-08",
    isEmployee: false,
    cardType: "Mastercard Platinum",
    cardCategory: "Customer",
    availableLimit: 755000,
    outstandingBalance: 245000,
    mobileNumber: "+91 91234 56789",
    emailAddress: "elena.rostova@rostova-wealth.com",
    linkedAccountNumber: "ACT-88124011",
    accountType: "Premium Privilege Account",
    accountBalance: 14250000,
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    branchManagerName: "Mohammed Rahman",
    branchManagerEmployeeId: "EMP-0007",
    branchManagerDesignation: "Branch Manager",
    branchManagerMobile: "+91 99012 34567",
    branchManagerEmail: "m.rahman@apexbank.com",
    cardIssuedByName: "Sarah Jenkins",
    cardIssuedByEmployeeId: "EMP-001",
    cardIssuedByDesignation: "Senior Compliance Officer",
    cardIssueDate: "10 May 2026",
    cardIssueTime: "02:30:15 PM IST",
    cardActivationDate: "12 May 2026",
    cardActivationTime: "09:12:00 AM IST",
    cardActivatedByName: "Sarah Jenkins",
    approvedByName: "Maximilian Kael",
    approvalRole: "Branch Director",
    approvalDate: "11 May 2026",
    approvalTime: "11:00:25 AM IST",
    creditScore: 810,
    creditRating: "Excellent",
    creditUtilizationRatio: 24,
    paymentHistory: { onTime: 36, missed: 0, delayed: 0 },
    riskProfile: "Low Risk",
    creditHealthTrend: [790, 800, 802, 805, 808, 810],
    creditAnalytics: {
      monthlySpending: 450000,
      yearlySpending: 4800000,
      avgTransaction: 15000,
      highestTransaction: 850000,
      lowestTransaction: 500,
      totalTransactions: 215
    },
    cardActivity: {
      lastTransaction: { date: "2026-06-12", time: "11:15 AM", amount: 45000, location: "Air India Corporate, Delhi" },
      lastATM: { date: "2026-06-10", time: "05:45 PM", amount: 25000, location: "Apex Bank ATM, Gachibowli" },
      lastOnline: { date: "2026-06-11", time: "10:30 AM", amount: 12500, location: "Amazon LUX India" },
      lastPOS: { date: "2026-06-11", time: "06:12 PM", amount: 185000, location: "Tanishq Flagship, Hyderabad" },
      lastInternational: { date: "2026-05-15", time: "09:00 AM", amount: 120000, location: "Emirates Lounge, Dubai" }
    },
    riskAssessment: {
      fraudRiskScore: 5,
      creditHealthStatus: 'Good',
      repaymentPerformance: "Perfect - No Delays",
      emiPerformance: "Premium Level",
      missedPaymentsCount: 0
    },
    paymentSummary: {
      totalOutstandingBalance: 245000,
      dueAmount: 48000,
      nextPaymentDate: "2026-07-10",
      minimumDue: 5000,
      lastPaymentDate: "2026-06-10",
      lastPaymentAmount: 120000
    },
    cardTransactions: [
      { id: "TX-40106", type: "Travel", merchant: "Air India Corporate Flight", amount: 45000, date: "2026-06-12", time: "11:15:22 AM IST", status: "Completed" },
      { id: "TX-40107", type: "Purchase", merchant: "Tanishq Flagship store", amount: 185000, date: "2026-06-11", time: "06:12:44 PM IST", status: "Completed" },
      { id: "TX-40108", type: "Purchase", merchant: "Oberoi luxury dinner", amount: 15000, date: "2026-06-08", time: "09:40:00 PM IST", status: "Completed" }
    ],
    cardTimeline: [
      { id: "1", event: "Card Requested", date: "2026-05-05", time: "10:15:00 AM IST", employee: "Customer Web Console", remarks: "Requested upgrade from Signature limit parameters." },
      { id: "2", event: "Verification Completed", date: "2026-05-06", time: "03:45:00 PM IST", employee: "Sarah Jenkins (EMP-001)", remarks: "Income assets parameters verified successfully." },
      { id: "3", event: "Card Approved", date: "2026-05-08", time: "09:00:00 AM IST", employee: "Maximilian Kael (EMP-014)", remarks: "Limit extension override verified." },
      { id: "4", event: "Card Issued", date: "2026-05-10", time: "02:30:00 PM IST", employee: "Direct Security Dispatch", remarks: "Dispatched package via tracked courier." },
      { id: "5", event: "Card Activated", date: "2026-05-12", time: "09:12:00 AM IST", employee: "Sarah Jenkins (EMP-001)", remarks: "Security authentication positive." }
    ]
  },
  {
    id: "CARD-3312",
    customerId: "CUST-293",
    customerName: "Marcus Vance",
    cardNumber: "4532 9901 2283 1152",
    limit: 500000,
    balance: 421000,
    status: "Blocked",
    expiryDate: "2027-04",
    isEmployee: false,
    cardType: "Visa Signature",
    cardCategory: "Customer",
    availableLimit: 79000,
    outstandingBalance: 421000,
    mobileNumber: "+91 97711 77221",
    emailAddress: "marcus.vance@vancetech.io",
    linkedAccountNumber: "ACT-11440029",
    accountType: "Standard Current Account",
    accountBalance: 2110400,
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    branchManagerName: "Mohammed Rahman",
    branchManagerEmployeeId: "EMP-0007",
    branchManagerDesignation: "Branch Manager",
    branchManagerMobile: "+91 99012 34567",
    branchManagerEmail: "m.rahman@apexbank.com",
    cardIssuedByName: "Sarah Jenkins",
    cardIssuedByEmployeeId: "EMP-001",
    cardIssuedByDesignation: "Senior Compliance Officer",
    cardIssueDate: "11 April 2025",
    cardIssueTime: "11:32:00 AM IST",
    cardActivationDate: "14 April 2025",
    cardActivationTime: "04:12:00 PM IST",
    cardActivatedByName: "Sarah Jenkins",
    approvedByName: "Vikram Naidu",
    approvalRole: "Lead Security Architect",
    approvedByEmployeeId: "EMP-045",
    approvalDate: "12 April 2025",
    approvalTime: "05:00:00 PM IST",
    creditScore: 610,
    creditRating: "Average",
    creditUtilizationRatio: 84,
    paymentHistory: { onTime: 15, missed: 2, delayed: 4 },
    riskProfile: "High Risk",
    creditHealthTrend: [650, 642, 630, 622, 615, 610],
    cardTransactions: [
      { id: "TX-40109", type: "Purchase", merchant: "Amazon Cloud Web Services", amount: 421000, date: "2026-06-12", time: "01:05:00 AM IST", status: "Suspicious" }
    ],
    cardTimeline: [
      { id: "1", event: "Card Requested", date: "2025-04-05", time: "09:00:00 AM IST", employee: "Customer Self-Service", remarks: "Applied for Corporate Limit parameter card." },
      { id: "2", event: "Verification Completed", date: "2025-04-06", time: "11:22:00 AM IST", employee: "Sarah Jenkins (EMP-001)", remarks: "Corporate registration logs authenticated." },
      { id: "3", event: "Card Approved", date: "2025-04-08", time: "05:00:00 PM IST", employee: "Vikram Naidu (EMP-045)", remarks: "System parameters approved for security ops." },
      { id: "4", event: "Card Issued", date: "2025-04-11", time: "11:32:00 AM IST", employee: "HQ IT Dispatch", remarks: "Tracked security transport initiated." },
      { id: "5", event: "Card Activated", date: "2025-04-14", time: "04:12:00 PM IST", employee: "Direct Portal Ops", remarks: "Client verified and active." }
    ]
  },
  {
    id: "CARD-9918",
    customerId: "CUST-901",
    customerName: "Kenji Takahashi",
    cardNumber: "4820 1192 4810 5920",
    limit: 5000000,
    balance: 0,
    status: "Active",
    expiryDate: "2031-10",
    isEmployee: false,
    cardType: "Visa Infinite",
    cardCategory: "Customer",
    availableLimit: 5000000,
    outstandingBalance: 0,
    mobileNumber: "+81 90 4482 1192",
    emailAddress: "kenji.t@takahashi-venture.jp",
    linkedAccountNumber: "ACT-550121102",
    accountType: "Apex Private Reserve",
    accountBalance: 254110200,
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    branchManagerName: "Mohammed Rahman",
    branchManagerEmployeeId: "EMP-0007",
    branchManagerDesignation: "Branch Manager",
    branchManagerMobile: "+91 99012 34567",
    branchManagerEmail: "m.rahman@apexbank.com",
    cardIssuedByName: "Sarah Jenkins",
    cardIssuedByEmployeeId: "EMP-001",
    cardIssuedByDesignation: "Senior Compliance Officer",
    cardIssueDate: "15 January 2026",
    cardIssueTime: "09:30:15 AM IST",
    cardActivationDate: "18 January 2026",
    cardActivationTime: "11:15:32 AM IST",
    cardActivatedByName: "Sarah Jenkins",
    approvedByName: "Executive Board Node",
    approvalRole: "Premium Underwriting Lead",
    approvalDate: "16 January 2026",
    approvalTime: "11:00:00 AM IST",
    creditScore: 850,
    creditRating: "Excellent",
    creditUtilizationRatio: 0,
    paymentHistory: { onTime: 72, missed: 0, delayed: 0 },
    riskProfile: "Low Risk",
    creditHealthTrend: [840, 842, 845, 848, 850, 850],
    cardTransactions: [],
    cardTimeline: [
      { id: "1", event: "Card Requested", date: "2026-01-11", time: "09:00:00 AM IST", employee: "Premium Advisory Unit", remarks: "Venture group advisory card request." },
      { id: "2", event: "Verification Completed", date: "2026-01-14", time: "02:30:00 PM IST", employee: "Sarah Jenkins (EMP-001)", remarks: "KYC and global balance sheet check positive." },
      { id: "3", event: "Card Approved", date: "2026-01-16", time: "11:00:00 AM IST", employee: "Underwriters Union", remarks: "$5,000,000 Private Reserve authorized." },
      { id: "4", event: "Card Issued", date: "2026-01-17", time: "04:30:00 PM IST", employee: "Apex Concierge Desk", remarks: "Hand-delivered to private executive lounge." },
      { id: "5", event: "Card Activated", date: "2026-01-18", time: "11:15:32 AM IST", employee: "Sarah Jenkins (EMP-001)", remarks: "Cryptographic PIN handshake configured." }
    ]
  },
  {
    id: "CARD-0012",
    customerId: "EMP-001",
    customerName: "Sarah Jenkins",
    cardNumber: "4001 5562 8821 9901",
    limit: 1500000,
    balance: 80000,
    status: "Active",
    expiryDate: "2030-05",
    isEmployee: true,
    cardType: "Corporate Card",
    cardCategory: "Employee",
    availableLimit: 1420000,
    outstandingBalance: 80000,
    mobileNumber: "+91 99441 22334",
    emailAddress: "s.jenkins@apexbank.com",
    linkedAccountNumber: "ACT-EMP-0012",
    accountType: "Salary Cards",
    accountBalance: 372500,
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    branchManagerName: "Mohammed Rahman",
    branchManagerEmployeeId: "EMP-0007",
    branchManagerDesignation: "Branch Manager",
    branchManagerMobile: "+91 99012 34567",
    branchManagerEmail: "m.rahman@apexbank.com",
    cardIssuedByName: "Vikram Naidu",
    cardIssuedByEmployeeId: "EMP-045",
    cardIssuedByDesignation: "Lead Security Architect",
    cardIssueDate: "10 June 2025",
    cardIssueTime: "04:30:00 PM IST",
    cardActivationDate: "11 June 2025",
    cardActivationTime: "09:00:00 AM IST",
    cardActivatedByName: "Sarah Jenkins (Self)",
    approvedByName: "Chief Operating Officer",
    approvalRole: "COO Executive Support",
    approvalDate: "09 June 2025",
    approvalTime: "02:00:00 PM IST",
    creditScore: 805,
    creditRating: "Excellent",
    creditUtilizationRatio: 5,
    paymentHistory: { onTime: 30, missed: 0, delayed: 0 },
    riskProfile: "Low Risk",
    creditHealthTrend: [790, 792, 794, 798, 802, 805],
    cardTransactions: [
      { id: "TX-40110", type: "Utility", merchant: "Amazon Elastic Cloud Operations", amount: 7200, date: "2026-06-12", time: "05:12:00 PM IST", status: "Completed" },
      { id: "TX-40111", type: "Travel", merchant: "Taj Krishna Hyderabad Suite", amount: 1450, date: "2026-06-10", time: "08:15:00 PM IST", status: "Completed" }
    ],
    cardTimeline: [
      { id: "1", event: "Card Requested", date: "2025-06-05", time: "10:00:00 AM IST", employee: "HR Compensation Desk", remarks: "Operational Corporate Card limit requested." },
      { id: "2", event: "Verification Completed", date: "2025-06-07", time: "02:00:00 PM IST", employee: "Internal Security Audit", remarks: "Credentials audited and approved." },
      { id: "3", event: "Card Approved", date: "2025-06-09", time: "04:30:00 PM IST", employee: "COO Board Lounge", remarks: "Allocations allowed and initial caps authorized." },
      { id: "4", event: "Card Issued", date: "2025-06-10", time: "04:30:00 PM IST", employee: "HQ Operations Desk", remarks: "Card generated and given to courier." },
      { id: "5", event: "Card Activated", date: "2025-06-11", time: "09:00:00 AM IST", employee: "Sarah Jenkins", remarks: "Secured physical login verification." }
    ]
  },
  {
    id: "CARD-0142",
    customerId: "EMP-014",
    customerName: "Maximilian Kael",
    cardNumber: "4232 4432 1192 8821",
    limit: 2500000,
    balance: 150000,
    status: "Active",
    expiryDate: "2029-02",
    isEmployee: true,
    cardType: "Business Card",
    cardCategory: "Employee",
    availableLimit: 2350000,
    outstandingBalance: 150000,
    mobileNumber: "+41 44 231 0021",
    emailAddress: "m.kael@apexbank.com",
    linkedAccountNumber: "ACT-EMP-0140",
    accountType: "Executive Benefit Account",
    accountBalance: 891200,
    branchName: "Zurich Branch",
    branchCode: "BR-ZH-01",
    branchLocation: "Zurich, Switzerland",
    branchManagerName: "Maximilian Kael",
    branchManagerEmployeeId: "EMP-014",
    branchManagerDesignation: "Zurich Branch Director",
    branchManagerMobile: "+41 44 231 0021",
    branchManagerEmail: "m.kael@apexbank.com",
    cardIssuedByName: "Corporate Security Zurich",
    cardIssuedByEmployeeId: "EMP-ZH-90",
    cardIssuedByDesignation: "Regional IT Admin",
    cardIssueDate: "15 February 2025",
    cardIssueTime: "09:00:00 AM IST",
    cardActivationDate: "16 February 2025",
    cardActivationTime: "11:30:00 AM IST",
    cardActivatedByName: "Maximilian Kael",
    approvedByName: "Executive VP of Wealth",
    approvalRole: "VP Asset Management",
    approvalDate: "14 February 2025",
    approvalTime: "02:00:00 PM IST",
    creditScore: 825,
    creditRating: "Excellent",
    creditUtilizationRatio: 6,
    paymentHistory: { onTime: 42, missed: 0, delayed: 0 },
    riskProfile: "Low Risk",
    creditHealthTrend: [810, 815, 820, 822, 824, 825],
    cardTransactions: [
      { id: "TX-40112", type: "Travel", merchant: "Lufthansa AG Premium Executive", amount: 3200, date: "2026-06-11", time: "02:11:00 PM IST", status: "Completed" }
    ],
    cardTimeline: [
      { id: "1", event: "Card Requested", date: "2025-02-10", time: "09:00:00 AM IST", employee: "Executive Desk Zurich", remarks: "Operational card requested." }
    ]
  },
  {
    id: "CARD-0453",
    customerId: "EMP-045",
    customerName: "Vikram Naidu",
    cardNumber: "5109 8812 0019 9021",
    limit: 800000,
    balance: 15000,
    status: "Active",
    expiryDate: "2028-11",
    isEmployee: true,
    cardType: "Premium Card",
    cardCategory: "Employee",
    availableLimit: 785000,
    outstandingBalance: 15000,
    mobileNumber: "+91 99014 55667",
    emailAddress: "v.naidu@apexbank.com",
    linkedAccountNumber: "ACT-EMP-0451",
    accountType: "Salary Cards",
    accountBalance: 254000,
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    branchManagerName: "Mohammed Rahman",
    branchManagerEmployeeId: "EMP-0007",
    branchManagerDesignation: "Branch Manager",
    branchManagerMobile: "+91 99012 34567",
    branchManagerEmail: "m.rahman@apexbank.com",
    cardIssuedByName: "Sarah Jenkins",
    cardIssuedByEmployeeId: "EMP-001",
    cardIssuedByDesignation: "Senior Compliance Officer",
    cardIssueDate: "02 November 2025",
    cardIssueTime: "10:30:00 AM IST",
    cardActivationDate: "03 November 2025",
    cardActivationTime: "02:45:00 PM IST",
    cardActivatedByName: "Vikram Naidu",
    approvedByName: "Internal Risk Committee Node",
    approvalRole: "Officer Assessment Desk",
    approvalDate: "01 November 2025",
    approvalTime: "11:15:00 AM IST",
    creditScore: 790,
    creditRating: "Excellent",
    creditUtilizationRatio: 2,
    paymentHistory: { onTime: 24, missed: 0, delayed: 0 },
    riskProfile: "Low Risk",
    creditHealthTrend: [775, 780, 782, 785, 788, 790],
    cardTransactions: [
      { id: "TX-40113", type: "Purchase", merchant: "Slack Enterprise License", amount: 112000, date: "2026-06-12", time: "09:15:00 AM IST", status: "Completed" }
    ],
    cardTimeline: [
      { id: "1", event: "Card Requested", date: "2025-10-25", time: "10:00:00 AM IST", employee: "Internal Network Security", remarks: "Requested dynamic software licensing support card." }
    ]
  },
  {
    id: "CARD-0924",
    customerId: "EMP-092",
    customerName: "Chloe Dupont",
    cardNumber: "4001 9023 1184 0012",
    limit: 600000,
    balance: 10000,
    status: "Pending Activation",
    expiryDate: "2031-06",
    isEmployee: true,
    cardType: "Mastercard Platinum",
    cardCategory: "Employee",
    availableLimit: 590000,
    outstandingBalance: 10000,
    mobileNumber: "+33 1 4220 0192",
    emailAddress: "c.dupont@apexbank.com",
    linkedAccountNumber: "ACT-EMP-0925",
    accountType: "Salary Cards",
    accountBalance: 188400,
    branchName: "London Branch",
    branchCode: "BR-LDN-02",
    branchLocation: "London, United Kingdom",
    branchManagerName: "Eleanor Vance",
    branchManagerEmployeeId: "EMP-0021",
    branchManagerDesignation: "London Regional Director",
    branchManagerMobile: "+44 20 7946 0192",
    branchManagerEmail: "e.vance@apexbank.com",
    cardIssuedByName: "Sarah Jenkins",
    cardIssuedByEmployeeId: "EMP-001",
    cardIssuedByDesignation: "Senior Compliance Officer",
    cardIssueDate: "10 June 2026",
    cardIssueTime: "11:30:15 AM IST",
    cardActivationDate: "N/A",
    cardActivationTime: "N/A",
    cardActivatedByName: "N/A",
    approvedByName: "Sarah Jenkins",
    approvalRole: "Compliance Assessor",
    approvalDate: "10 June 2026",
    approvalTime: "10:15:00 AM IST",
    creditScore: 740,
    creditRating: "Very Good",
    creditUtilizationRatio: 2,
    paymentHistory: { onTime: 11, missed: 1, delayed: 0 },
    riskProfile: "Medium Risk",
    creditHealthTrend: [730, 735, 740, 740, 740, 740],
    cardTransactions: [],
    cardTimeline: [
      { id: "1", event: "Card Requested", date: "2026-06-05", time: "09:15:00 AM IST", employee: "Chloe Dupont", remarks: "Requested salary account overdraft security line." }
    ]
  },
  {
    id: "SUPER-OFFICIAL",
    customerId: "ADMIN-001",
    customerName: "SUPER USER - EXECUTIVE HQ",
    cardNumber: "4820 9011 2288 3344",
    limit: 50000000,
    balance: 2750000,
    status: "Active",
    expiryDate: "2032-06",
    isEmployee: true,
    cardType: "Executive Card",
    cardCategory: "Super Admin",
    availableLimit: 47250000,
    outstandingBalance: 2750000,
    mobileNumber: "+91 88888 77777",
    emailAddress: "admin.hq@apexbank.com",
    linkedAccountNumber: "ACT-ADMIN-999",
    accountType: "Treasury Master Account",
    accountBalance: 995400000,
    branchName: "Apex Global HQ",
    branchCode: "HQ-001",
    branchLocation: "Mumbai, Maharashtra",
    branchManagerName: "Chief Executive Node",
    branchManagerEmployeeId: "EX-001",
    branchManagerDesignation: "Supreme Director",
    branchManagerMobile: "+91 88888 11111",
    branchManagerEmail: "ceo@apexbank.com",
    cardIssuedByName: "Board Council",
    cardIssuedByEmployeeId: "BOARD-01",
    cardIssuedByDesignation: "Strategic Oversight",
    cardIssueDate: "01 May 2026",
    cardIssueTime: "08:00:00 AM IST",
    cardActivationDate: "02 May 2026",
    cardActivationTime: "10:00:00 AM IST",
    cardActivatedByName: "Self (Authorized)",
    approvedByName: "Global Security Hub",
    approvalRole: "Network Core Admin",
    approvalDate: "30 April 2026",
    approvalTime: "11:59:00 PM IST",
    creditScore: 900,
    creditRating: "Perfect",
    creditUtilizationRatio: 5.5,
    paymentHistory: { onTime: 120, missed: 0, delayed: 0 },
    riskProfile: "Zero Risk",
    creditHealthTrend: [900, 900, 900, 900, 900, 900],
    creditAnalytics: {
      monthlySpending: 2500000,
      yearlySpending: 28000000,
      avgTransaction: 450000,
      highestTransaction: 10000000,
      lowestTransaction: 500,
      totalTransactions: 842
    },
    cardActivity: {
      lastTransaction: { date: "2026-06-12", time: "09:00 AM", amount: 10000000, location: "Treasury Clearing Node" },
      lastATM: { date: "2026-06-10", time: "02:00 PM", amount: 500000, location: "Global HQ Vault" },
      lastOnline: { date: "2026-06-11", time: "11:00 AM", amount: 25000, location: "SWIFT Secure Channel" },
      lastPOS: { date: "2026-06-12", time: "04:00 PM", amount: 15000, location: "Executive Lounge" },
      lastInternational: { date: "2026-05-30", time: "10:00 AM", amount: 2500000, location: "World Bank Node" }
    },
    riskAssessment: {
      fraudRiskScore: 0,
      creditHealthStatus: 'Good',
      repaymentPerformance: "Native Sovereign",
      emiPerformance: "Locked",
      missedPaymentsCount: 0
    },
    paymentSummary: {
      totalOutstandingBalance: 2750000,
      dueAmount: 0,
      nextPaymentDate: "2026-07-01",
      minimumDue: 0,
      lastPaymentDate: "2026-06-01",
      lastPaymentAmount: 5000000
    },
    cardTransactions: [
      { id: "TX-ADMIN-01", type: "Treasury", merchant: "Bank Liquidity Node", amount: 10000000, date: "2026-06-12", time: "09:00:00 AM IST", status: "Completed" }
    ],
    cardTimeline: [
      { id: "1", event: "Node Creation", date: "2026-05-01", time: "08:00:00 AM IST", employee: "System Genesis", remarks: "Master ID issued for strategic ops." }
    ]
  },
  {
    id: "SUPER-PERSONAL",
    customerId: "ADMIN-001-P",
    customerName: "SUPER ADMIN PERSONAL",
    cardNumber: "4232 9911 0048 1192",
    limit: 2500000,
    balance: 87500,
    status: "Active",
    expiryDate: "2030-12",
    isEmployee: true,
    cardType: "Sovereign Personal",
    cardCategory: "Super Admin",
    availableLimit: 2412500,
    outstandingBalance: 87500,
    mobileNumber: "+91 88888 77777",
    emailAddress: "admin.private@apexbank.com",
    linkedAccountNumber: "ACT-ADMIN-777",
    accountType: "Private Reserve Account",
    accountBalance: 12400000,
    branchName: "Apex Global HQ",
    branchCode: "HQ-001",
    branchLocation: "Mumbai, Maharashtra",
    branchManagerName: "Chief Executive Node",
    branchManagerEmployeeId: "EX-001",
    branchManagerDesignation: "Supreme Director",
    branchManagerMobile: "+91 88888 11111",
    branchManagerEmail: "ceo@apexbank.com",
    cardIssuedByName: "HR Regional Lead",
    cardIssuedByEmployeeId: "HR-002",
    cardIssuedByDesignation: "Senior Lead",
    cardIssueDate: "10 January 2026",
    cardIssueTime: "11:00:00 AM IST",
    cardActivationDate: "12 January 2026",
    cardActivationTime: "10:30:00 AM IST",
    cardActivatedByName: "Self",
    approvedByName: "Executive Board Node",
    approvalRole: "Final Approver",
    approvalDate: "09 January 2026",
    approvalTime: "04:30:00 PM IST",
    creditScore: 890,
    creditRating: "Excellent",
    creditUtilizationRatio: 3.5,
    paymentHistory: { onTime: 48, missed: 0, delayed: 0 },
    riskProfile: "Low Risk",
    creditHealthTrend: [880, 882, 885, 888, 890, 890],
    creditAnalytics: {
      monthlySpending: 150000,
      yearlySpending: 1800000,
      avgTransaction: 12000,
      highestTransaction: 250000,
      lowestTransaction: 100,
      totalTransactions: 312
    },
    cardActivity: {
      lastTransaction: { date: "2026-06-12", time: "11:00 AM", amount: 4500, location: "AWS Cloud Services" },
      lastATM: { date: "2026-06-10", time: "05:00 PM", amount: 10000, location: "Elite Lounge ATM" },
      lastOnline: { date: "2026-06-11", time: "01:00 PM", amount: 2000, location: "Bloomberg Terminal" },
      lastPOS: { date: "2026-06-12", time: "08:00 PM", amount: 1450, location: "Taj Krishna Hyderabad" },
      lastInternational: { date: "2026-05-15", time: "10:00 AM", amount: 50000, location: "Lufthansa AG" }
    },
    riskAssessment: {
      fraudRiskScore: 2,
      creditHealthStatus: 'Good',
      repaymentPerformance: "Perfect",
      emiPerformance: "Premium Level",
      missedPaymentsCount: 0
    },
    paymentSummary: {
      totalOutstandingBalance: 87500,
      dueAmount: 5000,
      nextPaymentDate: "2026-07-10",
      minimumDue: 1000,
      lastPaymentDate: "2026-06-10",
      lastPaymentAmount: 25000
    },
    cardTransactions: [
      { id: "TX-ADMIN-P-01", type: "Utility", merchant: "AWS Cloud Services", amount: 4500, date: "2026-06-12", time: "11:00:00 AM IST", status: "Completed" }
    ],
    cardTimeline: [
      { id: "1", event: "Account Linked", date: "2026-01-10", time: "11:00:00 AM IST", employee: "HR Admin", remarks: "Linked to executive salary nodal account." }
    ]
  }
];

export default function CreditCards({
  cards,
  setCards,
  addAuditLog
}: CreditCardsProps) {
  // Ensure we seed our state with the MasterCreditCardDetails on mount to support the filters and employees lists
  const [internalCards, setInternalCards] = useState<CreditCard[]>(() => {
    // Sync active state from general context, but ensure all fields exist
    return MasterCreditCardDetails.map(mc => {
      const match = cards.find(c => c.id === mc.id);
      if (match) {
        return {
          ...mc,
          status: match.status,
          limit: match.limit,
          availableLimit: match.limit - (mc.balance || 0)
        };
      }
      return mc;
    });
  });

  // Top Filter state
  const [ownerFilter, setOwnerFilter] = useState<'All' | 'Customer' | 'Employee'>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Search state
  const [localSearch, setLocalSearch] = useState('');

  // Selected Card state
  const [selectedCardId, setSelectedCardId] = useState<string | null>(() => {
    return internalCards[0]?.id || null;
  });

  // Slider Limit Input State
  const [limitInput, setLimitInput] = useState(() => {
    return internalCards[0]?.limit || 1000000;
  });

  // Card 3D Flip state
  const [flippedInstance, setFlippedInstance] = useState<string | null>(null);
  const [showIntelligence, setShowIntelligence] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowIntelligence(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  // Handle single/double interaction
  const handleCardInteraction = (instance: string = 'bottom') => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      setShowIntelligence(true);
      setFlippedInstance(null); // Reset flip on intelligence view
      addAuditLog(`Super Admin accessed Credit Intelligence for terminal ref: ${selectedCardId || 'N/A'}`, 'Info');
    } else {
      clickTimer.current = setTimeout(() => {
        setFlippedInstance(prev => prev === instance ? null : instance);
        clickTimer.current = null;
      }, 300);
    }
  };

  // Reset card flip when a different card is selected
  useEffect(() => {
    setFlippedInstance(null);
  }, [selectedCardId]);

  // Intelligence expanded page state 
  const [intelligenceActiveTab, setIntelligenceActiveTab] = useState<'details' | 'transactions' | 'timeline' | 'analytics'>('details');

  // Super Admin Personal & Corporate state
  const [superAdminTab, setSuperAdminTab] = useState<'personal' | 'official'>('official');
  const [personalCardBlock, setPersonalCardBlock] = useState(false);
  const [officialCardBlock, setOfficialCardBlock] = useState(false);
  const [adminDetailView, setAdminDetailView] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get active card item
  const selectedCard = useMemo(() => {
    return internalCards.find(c => c.id === selectedCardId) || null;
  }, [internalCards, selectedCardId]);

  // Handle freeze/unfreeze card terminal
  const handleToggleFreezeCard = (card: CreditCard) => {
    const isFrozen = card.status === 'Frozen' || card.status === 'Blocked';
    const nextStatus: CreditCard['status'] = isFrozen ? 'Active' : 'Frozen';
    
    // Update internal cards
    const updated = internalCards.map(c => {
      if (c.id === card.id) {
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setInternalCards(updated);

    // Sync back to top state
    const syncTop = cards.map(c => {
      if (c.id === card.id) {
        return { ...c, status: (nextStatus === 'Frozen' ? 'Frozen' : 'Active') as any };
      }
      return c;
    });
    setCards(syncTop);

    addAuditLog(`Super Admin set status for card registered to ${card.customerName} [ID: ${card.id}] to ${nextStatus.toUpperCase()}`, nextStatus === 'Frozen' ? 'Warning' : 'Info');
  };

  // Handle block/unblock card
  const handleBlockCardToggle = (card: CreditCard) => {
    const isBlocked = card.status === 'Blocked';
    const nextStatus: CreditCard['status'] = isBlocked ? 'Active' : 'Blocked';
    
    const updated = internalCards.map(c => {
      if (c.id === card.id) {
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setInternalCards(updated);

    const syncTop = cards.map(c => {
      if (c.id === card.id) {
        return { ...c, status: (nextStatus === 'Blocked' ? 'Blocked' : 'Active') as any };
      }
      return c;
    });
    setCards(syncTop);

    addAuditLog(`Super Admin ${isBlocked ? 'unblocked' : 'permanently blocked'} credit card belonging to ${card.customerName} [ID: ${card.id}]`, isBlocked ? 'Info' : 'Critical');
  };

  // Adjust limit
  const handleUpdateLimit = () => {
    if (!selectedCard) return;
    const updated = internalCards.map(c => {
      if (c.id === selectedCard.id) {
        const outbal = c.outstandingBalance || 0;
        return { 
          ...c, 
          limit: limitInput,
          availableLimit: Math.max(0, limitInput - outbal)
        };
      }
      return c;
    });
    setInternalCards(updated);

    // Sync to prop state
    const syncTop = cards.map(c => {
      if (c.id === selectedCard.id) {
        return { ...c, limit: limitInput };
      }
      return c;
    });
    setCards(syncTop);

    addAuditLog(`Adjusted credit authorization limit for ${selectedCard.customerName} [Card Ref: ${selectedCard.id}] to $${limitInput.toLocaleString()}`, 'Warning');
  };

  // Filter application calculation logic
  const filteredCards = useMemo(() => {
    return internalCards.filter(card => {
      // 1. Owner Filter
      if (ownerFilter === 'Customer' && card.isEmployee) return false;
      if (ownerFilter === 'Employee' && !card.isEmployee) return false;

      // 2. Card Type Filter
      if (typeFilter !== 'All') {
        const cleanType = typeFilter.toLowerCase();
        if (!card.cardType?.toLowerCase().includes(cleanType) &&
            !(cleanType === 'premium cards' && card.cardType === 'Premium Card') &&
            !(cleanType === 'corporate cards' && card.cardType === 'Corporate Card') &&
            !(cleanType === 'business cards' && card.cardType === 'Business Card') &&
            !(cleanType === 'salary cards' && card.cardType === 'Salary Cards')) {
          return false;
        }
      }

      // 3. Card Status Filter
      if (statusFilter !== 'All') {
        const cleanStatus = statusFilter.toLowerCase();
        if (cleanStatus === 'pending activation' && card.status !== 'Pending Activation') return false;
        if (cleanStatus !== 'pending activation' && card.status.toLowerCase() !== cleanStatus) return false;
      }

      // 4. Local Search Matcher
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const scoreString = String(card.creditScore || '');
        const matchNumber = card.cardNumber.toLowerCase().includes(q);
        const matchName = card.customerName.toLowerCase().includes(q);
        const matchBranch = card.branchName?.toLowerCase().includes(q);
        const matchMobile = card.mobileNumber?.toLowerCase().includes(q);
        const matchScore = scoreString.includes(q);

        if (!matchNumber && !matchName && !matchBranch && !matchMobile && !matchScore) {
          return false;
        }
      }

      return true;
    });
  }, [internalCards, ownerFilter, typeFilter, statusFilter, localSearch]);

  // Credit health timeline graph calculation
  const chartData = useMemo(() => {
    if (!selectedCard) return [];
    const trends = selectedCard.creditHealthTrend || [700, 710, 720, 730, 740, 750];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return trends.map((score, idx) => ({
      name: months[idx] || `Pt ${idx + 1}`,
      score: score
    }));
  }, [selectedCard]);

  // Total Operational spending graph tracker
  const spendingTrendData = [
    { month: 'Jan', Corporate: 1100000, Emergency: 500000, Investment: 2000000 },
    { month: 'Feb', Corporate: 1250000, Emergency: 450000, Investment: 2200000 },
    { month: 'Mar', Corporate: 1300000, Emergency: 600000, Investment: 2400000 },
    { month: 'Apr', Corporate: 1400000, Emergency: 550000, Investment: 2600000 },
    { month: 'May', Corporate: 1350000, Emergency: 800000, Investment: 2800000 },
    { month: 'Jun', Corporate: 1500000, Emergency: 1000000, Investment: 3250000 }
  ];

  return (
    <div id="credit-card-management-wrapper" className="space-y-6 select-none text-white pb-12">
      
      {/* ----------------- SUPER ADMIN EXCLUSIVE FINANCIAL CARD CENTER ----------------- */}
      <div className="p-6 rounded-2xl border border-pink-300 bg-pink-100 shadow-[0_0_25px_rgba(0,0,0,0.05)] relative overflow-hidden">
        
        {/* Background visual brand flare */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-10 -bottom-10 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#F9A8D4]/60 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d946ef] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#3a2072] font-extrabold">Secure Root Access Controls</span>
            </div>
            <h2 className="text-lg font-extrabold tracking-wide text-[#3a2072] mt-1">Super Admin Financial Card Center</h2>
            <p className="text-xs text-[#3a2072]/80 font-bold">Exclusive dashboard for direct bank liquidity operations and active strategic credit cards.</p>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0 bg-white/50 p-1 rounded-xl border border-pink-300 shadow-sm">
            <button
              onClick={() => {
                setSuperAdminTab('official');
                setSelectedCardId('SUPER-OFFICIAL');
                setFlippedInstance(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                superAdminTab === 'official' 
                   ? 'bg-pink-400 text-[#4A044E] shadow-md rounded-lg mx-1' 
                   : 'text-[#3a2072]/60 hover:text-[#3a2072]'
              }`}
            >
              Official Executive Card
            </button>
            <button
              onClick={() => {
                setSuperAdminTab('personal');
                setSelectedCardId('SUPER-PERSONAL');
                setFlippedInstance(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                superAdminTab === 'personal' 
                  ? 'bg-pink-400 text-[#4A044E] shadow-md rounded-lg mx-1' 
                  : 'text-[#3a2072]/60 hover:text-[#3a2072]'
              }`}
            >
              Personal Credit Card
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-center gap-2">
           <span className="text-[10px] font-mono text-[#3a2072]/60 font-bold uppercase tracking-widest">Double click card for Intelligence Terminal</span>
           <div className="h-px w-20 bg-white/5" />
        </div>

        <AnimatePresence mode="wait">
          {superAdminTab === 'official' ? (
            <motion.div 
              key="official" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Official card visual presentation */}
              <div className="space-y-4">
                <div 
                  onClick={() => {
                    if (selectedCardId !== 'SUPER-OFFICIAL') {
                      setSelectedCardId('SUPER-OFFICIAL');
                    }
                    handleCardInteraction('top-official');
                  }}
                  className="group cursor-pointer [perspective:1200px] w-full h-52 relative select-none"
                >
                  <div 
                    className="relative w-full h-full [transform-style:preserve-3d] transition-transform"
                    style={{ 
                      transform: flippedInstance === 'top-official' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transitionDuration: '0.6s'
                    }}
                  >
                    {/* FRONT SIDE */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl p-5 flex flex-col justify-between text-white overflow-hidden shadow-2xl border transition-all ${
                      officialCardBlock 
                        ? 'bg-slate-300 border-slate-400 text-slate-800' 
                        : 'bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-600 border-pink-300 group-hover:border-pink-200 shadow-xl text-[#4A044E]'
                    }`}>
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#705E7C]/10 backdrop-blur-md" />
                      <div className="absolute -right-16 -top-16 w-36 h-36 bg-pink-300/20 rounded-full blur-2xl" />
                      
                      <div className="flex justify-between items-start z-10 w-full" style={{ color: officialCardBlock ? '#1e293b' : 'white' }}>
                        <div className="min-w-0 pr-2">
                          <span className="text-[9px] uppercase tracking-widest font-extrabold truncate block" style={{ color: officialCardBlock ? '#475569' : '#fce7f3' }}>APEX EXECUTIVE NODE</span>
                          <p className="text-[10px] sm:text-xs font-bold font-mono mt-1 tracking-wide truncate block max-w-[150px]">Mastercard black executive</p>
                        </div>
                        <Cpu className="shrink-0" style={{ color: officialCardBlock ? '#64748b' : '#fce7f3' }} size={24} />
                      </div>

                      <div className="text-lg md:text-xl font-mono tracking-widest my-3 z-10 drop-shadow-md truncate" style={{ color: officialCardBlock ? '#1e293b' : 'white' }}>
                        {officialCardBlock ? '•••• •••• •••• ••••' : '4820 9011 2288 3344'}
                      </div>

                      <div className="flex justify-between items-end z-10 w-full">
                        <div className="min-w-0 pr-2">
                          <span className="text-[8px] block font-bold truncate" style={{ color: officialCardBlock ? '#64748b' : 'rgba(252,231,243,0.8)' }}>EXECUTIVE SIGNATORY</span>
                          <p className="text-[10px] sm:text-xs font-black tracking-wide uppercase truncate max-w-[150px]" style={{ color: officialCardBlock ? '#1e293b' : 'white' }}>SUPER USER - EXECUTIVE HQ</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[8px] block font-bold" style={{ color: officialCardBlock ? '#64748b' : 'rgba(252,231,243,0.8)' }}>CARD EXPIRES</span>
                          <p className="text-xs font-mono font-bold" style={{ color: officialCardBlock ? '#334155' : '#fce7f3' }}>06/2032</p>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-pink-100/0 group-hover:bg-pink-100/5 transition-all flex items-center justify-center">
                        <LayoutDashboard className="opacity-0 group-hover:opacity-100 transition-opacity text-pink-100" size={40} />
                      </div>
                    </div>

                    {/* BACK SIDE */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border-pink-300 shadow-xl flex flex-col pt-6 overflow-hidden ${officialCardBlock ? 'bg-slate-300 text-slate-800' : 'bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-600 text-[#4A044E]'}`}>
                      {/* Magnetic Stripe */}
                      <div className="w-full h-10 bg-black/90 shadow-inner mb-4" />
                      
                      <div className="px-5 space-y-4">
                        <div className="flex items-end gap-3">
                          <div className="flex-1 min-w-0">
                            <span className="text-[7px] text-[#A38BA7] uppercase tracking-widest font-black mb-1 block truncate">AUTHORIZED SIGNATURE AREA</span>
                            <div className="w-full h-9 bg-slate-100/90 rounded border-y border-slate-300 flex items-center px-4 overflow-hidden shadow-inner">
                              <span className="font-serif italic text-[#40304D] text-[12px] opacity-70 truncate select-none">SUPER USER - EXECUTIVE HQ</span>
                            </div>
                          </div>
                          <div className="w-14 shrink-0">
                            <span className="text-[7px] text-[#A38BA7] uppercase tracking-widest font-black mb-1 block">CVV</span>
                            <div className="w-full h-9 bg-white rounded flex items-center justify-center font-mono text-[#0B0D17] font-black tracking-widest shadow-inner border border-slate-200">842</div>
                          </div>
                        </div>

                        {/* Extended Details Grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[7px] font-bold text-[#A38BA7] uppercase font-mono">
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Card Type:</span>
                             <span className="text-[#4A044E]">Apex Executive</span>
                           </div>
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Issuing Bank:</span>
                             <span className="text-[#4A044E] truncate max-w-[50px]">Apex Global</span>
                           </div>
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Status:</span>
                             <span className="text-emerald-400">Active</span>
                           </div>
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Network:</span>
                             <span className="text-[#4A044E]">Mastercard</span>
                           </div>
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Issue Date:</span>
                             <span className="text-[#4A044E]">06/2026</span>
                           </div>
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Expiry:</span>
                             <span className="text-[#4A044E] text-pink-100">06/2032</span>
                           </div>
                        </div>

                        <div className="flex justify-between items-center pt-1">
                          <div className="flex items-center gap-1.5 grayscale opacity-40">
                             <Globe size={10} className="text-[#4A044E]" />
                             <span className="text-[6px] font-mono tracking-tighter text-[#4A044E]">WORLDWIDE ACCESS ENABLED</span>
                          </div>
                          <div className="flex items-center gap-1">
                             <Zap size={8} className="text-emerald-400 fill-emerald-400" />
                             <span className="text-[7px] text-[#4A044E]">Contactless</span>
                          </div>
                        </div>
                      </div>

                      {/* Micro Security Text */}
                      <div className="mt-auto px-5 py-2 bg-black/40 text-[6px] text-[#A38BA7] font-mono leading-tight border-t border-[#F9A8D4]/40">
                        THIS CARD IS PROPERTY OF APEX BANK. USE IS SUBJECT TO EXECUTIVE NODE PROTOCOLS. 
                        IF FOUND PLEASE RETURN TO NEAREST HQ OFFICE.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Switch Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setOfficialCardBlock(!officialCardBlock);
                      addAuditLog(`Super Admin changed Official Executive Card status to ${!officialCardBlock ? 'SUSPENDED' : 'ACTIVE'}`, !officialCardBlock ? 'Critical' : 'Info');
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      officialCardBlock 
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-none' 
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/25'
                    }`}
                  >
                    {officialCardBlock ? <Unlock size={13} /> : <Lock size={13} />}
                    {officialCardBlock ? 'Unfreeze Executive Tool' : 'Emergency Freeze'}
                  </button>
                  <button 
                    onClick={() => console.log("Downloading Official Corporate Balance Report Sheet v1.026...")}
                    className="p-2 border border-pink-300 bg-pink-100 text-[#3a2072]/60 hover:text-[#3a2072] rounded-xl transition-all cursor-pointer shadow-sm"
                    title="Export Audit Ledger"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              {/* Status and limits dashboard for emergency usage */}
              <div className="p-5 rounded-2xl bg-white/50 border border-pink-200 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-pink-600 font-bold block mb-2">Liquidity Limits & Support Parameters</span>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    <div className="bg-pink-100/50 p-3 rounded-xl border border-pink-200 min-w-0">
                      <span className="text-[9px] text-[#3a2072]/80 uppercase font-bold tracking-wide block truncate">Executive Limit</span>
                      <span className="text-base font-mono font-extrabold text-[#3a2072] truncate block">$50,000,000</span>
                    </div>
                    <div className="bg-pink-100/50 p-3 rounded-xl border border-pink-200 min-w-0">
                      <span className="text-[9px] text-[#3a2072]/80 uppercase font-bold tracking-wide block truncate">Outstanding Balance</span>
                      <span className="text-base font-mono font-extrabold text-rose-600 truncate block">$2,750,000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-4 pt-4 border-t border-pink-200">
                  <span className="text-[9px] uppercase tracking-widest text-[#3a2072]/70 block font-bold">Bank Emergency Operational Usage</span>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[#3a2072]">Emergency Credit Funding Support</span>
                        <span className="font-mono text-pink-600 font-bold">75%</span>
                      </div>
                      <div className="w-full h-1.5 bg-pink-200 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500" style={{ width: '75%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[#3a2072]">Strategic Liquidity Buffer Nodes</span>
                        <span className="font-mono text-pink-600 font-bold">40%</span>
                      </div>
                      <div className="w-full h-1.5 bg-pink-200 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500" style={{ width: '40%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[#3a2072]">Temporary Operational Liquidation</span>
                        <span className="font-mono text-pink-600 font-bold">12%</span>
                      </div>
                      <div className="w-full h-1.5 bg-pink-200 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500" style={{ width: '12%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger for backup lines */}
              <div className="p-5 rounded-2xl bg-white/50 border border-pink-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-pink-600">Emergency Funding Activity Logs</span>
                  <History size={14} className="text-[#3a2072]/50" />
                </div>

                <div className="space-y-2.5 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 pr-1">
                  <div className="p-2 border border-pink-200 bg-pink-50/50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-[#3a2072]">$10,000,000</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded">Treasury Clearing</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-[#3a2072]/60">
                      <span>Approved by Chief Treasurer Node</span>
                      <span>12 June 2026</span>
                    </div>
                  </div>

                  <div className="p-2 border border-pink-200 bg-pink-50/50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-[#3a2072]">$5,000,000</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded">Emergency SWIFT Ref</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-[#3a2072]/60">
                      <span>Approved by Board Liquidity Hub</span>
                      <span>10 June 2026</span>
                    </div>
                  </div>

                  <div className="p-2 border border-pink-200 bg-pink-50/50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-[#3a2072]">$2,500,000</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-pink-500/10 text-pink-600 rounded">Liquidity Float Support</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-[#3a2072]/60">
                      <span>Approved by Super Admin</span>
                      <span>08 June 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="personal" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Personal credit card visual representation */}
              <div className="space-y-4">
                <div 
                  onClick={() => {
                    if (selectedCardId !== 'SUPER-PERSONAL') {
                      setSelectedCardId('SUPER-PERSONAL');
                    }
                    handleCardInteraction('top-personal');
                  }}
                  className="group cursor-pointer [perspective:1200px] w-full h-52 relative select-none"
                >
                  <div 
                    className="relative w-full h-full [transform-style:preserve-3d] transition-transform"
                    style={{ 
                      transform: flippedInstance === 'top-personal' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transitionDuration: '0.6s'
                    }}
                  >
                    {/* FRONT SIDE */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl p-5 flex flex-col justify-between text-white overflow-hidden shadow-2xl border transition-all ${
                      personalCardBlock 
                        ? 'bg-slate-300 border-slate-400 text-slate-800' 
                        : 'bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-600 border-pink-300 group-hover:border-pink-200 shadow-xl text-[#4A044E]'
                    }`}>
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/5 backdrop-blur-md" />
                      <div className="absolute -right-16 -top-16 w-36 h-36 bg-pink-300/20 rounded-full blur-2xl" />
                      
                      <div className="flex justify-between items-start z-10 w-full">
  <div className="min-w-0 pr-2">
    <span className="text-[9px] uppercase tracking-widest font-extrabold text-pink-100 truncate block">APEX BLACK PERSONAL</span>
    <p className="text-[10px] sm:text-xs font-bold font-mono mt-1 text-white/90 truncate block max-w-[150px]">Visa infinite sovereign card</p>
  </div>
  <Cpu className="text-pink-100 shrink-0" size={24} />
</div>

                      <div className="text-lg md:text-xl font-mono tracking-widest my-3 z-10 drop-shadow-md" style={{ color: personalCardBlock ? '#1e293b' : '#eceff8' }}>
                        {personalCardBlock ? '•••• •••• •••• ••••' : '4232 9911 0048 1192'}
                      </div>

                      <div className="flex justify-between items-end z-10">
                        <div>
                          <span className="text-[8px] text-pink-100/80 block font-bold">CARD HOLDER ACCESS</span>
                          <p className="text-xs font-black tracking-wide uppercase truncate max-w-[120px]" style={{ color: personalCardBlock ? '#1e293b' : 'white' }}>SUPER ADMIN PERSONAL</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[8px] text-pink-100/80 block font-bold">EXPIRES</span>
                          <p className="text-xs font-mono font-bold text-pink-100">12/2030</p>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-pink-100/0 group-hover:bg-pink-100/5 transition-all flex items-center justify-center">
                        <LayoutDashboard className="opacity-0 group-hover:opacity-100 transition-opacity text-pink-100" size={40} />
                      </div>
                    </div>

                    {/* BACK SIDE */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-gradient-to-tr from-[#0284c7] via-[#0369a1] to-[#0c4a6e] border-sky-300 shadow-xl flex flex-col pt-6 overflow-hidden">
                      {/* Magnetic Stripe */}
                      <div className="w-full h-10 bg-black/95 shadow-inner mb-4" />
                      
                      <div className="px-5 space-y-4">
                        <div className="flex items-end gap-3">
                          <div className="flex-1 min-w-0">
                            <span className="text-[7px] text-[#A38BA7] uppercase tracking-widest font-black mb-1 block truncate">CARD HOLDER SIGNATURE AREA</span>
                            <div className="w-full h-9 bg-slate-100/90 rounded border-y border-slate-300 flex items-center px-4 overflow-hidden shadow-inner">
                              <span className="font-serif italic text-[#40304D] text-[12px] opacity-70 truncate select-none uppercase">SUPER ADMIN PERSONAL</span>
                            </div>
                          </div>
                          <div className="w-14 shrink-0">
                            <span className="text-[7px] text-[#A38BA7] uppercase tracking-widest font-black mb-1 block">CVV</span>
                            <div className="w-full h-9 bg-white rounded flex items-center justify-center font-mono text-[#0B0D17] font-black tracking-widest shadow-inner border border-slate-200">924</div>
                          </div>
                        </div>

                        {/* Extended Details Grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[7px] font-bold text-[#A38BA7] uppercase font-mono">
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Card Type:</span>
                             <span className="text-[#4A044E]">Visa Infinite</span>
                           </div>
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Issuing Bank:</span>
                             <span className="text-[#4A044E] truncate">Apex Bank Int</span>
                           </div>
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Status:</span>
                             <span className="text-emerald-400">Active</span>
                           </div>
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Network:</span>
                             <span className="text-[#4A044E]">Visa</span>
                           </div>
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Issue Date:</span>
                             <span className="text-[#4A044E]">12/2024</span>
                           </div>
                           <div className="flex justify-between border-b border-[#F9A8D4]/40 pb-0.5">
                             <span>Expiry:</span>
                             <span className="text-pink-100">12/2030</span>
                           </div>
                        </div>

                        <div className="flex justify-between items-center pt-1">
                          <div className="flex items-center gap-1.5 grayscale opacity-40">
                             <Globe size={10} className="text-[#4A044E]" />
                             <span className="text-[6px] font-mono tracking-tighter text-[#4A044E] uppercase">Personal Sovereign Access</span>
                          </div>
                          <div className="flex items-center gap-1">
                             <Zap size={8} className="text-emerald-400 fill-emerald-400" />
                             <span className="text-[7px] text-[#4A044E]">Contactless</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto px-5 py-2 bg-black/40 text-[6px] text-[#A38BA7] font-mono leading-tight border-t border-[#F9A8D4]/40">
                        FOR CUSTOMER SUPPORT CALL +1 800 APEX ADMIN. 
                        AUTHORIZED PRIVILEGED PERSONAL ACCESS NODE.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPersonalCardBlock(!personalCardBlock);
                      addAuditLog(`Super Admin changed Personal Credit Card status to ${!personalCardBlock ? 'FROZEN' : 'ACTIVE'}`, !personalCardBlock ? 'Warning' : 'Info');
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      personalCardBlock 
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-none' 
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/25'
                    }`}
                  >
                    {personalCardBlock ? <Unlock size={13} /> : <Lock size={13} />}
                    {personalCardBlock ? 'Activate Personal Tool' : 'Suspend Personal Link'}
                  </button>
                </div>
              </div>

              {/* Personal balance metrics and transactions tracking */}
              <div className="p-5 rounded-2xl bg-white/50 border border-pink-200">
                <span className="text-[9px] uppercase tracking-widest font-mono text-pink-600 font-bold block mb-3">Balance & Utilization analytics</span>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-pink-100/50 p-2.5 rounded-xl border border-pink-200">
                    <span className="text-[9px] text-[#3a2072]/60 uppercase tracking-wider block">Credit Limit</span>
                    <span className="text-base font-mono font-bold text-[#3a2072]">$2,500,000</span>
                  </div>
                  <div className="bg-pink-100/50 p-2.5 rounded-xl border border-pink-200">
                    <span className="text-[9px] text-[#3a2072]/60 uppercase tracking-wider block">Outstanding</span>
                    <span className="text-base font-mono font-bold text-rose-500">$87,500</span>
                  </div>
                </div>

                <span className="text-[9px] uppercase tracking-widest text-[#3a2072]/60 block font-bold mb-2">Spend Category Allocation</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-1.5 bg-pink-50/80 rounded border border-pink-200">
                    <span className="text-[#3a2072]">Secure Server Cloud Hosting</span>
                    <span className="font-mono text-[#3a2072] font-bold">$4,500</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-pink-50/80 rounded border border-pink-200">
                    <span className="text-[#3a2072]">Strategic Travel Summit Flights</span>
                    <span className="font-mono text-[#3a2072] font-bold">$32,000</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-pink-50/80 rounded border border-pink-200">
                    <span className="text-[#3a2072]">Premium Tech Assets</span>
                    <span className="font-mono text-[#3a2072] font-bold">$45,000</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-pink-50/80 rounded border border-pink-200">
                    <span className="text-[#3a2072]">Bloomberg & VPN Subscriptions</span>
                    <span className="font-mono text-[#3a2072] font-bold">$6,000</span>
                  </div>
                </div>
              </div>

              {/* Personal Transaction Timeline ledger */}
              <div className="p-5 rounded-2xl bg-white/50 border border-pink-200">
                <span className="text-[9px] uppercase tracking-widest font-mono text-pink-600 font-bold block mb-3">Live Personal Expenses Activity</span>
                <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 pr-1">
                  <div className="flex items-center justify-between p-2 border-b border-pink-200 text-xs">
                    <div>
                      <h4 className="font-bold text-[#3a2072] hover:text-pink-600 transition-colors">AWS Cloud Security Portal</h4>
                      <p className="text-[9px] text-[#3a2072]/50">12 June 2026 • 09:30 AM</p>
                    </div>
                    <span className="font-mono text-rose-500 font-bold">-$1,250</span>
                  </div>

                  <div className="flex items-center justify-between p-2 border-b border-pink-200 text-xs">
                    <div>
                      <h4 className="font-bold text-[#3a2072] hover:text-pink-600 transition-colors">Bloomberg Asset Terminals</h4>
                      <p className="text-[9px] text-[#3a2072]/50">11 June 2026 • 01:22 PM</p>
                    </div>
                    <span className="font-mono text-rose-500 font-bold">-$2,000</span>
                  </div>

                  <div className="flex items-center justify-between p-2 text-xs">
                    <div>
                      <h4 className="font-bold text-[#3a2072] hover:text-pink-600 transition-colors">Taj Suites Hyderabad</h4>
                      <p className="text-[9px] text-[#3a2072]/50">09 June 2026 • 08:45 PM</p>
                    </div>
                    <span className="font-mono text-rose-500 font-bold">-$1,450</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ----------------- LEDGER & CREDIT CARD FILTERS ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Plastic Terminal Ledger (Takes 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* LEDGER FILTER CONTROL HUB */}
          <div className="p-5 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-[#4A044E] uppercase tracking-wider">Security Terminals Ledger</h3>
                <p className="text-xs text-[#8495bc]">Search and filter general card allocations.</p>
              </div>
              <Filter className="text-amber-400" size={16} />
            </div>

            {/* Global local search filter bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9D174D]/80" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search card, owner, branch, mobile, score..."
                className="w-full pl-9 pr-4 py-2 bg-[#FFF1F5] border border-[#F9A8D4] rounded-xl text-xs text-[#4A044E] placeholder-[#556994] focus:outline-none focus:border-amber-400/50 transition-colors"
              />
            </div>

            {/* 1. Card Owner Type Switchers */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#8495bc] font-bold block">Card Owner</span>
              <div className="flex gap-1 bg-[#FFF1F5] p-1 rounded-xl border border-[#F9A8D4]">
                {(['All', 'Customer', 'Employee'] as const).map((own) => (
                  <button
                    key={own}
                    onClick={() => setOwnerFilter(own)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      (own === 'All' && ownerFilter === 'All') ||
                      (own === 'Customer' && ownerFilter === 'Customer') ||
                      (own === 'Employee' && ownerFilter === 'Employee')
                        ? 'bg-[#151f54] text-amber-400 shadow-md border-b-2 border-amber-500/40' 
                        : 'text-[#3a2072]/60 hover:text-[#3a2072]'
                    }`}
                  >
                    {own === 'All' ? 'All Card Holders' : own === 'Customer' ? 'Customers Only' : 'Employees Only'}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Plastic Card Type Switcher dropdown */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#8495bc] font-bold block">Card Type Variant</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFF1F5] border border-[#F9A8D4] rounded-xl text-xs text-[#8495bc] focus:outline-none focus:border-amber-400/50 cursor-pointer"
              >
                <option value="All">All Cards</option>
                <option value="Visa Infinite">Visa Infinite</option>
                <option value="Visa Signature">Visa Signature</option>
                <option value="Mastercard Platinum">Mastercard Platinum</option>
                <option value="Corporate Cards">Corporate Cards</option>
                <option value="Business Cards">Business Cards</option>
                <option value="Salary Cards">Salary Cards</option>
                <option value="Premium Cards">Premium Cards</option>
              </select>
            </div>

            {/* 3. Security Status Switcher */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#8495bc] font-bold block">Terminal Security Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFF1F5] border border-[#F9A8D4] rounded-xl text-xs text-[#8495bc] focus:outline-none focus:border-amber-400/50 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
                <option value="Suspended">Suspended</option>
                <option value="Expired">Expired</option>
                <option value="Pending Activation">Pending Activation</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC SCROLLING PHYSICAL TERMINAL LIST */}
          <div className="p-5 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-3.5">
            <div className="flex justify-between items-center text-xs text-[#8495bc]">
              <span>Search results: {filteredCards.length} Cards</span>
              <span>Sorted by Rating</span>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20 pr-1">
              {filteredCards.length > 0 ? (
                filteredCards.map((c) => {
                  const isSelected = selectedCardId === c.id;
                  const isSuspended = c.status === 'Blocked' || c.status === 'Suspended';
                  return (
                    <div 
                      key={c.id}
                      onClick={() => {
                        setSelectedCardId(c.id);
                        setLimitInput(c.limit);
                      }}
                      className={`p-3.5 border rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-br from-[#2D2438] to-[#050505] border-[#D32F2F]/60 shadow-lg' 
                          : 'border-[#F9A8D4]/50 hover:bg-[#FCE7F3]/60 bg-[#FFF1F5]/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl relative ${
                    c.isEmployee 
                      ? 'bg-[#D32F2F]/10 text-[#D32F2F]' 
                      : isSuspended 
                        ? 'bg-[#D32F2F]/20 text-[#D32F2F]' 
                        : 'bg-[#40304D]/30 text-[#A38BA7]'
                  }`}>
                          <CardIcon size={16} />
                          {c.isEmployee && (
                            <span className="absolute -top-1 -right-1 bg-purple-500 text-[6px] px-1 rounded-full text-[#4A044E] font-extrabold uppercase">EMP</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-[11px] font-bold text-[#4A044E] flex items-center">{c.customerName}</h4>
                          </div>
                          <div className="flex gap-1.5 mt-0.5 items-center">
                            <span className="text-[9px] text-[#9D174D]/80 font-mono">{c.cardNumber.replace(/\d{4}\s\d{4}\s/g, '•••• •••• ')}</span>
                            <span className={`text-[8px] px-1 rounded uppercase font-extrabold ${
                              c.status === 'Active' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : c.status === 'Pending Activation' 
                                  ? 'bg-amber-500/10 text-amber-400' 
                                  : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {c.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <div className="min-w-[60px]">
                          <span className="text-[8px] text-[#A38BA7] font-mono block uppercase">Score</span>
                          <p className="text-xs font-black font-mono text-[#4A044E]">{c.creditScore || '750'}</p>
                        </div>

                        <button 
                          onClick={() => handleToggleFreezeCard(c)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            c.status === 'Frozen' || c.status === 'Blocked' || c.status === 'Suspended'
                              ? 'border-[#D32F2F]/30 bg-[#D32F2F]/10 text-[#D32F2F] hover:bg-[#D32F2F]/20' 
                              : 'border-[#F9A8D4] bg-[#FDF4F9] text-[#9D174D]/85 hover:text-[#D32F2F]'
                          }`}
                          title={c.status === 'Frozen' ? 'Activate Card Terminal' : 'Freeze Card Terminal'}
                        >
                          {c.status === 'Frozen' || c.status === 'Blocked' || c.status === 'Suspended' ? <Unlock size={11} /> : <Lock size={11} />}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-[#9D174D]/80">
                  No cards match the active filters.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Main Intelligence and Analytics Suite (Takes 7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* SELECTED CARD PREVIEW & AUTH LIMIT ADJUSTER */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            
            {/* Visual Glassmorphous Card Terminal Preview (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1.5 px-1 select-none">
                <span className="text-[10px] text-[#8495bc] font-mono tracking-wider">SECURE CLIENT TERMINAL</span>
                <button 
                  onClick={() => setFlippedInstance(prev => prev === 'bottom' ? null : 'bottom')} 
                  className="text-[9px] text-[#D32F2F] font-mono flex items-center gap-1.5 hover:text-[#4A044E] transition-colors bg-[#2D2438]/80 py-0.5 px-2 rounded-lg border border-[#D32F2F]/30 shadow-md cursor-pointer"
                >
                  <span>{flippedInstance === 'bottom' ? "View Card Face" : "Credit Intelligence"}</span>
                  <Sliders size={10} className="animate-pulse text-[#D32F2F]" />
                </button>
              </div>

              <div 
                onClick={() => handleCardInteraction('bottom')}
                className="group cursor-pointer [perspective:1200px] w-full h-52 relative select-none"
              >
                <div 
                  className="relative w-full h-full [transform-style:preserve-3d] transition-transform"
                  style={{ 
                    transform: flippedInstance === 'bottom' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transitionDuration: '0.6s'
                  }}
                >
                  
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] z-10 select-none">
                    <AnimatePresence mode="wait">
                      {selectedCard ? (
                        <motion.div 
                          key={selectedCard.id}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className={`relative w-full h-full rounded-2xl p-5 flex flex-col justify-between text-white overflow-hidden shadow-2xl border ${
                            selectedCard.status === 'Blocked' || selectedCard.status === 'Suspended' || selectedCard.status === 'Frozen'
                              ? 'bg-slate-300 border-slate-400 text-slate-800'
                              : selectedCard.isEmployee 
                                ? 'bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-600 border-pink-300'
                                : 'bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-600 border-pink-300'
                          }`}
                        >
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#705E7C]/10 backdrop-blur-md" />
                          <div className="absolute -right-16 -top-16 w-36 h-36 bg-white/20 rounded-full blur-3xl pointer-events-none" />

                          <div className="flex justify-between items-start z-10 w-full">
                            <div className="min-w-0">
                              <span className="text-[9px] uppercase font-bold tracking-widest text-pink-100">
                                {selectedCard.isEmployee ? 'APEX INTERNAL MEMBER TOOL' : 'APEX BLACK CARD'}
                              </span>
                              <p className="text-sm font-bold italic text-[#4A044E] flex items-center gap-1.5 mt-0.5 truncate">
                                {selectedCard.cardType || 'Visa Infinite'}
                              </p>
                            </div>
                            
                            <div className="relative w-10 h-8 rounded-md bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500 p-0.5 border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
                              <div className="absolute inset-0.5 border border-[#F9A8D4]/50 rounded flex flex-col justify-between p-1">
                                <div className="flex justify-between h-full"><div className="w-[1px] bg-white/20" /><div className="w-[1px] bg-white/20" /></div>
                                <div className="h-[1px] bg-white/20 w-full" />
                              </div>
                              <div className="w-4 h-4 rounded bg-[#FBCFE8]/40" />
                            </div>
                          </div>

                          <div className="text-lg md:text-xl font-mono tracking-widest text-white my-3 z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate">
                            {selectedCard.cardNumber}
                          </div>

                          <div className="flex justify-between items-end z-10 w-full">
                            <div className="min-w-0">
                              <span className="text-[8px] text-pink-100/80 uppercase tracking-wide block font-bold">AUTHORIZED HOLDER</span>
                              <p className="text-xs font-semibold tracking-wide text-[#4A044E] truncate max-w-[180px]">{selectedCard.customerName}</p>
                            </div>
                            <div className="text-right shrink-0">
                               <span className="text-[8px] text-pink-100/80 uppercase tracking-wide block font-bold">EXPIRES</span>
                               <p className="text-[10px] font-mono text-[#4A044E]">{selectedCard.expiryDate}</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="w-full h-full bg-[#FFF1F5] border border-[#F9A8D4] rounded-2xl flex items-center justify-center text-xs text-[#9D174D]/80">
                          No terminal selected. Choose one in the ledger.
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* BACK SIDE (Realistic Banking Credit Card Back) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] z-10">
                    {selectedCard ? (
                      <div 
                        className={`relative w-full h-full rounded-2xl flex flex-col text-white overflow-hidden shadow-2xl border ${
                          selectedCard.status === 'Blocked' || selectedCard.status === 'Suspended' || selectedCard.status === 'Frozen'
                            ? 'bg-slate-300 border-slate-400 text-slate-800'
                            : 'bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-600 border-pink-300'
                        }`}
                      >
                        {/* Magnetic Stripe */}
                        <div className="w-full h-10 bg-zinc-950 mt-6 shadow-inner" />
                        
                        <div className="px-5 mt-4 space-y-4">
                          {/* Signature & CVV Area */}
                          <div className="flex items-end gap-3">
                            <div className="flex-1 min-w-0">
                              <span className="text-[7px] text-pink-100/90 uppercase tracking-widest font-bold mb-1 block pl-1 truncate">AUTHORIZED SIGNATURE AREA</span>
                              <div className="w-full h-9 bg-slate-100/90 rounded flex items-center px-4 overflow-hidden shadow-inner border-y border-slate-300">
                                <span className="font-serif italic text-slate-800 text-[11px] opacity-70 pointer-events-none select-none truncate">
                                  {selectedCard.customerName}
                                </span>
                              </div>
                            </div>
                            <div className="w-14 shrink-0">
                              <span className="text-[7px] text-pink-100/90 uppercase tracking-widest font-bold mb-1 block">CVV</span>
                              <div className="w-full h-9 bg-white rounded flex items-center justify-center font-mono text-slate-900 font-bold tracking-widest shadow-inner">
                                {selectedCard.cvv || "492"}
                              </div>
                            </div>
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[7px] font-bold text-pink-100/80 uppercase font-mono">
                             <div className="flex justify-between border-b border-pink-200/30 pb-0.5">
                               <span>Card Type:</span>
                               <span className="text-[#4A044E] truncate ml-2">{selectedCard.cardType?.split(' ')[0] || 'Visa'}</span>
                             </div>
                             <div className="flex justify-between border-b border-pink-200/30 pb-0.5">
                               <span>Issuing Bank:</span>
                               <span className="text-[#4A044E] truncate ml-2">Apex Bank</span>
                             </div>
                             <div className="flex justify-between border-b border-pink-200/30 pb-0.5">
                               <span>Status:</span>
                               <span className={`${selectedCard.status === 'Active' ? 'text-emerald-400' : 'text-pink-200'}`}>{selectedCard.status}</span>
                             </div>
                             <div className="flex justify-between border-b border-pink-200/30 pb-0.5">
                               <span>Issued:</span>
                               <span className="text-[#4A044E] truncate ml-2">{selectedCard.cardIssueDate?.split(' ')[1] || '06'}/{selectedCard.cardIssueDate?.split(' ')[2] || '2026'}</span>
                             </div>
                             <div className="flex justify-between border-b border-pink-200/30 pb-0.5">
                               <span>Expiry:</span>
                               <span className="text-[#4A044E] truncate ml-2">{selectedCard.expiryDate?.split('-')[1] || '12'}/{selectedCard.expiryDate?.split('-')[0] || '2029'}</span>
                             </div>
                             <div className="flex justify-between border-b border-pink-200/30 pb-0.5 flex items-center gap-1">
                               <Zap size={6} className="text-emerald-400 fill-emerald-400" />
                               <span>Contactless</span>
                             </div>
                          </div>
                        </div>

                        {/* Customer Support Footer */}
                        <div className="mt-auto px-5 py-2.5 bg-black/40 border-t border-pink-200/30 flex justify-between items-center text-[7px] font-mono text-[#9D174D]/75">
                          <div className="flex gap-3">
                            <span className="font-black text-white/40">APEX BANK GLOBAL</span>
                          </div>
                          <span>SESSION 0x{selectedCard.id.split('-')[1]}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                </div>
              </div>

              {/* Action Hint */}
              <p className="text-center text-[8px] text-[#9D174D]/80 font-mono mt-1.5 tracking-wider animate-pulse select-none">
                💡 CLICK THE CARD FACE TO TOGGLE CREDIT INTELLIGENCE
              </p>
            </div>

            {/* Slider Limit Controller (5 cols) */}
            {selectedCard && (
              <div className="md:col-span-5 p-4 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 flex flex-col justify-between">
                <div>
                  <span className="text-amber-500 text-[8px] font-mono tracking-widest uppercase font-bold block">Limit Adjuster</span>
                  <h3 className="text-xs font-bold text-[#4A044E] mt-1">Authorized credit ceiling</h3>
                  <p className="text-[#8495bc] text-[10px] leading-tight mt-0.5">Control operational limits for {selectedCard.customerName}.</p>
                </div>

                <div className="space-y-2 my-2">
                  <div className="flex justify-between text-[10px] text-[#9D174D]/85">
                    <span className="font-mono">${(100000).toLocaleString()}</span>
                    <span className="font-mono text-[#4A044E] font-bold">${limitInput.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range"
                    min="100000"
                    max="10000000"
                    step="50000"
                    value={limitInput}
                    onChange={(e) => setLimitInput(Number(e.target.value))}
                    className="w-full h-1 bg-[#141b44] rounded-full appearance-none accent-amber-500 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleUpdateLimit}
                  className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 text-[11px] font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  Confirm Limit Ceiling
                </button>
              </div>
            )}
          </div>

          {/* ACTIVE DETAILS NAVIGATION INTERFACES */}
          {selectedCard ? (
            <div className="p-5 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-4">
              
              {/* Tabs list bar */}
              <div className="flex border-b border-[#F9A8D4]/60 pb-2 overflow-x-auto gap-2">
                {[
                  { id: 'details', label: 'Security Profile', icon: User },
                  { id: 'transactions', label: 'Ledger Registry', icon: Activity },
                  { id: 'timeline', label: 'Lifecycle Audit', icon: History },
                  { id: 'analytics', label: 'Credit Analytics', icon: TrendingUp }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setIntelligenceActiveTab(tb.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      intelligenceActiveTab === tb.id 
                        ? 'bg-[#1a235c] text-amber-400' 
                        : 'text-[#9D174D]/75 hover:text-[#4A044E] hover:bg-[#FCE7F3]'
                    }`}
                  >
                    <tb.icon size={13} />
                    {tb.label}
                  </button>
                ))}
              </div>

              {/* ACTIVE SECTION CONTENTS */}
              <AnimatePresence mode="wait">
                {intelligenceActiveTab === 'details' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4 text-xs"
                  >
                    
                    {/* Holder & Account Double Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Owner Basic */}
                      <div className="p-3.5 bg-[#FCE7F3] border border-pink-500/20 rounded-xl space-y-2">
                        <h4 className="text-[10px] font-mono uppercase text-pink-400 font-bold tracking-wide">Owner Identification</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 flex items-center justify-center font-extrabold text-pink-500 text-sm">
                            {selectedCard.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-[#4A044E] text-[13px]">{selectedCard.customerName}</p>
                            <p className="text-[10px] text-pink-300/40 font-mono">{selectedCard.isEmployee ? 'Employee ID: ' : 'Customer ID: '}{selectedCard.customerId}</p>
                            <p className="text-[9px] text-pink-200/60">{selectedCard.emailAddress || 'N/A'}</p>
                            <p className="text-[9px] text-pink-300/40">{selectedCard.mobileNumber || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Account details */}
                      <div className="p-3.5 bg-[#FCE7F3] border border-pink-500/20 rounded-xl space-y-2">
                        <h4 className="text-[10px] font-mono uppercase text-pink-400 font-bold tracking-wide">Account Handshake</h4>
                        <div className="space-y-1 bg-pink-950/40 p-2 rounded border border-pink-500/10">
                          <div className="flex justify-between">
                            <span className="text-pink-300/60">Linked Account:</span>
                            <span className="font-mono text-[#4A044E] font-bold">{selectedCard.linkedAccountNumber || 'ACT-90812039'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-300/60">Product Category:</span>
                            <span className="text-[#4A044E] font-semibold">{selectedCard.accountType || 'VIP Current'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-300/60">Available Cash Bal:</span>
                            <span className="font-mono text-pink-400 font-bold">${(selectedCard.accountBalance || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Regional Branch information & Manager */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="p-3.5 bg-[#FCE7F3] border border-pink-500/20 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-1">
                          <Building size={12} className="text-pink-400" />
                          <h4 className="text-[10px] font-mono uppercase text-pink-400 font-bold tracking-wide">Servicing Branch Information</h4>
                        </div>
                        <p className="font-bold text-[#4A044E] mb-1.5">{selectedCard.branchName || 'Hyderabad Main Branch'}</p>
                        <div className="space-y-1 text-[11px] text-pink-100/60">
                          <p><span className="text-pink-300/40">Branch Code:</span> {selectedCard.branchCode || 'BR-101'}</p>
                          <p><span className="text-pink-300/40">State/Location:</span> {selectedCard.branchLocation || 'Hyderabad, Telangana'}</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-[#FCE7F3] border border-pink-500/20 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-1">
                          <Briefcase size={12} className="text-pink-400" />
                          <h4 className="text-[10px] font-mono uppercase text-pink-400 font-bold tracking-wide">Branch Manager Details</h4>
                        </div>
                        <p className="font-bold text-[#4A044E] mb-1.5">{selectedCard.branchManagerName || 'Mohammed Rahman'}</p>
                        <div className="space-y-1 text-[11px] text-pink-100/60">
                          <p><span className="text-pink-300/40">Designation:</span> {selectedCard.branchManagerDesignation || 'Branch Manager'}</p>
                          <p><span className="text-pink-300/40">ID Ref:</span> {selectedCard.branchManagerEmployeeId || 'EMP-0007'}</p>
                          <p><span className="text-pink-300/40">Authorized contact:</span> {selectedCard.branchManagerMobile || '+91 99012 34567'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Issuance Chain and Approval Handover details */}
                    <div className="p-3.5 bg-[#FCE7F3] border border-pink-500/20 rounded-xl space-y-2.5">
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={13} className="text-pink-400" />
                        <h4 className="text-[10px] font-mono uppercase text-pink-400 font-bold tracking-wide">Card Issuance & Approval Security Chain</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-2.5 bg-pink-950/40 rounded border border-pink-500/10">
                          <p className="text-pink-300/60 text-[9px] uppercase font-bold mb-1">Issued By</p>
                          <p className="font-bold text-[#4A044E] leading-tight">{selectedCard.cardIssuedByName || 'Sarah Jenkins'}</p>
                          <p className="text-[9px] text-pink-200/40 mt-0.5">{selectedCard.cardIssuedByDesignation || 'Senior Compliance Officer'}</p>
                          <p className="text-[10px] font-mono text-pink-400 mt-1">{selectedCard.cardIssueDate || '12 June 2026'}</p>
                        </div>

                        <div className="p-2.5 bg-pink-950/40 rounded border border-pink-500/10">
                          <p className="text-pink-300/60 text-[9px] uppercase font-bold mb-1">Activated Status</p>
                          <p className="font-bold text-[#4A044E] leading-tight">{selectedCard.cardActivatedByName || 'Sarah Jenkins'}</p>
                          <p className="text-[9px] text-pink-200/40 mt-0.5">Activation handoff check</p>
                          <p className="text-[10px] font-mono text-pink-400 mt-1">{selectedCard.cardActivationTime ? `${selectedCard.cardActivationDate} ${selectedCard.cardActivationTime}` : 'Pending Activation'}</p>
                        </div>

                        <div className="p-2.5 bg-pink-950/40 rounded border border-pink-500/10">
                          <p className="text-pink-300/60 text-[9px] uppercase font-bold mb-1">Super Audit Signoff</p>
                          <p className="font-bold text-[#4A044E] leading-tight">{selectedCard.approvedByName || 'Chloe Dupont'}</p>
                          <p className="text-[9px] text-pink-200/40 mt-0.5">{selectedCard.approvalRole || 'Senior Underwriter'}</p>
                          <p className="text-[10px] font-mono text-pink-400 mt-1">{selectedCard.approvalDate ? `${selectedCard.approvalDate}` : 'Under Review'}</p>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* LEDGER TRANSACTION REGISTRY FOR SELECTED CARD */}
                {intelligenceActiveTab === 'transactions' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-[#4A044E] uppercase tracking-wide text-[11px]">Authorized Terminal Expenses Node</h4>
                        <p className="text-[10px] text-pink-300/60">Actual merchant transactions mapped under verified billing cycle.</p>
                      </div>
                      <div className="text-right">
                        <span className="text-pink-300/60 text-[9px] block">TOTAL OUTSTANDING</span>
                        <span className="font-mono font-bold text-pink-400">${(selectedCard.balance || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border border-pink-500/20 rounded-xl overflow-hidden bg-[#FCE7F3] text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-pink-950/60 text-pink-500 font-bold text-[9px] uppercase tracking-wider border-b border-pink-500/20">
                            <th className="p-2.5">Transaction ID</th>
                            <th className="p-2.5">Merchant</th>
                            <th className="p-2.5">Category</th>
                            <th className="p-2.5 text-right">Amount</th>
                            <th className="p-2.5">Time Stamp</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCard.cardTransactions && selectedCard.cardTransactions.length > 0 ? (
                            selectedCard.cardTransactions.map((tx) => (
                              <tr key={tx.id} className="border-b border-pink-500/10 hover:bg-pink-500/5">
                                <td className="p-2.5 font-mono text-pink-300/40">{tx.id}</td>
                                <td className="p-2.5 font-bold text-[#4A044E]">{tx.merchant}</td>
                                <td className="p-2.5">
                                  <span className="px-1.5 py-0.5 bg-pink-900/30 text-pink-300 rounded text-[9px]">
                                    {tx.type}
                                  </span>
                                </td>
                                <td className="p-2.5 text-right font-mono font-bold text-pink-400">
                                  ${tx.amount.toLocaleString()}
                                </td>
                                <td className="p-2.5 text-[10px] text-pink-200/40">
                                  {tx.date} • {tx.time}
                                </td>
                                <td className="p-2.5 text-[9px]">
                                  <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                                    tx.status === 'Completed' 
                                      ? 'bg-emerald-500/10 text-emerald-400' 
                                      : 'bg-rose-500/10 text-rose-400'
                                  }`}>
                                    {tx.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center py-6 text-pink-300/40 italic text-[11px]">
                                No transactions reported on this terminal cycle.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Spend Allocation Analytics preview summary */}
                    <div className="grid grid-cols-3 gap-3 p-3 bg-[#FCE7F3] border border-pink-500/20 rounded-xl text-center">
                      <div>
                        <span className="text-pink-300/60 text-[9px] uppercase tracking-wider block">Total Transactions</span>
                        <span className="text-sm font-mono font-extrabold text-[#4A044E]">
                          {selectedCard.cardTransactions?.length || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-pink-300/60 text-[9px] uppercase tracking-wider block">Cycle Expenses</span>
                        <span className="text-sm font-mono font-extrabold text-pink-500 truncate block max-w-[80px]">
                          ₹{(selectedCard.balance || 0).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-pink-300/60 text-[9px] uppercase tracking-wider block">Asset Headroom</span>
                        <span className="text-sm font-mono font-extrabold text-emerald-400 truncate block max-w-[80px]">
                          ₹{((selectedCard.availableLimit || selectedCard.limit)).toLocaleString()}
                        </span>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* LIFECYCLE AUDIT TIMELINE PROGRESSION */}
                {intelligenceActiveTab === 'timeline' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="font-bold text-[#4A044E] uppercase text-[11px] tracking-wide">Terminal Lifecycle Security Timeline</h4>
                      <p className="text-[10px] text-pink-300/60">Handoff stamps tracking authorization, key parameters check, and delivery logs.</p>
                    </div>

                    <div className="relative pl-6 space-y-4 border-l-2 border-pink-900/40 ml-2">
                      {selectedCard.cardTimeline && selectedCard.cardTimeline.length > 0 ? (
                        selectedCard.cardTimeline.map((ev, idx) => (
                          <div key={ev.id} className="relative">
                            
                            {/* Visual glowing knot */}
                            <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#FCE7F3] border-2 border-pink-500/80 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                            </span>

                            <div className="p-3 bg-[#FCE7F3] border border-pink-500/20 rounded-xl space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-[#4A044E] text-[11px] uppercase tracking-wider">{idx + 1}. {ev.event}</span>
                                <span className="text-[9px] font-mono text-pink-400">{ev.date} at {ev.time}</span>
                              </div>
                              <p className="text-pink-300/60 text-[10px]">{ev.remarks}</p>
                              <div className="flex gap-1 items-center text-[9px] text-pink-200/40">
                                <span>Supervisor Responsible:</span>
                                <span className="font-bold text-[#4A044E]">{ev.employee}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-[#9D174D]/75 italic py-4">
                          No timeline progression milestones added to this card cardholder node.
                        </div>
                      )}
                    </div>

                  </motion.div>
                )}

                {/* HIGHER END ANALYTICS TAB WITH HEALTH SCORE GRAPH */}
                {intelligenceActiveTab === 'analytics' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    
                    {/* Header values */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-2.5 bg-[#FCE7F3] border border-pink-500/20 rounded-xl text-center">
                        <span className="text-pink-300/60 text-[9px] uppercase tracking-wider block">Credit Score</span>
                        <span className="text-sm font-mono font-bold text-pink-400">{selectedCard.creditScore || '780'}</span>
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 py-0.5 px-1 rounded block mt-0.5 uppercase tracking-widest">{selectedCard.creditRating || 'Excellent'}</span>
                      </div>

                      <div className="p-2.5 bg-[#FCE7F3] border border-pink-500/20 rounded-xl text-center">
                        <span className="text-pink-300/60 text-[9px] uppercase tracking-wider block">Risk Parameter</span>
                        <span className={`text-xs font-bold block mt-1.5 ${
                          selectedCard.riskProfile === 'High Risk' ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {selectedCard.riskProfile || 'Low Risk'}
                        </span>
                      </div>

                      <div className="p-2.5 bg-[#FCE7F3] border border-pink-500/20 rounded-xl text-center">
                        <span className="text-pink-300/60 text-[10px] uppercase tracking-wider block">Utilization</span>
                        <span className="text-sm font-mono font-bold text-[#4A044E]">{selectedCard.creditUtilizationRatio || '0'}%</span>
                      </div>

                      <div className="p-2.5 bg-[#FCE7F3] border border-pink-500/20 rounded-xl text-center">
                        <span className="text-pink-300/60 text-[10px] uppercase block">Payments Registry</span>
                        <div className="flex justify-center gap-1.5 text-[9px] mt-1 font-mono">
                          <span className="text-emerald-400" title="On-time">✓{selectedCard.paymentHistory?.onTime || 0}</span>
                          <span className="text-rose-400" title="Missed">✗{selectedCard.paymentHistory?.missed || 0}</span>
                          <span className="text-pink-500" title="Delayed">!{selectedCard.paymentHistory?.delayed || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Trend Chart using recharts */}
                    <div className="p-4 bg-[#2a1020] border border-pink-500/20 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-pink-400 font-bold">Credit Rating Score Velocity (Trend Curve)</span>
                        <span className="text-[8px] font-mono text-pink-200/40">Past 6 Months Handoff Rating</span>
                      </div>
                      
                      <div className="w-full h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#f9a8d4" fontSize={9} />
                            <YAxis domain={[550, 900]} stroke="#f9a8d4" fontSize={9} />
                            <Tooltip contentStyle={{ backgroundColor: '#1a0a14', borderColor: '#ec4899', fontSize: 10, color: '#fff' }} />
                            <Area type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUPER ADMIN QUICK ACTION CONTROLLER PANEL */}
              <div className="pt-2 border-t border-pink-500/20 space-y-2">
                <span className="text-pink-300/40 text-[10px] block font-bold uppercase tracking-wider">Super User Administrative Operations</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-[10px]">
                  
                  <button
                    onClick={() => {
                      handleBlockCardToggle(selectedCard);
                    }}
                    className={`px-2 py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                      selectedCard.status === 'Blocked'
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                    }`}
                  >
                    {selectedCard.status === 'Blocked' ? 'Unblock Terminal' : 'Block Card Terminal'}
                  </button>

                  <button
                    onClick={() => {
                      console.log(`Exported secure credit health dossier for ${selectedCard.customerName} inside private folder. Check security audit terminal logs.`);
                      addAuditLog(`Super Admin downloaded complete credit rating analytics report dossier for ${selectedCard.customerName} [ID: ${selectedCard.id}]`, 'Info');
                    }}
                    className="px-2 py-2 rounded-lg font-bold border border-pink-900/40 bg-[#2d1020] text-pink-200/60 hover:text-[#4A044E] transition-all cursor-pointer"
                  >
                    Download Dossier Report
                  </button>

                  <button
                    onClick={() => {
                      console.log(`Transmitting internal bank alert request to Branch Manager Mohammed Rahman...`);
                      addAuditLog(`Issued instant high-priority supervisor contact call to ${selectedCard.branchManagerName} regarding security profile [Card Reference Ref: ${selectedCard.id}]`, 'Warning');
                    }}
                    className="px-2 py-2 rounded-lg font-bold border border-pink-900/40 bg-[#2d1020] text-pink-200/60 hover:text-[#4A044E] transition-all cursor-pointer"
                  >
                    Contact Area Director
                  </button>

                  <button
                    onClick={() => {
                      console.log(`Direct communications bridge established with issuing officer: ${selectedCard.cardIssuedByName}. Redirecting secure communication...`);
                    }}
                    className="px-2 py-2 rounded-lg font-bold border border-pink-900/40 bg-[#2d1020] text-pink-200/60 hover:text-pink-400 transition-all cursor-pointer"
                  >
                    Message Initiator
                  </button>

                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 text-[#9D174D]/80 text-xs">
              Select any credit card in the Plastic Terminal Ledger left-hand table to review dynamic profile indicators.
            </div>
          )}

        </div>

      </div>

      {/* ----------------- CREDIT INTELLIGENCE DASHBOARD OVERLAY ----------------- */}
      <AnimatePresence>
        {showIntelligence && selectedCard && (
          <>
            {/* Backdrop Dimmer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowIntelligence(false)}
              className="fixed inset-0 bg-black/35 backdrop-blur-[6px] z-[99999]"
            />

                <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.98 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-x-0 inset-y-0 m-auto w-[82%] h-[85%] z-[99999] bg-gradient-to-br from-[#FFF5F8] via-[#FCE7F3] to-[#FBCFE8] backdrop-blur-[32px] border-2 border-white/60 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(194,24,91,0.4)] flex flex-col overflow-hidden ring-1 ring-[#C2185B]/20"
              >
                {/* Dashboard Internal Header */}
                <div className="p-6 border-b border-[#C2185B]/10 bg-white/40 backdrop-blur-md flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#C2185B]/10 border border-[#C2185B]/20 flex items-center justify-center text-[#C2185B]">
                      <LayoutDashboard size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-[#C2185B] tracking-tight uppercase">Credit Intelligence Terminal</h2>
                      <p className="text-xs text-[#4A5568] font-mono tracking-wider font-bold">SECURE AUDIT ACCESS • SESSION REF: 0x{selectedCard.id.split('-')[1]}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowIntelligence(false)}
                    className="p-3 rounded-full hover:bg-[#C2185B]/10 text-[#C2185B] transition-all cursor-pointer border border-[#C2185B]/20"
                  >
                    <Lock size={20} />
                  </button>
                </div>

                {/* Scrollable Intelligence Content */}
                <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-thin scrollbar-thumb-[#C2185B]/20">
                  
                  {/* 1. TOP SECURE PROFILE & SCORE */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Gauge Card (5 cols) */}
                    <div className="xl:col-span-5 p-10 rounded-[2.5rem] bg-white/70 border border-white/80 shadow-2xl relative overflow-hidden group backdrop-blur-md">
                      <div className="absolute -right-20 -top-20 w-48 h-48 bg-[#C2185B]/10 rounded-full blur-3xl" />
                        <div className="relative flex flex-col items-center">
                          <span className="text-[11px] font-black tracking-[0.25em] text-[#C2185B] mb-10 uppercase">Identity Integrity Score</span>
                          
                          <div className="relative w-64 h-64 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                            <circle cx="128" cy="128" r="110" className="stroke-[#C2185B]/10" strokeWidth="16" fill="transparent" />
                            <motion.circle 
                              cx="128" cy="128" r="110" 
                              className="stroke-[#C2185B]" 
                              strokeWidth="18" fill="transparent" 
                              strokeDasharray={2 * Math.PI * 110}
                              initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - (selectedCard.creditScore || 750) / 900) }}
                              transition={{ duration: 1.8, ease: "circOut" }}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-7xl font-black text-[#1A202C] tracking-tighter"
                            >
                              {selectedCard.creditScore}
                            </motion.span>
                            <span className="text-lg font-black text-[#C2185B] mt-2 uppercase tracking-[0.3em]">{selectedCard.creditRating}</span>
                          </div>
                        </div>
                        <div className="mt-12 flex gap-12 w-full justify-center">
                          <div className="text-center">
                            <p className="text-[12px] text-[#4A5568] font-black uppercase mb-2 tracking-wider">Utilization</p>
                            <p className="text-2xl font-mono font-black text-[#1A202C]">{selectedCard.creditUtilizationRatio}%</p>
                          </div>
                          <div className="h-16 w-px bg-[#C2185B]/20" />
                          <div className="text-center">
                            <p className="text-[12px] text-[#4A5568] font-black uppercase mb-2 tracking-wider">Status</p>
                            <p className={`text-2xl font-mono font-black ${selectedCard.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>{selectedCard.status.toUpperCase().split(' ')[0]}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 rounded-[2rem] bg-white/80 border border-white/40 flex items-center justify-between shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-6 min-w-0">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 shrink-0">
                        <Wallet size={32} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-[#4A5568] uppercase tracking-[0.2em] truncate mb-1.5 opacity-80">Available Credit</p>
                        <h4 className="text-3xl font-mono font-black text-[#1A202C] truncate">₹{(selectedCard.availableLimit || 0).toLocaleString()}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-white/80 border border-white/40 flex items-center justify-between shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-6 min-w-0">
                      <div className="w-16 h-16 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-600 shrink-0">
                        <Activity size={32} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-[#4A5568] uppercase tracking-[0.2em] truncate mb-1.5 opacity-80">Current Utilization</p>
                        <h4 className="text-3xl font-mono font-black text-[#1A202C] truncate">₹{(selectedCard.balance || 0).toLocaleString()}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-[#C2185B]/10 border border-[#C2185B]/30 flex items-center justify-between shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-6 min-w-0">
                      <div className="w-16 h-16 rounded-2xl bg-[#C2185B]/20 flex items-center justify-center text-[#C2185B] shrink-0">
                        <ShieldCheck size={32} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-[#C2185B] uppercase tracking-[0.2em] truncate mb-1.5 opacity-90">Authorized Cap</p>
                        <h4 className="text-3xl font-mono font-black text-[#C2185B] truncate">₹{(selectedCard.limit || 0).toLocaleString()}</h4>
                      </div>
                    </div>
                  </div>
                </div>
                  </div>

                  {/* 2. ANALYTICS & REPAYMENT */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Spend Analytics */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 size={20} className="text-[#C2185B]" />
                        <h3 className="text-sm font-black text-[#C2185B] uppercase tracking-[0.2em]">Spend Intelligence</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {[
                          { label: 'Monthly Delta', val: selectedCard.creditAnalytics?.monthlySpending || 0, icon: Calendar, color: 'text-blue-600' },
                          { label: 'Yearly Aggregate', val: selectedCard.creditAnalytics?.yearlySpending || 0, icon: Globe, color: 'text-purple-600' },
                          { label: 'Highest Pulse', val: selectedCard.creditAnalytics?.highestTransaction || 0, icon: ArrowUpRight, color: 'text-rose-600' },
                          { label: 'Transaction Vol', val: selectedCard.creditAnalytics?.totalTransactions || 0, icon: Activity, color: 'text-emerald-600', isCurrency: false }
                        ].map((item, id) => (
                          <div key={id} className="p-5 rounded-[1.5rem] bg-white/60 border border-white space-y-2 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#4A5568] uppercase tracking-tight">{item.label}</span>
                              <item.icon size={14} className={item.color} />
                            </div>
                            <p className="text-xl font-mono font-black text-[#1A202C]">
                              {item.isCurrency === false ? item.val : `₹${(item.val as number).toLocaleString()}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={20} className="text-[#C2185B]" />
                        <h3 className="text-sm font-black text-[#C2185B] uppercase tracking-[0.2em]">Repayment Performance</h3>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-white/70 border border-white shadow-lg space-y-8">
                        <div className="flex justify-between items-end overflow-hidden">
                          <div className="space-y-1 min-w-0">
                            <p className="text-[11px] font-bold text-[#4A5568] uppercase truncate">Minimum Due</p>
                            <p className="text-2xl lg:text-3xl font-mono font-black text-[#1A202C] truncate">₹{(selectedCard.paymentSummary?.minimumDue || 0).toLocaleString()}</p>
                          </div>
                          <div className="text-right space-y-1 shrink-0">
                            <p className="text-[11px] font-bold text-[#4A5568] uppercase">Due Date</p>
                            <p className="text-lg font-mono font-black text-[#C2185B]">{selectedCard.paymentSummary?.nextPaymentDate || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 pt-6 border-t border-[#C2185B]/10">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#4A5568] font-bold">Last Payment: {selectedCard.paymentSummary?.lastPaymentDate}</span>
                            <span className="text-emerald-600 font-extrabold">₹{(selectedCard.paymentSummary?.lastPaymentAmount || 0).toLocaleString()}</span>
                          </div>
                          <div className="w-full h-2 bg-[#C2185B]/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                            />
                          </div>
                        </div>

                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                            <ShieldCheck size={20} />
                          </div>
                          <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                            Repayment performance is marked as <strong className="font-black">EXCELLENT</strong>. All EMI cycles are fully synchronized within network parameters.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. RISK ASSESSMENT GAUGE HUB */}
                  <div className="p-8 rounded-[2rem] bg-white/60 border border-white shadow-lg space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <ShieldAlert size={20} className="text-[#C2185B]" />
                          <h3 className="text-sm font-black text-[#C2185B] uppercase tracking-[0.2em]">Risk Assessment Node</h3>
                      </div>
                      <span className="text-[10px] font-mono text-[#4A5568] font-bold">MODEL V4.02 SECURED</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {[
                        { label: 'Fraud Score', val: selectedCard.riskAssessment?.fraudRiskScore || 0, status: 'Good', sub: 'Low Hazard', color: 'text-emerald-600' },
                        { label: 'Credit Health', val: selectedCard.riskAssessment?.creditHealthStatus || 'Good', status: 'Optimal', sub: 'No Defaults', color: 'text-blue-600' },
                        { label: 'EMI Stability', val: selectedCard.riskAssessment?.emiPerformance || 'Stable', status: 'Locked', sub: 'Predictable', color: 'text-purple-600' },
                        { label: 'Missed Cycles', val: selectedCard.riskAssessment?.missedPaymentsCount || 0, status: 'Zero', sub: 'Perf Profile', color: 'text-emerald-600' },
                        { label: 'Repayment', val: '100%', status: 'Manual OK', sub: 'Sovereign', color: 'text-blue-600' },
                      ].map((risk, idx) => (
                          <div key={idx} className="p-5 rounded-[1.5rem] bg-white/80 border border-white space-y-3 group hover:border-[#C2185B]/30 transition-all shadow-sm">
                            <p className="text-[10px] font-extrabold text-[#4A5568] uppercase">{risk.label}</p>
                            <p className={`text-2xl font-black ${risk.color} tracking-tight`}>{risk.val}</p>
                            <div className="flex items-center justify-between border-t border-[#C2185B]/5 pt-2">
                              <span className="text-[9px] font-mono font-bold text-[#4A5568]/60 uppercase">{risk.sub}</span>
                              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. ACTIVITY & OWNERSHIP */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Card Terminal Activity */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                          <Clock size={20} className="text-[#C2185B]" />
                          <h3 className="text-sm font-black text-[#C2185B] uppercase tracking-[0.2em]">Last Known Activity</h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'Last Transaction', act: selectedCard.cardActivity?.lastTransaction, icon: CardIcon },
                          { label: 'ATM Withdrawal', act: selectedCard.cardActivity?.lastATM, icon: DollarSign },
                          { label: 'Online Purchase', act: selectedCard.cardActivity?.lastOnline, icon: Globe },
                          { label: 'POS Terminal', act: selectedCard.cardActivity?.lastPOS, icon: Zap },
                          { label: 'International', act: selectedCard.cardActivity?.lastInternational, icon: MapPin }
                        ].map((activity, idx) => (
                          <div key={idx} className="p-5 rounded-[1.5rem] bg-white/60 border border-white flex items-center justify-between group hover:border-[#C2185B]/30 transition-all shadow-sm">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#C2185B]/5 flex items-center justify-center text-[#4A5568] group-hover:text-[#C2185B] transition-colors">
                                  <activity.icon size={22} />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-[#1A202C] uppercase tracking-tight">{activity.label}</p>
                                  <p className="text-[10px] text-[#4A5568] font-bold">{activity.act?.location}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-mono font-black text-[#1A202C]">₹{activity.act?.amount?.toLocaleString()}</p>
                                <p className="text-[9px] text-[#4A5568] font-mono font-bold uppercase">{activity.act?.date}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Ownership */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                          <User size={20} className="text-[#C2185B]" />
                          <h3 className="text-sm font-black text-[#C2185B] uppercase tracking-[0.2em]">Operational Ownership</h3>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-white/70 border border-white shadow-lg space-y-8">
                         <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                            <div>
                              <p className="text-[11px] font-bold text-[#4A5568] uppercase mb-1">Account Holder</p>
                              <p className="text-base font-black text-[#1A202C]">{selectedCard.customerName}</p>
                              <p className="text-xs text-blue-600 font-mono font-bold mt-1">{selectedCard.customerId}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-[#4A5568] uppercase mb-1">Branch Origin</p>
                              <p className="text-base font-black text-[#1A202C]">{selectedCard.branchName}</p>
                              <p className="text-xs text-[#4A5568]/60 font-bold mt-1">{selectedCard.branchLocation}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-[#4A5568] uppercase mb-1">Branch Manager</p>
                              <p className="text-base font-black text-[#1A202C]">{selectedCard.branchManagerName}</p>
                              <p className="text-xs text-[#4A5568]/60 font-bold mt-1">{selectedCard.branchManagerDesignation}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-[#4A5568] uppercase mb-1">Issuing Officer</p>
                              <p className="text-base font-black text-[#1A202C]">{selectedCard.cardIssuedByName}</p>
                              <p className="text-xs text-[#4A5568]/60 font-bold mt-1">EMP REF: {selectedCard.cardIssuedByEmployeeId}</p>
                            </div>
                         </div>
                         <div className="pt-8 border-t border-[#C2185B]/10 grid grid-cols-2 gap-6">
                            <div className="p-4 rounded-2xl bg-white/60 border border-white shadow-sm">
                              <p className="text-[10px] font-bold text-[#4A5568] uppercase mb-1">Issue Date</p>
                              <p className="text-sm font-mono font-black text-[#1A202C]">{selectedCard.cardIssueDate}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
                              <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">Activation Date</p>
                              <p className="text-sm font-mono font-black text-emerald-800">{selectedCard.cardActivationDate}</p>
                            </div>
                         </div>
                      </div>

                      {/* SUPER ADMIN EXCLUSIVE ACTIONS */}
                      <div className="pt-6">
                         <h3 className="text-sm font-black text-[#C2185B] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                          <ShieldCheck size={20} />
                          Super Admin Critical Controls
                         </h3>
                         <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setAdminDetailView('statement')} className="p-4 rounded-2xl bg-white/60 border border-white text-[#1A202C] text-[11px] font-black uppercase tracking-widest hover:bg-white shadow-sm hover:shadow-md transition-all cursor-pointer text-left flex items-center gap-3">
                              <FileText size={18} className="text-blue-600" />
                              Full Statement
                            </button>
                            <button onClick={() => setAdminDetailView('report')} className="p-4 rounded-2xl bg-white/60 border border-white text-[#1A202C] text-[11px] font-black uppercase tracking-widest hover:bg-white shadow-sm hover:shadow-md transition-all cursor-pointer text-left flex items-center gap-3">
                              <Download size={18} className="text-emerald-600" />
                              Credit Report
                            </button>
                            <button onClick={() => setAdminDetailView('history')} className="p-4 rounded-2xl bg-white/60 border border-white text-[#1A202C] text-[11px] font-black uppercase tracking-widest hover:bg-white shadow-sm hover:shadow-md transition-all cursor-pointer text-left flex items-center gap-3">
                              <History size={18} className="text-purple-600" />
                              Secure History
                            </button>
                            <button onClick={() => setAdminDetailView('limit')} className="p-4 rounded-2xl bg-white/60 border border-white text-[#1A202C] text-[11px] font-black uppercase tracking-widest hover:bg-white shadow-sm hover:shadow-md transition-all cursor-pointer text-left flex items-center gap-3">
                              <TrendingUp size={18} className="text-amber-600" />
                              Increase Limit
                            </button>
                            <button onClick={() => handleToggleFreezeCard(selectedCard)} className={`p-4 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer text-left flex items-center gap-3 shadow-sm ${selectedCard.status === 'Frozen' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'}`}>
                              <Lock size={18} />
                              {selectedCard.status === 'Frozen' ? 'Unfreeze Card' : 'Emergency Freeze'}
                            </button>
                            <button onClick={() => handleBlockCardToggle(selectedCard)} className={`p-4 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer text-left flex items-center gap-3 shadow-sm ${selectedCard.status === 'Blocked' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                              <Ban size={18} />
                              {selectedCard.status === 'Blocked' ? 'Unblock Terminal' : 'Permanent Block'}
                            </button>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Security Note */}
                  <div className="pt-12 pb-8 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/40 border border-white shadow-sm">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span className="text-[11px] font-mono text-[#4A5568] font-bold uppercase tracking-[0.3em]">Authorized Super Admin Environment • Bank Vault Node: 0x942-APEX</span>
                    </div>
                  </div>

                </div>

              {/* ----------------- SUB-VIEW OVERLAYS ----------------- */}
              <AnimatePresence>
                {adminDetailView && (
                  <motion.div
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    className="absolute inset-0 z-[110] bg-[#FFF1F5]/90 flex flex-col pt-20"
                  >
                    <div className="flex-1 overflow-y-auto px-8 pb-12">
                      <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-10 border-b border-[#C2185B]/10 pb-6">
                           <div className="flex items-center gap-4">
                              <div className="p-4 bg-[#C2185B]/10 rounded-2xl text-[#C2185B]">
                                {adminDetailView === 'statement' && <FileText size={28} />}
                                {adminDetailView === 'report' && <Download size={28} />}
                                {adminDetailView === 'history' && <History size={28} />}
                                {adminDetailView === 'limit' && <TrendingUp size={28} />}
                                {adminDetailView === 'contact_holder' && <Phone size={28} />}
                                {adminDetailView === 'contact_manager' && <Building size={28} />}
                              </div>
                              <div>
                                <h3 className="text-2xl font-black text-[#C2185B] uppercase tracking-tight">
                                  {adminDetailView.replace('_', ' ')} Terminal
                                </h3>
                                <p className="text-xs text-[#4A5568] font-mono font-bold">SECURE MODULE ARCHIVE • DATA ENCRYPTION ACTIVE</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => setAdminDetailView(null)}
                             className="px-6 py-2.5 bg-white border border-[#C2185B]/20 text-[#C2185B] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#C2185B]/5 shadow-sm transition-all cursor-pointer"
                           >
                             Close Terminal
                           </button>
                        </div>

                        {/* CONTENT SWITCHER */}
                        {adminDetailView === 'statement' && (
                          <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                               <div className="p-6 rounded-[1.5rem] bg-white border border-white shadow-sm">
                                 <p className="text-[10px] font-black text-[#4A5568] uppercase mb-1">Statement Period</p>
                                 <p className="text-base font-black text-[#1A202C]">JUNE 2026</p>
                               </div>
                               <div className="p-6 rounded-[1.5rem] bg-white border border-white shadow-sm">
                                 <p className="text-[10px] font-black text-[#C2185B] uppercase mb-1">Closing Balance</p>
                                 <p className="text-base font-black text-[#1A202C]">₹{selectedCard.balance.toLocaleString()}</p>
                               </div>
                               <div className="p-6 rounded-[1.5rem] bg-white border border-white shadow-sm">
                                 <p className="text-[10px] font-black text-[#C2185B] uppercase mb-1">Min Due</p>
                                 <p className="text-base font-black text-[#1A202C]">₹{(selectedCard.paymentSummary?.minimumDue || 0).toLocaleString()}</p>
                               </div>
                               <div className="p-6 rounded-[1.5rem] bg-white border border-white shadow-sm">
                                 <p className="text-[10px] font-black text-[#4A5568] uppercase mb-1">Due Date</p>
                                 <p className="text-base font-black text-rose-600">{selectedCard.paymentSummary?.nextPaymentDate}</p>
                               </div>
                            </div>
                            <div className="bg-white rounded-[2rem] border border-[#C2185B]/5 overflow-hidden shadow-xl">
                               <div className="p-5 bg-[#C2185B]/5 font-mono text-[11px] text-[#C2185B] font-black grid grid-cols-4 uppercase tracking-widest border-b border-[#C2185B]/5">
                                 <span>Transaction ID</span>
                                 <span>Description</span>
                                 <span className="text-right">Category</span>
                                 <span className="text-right">Amount</span>
                               </div>
                               <div className="divide-y divide-[#C2185B]/5">
                                 {selectedCard.cardTransactions?.map((tx, i) => (
                                   <div key={i} className="p-5 grid grid-cols-4 items-center text-sm hover:bg-[#C2185B]/[0.02] transition-colors">
                                     <span className="font-mono text-xs text-blue-600 font-bold">{tx.id}</span>
                                     <span className="text-[#1A202C] font-black">{tx.merchant}</span>
                                     <span className="text-[#4A5568] text-right text-xs font-bold uppercase">{tx.type}</span>
                                     <span className="text-[#1A202C] font-black text-right font-mono">₹{tx.amount.toLocaleString()}</span>
                                   </div>
                                 ))}
                               </div>
                            </div>
                          </div>
                        )}

                        {adminDetailView === 'report' && (
                          <div className="p-10 rounded-[2.5rem] bg-white border border-white shadow-2xl space-y-10">
                             <div className="flex justify-between items-start">
                                <div className="space-y-4">
                                   <p className="text-[11px] font-black text-[#C2185B] font-mono tracking-[0.2em] uppercase">SYSTEM GENERATED CREDIT REPORT</p>
                                   <h4 className="text-4xl font-black text-[#1A202C] tracking-tight">{selectedCard.customerName}</h4>
                                   <p className="text-sm text-[#4A5568] font-bold">CUSTOMER REF: {selectedCard.customerId}</p>
                                </div>
                                <div className="text-right p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-sm">
                                   <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Integrity Score</p>
                                   <p className="text-5xl font-black text-emerald-600">{selectedCard.creditScore}</p>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                   <p className="text-xs font-black text-[#C2185B] uppercase tracking-[0.2em] border-l-4 border-[#C2185B] pl-4">Risk Assessment Summaries</p>
                                   <div className="space-y-4">
                                      <div className="flex justify-between text-sm py-2 border-b border-[#C2185B]/5">
                                         <span className="text-[#4A5568] font-bold">Inquiry Volume (6M)</span>
                                         <span className="text-[#1A202C] font-black">2</span>
                                      </div>
                                      <div className="flex justify-between text-sm py-2 border-b border-[#C2185B]/5">
                                         <span className="text-[#4A5568] font-bold">Accounts Open</span>
                                         <span className="text-[#1A202C] font-black">4</span>
                                      </div>
                                      <div className="flex justify-between text-sm py-2">
                                         <span className="text-[#4A5568] font-bold">Derogatory Marks</span>
                                         <span className="text-emerald-600 font-black">NONE</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="space-y-6">
                                   <p className="text-xs font-black text-amber-600 uppercase tracking-[0.2em] border-l-4 border-amber-500 pl-4">Liquidity Factors</p>
                                   <div className="space-y-4">
                                      <div className="flex justify-between text-sm py-2 border-b border-[#C2185B]/5">
                                         <span className="text-[#4A5568] font-bold">Avg Account Age</span>
                                         <span className="text-[#1A202C] font-black">8.4 Years</span>
                                      </div>
                                      <div className="flex justify-between text-sm py-2">
                                         <span className="text-[#4A5568] font-bold">Asset Verification</span>
                                         <span className="text-emerald-600 font-black">CONFIRMED</span>
                                      </div>
                                   </div>
                                </div>
                             </div>

                             <button className="w-full py-5 bg-[#C2185B] hover:bg-[#AD1457] text-[#4A044E] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#C2185B]/20">
                                <Download size={20} />
                                Generate Official PDF Dossier
                             </button>
                          </div>
                        )}

                        {adminDetailView === 'limit' && (
                          <div className="space-y-10">
                             <div className="p-10 rounded-[2.5rem] bg-white border border-white shadow-xl flex flex-col items-center">
                                <p className="text-[11px] font-black text-[#C2185B] uppercase tracking-[0.3em] mb-4">Current Authorized Ceiling</p>
                                <p className="text-6xl font-black text-[#1A202C] font-mono tracking-tighter">₹{selectedCard.limit.toLocaleString()}</p>
                             </div>

                             <div className="p-10 rounded-[2.5rem] bg-white border border-white shadow-xl space-y-10">
                                <div>
                                   <div className="flex justify-between items-end mb-6">
                                      <label className="text-[11px] font-black text-[#4A5568] uppercase tracking-[0.2em]">Adjust New Limit Threshold</label>
                                      <span className="text-3xl font-mono font-black text-[#C2185B]">₹{limitInput.toLocaleString()}</span>
                                   </div>
                                   <input 
                                     type="range"
                                     min={Math.floor(selectedCard.limit * 0.5)}
                                     max={selectedCard.limit * 5}
                                     step={50000}
                                     value={limitInput}
                                     onChange={(e) => setLimitInput(Number(e.target.value))}
                                     className="w-full h-3 bg-[#FFF1F5] rounded-lg appearance-none cursor-pointer accent-[#C2185B] border border-[#C2185B]/20"
                                   />
                                   <div className="flex justify-between mt-4 text-[10px] font-mono text-[#4A5568] font-bold">
                                      <span>MIN: ₹{(Math.floor(selectedCard.limit * 0.5)).toLocaleString()}</span>
                                      <span>MAX: ₹{(selectedCard.limit * 5).toLocaleString()}</span>
                                   </div>
                                </div>

                                <div className="p-6 rounded-[1.5rem] bg-blue-50 border border-blue-100 flex items-center gap-5">
                                   <Info size={24} className="text-blue-600 shrink-0" />
                                   <p className="text-sm text-blue-900 font-medium leading-relaxed">
                                      Adjusting the credit limit will trigger an automated risk assessment re-validation. Strategic buffers will be re-calculated upon submission for account oversight.
                                   </p>
                                </div>

                                <button 
                                  onClick={() => {
                                    setIsProcessing(true);
                                    setTimeout(() => {
                                      handleUpdateLimit();
                                      setIsProcessing(false);
                                      setAdminDetailView(null);
                                    }, 1500);
                                  }}
                                  disabled={isProcessing}
                                  className="w-full py-5 bg-[#C2185B] hover:bg-[#AD1457] disabled:bg-[#4A5568] text-[#4A044E] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-[#C2185B]/20 active:scale-[0.98]"
                                >
                                  {isProcessing ? 'CALCULATING RISK VECTORS...' : 'AUTHORIZE NEW LIMIT OVERRIDE'}
                                </button>
                             </div>
                          </div>
                        )}

                        {adminDetailView === 'history' && (
                          <div className="space-y-8">
                             <div className="relative pl-10 space-y-10 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#C2185B]/10">
                                {selectedCard.cardTimeline?.map((item, i) => (
                                  <div key={i} className="relative">
                                    <div className="absolute -left-[2.5rem] top-2 w-8 h-8 rounded-full bg-white border-4 border-[#C2185B] flex items-center justify-center shadow-lg">
                                       <div className="w-2 h-2 rounded-full bg-[#C2185B]" />
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-white border border-white shadow-sm space-y-3 group hover:border-[#C2185B]/30 transition-all">
                                       <div className="flex justify-between items-center">
                                          <h5 className="text-sm font-black text-[#1A202C] uppercase tracking-wider">{item.event}</h5>
                                          <span className="text-[11px] font-mono text-[#4A5568] font-bold">{item.date} • {item.time}</span>
                                       </div>
                                       <p className="text-sm text-[#4A5568] font-medium leading-relaxed">{item.remarks}</p>
                                       <div className="flex items-center gap-2 pt-2 border-t border-[#C2185B]/5">
                                          <User size={12} className="text-[#C2185B]" />
                                          <span className="text-[10px] font-black text-[#4A5568] uppercase tracking-tighter">ACTION BY: {item.employee}</span>
                                       </div>
                                    </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}

                        {(adminDetailView === 'contact_holder' || adminDetailView === 'contact_manager') && (
                          <div className="space-y-10 max-w-2xl mx-auto">
                             <div className="p-10 rounded-[3rem] bg-white border border-white shadow-2xl space-y-8">
                                <div className="flex items-center gap-6">
                                   <div className="w-20 h-20 rounded-full bg-[#FFF1F5] border-4 border-white flex items-center justify-center text-[#C2185B] shadow-inner">
                                      <User size={40} />
                                   </div>
                                   <div>
                                      <h4 className="text-2xl font-black text-[#1A202C]">
                                        {adminDetailView === 'contact_holder' ? selectedCard.customerName : selectedCard.branchManagerName}
                                      </h4>
                                      <p className="text-sm text-blue-600 font-mono font-black">
                                        {adminDetailView === 'contact_holder' ? selectedCard.customerId : 'BRANCH DIRECTOR REF'}
                                      </p>
                                   </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                   <div className="p-5 rounded-2xl bg-[#FFF1F5]/50 border border-white">
                                      <p className="text-[10px] font-black text-[#4A5568] uppercase mb-1">Direct Secure Line</p>
                                      <p className="text-base font-black text-[#1A202C]">
                                        {adminDetailView === 'contact_holder' ? selectedCard.mobileNumber : selectedCard.branchManagerMobile}
                                      </p>
                                   </div>
                                   <div className="p-5 rounded-2xl bg-[#FFF1F5]/50 border border-white">
                                      <p className="text-[10px] font-black text-[#4A5568] uppercase mb-1">Internal SMTP</p>
                                      <p className="text-base font-black text-[#1A202C] truncate">
                                        {adminDetailView === 'contact_holder' ? selectedCard.emailAddress : selectedCard.branchManagerEmail}
                                      </p>
                                   </div>
                                </div>

                                <div className="space-y-4">
                                   <label className="text-[11px] font-black text-[#4A5568] uppercase tracking-[0.2em] pl-1">Secure Message Body</label>
                                   <textarea 
                                     placeholder="Enter encrypted message here..."
                                     className="w-full h-40 bg-[#FFF1F5]/30 border border-[#C2185B]/10 rounded-[2rem] p-6 text-sm text-[#1A202C] font-medium focus:border-[#C2185B] transition-all outline-none resize-none shadow-inner placeholder-[#4A5568]/40"
                                   />
                                </div>

                                <button 
                                  onClick={() => {
                                    setIsProcessing(true);
                                    setTimeout(() => {
                                      setIsProcessing(false);
                                      setAdminDetailView(null);
                                      addAuditLog(`Secure communication established with ${adminDetailView === 'contact_holder' ? 'Holder' : 'Branch Manager'} for card ref ${selectedCard.id}`, 'Info');
                                    }, 1000);
                                  }}
                                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-[#4A044E] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                                >
                                  {isProcessing ? 'ESTABLISHING HANDSHAKE...' : 'INITIATE SECURE LINK'}
                                </button>
                             </div>
                             
                             <div className="flex items-center justify-center gap-6 text-[#4A5568]/40">
                                <div className="h-[1px] flex-1 bg-[#C2185B]/10" />
                                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">VOIP INTERFACE V9.1</span>
                                <div className="h-[1px] flex-1 bg-[#C2185B]/10" />
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
