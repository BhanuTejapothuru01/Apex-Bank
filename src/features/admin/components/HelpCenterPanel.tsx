import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  BookOpen, 
  MessageSquare, 
  AlertOctagon, 
  ChevronRight, 
  HelpCircle,
  Mail,
  Bug,
  Info,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface HelpCenterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransactionNotification?: (message: string) => void;
}

interface GuideItem {
  id: string;
  category: 'guide' | 'support' | 'report';
  title: string;
  excerpt: string;
  content: string;
  icon: React.ComponentType<any>;
}

const ARTICLES: GuideItem[] = [
  {
    id: 'g-1',
    category: 'guide',
    title: 'Dashboard User Guide',
    excerpt: 'Detailed overview of stats modules, liquidity indices, and sandbox state overrides.',
    content: 'The Apex Bank main dashboard delivers real-time asset indices, visual analytics of loan portfolios, and integrated sub-ledgers. Use the top sync hub to pull transactional records. Hover over monthly data bars in the cashflow chart to filter detail overlays, and use the instant reset tool to normalize tests as required.',
    icon: BookOpen
  },
  {
    id: 'g-2',
    category: 'guide',
    title: 'Loan Management Guide',
    excerpt: 'Manual intervention protocols for review pipelines and underwriting disbursements.',
    content: 'Review facilities in the dedicated Loans menu. Administrative staff are authorized to configure premium interest rate margins, extend disbursement amounts up to $500,000, and issue final approvals. Upon manual signature completion, approved applications will automatically adjust main capital counts and populate Ledger rows.',
    icon: FileText
  },
  {
    id: 'g-3',
    category: 'guide',
    title: 'Fraud Detection Documentation',
    excerpt: 'Navigating velocity thresholds, address mismatch flags, and IP monitoring rule states.',
    content: 'The fraud prevention engine runs sequential velocity constraints. Flagged incidents include suspicious foreign access logs, transaction-frequency multipliers, and anomalous business category targets. Administrators can modify individual rules live, investigate associated server metadata, and choose to Clear or Block offending IP ranges.',
    icon: Info
  },
  {
    id: 'g-4',
    category: 'guide',
    title: 'Customer Management Guide',
    excerpt: 'Managing corporate profiles, setting credit caps, and reviewing available margins.',
    content: 'Corporate Customers are logged inside the live ledger. Click on individual client cards to inspect detailed account routing matrices, available balances, and direct support tickets. Use the control dials to top up accounts or initiate manual debit allocations directly into the sandbox ledger.',
    icon: BookOpen
  },
  {
    id: 'g-5',
    category: 'guide',
    title: 'KYC Verification Guide',
    excerpt: 'Auditing registration certificates, seal validations, and verification protocols.',
    content: 'Pending verification tags specify that corporate clients require manual certificate audits. Click the specialized "Required" button on their profile to load the digital inspector. Check for authentic seal timestamps and tap "Approve Client Credentials" to update their security index and remove pending clearing blocks.',
    icon: CheckCircle2
  }
];

