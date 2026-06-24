import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Shield, 
  TrendingUp, 
  Bell, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  CheckSquare, 
  ArrowRight, 
  LogOut, 
  Check,
  Zap,
  Lock,
  LockKeyhole,
  Smartphone,
  Eye,
  Settings,
  Pencil,
  Volume2,
  FileSpreadsheet
} from 'lucide-react';

interface AdminProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (msg: string) => void;
}

export default function AdminProfilePanel({ isOpen, onClose, onNotify }: AdminProfilePanelProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'metrics' | 'security' | 'notifications'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('+91 94821 00295');
  const [email, setEmail] = useState('andrew.forbist@apexbank.com');
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  // Performance data
  const metrics = [
    { title: 'Applications Reviewed', value: '248', color: 'text-indigo-805 bg-indigo-100/40' },
    { title: 'Loans Approved', value: '175', color: 'text-emerald-805 bg-emerald-100/40' },
    { title: 'Loans Rejected', value: '42', color: 'text-rose-805 bg-rose-100/40' },
    { title: 'Pending Reviews', value: '31', color: 'text-amber-805 bg-amber-100/40' },
    { title: 'Approval Accuracy', value: '94.2%', color: 'text-purple-850 bg-purple-100/40' },
    { title: 'Fraud Cases Resolved', value: '18', color: 'text-pink-850 bg-pink-100/40' },
  ];

  // Security stats
  const securityDetails = [
    { label: 'Two-Factor Authentication', val: 'Enabled', status: 'secure' },
    { label: 'Password Strength', val: 'Excellent • Strong', status: 'secure' },
    { label: 'Recent Login Location', val: 'Mumbai, India', status: 'info' },
    { label: 'Recent IP Access', val: 'IP: 103.45.12.9', status: 'info' },
    { label: 'Device Identifier', val: 'macOS Sonoma • Chrome 125', status: 'info' },
    { label: 'Security Audit Status', val: 'SEC-AUDIT Passed', status: 'secure' },
  ];

  // Notification items
  const notifications = [
    { title: 'Unread Inbox Messages', count: 9, description: 'Client feedback and rate review notes.' },
    { title: 'Pending Directives', count: 4, description: 'Supervisory directives requiring executive override.' },
    { title: 'Fraud Alerts Raised', count: 3, description: 'Active alerts on velocity check breaches.' },
    { title: 'Pending Loan Reviews', count: 12, description: 'Commercial loan applications awaiting approval.' },
    { title: 'Compliance Notifications', count: 5, description: 'FCA guidelines modifications updates.' },
  ];

  const handleAction = (actType: string) => {
    onNotify?.(`Action "${actType}" initiated successfully!`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    onNotify?.("Profile credentials successfully modified inside administrative registry!");
    setSavedMsg("Changes successfully saved!");
    setTimeout(() => setSavedMsg(null), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop trigger layout with premium dimming overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[7999] bg-[rgba(0,0,0,0.25)] backdrop-blur-[6px]" 
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ width: '420px' }}
            className="absolute right-0 top-13 z-[8000] rounded-3xl bg-[rgba(255,255,255,0.98)] border border-white/50 backdrop-blur-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] overflow-hidden p-0 font-sans text-purple-950"
          >
            {/* Header Badge */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-5 text-white flex gap-4.5 items-center relative">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[8px] font-black uppercase tracking-wider">Level 3 Amin</span>
              </div>

              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
                  alt="Andrew Forbist"
                  referrerPolicy="no-referrer"
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                />
              </div>

              <div className="space-y-0.5">
                <h3 className="font-display font-black text-base tracking-tight leading-tight">
                  Andrew Forbist
                </h3>
                <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest leading-none">
                  Senior Banking Administrator
                </p>
                <p className="text-[9px] text-[#fad1e2] font-black font-mono">
                  ID: EMP-2026-104
                </p>
              </div>
            </div>

            {/* TAB CONTAINER SWAPPER */}
            <div className="grid grid-cols-4 gap-0.5 bg-purple-950/5 border-b border-purple-950/10 p-1 text-[9px] font-black uppercase tracking-widest text-center text-purple-950/40">
              <button
                onClick={() => { setActiveTab('profile'); setIsEditing(false); }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'bg-white text-purple-950 shadow-xs border border-purple-950/5' : 'hover:bg-white/40'
                }`}
              >
                Identity
              </button>
              <button
                onClick={() => setActiveTab('metrics')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'metrics' ? 'bg-white text-purple-950 shadow-xs border border-purple-950/5' : 'hover:bg-white/40'
                }`}
              >
                Metrics
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'security' ? 'bg-white text-purple-950 shadow-xs border border-purple-950/5' : 'hover:bg-white/40'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'notifications' ? 'bg-white text-purple-950 shadow-xs border border-purple-950/5' : 'hover:bg-white/40'
                }`}
              >
                Alerts
              </button>
            </div>

            {/* MESSAGE CONFIRMATION */}
            {savedMsg && (
              <div className="bg-emerald-500/15 border-y border-emerald-500/20 text-emerald-800 text-[10px] font-black text-center py-1.5 uppercase tracking-wider animate-pulse">
                {savedMsg}
              </div>
            )}

            {/* INNER CONTENT SCROLL CONTAINER */}
            <div className="p-4 max-h-[350px] overflow-y-auto space-y-4">
              
              {/* TAB 1: IDENTITY DETAILS */}
              {activeTab === 'profile' && (
                <>
                  {!isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-purple-950/80">
                        <div className="p-2.5 rounded-2xl bg-purple-50/50 border border-purple-950/10">
                          <span className="text-[7.5px] font-black uppercase text-purple-950/55 block mb-0.5">Department</span>
                          <strong className="text-purple-950 text-xs font-black">Credit & Risk</strong>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-purple-50/50 border border-purple-950/10">
                          <span className="text-[7.5px] font-black uppercase text-purple-950/55 block mb-0.5">Office Location</span>
                          <strong className="text-purple-950 text-xs font-black">Apex Headquarters</strong>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-purple-50/50 border border-purple-950/10 col-span-2 flex items-center justify-between">
                          <div>
                            <span className="text-[7.5px] font-black uppercase text-purple-950/55 block mb-0.5">Email Contact</span>
                            <strong className="text-purple-950 text-xs font-bold">{email}</strong>
                          </div>
                          <Mail className="w-4 h-4 text-purple-950/40" />
                        </div>
                        <div className="p-2.5 rounded-2xl bg-purple-50/50 border border-purple-950/10 col-span-2 flex items-center justify-between">
                          <div>
                            <span className="text-[7.5px] font-black uppercase text-purple-950/55 block mb-0.5">Mobile Phone</span>
                            <strong className="text-purple-950 text-xs font-mono">{phone}</strong>
                          </div>
                          <Phone className="w-4 h-4 text-purple-950/40" />
                        </div>
                      </div>

                      <div className="p-2 rounded-2xl bg-[#701a75]/5 border border-[#701a75]/15 flex justify-between items-center text-[10px] font-bold text-[#701a75]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Last Login timestamp:
                        </span>
                        <strong className="font-mono">12 Jun 2026, 03:45 PM</strong>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-2.5 p-3.5 rounded-2xl bg-white/40 border border-purple-950/10">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-[#701a75] mb-1">
                        Edit Official Contact Details
                      </h4>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-purple-950/40 block">Email Address</label>
                        <input 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white rounded-xl border border-purple-300 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-purple-950/40 block">Mobile Phone</label>
                        <input 
                          type="text" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white rounded-xl border border-purple-300 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2.5 pt-1.5">
                        <button
                          type="submit"
                          className="flex-1 py-1.5 bg-purple-950 text-white rounded-xl font-bold text-[9px] uppercase tracking-wider hover:bg-purple-900"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-1.5 bg-purple-950/10 text-purple-950 rounded-xl font-bold text-[9px] uppercase tracking-wider hover:bg-purple-950/20"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* QUICK ACTIONS PANEL */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[8.5px] font-black uppercase tracking-widest text-[#701a75] block">
                      Quick Administrative Tools
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => handleAction('View Profile')}
                        className="px-2 py-2 text-[9px] font-black rounded-xl border border-purple-950/10 bg-white/40 hover:bg-white tracking-wider uppercase transition-all hover:scale-103 active:scale-97 cursor-pointer text-center"
                      >
                        View Profile
                      </button>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-2 py-2 text-[9px] font-black rounded-xl border border-purple-950/10 bg-white/40 hover:bg-white tracking-wider uppercase transition-all hover:scale-103 active:scale-97 cursor-pointer text-center"
                      >
                        Edit Profile
                      </button>
                      <button 
                        onClick={() => handleAction('Notification Settings')}
                        className="px-2 py-2 text-[9px] font-black rounded-xl border border-purple-950/10 bg-white/40 hover:bg-white tracking-wider uppercase transition-all hover:scale-103 active:scale-97 cursor-pointer text-center"
                      >
                        Notifications
                      </button>
                      <button 
                        onClick={() => handleAction('Security Settings')}
                        className="px-2 py-2 text-[9px] font-black rounded-xl border border-purple-950/10 bg-white/40 hover:bg-white tracking-wider uppercase transition-all hover:scale-103 active:scale-97 cursor-pointer text-center"
                      >
                        Security Set
                      </button>
                      <button 
                        onClick={() => handleAction('Change Password')}
                        className="px-2 py-2 text-[9px] font-black rounded-xl border border-purple-950/10 bg-white/40 hover:bg-white tracking-wider uppercase transition-all hover:scale-103 active:scale-97 cursor-pointer text-center"
                      >
                        Password
                      </button>
                      <button 
                        onClick={() => handleAction('Activity Log')}
                        className="px-2 py-2 text-[9px] font-black rounded-xl border border-purple-950/10 bg-white/40 hover:bg-white tracking-wider uppercase transition-all hover:scale-103 active:scale-97 cursor-pointer text-center"
                      >
                        Activity Log
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onNotify?.("Andrew Forbist has successfully signed out. Safe logging active.");
                      }}
                      className="w-full mt-2 py-2 bg-rose-500/10 text-rose-800 hover:bg-rose-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out / Terminate Access
                    </button>
                  </div>
                </>
              )}

              {/* TAB 2: PERFORMANCE METRICS */}
              {activeTab === 'metrics' && (
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-[#1e1b4b]">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-wider">Supervisory Accuracy Score:</span>
                      <strong className="text-indigo-900 font-black font-sans">94.2%</strong>
                    </div>
                    <p className="text-[8.5px] font-semibold mt-1 opacity-70">
                      Calculated over 248 historic underwriting decisions verified by compliance committee auditors.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {metrics.map((m, idx) => (
                      <div key={idx} className={`p-3 rounded-2xl border border-purple-950/5 flex flex-col justify-between ${m.color}`}>
                        <span className="text-[9px] font-black uppercase text-purple-950/55 tracking-tight mb-2 leading-tight">
                          {m.title}
                        </span>
                        <strong className="text-xl font-sans font-black text-purple-955 tracking-tight">
                          {m.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SECURITY SECTION */}
              {activeTab === 'security' && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-950 flex gap-3 items-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div className="space-y-0.5">
                      <h4 className="text-[10px] font-black uppercase tracking-wide">Infrastructure Core Safe</h4>
                      <p className="text-[9px] font-semibold opacity-85">
                        Biometric validation active on login channel. System audit level 3 clearing.
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-purple-950/5">
                    {securityDetails.map((s, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center text-[10px] font-bold">
                        <span className="text-purple-950/60 font-black">{s.label}</span>
                        <span className={`font-mono ${s.status === 'secure' ? 'text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-lg text-[9px] font-black font-sans' : 'text-purple-950'}`}>
                          {s.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ALERTS / NOTIFICATION SUMMARY */}
              {activeTab === 'notifications' && (
                <div className="space-y-3">
                  <p className="text-[9.5px] text-purple-950/60 font-semibold leading-normal">
                    This supervisor mailbox aggregates active alerts across banking modules under Andrew's jurisdiction:
                  </p>

                  <div className="space-y-2">
                    {notifications.map((n, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-white/40 hover:bg-white/80 border border-purple-950/5 transition-all flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-purple-950">
                            {n.title}
                          </h4>
                          <p className="text-[9px] text-purple-950/50 font-semibold">
                            {n.description}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#701a75] text-[10px] font-black text-white shrink-0 shadow-sm leading-none font-sans mt-0.5">
                          {n.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer summary details */}
            <div className="p-3 text-[9px] font-bold bg-purple-950/5 border-t border-purple-950/10 text-center text-purple-950/40 uppercase tracking-widest">
              Secured Session • Level 3 Compliance Audited
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
