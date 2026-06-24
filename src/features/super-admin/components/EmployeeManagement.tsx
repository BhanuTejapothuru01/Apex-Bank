import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Search, Award, X, Building2, Check, AlertTriangle, ArrowUpDown, ChevronDown, List, Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Employee, Branch } from '../types/dashboard';
import { useTranslation } from './LanguageContext';
import { INITIAL_BRANCH_MANAGERS, BranchManager } from '../data/managersData';
import ManagerProfileCard from './ManagerProfileCard';
import ManagerDetailModal from './ManagerDetailModal';
import ManagerContactModal from './ManagerContactModal';

interface EmployeeManagementProps {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  branches: Branch[];
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

export default function EmployeeManagement({
  employees,
  setEmployees,
  branches,
  addAuditLog
}: EmployeeManagementProps) {
  const { t } = useTranslation();

  // Initialize main list of branch managers
  const [managers, setManagers] = useState<BranchManager[]>(INITIAL_BRANCH_MANAGERS);

  useEffect(() => {
    if (employees.length === 0) return;
    const branchById = Object.fromEntries(branches.map((b) => [b.id, b]));
    const mapped: BranchManager[] = employees.map((emp, idx) => {
      const branch = branchById[emp.branchId];
      const template = INITIAL_BRANCH_MANAGERS[idx % INITIAL_BRANCH_MANAGERS.length];
      const initials = emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
      return {
        ...template,
        id: emp.id,
        name: emp.name,
        avatarSeed: initials,
        email: emp.email,
        phone: '+91 40 1234 5678',
        joinDate: emp.joinDate,
        status: emp.status === 'Inactive' ? 'Inactive' : 'Active',
        rating: emp.rating,
        department: emp.department,
        designation: emp.role,
        branchName: branch?.name || template.branchName,
        branchCode: branch?.id || template.branchCode,
        branchLocation: branch?.location || template.branchLocation,
        stats: {
          ...template.stats,
          totalStaff: Math.max(10, Math.round(emp.performance / 2)),
          activeStaff: Math.max(8, Math.round(emp.performance / 2.5)),
        },
      };
    });
    setManagers(mapped);
  }, [employees, branches]);

  // States for search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'On Leave' | 'Inactive'>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [branchFilter, setBranchFilter] = useState<string>('All');
  const [ratingFilter, setRatingFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'Name' | 'Rating' | 'ID'>('Name');
  const [contactManager, setContactManager] = useState<BranchManager | null>(null);

  // Track the selected manager for detail modal (Default to null as requested: details NOT automatically shown)
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for custom manager provisioning
  const [newManagerForm, setNewManagerForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    branchName: branches[0]?.name || 'New York Wall St. Flagship',
    branchCode: branches[0]?.id || 'BR-NYC-01',
    branchLocation: branches[0]?.location || 'New York, USA',
    department: 'Branch Command & Ops',
    designation: 'Branch Manager & VP',
    grade: 'Grade-A',
  });

  // Extract unique regions for the filter dropdown
  const uniqueRegions = useMemo(() => {
    // Collect non-empty regional offices or regions
    const set = new Set<string>();
    managers.forEach(m => {
      // Add simplified region names
      if (m.regionalOffice.toLowerCase().includes('asia') || m.branchLocation.toLowerCase().includes('india') || m.branchLocation.toLowerCase().includes('singapore') || m.branchLocation.toLowerCase().includes('japan')) {
        set.add('Asia-Pacific');
      } else if (m.regionalOffice.toLowerCase().includes('emea') || m.branchLocation.toLowerCase().includes('switzerland') || m.branchLocation.toLowerCase().includes('uk')) {
        set.add('EMEA');
      } else if (m.regionalOffice.toLowerCase().includes('north american') || m.branchLocation.toLowerCase().includes('usa')) {
        set.add('North America');
      } else {
        set.add('Global District');
      }
    });
    return ['All', ...Array.from(set)];
  }, [managers]);

  // Extract unique branch names for the filter dropdown
  const uniqueBranches = useMemo(() => {
    const set = new Set(managers.map(m => m.branchName));
    return ['All', ...Array.from(set)];
  }, [managers]);

  // Combined search, complete filters, and sort logic
  const filteredAndSortedManagers = useMemo(() => {
    const filtered = managers.filter(m => {
      // 1. Search filter: Searches name, employee ID, branch, or locations
      const query = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        m.name.toLowerCase().includes(query) || 
        m.id.toLowerCase().includes(query) || 
        m.branchName.toLowerCase().includes(query) || 
        m.branchLocation.toLowerCase().includes(query) ||
        m.regionalOffice.toLowerCase().includes(query);

      // 2. Status filter
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;

      // 3. Region filter matching
      let matchesRegion = true;
      if (regionFilter !== 'All') {
        const checkReg = regionFilter.toLowerCase();
        if (checkReg === 'asia-pacific') {
          matchesRegion = m.regionalOffice.toLowerCase().includes('asia') || m.branchLocation.toLowerCase().includes('india') || m.branchLocation.toLowerCase().includes('singapore') || m.branchLocation.toLowerCase().includes('japan');
        } else if (checkReg === 'emea') {
          matchesRegion = m.regionalOffice.toLowerCase().includes('emea') || m.branchLocation.toLowerCase().includes('switzerland') || m.branchLocation.toLowerCase().includes('uk');
        } else if (checkReg === 'north america') {
          matchesRegion = m.regionalOffice.toLowerCase().includes('north american') || m.branchLocation.toLowerCase().includes('usa');
        }
      }

      // 4. Branch filter matching
      const matchesBranch = branchFilter === 'All' || m.branchName === branchFilter;

      // 5. Performance Rating filter matching
      let matchesRating = true;
      if (ratingFilter !== 'All') {
        if (ratingFilter === '4.8+') {
          matchesRating = m.rating >= 4.8;
        } else if (ratingFilter === '4.5+') {
          matchesRating = m.rating >= 4.5;
        } else if (ratingFilter === '5.0') {
          matchesRating = m.rating === 5.0;
        }
      }

      return matchesSearch && matchesStatus && matchesRegion && matchesBranch && matchesRating;
    });

    const result = [...filtered];
    if (sortBy === 'Name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'ID') {
      result.sort((a, b) => a.id.localeCompare(b.id));
    }
    return result;
  }, [managers, searchQuery, statusFilter, regionFilter, branchFilter, ratingFilter, sortBy]);

  // Provision / Create new Branch Manager profile
  const handleCreateManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManagerForm.name || !newManagerForm.email) {
      console.log("Name and Corporate Email are required.");
      return;
    }

