import { readDashboard } from '@/lib/storage';
import { PlayerCard } from '@/components/PlayerCard';
import { NewsFeed } from '@/components/NewsFeed';
import { LeadMagnet } from '@/components/LeadMagnet';
import { LastUpdated } from '@/components/LastUpdated';
import { RosterRollCall } from '@/components/RosterRollCall';
import type { Player, NewsItem } from '@/lib/types';

export const revalidate = 900;

function SectionHeader({ title, count, subtitle }: { title: string; count?: number; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FEBB21]" />
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#C4C6D0]">
          {title}
          {count !== undefined && (
            <span className="ml-2 text-[#FEBB21]">{count}</span>
          )}
        </h2>
      </div>
      {subtitle && (
        <p className="text-xs text-[#8e909a] mt-1.5 ml-[18px]">{subtitle}</p>
      )}
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

function NewsTicker({ news }: { news: NewsItem[] }) {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 72);
  const recent = news
    .filter(n => new Date(n.publishedAt) > cutoff)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  if (recent.length === 0) return null;

  const dotColors: Record<string, string> = {
    commitment: 'bg-emerald-400',
    visit: 'bg-blue-400',
    rumor: 'bg-amber-400',
    departure: 'bg-red-400',
    general: 'bg-[#8e909a]',
  };

  function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    return `${diffDays}d ago`;
  }

  return (
    <div className="border-y border-[var(--outline-variant)]/15 py-3 px-1">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FEBB21]">Latest</span>
      </div>
      <div className="space-y-1.5">
        {recent.map((item) => (
          <div key={item.id} className="flex items-center gap-2 text-xs">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[item.category]}`} />
            <span className="text-[#E2E2E2]">{item.title}</span>
            <span className="text-[#8e909a] font-mono text-[10px] flex-shrink-0">{timeAgo(item.publishedAt)}</span>
          </div>
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
  const totalSecured = returning.length + committedPlayers.length + freshmen.length;
  const activeTargetCount = incoming.length - gonePlayers.length;

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header — Score Bug Style */}
      <header className="sticky top-0 z-50 bg-[var(--surface-dim)] border-b border-[var(--outline-variant)]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="flex items-center justify-between">
            {/* Left: Title */}
            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-[#FEBB21]">
                WVU Basketball
              </h1>
              <p className="font-mono text-[10px] text-[#8e909a] uppercase tracking-[0.15em]">
                Transfer Portal Tracker
              </p>
            </div>

            {/* Center: Score Bug (desktop only) */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="font-mono text-2xl font-bold">
                  <span className="text-[#E2E2E2]">{totalSecured}</span>
                  <span className="text-[#8e909a] mx-1">/</span>
                  <span className="text-[#8e909a]">15</span>
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8e909a]">Roster Filled</div>
              </div>
              <div className="w-px h-8 bg-[var(--outline-variant)]/30" />
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-[#E2E2E2]">{activeTargetCount}</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8e909a]">Targets</div>
              </div>
              <div className="w-px h-8 bg-[var(--outline-variant)]/30" />
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-[#E2E2E2]">{outgoing.length}</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8e909a]">Outgoing</div>
              </div>
            </div>

            {/* Right: Status */}
            <div className="flex flex-col items-end gap-1.5">
              <LastUpdated timestamp={data.lastPipelineRun} />
              {daysLeft > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FEBB21] animate-pulse" />
                  <span className="font-mono text-[10px] font-bold text-[#FEBB21] uppercase tracking-wider">
                    {daysLeft} days left
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {/* Roster Roll Call — Who's on the team */}
        <RosterRollCall players={data.players} />

        {/* News Ticker */}
        <NewsTicker news={data.news} />

        {/* Incoming Targets */}
        <section>
          <SectionHeader
            title="Incoming Targets"
            count={activeTargetCount}
            subtitle={`${committedPlayers.length} committed, ${visitingPlayers.length} visiting, ${targetPlayers.length} targets being tracked`}
          />
          <PlayerGroup title="Committed" players={committedPlayers} />
          <PlayerGroup title="Visiting" players={visitingPlayers} />
          <PlayerGroup title="Targets" players={targetPlayers} />
          <PlayerGroup title="Off the Board" players={gonePlayers} muted />
          {incoming.length === 0 && (
            <p className="text-sm text-[#8e909a] text-center py-8">No incoming targets yet.</p>
          )}
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
            <div className="sticky top-24">
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
