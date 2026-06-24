import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldAlert, 
  UserMinus, 
  UserCheck, 
  Eye, 
  FileCheck, 
  Ban, 
  Plus, 
  X, 
  BadgeCheck, 
  MoreVertical,
  Activity,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Clock,
  Building,
  Shield,
  Briefcase,
  Award,
  Coins,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Customer, Transaction } from '../types/dashboard';
import { useTranslation } from './LanguageContext';

interface ApproverDetails {
  name: string;
  id: string;
  designation: string;
  email: string;
  phone: string;
  office: string;
  clearance: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Not Required';
  avatarSeed: string;
}

const approversRepo: Record<string, any> = {
  "EMP-1024": {
    id: "EMP-1024",
    name: "Sarah Johnson",
    role: "Senior Banking Officer",
    email: "s.johnson@apexbank.com",
    phone: "+1 (555) 019-1024",
    department: "Retail & VIP Accounts",
    rating: 4.8,
    clearance: "Level 3 - Account Authority",
    status: "Active",
    joinDate: "2019-03-24",
    office: "Hyderabad Main Terminal",
    avatarSeed: "sj"
  },
  "EMP-1088": {
    id: "EMP-1088",
    name: "Marcus Davies",
    role: "Compliance Analyst",
    email: "m.davies@apexbank.com",
    phone: "+1 (555) 019-1088",
    department: "Onboarding & Analytics",
    rating: 4.6,
    clearance: "Level 2 - Operations Support",
    status: "Active",
    joinDate: "2021-05-12",
    office: "New York Hub Terminal",
    avatarSeed: "md"
  },
  "EMP-001": {
    id: "EMP-001",
    name: "Sarah Jenkins",
    role: "Senior Compliance Officer",
    email: "s.jenkins@apexbank.com",
    phone: "+1 (555) 019-0012",
    department: "Risk & Compliance",
    rating: 4.9,
    clearance: "Level 4 - Executive Audit",
    status: "Active",
    joinDate: "2018-02-15",
    office: "New York Wall St. Flagship",
    avatarSeed: "sj"
  },
  "EMP-092": {
    id: "EMP-092",
    name: "Chloe Dupont",
    role: "Senior Loan Underwriter",
    email: "c.dupont@apexbank.com",
    phone: "+44 7700 900511",
    department: "Lending Ops",
    rating: 4.7,
    clearance: "Level 4 - Credit Approval",
    status: "Active",
    joinDate: "2021-06-18",
    office: "London Square Premium",
    avatarSeed: "cd"
  },
  "EMP-0112": {
    id: "EMP-0112",
    name: "Tariq Mahmood",
    role: "KYC Onboarding Lead",
    email: "t.mahmood@apexbank.com",
    phone: "+44 7700 911005",
    department: "Sovereign Compliance",
    rating: 4.5,
    clearance: "Level 3 - Compliance Clearance",
    status: "Active",
    joinDate: "2020-04-09",
    office: "London Regional HQ",
    avatarSeed: "tm"
  },
  "EMP-0007": {
    id: "EMP-0007",
    name: "Mohammed Rahman",
    role: "Branch Manager",
    email: "m.rahman@apexbank.com",
    phone: "+1 (555) 019-0007",
    department: "Branch Command & Ops",
    rating: 4.9,
    clearance: "Level 4 - Branch Controller",
    status: "Active",
    joinDate: "2014-06-11",
    office: "Hyderabad Main Branch",
    avatarSeed: "mr"
  },
  "EMP-014": {
    id: "EMP-014",
    name: "Maximilian Kael",
    role: "Zurich Branch Manager",
    email: "m.kael@apexbank.com",
    phone: "+41 44 200 1192",
    department: "High Net Wealth Command",
    rating: 4.9,
    clearance: "Level 4 - Swiss Domain Lead",
    status: "Active",
    joinDate: "2015-08-10",
    office: "Zurich Elite Vault",
    avatarSeed: "mk"
  },
  "EMP-0088": {
    id: "EMP-0088",
    name: "Charles Windsor",
    role: "Branch Manager",
    email: "c.windsor@apexbank.com",
    phone: "+44 7700 900222",
    department: "United Kingdom Accounts",
    rating: 4.7,
    clearance: "Level 4 - Westminster Lead",
    status: "Active",
    joinDate: "2017-09-01",
    office: "London Square Premium",
    avatarSeed: "cw"
  },
  "EMP-0079": {
    id: "EMP-0079",
    name: "Masami Tanaka",
    role: "Tokyo Branch Manager",
    email: "m.tanaka@apexbank.com",
    phone: "+81 90 9988 7766",
    department: "APAC Corporate Hub",
    rating: 4.8,
    clearance: "Level 4 - Tokyo Area Lead",
    status: "Active",
    joinDate: "2016-11-20",
    office: "Tokyo Neo Skyline",
    avatarSeed: "mt"
  },
  "EMP-0082": {
    id: "EMP-0082",
    name: "Lawrence Wong",
    role: "Singapore Branch Manager",
    email: "l.wong@apexbank.com",
    phone: "+65 6777 5544",
    department: "Wealth Management & Trust",
    rating: 4.6,
    clearance: "Level 4 - Singapore Sovereign Control",
    status: "Active",
    joinDate: "2018-05-15",
    office: "Singapore Wharf Hub",
    avatarSeed: "lw"
  },
  "EMP-0055": {
    id: "EMP-0055",
    name: "Rajesh Kumar",
    role: "Regional Operations Head",
    email: "r.kumar@apexbank.com",
    phone: "+91 98765 43210",
    department: "Sovereign Core Administration",
    rating: 5.0,
    clearance: "Level 5 - Regional Executive Authority",
    status: "Active",
    joinDate: "2010-01-05",
    office: "Regional Sovereign Command Centre",
    avatarSeed: "rk"
  },
  "EMP-0210": {
    id: "EMP-0210",
    name: "Robert Sterling",
    role: "North America Operations Head",
    email: "r.sterling@apexbank.com",
    phone: "+1 (555) 019-0210",
    department: "Sovereign Core Administration",
    rating: 4.9,
    clearance: "Level 5 - AMER Regional Lead",
    status: "Active",
    joinDate: "2011-04-10",
    office: "Manhattan Premium HQ",
    avatarSeed: "rs"
  },
  "EMP-0211": {
    id: "EMP-0211",
    name: "Christian Lindner",
    role: "EMEA Regional Director",
    email: "c.lindner@apexbank.com",
    phone: "+49 30 1200 4433",
    department: "Sovereign Core Administration",
    rating: 4.8,
    clearance: "Level 5 - EMEA Admin Overlord",
    status: "Active",
    joinDate: "2012-07-15",
    office: "Geneva Sovereign Hub",
    avatarSeed: "cl"
  },
  "EMP-0212": {
    id: "EMP-0212",
    name: "Siddharth Shanmugam",
    role: "APAC Regional Command Head",
    email: "s.shanmugam@apexbank.com",
    phone: "+65 6222 3344",
    department: "Sovereign Core Administration",
    rating: 4.9,
    clearance: "Level 5 - APAC Command Lead",
    status: "Active",
    joinDate: "2013-09-01",
    office: "Singapore Sentosa Gate",
    avatarSeed: "ss"
  },
  "EMP-2001": {
    id: "EMP-2001",
    name: "Sophia Loren",
    role: "Chief Underwriter / COO",
    email: "s.loren@apexbank.com",
    phone: "+41 22 888 2001",
    department: "Global Sovereign Treasury",
    rating: 5.0,
    clearance: "Level 5 - Global Operations COO",
    status: "Active",
    joinDate: "2008-01-15",
    office: "Zurich Core Sovereign Hub",
    avatarSeed: "sl"
  }
};

const formatDateWithTime = (dateStr: string, hourStr: string, minStr: string) => {
  const mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  try {
    if (!dateStr) return `12-Jun-2026 ${hourStr}:${minStr} AM`;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parts[0];
      const mIdx = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const mName = mNames[mIdx] || "Jun";
      const dStr = d < 10 ? `0${d}` : `${d}`;
      return `${dStr}-${mName}-${y} ${hourStr}:${minStr} ${parseInt(hourStr.split(':')[0], 10) >= 12 || hourStr.toLowerCase().includes("pm") ? 'PM' : 'AM'}`;
    }
  } catch (e) {
    // fallback
  }
  return `12-Jun-2026 ${hourStr}:${minStr} AM`;
};

