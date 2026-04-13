import { readDashboard } from '@/lib/storage';
import { PlayerHeadshot } from '@/components/PlayerHeadshot';
import { StatusBadge } from '@/components/StatusBadge';
import { NewsFeed } from '@/components/NewsFeed';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 900;

function StatBlock({ label, value, hero }: { label: string; value: string; hero?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-bold text-[#8e909a] uppercase tracking-wider mb-1">{label}</p>
      <p className={`font-mono font-bold ${hero ? 'text-4xl text-[#FEBB21]' : 'text-2xl text-[#E2E2E2]'}`}>{value}</p>
    </div>
  );
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readDashboard();
  const player = data.players.find(p => p.id === id);

  if (!player) {
    notFound();
  }

  // Find related news
  const relatedNews = data.news.filter(n =>
    n.relatedPlayerNames.some(name =>
      name.toLowerCase() === player.name.toLowerCase()
    )
  );

  const hasStats = player.stats && (player.stats.ppg || player.stats.rpg || player.stats.apg);

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <header className="bg-[var(--surface-dim)] border-b border-[var(--outline-variant)]/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#8e909a] hover:text-[#FEBB21] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Tracker
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Player Hero */}
        <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/20 rounded-lg overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Left: Photo + Bio */}
            <div className="md:w-1/3 p-8 flex flex-col items-center text-center border-r border-[var(--outline-variant)]/10">
              <div className="mb-6">
                <PlayerHeadshot espnId={player.espnId} name={player.name} size={160} />
              </div>
              <h1 className="text-3xl font-light tracking-tight text-[#E2E2E2] mb-2">
                {player.name}
              </h1>
              <div className="font-mono text-xs font-bold text-[#FEBB21] uppercase tracking-widest mb-4">
                {player.position}
                {player.height && ` · ${player.height}`}
                {player.weight && ` · ${player.weight} lbs`}
              </div>
              <StatusBadge status={player.status} />

              <div className="grid grid-cols-2 gap-4 w-full border-t border-[var(--outline-variant)]/10 pt-6 mt-6">
                <div className="text-left">
                  <p className="font-mono text-[10px] text-[#8e909a] font-bold uppercase">
                    {player.direction === 'outgoing' ? 'From' : 'Previous'}
                  </p>
                  <p className="text-sm font-medium text-[#E2E2E2]">{player.previousSchool}</p>
                </div>
                {player.eligibilityYears && (
                  <div className="text-left">
                    <p className="font-mono text-[10px] text-[#8e909a] font-bold uppercase">Eligibility</p>
                    <p className="text-sm font-medium text-[#E2E2E2]">
                      {player.eligibilityYears} {player.eligibilityYears === 1 ? 'year' : 'years'}
                    </p>
                  </div>
                )}
                {player.destinationSchool && (
                  <div className="text-left">
                    <p className="font-mono text-[10px] text-[#8e909a] font-bold uppercase">Destination</p>
                    <p className="text-sm font-medium text-[#E2E2E2]">{player.destinationSchool}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Stats */}
            <div className="md:w-2/3 p-8">
              {hasStats ? (
                <>
                  <h3 className="font-mono text-[11px] font-bold uppercase text-[#FEBB21] tracking-[0.15em] mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FEBB21]" />
                    2025-26 Season Stats
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[var(--surface-container)]/30 p-6 rounded-lg border border-[var(--outline-variant)]/10">
                    {player.stats!.ppg !== undefined && (
                      <StatBlock label="PPG" value={player.stats!.ppg.toFixed(1)} hero />
                    )}
                    {player.stats!.rpg !== undefined && (
                      <StatBlock label="RPG" value={player.stats!.rpg.toFixed(1)} />
                    )}
                    {player.stats!.apg !== undefined && (
                      <StatBlock label="APG" value={player.stats!.apg.toFixed(1)} />
                    )}
                    {player.stats!.bpg !== undefined && (
                      <StatBlock label="BPG" value={player.stats!.bpg.toFixed(1)} />
                    )}
                    {player.stats!.fgPct !== undefined && (
                      <StatBlock label="FG%" value={player.stats!.fgPct.toFixed(1)} />
                    )}
                    {player.stats!.threePct !== undefined && (
                      <StatBlock label="3P%" value={player.stats!.threePct.toFixed(1)} />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-[#8e909a] text-sm">
                  No stats available
                </div>
              )}

              {/* Competing Schools */}
              {player.competingSchools && player.competingSchools.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-mono text-[11px] font-bold uppercase text-[#8e909a] tracking-[0.15em] mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8e909a]" />
                    Also Pursuing
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {player.competingSchools.map(school => (
                      <span key={school} className="text-xs font-mono bg-[var(--surface-container-high)] text-[#C4C6D0] px-3 py-1.5 rounded border border-[var(--outline-variant)]/20">
                        {school}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {player.note && (
                <div className="mt-8 border-l-2 border-[#FEBB21]/30 pl-4">
                  <p className="text-sm text-[#C4C6D0] italic leading-relaxed">{player.note}</p>
                </div>
              )}

              {/* Tracking info */}
              <div className="mt-8 pt-6 border-t border-[var(--outline-variant)]/10 flex gap-6 text-[10px] font-mono text-[#8e909a] uppercase tracking-wider">
                <span>Tracked since {new Date(player.firstTracked).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span>Updated {new Date(player.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span>Sources: {player.sources.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mb-8">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#C4C6D0] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEBB21]" />
              Related News
            </h3>
            <NewsFeed news={relatedNews} />
          </div>
        )}

        {/* YouTube Highlights placeholder */}
        {player.highlightUrl && (
          <div className="mb-8">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#C4C6D0] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEBB21]" />
              Highlights
            </h3>
            <a
              href={player.highlightUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#FEBB21] hover:underline"
            >
              Watch highlights →
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--outline-variant)]/10 bg-[var(--surface-lowest)] mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-[#8e909a] uppercase tracking-wider">
            <div>
              Built by{' '}
              <a href="https://morgantown.ai" className="text-[#FE5F55] hover:underline font-bold">
                Morgantown AI
              </a>
            </div>
            <div>
              Not affiliated with WVU Athletics
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
