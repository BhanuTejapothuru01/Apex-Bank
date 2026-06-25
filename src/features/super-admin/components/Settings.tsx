import { useState } from 'react';
import { Sliders, Lock, Shield, Server, Bell, Key, RefreshCw } from 'lucide-react';
import { useTranslation } from './LanguageContext';

interface SettingsProps {
  addAuditLog?: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

export default function Settings({ addAuditLog }: SettingsProps) {
  const [mfaStatus, setMfaStatus] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(15);
  const [clearanceLevel, setClearanceLevel] = useState(5);
  const { t } = useTranslation();

  const handleApplySettings = () => {
    addAuditLog?.(
      `System settings saved — MFA: ${mfaStatus ? 'on' : 'off'}, timeout: ${sessionTimeout}m, clearance: ${clearanceLevel}`,
      'Info'
    );
  };

  return (
    <div className="space-y-6" id="settings-module">
      <div className="flex items-center gap-4 p-6 bg-white border border-[#FFB6D9] rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#40304D] uppercase tracking-wider">System Settings</h2>
          <p className="text-sm text-[#C26AA8] font-semibold">Configure Apex Bank sovereign terminal parameters and security protocols.</p>
        </div>
      </div>
      
      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
        
        {/* Security Parameters Settings */}
        <div className="p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-4">
          <div>
            <span className="text-amber-500 text-[9px] font-mono tracking-widest uppercase font-bold block">{t('terminal_security', 'Terminal Security')}</span>
            <h3 className="text-base font-bold text-[#4A044E] mt-1">{t('sovereign_mfa', 'Sovereign Compliance & MFA settings')}</h3>
            <p className="text-xs text-[#BE185D]/75">{t('mfa_desc', 'Authorize hardware security modules and multi-factor session handshakes.')}</p>
          </div>

          <div className="space-y-4 pt-2 text-xs">
            
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80">
              <div>
                <h4 className="font-bold text-[#4A044E]">{t('enforce_mfa', 'Enforce Hardware MFA Key tokens')}</h4>
                <p className="text-[10px] text-[#9D174D]/80 mt-0.5">{t('yubikey_req', 'Require Yubikey hardware handshakes on transactions.')}</p>
              </div>
              <button 
                id="toggle-mfa-setting"
                onClick={() => setMfaStatus(!mfaStatus)}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${mfaStatus ? 'bg-emerald-500' : 'bg-[#F9A8D4]/40'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${mfaStatus ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[#9D174D]/85 font-bold uppercase tracking-wide">{t('session_timeout', 'Session Idle Timeout (Minutes):')}</label>
              <input 
                id="session-timeout-input"
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] p-2.5 rounded-lg text-xs outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#9D174D]/85 font-bold uppercase tracking-wide">{t('clearance_tier', 'Current Profile Clearance Tier:')}</label>
              <select
                id="clearance-level-select"
                value={clearanceLevel}
                onChange={(e) => setClearanceLevel(Number(e.target.value))}
                className="w-full bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] p-2.5 rounded-lg text-xs outline-none cursor-pointer"
              >
                <option value={5}>Clearance Level 5 (Super Admin - Master Controller)</option>
                <option value={4}>Clearance Level 4 (Regional Node Manager)</option>
                <option value={3}>Clearance Level 3 (Lead Compliance Underwriter)</option>
              </select>
            </div>

            <button
              id="save-settings-btn"
              onClick={handleApplySettings}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#4A044E] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              {t('save_params', 'Save Parameters')}
            </button>

          </div>
        </div>

        {/* Security architecture explanations cards */}
        <div className="p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl relative flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-blue-500 text-[9px] font-mono tracking-widest uppercase font-bold block">{t('network_status', 'Network status')}</span>
            <h3 className="text-sm font-bold text-[#4A044E]">{t('crypto_key_hashes', 'Apex cryptographic key hashes')}</h3>
            <p className="text-xs text-[#831843] leading-relaxed">
              {t('crypto_desc', 'Security settings are hashed using quantum-safe AES-512 encryption protocols and committed into local HSM storage. Any manual adjustments immediately invalidate current operational sessions on other terminals.')}
            </p>
          </div>

          <div className="text-[10px] text-[#9D174D]/80 font-mono border-t border-[#131b40]/60 pt-4 mt-6">
            {t('intranet_status', 'Intranet connection status: SECURED & MONITORING.')} Hardware module ID: HP-34821-X.
          </div>
        </div>

      </div>

    </div>
  );
}
