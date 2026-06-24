import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Tv, 
  Lightbulb, 
  ShieldCheck, 
  Wifi, 
  Clock, 
  ArrowRight, 
  CreditCard, 
  User, 
  CheckCircle2, 
  RefreshCw,
  Plus
} from 'lucide-react';

interface PaymentsTabProps {
  balance: number;
  onBalanceChange: (amt: number) => void;
  onAddTransaction: (name: string, type: 'Income' | 'Expense', amount: number, recipient: string, status?: 'Completed' | 'Pending' | 'Failed') => void;
  searchQuery?: string;
}

export default function PaymentsTab({ balance, onBalanceChange, onAddTransaction, searchQuery = '' }: PaymentsTabProps) {
  const [autopayEnabled, setAutopayEnabled] = useState<Record<string, boolean>>({
    'pay-1': true,
    'pay-2': false,
    'pay-3': true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const paymentTemplates = [
    { id: 'pay-1', name: 'Apex Electricity', category: 'Utility', cost: 120.00, recipient: 'GridPower Energy', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'pay-2', name: 'Premium Cloud Server', category: 'Infrastructure', cost: 450.00, recipient: 'Vercel Inc.', icon: Wifi, color: 'bg-blue-100 text-blue-700' },
    { id: 'pay-3', name: 'HQ Property Lease', category: 'Rent', cost: 2500.00, recipient: 'Metropolitan Real Estate', icon: Building2, color: 'bg-purple-100 text-purple-700' },
    { id: 'pay-4', name: 'Stripe Merchant Fees', category: 'Business Fee', cost: 89.50, recipient: 'Stripe Payments', icon: CreditCard, color: 'bg-indigo-100 text-indigo-700' },
  ];

  const filteredTemplates = paymentTemplates.filter(item => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.recipient.toLowerCase().includes(q)
    );
  });

  const handlePayImmediate = (name: string, cost: number, recipient: string) => {
    if (cost > balance) {
      alert("Insufficient liquidity to complete this transaction.");
      return;
    }

    onBalanceChange(balance - cost);
    onAddTransaction(name, 'Expense', cost, recipient, 'Completed');
    
    setToastMessage(`Paid $${cost.toLocaleString()} to ${recipient}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleAutopay = (id: string, name: string) => {
    setAutopayEnabled(prev => {
      const next = !prev[id];
      if (next) {
        setToastMessage(`Autopay scheduled for ${name}`);
      } else {
        setToastMessage(`Autopay removed for ${name}`);
      }
      setTimeout(() => setToastMessage(null), 3500);
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. MAIN BANNER CARD */}
      <div className="rounded-3xl bg-white/20 border border-white/40 p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-display font-black text-lg text-purple-950">Fast Payment & Autopay Hub</h3>
            <p className="text-xs text-purple-950/50 font-medium">Keep track of corporate bills, utilities, and scheduled transfers in one interactive place.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-950/5 border border-purple-950/10 rounded-2xl">
            <span className="text-xs font-bold text-purple-950/60 uppercase">Liquidity wallet:</span>
            <span className="font-mono text-sm font-black text-purple-900">${balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2. TEMPLATES PANEL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTemplates.map((item) => {
          const IconComp = item.icon;
          const isAutopay = autopayEnabled[item.id] || false;

          return (
            <div 
              key={item.id} 
              className="rounded-3xl bg-white/25 border border-white/40 p-5 backdrop-blur-lg shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.color} border border-white/40 flex items-center justify-center shadow-inner`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-purple-950">{item.name}</h4>
                      <span className="text-[10px] font-bold text-purple-950/40 uppercase tracking-wide">{item.category}</span>
                    </div>
                  </div>
                  <span className="font-mono text-base font-black text-purple-950">${item.cost.toFixed(2)}</span>
                </div>

                <div className="p-3.5 bg-purple-950/5 rounded-2xl text-xs space-y-1.5 border border-purple-950/5">
                  <div className="flex justify-between items-center text-purple-950/60 font-semibold">
                    <span>Vendor:</span>
                    <span className="text-purple-950 font-bold">{item.recipient}</span>
                  </div>
                  <div className="flex justify-between items-center text-purple-950/60 font-semibold">
                    <span>Due Date:</span>
                    <span className="font-mono text-[10px] text-purple-950 font-bold uppercase">Monthly 28th</span>
                  </div>
                </div>
              </div>

              {/* Autopay Toggle and Button row */}
              <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-purple-950/10">
                <button
                  type="button"
                  onClick={() => toggleAutopay(item.id, item.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold uppercase transition-all duration-300 cursor-pointer ${
                    isAutopay 
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                      : 'bg-purple-950/5 border-purple-950/10 text-purple-950/60 hover:text-purple-950'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isAutopay ? 'bg-emerald-500 animate-pulse' : 'bg-purple-950/40'}`}></span>
                  Autopay: {isAutopay ? 'Active' : 'Off'}
                </button>

                <button
                  type="button"
                  onClick={() => handlePayImmediate(item.name, item.cost, item.recipient)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-700 text-white font-extrabold text-[11px] rounded-xl shadow-lg shadow-purple-950/10 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  Pay Once
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-16 text-center text-xs font-bold text-purple-950/40 bg-white/10 rounded-3xl border border-dashed border-purple-950/15">
            No payments match "{searchQuery}". Try searching for bills like "Electricity" or "Cloud".
          </div>
        )}
      </div>

      {/* POPUP ALERT BAR */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 px-4 py-3 bg-purple-950 backdrop-blur-xl border border-purple-600/30 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
