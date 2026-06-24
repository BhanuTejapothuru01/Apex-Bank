import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Cpu, 
  Check, 
  X, 
  UserPlus, 
  Search, 
  Lock, 
  Unlock, 
  TrendingUp,
  AlertCircle,
  Eye
} from 'lucide-react';

interface EmployeesTabProps {
  searchQuery?: string;
  employees?: Employee[];
  setEmployees?: React.Dispatch<React.SetStateAction<Employee[]>>;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  clearanceLevel: 'L1 Clerk' | 'L2 Specialist' | 'L3 Manager' | 'L4 Audit Director';
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  dailyLimit: number;
  approvedCount: number;
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Rebecca Adler',
    role: 'Lead Commercial Underwriter',
    department: 'Lending Operations',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    clearanceLevel: 'L3 Manager',
    email: 'rebecca.adler@apexbank.com',
    phone: '+1 (555) 019-2834',
    status: 'Active',
    dailyLimit: 250000,
    approvedCount: 42
  },
  {
    id: 'emp-2',
    name: 'Devon Miller',
    role: 'Risk Assessment Specialist',
    department: 'Risk Management',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    clearanceLevel: 'L2 Specialist',
    email: 'devon.miller@apexbank.com',
    phone: '+1 (555) 012-9931',
    status: 'Active',
    dailyLimit: 100000,
    approvedCount: 19
  },
  {
    id: 'emp-3',
    name: 'Ananya Rao',
    role: 'AML & KYC Compliance Lead',
    department: 'Legal & Compliance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    clearanceLevel: 'L3 Manager',
    email: 'ananya.rao@apexbank.com',
    phone: '+1 (555) 014-8820',
    status: 'Active',
    dailyLimit: 500000,
    approvedCount: 68
  },
  {
    id: 'emp-4',
    name: 'Carter Vance',
    role: 'Junior Operations Clerk',
    department: 'Customer Relations',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    clearanceLevel: 'L1 Clerk',
    email: 'carter.vance@apexbank.com',
    phone: '+1 (555) 017-4321',
    status: 'On Leave',
    dailyLimit: 50000,
    approvedCount: 5
  },
  {
    id: 'emp-5',
    name: 'Gregory House',
    role: 'Senior Underwriting Investigator',
    department: 'Lending Operations',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    clearanceLevel: 'L4 Audit Director',
    email: 'gregory.house@apexbank.com',
    phone: '+1 (555) 015-1123',
    status: 'Suspended',
    dailyLimit: 1000000,
    approvedCount: 112
  }
];

