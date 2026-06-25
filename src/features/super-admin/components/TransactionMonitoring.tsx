import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileSpreadsheet, 
  ChevronRight,
  Clock,
  User,
  Shield,
  ShieldAlert,
  Building,
  Phone,
  Mail,
  MapPin,
  Download,
  Info,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  FileText,
  Calendar,
  CreditCard as CreditCardIcon,
  SearchCheck,
  UserCheck,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../types/dashboard';

interface EnhancedTransaction {
  id: string; // e.g., TXN-98219 (Alistair Sterling)
  name: string; // Customer / Employee name
  userType: 'Customer' | 'Employee';
  userId: string;
  mobile: string;
  email: string;
  accountNumber: string;
  accountType: string;
  currentBalance: string;
  availableBalance: string;
  
  // Branch Info
  branchName: string;
  branchCode: string;
  branchLocation: string;
  
  // Manager
  managerName: string;
  managerId: string;
  managerContact: string;
  managerEmail: string;

  // Transaction details
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Payment' | 'Card Transaction';
  amount: number;
  status: 'Success' | 'Pending' | 'Failed' | 'Flagged' | 'Under Review';
  referenceNumber: string;
  purpose: string;
  date: string;
  time: string;
  timestamp: string; // e.g. "2026-06-13T13:24:15Z"
  
  // Location
  locationCity: string;
  locationState: string;
  locationCountry: string;
  
  // Channel
  channel: 'ATM' | 'Mobile Banking' | 'Internet Banking' | 'Branch Counter' | 'UPI' | 'Credit Card' | 'Debit Card';
  
  // Authorized By
  authorizedByName?: string;
  authorizedByEmployeeId?: string;
  authorizedByDesignation?: string;

  // Fraud Monitoring
  riskScore: number;
  securityStatus: 'Safe' | 'Review' | 'High Risk';
  fraudProbability: string;
  flaggedTransactionsCount: number;

  // Comprehensive history for this person
  history: {
    deposits: Array<{ amount: string; date: string; time: string; branch: string }>;
    withdrawals: Array<{ amount: string; date: string; time: string; branch: string }>;
    transfers: Array<{ sender: string; receiver: string; amount: string; date: string; time: string }>;
    payments: Array<{ merchantName: string; amount: string; date: string; time: string }>;
    cardTransactions: Array<{ cardNumberMasked: string; merchant: string; amount: string; date: string; time: string }>;
  }
}

