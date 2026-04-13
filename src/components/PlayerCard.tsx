import type { Player } from '@/lib/types';
import { StatusBadge } from './StatusBadge';

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-bold text-slate-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{label}</div>
    </div>
  );
}

export function PlayerCard({ player }: { player: Player }) {
  const hasStats = player.stats && (player.stats.ppg || player.stats.rpg || player.stats.apg);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
              {player.name}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {player.position}
              {player.height && <span className="mx-1">·</span>}
              {player.height}
            </p>
          </div>
          <StatusBadge status={player.status} />
        </div>

        {/* School info */}
        <div className="mt-2 text-sm text-slate-600">
          {player.direction === 'incoming' && (
            <span>
              from <span className="font-medium text-slate-800">{player.previousSchool}</span>
            </span>
          )}
          {player.direction === 'outgoing' && player.destinationSchool && (
            <span>
              to <span className="font-medium text-slate-800">{player.destinationSchool}</span>
            </span>
          )}
          {player.direction === 'outgoing' && !player.destinationSchool && (
            <span className="text-slate-400">destination TBD</span>
          )}
        </div>

        {player.eligibilityYears && (
          <p className="text-xs text-slate-400 mt-1">
            {player.eligibilityYears} {player.eligibilityYears === 1 ? 'year' : 'years'} eligibility
          </p>
        )}
      </div>

      {/* Stats bar */}
      {hasStats && (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-around">
          {player.stats!.ppg !== undefined && (
            <StatLine label="PPG" value={player.stats!.ppg.toFixed(1)} />
          )}
          {player.stats!.rpg !== undefined && (
            <StatLine label="RPG" value={player.stats!.rpg.toFixed(1)} />
          )}
          {player.stats!.apg !== undefined && (
            <StatLine label="APG" value={player.stats!.apg.toFixed(1)} />
          )}
          {player.stats!.bpg !== undefined && (
            <StatLine label="BPG" value={player.stats!.bpg.toFixed(1)} />
          )}
        </div>
      )}

      {/* Note */}
      {player.note && (
        <div className="px-4 py-2 border-t border-slate-100">
          <p className="text-xs text-slate-500 italic">{player.note}</p>
        </div>
      )}
    </div>
  );
}
