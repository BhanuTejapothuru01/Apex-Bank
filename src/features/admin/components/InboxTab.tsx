import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  AlertTriangle, 
  Send,
  Cpu,
  Mail,
  MailOpen,
  ShieldCheck,
  ShieldAlert,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  ArrowRight,
  Info,
  Archive,
  RefreshCw,
  Bell,
  Check,
  Eye,
  Trash2,
  DollarSign
} from 'lucide-react';

interface InboxTabProps {
  balance: number;
  currentLoans: number;
  globalSearchQuery?: string;
}

interface FeedbackMessage {
  id: string;
  sender: 'Super Admin';
  subject: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  customerName: string;
  accountNumber: string; // masked
  loanId?: string;
  message: string;
  isRead: boolean;
  type: 'Balance' | 'Credit' | 'Loan' | 'Fraud' | 'KYC' | 'Transaction' | 'Compliance' | 'Risk';
  suggestedAction: string;
}

const INITIAL_FEEDBACK_MESSAGES: FeedbackMessage[] = [
  {
    id: "MSG-LN-904D",
    sender: "Super Admin",
    subject: "Fraud Protection Alert: Velocity Profile Outlier",
    priority: "Critical",
    date: "2026-06-12 10:15 AM",
    customerName: "Seraphina Vance",
    accountNumber: "XXXXXXXXX6014",
    loanId: "LN-2026-904D",
    type: "Fraud",
    message: "Multiple high-value transactions detected within the last 24 hours. Total transaction value exceeds expected customer behavior. Manual review required.",
    isRead: false,
    suggestedAction: "Initiate temporary account freeze, run compliance checks on beneficiary routing, and request security code confirmation."
  },
  {
    id: "MSG-BAL-089A",
    sender: "Super Admin",
    subject: "Surge Account Balance Audit Needed",
    priority: "High",
    date: "2026-06-12 09:40 AM",
    customerName: "Andrew Sterling",
    accountNumber: "XXXXXXXXX8951",
    loanId: "LN-2026-089A",
    type: "Balance",
    message: "Customer account balance increased significantly within a short period. Current Balance: $8,75,000 (equiv). Please review recent deposits and verify source of funds.",
    isRead: false,
    suggestedAction: "Run AML (Anti-Money Laundering) transaction origin check and request document proof of funds."
  },
  {
    id: "MSG-LN-112B",
    sender: "Super Admin",
    subject: "Loan ID Review: Debt Ratio Threshold Alert",
    priority: "High",
    date: "2026-06-12 08:12 AM",
    customerName: "Elwood Vance",
    accountNumber: "XXXXXXXXX4422",
    loanId: "LN-2026-112B",
    type: "Loan",
    message: "Loan ID LN-2026-089A requires additional income verification. Debt-to-Income ratio is above the recommended threshold.",
    isRead: false,
    suggestedAction: "Request latest tax returns, commercial balance sheet audit, or collateral verification."
  },
  {
    id: "MSG-CR-403C",
    sender: "Super Admin",
    subject: "Credit Limit Optimization: Marcus Thorne",
    priority: "Medium",
    date: "2026-06-11 05:20 PM",
    customerName: "Marcus Thorne",
    accountNumber: "XXXXXXXXX3312",
    loanId: "LN-2026-403C",
    type: "Credit",
    message: "Customer has maintained an excellent repayment history. Consider increasing credit limit from $1,00,000 to $2,00,000 after final review.",
    isRead: true,
    suggestedAction: "Verify commercial credit bureaus, check historical trade-cycle indicators and execute limit boost authorization."
  },
  {
    id: "MSG-KYC-112B",
    sender: "Super Admin",
    subject: "KYC Compliance Deficit Notice",
    priority: "High",
    date: "2026-06-11 11:30 AM",
    customerName: "Elwood Vance",
    accountNumber: "XXXXXXXXX4422",
    type: "KYC",
    message: "Employment verification document is missing. Contact customer and complete KYC review before proceeding.",
    isRead: false,
    suggestedAction: "Dispatch secure communication link for digital Payslip or Employment contract upload via dashboard."
  },
  {
    id: "MSG-TRX-552K",
    sender: "Super Admin",
    subject: "Transaction Monitoring: Inbound Velocity Cap",
    priority: "Medium",
    date: "2026-06-11 09:12 AM",
    customerName: "Clara Oswald",
    accountNumber: "XXXXXXXXX5510",
    loanId: "LN-2026-552K",
    type: "Transaction",
    message: "Monthly transaction volume exceeds expected profile limits. Conduct compliance review and submit findings.",
    isRead: true,
    suggestedAction: "Benchmark seasonal commercial activity against Chronotech invoices and evaluate cash-sweep pools."
  },
  {
    id: "MSG-CMP-089A",
    sender: "Super Admin",
    subject: "Compliance Review: Swift Route Verification",
    priority: "Low",
    date: "2026-06-10 03:22 PM",
    customerName: "Andrew Sterling",
    accountNumber: "XXXXXXXXX8951",
    loanId: "LN-2026-089A",
    type: "Compliance",
    message: "Semi-annual cross-border funds routing verified on 2026-06-08 requires formal regulatory sign-off. Cross-check against SWIFT telemetry.",
    isRead: true,
    suggestedAction: "Run standard SWIFT matching diagnostic and mark compliance report clean in active ledger."
  },
  {
    id: "MSG-RSK-403C",
    sender: "Super Admin",
    subject: "Active Stress Test Portfolio Risk Feedback",
    priority: "Low",
    date: "2026-06-10 01:15 PM",
    customerName: "Marcus Thorne",
    accountNumber: "XXXXXXXXX3312",
    loanId: "LN-2026-403C",
    type: "Risk",
    message: "Post-approval stress check complete. Portfolio risk profiles indicate minor volatility exposure. Monitor next three installment cycles consecutively.",
    isRead: true,
    suggestedAction: "Apply watch flag to ledger and set automated reminders for repayment schedules."
  }
];

