import { useState, useMemo, useEffect } from 'react';
import { 
  FileCheck, 
  X, 
  Check, 
  ShieldCheck, 
  Camera, 
  User, 
  Building, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Users,
  Clock,
  Filter,
  CreditCard as CardIcon,
  RefreshCw,
  QrCode,
  Fingerprint,
  Mail,
  Phone,
  Globe,
  Calendar as CalendarIcon,
  Shield,
  ThumbsUp,
  ThumbsDown,
  Search,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Customer, Employee } from '../types/dashboard';

interface KYCVerificationProps {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

// Complete rich mock details for premium applicants
const KYC_METADATA: Record<string, {
  dob: string;
  gender: string;
  nationality: string;
  photoUrl: string;
  aadhaarNumber: string;
  aadhaarName: string;
  aadhaarDob: string;
  aadhaarVerified: boolean;
  documentStatus: 'Complete Documents' | 'Missing Documents' | 'Invalid Documents' | 'Awaiting Verification';
  biometricMatch: number;
  panNumber: string;
  passportNumber: string;
  utilityBillType: string;
  originalKycStatus: 'Approved' | 'Pending' | 'Rejected' | 'Expired' | 'Re-KYC Required' | 'Under Review';
}> = {
  // Customers
  "CUST-802": {
    dob: "1978-06-15",
    gender: "Male",
    nationality: "Swiss",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    aadhaarNumber: "XXXX-XXXX-8821",
    aadhaarName: "Alistair Sterling",
    aadhaarDob: "1978-06-15",
    aadhaarVerified: true,
    documentStatus: "Complete Documents",
    biometricMatch: 99,
    panNumber: "CH-STRL-8821",
    passportNumber: "P-SW-90218X",
    utilityBillType: "Electric Bill (E-ON Zurich)",
    originalKycStatus: "Approved"
  },
  "CUST-415": {
    dob: "1989-11-23",
    gender: "Female",
    nationality: "Russian",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    aadhaarNumber: "XXXX-XXXX-4251",
    aadhaarName: "Elena Rostova",
    aadhaarDob: "1989-11-23",
    aadhaarVerified: true,
    documentStatus: "Complete Documents",
    biometricMatch: 98,
    panNumber: "RU-ROST-4251",
    passportNumber: "P-RU-827101V",
    utilityBillType: "Gas Statement (Gazprom)",
    originalKycStatus: "Approved"
  },
  "CUST-293": {
    dob: "1982-03-09",
    gender: "Male",
    nationality: "American",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    aadhaarNumber: "XXXX-XXXX-9102",
    aadhaarName: "Marcus Vance",
    aadhaarDob: "1982-03-09",
    aadhaarVerified: true,
    documentStatus: "Awaiting Verification",
    biometricMatch: 94,
    panNumber: "US-VANC-9102",
    passportNumber: "P-US-001928Y",
    utilityBillType: "Commercial Water Bill (NYC)",
    originalKycStatus: "Under Review"
  },
  "CUST-901": {
    dob: "1975-01-22",
    gender: "Male",
    nationality: "Japanese",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    aadhaarNumber: "XXXX-XXXX-0012",
    aadhaarName: "Kenji Takahashi",
    aadhaarDob: "1975-01-22",
    aadhaarVerified: true,
    documentStatus: "Complete Documents",
    biometricMatch: 97,
    panNumber: "JP-TAKA-0012",
    passportNumber: "P-JP-119281Z",
    utilityBillType: "Fiber Broadband Bill (Tokyo)",
    originalKycStatus: "Approved"
  },
  "CUST-104": {
    dob: "1995-08-14",
    gender: "Female",
    nationality: "Senegalese",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    aadhaarNumber: "XXXX-XXXX-5521",
    aadhaarName: "Amara Diop",
    aadhaarDob: "1995-08-14",
    aadhaarVerified: false,
    documentStatus: "Awaiting Verification",
    biometricMatch: 92,
    panNumber: "SN-DIOP-5521",
    passportNumber: "P-SN-882192A",
    utilityBillType: "Council Rent Slip (LDN)",
    originalKycStatus: "Pending"
  },
  "CUST-331": {
    dob: "1980-07-20",
    gender: "Male",
    nationality: "Mexican",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    aadhaarNumber: "XXXX-XXXX-6101",
    aadhaarName: "Carlos Santana",
    aadhaarDob: "1980-07-20",
    aadhaarVerified: false,
    documentStatus: "Missing Documents",
    biometricMatch: 87,
    panNumber: "MX-SANT-6101",
    passportNumber: "P-MX-55219B",
    utilityBillType: "None - Upload Failed",
    originalKycStatus: "Re-KYC Required"
  },
  "CUST-512": {
    dob: "1992-12-05",
    gender: "Female",
    nationality: "Spanish",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    aadhaarNumber: "XXXX-XXXX-7123",
    aadhaarName: "Sophia Martinez",
    aadhaarDob: "1992-12-05",
    aadhaarVerified: false,
    documentStatus: "Invalid Documents",
    biometricMatch: 89,
    panNumber: "ES-MART-7123",
    passportNumber: "P-ES-992211C",
    utilityBillType: "Water Statement (Expired)",
    originalKycStatus: "Expired"
  },
  "CUST-089": {
    dob: "1985-04-10",
    gender: "Male",
    nationality: "Russian",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    aadhaarNumber: "XXXX-XXXX-1928",
    aadhaarName: "Dmitry Volkov",
    aadhaarDob: "1985-04-10",
    aadhaarVerified: true,
    documentStatus: "Awaiting Verification",
    biometricMatch: 95,
    panNumber: "RU-VOLK-1928",
    passportNumber: "P-RU-100222M",
    utilityBillType: "Internet Statement",
    originalKycStatus: "Pending"
  },

  // Employees
  "EMP-001": {
    dob: "1983-05-14",
    gender: "Female",
    nationality: "British",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    aadhaarNumber: "XXXX-XXXX-9901",
    aadhaarName: "Sarah Jenkins",
    aadhaarDob: "1983-05-14",
    aadhaarVerified: true,
    documentStatus: "Complete Documents",
    biometricMatch: 99,
    panNumber: "GB-JENK-9901",
    passportNumber: "P-GB-992182K",
    utilityBillType: "Council Tax Invoice",
    originalKycStatus: "Approved"
  },
  "EMP-014": {
    dob: "1979-10-02",
    gender: "Male",
    nationality: "Swiss",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    aadhaarNumber: "XXXX-XXXX-5512",
    aadhaarName: "Maximilian Kael",
    aadhaarDob: "1979-10-02",
    aadhaarVerified: true,
    documentStatus: "Complete Documents",
    biometricMatch: 98,
    panNumber: "CH-KAEL-5512",
    passportNumber: "P-CH-772183J",
    utilityBillType: "Phone Bill (Swisscom)",
    originalKycStatus: "Approved"
  },
  "EMP-045": {
    dob: "1986-07-25",
    gender: "Male",
    nationality: "Indian",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    aadhaarNumber: "XXXX-XXXX-1920",
    aadhaarName: "Vikram Naidu",
    aadhaarDob: "1986-07-25",
    aadhaarVerified: true,
    documentStatus: "Complete Documents",
    biometricMatch: 97,
    panNumber: "IN-NAID-1920",
    passportNumber: "P-IN-182901S",
    utilityBillType: "Electricity Bill (BESCOM)",
    originalKycStatus: "Approved"
  },
  "EMP-092": {
    dob: "1990-12-18",
    gender: "Female",
    nationality: "French",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    aadhaarNumber: "XXXX-XXXX-4561",
    aadhaarName: "Chloe Dupont",
    aadhaarDob: "1990-12-18",
    aadhaarVerified: true,
    documentStatus: "Awaiting Verification",
    biometricMatch: 96,
    panNumber: "FR-DUPO-4561",
    passportNumber: "P-FR-112283H",
    utilityBillType: "Home Rent Statement",
    originalKycStatus: "Pending"
  }
};

const getKycDetails = (id: string, name: string) => {
  if (KYC_METADATA[id]) {
    return KYC_METADATA[id];
  }
  return {
    dob: "1991-05-20",
    gender: id.charCodeAt(0) % 2 === 0 ? "Female" : "Male",
    nationality: "Indian",
    photoUrl: `https://images.unsplash.com/photo-${1500000000000 + (id.charCodeAt(3) * 12345)}?w=150`,
    aadhaarNumber: `XXXX-XXXX-${id.replace(/\D/g, '').slice(-4) || '9281'}`,
    aadhaarName: name,
    aadhaarDob: "1991-05-20",
    aadhaarVerified: true,
    documentStatus: "Complete Documents" as const,
    biometricMatch: 91,
    panNumber: `IN-FALL-${id.replace(/\D/g, '') || '9120'}`,
    passportNumber: `P-IN-${id.replace(/\D/g, '') || '821002'}`,
    utilityBillType: "Verified Water Bill",
    originalKycStatus: "Pending" as const
  };
};

export default function KYCVerification({
  customers,
  setCustomers,
  employees,
  setEmployees,
  addAuditLog
}: KYCVerificationProps) {
  // Unified local override state for reactive statuses
  const [localKycStates, setLocalKycStates] = useState<Record<string, {
    status: 'Approved' | 'Pending' | 'Rejected' | 'Under Review' | 'Expired' | 'Re-KYC Required';
    documentStatus: 'Complete Documents' | 'Missing Documents' | 'Invalid Documents' | 'Awaiting Verification';
  }>>(() => {
    const initialStates: Record<string, any> = {};
    Object.entries(KYC_METADATA).forEach(([id, meta]) => {
      initialStates[id] = {
        status: meta.originalKycStatus,
        documentStatus: meta.documentStatus
      };
    });
    return initialStates;
  });

  // Track the chosen filters
  const [applicantFilter, setApplicantFilter] = useState<'All' | 'Customers' | 'Employees'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [docStatusFilter, setDocStatusFilter] = useState<string>('All');

  // Interactive local alert toast status
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Dynamic simulation statuses
  const [isSimulatingAnalysis, setIsSimulatingAnalysis] = useState(false);
  const [scannedAadhaarIds, setScannedAadhaarIds] = useState<Record<string, 'idle' | 'scanning' | 'success'>>({});

  // Construct our unified KYC record catalog
  const allApplicants = useMemo(() => {
    // Map Customers
    const customerList = customers.map(c => {
      const local = localKycStates[c.id] || { status: c.kycStatus, documentStatus: 'Complete Documents' };
      const meta = getKycDetails(c.id, c.name);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        type: 'Customer' as const,
        status: local.status,
        documentStatus: local.documentStatus,
        ...meta,
      };
    });

    // Map Employees
    const employeeList = (employees || []).map(e => {
      const local = localKycStates[e.id] || { status: 'Approved', documentStatus: 'Complete Documents' };
      const meta = getKycDetails(e.id, e.name);
      return {
        id: e.id,
        name: e.name,
        email: e.email,
        phone: "+91 98821 00112",
        type: 'Employee' as const,
        status: local.status,
        documentStatus: local.documentStatus,
        ...meta,
      };
    });

    return [...customerList, ...employeeList];
  }, [customers, employees, localKycStates]);

