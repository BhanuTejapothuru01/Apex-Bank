import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Coins, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Activity, 
  MessageSquare, 
  ArrowUpRight,
  BrainCircuit,
  Lock,
  Search,
  Filter,
  Shield,
  ActivityIcon,
  Users
} from 'lucide-react';
import { Customer, Loan, Transaction, Employee } from '../types/dashboard';

interface AIFeaturesProps {
  customers: Customer[];
  employees: Employee[];
  loans: Loan[];
  transactions: Transaction[];
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
}

export default function AIFeatures({
  customers,
  employees,
  loans,
  transactions,
  addAuditLog
}: AIFeaturesProps) {
  // Advanced Filter state
  const [analysisFilter, setAnalysisFilter] = useState<'All' | 'Customers' | 'Employees'>('All');
  const [aiIntelligenceFilter, setAiIntelligenceFilter] = useState<'Risk' | 'Liquidity' | 'Compliance Audit' | 'Credit Score'>('Risk');

  const selectableTargets = useMemo(() => {
    const custTargets = (customers || []).map(c => ({ 
      id: c.id, 
      name: c.name, 
      type: 'Customer' as const,
      detail: c 
    }));
    const empTargets = (employees || []).map(e => ({ 
      id: e.id, 
      name: e.name, 
      type: 'Employee' as const,
      detail: e 
    }));

    if (analysisFilter === 'Customers') return custTargets;
    if (analysisFilter === 'Employees') return empTargets;
    return [...custTargets, ...empTargets];
  }, [customers, employees, analysisFilter]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(() => {
    return customers[0]?.id || employees[0]?.id || '';
  });

  // Keep selection synchronized with current visible options
  const activeTarget = useMemo(() => {
    const found = selectableTargets.find(t => t.id === selectedCustomerId);
    if (found) return found;
    return selectableTargets[0] || null;
  }, [selectableTargets, selectedCustomerId]);

  const [insightOutput, setInsightOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [aiPrompterText, setAiPrompterText] = useState('');
  const [aiPrompterChat, setAiPrompterChat] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    { sender: 'ai', text: "Welcome to Apex Financial Intelligence Core. Enter analytical queries regarding global cash ledgers, threat indexes or client profiles.", time: "08:35 AM" }
  ]);

  const triggerCustomerInsights = () => {
    if (!activeTarget) return;
    setIsGenerating(true);
    setInsightOutput('');

    setTimeout(() => {
      setIsGenerating(false);
      
      let parsedInsights = '';
      const name = activeTarget.name;
      const id = activeTarget.id;

      if (activeTarget.type === 'Customer') {
        const c = activeTarget.detail as Customer;
        
        // Dynamic customization based on current AI Intelligence filter preference
        if (aiIntelligenceFilter === 'Risk') {
          parsedInsights = `
### 🛡️ APEX SECURITY & THREAT MITIGATION INDEX
**Target Ledger Entity:** ${name} (ID: ${id} - ${activeTarget.type})
**Computed Risk Level Score:** ${c.riskScore}% (${c.riskProfile.toUpperCase()})
**Status State Safeguard:** ${c.status}

#### 1. CRITICAL FRAUD RISK RADAR
* **Sub-Check Deviation index:** Flagged normal. No anomalous transactional activity detected inside regional node **${c.branchId}**.
* **IP Geo-Proximity check:** All dynamic admin session validations resolved to trusted white-listed ranges.
* **AML Risk Class parameters:** Categorized as **${c.riskProfile === 'Low' || c.riskProfile === 'Medium' ? 'SAFE TIER' : 'EXPOSED/MONITORED'}**.

#### 2. SYSTEM CORRECTION RECOMMENDATIONS
* **Mitigation Protocol Alpha:** Enable localized transactional triggers and physical multi-signer vaults for security validation.
* **Dynamic Basel-III Ledger Lock:** ${c.riskScore > 60 ? '⚠️ High potential risk indicators. Pre-emptively dispatch MFA update queries to secure mobile ledger terminal.' : '✅ Profile exceeds baseline safety standards. Restrict checking accounts alert rate to medium priority.'}
`;
        } else if (aiIntelligenceFilter === 'Liquidity') {
          parsedInsights = `
### 💰 LIQUIDITY & DEPOSITION HEURISTICS APPRAISAL
**Target Ledger Entity:** ${name} (ID: ${id} - ${activeTarget.type})
**Annually Projected APY Yield:** ${c.type === 'VIP' ? '6.45%' : '4.25%'} Compound Interest Rate

#### 1. FINANCIAL FLOW ESTIMATION
* **Checking Balance Density:** $${c.balance.toLocaleString()} USD
* **Maturity Interest Yield Margin:** Stable checking density with regional growth target nodes.
* **Basel-III Reserves Coverage:** Exceeds localized capital requirement matrices by 12.4%.
`;
        } else if (aiIntelligenceFilter === 'Compliance Audit') {
          parsedInsights = `
### ⚖️ REGULATORY COMPLIANCE AND IDENTITY VERIFICATION REPORT
**Target Ledger Entity:** ${name} (ID: ${id} - ${activeTarget.type})
**KYC Attestation State:** ${c.kycStatus === 'Approved' ? 'PASSED (UIDAI SECURED)' : 'PENDING REVIEW'}

#### 1. ID VALIDATION STATUS
* **Aadhaar QR Decryption:** Cryptographically signed by central government agency.
* **Face Comparison Match:** Evaluated at 98.4% visual pixel similarity.
* **Anti-Spoofing Check:** No anomalies detected.
`;
        } else {
          parsedInsights = `
### 🪙 CREDIT RISK AND DEBT SUITABILITY REPORT
**Target Ledger Entity:** ${name} (ID: ${id} - ${activeTarget.type})
**Debt Limit Capacity:** VIP Tier Multi-collateralized Line of Credit

#### 1. DEBT HEURISTICS
* **Past Payment Ratio:** 100% On-time settlements.
* **Risk Default Odds:** <0.02% probability boundary.
`;
        }
      } else {
        // Employee entity insights
        const envRole = activeTarget.detail as Employee;
        if (aiIntelligenceFilter === 'Risk') {
          parsedInsights = `
### 🛡️ INSIDER THREAT & AUDIT RISK DISPATCH
**Target Employee:** ${name} (ID: ${id} - Senior Staff Representative)
**Rating Score:** ${envRole.rating} / 5.0  
**Department Branch Node:** ${envRole.branchId}

#### 1. ROLE-BASED ACCESS AUDIT
* **Access Level Permissions:** High (Risk & System Level Command Access).
* **Anomalous Action Log:** 0 flags. Staff activity aligns strictly with duty rosters.
* **Performance Metric Factor:** ${envRole.performance}% efficiency index.

#### 2. SECURITY PROTOCOLS
* **HSM Cryptographic Signature Key:** Key rotation occurred successfully.
* **Recommended Guard:** Keep staff privilege vectors bound to localized department: **${envRole.department}**.
`;
        } else {
          parsedInsights = `
### 🧠 STAFF PERFORMANCE AND GENERAL OPERATIONS INTELLIGENCE
**Target Employee:** ${name} (ID: ${id})
**Department Role:** ${envRole.role} (${envRole.department})
**Current Operational Efficiency Rating:** ${envRole.performance}% (Grade A Excellent)

#### 1. DUTY LOGS REPORT
* **Assigned Node:** Branch ${envRole.branchId}
* **Compliance Rating:** 100% compliant with internal bank circulars.
`;
        }
      }

      setInsightOutput(parsedInsights);
      addAuditLog(`Generated cognitive dynamic insights (${aiIntelligenceFilter}) for ${name} [${id}]`, 'Info');
    }, 1200);
  };

  const handleAiPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompterText.trim()) return;

    const userText = aiPrompterText;
    setAiPrompterText('');
    
    const userMsg = { sender: 'user' as const, text: userText, time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) };
    setAiPrompterChat(prev => [...prev, userMsg]);

    addAuditLog(`Admin invoked AI analytical prompter: "${userText.substring(0, 30)}..."`, 'Info');

    // Intelligent context-aware simulated parsing
    setTimeout(() => {
      let aiResponseText = '';
      const lowercaseVal = userText.toLowerCase();

      if (lowercaseVal.includes("fraud") || lowercaseVal.includes("risk") || lowercaseVal.includes("threat")) {
        const suspiciousTxCount = transactions.filter(t => t.status === 'Suspicious').length;
        aiResponseText = `🛡️ APEX SECURITY SCAN: Current system safety is armed. Active threat meters evaluate at 84% exposure due to continuous foreign brute-force attempts. Synchronized firewall rules logged and successfully blocked ${suspiciousTxCount} suspicious transaction flags in the past 24-hours. Core HSM remains 100% integral.`;
      } else if (lowercaseVal.includes("deposit") || lowercaseVal.includes("balance") || lowercaseVal.includes("money")) {
        const sumBal = customers.reduce((sum, c) => sum + c.balance, 0);
        aiResponseText = `💰 CAPITAL DISTRIBUTION ANALYSIS: Aggregated client deposition balances across global checking and savings models total $${sumBal.toLocaleString()} USD. Branch Zurich holds the highest capital density ($1.25B), followed by Singapore and London. Basel-III coverage metrics are satisfied.`;
      } else if (lowercaseVal.includes("loan") || lowercaseVal.includes("default")) {
        const approvedLoansSum = loans.filter(l => l.status === 'Approved').reduce((sum, l) => sum + l.amount, 0);
        const pendingCount = loans.filter(l => l.status === 'Pending').length;
        aiResponseText = `🪙 CREDIT RISK APPRAISAL: Total approved outstanding credit loans equal $${approvedLoansSum.toLocaleString()} USD. Average underwriter default risk score holds at ${(loans.reduce((sum, l) => sum + l.riskScore, 0)/loans.length).toFixed(1)}%. There are currently ${pendingCount} loan applications awaiting compliance review.`;
      } else {
        aiResponseText = `🧠 APEX CORE COGNITIVE: Understood question: "${userText}". Mapped directly to Basel-III master matrices. Automated clearing networks are synced, SWIFT interlink interfaces report normal operational parameters. No accounting discrepancies or pending compliance threats found.`;
      }

      const aiMsg = { sender: 'ai' as const, text: aiResponseText, time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) };
      setAiPrompterChat(prev => [...prev, aiMsg]);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="aifeatures-module">
      
      {/* Top Filter Section */}
      <div className="p-5 rounded-xl border border-[#F9A8D4]/80 bg-[#FCE7F3] shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-[#FBCFE8]">
          <BrainCircuit size={14} className="text-amber-400" />
          <h4 className="text-xs font-bold text-[#4A044E] uppercase tracking-wider">AI Financial Intelligence Workbench</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Analysis Filters */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#BE185D]/75 uppercase tracking-wide font-bold">Analysis Category</label>
            <div className="flex flex-wrap gap-1.5">
              {(['All', 'Customers', 'Employees'] as const).map((type) => (
                <button
                  key={type}
                  id={`ai-filter-category-${type}`}
                  onClick={() => {
                    setAnalysisFilter(type);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    analysisFilter === type
                      ? 'bg-amber-500/10 border-amber-500/60 text-amber-400 hover:bg-amber-500/25'
                      : 'bg-[#FFF1F5]/60 border-[#F9A8D4] text-[#BE185D]/75 hover:bg-[#FFF1F5] hover:text-[#4A044E]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {type === 'Customers' && <User size={11} />}
                    {type === 'Employees' && <Users size={11} />}
                    {type === 'All' ? 'All Records' : type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Intelligence Filters */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#BE185D]/75 uppercase tracking-wide font-bold">AI Intelligence Vectors</label>
            <div className="flex flex-wrap gap-1.5">
              {(['Risk', 'Liquidity', 'Compliance Audit', 'Credit Score'] as const).map((intel) => (
                <button
                  key={intel}
                  id={`ai-filter-vector-${intel}`}
                  onClick={() => {
                    setAiIntelligenceFilter(intel);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    aiIntelligenceFilter === intel
                      ? 'bg-indigo-500/10 border-indigo-500/60 text-indigo-400 hover:bg-indigo-500/25'
                      : 'bg-[#FFF1F5]/60 border-[#F9A8D4] text-[#BE185D]/75 hover:bg-[#FFF1F5] hover:text-[#4A044E]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {intel === 'Risk' && <Shield size={11} className="text-rose-400" />}
                    {intel === 'Liquidity' && <Coins size={11} />}
                    {intel === 'Compliance Audit' && <Lock size={11} />}
                    {intel}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2 Wide Layout: Insighter Column and Interactive Brain Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Customer/Employee Deep Insight Generator */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-[#d4af37]/30 bg-gradient-to-b from-[#0a103d] to-[#040822] shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden h-fit">
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          
          <div className="space-y-5">
            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block text-center">
              APEX COGNITIVE ANALYSIS HUB
            </span>

            <div className="space-y-1 select-none text-xs">
              <label className="text-[#BE185D]/75 font-bold uppercase tracking-wide">Target Ledger Owner:</label>
              <select
                id="ai-insight-customer-select"
                value={activeTarget ? activeTarget.id : ''}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-[#FFF1F5] border border-[#F9A8D4] text-[#4A044E] p-2.5 rounded-lg outline-none cursor-pointer"
              >
                {selectableTargets.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.id} - {t.type})</option>
                ))}
              </select>
            </div>

            <button
              id="generate-insights-btn"
              onClick={triggerCustomerInsights}
              disabled={isGenerating || !activeTarget}
              className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b6962a] text-[#050920] text-xs font-bold uppercase tracking-wider rounded-xl hover:from-[#eec84c] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BrainCircuit size={15} className={isGenerating ? 'animate-spin' : ''} />
              <span>{isGenerating ? 'Generative Compilation...' : 'Compile Smart Insights'}</span>
            </button>
          </div>

          <div className="text-[10px] text-[#9D174D]/80 font-mono border-t border-[#131b40]/60 pt-4 mt-6">
            Core AI engine utilizes sovereign risk filters under compliance mandate tier-1.
          </div>
        </div>

        {/* AI Insight Outputs */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl relative flex flex-col justify-between min-h-[350px]">
          <div>
            <span className="text-amber-500 text-[10px] tracking-widest uppercase font-mono font-bold block">Cognitive Outputs</span>
            <h3 className="text-base font-bold text-[#4A044E] mt-1 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500 animate-pulse" />
              Dynamic Intelligent Report Matrix ({aiIntelligenceFilter})
            </h3>
          </div>

          <div className="flex-1 mt-4 p-4 rounded-xl border border-[#FBCFE8] bg-[#FFF5F8]/80 overflow-y-auto text-xs text-[#831843] leading-relaxed font-mono select-text h-64 whitespace-pre-line">
            {insightOutput ? (
              <div>{insightOutput}</div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#9D174D]/80 text-center p-6 font-sans">
                <BrainCircuit size={40} className="text-[#152361] mb-4 animate-bounce" />
                <p className="font-bold text-[#831843]">Evaluate Compliance Diagnostics</p>
                <p className="text-[11px] text-[#9D174D]/80 mt-1 max-w-[340px]">
                  Select any Customer or Employee record above, choose an AI intelligence vector, and click "Compile Smart Insights" to inspect neural bank matrices.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#9D174D]/80 font-mono border-t border-[#131b40]/60 pt-3.5 mt-4">
            <span>COGNITIVE REPORT INTERPOLATIONS ENCRYPT_OK</span>
            <span>SECURE PROXY HUB 3000 SYNCED</span>
          </div>
        </div>

      </div>

      {/* Interactive AI Query Terminal prompter */}
      <div className="p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#4A044E] uppercase tracking-wider flex items-center gap-1.5 leading-normal">
            <Sparkles size={14} className="text-amber-500 fill-amber-500/20" />
            Apex Real-Time Financial Query Prompter
          </h3>
          <p className="text-xs text-[#9D174D]/80">Type any financial balance question, default assessment queries or fraud scan summaries. The AI analyzes local states dynamically.</p>
        </div>

        {/* Mini Chat dialog box */}
        <div className="space-y-4 max-h-80 overflow-y-auto border border-[#FBCFE8] p-4 bg-[#FFF5F8]/80 rounded-xl select-text h-64">
          {aiPrompterChat.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-[#04081c] shrink-0 ${msg.sender === 'user' ? 'bg-amber-400' : 'bg-[#d4af37]'}`}>
                {msg.sender === 'user' ? 'AD' : 'AI'}
              </div>
              <div className={`p-4 rounded-xl text-xs leading-relaxed font-mono ${msg.sender === 'user' ? 'bg-[#152361] text-[#4A044E]' : 'bg-[#FDF2F8] text-amber-100'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Send panel */}
        <form onSubmit={handleAiPromptSubmit} className="flex gap-3 items-center select-none pt-2">
          <input
            id="ai-prompter-msg-input"
            type="text"
            required
            value={aiPrompterText}
            onChange={(e) => setAiPrompterText(e.target.value)}
            placeholder="e.g. 'Review aggregate deposition balances' or 'Show current loan underwriter default risk score'..."
            className="flex-1 bg-[#FFF1F5] border border-[#F9A8D4] focus:border-[#d4af37]/60 text-[#4A044E] placeholder-[#4c5c87] p-2.5 rounded-xl text-xs outline-none font-mono"
          />
          <button 
            id="ai-prompter-submit-btn"
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#4A044E] text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
          >
            Submit Query
          </button>
        </form>
      </div>

    </div>
  );
}
