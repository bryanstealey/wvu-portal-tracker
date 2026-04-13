import { readDashboard } from '@/lib/storage';
import { PlayerCard } from '@/components/PlayerCard';
import { NewsFeed } from '@/components/NewsFeed';
import { LeadMagnet } from '@/components/LeadMagnet';
import { LastUpdated } from '@/components/LastUpdated';
import type { Player } from '@/lib/types';

export const revalidate = 900; // ISR: revalidate every 15 minutes

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-6 rounded-full bg-[#002855]" />
      <h2 className="text-lg font-bold text-slate-900">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-sm font-normal text-slate-400">({count})</span>
        )}
      </h2>
    </div>
  );
}

function RosterContext({ players }: { players: Player[] }) {
  const returning = players.filter(p => p.direction === 'returning');
  const freshmen = players.filter(p => p.direction === 'freshman');
  const committed = players.filter(p => p.direction === 'incoming' && (p.status === 'committed' || p.status === 'signed'));
  const totalSecured = returning.length + freshmen.length + committed.length;

  return (
    <div className="bg-[#002855] rounded-xl p-5 md:p-6 text-white mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-200">
          2026-27 Roster Status
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-2xl font-extrabold">{totalSecured}</div>
          <div className="text-xs text-blue-200">Spots Filled</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold">{15 - totalSecured}</div>
          <div className="text-xs text-blue-200">Spots Open</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold">{returning.length}</div>
          <div className="text-xs text-blue-200">Returning</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold">{freshmen.length}</div>
          <div className="text-xs text-blue-200">Freshmen</div>
        </div>
      </div>
      {returning.length > 0 && (
        <div className="mt-4 pt-3 border-t border-blue-800">
          <div className="text-xs text-blue-300 mb-1.5">Returning:</div>
          <div className="flex flex-wrap gap-2">
            {returning.map(p => (
              <span key={p.id} className="text-xs bg-blue-800 px-2 py-1 rounded">
                {p.name} ({p.position})
              </span>
            ))}
          </div>
        </div>
      )}
      {freshmen.length > 0 && (
        <div className="mt-3">
          <div className="text-xs text-blue-300 mb-1.5">Incoming Freshmen:</div>
          <div className="flex flex-wrap gap-2">
            {freshmen.map(p => (
              <span key={p.id} className="text-xs bg-blue-800 px-2 py-1 rounded">
                {p.name} ({p.position}){p.note && ` — ${p.note}`}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export default async function Home() {
  const data = await readDashboard();

  const incomingTargets = data.players
    .filter(p => p.direction === 'incoming')
    .sort((a, b) => {
      const statusOrder = { signed: 0, committed: 1, visiting: 2, target: 3, gone: 4 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

  const outgoing = data.players.filter(p => p.direction === 'outgoing');
  const activeIncoming = incomingTargets.filter(p => p.status !== 'gone');
  const goneIncoming = incomingTargets.filter(p => p.status === 'gone');

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header className="bg-[#002855] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                WVU Basketball
                <span className="block text-sm md:text-base font-semibold text-blue-200 tracking-normal">
                  Transfer Portal Tracker
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <LastUpdated timestamp={data.lastPipelineRun} />
            </div>
          </div>
          {/* Portal window status */}
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-blue-200 font-medium">
              Transfer Portal Window Open — Closes April 21
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Roster Context */}
        <RosterContext players={data.players} />



        {/* Incoming Targets */}
        <section className="mb-10">
          <SectionHeader title="Incoming Targets" count={activeIncoming.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeIncoming.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
          {activeIncoming.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">No active incoming targets yet.</p>
          )}
        </section>

        {/* Off the Board */}
        {goneIncoming.length > 0 && (
          <section className="mb-10">
            <SectionHeader title="Off the Board" count={goneIncoming.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
              {goneIncoming.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </section>
        )}

        {/* Outgoing Transfers */}
        <section className="mb-10">
          <SectionHeader title="Outgoing Transfers" count={outgoing.length} />
          {outgoing.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Player</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Pos</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Stats</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {outgoing.map((player) => (
                    <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{player.name}</div>
                        <div className="text-xs text-slate-400 sm:hidden">{player.position} · {player.height}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                        {player.position}
                        {player.height && ` · ${player.height}`}
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                        {player.stats?.ppg ? `${player.stats.ppg} PPG` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {player.destinationSchool ? (
                          <span className="text-slate-700 font-medium">{player.destinationSchool}</span>
                        ) : (
                          <span className="text-slate-400 italic">TBD</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No outgoing transfers.</p>
          )}
        </section>

        {/* Two-column layout for news + lead magnet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <SectionHeader title="Latest News" count={data.news.length} />
            <NewsFeed news={data.news} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <LeadMagnet />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              Built by{' '}
              <a href="https://morgantown.ai" className="text-[#FE5F55] hover:underline font-medium">
                Morgantown AI
              </a>
              {' '}· Not affiliated with WVU Athletics
            </div>
            <div>
              Data from public sources · Updated automatically
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
