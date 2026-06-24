import { ActivityLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, BellRing, ChevronRight } from 'lucide-react';

interface RecentActivityProps {
  logs: ActivityLog[];
}

export default function RecentActivity({ logs }: RecentActivityProps) {
  return (
    <div className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg relative overflow-hidden">
      
      {/* Header and Filter options */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-extrabold text-base text-purple-950">Recent Activity Log</h3>
          <p className="text-[10px] text-purple-950/40 uppercase tracking-wider font-bold">System log timeline</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Gateway Online
          </span>
          <div className="relative">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-pink-500 opacity-75 right-0.5 top-0.5"></span>
            <div className="w-8 h-8 rounded-xl bg-purple-950/5 flex items-center justify-center border border-white/40">
              <BellRing className="w-4 h-4 text-purple-950/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Cards flow (arranged from right side to left side) */}
      <div className="flex flex-row overflow-x-auto gap-4 pb-2 pt-1 snap-x scrollbar-thin scrollbar-thumb-purple-950/20 scrollbar-track-transparent" dir="rtl">
        <AnimatePresence initial={false}>
          {logs && logs.length > 0 ? (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="min-w-[260px] sm:min-w-[300px] bg-white/45 hover:bg-white/60 border border-white/50 rounded-2xl p-4 flex flex-col justify-between shrink-0 snap-start shadow-sm hover:shadow-md transition-all group relative text-left"
                dir="ltr"
              >
                {/* Meta Header block: Group timing stamp ("Today", "Yesterday") & Clock */}
                <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-wider">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[9px] ${
                    log.group === 'Today'
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-700'
                      : 'bg-pink-500/10 border-pink-500/20 text-pink-700'
                  }`}>
                    {log.group}
                  </span>
                  
                  <div className="flex items-center gap-1 text-purple-950/40">
                    <Clock className="w-3 h-3 text-purple-950/30" />
                    <span>{log.time}</span>
                  </div>
                </div>

                {/* Profile Details & Description activity info */}
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0 select-none">
                    <img
                      src={log.user.avatarUrl}
                      alt={log.user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-purple-200 shadow-sm"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-purple-950 font-bold leading-snug">
                      {log.user.name}
                    </p>
                    <p className="text-xs text-purple-950/70 font-semibold leading-relaxed mt-0.5 group-hover:text-purple-950 transition-colors">
                      {log.action}
                    </p>
                  </div>
                </div>

                {/* Card visual footer */}
                <div className="h-px bg-purple-950/5 mt-3 mb-2" />
                <div className="flex items-center justify-between text-[9px] text-purple-950/40 font-extrabold uppercase tracking-widest">
                  <span>System Entry Logged</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-8 w-full text-center text-purple-950/45 font-semibold text-xs">
              No recent activity found.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
