import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FileCheck, 
  CheckCircle, 
  XCircle, 
  Info, 
  User, 
  TrendingUp, 
  Activity, 
  ShieldAlert,
  Percent,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { LoanApplication } from '../types';

interface LoansViewProps {
  loans: LoanApplication[];
  setLoans: React.Dispatch<React.SetStateAction<LoanApplication[]>>;
  walletBalance: number;
  onSelectCustomerByName?: (name: string) => void;
  selectedLoanId?: string;
  setSelectedLoanId?: (id: string) => void;
}

export default function LoansView({ 
  loans, 
  setLoans, 
  walletBalance, 
  onSelectCustomerByName,
  selectedLoanId: propSelectedLoanId,
  setSelectedLoanId: propSetSelectedLoanId
}: LoansViewProps) {
  const [localSelectedLoanId, setLocalSelectedLoanId] = useState<string>(loans[0]?.id || '');
  
  const selectedLoanId = propSelectedLoanId !== undefined ? propSelectedLoanId : localSelectedLoanId;
  const setSelectedLoanId = propSetSelectedLoanId !== undefined ? propSetSelectedLoanId : setLocalSelectedLoanId;
  
  // Retrieve active selected loan
  const selectedLoan = loans.find(l => l.id === selectedLoanId) || loans[0];

  // Underwriting parameter sliders states (linked directly to currently selected loan!)
  const [adjustedPrincipal, setAdjustedPrincipal] = useState<number>(selectedLoan?.amount || 100000);
  const [adjustedRate, setAdjustedRate] = useState<number>(selectedLoan?.interestRate || 6.25);
  const [adjustedTerm, setAdjustedTerm] = useState<number>(selectedLoan?.termYears || 5);

  // Sync sliders and scroll element into view whenever selection changes!
  React.useEffect(() => {
    if (selectedLoan) {
      setAdjustedPrincipal(selectedLoan.amount);
      setAdjustedRate(selectedLoan.interestRate);
      setAdjustedTerm(selectedLoan.termYears);
      
      // Highlight: smooth scroll selected credit card into view when active selection pivots!
      setTimeout(() => {
        const element = document.getElementById(`loan-button-${selectedLoanId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 150);
    }
  }, [selectedLoanId, selectedLoan]);

  // Calculate Monthly Installments dynamically
  // EMI Formula: [P x R x (1+R)^N]/[((1+R)^N)-1]
  const calculateEMI = (principal: number, annualRate: number, years: number) => {
    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = years * 12;
    if (monthlyRate === 0) return principal / numberOfPayments;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return isNaN(emi) ? 0 : emi;
  };

  const currentEMI = calculateEMI(adjustedPrincipal, adjustedRate, adjustedTerm);
  const totalRepayable = currentEMI * adjustedTerm * 12;

  // Handler to update status
  const handleUpdateStatus = (status: 'Approved' | 'Rejected' | 'Required Info') => {
    setLoans(prev => 
      prev.map(l => {
        if (l.id === selectedLoanId) {
          // Update core properties and standard status
          return {
            ...l,
            status,
            amount: adjustedPrincipal,
            interestRate: adjustedRate,
            termYears: adjustedTerm,
            decisionReason: status === 'Approved' 
              ? `Fully cleared by credit operations with custom rate ${adjustedRate}% over ${adjustedTerm} years.`
              : status === 'Rejected'
              ? 'Credit application denied based on revised underwriting guidelines & limits.'
              : 'Further compliance details, lease documents, and employment verification files requested.'
          };
        }
        return l;
      })
    );
    alert(`Loan status registered as ${status.toUpperCase()}!`);
  };

  return (
    <div id="loans-view-root" className="space-y-6">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-pink-500/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">Total Applications</p>
            <h4 className="text-xl font-bold font-sans text-[#24142F] mt-0.5">{loans.length}</h4>
          </div>
          <div className="p-2 bg-pink-100 text-pink-500 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-pink-500/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">Pending Review</p>
            <h4 className="text-xl font-bold font-sans text-pink-600 mt-0.5">
              {loans.filter(l => l.status === 'Pending').length}
            </h4>
          </div>
          <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-pink-500/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">Approved Loans</p>
            <h4 className="text-xl font-bold font-sans text-emerald-600 mt-0.5">
              {loans.filter(l => l.status === 'Approved').length}
            </h4>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-pink-500/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">Rejected Loans</p>
            <h4 className="text-xl font-bold font-sans text-rose-600 mt-0.5">
              {loans.filter(l => l.status === 'Rejected').length}
            </h4>
          </div>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Underwriting Workshop Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Credit Applications Selection List */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-sans text-[#24142F] uppercase tracking-wide mb-3">
              SELECT CREDIT APPLICATION
            </h3>
            
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {loans.map((loan) => (
                <button
                  key={loan.id}
                  id={`loan-button-${loan.id}`}
                  onClick={() => setSelectedLoanId(loan.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 active:scale-[0.98] ${
                    selectedLoanId === loan.id
                      ? 'border-pink-500 bg-pink-100/50 shadow-sm ring-2 ring-pink-500/20'
                      : 'border-pink-500/10 hover:bg-[#FAF4F8] bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl text-white font-sans font-bold flex items-center justify-center shrink-0 ${
                    selectedLoanId === loan.id ? 'bg-pink-500' : 'bg-gray-400'
                  }`}>
                    {loan.applicantName.split(' ')[0][0]}{loan.applicantName.split(' ')[1]?.[0] || ''}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-900 truncate font-sans">{loan.applicantName}</p>
                    <p className="text-[10px] text-gray-500 font-sans truncate">{loan.companyName}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] font-mono text-[#24142F] font-bold">
                        ${loan.amount.toLocaleString()}
                      </span>
                      <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md ${
                        loan.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : loan.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : loan.status === 'Required Info'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#fff5f8] to-[#fbcfe8] text-[#2e1065] p-4 rounded-2xl text-[10px] font-mono font-bold space-y-1 mt-6 border border-pink-300/40 shadow-sm">
            <div className="flex justify-between">
              <span>LEDGER DEPTH:</span>
              <span className="text-pink-700">100% REGULATED</span>
            </div>
            <div className="flex justify-between">
              <span>LAST AUDIT:</span>
              <span className="text-pink-700">SECURED TODAY</span>
            </div>
          </div>
        </div>

        {/* Middle Column: Selection Details and Param Tuning Sliders */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-pink-500/10 shadow-sm space-y-6">
          
          {selectedLoan ? (
            <>
              {/* Header section with applicant overview */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold font-sans text-gray-900">{selectedLoan.loanType}</h3>
                  <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-0.5">
                    LN-2026-{selectedLoan.id.split('-')[1] || '0834'} · APPLIED: {selectedLoan.dateApplied}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-sans">APPLICANT NAME</p>
                  <p 
                    onClick={() => onSelectCustomerByName?.(selectedLoan.applicantName)}
                    className={`text-sm font-bold text-[#24142F] font-sans ${onSelectCustomerByName ? 'hover:underline hover:text-pink-600 cursor-pointer' : ''}`}
                    title={onSelectCustomerByName ? "Click to view customer details" : undefined}
                  >
                    {selectedLoan.applicantName}
                  </p>
                </div>
              </div>

              {/* Debt to Income & assessments stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Annual Income</span>
                  <span className="text-sm font-bold font-mono text-gray-900">${selectedLoan.income.toLocaleString()}</span>
                </div>
                <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Liabilities</span>
                  <span className="text-sm font-bold font-mono text-gray-900">${selectedLoan.existingLiabilities.toLocaleString()}</span>
                </div>
                <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">DTI ratio</span>
                  <span className="text-sm font-bold font-mono text-pink-600">{selectedLoan.dti}%</span>
                </div>
                <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Risk Rating</span>
                  <span className="text-sm font-bold font-mono text-purple-600">{selectedLoan.riskRating}</span>
                </div>
              </div>

              {/* Decision reason if reject/approve exists */}
              {selectedLoan.decisionReason && (
                <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 text-xs font-sans text-purple-900 flex items-start gap-2">
                  <Info className="w-4.5 h-4.5 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase text-[10px] tracking-wider mb-0.5">DECISION MEMORANDUM</span>
                    {selectedLoan.decisionReason}
                  </div>
                </div>
              )}

              {/* Slider parametrizing tool (VERY SLICK MATH SLIDERS) */}
              <div className="border-t border-gray-100 pt-5 space-y-5">
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase text-gray-500 tracking-wider mb-1">
                    UNDERWRITING PARAMETER FINETUNING
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans">
                    Adjust corporate request limits & interest ratios dynamically.
                  </p>
                </div>

                {/* Slider 1: Loan Principal */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-medium text-gray-700">LOAN PRINCIPAL AMOUNT</span>
                    <span className="font-mono font-bold text-pink-600">${adjustedPrincipal.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min={10000}
                    max={300000}
                    step={5000}
                    value={adjustedPrincipal}
                    onChange={(e) => setAdjustedPrincipal(Number(e.target.value))}
                    className="w-full accent-pink-500 h-1.5 bg-pink-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-gray-400">
                    <span>$10,000 MIN</span>
                    <span>$300,000 MAX</span>
                  </div>
                </div>

                {/* Slider 2: Interest Rate */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-medium text-gray-700">SIMULATED APR RATE %</span>
                    <span className="font-mono font-bold text-pink-600">{adjustedRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={2.0}
                    max={15.0}
                    step={0.25}
                    value={adjustedRate}
                    onChange={(e) => setAdjustedRate(Number(e.target.value))}
                    className="w-full accent-pink-500 h-1.5 bg-pink-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-gray-400">
                    <span>2.0% MIN</span>
                    <span>15.0% MAX</span>
                  </div>
                </div>

                {/* Slider 3: Term Span */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-medium text-gray-700">REPAYMENT TERM SPAN</span>
                    <span className="font-mono font-bold text-pink-600">{adjustedTerm} YEARS</span>
                  </div>
                  <input 
                    type="range" 
                    min={1}
                    max={15}
                    step={1}
                    value={adjustedTerm}
                    onChange={(e) => setAdjustedTerm(Number(e.target.value))}
                    className="w-full accent-pink-500 h-1.5 bg-pink-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-gray-400">
                    <span>1 YEAR</span>
                    <span>15 YEARS</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 font-sans">
              No active credit application is currently highlighted.
            </div>
          )}

        </div>

        {/* Right Column: AI Risk checklist & operational action buttons */}
        <div className="lg:col-span-3 space-y-6">
          
          {selectedLoan && (
            <>
              {/* Checklists Panel */}
              <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase text-[#24142F] tracking-wider mb-1">
                    CUSTOMER VERIFICATION CHECKLIST
                  </h4>
                  <p className="text-[10px] text-gray-400 font-sans">
                    Compliance checklist status required before corporate payout.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-pink-50/50 border border-pink-100 rounded-xl">
                    <span className="font-sans text-gray-700">Overall KYC Status</span>
                    <span className="font-mono font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg text-[9px] uppercase">
                      {selectedLoan.verification.kycStatus ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-pink-50/50 border border-pink-100 rounded-xl">
                    <span className="font-sans text-gray-700">PAN Identity Card</span>
                    <span className="font-mono font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg text-[9px] uppercase">
                      {selectedLoan.verification.panCard ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-pink-50/50 border border-pink-100 rounded-xl">
                    <span className="font-sans text-gray-700">Aadhaar Card Auth</span>
                    <span className="font-mono font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg text-[9px] uppercase">
                      {selectedLoan.verification.aadhaarCard ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-pink-50/50 border border-pink-100 rounded-xl">
                    <span className="font-sans text-gray-700">Bank Account Reconciled</span>
                    <span className="font-mono font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg text-[9px] uppercase">
                      {selectedLoan.verification.bankReconciled ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-pink-50/50 border border-pink-100 rounded-xl">
                    <span className="font-sans text-gray-700">Employment Checklist</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-lg text-[9px] uppercase ${
                      selectedLoan.verification.employmentCheck === 'Verified'
                        ? 'text-emerald-600 bg-emerald-100'
                        : selectedLoan.verification.employmentCheck === 'Failed'
                        ? 'text-rose-600 bg-rose-100'
                        : 'text-amber-600 bg-amber-100'
                    }`}>
                      {selectedLoan.verification.employmentCheck}
                    </span>
                  </div>
                </div>
              </div>

              {/* Installments Math Board */}
              <div className="bg-gradient-to-br from-[#fff5f8] via-[#fce7f3] to-[#fbcfe8] rounded-3xl p-5 text-[#2e1065] shadow-md space-y-3 border border-pink-300/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-400 rounded-full filter blur-[50px] opacity-30 animate-pulse"></div>
                <div className="flex items-center justify-between z-10 relative">
                  <span className="text-[10px] font-mono font-bold text-pink-700 uppercase tracking-wider">UNDERWRITE RISK LEDGER</span>
                  <Sparkles className="w-3.5 h-3.5 text-pink-600 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                
                <div className="space-y-1 z-10 relative">
                  <p className="text-[10px] text-purple-950/60 font-mono uppercase tracking-wider font-semibold">Dynamic POS monthly payback</p>
                  <h3 className="text-xl font-black font-sans text-purple-950 leading-none">
                    ${currentEMI.toLocaleString('en-US', { maximumFractionDigits: 2 })}/mo
                  </h3>
                </div>

                <div className="flex justify-between text-[10px] font-mono font-bold text-purple-950/70 border-t border-[#2e1065]/10 pt-2 z-10 relative">
                  <span>TOTAL INTEREST:</span>
                  <span className="text-[#2e1065]">{((adjustedPrincipal * adjustedRate * adjustedTerm) / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</span>
                </div>

                <div className="flex justify-between text-[10px] font-mono font-bold text-purple-950/70 z-10 relative">
                  <span>CAPITAL COMMIT:</span>
                  <span className="text-[#2e1065]">${totalRepayable.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Action Buttons Frame Grid */}
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Approved')}
                  className="w-full py-3 bg-[#24142F] hover:bg-[#351b44] text-white font-sans font-bold text-xs tracking-wider rounded-xl transition duration-200 uppercase active:scale-95"
                >
                  Approve Loan File
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Rejected')}
                    className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-sans font-bold text-[10px] tracking-wider rounded-xl border border-rose-200 transition duration-200 uppercase active:scale-95"
                  >
                    Reject Loan File
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Required Info')}
                    className="py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-sans font-bold text-[10px] tracking-wider rounded-xl border border-amber-200 transition duration-200 uppercase active:scale-95"
                  >
                    Request Docs
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
