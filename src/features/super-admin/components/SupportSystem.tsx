import React, { useState } from 'react';
import { HelpCircle, ChevronRight, CheckCircle2, AlertTriangle, Send, User, Bot, Clock } from 'lucide-react';
import { Ticket } from '../types/dashboard';

interface SupportSystemProps {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

export default function SupportSystem({
  tickets,
  setTickets,
  addAuditLog
}: SupportSystemProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatFeed, setChatFeed] = useState([
    { sender: 'system' as 'system' | 'user', text: "Welcome Sayeema. This is the Apex Bank Super Admin live support channel. Please request diagnostic updates here.", time: "08:35 AM" }
  ]);

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  const handleToggleResolve = (id: string) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        const nextState: 'Open' | 'Resolved' | 'In Progress' = t.status === 'Resolved' ? 'Open' : 'Resolved';
        addAuditLog(`Support ticket status altered to ${nextState.toUpperCase()} for ${t.customerName} [ID: ${t.id}]`, 'Info');
        return { ...t, status: nextState };
      }
      return t;
    });
    setTickets(updated);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Append user message
    const userMsg = { sender: 'user' as const, text: chatMessage, time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) };
    setChatFeed([...chatFeed, userMsg]);
    const inputMsg = chatMessage;
    setChatMessage('');

    addAuditLog(`Admin initiated support dialog message payload: "${inputMsg.substring(0, 30)}..."`, 'Info');

    // Simulate reactive AI assistant block response
    setTimeout(() => {
      let aiText = "Analyzing diagnostic state... Core system HSM modules show fully safe statuses.";
      if (inputMsg.toLowerCase().includes("status") || inputMsg.toLowerCase().includes("risk")) {
        aiText = "Global AI Security monitoring is active. Currently tracking 1 threat IP. Server metrics show 4ms latency.";
      } else if (inputMsg.toLowerCase().includes("ledger") || inputMsg.toLowerCase().includes("transaction")) {
        aiText = "All electronic SWIFT transactions have cleared successfully. Ledger integrity is optimal.";
      }
      const systemMsg = { sender: 'system' as const, text: aiText, time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) };
      setChatFeed(prev => [...prev, systemMsg]);
    }, 1000);
  };

  return (
    <div className="space-y-6" id="support-module">
      
      {/* 2 column layout: Support Tickets List & Chat Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tickets listing */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#4A044E] uppercase tracking-wider">Active System Support Tickets</h3>
            <p className="text-xs text-[#9D174D]/80">A list of critical client tickets awaiting compliance review.</p>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {tickets.map((t) => {
              const isSelected = selectedTicketId === t.id;
              return (
                <div 
                  id={`support-ticket-${t.id}`}
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-4 border rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-[#d4af37]/60 bg-[#FDF2F8] shadow-md' 
                      : 'border-[#F9A8D4] hover:bg-[#FBCFE8]/30'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="text-xs font-bold text-[#4A044E] truncate">{t.subject}</h4>
                    <span className="text-[10px] text-[#9D174D]/80 font-mono block mt-0.5">{t.customerName} · {t.id}</span>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                      t.priority === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {t.priority}
                    </span>
                    <button 
                      id={`ticket-resolve-${t.id}`}
                      onClick={() => handleToggleResolve(t.id)}
                      className={`text-[9px] font-bold uppercase ${
                        t.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-500 hover:text-amber-400'
                      }`}
                    >
                      {t.status}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Support desk chat simulation */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl flex flex-col justify-between min-h-[460px] relative overflow-hidden">
          
          {/* Header block */}
          <div className="flex items-center gap-3 border-b border-[#FBCFE8] pb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-[#4A044E]">
              <Bot size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#4A044E]">Sovereign Compliance AI Terminal</h4>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 leading-none mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live AI Assistant Syncing
              </p>
            </div>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 scrollbar-thin scrollbar-thumb-amber-500/10 h-64">
            {chatFeed.map((msg, i) => (
              <div 
                key={i} 
                className={`flex gap-3 max-w-lg ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-[#4A044E] flex-shrink-0 ${
                  msg.sender === 'user' ? 'bg-amber-600' : 'bg-cyan-600'
                }`}>
                  {msg.sender === 'user' ? 'CS' : 'AI'}
                </div>
                <div>
                  <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-[#1b255c] to-[#121942] border border-[#2b3989] text-[#4A044E] rounded-tr-none' 
                      : 'bg-[#FFF1F5] border border-[#152055] text-[#831843] rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-[#9D174D]/80 font-mono mt-1 block px-1 text-right">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Sender */}
          <form onSubmit={handleSendMessage} className="flex gap-2.5 items-center select-none pt-2 border-t border-[#FBCFE8]">
            <input 
              id="support-chat-input"
              type="text"
              required
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Query structural balances or active thread levels..."
              className="flex-1 bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] placeholder-[#EC4899]/50 p-2.5 rounded-xl text-xs outline-none font-mono"
            />
            <button 
              id="send-chat-btn"
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#4A044E] transition-all cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
