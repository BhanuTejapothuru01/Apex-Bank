import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Check, 
  X, 
  Sparkles, 
  Wrench, 
  Info, 
  Smartphone, 
  MapPin, 
  Activity,
  User,
  Sliders,
  DollarSign
} from 'lucide-react';
import { FlaggedAlert } from '../types';

interface FraudViewProps {
  alerts: FlaggedAlert[];
  setAlerts: React.Dispatch<React.SetStateAction<FlaggedAlert[]>>;
  addTransaction: (sender: string, recipient: string, amount: number, category: any) => void;
}

export default function FraudView({ alerts, setAlerts, addTransaction }: FraudViewProps) {
  // Sandbox Simulator state models
  const [sandboxSource, setSandboxSource] = useState('Offshore Node Gateway');
  const [sandboxAmount, setSandboxAmount] = useState('18500');
  const [sandboxLocation, setSandboxLocation] = useState('Kyiv, UA');
  const [sandboxRisk, setSandboxRisk] = useState(82);
  const [sandboxReason, setSandboxReason] = useState('Anomalous API request parameters matching known botnets');

  // Algorithmic Safeguards toggles
  const [velocityCheck, setVelocityCheck] = useState(true);
  const [highValueLock, setHighValueLock] = useState(true);
  const [biometricCheck, setBiometricCheck] = useState(false);

  const handleUpdateAlert = (id: string, decision: 'Approved' | 'Declined') => {
    // Modify status
    setAlerts(prev => 
      prev.map(a => {
        if (a.id === id) {
          // If approved, trigger transaction log entry
          if (decision === 'Approved') {
            addTransaction('Fraud Recovery Sweeps', a.source, a.amount, 'Transfer');
          }
          return { ...a, status: decision === 'Approved' ? 'Approved' : 'Blocked' };
        }
        return a;
      })
    );
    alert(`Risk Engine registered decision as ${decision.toUpperCase()}`);
  };

  const handleTriggerSandbox = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(sandboxAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter a valid capital amount.');
      return;
    }

    const newAlert: FlaggedAlert = {
      id: `fraud-${Date.now()}`,
      source: sandboxSource,
      reason: sandboxReason,
      amount,
      riskProbability: sandboxRisk,
      time: 'JUST NOW',
      status: 'Pending',
      location: sandboxLocation,
      deviceType: 'Sandbox Terminal V4'
    };

    setAlerts(prev => [newAlert, ...prev]);
    alert('SECURE SIMULATION ENGAGED: Advanced anomaly injected into real-time stack queue.');
  };

  // Derived metrics
  const pendingAlertCount = alerts.filter(a => a.status === 'Pending').length;
  const decisionsTaken = alerts.filter(a => a.status !== 'Pending').length;
  const avgRisk = Math.round(
    alerts.reduce((sum, a) => sum + a.riskProbability, 0) / (alerts.length || 1)
  );

  return (
    <div id="fraud-view-root" className="space-y-6">
      
      {/* Metrics Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl p-5 border border-pink-500/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">Pending Alerts</p>
            <h4 className="text-2xl font-bold font-sans text-pink-600 mt-0.5">{pendingAlertCount}</h4>
          </div>
          <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-pink-500/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase font-semibold">Average Risk probability</p>
            <h4 className="text-2xl font-bold font-sans text-[#24142F] mt-0.5">{avgRisk}%</h4>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-pink-500/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase font-semibold">Total Decisions taken</p>
            <h4 className="text-2xl font-bold font-sans text-emerald-600 mt-0.5">{decisionsTaken}</h4>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Check className="w-5 h-5" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left pane: Fraud alerts live review list */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold font-sans text-gray-900">Real-Time Risk Analysis Desk</h3>
              <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                Review and resolve anomaly events reported by the continuous AI transaction pattern sweepers.
              </p>
            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="p-4 border border-pink-500/10 hover:border-pink-500/30 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          alert.riskProbability >= 75
                            ? 'bg-red-100 text-red-800'
                            : alert.riskProbability >= 50
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          RISK PROBABILITY: {alert.riskProbability}%
                        </span>
                        
                        <span className="text-[10px] font-mono text-gray-400">{alert.time}</span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-900 font-sans">{alert.source}</h4>
                        <p className="text-[11px] text-gray-500 font-sans">{alert.reason}</p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-gray-400 font-semibold uppercase">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          {alert.deviceType}
                        </span>
                      </div>
                    </div>

                    {/* Decisions side */}
                    <div className="text-right flex flex-col items-end gap-2 shrink-0">
                      <p className="text-base font-bold font-mono text-[#24142F]">
                        ${alert.amount.toLocaleString()}
                      </p>

                      {alert.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateAlert(alert.id, 'Approved')}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-sans font-bold text-[10px] tracking-wider rounded-lg border border-emerald-200 transition-all active:scale-95 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            APPROVE
                          </button>
                          <button
                            onClick={() => handleUpdateAlert(alert.id, 'Declined')}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-sans font-bold text-[10px] tracking-wider rounded-lg border border-rose-200 transition-all active:scale-95 flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            DECLINE
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-lg ${
                          alert.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          RESOLVED: {alert.status}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right pane: Algorithmic Safeguards & Sandbox Simulator form */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Safeguard togglers */}
          <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
            <h4 className="text-xs font-bold font-mono text-[#24142F] uppercase tracking-wider">
              ALGORITHMIC SAFEGUARDS
            </h4>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-sans font-bold text-gray-900 leading-tight">Velocity Check Protection</p>
                  <p className="text-[10px] text-gray-400 font-sans">Flag transactions from separate geolocations</p>
                </div>
                <button
                  onClick={() => setVelocityCheck(!velocityCheck)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${velocityCheck ? 'bg-pink-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    velocityCheck ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-sans font-bold text-gray-900 leading-tight">High-Value Transfer Lock</p>
                  <p className="text-[10px] text-gray-400 font-sans">Require double admin verification for &gt;$50k</p>
                </div>
                <button
                  onClick={() => setHighValueLock(!highValueLock)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${highValueLock ? 'bg-pink-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    highValueLock ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-sans font-bold text-gray-900 leading-tight">Biometric Device Fingerprint</p>
                  <p className="text-[10px] text-gray-400 font-sans">Check unique hardware hashes on endpoints</p>
                </div>
                <button
                  onClick={() => setBiometricCheck(!biometricCheck)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${biometricCheck ? 'bg-pink-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    biometricCheck ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Sandbox Injection form */}
          <div className="bg-[#FAF4F8] rounded-3xl p-5 border border-pink-500/20 shadow-inner space-y-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-pink-500" />
              <h4 className="text-xs font-bold font-mono text-[#24142F] uppercase tracking-wider">
                ANOMALY SANDBOX TRIGGER
              </h4>
            </div>

            <p className="text-[10px] text-gray-500 font-sans">
              Simulate high-risk threat scenarios below to verify that the compliance stack intercepts outliers.
            </p>

            <form onSubmit={handleTriggerSandbox} className="space-y-3">
              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-0.5">SOURCE DEVICE</label>
                <input
                  type="text"
                  required
                  value={sandboxSource}
                  onChange={(e) => setSandboxSource(e.target.value)}
                  className="w-full text-xs font-sans border border-pink-200 outline-none rounded-lg p-2.5 bg-white bg-opacity-70"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-0.5">AMOUNT ($)</label>
                <input
                  type="number"
                  required
                  value={sandboxAmount}
                  onChange={(e) => setSandboxAmount(e.target.value)}
                  className="w-full text-xs font-sans border border-pink-200 outline-none rounded-lg p-2.5 bg-white bg-opacity-70"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-0.5">IP GEOLOCATION</label>
                <input
                  type="text"
                  required
                  value={sandboxLocation}
                  onChange={(e) => setSandboxLocation(e.target.value)}
                  className="w-full text-xs font-sans border border-pink-200 outline-none rounded-lg p-2.5 bg-white bg-opacity-70"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-0.5">
                  <span>Simulated Risk %</span>
                  <span className="font-bold text-pink-600">{sandboxRisk}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxRisk}
                  onChange={(e) => setSandboxRisk(Number(e.target.value))}
                  className="w-full accent-pink-500 h-1 cursor-pointer bg-pink-100 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#24142F] hover:bg-[#351b44] text-white text-[10px] font-sans font-bold tracking-wider rounded-xl transition-all"
              >
                APPLY RISK PAYLOAD
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
