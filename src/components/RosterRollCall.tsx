import type { Player } from '@/lib/types';

function RosterGroup({
  label,
  players,
  dotColor,
  showOrigin,
}: {
  label: string;
  players: Player[];
  dotColor: string;
  showOrigin?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#8e909a]">
          {label} <span className="text-[#C4C6D0]">{players.length}</span>
        </span>
      </div>
      <div className="space-y-1">
        {players.map(p => (
          <div key={p.id} className="flex items-baseline gap-1.5 text-sm">
            <span className="font-semibold text-[#E2E2E2]">{p.name}</span>
            <span className="font-mono text-[10px] text-[#8e909a]">
              {p.position} {p.height}
            </span>
            {showOrigin && p.previousSchool !== 'West Virginia' && (
              <span className="font-mono text-[10px] text-[#C4C6D0]">
                via {p.previousSchool}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RosterRollCall({ players }: { players: Player[] }) {
  const returning = players.filter(p => p.direction === 'returning');
  const committed = players.filter(p => p.direction === 'incoming' && (p.status === 'committed' || p.status === 'signed'));
  const freshmen = players.filter(p => p.direction === 'freshman');
  const total = returning.length + committed.length + freshmen.length;
  const open = 15 - total;

  const segments = [
    { count: returning.length, color: 'bg-[#FEBB21]' },
    { count: committed.length, color: 'bg-emerald-400' },
    { count: freshmen.length, color: 'bg-blue-400' },
    { count: open, color: 'bg-[#282a2b]' },
  ];

  return (
    <div className="bg-[var(--surface-container-low)] rounded-lg border border-[var(--outline-variant)]/20 p-5 md:p-6">
      {/* Thin progress bar */}
      <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-5">
        {segments.map((seg, si) =>
          Array.from({ length: seg.count }).map((_, i) => (
            <div
              key={`${si}-${i}`}
              className={`${seg.color} flex-1 first:rounded-l-full last:rounded-r-full`}
            />
          ))
        )}
      </div>

      {/* Named roster groups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RosterGroup label="Returning" players={returning} dotColor="bg-[#FEBB21]" />
        <RosterGroup label="Committed" players={committed} dotColor="bg-emerald-400" showOrigin />
        <RosterGroup label="Freshmen" players={freshmen} dotColor="bg-blue-400" showOrigin />
      </div>

      {/* Open slots */}
      <div className="mt-5 pt-4 border-t border-[var(--outline-variant)]/15 flex items-center gap-2">
        <div className="flex gap-1">
          {Array.from({ length: open }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#282a2b] border border-[#43474f]" />
          ))}
        </div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#8e909a]">
          {open} open scholarships
        </span>
      </div>
    </div>
  );
}
