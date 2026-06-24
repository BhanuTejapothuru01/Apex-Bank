import { useState } from 'react';
import { 
  LayoutDashboard, 
  WalletCards, 
  Briefcase,
  Users, 
  ArrowLeftRight, 
  ShieldAlert,
  FileText, 
  Sparkles, 
  PiggyBank, 
  FolderOpen, 
  Mail, 
  Settings,
  X,
  Menu,
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'payments', label: 'Payments', icon: WalletCards, badge: null },
    { id: 'loans', label: 'Loans', icon: Calculator, badge: null },
    { id: 'employees', label: 'Employees', icon: Briefcase, badge: null },
    { id: 'customers', label: 'Customers', icon: Users, badge: null },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, badge: null },
    { id: 'fraud', label: 'Fraud Detection', icon: ShieldAlert, badge: 'Alert' },
    { id: 'invoices', label: 'Invoices', icon: FileText, badge: null },
    { id: 'deposits', label: 'Deposits', icon: PiggyBank, badge: null },
    { id: 'documents', label: 'Documents', icon: FolderOpen, badge: null },
    { id: 'inbox', label: 'Inbox', icon: Mail, badge: '9' },
    { id: 'credits', label: 'Credits', icon: Sparkles, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: 'Config' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Logo and Brand */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 select-none">
            <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="apexRibbonGrad" x1="10%" y1="90%" x2="90%" y2="10%">
                  <stop offset="0%" stopColor="#f472b6" /> {/* Pink */}
                  <stop offset="45%" stopColor="#ec4899" /> {/* Hot Pink */}
                  <stop offset="100%" stopColor="#c084fc" /> {/* Lavender/Purple */}
                </linearGradient>
                <linearGradient id="apexBackGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffd1e3" />
                  <stop offset="100%" stopColor="#fda4af" />
                </linearGradient>
              </defs>
              {/* Left Back Leg */}
              <path
                d="M 28 72 C 24 72 21 68 23 61 C 28 48 37 32 49 22 C 53 19 57 21 58 26 C 59 31 52 46 45 58 C 40 66 33 72 28 72 Z"
                fill="url(#apexBackGrad)"
              />
              {/* Main Overlapping Ribbon A Structure */}
              <path
                d="M 50 22 C 58 22 66 30 73 43 C 81 57 85 71 80 76 C 75 81 65 77 56 65 C 47 53 43 40 49 22 Z"
                fill="url(#apexRibbonGrad)"
                opacity="0.95"
              />
              {/* Infinite Inner Loop Bridge */}
              <path
                d="M 40 58 C 45 51 52 47 59 49 C 66 51 70 57 68 64 C 66 70 59 73 52 71 C 45 69 41 63 44 57"
                stroke="url(#apexRibbonGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            {/* Subtle floating ambient glow behind logo */}
            <div className="absolute inset-1 bg-pink-400 rounded-full blur-md opacity-25 -z-10"></div>
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-wide bg-gradient-to-r from-purple-950 via-purple-900 to-pink-900 bg-clip-text text-transparent">
              Apex
            </h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-purple-950/40">Financial hub</p>
          </div>
        </div>

        {/* Menu Navigation container formatted with max-height & elegant scrollbars */}
        <LayoutGroup id="admin-sidebar">
        <nav className="space-y-1 py-1 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-purple-950/15">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isSettings = item.id === 'settings';
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`relative flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 font-sans text-sm font-semibold text-left group ${
                  isActive
                    ? 'text-white'
                    : isSettings
                      ? 'text-pink-700 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 shadow-sm'
                      : 'text-purple-950/70 hover:text-purple-900 hover:bg-white/40'
                }`}
              >
                {/* Selected tab glowing highlight */}
                {isActive && (
                  <motion.div
                    layoutId="activeSlide"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-purple-800 to-purple-600 rounded-xl shadow-lg shadow-purple-950/15 -z-10"
                  />
                )}

                {/* Elegant subtle pink glow container background exclusively for settings */}
                {isSettings && !isActive && (
                  <span className="absolute -inset-px rounded-xl bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-pink-600/5 rounded-xl opacity-100 pointer-events-none group-hover:border-pink-500/50 transition-colors" />
                )}

                <div className="flex items-center gap-3">
                  {isSettings ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      className="flex items-center justify-center"
                    >
                      <Icon className={`w-[18px] h-[18px] transition-transform duration-300 ${
                        isActive ? 'scale-110 text-white' : 'text-pink-600 group-hover:scale-110'
                      }`} />
                    </motion.div>
                  ) : (
                    <Icon className={`w-[18px] h-[18px] transition-transform duration-300 ${
                      isActive ? 'scale-110 text-white' : 'text-purple-950/60 group-hover:scale-110 group-hover:text-purple-700'
                    }`} />
                  )}
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`flex items-center justify-center h-5 px-1.5 min-w-[20px] rounded-full text-[10px] font-extrabold tracking-wider ${
                    isActive 
                      ? 'bg-pink-500 text-white' 
                      : isSettings
                        ? 'bg-gradient-to-r from-pink-500 to-pink-700 text-white animate-pulse shadow-sm shadow-pink-500/20 font-black'
                        : 'bg-pink-500 text-white shadow-sm'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        </LayoutGroup>
      </div>

      {/* Decorative corporate secure identity block placed in footer */}
      <div className="pt-3 border-t border-purple-900/10 text-center">
        <p className="text-[9px] font-bold uppercase tracking-widest text-purple-950/30">
          SECURE DISPATCH AD-10
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile drawer mask */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-purple-950/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-3rem)] rounded-3xl p-6 bg-white/20 border border-white/40 backdrop-blur-xl shadow-xl shadow-purple-950/5">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 left-0 w-72 h-full z-50 p-6 bg-white/70 border-r border-white/50 backdrop-blur-2xl shadow-2xl flex flex-col justify-between"
          >
            <div className="absolute top-4 right-4 lg:hidden">
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-lg bg-purple-950/10 text-purple-950 hover:bg-purple-950/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
