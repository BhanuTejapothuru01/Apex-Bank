import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, 
  Check, 
  Clock, 
  Database, 
  Users, 
  FileText, 
  ShieldAlert, 
  History,
  Loader2 
} from 'lucide-react';

interface RefreshDropdownProps {
  onRefreshSuccess: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface SyncItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  status: 'idle' | 'loading' | 'success';
}

export default function RefreshDropdown({ onRefreshSuccess, isOpen, onClose }: RefreshDropdownProps) {
  const [syncTime, setSyncTime] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  const [items, setItems] = useState<SyncItem[]>([
    { id: 'dashboard', label: 'Refresh Dashboard Data', icon: Database, status: 'idle' },
    { id: 'customers', label: 'Sync Customer Records', icon: Users, status: 'idle' },
    { id: 'loans', label: 'Update Loan Applications', icon: FileText, status: 'idle' },
    { id: 'fraud', label: 'Refresh Fraud Detection Alerts', icon: ShieldAlert, status: 'idle' },
    { id: 'transactions', label: 'Update Transaction History', icon: History, status: 'idle' },
  ]);

  const [isRefreshingAll, setIsRefreshingAll] = useState(false);

  const handleSyncItem = async (itemId: string) => {
    // Prevent overlapping updates
    if (isRefreshingAll) return;
    
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, status: 'loading' } : item));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, status: 'success' } : item));
    setSyncTime(formattedTime);

    // Revert status to idle after a few seconds
    setTimeout(() => {
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, status: 'idle' } : item));
    }, 2000);

    const targetItem = items.find(i => i.id === itemId);
    onRefreshSuccess(`${targetItem?.label || 'Data'} completed successfully at ${formattedTime}!`);
  };

  const handleSyncAll = async () => {
    if (isRefreshingAll) return;
    setIsRefreshingAll(true);

    // Set all to loading state
    setItems(prev => prev.map(item => ({ ...item, status: 'loading' })));

    // Sequential simulation
    for (let i = 0; i < items.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const targetId = items[i].id;
      setItems(prev => prev.map(item => item.id === targetId ? { ...item, status: 'success' } : item));
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSyncTime(formattedTime);
    setIsRefreshingAll(false);

    onRefreshSuccess(`Full banking mainframe sync completed at ${formattedTime}!`);

    // Reset status back to idle
    setTimeout(() => {
      setItems(prev => prev.map(item => ({ ...item, status: 'idle' })));
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible Backdrop with professional dimming overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[4999] bg-[rgba(0,0,0,0.25)] backdrop-blur-[6px]" 
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-13 z-[5000] w-72 rounded-3xl bg-[rgba(255,255,255,0.98)] border border-white/50 backdrop-blur-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] overflow-hidden p-4 text-purple-950 font-sans"
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-950/10 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/50">
                System Mainframe Sync
              </span>
              <button 
                onClick={handleSyncAll}
                disabled={isRefreshingAll}
                className="text-[9px] font-extrabold bg-purple-950 hover:bg-purple-900 text-white px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95 disabled:opacity-50"
              >
                {isRefreshingAll ? (
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-2.5 h-2.5" />
                )}
                Sync All
              </button>
            </div>

            <div className="space-y-1.5">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSyncItem(item.id)}
                    disabled={isRefreshingAll || item.status === 'loading'}
                    className="w-full p-2.5 rounded-2xl bg-white/40 hover:bg-white/90 border border-transparent hover:border-purple-950/10 transition-all flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-purple-950/5 text-purple-900 group-hover:bg-purple-950/10 transition-colors shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold truncate text-purple-950">
                        {item.label}
                      </span>
                    </div>

                    <div className="shrink-0 pl-2">
                      {item.status === 'loading' && (
                        <Loader2 className="w-3.5 h-3.5 text-purple-950 animate-spin" />
                      )}
                      {item.status === 'success' && (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {item.status === 'idle' && (
                        <RefreshCw className="w-3.5 h-3.5 text-purple-950/30 group-hover:text-purple-950 group-hover:rotate-45 transition-all duration-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-purple-950/10 flex items-center gap-1.5 text-[10px] font-bold text-purple-950/45">
              <Clock className="w-3.5 h-3.5 text-purple-950/30" />
              <span>Last Mainframe Sync: <strong className="text-purple-950/70 font-black">{syncTime}</strong></span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
