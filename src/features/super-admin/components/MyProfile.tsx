import { useState, useRef } from 'react';
import { 
  User, 
  Shield, 
  Briefcase, 
  Lock, 
  Activity, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Edit3, 
  Key, 
  Smartphone,
  Info,
  Camera,
  Save,
  X,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BrandLogo from './BrandLogo';

export default function MyProfile() {
  const [activeSubTab, setActiveSubTab] = useState('general');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoUrl, setPhotoUrl] = useState("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300");
  const [isEditing, setIsEditing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Admin Data moved to state for editing
  const [profileData, setProfileData] = useState({
    name: "C. Sayeema K.",
    email: "khanamsayeemakousar@gmail.com",
    officialEmail: "sayeema.k@apexbank.superadmin.int",
    employeeId: "EMP-SA-001",
    role: "Super Admin",
    clearanceLevel: "Level 5 (Sovereign)",
    department: "Executive Operations & Digital Governance",
    status: "Active / Online",
    joinedDate: "October 12, 2023",
    lastLogin: "June 15, 2026, 03:13:35 AM",
    lastLogout: "June 14, 2026, 11:45:20 PM",
    dob: "August 24, 1995",
    gender: "Female",
    mobile: "+91 98765 43210",
    altMobile: "+91 98765 01234",
    address: "7th Heaven Residency, Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCode: "560066",
    reportingAuthority: "Board of Directors / Apex Sovereign Council",
    branchAssigned: "HQ - Silicon Valley Hub",
    yearsOfService: "2.7 Years",
    employmentStatus: "Permanent / Tenured",
    twoFactorStatus: "Enabled (HSM Multi-factor)",
    loginLocation: "Bengaluru, India (IP: 192.168.1.144)",
    deviceInfo: "Apex Secure Terminal v5.4 (macOS / Chrome 125)",
    totalLoginCount: 1244,
    accountCreatedOn: "October 10, 2023",
    lastUpdatedOn: "June 01, 2026",
    currentSessionDuration: "2h 45m"
  });

  const [tempProfileData, setTempProfileData] = useState(profileData);

  const handleAction = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      handleAction("Permission denied or camera not found.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setPhotoUrl(dataUrl);
        handleAction("Snapshot captured and verified.");
        stopCamera();
      }
    }
  };

  const handleSaveChanges = () => {
    setProfileData(tempProfileData);
    setIsEditing(false);
    handleAction("Institutional registry updated successfully.");
  };

  const handleCancelChanges = () => {
    setTempProfileData(profileData);
    setIsEditing(false);
    handleAction("Changes discarded.");
  };

  const updateTempField = (field: keyof typeof profileData, value: string) => {
    setTempProfileData(prev => ({ ...prev, [field]: value }));
  };

  const permissions = [
    { name: "Full Core Access", color: "bg-pink-100 text-[#FF6BCB] border-[#FFB6D9]" },
    { name: "Sovereign Approval Rights", color: "bg-pink-100 text-[#D97BFF] border-[#E9DDF5]" },
    { name: "Global Transaction Audit", color: "bg-emerald-100 text-emerald-600 border-emerald-200" },
    { name: "Institutional Risk Scoring", color: "bg-blue-100 text-blue-600 border-blue-200" },
    { name: "System Config Read/Write", color: "bg-amber-100 text-amber-600 border-amber-200" },
    { name: "HSM Key Management", color: "bg-slate-100 text-slate-600 border-slate-200" }
  ];

  const recentActivity = [
    { action: "Secure Login", module: "Auth System", time: "03:13 AM", date: "Today" },
    { action: "Loan Batch Approval", module: "Credit Operations", time: "05:22 PM", date: "Yesterday" },
    { action: "Branch Audit Finalized", module: "Global Operations", time: "11:45 AM", date: "Yesterday" },
    { action: "Security Patch Applied", module: "System Config", time: "09:30 PM", date: "12 June" },
    { action: "KYC Bulk Verification", module: "Compliance", time: "02:15 PM", date: "10 June" }
  ];

  const documents = [
    { name: "Employee ID Card", icon: User },
    { name: "Appointment Letter", icon: FileText },
    { name: "Service Certificate", icon: CheckCircle2 },
    { name: "Authorization Certificate", icon: Shield }
  ];

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-100 text-[#d946ef]">
        <Icon size={20} />
      </div>
      <h3 className="text-xl font-black text-[#d946ef] tracking-tight uppercase font-display">{title}</h3>
    </div>
  );

  const InfoField = ({ label, value, field, fullWidth = false }: { label: string, value: string, field?: keyof typeof profileData, fullWidth?: boolean }) => (
    <div className={`${fullWidth ? 'col-span-full' : 'col-span-1'} space-y-1.5 px-1 relative group/field`}>
      <p className="text-[10px] font-black text-[#d946ef]/60 uppercase tracking-[0.2em]">{label}</p>
      {isEditing && field ? (
        <input 
          type="text" 
          value={tempProfileData[field]} 
          onChange={(e) => updateTempField(field, e.target.value)}
          className="w-full bg-pink-50/50 border border-pink-100 rounded-lg px-2 py-1 text-[15px] font-bold text-[#d946ef] focus:outline-none focus:border-pink-300 transition-all font-sans"
        />
      ) : (
        <p className="text-[15px] font-bold text-[#d946ef] leading-tight">{value}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-12 relative">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#d946ef] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="text-pink-300" />
          <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
        </div>
      )}
      
      {/* Profile Header Hero */}
      <div className="relative overflow-hidden luxury-card border-white/40 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-r from-[#fbcfe8] via-[#f472b6] to-[#ec4899] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
        
        <div className="relative pt-24 pb-10 px-10 flex flex-col md:flex-row items-end gap-8">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-xl p-1 shadow-2xl border-4 border-white/60 overflow-hidden group relative">
              <img 
                src={photoUrl} 
                alt="C. Sayeema K." 
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div 
                className="absolute inset-x-0 bottom-0 top-[60%] bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-around cursor-pointer p-2"
              >
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Upload Photo"
                >
                  <Edit3 className="text-white w-5 h-5 drop-shadow-md" />
                </button>
                <div className="w-[1px] h-6 bg-white/20" />
                <button 
                  onClick={startCamera}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Capture via Camera"
                >
                  <Camera className="text-white w-5 h-5 drop-shadow-md" />
                </button>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPhotoUrl(URL.createObjectURL(e.target.files[0]));
                  handleAction("Profile photo updated successfully!");
                }
              }}
            />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#00E676] border-4 border-white shadow-xl flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-4xl font-black text-[#d946ef] tracking-tighter font-display mb-1">{profileData.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-pink-100 text-[#d946ef] rounded-full text-[11px] font-black uppercase tracking-[0.1em] shadow-sm border border-pink-200">
                {profileData.role}
              </span>
              <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md text-[#d946ef] border border-pink-200 rounded-full text-[11px] font-black uppercase tracking-[0.1em]">
                {profileData.clearanceLevel}
              </span>
              <div className="h-5 w-[1px] bg-[#d946ef]/10 mx-1" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#d946ef]/80 uppercase tracking-wide">
                <Briefcase size={15} />
                {profileData.department}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 text-right">
            <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/40">
              <p className="text-[10px] font-black text-[#d946ef]/70 uppercase tracking-[0.2em] mb-0.5">Core Identity</p>
              <p className="text-sm font-black text-[#d946ef] font-mono tracking-widest">{profileData.employeeId}</p>
            </div>
            <p className="text-[10px] font-black text-[#d946ef]/70 uppercase tracking-[0.2em]">Session Synced: <span className="text-[#d946ef] font-bold">{profileData.lastLogin}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Information Sections */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Personal Information */}
          <div className="luxury-card p-10 border-white/40 hover:bg-white/70 transition-all duration-500">
            <div className="flex items-center justify-between mb-10">
              <SectionHeader icon={User} title="Personal Architecture" />
              <div className="flex gap-4">
                {isEditing ? (
                  <>
                    <button onClick={handleCancelChanges} className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 border border-slate-200 rounded-[16px] text-xs font-black uppercase tracking-widest shadow-sm hover:scale-[1.05] active:scale-[0.95] transition-all">
                      <X size={16} />
                      Cancel
                    </button>
                    <button onClick={handleSaveChanges} className="flex items-center gap-2 px-6 py-3 bg-[#d946ef] text-white border border-[#d946ef] rounded-[16px] text-xs font-black uppercase tracking-widest shadow-sm hover:scale-[1.05] active:scale-[0.95] transition-all">
                      <Save size={16} />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button onClick={() => { setIsEditing(true); setTempProfileData(profileData); handleAction('Registry unlocked for executive modification'); }} className="flex items-center gap-2 px-6 py-3 bg-pink-100 text-[#d946ef] border border-pink-200 rounded-[16px] text-xs font-black uppercase tracking-widest shadow-sm hover:scale-[1.05] active:scale-[0.95] transition-all">
                    <Edit3 size={16} />
                    Edit Registry
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-10">
              <InfoField label="Full Legal Name" value={profileData.name} field="name" />
              <InfoField label="Temporal Origin (DOB)" value={profileData.dob} field="dob" />
              <InfoField label="Gender Identity" value={profileData.gender} field="gender" />
              
              <InfoField label="Primary Comms" value={profileData.mobile} field="mobile" />
              <InfoField label="Auxiliary Line" value={profileData.altMobile} field="altMobile" />
              <InfoField label="Digital Liaison (Personal)" value={profileData.email} field="email" />
              
              <InfoField label="Institutional Endpoint (Official)" value={profileData.officialEmail} field="officialEmail" fullWidth />
              
              <InfoField label="Metropolitan Hub" value={profileData.city} field="city" />
              <InfoField label="Provincial Sector" value={profileData.state} field="state" />
              <InfoField label="Sovereign Territory" value={profileData.country} field="country" />
              
              <InfoField label="Operational Residence" value={profileData.address} field="address" fullWidth />
            </div>
          </div>

          {/* Employment Information */}
          <div className="luxury-card p-10 border-white/40 hover:bg-white/70 transition-all duration-500">
            <SectionHeader icon={Briefcase} title="Institutional Tenure" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
              <div className="space-y-8">
                <InfoField label="Assigned Designation" value={profileData.role} field="role" />
                <InfoField label="Division / cluster" value={profileData.department} field="department" />
                <InfoField label="Reporting Nexus" value={profileData.reportingAuthority} field="reportingAuthority" />
              </div>
              <div className="space-y-8">
                <InfoField label="Deployment Branch" value={profileData.branchAssigned} field="branchAssigned" />
                <InfoField label="Activation Date" value={profileData.joinedDate} field="joinedDate" />
                <InfoField label="Service Lifespan" value={profileData.yearsOfService} field="yearsOfService" />
                <InfoField label="Tenure Status" value={profileData.employmentStatus} field="employmentStatus" />
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="luxury-card p-10 border-white/40 hover:bg-white/70 transition-all duration-500">
            <div className="flex items-center justify-between mb-10">
              <SectionHeader icon={Lock} title="Security Protocols" />
              <div className="flex gap-4">
                <button onClick={() => handleAction('Key update procedures initiated')} className="flex items-center gap-2 px-6 py-3 bg-[#d946ef] text-white rounded-[16px] text-xs font-black uppercase tracking-widest shadow-sm hover:bg-[c026d3] transition-all">
                  <Key size={16} />
                  Update Key
                </button>
                <button onClick={() => handleAction('Opening liaison devices panel')} className="flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-md text-[#d946ef] border border-pink-200 rounded-[16px] text-xs font-black uppercase tracking-widest hover:bg-white/80 transition-all">
                  <Smartphone size={16} />
                  Liaison Devices
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 group hover:bg-emerald-50 transition-all duration-300">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">HSM 2FA Status</p>
                <div className="flex items-center gap-2 text-emerald-700 font-black text-sm">
                  <CheckCircle2 size={18} />
                  {profileData.twoFactorStatus}
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-pink-50/50 border border-pink-100 group hover:bg-pink-50 transition-all duration-300">
                <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-2">Inbound IP Hash</p>
                <p className="text-[#d946ef] font-black text-sm font-mono tracking-wider truncate">{profileData.loginLocation}</p>
              </div>
              <div className="p-6 rounded-3xl bg-purple-50/50 border border-purple-100 group hover:bg-purple-50 transition-all duration-300">
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-2">Authenticated OS</p>
                <p className="text-[#d946ef] font-black text-sm truncate">{profileData.deviceInfo}</p>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-white/30 grid grid-cols-1 md:grid-cols-2 gap-10">
              <InfoField label="Last Verification Event" value={profileData.lastLogin} field="lastLogin" />
              <InfoField label="Cryptographic Key Age" value="12 May, 2026 (33 days ago)" />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="luxury-card p-10 border-white/40">
            <SectionHeader icon={Activity} title="Operational Ledger" />
            <div className="space-y-5">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-center gap-6 p-5 rounded-[24px] bg-white/50 border border-white/60 hover:bg-white/80 hover:scale-[1.01] transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#d946ef] flex items-center justify-center border border-pink-200 group-hover:scale-110 transition-transform duration-500">
                    <Activity size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-black text-[#d946ef] tracking-tight">{act.action}</p>
                    <p className="text-[10px] font-black text-[#d946ef]/60 uppercase tracking-[0.2em] mt-0.5">{act.module}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#d946ef]">{act.time}</p>
                    <p className="text-[10px] font-black text-[#d946ef]/50 uppercase tracking-widest">{act.date}</p>
                  </div>
                  <ChevronRight size={20} className="text-[#d946ef]/30 group-hover:text-[#d946ef] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
            <button onClick={() => handleAction('Loading full audit logs...')} className="w-full mt-10 py-5 rounded-[20px] bg-white/50 border border-pink-200 text-[11px] font-black text-[#d946ef] uppercase tracking-[0.3em] hover:bg-white/80 transition-all shadow-sm">
              Inquire Full Audit Logs
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Widgets */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Actions Card */}
          <div className="luxury-card p-8 border-white/40">
            <h4 className="text-[11px] font-black text-[#d946ef]/60 uppercase tracking-[0.3em] mb-8">Executive Commands</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Archive Report', icon: Download, color: 'bg-pink-50 hover:bg-pink-100 border-pink-100' },
                { label: 'Security Panel', icon: Shield, color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100' },
                { label: 'Ledger History', icon: Activity, color: 'bg-purple-50 hover:bg-purple-100 border-purple-100' },
                { label: 'Data Export', icon: ExternalLink, color: 'bg-rose-50 hover:bg-rose-100 border-rose-100' }
              ].map((item, i) => (
                <button onClick={() => handleAction(`Command initiated: ${item.label}`)} key={i} className={`flex flex-col items-center justify-center p-6 rounded-[24px] border ${item.color} text-[#d946ef] transition-all duration-300 gap-3 group hover:scale-[1.05] active:scale-[0.95] shadow-sm`}>
                  <item.icon size={26} className="text-[#d946ef] group-hover:scale-125 transition-transform duration-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-center leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Permissions / clearance Badge Section */}
          <div className="luxury-card p-8 border-white/40">
            <h4 className="text-[11px] font-black text-[#d946ef]/60 uppercase tracking-[0.3em] mb-8">Sovereign Privileges</h4>
            <div className="flex flex-wrap gap-3">
              {permissions.map((perm, i) => (
                <span key={i} className={`px-4 py-2 rounded-2xl border bg-white/60 backdrop-blur-md text-[#d946ef] border-pink-200 text-[10px] font-black tracking-wider uppercase shadow-sm cursor-default whitespace-nowrap`}>
                  {perm.name}
                </span>
              ))}
            </div>
          </div>

          {/* Audit Summary Mini-Card */}
          <div className="luxury-card p-8 border-pink-200 bg-pink-100/50 text-[#d946ef] overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/50 rounded-full -mr-8 -mt-8 blur-3xl transition-all duration-700 group-hover:scale-150" />
            <h4 className="text-[11px] font-black text-[#d946ef]/60 uppercase tracking-[0.3em] mb-10">Temporal Session Info</h4>
            
            <div className="space-y-8">
              <div className="flex justify-between items-center group/item">
                <span className="text-[10px] font-black text-[#d946ef]/70 uppercase tracking-[0.2em] group-hover/item:text-[#d946ef] transition-colors">Cumulative Entry</span>
                <span className="text-base font-black text-[#d946ef] tracking-[0.1em] font-mono">{profileData.totalLoginCount}</span>
              </div>
              <div className="flex justify-between items-center group/item">
                <span className="text-[10px] font-black text-[#d946ef]/70 uppercase tracking-[0.2em] group-hover/item:text-[#d946ef] transition-colors">Current Persistence</span>
                <span className="text-base font-black text-emerald-600 tracking-[0.1em] font-mono">{profileData.currentSessionDuration}</span>
              </div>
              <div className="flex justify-between items-center group/item">
                <span className="text-[10px] font-black text-[#d946ef]/70 uppercase tracking-[0.2em] group-hover/item:text-[#d946ef] transition-colors">Entity Lifecycle</span>
                <span className="text-base font-black text-[#d946ef] tracking-[0.1em] font-mono">971 DAYS</span>
              </div>
            </div>
            
            <div className="mt-10 pt-10 border-t border-pink-200/50">
              <div className="flex items-center gap-3 text-[#d946ef]/60">
                <Clock size={16} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Synched to Sovereign NTP</span>
              </div>
            </div>
          </div>

          {/* Document Vault */}
          <div className="luxury-card p-8 border-white/40">
            <h4 className="text-[11px] font-black text-[#d946ef]/60 uppercase tracking-[0.3em] mb-6">Cryptographic Vault</h4>
            <div className="space-y-4">
              {documents.map((doc, i) => (
                <div key={i} onClick={() => handleAction(`Accessing ${doc.name}...`)} className="flex items-center justify-between p-4 rounded-[20px] border border-pink-100 bg-white/60 hover:bg-white hover:border-pink-300 transition-all duration-300 group cursor-pointer shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#d946ef] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <doc.icon size={18} />
                    </div>
                    <span className="text-sm font-black text-[#d946ef] tracking-tight">{doc.name}</span>
                  </div>
                  <Download size={18} className="text-[#d946ef]/40 group-hover:text-[#d946ef] transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Protocols */}
          <div className="luxury-card p-8 border-white/40 bg-red-50/50">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={20} className="text-red-500 animate-pulse" />
              <h4 className="text-[11px] font-black text-red-900/80 uppercase tracking-[0.3em]">Panic protocols</h4>
            </div>
            <div className="space-y-6">
              <div className="bg-white/80 p-4 rounded-2xl border border-red-100">
                <p className="text-[9px] font-black text-red-900/60 uppercase tracking-[0.2em] mb-2">Primary Emergency Nexus</p>
                <p className="text-base font-black text-red-900">Z. Khanam (Guardian)</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => handleAction('Calling emergency line...')} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition-all">
                  <Phone size={14} />
                  +91 91234 56789
                </button>
                <button onClick={() => handleAction('Transmitting encrypted emergency message...')} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-200 hover:scale-[1.05] transition-all">
                  <Mail size={14} />
                  Emergency Encryption
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex items-center justify-center gap-3 text-[10px] text-[#d946ef]/50 font-black uppercase tracking-[0.4em] py-12">
        <Info size={14} />
        Apex Sovereign Authority Data Governance · 2026 Ref: ADM-942
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={stopCamera}
              className="absolute inset-0 bg-[#2e1065]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg luxury-card border-white/60 p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-[#d946ef] uppercase tracking-tight">Camera Interface</h3>
                <button onClick={stopCamera} className="p-2 hover:bg-pink-100 rounded-full text-[#d946ef] transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-pink-200 group">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none" />
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest font-mono">REC LIVE</span>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center gap-6">
                <button 
                  onClick={stopCamera}
                  className="px-8 py-3 bg-pink-100 text-[#d946ef] border border-pink-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-pink-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={capturePhoto}
                  className="px-8 py-3 bg-[#d946ef] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-pink-200 hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-2"
                >
                  <Camera size={16} />
                  Capture
                </button>
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
