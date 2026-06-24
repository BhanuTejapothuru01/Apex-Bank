import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, Key, Eye, EyeOff, 
  FileText, Download, Check, HelpCircle, Lock, Camera, Upload,
  Briefcase, Sparkles, Copy, X, ArrowLeft
} from 'lucide-react';

interface Advisor {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatar: string;
}

const SUPPORT_ADVISORS: Advisor[] = [
  {
    id: 'emp-1',
    name: 'Samantha Ray',
    role: 'Senior Private Wealth Director',
    phone: '+91 98301 22940',
    email: 'samantha.ray@apex.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-2',
    name: 'Kabir Mehra',
    role: 'NRI Priority Relationship Executive',
    phone: '+91 91630 11845',
    email: 'kabir.mehra@apex.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-3',
    name: 'Priya Sharma',
    role: 'Mortgages & Home Loan Consultant',
    phone: '+91 81002 99341',
    email: 'priya.sharma@apex.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-4',
    name: 'Amaan Kazi',
    role: 'Cyber Frauds & Security Representative',
    phone: '+91 90511 88470',
    email: 'amaan.kazi@apex.com',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&auto=format&fit=crop&q=80'
  }
];

interface CustomerProfileProps {
  profile: any;
  onUpdateProfile: (updated: any) => void;
  onClose: () => void;
}

