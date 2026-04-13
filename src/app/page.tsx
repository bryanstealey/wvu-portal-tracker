import { readDashboard } from '@/lib/storage';
import { PlayerCard } from '@/components/PlayerCard';
import { NewsFeed } from '@/components/NewsFeed';
import { LeadMagnet } from '@/components/LeadMagnet';
import { LastUpdated } from '@/components/LastUpdated';
import { RosterProgressBar } from '@/components/RosterProgressBar';
import { WhatsNew } from '@/components/WhatsNew';
import type { Player } from '@/lib/types';

export const revalidate = 900;

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1.5 h-1.5 rounded-full bg-[#FEBB21]" />
      <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#C4C6D0]">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-[#FEBB21]">{count}</span>
        )}
      </h2>
    </div>
  );
}

function PlayerGroup({ title, players, muted }: { title: string; players: Player[]; muted?: boolean }) {
  if (players.length === 0) return null;
  return (
    <div className={`mb-6 ${muted ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#8e909a]">
          {title}
        </span>
        <div className="flex-1 h-px bg-[var(--outline-variant)]/20" />
        <span className="text-[10px] font-mono text-[#8e909a]">{players.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}

function portalDaysRemaining(): number {
  const closeDate = new Date('2026-04-21T23:59:59');
  const now = new Date();
  return Math.max(0, Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export default async function Home() {
  const data = await readDashboard();
  const daysLeft = portalDaysRemaining();

  const incoming = data.players.filter(p => p.direction === 'incoming');
  const committedPlayers = incoming.filter(p => p.status === 'committed' || p.status === 'signed');
  const visitingPlayers = incoming.filter(p => p.status === 'visiting');
  const targetPlayers = incoming.filter(p => p.status === 'target');
  const gonePlayers = incoming.filter(p => p.status === 'gone');
  const outgoing = data.players.filter(p => p.direction === 'outgoing');
  const returning = data.players.filter(p => p.direction === 'returning');
  const freshmen = data.players.filter(p => p.direction === 'freshman');

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--surface-dim)] border-b border-[var(--outline-variant)]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#FEBB21]">
                  WVU Basketball
                </h1>
                <p className="text-[10px] text-[#8e909a] font-mono uppercase tracking-wider">
                  Transfer Portal Tracker
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LastUpdated timestamp={data.lastPipelineRun} />
              {daysLeft > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 bg-[var(--surface-container)] px-3 py-1.5 rounded border border-[#FEBB21]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FEBB21] animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-[#FEBB21] uppercase tracking-wider">
                    {daysLeft}d left
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {/* Roster Progress */}
        <RosterProgressBar players={data.players} />

        {/* What's New */}
        <WhatsNew news={data.news} />

        {/* Incoming Targets */}
        <section>
          <SectionHeader title="Incoming Targets" count={incoming.length - gonePlayers.length} />
          <PlayerGroup title="Committed" players={committedPlayers} />
          <PlayerGroup title="Visiting" players={visitingPlayers} />
          <PlayerGroup title="Targets" players={targetPlayers} />
          <PlayerGroup title="Off the Board" players={gonePlayers} muted />
          {incoming.length === 0 && (
            <p className="text-sm text-[#8e909a] text-center py-8">No incoming targets yet.</p>
          )}
        </section>

        {/* Returning + Freshmen */}
        <section>
          <SectionHeader title="Returning Players" count={returning.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {returning.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
          <SectionHeader title="Incoming Freshmen" count={freshmen.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {freshmen.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </section>

        {/* Outgoing Transfers */}
        <section>
          <SectionHeader title="Outgoing Transfers" count={outgoing.length} />
          {outgoing.length > 0 ? (
            <div className="bg-[var(--surface-container-low)] rounded-lg border border-[var(--outline-variant)]/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--outline-variant)]/20">
                    <th className="text-left px-4 py-2.5 text-[10px] font-mono font-bold text-[#8e909a] uppercase tracking-wider">Player</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-mono font-bold text-[#8e909a] uppercase tracking-wider hidden sm:table-cell">Pos</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-mono font-bold text-[#8e909a] uppercase tracking-wider hidden md:table-cell">Stats</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-mono font-bold text-[#8e909a] uppercase tracking-wider">Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--outline-variant)]/10">
                  {outgoing.map((player) => (
                    <tr key={player.id} className="hover:bg-[var(--surface-container)]/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#E2E2E2]">{player.name}</div>
                        <div className="text-[10px] text-[#8e909a] font-mono sm:hidden">{player.position} · {player.height}</div>
                      </td>
                      <td className="px-4 py-3 text-[#C4C6D0] font-mono text-xs hidden sm:table-cell">
                        {player.position}
                        {player.height && ` · ${player.height}`}
                      </td>
                      <td className="px-4 py-3 text-[#8e909a] font-mono text-xs hidden md:table-cell">
                        {player.stats?.ppg ? `${player.stats.ppg} PPG` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {player.destinationSchool ? (
                          <span className="text-[#E2E2E2] font-medium">{player.destinationSchool}</span>
                        ) : (
                          <span className="text-[#8e909a] italic">TBD</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-[#8e909a] text-center py-8">No outgoing transfers.</p>
          )}
        </section>

        {/* News + Lead Magnet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionHeader title="Latest News" count={data.news.length} />
            <NewsFeed news={data.news} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <LeadMagnet />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--outline-variant)]/10 bg-[var(--surface-lowest)] mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-[#8e909a] uppercase tracking-wider">
            <div>
              Built by{' '}
              <a href="https://morgantown.ai" className="text-[#FE5F55] hover:underline font-bold">
                Morgantown AI
              </a>
            </div>
            <div>
              Not affiliated with WVU Athletics · Data from public sources
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
