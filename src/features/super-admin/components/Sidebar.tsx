import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building2, 
  Wallet, 
  Coins, 
  CreditCard, 
  Activity, 
  FileCheck, 
  Shield,
  ShieldAlert, 
  TrendingUp, 
  PiggyBank, 
  BarChart3, 
  History, 
  Settings, 
  LogOut,
  HelpCircle,
  Sparkles,
  X,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from './LanguageContext';

export type ActiveTab = 
  | 'overview'
  | 'customers'
  | 'employees'
  | 'branches'
  | 'accounts'
  | 'loans'
  | 'cards'
  | 'transactions'
  | 'kyc'
  | 'fraud'
  | 'wealth'
  | 'deposits'
  | 'reports'
  | 'audit'
  | 'settings'
  | 'support'
  | 'profile'
  | 'ai-core'
  | 'inbox';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingKycCount: number;
  activeAlertsCount: number;
  openTicketsCount: number;
  unreadInboxCount?: number;
  onLogout: () => void;
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  pendingKycCount,
  activeAlertsCount,
  openTicketsCount,
  unreadInboxCount = 0,
  onLogout,
  addAuditLog,
  isOpen,
  onClose
}: SidebarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLogoutConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { t } = useTranslation();

  const menuItems = [
    { id: 'overview' as ActiveTab, name: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'customers' as ActiveTab, name: 'Customer Management', icon: Users },
    { id: 'employees' as ActiveTab, name: 'Employee Management', icon: UserCheck },
    { id: 'branches' as ActiveTab, name: 'Branch Management', icon: Building2 },
    { id: 'accounts' as ActiveTab, name: 'Account Management', icon: Wallet },
    { id: 'loans' as ActiveTab, name: 'Loan Management', icon: Coins },
    { id: 'cards' as ActiveTab, name: 'Credit Card Management', icon: CreditCard },
    { id: 'transactions' as ActiveTab, name: 'Transaction Monitoring', icon: Activity },
    { 
      id: 'kyc' as ActiveTab, 
      name: 'KYC Verification', 
      icon: FileCheck,
      badge: pendingKycCount > 0 ? pendingKycCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    { 
      id: 'fraud' as ActiveTab, 
      name: 'Fraud Detection Center', 
      icon: ShieldAlert,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'bg-red-500/20 text-red-500 border border-red-500/30'
    },
    { id: 'wealth' as ActiveTab, name: 'Investment & Wealth', icon: TrendingUp },
    { id: 'deposits' as ActiveTab, name: 'Fixed Deposits', icon: PiggyBank },
    { id: 'reports' as ActiveTab, name: 'Reports & Analytics', icon: BarChart3 },
    { id: 'ai-core' as ActiveTab, name: 'AI Operational Core', icon: Sparkles },
    { id: 'audit' as ActiveTab, name: 'Audit Logs', icon: History },
    { 
      id: 'support' as ActiveTab, 
      name: 'Support & Tickets', 
      icon: HelpCircle,
      badge: openTicketsCount > 0 ? openTicketsCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    },
    {
      id: 'inbox' as ActiveTab,
      name: 'Inbox Feed',
      icon: Inbox,
      badge: unreadInboxCount > 0 ? unreadInboxCount : undefined,
      badgeColor: 'bg-pink-500/20 text-pink-500 border border-pink-500/30'
    },
    { id: 'settings' as ActiveTab, name: 'System Settings', icon: Settings },
  ];

  return (
    <div 
      id="apex-sidebar"
      className={`h-[calc(100%-2rem)] max-h-full my-4 ml-4 rounded-[32px] bg-white/40 backdrop-blur-3xl flex flex-col shadow-2xl w-[240px] lg:w-[260px] xl:w-[280px] flex-shrink-0 transition-transform duration-300 z-50 border border-white/50
        ${isOpen 
          ? 'translate-x-0 fixed left-1 top-0 bottom-0' 
          : '-translate-x-full lg:translate-x-0 fixed lg:static left-0 top-0 bottom-0 lg:flex hidden'
        }
      `}
    >
      {/* Top Brand Logo */}
      <div className="flex items-center justify-between p-6 border-b border-white/20 min-h-[86px]">
        <div className="flex items-center min-w-0">
            <span className="text-[26px] font-black tracking-tighter text-[#152361] block leading-none lowercase" style={{ fontFamily: '"Outfit", sans-serif' }}>
              apex bank
            </span>
        </div>
        {isOpen && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 bg-[#2e1065]/5 hover:bg-[#2e1065]/10 text-[#2e1065] rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Menu Options Scrollable Item Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1.5 h-0 scrollbar-none">
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#2e1065]/30 mb-3 px-3 mt-2">
          {t('corporate_core', 'Corporate Core')}
        </div>

        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;
          return (
            <button
              id={`sidebar-item-${item.id}`}
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose?.();
              }}
              title={undefined}
              className={`relative w-full flex items-center gap-3.5 px-4 py-3 rounded-[20px] transition-all duration-400 group cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-white shadow-[0_8px_25px_rgba(139,92,246,0.3)] active-sidebar-item-btn' 
                  : 'text-[#2e1065]/60 hover:bg-white/60 hover:text-[#2e1065] hover:shadow-sm'
              }`}
            >
              <IconComponent 
                size={18} 
                className={`flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                  isActive ? 'text-white drop-shadow-md' : 'text-[#6366f1]'
                }`} 
              />

              <span className={`text-[13px] font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-start ${
                isActive ? 'text-white' : 'text-[#2e1065]'
              }`}>
                {t(item.id, item.name)}
              </span>

              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${isActive ? 'bg-white/30 text-white' : item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer with system credentials */}
      <div id="logout-secure-section" className="p-4 bg-transparent border-t border-white/20">
        <button 
          id="sidebar-logout-btn"
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full h-12 flex items-center justify-center gap-2.5 bg-white/30 backdrop-blur-lg border border-white/50 hover:bg-red-500/10 hover:border-red-500/30 text-red-600 text-[11px] font-black rounded-[18px] transition-all duration-400 cursor-pointer group shadow-sm uppercase tracking-widest"
        >
          <LogOut size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
          <span>{t('logout_secure', 'Logout')}</span>
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => !isTerminating && setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/35 backdrop-blur-[6px]"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              {!isTerminating && !showSuccess ? (
                <div id="logout-confirm-card" className="p-8">
                  <div className="w-16 h-16 bg-[#FFF5F5] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <LogOut size={32} className="text-[#D32F2F]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#40304D] text-center mb-2">Logout Secure Session</h3>
                  <p className="text-sm text-[#A38BA7] text-center mb-8 leading-relaxed">
                    Are you sure you want to logout?
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setShowLogoutConfirm(false)}
                      className="py-3 px-4 rounded-xl border border-[#E0E0E0] text-[#40304D] text-sm font-bold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setIsTerminating(true);
                        addAuditLog(`Secure Logout: Admin Sayeema (ID: ADM-942) Session Terminated. IP: 192.168.1.144`, 'Info');
                        
                        setTimeout(() => {
                           setIsTerminating(false);
                           setShowSuccess(true);
                           setTimeout(() => {
                             onLogout();
                           }, 1500);
                        }, 2000);
                      }}
                      className="py-3 px-4 rounded-xl bg-[#D32F2F] text-white text-sm font-bold hover:bg-[#B71C1C] transition-colors shadow-lg active:scale-[0.98]"
                    >
                      Confirm Logout
                    </button>
                  </div>
                </div>
              ) : isTerminating ? (
                <div id="terminating-card" className="p-10 flex flex-col items-center">
                  <div className="relative mb-8">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-[#D32F2F] rounded-full animate-spin" />
                    <Shield size={24} className="absolute inset-0 m-auto text-[#D32F2F] animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-[#40304D]">Terminating Secure Session...</h3>
                  <p className="text-xs text-[#A38BA7] mt-2 font-mono tracking-wider">HSM PROTOCOL EVACUATION</p>
                </div>
              ) : (
                <div id="success-card" className="p-10 flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6"
                  >
                    <Shield size={32} className="text-emerald-500" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-emerald-600">Session terminated successfully.</h3>
                  <p className="text-xs text-slate-400 mt-2">Redirecting to clearance gateway...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