export default function CustomerProfile({ profile, onUpdateProfile, onClose }: CustomerProfileProps) {
  const [formData, setFormData] = useState({ ...profile });
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPIN, setNewPIN] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'password' | 'pin';
    targetValue: string;
  } | null>(null);

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [otpVerifyError, setOtpVerifyError] = useState<string | null>(null);
  const [enteredEmailConfirmation, setEnteredEmailConfirmation] = useState('');
  const [enteredPhoneConfirmation, setEnteredPhoneConfirmation] = useState('');

  const startDoubleAuth = (type: 'password' | 'pin', val: string) => {
    if (!val) {
      triggerLocalNotification(`❌ Please enter a valid ${type === 'password' ? 'Password Key' : '4-Digit PIN'} first!`);
      return;
    }
    if (type === 'pin' && val.length !== 4) {
      triggerLocalNotification('❌ Transaction PIN must be exactly 4 digits!');
      return;
    }
    
    setAuthModal({
      isOpen: true,
      type,
      targetValue: val
    });
    setOtpSent(false);
    setSendingOtp(false);
    setGeneratedOtp('');
    setUserEnteredOtp('');
    setOtpVerifyError(null);
    setEnteredEmailConfirmation('');
    setEnteredPhoneConfirmation('');
  };

  const handleSendOtpHandshake = () => {
    setSendingOtp(true);
    setOtpVerifyError(null);
    
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setSendingOtp(false);
      setOtpSent(true);
      triggerLocalNotification(`📡 Secure 2-Step OTP dispatched! Check confirmation parameters.`);
    }, 1200);
  };

  const handleVerifyOtpHandshake = () => {
    setOtpVerifyError(null);
    
    if (userEnteredOtp !== generatedOtp) {
      setOtpVerifyError('❌ Invalid 6-digit verification code. Please check code or request new dispatch.');
      return;
    }

    const cleanConfirmEmail = enteredEmailConfirmation.trim().toLowerCase();
    const cleanProfileEmail = profile.email.trim().toLowerCase();
    
    const cleanConfirmPhone = enteredPhoneConfirmation.replace(/\D/g, '');
    const cleanProfilePhone = profile.mobile.replace(/\D/g, '');

    if (!cleanConfirmEmail || cleanConfirmEmail !== cleanProfileEmail) {
      setOtpVerifyError('❌ Validation Failed: Provided email does not match registered profile inbox.');
      return;
    }

    if (!cleanConfirmPhone || !cleanProfilePhone.endsWith(cleanConfirmPhone)) {
      setOtpVerifyError('❌ Validation Failed: Provided mobile ends-with did not match registered phone digits.');
      return;
    }

    let updated;
    if (authModal?.type === 'password') {
      updated = { ...formData, securePassword: authModal.targetValue };
      setNewPassword('');
    } else {
      updated = { ...formData, securePIN: authModal.targetValue };
      setNewPIN('');
    }
    
    setFormData(updated);
    onUpdateProfile(updated);
    
    triggerLocalNotification(
      `✓ Credentials secure. ${
        authModal?.type === 'password' ? 'Password Key' : 'Transaction PIN'
      } updated successfully via Double Authentication!`
    );
    
    setAuthModal(null);
  };
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([
    'Aadhaar_Card_Masked.pdf',
    'PAN_Card_Copy.pdf'
  ]);
  const [supportMessage, setSupportMessage] = useState('');
  const [showSupportSuccess, setShowSupportSuccess] = useState(false);
  const [localNotification, setLocalNotification] = useState<string | null>(null);
  const [showAdvisorList, setShowAdvisorList] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showPan, setShowPan] = useState(false);

  const getFormattedAccountNumber = (accNum: string, isVisible: boolean) => {
    if (!accNum) return '••••••••';
    const cleanNum = accNum.replace(/\s+/g, '').toUpperCase();
    
    let rawNum = cleanNum;
    if (cleanNum.startsWith('XXXX')) {
      const suffix = cleanNum.slice(4);
      rawNum = `30990821${suffix}`;
    } else if (cleanNum.includes('XXXX')) {
      rawNum = cleanNum.replace('XXXX', '5821');
    }
    
    if (isVisible) {
      return rawNum;
    } else {
      const suffix = rawNum.slice(-4);
      return `••••••••${suffix}`;
    }
  };

  const getFormattedAadhaar = (aadhaar: string, isVisible: boolean) => {
    if (!aadhaar) return '•••• •••• ••••';
    const cleanStr = aadhaar.replace(/[-\s]+/g, '');
    if (isVisible) {
      if (cleanStr.toUpperCase().startsWith('XXXX')) {
        const suffix = cleanStr.slice(8);
        return `5829 1803 ${suffix}`;
      }
      return cleanStr.replace(/(.{4})/g, '$1 ').trim();
    } else {
      if (cleanStr.toUpperCase().startsWith('XXXX')) {
        const suffix = cleanStr.slice(8);
        return `•••• •••• ${suffix}`;
      }
      const suffix = cleanStr.slice(-4);
      return `•••• •••• ${suffix}`;
    }
  };

  const getFormattedPan = (pan: string, isVisible: boolean) => {
    if (!pan) return '••••••••••';
    if (isVisible) {
      if (pan.toUpperCase().startsWith('XXXXXX')) {
        const suffix = pan.slice(6);
        return `ABCDE${suffix}`;
      }
      return pan;
    } else {
      if (pan.toUpperCase().startsWith('XXXXXX')) {
        const suffix = pan.slice(6);
        return `••••••${suffix}`;
      }
      const suffix = pan.slice(-4);
      return `••••••${suffix}`;
    }
  };

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 320, facingMode: 'user' } 
      });
      streamRef.current = stream;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 150);
    } catch (err: any) {
      console.warn("Camera API access failed, utilizing fallback simulation mode:", err);
      setCameraError("Camera hardware unavailable or permission denied. Showing secure mockup simulation capture.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!cameraError && videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 300, 300);
          const dataUrl = canvas.toDataURL('image/jpeg');
          const updated = { ...formData, photoUrl: dataUrl };
          setFormData(updated);
          onUpdateProfile(updated);
          triggerLocalNotification('✓ Captured new biometric profile photo successfully!');
          stopCamera();
        }
      } catch (err) {
        useFallbackPhoto();
      }
    } else {
      useFallbackPhoto();
    }
  };

  const useFallbackPhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 300, 300);
      grad.addColorStop(0, '#ff5e9c');
      grad.addColorStop(1, '#b03bfc');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 300, 300);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('APEX SECURITY', 150, 110);
      
      ctx.font = 'bold 80px sans-serif';
      ctx.fillText(formData.fullName ? formData.fullName.substring(0, 2).toUpperCase() : 'CU', 150, 195);
      
      ctx.font = '12px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('VERIFIED BIOMETRIC', 150, 240);

      const dataUrl = canvas.toDataURL('image/jpeg');
      const updated = { ...formData, photoUrl: dataUrl };
      setFormData(updated);
      onUpdateProfile(updated);
      triggerLocalNotification('✓ Snapshot simulated securely using high-contrast biometric backup!');
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const fileNames = files.map(file => file.name);
      setUploadedDocs(prev => [...prev, ...fileNames]);
      
      const updated = { ...formData, kycStatus: 'Verified' };
      setFormData(updated);
      onUpdateProfile(updated);
      
      triggerLocalNotification(`✓ Captured ${fileNames.length} document(s) successfully! KYC verification status: Verified.`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files) as File[];
      const fileNames = files.map(file => file.name);
      setUploadedDocs(prev => [...prev, ...fileNames]);
      
      const updated = { ...formData, kycStatus: 'Verified' };
      setFormData(updated);
      onUpdateProfile(updated);
      
      triggerLocalNotification(`✓ Placed ${fileNames.length} document(s) inside secure vault! KYC verification: Verified.`);
    }
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerLocalNotification(`✓ Copied ${label}: ${text}`);
  };

  const triggerLocalNotification = (msg: string) => {
    setLocalNotification(msg);
    setTimeout(() => {
      setLocalNotification(null);
    }, 4500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    triggerLocalNotification('✓ Profile updated successfully!');
  };

  const triggerKycUpdate = () => {
    const updated = { ...formData, kycStatus: 'Verified' };
    setFormData(updated);
    onUpdateProfile(updated);
    triggerLocalNotification('✓ KYC Status updated successfully to Verified!');
  };

  const triggerDownloadStatement = () => {
    triggerLocalNotification('✓ Dynamic Statement compiled! Check your browser downloads for secure-report-' + formData.customerId + '.pdf');
  };

  const sendSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAdvisorList(true);
    triggerLocalNotification('✓ Live Support link activated! Meet our Priority Banking Advisors.');
    if (!supportMessage.trim()) return;
    setShowSupportSuccess(true);
    setTimeout(() => {
      setShowSupportSuccess(false);
      setSupportMessage('');
    }, 3000);
  };

  return (
    <div className="bg-white/80 text-slate-800 p-6 rounded-3xl border border-pink-200 max-w-4xl mx-auto my-4 shadow-xl relative overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-pink-200 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-700 font-display">Customer Profile Desk</h3>
            <p className="text-xs text-slate-600">Manage real-time personal registry, credentials, and KYC states.</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-slate-100 hover:bg-pink-50 hover:text-pink-700 rounded-full transition-all cursor-pointer text-slate-600 border border-slate-200 flex items-center justify-center shadow-sm hover:border-pink-300"
          title="Close Profile Drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {localNotification && (
        <div className="mb-4 p-3 bg-pink-100 border border-pink-300 text-pink-700 text-xs font-mono font-bold rounded-2xl text-center flex items-center justify-center gap-2">
          <span>{localNotification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Photo & Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-pink-200 p-4 rounded-2xl text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto">
              {isCameraOpen ? (
                <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-pink-300 relative flex items-center justify-center">
                  {!cameraError ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 to-slate-800 flex flex-col items-center justify-center p-2 text-center select-none">
                      <span className="text-[10px] text-pink-300 font-black tracking-wider uppercase">SIMULATION</span>
                      <span className="text-[8px] text-slate-300 mt-1 leading-normal">Webcam active. Click action below!</span>
                    </div>
                  )}
                  <div className="absolute left-0 right-0 h-[1px] bg-pink-400/60 top-1/2 pointer-events-none" />
                </div>
              ) : formData.photoUrl ? (
                <img 
                  src={formData.photoUrl} 
                  alt={formData.fullName} 
                  className="w-full h-full rounded-2xl object-cover border border-pink-200" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 border border-pink-200 flex items-center justify-center text-4xl text-white font-black">
                  {formData.fullName ? formData.fullName.substring(0, 2).toUpperCase() : 'CU'}
                </div>
              )}

              {isCameraOpen ? (
                <div className="absolute -bottom-3 inset-x-0 mx-auto flex items-center justify-center gap-1 z-10">
                  <button 
                    type="button"
                    onClick={stopCamera}
                    className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded-lg text-[9px] font-bold text-slate-700 hover:text-slate-900 cursor-pointer shadow-md transition-all active:scale-95"
                    title="Cancel Camera"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={capturePhoto}
                    className="px-2 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-[9px] font-bold text-white cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
                    title="Take Snapshot"
                  >
                    Capture
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={startCamera}
                  className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white cursor-pointer hover:shadow-lg transition-transform hover:scale-110 active:scale-95 duration-150 border border-white/20"
                  title="Click to Open Biometric Camera"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-sm font-display">{formData.fullName}</h4>
              <p className="text-xs text-pink-600 font-mono mt-0.5">{formData.customerId}</p>
            </div>

            <div className="pt-2 border-t border-pink-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">KYC Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  formData.kycStatus === 'Verified' 
                    ? 'bg-pink-100 text-pink-700 border border-pink-300' 
                    : 'bg-amber-100 text-amber-700 border border-amber-300'
                }`}>
                  {formData.kycStatus === 'Verified' ? '✓ Verified' : '⚠ Action Required'}
                </span>
              </div>

              {formData.kycStatus !== 'Verified' && (
                <div className="text-left bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-1.5 my-1">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest font-mono">How to complete verification:</p>
                  <ul className="list-disc list-inside text-[9.5px] text-amber-800 space-y-1 pl-0.5 leading-relaxed">
                    <li>Upload your national identity proof card (Aadhaar/PAN) in key file section.</li>
                    <li>Take a secure biometric photograph capture utilizing the profile avatar camera icon.</li>
                    <li>Click the <b>"Update KYC Status"</b> quick action button to run real-time checks.</li>
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Account Tier:</span>
                <span className="text-purple-700 font-bold font-mono">CHIC PLATINUM</span>
              </div>
            </div>
          </div>

          {/* Quick Support / Contact Console */}
          <div className="bg-white border border-pink-200 p-4 rounded-2xl space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-pink-600" /> Contact Support Terminal
            </h5>
            <form onSubmit={sendSupportTicket} className="space-y-2">
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Type your concern here to contact SupportDesk..."
                className="w-full h-16 bg-slate-50 border border-pink-200 rounded-xl p-2 text-xs text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-pink-300"
              >
                <span>Connect to Advisor</span>
                <Sparkles className="w-3 h-3 text-white animate-pulse" />
              </button>
            </form>
            <div className="pt-2 border-t border-pink-200">
              <button
                type="button"
                onClick={() => {
                  setShowAdvisorList(true);
                  triggerLocalNotification('✓ Quick Access Roster activated! Explore profiles & roles.');
                }}
                className="w-full py-1.5 px-3 border border-pink-200 bg-slate-50 hover:bg-pink-50 text-[10px] text-slate-600 hover:text-pink-700 transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
              >
                <User className="w-3 h-3 text-pink-600" />
                Browse Priority Representatives
              </button>
            </div>
            {showSupportSuccess && (
              <p className="text-[10px] text-pink-700 bg-pink-100 p-2 rounded-lg text-center font-mono animate-pulse">
                ✓ Message sent! Support Representative will revert in 2 minutes.
              </p>
            )}
          </div>
        </div>

        {/* Right Columns - Detailed Form */}
        <div className="md:col-span-2 space-y-6 max-h-[500px] overflow-y-auto pr-2">
          
          {/* Quick Buttons Drawer */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                isEditing 
                  ? 'bg-pink-100 text-pink-700 border-pink-300' 
                  : 'bg-white text-slate-700 border-pink-200 hover:bg-slate-50'
              }`}
            >
              {isEditing ? '✓ Lock Edit Mode' : '✎ Edit Profile'}
            </button>

            <button 
              onClick={triggerKycUpdate}
              className="py-2 px-3 text-xs font-bold bg-pink-100 hover:bg-pink-200 text-pink-700 border border-pink-300 rounded-xl transition-all cursor-pointer"
            >
              ✓ Update KYC Status
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {/* 1. Personal Information */}
            <div className="bg-white border border-pink-200 p-4 rounded-2xl space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Personal Registration Ledger
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={formData.fullName} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Customer Registry ID</label>
                  <input 
                    type="text" 
                    value={formData.customerId} 
                    disabled
                    className="w-full bg-slate-100 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.dob} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Gender Group</label>
                  <select 
                    value={formData.gender} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500 disabled:opacity-60"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Declined">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Nationality Jurisdiction</label>
                  <input 
                    type="text" 
                    value={formData.nationality} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Profile Photo Link</label>
                  <input 
                    type="text" 
                    value={formData.photoUrl} 
                    disabled={!isEditing}
                    placeholder="https://images.unsplash.com/... (optional)"
                    onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* 2. Contact Information */}
            <div className="bg-white border border-pink-200 p-4 rounded-2xl space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-700">
                📞 Critical Contact Info
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Primary Mobile Number</label>
                  <input 
                    type="text" 
                    value={formData.mobile} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Alternate Contact Number</label>
                  <input 
                    type="text" 
                    value={formData.altMobile} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('altMobile', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-600 font-mono">Registered Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-600 font-mono">Residential Address</label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">City / District</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">State / Union Territory</label>
                  <input 
                    type="text" 
                    value={formData.state} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">PIN Code / Postal code</label>
                  <input 
                    type="text" 
                    value={formData.pinCode} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('pinCode', e.target.value)}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Account Information */}
            <div className="bg-white border border-pink-200 p-4 rounded-2xl space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-700">
                🏦 Live Account Registry Ledger
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Account Number</label>
                  <div className="relative flex items-center max-w-[280px]">
                    <input 
                      type="text" 
                      value={getFormattedAccountNumber(formData.accountNumber, showAccountNumber)} 
                      disabled
                      className="w-full bg-slate-100 border border-pink-200 rounded-xl pl-3 pr-10 py-1.5 text-xs text-slate-700 cursor-not-allowed font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="absolute right-2 p-1 hover:bg-pink-100 rounded-lg cursor-pointer text-slate-600 hover:text-pink-600 transition-all flex items-center justify-center"
                      title={showAccountNumber ? "Hide Account Number" : "Reveal Account Number"}
                    >
                      {showAccountNumber ? <EyeOff className="w-4 h-4 text-pink-600" /> : <Eye className="w-4 h-4 text-pink-600" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Account Classification Type</label>
                  <input 
                    type="text" 
                    value={formData.accountType} 
                    disabled
                    className="w-full bg-slate-100 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">Assigned Hub Branch</label>
                  <input 
                    type="text" 
                    value={formData.branchName} 
                    disabled
                    className="w-full bg-slate-100 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-mono">IFSC Route Code</label>
                  <input 
                    type="text" 
                    value={formData.ifscCode} 
                    disabled
                    className="w-full bg-slate-100 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-slate-600 font-mono">Relationship Opening Date</label>
                  <input 
                    type="text" 
                    value={formData.openingDate} 
                    disabled
                    className="w-full bg-slate-100 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 4. Credentials Security Settings */}
            <div className="bg-white border border-pink-200 p-4 rounded-2xl space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-700">
                🔐 Credentials & Identity Security
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 p-3 bg-slate-50 border border-pink-200 rounded-xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <label className="text-[10px] text-pink-700 font-mono font-bold">Change Password Key</label>
                    <input 
                      type="password" 
                      placeholder="Type new secure password..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => startDoubleAuth('password', newPassword)}
                    className="w-full mt-2 py-1.5 bg-pink-100 text-pink-700 hover:bg-pink-500 hover:text-white border border-pink-300 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Lock className="w-3.5 h-3.5" /> Double Authentication & Save
                  </button>
                </div>

                <div className="space-y-2 p-3 bg-slate-50 border border-pink-200 rounded-xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <label className="text-[10px] text-purple-700 font-mono font-bold">Change Transaction PIN (4-Digit PIN)</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      placeholder="e.g. 1234"
                      value={newPIN}
                      onChange={(e) => setNewPIN(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-pink-500 font-mono text-center tracking-widest"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => startDoubleAuth('pin', newPIN)}
                    className="w-full mt-2 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-500 hover:text-white border border-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Key className="w-3.5 h-3.5" /> Double Authentication & Save
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-[10px] text-slate-600 font-mono">Aadhaar Number</label>
                  <div className="relative flex items-center max-w-[280px]">
                    <input 
                      type="text" 
                      disabled
                      value={getFormattedAadhaar(formData.aadhaarNumber, showAadhaar)} 
                      className="w-full bg-slate-100 border border-pink-200 rounded-xl pl-3 pr-10 py-1.5 text-xs text-slate-700 font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAadhaar(!showAadhaar)}
                      className="absolute right-2 p-1 hover:bg-pink-100 rounded-lg cursor-pointer text-slate-600 hover:text-pink-600 transition-all flex items-center justify-center"
                      title={showAadhaar ? "Hide Aadhaar Number" : "Reveal Aadhaar Number"}
                    >
                      {showAadhaar ? <EyeOff className="w-4 h-4 text-pink-600" /> : <Eye className="w-4 h-4 text-pink-600" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-[10px] text-slate-600 font-mono">PAN Number</label>
                  <div className="relative flex items-center max-w-[280px]">
                    <input 
                      type="text" 
                      disabled
                      value={getFormattedPan(formData.panNumber, showPan)} 
                      className="w-full bg-slate-100 border border-pink-200 rounded-xl pl-3 pr-10 py-1.5 text-xs text-slate-700 font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPan(!showPan)}
                      className="absolute right-2 p-1 hover:bg-pink-100 rounded-lg cursor-pointer text-slate-600 hover:text-pink-600 transition-all flex items-center justify-center"
                      title={showPan ? "Hide PAN Number" : "Reveal PAN Number"}
                    >
                      {showPan ? <EyeOff className="w-4 h-4 text-pink-600" /> : <Eye className="w-4 h-4 text-pink-600" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Documents Drawer */}
              <div className="pt-4 border-t border-pink-200 space-y-3">
                <p className="text-xs font-bold text-slate-800">Identity Documents Ledger & eKYC</p>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 ${
                    isDragging 
                      ? 'border-pink-500 bg-pink-50 scale-[1.01]' 
                      : 'border-pink-200 bg-slate-50 hover:bg-pink-50 hover:border-pink-300'
                  }`}
                >
                  <Upload className={`w-6 h-6 mx-auto mb-2 transition-transform duration-200 ${isDragging ? 'text-teal-600 scale-110' : 'text-pink-600'}`} />
                  <p className="text-xs text-slate-700 font-medium">Click to select compliance files or Drag & Drop here</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Supports PDF, PNG, JPG (eKYC updates instantly on success)</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {uploadedDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-pink-200 rounded-xl text-[10px] font-mono select-none">
                      <FileText className="w-3.5 h-3.5 text-pink-600" />
                      <span className="truncate max-w-[150px] text-slate-700">{doc}</span>
                      <span className="text-pink-600 font-bold text-[9px] shrink-0">✓ Uploaded</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 border border-pink-200 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 rounded-xl text-xs font-bold shadow-lg shadow-pink-500/20"
                >
                  ✓ Save Profile Changes
                </button>
              </div>
            )}

          </form>
        </div>
      </div>

      {/* Live Executive Advisor Directory Modal */}
      <AnimatePresence>
        {showAdvisorList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white border border-pink-200 p-6 rounded-3xl max-w-xl w-full shadow-2xl relative overflow-hidden text-slate-800 max-h-[90vh] flex flex-col"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500" />

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-pink-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg text-purple-700">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <span>Apex Priority Advisory Registry</span>
                      <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                    </h3>
                    <p className="text-[10px] text-slate-600">Direct secured pathways to certified banking specialists</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdvisorList(false);
                    setSelectedAdvisor(null);
                  }}
                  className="p-1 bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-700 rounded-lg transition-colors cursor-pointer"
                  title="Close Directory"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                {!selectedAdvisor ? (
                  <>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      As an elite <span className="text-purple-700 font-semibold">Chic Platinum</span> account holder, you have unfiltered, direct access to our core advisory desks. Choose an agent in your respective segment below to retrieve contact channels:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {SUPPORT_ADVISORS.map((advisor) => (
                        <div
                          key={advisor.id}
                          onClick={() => setSelectedAdvisor(advisor)}
                          className="p-4 bg-white border border-pink-200 hover:border-pink-300 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-pink-50 transition-all group duration-200"
                        >
                          <img
                            src={advisor.avatar}
                            alt={advisor.name}
                            className="w-12 h-12 rounded-xl object-cover border border-pink-200 shrink-0 group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-slate-900">{advisor.name}</h4>
                            <p className="text-[10px] text-slate-600 mt-1 truncate max-w-full">{advisor.role}</p>
                            <span className="text-[8px] bg-pink-100 text-pink-700 border border-pink-300 px-1.5 py-0.5 rounded-full inline-block mt-2 font-semibold">
                              Retrieve Details →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedAdvisor(null)}
                      className="px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:text-slate-800 flex items-center gap-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back to Advisor Catalog
                    </button>

                    <div className="p-5 bg-gradient-to-b from-white to-slate-50 rounded-2xl border border-pink-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-200/30 rounded-full blur-xl pointer-events-none" />

                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-pink-200">
                        <img
                          src={selectedAdvisor.avatar}
                          alt={selectedAdvisor.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-pink-300 shadow-lg shadow-black/10 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-center sm:text-left min-w-0 flex-1">
                          <h4 className="font-display font-bold text-base text-slate-800">{selectedAdvisor.name}</h4>
                          <p className="text-xs text-pink-700 font-medium mt-0.5">{selectedAdvisor.role}</p>
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-pink-100 text-pink-700 border border-pink-300 text-[9px] font-bold uppercase tracking-wider">
                            ● Direct Line Ready
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-slate-50 border border-pink-200 rounded-xl space-y-1.5 align-middle">
                          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider block">Secured Direct Phone</span>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-semibold text-slate-800 select-all">{selectedAdvisor.phone}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyToClipboard(selectedAdvisor.phone, 'Phone number')}
                              className="p-1 bg-white hover:bg-pink-50 text-slate-600 hover:text-pink-700 rounded-lg transition-colors cursor-pointer"
                              title="Copy Contact Number"
                            >
                              <Copy className="w-3.5 h-3.5 text-pink-600" />
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 border border-pink-200 rounded-xl space-y-1.5 align-middle">
                          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider block">Professional Email</span>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-semibold text-slate-800 select-all truncate max-w-[150px]">{selectedAdvisor.email}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyToClipboard(selectedAdvisor.email, 'Email address')}
                              className="p-1 bg-white hover:bg-pink-50 text-slate-600 hover:text-pink-700 rounded-lg transition-colors cursor-pointer"
                              title="Copy Email Address"
                            >
                              <Copy className="w-3.5 h-3.5 text-pink-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center p-3.5 bg-purple-50 border border-purple-200 rounded-2xl">
                      <p className="text-[10px] text-slate-600 leading-snug">
                        💡 Click the copy button next to either contact channel above to add to your clipboards, and securely contact standard SMS/Call or client email pathways to establish a transaction loop.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdvisorList(false);
                    setSelectedAdvisor(null);
                  }}
                  className="px-4 py-2 bg-slate-100 border border-pink-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Close Registry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2FA Multi-Factor Double Authentication Modal */}
      <AnimatePresence>
        {authModal && authModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: { type: "spring", stiffness: 350, damping: 25 }
              }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              className="bg-white border border-pink-300 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden text-slate-800"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500" />
              
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-pink-200">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-100 rounded-xl text-pink-600">
                    <ShieldCheck className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xs text-slate-800 tracking-wider uppercase">
                      APEX SECURITIES GATEWAY
                    </h3>
                    <p className="text-[10px] text-pink-700 font-bold font-mono">Multi-Factor Double Auth</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthModal(null)}
                  className="p-1.5 bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-700 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-pink-200 p-3.5 rounded-2xl text-[11px] leading-relaxed text-slate-700">
                  <span className="font-bold text-pink-700">🔒 Secure Authorization Required</span>
                  <p className="mt-1">
                    To finalize updating your <span className="font-black text-slate-900 font-mono uppercase text-pink-700">{authModal.type === 'password' ? 'Password Key' : 'Transaction PIN'}</span>, you must complete a multi-channel double-authentication handshake verification.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-600 font-mono font-bold uppercase tracking-wider">
                      Verify Registered Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. andrew.forbist@apex.com"
                        value={enteredEmailConfirmation}
                        onChange={(e) => setEnteredEmailConfirmation(e.target.value)}
                        className="w-full bg-slate-50 border border-pink-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-pink-500"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
                    </div>
                    <span className="text-[9px] text-slate-600 block">Registered: {profile.email}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-600 font-mono font-bold uppercase tracking-wider">
                      Verify Registered Mobile Number (10 Digits)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={enteredPhoneConfirmation}
                        onChange={(e) => setEnteredPhoneConfirmation(e.target.value.replace(/\D/g, ''))}
                        maxLength={10}
                        className="w-full bg-slate-50 border border-pink-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-purple-500"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
                    </div>
                    <span className="text-[9px] text-slate-600 block">Registered: {profile.mobile}</span>
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    disabled={sendingOtp || !enteredEmailConfirmation || !enteredPhoneConfirmation}
                    onClick={handleSendOtpHandshake}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                  >
                    {sendingOtp ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating security keys...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Generate Dual OTP Handshake
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3.5 border-t border-pink-200 pt-3 animate-fade-in">
                    <div className="bg-emerald-100 border border-emerald-300 px-3 py-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[10px] text-emerald-700 font-bold uppercase font-mono tracking-wider">
                          MFA Payloads Dispatched
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-700 mt-1">
                        Secure transaction tokens have been multiplexed to your confirmed inbox and mobile SMS streams.
                      </p>
                      
                      <div className="mt-2.5 p-1.5 bg-white border border-emerald-400 rounded-xl flex items-center justify-between">
                        <span className="text-[9px] text-emerald-700 font-mono font-bold tracking-wider uppercase ml-1">Simulated OTP:</span>
                        <span className="font-mono text-xs font-black text-white bg-emerald-500 px-2 py-0.5 rounded-lg tracking-widest">{generatedOtp}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-wider block">
                        Enter 6-Digit Handshake OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="••••••"
                        value={userEnteredOtp}
                        onChange={(e) => setUserEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border border-pink-300 rounded-xl px-3 py-2 text-center text-lg font-black tracking-widest text-pink-700 focus:outline-none focus:border-pink-500 font-mono"
                      />
                    </div>

                    {otpVerifyError && (
                      <p className="text-[10px] text-pink-700 bg-pink-100 p-2.5 rounded-xl font-medium animate-shake text-center border border-pink-300 leading-relaxed">
                        {otpVerifyError}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleSendOtpHandshake}
                        className="py-2.5 bg-slate-100 border border-pink-200 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Resend Code
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyOtpHandshake}
                        className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 animate-pulse"
                      >
                        <Check className="w-4 h-4" /> Verify & Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}