export default function InboxTab({ balance, currentLoans, globalSearchQuery = '' }: InboxTabProps) {
  // Inbox Messages State
  const [messages, setMessages] = useState<FeedbackMessage[]>(INITIAL_FEEDBACK_MESSAGES);
  const [selectedMsgId, setSelectedMsgId] = useState<string>("MSG-LN-904D");
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical-high' | 'unread'>('all');

  // Decrypted/Unmasked account display state
  const [revealedAccounts, setRevealedAccounts] = useState<Record<string, boolean>>({});

  const toggleAccountReveal = (id: string) => {
    setRevealedAccounts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getFullAccountNumber = (masked: string) => {
    const digits = masked.replace(/[^0-9]/g, '');
    return `40928175${digits || '0000'}`;
  };

  // Intercom Direct Chat states (scoped per message to keep conversations separate/realistic)
  const [chats, setChats] = useState<Record<string, Array<{ sender: 'Super Admin' | 'Admin'; text: string; date: string }>>>({
    "MSG-LN-904D": [
      { sender: 'Super Admin', text: "Caution! Multiple high-value transfers detected on Seraphina Vance's account. This deviates from historical patterns. Please verify immediate compliance documentation.", date: '10:16 AM' }
    ],
    "MSG-BAL-089A": [
      { sender: 'Super Admin', text: "Andrew Sterling's balance of $875,000 looks highly positive but requires origin verification. Have you crossed-referenced their deposit logs?", date: '09:42 AM' }
    ],
    "MSG-LN-112B": [
      { sender: 'Super Admin', text: "Regarding Elwood Vance's proposed $95,000 capital line: the debt ratio is currently pushing 49.7%. Let's secure extra verification before committing.", date: '08:14 AM' }
    ]
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Find active message
  const activeMsg = messages.find(m => m.id === selectedMsgId) || messages[0];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selectedMsgId, isTyping]);

  // Mark message as read upon selection
  useEffect(() => {
    if (activeMsg && !activeMsg.isRead) {
      setMessages(prev => prev.map(m => m.id === activeMsg.id ? { ...m, isRead: true } : m));
    }
  }, [selectedMsgId]);

  // Handle Filtering
  const filteredMessages = messages.filter(m => {
    const activeSearch = globalSearchQuery || searchQuery;
    const matchesSearch = 
      m.subject.toLowerCase().includes(activeSearch.toLowerCase()) || 
      m.customerName.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.message.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.type.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.priority.toLowerCase().includes(activeSearch.toLowerCase()) ||
      (m.loanId && m.loanId.toLowerCase().includes(activeSearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'critical-high') {
      return m.priority === 'Critical' || m.priority === 'High';
    }
    if (activeFilter === 'unread') {
      return !m.isRead;
    }
    return true;
  });

  // Auto-select the first visible message when the filters or search changes to ensure the matching section displays
  useEffect(() => {
    if (filteredMessages.length > 0) {
      const isStillVisible = filteredMessages.some(m => m.id === selectedMsgId);
      if (!isStillVisible) {
        setSelectedMsgId(filteredMessages[0].id);
      }
    }
  }, [searchQuery, globalSearchQuery, activeFilter]);

  // Calculate unread count for badges
  const unreadCount = messages.filter(m => !m.isRead).length;

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !activeMsg) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'Admin' as const, text, date: timestamp };
    
    // Append conversation
    setChats(prev => ({
      ...prev,
      [activeMsg.id]: [...(prev[activeMsg.id] || []), userMsg]
    }));
    setInputText('');
    setIsTyping(true);

    // Super Admin simulated smart reply
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "";

      switch (activeMsg.type) {
        case 'Fraud':
          replyText = `Agreed, Admin. Place a temporary 48-hour card freeze and run visual address comparisons. Update the Fraud Detection terminal once completed.`;
          break;
        case 'Balance':
          replyText = `Copy that. Let's document their SWIFT routes. Given our Apex system shows current reserves at $${balance.toLocaleString()}, adding secured audits preserves our rating safely.`;
          break;
        case 'Loan':
          replyText = `Sensible approach. If they supply tax certifications confirming standard commercial income, we can adjust the simulated APR constraints accordingly inside the Loans Studio.`;
          break;
        case 'Credit':
          replyText = `Excellent. Apply standard APR discounts to Marcus Thorne and execute the credit buffer increase up to $200,000 inside the Credits portal.`;
          break;
        case 'KYC':
          replyText = `Understood. Do not authorize any payments or credit expansions for Elwood Vance until employment checks transition to a fully verified status.`;
          break;
        default:
          replyText = `Acknowledged. Monitor this file. Maintain standard compliance processes and log all audit steps inside our central ledger records.`;
          break;
      }

      const adminReply = { sender: 'Super Admin' as const, text: replyText, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChats(prev => ({
        ...prev,
        [activeMsg.id]: [...(prev[activeMsg.id] || []), adminReply]
      }));
    }, 1200);
  };

  // Quick Action Handlers
  const handleToggleRead = () => {
    if (!activeMsg) return;
    setMessages(prev => prev.map(m => m.id === activeMsg.id ? { ...m, isRead: !m.isRead } : m));
  };

  const handleAcknowledge = () => {
    if (!activeMsg) return;
    setMessages(prev => prev.map(m => m.id === activeMsg.id ? { ...m, priority: 'Low', subject: `[ACKNOWLEDGED] ${m.subject}` } : m));
    
    // Auto insert an acknowledgement message into chat
    const ackMsg = { 
      sender: 'Admin' as const, 
      text: "DIRECTIVE ACKNOWLEDGED: Investigative review initiated. System records and compliance parameters fully examined.", 
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setChats(prev => ({
      ...prev,
      [activeMsg.id]: [...(prev[activeMsg.id] || []), ackMsg]
    }));
  };

  // Active chat thread for the active message
  const currentChatHistory = chats[activeMsg?.id] || [
    { sender: 'Super Admin', text: `Lead compliance auditor assigned to message ${activeMsg?.id}. Please present findings regarding ${activeMsg?.customerName || 'customer'} below.`, date: '01:00 PM' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Tab Header Banner */}
      <div className="rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-800 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-purple-950">Super Admin Directives & Operations Desk</h3>
            <p className="text-xs text-purple-950/50 font-semibold">
              Actionable audit reviews, credit optimizations, risk feedbacks, and security bulletins sent directly from Super Admins.
            </p>
          </div>
        </div>

        {/* Unread Alerts Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-900 text-white font-bold text-xs shadow-md shadow-purple-950/20">
          <Bell className="w-4 h-4 text-pink-400" />
          <span>{unreadCount} Operations Pending Directives</span>
        </div>
      </div>

      {/* Main Inbox Dashboard Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: FOLDERS, SEARCH AND DIRECT MESSAGE CARDS (col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white/25 border border-white/40 p-5 backdrop-blur-xl shadow-lg space-y-4">
            
            {/* Search Input Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-purple-950/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search directives, client, Loan ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/30 border border-white/40 text-purple-950 text-xs font-bold placeholder-purple-950/30 focus:outline-none focus:ring-1 focus:ring-purple-700/30"
              />
            </div>

            {/* Quick Filter Options Tabs */}
            <div className="flex gap-1 bg-purple-950/5 p-1 rounded-2xl">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex-1 py-2 text-center rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'all' ? 'bg-purple-900 text-white shadow-sm' : 'text-purple-950/60 hover:text-purple-900'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setActiveFilter('critical-high')}
                className={`flex-1 py-2 text-center rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'critical-high' ? 'bg-purple-900 text-white shadow-sm' : 'text-purple-950/60 hover:text-purple-900'
                }`}
              >
                Priority Alert
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`flex-1 py-2 text-center rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'unread' ? 'bg-purple-900 text-white shadow-sm' : 'text-purple-950/60 hover:text-purple-900'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Scrollable Message Lists */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredMessages.map((msg) => {
                const isSelected = msg.id === selectedMsgId;
                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMsgId(msg.id)}
                    className={`w-full p-4 rounded-3xl text-left border transition-all flex flex-col gap-2 relative group cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-br from-purple-950/15 to-purple-950/5 border-purple-950/30 shadow-md' 
                        : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      {/* Priority and Read Status Badge */}
                      <div className="flex items-center gap-2">
                        {!msg.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shrink-0" />
                        )}
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                          msg.priority === 'Critical' ? 'bg-rose-500/10 text-rose-800 border-rose-500/20' :
                          msg.priority === 'High' ? 'bg-amber-500/10 text-amber-800 border-amber-500/20' :
                          msg.priority === 'Medium' ? 'bg-indigo-500/10 text-indigo-800 border-indigo-500/20' :
                          'bg-purple-500/10 text-purple-800 border-purple-500/10'
                        }`}>
                          {msg.priority}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-purple-950/45 shrink-0">
                        {msg.date.split(' ')[1] + ' ' + msg.date.split(' ')[2]}
                      </span>
                    </div>

                    {/* Sender and Subject Text */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-black text-purple-950/55 uppercase tracking-wide">
                          Super Admin
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-purple-800" />
                      </div>
                      <h4 className="font-sans font-extrabold text-xs text-purple-950 group-hover:text-purple-900 transition-colors">
                        {msg.subject}
                      </h4>
                    </div>

                    {/* Verbatim message snippet preview */}
                    <p className="text-[10px] text-purple-950/50 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    {/* Client & Account Meta details */}
                    <div className="flex justify-between items-center pt-2 border-t border-purple-950/5 text-[9px] font-semibold text-purple-950/50">
                      <span>Ref: <strong className="text-purple-950">{msg.customerName}</strong></span>
                      <div className="flex items-center gap-1 font-mono">
                        <span>{revealedAccounts[msg.id] ? getFullAccountNumber(msg.accountNumber) : msg.accountNumber}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAccountReveal(msg.id);
                          }}
                          className="hover:text-purple-900 text-purple-950/40 hover:scale-105 active:scale-95 transition-all p-0.5 cursor-pointer flex items-center justify-center shrink-0"
                          title="Toggle Account ID Decryption"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-900 group-hover:translate-x-0.5 transition-transform hidden md:block">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}

              {filteredMessages.length === 0 && (
                <div className="p-12 text-center text-xs text-purple-950/40 font-semibold bg-white/5 rounded-2xl">
                  No direct operational files selected or match filter.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: ACTION DETAILS AND RESPONSE SYSTEM (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Directive Detail Auditing Card */}
          <AnimatePresence mode="wait">
            {activeMsg && (
              <motion.div
                key={activeMsg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg space-y-5"
              >
                
                {/* Subject, Directive ID, Date */}
                <div className="flex justify-between items-start border-b border-purple-950/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-widest font-bold text-purple-950/40 block">Bank Audit Command File</span>
                    <h3 className="font-display font-black text-sm md:text-base text-purple-950 leading-snug">
                      {activeMsg.subject}
                    </h3>
                  </div>
                  <span className="font-mono text-[9px] font-black bg-purple-950/5 border border-purple-950/10 text-purple-950 px-3 py-1.5 rounded-xl">
                    {activeMsg.id}
                  </span>
                </div>

                {/* Grid of parameters: Sender, Customer Name, Masked Account, Loan ID, Priority, Date */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  
                  <div className="p-2.5 bg-white/15 border border-white/25 rounded-2xl text-xs">
                    <span className="block text-[8px] text-purple-950/40 uppercase font-bold tracking-wider">Originating Authority</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-purple-900" />
                      <span className="font-black text-purple-950">{activeMsg.sender}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white/15 border border-white/25 rounded-2xl text-xs">
                    <span className="block text-[8px] text-purple-950/40 uppercase font-bold tracking-wider">Client Name Reference</span>
                    <span className="font-black text-purple-950 mt-1 block truncate" title={activeMsg.customerName}>
                      {activeMsg.customerName}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white/15 border border-white/25 rounded-2xl text-xs">
                    <span className="block text-[8px] text-purple-950/40 uppercase font-bold tracking-wider">Muted Account ID</span>
                    <div className="flex items-center justify-between mt-1 gap-1">
                      <span className="font-mono font-black text-purple-950 truncate">
                        {revealedAccounts[activeMsg.id] ? getFullAccountNumber(activeMsg.accountNumber) : activeMsg.accountNumber}
                      </span>
                      <button
                        onClick={() => toggleAccountReveal(activeMsg.id)}
                        className="hover:text-purple-900 text-purple-950/40 hover:scale-105 active:scale-95 transition-all p-0.5 cursor-pointer flex items-center justify-center shrink-0"
                        title="Toggle Account ID Decryption"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white/15 border border-white/25 rounded-2xl text-xs">
                    <span className="block text-[8px] text-purple-950/40 uppercase font-bold tracking-wider">Assoc. Loan File</span>
                    <span className="font-mono font-black text-purple-950 mt-1 block">
                      {activeMsg.loanId || "N/A - Non Loan file"}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white/15 border border-white/25 rounded-2xl text-xs">
                    <span className="block text-[8px] text-purple-950/40 uppercase font-bold tracking-wider">Directive Priority</span>
                    <span className={`text-[10px] font-black uppercase mt-1 block truncate ${
                      activeMsg.priority === 'Critical' ? 'text-rose-700' :
                      activeMsg.priority === 'High' ? 'text-amber-700' :
                      activeMsg.priority === 'Medium' ? 'text-indigo-850' : 'text-purple-900'
                    }`}>
                      {activeMsg.priority}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white/15 border border-white/25 rounded-2xl text-xs">
                    <span className="block text-[8px] text-purple-950/40 uppercase font-bold tracking-wider">Dispatch Time Stamp</span>
                    <span className="font-black text-purple-950 mt-1 block">
                      {activeMsg.date}
                    </span>
                  </div>

                </div>

                {/* Super Admin Verbatim Directive Content Text Bubble */}
                <div className="p-4 bg-purple-950/5 border border-purple-950/15 rounded-3xl relative overflow-hidden">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-purple-950/40 block mb-1">Official Directive Statement</span>
                  <p className="text-xs text-purple-950 font-medium leading-relaxed italic">
                    "{activeMsg.message}"
                  </p>
                  <div className="mt-3.5 pt-3 border-t border-purple-950/5 flex items-start gap-1.5 text-[10px] text-purple-900 font-bold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-purple-800" />
                    <span>Super Admin Guideline: {activeMsg.suggestedAction}</span>
                  </div>
                </div>

                {/* Admin Quick Audit Directives Actions Row */}
                <div className="flex flex-wrap gap-2.5 pt-1 border-t border-purple-950/5">
                  <button
                    onClick={handleToggleRead}
                    className="px-4 py-2.5 rounded-xl bg-white/40 hover:bg-white/60 border border-white/50 text-purple-950 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {activeMsg.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                    <span>{activeMsg.isRead ? "Mark Unread" : "Mark Read"}</span>
                  </button>

                  <button
                    onClick={handleAcknowledge}
                    className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-950/10"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Acknowledge Command</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* SUPER ADMIN INTERCOM / INTERACTIVE CORRESPONDENCE DESK */}
          <div className="rounded-3xl bg-white/25 border border-white/40 p-5 backdrop-blur-xl shadow-lg flex flex-col h-[400px]">
            
            {/* Header section with live signal */}
            <div className="flex items-center gap-2 pb-3 border-b border-purple-950/5 mb-4">
              <div className="w-7.5 h-7.5 rounded-lg bg-pink-500/10 text-pink-700 flex items-center justify-center font-black">
                <Cpu className="w-4 h-4 text-purple-800 animate-spin-slow" />
              </div>
              <div>
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wide">Direct Operations Intercom Chat</h4>
                <p className="text-[9px] text-purple-950/45 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Super Admin Authorized Bridge Connected
                </p>
              </div>
            </div>

            {/* Chat Body Scroll Frame */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin scrollbar-thumb-purple-950/10">
              {currentChatHistory.map((c, i) => {
                const isSuper = c.sender === 'Super Admin';
                return (
                  <div key={i} className={`flex ${isSuper ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-xs ${
                      isSuper 
                        ? 'bg-white/80 border border-white/50 text-purple-950 rounded-tl-sm' 
                        : 'bg-purple-900 border border-purple-800 text-white rounded-tr-sm'
                    }`}>
                      <span className={`block text-[8px] font-black uppercase tracking-wider mb-1 ${isSuper ? 'text-purple-700/60' : 'text-white/50'}`}>
                        {c.sender}
                      </span>
                      <p>{c.text}</p>
                      <span className={`text-[8px] font-bold block text-right mt-1 ${isSuper ? 'text-purple-950/30' : 'text-white/30'}`}>
                        {c.date}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/80 border border-white/50 rounded-2xl rounded-tl-sm px-4 py-2.5 text-xs flex items-center gap-1 text-purple-950/50">
                    <span className="w-1.5 h-1.5 bg-purple-950/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-950/40 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-purple-950/40 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Message input sending box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-2 pt-3 border-t border-purple-950/5 mt-3"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Formulate reply to Super Admin regarding ${activeMsg?.customerName || 'case'}...`}
                className="flex-1 px-4 py-2.5 bg-purple-950/5 border border-purple-950/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-700/25 font-sans text-xs font-semibold"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-purple-900 hover:bg-purple-950 text-white rounded-xl flex items-center justify-center shadow-md shadow-purple-950/10 transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