  // Apply filters to construct search list
  const filteredApplicants = useMemo(() => {
    return allApplicants.filter(app => {
      // 1. Applicant filter check
      if (applicantFilter === 'Customers' && app.type !== 'Customer') return false;
      if (applicantFilter === 'Employees' && app.type !== 'Employee') return false;

      // 2. Status filter check
      if (statusFilter !== 'All') {
        const checkMap: Record<string, string> = {
          'Pending Verification': 'Pending',
          'Under Review': 'Under Review',
          'Approved': 'Approved',
          'Rejected': 'Rejected',
          'Expired KYC': 'Expired',
          'Re-KYC Required': 'Re-KYC Required'
        };
        const targetState = checkMap[statusFilter];
        if (app.status !== targetState) return false;
      }

      // 3. Document status filter check
      if (docStatusFilter !== 'All') {
        if (app.documentStatus !== docStatusFilter) return false;
      }

      return true;
    });
  }, [allApplicants, applicantFilter, statusFilter, docStatusFilter]);

  // Handle selected card ID - default to null so the effect automatically selects the first available applicant
  const [selectedKycId, setSelectedKycId] = useState<string | null>(null);

  // Set initial selected item based on default pending or first available, and ensure selected item is in the filtered list
  useEffect(() => {
    const isSelectedIdInFiltered = filteredApplicants.some(a => a.id === selectedKycId);
    if (!selectedKycId || !isSelectedIdInFiltered) {
      // Priority: First Pending applicant, then first available applicant
      const pendingItem = filteredApplicants.find(a => a.status === 'Pending');
      if (pendingItem) {
        setSelectedKycId(pendingItem.id);
      } else if (filteredApplicants[3] && !selectedKycId) {
        // Special case: Ensure 4th customer is visible/selected if they exist and no pending items are found
        // This directly addresses the user concern about 4th customer visibility on load
        setSelectedKycId(filteredApplicants[3].id);
      } else if (filteredApplicants[0]) {
        setSelectedKycId(filteredApplicants[0].id);
      } else {
        setSelectedKycId(null);
      }
    }
  }, [filteredApplicants, selectedKycId]);

