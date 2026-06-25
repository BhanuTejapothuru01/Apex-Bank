import React, { useState, useEffect, useRef } from 'react';
import { 
  X, PhoneCall, Mail, MessageSquare, Video, ShieldAlert, Check, Play, Square, Volume2, Mic, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BranchManager } from '../data/managersData';

interface ManagerContactModalProps {
  key?: string;
  manager: BranchManager;
  onClose: () => void;
}

type TabType = 'call' | 'chat' | 'email' | 'video';

export default function ManagerContactModal({
  manager,
  onClose
}: ManagerContactModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('call');

  // Secure voice dialer states
  const [callState, setCallState] = useState<'idle' | 'dialing' | 'connected' | 'muted'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const startCall = () => {
    setCallState('dialing');
    setTimeout(() => {
      setCallState('connected');
    }, 2000);
  };

  const endCall = () => {
    setCallState('idle');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Chat states
  const [messages, setMessages] = useState<Array<{ sender: 'admin' | 'manager', text: string, time: string }>>([
    { sender: 'manager', text: `Hello! This is ${manager.name}. Direct line secured. How can I assist you in directing ${manager.branchName} operations today?`, time: '09:00 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { sender: 'admin', text: userText, time: now }]);
    setInputText('');
    setIsTyping(true);

    // Simulate localized manager auto responder
    setTimeout(() => {
      setIsTyping(false);
      let reply = "Affirmative. I've logged this action. Let me pull up our ledger entries and verify the transfer routes.";
      const query = userText.toLowerCase();

      if (query.includes('status') || query.includes('how')) {
        reply = `Status is green. We currently have ${manager.stats.activeStaff} nodes active. Financial reserves at ${manager.branchName} are secure and fully balanced.`;
      } else if (query.includes('audit') || query.includes('report')) {
        reply = `Understood. Our regional audits are logged inside the system. Weekly transactions have breached the ranking scale at ${manager.performance.branchRanking}.`;
      } else if (query.includes('hello') || query.includes('hi')) {
        reply = `Greetings! I'm currently leading our staff morning standup briefing. Let me know if you need to execute immediate credit approvals.`;
      } else if (query.includes('transfer') || query.includes('move')) {
        reply = `Acknowledged on the relocation query. I've requested the historical transfer index to be updated by regional controllers in Chennai.`;
      }

      setMessages(prev => [...prev, { sender: 'manager', text: reply, time: now }]);
    }, 1500);
  };

  // Email form states
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState(`Dear ${manager.name},\n\nWe are reviewing the operational statistics for the ${manager.branchName} branch node. Please prepare the quarterly compliance log for our audit.\n\nRegards,\nOperations Head`);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 3000);
    }, 1800);
  };

  // Video Conference states
  const [videoConnected, setVideoConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-[6px] flex items-center justify-center z-[99999] p-4 font-sans text-[#4A044E] select-none">
      <div className="w-[75%] h-[80vh] bg-[#FCE7F3] border border-[#F9A8D4]/80 rounded-[24px] shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Top Header Glow border strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />

        {/* Modal Window Title Panel */}
        <div className="p-5 border-b border-[#F9A8D4]/50 flex items-center justify-between bg-[#FFF1F5]/50">
          <div>
            <h3 className="text-sm font-black uppercase text-[#d4af37] tracking-widest flex items-center gap-2">
              <PhoneCall className="text-amber-400 animate-pulse" size={16} />
              <span>Apex secured telecom portal</span>
            </h3>
            <p className="text-[10px] text-[#9D174D]/85 font-mono mt-0.5">
              TARGET ENDPOINT: {manager.name} ({manager.id}) - {manager.branchName}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9D174D]/85 hover:text-[#4A044E] hover:bg-white/5 cursor-pointer transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controllers */}
        <div className="grid grid-cols-4 bg-pink-50/80 border-b border-[#F9A8D4]/50 text-xs">
          <button
            onClick={() => setActiveTab('call')}
            className={`py-3.5 flex flex-col sm:flex-row items-center justify-center gap-1.5 font-bold uppercase transition-all tracking-wider ${
              activeTab === 'call' ? 'text-[#d4af37] bg-amber-500/10 border-b-2 border-[#d4af37]' : 'text-[#9D174D]/85 hover:text-[#701a75]'
            }`}
          >
            <Volume2 size={14} />
            <span className="text-[10px] sm:text-xs">Secure VoIP</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3.5 flex flex-col sm:flex-row items-center justify-center gap-1.5 font-bold uppercase transition-all tracking-wider ${
              activeTab === 'chat' ? 'text-[#d4af37] bg-amber-500/10 border-b-2 border-[#d4af37]' : 'text-[#9D174D]/85 hover:text-[#701a75]'
            }`}
          >
            <MessageSquare size={14} />
            <span className="text-[10px] sm:text-xs">Secure Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`py-3.5 flex flex-col sm:flex-row items-center justify-center gap-1.5 font-bold uppercase transition-all tracking-wider ${
              activeTab === 'email' ? 'text-[#d4af37] bg-amber-500/10 border-b-2 border-[#d4af37]' : 'text-[#9D174D]/85 hover:text-[#701a75]'
            }`}
          >
            <Mail size={14} />
            <span className="text-[10px] sm:text-xs">SMTP Email</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`py-3.5 flex flex-col sm:flex-row items-center justify-center gap-1.5 font-bold uppercase transition-all tracking-wider ${
              activeTab === 'video' ? 'text-[#d4af37] bg-amber-500/10 border-b-2 border-[#d4af37]' : 'text-[#9D174D]/85 hover:text-[#701a75]'
            }`}
          >
            <Video size={14} />
            <span className="text-[10px] sm:text-xs">Conference</span>
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#FCE7F3]/30">
          {/* TAB 1: PHONE SECURED VOIP */}
          {activeTab === 'call' && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              {callState === 'idle' && (
                <>
                  <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-400/35 flex items-center justify-center text-amber-500">
                    <Volume2 size={44} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#4A044E]">Direct Audited VoIP Link</h4>
                    <p className="text-xs text-[#9D174D]/85 max-w-sm mt-1.5">
                      This call executes a cryptographically locked communication gateway that is fully taped and audited by regional sovereign offices.
                    </p>
                  </div>
                  <button
                    onClick={startCall}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-[#bca030] hover:from-[#edd54a] text-[#050920] text-xs font-black uppercase rounded-xl tracking-wider cursor-pointer shadow-lg shadow-amber-500/10 active:scale-95 transition-all outline-none"
                  >
                    <PhoneCall size={14} />
                    <span>Initiate Connection</span>
                  </button>
                </>
              )}

              {callState === 'dialing' && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
                    <div className="w-24 h-24 rounded-full bg-[#FDF2F8] border-2 border-amber-400 flex items-center justify-center text-amber-300 relative z-10">
                      <PhoneCall size={38} className="animate-bounce" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-450 font-mono tracking-widest text-[13px] uppercase animate-pulse">
                      Establishing Encrypted Key Exchange...
                    </h4>
                    <p className="text-xs text-[#9D174D]/85 mt-1">
                      Calling {manager.phone} | Secure Proxy Signal Route G8
                    </p>
                  </div>
                  <button
                    onClick={endCall}
                    className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-[#4A044E] text-xs font-bold uppercase rounded-xl cursor-pointer shadow-lg shadow-rose-500/10 transition-colors"
                  >
                    <Square size={12} fill="white" />
                    <span>Cancel Call</span>
                  </button>
                </>
              )}

              {callState === 'connected' && (
                <>
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                    <Mic size={38} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-emerald-400 flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>SECURE LINE ACTIVE</span>
                    </h4>
                    <p className="text-lg font-mono font-bold text-[#4A044E] mt-1">
                      {formatTimer(callDuration)}
                    </p>
                    <p className="text-[10px] text-[#9D174D]/75 font-mono mt-1 uppercase tracking-widest">
                      AUDIO: AES-256 GCM • CODEC: OPUS-HQ • LATENCY: ~18ms
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCallState('muted')}
                      className="px-4 py-2 bg-[#FDF2F8] hover:bg-slate-700 text-[#701a75] text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Mute Line
                    </button>
                    <button
                      onClick={endCall}
                      className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-[#4A044E] text-xs font-black uppercase rounded-xl cursor-pointer shadow-lg shadow-rose-600/15"
                    >
                      <PhoneCall size={12} className="rotate-[135deg]" />
                      <span>End Audited Session</span>
                    </button>
                  </div>
                </>
              )}

              {callState === 'muted' && (
                <>
                  <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center text-amber-400">
                    <Mic size={38} className="line-through" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-amber-400">SESSION ON MUTED STATE</h4>
                    <p className="text-lg font-mono font-bold text-[#9D174D]/85 mt-1">
                      {formatTimer(callDuration)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCallState('connected')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-[#4A044E] text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Unmute Session
                    </button>
                    <button
                      onClick={endCall}
                      className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-[#4A044E] text-xs font-black uppercase rounded-xl cursor-pointer"
                    >
                      <span>Terminate Session</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: INTERNAL MESSAGING */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full bg-slate-950/50 rounded-xl overflow-hidden border border-[#F9A8D4]/40 text-xs">
              {/* Message History Scroller */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex flex-col ${m.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl leading-relaxed text-[11px] ${
                      m.sender === 'admin'
                        ? 'bg-amber-550 border border-amber-500/35 bg-amber-500/30 text-[#4A044E] rounded-br-none font-bold'
                        : 'bg-[#FDF2F8] text-[#4A044E] rounded-bl-none border border-[#F9A8D4]/40'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[9px] text-[#9D174D]/75 font-mono mt-1">{m.time}</span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex flex-col items-start bg-[#FDF2F8]/40 border border-[#F9A8D4]/40 p-2 px-3 rounded-lg animate-pulse">
                    <p className="text-[10px] text-[#9D174D]/85 tracking-wider">Manager is drafting response...</p>
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <form onSubmit={sendMessage} className="p-3 bg-[#FFF1F5] border-t border-white/15 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type secure instruction here..."
                  className="flex-1 bg-[#FFF1F5] border border-[#F9A8D4]/50 rounded-lg px-3.5 py-2.5 text-[#4A044E] outline-none placeholder-slate-500 text-xs focus:border-[#d4af37]/65"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-amber-500 hover:bg-amber-400 text-[#050920] rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SECURE SMTP EMAIL Dispatcher */}
          {activeTab === 'email' && (
            <form onSubmit={handleSendEmail} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-[#9D174D]/85 uppercase font-bold font-mono">Receiver Address:</label>
                <input
                  type="text"
                  disabled
                  value={`${manager.name} <${manager.email}>`}
                  className="w-full bg-[#FFF1F5]/80 border border-[#F9A8D4]/50 p-2.5 rounded-lg text-[#9D174D]/85 font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#9D174D]/85 uppercase font-bold font-mono">Subject Header:</label>
                <input
                  type="text"
                  required
                  placeholder="Confidential Operational Compliance Verification Report"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#FFF1F5] border border-[#F9A8D4]/50 p-2.5 rounded-lg text-[#4A044E] outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#9D174D]/85 uppercase font-bold font-mono">Confidential Message Body:</label>
                <textarea
                  rows={4}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-[#FFF1F5] border border-[#F9A8D4]/50 p-2.5 rounded-lg text-[#4A044E] outline-none font-sans focus:border-amber-500/50 leading-relaxed text-xs"
                />
              </div>

              {/* Status feedback block */}
              {emailSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-mono text-[10px] flex items-center gap-2">
                  <Check size={14} strokeWidth={3} />
                  <span>Apex Cryptographic Envelope sealed and transmitted successfully!</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-[#bca030] hover:opacity-90 font-black uppercase text-xs rounded-xl text-[#050920] shadow-lg cursor-pointer transition-all disabled:opacity-40"
                >
                  {isSendingEmail ? (
                    <span>Sealing Encryption Envelope...</span>
                  ) : (
                    <>
                      <Mail size={13} />
                      <span>Seal and Send Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: SECURED VIDEO CONFERENCING */}
          {activeTab === 'video' && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              {!videoConnected ? (
                <>
                  <div className="w-24 h-24 rounded-full bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Video size={44} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#4A044E]">Encrypted Cryptographic Video Room</h4>
                    <p className="text-xs text-[#9D174D]/85 max-w-sm mt-1.5">
                      Room Session Code: <span className="font-mono text-amber-300 font-bold">ROOM-{manager.branchCode}-{manager.id.substring(4)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setVideoConnected(true);
                      setIsStreaming(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-[#bca030] text-[#050920] text-xs font-black uppercase rounded-xl tracking-wider cursor-pointer shadow-lg shadow-amber-500/15"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>Launch Virtual Interface</span>
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col justify-between relative bg-slate-950 rounded-xl overflow-hidden border border-[#F9A8D4]/50 font-mono">
                  {/* Glowing Video stream simulated placeholder */}
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-900 via-[#070b28] to-slate-900 text-[#9D174D]/85 relative">
                    <div className="absolute top-3 left-3 bg-red-600 text-[#4A044E] text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      <span>LIVE SECURE</span>
                    </div>

                    <div className="absolute top-3 right-3 text-[9px] text-[#d4af37] font-bold bg-[#d4af37]/10 px-2.5 py-0.5 rounded border border-[#d4af37]/20">
                      TOKEN SHA-256 ACCREDITED
                    </div>

                    <div className="w-16 h-16 rounded-full bg-[#FFF1F5] border border-amber-400/30 flex items-center justify-center text-amber-400 font-black text-2xl mb-2">
                      {manager.avatarSeed}
                    </div>
                    <span className="text-[#4A044E] font-bold">{manager.name}</span>
                    <span className="text-[10px] text-[#9D174D]/75 mt-0.5">Assigned Stream: Node Camera B</span>

                    <p className="text-[9px] text-emerald-400 animate-pulse mt-4 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                      ● BIOMETRIC HANDSHAKE COMPLETE (AES-256 DECRYPTOR ALIVE)
                    </p>
                  </div>

                  {/* Conference controls footer */}
                  <div className="bg-[#FFF1F5] p-3.5 border-t border-[#F9A8D4]/50 flex items-center justify-between text-xs font-sans">
                    <span className="text-[#9D174D]/85 text-[10px]">ROOM ID: RM-APEX-{manager.branchCode}</span>
                    <button
                      onClick={() => setVideoConnected(false)}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-[#4A044E] rounded font-bold uppercase text-[10px] cursor-pointer"
                    >
                      Disconnect Port
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Window Footer Panel */}
        <div className="p-4 bg-slate-950 border-t border-[#F9A8D4]/40 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#FDF2F8] hover:bg-slate-700 text-[#831843] font-bold uppercase text-[10px] rounded-lg cursor-pointer transition-all"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
}
