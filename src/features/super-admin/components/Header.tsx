import { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  ChevronDown, 
  ShieldCheck, 
  Zap, 
  User, 
  Sliders, 
  LogOut,
  AlertTriangle,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LiveIndianClock from './LiveIndianClock';
import { useTranslation } from './LanguageContext';
import BrandLogo from './BrandLogo';
import { Customer } from '../types/dashboard';
import LiveBadge from '@/components/LiveBadge';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'critical' | 'warning' | 'info';
    read: boolean;
  }>;
  setNotifications: (n: any) => void;
  markNotificationAsRead: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
  onSidebarToggle?: () => void;
  customers?: Customer[];
  selectedCustomerId?: string | null;
  setSelectedCustomerId?: (id: string | null) => void;
  onLogout?: () => void;
  liveConnected?: boolean;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  notifications,
  setNotifications,
  markNotificationAsRead,
  activeTab,
  setActiveTab,
  addAuditLog,
  onSidebarToggle,
  customers = [],
  selectedCustomerId,
  setSelectedCustomerId,
  onLogout,
  liveConnected = false
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-display search panel when typing
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setShowSearchPanel(true);
    }
  }, [searchQuery]);

  const calculateMatchPercent = (name: string, query: string) => {
    if (!query) return 100;
    const n = name.toLowerCase();
    const q = query.toLowerCase();
    if (n === q) return 100;
    if (n.startsWith(q)) return 95;
    if (n.includes(q)) return 85;
    return 70;
  };

  const filteredCustomers = searchQuery.trim() === ''
    ? (customers || []).slice(0, 4) // Show first 4 recent active profiles
    : (customers || []).filter(c => {
        return c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.type.toLowerCase().includes(searchQuery.toLowerCase());
      });
  
  const { t } = useTranslation();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="relative h-20 m-4 sm:m-4 mx-4 sm:mx-8 bg-white/40 backdrop-blur-3xl rounded-[28px] px-4 sm:px-6 flex items-center justify-between z-25 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-[#F9A8D4]/400">
      
      {/* Mobile Toggle Drawer Hamburger Button */}
      {onSidebarToggle && (
        <button
          id="mobile-sidebar-drawer-toggle"
          onClick={onSidebarToggle}
          className="lg:hidden p-2.5 bg-white/50 border border-white/80 text-[#6366f1] rounded-[16px] hover:bg-white/80 transition-all cursor-pointer mr-2 shrink-0 shadow-sm"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Search Input with dropdown visible results panel */}
      <div className="flex-1 min-w-0 max-w-[110px] xs:max-w-[180px] sm:max-w-xs md:max-w-md group animate-fade-in animate-duration-300 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6366f1] w-4.5 h-4.5 group-focus-within:text-[#ec4899] transition-colors" />
          <input
            id="global-search-input"
            type="text"
            placeholder={t('search_global', 'Search intelligence...')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchPanel(true);
            }}
            onFocus={() => setShowSearchPanel(true)}
            className="w-full bg-white/50 backdrop-blur-xl border border-white/60 focus:border-[#c084fc]/50 text-[#2e1065] placeholder-[#6366f1]/40 text-sm pl-12 pr-4 py-2.5 rounded-[20px] outline-none focus:shadow-[0_4px_15px_rgba(109,40,217,0.1)] transition-all font-bold"
          />
        </div>

        {/* Global Search Results Dropdown Panel */}
        <AnimatePresence>
          {showSearchPanel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-[calc(100%+8px)] left-0 w-[300px] xs:w-[360px] sm:w-[420px] bg-white border-2 border-[#ec4899]/30 rounded-[22px] shadow-[0_25px_60px_rgba(236,72,153,0.18)] z-[200] p-4 flex flex-col max-h-[460px]"
            >
              {/* Dropdown Header */}
              <div className="flex items-center justify-between border-b border-pink-100 pb-2 mb-3">
                <span className="text-[11px] font-black text-[#6d28d9] tracking-wider uppercase font-mono">
                  {searchQuery ? `Global Client Search (${filteredCustomers.length})` : 'Recent Authorized Clients'}
                </span>
                <div className="flex items-center gap-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-[10px] font-extrabold text-[#ec4899] hover:underline hover:opacity-85"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setShowSearchPanel(false)}
                    className="p-1 hover:bg-[#FFE6F3] text-pink-500 rounded-full transition-colors cursor-pointer"
                    title="Close Results Panel"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Dynamic Scrollable Results List */}
              <div id="search-results-scrollable" className="overflow-y-auto flex-1 pr-1 space-y-2 select-none scrollbar-thin scrollbar-thumb-pink-200 text-left">
                {filteredCustomers.length === 0 ? (
                  <div className="py-10 text-center text-[#9D174D]/75 flex flex-col items-center justify-center gap-1">
                    <span className="font-extrabold text-[12px] text-pink-900 font-sans">No matching customers found</span>
                    <span className="text-[10px] text-[#9D174D]/85 font-mono">Check ID format or full-name spelling</span>
                  </div>
                ) : (
                  filteredCustomers.map((cust) => {
                    const matchPercent = calculateMatchPercent(cust.name, searchQuery);
                    const isSelected = selectedCustomerId === cust.id;

                    return (
                      <div
                        id={`search-result-card-${cust.id}`}
                        key={cust.id}
                        onClick={() => {
                          setSelectedCustomerId?.(cust.id);
                          setActiveTab('customers');
                          addAuditLog(`Selected client ${cust.name} [ID: ${cust.id}] under live dashboard.`, 'Info');
                        }}
                        className={`p-3 border rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'bg-[#FCE7F3]/40 border-[#ec4899] shadow-[0_4px_12px_rgba(236,72,153,0.1)] scale-[1.01]' 
                            : 'bg-[#FDFBFD] border-pink-100 hover:bg-[#FCE7F3]/15 hover:border-pink-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`w-8.5 h-8.5 rounded-full border flex items-center justify-center shrink-0 font-extrabold text-xs tracking-tighter ${
                            isSelected ? 'bg-pink-100 border-pink-300 text-[#ec4899]' : 'bg-slate-50 border-slate-200 text-[#4A044E]'
                          }`}>
                            {cust.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="text-left min-w-0">
                            <h5 className="text-[12px] font-black text-[#4A044E] truncate leading-tight">
                              {cust.name}
                            </h5>
                            <div className="flex items-center gap-1.5 mt-1 font-mono">
                              <span className="text-[9px] font-extrabold leading-none bg-[#FCE7F3]/80 border border-pink-200 text-pink-900 px-1 py-0.5 rounded truncate">
                                {cust.id}
                              </span>
                              <span className="text-[9px] font-bold leading-none text-[#9D174D]/75">
                                {cust.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0 text-right pl-2">
                          <span className={`px-2 py-0.5 text-[8.5px] font-mono font-black border rounded leading-none ${
                            cust.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                              : 'bg-rose-50 text-rose-600 border-rose-200'
                          }`}>
                            {cust.status.toUpperCase()}
                          </span>
                          <span className="text-[9px] font-mono font-extrabold text-pink-600">
                            {matchPercent}% match
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Right Utility Widgets */}
      <div className="flex items-center gap-2 md:gap-4 ml-2 sm:ml-4">
        <LiveBadge connected={liveConnected} className="hidden sm:inline-flex" />
        
        {/* Live Indian Standard Time (IST) Clock Widget */}
        <LiveIndianClock />

        {/* Security level badge */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-bold tracking-wider uppercase">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span>{t('secured_ip', 'Secured IP-3000')}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-3 rounded-[16px] bg-white/40 border border-white/60 text-[#6d28d9] hover:text-[#ec4899] hover:bg-white/60 transition-all duration-300 cursor-pointer shadow-sm hover:scale-[1.05] active:scale-[0.95]"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ec4899] text-[10px] font-bold text-[#4A044E] border-2 border-[#fbf5f7] shadow-lg animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>


          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2.5 w-80 bg-white/95 border border-[#FF70D9]/30 rounded-2xl shadow-[0_15px_40px_rgba(255,94,207,0.15)] z-40 p-1.5 backdrop-blur-xl"
              >
                <div className="p-3 border-b border-[#FF70D9]/30 flex items-center justify-between">
                  <span className="text-xs font-black text-[#2D2438] uppercase tracking-wider">Apex Threat Feed ({unreadCount})</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => {
                        notifications.forEach(n => markNotificationAsRead(n.id));
                        addAuditLog("Super Admin cleared all warnings from notification panel", "Info");
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                      }}
                      className="text-[10px] text-[#FF3EB5] font-bold hover:text-rose-700 transition-colors cursor-pointer"
                    >
                      Clear Warnings
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#8b7596]">
                      No threat warnings active on this server.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          setShowNotifications(false);
                          addAuditLog(`Reviewed alert details: ${n.id} - ${n.title}`, "Info");
                          if (n.title.toLowerCase().includes('fraud') || n.title.toLowerCase().includes('intrusion') || n.title.toLowerCase().includes('blacklisted')) {
                            setActiveTab('fraud');
                          } else if (n.title.toLowerCase().includes('kyc') || n.title.toLowerCase().includes('biometric')) {
                            setActiveTab('kyc');
                          } else if (n.title.toLowerCase().includes('loan')) {
                            setActiveTab('loans');
                          } else if (n.title.toLowerCase().includes('swift') || n.title.toLowerCase().includes('bridge')) {
                            setActiveTab('transactions');
                          }
                        }}
                        className={`p-3 border-b border-[#FF70D9]/20 hover:bg-[#FFD6EC]/30 transition-colors cursor-pointer rounded-xl ${
                          !n.read ? 'bg-[#FFD6EC]/15' : ''
                        }`}
                      >
                        <div className="flex gap-2.5 items-start">
                          {n.type === 'critical' ? (
                            <div className="p-1 rounded bg-red-100 text-red-600 mt-0.5">
                              <AlertTriangle size={13} />
                            </div>
                          ) : n.type === 'warning' ? (
                            <div className="p-1 rounded bg-amber-100 text-amber-600 mt-0.5">
                              <AlertTriangle size={13} />
                            </div>
                          ) : (
                            <div className="p-1 rounded bg-[#FFD6EC] text-[#FF3EB5] mt-0.5 animate-pulse">
                              <Zap size={13} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#2D2438] leading-normal truncate">{n.title}</p>
                            <p className="text-[10px] text-[#5D437A] mt-0.5 leading-tight">{n.description}</p>
                            <span className="text-[9px] text-[#8b7596] font-mono mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Control */}
        <div className="relative">
          <button
            id="profile-dropdown-btn"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
          }}
          className="flex items-center gap-3 p-1.5 pr-4 rounded-[18px] bg-white/40 border border-white/60 hover:bg-white/60 transition-all duration-300 text-left cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" 
            alt="C. Sayeema K." 
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-white/80 shadow-emerald-500/10" 
          />
          <div className="hidden md:block pr-1 leading-normal font-semibold">
            <span className="text-[#2e1065] block font-black text-xs uppercase tracking-tight">C. Sayeema K.</span>
            <span className="text-[10px] text-[#6d28d9] font-black font-mono block tracking-widest opacity-70">ADMIN LEVEL 5</span>
          </div>
          <ChevronDown size={14} className="text-[#6d28d9]" />
        </button>


          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2.5 w-60 bg-white border border-[#F0D5E8] rounded-2xl shadow-[0_15px_40px_rgba(255,107,203,0.15)] overflow-hidden z-40 p-1.5"
              >
                <div className="px-3 py-3 border-b border-[#F0D5E8] bg-pink-50/50 rounded-xl mb-1 flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" 
                    alt="Sayeema Khanam" 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white/80" 
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-black">Sayeema Khanam</p>
                    <p className="text-[9px] text-[#4A4A4A] font-mono mt-0.5 truncate">khanamsayeemakousar@gmail.com</p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button onClick={() => { setActiveTab('profile'); setShowProfile(false); addAuditLog("Super Admin opened profile management", "Info"); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#4A4A4A] hover:bg-[#FFE6F3] hover:text-black rounded-lg transition-colors cursor-pointer">
                    <User size={14} className="text-[#FF6BCB]" />
                    <span>{t('profile_mgmt', 'Profile Management')}</span>
                  </button>
                  <button onClick={() => { setActiveTab('settings'); setShowProfile(false); addAuditLog("Super Admin opened security policies", "Info"); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#4A4A4A] hover:bg-[#FFE6F3] hover:text-black rounded-lg transition-colors cursor-pointer">
                    <Sliders size={14} className="text-[#D97BFF]" />
                    <span>{t('security_policies', 'Security Policies')}</span>
                  </button>
                  <div className="border-t border-[#F0D5E8] my-1" />
                  <button onClick={() => { setShowProfile(false); setShowTerminateConfirm(true); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#FF5A7A] hover:bg-red-50 hover:text-[#FF5A7A] rounded-lg transition-colors cursor-pointer">
                    <LogOut size={14} />
                    <span>{t('terminate_connection', 'Terminate Secure Connection')}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Custom Terminate Secure Connection Dialog */}
      <AnimatePresence>
        {showTerminateConfirm && (
          <div id="terminate-confirm-overlay" className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => !isTerminating && setShowTerminateConfirm(false)}
              className="absolute inset-0 bg-[#2e1065]/35 backdrop-blur-[6px]"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 z-[100000]"
            >
              {!isTerminating && !showSuccess ? (
                <div className="p-8">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <LogOut size={32} className="text-rose-500 animate-pulse" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#2e1065] text-center mb-2">Terminate Secure Session</h3>
                  <p className="text-sm text-[#9D174D]/75 text-center mb-8 leading-relaxed">
                    Are you sure you want to terminate this secure administrative connection? This will securely log out Sayeema.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setShowTerminateConfirm(false)}
                      className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setIsTerminating(true);
                        addAuditLog("Super Admin logged out and terminated connection.", "Critical");
                        
                        setTimeout(() => {
                          setIsTerminating(false);
                          setShowSuccess(true);
                          setTimeout(() => {
                            setShowTerminateConfirm(false);
                            setShowSuccess(false);
                            if (onLogout) {
                              onLogout();
                            } else {
                              window.location.reload();
                            }
                          }, 1500);
                        }, 2000);
                      }}
                      className="py-3 px-4 rounded-xl bg-rose-500 text-[#4A044E] text-sm font-bold hover:bg-rose-600 transition-colors shadow-lg active:scale-[0.98] cursor-pointer"
                    >
                      Terminate
                    </button>
                  </div>
                </div>
              ) : isTerminating ? (
                <div className="p-10 flex flex-col items-center">
                  <div className="relative mb-8">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-rose-500 rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2e1065]">Terminating Connection...</h3>
                  <p className="text-xs text-rose-400 mt-2 font-mono tracking-wider">HSM PROTOCOL SECURE EXIT</p>
                </div>
              ) : (
                <div className="p-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-600">Connection Terminated</h3>
                  <p className="text-xs text-[#9D174D]/85 mt-2">Clearing local active nodes...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