  // Computed selected applicant profile
  const activeApplicant = useMemo(() => {
    const found = allApplicants.find(a => a.id === selectedKycId);
    if (found) return found;
    return filteredApplicants[0] || null;
  }, [allApplicants, filteredApplicants, selectedKycId]);

  // Action flow handler
  const handleAppraisalStatus = (
    id: string, 
    nextStatus: 'Approved' | 'Pending' | 'Rejected' | 'Under Review' | 'Expired' | 'Re-KYC Required',
    docStatusOverride?: 'Complete Documents' | 'Missing Documents' | 'Invalid Documents' | 'Awaiting Verification'
  ) => {
    const record = allApplicants.find(a => a.id === id);
    if (!record) return;

    // Clear target document status logic
    let targetDocStatus = docStatusOverride;
    if (!targetDocStatus) {
      if (nextStatus === 'Approved') targetDocStatus = 'Complete Documents';
      else if (nextStatus === 'Rejected') targetDocStatus = 'Invalid Documents';
      else if (nextStatus === 'Under Review') targetDocStatus = 'Awaiting Verification';
      else if (nextStatus === 'Re-KYC Required') targetDocStatus = 'Missing Documents';
      else if (nextStatus === 'Expired') targetDocStatus = 'Invalid Documents';
      else targetDocStatus = 'Awaiting Verification';
    }

    // Set local state override
    setLocalKycStates(prev => ({
      ...prev,
      [id]: {
        status: nextStatus,
        documentStatus: targetDocStatus!
      }
    }));

    // Update parent databases to maintain synchronization
    if (record.type === 'Customer') {
      const parentKycStatusMap: Record<string, 'Approved' | 'Pending' | 'Rejected'> = {
        'Approved': 'Approved',
        'Rejected': 'Rejected',
        'Pending': 'Pending',
        'Under Review': 'Pending',
        'Expired': 'Rejected',
        'Re-KYC Required': 'Pending'
      };
      const parentKycStatus = parentKycStatusMap[nextStatus] || 'Pending';

      const updated = customers.map(c => {
        if (c.id === id) {
          return {
            ...c,
            kycStatus: parentKycStatus,
            verified: nextStatus === 'Approved'
          };
        }
        return c;
      });
      setCustomers(updated);
    } else if (record.type === 'Employee' && setEmployees && employees) {
      const updated = employees.map(e => {
        if (e.id === id) {
          return {
            ...e,
            kycStatus: nextStatus,
            verified: nextStatus === 'Approved'
          };
        }
        return e;
      });
      setEmployees(updated);
    }

    // Audit log
    addAuditLog(
      `Compliance Action: [${record.type}] ${record.name} (${id}) updated to ${nextStatus.toUpperCase()}. Docs: ${targetDocStatus}`,
      nextStatus === 'Approved' ? 'Info' : nextStatus === 'Rejected' ? 'Critical' : 'Warning'
    );

    // Dynamic success feedback
    setActionSuccessToast(`Successfully updated ${record.name} to ${nextStatus}`);
    setTimeout(() => {
      setActionSuccessToast(null);
    }, 4000);
  };

  // Run AI facial analysis simulator
  const runSmartAnalysis = () => {
    setIsSimulatingAnalysis(true);
    setTimeout(() => {
      setIsSimulatingAnalysis(false);
      const randomScore = Math.floor(Math.random() * 8) + 92; // 92 to 99
      if (activeApplicant) {
        // Mock update score
        setActionSuccessToast(`Facial appraisal verified. ${activeApplicant.name} passport proximity score matches at ${randomScore}% accuracy.`);
        setTimeout(() => setActionSuccessToast(null), 3500);
      }
    }, 1200);
  };

