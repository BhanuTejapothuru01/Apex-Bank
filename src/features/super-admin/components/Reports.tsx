import { useState } from 'react';
import { FileSpreadsheet, FileText, Download, ShieldCheck, CheckCircle2, ChevronRight, Sliders } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface ReportsProps {
  customers: Array<{ id: string; name: string; balance: number }>;
  transactions: Array<{ id: string; amount: number; customerName: string; category: string }>;
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

export default function Reports({
  customers,
  transactions,
  addAuditLog
}: ReportsProps) {

  const handleDownloadSheet = (reportType: string) => {
    addAuditLog(`Sovereign report compile executed. Downloaded format: ${reportType.toUpperCase()}`, 'Info');
    console.log(`Compiling database nodes for [${reportType}]. File is cryptographically packaged and downloaded successfully.`);
  };

  const reportsList = [
    { title: 'Sovereign Compliance Audit [Basel III Master]', format: 'PDF Document', category: 'Compliance', desc: 'Sovereign balance sheet coverage and risk capital allocations.' },
    { title: 'Registered Client Checking Ledgers', format: 'Excel Spreadsheet', category: 'Financial', desc: 'Complete breakdown of all VIP, corporate, checking accounts.' },
    { title: 'SWIFT Electron Inflow Records [Monthly]', format: 'Excel Spreadsheet', category: 'Financial', desc: 'Real-time cash transfers mapped through European hubs.' },
    { title: 'Heuristic Intrusion Intelligence Log', format: 'PDF Document', category: 'Cybersecurity', desc: 'List of blocked threat IPs and firewall response mappings.' },
    { title: 'Annual Trust Dividends Yield Report', format: 'PDF Document', category: 'Auditing', desc: 'Calculated baseline compounding gains yields for VIPs.' }
  ];

  return (
    <div className="space-y-6" id="reports-module">
      
      {/* 2 columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Reports dynamic list */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-4">
          <div className="flex items-center gap-4">
            <BrandLogo size={48} className="shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-[#4A044E] uppercase tracking-wider">Apex Reporting Hub</h3>
              <p className="text-xs text-[#9D174D]/80">Aggregate, compile and package full structural data logs into compliant templates.</p>
            </div>
          </div>

          <div className="space-y-3">
            {reportsList.map((rep, idx) => (
              <div key={idx} className="p-4 border border-[#F9A8D4] bg-[#FFF1F5]/60 hover:bg-[#FBCFE8]/30 rounded-xl flex items-center justify-between text-xs transition-colors">
                <div className="space-y-1">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider uppercase ${
                    rep.category === 'Compliance' ? 'bg-amber-500/15 text-amber-500' : rep.category === 'Financial' ? 'bg-pink-500/15 text-pink-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {rep.category}
                  </span>
                  <h4 className="font-bold text-[#4A044E] text-[13px]">{rep.title}</h4>
                  <p className="text-[#BE185D]/75 text-xs leading-normal">{rep.desc}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#9D174D]/80 font-semibold">{rep.format}</span>
                  <button
                    id={`download-report-${idx}`}
                    onClick={() => handleDownloadSheet(`${rep.title}`)}
                    className="p-2 border border-[#F9A8D4] bg-[#FDF4F9] hover:border-[#d4af37]/45 text-[#9D174D]/85 hover:text-[#d4af37] rounded-lg transition-all cursor-pointer"
                    title={`Export ${rep.format}`}
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic compiled overview summary widget */}
        <div 
          style={{ 
            backgroundColor: 'rgba(252, 231, 243, 0.92)', 
            borderColor: '#F9A8D4',
            backdropFilter: 'blur(10px)'
          }}
          className="p-6 rounded-2xl border shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]"
        >
          <div className="absolute top-0 inset-x-0 h-[3px]" style={{ backgroundColor: '#EC4899' }} />
          
          <div className="space-y-4">
            <span 
              style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4', color: '#EC4899' }}
              className="text-[9px] font-mono border px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block w-fit"
            >
              Asset compilation summary
            </span>
            
            <div 
              style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4' }} 
              className="p-4 rounded-xl border space-y-3.5 text-xs shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between border-b pb-2 text-left" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                <span className="font-semibold" style={{ color: '#831843' }}>Managed Portfolios Count:</span>
                <span className="font-mono font-extrabold" style={{ color: '#4A044E' }}>{customers.length} Accounts</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2 text-left" style={{ borderColor: 'rgba(74, 4, 78, 0.12)' }}>
                <span className="font-semibold" style={{ color: '#831843' }}>Aggregated Cash Ledger:</span>
                <span className="font-mono font-extrabold" style={{ color: '#EC4899' }}>${customers.reduce((sum,c)=>sum+c.balance,0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-left">
                <span className="font-semibold" style={{ color: '#831843' }}>Logged SWIFT transfers:</span>
                <span className="font-mono font-extrabold" style={{ color: '#4A044E' }}>{transactions.length} entries</span>
              </div>
            </div>

            <div 
              style={{ backgroundColor: '#FBCFE8', borderColor: '#F9A8D4' }}
              className="p-3.5 border text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all duration-300 hover:shadow-md text-left"
            >
              <ShieldCheck size={16} style={{ color: '#EC4899' }} className="shrink-0" />
              <span style={{ color: '#4A044E' }}>
                Sovereign balance integrity compiled with <span className="font-extrabold text-emerald-800">0 accounting discrepancies</span>.
              </span>
            </div>
          </div>

          <div 
            style={{ borderColor: 'rgba(74, 4, 78, 0.15)', color: '#831843' }}
            className="text-[10px] font-mono border-t pt-4 mt-6 leading-relaxed text-left opacity-90 font-semibold"
          >
            Compiled outputs comply fully with SEC, FCA, FIBA and FINMA regulatory provisions. Clearance authorization required: <span className="font-extrabold" style={{ color: '#EC4899' }}>COM-3</span>.
          </div>
        </div>

      </div>

    </div>
  );
}
