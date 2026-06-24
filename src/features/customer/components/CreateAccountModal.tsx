import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Building, Check, Sparkles, X, ChevronRight, Info,
  UploadCloud, FileText, Calendar, User, MapPin, 
  ShieldAlert, DollarSign, ArrowLeft, CreditCard, Lock,
  FileCheck, ShieldCheck, GraduationCap, Briefcase
} from 'lucide-react';

interface AccountTypeTemplate {
  name: string;
  badge: string;
  description: string;
  features: string[];
  cta: string;
  color: string;
  btnClass: string;
}

interface CreateAccountModalProps {
  onClose: () => void;
  onAccountCreated: (accountType: string, customNumber: string) => void;
}

export default function CreateAccountModal({ onClose, onAccountCreated }: CreateAccountModalProps) {
  const ACCOUNT_TEMPLATES: AccountTypeTemplate[] = [
    {
      name: 'Savings Account',
      badge: 'Popular',
      description: 'Standard account optimized for personal cash pools, savings gains, and secure withdrawals.',
      features: [
        'Minimum Balance: ₹1,000',
        'Interest Rate: Up to 4% p.a.',
        'Free Platinum Debit Card',
        'Unlimited Mobile & Internet Banking'
      ],
      cta: 'Apply for Savings',
      color: 'from-pink-500/10 to-transparent hover:border-[#ff5e9c]/40',
      btnClass: 'bg-[#ff5e9c]/20 text-[#ff5e9c] hover:bg-[#ff5e9c] hover:text-white border border-[#ff5e9c]/30'
    },
    {
      name: 'Current Account',
      badge: 'Business',
      description: 'Sleek financial hub supporting unlimited commercial liquidity transactions for corporations.',
      features: [
        'For Businesses & Professionals',
        'Unlimited Monthly Transactions',
        'Quick Overdraft Facility',
        'Dedicated Relationship Manager'
      ],
      cta: 'Apply for Current',
      color: 'from-cyan-500/10 to-transparent hover:border-cyan-400/40',
      btnClass: 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black border border-cyan-500/30'
    },
    {
      name: 'Student Account',
      badge: 'Zero Balance',
      description: 'Modern zero-fee digital wallet with discount partner rewards tailored for students.',
      features: [
        'Zero Balance Requirement',
        'Free UPI & Premium Card',
        'Special Offers & Student Rewards',
        'Easy Paperless Online Booking'
      ],
      cta: 'Apply for Student',
      color: 'from-[#ff5e9c]/10 to-transparent hover:border-[#ff5e9c]/40',
      btnClass: 'bg-[#ff5e9c]/20 text-[#ff5e9c] hover:bg-[#ff5e9c] hover:text-white border border-[#ff5e9c]/30'
    },
    {
      name: 'Salary Account',
      badge: 'Employee Special',
      description: 'Ideal for salaried professionals, instantly capturing employer retains with robust benefits.',
      features: [
        'Zero Balance Requirement',
        'Instant Retainer Credits',
        'Free Unlimited ATM Access',
        'Exclusive Employee Privileges'
      ],
      cta: 'Apply for Salary',
      color: 'from-amber-500/10 to-transparent hover:border-amber-400/40',
      btnClass: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/30'
    },
    {
      name: 'Fixed Deposit (FD)',
      badge: 'Investment',
      description: 'Secure, high-yield asset locker offering risk-free guaranteed interests over flexible tenures.',
      features: [
        'Higher Returns Up to 7.8% p.a.',
        'Extremely Flexible tenure options',
        'Completely Risk-Free returns',
        'Loan support against FD principal'
      ],
      cta: 'Open FD',
      color: 'from-rose-500/10 to-transparent hover:border-rose-450/40',
      btnClass: 'bg-rose-500/20 text-rose-455 hover:bg-rose-500 hover:text-white border border-rose-500/30'
    },
    {
      name: 'Recurring Deposit (RD)',
      badge: 'Monthly savings',
      description: 'Automatic monthly transfers designed to establish disciplined savings habit.',
      features: [
        'Flexible monthly savings plans',
        'Attractive compound interest',
        'Flexible custom durations',
        'Guaranteed capital growth'
      ],
      cta: 'Open RD',
      color: 'from-purple-500/10 to-transparent hover:border-purple-400/40',
      btnClass: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white border border-purple-500/30'
    }
  ];

  // Wizard state: 
  // 1 = Select Template
  // 2 = Collect details & Document selection
  // 3 = Interactive security verification simulation
  const [step, setStep] = useState<number>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<AccountTypeTemplate | null>(null);

  // Form compliance inputs
  const [fullName, setFullName] = useState('Andrew Forbist');
  const [dob, setDob] = useState('1994-08-12');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('44/1 High-Tech Enclave, Sector-5, Bengaluru, Karnataka');
  
  // Custom document selector depending on account class
  const [docType, setDocType] = useState('Aadhaar Card');
  const [docNumber, setDocNumber] = useState('');
  const [incomeRange, setIncomeRange] = useState('₹5L - ₹10L per annum');

  // Account class specific fields
  const [studentUni, setStudentUni] = useState('Indian Institute of Science');
  const [studentRoll, setStudentRoll] = useState('IISc-2024-819A');
  const [businessName, setBusinessName] = useState('Forbist Tech Labs Pvt Ltd');
  const [gistin, setGistin] = useState('29AACCB1234F1Z5');
  const [employerName, setEmployerName] = useState('Helix Global Corporation');

  // Drag-and-drop file upload reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Simulation loading progress details
  const [simulationStatus, setSimulationStatus] = useState('');
  const [validationPercent, setValidationPercent] = useState(0);

  const startApplication = (template: AccountTypeTemplate) => {
    setSelectedTemplate(template);
    // Initialize default document type based on selection
    if (template.name === 'Student Account') {
      setDocType('Student University ID Card');
    } else if (template.name === 'Current Account') {
      setDocType('GSTIN Certificate');
    } else if (template.name === 'Salary Account') {
      setDocType('Employer ID Card');
    } else {
      setDocType('Aadhaar UID Card');
    }
    setStep(2);
    setErrorText('');
    setUploadedFileName(null);
  };

  // Drag and drop mechanics
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
      setUploadedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const executeComplianceVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!fullName.trim() || !dob || !phone.trim() || !address.trim() || !docNumber.trim()) {
      setErrorText('Please ensure all required personal & compliance fields are completed.');
      return;
    }

    if (!uploadedFileName) {
      setErrorText('Please upload a physical copy/JPEG scan of your selected identity document.');
      return;
    }

    if (!agreeTerms) {
      setErrorText('You must agree to state regulatory bank compliance disclosure guidelines.');
      return;
    }

    // Enter compliance simulation loading step
    setStep(3);
    runSimulatedVerification();
  };

  const runSimulatedVerification = () => {
    const sequence = [
      { text: 'Encrypting payload elements with AES-256 keys...', delay: 0, pct: 15 },
      { text: 'Matching KYC inputs with National Central Registry databases...', delay: 900, pct: 40 },
      { text: 'Verifying digital file hash Integrity and authenticity layers...', delay: 1800, pct: 65 },
      { text: 'Executing secure ledger contract escrow allocation...', delay: 2700, pct: 85 },
      { text: 'Formulating physical platinum debit asset details...', delay: 3500, pct: 100 }
    ];

    sequence.forEach((st) => {
      setTimeout(() => {
        setSimulationStatus(st.text);
        setValidationPercent(st.pct);
        
        if (st.pct === 100) {
          setTimeout(() => {
            // Generate compliant virtual number
            const randPrefix = 'APX' + Math.floor(2000 + Math.random() * 8000);
            const randSuffix = Math.floor(10 + Math.random() * 90);
            const generatedNumber = `${randPrefix}XXXX${randSuffix}`;

            onAccountCreated(selectedTemplate?.name || 'Savings Account', generatedNumber);
          }, 800);
        }
      }, st.delay);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="bg-zinc-950 border border-white/10 rounded-[32px] p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative"
      >
        
        {/* Close Button on Top Right */}
        {step !== 3 && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: CHOOSE AN ACCOUNT CLASS */}
        {step === 1 && (
          <>
            <div className="text-center space-y-1 pb-4 border-b border-white/5">
              <span className="text-xs bg-[#ff5e9c]/10 text-[#ff5e9c] font-black px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                🏦 Apex Account Openings Terminal
              </span>
              <h3 className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-pink-450 via-[#b03bfc] to-[#00efd1] mt-2">
                Create New Account & Deposits Portfolio
              </h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">
                Select an account model below to configure high-yield interest, platinum cards, and specialized local business portals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ACCOUNT_TEMPLATES.map((item, idx) => (
                <div 
                  key={idx}
                  className={`bg-zinc-900 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:bg-zinc-90 w-full bg-gradient-to-br ${item.color}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-white/5 px-2 py-0.5 rounded-lg text-slate-300">
                        {item.badge}
                      </span>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00efd1] animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 font-display">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      {item.features.map((feat, fidx) => (
                        <div key={fidx} className="flex items-start gap-1.5 text-[10px] text-slate-300">
                          <Check className="w-3.5 h-3.5 text-[#00efd1] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => startApplication(item)}
                    className={`w-full py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${item.btnClass}`}
                  >
                    {item.cta}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-white/5 flex gap-3 text-xs text-slate-400 leading-normal">
              <Info className="w-5 h-5 text-[#ff5e9c] shrink-0" />
              <p>
                By launching any verified retail bank account on Apex, you satisfy the state regulator compliance mandates. Any created Savings or Business Current details will reflect in your Active Accounts directory. If you have any questions, contact our support terminal.
              </p>
            </div>
          </>
        )}

        {/* STEP 2: FILL APPLICANT AND KYC REGISTRATION DETAILS */}
        {step === 2 && selectedTemplate && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <button 
                onClick={() => setStep(1)}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#ff5e9c] font-mono block">Secured Verification Step</span>
                <h3 className="text-lg font-bold text-slate-100">
                  Compliance Application Form: {selectedTemplate.name}
                </h3>
              </div>
            </div>

            <form onSubmit={executeComplianceVerify} className="space-y-6">
              
              {/* Personal Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Full Legal Name (as per ID document)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200"
                    />
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Address / Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Contact Mobile Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Residential Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200"
                    />
                    <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* SPECIFIC FIELDS PER ACC CLASS */}
              {selectedTemplate.name === 'Student Account' && (
                <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#ff5e9c] uppercase tracking-wider block font-mono flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" /> University / College Name
                    </label>
                    <input
                      type="text"
                      required
                      value={studentUni}
                      onChange={(e) => setStudentUni(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-[#ff5e9c] focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-205"
                      placeholder="e.g. Indian Institute of Science"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#ff5e9c] uppercase tracking-wider block font-mono">
                      Student Roll / Enrollment Code
                    </label>
                    <input
                      type="text"
                      required
                      value={studentRoll}
                      onChange={(e) => setStudentRoll(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-[#ff5e9c] focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-205"
                      placeholder="e.g. IISc-2024-819A"
                    />
                  </div>
                </div>
              )}

              {selectedTemplate.name === 'Current Account' && (
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" /> Corporate / Trade Legal Entity Name
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-cyan-400 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-205"
                      placeholder="e.g. Forbist Tech Labs Pvt Ltd"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">
                      Business GSTIN Address ID / TAX Identification Code
                    </label>
                    <input
                      type="text"
                      required
                      value={gistin}
                      onChange={(e) => setGistin(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-cyan-400 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-205"
                      placeholder="e.g. 29AACCB1234F1Z5"
                    />
                  </div>
                </div>
              )}

              {selectedTemplate.name === 'Salary Account' && (
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> Employing Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-amber-400 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-205"
                      placeholder="e.g. Helix Global Corporation"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">
                      Financial Income Bracket
                    </label>
                    <select
                      value={incomeRange}
                      onChange={(e) => setIncomeRange(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-amber-400 focus:outline-none rounded-xl px-2 py-2 text-xs text-slate-205 font-medium cursor-pointer"
                    >
                      <option value="₹2.5L - ₹5L per annum">₹2.5L - ₹5L per annum</option>
                      <option value="₹5L - ₹10L per annum">₹5L - ₹10L per annum</option>
                      <option value="₹10L - ₹25L per annum">₹10L - ₹25L per annum</option>
                      <option value="₹25L+ per annum">₹25L+ per annum</option>
                    </select>
                  </div>
                </div>
              )}

              {/* KYC Compliance Section (Document uploads and ID details) */}
              <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-slate-100 pb-2 border-b border-white/5">
                  <ShieldAlert className="w-4 h-4 text-[#ff5e9c]" />
                  <span className="text-xs font-bold uppercase tracking-wider">KYC Compliance Documents</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      Standard Governance Document
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-2.5 py-2 text-xs text-slate-200 font-semibold cursor-pointer"
                    >
                      {selectedTemplate.name === 'Student Account' ? (
                        <>
                          <option value="Student University ID Card">Student University ID Card (Dual Scan)</option>
                          <option value="Aadhaar UID Card">Aadhaar UID Card</option>
                          <option value="Admission Offer Letter Document">Admission Offer Letter Document</option>
                        </>
                      ) : selectedTemplate.name === 'Current Account' ? (
                        <>
                          <option value="GSTIN Registration Certificate">GSTIN Registration Certificate</option>
                          <option value="PAN Card of Enterprise">PAN Card of Enterprise</option>
                          <option value="Corporate MoA/AoO Papers">Corporate Incorporation Certificate/MoA</option>
                        </>
                      ) : selectedTemplate.name === 'Salary Account' ? (
                        <>
                          <option value="Employer Verification ID">Employer Verification ID Card</option>
                          <option value="Aadhaar UID Card">Aadhaar UID Card & Monthly Payslip</option>
                          <option value="PAN Card ID">PAN Card ID</option>
                        </>
                      ) : (
                        <>
                          <option value="Aadhaar UID Card">Aadhaar UID Card (Unique Identification)</option>
                          <option value="PAN Card Standard ID">PAN Card Standard ID</option>
                          <option value="Passport Copy">Passport Registration Copy</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      Document Identification Index Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5821 0092 3811"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                {/* FILE DRAG AND DROP PORTAL - Satisfies Usability Pattern File Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Upload Regulatory Verification Scan File
                  </label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                      isDragging 
                        ? 'border-[#ff5e9c] bg-[#ff5e9c]/10' 
                        : uploadedFileName 
                          ? 'border-emerald-500/40 bg-emerald-500/5' 
                          : 'border-white/10 hover:border-white/20 hover:bg-white/5 bg-zinc-950/40'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden" 
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                    
                    {uploadedFileName ? (
                      <>
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full animate-bounce">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-400 text-center truncate max-w-md">
                            ✓ Document Attached Successfully
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            File: {uploadedFileName}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2.5 bg-white/5 text-slate-400 rounded-full">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-300">
                            Drag & drop scan file or <span className="text-[#ff5e9c] underline">click to select manual file</span>
                          </p>
                          <p className="text-[9px] text-slate-500 mt-1">
                            PDF, PNG, JPG, JPEG up to 10MB formats accepted.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* T&C check */}
              <label className="flex items-start gap-2.5 text-[11px] text-slate-400 leading-normal cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-white/10 bg-zinc-955 text-[#ff5e9c] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>
                  I legally declare that the provided identity proof elements are completely authenticated. I authorize Apex Money to register my compliance credentials in accordance with banking laws and guidelines.
                </span>
              </label>

              {errorText && (
                <p className="text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-center font-bold">
                  {errorText}
                </p>
              )}

              {/* Application Submit CTAs */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer transition-colors"
                >
                  Change Account Model
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-gradient-to-r from-[#ff5e9c] to-[#b03bfc] hover:opacity-95 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
                >
                  <span>Submit Secure Form</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          </div>
        )}

        {/* STEP 3: INTERACTIVE SECURITIES VERIFICATION SCREEN SIMULATION */}
        {step === 3 && (
          <div className="py-12 px-6 flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
            <div className="relative">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 border-4 border-[#ff5e9c]/20 rounded-full animate-ping" />
              <div className="w-16 h-16 bg-[#ff5e9c]/10 text-[#ff5e9c] rounded-full flex items-center justify-center relative border border-[#ff5e9c]/30">
                <Lock className="w-7 h-7 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">
                COMPLIANCE TRUST VERIFICATION
              </h4>
              <p className="text-xs text-slate-400 font-mono animate-pulse font-medium">
                {simulationStatus || 'Processing security tokens...'}
              </p>
            </div>

            {/* Simulated progress slider bar */}
            <div className="w-full max-w-md space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>KYC ENVELOPE</span>
                <span>{validationPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 via-[#b03bfc] to-[#00efd1] rounded-full transition-all duration-300"
                  style={{ width: `${validationPercent}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-sans max-w-sm">
              Your data remains completely encrypted locally. Compliance logs are formulated securely across authenticated ledger verification hubs.
            </div>
          </div>
        )}

      </motion.div>
    </motion.div>
  );
}
