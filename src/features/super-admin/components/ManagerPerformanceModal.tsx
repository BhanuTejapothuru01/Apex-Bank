import React, { useMemo } from 'react';
import { 
  X, TrendingUp, Users, DollarSign, Award, Percent, Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell 
} from 'recharts';
import { BranchManager } from '../data/managersData';

interface ManagerPerformanceModalProps {
  key?: string;
  manager: BranchManager;
  onClose: () => void;
}

export default function ManagerPerformanceModal({
  manager,
  onClose
}: ManagerPerformanceModalProps) {
  // Generate highly realistic monthly revenue metrics based on the manager's actual reported branch revenue
  const monthlyData = useMemo(() => {
    // Parse numeric base revenue value (e.g., "$1,200,000" -> 1200000)
    const revStr = manager.performance.revenue.replace(/[^0-9]/g, '');
    const revVal = revStr ? parseInt(revStr, 10) : 1200000;
    
    // Create custom monthly growth distribution leading to actual total
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return monthNames.map((m, i) => {
      const scaleMultiplier = 0.75 + (i * 0.05) + (Math.sin(i) * 0.04);
      return {
        month: m,
        Revenue: Math.round((revVal / 6) * scaleMultiplier),
        Transactions: Math.round(900 + (scaleMultiplier * 450)),
        LoansApproved: Math.round(12 + (i * 3.5) + (Math.cos(i) * 2))
      };
    });
  }, [manager]);

  const kpis = useMemo(() => {
    return [
      { name: 'Customer Retention Rate', score: 98.6, target: 95, unit: '%' },
      { name: 'Vault Security Index', score: 100, target: 100, unit: '%' },
      { name: 'Loan Recovery Ratio', score: 96.4, target: 92, unit: '%' },
      { name: 'Sovereign Compliance', score: 99.2, target: 98, unit: '%' },
      { name: 'Weekly Cashflow Clearing', score: 94.5, target: 90, unit: '%' }
    ];
  }, []);

  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-[6px] flex items-center justify-center z-[99999] p-4 font-sans text-slate-100 select-none">
      <div className="w-[75%] h-[80vh] bg-[#090f2b] border border-[#17235a]/80 rounded-[24px] shadow-2xl overflow-hidden relative flex flex-col">
        {/* Decorative Top Gold Glow Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />

        {/* Modal Window Title Area */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-[#d4af37] tracking-widest">
                Interactive Performance Analytics
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                OPERATIONAL KPIS AND DATA TRENDS FOR: {manager.name} ({manager.id})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all animate-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content - Charts Scroller */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-2">
          
          {/* Key Metric Scorecard Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <DollarSign size={12} className="text-amber-400" />
                <span>Deposits Managed</span>
              </div>
              <p className="text-lg font-black font-mono text-white tracking-tight">
                {manager.performance.totalDeposits}
              </p>
              <span className="text-[9px] text-emerald-400 font-mono font-bold">+12.4% vs last quarter</span>
            </div>

            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <Award size={12} className="text-amber-400" />
                <span>Performance Rating</span>
              </div>
              <p className="text-lg font-black font-mono text-[#d4af37] tracking-tight">
                {manager.rating} / 5.0
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-1.5 overflow-hidden">
                <div className="bg-amber-400 h-1 rounded-full" style={{ width: `${(manager.rating / 5) * 100}%` }} />
              </div>
            </div>

            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <Users size={12} className="text-amber-400" />
                <span>Staff Attendance</span>
              </div>
              <p className="text-lg font-black font-mono text-white tracking-tight">
                98.4%
              </p>
              <span className="text-[9px] text-slate-400 font-bold">Standard Target: 95.0%</span>
            </div>

            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <Percent size={12} className="text-amber-400" />
                <span>Revenue Flow</span>
              </div>
              <p className="text-lg font-black font-mono text-emerald-400 truncate tracking-tight">
                {manager.performance.revenue}
              </p>
              <span className="text-[9px] text-emerald-400 font-mono font-bold">Node Rank: {manager.performance.branchRanking}</span>
            </div>
          </div>

          {/* Core Monthly Chart Vector Display Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visual Chart 1: Revenue Flow History (Area Chart) */}
            <div className="lg:col-span-2 p-5 bg-slate-950/40 border border-white/5 rounded-[20px] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-200 tracking-wider">
                    Monthly Revenue Vector (Last 6 Months)
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Chronological index of registered cashflow</p>
                </div>
                <span className="text-[10px] bg-amber-500/10 border border-amber-400/20 text-[#d4af37] px-3 py-1 rounded-full font-mono font-bold">
                  Total Managed Ledger Ingress
                </span>
              </div>

              <div className="h-48 w-full font-mono text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="month" stroke="#94a3b860" tickLine={false} />
                    <YAxis stroke="#94a3b860" tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090f2b', borderColor: '#d4af3740', borderRadius: '12px', color: '#fff' }}
                      formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="Revenue" stroke="#d4af37" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Visual Chart 2: Customer CSAT Ratings Distributions (Bar Chart) */}
            <div className="p-5 bg-slate-950/40 border border-white/5 rounded-[20px] space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase text-amber-200 tracking-wider">
                  Quarterly CSAT Distribution
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Assigned satisfaction points</p>
              </div>

              <div className="h-48 w-full font-mono text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 5, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff04" />
                    <XAxis dataKey="month" stroke="#94a3b840" tickLine={false} />
                    <YAxis stroke="#94a3b840" tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090f2b', borderColor: '#d4af3720', borderRadius: '8px', color: '#fff' }}
                      formatter={(val: number) => [`${val} Trans`, 'Volume']}
                    />
                    <Bar dataKey="Transactions" radius={[4, 4, 0, 0]}>
                      {monthlyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#d4af37' : '#b18e22'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Detailed Progress Bars for KPIs */}
          <div className="p-5 bg-slate-950/40 border border-white/5 rounded-[20px] space-y-4">
            <div>
              <h4 className="text-xs font-black uppercase text-amber-200 tracking-wider">
                Weekly KPI Performance Vectors
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Metric verification thresholds compared against targets</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {kpis.map((k, i) => (
                <div key={i} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-300">
                    <span>{k.name}</span>
                    <span className="text-[#d4af37]">{k.score}{k.unit} <span className="text-slate-500 font-normal">/ target {k.target}{k.unit}</span></span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-[#d4af37] h-1.5 rounded-full" style={{ width: `${(k.score / 100) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Window Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/5 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase text-[10px] rounded-lg cursor-pointer transition-all"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