// Compact & premium high-fidelity datasets containing exact requested customers & employees
const ENHANCED_TRANSACTIONS: EnhancedTransaction[] = [
  {
    id: "TXN-98219",
    name: "Alistair Sterling",
    userType: "Customer",
    userId: "CUST-802",
    mobile: "+1 (555) 019-2831",
    email: "a.sterling@sterlingholdings.com",
    accountNumber: "ACT-STERLING-802",
    accountType: "Wealth Elite Private Banking",
    currentBalance: "₹10,54,41,010",
    availableBalance: "₹10,54,00,000",
    branchName: "Zurich Elite Desk",
    branchCode: "BR-ZH-01",
    branchLocation: "Zurich, Switzerland",
    managerName: "Maximilian Kael",
    managerId: "EMP-014",
    managerContact: "+41 44 231 0021",
    managerEmail: "m.kael@apexbank.com",
    type: "Transfer",
    amount: 150000.00,
    status: "Success",
    referenceNumber: "REF-TR-908027",
    purpose: "Offshore Settlement Protocol",
    date: "13 June 2026",
    time: "01:24:15 PM IST",
    timestamp: "2026-06-13T13:24:15Z",
    locationCity: "Zurich",
    locationState: "Zurich Canton",
    locationCountry: "Switzerland",
    channel: "Internet Banking",
    authorizedByName: "Sarah Jenkins",
    authorizedByEmployeeId: "EMP-0101",
    authorizedByDesignation: "Senior Banking Officer",
    riskScore: 12,
    securityStatus: "Safe",
    fraudProbability: "1.2%",
    flaggedTransactionsCount: 0,
    history: {
      deposits: [
        { amount: "₹45,00,000", date: "10 June 2026", time: "10:30 AM", branch: "Zurich Private" },
        { amount: "₹2,50,00,000", date: "01 June 2026", time: "11:15 AM", branch: "London Central" }
      ],
      withdrawals: [
        { amount: "₹5,00,000", date: "05 June 2026", time: "04:12 PM", branch: "Singapore Marina" }
      ],
      transfers: [
        { sender: "Alistair Sterling", receiver: "Bermuda Holdings", amount: "₹1,50,000", date: "13 June 2026", time: "01:24 PM" },
        { sender: "Alistair Sterling", receiver: "Vance Tech", amount: "₹85,00,000", date: "09 June 2026", time: "02:18 PM" }
      ],
      payments: [
        { merchantName: "Rolls-Royce Motor Cars", amount: "₹3,40,00,000", date: "02 June 2026", time: "12:00 PM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 9012", merchant: "Savoy Hotel London", amount: "₹12,40,000", date: "11 June 2026", time: "09:45 PM" }
      ]
    }
  },
  {
    id: "TXN-98220",
    name: "Sarah Jenkins",
    userType: "Employee",
    userId: "EMP-0101",
    mobile: "+1 (555) 010-0101",
    email: "s.jenkins@apexbank.com",
    accountNumber: "ACT-JENKINS-101",
    accountType: "Salary Advantage Account",
    currentBalance: "₹3,72,500",
    availableBalance: "₹3,70,000",
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    managerName: "Mohammed Rahman",
    managerId: "EMP-0007",
    managerContact: "+91 99012 34567",
    managerEmail: "m.rahman@apexbank.com",
    type: "Card Transaction",
    amount: 45000.00,
    status: "Success",
    referenceNumber: "REF-CRD-712891",
    purpose: "Enterprise Hardware Procurement",
    date: "13 June 2026",
    time: "10:15:22 AM IST",
    timestamp: "2026-06-13T10:15:22Z",
    locationCity: "Hyderabad",
    locationState: "Telangana",
    locationCountry: "India",
    channel: "Credit Card",
    authorizedByName: "Sarah Jenkins",
    authorizedByEmployeeId: "EMP-0101",
    authorizedByDesignation: "Senior Banking Officer",
    riskScore: 8,
    securityStatus: "Safe",
    fraudProbability: "0.5%",
    flaggedTransactionsCount: 0,
    history: {
      deposits: [
        { amount: "₹1,20,000", date: "07 June 2026", time: "09:00 AM", branch: "Hyderabad Main" },
        { amount: "₹1,15,000", date: "01 June 2026", time: "09:00 AM", branch: "Hyderabad Main" }
      ],
      withdrawals: [
        { amount: "₹15,000", date: "08 June 2026", time: "03:40 PM", branch: "ATM - Gachibowli" }
      ],
      transfers: [
        { sender: "Sarah Jenkins", receiver: "Rajesh Jenkins", amount: "₹20,000", date: "02 June 2026", time: "06:12 PM" }
      ],
      payments: [
        { merchantName: "Amazon Web Services", amount: "₹11,500", date: "03 June 2026", time: "11:00 AM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 4110", merchant: "Croma Electronics", amount: "₹45,000", date: "13 June 2026", time: "10:15 AM" }
      ]
    }
  },
  {
    id: "TXN-98221",
    name: "Marcus Vance",
    userType: "Customer",
    userId: "CUST-293",
    mobile: "+1 (555) 014-9988",
    email: "marcus.vance@vancetech.com",
    accountNumber: "ACT-VANCE-293",
    accountType: "Corporate Primary Checkings",
    currentBalance: "₹84,50,000",
    availableBalance: "₹84,00,000",
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    managerName: "Mohammed Rahman",
    managerId: "EMP-0007",
    managerContact: "+91 99012 34567",
    managerEmail: "m.rahman@apexbank.com",
    type: "Payment",
    amount: 235000.00,
    status: "Failed",
    referenceNumber: "REF-PAY-301192",
    purpose: "Cloud Infrastructure License Renewal",
    date: "12 June 2026",
    time: "03:45:10 PM IST",
    timestamp: "2026-06-12T15:45:10Z",
    locationCity: "Hyderabad",
    locationState: "Telangana",
    locationCountry: "India",
    channel: "UPI",
    authorizedByName: "Sarah Jenkins",
    authorizedByEmployeeId: "EMP-0101",
    authorizedByDesignation: "Senior Banking Officer",
    riskScore: 78,
    securityStatus: "High Risk",
    fraudProbability: "84.2%",
    flaggedTransactionsCount: 3,
    history: {
      deposits: [
        { amount: "₹35,00,000", date: "05 June 2026", time: "11:20 AM", branch: "Hyderabad Main" }
      ],
      withdrawals: [
        { amount: "₹5,00,000", date: "08 June 2026", time: "02:15 PM", branch: "Hyderabad Main" }
      ],
      transfers: [
        { sender: "Marcus Vance", receiver: "Elena Rostova", amount: "₹1,20,000", date: "10 June 2026", time: "10:30 PM" }
      ],
      payments: [
        { merchantName: "Oracle Enterprise", amount: "₹2,35,000", date: "12 June 2026", time: "03:45 PM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 5592", merchant: "Starbucks Jubilee", amount: "₹1,850", date: "12 June 2026", time: "09:20 AM" }
      ]
    }
  },
  {
    id: "TXN-98222",
    name: "Elena Rostova",
    userType: "Customer",
    userId: "CUST-415",
    mobile: "+44 7700 900077",
    email: "elena.rostova@cybernet.io",
    accountNumber: "ACT-ROSTOVA-415",
    accountType: "Premium Privilege Checking",
    currentBalance: "₹1,42,50,000",
    availableBalance: "₹1,42,00,000",
    branchName: "London Central Branch",
    branchCode: "BR-LDN-02",
    branchLocation: "London, United Kingdom",
    managerName: "Eleanor Vance",
    managerId: "EMP-0021",
    managerContact: "+44 20 7946 0192",
    managerEmail: "e.vance@apexbank.com",
    type: "Deposit",
    amount: 850000.00,
    status: "Success",
    referenceNumber: "REF-DEP-012984",
    purpose: "Digital Asset Arbitrage Inflow",
    date: "12 June 2026",
    time: "11:22:19 AM IST",
    timestamp: "2026-06-12T11:22:19Z",
    locationCity: "London",
    locationState: "London",
    locationCountry: "United Kingdom",
    channel: "Branch Counter",
    authorizedByName: "Chloe Dupont",
    authorizedByEmployeeId: "EMP-092",
    authorizedByDesignation: "Senior Loan Underwriter",
    riskScore: 35,
    securityStatus: "Review",
    fraudProbability: "24.5%",
    flaggedTransactionsCount: 1,
    history: {
      deposits: [
        { amount: "₹8,50,000", date: "12 June 2026", time: "11:22 AM", branch: "London Counter" },
        { amount: "₹42,00,000", date: "01 June 2026", time: "03:15 PM", branch: "Zurich Private" }
      ],
      withdrawals: [
        { amount: "₹1,20,000", date: "04 June 2026", time: "10:30 AM", branch: "ATM - London Heathrow" }
      ],
      transfers: [
        { sender: "Elena Rostova", receiver: "Sotheby's Auctions", amount: "₹25,00,000", date: "02 June 2026", time: "05:15 PM" }
      ],
      payments: [
        { merchantName: "Netflix UK", amount: "₹1,450", date: "05 June 2026", time: "08:12 AM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 8841", merchant: "Harrods Dept Store", amount: "₹4,20,000", date: "10 June 2026", time: "07:30 PM" }
      ]
    }
  },
  {
    id: "TXN-98223",
    name: "Maximilian Kael",
    userType: "Employee",
    userId: "EMP-014",
    mobile: "+41 44 231 0021",
    email: "m.kael@apexbank.com",
    accountNumber: "ACT-KAEL-014",
    accountType: "Executive Salary Advantage",
    currentBalance: "₹8,91,200",
    availableBalance: "₹8,90,000",
    branchName: "Zurich Elite Desk",
    branchCode: "BR-ZH-01",
    branchLocation: "Zurich, Switzerland",
    managerName: "Maximilian Kael",
    managerId: "EMP-014",
    managerContact: "+41 44 231 0021",
    managerEmail: "m.kael@apexbank.com",
    type: "Withdrawal",
    amount: 12000.00,
    status: "Success",
    referenceNumber: "REF-WTH-992019",
    purpose: "Cash Outflow for Canton Travel",
    date: "11 June 2026",
    time: "04:10:00 PM IST",
    timestamp: "2026-06-11T16:10:00Z",
    locationCity: "Zurich",
    locationState: "Zurich Canton",
    locationCountry: "Switzerland",
    channel: "ATM",
    authorizedByName: "Maximilian Kael",
    authorizedByEmployeeId: "EMP-014",
    authorizedByDesignation: "Zurich Branch Manager",
    riskScore: 5,
    securityStatus: "Safe",
    fraudProbability: "0.2%",
    flaggedTransactionsCount: 0,
    history: {
      deposits: [
        { amount: "₹3,45,000", date: "01 June 2026", time: "09:00 AM", branch: "Zurich Elite" }
      ],
      withdrawals: [
        { amount: "₹12,000", date: "11 June 2026", time: "04:10 PM", branch: "Zurich ATM Ground" }
      ],
      transfers: [
        { sender: "Maximilian Kael", receiver: "Internal Pension Fund", amount: "₹25,000", date: "02 June 2026", time: "11:00 AM" }
      ],
      payments: [
        { merchantName: "Sunrise Telecom Switzerland", amount: "₹4,500", date: "05 June 2026", time: "10:00 AM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 1029", merchant: "Zunfthaus zur Waag", amount: "₹18,500", date: "10 June 2026", time: "08:15 PM" }
      ]
    }
  },
  {
    id: "TXN-98224",
    name: "Vikram Naidu",
    userType: "Employee",
    userId: "EMP-045",
    mobile: "+1 (555) 018-4491",
    email: "v.naidu@apexbank.com",
    accountNumber: "ACT-NAIDU-045",
    accountType: "Enterprise Tech Premium Account",
    currentBalance: "₹2,54,000",
    availableBalance: "₹2,50,000",
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    managerName: "Mohammed Rahman",
    managerId: "EMP-0007",
    managerContact: "+91 99012 34567",
    managerEmail: "m.rahman@apexbank.com",
    type: "Transfer",
    amount: 80000.00,
    status: "Pending",
    referenceNumber: "REF-TRF-0912282",
    purpose: "Real Estate Advance Escrow Deposit",
    date: "11 June 2026",
    time: "02:22:15 PM IST",
    timestamp: "2026-06-11T14:22:15Z",
    locationCity: "Hyderabad",
    locationState: "Telangana",
    locationCountry: "India",
    channel: "Mobile Banking",
    authorizedByName: "Sarah Jenkins",
    authorizedByEmployeeId: "EMP-0101",
    authorizedByDesignation: "Senior Banking Officer",
    riskScore: 42,
    securityStatus: "Review",
    fraudProbability: "18.4%",
    flaggedTransactionsCount: 1,
    history: {
      deposits: [
        { amount: "₹1,80,000", date: "01 June 2026", time: "10:00 AM", branch: "Hyderabad Main" }
      ],
      withdrawals: [
        { amount: "₹12,400", date: "05 June 2026", time: "01:20 PM", branch: "ATM - Hyderabad" }
      ],
      transfers: [
        { sender: "Vikram Naidu", receiver: "GMR Realcon Group", amount: "₹80,000", date: "11 June 2026", time: "02:22 PM" }
      ],
      payments: [
        { merchantName: "Coursera Elite", amount: "₹6,800", date: "08 June 2026", time: "11:00 AM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 3341", merchant: "Zomato Premium Delivery", amount: "₹1,240", date: "13 June 2026", time: "09:30 PM" }
      ]
    }
  },
  {
    id: "TXN-98225",
    name: "Chloe Dupont",
    userType: "Employee",
    userId: "EMP-092",
    mobile: "+33 (6) 7231 9281",
    email: "c.dupont@apexbank.com",
    accountNumber: "ACT-DUPONT-092",
    accountType: "European Employee Savings Remit",
    currentBalance: "₹1,88,400",
    availableBalance: "₹1,85,000",
    branchName: "London Central Branch",
    branchCode: "BR-LDN-02",
    branchLocation: "London, United Kingdom",
    managerName: "Eleanor Vance",
    managerId: "EMP-0021",
    managerContact: "+44 20 7946 0192",
    managerEmail: "e.vance@apexbank.com",
    type: "Payment",
    amount: 18200.00,
    status: "Flagged",
    referenceNumber: "REF-PAY-018251",
    purpose: "Suspicious P2P Off-Shore Payment Ticket",
    date: "10 June 2026",
    time: "07:11:42 PM IST",
    timestamp: "2026-06-10T19:11:42Z",
    locationCity: "London",
    locationState: "London",
    locationCountry: "United Kingdom",
    channel: "UPI",
    authorizedByName: "Eleanor Vance",
    authorizedByEmployeeId: "EMP-0021",
    authorizedByDesignation: "London Branch Manager",
    riskScore: 91,
    securityStatus: "High Risk",
    fraudProbability: "89.5%",
    flaggedTransactionsCount: 4,
    history: {
      deposits: [
        { amount: "₹65,000", date: "14 June 2026", time: "08:15 AM", branch: "London Counter" },
        { amount: "₹1,20,000", date: "01 June 2026", time: "09:00 AM", branch: "London Counter" }
      ],
      withdrawals: [],
      transfers: [],
      payments: [
        { merchantName: "Off-Shore Escrow Gate", amount: "₹18,200", date: "10 June 2026", time: "07:11 PM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 9921", merchant: "Tesco Express London", amount: "₹450", date: "09 June 2026", time: "11:15 AM" }
      ]
    }
  },
  {
    id: "TXN-98226",
    name: "Kenji Takahashi",
    userType: "Customer",
    userId: "CUST-901",
    mobile: "+81 90 1234 5678",
    email: "takahashi@sakurafund.jp",
    accountNumber: "ACT-TAKAHASHI-901",
    accountType: "Private Reserve Sovereign checking",
    currentBalance: "₹25,41,10,200",
    availableBalance: "₹25,40,00,000",
    branchName: "Tokyo Ginzha Hub",
    branchCode: "BR-TKY-03",
    branchLocation: "Tokyo, Japan",
    managerName: "Ryunosuke Sato",
    managerId: "EMP-0145",
    managerContact: "+81 3 5565 0192",
    managerEmail: "r.sato@apexbank.com",
    type: "Card Transaction",
    amount: 1250000.00,
    status: "Success",
    referenceNumber: "REF-CRD-882012",
    purpose: "Fine Art Acquisition Settlement",
    date: "09 June 2026",
    time: "11:45:00 AM IST",
    timestamp: "2026-06-09T11:45:00Z",
    locationCity: "Tokyo",
    locationState: "Tokyo Prefecture",
    locationCountry: "Japan",
    channel: "Debit Card",
    authorizedByName: "Sarah Jenkins",
    authorizedByEmployeeId: "EMP-0101",
    authorizedByDesignation: "Senior Banking Officer",
    riskScore: 8,
    securityStatus: "Safe",
    fraudProbability: "0.4%",
    flaggedTransactionsCount: 0,
    history: {
      deposits: [
        { amount: "₹5,00,00,000", date: "01 June 2026", time: "10:00 AM", branch: "Tokyo Ginza Hub" }
      ],
      withdrawals: [
        { amount: "₹45,00,000", date: "05 June 2026", time: "12:15 PM", branch: "Tokyo ATM" }
      ],
      transfers: [
        { sender: "Kenji Takahashi", receiver: "Sotheby's Tokyo", amount: "₹1,25,00,000", date: "09 June 2026", time: "11:45 AM" }
      ],
      payments: [
        { merchantName: "Tokyo Club Elite", amount: "₹2,50,000", date: "04 June 2026", time: "10:00 PM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 0812", merchant: "Park Hyatt Tokyo Grand", amount: "₹82,400", date: "07 June 2026", time: "09:30 PM" }
      ]
    }
  },
  {
    id: "TXN-98227",
    name: "Marcus Vance",
    userType: "Customer",
    userId: "CUST-293",
    mobile: "+1 (555) 014-9988",
    email: "marcus.vance@vancetech.com",
    accountNumber: "ACT-VANCE-293",
    accountType: "Corporate Primary Checkings",
    currentBalance: "₹84,50,000",
    availableBalance: "₹84,00,000",
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    managerName: "Mohammed Rahman",
    managerId: "EMP-0007",
    managerContact: "+91 99012 34567",
    managerEmail: "m.rahman@apexbank.com",
    type: "Withdrawal",
    amount: 500000.00,
    status: "Under Review",
    referenceNumber: "REF-WTH-011283",
    purpose: "Corporate Cash Reserve Offload",
    date: "08 June 2026",
    time: "02:15:30 PM IST",
    timestamp: "2026-06-08T14:15:30Z",
    locationCity: "Hyderabad",
    locationState: "Telangana",
    locationCountry: "India",
    channel: "Branch Counter",
    authorizedByName: "Mohammed Rahman",
    authorizedByEmployeeId: "EMP-0007",
    authorizedByDesignation: "Hyderabad Branch Manager",
    riskScore: 54,
    securityStatus: "Review",
    fraudProbability: "41.2%",
    flaggedTransactionsCount: 1,
    history: {
      deposits: [
        { amount: "₹35,00,000", date: "05 June 2026", time: "11:20 AM", branch: "Hyderabad Main" }
      ],
      withdrawals: [
        { amount: "₹5,00,000", date: "08 June 2026", time: "02:15 PM", branch: "Hyderabad Main" }
      ],
      transfers: [
        { sender: "Marcus Vance", receiver: "Elena Rostova", amount: "₹1,20,000", date: "10 June 2026", time: "10:30 PM" }
      ],
      payments: [
        { merchantName: "Oracle Enterprise", amount: "₹2,35,000", date: "12 June 2026", time: "03:45 PM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 5592", merchant: "Starbucks Jubilee", amount: "₹1,850", date: "12 June 2026", time: "09:20 AM" }
      ]
    }
  },
  {
    id: "TXN-98228",
    name: "Sarah Jenkins",
    userType: "Employee",
    userId: "EMP-0101",
    mobile: "+1 (555) 010-0101",
    email: "s.jenkins@apexbank.com",
    accountNumber: "ACT-JENKINS-101",
    accountType: "Salary Advantage Account",
    currentBalance: "₹3,72,500",
    availableBalance: "₹3,70,000",
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    managerName: "Mohammed Rahman",
    managerId: "EMP-0007",
    managerContact: "+91 99012 34567",
    managerEmail: "m.rahman@apexbank.com",
    type: "Deposit",
    amount: 120000.00,
    status: "Success",
    referenceNumber: "REF-DEP-029101",
    purpose: "Corporate Compensation Monthly Credit",
    date: "07 June 2026",
    time: "09:00:15 AM IST",
    timestamp: "2026-06-07T09:00:15Z",
    locationCity: "Hyderabad",
    locationState: "Telangana",
    locationCountry: "India",
    channel: "Branch Counter",
    authorizedByName: "Mohammed Rahman",
    authorizedByEmployeeId: "EMP-0007",
    authorizedByDesignation: "Hyderabad Branch Manager",
    riskScore: 2,
    securityStatus: "Safe",
    fraudProbability: "0.1%",
    flaggedTransactionsCount: 0,
    history: {
      deposits: [
        { amount: "₹1,20,000", date: "07 June 2026", time: "09:00 AM", branch: "Hyderabad Main" },
        { amount: "₹1,15,000", date: "01 June 2026", time: "09:00 AM", branch: "Hyderabad Main" }
      ],
      withdrawals: [
        { amount: "₹15,000", date: "08 June 2026", time: "03:40 PM", branch: "ATM - Gachibowli" }
      ],
      transfers: [
        { sender: "Sarah Jenkins", receiver: "Rajesh Jenkins", amount: "₹20,000", date: "02 June 2026", time: "06:12 PM" }
      ],
      payments: [
        { merchantName: "Amazon Web Services", amount: "₹11,500", date: "03 June 2026", time: "11:00 AM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 4110", merchant: "Croma Electronics", amount: "₹45,000", date: "13 June 2026", time: "10:15 AM" }
      ]
    }
  },
  {
    id: "TXN-98229",
    name: "Alistair Sterling",
    userType: "Customer",
    userId: "CUST-802",
    mobile: "+1 (555) 019-2831",
    email: "a.sterling@sterlingholdings.com",
    accountNumber: "ACT-STERLING-802",
    accountType: "Wealth Elite Private Banking",
    currentBalance: "₹10,54,41,010",
    availableBalance: "₹10,54,00,000",
    branchName: "Zurich Elite Desk",
    branchCode: "BR-ZH-01",
    branchLocation: "Zurich, Switzerland",
    managerName: "Maximilian Kael",
    managerId: "EMP-014",
    managerContact: "+41 44 231 0021",
    managerEmail: "m.kael@apexbank.com",
    type: "Payment",
    amount: 75000.00,
    status: "Success",
    referenceNumber: "REF-PAY-921820",
    purpose: "Superyacht Slipway Annual Fee",
    date: "05 June 2026",
    time: "10:30:00 AM IST",
    timestamp: "2026-06-05T10:30:00Z",
    locationCity: "Monaco",
    locationState: "French Riviera",
    locationCountry: "Monaco",
    channel: "Debit Card",
    authorizedByName: "Sarah Jenkins",
    authorizedByEmployeeId: "EMP-0101",
    authorizedByDesignation: "Senior Banking Officer",
    riskScore: 18,
    securityStatus: "Safe",
    fraudProbability: "2.5%",
    flaggedTransactionsCount: 0,
    history: {
      deposits: [
        { amount: "₹45,00,000", date: "10 June 2026", time: "10:30 AM", branch: "Zurich Private" }
      ],
      withdrawals: [],
      transfers: [],
      payments: [
        { merchantName: "Marina Security Desk", amount: "₹75,000", date: "05 June 2026", time: "10:30 AM" }
      ],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 9012", merchant: "Savoy Hotel London", amount: "₹12,40,000", date: "11 June 2026", time: "09:45 PM" }
      ]
    }
  },
  {
    id: "TXN-98230",
    name: "Elena Rostova",
    userType: "Customer",
    userId: "CUST-415",
    mobile: "+44 7700 900077",
    email: "elena.rostova@cybernet.io",
    accountNumber: "ACT-ROSTOVA-415",
    accountType: "Premium Privilege Checking",
    currentBalance: "₹1,42,50,000",
    availableBalance: "₹1,42,00,000",
    branchName: "London Central Branch",
    branchCode: "BR-LDN-02",
    branchLocation: "London, United Kingdom",
    managerName: "Eleanor Vance",
    managerId: "EMP-0021",
    managerContact: "+44 20 7946 0192",
    managerEmail: "e.vance@apexbank.com",
    type: "Transfer",
    amount: 450000.00,
    status: "Success",
    referenceNumber: "REF-TR-001292",
    purpose: "Tech Advisory Settlement",
    date: "02 June 2026",
    time: "05:15:00 PM IST",
    timestamp: "2026-06-02T17:15:00Z",
    locationCity: "London",
    locationState: "London",
    locationCountry: "United Kingdom",
    channel: "Internet Banking",
    authorizedByName: "Sarah Jenkins",
    authorizedByEmployeeId: "EMP-0101",
    authorizedByDesignation: "Senior Banking Officer",
    riskScore: 23,
    securityStatus: "Safe",
    fraudProbability: "4.1%",
    flaggedTransactionsCount: 0,
    history: {
      deposits: [
        { amount: "₹8,50,000", date: "12 June 2026", time: "11:22 AM", branch: "London Counter" }
      ],
      withdrawals: [],
      transfers: [
        { sender: "Elena Rostova", receiver: "Sotheby's Auctions", amount: "₹25,00,000", date: "02 June 2026", time: "05:15 PM" }
      ],
      payments: [],
      cardTransactions: []
    }
  },
  {
    id: "TXN-98231",
    name: "Vikram Naidu",
    userType: "Employee",
    userId: "EMP-045",
    mobile: "+1 (555) 018-4491",
    email: "v.naidu@apexbank.com",
    accountNumber: "ACT-NAIDU-045",
    accountType: "Enterprise Tech Premium Account",
    currentBalance: "₹2,54,000",
    availableBalance: "₹2,50,000",
    branchName: "Hyderabad Main Branch",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, Telangana",
    managerName: "Mohammed Rahman",
    managerId: "EMP-0007",
    managerContact: "+91 99012 34567",
    managerEmail: "m.rahman@apexbank.com",
    type: "Card Transaction",
    amount: 5500.00,
    status: "Success",
    referenceNumber: "REF-CRD-121544",
    purpose: "Office Desk Mechanical Keyboard Upgrade",
    date: "13 June 2026",
    time: "09:30:12 PM IST",
    timestamp: "2026-06-13T21:30:12Z",
    locationCity: "Hyderabad",
    locationState: "Telangana",
    locationCountry: "India",
    channel: "Debit Card",
    authorizedByName: "Sarah Jenkins",
    authorizedByEmployeeId: "EMP-0101",
    authorizedByDesignation: "Senior Banking Officer",
    riskScore: 14,
    securityStatus: "Safe",
    fraudProbability: "2.1%",
    flaggedTransactionsCount: 0,
    history: {
      deposits: [
        { amount: "₹1,80,000", date: "01 June 2026", time: "10:00 AM", branch: "Hyderabad Main" }
      ],
      withdrawals: [],
      transfers: [],
      payments: [],
      cardTransactions: [
        { cardNumberMasked: "•••• •••• •••• 3341", merchant: "Zomato Premium Delivery", amount: "₹1,240", date: "13 June 2026", time: "09:30 PM" }
      ]
    }
  },
  {
    id: "TXN-98232",
    name: "Chloe Dupont",
    userType: "Employee",
    userId: "EMP-092",
    mobile: "+33 (6) 7231 9281",
    email: "c.dupont@apexbank.com",
    accountNumber: "ACT-DUPONT-092",
    accountType: "European Employee Savings Remit",
    currentBalance: "₹1,88,400",
    availableBalance: "₹1,85,000",
    branchName: "London Central Branch",
    branchCode: "BR-LDN-02",
    branchLocation: "London, United Kingdom",
    managerName: "Eleanor Vance",
    managerId: "EMP-0021",
    managerContact: "+44 20 7946 0192",
    managerEmail: "e.vance@apexbank.com",
    type: "Deposit",
    amount: 65000.00,
    status: "Success",
    referenceNumber: "REF-DEP-019210",
    purpose: "External Remittance Profit Liquidation",
    date: "14 June 2026",
    time: "08:15:00 AM IST",
    timestamp: "2026-06-14T08:15:00Z",
    locationCity: "London",
    locationState: "London",
    locationCountry: "United Kingdom",
    channel: "Branch Counter",
    authorizedByName: "Eleanor Vance",
    authorizedByEmployeeId: "EMP-0021",
    authorizedByDesignation: "London Branch Manager",
    riskScore: 32,
    securityStatus: "Review",
    fraudProbability: "14.2%",
    flaggedTransactionsCount: 0,
    history: {
      deposits: [
        { amount: "₹65,000", date: "14 June 2026", time: "08:15 AM", branch: "London Counter" }
      ],
      withdrawals: [],
      transfers: [],
      payments: [],
      cardTransactions: []
    }
  }
];

