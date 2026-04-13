import Link from 'next/link';
import type { Player } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { PlayerHeadshot } from './PlayerHeadshot';

function StatItem({ label, value, hero }: { label: string; value: string; hero?: boolean }) {
  return (
    <div className="text-center">
      <div className={`font-mono font-bold ${hero ? 'text-lg text-[#FEBB21]' : 'text-sm text-[#E2E2E2]'}`}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[#8e909a] font-mono font-bold">{label}</div>
    </div>
  );
}

const borderColors: Record<string, string> = {
  committed: 'border-l-emerald-400',
  signed: 'border-l-emerald-400',
  visiting: 'border-l-blue-400',
  target: 'border-l-transparent',
  gone: 'border-l-transparent',
};

export function PlayerCard({ player }: { player: Player }) {
  const hasStats = player.stats && (player.stats.ppg || player.stats.rpg || player.stats.apg);

  return (
    <Link href={`/player/${player.id}`} className="block">
      <div className={`bg-[var(--surface-container-low)] rounded-lg border border-[var(--outline-variant)]/30 overflow-hidden hover:border-[#FEBB21]/30 transition-all hover:shadow-[0_0_20px_rgba(254,187,33,0.08)] border-l-[3px] ${borderColors[player.status]}`}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start gap-3">
            <PlayerHeadshot espnId={player.espnId} name={player.name} size={44} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-[#E2E2E2] text-base leading-tight truncate">
                  {player.name}
                </h3>
                <StatusBadge status={player.status} />
              </div>
              <p className="text-xs text-[#8e909a] mt-0.5 font-mono">
                {player.position}
                {player.height && ` · ${player.height}`}
                {player.weight && ` · ${player.weight}`}
              </p>
            </div>
          </div>

          {/* School info */}
          <div className="mt-2 text-sm text-[#C4C6D0]">
            {player.direction === 'incoming' && (
              <span>
                from <span className="font-medium text-[#E2E2E2]">{player.previousSchool}</span>
              </span>
            )}
            {player.direction === 'outgoing' && player.destinationSchool && (
              <span>
                to <span className="font-medium text-[#E2E2E2]">{player.destinationSchool}</span>
              </span>
            )}
            {player.direction === 'outgoing' && !player.destinationSchool && (
              <span className="text-[#8e909a]">destination TBD</span>
            )}
          </div>

          {player.eligibilityYears && (
            <p className="text-[10px] text-[#8e909a] mt-1 font-mono uppercase tracking-wider">
              {player.eligibilityYears} {player.eligibilityYears === 1 ? 'year' : 'years'} eligibility
            </p>
          )}

          {/* Competing schools */}
          {player.competingSchools && player.competingSchools.length > 0 && (
            <p className="text-[10px] text-[#8e909a] mt-1.5">
              Also: <span className="text-[#C4C6D0]">{player.competingSchools.join(', ')}</span>
            </p>
          )}
        </div>

        {/* Stats bar */}
        {hasStats && (
          <div className="px-4 py-2.5 bg-[var(--surface-container)]/50 border-t border-[var(--outline-variant)]/20 flex justify-around">
            {player.stats!.ppg !== undefined && (
              <StatItem label="PPG" value={player.stats!.ppg.toFixed(1)} hero />
            )}
            {player.stats!.rpg !== undefined && (
              <StatItem label="RPG" value={player.stats!.rpg.toFixed(1)} />
            )}
            {player.stats!.apg !== undefined && (
              <StatItem label="APG" value={player.stats!.apg.toFixed(1)} />
            )}
            {player.stats!.bpg !== undefined && (
              <StatItem label="BPG" value={player.stats!.bpg.toFixed(1)} />
            )}
            {player.stats!.fgPct !== undefined && (
              <StatItem label="FG%" value={player.stats!.fgPct.toFixed(1)} />
            )}
            {player.stats!.threePct !== undefined && (
              <StatItem label="3P%" value={player.stats!.threePct.toFixed(1)} />
            )}
          </div>
        )}

        {/* Note */}
        {player.note && (
          <div className="px-4 py-2 border-t border-[var(--outline-variant)]/20">
            <p className="text-[11px] text-[#8e909a] italic leading-relaxed">{player.note}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
