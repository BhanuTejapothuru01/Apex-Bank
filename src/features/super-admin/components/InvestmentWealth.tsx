import { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Globe, 
  Briefcase, 
  ArrowUpRight 
} from 'lucide-react';

export default function InvestmentWealth() {
  const [tickerPrice, setTickerPrice] = useState({ AAPL: 184.20, GOOG: 172.50, GOLD: 2315.80, SWIFT: 94.10 });

  return (
    <div className="space-y-6" id="investment-wealth-module">
      
      {/* Portfolio Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl border border-[#F9A8D4] bg-[#FCE7F3]/90">
          <span className="text-[#9D174D]/75 text-[9px] uppercase font-bold tracking-wide">Aggregated Client Portfolios</span>
          <p className="text-lg font-bold font-mono text-[#4A044E] mt-2">$242,504,800 USD</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1"><ArrowUpRight size={12} /> +12.4% APR</span>
        </div>

        <div className="p-4 rounded-xl border border-[#F9A8D4] bg-[#FCE7F3]/90">
          <span className="text-[#9D174D]/75 text-[9px] uppercase font-bold tracking-wide">Sovereign Bullion Reserves</span>
          <p className="text-lg font-bold font-mono text-amber-500 mt-2">12,500.22 Troy Oz</p>
          <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1 mt-1">$28,948,016 Valuation</span>
        </div>

        <div className="p-4 rounded-xl border border-[#F9A8D4] bg-[#FCE7F3]/90">
          <span className="text-[#9D174D]/75 text-[9px] uppercase font-bold tracking-wide">Active Trust Index API</span>
          <p className="text-lg font-bold font-mono text-[#4A044E] mt-2">14,210 Indices</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">99.98% Health OK</span>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
          <span className="text-rose-400 text-[9px] uppercase font-bold tracking-wide">Offshored Settlement Caps</span>
          <p className="text-lg font-bold font-mono text-rose-400 mt-2">$50,000,000</p>
          <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">SWIFT Controlled</span>
        </div>

      </div>

      {/* Global wealth distribution indices and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl lg:col-span-2">
          <h3 className="text-sm font-bold text-[#4A044E] uppercase tracking-wider mb-4">Sovereign Wealth Asset Indices</h3>
          
          <div className="space-y-4">
            
            <div className="p-3.5 border border-[#F9A8D4] bg-[#FFF5F8]/60 rounded-xl flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-[#4A044E]">Sovereign Wealth Fund [A-SWF]</h4>
                <p className="text-[10px] text-[#9D174D]/80 font-mono mt-0.5">Focus: High tech infrastructure capital</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[#4A044E] font-bold">$125.40M USD</span>
                <p className="text-[10px] text-[#d4af37] font-bold">+8.40% Yield</p>
              </div>
            </div>

            <div className="p-3.5 border border-[#F9A8D4] bg-[#FFF5F8]/60 rounded-xl flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-[#4A044E]">European Bullion Trust [A-EBT]</h4>
                <p className="text-[10px] text-[#9D174D]/80 font-mono mt-0.5">Focus: Zurich Vault allocations</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[#4A044E] font-bold">$62.80M USD</span>
                <p className="text-[10px] text-[#d4af37] font-bold">+5.22% Yield</p>
              </div>
            </div>

            <div className="p-3.5 border border-[#F9A8D4] bg-[#FFF5F8]/60 rounded-xl flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-[#4A044E]">Wall Street Bluechip Pool [A-WSBP]</h4>
                <p className="text-[10px] text-[#9D174D]/80 font-mono mt-0.5">Focus: Flagship corporate equity portfolios</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[#4A044E] font-bold">$54.30M USD</span>
                <p className="text-[10px] text-[#d4af37] font-bold">+11.50% Yield</p>
              </div>
            </div>

          </div>
        </div>

        {/* Informative column */}
        <div className="p-6 rounded-2xl border border-[#F9A8D4] bg-[#FCE7F3]/90 shadow-2xl relative flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-amber-500 text-[9px] font-mono tracking-widest uppercase font-bold block">Reserve Guidance</span>
            <h3 className="text-sm font-bold text-[#4A044E]">Strategic Capital Allocation</h3>
            <p className="text-xs text-[#831843] leading-relaxed">
              Apex Wealth division coordinates trust configurations with regulatory Basel III compliance frameworks. All asset inflows are fully shielded using HSM biometric mapping nodes with automatic tax reporting clearing pipelines.
            </p>
          </div>

          <div className="text-[10px] text-[#9D174D]/80 font-mono border-t border-[#131b40]/60 pt-4 mt-6">
            Liquidity coverage ratios are monitored dynamically. Basel-III status: FULLY SATISFIED.
          </div>
        </div>

      </div>

    </div>
  );
}
