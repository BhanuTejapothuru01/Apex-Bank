import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  CreditCard, 
  Check, 
  X, 
  UserCheck, 
  Sparkles, 
  Search, 
  DollarSign, 
  ShieldAlert, 
  Info 
} from 'lucide-react';
import { CustomerCard } from '../types';

interface CustomersViewProps {
  customers: CustomerCard[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerCard[]>>;
  selectedCustomerId?: string;
  setSelectedCustomerId?: (id: string) => void;
}

export default function CustomersView({ customers, setCustomers, selectedCustomerId, setSelectedCustomerId }: CustomersViewProps) {
  const [localSelectedId, setLocalSelectedId] = useState<string>(customers[0]?.id || '');
  
  const selectedCustId = selectedCustomerId !== undefined && selectedCustomerId !== '' ? selectedCustomerId : localSelectedId;
  const setSelectedCustId = (id: string) => {
    if (setSelectedCustomerId) {
      setSelectedCustomerId(id);
    } else {
      setLocalSelectedId(id);
    }
  };

  const [filterQuery, setFilterQuery] = useState('');
  
  const selectedCust = customers.find(c => c.id === selectedCustId) || customers[0];

  const handleUpdateStatus = (status: 'Active' | 'Blocked') => {
    setCustomers(prev => 
      prev.map(c => c.id === selectedCustId ? { ...c, status } : c)
    );
    alert(`Customer status updated to ${status.toUpperCase()}!`);
  };

  const handleToggleCheck = (field: 'amlCheck' | 'idCheck' | 'incorpCheck') => {
    setCustomers(prev => 
      prev.map(c => {
        if (c.id === selectedCustId) {
          const currentVal = c[field];
          let updatedVal: any = 'Cleared';
          if (field === 'amlCheck') {
            updatedVal = currentVal === 'Cleared' ? 'Flagged' : currentVal === 'Flagged' ? 'Under Review' : 'Cleared';
          } else {
            updatedVal = currentVal === 'Verified' ? 'Review Required' : 'Verified';
          }
          return { ...c, [field]: updatedVal };
        }
        return c;
      })
    );
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // FICO Gauge Calculations for selected Customer
  const scorePercent = Math.max(0, Math.min(100, ((selectedCust?.creditScore || 300) - 300) / 550 * 100));
  const scoreRadius = 45;
  const scoreCircumference = 2 * Math.PI * scoreRadius;
  const scoreOffset = scoreCircumference - (scorePercent / 100) * scoreCircumference;

  return (
    <div id="customers-view-root" className="space-y-6">
      
      {/* Title Header with Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-pink-500/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-[#24142F]">Corporate Customer Oversight & KYC Desk</h2>
          <p className="text-sm text-gray-500 font-sans mt-1">
            Authorized agent view for credential validation, credit risk score verify, and super admin card limit overrides.
          </p>
        </div>
        
        {/* Search input to match screen exactly */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search corporate files..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-sans border border-pink-200 outline-none rounded-xl focus:ring-2 focus:ring-pink-500/20 bg-pink-50/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left pane: Customers directory list Column */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase text-[#24142F] tracking-wider mb-2">
            ACTIVE PORTFOLIOS ({filteredCustomers.length})
          </h3>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredCustomers.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCustId(c.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between active:scale-[0.98] ${
                  selectedCustId === c.id
                    ? 'border-pink-500 bg-pink-100/50 shadow-sm'
                    : 'border-pink-500/10 hover:bg-[#FAF4F8] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${c.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                    {c.name.split(' ')[0][0]}{c.name.split(' ')[1]?.[0] || ''}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#24142F] font-sans">{c.name}</h4>
                    <span className="text-[10px] text-gray-500 font-sans block">{c.company}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 block mt-1">
                    Score: {c.creditScore}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right pane: Customer audit portfolio visualizer */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {selectedCust ? (
            <>
              {/* Card visual elements matching corporate specs */}
              <div className="md:col-span-7 bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest mb-3">
                    CUSTOMER CARD CREDENTIALS
                  </h4>

                  {/* HIGH FIDELITY MasterCard/Visa dynamic template matching screenshot */}
                  <div className={`w-full aspect-[1.586/1] bg-gradient-to-tr ${selectedCust.avatarColor} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between border border-white/10 group cursor-pointer hover:shadow-2xl transition-all`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full filter blur-2xl opacity-40"></div>
                    
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <p className="text-[9px] font-mono text-white/80 tracking-widest">APEX MASTERCARD PLATINUM</p>
                        <h4 className="text-sm font-bold font-sans mt-0.5">{selectedCust.company}</h4>
                      </div>
                      <div className="w-10 h-7 bg-white/20 rounded-md backdrop-blur-sm border border-white/20 flex items-center justify-center font-bold text-[8px] tracking-wide">
                        CHIP
                      </div>
                    </div>

                    <div className="z-10 mt-6">
                      <p className="text-[15px] font-mono tracking-widest font-semibold">
                        {selectedCust.cardNum}
                      </p>
                    </div>

                    {/* Card Footer rows */}
                    <div className="flex justify-between items-end z-10 pt-2 border-t border-white/10 mt-2">
                      <div>
                        <p className="text-[8px] text-white/60 font-mono uppercase">CARDHOLDER</p>
                        <p className="text-xs font-sans font-semibold tracking-wide uppercase">{selectedCust.name}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-white/60 font-mono uppercase">EXPIRES</p>
                        <p className="text-xs font-mono font-bold">{selectedCust.exp}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono italic">Apex Financial</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Balances and Credit Limits details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Authorized Limit</span>
                    <span className="text-base font-bold font-mono text-gray-900">${selectedCust.limit.toLocaleString()}</span>
                  </div>
                  <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Ledger Balance</span>
                    <span className="text-base font-bold font-mono text-gray-900">${selectedCust.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* FICO Score circle gauge */}
              <div className="md:col-span-5 bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm flex flex-col justify-between items-center text-center">
                <div className="w-full">
                  <h4 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest mb-1 text-left">
                    FICO Credit score
                  </h4>
                  <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl w-fit">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    EXCEPTIONAL STATUS
                  </div>
                </div>

                {/* Score arch with gauge */}
                <div className="relative flex justify-center items-center py-6 mt-2">
                  <svg width="110" height="110" className="transform -rotate-90">
                    <circle 
                      cx="55" 
                      cy="55" 
                      r={scoreRadius} 
                      fill="transparent" 
                      stroke="#F0E5ED" 
                      strokeWidth="8" 
                    />
                    <motion.circle 
                      cx="55" 
                      cy="55" 
                      r={scoreRadius} 
                      fill="transparent" 
                      stroke="url(#scoreGrad)" 
                      strokeWidth="8" 
                      strokeDasharray={scoreCircumference}
                      initial={{ strokeDashoffset: scoreCircumference }}
                      animate={{ strokeDashoffset: scoreOffset }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className="absolute text-center">
                    <h3 className="text-3xl font-bold font-sans text-gray-900 leading-none">
                      {selectedCust.creditScore}
                    </h3>
                    <p className="text-[9px] font-mono font-semibold text-gray-400 uppercase mt-0.5">850 MAX</p>
                  </div>
                </div>

                {/* Block/Unblock buttons */}
                <div className="w-full border-t border-gray-100 pt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Active')}
                    className="flex-1 py-2.5 bg-[#24142F] hover:bg-[#351b44] text-white font-sans font-bold text-xs rounded-xl transition duration-200 uppercase active:scale-95"
                  >
                    Approve Client
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Blocked')}
                    className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-sans font-bold text-xs rounded-xl border border-rose-200 px-3 transition duration-200 uppercase active:scale-95"
                  >
                    Block Code
                  </button>
                </div>
              </div>

              {/* Bottom compliance checks list */}
              <div className="md:col-span-12 bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
                <h4 className="text-xs font-bold font-mono text-[#24142F] uppercase tracking-wider">
                  Audit & KYC Verification Checklist
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  
                  {/* Item 1 */}
                  <button
                    onClick={() => handleToggleCheck('idCheck')}
                    className="p-3 bg-pink-50/50 border border-pink-100 rounded-xl text-left flex items-start gap-2.5 hover:bg-pink-100/50 transition-colors"
                  >
                    <div className="p-1.5 bg-pink-500/10 text-pink-600 rounded-lg mt-0.5">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-sans font-bold block text-gray-900 leading-tight">Identity Passport</span>
                      <span className="text-[9px] font-mono text-emerald-600 font-bold block mt-0.5">
                        {selectedCust.idCheck === 'Verified' ? '✓ AUTO-PASSED' : '✕ MANUAL REVIEW'}
                      </span>
                    </div>
                  </button>

                  {/* Item 2 */}
                  <button
                    onClick={() => handleToggleCheck('amlCheck')}
                    className="p-3 bg-pink-50/50 border border-pink-100 rounded-xl text-left flex items-start gap-2.5 hover:bg-pink-100/50 transition-colors"
                  >
                    <div className="p-1.5 bg-purple-500/10 text-purple-600 rounded-lg mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-sans font-bold block text-gray-900 leading-tight">AML Database Audit</span>
                      <span className={`text-[9px] font-mono font-bold block mt-0.5 ${
                        selectedCust.amlCheck === 'Cleared' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {selectedCust.amlCheck === 'Cleared' ? '✓ CLEARED' : '✕ REVIEW REQUIRED'}
                      </span>
                    </div>
                  </button>

                  {/* Item 3 */}
                  <div className="p-3 bg-pink-50/50 border border-pink-100 rounded-xl text-left flex items-start gap-2.5">
                    <div className="p-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg mt-0.5">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-sans font-bold block text-gray-900 leading-tight">Underwrite FICO</span>
                      <span className="text-[9px] font-mono text-emerald-600 font-bold block mt-0.5">✓ TARGET ACHIEVED</span>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <button
                    onClick={() => handleToggleCheck('incorpCheck')}
                    className="p-3 bg-pink-50/50 border border-pink-100 rounded-xl text-left flex items-start gap-2.5 hover:bg-pink-100/50 transition-colors"
                  >
                    <div className="p-1.5 bg-pink-500/10 text-pink-500 rounded-lg mt-0.5">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-sans font-bold block text-gray-900 leading-tight">Delaware Incorp Cert</span>
                      <span className={`text-[9px] font-mono font-bold block mt-0.5 ${
                        selectedCust.incorpCheck === 'Verified' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {selectedCust.incorpCheck === 'Verified' ? '✓ VERIFIED' : '✕ REQUIRED'}
                      </span>
                    </div>
                  </button>

                </div>
              </div>
            </>
          ) : (
            <div className="md:col-span-12 text-center py-12 text-gray-500">
              Select an ongoing customer portfolio to preview validation status.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
