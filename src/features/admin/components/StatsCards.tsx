import { ArrowUpRight, ArrowDownRight, Coins, HandCoins, Landmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard } from '../types';

interface StatsCardsProps {
  stats: StatCard[];
  onStatClick?: (type: string) => void;
}

export default function StatsCards({ stats, onStatClick }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {stats.map((stat, i) => {
        // Assign corresponding icon
        let IconComponent = Coins;
        let iconBgColor = 'bg-emerald-500/10 text-emerald-700';

        if (stat.type === 'loans') {
          IconComponent = HandCoins;
          iconBgColor = 'bg-rose-500/10 text-rose-700';
        } else if (stat.type === 'deposits') {
          IconComponent = Landmark;
          iconBgColor = 'bg-purple-500/10 text-purple-700';
        }

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            onClick={() => onStatClick?.(stat.type)}
            className="group relative overflow-hidden rounded-3xl bg-white/20 border border-white/35 p-5 backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer"
          >
            {/* Top row with icon & status option */}
            <div className="flex justify-between items-center mb-3">
              <div className={`w-10 h-10 rounded-xl ${iconBgColor} flex items-center justify-center border border-white/40 shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <button 
                className="p-1 rounded-lg text-purple-950/40 hover:text-purple-950 hover:bg-purple-950/5 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Detailed options for ${stat.title} logged to simulated server console.`);
                }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Middle and Bottom: Values */}
            <div>
              <span className="text-xs font-semibold text-purple-950/50 uppercase tracking-wider block">
                {stat.title}
              </span>
              
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-mono text-2xl font-black text-purple-950 tracking-tight">
                  {stat.value}
                </span>

                {/* Growth Pill Badge */}
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  stat.isPositive 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                }`}>
                  {stat.isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </span>
              </div>
            </div>

            {/* Subtle glow hover gradient background matching image 2 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
}