interface TransactionMonitoringProps {
  transactions: Transaction[];
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
  searchQuery: string;
  customers?: any[];
  employees?: any[];
  branches?: any[];
  addAuditLog?: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
  setActiveTab?: (tab: any) => void;
}

export default function TransactionMonitoring({
  searchQuery,
  addAuditLog,
  setActiveTab
}: TransactionMonitoringProps) {
  // State variables for Filters
  const [userFilter, setUserFilter] = useState<'All' | 'Customers' | 'Employees'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Deposit' | 'Withdrawal' | 'Transfer' | 'Payment' | 'Card Transaction'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Success' | 'Pending' | 'Failed' | 'Flagged' | 'Under Review'>('All');
  const [dateFilter, setDateFilter] = useState<'Today' | 'Last 7 Days' | 'Last 30 Days' | 'Custom Range'>('Last 30 Days');
  
  // Custom Date range states
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Selected Row state
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  // Toast State under simulated constraints
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Right panel sub history active tab
  const [historyTab, setHistoryTab] = useState<'Timeline' | 'Deposits' | 'Withdrawals' | 'Transfers' | 'Payments' | 'Cards'>('Timeline');

  // Multi-property filtering algorithm
  const filtered = ENHANCED_TRANSACTIONS.filter((t) => {
    // Search query constraint
    const query = searchQuery ? searchQuery.toLowerCase().trim() : "";
    const matchesSearch = query === "" || 
      t.id.toLowerCase().includes(query) ||
      t.name.toLowerCase().includes(query) ||
      t.userId.toLowerCase().includes(query) ||
      t.accountNumber.toLowerCase().includes(query) ||
      t.mobile.toLowerCase().includes(query) ||
      t.branchName.toLowerCase().includes(query);

    // User filters constraint
    let matchesUser = true;
    if (userFilter === 'Customers') {
      matchesUser = t.userType === 'Customer';
    } else if (userFilter === 'Employees') {
      matchesUser = t.userType === 'Employee';
    }

    // Type filter constraint
    let matchesType = true;
    if (typeFilter !== 'All') {
      matchesType = t.type === typeFilter;
    }

    // Status filter constraint
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      matchesStatus = t.status === statusFilter;
    }

    // Time horizon constraint
    let matchesDate = true;
    const txDate = new Date(t.timestamp);
    // Base anchored system date is set strictly to June 14, 2026
    const baseDateString = "2026-06-14T05:47:05-07:00"; 
    const currentDate = new Date(baseDateString);
    
    const txMidnight = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());
    const currentMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    if (dateFilter === 'Today') {
      matchesDate = txMidnight.getTime() === currentMidnight.getTime();
    } else if (dateFilter === 'Last 7 Days') {
      const sevenDaysAgo = new Date(currentMidnight);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesDate = txMidnight >= sevenDaysAgo;
    } else if (dateFilter === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(currentMidnight);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesDate = txMidnight >= thirtyDaysAgo;
    } else if (dateFilter === 'Custom Range') {
      if (customStartDate) {
        const start = new Date(customStartDate);
        matchesDate = matchesDate && txMidnight >= start;
      }
      if (customEndDate) {
        const end = new Date(customEndDate);
        matchesDate = matchesDate && txMidnight <= end;
      }
    }

    return matchesSearch && matchesUser && matchesType && matchesStatus && matchesDate;
  });

  // Export spreadsheet with non-blocking confirmation
  const handleExportCSV = () => {
    triggerToast("Compiling transaction ledger block... Downloader has successfully packed requested rows into a secure offline package.");
    if (addAuditLog) {
      addAuditLog("Exported full transaction ledger as CSV Spreadsheet", "Info");
    }
  };

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => {
      setActionToast(null);
    }, 4000);
  };

  // Loading states for actions
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{name: string, audit: string, handler: () => void} | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConfirmAction(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleActionClick = (actionName: string, auditText: string, tab?: string, isSensitive?: boolean) => {
    const executeAction = () => {
      setLoadingAction(actionName);
      setConfirmAction(null);
      
      // Artificial delay to simulate processing
      setTimeout(() => {
        triggerToast(`[ACCESS GRANTED] Executing procedure: ${actionName}. Access logged under corporate Super Admin protocols.`);
        if (addAuditLog) {
          addAuditLog(auditText, "Info");
        }
        if (tab && setActiveTab) {
          setActiveTab(tab);
        }
        setLoadingAction(null);
      }, 800);
    };

    if (isSensitive) {
      setConfirmAction({ name: actionName, audit: auditText, handler: executeAction });
    } else {
      executeAction();
    }
  };

  const selectedTx = ENHANCED_TRANSACTIONS.find(t => t.id === selectedTxId);

  return (
    <div className="space-y-6" id="transaction-module-root">
      
      {/* Toast Alert feedback */}
      {actionToast && (
        <div 
          id="action-toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border border-[#d4af37]/30 bg-[#FCE7F3] text-[#d4af37] text-xs font-semibold shadow-2xl transition-all duration-300 transform translate-y-0 max-w-sm"
        >
          <div className="bg-[#d4af37]/10 p-1.5 rounded-lg">
            <CheckCircle2 size={16} className="text-[#d4af37]" />
          </div>
          <p>{actionToast}</p>
        </div>
      )}

      {/* Confirmation Dialog Overlay */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setConfirmAction(null);
            }}
            className="fixed inset-0 bg-black/35 backdrop-blur-[6px] z-[99999] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FFF1F5] border border-[#F9A8D4] p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-400">
                <ShieldAlert size={28} />
                <h3 className="text-lg font-bold">Security Clearance Required</h3>
              </div>
              <p className="text-[#831843] text-sm leading-relaxed">
                You are about to execute a Level 5 Super Admin override: <span className="text-[#4A044E] font-bold">{confirmAction.name}</span>. 
                This action will be permanently recorded in the immutable audit ledger.
              </p>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2 rounded-lg bg-[#FDF2F8] text-[#831843] hover:bg-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Abort
                </button>
                <button 
                  onClick={confirmAction.handler}
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-[#4A044E] hover:bg-blue-500 font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer"
                >
                  Authorize
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Filter Selection Panel */}
      <div className="p-5 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#FBCFE8]/60">
          <Activity size={16} className="text-[#d4af37]" />
          <h2 className="text-xs font-bold text-[#831843] uppercase tracking-wider">Dynamic Stream Controllers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* User Class Filters */}
          <div id="user-filter-box">
            <span className="text-[#9D174D]/75 text-[10px] uppercase font-bold tracking-wide block mb-1.5">User Class</span>
            <select
              id="user-filter-select"
              value={userFilter}
              onChange={(e) => {
                setUserFilter(e.target.value as any);
                setSelectedTxId(null); // Deselect on filter change to respect safety rule
              }}
              className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] p-2.5 text-xs rounded-xl outline-none cursor-pointer hover:border-[#F9A8D4]/80"
            >
              <option value="All">All Users</option>
              <option value="Customers">Customers Only</option>
              <option value="Employees">Employees Only</option>
            </select>
          </div>

          {/* Transaction Type Filters */}
          <div id="type-filter-box">
            <span className="text-[#9D174D]/75 text-[10px] uppercase font-bold tracking-wide block mb-1.5">Transaction Flow</span>
            <select
              id="type-filter-select"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as any);
                setSelectedTxId(null);
              }}
              className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] p-2.5 text-xs rounded-xl outline-none cursor-pointer hover:border-[#F9A8D4]/80"
            >
              <option value="All">All Transactions</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
              <option value="Transfer">Transfer</option>
              <option value="Payment">Payment</option>
              <option value="Card Transaction">Card Transaction</option>
            </select>
          </div>

          {/* Threat Clearance State */}
          <div id="status-filter-box">
            <span className="text-[#9D174D]/75 text-[10px] uppercase font-bold tracking-wide block mb-1.5">Threat Status</span>
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setSelectedTxId(null);
              }}
              className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] p-2.5 text-xs rounded-xl outline-none cursor-pointer hover:border-[#F9A8D4]/80"
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Flagged">Flagged</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          {/* Date Horizon Filters */}
          <div id="date-filter-box">
            <span className="text-[#9D174D]/75 text-[10px] uppercase font-bold tracking-wide block mb-1.5">Time Horizon</span>
            <select
              id="date-filter-select"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value as any);
                setSelectedTxId(null);
              }}
              className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] p-2.5 text-xs rounded-xl outline-none cursor-pointer hover:border-[#F9A8D4]/80"
            >
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Custom Range">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Custom Range Range-Pickers */}
        {dateFilter === 'Custom Range' && (
          <div 
            id="custom-date-pickers"
            className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-[#FFF5F8]/80 border border-[#FBCFE8] animate-fadeIn"
          >
            <div className="w-full sm:w-auto">
              <span className="text-[#9D174D]/75 text-[9px] uppercase font-bold block mb-1">Start Limit</span>
              <input 
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full sm:w-44 bg-[#FFF1F5] border border-[#F9A8D4] text-[#4A044E] p-1.5 text-xs rounded-lg outline-none focus:border-[#d4af37]/55"
              />
            </div>
            <div className="w-full sm:w-auto">
              <span className="text-[#9D174D]/75 text-[9px] uppercase font-bold block mb-1">End Limit</span>
              <input 
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full sm:w-44 bg-[#FFF1F5] border border-[#F9A8D4] text-[#4A044E] p-1.5 text-xs rounded-lg outline-none focus:border-[#d4af37]/55"
              />
            </div>
            <div className="text-[10px] text-[#9D174D]/75 self-end mt-2 sm:mt-0 italic">
              Indexes filtered based on selected limits.
            </div>
          </div>
        )}
      </div>

      {/* Main Core Dashboard Split Split-Pane Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Hand Core Ledger (2 Columns Span) */}
        <div className="xl:col-span-2 space-y-4" id="ledger-feed-table-container">
          <div className="p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#4A044E] uppercase tracking-wider">Apex Transaction Ledger</h3>
                <p className="text-xs text-[#9D174D]/80">Simplified real-time monitoring of customer and corporate employee cash flows.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="export-csv-trigger"
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF1F5] hover:bg-[#141c48] border border-[#F9A8D4] text-[#BE185D]/75 text-[11px] font-bold uppercase rounded-lg transition-all cursor-pointer"
                >
                  <FileSpreadsheet size={13} className="text-[#d4af37]" />
                  <span>Ledger CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" id="audit-ledger-table">
                <thead>
                  <tr className="border-b border-[#FBCFE8] text-[10px] text-[#BE185D]/75 font-bold uppercase tracking-wider bg-[#FDF4F9]/70">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">User Type</th>
                    <th className="py-3 px-4">Transaction Type</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Date & Time</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141c48]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-[#9D174D]/80 italic bg-[#FFF5F8]/60">
                        No transactions match the selected filters or search parameters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => {
                      const isSelected = selectedTxId === t.id;
                      return (
                        <tr 
                          key={t.id} 
                          id={`tx-row-${t.id}`}
                          onClick={() => setSelectedTxId(t.id)}
                          className={`text-xs transition-colors cursor-pointer border-l-2 ${
                            isSelected 
                              ? 'bg-[#FBCFE8] border-l-[#d4af37] text-[#4A044E] font-semibold' 
                              : 'hover:bg-[#FBCFE8]/30 border-l-transparent text-[#831843]'
                          }`}
                        >
                          {/* ID */}
                          <td className="py-3 px-4 font-mono font-bold text-[#831843]">{t.id}</td>
                          
                          {/* User Name */}
                          <td className="py-3 px-4 font-medium whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              {t.userType === 'Employee' ? (
                                <UserCheck size={12} className="text-[#d4af37]" />
                              ) : (
                                <User size={12} className="text-blue-400" />
                              )}
                              <span>{t.name}</span>
                            </div>
                          </td>
                          
                          {/* User Type Badge */}
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              t.userType === 'Employee' 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {t.userType}
                            </span>
                          </td>

                          {/* Transaction Type */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold border border-[#F9A8D4] bg-[#FDF4F9] text-[#701a75] uppercase">
                              {t.type}
                            </span>
                          </td>

                          {/* Amount formatted to Indian groupings with correct symbol */}
                          <td className="py-3 px-4 text-right font-mono font-bold">
                            <span className={
                              t.type === 'Withdrawal' || t.type === 'Payment' || t.type === 'Card Transaction' 
                                ? 'text-rose-400' 
                                : 'text-emerald-400'
                            }>
                              {t.type === 'Withdrawal' || t.type === 'Payment' || t.type === 'Card Transaction' ? '-' : '+'}
                              ₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>

                          {/* Date and Time */}
                          <td className="py-3 px-4 text-center text-[#9D174D]/80 font-mono whitespace-nowrap">
                            {t.date} • {t.time.substring(0, 8)}
                          </td>

                          {/* Status badge */}
                          <td className="py-3 px-4 text-right whitespace-nowrap" id={`tx-status-${t.id}`}>
                            {t.status === 'Success' && (
                              <span className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
                                <CheckCircle2 size={11} /> Success
                              </span>
                            )}
                            {t.status === 'Pending' && (
                              <span className="text-amber-400 font-bold flex items-center gap-1 justify-end animate-pulse">
                                <Clock size={11} /> Pending
                              </span>
                            )}
                            {t.status === 'Failed' && (
                              <span className="text-red-400 font-bold flex items-center gap-1 justify-end">
                                <XCircle size={11} /> Failed
                              </span>
                            )}
                            {t.status === 'Flagged' && (
                              <span className="text-red-500 font-bold flex items-center gap-1 justify-end bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/30">
                                <AlertTriangle size={11} /> Flagged
                              </span>
                            )}
                            {t.status === 'Under Review' && (
                              <span className="text-purple-400 font-bold flex items-center gap-1 justify-end">
                                <Info size={11} /> In Review
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Total items indicator */}
            <div className="flex items-center justify-between text-xs text-[#9D174D]/80 pt-2">
              <span>Showing <strong>{filtered.length}</strong> core ledger transactions matching parameters.</span>
              <span>Anchord DB: <strong>June 14, 2026</strong></span>
            </div>
          </div>
        </div>

        {/* Right Hand Transaction Intelligence Panel (1 Column Span) */}
        <div id="intelligence-panel" className="space-y-6">
          {!selectedTx ? (
            /* Empty state placeholder when no row is clicked yet */
            <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-[#F9A8D4] bg-[#FCE7F3]/60 min-h-[500px]">
              <div className="p-4 rounded-full bg-[#FBCFE8]/70 text-[#BE185D]/75 mb-4 relative overflow-hidden">
                <SearchCheck className="h-8 w-8 text-[#d4af37] animate-pulse" />
                <span className="absolute inset-0 bg-blue-500/10 rounded-full blur animate-ping" />
              </div>
              <h4 className="text-sm font-bold text-[#4A044E] uppercase tracking-wider mb-2">Ready for Auditing</h4>
              <p className="text-xs text-[#BE185D]/75 max-w-xs leading-relaxed">
                Detailed transaction block remains unmapped. Click a transaction row in the left-hand ledger list to load the high-fidelity Intelligence Panel.
              </p>
            </div>
          ) : (
            /* Comprehensive High Fidelity Transaction Intelligence Panel */
            <div id="intelligence-panel-content" className="p-5 rounded-2xl border border-[#d4af37]/25 bg-[#FCE7F3]/95 shadow-2xl space-y-6 animate-fadeIn">
              
              {/* Header profile with Name and IDs */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#FBCFE8]">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#1b2557] to-[#0c143d] flex items-center justify-center text-[#4A044E] font-bold border border-[#d4af37]/20">
                  {selectedTx.userType === 'Customer' ? 'C' : 'E'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#4A044E] tracking-wide">{selectedTx.name}</h3>
                    <span className="px-1.5 py-0.5 bg-[#d4af37]/15 rounded text-[8px] text-[#d4af37] font-extrabold uppercase">
                      {selectedTx.userType}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#9D174D]/85 font-mono">
                    ID: {selectedTx.userId} • {selectedTx.email}
                  </p>
                </div>
              </div>

              {/* User Information */}
              <div className="space-y-2" id="detail-user-section">
                <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                  <User size={12} className="text-[#d4af37]" />
                  <span>User Information</span>
                </h4>
                <div className="p-3 rounded-xl bg-[#FFF5F8]/80 border border-[#FBCFE8] text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Full Name</span><span className="text-[#701a75] font-medium">{selectedTx.name}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Registry ID</span><span className="text-[#701a75] font-mono font-bold">{selectedTx.userId}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Class</span><span className="text-[#701a75] font-medium">{selectedTx.userType}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Mobile Connection</span><span className="text-[#701a75] font-mono">{selectedTx.mobile}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Email Address</span><span className="text-[#701a75] font-semibold text-[11px] font-mono">{selectedTx.email}</span></div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-2" id="detail-account-section">
                <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                  <CreditCardIcon size={12} className="text-[#d4af37]" />
                  <span>Account Information</span>
                </h4>
                <div className="p-3 rounded-xl bg-[#FFF5F8]/80 border border-[#FBCFE8] text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Account Number</span><span className="text-[#701a75] font-mono font-bold">{selectedTx.accountNumber}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Account Type</span><span className="text-[#701a75] font-medium">{selectedTx.accountType}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Current Balance</span><span className="text-emerald-400 font-bold font-mono">{selectedTx.currentBalance}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Available Balance</span><span className="text-[#831843] font-bold font-mono">{selectedTx.availableBalance}</span></div>
                </div>
              </div>

              {/* Branch Information */}
              <div className="space-y-2" id="detail-branch-section">
                <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                  <Building size={12} className="text-[#d4af37]" />
                  <span>Branch Information</span>
                </h4>
                <div className="p-3 rounded-xl bg-[#FFF5F8]/80 border border-[#FBCFE8] text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Assigned Branch</span><span className="text-[#701a75] font-medium">{selectedTx.branchName}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Branch Identifier</span><span className="text-[#701a75] font-mono font-bold">{selectedTx.branchCode}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Physical Location</span><span className="text-[#701a75]">{selectedTx.branchLocation}</span></div>
                </div>
              </div>

              {/* Branch Manager Information */}
              <div className="space-y-2" id="detail-manager-section">
                <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                  <UserCheck size={12} className="text-[#d4af37]" />
                  <span>Branch Manager Information</span>
                </h4>
                <div className="p-3 rounded-xl bg-[#FFF5F8]/80 border border-[#FBCFE8] text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Manager Name</span><span className="text-[#701a75] font-medium">{selectedTx.managerName}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Employee ID</span><span className="text-[#d4af37] font-mono font-bold">{selectedTx.managerId}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Contact Number</span><span className="text-[#701a75] font-mono">{selectedTx.managerContact}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Official Email</span><span className="text-[#701a75] font-mono text-[11px]">{selectedTx.managerEmail}</span></div>
                </div>
              </div>

              {/* Transaction details */}
              <div className="space-y-2" id="detail-tx-section">
                <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                  <Activity size={12} className="text-[#d4af37]" />
                  <span>Transaction Information</span>
                </h4>
                <div className="p-3 rounded-xl bg-[#FFF5F8]/80 border border-[#FBCFE8] text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Ledger Index</span><span className="text-[#701a75] font-mono font-bold">{selectedTx.id}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Transaction Type</span><span className="text-[#701a75] uppercase font-bold">{selectedTx.type}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Gross Value</span><span className="text-[#d4af37] font-bold font-mono text-sm">₹{selectedTx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Clearance State</span><span className="font-bold text-emerald-400">{selectedTx.status}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Reference Number</span><span className="text-[#701a75] font-mono">{selectedTx.referenceNumber}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Purpose / Remarks</span><span className="text-[#831843] italic text-[11px] text-right max-w-[160px] truncate-none block">{selectedTx.purpose}</span></div>
                </div>
              </div>

              {/* Transaction Date & Time */}
              <div className="space-y-2" id="detail-time-section">
                <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#d4af37]" />
                  <span>Transaction Date & Time</span>
                </h4>
                <div className="p-3 rounded-xl bg-[#FFF5F8]/80 border border-[#FBCFE8] text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Calendar Date</span><span className="text-[#701a75]">{selectedTx.date}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Execution Time</span><span className="text-[#701a75] font-mono">{selectedTx.time}</span></div>
                </div>
              </div>

              {/* Transaction Location */}
              <div className="space-y-2" id="detail-location-section">
                <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#d4af37]" />
                  <span>Transaction Location</span>
                </h4>
                <div className="p-3 rounded-xl bg-[#FFF5F8]/80 border border-[#FBCFE8] text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Source Point</span><span className="text-[#701a75]">{selectedTx.branchName}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">City / Node</span><span className="text-[#701a75]">{selectedTx.locationCity}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">State / Canton</span><span className="text-[#701a75]">{selectedTx.locationState}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Sovereign Country</span><span className="text-[#701a75] font-semibold">{selectedTx.locationCountry}</span></div>
                </div>
              </div>

              {/* Transaction Channel */}
              <div className="space-y-2" id="detail-channel-section">
                <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-[#d4af37]" />
                  <span>Transaction Channel</span>
                </h4>
                <div className="p-3 rounded-xl bg-[#FFF5F8]/80 border border-[#FBCFE8] text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Interface Route</span><span className="text-[#701a75] font-bold uppercase font-mono">{selectedTx.channel}</span></div>
                </div>
              </div>

              {/* Authorized By */}
              <div className="space-y-2" id="detail-authorized-section">
                <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                  <Shield size={12} className="text-[#d4af37]" />
                  <span>Authorized By</span>
                </h4>
                <div className="p-3 rounded-xl bg-[#FFF5F8]/80 border border-[#FBCFE8] text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Officer Name</span><span className="text-[#701a75] font-medium">{selectedTx.authorizedByName || 'Sarah Jenkins'}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Employee ID</span><span className="text-[#701a75] font-mono font-bold">{selectedTx.authorizedByEmployeeId || 'EMP-0101'}</span></div>
                  <div className="flex justify-between"><span className="text-[#9D174D]/85">Designation</span><span className="text-[#831843] italic text-[11px]">{selectedTx.authorizedByDesignation || 'Senior Banking Officer'}</span></div>
                </div>
              </div>

              {/* Fraud Monitoring Section with standard color indicators */}
              <div className="space-y-3 p-4 rounded-xl border border-dashed border-[#F9A8D4] bg-[#FFF5F8]/70" id="detail-fraud-section">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                    <Shield size={12} className="text-rose-400 animate-pulse" />
                    <span>Fraud Security Assessment</span>
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                    selectedTx.riskScore > 60 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                      : selectedTx.riskScore > 20
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-505/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {selectedTx.securityStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#FDF4F9]/80 p-2.5 rounded-lg border border-[#F9A8D4]">
                    <span className="text-[9px] text-[#BE185D]/75 uppercase block">Risk Threat Score</span>
                    <span className="text-base font-extrabold font-mono text-[#701a75]">{selectedTx.riskScore}%</span>
                    <div className="w-full bg-[#1b2557] h-1.5 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          selectedTx.riskScore > 60 ? 'bg-red-500' : selectedTx.riskScore > 20 ? 'bg-amber-500' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${selectedTx.riskScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#FDF4F9]/80 p-2.5 rounded-lg border border-[#F9A8D4]">
                    <span className="text-[9px] text-[#BE185D]/75 uppercase block">Fraud Probability</span>
                    <span className={`text-base font-extrabold ${
                      selectedTx.riskScore > 60 ? 'text-red-400' : selectedTx.riskScore > 20 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {selectedTx.fraudProbability}
                    </span>
                    <span className="text-[8px] block text-[#9D174D]/75 mt-1">Sovereign Index rating</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1.5 border-t border-[#FBCFE8]">
                  <span className="text-[#9D174D]/85">Total Flagged Anomalies</span>
                  <span className={`font-mono font-extrabold text-[11px] px-1.5 py-0.5 rounded-full ${
                    selectedTx.flaggedTransactionsCount > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {selectedTx.flaggedTransactionsCount} Matches
                  </span>
                </div>
              </div>

              {/* Complete Transaction History Navigation Tabs */}
              <div className="space-y-3 text-xs" id="detail-history-section">
                <div className="flex flex-col gap-1">
                  <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5">
                    <Clock size={12} className="text-[#d4af37]" />
                    <span>Complete History Context</span>
                  </h4>
                  <p className="text-[9px] text-[#9D174D]/75">Historical sequence for user {selectedTx.name}.</p>
                </div>

                {/* Sub Tab selection slider to fit within 1 Column width comfortably */}
                <div className="overflow-x-auto flex gap-1 pb-2 border-b border-[#FBCFE8] scrollbar-thin">
                  {(['Timeline', 'Deposits', 'Withdrawals', 'Transfers', 'Payments', 'Cards'] as const).map((tab) => {
                    const isActive = historyTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setHistoryTab(tab)}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-all cursor-pointer whitespace-nowrap ${
                          isActive 
                            ? 'bg-[#1b2557] text-[#d4af37] border border-[#d4af37]/20' 
                            : 'text-[#9D174D]/85 hover:text-[#4A044E] bg-[#FFF5F8]/80'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Tab content displays */}
                <div className="pt-2 max-h-56 overflow-y-auto pr-1 space-y-2">
                  
                  {/* General timeline tab */}
                  {historyTab === 'Timeline' && (
                    <div className="space-y-4 border-l border-[#FBCFE8] pl-3 ml-2.5 pt-1.5">
                      
                      {/* Timeline Dep */}
                      {selectedTx.history.deposits.slice(0, 2).map((item, index) => (
                        <div key={`timeline-dep-${index}`} className="relative">
                          <span className="absolute -left-[16.5px] top-1 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#070c2e]" />
                          <div className="text-[10px]">
                            <p className="font-bold text-[#701a75]">Deposited {item.amount}</p>
                            <p className="text-[9px] text-[#9D174D]/75">{item.date} • {item.branch}</p>
                          </div>
                        </div>
                      ))}

                      {/* Timeline Cards */}
                      {selectedTx.history.cardTransactions.slice(0, 2).map((item, index) => (
                        <div key={`timeline-crd-${index}`} className="relative">
                          <span className="absolute -left-[16.5px] top-1 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[#070c2e]" />
                          <div className="text-[10px]">
                            <p className="font-bold text-[#701a75]">Card Payment of {item.amount} at {item.merchant}</p>
                            <p className="text-[9px] text-[#9D174D]/75">{item.date} • Number: {item.cardNumberMasked}</p>
                          </div>
                        </div>
                      ))}

                      {/* Timeline Transfers */}
                      {selectedTx.history.transfers.slice(0, 2).map((item, index) => (
                        <div key={`timeline-trf-${index}`} className="relative">
                          <span className="absolute -left-[16.5px] top-1 h-2 w-2 rounded-full bg-blue-400 ring-2 ring-[#070c2e]" />
                          <div className="text-[10px]">
                            <p className="font-bold text-[#701a75]">Transferred {item.amount} to {item.receiver}</p>
                            <p className="text-[9px] text-[#9D174D]/75">{item.date} • {item.sender}</p>
                          </div>
                        </div>
                      ))}

                      {/* Timeline Payments */}
                      {selectedTx.history.payments.slice(0, 2).map((item, index) => (
                        <div key={`timeline-pay-${index}`} className="relative">
                          <span className="absolute -left-[16.5px] top-1 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-[#070c2e]" />
                          <div className="text-[10px]">
                            <p className="font-bold text-[#701a75]">Merchant Payment: {item.amount} to {item.merchantName}</p>
                            <p className="text-[9px] text-[#9D174D]/75">{item.date}</p>
                          </div>
                        </div>
                      ))}

                      {/* Fallback */}
                      {selectedTx.history.deposits.length === 0 && 
                       selectedTx.history.cardTransactions.length === 0 && 
                       selectedTx.history.transfers.length === 0 && 
                       selectedTx.history.payments.length === 0 && (
                        <p className="text-[#9D174D]/75 italic text-[11px]">No matching historical record trace detected is ledger database systems.</p>
                      )}
                    </div>
                  )}

                  {/* Deposits history list */}
                  {historyTab === 'Deposits' && (
                    <div className="space-y-2">
                      {selectedTx.history.deposits.length === 0 ? (
                        <p className="text-[#9D174D]/75 text-[11px] italic">No deposit historical events found.</p>
                      ) : (
                        selectedTx.history.deposits.map((item, i) => (
                          <div key={i} className="bg-[#FFF5F8]/70 border border-[#FBCFE8] p-2.5 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="font-bold text-[#701a75]">{item.branch}</p>
                              <p className="text-[9px] text-[#9D174D]/75">{item.date} • {item.time}</p>
                            </div>
                            <span className="text-emerald-400 font-mono font-bold text-[11px] shrink-0">+{item.amount}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Withdrawals history list */}
                  {historyTab === 'Withdrawals' && (
                    <div className="space-y-2">
                      {selectedTx.history.withdrawals.length === 0 ? (
                        <p className="text-[#9D174D]/75 text-[11px] italic">No withdrawal historical events found.</p>
                      ) : (
                        selectedTx.history.withdrawals.map((item, i) => (
                          <div key={i} className="bg-[#FFF5F8]/70 border border-[#FBCFE8] p-2.5 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="font-bold text-[#701a75]">{item.branch}</p>
                              <p className="text-[9px] text-[#9D174D]/75">{item.date} • {item.time}</p>
                            </div>
                            <span className="text-rose-400 font-mono font-bold text-[11px] shrink-0">-{item.amount}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Transfers history list */}
                  {historyTab === 'Transfers' && (
                    <div className="space-y-2">
                      {selectedTx.history.transfers.length === 0 ? (
                        <p className="text-[#9D174D]/75 text-[11px] italic">No transfer historical events found.</p>
                      ) : (
                        selectedTx.history.transfers.map((item, i) => (
                          <div key={i} className="bg-[#FFF5F8]/70 border border-[#FBCFE8] p-2.5 rounded-lg text-[11px] space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-[#9D174D]/85">Recipient</span>
                              <span className="font-mono text-[#831843] font-bold">{item.receiver}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#9D174D]/75">{item.date} {item.time ? `• ${item.time}` : ''}</span>
                              <span className="text-blue-400 font-bold font-mono">{item.amount}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Payments history list */}
                  {historyTab === 'Payments' && (
                    <div className="space-y-2">
                      {selectedTx.history.payments.length === 0 ? (
                        <p className="text-[#9D174D]/75 text-[11px] italic">No payment historical events found.</p>
                      ) : (
                        selectedTx.history.payments.map((item, i) => (
                          <div key={i} className="bg-[#FFF5F8]/70 border border-[#FBCFE8] p-2.5 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="font-bold text-[#701a75]">{item.merchantName}</p>
                              <p className="text-[9px] text-[#9D174D]/75">{item.date} • {item.time || '12:00 PM'}</p>
                            </div>
                            <span className="text-rose-400 font-mono font-bold text-[11px] shrink-0">-{item.amount}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Card transaction list */}
                  {historyTab === 'Cards' && (
                    <div className="space-y-2">
                      {selectedTx.history.cardTransactions.length === 0 ? (
                        <p className="text-[#9D174D]/75 text-[11px] italic">No card ledger historical events found.</p>
                      ) : (
                        selectedTx.history.cardTransactions.map((item, i) => (
                          <div key={i} className="bg-[#FFF5F8]/70 border border-[#FBCFE8] p-2.5 rounded-lg text-[11px] space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-[#9D174D]/85">{item.merchant}</span>
                              <span className="font-mono text-[#9D174D]/75">{item.cardNumberMasked}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#9D174D]/75">{item.date} • {item.time}</span>
                              <span className="text-rose-400 font-bold font-mono">{item.amount}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Super Admin Control Actions */}
              <div className="space-y-2.5 text-xs pt-4 border-t border-[#FBCFE8]" id="detail-actions-section">
                <h4 className="text-[10px] uppercase text-[#BE185D]/75 font-extrabold tracking-widest flex items-center gap-1.5 mb-2">
                  <Sliders size={12} className="text-[#d4af37]" />
                  <span>Super Admin Actions Override</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    id="action-btn-report"
                    onClick={() => handleActionClick("View Full Transaction Report", `Requested full system compiled report for transaction ${selectedTx.id}`, 'reports', true)}
                    disabled={loadingAction === "View Full Transaction Report"}
                    className="flex items-center gap-1.5 p-2 bg-[#FFF1F5] hover:bg-[#141c48] hover:text-[#4A044E] border border-[#F9A8D4] text-[#831843] rounded-lg selection-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "View Full Transaction Report" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FileText size={12} className="text-[#d4af37]" />}
                    <span>Ledger Report</span>
                  </button>

                  <button
                    id="action-btn-acct-details"
                    onClick={() => handleActionClick("View Account Details", `Requested account portfolio mapping for account ${selectedTx.accountNumber}`, 'accounts')}
                    disabled={loadingAction === "View Account Details"}
                    className="flex items-center gap-1.5 p-2 bg-[#FFF1F5] hover:bg-[#141c48] hover:text-[#4A044E] border border-[#F9A8D4] text-[#831843] rounded-lg selection-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "View Account Details" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CreditCardIcon size={12} className="text-[#d4af37]" />}
                    <span>Account Details</span>
                  </button>

                  <button
                    id="action-btn-cust-profile"
                    onClick={() => handleActionClick("View Customer Profile", `Loaded high resolution customer profile for ${selectedTx.name}`, 'customers')}
                    disabled={selectedTx.userType !== 'Customer' || loadingAction === "View Customer Profile"}
                    className={`flex items-center gap-1.5 p-2 border rounded-lg selection-none transition-all cursor-pointer ${
                      selectedTx.userType === 'Customer'
                        ? 'bg-[#FFF1F5] hover:bg-[#141c48] hover:text-[#4A044E] border-[#F9A8D4] text-[#831843]'
                        : 'bg-[#FFF5F8]/50 border-transparent text-slate-600 cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {loadingAction === "View Customer Profile" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <User size={12} className="text-blue-400" />}
                    <span>Client Profile</span>
                  </button>

                  <button
                    id="action-btn-emp-profile"
                    onClick={() => handleActionClick("View Employee Profile", `Loaded corporate officer compliance card for ${selectedTx.name}`, 'employees')}
                    disabled={selectedTx.userType !== 'Employee' || loadingAction === "View Employee Profile"}
                    className={`flex items-center gap-1.5 p-2 border rounded-lg selection-none transition-all cursor-pointer ${
                      selectedTx.userType === 'Employee'
                        ? 'bg-[#FFF1F5] hover:bg-[#141c48] hover:text-[#4A044E] border-[#F9A8D4] text-[#831843]'
                        : 'bg-[#FFF5F8]/50 border-transparent text-slate-600 cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {loadingAction === "View Employee Profile" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <UserCheck size={12} className="text-[#d4af37]" />}
                    <span>Employee Profile</span>
                  </button>

                  <button
                    id="action-btn-msg-manager"
                    onClick={() => handleActionClick("Contact Branch Manager", `Dispatched priority message packet to manager of branch ${selectedTx.branchCode}`, undefined, true)}
                    disabled={loadingAction === "Contact Branch Manager"}
                    className="flex items-center gap-1.5 p-2 bg-[#FFF1F5] hover:bg-[#141c48] hover:text-[#4A044E] border border-[#F9A8D4] text-[#831843] rounded-lg selection-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "Contact Branch Manager" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <MessageSquare size={12} className="text-[#d4af37]" />}
                    <span>Ping Manager</span>
                  </button>

                  <button
                    id="action-btn-msg-officer"
                    onClick={() => handleActionClick("Contact Authorizing Officer", `Dispatched communication log to authorizer: ${selectedTx.authorizedByName}`, undefined, true)}
                    disabled={loadingAction === "Contact Authorizing Officer"}
                    className="flex items-center gap-1.5 p-2 bg-[#FFF1F5] hover:bg-[#141c48] hover:text-[#4A044E] border border-[#F9A8D4] text-[#831843] rounded-lg selection-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "Contact Authorizing Officer" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Shield size={12} className="text-emerald-400" />}
                    <span>Ping Authorizer</span>
                  </button>

                  <button
                    id="action-btn-download-history"
                    onClick={() => handleActionClick("Download Transaction History", `Downloaded decrypted offline ledger log file for user ${selectedTx.id}`)}
                    disabled={loadingAction === "Download Transaction History"}
                    className="flex items-center gap-1.5 p-2 bg-[#FFF1F5] hover:bg-[#141c48] hover:text-[#4A044E] border border-[#F9A8D4] text-[#831843] rounded-lg selection-none transition-all cursor-pointer col-span-2 justify-center disabled:opacity-50"
                  >
                    {loadingAction === "Download Transaction History" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Download size={12} className="text-emerald-400" />}
                    <span>Download Historical Log</span>
                  </button>

                  <button
                    id="action-btn-view-audit"
                    onClick={() => handleActionClick("View Audit Logs", `Filtered system audit records matching reference root ID ${selectedTx.id}`, 'audit')}
                    disabled={loadingAction === "View Audit Logs"}
                    className="flex items-center gap-1.5 p-2 bg-[#FFF1F5] hover:bg-[#141c48] hover:text-[#4A044E] border border-[#F9A8D4] text-[#831843] rounded-lg selection-none transition-all cursor-pointer col-span-2 justify-center disabled:opacity-50"
                  >
                    {loadingAction === "View Audit Logs" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Info size={12} className="text-blue-400" />}
                    <span>View Server Audit Logs</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
