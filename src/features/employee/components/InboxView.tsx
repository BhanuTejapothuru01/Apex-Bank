import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Clock, 
  Send, 
  Sparkles, 
  CheckCircle, 
  AlertOctagon, 
  User, 
  Plus, 
  X, 
  Check, 
  Calendar, 
  FileText,
  ShieldCheck,
  Plane,
  ArrowRightCircle,
  Clock3
} from 'lucide-react';
import { MessageItem } from '../types';

interface InboxViewProps {
  messages: MessageItem[];
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
}

export default function InboxView({ messages, setMessages }: InboxViewProps) {
  const [selectedMsgId, setSelectedMsgId] = useState<string>(messages[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  // Slide Apply Leave states
  const [isApplyingLeave, setIsApplyingLeave] = useState(false);
  const [leaveType, setLeaveType] = useState('Vacation / Annual Leave');
  const [startDate, setStartDate] = useState('2026-06-18');
  const [endDate, setEndDate] = useState('2026-06-25');
  const [leaveReason, setLeaveReason] = useState('');
  const [handoverDetails, setHandoverDetails] = useState('');
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  const activeMsg = messages.find(m => m.id === selectedMsgId);

  const handleSelectMessage = (id: string) => {
    setIsApplyingLeave(false);
    setSelectedMsgId(id);
    setMessages(prev => 
      prev.map(m => m.id === id ? { ...m, isRead: true } : m)
    );
  };

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) {
      alert('VALIDATION ERROR: Please input a reason for applying for leave.');
      return;
    }

    setIsSubmittingLeave(true);

    setTimeout(() => {
      const generatedId = `leave-msg-${Date.now()}`;
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const currentDate = new Date().toISOString().split('T')[0];

      const newLeaveMsg: MessageItem = {
        id: generatedId,
        sender: 'Andrew Forbist',
        subject: `LEAVE APPLICATION: ${leaveType}`,
        body: `Employee Andrew Forbist has submitted a leave application for ${leaveType}.\n\nDuration: ${startDate} to ${endDate}\n\nReason: ${leaveReason}\n\nHandover Details: ${handoverDetails || 'Direct automatic backup covers.'}`,
        time: currentTime,
        date: currentDate,
        priority: 'High',
        isRead: false,
        avatarColor: 'bg-gradient-to-tr from-[#ec4899] to-[#6d28d9]',
        chatHistory: [
          {
            id: `c-leave-1`,
            sender: 'Andrew Forbist',
            message: `Hello Admin, I am forwarding my leave request details for approval. [Type: ${leaveType}] | [Interval: ${startDate} to ${endDate}]`,
            time: currentTime,
            isUser: true
          }
        ],
        leaveDetails: {
          type: leaveType,
          startDate,
          endDate,
          reason: leaveReason,
          status: 'Pending'
        }
      };

      setMessages(prev => [newLeaveMsg, ...prev]);
      
      // Reset form states
      setLeaveReason('');
      setHandoverDetails('');
      setSelectedMsgId(generatedId);
      setIsApplyingLeave(false);
      setIsSubmittingLeave(false);
    }, 1000);
  };

  const handleLeaveDecision = (messageId: string, decision: 'Approved' | 'Rejected') => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const decisionMessage = decision === 'Approved'
      ? `Super Admin: Leave request has been APPROVED. Team scheduling grids, payroll compliance locks, and backup coverage have been adjusted accordingly.`
      : `Super Admin: Leave request has been DECLINED. Operational capacity on these dates is currently restricted. Please reschedule with human resources.`;

    setMessages(prev => 
      prev.map(m => {
        if (m.id === messageId) {
          return {
            ...m,
            leaveDetails: m.leaveDetails ? {
              ...m.leaveDetails,
              status: decision
            } : undefined,
            chatHistory: [
              ...m.chatHistory,
              {
                id: `decision-${Date.now()}`,
                sender: 'Super Admin',
                message: decisionMessage,
                time: currentTime,
                isUser: false
              }
            ]
          };
        }
        return m;
      })
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMsgId) return;

    const newReply = {
      id: `reply-${Date.now()}`,
      sender: 'Andrew Forbist',
      message: replyText,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    setMessages(prev => 
      prev.map(m => {
        if (m.id === selectedMsgId) {
          return {
            ...m,
            chatHistory: [...m.chatHistory, newReply]
          };
        }
        return m;
      })
    );

    const messageToReplyTo = messages.find(m => m.id === selectedMsgId);
    setReplyText('');

    // Trigger compliance system automatic reply after a brief moment!
    setTimeout(() => {
      const isLeaveMsg = messageToReplyTo?.leaveDetails !== undefined;
      const responseMessageText = isLeaveMsg 
        ? `Acknowledgment: Leave application status review is in progress by Super Admin. Real-time shifts compliance tracker will update upon final system signoff.`
        : `Acknowledgment received. Reference logs synced. Your manual verification response has been registered within system mainframe filters under regulatory index AP-2026. Keep monitor progress.`;

      const autoResp = {
        id: `auto-${Date.now()}`,
        sender: messageToReplyTo?.sender || 'Admin Bot',
        message: responseMessageText,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };

      setMessages(prev => 
        prev.map(m => {
          if (m.id === selectedMsgId) {
            return {
              ...m,
              chatHistory: [...m.chatHistory, autoResp]
            };
          }
          return m;
        })
      );
    }, 1500);
  };

  return (
    <div id="inbox-view-root" className="space-y-6">
      
      {/* Visual Header */}
      <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-[#24142F]">Super Admin Directives & Operations Desk</h2>
          <p className="text-sm text-gray-500 font-sans mt-0.5">
            Execute manual instructions, secure compliance audits, apply for employee leave, and view urgent directives sent by Super Admins.
          </p>
        </div>
        <div className="bg-pink-50 text-pink-700 font-bold px-4 py-2 border border-pink-100 rounded-2xl flex items-center gap-2.5 shrink-0">
          <Mail className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-sans">
            {messages.filter(m => !m.isRead).length} Directives unread
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Messages listing & Apply for Leave Button */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm flex flex-col gap-4">
          
          {/* Action Trigger for Leave Application Form */}
          <button
            type="button"
            onClick={() => {
              setIsApplyingLeave(true);
              setSelectedMsgId('');
            }}
            className={`w-full py-3.5 px-4 rounded-2xl font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md ${
              isApplyingLeave 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse'
                : 'bg-[#24142F] hover:bg-[#1f1128] text-white active:scale-[0.98]'
            }`}
          >
            <Plus className="w-4 h-4 text-pink-300 shrink-0" />
            <span>Apply Employee Leave</span>
          </button>

          <div className="border-t border-gray-100 pt-3">
            <h3 className="text-xs font-bold font-mono uppercase text-gray-400 tracking-wider mb-3">
              Incoming communications
            </h3>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 active:scale-[0.98] relative ${
                    selectedMsgId === msg.id && !isApplyingLeave
                      ? 'border-pink-500 bg-pink-100/50 shadow-sm'
                      : 'border-pink-500/10 hover:bg-[#FAF4F8] bg-white'
                  }`}
                >
                  {/* Visual unread Indicator dot */}
                  {!msg.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 bg-pink-500 rounded-full animate-bounce" />
                  )}

                  <div className={`p-2.5 rounded-xl text-white font-sans font-bold flex items-center justify-center shrink-0 ${msg.avatarColor}`}>
                    {msg.sender[0]}
                  </div>
                  
                  <div className="overflow-hidden pr-3 w-full">
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="text-[10px] font-mono text-[#24142F] font-bold uppercase truncate max-w-[120px]">{msg.sender}</span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                        msg.priority === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : msg.priority === 'High'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {msg.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-sans font-bold text-gray-900 mt-1 truncate">{msg.subject}</h4>
                    
                    {/* Render custom tag inside general list if it is a leave request */}
                    {msg.leaveDetails && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-full ${
                          msg.leaveDetails.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : msg.leaveDetails.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          Leave: {msg.leaveDetails.status}
                        </span>
                      </div>
                    )}

                    <p className="text-[10px] font-sans text-gray-500 truncate mt-1">{msg.body}</p>
                    <p className="text-[9px] font-mono text-gray-400 mt-2">{msg.date} · {msg.time}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Reader or Leave Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-pink-500/10 shadow-sm flex flex-col h-[550px] justify-between relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* Case A: Applying Leave Form */}
            {isApplyingLeave ? (
              <motion.div
                key="leave-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full justify-between"
              >
                <div className="space-y-4 flex-1 overflow-y-auto pr-1 pb-4">
                  <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        HR Administrative Deck
                      </span>
                      <h3 className="text-base font-bold font-sans text-gray-900 mt-1.5">Apply for Professional Leave</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsApplyingLeave(false)}
                      className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form id="leave-submission-form" onSubmit={handleApplyLeaveSubmit} className="space-y-3.5 pt-2">
                    
                    {/* Leave Type row selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">Leave Classification</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'Vacation / Annual Leave',
                          'Sick / Medical Leave',
                          'Casual / Personal Emergency',
                          'Maternity/Paternity Period'
                        ].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setLeaveType(t)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition duration-200 ${
                              leaveType === t 
                                ? 'border-pink-500 bg-pink-50/40 text-pink-900 font-bold'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date picker row */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">Start Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:bg-white focus:border-pink-400 outline-none transition"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">End Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:bg-white focus:border-pink-400 outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Leave Reason Textarea */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">Reason for Leave Request</label>
                      <textarea
                        required
                        placeholder="Please detail the operational context (e.g., Scheduled wisdom tooth extraction and core rehabilitation time)..."
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        rows={3}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-pink-400 outline-none transition resize-none font-sans"
                      />
                    </div>

                    {/* Temporary Handover notes */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">Operational Handover Strategy (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Seraphina Vance will cover general ledger and payment queue tasks..."
                        value={handoverDetails}
                        onChange={(e) => setHandoverDetails(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-pink-400 outline-none transition"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-gray-500 font-sans">
                      Leave requests are logged inside the central mainframe and immediately forwarded to Super Admin for real-time compliance validation.
                    </div>

                  </form>
                </div>

                {/* Foot Action row */}
                <div className="border-t border-gray-100 pt-3 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsApplyingLeave(false)}
                    className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="leave-submission-form"
                    disabled={isSubmittingLeave}
                    className="px-5 py-2.5 bg-[#24142F] hover:bg-[#1a0e22] text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    {isSubmittingLeave ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Clock3 className="w-4 h-4 text-pink-300" />
                        <span>Submit Leave Request</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : activeMsg ? (
              
              /* Case B: Reading selected message details */
              <motion.div
                key={activeMsg.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col h-full justify-between"
              >
                
                {/* Directive & Chat scroll container */}
                <div className="space-y-4 overflow-y-auto pr-1 flex-1 pb-4">
                  
                  {/* Header metadata details */}
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                        PRIORITY: {activeMsg.priority}
                      </span>
                      <span className="text-xs font-mono text-gray-400">{activeMsg.date} · {activeMsg.time}</span>
                    </div>

                    <h3 className="text-base font-bold font-sans text-gray-900 mt-2.5">
                      {activeMsg.subject}
                    </h3>

                    <p className="text-xs text-gray-500 font-sans mt-1">
                      Direct sender: <span className="font-bold text-[#24142F]">{activeMsg.sender}</span>
                    </p>
                  </div>

                  {/* CUSTOM WORKFLOW: If the active message is a Leave Application! */}
                  {activeMsg.leaveDetails ? (
                    <div className="bg-gradient-to-br from-[#FAF4F8] to-white border-2 border-pink-500/10 rounded-2xl p-4.5 space-y-4 shadow-sm relative overflow-hidden">
                      
                      {/* Abstract background symbol watermarked */}
                      <span className="absolute -right-2 -bottom-2 opacity-5 text-pink-800 scale-150">
                        <Calendar className="w-32 h-32" />
                      </span>

                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-pink-600 bg-pink-100/50 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block w-fit">
                            Leave Details Review Board
                          </span>
                          <h4 className="text-sm font-bold font-sans text-gray-900 mt-2">
                            {activeMsg.leaveDetails.type}
                          </h4>
                        </div>

                        {/* Current dynamic approval badge stamp */}
                        <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full shadow-sm select-none shrink-0 ${
                          activeMsg.leaveDetails.status === 'Approved'
                            ? 'bg-emerald-500 text-white border border-emerald-400 animate-pulse'
                            : activeMsg.leaveDetails.status === 'Rejected'
                            ? 'bg-rose-500 text-white border border-rose-400'
                            : 'bg-amber-400 text-amber-950 border border-amber-300'
                        }`}>
                          {activeMsg.leaveDetails.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Summary fields Grid */}
                      <div className="grid grid-cols-2 gap-3 bg-white/60 p-3 rounded-xl border border-pink-500/5 text-xs">
                        <div>
                          <span className="text-gray-400 text-[9px] uppercase font-mono block">From (Start Date)</span>
                          <span className="font-mono text-gray-900 font-bold">{activeMsg.leaveDetails.startDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[9px] uppercase font-mono block">To (End Date)</span>
                          <span className="font-mono text-gray-900 font-bold">{activeMsg.leaveDetails.endDate}</span>
                        </div>
                      </div>

                      {/* Written explanation block */}
                      <div className="space-y-1">
                        <span className="text-gray-400 text-[9px] uppercase font-mono block">Stated Reason</span>
                        <div className="bg-white/80 border border-gray-100 p-3 rounded-xl text-xs text-gray-700 font-sans leading-relaxed">
                          {activeMsg.leaveDetails.reason}
                        </div>
                      </div>

                      {/* Interactive Admin approval gates if it is Pending */}
                      {activeMsg.leaveDetails.status === 'Pending' ? (
                        <div className="pt-2 border-t border-dashed border-gray-100 flex flex-col gap-2">
                          <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">
                            Super Admin Action Required:
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleLeaveDecision(activeMsg.id, 'Approved')}
                              className="py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Check className="w-4 h-4 text-emerald-100 shrink-0" />
                              <span>Approve Leave</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleLeaveDecision(activeMsg.id, 'Rejected')}
                              className="py-2.5 bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <X className="w-4 h-4 text-rose-100 shrink-0" />
                              <span>Decline Leave</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={`p-3 rounded-xl flex items-center gap-2.5 text-xs border ${
                          activeMsg.leaveDetails.status === 'Approved'
                            ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
                            : 'bg-rose-50/50 border-rose-100 text-rose-800'
                        }`}>
                          <ShieldCheck className={`w-4 h-4 shrink-0 ${
                            activeMsg.leaveDetails.status === 'Approved' ? 'text-emerald-500' : 'text-rose-500'
                          }`} />
                          <span className="font-medium">
                            Decision registered securely. Handover and logging protocols synchronized.
                          </span>
                        </div>
                      )}

                    </div>
                  ) : (
                    /* Default standard compliance message box */
                    <div className="bg-[#FAF4F8] rounded-2xl p-4 text-xs font-sans text-gray-700 leading-relaxed border border-pink-500/5 whitespace-pre-line">
                      {activeMsg.body}
                    </div>
                  )}

                  {/* Intercom Direct operations chat history */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                      Operations Intercom Auditable Chat
                    </h4>
                    
                    {activeMsg.chatHistory.map((chat) => (
                      <div 
                        key={chat.id} 
                        className={`flex gap-3 max-w-[85%] text-xs font-sans p-3 rounded-2xl border ${
                          chat.isUser 
                            ? 'ml-auto bg-pink-100/50 border-pink-500/20 text-[#24142F]'
                            : 'bg-white border-pink-500/5 text-gray-800'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#24142F] uppercase">{chat.sender}</span>
                            <span className="text-[8px] font-mono text-gray-400">{chat.time}</span>
                          </div>
                          <p className="leading-normal whitespace-pre-line">{chat.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Bottom text interactive reply area */}
                <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-100 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={activeMsg.leaveDetails ? "Discuss leave coverage with admin..." : "Formulate response to Super Admin..."}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-pink-50/50 border border-pink-200 outline-none rounded-xl p-3 text-xs font-sans focus:ring-1 focus:ring-pink-500"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-[#24142F] hover:bg-[#351b44] text-white rounded-xl transition duration-200 flex items-center justify-center shrink-0 active:scale-95 text-xs font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </motion.div>
            ) : (
              /* Case C: No directives selected fallback */
              <div className="text-center py-24 text-gray-400 font-sans flex-1 flex flex-col justify-center items-center">
                <Mail className="w-10 h-10 text-pink-200 mb-2" />
                <span>Select a directive or click apply leave to engage secure operations team desk.</span>
              </div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
