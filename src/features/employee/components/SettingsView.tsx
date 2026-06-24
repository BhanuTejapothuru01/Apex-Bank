import React, { useState } from 'react';
import { Settings, Shield, Bell, User, RefreshCw, Key, Landmark } from 'lucide-react';
import { SystemSyncItem } from '../types';

interface SettingsViewProps {
  userName: string;
  setUserName: (n: string) => void;
  userEmail: string;
  setUserEmail: (e: string) => void;
  syncItems: SystemSyncItem[];
  setSyncItems: React.Dispatch<React.SetStateAction<SystemSyncItem[]>>;
  onFullSync: () => void;
  syncAllStatus: string;
}

export default function SettingsView({
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  syncItems,
  setSyncItems,
  onFullSync,
  syncAllStatus
}: SettingsViewProps) {
  const [profileSaved, setProfileSaved] = useState(false);
  const [notificationBell, setNotificationBell] = useState(true);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => {
      setProfileSaved(false);
    }, 3000);
    alert('SECURE DATABASE MEMORANDUM: Employee credentials committed to system mainframe.');
  };

  return (
    <div id="settings-view-root" className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Credentials & Profile Editing */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-pink-500/10 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-pink-500" />
              <h3 className="text-base font-bold font-sans text-[#24142F]">Employee Profile Settings</h3>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Employee Full Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-xs font-sans border border-pink-200 outline-none rounded-xl p-3 focus:ring-2 focus:ring-pink-500/20 bg-pink-50/10"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">System Role Assigned</label>
                <input
                  type="text"
                  disabled
                  value="Senior Banking Administrator"
                  className="w-full text-xs font-sans border border-pink-100 outline-none rounded-xl p-3 bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Corporate Email Address</label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full text-xs font-sans border border-pink-200 outline-none rounded-xl p-3 focus:ring-2 focus:ring-pink-500/20 bg-pink-50/10"
              />
            </div>

            <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100 text-xs font-sans text-pink-700 space-y-2">
              <span className="font-bold block uppercase text-[10px] tracking-wider">PORTAL SECURITY DISCLAIMER</span>
              <p className="leading-relaxed">
                Changes made to employee attributes synchronize across the secure iframe terminal. Please verify correct corporate credentials before dispatching.
              </p>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#24142F] hover:bg-[#351b44] text-white text-xs font-sans font-bold tracking-wider rounded-xl transition duration-200 uppercase active:scale-95"
            >
              COMMIT PROFILE MEMORY
            </button>
          </form>
        </div>

        {/* Right Column: Key managers, security & system sync */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Security & Token keys */}
          <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-pink-500" />
              <h4 className="text-xs font-bold font-mono text-[#24142F] uppercase tracking-wider">
                PORTAL SECURITY CODEKEYS
              </h4>
            </div>

            <div className="p-3 bg-[#24142F] hover:bg-[#1d0a25] rounded-xl text-white font-mono text-[10px] flex justify-between items-center transition-colors">
              <div>
                <span className="text-pink-300 block uppercase">SECURE DISPATCH AR-15</span>
                <span>{apiKeyVisible ? 'FHB-SEC-99812-7X102-SYSBOND' : '••••••••••••••••••••••••'}</span>
              </div>
              <button
                type="button"
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="text-[10px] font-mono text-pink-300 border border-pink-500/20 px-2 py-0.5 rounded hover:bg-white/10 active:scale-95 uppercase"
              >
                {apiKeyVisible ? 'HIDE' : 'REVEAL'}
              </button>
            </div>
          </div>

          {/* System synchronization console */}
          <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-pink-500" />
                <h4 className="text-xs font-bold font-mono text-[#24142F] uppercase tracking-wider">
                  SYSTEM MAINFRAME SYNC
                </h4>
              </div>

              <button
                onClick={onFullSync}
                className="text-[10px] font-mono text-pink-600 font-bold hover:underline shrink-0"
              >
                SYNC ALL NOW
              </button>
            </div>

            <div className="space-y-2">
              {syncItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs p-2 bg-pink-50/50 border border-pink-100 rounded-xl">
                  <span className="font-sans text-gray-700 truncate">{item.name}</span>
                  <span className="font-mono text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold uppercase">
                    {syncAllStatus === 'Syncing' ? 'SYNCING...' : '✓ SYNCED'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
