import type { Player } from '@/lib/types';

export function RosterProgressBar({ players }: { players: Player[] }) {
  const returning = players.filter(p => p.direction === 'returning').length;
  const committed = players.filter(p => p.direction === 'incoming' && (p.status === 'committed' || p.status === 'signed')).length;
  const freshmen = players.filter(p => p.direction === 'freshman').length;
  const total = returning + committed + freshmen;
  const open = 15 - total;

  const segments = [
    { count: returning, color: 'bg-[#FEBB21]', label: 'Returning', textColor: 'text-[#FEBB21]' },
    { count: committed, color: 'bg-emerald-400', label: 'Committed', textColor: 'text-emerald-400' },
    { count: freshmen, color: 'bg-blue-400', label: 'Freshmen', textColor: 'text-blue-400' },
    { count: open, color: 'bg-[#282a2b]', label: 'Open', textColor: 'text-[#8e909a]' },
  ];

  return (
    <div className="bg-[var(--surface-container-low)] rounded-lg border border-[var(--outline-variant)]/20 p-5 md:p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FEBB21]">
          2026-27 Roster
        </h2>
        <span className="font-mono text-sm font-bold text-[#E2E2E2]">
          {total} <span className="text-[#8e909a] font-normal">of 15</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex gap-0.5 h-3 rounded-full overflow-hidden mb-4">
        {segments.map((seg) =>
          Array.from({ length: seg.count }).map((_, i) => (
            <div
              key={`${seg.label}-${i}`}
              className={`${seg.color} flex-1 first:rounded-l-full last:rounded-r-full`}
            />
          ))
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1">
        {segments.filter(s => s.count > 0).map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${seg.color}`} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e909a]">
              {seg.label}
            </span>
            <span className={`text-[10px] font-mono font-bold ${seg.textColor}`}>
              {seg.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
