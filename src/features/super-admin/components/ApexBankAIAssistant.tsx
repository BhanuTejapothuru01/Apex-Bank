import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  Sparkles, 
  Send, 
  ChevronRight,
  Shield,
  ShieldAlert, 
  Users, 
  UserCheck,
  Wallet, 
  Coins, 
  Activity, 
  Building2, 
  CreditCard, 
  FileCheck, 
  Lock,
  ArrowUpRight,
  Terminal,
  Clock,
  Volume2,
  Trash2,
  Zap
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { Customer, Employee, Branch, Transaction, Loan, CreditCard as CardType, FixedDeposit, AuditLog } from '../types/dashboard';
import BrandLogo from './BrandLogo';

interface ApexBankAIAssistantProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  customers: Customer[];
  employees: Employee[];
  branches: Branch[];
  transactions: Transaction[];
  loans: Loan[];
  cards: CardType[];
  fixedDeposits: FixedDeposit[];
  logs: AuditLog[];
  notifications: any[];
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  isCustomReport?: boolean;
  metaType?: 'customer' | 'employee' | 'branch' | 'loan' | 'card' | 'txn' | 'kyc' | 'fraud' | 'nav' | 'general';
  reportData?: any;
}

export default function ApexBankAIAssistant({
  activeTab,
  setActiveTab,
  customers,
  employees,
  branches,
  transactions,
  loans,
  cards,
  fixedDeposits,
  logs,
  notifications,
  addAuditLog
}: ApexBankAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Affirmative, Super Admin. Apex Intelligence Engine is online. Level 5 administrative authorization verified. I have loaded synchronized ledgers. Ask me anything about bank operations or utilize quick navigation actions below.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metaType: 'general'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping, isOpen]);

  // Dynamic status counters for context-awareness headers
  const totals = useMemo(() => {
    const pendingKycCount = (customers || []).filter(c => c.kycStatus === 'Pending').length;
    const suspiciousCount = (transactions || []).filter(t => t.status === 'Suspicious').length;
    const pendingLoansCount = (loans || []).filter(l => l.status === 'Pending').length;
    const totalDepositsSum = (branches || []).reduce((acc, b) => acc + (b.totalDeposits || 0), 0);
    const criticalFraudCount = (notifications || []).filter(n => n.type === 'critical' && !n.read).length;

    return {
      pendingKyc: pendingKycCount,
      suspiciousTxns: suspiciousCount,
      pendingLoans: pendingLoansCount,
      totalDeposits: totalDepositsSum,
      criticalFraud: criticalFraudCount
    };
  }, [customers, transactions, loans, branches, notifications]);

  // Handle analytical intelligence algorithms
  const parseAndAnswerQuery = (userText: string) => {
    const cleaned = userText.toLowerCase().trim();
    const resultMsgId = `reply-${Date.now()}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Smart Navigation Directives
    const navKeywords: { phrase: string; tab: ActiveTab; name: string }[] = [
      { phrase: 'open branch', tab: 'branches', name: 'Branch Management' },
      { phrase: 'go to branch', tab: 'branches', name: 'Branch Management' },
      { phrase: 'navigate to branch', tab: 'branches', name: 'Branch Management' },
      { phrase: 'open customer', tab: 'customers', name: 'Customer Management' },
      { phrase: 'go to customer', tab: 'customers', name: 'Customer Management' },
      { phrase: 'open employee', tab: 'employees', name: 'Employee Management' },
      { phrase: 'go to employee', tab: 'employees', name: 'Employee Management' },
      { phrase: 'open account', tab: 'accounts', name: 'Account Management' },
      { phrase: 'go to account', tab: 'accounts', name: 'Account Management' },
      { phrase: 'open loan', tab: 'loans', name: 'Loan Management' },
      { phrase: 'go to loan', tab: 'loans', name: 'Loan Management' },
      { phrase: 'open card', tab: 'cards', name: 'Credit Card Management' },
      { phrase: 'go to card', tab: 'cards', name: 'Credit Card Management' },
      { phrase: 'open transaction', tab: 'transactions', name: 'Transaction Monitoring' },
      { phrase: 'go to transaction', tab: 'transactions', name: 'Transaction Monitoring' },
      { phrase: 'open kyc', tab: 'kyc', name: 'KYC Verification' },
      { phrase: 'go to kyc', tab: 'kyc', name: 'KYC Verification' },
      { phrase: 'open fraud', tab: 'fraud', name: 'Fraud Detection Center' },
      { phrase: 'go to fraud', tab: 'fraud', name: 'Fraud Detection Center' },
      { phrase: 'open fixed deposit', tab: 'deposits', name: 'Fixed Deposits' },
      { phrase: 'go to deposit', tab: 'deposits', name: 'Fixed Deposits' },
      { phrase: 'open setting', tab: 'settings', name: 'System Settings' },
      { phrase: 'go to setting', tab: 'settings', name: 'System Settings' },
      { phrase: 'open overview', tab: 'overview', name: 'Dashboard Overview' },
      { phrase: 'go to overview', tab: 'overview', name: 'Dashboard Overview' },
      { phrase: 'open report', tab: 'reports', name: 'Reports & Analytics' },
      { phrase: 'go to report', tab: 'reports', name: 'Reports & Analytics' },
      { phrase: 'open audit', tab: 'audit', name: 'Audit Logs' },
      { phrase: 'go to audit', tab: 'audit', name: 'Audit Logs' },
      { phrase: 'open support', tab: 'support', name: 'Support & Tickets' },
      { phrase: 'go to support', tab: 'support', name: 'Support & Tickets' },
      { phrase: 'open ai core', tab: 'ai-core', name: 'AI Operational Core' },
      { phrase: 'go to ai core', tab: 'ai-core', name: 'AI Operational Core' }
    ];

    for (const nav of navKeywords) {
      if (cleaned.includes(nav.phrase)) {
        setActiveTab(nav.tab);
        addAuditLog(`AI Co-pilot auto-navigated route to: ${nav.name}`, 'Info');
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `⚡ **smart routing system initiated.** Re-orienting terminal context. Successfully dispatched navigation packet. Welcome to **${nav.name}** module! Let me know if you require operational metrics on this layout.`,
          time: timeStr,
          metaType: 'nav' as const
        };
      }
    }

    // 2. Customer Intelligence Queries
    if (cleaned.includes('customer') || cleaned.includes('cust-') || cleaned.startsWith('show customer')) {
      // Look for a specific Customer by Name or ID
      let matchedCust: Customer | undefined;
      
      // Match ID patterns
      const idMatch = cleaned.match(/cust-\d+/i);
      if (idMatch) {
        matchedCust = customers.find(c => c.id.toLowerCase() === idMatch[0].toLowerCase());
      } else {
        // Match name
        for (const cust of customers) {
          if (cleaned.includes(cust.name.toLowerCase())) {
            matchedCust = cust;
            break;
          }
        }
      }

      if (matchedCust) {
        addAuditLog(`AI Customer intelligence fetched profile for entity: ${matchedCust.name}`, 'Info');
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `👤 **Customer Profile Extracted successfully:**\n\n**Entity Name:** ${matchedCust.name}\n**System ID:** ${matchedCust.id}\n**Account Type:** ${matchedCust.type} Tier\n**Ledger Balance:** $${matchedCust.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n**KYC Security State:** ${matchedCust.kycStatus}\n**Threat Meter Rating:** ${matchedCust.riskScore}% (${matchedCust.riskProfile} Risk Profile)\n**Fiduciary State:** ${matchedCust.status}\n**Filing Node Location:** ${matchedCust.branchId}\n\nWould you like me to analyze transactions linked to their credentials?`,
          time: timeStr,
          metaType: 'customer' as const,
          isCustomReport: true,
          reportData: matchedCust
        };
      } else if (cleaned.includes('show customer details') || cleaned.includes('find customer') || cleaned.includes('show customers')) {
        const vipCount = customers.filter(c => c.type === 'VIP').length;
        const activeCount = customers.filter(c => c.status === 'Active').length;
        const totalCustomersBalance = customers.reduce((sum, c) => sum + c.balance, 0);

        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `👥 **Apex Sovereign Customer Ledger Summary:**\n\n* **Total Active Clients:** ${customers.length} ledger nodes\n* **Administrative State Lock:** ${customers.filter(c => c.status === 'Frozen').length} frozen status alerts\n* **VIP Reserve Tier Customers:** ${vipCount} premium entities\n* **Consolidated Cash Deposition:** $${totalCustomersBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD\n\n*Pro-tip: Ask me "Show customer Alistair Sterling" or "Show customer Elena Rostova" for micro-dispatched profiles.*`,
          time: timeStr,
          metaType: 'customer' as const
        };
      }
    }

    // 3. Employee Intelligence Queries
    if (cleaned.includes('employee') || cleaned.includes('emp-') || cleaned.includes('staff') || cleaned.includes('manager')) {
      let matchedEmp: Employee | undefined;
      const idMatch = cleaned.match(/emp-\d+/i);
      
      if (idMatch) {
        matchedEmp = employees.find(e => e.id.toLowerCase() === idMatch[0].toLowerCase());
      } else {
        for (const emp of employees) {
          if (cleaned.includes(emp.name.toLowerCase())) {
            matchedEmp = emp;
            break;
          }
        }
      }

      if (matchedEmp) {
        addAuditLog(`AI Employee intelligence retrieved dossier for staff ID: ${matchedEmp.id}`, 'Info');
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `🎖️ **Apex Staff Representative Audit dossiers:**\n\n**Name:** ${matchedEmp.name}\n**Registry Token:** ${matchedEmp.id}\n**Assigned Duty Role:** ${matchedEmp.role}\n**Departmental Hub:** ${matchedEmp.department}\n**Operational Efficiency Performance Index:** ${matchedEmp.performance}% \n**Roster Rating:** ${matchedEmp.rating} / 5.0 Rating state\n**Sovereign Node Area:** ${matchedEmp.branchId}\n\nThis employee is in **${matchedEmp.status.toUpperCase()}** status active duty.`,
          time: timeStr,
          metaType: 'employee' as const,
          isCustomReport: true,
          reportData: matchedEmp
        };
      } else if (cleaned.includes('hierarchy') || cleaned.includes('manager') || cleaned.includes('branch manager')) {
        const managers = branches.map(b => `${b.name}: ${b.manager}`).join('\n* ');
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `🏢 **Apex Administrative Hub Leaders Hierarchy:**\n\n* ${managers}\n\nEvery branch is presided over by an active high-clearance executive manager. All managers operate with full regional power clearance keys.`,
          time: timeStr,
          metaType: 'employee' as const
        };
      } else {
        const activeEmp = employees.filter(e => e.status === 'Active').length;
        const avgPerformance = employees.reduce((sum, e) => sum + e.performance, 0) / employees.length;
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `👮 **Sovereign Operator Staff Analytics:**\n\n* **Active Staff Handlers:** ${activeEmp} members on desk duty.\n* **Mean Performance Factor Score:** ${avgPerformance.toFixed(1)}% general performance evaluation rating.\n* **IT Admin Reps:** ${employees.filter(e => e.department === 'Information Technology').length} nodes.\n\nYou can query employee listings by asking "Find employee Sarah Jenkins" or listing details on specific roles.`,
          time: timeStr,
          metaType: 'employee' as const
        };
      }
    }

    // 4. Branch Intelligence Queries
    if (cleaned.includes('branch') || cleaned.includes('br-') || cleaned.includes('zurich') || cleaned.includes('london') || cleaned.includes('tokyo') || cleaned.includes('singapore') || cleaned.includes('york')) {
      let matchedBranch: Branch | undefined;
      const idMatch = cleaned.match(/br-\w+-\d+/i);

      if (idMatch) {
        matchedBranch = branches.find(b => b.id.toLowerCase() === idMatch[0].toLowerCase());
      } else {
        const locations = ['new york', 'zurich', 'london', 'tokyo', 'singapore'];
        for (const loc of locations) {
          if (cleaned.includes(loc)) {
            matchedBranch = branches.find(b => b.location.toLowerCase().includes(loc) || b.name.toLowerCase().includes(loc));
            break;
          }
        }
      }

      if (matchedBranch) {
        addAuditLog(`AI Branch intelligence loaded stats for node: ${matchedBranch.name}`, 'Info');
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `🏛️ **Branch Ledger Diagnostics:**\n\n**Location ID:** ${matchedBranch.name} (${matchedBranch.id})\n**Presiding Leader Manager:** ${matchedBranch.manager}\n**District Address:** ${matchedBranch.location}\n**Capital Deposits Value:** $${matchedBranch.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD\n**Active System Accounts:** ${matchedBranch.activeAccounts} nodes\n**Node Operational Status:** ${matchedBranch.status}\n**Quality Audit Coefficient:** ${matchedBranch.rating} / 5.0 Stars rating`,
          time: timeStr,
          metaType: 'branch' as const,
          isCustomReport: true,
          reportData: matchedBranch
        };
      } else {
        const sortedBranches = [...branches].sort((a, b) => b.totalDeposits - a.totalDeposits);
        const rankList = sortedBranches.map((b, idx) => `${idx + 1}. **${b.name}** ($${b.totalDeposits.toLocaleString()})`).join('\n');
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `🗺️ **Apex Global Branch Capital Deposit Rankings:**\n\n${rankList}\n\n**Aggregate Reserve Density:** $${totals.totalDeposits.toLocaleString()} USD.\nAll global branches report solid telemetry in general operations state.`,
          time: timeStr,
          metaType: 'branch' as const
        };
      }
    }

    // 5. Account Intelligence Queries
    if (cleaned.includes('account') || cleaned.includes('balance') || cleaned.includes('deposits')) {
      const sumBal = customers.reduce((sum, c) => sum + c.balance, 0);
      const avgBal = sumBal / customers.length;
      return {
        id: resultMsgId,
        sender: 'ai' as const,
        text: `💳 **Apex Global Client Depository Analytics:**\n\n* **Consolidated Cash Balance Assets:** $${sumBal.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD\n* **Mean Balance Per Ledger Node:** $${avgBal.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD\n* **Sovereign Basel-III Liquidity Reserve:** satisfies tier-1 structural regulatory guidelines.\n\nTo fetch a specific client's balance statement, enter their name (e.g. "CUST-802 balance" or "Alistair Sterling balance").`,
        time: timeStr,
        metaType: 'accounts' as const
      };
    }

    // 6. Loan Intelligence Queries
    if (cleaned.includes('loan') || cleaned.includes('defaults') || cleaned.includes('underwriter')) {
      const pendingLoans = loans.filter(l => l.status === 'Pending');
      const approvedCount = loans.filter(l => l.status === 'Approved').length;
      const totalAmount = loans.reduce((sum, l) => sum + l.amount, 0);

      if (pendingLoans.length > 0 && (cleaned.includes('pending') || cleaned.includes('check'))) {
        const pendingList = pendingLoans.map(l => `* **${l.id}** (${l.customerName}) - $${l.amount.toLocaleString()} - Risk: ${l.riskScore}%`).join('\n');
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `🪙 **Active Loan Underwriter Pending Review Queue:**\n\n${pendingList}\n\nThere are **${pendingLoans.length}** pending loan applications awaiting risk verification assessment review. Navigate to Loan Management to approve or decline instantly.`,
          time: timeStr,
          metaType: 'loan' as const
        };
      } else {
        const avgRisk = loans.reduce((sum, l) => sum + l.riskScore, 0) / loans.length;
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `🪙 **Dynamic Credit Suitability & Loan Analytics:**\n\n* **Sovereign Disbursed Credit Principal:** $${totalAmount.toLocaleString()} USD\n* **Corporate Default Risk Average:** ${avgRisk.toFixed(1)}%\n* **Authorized Term Agreements:** ${approvedCount} active contracts\n* **Pending Review Backlog:** ${pendingLoans.length} unresolved contracts`,
          time: timeStr,
          metaType: 'loan' as const
        };
      }
    }

    // 7. Credit Card Intelligence Queries
    if (cleaned.includes('card') || cleaned.includes('credit score') || cleaned.includes('spending')) {
      const activeCards = cards.filter(c => c.status === 'Active').length;
      const totalOutstanding = cards.reduce((sum, c) => sum + (c.balance || 0), 0);
      return {
        id: resultMsgId,
        sender: 'ai' as const,
        text: `💳 **Prismatic Credit Card Fleet Telemetry:**\n\n* **Active Credit Cards Fleet:** ${activeCards} nodes\n* **Outstanding Balance Assets:** $${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD\n* **Mean Credit Utilization Coefficient:** 24.3% general average\n* **Pending Authorization Backlogs:** ${cards.filter(c => c.status === 'Pending Activation').length} nodes\n\nAsk me about client cards or check user metrics inside the Card Management module to view details.`,
        time: timeStr,
        metaType: 'card' as const
      };
    }

    // 8. Transaction Intelligence Queries
    if (cleaned.includes('transaction') || cleaned.includes('txn-') || cleaned.includes('transfer') || cleaned.includes('withdraw') || cleaned.includes('ledgers')) {
      let matchedTx: Transaction | undefined;
      const idMatch = cleaned.match(/txn-\d+/i);

      if (idMatch) {
        matchedTx = transactions.find(t => t.id.toLowerCase() === idMatch[0].toLowerCase());
      }

      if (matchedTx) {
        addAuditLog(`AI Transaction intelligence resolved TXID: ${matchedTx.id}`, 'Info');
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `✨ **Specific Ledger Settlement Detail:**\n\n**Receipt ID:** ${matchedTx.id}\n**Origin Client Holder:** ${matchedTx.customerName} (${matchedTx.customerId})\n**Settled Balance:** $${matchedTx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD\n**Structural Type:** ${matchedTx.type}\n**Activity Category Node:** ${matchedTx.category}\n**Sovereign Timestamp:** ${new Date(matchedTx.timestamp).toLocaleString()}\n**Clearing status:** ${matchedTx.status}\n**AI Risk Index:** ${matchedTx.fraudRiskScore}%`,
          time: timeStr,
          metaType: 'txn' as const,
          isCustomReport: true,
          reportData: matchedTx
        };
      } else {
        const suspicious = transactions.filter(t => t.status === 'Suspicious');
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `📊 **Synchronized Central Cash Flow Ledger Analytics:**\n\n* **Total Cleared Transactions:** ${transactions.length} entries cataloged.\n* **Flagged Suspicious Activity:** ${suspicious.length} node triggers.\n* **Mean Fraud Risk Quotient Index:** ${(transactions.reduce((sum, t) => sum + t.fraudRiskScore, 0) / transactions.length).toFixed(1)}%\n\nType a specific ID like "TXN-98218" for comprehensive audit trails on ledger settlements.`,
          time: timeStr,
          metaType: 'txn' as const
        };
      }
    }

    // 9. KYC Intelligence Queries
    if (cleaned.includes('kyc') || cleaned.includes('document') || cleaned.includes('verify')) {
      const pendingUsers = customers.filter(c => c.kycStatus === 'Pending');
      if (pendingUsers.length > 0) {
        const listStr = pendingUsers.map(u => `* **${u.name}** (ID: ${u.id}) - Join Date: ${u.joinDate}`).join('\n');
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `🔍 **Pending KYC Identity Attestation Queue:**\n\n${listStr}\n\nThere are **${pendingUsers.length}** client profiles requiring Aadhaar QR Decryption or pixel parity checks. Navigate to **KYC Verification** to sign off.`,
          time: timeStr,
          metaType: 'kyc' as const
        };
      } else {
        return {
          id: resultMsgId,
          sender: 'ai' as const,
          text: `🔍 **KYC Security Ledger Telemetry:**\n\n* **Dynamic Approved Attestations:** ${customers.filter(c => c.kycStatus === 'Approved').length} verified nodes.\n* **Definitive Rejected States:** ${customers.filter(c => c.kycStatus === 'Rejected').length} files.\n* **Pending queue index:** ${pendingUsers.length} unresolved dossiers.\n\nAll security files are backed up to sovereign hardware validation models.`,
          time: timeStr,
          metaType: 'kyc' as const
        };
      }
    }

    // 10. Fraud & System Security Intelligence Queries
    if (cleaned.includes('fraud') || cleaned.includes('threat') || cleaned.includes('security') || cleaned.includes('alert') || cleaned.includes('intruder') || cleaned.includes('high-risk')) {
      const suspiciousTx = transactions.filter(t => t.status === 'Suspicious');
      const criticalRiskCust = customers.filter(c => c.riskProfile === 'Critical' || c.riskProfile === 'High');
      
      addAuditLog(`AI Admin performed advanced security systems audit`, 'Critical');
      return {
        id: resultMsgId,
        sender: 'ai' as const,
        text: `🚨 **Apex Cryptographic Security Warning dispatch:**\n\n* **Active Threat Meters Score:** 84% System Integrations Shield.\n* **Unresolved Suspicious Settlements:** ${suspiciousTx.length} flagged ledgers\n* **High / Critical Risk Exposures:** ${criticalRiskCust.length} identities under strict monitoring\n* **Recent System Alerts Blocked:** ${notifications.length} intrusion attempts logged on firewall proxies.\n\n*Recommended action: Increase checking withdrawal locks to 10k max limit under System Settings.*`,
        time: timeStr,
        metaType: 'fraud' as const
      };
    }

    // 11. Fixed Deposit Maturity Report
    if (cleaned.includes('fd') || cleaned.includes('deposit') || cleaned.includes('maturity')) {
      const totalAmountFds = fixedDeposits.reduce((sum, fd) => sum + fd.amount, 0);
      const activeFds = fixedDeposits.filter(fd => fd.status === 'Active').length;
      return {
        id: resultMsgId,
        sender: 'ai' as const,
        text: `💰 **Apex Fixed Deposits Portfolio Summary:**\n\n* **Total Active Reserves Certificates:** ${activeFds} contracts.\n* **Aggregate Principal Density:** $${totalAmountFds.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD\n* **Projected Maturity Yield Compound Rate Avg:** 5.85% compound APR interest.\n\nTo view all individual deposits, please ask me "Open Fixed Deposits" or use the short panel shortcuts.`,
        time: timeStr,
        metaType: 'general' as const
      };
    }

    // Default conversational smart co-pilot responses
    return {
      id: resultMsgId,
      sender: 'ai' as const,
      text: `🌐 **General Operational Intelligence Scan**:\n\nUnderstood keyword pattern: "${userText}".\n\n* **Fiduciary Systems Status:** 🟢 Stable & Synergized\n* **Active Bank Balance Liquidity:** $${customers.reduce((s,c)=>s+c.balance, 0).toLocaleString()} USD\n* **Access Node Coordinates:** Port 3000 Secured Tunnel Connection.\n* **Clearing Clearing Router:** SWIFT Level 5 Core\n\nPlease select one of the core Quick Actions below, or ask me specific lookup queries like "Show customer Alistair Sterling", "Review pending loans" or "Open branch management".`,
      time: timeStr,
      metaType: 'general' as const
    };
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsTyping(true);

    // AI thinking state simulation for realistic feeling co-pilot with low latency
    setTimeout(() => {
      const response = parseAndAnswerQuery(userText);
      setChatHistory(prev => [...prev, response]);
      setIsTyping(false);
    }, 900);
  };

  const triggerShortcutQuery = (query: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = parseAndAnswerQuery(query);
      setChatHistory(prev => [...prev, response]);
      setIsTyping(false);
    }, 800);
  };

  const cleanChatLog = () => {
    setChatHistory([
      {
        id: 'welcome-renewed',
        sender: 'ai',
        text: "Database context references cleared. Handshaking protocol complete. Apex Bank AI Assistant is fully synchronized. Ask me anything on treasury operations.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metaType: 'general'
      }
    ]);
    addAuditLog("Super Admin purged AI assistant chat cache.", "Info");
  };

  return (
    <div id="apex-ai-assistant-wrapper" className="select-text">
      
      {/* 1. Compact Floating circular launcher (visible when not open or minimized) */}
      <AnimatePresence>
        {(!isOpen || isMinimized) && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 pointer-events-auto"
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 20 }}
          >
            <motion.button
              id="ai-floater-launcher-icon"
              title="Apex AI Co-Pilot"
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 12px 30px rgba(255,79,216,0.45)' }}
              whileTap={{ scale: 0.95 }}
              className="relative w-[64px] h-[64px] flex items-center justify-center bg-gradient-to-br from-[#FF4FD8] to-[#D86BFF] text-white rounded-full shadow-[0_8px_25px_rgba(255,79,216,0.35)] border border-white/50 cursor-pointer backdrop-blur-md transition-all group"
            >
              <div className="relative flex items-center justify-center">
                <Sparkles 
                  size={24} 
                  className="text-white fill-white/20 transition-transform group-hover:rotate-12" 
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00E676] border-[2.5px] border-white shadow-sm ring-2 ring-[#00E676]/20"></span>
              </div>

              {/* Tooltip Overlay */}
              <div className="absolute right-full mr-4 px-3 py-1.5 bg-[#2D2438] text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl border border-white/10 uppercase tracking-widest">
                Apex AI Co-Pilot
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-8 border-transparent border-l-[#2D2438]"></div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Expanded Slide-out Side Panel */}
      <AnimatePresence mode="wait">
        {isOpen && !isMinimized && (
          <>
            {/* Backdrop Blur / Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMinimized(true)}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[51]"
            />

            <motion.div
              id="ai-copilot-side-panel"
              initial={{ x: '100%', opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[400px] md:w-[420px] bg-white/95 backdrop-blur-2xl border-l border-pink-100 shadow-[-15px_0_50px_rgba(0,0,0,0.15)] flex flex-col z-[52] overflow-hidden"
            >
              {/* Top Header Section */}
              <div className="p-5 bg-gradient-to-r from-[#FF4FD8] to-[#D86BFF] flex items-center justify-between text-white shadow-md relative z-10">
                <div className="flex items-center gap-3 select-none">
                  <BrandLogo size={44} className="border-white/30" />
                  <div>
                    <h3 className="text-[15px] font-black tracking-tight leading-tight">APEX BANK AI CO-PILOT</h3>
                    <div className="flex items-center gap-1.5 opacity-90">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></div>
                      <span className="text-[10px] font-bold tracking-widest uppercase">System Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                    title="Minimize"
                  >
                    <Minimize2 size={18} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                    title="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Status & Health Summary Bar */}
              <div className="px-5 py-3 border-b border-pink-100 bg-pink-50/50 flex items-center justify-between overflow-x-auto gap-4 no-scrollbar select-none">
                <StatusItem label="Health" value="OPTIMAL" color="text-emerald-500" />
                <StatusItem label="Load" value="1.2ms" color="text-blue-500" />
                <StatusItem label="Secure" value="L5 AUTH" color="text-purple-600" />
                <StatusItem label="Sync" value="100%" color="text-pink-500" />
              </div>

              {/* Operations Quick Look / AI Insights Strip */}
              <div className="p-4 grid grid-cols-2 gap-2 bg-white/40 border-b border-pink-50">
                <InsightCard 
                  icon={<ShieldAlert size={14} />} 
                  label="Fraud Alerts" 
                  value={totals.criticalFraud} 
                  subLabel="Critical Threats"
                  color="text-rose-600"
                  bgColor="bg-rose-50"
                  borderColor="border-rose-100"
                />
                <InsightCard 
                  icon={<FileCheck size={14} />} 
                  label="KYC Queue" 
                  value={totals.pendingKyc} 
                  subLabel="Action Needed"
                  color="text-amber-600"
                  bgColor="bg-amber-50"
                  borderColor="border-amber-100"
                />
              </div>

              {/* Main Chat Interface */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-white to-pink-50/30 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
              {chatHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 w-full ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  {msg.sender === 'ai' && (
                    <BrandLogo size={32} className="shrink-0 rounded-full border-none shadow-md" />
                  )}
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed relative ${
                    msg.sender === 'ai' 
                      ? 'bg-white text-slate-700 rounded-tl-none border border-pink-50 shadow-sm'
                      : 'bg-gradient-to-br from-[#FF4FD8] to-[#D86BFF] text-white font-semibold rounded-tr-none shadow-pink-100 shadow-lg'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    {msg.isCustomReport && msg.reportData && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-pink-100 bg-pink-50/30">
                        <div className="bg-pink-100/50 px-3 py-1.5 flex justify-between items-center text-[9px] font-black text-pink-600">
                          <span>LEDGER COMPLIANCE NODE</span>
                          <Activity size={10} />
                        </div>
                        <pre className="p-3 text-[10px] font-mono text-slate-600 overflow-x-auto leading-tight bg-white/50">
                          {JSON.stringify(msg.reportData, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    <span className={`text-[8px] absolute -bottom-4 ${msg.sender === 'ai' ? 'left-0 text-slate-400' : 'right-0 text-pink-400'} font-bold`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

                {isTyping && (
                  <div className="flex gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-[10px]">AI</div>
                    <div className="bg-white border border-pink-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Analyzing Data...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Contextual Fast Actions Area */}
              <div className="p-5 border-t border-pink-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Operations</span>
                  <button onClick={cleanChatLog} className="text-[9px] font-bold text-pink-500 hover:underline flex items-center gap-1">
                    <Trash2 size={10} /> Clear Context
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {[
                    { label: "Fraud Review", query: "Show fraud alerts", icon: <Shield size={12} /> },
                    { label: "KYC Verification", query: "Show pending kyc", icon: <UserCheck size={12} /> },
                    { label: "Loan Audit", query: "Verify pending loans", icon: <Coins size={12} /> },
                    { label: "Branch Health", query: "Show branch performance", icon: <Building2 size={12} /> },
                    { label: "Customer Dossier", query: "Show customer details", icon: <Users size={12} /> }
                  ].map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => triggerShortcutQuery(act.query)}
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-pink-50 hover:bg-pink-100 border border-pink-100 text-pink-600 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap active:scale-95"
                    >
                      {act.icon} {act.label}
                    </button>
                  ))}
                </div>
                
                {/* Input Interaction Area */}
                <form onSubmit={handleMessageSubmit} className="mt-4 flex gap-2">
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      required
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Input command..."
                      className="w-full bg-slate-50 border border-slate-100 focus:border-pink-300 focus:bg-white p-3.5 pr-12 rounded-2xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-700 shadow-inner"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-300 group-focus-within:text-pink-400 transition-colors">
                      <Terminal size={16} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF4FD8] to-[#D86BFF] text-white shadow-lg hover:shadow-pink-200 active:scale-95 transition-all cursor-pointer"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Internal Styled Utility Components for the Drawer
function StatusItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-start min-w-fit">
      <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">{label}</span>
      <span className={`text-[10px] font-black font-mono ${color}`}>{value}</span>
    </div>
  );
}

function InsightCard({ icon, label, value, subLabel, color, bgColor, borderColor }: any) {
  return (
    <div className={`p-3 rounded-2xl border ${borderColor} ${bgColor} flex flex-col gap-1 transition-all hover:scale-[1.02] cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div className={`p-1.5 rounded-lg bg-white/80 ${color} shadow-sm`}>{icon}</div>
        <span className={`text-lg font-black font-mono leading-none ${color}`}>{value}</span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-700 uppercase leading-tight">{label}</p>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">{subLabel}</p>
      </div>
    </div>
  );
}


