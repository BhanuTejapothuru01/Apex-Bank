interface LiveBadgeProps {
  connected: boolean;
  className?: string;
}

export default function LiveBadge({ connected, className = '' }: LiveBadgeProps) {
  if (!connected) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ${className}`}
      title="Connected to Supabase — receiving live updates"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Live
    </span>
  );
}
