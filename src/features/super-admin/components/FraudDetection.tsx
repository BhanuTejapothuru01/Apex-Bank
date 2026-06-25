import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  RefreshCw,
} from 'lucide-react';

interface FraudAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'critical' | 'warning' | 'info';
  read: boolean;
}

interface FraudDetectionProps {
  alerts?: FraudAlert[];
  setAlerts?: Dispatch<SetStateAction<FraudAlert[]>>;
  addAuditLog?: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

const FALLBACK_BLACKLIST = [
  { ip: "185.220.101.5", country: "Sovereign Proxy", blockedDate: "2026-06-11 06:55:00", threatScore: 99 },
  { ip: "91.222.100.12", country: "Offshore Node", blockedDate: "2026-06-10 12:44:00", threatScore: 92 },
  { ip: "115.229.40.18", country: "Residential Relay", blockedDate: "2026-06-08 04:12:00", threatScore: 84 }
];

export default function FraudDetection({ alerts = [], setAlerts, addAuditLog }: FraudDetectionProps) {
  const pendingCount = alerts.filter((a) => !a.read).length;
  const avgRisk = alerts.length
    ? Math.round(alerts.reduce((sum, a) => sum + (a.type === 'critical' ? 90 : a.type === 'warning' ? 65 : 30), 0) / alerts.length)
    : 84;
  const [riskFactor, setRiskFactor] = useState(avgRisk);
  const [firewallArmed, setFirewallArmed] = useState(true);

  useEffect(() => {
    setRiskFactor(avgRisk);
  }, [avgRisk]);

  const [blacklistedIPs, setBlacklistedIPs] = useState(FALLBACK_BLACKLIST);
  const [simulationTriggered, setSimulationTriggered] = useState(false);

  const triggerMockThreatSimulation = () => {
    setSimulationTriggered(true);
    setTimeout(() => {
      setSimulationTriggered(false);
      const newIp = `${Math.floor(Math.random()*220)}.${Math.floor(Math.random()*220)}.${Math.floor(Math.random()*220)}.${Math.floor(Math.random()*220)}`;
      setBlacklistedIPs([
        { ip: newIp, country: "Suspicious Endpoint", blockedDate: new Date().toISOString().replace('T', ' ').substring(0, 19), threatScore: 95 },
        ...blacklistedIPs
      ]);
      addAuditLog?.(`Threat simulation: blocked IPv4 ${newIp}`, 'Warning');
    }, 1200);
  };

  const markAlertRead = (id: string) => {
    setAlerts?.((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    addAuditLog?.(`Fraud alert ${id} marked reviewed`, 'Info');
  };

  return (
    <div className="space-y-6" id="fraud-module">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 rounded-2xl border border-red-500/20 bg-red-950/20 shadow-lg relative">
          <div className="absolute top-3 right-3 p-1 rounded-full bg-red-500/10 text-red-500 animate-pulse"><Flame size={15} /></div>
          <span className="text-red-400 text-[10px] font-mono tracking-widest uppercase font-bold block">Cyber Shielding</span>
          <h3 className="text-sm font-bold text-[#4A044E] mt-1">Current Threat Meter</h3>
          <p className="text-3xl font-bold font-mono text-red-500 mt-2">{riskFactor}% {riskFactor >= 70 ? 'High' : 'Moderate'} Risk</p>
          <p className="text-[10px] text-red-300/70 mt-1">{pendingCount} pending alert{pendingCount !== 1 ? 's' : ''} from Supabase</p>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-lg relative">
          <span className="text-emerald-400 text-[10px] font-mono tracking-widest uppercase font-bold block">Firewall Core</span>
          <h3 className="text-sm font-bold text-[#4A044E] mt-1">Intrusion Protection Status</h3>
          <p className="text-3xl font-bold font-mono text-emerald-400 mt-2">
            {firewallArmed ? 'Armed & Shielded' : 'Bypassed'}
          </p>
          <button 
            id="toggle-firewall-btn"
            onClick={() => setFirewallArmed(!firewallArmed)}
            className="text-[10px] text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider block mt-2 cursor-pointer"
          >
            Adjust Ruleset Cleared Status
          </button>
        </div>

        <div className="p-5 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl relative flex flex-col justify-between">
          <div>
            <span className="text-blue-400 text-[10px] font-mono tracking-widest uppercase font-bold block">Threat Simulation</span>
            <h3 className="text-sm font-bold text-[#4A044E] mt-1">Apex Sandbox Probing</h3>
          </div>
          <button
            id="trigger-threat-sim-btn"
            onClick={triggerMockThreatSimulation}
            disabled={simulationTriggered}
            className="flex items-center justify-center gap-1.5 w-full mt-4 py-2 border border-[#d4af37]/45 text-[#d4af37] text-xs font-bold uppercase rounded-lg bg-orange-500/5 hover:bg-orange-500/10 transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={simulationTriggered ? 'animate-spin' : ''} />
            <span>{simulationTriggered ? 'Injecting Threat Vector...' : 'Trigger Intrapment Threat'}</span>
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-2xl border border-rose-500/20 bg-[#FCE7F3]/90 shadow-2xl">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 leading-normal">
              <ShieldAlert size={14} className="text-red-500 animate-pulse" />
              Live Fraud Alerts (Supabase)
            </h3>
            <p className="text-[#9D174D]/85 text-xs mt-1">Real-time alerts from fraud_alerts table.</p>
          </div>

          {alerts.length === 0 ? (
            <p className="text-xs text-[#9D174D]/75 py-4">No fraud alerts in database. Run db:seed-expanded.</p>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs ${
                    alert.read ? 'border-slate-800 bg-[#FFF1F5]/30' : 'border-red-500/30 bg-red-950/20'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-[#4A044E]">{alert.title}</p>
                      <p className="text-[#9D174D]/85 mt-0.5">{alert.description}</p>
                      <p className="text-[10px] text-[#9D174D]/75 mt-1">{alert.time}</p>
                    </div>
                    {!alert.read && (
                      <button
                        onClick={() => markAlertRead(alert.id)}
                        className="shrink-0 px-2 py-1 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl border border-rose-500/20 bg-[#FCE7F3]/90 shadow-2xl">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 leading-normal">
              <ShieldAlert size={14} className="text-red-500" />
              Sovereign Firewall IP Ban ledger
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-rose-950/40 text-[9px] text-rose-300 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">IPv4 Address reference</th>
                  <th className="py-2.5 px-3">Location Category</th>
                  <th className="py-2.5 px-3">Banned date</th>
                  <th className="py-2.5 px-3 text-right">Severity index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-950/20">
                {blacklistedIPs.map((b) => (
                  <tr key={b.ip} className="text-xs hover:bg-[#15031a]/40 text-[#831843]">
                    <td className="py-3 px-3 font-mono font-bold text-[#4A044E]">{b.ip}</td>
                    <td className="py-3 px-3 uppercase text-[10px] text-amber-500 font-semibold">{b.country}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#BE185D]/75">{b.blockedDate}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/20 text-red-500 border border-red-500/30 font-mono">
                        {b.threatScore}% CRIT
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
