import React, { useState, useMemo } from 'react';
import { 
  X, User, Building2, TrendingUp, Users, Award, Calendar, Shield, MapPin, Mail, Phone, FileText, CheckCircle, Download, BookOpen, Clock, MessageSquare, Send, CalendarDays, Check, FileSpreadsheet, Printer, Star, StarHalf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { BranchManager } from '../data/managersData';
import ManagerDossierModal from './ManagerDossierModal';
import ManagerContactModal from './ManagerContactModal';
import ManagerPerformanceModal from './ManagerPerformanceModal';
import ManagerTransferModal from './ManagerTransferModal';

interface ManagerDetailModalProps {
  manager: BranchManager;
  onClose: () => void;
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

export default function ManagerDetailModal({
  manager,
  onClose,
  addAuditLog
}: ManagerDetailModalProps) {
  // Sub-modal visibility states for Branch Manager
  const [activeSubModal, setActiveSubModal] = useState<'profile' | 'contact' | 'performance' | 'transfer' | null>(null);
  
  // State for showing inline notifications for both Manager & Employee panels
  const [panelNotification, setPanelNotification] = useState<string | null>(null);

  // State for selected employee (to display complete high fidelity employee profile modal)
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    name: string;
    designation: string;
    department: string;
    status: 'Active' | 'Inactive' | 'On Leave' | string;
  } | null>(null);

  // Employee Management Action Tabs state
  const [empViewTab, setEmpViewTab] = useState<'profile' | 'contact' | 'attendance' | 'performance' | 'report' | 'analytics'>('profile');

  // Interactive states for Contacts tab
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimerInterval, setCallTimerInterval] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [messageLog, setMessageLog] = useState<{sender: string, text: string, time: string}[]>([]);
  const [emailSubject, setEmailSubject] = useState("Corporate SLA Standard Review");
  const [emailBody, setEmailBody] = useState("Dear Colleague,\n\nPlease log into the Core banking systems platform as we evaluate current KPIs.\n\nWarm regards,\nHR Management Console");
  const [emailSentOverlay, setEmailSentOverlay] = useState(false);
  const [meetingDate, setMeetingDate] = useState("2026-06-25");
  const [meetingTime, setMeetingTime] = useState("14:30");
  const [meetingTopic, setMeetingTopic] = useState("Quarterly Employee Review Alignment");
  const [meetingPlatform, setMeetingPlatform] = useState("Apex Encrypted Live Meet");
  const [scheduledMeetings, setScheduledMeetings] = useState<{date: string, time: string, topic: string, platform: string}[]>([]);

  // Interactive state for Download Report tab
  const [exportMode, setExportMode] = useState<'none' | 'pdf' | 'excel' | 'print'>('none');
  const [exportProgress, setExportProgress] = useState(0);

  // Experience calculation based on joinDate and system date reference "2026-06-15"
  const calculateService = (joinDateStr: string) => {
    const joinDate = new Date(joinDateStr);
    const systemDate = new Date("2026-06-15");
    
    let years = systemDate.getFullYear() - joinDate.getFullYear();
    let months = systemDate.getMonth() - joinDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months };
  };

  const service = calculateService(manager.joinDate);

  // Helpers to get branch locations
  const getStateOfBranch = (loc: string) => {
    if (loc.includes("Hyderabad")) return "Telangana";
    if (loc.includes("Zurich")) return "Zurich Canton";
    if (loc.includes("London")) return "Greater London";
    if (loc.includes("Tokyo")) return "Tokyo";
    if (loc.includes("Singapore")) return "Central Region";
    if (loc.includes("New York")) return "New York";
    if (loc.includes("Chennai")) return "Tamil Nadu";
    if (loc.includes("Mumbai")) return "Maharashtra";
    if (loc.includes("Delhi")) return "Delhi";
    return "National Capital Region";
  };

  const city = manager.branchLocation.split(', ')[0] || manager.branchLocation;
  const state = getStateOfBranch(manager.branchLocation);
  const branchPerformanceScore = (90 + Math.round((manager.rating - 4) * 10)) + ".4%";

  // Derived counts for team summary block
  const totalEmployees = manager.stats.totalStaff || manager.team.length;
  const activeEmployees = manager.stats.activeStaff || manager.team.filter(t => t.status === 'Active').length;
  const onLeaveEmployees = manager.team.filter(t => t.status === 'On Leave').length || 1;
  const contractEmployees = manager.stats.contractStaff || 1;
  const suspendedEmployees = manager.stats.inactiveStaff || manager.team.filter(t => t.status === 'Inactive').length;

  // Recharts Colors & Data (Gold luxury theme accents!)
  const COLORS = ['#d4af37', '#b18e22', '#10B981', '#3B82F6', '#6366F1'];

  const employeeDistData = useMemo(() => [
    { name: 'Active', value: activeEmployees },
    { name: 'On Leave', value: onLeaveEmployees },
    { name: 'Contracted', value: contractEmployees },
    { name: 'Suspended', value: suspendedEmployees }
  ], [activeEmployees, onLeaveEmployees, contractEmployees, suspendedEmployees]);

  const deptDistData = useMemo(() => [
    { name: 'Retail Bank', count: Math.round(activeEmployees * 0.4) || 2 },
    { name: 'Treasury Ops', count: Math.round(activeEmployees * 0.3) || 2 },
    { name: 'KYC & Audit', count: Math.round(activeEmployees * 0.2) || 1 },
    { name: 'Loan Proc', count: Math.max(1, totalEmployees - activeEmployees) }
  ], [activeEmployees, totalEmployees]);

  const attendanceTrendData = [
    { month: 'Jan', rate: 94.5 },
    { month: 'Feb', rate: 95.8 },
    { month: 'Mar', rate: 94.1 },
    { month: 'Apr', rate: 96.8 },
    { month: 'May', rate: 97.5 },
    { month: 'Jun', rate: 98.2 }
  ];

  const revenueTrendData = [
    { month: 'Jan', revenue: 850000 },
    { month: 'Feb', revenue: 920000 },
    { month: 'Mar', revenue: 980000 },
    { month: 'Apr', revenue: 1040005 },
    { month: 'May', revenue: 1120000 },
    { month: 'Jun', revenue: 1200000 }
  ];

  // Initiate call simulation
  const handleCallSimulation = () => {
    if (isCalling) {
      clearInterval(callTimerInterval);
      setCallTimerInterval(null);
      setIsCalling(false);
      setCallDuration(0);
      addAuditLog(`Closed telecom voice path with employee [ID: ${selectedEmployee?.id}]`, 'Info');
    } else {
      setIsCalling(true);
      const start = Date.now();
      const interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - start) / 1000));
      }, 1000);
      setCallTimerInterval(interval);
      addAuditLog(`Opened live telecom VoIP connection to ${selectedEmployee?.name}`, 'Info');
    }
  };

  // Send internal message
  const handleSendInternalText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const newMsg = {
      sender: "System Administrator",
      text: messageText,
      time: "10:14 PM"
    };
    setMessageLog([...messageLog, newMsg]);
    setMessageText("");
    addAuditLog(`Dispatched secure intranet slack alert to [ID: ${selectedEmployee?.id}]`, 'Info');
  };

  // Schedule virtual alignments
  const handleScheduleVirtualMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTopic.trim()) return;
    const newMeeting = {
      date: meetingDate,
      time: meetingTime,
      topic: meetingTopic,
      platform: meetingPlatform
    };
    setScheduledMeetings([newMeeting, ...scheduledMeetings]);
    setMeetingTopic("");
    addAuditLog(`Structured digital cryptographic room assignment for employee: ${selectedEmployee?.name}`, 'Info');
    setPanelNotification(`✔ MEETING SCHEDULED ON APEX PORTAL: ${newMeeting.topic} ON ${newMeeting.date} AT ${newMeeting.time}.`);
  };

  // Run downloading progress simulator
  const handleExportClick = (mode: 'pdf' | 'excel' | 'print') => {
    setExportMode(mode);
    setExportProgress(0);
    const intervalObj = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalObj);
          setTimeout(() => {
            setExportMode('none');
            setPanelNotification(`✔ ${mode.toUpperCase()} FILE PACKET EXPORTED AND RECORDED SUCCESSFUL.`);
            addAuditLog(`Generated standard employee dashboard dossier sheet in ${mode.toUpperCase()} mode for ${selectedEmployee?.name}`, 'Info');
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  return (
    <div id="manager-details-fixed-overlay" className="fixed inset-0 bg-[#3a2072]/65 backdrop-blur-[6px] flex items-center justify-center z-[99999] p-4 font-sans text-slate-150 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-[850px] max-h-[90vh] bg-[#090f2b] border border-[#17235a]/80 text-white rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative box-border"
      >
        {/* Status Highlight Strip */}
        <div className={`absolute top-0 inset-x-0 h-1.5 transition-all duration-250 ${
          manager.status === 'Active'
            ? 'bg-emerald-400'
            : manager.status === 'On Leave'
            ? 'bg-amber-400'
            : 'bg-rose-400'
        }`} />

        {/* Modal Window Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-full bg-[#131b45] text-[#d4af37] border border-[#1b2559] flex items-center justify-center text-xl font-black shadow-sm shrink-0 leading-none">
              {manager.avatarSeed}
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex flex-wrap items-center gap-2">
                <span>{manager.name}</span>
                <span className="text-[#d4af37] font-mono text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-[#d4af37]/35">({manager.id})</span>
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                {manager.designation} • {manager.department}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-[#d4af37] hover:bg-white/5 border border-white/5 cursor-pointer transition-all shrink-0 animate-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body - Scroller Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 pr-4">
          
          {/* Action Notification Message Area */}
          {panelNotification && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-amber-500/10 border border-amber-400/20 text-[#d4af37] font-mono text-[11px] font-bold rounded-xl text-left uppercase tracking-tight flex items-center justify-between"
            >
              <span>{panelNotification}</span>
              <button 
                onClick={() => setPanelNotification(null)} 
                className="text-amber-400 font-black underline cursor-pointer text-[10px]"
              >
                Clear
              </button>
            </motion.div>
          )}

          {/* Main Grid: Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
            
            {/* 1. BRANCH INFORMATION */}
            <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3.5 text-xs flex flex-col justify-between w-full max-w-full box-border shadow-sm">
              <div>
                <h4 className="font-black text-[#d4af37] uppercase tracking-wider text-[11px] border-b border-white/5 pb-2 flex items-center gap-1.5 text-left">
                  <Building2 size={13} className="text-amber-400" />
                  <span>Branch Information</span>
                </h4>
                <div className="space-y-2 mt-3.5 text-[11.5px]">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Branch Name:</span>
                    <span className="w-[65%] font-bold text-slate-100 text-left break-words">{manager.branchName}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Branch Code:</span>
                    <span className="w-[65%] font-mono font-bold text-[#d4af37] text-left break-all">{manager.branchCode}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Branch Location:</span>
                    <span className="w-[65%] text-slate-200 font-semibold text-left break-words">{city}, {state}, {manager.branchLocation}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Branch Type:</span>
                    <span className="w-[65%] text-slate-200 text-left break-words">{manager.branchType}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Opening Date:</span>
                    <span className="w-[65%] text-slate-200 font-mono text-left break-words">{manager.branchOpeningDate || "2018-05-10"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BRANCH MANAGER DETAILS */}
            <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3.5 text-xs flex flex-col justify-between w-full max-w-full box-border shadow-sm">
              <div>
                <h4 className="font-black text-[#d4af37] uppercase tracking-wider text-[11px] border-b border-white/5 pb-2 flex items-center gap-1.5 text-left">
                  <User size={13} className="text-amber-400" />
                  <span>Branch Manager Details</span>
                </h4>
                <div className="space-y-2 mt-3.5 text-[11.5px]">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Full Name:</span>
                    <span className="w-[65%] font-bold text-slate-100 text-left break-words">{manager.name}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Employee ID:</span>
                    <span className="w-[65%] font-mono font-bold text-[#d4af37] text-left break-all">{manager.id}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Contact Number:</span>
                    <span className="w-[65%] text-slate-200 font-mono text-left break-words">{manager.phone}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Official Email:</span>
                    <span className="w-[65%] text-[#d4af37] font-mono font-bold text-left break-all" title={manager.email}>{manager.email}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Service Years:</span>
                    <span className="w-[65%] text-slate-200 font-semibold text-left break-words">
                      {service.years} Years, {service.months} Months (Joined {manager.joinDate})
                    </span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left shrink-0">Performance Rating:</span>
                    <span className="w-[65%] text-emerald-400 font-bold font-mono text-left break-words">
                      ★ {manager.rating.toFixed(1)} / 5.0 (A+ Rating)
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 3. TEAM SUMMARY */}
          <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl text-xs space-y-4 shadow-sm text-left">
            <h4 className="font-black text-[#d4af37] uppercase tracking-wider text-[11px] border-b border-white/5 pb-2 flex items-center gap-1.5 font-sans">
              <Users size={13} className="text-amber-400" />
              <span>Team Summary Metrics</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              
              <div className="p-3 bg-amber-500/10 border border-[#d4af37]/35 rounded-xl text-center flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Team</span>
                <span className="font-mono text-lg font-black text-[#d4af37] mt-1.5 block">{totalEmployees}</span>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-center flex flex-col justify-between">
                <span className="text-[9px] font-bold text-emerald-450 uppercase tracking-wider block">Active</span>
                <span className="font-mono text-lg font-black text-emerald-400 mt-1.5 block">{activeEmployees}</span>
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center flex flex-col justify-between">
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block">On Leave</span>
                <span className="font-mono text-lg font-black text-amber-400 mt-1.5 block">{onLeaveEmployees}</span>
              </div>

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-center flex flex-col justify-between">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">Contractor</span>
                <span className="font-mono text-lg font-black text-indigo-400 mt-1.5 block">{contractEmployees}</span>
              </div>

              <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-center flex flex-col justify-between col-span-2 sm:col-span-1">
                <span className="text-[9px] font-bold text-rose-450 uppercase tracking-wider block">Suspended</span>
                <span className="font-mono text-lg font-black text-rose-400 mt-1.5 block">{suspendedEmployees}</span>
              </div>

            </div>
          </div>

          {/* MANAGER ACTION BUTTONS PANEL */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/10 select-none text-slate-100">
            <button
              onClick={() => {
                setActiveSubModal('profile');
                addAuditLog(`Admin loaded complete biography dossier for ${manager.name} [ID: ${manager.id}]`, 'Info');
              }}
              className="flex flex-col items-center justify-center p-3 bg-[#131b45]/30 hover:bg-[#131b45]/60 border border-[#d4af37]/35 text-[#d4af37] rounded-xl text-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer group"
            >
              <User size={16} className="text-[#d4af37] group-hover:scale-105 transition-transform" />
              <span className="text-[9px] uppercase font-black tracking-widest block text-slate-200">View Profile</span>
            </button>

            <button
              onClick={() => {
                setActiveSubModal('contact');
                addAuditLog(`Admin initiated communication panel with ${manager.name}`, 'Info');
              }}
              className="flex flex-col items-center justify-center p-3 bg-[#131b45]/30 hover:bg-[#131b45]/60 border border-[#d4af37]/35 text-[#d4af37] rounded-xl text-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer group"
            >
              <Mail size={16} className="text-[#d4af37] group-hover:scale-105 transition-transform" />
              <span className="text-[9px] uppercase font-black tracking-widest block text-slate-200">Contact Manager</span>
            </button>

            <button
              onClick={() => {
                setActiveSubModal('performance');
                addAuditLog(`Admin reviewed interactive performance matrices for ${manager.name}`, 'Info');
              }}
              className="flex flex-col items-center justify-center p-3 bg-[#131b45]/30 hover:bg-[#131b45]/60 border border-[#d4af37]/35 text-[#d4af37] rounded-xl text-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer group"
            >
              <TrendingUp size={16} className="text-[#d4af37] group-hover:scale-105 transition-transform" />
              <span className="text-[9px] uppercase font-black tracking-widest block text-slate-200">View Team Performance</span>
            </button>

            <button
              onClick={() => {
                setActiveSubModal('transfer');
                addAuditLog(`Admin logged transfer posting indices for ${manager.name}`, 'Info');
              }}
              className="flex flex-col items-center justify-center p-3 bg-[#131b45]/30 hover:bg-[#131b45]/60 border border-[#d4af37]/35 text-[#d4af37] rounded-xl text-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer group"
            >
              <MapPin size={16} className="text-[#d4af37] group-hover:scale-105 transition-transform" />
              <span className="text-[9px] uppercase font-black tracking-widest block text-slate-200">Transfer History</span>
            </button>

            <button
              onClick={() => {
                setPanelNotification(`✔ EXTRACTING HIGH INTENSITY ANALYTICS CORE INDEX FOR BRANCH ${manager.branchCode}. ALL SYSTEMS SECURED.`);
                addAuditLog(`Admin triggered electronic analytical evaluation for branch node: ${manager.branchCode}`, 'Info');
              }}
              className="flex flex-col items-center justify-center p-3 bg-[#131b45]/30 hover:bg-[#131b45]/60 border border-[#d4af37]/35 text-[#d4af37] rounded-xl text-center gap-1.5 transition-all shadow-sm col-span-2 sm:col-span-1 active:scale-95 cursor-pointer group"
            >
              <Award size={16} className="text-[#d4af37] group-hover:scale-105 transition-transform" />
              <span className="text-[9px] uppercase font-black tracking-widest block text-slate-200">Branch Analytics</span>
            </button>
          </div>

          {/* 4. EMPLOYEES UNDER THIS MANAGER */}
          <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-white/10 pb-2">
              <h4 className="font-black text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Users size={13} className="text-amber-400" />
                <span>Employees Reporting To This Branch Manager</span>
              </h4>
              <span className="text-[9.5px] font-black text-[#050920] bg-amber-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono shrink-0">
                {manager.team.length} Members Listed
              </span>
            </div>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <span>💡</span>
              <span>Tap any staff member listed below to access the high clearance Employee Profile ledger and trigger direct analytics dashboards.</span>
            </p>

            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 text-slate-350 font-bold border-b border-white/10 text-[10px] uppercase">
                    <th className="py-3 px-4">Photo</th>
                    <th className="py-3 px-4">Employee ID</th>
                    <th className="py-3 px-4">Employee Name</th>
                    <th className="py-3 px-2">Designation / Department</th>
                    <th className="py-3 px-4 text-right">Status State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[11.5px] font-semibold text-slate-250">
                  {manager.team.map((tNode) => {
                    const empInitials = tNode.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                    return (
                      <tr 
                        key={tNode.id} 
                        onClick={() => {
                          setSelectedEmployee({
                            id: tNode.id,
                            name: tNode.name,
                            designation: tNode.designation,
                            department: tNode.department,
                            status: tNode.status
                          });
                          setEmpViewTab('profile');
                        }}
                        className="hover:bg-amber-500/[0.03] transition-all cursor-pointer"
                      >
                        <td className="py-2.5 px-4">
                          <div className="w-8 h-8 rounded-full bg-[#131b45] text-[#d4af37] border border-[#1b2559]/70 flex items-center justify-center text-[10px] font-black shadow-sm select-none">
                            {empInitials}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-[#d4af37]">{tNode.id}</td>
                        <td className="py-2.5 px-4 font-black text-white">{tNode.name}</td>
                        <td className="py-2.5 px-2 text-slate-300">
                          <span className="font-bold block text-white">{tNode.designation}</span>
                          <span className="text-[10px] text-slate-500 block">{tNode.department}</span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase ${
                            tNode.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : tNode.status === 'On Leave'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {tNode.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Modal Window Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/5 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold uppercase text-[10px] tracking-wider rounded-xl cursor-pointer transition-all active:scale-[0.97]"
          >
            Close Panel
          </button>
        </div>

        {/* SUB MODALS INJECTION LAYER FOR MANAGER */}
        <AnimatePresence>
          {activeSubModal === 'profile' && (
            <ManagerDossierModal
              key="dossier-modal"
              manager={manager}
              onClose={() => setActiveSubModal(null)}
            />
          )}

          {activeSubModal === 'contact' && (
            <ManagerContactModal
              key="contact-modal"
              manager={manager}
              onClose={() => setActiveSubModal(null)}
            />
          )}

          {activeSubModal === 'performance' && (
            <ManagerPerformanceModal
              key="perf-modal"
              manager={manager}
              onClose={() => setActiveSubModal(null)}
            />
          )}

          {activeSubModal === 'transfer' && (
            <ManagerTransferModal
              key="transfer-modal"
              manager={manager}
              onClose={() => setActiveSubModal(null)}
            />
          )}
        </AnimatePresence>

        {/* MASTER HIGH FIDELITY EMPLOYEE PROFILE INTEGRATED INTERACTIVE PORTAL */}
        <AnimatePresence>
          {selectedEmployee && (() => {
            const empInitials = selectedEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            
            // Generate tailored dynamic sample properties for secondary screens
            const isVerma = selectedEmployee.name.includes("Verma") || selectedEmployee.name.includes("Ayesha");
            const gender = isVerma ? "Female" : "Male";
            const dob = isVerma ? "1994-08-14" : "1992-05-24";
            const mobile = isVerma ? "+91 98334 77281" : "+91 90022 18839";
            const emailAddress = `${selectedEmployee.name.toLowerCase().replace(' ', '.')}@apexbank.com`;
            const homeAddress = `Apartment 14-B, Core Sovereign Towers, ${city}, Pincode: ${manager.branchCode.includes('HYD') ? '500001' : '100010'}`;
            const joinYear = manager.joiningYear || 2022;
            const joiningDateString = `${joinYear}-04-12`;
            const clearanceLevel = isVerma ? "Level 3 - Systems Operator" : "Level 2 - Associate Controller";

            return (
              <div 
                className="fixed inset-0 bg-[#3a2072]/70 backdrop-blur-[6px] flex items-center justify-center p-4 z-[999999]"
                onClick={() => setSelectedEmployee(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-[800px] w-full max-h-[85vh] bg-[#090f2b] border border-[#17235a]/90 text-white rounded-[24px] shadow-2xl p-6 overflow-y-auto box-border"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Header of Employee */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#131b45] text-[#d4af37] border border-[#1b2559]/70 flex items-center justify-center text-sm font-black shadow-sm">
                        {empInitials}
                      </div>
                      <div className="text-left">
                        <h4 className="text-md font-black text-white flex items-center gap-2">
                          <span>{selectedEmployee.name}</span>
                          <span className="text-[#d4af37] font-mono text-xs font-bold leading-none bg-amber-500/10 px-1.5 py-0.5 rounded border border-[#d4af37]/35">({selectedEmployee.id})</span>
                        </h4>
                        <p className="text-xs text-slate-400 font-bold">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedEmployee(null)}
                      className="p-1.5 rounded-full border border-white/5 text-slate-400 hover:text-[#d4af37] hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* ACTIVE TAB DASHBOARD CONTENT PANEL */}
                  <div className="my-5 min-h-[300px]">
                    
                    {/* A. VIEW PROFILE TAB CONTENT */}
                    {empViewTab === 'profile' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="p-3 bg-amber-500/5 border border-amber-400/10 text-[#d4af37] rounded-xl text-left uppercase tracking-tight font-mono text-[10.5px] font-black flex items-center gap-2">
                          <CheckCircle size={14} className="text-[#d4af37]" />
                          <span>REGISTRY VERIFIED: EMPLOYEE CARD CONVOYING CLEARED WITH LIVE DIRECTORIES.</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left">
                          
                          {/* Profile Data Box 1 */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-2.5 shadow-sm">
                            <h5 className="font-black text-[#d4af37] uppercase tracking-widest text-[10px] border-b border-white/10 pb-1 flex items-center gap-1.5">
                              <User size={12} />
                              <span>Personal & Contact Info</span>
                            </h5>
                            <div className="space-y-1.5 text-[11.5px] font-medium leading-relaxed">
                              <div className="flex justify-between"><span className="text-slate-400">Full Name:</span><span className="font-extrabold text-white">{selectedEmployee.name}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Employee ID:</span><span className="font-bold text-[#d4af37] font-mono">{selectedEmployee.id}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Gender:</span><span className="font-bold text-slate-200">{gender}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Date of Birth:</span><span className="font-bold text-slate-200 font-mono">{dob}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Mobile:</span><span className="font-bold text-white font-mono">{mobile}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Email:</span><span className="font-bold text-[#d4af37] font-mono break-all max-w-[170px] truncate" title={emailAddress}>{emailAddress}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Address:</span><span className="font-medium text-slate-350 text-right truncate max-w-[170px]" title={homeAddress}>{homeAddress}</span></div>
                            </div>
                          </div>

                          {/* Profile Data Box 2 */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-2.5 shadow-sm">
                            <h5 className="font-black text-[#d4af37] uppercase tracking-widest text-[10px] border-b border-white/10 pb-1 flex items-center gap-1.5">
                              <Building2 size={12} />
                              <span>Employment & Security</span>
                            </h5>
                            <div className="space-y-1.5 text-[11.5px] font-medium leading-relaxed">
                              <div className="flex justify-between"><span className="text-slate-400">Designation:</span><span className="font-bold text-white">{selectedEmployee.designation}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Department:</span><span className="font-bold text-slate-200">{selectedEmployee.department}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Branch Assigned:</span><span className="font-bold text-slate-200 text-right truncate max-w-[150px]" title={manager.branchName}>{manager.branchName}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Supervisor:</span><span className="font-bold text-[#d4af37] font-mono">{manager.name} ({manager.id})</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Joining Date:</span><span className="font-bold text-slate-200 font-mono">{joiningDateString}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Clearance Level:</span><span className="font-black text-indigo-400 font-mono">{clearanceLevel}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Status Code:</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  selectedEmployee.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}>{selectedEmployee.status}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}

                    {/* B. CONTACT EMPLOYEE TAB CONTENT */}
                    {empViewTab === 'contact' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 text-left mr-1"
                      >
                        <h4 className="font-black text-[#d4af37] uppercase tracking-widest text-[11px] border-b border-white/10 pb-2 flex items-center gap-1.5">
                          <Mail size={13} />
                          <span>Intranet Communications Dispatch Station</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Live Phone & Chat Modules */}
                          <div className="space-y-4">
                            
                            {/* Call Employee Card */}
                            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3 shadow-sm">
                              <h5 className="font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                <Phone size={12} className="text-[#d4af37]" />
                                <span>Voice Dial System</span>
                              </h5>
                              <p className="text-[10px] text-slate-400">Initiate dynamic simulated connection with {selectedEmployee.name}.</p>
                              
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={handleCallSimulation}
                                  className={`px-4 py-2 text-xs font-black uppercase rounded-lg cursor-pointer transition-all outline-none ${
                                    isCalling 
                                      ? 'bg-rose-600 text-white animate-pulse'
                                      : 'bg-amber-500/10 text-[#d4af37] border border-[#d4af37]/35 hover:bg-[#d4af37]/15'
                                  }`}
                                >
                                  {isCalling ? 'Terminate Line' : 'Call Employee'}
                                </button>
                                
                                {isCalling && (
                                  <div className="flex items-center gap-2 text-[11.5px] font-mono font-black text-emerald-400">
                                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                                    <span>VoIP TALKTIME: {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Internal Message Board */}
                            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3 shadow-sm">
                              <h5 className="font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                <MessageSquare size={12} className="text-[#d4af37]" />
                                <span>Slack-X Channel Feed</span>
                              </h5>
                              
                              <div className="h-32 bg-slate-900 rounded-lg p-3 border border-white/5 overflow-y-auto font-mono text-[11px] space-y-2 scrollbar-thin scrollbar-thumb-white/10">
                                <div className="text-slate-500 text-center text-[9px] uppercase">*** SECURE SYNDICATED CHAT RECORD START ***</div>
                                {messageLog.length === 0 ? (
                                  <div className="text-slate-500 text-center py-6">No messages dispatched during session state.</div>
                                ) : (
                                  messageLog.map((log, idx) => (
                                    <div key={idx} className="bg-slate-950/50 p-2 rounded border border-white/5 space-y-1">
                                      <div className="flex justify-between font-black text-[9px] text-[#d4af37]">
                                        <span>{log.sender}</span>
                                        <span>{log.time}</span>
                                      </div>
                                      <p className="text-white font-medium">{log.text}</p>
                                    </div>
                                  ))
                                )}
                              </div>

                              <form onSubmit={handleSendInternalText} className="flex gap-2">
                                <input
                                  type="text"
                                  value={messageText}
                                  onChange={(e) => setMessageText(e.target.value)}
                                  placeholder="Write corporate note..."
                                  className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-amber-500/50"
                                />
                                <button
                                  type="submit"
                                  className="p-2 bg-amber-500 hover:bg-amber-400 text-[#050920] rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
                                >
                                  <Send size={14} />
                                </button>
                              </form>
                            </div>
                            
                          </div>

                          {/* Email Dispatcher & Meeting Scheduler */}
                          <div className="space-y-4">
                            
                            {/* Email form mockup */}
                            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3 shadow-sm text-xs">
                              <h5 className="font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                <Mail size={12} className="text-[#d4af37]" />
                                <span>Official Corporate Email proxy</span>
                              </h5>
                              
                              <div className="space-y-2">
                                <div className="grid grid-cols-5 gap-1.5 items-center">
                                  <span className="text-slate-400 font-bold col-span-1">To:</span>
                                  <input 
                                    className="col-span-4 bg-slate-900 border border-white/10 px-2 py-1 rounded text-[11px] font-mono text-slate-405 outline-none" 
                                    disabled 
                                    value={emailAddress} 
                                  />
                                </div>
                                <div className="grid grid-cols-5 gap-1.5 items-center">
                                  <span className="text-slate-400 font-bold col-span-1">Subject:</span>
                                  <input 
                                    className="col-span-4 bg-slate-900 border border-white/10 px-2 py-1 rounded text-[11.5px] font-semibold text-white outline-none focus:border-amber-500/50" 
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <textarea 
                                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-[11.5px] font-semibold text-white outline-none h-20 resize-none font-mono focus:border-amber-500/50" 
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEmailSentOverlay(true);
                                    setTimeout(() => setEmailSentOverlay(false), 2000);
                                    addAuditLog(`Dispatched corporate email payload to ${selectedEmployee.name}`, 'Info');
                                  }}
                                  className="w-full py-1.5 bg-[#d4af37] text-[#050920] font-black uppercase text-[10.5px] tracking-wider rounded-lg cursor-pointer hover:opacity-90 active:scale-95 transition-all text-center"
                                >
                                  Send Corporate Email
                                </button>
                                {emailSentOverlay && (
                                  <div className="text-center font-mono font-black text-emerald-400 uppercase text-[10px] mt-1">✔ SMTP MAIL RELAYED SUCCESSFUL.</div>
                                )}
                              </div>
                            </div>

                            {/* Meeting Scheduler mockup */}
                            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3 shadow-sm text-xs">
                              <h5 className="font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                <CalendarDays size={12} className="text-[#d4af37]" />
                                <span>Security Room Meeting Planner</span>
                              </h5>
                              <form onSubmit={handleScheduleVirtualMeeting} className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-slate-400 font-bold text-[9px] uppercase block mb-0.5">Date</label>
                                    <input 
                                      type="date"
                                      value={meetingDate}
                                      onChange={(e) => setMeetingDate(e.target.value)}
                                      className="w-full bg-slate-900 border border-white/10 rounded p-1 font-mono text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="text-slate-400 font-bold text-[9px] uppercase block mb-0.5">Time</label>
                                    <input 
                                      type="time"
                                      value={meetingTime}
                                      onChange={(e) => setMeetingTime(e.target.value)}
                                      className="w-full bg-slate-900 border border-white/10 rounded p-1 font-mono text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500"
                                      required
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-slate-400 font-bold text-[9px] uppercase block mb-0.5">Topic Agenda</label>
                                  <input 
                                    type="text"
                                    value={meetingTopic}
                                    onChange={(e) => setMeetingTopic(e.target.value)}
                                    placeholder="Quarterly audit targets..."
                                    className="w-full bg-slate-900 border border-white/10 rounded p-1.5 font-semibold text-white outline-none focus:border-amber-500"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-slate-400 font-bold text-[9px] uppercase block mb-0.5">Cryptographic Platform</label>
                                  <select 
                                    value={meetingPlatform}
                                    onChange={(e) => setMeetingPlatform(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded p-1 font-semibold text-slate-100 outline-none"
                                  >
                                    <option value="Apex Encrypted Live Meet">Apex Encrypted Secured Room (Internal)</option>
                                    <option value="Sovereign Telecom VoIP Direct">Sovereign Telecom VoIP</option>
                                    <option value="HSM Protected Terminal Stream">HSM Hardware Protected Direct Stream</option>
                                  </select>
                                </div>
                                <button
                                  type="submit"
                                  className="w-full py-2 bg-slate-950 text-slate-250 font-bold uppercase text-[9px] tracking-wider rounded-lg cursor-pointer hover:bg-slate-900 active:scale-95 transition-all text-center border border-white/5"
                                >
                                  Schedule Secure Link
                                </button>
                              </form>
                            </div>

                          </div>

                        </div>
                      </motion.div>
                    )}

                    {/* C. VIEW ATTENDANCE TAB CONTENT */}
                    {empViewTab === 'attendance' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 text-left mr-1"
                      >
                        <h4 className="font-black text-[#d4af37] uppercase tracking-widest text-[11px] border-b border-white/10 pb-2 flex items-center gap-1.5">
                          <Calendar size={13} />
                          <span>Attendance Ledger & Check-in Tracker</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          
                          {/* Mini stats indicators */}
                          <div className="space-y-4 md:col-span-1">
                            
                            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3 shadow-sm">
                              <h5 className="font-black text-white uppercase tracking-wide text-[10px]">Overview Statistics</h5>
                              
                              <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="p-2 border border-emerald-500/20 bg-emerald-500/10 rounded-lg">
                                  <span className="text-[8px] font-bold text-slate-400 uppercase">Present</span>
                                  <span className="block font-mono text-base font-black text-emerald-400">224 Days</span>
                                </div>
                                <div className="p-2 border border-rose-500/20 bg-rose-500/10 rounded-lg">
                                  <span className="text-[8px] font-bold text-slate-400 uppercase">Absent</span>
                                  <span className="block font-mono text-base font-black text-rose-450">4 Days</span>
                                </div>
                                <div className="p-2 border border-amber-500/20 bg-amber-500/10 rounded-lg">
                                  <span className="text-[8px] font-bold text-slate-400 uppercase">On Leave</span>
                                  <span className="block font-mono text-base font-black text-amber-400">12 Days</span>
                                </div>
                                <div className="p-2 border border-indigo-500/25 bg-indigo-500/10 rounded-lg">
                                  <span className="text-[8px] font-bold text-slate-400 uppercase">Ratio</span>
                                  <span className="block font-mono text-base font-black text-indigo-400">93.3%</span>
                                </div>
                              </div>
                            </div>

                            {/* Check in Log */}
                            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
                              <h5 className="font-black text-white uppercase tracking-wide text-[10px]">Recent Entry Logs</h5>
                              <div className="space-y-1.5 font-mono text-[10.5px]">
                                <div className="p-1.5 bg-slate-900 border border-white/5 rounded flex justify-between">
                                  <span className="text-slate-450">15-Jun-26 Check-In</span>
                                  <span className="text-emerald-400 font-extrabold">09:05 AM</span>
                                </div>
                                <div className="p-1.5 bg-slate-900 border border-white/5 rounded flex justify-between">
                                  <span className="text-slate-450">15-Jun-26 Check-Out</span>
                                  <span className="text-slate-350">05:31 PM</span>
                                </div>
                                <div className="p-1.5 bg-slate-900 border border-white/5 rounded flex justify-between">
                                  <span className="text-slate-450">14-Jun-26 Check-In</span>
                                  <span className="text-emerald-400 font-extrabold">08:58 AM</span>
                                </div>
                                <div className="p-1.5 bg-slate-900 border border-white/5 rounded flex justify-between">
                                  <span className="text-slate-450">14-Jun-26 Check-Out</span>
                                  <span className="text-slate-350">05:40 PM</span>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* june 2026 Monthly Calendar */}
                          <div className="md:col-span-2 p-4 bg-slate-950/50 border border-white/5 rounded-xl space-y-3 flex flex-col">
                            <h5 className="font-extrabold text-slate-200 text-[11px] uppercase tracking-wider text-center border-b border-white/10 pb-1 flex items-center justify-between">
                              <span>June 2026 Attendance Calendar</span>
                              <span className="text-[9.5px] text-[#d4af37] font-sans capitalize font-normal">Legend: Green (Present) | Yellow (Leave) | Red (Absent)</span>
                            </h5>

                            <div className="grid grid-cols-7 gap-1 flex-1 font-mono text-[10.5px] text-center select-none">
                              {/* Headers */}
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-[#d4af37] font-black text-[9px] uppercase p-1 bg-amber-500/10 rounded border border-[#d4af37]/15">{day}</div>
                              ))}

                              {/* Empty padding for the June month starting day */}
                              <div className="p-2 border border-transparent text-slate-800 opacity-0"></div>

                              {/* Render 30 days of the month June 2026 */}
                              {Array.from({ length: 30 }).map((_, index) => {
                                const dayNumber = index + 1;
                                
                                // Synthetically decide status for day
                                let cellBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/15";
                                if (dayNumber === 5 || dayNumber === 12) {
                                  cellBg = "bg-rose-500/10 text-rose-400 border-rose-500/15"; // Absent days
                                } else if (dayNumber === 14 || dayNumber === 21) {
                                  cellBg = "bg-amber-500/10 text-amber-400 border-amber-500/15"; // Leaves
                                } else if (dayNumber > 15) {
                                  // future days in the system (since current local is 15-Jun-2026)
                                  cellBg = "bg-slate-900/40 text-slate-500 border-white/5 opacity-60";
                                }

                                return (
                                  <div 
                                    key={dayNumber} 
                                    className={`p-2 rounded border font-extrabold transition-all group flex flex-col justify-between h-10 ${cellBg}`}
                                  >
                                    <span className="text-[10px] text-left">{dayNumber}</span>
                                    {dayNumber <= 15 ? (
                                      <span className="text-[8px] uppercase tracking-tighter text-right font-black">
                                        {dayNumber === 5 || dayNumber === 12 ? 'ABS' : dayNumber === 14 ? 'LVE' : 'PRE'}
                                      </span>
                                    ) : (
                                      <span className="text-[8px] text-slate-600 text-right">SCHED</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}

                    {/* D. VIEW PERFORMANCE TAB CONTENT */}
                    {empViewTab === 'performance' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 text-left mr-1"
                      >
                        <h4 className="font-black text-[#d4af37] uppercase tracking-widest text-[11px] border-b border-white/10 pb-2 flex items-center gap-1.5">
                          <TrendingUp size={13} />
                          <span>Performance Reviews & Evaluation Index</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          
                          {/* Rating Card */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-2.5 shadow-sm">
                            <h5 className="font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                              <Star size={12} className="text-[#d4af37]" />
                              <span>SLA Performance Score</span>
                            </h5>
                            <div className="text-center py-4 bg-slate-900 border border-white/5 rounded-xl">
                              <span className="text-4xl font-mono font-black text-[#d4af37] block">★ 4.75</span>
                              <span className="text-[9px] font-bold text-emerald-400 uppercase mt-0.5 block">GRADE EXCELLATIVE EXECUTIVE</span>
                            </div>
                            <p className="text-[9.5px] text-slate-450 text-center uppercase tracking-wider font-bold">Ranked #4 in total regional segment.</p>
                          </div>

                          {/* Historical Review Ledger */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-2 shadow-sm">
                            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Quarterly Review history</h5>
                            <div className="space-y-1.5 text-[11px] font-medium">
                              <div className="p-2 bg-slate-900 border border-white/5 rounded flex justify-between">
                                <span className="font-bold">Q1 2026 Audit</span>
                                <span className="font-mono font-black text-[#d4af37]">94.2% Passed</span>
                              </div>
                              <div className="p-2 bg-slate-900 border border-white/5 rounded flex justify-between">
                                <span className="font-bold">Q4 2025 Audit</span>
                                <span className="font-mono font-black text-[#d4af37]">96.8% Passed</span>
                              </div>
                              <div className="p-2 bg-slate-900 border border-white/5 rounded flex justify-between">
                                <span className="font-bold">Q3 2025 Audit</span>
                                <span className="font-mono font-black text-amber-500">89.4% Warning</span>
                              </div>
                            </div>
                          </div>

                          {/* Promotion Ledger */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-2 shadow-sm md:col-span-2 lg:col-span-1">
                            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Career & Promotion records</h5>
                            <div className="space-y-1.5 text-[11px] font-medium">
                              <div className="p-2 bg-slate-900 border border-[#d4af37]/25 rounded">
                                <p className="font-bold text-[#d4af37]">Jun 2025 Posting</p>
                               <p className="text-slate-400 text-[10px]">Promoted to Senior relations specialist at Sovereign Command</p>
                              </div>
                              <div className="p-2 bg-slate-900 border border-[#d4af37]/25 rounded">
                                <p className="font-bold text-[#d4af37]">Jan 2024 Posting</p>
                                <p className="text-slate-400 text-[10px]">Joined node from London District Node Office</p>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Manager Feedback Text */}
                        <div className="p-4 bg-amber-500/[0.03] border border-amber-400/10 rounded-xl space-y-2.5">
                          <h5 className="font-extrabold text-white text-[10px] uppercase tracking-widest">Active supervisor feed reviews</h5>
                          <div className="p-3 bg-slate-900 border border-white/5 rounded-lg text-[11.5px] leading-relaxed font-medium">
                            <span className="text-[#d4af37] font-black font-mono text-[10px] uppercase block mb-1">Feedback signed by {manager.name} (Direct Manager):</span>
                            "{selectedEmployee.name} displays intense task performance capability within regional audit nodes. Consistently manages currency distribution protocols error-free and establishes exceptional workspace communication logs with our customer base. Recommend for upcoming administrative promotion cycle."
                          </div>
                        </div>

                      </motion.div>
                    )}

                    {/* E. DOWNLOAD REPORT TAB CONTENT */}
                    {empViewTab === 'report' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 text-left mr-1"
                      >
                        <h4 className="font-black text-[#d4af37] uppercase tracking-widest text-[11px] border-b border-white/10 pb-2 flex items-center gap-1.5">
                          <FileText size={13} />
                          <span>Automated Crypto-Report Generator Station</span>
                        </h4>

                        <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-4">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide font-black">
                            Select desired export payload layout profile to trigger cryptographic system audit documents package.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            
                            <button
                              type="button"
                              onClick={() => handleExportClick('pdf')}
                              className="p-4 bg-slate-900 hover:bg-slate-850 border border-[#d4af37]/35 hover:border-[#d4af37] rounded-xl text-center space-y-2 transition-all cursor-pointer shadow-sm flex flex-col items-center justify-between"
                            >
                              <FileText size={24} className="text-[#d4af37] block" />
                              <div>
                                <span className="font-black text-xs text-white block">Export To PDF format</span>
                                <span className="text-[9px] text-[#555555] block mt-1">SLA Standard Document</span>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleExportClick('excel')}
                              className="p-4 bg-slate-900 hover:bg-slate-850 border border-[#d4af37]/35 hover:border-[#d4af37] rounded-xl text-center space-y-2 transition-all cursor-pointer shadow-sm flex flex-col items-center justify-between"
                            >
                              <FileSpreadsheet size={24} className="text-amber-500 block" />
                              <div>
                                <span className="font-black text-xs text-white block">Export Data to Excel</span>
                                <span className="text-[9px] text-[#555555] block mt-1">Dossier Sheet Matrix</span>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleExportClick('print')}
                              className="p-4 bg-slate-900 hover:bg-slate-850 border border-[#d4af37]/35 hover:border-[#d4af37] rounded-xl text-center space-y-2 transition-all cursor-pointer shadow-sm flex flex-col items-center justify-between"
                            >
                              <Printer size={24} className="text-indigo-400 block" />
                              <div>
                                <span className="font-black text-xs text-white block">Print Standard Report</span>
                                <span className="text-[9px] text-[#555555] block mt-1">Direct Terminal Printout</span>
                              </div>
                            </button>

                          </div>

                          {/* Progress bar simulation for download */}
                          {exportMode !== 'none' && (
                            <div className="p-4 bg-slate-900 border border-[#d4af37]/35 rounded-xl space-y-2 animate-pulse">
                              <div className="flex justify-between font-mono text-[10.5px] font-black text-[#d4af37]">
                                <span>SIMULATING ENCRYPTED EXPORT TARGET: {exportMode.toUpperCase()}...</span>
                                <span>{exportProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-950 rounded-full h-2 shadow-inner border border-white/5 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-amber-400 to-[#d4af37] h-2 rounded-full transition-all duration-100" 
                                  style={{ width: `${exportProgress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Preview paper layout sheet */}
                          <div className="bg-slate-900 border border-white/5 rounded-xl p-6 font-mono text-[10.5px] text-slate-350 space-y-4 shadow-md max-h-72 overflow-y-auto leading-relaxed scrollbar-thin">
                            <div className="text-center border-b border-white/10 pb-2">
                              <h3 className="font-extrabold text-xs text-white uppercase tracking-widest">APEX NATIONAL BANK CO-CORE LEDGER</h3>
                              <p className="text-[8px] uppercase tracking-widest text-[#d4af37] mt-1 font-sans">CRYPTOGRAPHIC ADM Clearance: CLR-SEC-LOGS</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-left">
                              <div><span className="font-black text-[#d4af37]">EMPLOYEE ID:</span> {selectedEmployee.id}</div>
                              <div><span className="font-black text-[#d4af37]">FULL NAME:</span> {selectedEmployee.name}</div>
                              <div><span className="font-black text-[#d4af37]">CLEARANCE LEVEL:</span> {clearanceLevel}</div>
                              <div><span className="font-black text-[#d4af37]">DEPARTMENT:</span> {selectedEmployee.department}</div>
                              <div><span className="font-black text-[#d4af37]">DESIGNATION:</span> {selectedEmployee.designation}</div>
                              <div><span className="font-black text-[#d4af37]">STATION NODE:</span> {manager.branchName}</div>
                            </div>

                            <hr className="border-white/5" />

                            <div>
                              <span className="font-black block uppercase mb-1 text-white">■ PERFORMANCE KPI RECORD MATRIX:</span>
                              <p>Rating state: 4.75 CSAT Unit points. Verified attendance average: 93.3% ratio limit bounds. Monthly calendar verified clean. Auditing checklists verified successfully processed on core branch network database.</p>
                            </div>

                            <hr className="border-white/5" />

                            <div className="text-[8.5px] text-slate-500">
                              System Hash: 0x9BFFCF82E0947AD6BB9332204E99C128 / Signature Certified Admin HR Core Sovereign
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}

                    {/* F. BRANCH ANALYTICS DASHBOARD CONTENT (luxurious royal purple/gold) */}
                    {empViewTab === 'analytics' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-5 text-left text-xs text-white mr-1"
                      >
                        <h4 className="font-black text-[#d4af37] uppercase tracking-widest text-[11px] border-b border-white/10 pb-2 flex items-center gap-1.5">
                          <Award size={13} className="text-amber-400" />
                          <span>Branch Node Analytics Dashboard Controller</span>
                        </h4>

                        {/* Overview Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Box 1: BRANCH MASTER INFO */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3.5 shadow-sm">
                            <h5 className="font-black text-[#d4af37] uppercase tracking-wider text-[10px] pb-1 border-b border-white/5 flex items-center gap-1.5">
                              <Building2 size={12} className="text-amber-400" />
                              <span>Sovereign Branch Information</span>
                            </h5>
                            <div className="space-y-2 mt-2 font-medium text-[11.5px] leading-relaxed">
                              <div className="flex justify-between"><span className="text-slate-400">Branch Name:</span><span className="font-bold text-white">{manager.branchName}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Branch Code:</span><span className="font-bold font-mono text-[#d4af37]">{manager.branchCode}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Branch Location:</span><span className="font-semibold text-slate-200">{manager.branchLocation}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Branch Manager:</span><span className="font-bold text-white">{manager.name}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Opening Date:</span><span className="font-semibold font-mono text-slate-350">{manager.branchOpeningDate || "2018-05-10"}</span></div>
                            </div>
                          </div>

                          {/* Box 2: EMPLOYEE STATS ANALYTICS */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3.5 shadow-sm">
                            <h5 className="font-black text-[#d4af37] uppercase tracking-wider text-[10px] pb-1 border-b border-white/5 flex items-center gap-1.5">
                              <Users size={12} className="text-amber-400" />
                              <span>Staff Demographics Directory</span>
                            </h5>
                            <div className="space-y-2 mt-2 font-medium text-[11.5px] leading-relaxed">
                              <div className="flex justify-between"><span className="text-slate-400 font-bold">Total Staff Count:</span><span className="font-bold font-mono text-[#d4af37]">{totalEmployees} Employees</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Active Staff Duty:</span><span className="font-bold text-emerald-400">{activeEmployees} Active</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">On Leave Duty:</span><span className="font-bold text-amber-400">{onLeaveEmployees} On Leave</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Contractor Base:</span><span className="font-bold text-indigo-400">{contractEmployees} Officers</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Suspended Registry:</span><span className="font-bold text-rose-400">{suspendedEmployees} Members</span></div>
                            </div>
                          </div>

                          {/* Box 3: PERFORMANCE METRICS */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3.5 shadow-sm">
                            <h5 className="font-black text-[#d4af37] uppercase tracking-wider text-[10px] pb-1 border-b border-white/5 flex items-center gap-1.5">
                              <TrendingUp size={12} className="text-amber-400" />
                              <span>Performance & Productivity Logs</span>
                            </h5>
                            <div className="space-y-2 mt-2 font-medium text-[11.5px] leading-relaxed">
                              <div className="flex justify-between"><span className="text-slate-400">Branch Performance index:</span><span className="font-black text-[#d4af37] font-mono">{branchPerformanceScore}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Monthly Node Revenue:</span><span className="font-bold text-emerald-400 font-mono">{manager.performance.revenue}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Loan Processing Target:</span><span className="font-extrabold text-white">94.2% Success</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">CSAT Score:</span><span className="font-bold text-[#d4af37]">4.75 CSAT Ratio</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Workspace Productivity Index:</span><span className="font-mono font-black text-emerald-400">95.8% Rated</span></div>
                            </div>
                          </div>

                          {/* Box 4: FINANCIAL KPI BALANCES */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3.5 shadow-sm">
                            <h5 className="font-black text-[#d4af37] uppercase tracking-wider text-[10px] pb-1 border-b border-white/5 flex items-center gap-1.5">
                              <Shield size={12} className="text-amber-400" />
                              <span>Financial Assets Auditing Ledger</span>
                            </h5>
                            <div className="space-y-2 mt-2 font-medium text-[11.5px] leading-relaxed">
                              <div className="flex justify-between"><span className="text-slate-400">Total Deposits Managed:</span><span className="font-bold text-emerald-405 font-mono">{manager.performance.totalDeposits}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Total Disbursed Loans:</span><span className="font-bold text-rose-450 font-mono">{manager.performance.totalLoans}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Credit Card Accounts:</span><span className="font-semibold text-slate-200">1,420 Active CCs</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Fixed Deposits Locked:</span><span className="font-semibold text-slate-200">524 Ledger Nodes</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Portfolio Investment:</span><span className="font-semibold text-slate-200">185 Managed Accounts</span></div>
                            </div>
                          </div>

                        </div>

                        {/* GRAPH CHARTS WITH NEW GOLD/SLATE PALETTE */}
                        <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-4">
                          <h5 className="font-black text-[#d4af37] uppercase tracking-wider text-[10px] text-center">Interactive Branch Visual Graphs Area</h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Chart 1: Staff Distribution Pie */}
                            <div className="p-3 bg-slate-950/30 border border-white/5 rounded-xl flex flex-col items-center">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2 block text-center">Employee Roles Distribution</span>
                              <div className="w-full h-44 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={employeeDistData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={45}
                                      outerRadius={65}
                                      paddingAngle={3}
                                      dataKey="value"
                                    >
                                      {employeeDistData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ fontSize: '10px', color: '#fff', backgroundColor: '#090f2b', borderColor: '#d4af3730', borderRadius: '8px' }} />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="flex flex-wrap gap-2 justify-center mt-1 text-[8.5px] font-bold uppercase select-none font-sans">
                                {employeeDistData.map((e, idx) => (
                                  <span key={idx} className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span>{e.name} ({e.value})</span>
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Chart 2: Department Distribution Chart */}
                            <div className="p-3 bg-slate-950/30 border border-white/5 rounded-xl flex flex-col items-center">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2 block text-center font-sans">Department Distribution Ratio</span>
                              <div className="w-full h-44">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={deptDistData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff04" />
                                    <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 'bold', fill: '#94a3b8' }} tickLine={false} />
                                    <YAxis tick={{ fontSize: 8, fontWeight: 'bold', fill: '#94a3b8' }} tickLine={false} />
                                    <Tooltip contentStyle={{ fontSize: '10px', color: '#fff', backgroundColor: '#090f2b', borderColor: '#d4af3720' }} />
                                    <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Chart 3: Attendance Quarterly Line */}
                            <div className="p-3 bg-slate-950/30 border border-white/5 rounded-xl flex flex-col items-center">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2 block text-center font-sans">Branch Attendance Ratio Trend</span>
                              <div className="w-full h-44 font-mono text-[9px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff04" />
                                    <XAxis dataKey="month" tick={{ fontSize: 8, fontWeight: 'bold', fill: '#94a3b8' }} tickLine={false} />
                                    <YAxis domain={[90, 100]} tick={{ fontSize: 8, fontWeight: 'bold', fill: '#94a3b8' }} tickLine={false} />
                                    <Tooltip contentStyle={{ fontSize: '10px', color: '#fff', backgroundColor: '#090f2b' }} />
                                    <Line type="monotone" dataKey="rate" stroke="#d4af37" strokeWidth={3} dot={{ r: 3, fill: '#bca030' }} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Chart 4: Revenue Trend Chart */}
                            <div className="p-3 bg-slate-950/30 border border-white/5 rounded-xl flex flex-col items-center">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2 block text-center font-sans">Monthly Revenue Stream Trend Chart</span>
                              <div className="w-full h-44 text-[8px] font-mono">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff04" />
                                    <XAxis dataKey="month" tick={{ fontSize: 8, fontWeight: 'bold', fill: '#94a3b8' }} tickLine={false} />
                                    <YAxis tick={{ fontSize: 7, fontWeight: 'bold', fill: '#94a3b8' }} tickLine={false} />
                                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']} contentStyle={{ fontSize: '10px', color: '#fff', backgroundColor: '#090f2b' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#bca030" fill="rgba(212, 175, 55, 0.15)" strokeWidth={2.5} />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                          </div>
                        </div>

                      </motion.div>
                    )}

                  </div>

                  {/* BOTTOM ACTION BUTTONS ROW LAYOUT */}
                  <div className="mt-6 pt-4 border-t border-white/10 select-none">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full text-slate-100">
                      
                      <button
                        type="button"
                        onClick={() => {
                          setEmpViewTab('profile');
                          addAuditLog(`Switched view profile tab and retrieved complete records for [ID: ${selectedEmployee.id}]`, 'Info');
                        }}
                        className={`py-2 px-1 hover:brightness-95 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-250 active:scale-[0.97] cursor-pointer flex items-center justify-center gap-1 shadow-sm ${
                          empViewTab === 'profile'
                            ? 'bg-amber-500/10 border-2 border-amber-400 text-[#d4af37] font-extrabold'
                            : 'bg-slate-900 border-2 border-white/5 text-slate-350 font-semibold'
                        }`}
                      >
                        <User size={13} className="text-amber-400 shrink-0" />
                        <span>View Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEmpViewTab('contact');
                          addAuditLog(`Entered Intranet direct Communications module for ${selectedEmployee.name}`, 'Info');
                        }}
                        className={`py-2 px-1 hover:brightness-95 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-250 active:scale-[0.97] cursor-pointer flex items-center justify-center gap-1 shadow-sm ${
                          empViewTab === 'contact'
                            ? 'bg-amber-500/10 border-2 border-amber-400 text-[#d4af37] font-extrabold'
                            : 'bg-slate-900 border-2 border-white/5 text-slate-350 font-semibold'
                        }`}
                      >
                        <Mail size={13} className="text-amber-400 shrink-0" />
                        <span>Contact Employee</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEmpViewTab('attendance');
                          addAuditLog(`Analyzed Attendance statistics and calendars logs for employee: ${selectedEmployee.name}`, 'Info');
                        }}
                        className={`py-2 px-1 hover:brightness-95 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-250 active:scale-[0.97] cursor-pointer flex items-center justify-center gap-1 shadow-sm ${
                          empViewTab === 'attendance'
                            ? 'bg-amber-500/10 border-2 border-amber-400 text-[#d4af37] font-extrabold'
                            : 'bg-slate-900 border-2 border-white/5 text-slate-350 font-semibold'
                        }`}
                      >
                        <Calendar size={13} className="text-amber-400 shrink-0" />
                        <span>View Attendance</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEmpViewTab('performance');
                          addAuditLog(`Scoped micro KPI matrices and promotion parameters for ${selectedEmployee.name}`, 'Info');
                        }}
                        className={`py-2 px-1 hover:brightness-95 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-250 active:scale-[0.97] cursor-pointer flex items-center justify-center gap-1 shadow-sm ${
                          empViewTab === 'performance'
                            ? 'bg-amber-500/10 border-2 border-amber-400 text-[#d4af37] font-extrabold'
                            : 'bg-slate-900 border-2 border-white/5 text-slate-350 font-semibold'
                        }`}
                      >
                        <TrendingUp size={13} className="text-amber-400 shrink-0" />
                        <span>View Performance</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEmpViewTab('report');
                          addAuditLog(`Loaded Cryptographic Automated Reporting panel for ${selectedEmployee.name}`, 'Info');
                        }}
                        className={`py-2 px-1 hover:brightness-95 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-250 active:scale-[0.97] cursor-pointer flex items-center justify-center gap-1 shadow-sm ${
                          empViewTab === 'report'
                            ? 'bg-amber-500/10 border-2 border-amber-400 text-[#d4af37] font-extrabold'
                            : 'bg-slate-900 border-2 border-white/5 text-slate-350 font-semibold'
                        }`}
                      >
                        <Download size={13} className="text-amber-400 shrink-0" />
                        <span>Download Report</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEmpViewTab('analytics');
                          addAuditLog(`Inspected detailed comprehensive Branch Analytics panel of branch ${manager.branchCode}`, 'Info');
                        }}
                        className={`py-2 px-1 hover:brightness-95 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-250 active:scale-[0.97] cursor-pointer flex items-center justify-center gap-1 shadow-md ${
                          empViewTab === 'analytics'
                            ? 'bg-amber-500/10 border-2 border-amber-400 text-[#d4af37] font-extrabold'
                            : 'bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 text-[#d4af37] font-extrabold hover:border-[#d4af37]'
                        }`}
                      >
                        <Award size={13} className="text-amber-400 shrink-0" />
                        <span>Branch Analytics</span>
                      </button>

                    </div>
                  </div>

                  {/* Returning back to top line Manager Profile */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                    <p className="text-[9.5px] text-slate-500 font-mono">CORE IDENTITY HASH CERTIFICATION: SEC-APEX-ACTIVE</p>
                    <button
                      type="button"
                      onClick={() => setSelectedEmployee(null)}
                      className="py-2 px-5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/35 text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Return to Manager Profile
                    </button>
                  </div>

                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
