import { useState } from 'react';
import { 
  ShieldAlert, 
  Trash2, 
  Search, 
  Zap, 
  Flame, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

export default function FraudDetection() {
  const [riskFactor, setRiskFactor] = useState(84);
  const [firewallArmed, setFirewallArmed] = useState(true);

  const [blacklistedIPs, setBlacklistedIPs] = useState([
    { ip: "185.220.101.5", country: "Sovereign Proxy", blockedDate: "2026-06-11 06:55:00", threatScore: 99 },
    { ip: "91.222.100.12", country: "Offshore Node", blockedDate: "2026-06-10 12:44:00", threatScore: 92 },
    { ip: "115.229.40.18", country: "Residential Relay", blockedDate: "2026-06-08 04:12:00", threatScore: 84 }
  ]);

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
      console.log(`Threat simulation initialized: Foreign connection detected at IPv4 ${newIp}. Security filters fired successfully!`);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="fraud-module">
      
      {/* Cyber Threat stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 rounded-2xl border border-red-500/20 bg-red-950/20 shadow-lg relative">
          <div className="absolute top-3 right-3 p-1 rounded-full bg-red-500/10 text-red-500 animate-pulse"><Flame size={15} /></div>
          <span className="text-red-400 text-[10px] font-mono tracking-widest uppercase font-bold block">Cyber Shielding</span>
          <h3 className="text-sm font-bold text-white mt-1">Current Threat Meter</h3>
          <p className="text-3xl font-bold font-mono text-red-500 mt-2">{riskFactor}% High Risk</p>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-lg relative">
          <span className="text-emerald-400 text-[10px] font-mono tracking-widest uppercase font-bold block">Firewall Core</span>
          <h3 className="text-sm font-bold text-white mt-1">Intrusion Protection Status</h3>
          <p className="text-3xl font-bold font-mono text-emerald-400 mt-2">
            {firewallArmed ? 'Armed & Shielded' : 'Bypassed'}
          </p>
          <button 
            id="toggle-firewall-btn"
            onClick={() => {
              setFirewallArmed(!firewallArmed);
              console.log(`Core Firewall ruleset status changed to: ${!firewallArmed ? 'FULLY ARMED' : 'REDUCED clearance layer'}`);
            }}
            className="text-[10px] text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider block mt-2 cursor-pointer"
          >
            Adjust Ruleset Cleared Status
          </button>
        </div>

        <div className="p-5 rounded-2xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-2xl relative flex flex-col justify-between">
          <div>
            <span className="text-blue-400 text-[10px] font-mono tracking-widest uppercase font-bold block">Threat Simulation</span>
            <h3 className="text-sm font-bold text-white mt-1">Apex Sandbox Probing</h3>
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

      {/* Cyber logs and list of blacklisted IPs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Blocked IPs table */}
        <div className="p-6 rounded-2xl border border-rose-500/20 bg-[#08020e]/80 shadow-2xl">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 leading-normal">
              <ShieldAlert size={14} className="text-red-500 animate-pulse" />
              Sovereign Firewall IP Ban ledger
            </h3>
            <p className="text-slate-400 text-xs mt-1">These connection hashes are completely prohibited from transaction interfaces.</p>
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
                  <tr key={b.ip} className="text-xs hover:bg-[#15031a]/40 text-slate-300">
                    <td className="py-3 px-3 font-mono font-bold text-white">{b.ip}</td>
                    <td className="py-3 px-3 uppercase text-[10px] text-amber-500 font-semibold">{b.country}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#8496bf]">{b.blockedDate}</td>
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

        {/* Security parameters explanations */}
        <div className="p-6 rounded-2xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-2xl space-y-4">
          <div>
            <span className="text-amber-500 text-[9px] font-mono tracking-widest uppercase font-bold block">AI Threat Modeling</span>
            <h3 className="text-base font-bold text-white mt-1">Live Heuristic Parameters</h3>
            <p className="text-xs text-[#8496bf] mt-1">Configure artificial intelligential filters applied across checking card rails.</p>
          </div>

          <div className="p-4 rounded-xl border border-[#1a2559] bg-[#0d143c]/50 space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Velocity Limits:</span>
              <span className="font-mono text-cyan-400">Max 5 checking transfers/sec</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Geographic Proximity Delta:</span>
              <span className="font-mono text-cyan-400">Max 500 miles/minute</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Minimum KYC Clearance Score:</span>
              <span className="font-mono text-cyan-400">75% Biometrics Similarity Range</span>
            </div>
            <p className="text-[10px] text-[#556994] border-t border-[#141b44] pt-3 mt-3">
              Automated scoring patterns are checked globally using high speed quantum analytics blocks. Default safety triggers: Auto-shutter target checking account on 80% risk score.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