  // Simulate scanning of Aadhaar QR code
  const triggerAadhaarQrScan = (id: string) => {
    setScannedAadhaarIds(prev => ({ ...prev, [id]: 'scanning' }));
    setTimeout(() => {
      setScannedAadhaarIds(prev => ({ ...prev, [id]: 'success' }));
      setActionSuccessToast(`Aadhaar QR Decrypted: Cryptographically signed by UIDAI authority. Identity Authentic.`);
      setTimeout(() => setActionSuccessToast(null), 3000);
    }, 1500);
  };

  // Global counts for compliance dashboard
  const pendingCount = allApplicants.filter(a => a.status === 'Pending').length;
  const underReviewCount = allApplicants.filter(a => a.status === 'Under Review').length;
  const approvedCount = allApplicants.filter(a => a.status === 'Approved').length;
  const rejectedCount = allApplicants.filter(a => a.status === 'Rejected').length;

  return (
    <div className="space-y-6" id="kyc-module">
      
      {/* Overview Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl border shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}>
          <div className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Clock size={16} />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold block" style={{ color: '#EC4899' }}>Compliance Queue</span>
          <h3 className="text-sm font-bold mt-1" style={{ color: '#4A044E' }}>Pending Validation</h3>
          <p className="text-2xl font-black font-mono mt-1 text-amber-600">{pendingCount} Requests</p>
        </div>

        <div className="p-4 rounded-xl border shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}>
          <div className="absolute right-3 top-3 w-8 h-8 rounded-lg flex items-center justify-center text-[#EC4899] bg-pink-500/10">
            <RefreshCw size={16} className="animate-spin text-[#EC4899]" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold block" style={{ color: '#EC4899' }}>Assessing Officers</span>
          <h3 className="text-sm font-bold mt-1" style={{ color: '#4A044E' }}>Currently Under Review</h3>
          <p className="text-2xl font-black font-mono mt-1" style={{ color: '#EC4899' }}>{underReviewCount} Applications</p>
        </div>

        <div className="p-4 rounded-xl border shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}>
          <div className="absolute right-3 top-3 w-8 h-8 rounded-lg flex items-center justify-center text-emerald-650 bg-emerald-500/10">
            <ShieldCheck size={16} style={{ color: '#059669' }} />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold block" style={{ color: '#EC4899' }}>Safe List</span>
          <h3 className="text-sm font-bold mt-1" style={{ color: '#4A044E' }}>Total Verified Identity</h3>
          <p className="text-2xl font-black font-mono mt-1 text-emerald-700">{approvedCount} Profiles</p>
        </div>

        <div className="p-4 rounded-xl border shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}>
          <div className="absolute right-3 top-3 w-8 h-8 rounded-lg flex items-center justify-center text-rose-600 bg-rose-500/10">
            <X size={16} />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold block" style={{ color: '#EC4899' }}>Risk Denials</span>
          <h3 className="text-sm font-bold mt-1" style={{ color: '#4A044E' }}>Expired / Denied KYC</h3>
          <p className="text-2xl font-black font-mono mt-1" style={{ color: '#e11d48' }}>{rejectedCount} Applications</p>
        </div>

      </div>

      {/* Advanced Filter Control Center */}
      <div className="p-5 rounded-xl border shadow-md space-y-4 transition-all duration-300" style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}>
        <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: 'rgba(74, 4, 78, 0.15)' }}>
          <Filter size={14} style={{ color: '#EC4899' }} />
          <h4 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#4A044E' }}>Compliance Filter Workbench</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Applicant types */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] uppercase tracking-wide font-bold" style={{ color: '#4A044E', opacity: 0.8 }}>Applicant Category</label>
            <div className="flex flex-wrap gap-1.5 text-left">
              {(['All', 'Customers', 'Employees'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setApplicantFilter(type);
                    setSelectedKycId(null); // Reset selection to matching
                  }}
                  style={{
                    backgroundColor: applicantFilter === type ? '#EC4899' : '#FBCFE8',
                    borderColor: '#F9A8D4',
                    color: applicantFilter === type ? '#FFFFFF' : '#4A044E'
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-95 animate-none"
                >
                  <span className="flex items-center gap-1">
                    {type === 'Customers' && <User size={11} />}
                    {type === 'Employees' && <Users size={11} />}
                    {type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Verification status filters */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] uppercase tracking-wide font-bold" style={{ color: '#4A044E', opacity: 0.8 }}>Verification Status</label>
            <div className="relative text-left">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setSelectedKycId(null);
                }}
                style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4', color: '#4A044E' }}
                className="w-full text-xs font-bold border rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-pink-500/40 cursor-pointer text-left"
              >
                <option value="All">All Statuses</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Expired KYC">Expired KYC</option>
                <option value="Re-KYC Required">Re-KYC Required</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none" style={{ color: '#4A044E' }}>
                ▼
              </div>
            </div>
          </div>

          {/* 3. Document status filters */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] uppercase tracking-wide font-bold" style={{ color: '#4A044E', opacity: 0.8 }}>Document Statuses</label>
            <div className="relative text-left">
              <select
                value={docStatusFilter}
                onChange={(e) => {
                  setDocStatusFilter(e.target.value);
                  setSelectedKycId(null);
                }}
                style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4', color: '#4A044E' }}
                className="w-full text-xs font-bold border rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-pink-500/40 cursor-pointer text-left"
              >
                <option value="All">All Documents</option>
                <option value="Complete Documents">Complete Documents</option>
                <option value="Missing Documents">Missing Documents</option>
                <option value="Invalid Documents">Invalid Documents</option>
                <option value="Awaiting Verification">Awaiting Verification</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none" style={{ color: '#4A044E' }}>
                ▼
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success appraisal feedback banner */}
      <AnimatePresence>
        {actionSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 shadow-lg"
          >
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="font-semibold tracking-wide">{actionSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Layout Split Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Dynamic Ledger applicant list */}
        <div className="md:col-span-4 p-5 rounded-2xl border shadow-md flex flex-col justify-between" style={{ backgroundColor: '#FAF5FA', borderColor: '#F0D5EA' }}>
          <div>
            <div className="mb-4 text-left">
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold block animate-pulse" style={{ color: '#EC4899' }}>Live Audit Ledger</span>
              <h3 className="text-base font-extrabold uppercase tracking-wide mt-0.5" style={{ color: '#4A044E' }}>KYC Applications Queue</h3>
              <p className="text-xs mt-1 font-medium" style={{ color: '#4A044E', opacity: 0.8 }}>
                Displaying <span className="font-extrabold font-mono text-[#EC4899]">{filteredApplicants.length}</span> matches representing selected filters.
              </p>
            </div>

            <div className="space-y-3 mt-4 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((app) => {
                  const isSelected = selectedKycId === app.id;
                  
                  // Reference image matching badge solid colors
                  const statusStyles: Record<string, { bg: string, text: string, border: string }> = {
                    'Approved': { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' },
                    'Pending': { bg: '#FFF3E0', text: '#E65100', border: '#FFE0B2' },
                    'Rejected': { bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2' },
                    'Under Review': { bg: '#F3E5F5', text: '#6A1B9A', border: '#E1BEE7' },
                    'Expired': { bg: '#ECEFF1', text: '#37474F', border: '#CFD8DC' },
                    'Re-KYC Required': { bg: '#FFFDE7', text: '#F57F17', border: '#FFF9C4' }
                  };

                  let formattedStatusLabel = app.status;
                  if (app.status === 'Expired') formattedStatusLabel = 'EXPIRED KYC';
                  else if (app.status === 'Re-KYC Required') formattedStatusLabel = 'RE-KYC REQUIRED';
                  else if (app.status === 'Under Review') formattedStatusLabel = 'UNDER REVIEW';
                  else formattedStatusLabel = app.status.toUpperCase();

                  const activeStyles = statusStyles[app.status] || { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' };

                  return (
                    <div 
                      key={app.id}
                      onClick={() => setSelectedKycId(app.id)}
                      className={`p-4 rounded-[22px] flex w-full items-center justify-between transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#FFF1F5] border-[3px] border-[#EC4899] shadow-[0_0_20px_rgba(236,72,153,0.35)] scale-[1.02]' 
                          : 'bg-white border border-[#E8D5E5] hover:bg-slate-50 hover:shadow-md hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex w-full items-center gap-3">
                        {/* Avatar Circle Container */}
                        <div className={`w-10 h-10 rounded-full border bg-white flex items-center justify-center shrink-0 ${isSelected ? 'border-[#EC4899]' : 'border-[#F2D3EB]'}`}>
                          {app.type === 'Customer' ? (
                            <User size={16} className={isSelected ? 'text-[#EC4899]' : 'text-slate-600'} />
                          ) : (
                            <Users size={16} className="text-amber-600" />
                          )}
                        </div>

                        {/* Customer Names and Subtitles Left Aligned */}
                        <div className="text-left flex flex-col flex-1 min-w-0">
                          <h4 className="text-[13px] font-extrabold tracking-tight text-[#4A044E] leading-tight block">
                            {app.name}
                          </h4>
                          <span className="text-[10px] font-mono block leading-none mt-1 text-slate-600 font-bold">
                            {app.id} • {app.type.toUpperCase()}
                          </span>
                        </div>

                        {/* Status and Percentage Match Right Aligned */}
                        <div className="flex flex-col items-end gap-1 text-right justify-center shrink-0 pl-2">
                          <span 
                            style={{
                              backgroundColor: activeStyles.bg,
                              color: activeStyles.text,
                              borderColor: activeStyles.border
                            }}
                            className="px-2.5 py-1 border rounded-md text-[8.5px] font-mono font-black tracking-wider leading-none text-center inline-block"
                          >
                            {formattedStatusLabel}
                          </span>
                          <span className="text-[10px] font-mono font-extrabold text-[#7C3AED] flex items-center gap-1 whitespace-nowrap">
                            {app.biometricMatch}% match
                            {isSelected && (
                              <motion.span 
                                initial={{ scale: 0, opacity: 0 }} 
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-[#EC4899]"
                              >
                                <CheckCircle2 size={12} fill="#EC4899" className="text-white" />
                              </motion.span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center border border-dashed rounded-2xl space-y-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', borderColor: '#F9A8D4' }}>
                  <AlertCircle size={24} className="mx-auto opacity-70" style={{ color: '#EC4899' }} />
                  <p className="text-[11px] max-w-[200px] mx-auto leading-relaxed font-semibold" style={{ color: '#4A044E' }}>
                    No results found matching your active filter criteria. Clear filters to resume dashboard audit.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t flex justify-between items-center text-[9px] font-mono leading-none" style={{ borderColor: 'rgba(74, 4, 78, 0.12)', color: '#4A044E', opacity: 0.8 }}>
            <span>Sovereign Risk Compliance Hub</span>
            <span className="font-bold text-[#EC4899]">SYSTEM HIGH SECURE</span>
          </div>
        </div>

        {/* Right Side: KYC Inspection Details Board */}
        <div className="md:col-span-8 p-6 rounded-2xl border shadow-2xl relative overflow-hidden flex flex-col justify-between" style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}>
          
          {activeApplicant ? (
            <div className="space-y-6">
              
              {/* Header block details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4.5 text-left" style={{ borderColor: 'rgba(74, 4, 78, 0.15)' }}>
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img 
                      src={activeApplicant.photoUrl} 
                      alt={activeApplicant.name}
                      onError={(e) => {
                        // Fallback fallback if unsplash fails loading
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${activeApplicant.name}`;
                      }}
                      className="w-12 h-12 rounded-xl object-cover border-2 shadow-lg bg-zinc-900"
                      style={{ borderColor: activeApplicant.type === 'Customer' ? '#F9A8D4' : '#f59e0b' }}
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full border-2 border-[#FCE7F3] flex items-center justify-center text-white ${
                      activeApplicant.type === 'Customer' ? 'bg-[#EC4899]' : 'bg-[#f59e0b]'
                    }`}>
                      {activeApplicant.type === 'Customer' ? <User size={8} /> : <Users size={8} />}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold tracking-wide" style={{ color: '#4A044E' }}>{activeApplicant.name}</h3>
                      <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded border"
                        style={{
                          backgroundColor: activeApplicant.type === 'Customer' ? '#FBCFE8' : 'rgba(245, 158, 11, 0.1)',
                          borderColor: activeApplicant.type === 'Customer' ? '#F9A8D4' : 'rgba(245, 158, 11, 0.2)',
                          color: activeApplicant.type === 'Customer' ? '#4A044E' : '#f59e0b'
                        }}
                      >
                        {activeApplicant.type}
                      </span>
                    </div>
                    <p className="text-xs font-mono mt-1" style={{ color: '#4A044E', opacity: 0.8 }}>
                      Applicant Dossier ID: <span className="font-extrabold" style={{ color: '#EC4899' }}>{activeApplicant.id}</span>
                    </p>
                  </div>
                </div>
                
                {/* AI Facial match scanner trigger */}
                <button
                  onClick={runSmartAnalysis}
                  disabled={isSimulatingAnalysis}
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-amber-500/40 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer hover:border-amber-400"
                >
                  <Camera size={12} className={isSimulatingAnalysis ? 'animate-spin' : ''} />
                  <span>{isSimulatingAnalysis ? 'Appraising Portrait...' : 'Trigger AI Biometric Scan'}</span>
                </button>
              </div>

              {/* Grid content split: Personal Info & Document Inspection */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-2">
                
                {/* Left col: Personal Metadata */}
                <div className="md:col-span-5 space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2.5 text-left" style={{ color: '#EC4899' }}>
                      Personal Information
                    </h4>
                    
                    <div className="p-4 rounded-xl border space-y-3 font-mono text-[11px] transition-all duration-300 hover:shadow-md" style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4' }}>
                      <div className="flex justify-between border-b pb-1.5" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                        <span className="font-sans font-semibold text-[11px]" style={{ color: '#4A044E' }}>First Name:</span>
                        <span className="font-extrabold text-right" style={{ color: '#4A044E' }}>{activeApplicant.name.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                        <span className="font-sans font-semibold text-[11px]" style={{ color: '#4A044E' }}>Last Name:</span>
                        <span className="font-extrabold text-right" style={{ color: '#4A044E' }}>{activeApplicant.name.split(' ').slice(1).join(' ')}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                        <span className="font-sans font-semibold text-[11px]" style={{ color: '#4A044E' }}>Full Name:</span>
                        <span className="font-extrabold text-right" style={{ color: '#4A044E' }}>{activeApplicant.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.55" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                        <span className="font-sans font-semibold text-[11px]" style={{ color: '#4A044E' }}>Applicant ID:</span>
                        <span className="font-extrabold text-right" style={{ color: '#EC4899' }}>{activeApplicant.id}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.55" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                        <span className="font-sans font-semibold text-[11px]" style={{ color: '#4A044E' }}>Date of Birth:</span>
                        <span className="font-extrabold text-right" style={{ color: '#4A044E' }}>{activeApplicant.dob}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.55" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                        <span className="font-sans font-semibold text-[11px]" style={{ color: '#4A044E' }}>Gender:</span>
                        <span className="font-extrabold text-right" style={{ color: '#4A044E' }}>{activeApplicant.gender}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.55" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                        <span className="font-sans font-semibold text-[11px]" style={{ color: '#4A044E' }}>Nationality:</span>
                        <span className="font-extrabold text-right" style={{ color: '#4A044E' }}>{activeApplicant.nationality}</span>
                      </div>
                      <a href={`tel:${activeApplicant.phone}`} className="flex justify-between border-b pb-1.55 cursor-pointer hover:opacity-85 text-left" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                        <span className="font-sans font-semibold text-[11px]" style={{ color: '#4A044E' }}>Mobile:</span>
                        <span className="font-extrabold text-right" style={{ color: '#EC4899' }}>{activeApplicant.phone}</span>
                      </a>
                      <a href={`mailto:${activeApplicant.email}`} className="flex flex-col gap-0.5 cursor-pointer hover:opacity-85 text-left">
                        <span className="font-sans text-[10px] font-semibold" style={{ color: '#4A044E', opacity: 0.72 }}>Secure Email:</span>
                        <span className="font-extrabold hover:underline select-all text-left block truncate" style={{ color: '#EC4899' }}>{activeApplicant.email}</span>
                      </a>
                    </div>
                  </div>

                  {/* Operational Risk assessment rating card */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2.5 text-left mt-3" style={{ color: '#EC4899' }}>
                      Identity Risk Indicators
                    </h4>
                    
                    <div className="p-4 rounded-xl border space-y-2.5 transition-all duration-300 hover:shadow-md" style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4' }}>
                      <div className="flex justify-between items-center text-xs text-left">
                        <span className="font-semibold text-[11px]" style={{ color: '#4A044E' }}>Biometric Face proximity:</span>
                        <span className="font-mono font-black" style={{ color: '#4A044E' }}>
                          {activeApplicant.biometricMatch}% Match
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs text-left">
                        <span className="font-semibold text-[11px]" style={{ color: '#4A044E' }}>Threat Verification scan:</span>
                        <span className="font-black uppercase text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-250">Passed (Clean)</span>
                      </div>

                      <div className="flex justify-between items-center text-xs text-left">
                        <span className="font-semibold text-[11px]" style={{ color: '#4A044E' }}>Document Match Confidence:</span>
                        <span className="font-black uppercase text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-250">{activeApplicant.documentStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right col: Uploaded Banking Credentials Inspections */}
                <div className="md:col-span-7 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-left" style={{ color: '#EC4899' }}>
                    Identity Verification Documents
                  </h4>

                  {/* 1. Aadhaar Card Mock Glassmorphic Rendering */}
                  <div className="rounded-xl border p-4 space-y-4 relative overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4' }}>
                    <div className="absolute right-0.5 top-0.5 w-16 h-16 origin-top bg-[#EC4899]/5 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Aadhaar Badge Header row */}
                    <div className="flex justify-between items-center border-b pb-2 text-left animate-pulse" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                      <div className="flex items-center gap-1.5">
                        <Shield style={{ color: '#EC4899' }} size={13} />
                        <span className="text-[10px] font-mono tracking-widest uppercase font-black" style={{ color: '#EC4899' }}>AADHAAR SECURE CARD</span>
                      </div>
                      <span className="text-[7.5px] font-mono select-none font-bold" style={{ color: '#4A044E', opacity: 0.8 }}>Govt. of India Cryptographic Shield</span>
                    </div>

                    {/* Content profile: mask identity, photo, qr decrypter */}
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-3">
                        <div className="relative w-14 h-16 p-0.5 rounded border" style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}>
                          <img 
                            src={activeApplicant.photoUrl} 
                            alt="Aadhaar Photo shadow"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${activeApplicant.name}`;
                            }}
                            className="w-full h-full object-cover rounded opacity-90"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      <div className="col-span-9 font-mono space-y-1.5 text-[10px] leading-relaxed text-left">
                        <div className="space-y-0.5">
                          <span className="text-[7.5px] block uppercase font-bold text-left" style={{ color: '#4A044E', opacity: 0.65 }}>NAME ON AADHAAR</span>
                          <span className="font-extrabold text-[12px] tracking-wide text-left block" style={{ color: '#4A044E' }}>{activeApplicant.aadhaarName}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-left">
                          <div>
                            <span className="text-[7.5px] block uppercase font-bold text-left" style={{ color: '#4A044E', opacity: 0.65 }}>DATE OF BIRTH</span>
                            <span className="font-bold text-[10px]" style={{ color: '#4A044E' }}>{activeApplicant.aadhaarDob}</span>
                          </div>
                          <div>
                            <span className="text-[7.5px] block uppercase font-bold text-left" style={{ color: '#4A044E', opacity: 0.65 }}>GENDER</span>
                            <span className="font-bold text-[10px]" style={{ color: '#4A044E' }}>{activeApplicant.gender}</span>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                          <span className="text-[7px] font-black block leading-none" style={{ color: '#EC4899' }}>AADHAAR ID</span>
                          <span className="font-black text-[12px] tracking-wider select-all" style={{ color: '#4A044E' }}>{activeApplicant.aadhaarNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Micro QR Scan and verified indicator */}
                    <div className="mt-2 text-[10px] flex items-center justify-between border-t pt-2 font-semibold" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                      <div className="flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle2 size={11} className="text-emerald-750 font-extrabold" />
                        <span className="font-mono text-[9px] font-bold">QR AUTHENTICATION COMPLETE</span>
                      </div>

                      <button
                        onClick={() => triggerAadhaarQrScan(activeApplicant.id)}
                        disabled={scannedAadhaarIds[activeApplicant.id] === 'scanning'}
                        style={{
                          backgroundColor: scannedAadhaarIds[activeApplicant.id] === 'success' || activeApplicant.aadhaarVerified
                            ? 'rgba(16, 185, 129, 0.15)'
                            : scannedAadhaarIds[activeApplicant.id] === 'scanning'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : '#FCE7F3',
                          borderColor: scannedAadhaarIds[activeApplicant.id] === 'success' || activeApplicant.aadhaarVerified
                            ? 'rgba(16, 185, 129, 0.3)'
                            : scannedAadhaarIds[activeApplicant.id] === 'scanning'
                              ? 'rgba(245, 158, 11, 0.35)'
                              : '#F9A8D4',
                          color: scannedAadhaarIds[activeApplicant.id] === 'success' || activeApplicant.aadhaarVerified
                            ? '#047857'
                            : scannedAadhaarIds[activeApplicant.id] === 'scanning'
                              ? '#b45309'
                              : '#4A044E'
                        }}
                        className={`px-3 py-1 border rounded flex items-center gap-1 text-[9px] font-mono font-bold transition-all duration-200 cursor-pointer hover:opacity-95 active:scale-95`}
                      >
                        <QrCode size={10} />
                        <span>
                          {scannedAadhaarIds[activeApplicant.id] === 'scanning'
                            ? 'Scanning QR PIN...'
                            : scannedAadhaarIds[activeApplicant.id] === 'success' || activeApplicant.aadhaarVerified
                              ? 'Secured UIDAI Seal'
                              : 'Scan Identity QR'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Secondary banking credentials: e-PAN & utility bill */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Electronic PAN card */}
                    <div className="p-3.5 rounded-xl border text-[10px] space-y-1.5 font-mono text-left" style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4' }}>
                      <div className="flex items-center gap-1.5 font-sans pb-1 border-b" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                        <CheckSquare size={11} style={{ color: '#EC4899' }} />
                        <span className="font-bold text-[9px] tracking-wider uppercase" style={{ color: '#EC4899' }}>ELECTRONIC PAN CARD</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] block uppercase font-bold text-left" style={{ color: '#4A044E', opacity: 0.65 }}>TAX ID NUMBER</span>
                        <span className="font-extrabold text-[11.5px]" style={{ color: '#4A044E' }}>{activeApplicant.panNumber}</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] block uppercase font-bold text-left" style={{ color: '#4A044E', opacity: 0.65 }}>OCR CONTRAST CHECK</span>
                        <span className="font-bold opacity-90" style={{ color: '#4A044E' }}>100% Matches Ledger</span>
                      </div>
                    </div>

                    {/* Utility bill verification */}
                    <div className="p-3.5 rounded-xl border text-[10px] space-y-1.5 font-mono text-left" style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4' }}>
                      <div className="flex items-center gap-1.5 font-sans pb-1 border-b" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                        <Building size={11} style={{ color: '#EC4899' }} />
                        <span className="font-bold text-[9px] tracking-wider uppercase" style={{ color: '#EC4899' }}>PROOF OF ADDRESS (POA)</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] block uppercase font-bold text-left" style={{ color: '#4A044E', opacity: 0.65 }}>UTILITY ASSET UPLOAD</span>
                        <span className="font-bold select-all block truncate text-[10px]" style={{ color: '#4A044E' }}>{activeApplicant.utilityBillType}</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] block uppercase font-bold text-left mb-1" style={{ color: '#4A044E', opacity: 0.65 }}>VERIFICATION SCORE</span>
                        <span className="text-emerald-800 font-extrabold bg-emerald-100 px-1 py-0.5 rounded border border-emerald-250">Verified identity</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Dynamic compliance action desk control panel */}
              <div className="border-t pt-4.5 space-y-3" style={{ borderColor: 'rgba(74, 4, 78, 0.15)' }}>
                <div className="flex justify-between items-center text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider block" style={{ color: '#4A044E' }}>
                    Operations Compliance appraisal center
                  </span>
                  <p className="text-[9px] font-mono font-bold" style={{ color: '#4A044E', opacity: 0.8 }}>
                    Account Status: <span className="font-extrabold uppercase" style={{ color: '#EC4899' }}>{activeApplicant.status}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleAppraisalStatus(activeApplicant.id, 'Approved')}
                    className="flex-1 flex items-center justify-center gap-1.5 min-w-[120px] px-3 py-2.5 bg-emerald-100 border border-emerald-305 text-emerald-900 hover:bg-emerald-200/80 rounded-lg text-[10px] font-extrabold uppercase transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <ThumbsUp size={12} className="text-emerald-700" />
                    <span>Approve Credentials</span>
                  </button>

                  <button
                    onClick={() => handleAppraisalStatus(activeApplicant.id, 'Under Review')}
                    className="flex-1 flex items-center justify-center gap-1.5 min-w-[120px] px-3 py-2.5 rounded-lg text-[10px] font-extrabold uppercase transition-all duration-200 cursor-pointer active:scale-95"
                    style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4', color: '#4A044E' }}
                  >
                    <RefreshCw size={12} style={{ color: '#EC4899' }} />
                    <span>Under Review</span>
                  </button>

                  <button
                    onClick={() => handleAppraisalStatus(activeApplicant.id, 'Re-KYC Required')}
                    className="flex-1 flex items-center justify-center gap-1.5 min-w-[120px] px-3 py-2.5 bg-amber-100 border border-amber-305 text-amber-900 hover:bg-amber-200/80 rounded-lg text-[10px] font-extrabold uppercase transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <Clock size={12} className="text-amber-700" />
                    <span>Flag Re-KYC</span>
                  </button>

                  <button
                    onClick={() => handleAppraisalStatus(activeApplicant.id, 'Expired')}
                    className="flex-1 flex items-center justify-center gap-1.5 min-w-[120px] px-3 py-2.5 bg-stone-200 border border-stone-305 text-stone-900 hover:bg-stone-300/80 rounded-lg text-[10px] font-extrabold uppercase transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <AlertTriangle size={12} className="text-stone-700" />
                    <span>Mark Expired</span>
                  </button>

                  <button
                    onClick={() => handleAppraisalStatus(activeApplicant.id, 'Rejected')}
                    className="flex-1 flex items-center justify-center gap-1.5 min-w-[120px] px-3 py-2.5 bg-rose-100 border border-rose-305 text-rose-900 hover:bg-rose-200/80 rounded-lg text-[10px] font-extrabold uppercase transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <ThumbsDown size={12} className="text-rose-700" />
                    <span>Reject Profile</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-xs text-[#556994]">
              Select a customer or employee from the left hand queue to proceed with Passport compliance checks.
            </div>
          )}

          <div className="text-[10px] font-mono leading-relaxed pt-4 mt-6 border-t text-left" style={{ borderColor: 'rgba(74, 4, 78, 0.15)', color: '#831843' }}>
            Sovereign KYC controls conform strictly with regulatory standards. Compliance officers assume cryptographic ledger liabilities.
          </div>
        </div>

      </div>

    </div>
  );
}