    const matchedBranch = branches.find(b => b.name === newManagerForm.branchName);
    const branchCode = matchedBranch ? matchedBranch.id : `BR-${Math.floor(100 + Math.random() * 900)}`;

    const newMgr: BranchManager = {
      id: `EMP-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
      name: newManagerForm.name,
      avatarSeed: newManagerForm.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      gender: newManagerForm.gender,
      phone: newManagerForm.phone || "+91 99999 88888",
      email: newManagerForm.email,
      joinDate: new Date().toISOString().substring(0, 10),
      status: "Active",
      rating: 4.8,
      department: newManagerForm.department,
      designation: newManagerForm.designation,
      grade: newManagerForm.grade,
      clearance: "Level 4 - Branch Controller",
      reportingAuthority: "Rajesh Kumar (Regional Operations Head)",
      branchName: newManagerForm.branchName,
      branchCode: branchCode,
      branchLocation: newManagerForm.branchLocation,
      branchType: "Full-Service Retail Node",
      regionalOffice: "Regional Sovereign Command Centre",
      branchOpeningDate: "2018-05-10",
      stats: {
        totalStaff: 12,
        activeStaff: 10,
        inactiveStaff: 1,
        contractStaff: 1
      },
      team: [
        { name: "Rahul Sharma", id: "EMP-1022", designation: "Cash Operations Executive", department: "Treasury Management", status: "Active" },
        { name: "Ayesha Khan", id: "EMP-1021", designation: "Senior Banking Officer", department: "Retail Accounts", status: "Active" }
      ],
      transfers: [],
      appointments: {
        appointmentDate: new Date().toISOString().substring(0, 10),
        promotionDate: new Date().toISOString().substring(0, 10),
        lastDesignation: "Assistant Branch Controller",
        currentDesignation: newManagerForm.designation,
        history: [
          { year: "2026", designation: newManagerForm.designation }
        ]
      },
      joiningYear: 2026,
      joiningMonth: 6,
      performance: {
        totalCustomers: 2400,
        totalAccounts: 4800,
        totalDeposits: "$45,000,000",
        totalLoans: "$10,000,000",
        revenue: "$1,200,000",
        branchRanking: "#12 in Region"
      },
      approval: {
        appointedBy: "Regional Administration Panel",
        approvedByRegional: "Regional Operations Head",
        approvedByHR: "Super Admin HR",
        approvalDate: new Date().toISOString().substring(0, 10)
      },
      auditTrail: [
        { date: new Date().toISOString().substring(0, 10), time: "09:00 AM", event: "Employee Joined", approvedBy: "Super Admin HR", remarks: "Credentials mapping generated automatically." }
      ]
    };

    setManagers([newMgr, ...managers]);
    setShowAddModal(false);
    
    // Reset provisioning form
    setNewManagerForm({
      name: '',
      email: '',
      phone: '',
      gender: 'Male',
      branchName: branches[0]?.name || 'New York Wall St. Flagship',
      branchCode: branches[0]?.id || 'BR-NYC-01',
      branchLocation: branches[0]?.location || 'New York, USA',
      department: 'Branch Command & Ops',
      designation: 'Branch Manager & VP',
      grade: 'Grade-A',
    });

    addAuditLog(`Provisioned new Branch Manager Profile: ${newMgr.name} [ID: ${newMgr.id}] assigned to ${newMgr.branchName}`, 'Info');
  };

  // Find currently selected manager for detail modal rendering
  const activeDetailManager = useMemo(() => {
    if (!selectedManagerId) return null;
    return managers.find(m => m.id === selectedManagerId) || null;
  }, [selectedManagerId, managers]);

  return (
    <div id="employee-management-view" className="space-y-6 select-none font-sans">
      
      {/* SECTION 1: FIXED TOP DIRECTORY TOOLBAR */}
      <div 
        id="directory-toolbar-container"
        className="w-full bg-[#070c2e]/80 border border-[#17235a]/60 rounded-2xl p-4 sm:p-5 flex flex-col gap-5 shadow-2xl relative z-30 font-sans text-slate-100"
      >
        {/* Row 1: Search and Adding Managers */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          {/* A. Search Branch Manager */}
          <div className="relative w-full md:flex-[2.5]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8496bf] w-4 h-4" />
            <input
              id="manager-search"
              type="text"
              placeholder={t("Search Branch Manager (Name, ID, Location...)")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a1135] border border-[#1b2557] focus:border-[#d4af37]/60 text-white placeholder-[#8496bf] text-xs pl-10 pr-4 py-3 rounded-xl outline-none transition-all placeholder:font-medium"
            />
          </div>

          {/* E. Add Manager */}
          <button
            id="add-manager-trigger"
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto h-[44px] flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#bca030] hover:from-[#eec84c] hover:to-[#d4af37] text-[#050920] text-xs font-black uppercase tracking-wider rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
          >
            <Plus size={15} className="stroke-[3]" />
            <span>{t("Add Manager")}</span>
          </button>
        </div>

        {/* Row 2: Interactive Active/Inactive States Quick Bar + Region, Sorting, Mode */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 border-t border-[#17235a]/30 pt-4 w-full">
          
          {/* Status Quick Filter Tabs - Interactive badges with counts */}
          <div className="flex flex-wrap items-center gap-2 select-none">
            {(['All', 'Active', 'On Leave', 'Inactive'] as const).map((status) => {
              const count = status === 'All' 
                ? managers.length 
                : managers.filter(m => m.status === status).length;
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 border active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-500/40 shadow-lg shadow-violet-600/20 font-black'
                      : 'bg-[#0a1135] text-[#8496bf] border-[#1b2557] hover:border-[#8496bf]/45 hover:text-white'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    status === 'Active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' :
                    status === 'On Leave' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' :
                    status === 'Inactive' ? 'bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]' : 'bg-slate-400'
                  }`} />
                  <span>{t(status === 'All' ? 'ALL SECTORS' : status.toUpperCase())}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Select Filters & Mode switchers */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* C. Filter Region */}
            <div className="relative w-full sm:w-[150px]">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full bg-[#0a1135] border border-[#1b2557] focus:border-[#d4af37]/60 text-white font-bold text-xs pl-3.5 pr-8 py-2.5 rounded-xl outline-none cursor-pointer appearance-none h-[38px]"
              >
                <option value="All" className="bg-[#070c2e] text-white">{t("Filter Region")}</option>
                {uniqueRegions.filter(r => r !== 'All').map(reg => (
                  <option key={reg} value={reg} className="bg-[#070c2e] text-[#8496bf]">{reg}</option>
                ))}
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#d4af37] pointer-events-none">
                <ChevronDown size={14} className="text-[#d4af37]" />
              </span>
            </div>

            {/* D. Sort */}
            <div className="relative w-full sm:w-[155px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#0a1135] border border-[#1b2557] focus:border-[#d4af37]/60 text-white font-bold text-xs pl-3.5 pr-8 py-2.5 rounded-xl outline-none cursor-pointer appearance-none h-[38px]"
              >
                <option value="Name" className="bg-[#070c2e] text-white">{t("Sort by Name")}</option>
                <option value="Rating" className="bg-[#070c2e] text-white">{t("Sort by Rating")}</option>
                <option value="ID" className="bg-[#070c2e] text-white">{t("Sort by ID")}</option>
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#d4af37] pointer-events-none">
                <ChevronDown size={14} className="text-[#d4af37]" />
              </span>
            </div>

            {/* Toggle Layout view Selector */}
            <div className="bg-[#010520] border border-[#1b2559] rounded-xl p-1 flex items-center gap-1 shrink-0 h-[38px] w-full sm:w-[160px] justify-center">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex-1 flex items-center justify-center gap-1.5 h-full rounded-lg transition-all text-xs font-black uppercase tracking-wider cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#d4af37] text-[#050920] shadow-[0_2px_10px_rgba(212,175,55,0.2)]'
                    : 'text-[#8496bf] hover:text-white'
                }`}
              >
                <Grid size={13} />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex-1 flex items-center justify-center gap-1.5 h-full rounded-lg transition-all text-xs font-black uppercase tracking-wider cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#d4af37] text-[#050920] shadow-[0_2px_10px_rgba(212,175,55,0.2)]'
                    : 'text-[#8496bf] hover:text-white'
                }`}
              >
                <List size={13} />
                <span>List</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 2: RESPONSIVE PROFILE CARD GRID / TABLE */}
      <div className="flex-1">
        {filteredAndSortedManagers.length > 0 ? (
          viewMode === 'list' ? (
            <div className="p-3 sm:p-5 lg:p-6 rounded-2xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-2xl relative text-slate-100">
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">Consolidated Branch Command Ledger</h3>
                <p className="text-[#556994] text-xs">A comprehensive roster of corporate executive managers assigned to brand nodes.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs select-none">
                  <thead>
                    <tr className="border-b border-[#141c48] text-[10px] text-[#8496bf] font-bold uppercase tracking-wider">
                      <th className="py-4 px-4 font-black hidden sm:table-cell">{t("Manager ID")}</th>
                      <th className="py-4 px-4 font-black">{t("Name")}</th>
                      <th className="py-4 px-4 font-black">{t("Status")}</th>
                      <th className="py-4 px-4 font-black hidden md:table-cell">{t("Role / Designation")}</th>
                      <th className="py-4 px-4 font-black hidden lg:table-cell">{t("Department")}</th>
                      <th className="py-4 px-4 font-black">{t("Assigned Node")}</th>
                      <th className="py-4 px-4 font-black">{t("KPI Rating")}</th>
                      <th className="py-4 px-4 font-black text-center hidden sm:table-cell">{t("Capacity")}</th>
                      <th className="py-4 px-4 font-black text-right">{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141c48]">
                    {filteredAndSortedManagers.map((mgr) => {
                      const capacityScore = Math.round(
                        (mgr.stats.activeStaff / (mgr.stats.totalStaff || 1)) * 100
                      );
                      const isSelected = selectedManagerId === mgr.id;
                      return (
                        <tr 
                          key={mgr.id} 
                          onClick={() => setSelectedManagerId(mgr.id)}
                          className={`text-xs hover:bg-[#121c4b]/50 transition-colors cursor-pointer group ${
                            isSelected ? 'bg-[#152361]/60 border-l-2 border-[#d4af37]' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-extrabold text-[#d4af37] whitespace-nowrap hidden sm:table-cell">
                            {mgr.id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full shrink-0 bg-[#131b45] text-[#d4af37] border border-[#1b2559] flex items-center justify-center font-black text-xs select-none shadow-sm pb-0.5">
                                {mgr.avatarSeed}
                              </div>
                              <div>
                                <span className="font-extrabold text-white group-hover:text-[#d4af37] transition-colors block">{mgr.name}</span>
                                <span className="text-[9px] text-[#8496bf] font-medium leading-none md:hidden">{mgr.designation}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 text-[8px] font-black rounded-full border uppercase tracking-wider ${
                              mgr.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                : mgr.status === 'On Leave'
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/25'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                            }`}>
                              {mgr.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-300 whitespace-nowrap max-w-[150px] truncate hidden md:table-cell" title={mgr.designation}>
                            {mgr.designation}
                          </td>
                          <td className="py-3 px-4 font-medium text-[#8496bf] whitespace-nowrap max-w-[150px] truncate hidden lg:table-cell" title={mgr.department}>
                            {mgr.department}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-white whitespace-nowrap text-xs">{mgr.branchName}</span>
                              <span className="text-[10px] text-[#556994] whitespace-nowrap">{mgr.branchLocation}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 font-bold font-mono">
                              <span className="text-amber-400 font-extrabold">★</span>
                              <span className="text-white">{mgr.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 bg-[#18214d] rounded-full h-1.5 overflow-hidden border border-white/5">
                                <div 
                                  className="bg-gradient-to-r from-amber-400 to-[#d4af37] h-1.5 rounded-full" 
                                  style={{ width: `${capacityScore}%` }}
                                />
                              </div>
                              <span className="font-mono text-[10px] text-white font-bold">{capacityScore}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button 
                              className="p-1 px-3 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all text-[9px] uppercase font-black tracking-widest cursor-pointer border border-amber-500/30 active:scale-95 animate-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedManagerId(mgr.id);
                              }}
                            >
                              {t("Manage")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-stretch">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedManagers.map((mgr) => (
                  <ManagerProfileCard
                    key={mgr.id}
                    manager={mgr}
                    isSelected={selectedManagerId === mgr.id}
                    onViewProfile={() => {
                      setSelectedManagerId(mgr.id);
                    }}
                    onContactEmployee={() => {
                      setContactManager(mgr);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          )
        ) : (
          <div className="text-center py-24 bg-[#070c2e]/80 border border-[#17235a]/60 rounded-3xl animate-pulse">
            <Search className="mx-auto text-[#8496bf] mb-4" size={54} />
            <h4 className="text-base font-black uppercase text-white tracking-widest">{t("No Manager Profile Found")}</h4>
            <p className="text-xs text-[#556994] mt-1.5">Check spelling query or clear status filters.</p>
          </div>
        )}
      </div>

      {/* CENTRAL DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {activeDetailManager && (
          <ManagerDetailModal
            manager={activeDetailManager}
            onClose={() => setSelectedManagerId(null)}
            addAuditLog={addAuditLog}
          />
        )}
      </AnimatePresence>

      {/* DETAILED DIRECT CONTACT OVERLAY */}
      <AnimatePresence>
        {contactManager && (
          <ManagerContactModal
            manager={contactManager}
            onClose={() => setContactManager(null)}
          />
        )}
      </AnimatePresence>

      {/* PROVISIONING POPUP MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddModal(false);
            }}
            className="fixed inset-0 bg-black/35 backdrop-blur-[6px] flex items-center justify-center z-[99999] p-4 text-slate-100 font-sans"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-[75%] h-[80vh] bg-[#090f2b] border border-[#17235a]/80 rounded-[28px] shadow-2xl overflow-hidden relative flex flex-col"
            >
              {/* Gold/Amber Highlight Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
              
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#d4af37]">{t("Provision Branch Manager")}</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateManager} className="p-6 space-y-4 text-xs select-none flex-1 overflow-y-auto">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">{t("Full Name")}:</label>
                    <input
                      type="text"
                      required
                      value={newManagerForm.name}
                      onChange={(e) => setNewManagerForm({ ...newManagerForm, name: e.target.value })}
                      className="w-full bg-[#05091b] border border-white/10 text-white p-2.5 rounded-lg outline-none focus:border-[#d4af37]/60"
                      placeholder="E.g. Mohammed Rahman"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">{t("Corporate Email")}:</label>
                    <input
                      type="email"
                      required
                      value={newManagerForm.email}
                      onChange={(e) => setNewManagerForm({ ...newManagerForm, email: e.target.value })}
                      className="w-full bg-[#05091b] border border-white/10 text-white p-2.5 rounded-lg outline-none focus:border-[#d4af37]/60"
                      placeholder="m.rahman@apexbank.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">{t("Mobile Number")}:</label>
                    <input
                      type="text"
                      value={newManagerForm.phone}
                      onChange={(e) => setNewManagerForm({ ...newManagerForm, phone: e.target.value })}
                      className="w-full bg-[#05091b] border border-white/10 text-white p-2.5 rounded-lg outline-none focus:border-[#d4af37]/60"
                      placeholder="+91 90001 02345"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">{t("Gender")}:</label>
                    <select
                      value={newManagerForm.gender}
                      onChange={(e) => setNewManagerForm({ ...newManagerForm, gender: e.target.value })}
                      className="w-full bg-[#05091b] border border-white/10 text-white p-2.5 rounded-lg outline-none cursor-pointer focus:border-[#d4af37]/60"
                    >
                      <option value="Male">{t("Male")}</option>
                      <option value="Female">{t("Female")}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">{t("Assigned Branch Node")}:</label>
                    <select
                      value={newManagerForm.branchName}
                      onChange={(e) => {
                        const branch = branches.find(b => b.name === e.target.value);
                        setNewManagerForm({ 
                          ...newManagerForm, 
                          branchName: e.target.value,
                          branchLocation: branch ? branch.location : 'New York, USA',
                          branchCode: branch ? branch.id : 'BR-NYC-01'
                        });
                      }}
                      className="w-full bg-[#05091b] border border-white/10 text-white p-2.5 rounded-lg outline-none cursor-pointer focus:border-[#d4af37]/60"
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">{t("Branch Code")}:</label>
                    <input
                      type="text"
                      disabled
                      value={newManagerForm.branchCode}
                      className="w-full bg-slate-900 border border-white/15 text-slate-400 p-2.5 rounded-lg outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">{t("Branch Location")}:</label>
                    <input
                      type="text"
                      disabled
                      value={newManagerForm.branchLocation}
                      className="w-full bg-slate-900 border border-white/15 text-slate-400 p-2.5 rounded-lg outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">{t("Department")}:</label>
                    <input
                      type="text"
                      value={newManagerForm.department}
                      onChange={(e) => setNewManagerForm({ ...newManagerForm, department: e.target.value })}
                      className="w-full bg-[#05091b] border border-white/10 text-white p-2.5 rounded-lg outline-none focus:border-[#d4af37]/60"
                      placeholder="Branch Command & Ops"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">{t("Role / Designation")}:</label>
                    <input
                      type="text"
                      value={newManagerForm.designation}
                      onChange={(e) => setNewManagerForm({ ...newManagerForm, designation: e.target.value })}
                      className="w-full bg-[#05091b] border border-white/10 text-white p-2.5 rounded-lg outline-none focus:border-[#d4af37]/60"
                      placeholder="Branch Manager"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">{t("Employee Grade")}:</label>
                    <select
                      value={newManagerForm.grade}
                      onChange={(e) => setNewManagerForm({ ...newManagerForm, grade: e.target.value })}
                      className="w-full bg-[#05091b] border border-white/10 text-white p-2.5 rounded-lg outline-none cursor-pointer focus:border-[#d4af37]/60"
                    >
                      <option value="Grade-A">Grade-A</option>
                      <option value="Senior Director">Senior Director</option>
                      <option value="Managing Director">Managing Director</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/5 border border-amber-500/20 text-[#d4af37] rounded-xl leading-normal text-[10px]">
                  {t("By provisioning this profile, you assign cryptographically bound operational clearance tokens to high level systems.")}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 hover:bg-white/5 text-slate-400 text-xs font-semibold rounded-lg transition-all"
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#bca030] hover:from-[#eec84c] text-[#050920] text-xs font-bold rounded-lg uppercase transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                  >
                    {t("Confirm Provisioning")}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