export default function EmployeesTab({
  searchQuery = '',
  employees: externalEmployees,
  setEmployees: setExternalEmployees,
}: EmployeesTabProps) {
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const employees = externalEmployees?.length ? externalEmployees : localEmployees;
  const setEmployees = setExternalEmployees ?? setLocalEmployees;
  const [selectedId, setSelectedId] = useState<string>(employees[0]?.id ?? 'emp-1');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (externalEmployees?.length && !externalEmployees.some((e) => e.id === selectedId)) {
      setSelectedId(externalEmployees[0].id);
    }
  }, [externalEmployees, selectedId]);

  const activeEmp = employees.find(e => e.id === selectedId) || employees[0];

  if (!activeEmp) {
    return (
      <div className="p-8 rounded-3xl bg-white/20 border border-white/40 text-center text-purple-950/50 font-bold text-sm">
        No employees available.
      </div>
    );
  }

  // Dynamic filter matching role, name, department, or email
  const filteredEmployees = employees.filter(emp => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.clearanceLevel.toLowerCase().includes(q)
    );
  });

  const handleUpdateStatus = (id: string, newStatus: 'Active' | 'On Leave' | 'Suspended') => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        return { ...emp, status: newStatus };
      }
      return emp;
    }));
  };

  const handleIncreaseLimit = (id: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        return { ...emp, dailyLimit: emp.dailyLimit + 50000 };
      }
      return emp;
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-white/20 border border-white/40 backdrop-blur-xl shadow-lg">
        <div>
          <h3 className="font-display font-black text-xl text-purple-950">System Staff & Operations Ledger</h3>
          <p className="text-xs text-purple-950/60 font-semibold leading-relaxed mt-0.5">
            Admin Workspace • Authorized control list of administrative clerks, risk assessment leads, and underwriter profiles.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950 text-white text-[10px] font-black uppercase tracking-widest shrink-0">
          <Briefcase className="w-3.5 h-3.5 text-pink-400" />
          Clearance Level Audit Mode
        </div>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: STAFF LISTING (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-purple-950 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-900" />
                Active Personnel Directory ({filteredEmployees.length})
              </h4>
              {searchQuery && (
                <span className="text-[10px] font-bold bg-purple-950/10 text-purple-900 px-2.5 py-1 rounded-xl">
                  Filtering by: "{searchQuery}"
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEmployees.map((emp) => {
                const isActive = emp.id === selectedId;
                const isSelectedHovered = hoveredId === emp.id;

                return (
                  <motion.div
                    key={emp.id}
                    onClick={() => setSelectedId(emp.id)}
                    onMouseEnter={() => setHoveredId(emp.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    type="button"
                    role="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`p-4 rounded-3xl border transition-all duration-300 relative text-left cursor-pointer select-none flex flex-col justify-between ${
                      isActive 
                        ? 'bg-gradient-to-br from-purple-900/15 via-pink-500/10 to-purple-800/20 border-pink-500/50 shadow-md' 
                        : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/55 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={emp.avatar} 
                        alt={emp.name} 
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border border-purple-300/30 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[8px] uppercase tracking-wider font-extrabold text-pink-700 block">
                          {emp.department}
                        </span>
                        <h5 className="font-sans font-black text-xs text-purple-950 truncate">
                          {emp.name}
                        </h5>
                        <p className="text-[10px] font-semibold text-purple-950/50 truncate">
                          {emp.role}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-purple-950/5 flex items-center justify-between text-[10px] font-medium text-purple-950/50">
                      <div>
                        <span className="text-[8px] text-purple-950/35 uppercase font-bold block">Authority</span>
                        <span className="font-bold text-purple-950">{emp.clearanceLevel}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-purple-950/35 uppercase font-bold block">Status</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                          emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-800' :
                          emp.status === 'On Leave' ? 'bg-amber-500/10 text-amber-800' :
                          'bg-rose-500/10 text-rose-800'
                        }`}>
                          {emp.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredEmployees.length === 0 && (
                <div className="col-span-full py-16 text-center text-xs font-bold text-purple-950/40 bg-white/5 rounded-2xl border border-dashed border-purple-950/15">
                  No personnel profiles match the search query. Try searching for "Compliance", "Adler", or "Underwriter".
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PERSONNEL INTERACTION CONTROLLER (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <AnimatePresence mode="wait">
            {activeEmp && (
              <motion.div
                key={activeEmp.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg space-y-5"
              >
                {/* Visual Header */}
                <div className="text-center py-2 space-y-2">
                  <div className="relative inline-block">
                    <img 
                      src={activeEmp.avatar} 
                      alt={activeEmp.name} 
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-full mx-auto object-cover border-2 border-pink-500 shadow-md"
                    />
                    <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                      activeEmp.status === 'Active' ? 'bg-emerald-500' :
                      activeEmp.status === 'On Leave' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-base text-purple-950">{activeEmp.name}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-700">{activeEmp.clearanceLevel}</span>
                  </div>
                </div>

                {/* Info List Items */}
                <div className="space-y-2.5">
                  
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-between text-xs font-semibold text-purple-950">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-950/50" />
                      <span>Corporate Email</span>
                    </div>
                    <span className="text-purple-950 font-bold truncate max-w-[160px]">{activeEmp.email}</span>
                  </div>

                  <div className="p-3 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-between text-xs font-semibold text-purple-950">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-950/50" />
                      <span>Dedicated Hotline</span>
                    </div>
                    <span className="text-purple-950 font-bold font-mono text-[11px]">{activeEmp.phone}</span>
                  </div>

                  <div className="p-3 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-between text-xs font-semibold text-purple-950">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-950/50" />
                      <span>Disbursement Limit</span>
                    </div>
                    <span className="text-purple-950 font-extrabold font-mono text-xs">
                      ${activeEmp.dailyLimit.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-between text-xs font-semibold text-purple-950">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-950/50" />
                      <span>Daily Clearances</span>
                    </div>
                    <span className="text-purple-950 font-black font-mono">
                      {activeEmp.approvedCount} files cleared
                    </span>
                  </div>

                </div>

                {/* Operations Actions Row */}
                <div className="space-y-2.5 pt-2 border-t border-purple-950/5">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-purple-950/40 block">System Oversight Commands</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(activeEmp.id, 'Active')}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                        activeEmp.status === 'Active' 
                          ? 'bg-emerald-500/10 border-emerald-550/30 text-emerald-800' 
                          : 'bg-white/40 hover:bg-white/60 border-white/50 text-purple-950'
                      }`}
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(activeEmp.id, 'Suspended')}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                        activeEmp.status === 'Suspended' 
                          ? 'bg-rose-500/10 border-rose-550/30 text-rose-800' 
                          : 'bg-white/40 hover:bg-white/60 border-white/50 text-purple-950'
                      }`}
                    >
                      Suspend
                    </button>
                  </div>

                  <button
                    onClick={() => handleIncreaseLimit(activeEmp.id)}
                    className="w-full py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-purple-950/15"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Boost Disbursement Limit (+$50k)</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
