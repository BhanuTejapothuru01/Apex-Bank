import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Landmark, Check, AlertCircle, Sparkles, DollarSign } from 'lucide-react';
import { PaymentItem, WalletState } from '../types';

interface PaymentsViewProps {
  payments: PaymentItem[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentItem[]>>;
  wallet: WalletState;
  setWallet: React.Dispatch<React.SetStateAction<WalletState>>;
  addTransaction: (sender: string, recipient: string, amount: number, category: any) => void;
}

export default function PaymentsView({
  payments,
  setPayments,
  wallet,
  setWallet,
  addTransaction
}: PaymentsViewProps) {

  const handleToggleAutopay = (id: string) => {
    setPayments(prev => 
      prev.map(p => p.id === id ? { ...p, autopay: !p.autopay } : p)
    );
  };

  const handlePayOnce = (payment: PaymentItem) => {
    if (wallet.balance < payment.amount) {
      alert('Transaction blocked: Insufficient balance in corporate wallet.');
      return;
    }

    // Deduct from wallet & increment daily tracker
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - payment.amount,
      dailyTracker: Math.min(prev.dailyTracker + payment.amount * 0.12, prev.dailyTarget)
    }));

    // Register inside global transaction list
    addTransaction('Andrew Forbist', payment.vendor, payment.amount, payment.category);

    alert(`Successfully processed payment of $${payment.amount.toLocaleString()} to ${payment.vendor}!`);
  };

  return (
    <div id="payments-view-root" className="space-y-6">
      
      {/* Visual Title / Description Banner */}
      <div className="bg-white rounded-3xl p-6 border border-pink-500/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-[#24142F]">Fast Payment & Autopay Hub</h2>
          <p className="text-sm text-gray-500 font-sans mt-1">
            Keep track of corporate utility, infrastructure, and lease rates with instant settlement mechanisms.
          </p>
        </div>
        <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 flex items-center gap-3">
          <Landmark className="w-5 h-5 text-pink-500" />
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">LIQUIDITY WALLET</p>
            <p className="text-base font-bold font-sans text-[#24142F]">
              ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid of Payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {payments.map((pay) => (
          <motion.div
            key={pay.id}
            layoutId={pay.id}
            className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm relative overflow-hidden flex flex-col justify-between h-[240px] hover:shadow-md transition-shadow group"
          >
            {/* Soft decorative background matching corporate accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-[60px] opacity-10 ${pay.color}`}></div>

            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl text-white ${pay.color}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-sans text-gray-900 leading-tight">{pay.vendor}</h4>
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">{pay.category}</span>
                </div>
              </div>
            </div>

            <div className="z-10 mt-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">DUE TRANSACTION</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-sans text-[#24142F]">${pay.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <span className="text-[10px] text-pink-500 font-mono font-medium block mt-1 bg-pink-50 px-2 py-0.5 rounded-full w-fit">
                MONTHLY {pay.dueDate}
              </span>
            </div>

            {/* Bottom Actions Row conforming strictly to frame guidelines */}
            <div className="z-10 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAutopay(pay.id)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none ${
                    pay.autopay ? 'bg-pink-500' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                      pay.autopay ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">
                  {pay.autopay ? 'AUTOPAY ACTIVE' : 'AUTOPAY OFF'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handlePayOnce(pay)}
                className="px-3 py-1.5 bg-[#24142F] text-white hover:bg-[#351b44] font-sans font-bold text-[10px] tracking-wider rounded-xl transition-all flex items-center gap-1 active:scale-95"
              >
                PAY ONCE
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
