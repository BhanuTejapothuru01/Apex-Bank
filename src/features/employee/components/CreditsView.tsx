import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sliders, CheckCircle, Award, Landmark, RefreshCw } from 'lucide-react';
import { CreditProduct } from '../types';

interface CreditsViewProps {
  products: CreditProduct[];
  setProducts: React.Dispatch<React.SetStateAction<CreditProduct[]>>;
}

export default function CreditsView({ products, setProducts }: CreditsViewProps) {
  const [allocation, setAllocation] = useState(52500); // initial allocation limit slider
  const [syncing, setSyncing] = useState(false);

  const handleApplyTier = (id: string, name: string) => {
    setProducts(prev => 
      prev.map(p => p.id === id ? { ...p, applied: true } : { ...p, applied: false })
    );
    alert(`Successfully activated premium card tier: ${name}!`);
  };

  const handleSyncDiscount = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('SYNCHRONIZED: Premium API discount applied and updated inside corporate portal!');
    }, 1800);
  };

  // Find currently applied card product
  const activeProduct = products.find(p => p.applied) || products[0];

  return (
    <div id="credits-view-root" className="space-y-6">
      
      {/* Overview */}
      <div className="bg-white rounded-3xl p-6 border border-pink-500/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-[#24142F]">Dynamic Capital Tiers & Credit Premium Tiers</h2>
          <p className="text-sm text-gray-500 font-sans mt-0.5">
            Audit credit limits, define customizable allocation bounds, and synchronize special APR reductions.
          </p>
        </div>
        
        <button
          onClick={handleSyncDiscount}
          disabled={syncing}
          className="px-4 py-2.5 bg-[#24142F] text-white hover:bg-[#351b44] text-xs font-sans font-bold tracking-wider rounded-xl transition duration-200 flex items-center gap-2 outline-none disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'SYNCING API BOND...' : 'SYNC API DISCOUNT TO STUDIO'}
        </button>
      </div>

      {/* Grid of Credit products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm relative overflow-hidden flex flex-col justify-between h-[280px] hover:shadow-md transition-shadow"
          >
            {/* Visual gradient background block */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-[60px] opacity-10 bg-pink-500`}></div>

            <div className="z-10 space-y-2">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-pink-500/10 text-pink-500 rounded-xl">
                  <Award className="w-5 h-5 animate-pulse" />
                </div>
                {prod.applied && (
                  <span className="text-[8px] font-mono font-bold bg-pink-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    APPLIED
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold font-sans text-gray-900">{prod.tierName}</h4>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">CAPITAL PRODUCT</p>
              </div>

              <div className="pt-2">
                <p className="text-[8px] text-gray-400 font-mono uppercase">BASE OVERDRAFT</p>
                <p className="text-xl font-bold font-sans text-[#24142F]">${prod.baseLimit.toLocaleString()}</p>
                <p className="text-[9px] font-mono text-pink-500 font-semibold">{prod.interestRate}% APR LIMIT</p>
              </div>
            </div>

            {/* List of features */}
            <div className="z-10 text-[10px] font-sans text-gray-500 space-y-1 py-1">
              {prod.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>

            {/* Action button */}
            <div className="z-10 pt-3 border-t border-gray-100 flex items-center justify-between mt-3">
              <button
                type="button"
                onClick={() => handleApplyTier(prod.id, prod.tierName)}
                disabled={prod.applied}
                className={`w-full py-2 font-sans font-bold text-[10px] tracking-wider rounded-xl transition duration-200 uppercase ${
                  prod.applied 
                    ? 'bg-pink-100 text-pink-700 cursor-default'
                    : 'bg-[#24142F] hover:bg-[#351b44] text-white active:scale-95'
                }`}
              >
                {prod.applied ? 'ACTIVE PRODUCT' : 'APPLY SCHEME'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slider section Allocation strategy */}
      <div className="bg-white rounded-3xl p-6 border border-pink-500/10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        <div className="md:col-span-8 space-y-4">
          <div>
            <h3 className="text-base font-bold font-sans text-[#24142F]">Line Allocation Strategy</h3>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              Customize dynamic asset weightings allocated directly into active credit products from vault reserves.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-sans font-medium text-gray-700">CORPORATE ALLOCATION VOLUME</span>
              <span className="font-mono font-bold text-pink-600">${allocation.toLocaleString()} USD</span>
            </div>
            <input 
              type="range" 
              min={10000}
              max={250000}
              step={2500}
              value={allocation}
              onChange={(e) => setAllocation(Number(e.target.value))}
              className="w-full accent-pink-500 h-1.5 bg-pink-100 rounded-lg cursor-pointer animate-pulse"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span>$10,000 LIMIT MIN</span>
              <span>$250,000 LIMIT MAX</span>
            </div>
          </div>
        </div>

        {/* Info stats card right */}
        <div className="md:col-span-4 bg-[#FAF4F8] rounded-2xl p-5 border border-pink-500/5 space-y-3.5">
          <div className="flex items-center gap-2 text-pink-600">
            <Sparkles className="w-5 h-5 shrink-0" />
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider">ACTIVE BOND TIERS</h4>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="flex justify-between">
              <span className="text-gray-500">Selected Product:</span>
              <span className="font-bold text-gray-900">{activeProduct.tierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Corporate Target APR:</span>
              <span className="font-bold text-emerald-600">{(activeProduct.interestRate - activeProduct.aprDiscount).toFixed(2)}% APY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Adjusted Limits:</span>
              <span className="font-bold text-gray-900">${(activeProduct.baseLimit + allocation).toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
