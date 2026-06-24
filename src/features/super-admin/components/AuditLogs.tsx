import { useState } from 'react';
import { History, Search, ArrowUpRight, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { AuditLog } from '../types/dashboard';
import BrandLogo from './BrandLogo';

interface AuditLogsProps {
  logs: AuditLog[];
}

export default function AuditLogs({ logs }: AuditLogsProps) {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'Info' | 'Warning' | 'Critical'>('all');
  const [queryTerm, setQueryTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesQuery = 
      log.user.toLowerCase().includes(queryTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(queryTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(queryTerm.toLowerCase());
    return matchesSeverity && matchesQuery;
  });

  return (
    <div className="space-y-6" id="auditlogs-module">
      
      {/* Filtering Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-lg">
        
        <div className="flex flex-1 gap-3 items-center w-full">
          {/* Quick search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#556994] w-4 h-4" />
            <input 
              id="audit-trail-search"
              type="text"
              placeholder="Filter audit trails..."
              value={queryTerm}
              onChange={(e) => setQueryTerm(e.target.value)}
              className="w-full bg-[#0a1135] border border-[#1b2557] focus:border-[#d4af37]/60 text-white placeholder-[#4d5c87] pl-9 pr-4 py-2 text-xs rounded-xl outline-none"
            />
          </div>

          <div>
            <select
              id="audit-severity-filter"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="bg-[#0a1135] border border-[#1b2557] text-white p-2 text-xs rounded-xl outline-none cursor-pointer"
            >
              <option value="all">Any Severity</option>
              <option value="Info">Information (Routine)</option>
              <option value="Warning">Warning (Actions Logged)</option>
              <option value="Critical">Critical (Firewall Blocks)</option>
            </select>
          </div>
        </div>

        <div className="text-[10px] text-[#556994] font-mono whitespace-nowrap">
          IMMUTABLE CRYPTO BLOCK LEDGER ACTIVE
        </div>

      </div>

      {/* Audit table representation */}
      <div className="p-6 rounded-2xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-2xl">
        <div className="mb-6 flex items-center gap-4">
          <BrandLogo size={48} className="shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Apex immutable Operational History</h3>
            <p className="text-xs text-[#556994]">This table records every manual action logged inside this admin portal. Logs are cryptographically hashed and un-editable.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#141c48] text-[9px] text-[#8496bf] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Log Hash ID</th>
                <th className="py-2.5 px-3">Clearance Logon Reference</th>
                <th className="py-2.5 px-3">Action Completed</th>
                <th className="py-2.5 px-3 text-center">System IP Address</th>
                <th className="py-2.5 px-3 text-center">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141c48]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="text-xs hover:bg-[#121c4b]/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">{log.id}</td>
                  <td className="py-3 px-3 font-medium text-white">{log.user}</td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">{log.action}</td>
                  <td className="py-3 px-3 text-center font-mono text-[#8496bf]">{log.ipAddress}</td>
                  <td className="py-3 px-3 text-center text-[#556994] font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                      log.severity === 'Critical' 
                        ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30 font-bold' 
                        : log.severity === 'Warning'
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
