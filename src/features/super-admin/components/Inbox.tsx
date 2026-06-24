import React, { useState, useMemo } from 'react';
import { 
  Inbox as InboxIcon, 
  Send, 
  Check, 
  X, 
  FileText, 
  Calendar, 
  Archive, 
  Folder, 
  User, 
  MessageSquare, 
  AlertCircle,
  Clock,
  PlusCircle,
  CheckCircle,
  HelpCircle,
  Bookmark,
  Bell,
  ArrowRight,
  Paperclip,
  Download,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface InboxMessage {
  id: string;
  senderName: string;
  employeeId: string;
  branchName: string;
  timestamp: string;
  subject: string;
  content: string;
  type: 'Leave Request' | 'Announcement' | 'System Message' | 'Support Notification';
  leaveType?: 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Sabbatical' | 'Other';
  leaveDuration?: string;
  startDate?: string;
  endDate?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'More Info Requested';
  read: boolean;
  archived: boolean;
  priority?: 'High' | 'Medium' | 'Low';
  supportingDocuments?: Array<{
    name: string;
    size: string;
    type: string;
  }>;
  replies?: Array<{
    sender: string;
    message: string;
    timestamp: string;
  }>;
}

interface InboxProps {
  messages: InboxMessage[];
  setMessages: React.Dispatch<React.SetStateAction<InboxMessage[]>>;
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
  employees: any[];
  branches: any[];
}

export default function Inbox({
  messages,
  setMessages,
  addAuditLog,
  employees,
  branches
}: InboxProps) {
  // Folder keys
  type FolderType = 'All' | 'Leave Requests' | 'Pending Approvals' | 'System Notifications' | 'Announcements' | 'Archived';
  const [activeFolder, setActiveFolder] = useState<FolderType>('All');
  
  // Search and Filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  
  // Custom interactive simulator mode state: "view-inbox" or "simulator"
  const [activeMode, setActiveMode] = useState<'view-inbox' | 'simulator'>('view-inbox');

  // Simulator Form State
  const [simEmployeeId, setSimEmployeeId] = useState(employees[0]?.id || 'EMP-108');
  const [simLeaveType, setSimLeaveType] = useState<'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Sabbatical' | 'Other'>('Casual Leave');
  const [simStartDate, setSimStartDate] = useState('25 June 2026');
  const [simEndDate, setSimEndDate] = useState('27 June 2026');
  const [simDuration, setSimDuration] = useState('3 days');
  const [simMessage, setSimMessage] = useState('I would like to apply for 3 days of Casual Leave from 25 June 2026 to 27 June 2026 due to personal reasons.');
  const [simSubject, setSimSubject] = useState('Leave Application Request');
  const [simBranchName, setSimBranchName] = useState('Hyderabad Main Branch');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Request Info feedback prompt state
  const [infoRequestText, setInfoRequestText] = useState('');
  const [showInfoForm, setShowInfoForm] = useState(false);

  // Helper metadata logic
  const summaryMetrics = useMemo(() => {
    return {
      total: messages.length,
      pending: messages.filter(m => m.type === 'Leave Request' && m.status === 'Pending').length,
      approved: messages.filter(m => m.status === 'Approved').length,
      rejected: messages.filter(m => m.status === 'Rejected').length
    };
  }, [messages]);

  // Handle auto-selecting first item when folder filters change
  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      // 1. Check folder matching
      let folderMatch = false;
      if (activeFolder === 'Archived') {
        folderMatch = m.archived;
      } else {
        if (m.archived) return false; // Do not show archived messages in standard folders
        
        switch (activeFolder) {
          case 'Leave Requests':
            folderMatch = m.type === 'Leave Request';
            break;
          case 'Pending Approvals':
            folderMatch = m.type === 'Leave Request' && m.status === 'Pending';
            break;
          case 'System Notifications':
            folderMatch = m.type === 'System Message' || m.type === 'Support Notification';
            break;
          case 'Announcements':
            folderMatch = m.type === 'Announcement';
            break;
          case 'All':
          default:
            folderMatch = true;
            break;
        }
      }

      // 2. Check Search query
      const searchMatch = searchQuery.trim() === '' || 
        m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase());

      // 3. Priority filter level
      const priorityMatch = priorityFilter === 'All' || m.priority === priorityFilter;

      return folderMatch && searchMatch && priorityMatch;
    });
  }, [messages, activeFolder, searchQuery, priorityFilter]);

  // Selected Message track
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(() => {
    return filteredMessages[0]?.id || messages[0]?.id || null;
  });

  const selectedMessage = useMemo(() => {
    // If selected message ID is valid, return it.
    const found = messages.find(m => m.id === selectedMessageId);
    if (found) return found;
    // Fallback to first available on the filtered list
    return filteredMessages[0] || null;
  }, [messages, selectedMessageId, filteredMessages]);

  const handleSelectMessage = (id: string) => {
    setSelectedMessageId(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    setShowInfoForm(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Leave Actions (Super Admin only)
  const handleApproveLeave = (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return {
          ...m,
          status: 'Approved',
          replies: [
            ...(m.replies || []),
            {
              sender: 'Super Admin Action',
              message: 'Your leave application has been APPROVED in the sovereign operational ledger.',
              timestamp: new Date().toLocaleString()
            }
          ]
        };
      }
      return m;
    }));

    addAuditLog(`Leave Application Approved: ${msg.senderName} (${msg.employeeId}) leave verified by Super Admin`, 'Info');
    showToast(`Approved leave request for ${msg.senderName} successfully.`);
  };

  const handleRejectLeave = (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return {
          ...m,
          status: 'Rejected',
          replies: [
            ...(m.replies || []),
            {
              sender: 'Super Admin Action',
              message: 'Your leave application was REJECTED due to heavy compliance backlogs in this cycle.',
              timestamp: new Date().toLocaleString()
            }
          ]
        };
      }
      return m;
    }));

    addAuditLog(`Leave Application Rejected: Approved quota limits breached. ${msg.senderName} notified of denial`, 'Warning');
    showToast(`Rejected leave request for ${msg.senderName}.`);
  };

  const handleRequestMoreInfo = (msgId: string) => {
    if (!infoRequestText.trim()) return;
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return {
          ...m,
          status: 'More Info Requested',
          replies: [
            ...(m.replies || []),
            {
              sender: 'Super Admin (Request For Information)',
              message: infoRequestText,
              timestamp: new Date().toLocaleString()
            }
          ]
        };
      }
      return m;
    }));

    addAuditLog(`Information Audit flag raised for ${msg.senderName}'s dossier: ${infoRequestText}`, 'Info');
    showToast(`Information request sent to ${msg.senderName} successfully.`);
    setInfoRequestText('');
    setShowInfoForm(false);
  };

  const handleToggleArchive = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, archived: !m.archived } : m));
    showToast(`Archived status updated successfully.`);
  };

  // Switch folder helper that auto-sets selected index
  const selectFolder = (folder: FolderType) => {
    setActiveFolder(folder);
    const matched = messages.filter(m => {
      if (folder === 'Archived') return m.archived;
      if (m.archived) return false;
      switch (folder) {
        case 'Leave Requests': return m.type === 'Leave Request';
        case 'Pending Approvals': return m.type === 'Leave Request' && m.status === 'Pending';
        case 'System Notifications': return m.type === 'System Message' || m.type === 'Support Notification';
        case 'Announcements': return m.type === 'Announcement';
        case 'All':
        default: return true;
      }
    });
    if (matched.length > 0) {
      setSelectedMessageId(matched[0].id);
    } else {
      setSelectedMessageId(null);
    }
  };

  // Simulator submit
  const handleSubmitSimLeave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const matchedEmployee = employees.find(emp => emp.id === simEmployeeId);
    const senderName = matchedEmployee ? matchedEmployee.name : 'Branch Admin';
    const finalSubject = `${simLeaveType} Application Request`;

    const newMsg: InboxMessage = {
      id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      senderName,
      employeeId: simEmployeeId,
      branchName: simBranchName,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      subject: finalSubject,
      content: simMessage,
      type: 'Leave Request',
      leaveType: simLeaveType,
      leaveDuration: `${simDuration} (${simStartDate} to ${simEndDate})`,
      startDate: simStartDate,
      endDate: simEndDate,
      status: 'Pending',
      read: false,
      archived: false,
      priority: Math.random() > 0.4 ? 'High' : 'Medium',
      supportingDocuments: [
        { name: `${simLeaveType.replace(' ', '_')}_Verification_Dossier.pdf`, size: '2.4 MB', type: 'PDF' },
        { name: 'Branch_Compliance_Handovers.doc', size: '840 KB', type: 'DOC' }
      ],
      replies: []
    };

    setMessages(prev => [newMsg, ...prev]);
    setSelectedMessageId(newMsg.id);
    addAuditLog(`New Live Leave Request submitted: Admin ${senderName} (ID: ${simEmployeeId}) applied for ${simLeaveType}`, 'Info');
    
    showToast(`Leave application submitted successfully! Switched to Pending Approvals queue.`);
    setActiveMode('view-inbox');
    selectFolder('Pending Approvals');
  };

  return (
    <div className="space-y-6 w-full text-left" id="apex-inbox-root">
      
      {/* Toast Popup alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 px-6 py-3.5 rounded-2xl shadow-xl text-xs font-bold border flex items-center gap-3 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(252, 231, 243, 0.95)', borderColor: '#F9A8D4', color: '#4A044E' }}
          >
            <CheckCircle size={16} className="text-[#EC4899]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Banner Area */}
      <div 
        style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}
        className="p-6 rounded-2xl border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#EC4899] text-white rounded-lg">
              <InboxIcon size={18} />
            </span>
            <h1 className="text-xl font-black tracking-tight" style={{ color: '#4A044E' }}>
              Inbox Feed
            </h1>
          </div>
          <p className="text-xs font-medium" style={{ color: '#831843' }}>
            Manage leave requests, administrative communications, notifications, and approval workflows.
          </p>
        </div>

        {/* Action Toggle buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveMode('view-inbox')}
            className={`px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
              activeMode === 'view-inbox'
                ? 'bg-[#EC4899] text-white shadow-md'
                : 'bg-[#FBCFE8]/60 border border-[#F9A8D4] text-[#4A044E] hover:bg-[#FBCFE8]'
            }`}
          >
            Super Admin View
          </button>
          
          <button
            onClick={() => setActiveMode('simulator')}
            className={`px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'simulator'
                ? 'bg-[#4A044E] text-white shadow-md'
                : 'bg-[#FBCFE8]/60 border border-[#F9A8D4] text-[#4A044E] hover:bg-[#FBCFE8]'
            }`}
          >
            <PlusCircle size={12} />
            <span>Leave Request Simulator</span>
          </button>
        </div>
      </div>

      {activeMode === 'view-inbox' ? (
        <>
          {/* Summary Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* CARD 1 */}
            <div 
              style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}
              className="p-4 rounded-2xl border shadow-sm space-y-2 relative overflow-hidden"
            >
              <div className="absolute right-3 top-3 opacity-15" style={{ color: '#EC4899' }}>
                <Layers size={36} />
              </div>
              <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase opacity-80 block" style={{ color: '#831843' }}>
                Total Messages
              </span>
              <p className="text-2xl font-black" style={{ color: '#4A044E' }}>
                {summaryMetrics.total}
              </p>
              <div className="text-[9px] font-semibold opacity-75" style={{ color: '#831843' }}>
                All corporate correspondence
              </div>
            </div>

            {/* CARD 2 */}
            <div 
              style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}
              className="p-4 rounded-2xl border shadow-sm space-y-2 relative overflow-hidden"
            >
              <div className="absolute right-3 top-3 opacity-15" style={{ color: '#EC4899' }}>
                <Clock size={36} />
              </div>
              <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase opacity-80 block" style={{ color: '#831843' }}>
                Pending Requests
              </span>
              <p className="text-2xl font-black text-amber-700">
                {summaryMetrics.pending}
              </p>
              <div className="text-[9px] font-semibold opacity-75" style={{ color: '#831843' }}>
                Awaiting clearance approvals
              </div>
            </div>

            {/* CARD 3 */}
            <div 
              style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}
              className="p-4 rounded-2xl border shadow-sm space-y-2 relative overflow-hidden"
            >
              <div className="absolute right-3 top-3 opacity-15 animate-pulse" style={{ color: '#EC4899' }}>
                <CheckCircle size={36} />
              </div>
              <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase opacity-80 block" style={{ color: '#831843' }}>
                Approved Cycle
              </span>
              <p className="text-2xl font-black text-emerald-700">
                {summaryMetrics.approved}
              </p>
              <div className="text-[9px] font-semibold opacity-75" style={{ color: '#831843' }}>
                Authorizations recorded
              </div>
            </div>

            {/* CARD 4 */}
            <div 
              style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}
              className="p-4 rounded-2xl border shadow-sm space-y-2 relative overflow-hidden"
            >
              <div className="absolute right-3 top-3 opacity-15" style={{ color: '#EC4899' }}>
                <X size={36} />
              </div>
              <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase opacity-80 block" style={{ color: '#831843' }}>
                Rejected Today
              </span>
              <p className="text-2xl font-black text-rose-700">
                {summaryMetrics.rejected}
              </p>
              <div className="text-[9px] font-semibold opacity-75" style={{ color: '#831843' }}>
                Breached quota denials
              </div>
            </div>

          </div>

          {/* Core Large 3-Column Outlook Workspace */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 w-full items-stretch">
            
            {/* COLUMN 1: Left Inbox Navigation Panel (Width / Span: col-span-3) */}
            <div 
              style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}
              className="xl:col-span-3 p-4 rounded-2xl border shadow-md flex flex-col space-y-4"
            >
              {/* Filter Search Input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border rounded-xl outline-none font-medium text-purple-950 transition-all focus:border-pink-500"
                  style={{ borderColor: '#F9A8D4' }}
                />
              </div>

              {/* Priority Filter dropdown */}
              <div>
                <label className="text-[9px] font-mono tracking-wider font-extrabold uppercase opacity-85 block mb-1 text-[#831843]">
                  Priority Filter
                </label>
                <div className="relative">
                  <Filter size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="w-full text-xs font-bold pl-8 pr-3 py-1.5 bg-white border rounded-xl outline-none appearance-none cursor-pointer text-[#4A044E]"
                    style={{ borderColor: '#F9A8D4' }}
                  >
                    <option value="All">All Levels</option>
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Navigation Folder items list */}
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] uppercase tracking-widest font-black block mb-2" style={{ color: '#EC4899' }}>
                  Compliance Directory
                </span>

                {([
                  { key: 'All', label: 'All Messages', icon: InboxIcon },
                  { key: 'Leave Requests', label: 'Leave Requests', icon: Calendar },
                  { key: 'Pending Approvals', label: 'Pending Approvals', icon: Clock },
                  { key: 'System Notifications', label: 'System Notifications', icon: AlertCircle },
                  { key: 'Announcements', label: 'Announcements', icon: Bell },
                  { key: 'Archived', label: 'Archived Messages', icon: Archive }
                ] as const).map(item => {
                  const isSelected = activeFolder === item.key;
                  // Compute count depending on item rule
                  const badgeCount = messages.filter(m => {
                    if (item.key === 'Archived') return m.archived;
                    if (m.archived) return false;
                    if (item.key === 'Leave Requests') return m.type === 'Leave Request';
                    if (item.key === 'Pending Approvals') return m.type === 'Leave Request' && m.status === 'Pending';
                    if (item.key === 'System Notifications') return m.type === 'System Message' || m.type === 'Support Notification';
                    if (item.key === 'Announcements') return m.type === 'Announcement';
                    return !m.read; // Count unread for 'All'
                  }).length;

                  return (
                    <button
                      key={item.key}
                      onClick={() => selectFolder(item.key)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#EC4899] text-white shadow-md scale-[1.01]'
                          : 'text-[#4A044E] bg-white/40 hover:bg-[#FBCFE8] border border-transparent hover:border-[#F9A8D4]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon size={13} className={isSelected ? 'text-white' : 'text-[#EC4899]'} />
                        <span>{item.label}</span>
                      </div>
                      {badgeCount > 0 && (
                        <span 
                          style={{
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#FCE7F3',
                            color: isSelected ? '#FFFFFF' : '#EC4899'
                          }}
                          className="px-2 py-0.5 text-[9px] font-black font-mono rounded"
                        >
                          {badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Secure compliance notice */}
              <div 
                style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4' }} 
                className="p-3 border rounded-xl text-[10px] space-y-1 font-mono text-left"
              >
                <div className="flex items-center gap-1.5 font-bold" style={{ color: '#4A044E' }}>
                  <ShieldCheck size={12} className="text-[#EC4899]" />
                  <span>ISO Audit Verified</span>
                </div>
                <p style={{ color: '#831843' }} className="text-[9.5px] leading-tight opacity-90">
                  Operations authorization keys bind digitally to compliance officer token protocols.
                </p>
              </div>

            </div>

            {/* COLUMN 2: Middle Message Cards List Panel (Width / Span: col-span-4) */}
            <div 
              style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}
              className="xl:col-span-4 p-4 rounded-2xl border shadow-md flex flex-col h-[650px]"
            >
              <div className="mb-3 flex justify-between items-center text-left">
                <span className="text-[10px] uppercase tracking-widest font-black leading-none block" style={{ color: '#EC4899' }}>
                  {activeFolder} Queue ({filteredMessages.length})
                </span>
                <span className="text-[9px] font-mono font-bold" style={{ color: '#831843' }}>
                  Live Connection Verified
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 h-0 scrollbar-none pr-1">
                {filteredMessages.length === 0 ? (
                  <div className="py-24 text-center text-xs space-y-3" style={{ color: '#831843' }}>
                    <div className="w-12 h-12 bg-[#FBCFE8] rounded-full flex items-center justify-center mx-auto">
                      <InboxIcon size={20} className="opacity-60 text-[#EC4899]" />
                    </div>
                    <p className="font-bold">No correspondence fits this filter.</p>
                    <p className="text-[10px] opacity-80 max-w-[200px] mx-auto">
                      Adjust your search query or trigger the Leave Request Simulator above.
                    </p>
                  </div>
                ) : (
                  filteredMessages.map(m => {
                    const isSelected = m.id === selectedMessageId;

                    // Compute priority badge styling
                    const level = m.priority || (m.type === 'Leave Request' ? 'High' : 'Medium');
                    let priorityBadgeColor = 'bg-stone-100 text-stone-700';
                    if (level === 'High') priorityBadgeColor = 'bg-rose-100 text-rose-850 border border-rose-200';
                    else if (level === 'Medium') priorityBadgeColor = 'bg-amber-100 text-amber-850 border border-amber-200';
                    else priorityBadgeColor = 'bg-emerald-100 text-emerald-850 border border-emerald-250';

                    // Read status style
                    const unreadStyle = !m.read ? 'border-l-4 border-l-[#EC4899]' : '';

                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMessage(m.id)}
                        className={`p-3.5 border rounded-xl transition-all duration-200 cursor-pointer relative text-left select-none ${unreadStyle} ${
                          isSelected 
                            ? 'border-[#EC4899] shadow-md bg-white' 
                            : 'border-[#F9A8D4]/50 bg-white/60 hover:bg-[#FBCFE8]/50 hover:shadow-sm'
                        }`}
                      >
                        {/* Circle unread ping */}
                        {!m.read && (
                          <span className="absolute top-3.5 right-3.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC4899] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EC4899]"></span>
                          </span>
                        )}

                        <div className="flex justify-between items-start gap-2 max-w-[90%]">
                          <span className="text-[11.5px] font-black tracking-tight block text-[#4A044E]">
                            {m.senderName}
                          </span>
                          <span className="text-[8.5px] font-mono font-bold opacity-80" style={{ color: '#831843' }}>
                            {m.timestamp.slice(5, 16)}
                          </span>
                        </div>

                        <span className="text-[9.5px] font-mono leading-none font-bold mt-1 block" style={{ color: '#831843' }}>
                          {m.branchName}
                        </span>

                        <div className="text-xs font-black tracking-tight mt-2 truncate" style={{ color: '#4A044E' }}>
                          {m.subject}
                        </div>

                        <p className="text-[11px] line-clamp-2 mt-1 leading-snug font-medium text-slate-600">
                          {m.content}
                        </p>

                        {/* Badges footer section */}
                        <div className="flex items-center justify-between gap-1 mt-3 pt-2.5 border-t border-purple-100">
                          <span className={`text-[8.5px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${priorityBadgeColor}`}>
                            {level}
                          </span>
                          
                          {m.type === 'Leave Request' && (
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                              m.status === 'Approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                              m.status === 'Rejected' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                              m.status === 'More Info Requested' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                              'bg-purple-50 border-purple-200 text-purple-800 font-extrabold'
                            }`}>
                              {m.status}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN 3: Right Detailed Message Review Center (Width / Span: col-span-5) */}
            <div 
              style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}
              className="xl:col-span-5 p-5 rounded-2xl border shadow-md flex flex-col h-[650px] overflow-hidden"
            >
              {selectedMessage ? (
                <div className="flex flex-col h-full overflow-hidden text-left">
                  
                  {/* Subject Head display */}
                  <div className="relative border-b pb-4 mb-4" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                    <div className="flex items-center gap-3">
                      {/* Avatar initial or profile */}
                      <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 bg-[#EC4899] text-white shadow-md font-black text-sm" style={{ borderColor: '#F9A8D4' }}>
                        {selectedMessage.senderName.slice(0, 2).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-mono border px-2 py-0.5 rounded font-extrabold uppercase tracking-wider bg-white text-[#EC4899] border-[#F9A8D4] inline-block">
                          {selectedMessage.type}
                        </span>
                        
                        <h2 className="text-sm font-black tracking-tight text-[#4A044E] truncate mt-1">
                          {selectedMessage.senderName}
                        </h2>
                        
                        <p className="text-[10px] font-mono text-purple-900 mt-0.5 font-bold">
                          Employee Ref ID: <span className="font-extrabold text-[#EC4899]">{selectedMessage.employeeId}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[9.5px] font-mono font-black italic block" style={{ color: '#831843' }}>
                          {selectedMessage.timestamp}
                        </span>
                        <button
                          onClick={() => handleToggleArchive(selectedMessage.id)}
                          className="mt-1.5 p-1 px-2 rounded-lg border text-[9px] font-black uppercase cursor-pointer flex items-center gap-1 transition-all bg-white hover:bg-stone-50"
                          style={{ borderColor: '#F9A8D4', color: '#4A044E' }}
                        >
                          <Archive size={10} className="text-[#EC4899]" />
                          <span>{selectedMessage.archived ? 'Archived' : 'Archive File'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Core detail panels scroll region */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none h-0">
                    
                    {/* Subject Line narrative */}
                    <div className="bg-white/85 border border-[#F9A8D4]/30 rounded-xl p-3 shadow-sm">
                      <span className="text-[9px] font-mono tracking-wider font-extrabold uppercase block" style={{ color: '#EC4899' }}>
                        Document Subject
                      </span>
                      <h3 className="text-xs font-black tracking-tight text-[#4A044E] mt-1 leading-snug">
                        {selectedMessage.subject}
                      </h3>
                    </div>

                    {/* Leave details panel (Visible only for leave request forms) */}
                    {selectedMessage.type === 'Leave Request' && (
                      <div className="bg-white/95 border rounded-2xl p-4 shadow-sm space-y-3">
                        <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase block" style={{ color: '#EC4899' }}>
                          Primary Leave Ledger Entry
                        </span>

                        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                          
                          <div className="p-2.5 bg-pink-50/45 rounded-xl border border-pink-100">
                            <span className="block text-[8.5px] uppercase font-bold text-pink-600">Category Type</span>
                            <span className="text-[11.5px] font-black text-[#4A044E] mt-0.5 block">
                              {selectedMessage.leaveType || 'Casual Leave'}
                            </span>
                          </div>

                          <div className="p-2.5 bg-pink-50/45 rounded-xl border border-pink-100">
                            <span className="block text-[8.5px] uppercase font-bold text-pink-600">Duration Period</span>
                            <span className="text-[11px] font-black text-rose-700 mt-0.5 block">
                              {selectedMessage.leaveDuration || '3 Days'}
                            </span>
                          </div>

                          <div className="p-2.5 bg-pink-50/45 rounded-xl border border-pink-100 col-span-2">
                            <span className="block text-[8.5px] uppercase font-bold text-pink-600 text-left">Location / Branch Center</span>
                            <span className="text-[11.5px] font-bold text-[#4A044E] mt-0.5 block text-left">
                              {selectedMessage.branchName}
                            </span>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* Statement Details panel */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase block" style={{ color: '#EC4899' }}>
                        Message Narration Content
                      </span>
                      <div className="p-4 bg-white border border-[#F9A8D4]/20 rounded-2xl text-[12px] leading-relaxed shadow-sm font-medium text-slate-800">
                        "{selectedMessage.content}"
                      </div>
                    </div>

                    {/* Supporting verification documents (Enterprise look) */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase block" style={{ color: '#EC4899' }}>
                        Simulated Backing Records ({selectedMessage.supportingDocuments?.length || 2} Files attached)
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(selectedMessage.supportingDocuments || [
                          { name: `${(selectedMessage.leaveType || 'Absence').replace(' ', '_')}_Verification_Dossier.pdf`, size: '2.4 MB', type: 'PDF' },
                          { name: 'Branch_Regional_Handover_Log.xlsx', size: '1.2 MB', type: 'XLSX' }
                        ]).map((doc, i) => (
                          <div 
                            key={i} 
                            className="p-2 bg-white/70 hover:bg-white border rounded-xl flex items-center justify-between transition-all shadow-xs"
                            style={{ borderColor: '#F9A8D4' }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="p-1.5 bg-pink-100 text-[#EC4899] rounded-lg">
                                {doc.name.includes('xlsx') ? <FileSpreadsheet size={13} /> : <FileText size={13} />}
                              </span>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-[#4A044E] truncate">
                                  {doc.name}
                                </p>
                                <p className="text-[8.5px] font-mono text-pink-700 font-semibold leading-none">
                                  {doc.size}
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => showToast(`Downloaded simulated file: ${doc.name}`)}
                              className="text-pink-600 hover:text-black p-1 shrink-0 transition-colors cursor-pointer"
                              title="Download document scan"
                            >
                              <Download size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Historical compliance thread replies history */}
                    {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-widest font-black block" style={{ color: '#EC4899' }}>
                          Compliance Action Log Thread
                        </span>
                        
                        <div className="space-y-2">
                          {selectedMessage.replies.map((rep, idx) => (
                            <div 
                              key={idx}
                              className="p-3 border rounded-xl bg-white shadow-xs text-xs space-y-1.5"
                              style={{ borderColor: '#F9A8D4' }}
                            >
                              <div className="flex justify-between items-center text-[8.5px] font-mono font-bold">
                                <span className="text-[#4A044E]">{rep.sender}</span>
                                <span className="opacity-75">{rep.timestamp.slice(0, 16)}</span>
                              </div>
                              <p className="font-medium text-slate-700 leading-snug">
                                {rep.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* BOTTOM ACTION SECTION (Horizontally Aligned, Large, Clearly Visible) */}
                  <div className="border-t pt-4 space-y-3 mt-auto" style={{ borderColor: 'rgba(74, 4, 78, 0.15)' }}>
                    
                    {selectedMessage.type === 'Leave Request' ? (
                      <>
                        {/* Status Label flag */}
                        <div className="flex justify-between items-center font-mono">
                          <span className="text-[10px] font-black uppercase tracking-wider block" style={{ color: '#4A044E' }}>
                            Supervising Operations Officer Appraisal Box
                          </span>
                          <span className="text-[9.5px] font-bold">
                            Current Verdict State: <span className="font-extrabold uppercase px-1.5 py-0.5 rounded text-[8.5px] bg-white border border-[#F9A8D4]" style={{ color: '#4A044E' }}>{selectedMessage.status}</span>
                          </span>
                        </div>

                        {/* Flat horizontal buttons block */}
                        <div className="grid grid-cols-3 gap-2 w-full">
                          
                          {/* Approve leave button */}
                          <button
                            onClick={() => handleApproveLeave(selectedMessage.id)}
                            disabled={selectedMessage.status === 'Approved'}
                            className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-200 cursor-pointer active:scale-95 border ${
                              selectedMessage.status === 'Approved'
                                ? 'bg-[#F3F4F6] text-stone-400 border-stone-200 cursor-not-allowed opacity-50'
                                : 'bg-[#10B981] hover:bg-[#059669] border-[#047857] text-white shadow-md font-extrabold'
                            }`}
                          >
                            <Check size={12} className="shrink-0" />
                            <span>Approve Leave</span>
                          </button>

                          {/* Reject leave button */}
                          <button
                            onClick={() => handleRejectLeave(selectedMessage.id)}
                            disabled={selectedMessage.status === 'Rejected'}
                            className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-200 cursor-pointer active:scale-95 border ${
                              selectedMessage.status === 'Rejected'
                                ? 'bg-[#F3F4F6] text-stone-400 border-stone-200 cursor-not-allowed opacity-50'
                                : 'bg-[#EF4444] hover:bg-[#DC2626] border-[#B91C1C] text-white shadow-md font-extrabold'
                            }`}
                          >
                            <X size={12} className="shrink-0" />
                            <span>Reject Leave</span>
                          </button>

                          {/* Request Information toggle */}
                          <button
                            onClick={() => {
                              setShowInfoForm(!showInfoForm);
                              setInfoRequestText('');
                            }}
                            className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-200 cursor-pointer active:scale-95 border bg-white hover:bg-[#FCE7F3] border-[#F9A8D4] text-[#4A044E] shadow-sm font-extrabold"
                          >
                            <Clock size={12} className="text-[#EC4899] shrink-0" />
                            <span>Request Info</span>
                          </button>

                        </div>

                        {/* Information text-input area */}
                        {showInfoForm && (
                          <div className="p-3 border rounded-xl space-y-2 text-left bg-white/95" style={{ borderColor: '#F9A8D4' }}>
                            <span className="text-[9.5px] font-extrabold block text-purple-950">Describe the info request:</span>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="e.g. Scan image copy of medical practitioner receipt sheet scan..."
                                value={infoRequestText}
                                onChange={(e) => setInfoRequestText(e.target.value)}
                                className="flex-1 text-[11px] bg-white border border-[#F9A8D4] rounded-lg p-2 outline-none font-medium text-pink-900"
                              />
                              <button
                                onClick={() => handleRequestMoreInfo(selectedMessage.id)}
                                className="px-3 bg-[#4A044E] hover:bg-black text-[10.5px] font-bold text-white rounded-lg transition-colors cursor-pointer"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-3 bg-white/70 border border-[#F9A8D4]/30 rounded-xl text-xs italic font-medium text-purple-900 text-center">
                        Selected entry is an informational communication or notice. Archive if acknowledged.
                      </div>
                    )}

                  </div>

                </div>
              ) : (
                <div className="my-auto py-16 text-center text-xs space-y-2 opacity-60 text-purple-900">
                  <Folder size={32} className="mx-auto text-[#EC4899] animate-pulse" />
                  <p className="font-extrabold">No messages selected for detailed appraisal</p>
                  <p className="text-[10px] opacity-80">Use the Left Panel search or category filters to find alerts.</p>
                </div>
              )}
            </div>

          </div>
        </>
      ) : (
        /* Regional Admin Leave request submission simulator module */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full">
          
          <div className="md:col-span-8 md:col-start-2 w-full">
            <div 
              style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}
              className="p-6 rounded-2xl border shadow-xl flex flex-col text-left space-y-6"
            >
              <div>
                <span className="text-[10px] uppercase font-black font-mono block text-[#EC4899]">
                  Sandbox Interactive Simulator Mode
                </span>
                <h3 className="text-base font-black tracking-tight mt-1" style={{ color: '#4A044E' }}>
                  Submit Leave Request as Branch Administrator
                </h3>
                <p className="text-xs mt-1 leading-snug text-[#831843]">
                  Simulate live employee absence filing. Submitting triggers real-time message state changes with high-fidelity document logs on the Super Admin desk queue instantly.
                </p>
              </div>

              <form onSubmit={handleSubmitSimLeave} className="space-y-4 text-xs font-bold" style={{ color: '#4A044E' }}>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Employee candidate */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#831843]">
                      Apply as Administrator
                    </label>
                    <select
                      value={simEmployeeId}
                      onChange={(e) => setSimEmployeeId(e.target.value)}
                      className="w-full bg-white border rounded-xl p-2.5 outline-none font-bold text-[#4A044E]"
                      style={{ borderColor: '#F9A8D4' }}
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.id} - {emp.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Leave Category selection */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#831843]">
                      Absence Category Type
                    </label>
                    <select
                      value={simLeaveType}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setSimLeaveType(val);
                        if (val === 'Casual Leave') {
                          setSimMessage('I would like to apply for 3 days of Casual Leave from 25 June 2026 to 27 June 2026 due to personal reasons.');
                        } else if (val === 'Sick Leave') {
                          setSimMessage('Applying for 2 days of sudden medical Sick Leave due to seasonal influenza diagnosis. Medical scanner code matches.');
                        } else if (val === 'Earned Leave') {
                          setSimMessage('Requested annual corporate relaxation Earned Leave for family tour program. Department handovers already complete.');
                        } else {
                          setSimMessage('Applying for leave as specified in corporate regulatory guidelines.');
                        }
                      }}
                      className="w-full bg-white border rounded-xl p-2.5 outline-none font-bold text-[#4A044E]"
                      style={{ borderColor: '#F9A8D4' }}
                    >
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Earned Leave">Earned Leave</option>
                      <option value="Sabbatical">Sabbatical Leave</option>
                      <option value="Other">Other Absence</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Branch area origin selection */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#831843]">
                      Originating Branch Area
                    </label>
                    <input
                      type="text"
                      required
                      value={simBranchName}
                      onChange={(e) => setSimBranchName(e.target.value)}
                      className="w-full bg-white border rounded-xl p-2.5 outline-none font-bold text-[#4A044E]"
                      style={{ borderColor: '#F9A8D4' }}
                    />
                  </div>

                  {/* Duration days representation */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#831843]">
                      Duration Period length
                    </label>
                    <input
                      type="text"
                      required
                      value={simDuration}
                      onChange={(e) => setSimDuration(e.target.value)}
                      placeholder="e.g. 3 days"
                      className="w-full bg-white border rounded-xl p-2.5 outline-none font-bold placeholder-stone-400 text-[#4A044E]"
                      style={{ borderColor: '#F9A8D4' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start code */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#831843]">
                      Start date stamp
                    </label>
                    <input
                      type="text"
                      required
                      value={simStartDate}
                      onChange={(e) => setSimStartDate(e.target.value)}
                      className="w-full bg-white border rounded-xl p-2.5 outline-none font-bold font-mono text-[#4A044E]"
                      style={{ borderColor: '#F9A8D4' }}
                    />
                  </div>

                  {/* End code */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#831843]">
                      Expected resume date (End)
                    </label>
                    <input
                      type="text"
                      required
                      value={simEndDate}
                      onChange={(e) => setSimEndDate(e.target.value)}
                      className="w-full bg-white border rounded-xl p-2.5 outline-none font-bold font-mono text-[#4A044E]"
                      style={{ borderColor: '#F9A8D4' }}
                    />
                  </div>
                </div>

                {/* Statement explanation narrative text area */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#831843]">
                    Absence Narrative Statement Justification Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={simMessage}
                    onChange={(e) => setSimMessage(e.target.value)}
                    className="w-full bg-white border rounded-[16px] p-3 outline-none font-medium leading-relaxed text-purple-950"
                    style={{ borderColor: '#F9A8D4' }}
                  />
                </div>

                {/* Submit trigger button rows */}
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveMode('view-inbox')}
                    className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 bg-white hover:bg-slate-50 transition-all font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-white font-extrabold uppercase shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95"
                    style={{ backgroundColor: '#EC4899' }}
                  >
                    <Send size={12} className="text-white" />
                    <span>File Leave Application</span>
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
