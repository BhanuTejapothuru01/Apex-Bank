import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  X, 
  Play, 
  Settings, 
  FileLock, 
  MapPin, 
  RotateCcw, 
  Terminal, 
  Fingerprint, 
  DollarSign 
} from 'lucide-react';

interface FraudTabProps {
  balance: number;
  onBalanceChange: (amt: number) => void;
  onAddTransaction: (
    name: string, 
    type: 'Income' | 'Expense', 
    amount: number, 
    recipient: string, 
    status?: 'Completed' | 'Pending' | 'Failed'
  ) => void;
  searchQuery?: string;
}

interface AlertIncident {
  id: string;
  sourceName: string;
  amount: number;
  riskScore: number;
  reason: string;
  location: string;
  ip: string;
  time: string;
  status: 'Pending Review' | 'Cleared' | 'Blocked';
}

export default function FraudTab({ balance, onBalanceChange, onAddTransaction, searchQuery = '' }: FraudTabProps) {
  // Fraud rules states
  const [rules, setRules] = useState({
    velocityCheck: true,
    mfaLargeAmount: true,
    internationalBlock: false,
    fingerprintCheck: true,
  });

  const [incidents, setIncidents] = useState<AlertIncident[]>([
    {
      id: 'frd-101',
      sourceName: 'Stripe API Gateway',
      amount: 14500,
      riskScore: 82,
      reason: 'Rapid velocity from unfamiliar overseas IP',
      location: 'Frankfurt, DE',
      ip: '194.25.10.11',
      time: 'Just now',
      status: 'Pending Review'
    },
    {
      id: 'frd-102',
      sourceName: 'Andrew Forbist Card',
      amount: 450,
      riskScore: 23,
      reason: 'Standard office supply acquisition',
      location: 'New York, US',
      ip: '64.233.160.10',
      time: '4 mins ago',
      status: 'Cleared'
    },
    {
      id: 'frd-103',
      sourceName: 'Merchant Terminal #4',
      amount: 89000,
      riskScore: 94,
      reason: 'Card-Not-Present transaction above threshold request',
      location: 'Lagos, NG',
      ip: '102.89.3.45',
      time: '12 mins ago',
      status: 'Blocked'
    }
  ]);

  // Simulator inputs
  const [simName, setSimName] = useState('John Doe');
  const [simAmount, setSimAmount] = useState('7500');
  const [simLocation, setSimLocation] = useState('Tokyo, JP');
  const [simRiskOverride, setSimRiskOverride] = useState<number | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRuleToggle = (key: keyof typeof rules) => {
    setRules(prev => {
      const next = !prev[key];
      showToast(`Rule updated: ${String(key)} is now ${next ? 'ENABLED' : 'DISABLED'}`);
      return { ...prev, [key]: next };
    });
  };

  const filteredIncidents = incidents.filter(inc => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      inc.id.toLowerCase().includes(q) ||
      inc.sourceName.toLowerCase().includes(q) ||
      inc.reason.toLowerCase().includes(q) ||
      inc.location.toLowerCase().includes(q) ||
      inc.ip.toLowerCase().includes(q)
    );
  });

  const handleDecision = (id: string, decision: 'Cleared' | 'Blocked') => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        if (decision === 'Cleared') {
          // If approved, complete transaction
          onAddTransaction(`Approved Sec: ${inc.sourceName}`, 'Expense', inc.amount, inc.sourceName, 'Completed');
          showToast(`Transaction ${id} approved & processed.`);
        } else {
          // If blocked, fail transaction
          onAddTransaction(`Blocked: ${inc.sourceName}`, 'Expense', inc.amount, inc.sourceName, 'Failed');
          showToast(`Sec alert ${id} marked as BLOCKED securely.`);
        }
        return { ...inc, status: decision };
      }
      return inc;
    }));
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(simAmount) || 0;
    if (amountNum <= 0) {
      alert("Please enter a valid non-zero simulation amount.");
      return;
    }

    // Dynamic AI risk score formula with soft pink/black logic
    let score = simRiskOverride !== null ? simRiskOverride : Math.floor(Math.random() * 45) + 30;
    
    // Adjust risk score depending on simulated parameters & rules
    if (amountNum > 10000 && rules.mfaLargeAmount) score += 15;
    if (simLocation !== 'New York, US' && rules.internationalBlock) score += 25;
    if (simLocation === 'Tokyo, JP') score += 12;
    score = Math.min(score, 99);

    const newId = `frd-sim-${Date.now().toString().substring(10)}`;
    const newIncident: AlertIncident = {
      id: newId,
      sourceName: `Test: ${simName}`,
      amount: amountNum,
      riskScore: score,
      reason: score > 70 
        ? 'High probability anomaly flag based on location & currency parameters' 
        : 'Nominal client credentials validation pass',
      location: simLocation,
      ip: `192.168.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`,
      time: 'Just now',
      status: score > 70 ? 'Pending Review' : 'Cleared'
    };

    setIncidents(prev => [newIncident, ...prev]);
    
    if (score > 70) {
      showToast(`⚠️ High Risk Suspicious Alert generated! Score: ${score}%`);
    } else {
      // Process automatically if low risk score
      onBalanceChange(balance - amountNum);
      onAddTransaction(simName, 'Expense', amountNum, `Vendor check ${simName}`, 'Completed');
      showToast(`Low-risk payment allowed. $${amountNum.toLocaleString()} processed!`);
    }
  };

  const resetSimulationIncidents = () => {
    setIncidents([
      {
        id: 'frd-101',
        sourceName: 'Stripe API Gateway',
        amount: 14500,
        riskScore: 82,
        reason: 'Rapid velocity from unfamiliar overseas IP',
        location: 'Frankfurt, DE',
        ip: '194.25.10.11',
        time: 'Just now',
        status: 'Pending Review'
      },
      {
        id: 'frd-102',
        sourceName: 'Andrew Forbist Card',
        amount: 450,
        riskScore: 23,
        reason: 'Standard office supply acquisition',
        location: 'New York, US',
        ip: '64.233.160.10',
        time: '4 mins ago',
        status: 'Cleared'
      }
    ]);
    showToast("Incident dashboard ledger reset complete.");
  };

  // Metric Calculation
  const activeAlertsCount = incidents.filter(i => i.status === 'Pending Review').length;
  const averageRisk = incidents.length > 0 
    ? Math.round(incidents.reduce((sum, current) => sum + current.riskScore, 0) / incidents.length)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* 1. TITLE / CONTEXT GLASS CARD */}
      <div className="rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <ShieldAlert className="w-48 h-48 text-pink-700" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-pink-500/20 text-pink-700 animate-pulse border border-pink-500/30">
                Gold Standard Shield Enabled
              </span>
            </div>
            <h3 className="font-display font-black text-xl lg:text-2xl text-purple-950">AI Fraud Prevention & Mitigation Engine</h3>
            <p className="text-xs text-purple-950/60 font-semibold max-w-2xl leading-relaxed mt-1">
              Real-time transactional anomaly validation ledger. Oversee security weight thresholds, mitigate rogue client entries, and simulate secure capital-draw alerts.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-pink-500/10 border border-pink-500/20 rounded-2xl shrink-0">
            <span className="text-xs font-bold text-pink-800 uppercase tracking-wide">Threat level:</span>
            <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-pink-600 text-white shadow-inner uppercase tracking-wider">
              {activeAlertsCount > 1 ? 'Elevated alert' : 'Nominal guard'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Metric 1 */}
        <div className="rounded-2xl bg-white/25 border border-white/40 p-5 backdrop-blur-lg shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-700 flex items-center justify-center border border-pink-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-purple-950/40 block">Pending Alerts</span>
            <h4 className="font-mono font-black text-2xl text-purple-950">{activeAlertsCount}</h4>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-white/25 border border-white/40 p-5 backdrop-blur-lg shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${averageRisk > 60 ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' : 'bg-pink-500/10 text-pink-700 border-pink-500/20'} flex items-center justify-center border`}>
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-purple-950/40 block">Avg Risk Probability</span>
            <h4 className="font-mono font-black text-2xl text-purple-950">{averageRisk}%</h4>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl bg-white/25 border border-white/40 p-5 backdrop-blur-lg shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-purple-950/40 block">Total Decisions Taken</span>
            <h4 className="font-mono font-black text-2xl text-purple-950">
              {incidents.filter(i => i.status !== 'Pending Review').length}
            </h4>
          </div>
        </div>

      </div>

      {/* 3. CORE FLEX LAYOUT: RULES AND TESTING ON RIGHT, INCIDENT LOGS ON LEFT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE INCIDENTS LIST (7 SPAN) */}
        <div className="lg:col-span-8 rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-purple-950/5">
            <div>
              <h4 className="font-display font-black text-xs text-purple-950 tracking-wide uppercase">Real-Time Risk Analysis Desk</h4>
              <p className="text-[10px] text-purple-950/40 font-bold">Mitigate secure payments anomalies on Gold Standard dark pink accounts</p>
            </div>
            <button 
              onClick={resetSimulationIncidents}
              title="Reset alerts log"
              className="p-1.5 rounded-lg bg-pink-500/10 text-pink-700 border border-pink-500/20 hover:bg-pink-500/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {filteredIncidents.map((inc) => (
                <motion.div
                  key={inc.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 rounded-2xl bg-white/30 border border-white/50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/40 transition-all"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-black text-purple-950/50 uppercase">
                        {inc.id}
                      </span>
                      <h5 className="font-bold text-xs text-purple-950 font-display truncate">
                        {inc.sourceName}
                      </h5>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider float-right sm:float-none ${
                        inc.status === 'Pending Review' 
                          ? 'bg-amber-100 text-amber-800' 
                          : inc.status === 'Cleared' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inc.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-purple-950/70 font-semibold leading-relaxed">
                      {inc.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-purple-950/40 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-pink-500" />
                        {inc.location} ({inc.ip})
                      </span>
                      <span>•</span>
                      <span>Time: {inc.time}</span>
                    </div>
                  </div>

                  {/* Incident cost flag & actions desk */}
                  <div className="flex flex-row md:flex-col items-end justify-between w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 border-purple-950/5">
                    <div className="text-right flex md:block items-center gap-2 mb-0 md:mb-3">
                      <span className="text-[9px] font-black uppercase text-purple-950/30 md:block">Flagged Amount:</span>
                      <span className="font-mono text-xs font-black text-purple-950">
                        ${inc.amount.toLocaleString()}
                      </span>
                    </div>

                    {/* Decisional buttons */}
                    {inc.status === 'Pending Review' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDecision(inc.id, 'Cleared')}
                          className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 rounded-lg hover:bg-emerald-500/20 flex items-center gap-1 transition-all"
                          title="Authorize and clear safe exception"
                        >
                          <Check className="w-3 h-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(inc.id, 'Blocked')}
                          className="px-2.5 py-1 text-[10px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-700 rounded-lg hover:bg-rose-500/20 flex items-center gap-1 transition-all"
                          title="Block rogue entity draw"
                        >
                          <X className="w-3 h-3" />
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className="text-[9px] text-purple-950/40 font-extrabold uppercase tracking-wide flex items-center gap-1 py-1 pr-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${inc.status === 'Cleared' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        Incident Closed
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {filteredIncidents.length === 0 && (
                <div className="py-12 text-center text-xs font-bold text-purple-950/40 bg-white/10 rounded-2xl border border-dashed border-purple-950/15">
                  No fraud alert records match "{searchQuery}". Try searching for details like "Stripe" or "Andrew".
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: PROTOCOLS AND TEST SIMULATOR (4 SPAN) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. FRAUD PREVENTION RULES CARD */}
          <div className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-purple-950/5 pb-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center border border-pink-500/20">
                <Settings className="w-4 h-4 animate-spin-slow text-pink-700" />
              </div>
              <div>
                <h4 className="font-display font-black text-xs text-purple-950 tracking-wide uppercase">Algorithmic Guardrails</h4>
                <p className="text-[9px] text-purple-950/50 font-bold">Dynamic parameter switches</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Rule item 1 */}
              <div className="flex justify-between items-center p-2.5 bg-white/20 rounded-xl border border-white/30">
                <div>
                  <h5 className="text-[11px] font-extrabold text-purple-950">Velocity Check Protection</h5>
                  <p className="text-[9px] text-purple-950/50 font-medium">Auto-lock duplicate runs &lt;60s</p>
                </div>
                <button
                  onClick={() => handleRuleToggle('velocityCheck')}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 relative ${rules.velocityCheck ? 'bg-pink-600' : 'bg-purple-950/15'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform duration-300 ${rules.velocityCheck ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Rule item 2 */}
              <div className="flex justify-between items-center p-2.5 bg-white/20 rounded-xl border border-white/30">
                <div>
                  <h5 className="text-[11px] font-extrabold text-purple-950">High-Value MFA Ledger</h5>
                  <p className="text-[9px] text-purple-950/50 font-medium">Verify credentials on withdrawals &gt;$10k</p>
                </div>
                <button
                  onClick={() => handleRuleToggle('mfaLargeAmount')}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 relative ${rules.mfaLargeAmount ? 'bg-pink-600' : 'bg-purple-950/15'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform duration-300 ${rules.mfaLargeAmount ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Rule item 3 */}
              <div className="flex justify-between items-center p-2.5 bg-white/20 rounded-xl border border-white/30">
                <div>
                  <h5 className="text-[11px] font-extrabold text-purple-950">Block Unflagged Transnational</h5>
                  <p className="text-[9px] text-purple-950/55 font-medium">Deny high-velocity non-US transactions</p>
                </div>
                <button
                  onClick={() => handleRuleToggle('internationalBlock')}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 relative ${rules.internationalBlock ? 'bg-pink-600' : 'bg-purple-950/15'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform duration-300 ${rules.internationalBlock ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Rule item 4 */}
              <div className="flex justify-between items-center p-2.5 bg-white/20 rounded-xl border border-white/30">
                <div>
                  <h5 className="text-[11px] font-extrabold text-purple-950">Biometric Device Fingerprint</h5>
                  <p className="text-[9px] text-purple-950/50 font-medium">Match browser and token fingerprints</p>
                </div>
                <button
                  onClick={() => handleRuleToggle('fingerprintCheck')}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 relative ${rules.fingerprintCheck ? 'bg-pink-600' : 'bg-purple-950/15'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform duration-300 ${rules.fingerprintCheck ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

            </div>
          </div>

          {/* B. TRANSACTION RISK SIMULATOR CARD */}
          <div className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-purple-950/5 pb-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-650 flex items-center justify-center border border-pink-500/20">
                <Terminal className="w-4 h-4 text-pink-750" />
              </div>
              <div>
                <h4 className="font-display font-black text-xs text-purple-950 tracking-wide uppercase">Anomaly Sandbox Trigger</h4>
                <p className="text-[9px] text-purple-950/50 font-bold">Simulate threat vector payloads</p>
              </div>
            </div>

            <form onSubmit={handleSimulate} className="space-y-3">
              <div>
                <label className="text-[9px] font-black uppercase text-purple-950/50 block mb-1">Simulated Cardholder / Vendor</label>
                <input
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/45 text-xs font-semibold text-purple-950 rounded-xl border border-white/50 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[9px] font-black uppercase text-purple-950/50 block mb-1">Amount ($ USD)</label>
                  <div className="relative">
                    <DollarSign className="w-3 h-3 text-purple-950/40 absolute left-2 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={simAmount}
                      onChange={(e) => setSimAmount(e.target.value)}
                      className="w-full pl-6 pr-2 py-2 bg-white/45 text-xs font-semibold text-purple-950 rounded-xl border border-white/50 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-purple-950/50 block mb-1">Client Origin / Geo</label>
                  <select
                    value={simLocation}
                    onChange={(e) => setSimLocation(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white/45 text-xs font-semibold text-purple-950 rounded-xl border border-white/50 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all"
                  >
                    <option value="New York, US">New York, US</option>
                    <option value="London, GB">London, GB</option>
                    <option value="Tokyo, JP">Tokyo, JP</option>
                    <option value="Frankfurt, DE">Frankfurt, DE</option>
                    <option value="Lagos, NG">Lagos, NG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-purple-950/50 block mb-1">Risk Override Profile</label>
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setSimRiskOverride(15)}
                    className={`px-1.5 py-1 text-[9px] font-black uppercase rounded ${simRiskOverride === 15 ? 'bg-emerald-500 text-white' : 'bg-white/30 text-purple-950/60'}`}
                  >
                    Safe (15%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimRiskOverride(84)}
                    className={`px-1.5 py-1 text-[9px] font-black uppercase rounded ${simRiskOverride === 84 ? 'bg-pink-600 text-white' : 'bg-white/30 text-purple-950/60'}`}
                  >
                    Risk (84%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimRiskOverride(null)}
                    className={`px-1.5 py-1 text-[9px] font-black uppercase rounded ${simRiskOverride === null ? 'bg-purple-950/20 text-purple-950' : 'bg-white/30 text-purple-950/60'}`}
                  >
                    Dynamic
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-800 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-1.5 hover:from-pink-700 hover:to-purple-950 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Apply Trigger Payload
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

      {/* COMPACT TOAST ALERT BAR */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 px-4 py-3 bg-purple-950/95 backdrop-blur-xl border border-pink-500/35 text-white rounded-2xl shadow-xl flex items-center gap-2.5 z-50 text-[11px] font-bold"
          >
            <ShieldAlert className="w-4 h-4 text-pink-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