const getBranchProfile = (cId: string, bId: string) => {
  const lowerId = cId.toLowerCase();
  if (lowerId === 'cust-293') {
    return {
      name: "Hyderabad Main Branch",
      code: "BR-101",
      location: "Financial District, Hyderabad, India",
      region: "Sovereign India Hub",
      managerName: "Mohammed Rahman",
      managerId: "EMP-0007"
    };
  }
  if (bId === 'BR-NYC-01') {
    return {
      name: "New York Wall St. Flagship",
      code: "BR-101W",
      location: "Wall Street, New York, USA",
      region: "North America (AMER)",
      managerName: "Donald Vance",
      managerId: "EMP-0010"
    };
  }
  if (bId === 'BR-ZH-01') {
    return {
      name: "Zurich Elite Vault",
      code: "BR-102",
      location: "Bahnhofstrasse, Zurich, Switzerland",
      region: "Europe, Middle East & Africa (EMEA)",
      managerName: "Maximilian Kael",
      managerId: "EMP-014"
    };
  }
  if (bId === 'BR-LDN-02') {
    return {
      name: "London Square Premium",
      code: "BR-103",
      location: "Square Mile, London, UK",
      region: "United Kingdom & Ireland (UKIR)",
      managerName: "Charles Windsor",
      managerId: "EMP-0088"
    };
  }
  if (bId === 'BR-TKY-03') {
    return {
      name: "Tokyo Neo Skyline",
      code: "BR-104",
      location: "Shinjuku, Tokyo, Japan",
      region: "Asia Pacific East (APAC-E)",
      managerName: "Masami Tanaka",
      managerId: "EMP-0079"
    };
  }
  return {
    name: "Singapore Wharf Hub",
    code: "BR-105",
    location: "Marina Bay, Singapore",
    region: "Asia Pacific South (APAC-S)",
    managerName: "Lawrence Wong",
    managerId: "EMP-0082"
  };
};

const getApprovalTrailFor = (customer: Customer) => {
  const cId = customer.id;
  const bId = customer.branchId;
  const joinDate = customer.joinDate || "2026-06-12";
  
  const dateSubmit = formatDateWithTime(joinDate, "09:12", "AM");
  const dateVerify = formatDateWithTime(joinDate, "10:05", "AM");
  const dateKyc = formatDateWithTime(joinDate, "11:15", "AM");
  const dateBm = formatDateWithTime(joinDate, "02:30", "PM");
  const dateReg = formatDateWithTime(joinDate, "03:45", "PM");
  const dateAuth = formatDateWithTime(joinDate, "04:45", "PM");

  const branchInfo = getBranchProfile(cId, bId);

  const isKycApproved = customer.kycStatus === 'Approved';
  const isKycPending = customer.kycStatus === 'Pending';
  const isKycRejected = customer.kycStatus === 'Rejected';

  const kycStatusVal = isKycApproved ? 'Approved' : (isKycRejected ? 'Rejected' : 'Pending');
  const bmStatusVal = isKycApproved ? 'Approved' : (isKycRejected ? 'Rejected' : 'Pending');

  const isRegRequired = customer.type === 'VIP' || customer.type === 'Corporate' || customer.riskScore > 30;
  const regStatusVal = !isRegRequired 
    ? 'Not Required' 
    : (isKycApproved ? 'Approved' : (isKycRejected ? 'Rejected' : 'Pending'));

  const authStatusVal = isKycApproved ? 'Approved' : (isKycRejected ? 'Rejected' : 'Pending');

  const creatorNum = parseInt(cId.replace(/\D/g, '') || '0', 10);
  const isCreatorEven = creatorNum % 2 === 0;

  const creator: ApproverDetails = {
    name: cId === 'CUST-293' ? 'Sarah Johnson' : (isCreatorEven ? "Sarah Johnson" : "Marcus Davies"),
    id: cId === 'CUST-293' ? 'EMP-1024' : (isCreatorEven ? "EMP-1024" : "EMP-1088"),
    designation: cId === 'CUST-293' ? 'Senior Banking Officer' : (isCreatorEven ? "Senior Banking Officer" : "Compliance Analyst"),
    email: cId === 'CUST-293' || isCreatorEven ? "s.johnson@apexbank.com" : "m.davies@apexbank.com",
    phone: cId === 'CUST-293' || isCreatorEven ? "+1 (555) 019-1024" : "+1 (555) 019-1088",
    office: branchInfo.name,
    clearance: "Level 3 - Account Authority",
    date: dateSubmit,
    status: 'Approved',
    avatarSeed: cId === 'CUST-293' || isCreatorEven ? "sj" : "md"
  };

  const kycMod = creatorNum % 3;
  const kyc: ApproverDetails = {
    name: kycMod === 0 ? "Sarah Jenkins" : (kycMod === 1 ? "Chloe Dupont" : "Tariq Mahmood"),
    id: kycMod === 0 ? "EMP-001" : (kycMod === 1 ? "EMP-092" : "EMP-0112"),
    designation: kycMod === 0 ? "Senior Compliance Officer" : (kycMod === 1 ? "Senior Loan Underwriter" : "KYC Onboarding Lead"),
    email: kycMod === 0 ? "s.jenkins@apexbank.com" : (kycMod === 1 ? "c.dupont@apexbank.com" : "t.mahmood@apexbank.com"),
    phone: kycMod === 0 ? "+1 (555) 019-0012" : (kycMod === 1 ? "+44 7700 900511" : "+44 7700 911005"),
    office: branchInfo.name,
    clearance: "Level 4 - Executive Audit",
    date: dateVerify,
    status: kycStatusVal,
    avatarSeed: kycMod === 0 ? "sj" : (kycMod === 1 ? "cd" : "tm")
  };

  const bmEmpMap: Record<string, { name: string; id: string; email: string; phone: string }> = {
    "Mohammed Rahman": { name: "Mohammed Rahman", id: "EMP-0007", email: "m.rahman@apexbank.com", phone: "+1 (555) 019-0007" },
    "Maximilian Kael": { name: "Maximilian Kael", id: "EMP-014", email: "m.kael@apexbank.com", phone: "+41 44 200 1192" },
    "Charles Windsor": { name: "Charles Windsor", id: "EMP-0088", email: "c.windsor@apexbank.com", phone: "+44 7700 900222" },
    "Masami Tanaka": { name: "Masami Tanaka", id: "EMP-0079", email: "m.tanaka@apexbank.com", phone: "+81 90 9988 7766" },
    "Lawrence Wong": { name: "Lawrence Wong", id: "EMP-0082", email: "l.wong@apexbank.com", phone: "+65 6777 5544" }
  };
  const bmDetail = bmEmpMap[branchInfo.managerName] || bmEmpMap["Mohammed Rahman"];

  const bm: ApproverDetails = {
    name: bmDetail.name,
    id: bmDetail.id,
    designation: "Branch Manager",
    email: bmDetail.email,
    phone: bmDetail.phone,
    office: branchInfo.name,
    clearance: "Level 4 - Branch Controller",
    date: dateBm,
    status: bmStatusVal,
    avatarSeed: bmDetail.id === "EMP-0007" ? "mr" : (bmDetail.id === "EMP-014" ? "mk" : "cw")
  };

  const regId = bId === 'BR-NYC-01' ? 'EMP-0210' : (bId === 'BR-ZH-01' ? 'EMP-0211' : (bId === 'BR-LDN-02' ? 'EMP-0055' : 'EMP-0212'));
  const regEmpDef = {
    'EMP-0055': { name: "Rajesh Kumar", role: "Regional Operations Head", email: "r.kumar@apexbank.com", phone: "+91 98765 43210", office: "Hyderabad Regional HQ", seed: "rk" },
    'EMP-0210': { name: "Robert Sterling", role: "North America Operations Head", email: "r.sterling@apexbank.com", phone: "+1 (555) 019-0210", office: "Manhattan Premium HQ", seed: "rs" },
    'EMP-0211': { name: "Christian Lindner", role: "EMEA Regional Director", email: "c.lindner@apexbank.com", phone: "+44 20 7401 2291", office: "Geneva Sovereign Hub", seed: "cl" },
    'EMP-0212': { name: "Siddharth Shanmugam", role: "APAC Regional Command Head", email: "s.shanmugam@apexbank.com", phone: "+65 6222 3344", office: "Singapore Sentosa Gate", seed: "ss" }
  };
  const regEmp = regEmpDef[regId] || regEmpDef['EMP-0055'];

  const regional: ApproverDetails = {
    name: cId === 'CUST-293' ? 'Rajesh Kumar' : regEmp.name,
    id: cId === 'CUST-293' ? 'EMP-0055' : regId,
    designation: cId === 'CUST-293' ? 'Regional Operations Head' : regEmp.role,
    email: cId === 'CUST-293' ? 'r.kumar@apexbank.com' : regEmp.email,
    phone: cId === 'CUST-293' ? '+91 98765 43210' : regEmp.phone,
    office: cId === 'CUST-293' ? 'Hyderabad Regional HQ' : regEmp.office,
    clearance: "Level 5 - Regional Executive Authority",
    date: dateReg,
    status: regStatusVal,
    avatarSeed: cId === 'CUST-293' ? 'rk' : regEmp.seed
  };

  const finalAuth: ApproverDetails = {
    name: "Sophia Loren",
    id: "EMP-2001",
    designation: "Chief Underwriter / COO",
    email: "s.loren@apexbank.com",
    phone: "+41 22 888 2001",
    office: "Zurich Core Sovereign Hub",
    clearance: "Level 5 - Global Operations COO",
    date: dateAuth,
    status: authStatusVal,
    avatarSeed: "sl"
  };

  return {
    creator,
    kyc,
    branch: {
      name: branchInfo.name,
      code: branchInfo.code,
      location: branchInfo.location,
      region: branchInfo.region
    },
    bm,
    regional,
    finalAuth
  };
};