export default function HelpCenterPanel({ isOpen, onClose }: HelpCenterPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [supportTab, setSupportTab] = useState<'articles' | 'contact' | 'report'>('articles');
  
  // Quick forms states
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('andrew.forbist@apexbank.com');
  const [contactSubject, setContactSubject] = useState('Dashboard general inquiry');
  const [bugDescription, setBugDescription] = useState('');
  const [bugSeverity, setBugSeverity] = useState('medium');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ARTICLES;
    return ARTICLES.filter(art => 
      art.title.toLowerCase().includes(q) || 
      art.excerpt.toLowerCase().includes(q) || 
      art.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessToast("Support ticket dispatched. IT helpdesk will reply within 5 minutes.");
    setContactMessage('');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessToast("Technical report logged in SEC-AUDIT repository. Thank you.");
    setBugDescription('');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-[8999] bg-[rgba(0,0,0,0.25)] backdrop-blur-[6px]"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            className="fixed top-0 right-0 h-screen w-full max-w-md bg-[rgba(255,255,255,0.98)] border-l border-white/50 backdrop-blur-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] z-[9000] flex flex-col font-sans text-purple-950"
          >
            {/* Header */}
            <div className="p-6 border-b border-purple-950/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-900" />
                <h3 className="font-display font-black text-lg text-purple-950">
                  Apex Operations Help Desk
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-xl bg-purple-950/5 text-purple-950/40 hover:text-purple-950 hover:bg-purple-950/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Swapper */}
            <div className="grid grid-cols-3 gap-1 px-6 pt-4 pb-2 text-[10px] uppercase font-black tracking-widest text-[#701a75] border-b border-purple-950/5">
              <button
                onClick={() => { setSupportTab('articles'); setActiveArticle(null); }}
                className={`py-2 rounded-xl border transition-all cursor-pointer ${
                  supportTab === 'articles' 
                    ? 'bg-purple-950 text-white border-purple-950' 
                    : 'bg-white/40 border-purple-950/10 hover:bg-white/80'
                }`}
              >
                Guides
              </button>
              <button
                onClick={() => setSupportTab('contact')}
                className={`py-2 rounded-xl border transition-all cursor-pointer ${
                  supportTab === 'contact' 
                    ? 'bg-purple-950 text-white border-purple-950' 
                    : 'bg-white/40 border-purple-950/10 hover:bg-white/80'
                }`}
              >
                Contact Help
              </button>
              <button
                onClick={() => setSupportTab('report')}
                className={`py-2 rounded-xl border transition-all cursor-pointer ${
                  supportTab === 'report' 
                    ? 'bg-purple-950 text-white border-purple-950' 
                    : 'bg-white/40 border-purple-950/10 hover:bg-white/80'
                }`}
              >
                Report Bug
              </button>
            </div>

            {/* Notification overlay inside help center */}
            <AnimatePresence>
              {successToast && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500/15 border border-emerald-550/30 p-3.5 mx-6 mt-4 rounded-2xl text-[11px] font-bold text-emerald-800 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 animate-bounce" />
                  <span>{successToast}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* TAB 1: GUIDES & MANUALS */}
              {supportTab === 'articles' && (
                <>
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-purple-950/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search general core articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-purple-950/5 hover:bg-purple-950/10 focus:bg-white text-xs font-bold text-purple-950 placeholder-purple-950/40 rounded-2xl border border-purple-950/10 focus:outline-none focus:ring-1 focus:ring-purple-700 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-950/40 hover:text-purple-950 p-0.5"
                      >
                        <X className="w-3" />
                      </button>
                    )}
                  </div>

                  {/* Guides list */}
                  <div className="space-y-2.5">
                    {activeArticle ? (
                      // Detail view of the article
                      (() => {
                        const art = ARTICLES.find(a => a.id === activeArticle)!;
                        const ArtIcon = art.icon;
                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 rounded-3xl bg-white/50 border border-purple-950/10 space-y-4.5"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-xl bg-purple-950/10 text-purple-900 flex items-center justify-center shrink-0">
                                <ArtIcon className="w-4.5 h-4.5" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-xs font-black uppercase text-purple-950/50">Core Documentation</h4>
                                <h3 className="font-display font-black text-sm text-purple-950">{art.title}</h3>
                              </div>
                            </div>

                            <p className="text-xs text-purple-950/75 leading-relaxed font-medium bg-white/40 p-3 rounded-2xl border border-purple-950/5">
                              {art.content}
                            </p>

                            <button
                              onClick={() => setActiveArticle(null)}
                              className="text-[10px] font-black uppercase tracking-wider text-purple-900 hover:text-purple-950 flex items-center gap-1 cursor-pointer focus:outline-none"
                            >
                              ← Back to Article Registry
                            </button>
                          </motion.div>
                        );
                      })()
                    ) : (
                      // Search list view
                      <>
                        {filteredArticles.map((art) => {
                          const IconComp = art.icon;
                          return (
                            <button
                              key={art.id}
                              onClick={() => setActiveArticle(art.id)}
                              className="w-full text-left p-4 rounded-2xl bg-white/40 hover:bg-white/80 border border-purple-950/5 hover:border-purple-950/15 transition-all cursor-pointer flex gap-3 group"
                            >
                              <div className="p-2 rounded-xl bg-purple-950/5 text-purple-900 group-hover:bg-purple-950/10 shrink-0 self-start transition-colors">
                                <IconComp className="w-4.5 h-4.5" />
                              </div>
                              <div className="space-y-1 flex-1 min-w-0">
                                <h4 className="font-sans font-black text-xs text-purple-950 group-hover:text-purple-700 transition-colors flex items-center gap-1.5">
                                  {art.title}
                                  <ChevronRight className="w-3 h-3 text-purple-950/30 group-hover:translate-x-0.5 transition-transform" />
                                </h4>
                                <p className="text-[10px] text-purple-950/50 font-semibold leading-relaxed line-clamp-2">
                                  {art.excerpt}
                                </p>
                              </div>
                            </button>
                          );
                        })}

                        {filteredArticles.length === 0 && (
                          <div className="py-12 text-center text-xs font-bold text-purple-950/40 bg-white/10 rounded-2xl border border-dashed border-purple-950/10">
                            No manuals or guides match "{searchQuery}"
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}

              {/* TAB 2: CONTACT SUPPORT */}
              {supportTab === 'contact' && (
                <form onSubmit={handleContactSubmit} className="space-y-3.5 p-4 rounded-3xl bg-white/30 border border-purple-950/5">
                  <div className="flex gap-2.5 items-center">
                    <Mail className="w-4 h-4 text-purple-900" />
                    <h4 className="font-display font-black text-xs text-purple-950 uppercase tracking-wider">
                      Submit Audit Support Ticket
                    </h4>
                  </div>
                  <p className="text-[10px] text-purple-950/55 font-semibold">
                    Having credential trouble, API synchronization limits, or document verification lockouts? Raise an internal emergency case.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-purple-950/50 block">Your Bank Email</label>
                    <input 
                      type="email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white/70 text-xs font-bold text-purple-950 rounded-xl border border-purple-950/15 focus:outline-none focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-purple-950/50 block">Urgent Category</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-white/70 text-xs font-bold text-purple-950 rounded-xl border border-purple-950/15 focus:outline-none focus:ring-1 focus:ring-purple-700"
                    >
                      <option>Dashboard general inquiry</option>
                      <option>KYC validation locks</option>
                      <option>Clearing balance issues</option>
                      <option>Underwrite limit elevation request</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-purple-950/50 block">Detailed Request Description</label>
                    <textarea 
                      placeholder="Please details what's failing on your operations flow..."
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      className="w-full p-3 bg-white/70 text-xs font-medium text-purple-950 rounded-xl border border-purple-950/15 focus:outline-none focus:ring-1 focus:ring-purple-700 resize-none placeholder-purple-950/35"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-white font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Dispatch Audit Ticket
                  </button>
                </form>
              )}

              {/* TAB 3: REPORT SYSTEM ISSUE */}
              {supportTab === 'report' && (
                <form onSubmit={handleBugSubmit} className="space-y-3.5 p-4 rounded-3xl bg-white/30 border border-purple-950/5">
                  <div className="flex gap-2.5 items-center text-rose-850">
                    <Bug className="w-4 h-4 text-rose-700" />
                    <h4 className="font-display font-black text-xs text-purple-950 uppercase tracking-wider">
                      Report Mainframe Glitch
                    </h4>
                  </div>
                  <p className="text-[10px] text-purple-950/55 font-semibold">
                    Experienced numerical drifting in interest projections, transaction omissions, or component rendering glitches? Post detailed logs into our bug reporter.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-purple-950/50 block">Glitch Severity</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['low', 'medium', 'high'].map(sev => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setBugSeverity(sev)}
                          className={`py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${
                            bugSeverity === sev 
                              ? 'bg-rose-500/10 text-rose-800 border-rose-500'
                              : 'bg-white/40 border-purple-950/15 text-purple-950/50 hover:bg-white/85'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-purple-950/50 block">Describe Replicable Steps</label>
                    <textarea 
                      placeholder="Specify exactly what tabs are open and what button actions initiated the layout or numerical drifting..."
                      rows={5}
                      value={bugDescription}
                      onChange={(e) => setBugDescription(e.target.value)}
                      required
                      className="w-full p-3 bg-white/70 text-xs font-medium text-purple-950 rounded-xl border border-purple-950/15 focus:outline-none focus:ring-1 focus:ring-purple-700 resize-none placeholder-purple-950/35"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-white font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Submit Hotpatch Request
                  </button>
                </form>
              )}

            </div>

            {/* Support Footer */}
            <div className="p-4 bg-purple-950/5 border-t border-purple-950/10 text-[9px] font-bold text-center text-purple-950/40 tracking-wider">
              APEX INFRASTRUCTURE SECURED • SUPPORT GATEWAY 2026.04
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