interface CustomerManagementProps {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  transactions: Transaction[];
  branches: Array<{ id: string; name: string }>;
  searchQuery: string;
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
  setActiveTab?: (tab: string) => void;
  selectedCustomerId?: string | null;
  setSelectedCustomerId?: (id: string | null) => void;
}

export default function CustomerManagement({
  customers,
  setCustomers,
  transactions,
  branches,
  searchQuery,
  addAuditLog,
  setActiveTab,
  selectedCustomerId,
  setSelectedCustomerId
}: CustomerManagementProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeAction, setActiveAction] = useState<{ type: string; customer: Customer } | null>(null);

  // Synchronize state with root-level selectedCustomerId
  useEffect(() => {
    if (selectedCustomerId) {
      const found = customers.find(c => c.id === selectedCustomerId);
      if (found) {
        setSelectedCustomer(found);
      }
    } else {
      // By default select the first customer when none is selected to keep the panel accessible
      if (customers.length > 0 && !selectedCustomer) {
        setSelectedCustomer(customers[0]);
        setSelectedCustomerId?.(customers[0].id);
      }
    }
  }, [selectedCustomerId, customers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveAction(null);
        setShowAddModal(false);
        setPreviewEmployee(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // AI Assistant Feedback Trigger
  const triggerFeedback = (msg: string) => {
    // We could add a visual toast here, for now just log it
    console.log(`[FEEDBACK] ${msg}`);
  };
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Retail' as 'VIP' | 'Retail' | 'Corporate',
    branchId: 'BR-NYC-01',
    balance: 50000,
    riskProfile: 'Low' as 'Low' | 'Medium' | 'High' | 'Critical',
    riskScore: 15
  });

  const [activeSegment, setActiveSegment] = useState<'all' | 'VIP' | 'Retail' | 'Corporate'>('all');

  const { t } = useTranslation();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    creation: true,
    kyc: true,
    branch: false,
    bm: false,
    regional: false,
    auth: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const [previewEmployee, setPreviewEmployee] = useState<ApproverDetails | null>(null);

  // Multi-tier filtering
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeSegment === 'all') return matchesSearch;
    return matchesSearch && c.type === activeSegment;
  });

  const handleToggleFreeze = (cust: Customer) => {
    const nextStatus: 'Active' | 'Frozen' | 'Suspended' = cust.status === 'Frozen' ? 'Active' : 'Frozen';
    const updated = customers.map(c => {
      if (c.id === cust.id) {
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCustomers(updated);
    if (selectedCustomer?.id === cust.id) {
      setSelectedCustomer({ ...selectedCustomer, status: nextStatus });
    }
    
    const label = nextStatus === 'Frozen' ? 'FROZE' : 'UNFROZE';
    addAuditLog(`${label} customer account ledger for ${cust.name} [ID: ${cust.id}]`, nextStatus === 'Frozen' ? 'Warning' : 'Info');
  };

  const handleVerifyKyc = (cust: Customer, status: 'Approved' | 'Rejected') => {
    const updated = customers.map(c => {
      if (c.id === cust.id) {
        return { ...c, kycStatus: status, verified: status === 'Approved' };
      }
      return c;
    });
    setCustomers(updated);
    if (selectedCustomer?.id === cust.id) {
      setSelectedCustomer({ ...selectedCustomer, kycStatus: status, verified: status === 'Approved' });
    }
    addAuditLog(`KYC status updated to ${status.toUpperCase()} for ${cust.name} [ID: ${cust.id}]`, 'Info');
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) {
      console.log("Please specify Customer Name and Email credentials.");
      return;
    }

    const created: Customer = {
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone || "+1 (555) 012-1100",
      balance: Number(newCustomer.balance) || 1200,
      riskProfile: newCustomer.riskProfile,
      riskScore: Math.floor(Math.random() * 40) + 5,
      status: 'Active',
      verified: true,
      branchId: newCustomer.branchId,
      kycStatus: 'Approved',
      type: newCustomer.type,
      joinDate: new Date().toISOString().substring(0, 10)
    };

    setCustomers([created, ...customers]);
    setShowAddModal(false);
    
    // Clear form
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      type: 'Retail',
      branchId: 'BR-NYC-01',
      balance: 10000,
      riskProfile: 'Low',
      riskScore: 15
    });

    addAuditLog(`Enrolled new ${created.type} customer: ${created.name} [ID: ${created.id}]`, 'Info');
  };

  // Customer transactions history lookup
  const customerTxns = selectedCustomer 
    ? transactions.filter(t => t.customerId === selectedCustomer.id || t.customerName === selectedCustomer.name)
    : [];

  return (
    <div className="space-y-6" id="customer-management-view">
      
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Type segment switcher */}
        <div className="flex bg-[#0c143c] p-1 rounded-xl border border-[#1b2559]">
          {['all', 'VIP', 'Retail', 'Corporate'].map((seg) => (
            <button
              id={`segment-btn-${seg}`}
              key={seg}
              onClick={() => setActiveSegment(seg as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeSegment === seg 
                  ? 'bg-[#d4af37] text-[#050920] shadow-[0_2px_10px_rgba(212,175,55,0.2)]' 
                  : 'text-[#8496bf] hover:text-white'
              }`}
            >
              {seg} Cards
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          id="add-customer-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#bca030] hover:from-[#eec84c] hover:to-[#d4af37] text-[#050920] text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Add VIP/Corporate Customer</span>
        </button>
      </div>

      {/* Main List & Details Display Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Listing */}
        <div className={`lg:col-span-2 p-3 sm:p-5 lg:p-6 rounded-2xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-2xl relative ${
          selectedCustomer ? 'lg:col-span-2' : 'lg:col-span-3'
        } transition-all duration-300`}>
          
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">Consolidated Client Ledger</h3>
            <p className="text-[#556994] text-xs">A comprehensive listing of users authorized for transaction rails.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#141c48] text-[10px] text-[#8496bf] font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Client ID</th>
                  <th className="py-3 px-3">Client details</th>
                  <th className="py-3 px-3">Segment Type</th>
                  <th className="py-3 px-3">Branch Node</th>
                  <th className="py-3 px-3 text-right">Ledger Balance</th>
                  <th className="py-3 px-3 text-center">Verification</th>
                  <th className="py-3 px-3 text-center">Threat Level</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141c48]">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-[#556994]">
                      No customers matched the specified constraints.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr 
                      key={cust.id} 
                      className={`text-xs hover:bg-[#121c4b]/50 transition-colors cursor-pointer ${
                        selectedCustomer?.id === cust.id ? 'bg-[#152361]/60 border-l-2 border-amber-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setSelectedCustomerId?.(cust.id);
                      }}
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-300">{cust.id}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white">{cust.name}</div>
                        <div className="text-[10px] text-[#556994] lowercase font-mono">{cust.email}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          cust.type === 'VIP' 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                            : cust.type === 'Corporate'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-zinc-500/20 text-zinc-300'
                        }`}>
                          {cust.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 uppercase text-[10px] font-mono font-semibold text-[#8496bf]">
                        {cust.branchId.replace("BR-", "")}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                        ${cust.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          cust.verified 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {cust.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          cust.riskProfile === 'Low' 
                            ? 'text-emerald-400 bg-emerald-500/10' 
                            : cust.riskProfile === 'Medium'
                              ? 'text-blue-400 bg-blue-500/10'
                              : cust.riskProfile === 'High'
                                ? 'text-orange-400 bg-orange-500/10'
                                : 'text-red-500 bg-red-500/10 border border-red-500/30 animate-pulse'
                        }`}>
                          {cust.riskProfile} ({cust.riskScore}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold">
                        <span className={`px-2 py-0.5 rounded ${
                          cust.status === 'Active' 
                            ? 'bg-emerald-500/15 text-emerald-400' 
                            : 'bg-rose-500/15 text-rose-500'
                        }`}>
                          {cust.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <button
                            id={`view-details-${cust.id}`}
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setSelectedCustomerId?.(cust.id);
                            }}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#121c4c] transition-all cursor-pointer"
                            title="View Extended Risk File"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            id={`toggle-freeze-${cust.id}`}
                            onClick={() => handleToggleFreeze(cust)}
                            className={`p-1 rounded hover:bg-rose-950/20 transition-all cursor-pointer ${
                              cust.status === 'Frozen' ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'
                            }`}
                            title={cust.status === 'Frozen' ? 'Unfreeze Account Ledger' : 'Freeze Account ledger'}
                          >
                            {cust.status === 'Frozen' ? <Unlock size={13} /> : <Lock size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Customer Drawer Panel */}
        {selectedCustomer && (
          <div className="p-4 sm:p-5 lg:p-6 rounded-2xl border border-pink-300 bg-pink-100 shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-4 sm:space-y-6 flex flex-col relative overflow-hidden h-fit">
            
            {/* Visual Gold Border Accent */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                Level-5 Client File
              </span>
              <button 
                onClick={() => {
                  setSelectedCustomer(null);
                  setSelectedCustomerId?.(null);
                }}
                className="p-1 rounded-lg text-pink-700 hover:text-pink-900 hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#131b45] to-[#2563eb] border-2 border-amber-500 flex items-center justify-center font-bold text-pink-900 text-lg shadow-lg relative">
                {selectedCustomer.name.charAt(0)}
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#090f3c] ${
                  selectedCustomer.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                }`} />
              </div>
              <div>
                <h4 className="text-[10px] text-pink-700 font-bold uppercase mb-0.5 tracking-wider">
                  {selectedCustomer.name.split(' ')[0]} {selectedCustomer.name.split(' ').slice(1).join(' ')}
                </h4>
                <h4 className="text-sm font-bold text-pink-900 flex items-center gap-1.5">
                  {selectedCustomer.name}
                  {selectedCustomer.type === 'VIP' && <span className="text-amber-400">★</span>}
                </h4>
                <p className="text-[10px] text-pink-700 font-mono uppercase tracking-wide">ID: {selectedCustomer.id}</p>
                <p className="text-[10px] text-pink-700">Joined {selectedCustomer.joinDate}</p>
              </div>
            </div>

            {/* Account Details Box */}
            <div id="secure-account-details-box" className="p-4 rounded-xl border border-pink-200 bg-pink-50 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setActiveAction({ type: 'Secure Voice Line', customer: selectedCustomer })}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-500 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  <Phone size={13} />
                  Secure Voice Line
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAction({ type: 'SMTP Email', customer: selectedCustomer })}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-pink-200 hover:bg-pink-300 border border-pink-300 text-pink-900 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  <Mail size={13} />
                  SMTP Email
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-pink-700">Assigned Node:</span>
                <span className="uppercase text-amber-500 font-bold tracking-wider text-[10px]">{selectedCustomer.branchId.replace("BR-", "")} BRANCH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-pink-700">KYC Assessment:</span>
                <span className={`font-semibold ${
                  selectedCustomer.kycStatus === 'Approved' ? 'text-emerald-400' : 'text-amber-500'
                }`}>{selectedCustomer.kycStatus}</span>
              </div>
            </div>

            {/* Ledger Balance Gauge */}
            <div className="p-4 border border-[#d4af37]/20 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Managed Ledger Balance</p>
              <p className="text-xl font-bold font-mono text-pink-900 mt-1">
                ${selectedCustomer.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Risk Assessment Profile Score */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-pink-900">Dynamic AI Risk Score</span>
                <span className="font-mono text-amber-400 font-semibold">{selectedCustomer.riskScore}% ({selectedCustomer.riskProfile})</span>
              </div>
              <div className="w-full bg-pink-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    selectedCustomer.riskProfile === 'Low' 
                      ? 'bg-emerald-500' 
                      : selectedCustomer.riskProfile === 'Medium'
                        ? 'bg-blue-500'
                        : selectedCustomer.riskProfile === 'High'
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                  }`}
                  style={{ width: `${selectedCustomer.riskScore}%` }}
                />
              </div>
            </div>

            {/* Ledger Controls */}
            <div className="grid grid-cols-2 gap-3.5 select-none pt-2">
              <button
                id="drawer-view-accounts"
                onClick={() => {
                  setActiveAction({ type: 'View Account', customer: selectedCustomer });
                  addAuditLog(`Super Admin workspace opened for viewing accounts of ${selectedCustomer.id}`, 'Info');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-[#8496bf]/30 bg-pink-50 text-pink-700 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer hover:bg-[#141b44] hover:text-pink-900"
              >
                <Activity size={14} />
                <span>View Account</span>
              </button>

              <button
                id="drawer-view-txns"
                onClick={() => {
                  setActiveAction({ type: 'View Transactions', customer: selectedCustomer });
                  addAuditLog(`Super Admin workspace opened for transactions of ${selectedCustomer.id}`, 'Info');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-[#8496bf]/30 bg-pink-50 text-pink-700 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer hover:bg-[#141b44] hover:text-pink-900"
              >
                <Coins size={14} />
                <span>View Transactions</span>
              </button>

              <button
                id="drawer-contact-cust"
                onClick={() => {
                  setActiveAction({ type: 'Contact Customer', customer: selectedCustomer });
                  addAuditLog(`Super Admin workspace opened for contacting ${selectedCustomer.id}`, 'Info');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-pink-400 bg-pink-200 text-pink-800 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer hover:bg-pink-300"
              >
                <Mail size={14} />
                <span>Contact Customer</span>
              </button>

              <button
                id="drawer-download-report"
                onClick={() => {
                  setActiveAction({ type: 'Download Report', customer: selectedCustomer });
                  addAuditLog(`Super Admin workspace opened for report of ${selectedCustomer.id}`, 'Info');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-pink-300 bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer hover:bg-[#d4af37]/20"
              >
                <Download size={14} />
                <span>Download Report</span>
              </button>

              <button
                id="drawer-freeze-btn"
                onClick={() => handleToggleFreeze(selectedCustomer)}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCustomer.status === 'Frozen' 
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                    : 'border-rose-500 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                }`}
              >
                {selectedCustomer.status === 'Frozen' ? <Unlock size={14} /> : <Lock size={14} />}
                <span>{selectedCustomer.status === 'Frozen' ? 'Unfreeze' : 'Freeze'}</span>
              </button>

              <button
                id="drawer-kyc-verify-btn"
                onClick={() => handleVerifyKyc(selectedCustomer, selectedCustomer.kycStatus === 'Approved' ? 'Rejected' : 'Approved')}
                className={`w-full flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCustomer.kycStatus === 'Approved'
                    ? 'border-amber-500/30 bg-amber-500/5 text-amber-500'
                    : 'border-[#d4af37] bg-gradient-to-r from-[#d4af37]/25 to-[#a2821b]/20 text-pink-900'
                }`}
              >
                <FileCheck size={14} />
                <span>{selectedCustomer.kycStatus === 'Approved' ? 'Revoke KYC' : 'Verify KYC'}</span>
              </button>
            </div>

            {/* Customer Approval & Verification Trail Section Card */}
            {(() => {
              const trail = getApprovalTrailFor(selectedCustomer);
              const getStatusBadgeLocal = (status: 'Approved' | 'Pending' | 'Rejected' | 'Not Required') => {
                if (status === 'Approved') {
                  return (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Approved
                    </span>
                  );
                } else if (status === 'Pending') {
                  return (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Pending
                    </span>
                  );
                } else if (status === 'Rejected') {
                  return (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      Rejected
                    </span>
                  );
                } else {
                  return (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-500/10 text-pink-600 border border-slate-500/20">
                      Not Required
                    </span>
                  );
                }
              };

              const renderEmployeeAvatarLocal = (seed: string) => {
                const gradients: Record<string, string> = {
                  sj: "from-purple-600 to-indigo-600",
                  md: "from-blue-600 to-cyan-600",
                  cd: "from-emerald-600 to-teal-600",
                  tm: "from-amber-600 to-orange-600",
                  mr: "from-rose-600 to-pink-600",
                  mk: "from-violet-600 to-fuchsia-600",
                  cw: "from-sky-600 to-blue-600",
                  mt: "from-red-600 to-orange-600",
                  lw: "from-teal-600 to-cyan-600",
                  rk: "from-amber-500 to-red-600",
                  rs: "from-indigo-500 to-purple-600",
                  cl: "from-emerald-500 to-[#2563eb]",
                  ss: "from-cyan-500 to-blue-600",
                  sl: "from-pink-500 to-rose-600"
                };
                const grad = gradients[seed] || "from-slate-600 to-slate-800";
                return (
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${grad} flex items-center justify-center text-[9px] font-bold text-pink-900 shadow`}>
                    {seed.toUpperCase()}
                  </div>
                );
              };

              return (
                <div id="customer-approval-verification-card" className="p-4 rounded-xl border border-amber-500/20 bg-[#070c2e]/60 space-y-4">
                  <div className="flex items-center justify-between border-b border-pink-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-[#d4af37]" />
                      <span className="text-[11px] font-bold text-pink-900 uppercase tracking-wider">
                        Customer Approval & Verification Trail
                      </span>
                    </div>
                  </div>

                  {/* Collapsible parts */}
                  <div className="space-y-2">
                    
                    {/* Section 1: Account Creation Information */}
                    <div className="border border-[#141b45] rounded-lg bg-pink-50 overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => toggleSection('creation')}
                        className="w-full flex items-center justify-between p-2.5 bg-pink-100/40 hover:bg-pink-200/40 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2 select-none">
                          <User size={13} className="text-amber-500" />
                          <span className="text-xs font-semibold text-pink-800">Account Creation Information</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusBadgeLocal('Approved')}
                          <span className="text-pink-600 hover:text-pink-900 p-0.5">
                            {expandedSections.creation ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </span>
                        </div>
                      </button>
                      {expandedSections.creation && (
                        <div className="p-3 border-t border-[#141b45] text-[11px] space-y-2 text-pink-800">
                          <div className="flex justify-between items-center">
                            <span className="text-pink-700">Account Created By:</span>
                            <button 
                              type="button"
                              onClick={() => setPreviewEmployee(approversRepo[trail.creator.id] || trail.creator)}
                              className="text-amber-400 hover:text-amber-300 font-semibold hover:underline flex items-center gap-1.5 text-left cursor-pointer"
                            >
                              {renderEmployeeAvatarLocal(trail.creator.avatarSeed)}
                              <span>{trail.creator.name}</span>
                            </button>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Employee ID:</span>
                            <span className="font-mono text-pink-900">{trail.creator.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Employee Designation:</span>
                            <span>{trail.creator.designation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Creation Date & Time:</span>
                            <span className="font-mono">{trail.creator.date}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 2: KYC Verification Information */}
                    <div className="border border-[#141b45] rounded-lg bg-pink-50 overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => toggleSection('kyc')}
                        className="w-full flex items-center justify-between p-2.5 bg-pink-100/40 hover:bg-pink-200/40 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2 select-none">
                          <FileCheck size={13} className="text-amber-500" />
                          <span className="text-xs font-semibold text-pink-800">KYC Verification Information</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusBadgeLocal(trail.kyc.status)}
                          <span className="text-pink-600 hover:text-pink-900 p-0.5">
                            {expandedSections.kyc ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </span>
                        </div>
                      </button>
                      {expandedSections.kyc && (
                        <div className="p-3 border-t border-[#141b45] text-[11px] space-y-2 text-pink-800">
                          <div className="flex justify-between items-center">
                            <span className="text-pink-700">KYC Verified By:</span>
                            {trail.kyc.status !== 'Pending' ? (
                              <button 
                                type="button"
                                onClick={() => setPreviewEmployee(approversRepo[trail.kyc.id] || trail.kyc)}
                                className="text-amber-400 hover:text-amber-300 font-semibold hover:underline flex items-center gap-1.5 text-left cursor-pointer"
                              >
                                {renderEmployeeAvatarLocal(trail.kyc.avatarSeed)}
                                <span>{trail.kyc.name}</span>
                              </button>
                            ) : (
                              <span className="text-pink-500 italic">Pending Assignment</span>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Employee ID:</span>
                            <span className="font-mono text-pink-900">{trail.kyc.status !== 'Pending' ? trail.kyc.id : '--'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Verification Date & Time:</span>
                            <span className="font-mono">{trail.kyc.status !== 'Pending' ? trail.kyc.date : '--'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Verification Status:</span>
                            <span className={`font-semibold ${trail.kyc.status === 'Approved' ? 'text-emerald-400' : (trail.kyc.status === 'Rejected' ? 'text-rose-400' : 'text-amber-500')}`}>{trail.kyc.status}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 3: Branch Information */}
                    <div className="border border-[#141b45] rounded-lg bg-pink-50 overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => toggleSection('branch')}
                        className="w-full flex items-center justify-between p-2.5 bg-pink-100/40 hover:bg-pink-200/40 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2 select-none">
                          <Building size={13} className="text-amber-500" />
                          <span className="text-xs font-semibold text-pink-800">Branch Information</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Assigned</span>
                          <span className="text-pink-600 hover:text-pink-900 p-0.5">
                            {expandedSections.branch ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </span>
                        </div>
                      </button>
                      {expandedSections.branch && (
                        <div className="p-3 border-t border-[#141b45] text-[11px] space-y-2 text-pink-800">
                          <div className="flex justify-between">
                            <span className="text-pink-700">Assigned Branch Name:</span>
                            <span className="font-semibold text-pink-900">{trail.branch.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Branch Code:</span>
                            <span className="font-mono text-amber-400 font-bold">{trail.branch.code}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Branch Location:</span>
                            <span className="text-right text-slate-350 max-w-[190px] truncate" title={trail.branch.location}>{trail.branch.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Branch Region:</span>
                            <span>{trail.branch.region}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 4: Branch Manager Approval */}
                    <div className="border border-[#141b45] rounded-lg bg-pink-50 overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => toggleSection('bm')}
                        className="w-full flex items-center justify-between p-2.5 bg-pink-100/40 hover:bg-pink-200/40 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2 select-none">
                          <Briefcase size={13} className="text-amber-500" />
                          <span className="text-xs font-semibold text-pink-800">Branch Manager Approval</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusBadgeLocal(trail.bm.status)}
                          <span className="text-pink-600 hover:text-pink-900 p-0.5">
                            {expandedSections.bm ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </span>
                        </div>
                      </button>
                      {expandedSections.bm && (
                        <div className="p-3 border-t border-[#141b45] text-[11px] space-y-2 text-pink-800">
                          <div className="flex justify-between items-center">
                            <span className="text-pink-700">Approved By Branch Manager:</span>
                            {trail.bm.status !== 'Pending' ? (
                              <button 
                                type="button"
                                onClick={() => setPreviewEmployee(approversRepo[trail.bm.id] || trail.bm)}
                                className="text-amber-400 hover:text-amber-300 font-semibold hover:underline flex items-center gap-1.5 text-left cursor-pointer"
                              >
                                {renderEmployeeAvatarLocal(trail.bm.avatarSeed)}
                                <span>{trail.bm.name}</span>
                              </button>
                            ) : (
                              <span className="text-pink-500 italic">Pending Assignment</span>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Branch Manager Employee ID:</span>
                            <span className="font-mono text-pink-900">{trail.bm.status !== 'Pending' ? trail.bm.id : '--'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Branch Manager Name:</span>
                            <span>{trail.bm.status !== 'Pending' ? trail.bm.name : '--'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Approval Date & Time:</span>
                            <span className="font-mono">{trail.bm.status !== 'Pending' ? trail.bm.date : '--'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Approval Status:</span>
                            <span className={`font-semibold ${trail.bm.status === 'Approved' ? 'text-emerald-400' : (trail.bm.status === 'Rejected' ? 'text-rose-400' : 'text-amber-500')}`}>{trail.bm.status}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 5: Regional Compliance / Approval */}
                    <div className="border border-[#141b45] rounded-lg bg-pink-50 overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => toggleSection('regional')}
                        className="w-full flex items-center justify-between p-2.5 bg-pink-100/40 hover:bg-pink-200/40 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2 select-none">
                          <Award size={13} className="text-amber-500" />
                          <span className="text-xs font-semibold text-pink-800">Regional Compliance / Approval</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusBadgeLocal(trail.regional.status)}
                          <span className="text-pink-600 hover:text-pink-900 p-0.5">
                            {expandedSections.regional ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </span>
                        </div>
                      </button>
                      {expandedSections.regional && (
                        <div className="p-3 border-t border-[#141b45] text-[11px] space-y-2 text-pink-800">
                          <div className="flex justify-between items-center">
                            <span className="text-pink-700">Regional Manager Name:</span>
                            {trail.regional.status !== 'Not Required' && trail.regional.status !== 'Pending' ? (
                              <button 
                                type="button"
                                onClick={() => setPreviewEmployee(approversRepo[trail.regional.id] || trail.regional)}
                                className="text-amber-400 hover:text-amber-300 font-semibold hover:underline flex items-center gap-1.5 text-left cursor-pointer"
                              >
                                {renderEmployeeAvatarLocal(trail.regional.avatarSeed)}
                                <span>{trail.regional.name}</span>
                              </button>
                            ) : (
                              <span className="text-pink-500 italic">
                                {trail.regional.status === 'Not Required' ? 'Not Required (Level 2/Retail Account)' : 'Pending Regional Sync'}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Regional Office Name:</span>
                            <span>{trail.regional.status !== 'Not Required' ? trail.regional.office : '--'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Approval Date & Time:</span>
                            <span className="font-mono">{trail.regional.status !== 'Not Required' && trail.regional.status !== 'Pending' ? trail.regional.date : '--'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Verification Status:</span>
                            <span className={`font-semibold ${trail.regional.status === 'Approved' ? 'text-emerald-400' : (trail.regional.status === 'Rejected' ? 'text-rose-400' : (trail.regional.status === 'Not Required' ? 'text-zinc-500' : 'text-amber-500'))}`}>{trail.regional.status}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 6: Final Banking Authorization */}
                    <div className="border border-[#141b45] rounded-lg bg-pink-50 overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => toggleSection('auth')}
                        className="w-full flex items-center justify-between p-2.5 bg-pink-100/40 hover:bg-pink-200/40 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2 select-none">
                          <Shield size={13} className="text-amber-500" />
                          <span className="text-xs font-semibold text-pink-800">Final Banking Authorization</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusBadgeLocal(trail.finalAuth.status)}
                          <span className="text-pink-600 hover:text-pink-900 p-0.5">
                            {expandedSections.auth ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </span>
                        </div>
                      </button>
                      {expandedSections.auth && (
                        <div className="p-3 border-t border-[#141b45] text-[11px] space-y-2 text-pink-800">
                          <div className="flex justify-between items-center">
                            <span className="text-pink-700">Authorized By Name:</span>
                            {trail.finalAuth.status !== 'Pending' ? (
                              <button 
                                type="button"
                                onClick={() => setPreviewEmployee(approversRepo[trail.finalAuth.id] || trail.finalAuth)}
                                className="text-amber-400 hover:text-amber-300 font-semibold hover:underline flex items-center gap-1.5 text-left cursor-pointer"
                              >
                                {renderEmployeeAvatarLocal(trail.finalAuth.avatarSeed)}
                                <span>{trail.finalAuth.name}</span>
                              </button>
                            ) : (
                              <span className="text-pink-500 italic">Pending Executive Key Handshake</span>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Employee ID:</span>
                            <span className="font-mono text-pink-900">{trail.finalAuth.status !== 'Pending' ? trail.finalAuth.id : '--'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Authorization Date & Time:</span>
                            <span className="font-mono">{trail.finalAuth.status !== 'Pending' ? trail.finalAuth.date : '--'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-700">Authorization Status:</span>
                            <span className={`font-semibold ${trail.finalAuth.status === 'Approved' ? 'text-emerald-400' : (trail.finalAuth.status === 'Rejected' ? 'text-rose-400' : 'text-amber-500')}`}>{trail.finalAuth.status}</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Vertical Sovereign Activation Timeline Section inside same card */}
                  <div className="border-t border-pink-200 mt-5 pt-4">
                    <h5 className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-1.5 font-bold">
                      <Clock size={12} />
                      Sovereign Activation Timeline
                    </h5>
                    
                    <div className="space-y-4 relative pl-4 border-l border-pink-300 select-none text-[11px] text-pink-800">
                      
                      {/* Step 1: Registration Submitted */}
                      <div className="relative">
                        <span className="absolute -left-[20.5px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090f3c] shadow shadow-emerald-500/50" />
                        <div>
                          <div className="flex items-center justify-between text-pink-800">
                            <span className="font-bold">Customer Registration Submitted</span>
                            <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded font-bold uppercase">Done</span>
                          </div>
                          <p className="text-[10px] text-pink-600 mt-1 whitespace-normal">
                            Submitted by <button type="button" onClick={() => setPreviewEmployee(approversRepo[trail.creator.id] || trail.creator)} className="text-amber-400 hover:underline">{trail.creator.name}</button> ({trail.creator.id}) at {trail.creator.date}
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Employee Verification */}
                      <div className="relative">
                        <span className="absolute -left-[20.5px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090f3c] shadow shadow-emerald-500/50" />
                        <div>
                          <div className="flex items-center justify-between text-pink-800">
                            <span className="font-bold">Employee Verification Completed</span>
                            <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded font-bold uppercase">Done</span>
                          </div>
                          <p className="text-[10px] text-pink-600 mt-1 whitespace-normal">
                            Verified by <button type="button" onClick={() => setPreviewEmployee(approversRepo[trail.creator.id] || trail.creator)} className="text-amber-400 hover:underline">{trail.creator.name}</button> ({trail.creator.id}) at {trail.creator.date}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: KYC Documents Verified */}
                      <div className="relative">
                        <span className={`absolute -left-[20.5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-[#090f3c] ${
                          trail.kyc.status === 'Approved' ? 'bg-emerald-500 shadow shadow-emerald-500/50' : (trail.kyc.status === 'Rejected' ? 'bg-rose-500 shadow shadow-rose-500/50' : 'bg-amber-500 shadow shadow-amber-500/50 animate-pulse')
                        }`} />
                        <div>
                          <div className="flex items-center justify-between text-pink-800">
                            <span className="font-bold">KYC Documents Verified</span>
                            <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                              trail.kyc.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : (trail.kyc.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-500')
                            }`}>{trail.kyc.status}</span>
                          </div>
                          {trail.kyc.status !== 'Pending' ? (
                            <p className="text-[10px] text-pink-600 mt-1 whitespace-normal">
                              Verified by <button type="button" onClick={() => setPreviewEmployee(approversRepo[trail.kyc.id] || trail.kyc)} className="text-amber-400 hover:underline">{trail.kyc.name}</button> ({trail.kyc.id}) at {trail.kyc.date}
                            </p>
                          ) : (
                            <p className="text-[10px] text-pink-500 italic mt-1">Awaiting digital document screening clearances...</p>
                          )}
                        </div>
                      </div>

                      {/* Step 4: Branch Manager Approval */}
                      <div className="relative">
                        <span className={`absolute -left-[20.5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-[#090f3c] ${
                          trail.bm.status === 'Approved' ? 'bg-emerald-500 shadow shadow-emerald-500/50' : (trail.bm.status === 'Rejected' ? 'bg-rose-500 shadow shadow-rose-500/50' : 'bg-amber-500 shadow shadow-amber-500/50')
                        }`} />
                        <div>
                          <div className="flex items-center justify-between text-pink-800">
                            <span className="font-bold">Branch Manager Approval</span>
                            <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                              trail.bm.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : (trail.bm.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-500')
                            }`}>{trail.bm.status}</span>
                          </div>
                          {trail.bm.status !== 'Pending' ? (
                            <p className="text-[10px] text-pink-600 mt-1 whitespace-normal">
                              Approved by <button type="button" onClick={() => setPreviewEmployee(approversRepo[trail.bm.id] || trail.bm)} className="text-amber-400 hover:underline">{trail.bm.name}</button> ({trail.bm.id}) at {trail.bm.date}
                            </p>
                          ) : (
                            <p className="text-[10px] text-pink-500 italic mt-1">Pending signature from branch director...</p>
                          )}
                        </div>
                      </div>

                      {/* Step 5: Regional Compliance / Approval */}
                      <div className="relative">
                        <span className={`absolute -left-[20.5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-[#090f3c] ${
                          trail.regional.status === 'Approved' ? 'bg-emerald-500 shadow shadow-emerald-500/50' : (trail.regional.status === 'Rejected' ? 'bg-rose-500 shadow shadow-rose-500/50' : (trail.regional.status === 'Not Required' ? 'bg-zinc-650' : 'bg-amber-500 shadow shadow-amber-500/50'))
                        }`} />
                        <div>
                          <div className="flex items-center justify-between text-pink-800">
                            <span className="font-bold">Regional Approval</span>
                            <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                              trail.regional.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : (trail.regional.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : (trail.regional.status === 'Not Required' ? 'bg-zinc-500/10 text-zinc-400' : 'bg-amber-500/10 text-amber-500'))
                            }`}>{trail.regional.status}</span>
                          </div>
                          {trail.regional.status === 'Not Required' ? (
                            <p className="text-[10px] text-pink-500 italic mt-1">Branch-level permission sufficient for Retail client.</p>
                          ) : trail.regional.status !== 'Pending' ? (
                            <p className="text-[10px] text-pink-600 mt-1 whitespace-normal">
                              Approved by <button type="button" onClick={() => setPreviewEmployee(approversRepo[trail.regional.id] || trail.regional)} className="text-amber-400 hover:underline">{trail.regional.name}</button> ({trail.regional.id}) at {trail.regional.date}
                            </p>
                          ) : (
                            <p className="text-[10px] text-pink-500 italic mt-1">Awaiting regional compliance routing clears...</p>
                          )}
                        </div>
                      </div>

                      {/* Step 6: Account Activated */}
                      <div className="relative">
                        <span className={`absolute -left-[20.5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-[#090f3c] ${
                          trail.finalAuth.status === 'Approved' ? 'bg-emerald-500 shadow shadow-emerald-500/50' : (trail.finalAuth.status === 'Rejected' ? 'bg-rose-500 shadow shadow-rose-500/50' : 'bg-amber-500 shadow shadow-amber-500/50')
                        }`} />
                        <div>
                          <div className="flex items-center justify-between text-pink-800">
                            <span className="font-bold">Account Activated</span>
                            <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                              trail.finalAuth.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : (trail.finalAuth.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-500')
                            }`}>{trail.finalAuth.status}</span>
                          </div>
                          {trail.finalAuth.status !== 'Pending' ? (
                            <p className="text-[10px] text-pink-600 mt-1 whitespace-normal">
                              Fully activated by <button type="button" onClick={() => setPreviewEmployee(approversRepo[trail.finalAuth.id] || trail.finalAuth)} className="text-amber-400 hover:underline">{trail.finalAuth.name}</button> ({trail.finalAuth.id}) at {trail.finalAuth.date}
                            </p>
                          ) : (
                            <p className="text-[10px] text-pink-500 italic mt-1">Pending final executive cryptokey release authorization.</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })()}

            {/* Mini ledger transactions feed */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-pink-700 uppercase tracking-wide flex items-center gap-1.5 border-t border-pink-200 pt-4 leading-normal">
                <Activity size={13} className="text-pink-800" />
                Recent Cash Movements
              </h5>
              
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {customerTxns.length === 0 ? (
                  <p className="text-[10px] text-center text-pink-700 py-4">No recent electronic transactions logged.</p>
                ) : (
                  customerTxns.map((t) => (
                    <div key={t.id} className="p-2 border border-[#151c4a] bg-[#0c1135]/40 rounded-lg flex items-center justify-between text-[11px]">
                      <div>
                        <p className="font-semibold text-pink-900">{t.category}</p>
                        <span className="text-[9px] text-[#4d5c87] font-mono">{t.id}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold font-mono text-pink-900">${t.amount.toLocaleString()}</p>
                        <span className={`text-[9px] font-bold ${
                          t.status === 'Success' ? 'text-emerald-400' : 'text-amber-400' 
                        }`}>{t.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Add Customer Modal Box */}
      {showAddModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
          className="fixed inset-0 bg-black/35 backdrop-blur-[6px] flex items-center justify-center z-[99999] p-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg bg-[#070b28] border border-[#d4af37]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden relative"
          >
            {/* Golden Header Strip */}
            <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-[#d4af37] to-[#806410]" />
            
            <div className="p-6 border-b border-[#141b44] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Enroll Managed Client File</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-[#556994] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-6 space-y-4 text-xs select-none">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase tracking-wide">Customer Full Name:</label>
                  <input
                    id="new-customer-name-input"
                    type="text"
                    required
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full bg-[#0a1135] border border-[#1b2557] focus:border-[#d4af37]/60 text-white p-2.5 rounded-lg outline-none"
                    placeholder="e.g. Cynthia Vance"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase tracking-wide">Assigned Segment:</label>
                  <select
                    id="new-customer-type-select"
                    value={newCustomer.type}
                    onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value as any })}
                    className="w-full bg-[#0a1135] border border-[#1b2557] focus:border-[#d4af37]/60 text-white p-2.5 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="VIP">VIP Platinum Account</option>
                    <option value="Corporate">Corporate Trust</option>
                    <option value="Retail">Retail Checking</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase tracking-wide">Primary Email:</label>
                  <input
                    id="new-customer-email-input"
                    type="email"
                    required
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full bg-[#0a1135] border border-[#1b2557] focus:border-[#d4af37]/60 text-white p-2.5 rounded-lg outline-none"
                    placeholder="cynthia@corporate.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase tracking-wide">Direct Phone:</label>
                  <input
                    id="new-customer-phone-input"
                    type="text"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full bg-[#0a1135] border border-[#1b2557] focus:border-[#d4af37]/60 text-white p-2.5 rounded-lg outline-none"
                    placeholder="+1 (555) 012-4012"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase tracking-wide">Regional Node:</label>
                  <select
                    id="new-customer-node-select"
                    value={newCustomer.branchId}
                    onChange={(e) => setNewCustomer({ ...newCustomer, branchId: e.target.value })}
                    className="w-full bg-[#0a1135] border border-[#1b2557] focus:border-[#d4af37]/60 text-white p-2.5 rounded-lg outline-none cursor-pointer"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name.replace(" Flagship", "").replace(" Hub", "")}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase tracking-wide">Initial Ledger Deposit ($):</label>
                  <input
                    id="new-customer-deposit-input"
                    type="number"
                    value={newCustomer.balance}
                    onChange={(e) => setNewCustomer({ ...newCustomer, balance: Number(e.target.value) })}
                    className="w-full bg-[#0a1135] border border-[#1b2557] focus:border-[#d4af37]/60 text-white p-2.5 rounded-lg outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl leading-normal">
                By clicking Submit, the client file is cryptographically processed and immediately synced to SWIFT clearance nodes. Full compliance screening is performed automatedly.
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#141b44]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 hover:bg-white/5 text-[#8496bf] text-xs font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b6962a] text-[#050920] text-xs font-bold rounded-lg uppercase tracking-wider hover:from-[#eec84c] transition-all cursor-pointer"
                >
                  Confirm Registration
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {/* Employee Profile Preview Modal Overlay */}
      {previewEmployee && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewEmployee(null);
          }}
          className="fixed inset-0 bg-black/35 backdrop-blur-[6px] flex items-center justify-center z-[99999] p-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm bg-[#070b28] border-2 border-[#d4af37]/60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden relative"
          >
            {/* Fine Golden Accent Border */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#d4af37] via-[#806410] to-[#d4af37]" />
            
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setPreviewEmployee(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#556994] hover:text-white hover:bg-white/5 transition-all cursor-pointer z-10 animate-fade-in"
            >
              <X size={16} />
            </button>

            {/* Profile Header */}
            <div className="p-5 bg-gradient-to-b from-[#10194e]/70 to-[#070b28] border-b border-[#141b44] flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-[#d4af37] border border-[#d4af37] flex items-center justify-center font-black text-white text-xl shadow-xl relative mt-3 select-none">
                {previewEmployee.avatarSeed ? previewEmployee.avatarSeed.toUpperCase() : "EMP"}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070b28]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">{previewEmployee.name}</h4>
                <p className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-widest leading-none mt-1">{previewEmployee.id}</p>
                <p className="text-[10px] text-slate-400 mt-1">{previewEmployee.designation}</p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="p-5 space-y-4 text-[11px] select-text">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[#8496bf] text-[9px] uppercase font-mono block">Node Terminal:</span>
                  <span className="font-semibold text-white truncate block">{previewEmployee.office || "Hyderabad Regional HQ"}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[#8496bf] text-[9px] uppercase font-mono block">Department:</span>
                  <span className="font-semibold text-white truncate block">Treasury & Onboarding</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-[#131b40]/60 pt-3">
                <div className="space-y-0.5">
                  <span className="text-[#8496bf] text-[9px] uppercase font-mono block">Clearance Tier:</span>
                  <span className="text-amber-400 font-bold font-mono tracking-wider block">{previewEmployee.clearance || "Level 4 - Executive Audit"}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[#8496bf] text-[9px] uppercase font-mono block">Review Rating:</span>
                  <span className="font-mono text-emerald-400 block font-bold">4.9 / 5.0 Rating</span>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-[#131b40]/60 pt-3 font-mono text-[10px]">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[#556994]">Secure Email:</span>
                  <span className="text-slate-300 truncate select-all">{previewEmployee.email || "s.johnson@apexbank.com"}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[#556994]">Direct Link:</span>
                  <span className="text-slate-300 truncate select-all">{previewEmployee.phone || "+1 (555) 012-3456"}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[#556994]">Digital ID hash:</span>
                  <span className="text-[#d4af37] select-all uppercase">APX-{(previewEmployee.id || "EMP").replace("-", "")}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewEmployee(null)}
                className="w-full mt-2 py-2 bg-[#d4af37] hover:bg-[#bfa032] text-[#070b28] font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center select-none"
              >
                Close Secure Profile File
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ----------------- CENTERED ACTION WORKSPACE (MODAL) ----------------- */}
      <AnimatePresence>
        {activeAction && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveAction(null)}
              className="absolute inset-0 bg-black/35 backdrop-blur-[6px]"
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-[75%] h-[80%] rounded-3xl border border-[#d4af37]/30 bg-[#0a103d] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#1b2559]/60 flex items-center justify-between bg-gradient-to-r from-[#0e1644] to-[#0a103d]">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
                    {(activeAction.type === 'Secure Voice Line' || activeAction.type === 'Contact Customer') && <Phone size={24} />}
                    {activeAction.type === 'SMTP Email' && <Mail size={24} />}
                    {activeAction.type === 'View Account' && <Activity size={24} />}
                    {activeAction.type === 'View Transactions' && <Coins size={24} />}
                    {activeAction.type === 'Download Report' && <Download size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{activeAction.type}</h3>
                    <p className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-widest mt-0.5">
                      NODE: {activeAction.customer.id} // FILE: {activeAction.customer.name.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveAction(null)}
                  className="p-2.5 rounded-xl text-[#556994] hover:text-white hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Workspace Content */}
              <div className="flex-1 overflow-y-auto p-10 bg-[#04081c]/40 scrollbar-hide">
                {activeAction.type === 'Secure Voice Line' && (
                  <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping duration-[3s]" />
                      <div className="absolute -inset-4 border border-blue-500/10 rounded-full animate-pulse" />
                      <div className="relative w-32 h-32 rounded-full border-2 border-blue-500/50 flex items-center justify-center bg-blue-500/5 backdrop-blur-xl group">
                        <Phone size={48} className="text-blue-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                       <h4 className="text-2xl font-black text-white font-mono tracking-tighter">ESTABLISHING ENCRYPTED LINK</h4>
                       <div className="flex items-center justify-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">Quantum Guard Active</p>
                       </div>
                       <p className="text-[#8496bf] text-sm font-mono mt-4">TARGET: {activeAction.customer.phone}</p>
                    </div>
                    <div className="flex gap-4 pt-4">
                       <button className="px-8 py-3 bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 rounded-xl font-bold uppercase tracking-widest text-xs transition-all cursor-pointer">Terminate Connection</button>
                    </div>
                  </div>
                )}

                {(activeAction.type === 'SMTP Email' || activeAction.type === 'Contact Customer') && (
                  <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
                              <Mail size={24} />
                           </div>
                           <div className="flex-1">
                              <p className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-widest">Secure SMTP Portal</p>
                              <h4 className="text-white font-bold">Drafting Official Mandate</h4>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] text-[#8496bf] font-bold uppercase tracking-widest">Recipient</label>
                              <div className="px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 font-mono text-xs">
                                 {activeAction.customer.email}
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] text-[#8496bf] font-bold uppercase tracking-widest">Security Clearance</label>
                              <div className="px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-mono text-xs font-bold">
                                 LEVEL-5 SUPERADMIN AUTH
                              </div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] text-[#8496bf] font-bold uppercase tracking-widest">Directive Message</label>
                           <textarea 
                              className="w-full h-48 px-4 py-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all font-sans italic"
                              placeholder="Type your official directive here..."
                           />
                        </div>
                        <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                           Dispatch Encrypted Mandate
                        </button>
                     </div>
                  </div>
                )}

                {activeAction.type === 'View Account' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-3 gap-6">
                       <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-2">
                          <p className="text-[10px] text-[#8496bf] font-bold uppercase tracking-widest">Ledger Balance</p>
                          <p className="text-2xl font-black text-white font-mono">${activeAction.customer.balance.toLocaleString()}</p>
                       </div>
                       <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-2">
                          <p className="text-[10px] text-[#8496bf] font-bold uppercase tracking-widest">Account Tier</p>
                          <p className="text-2xl font-black text-amber-500 uppercase tracking-tighter italic">Sovereign VIP</p>
                       </div>
                       <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-2">
                          <p className="text-[10px] text-[#8496bf] font-bold uppercase tracking-widest">Risk Allocation</p>
                          <p className="text-2xl font-black text-blue-400 font-mono">{activeAction.customer.riskScore}% <span className="text-xs uppercase">Safe</span></p>
                       </div>
                    </div>
                    <div className="p-8 rounded-3xl border border-white/5 bg-[#070b28] space-y-6">
                       <h5 className="font-bold text-white flex items-center gap-2">
                          <Activity size={18} className="text-blue-500" />
                          Authorized Core Accounts
                       </h5>
                       <div className="space-y-4">
                          {[
                            { name: 'Primary Wealth Repository', bal: activeAction.customer.balance * 0.7, id: 'WLTH-9021', type: 'Active' },
                            { name: 'Secondary Institutional Fund', bal: activeAction.customer.balance * 0.2, id: 'INST-4820', type: 'Active' },
                            { name: 'Global Liquidity Reserve', bal: activeAction.customer.balance * 0.1, id: 'RESV-1102', type: 'Active' }
                          ].map(acc => (
                            <div key={acc.id} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.03] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                     <Building size={20} />
                                  </div>
                                  <div>
                                     <p className="text-xs font-bold text-white">{acc.name}</p>
                                     <p className="text-[9px] text-slate-500 font-mono">{acc.id}</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className="text-sm font-black text-white font-mono">${acc.bal.toLocaleString()}</p>
                                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">{acc.type}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {activeAction.type === 'View Transactions' && (
                  <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
                     <div className="flex-1 rounded-3xl border border-white/5 bg-[#070b28] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                           <h5 className="font-bold text-white">Universal Sovereign Ledger</h5>
                           <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Live Updates Hooked</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                           {transactions.filter(t => t.id === activeAction.customer.id || true).slice(0, 15).map((tx, idx) => (
                             <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.04] transition-all group">
                                <div className="flex items-center gap-4">
                                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                      (tx.type === 'Deposit' || tx.type === 'Loan Disbursal') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                   }`}>
                                      {(tx.type === 'Deposit' || tx.type === 'Loan Disbursal') ? 'IN' : 'OUT'}
                                   </div>
                                   <div>
                                      <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{tx.category}</p>
                                      <p className="text-[9px] text-slate-500 font-mono">{tx.timestamp}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className={`text-sm font-black font-mono ${
                                      (tx.type === 'Deposit' || tx.type === 'Loan Disbursal') ? 'text-emerald-400' : 'text-rose-400'
                                   }`}>
                                      {(tx.type === 'Deposit' || tx.type === 'Loan Disbursal') ? '+' : '-'}${tx.amount.toLocaleString()}
                                   </p>
                                   <p className="text-[8px] text-slate-600 font-mono uppercase tracking-widest">Encrypted ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {activeAction.type === 'Download Report' && (
                  <div className="h-full flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in duration-500">
                    <div className="relative group">
                       <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-2xl group-hover:bg-amber-500/40 transition-all duration-700" />
                       <div className="relative w-40 h-52 rounded-2xl border-2 border-amber-500/50 bg-[#0a103d] flex flex-col p-6 shadow-2xl transform group-hover:rotate-1 group-hover:-translate-y-2 transition-all duration-500">
                          <div className="w-10 h-1bg bg-amber-500/20 rounded-full mb-8" />
                          <div className="space-y-4">
                             <div className="h-2 w-full bg-slate-700/50 rounded-full" />
                             <div className="h-2 w-3/4 bg-slate-700/50 rounded-full" />
                             <div className="h-2 w-5/6 bg-slate-700/50 rounded-full" />
                             <div className="h-2 w-1/2 bg-slate-700/50 rounded-full" />
                          </div>
                          <div className="mt-auto flex justify-between items-end">
                             <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                                <Download size={24} />
                             </div>
                             <div className="text-right">
                                <p className="text-[8px] text-amber-500 font-black uppercase tracking-tighter">SECURE</p>
                                <p className="text-[8px] text-amber-500 font-black uppercase tracking-tighter">REPORT</p>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="text-center space-y-4">
                       <h4 className="text-2xl font-black text-white italic tracking-tight">COMPILE SOVEREIGN AUDIT REPORT</h4>
                       <p className="text-[#8496bf] text-sm max-w-md mx-auto leading-relaxed">
                          Generating complete transaction history, risk profiling, and KYC compliance validation nodes for <span className="text-white font-bold">{activeAction.customer.name}</span>.
                       </p>
                       <button 
                          onClick={() => {
                             triggerFeedback(`Secure Report Downloaded: CLIENT_${activeAction.customer.id}_AUDIT.pdf`);
                             setActiveAction(null);
                          }}
                          className="mt-6 px-12 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] transition-all transform hover:-translate-y-1"
                       >
                          Initiate Download Sequence
                       </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer / System Trace */}
              <div className="px-8 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                 <div className="flex gap-4">
                    <span>Trace: APEX-CORE-MODAL</span>
                    <span>Status: Level-5-Elevated</span>
                 </div>
                 <span>Gate Authority: 0x482910</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
