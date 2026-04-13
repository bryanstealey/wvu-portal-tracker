import type { NewsItem } from '@/lib/types';

const categoryConfig: Record<NewsItem['category'], { label: string; className: string }> = {
  commitment: { label: 'Commitment', className: 'bg-emerald-500/20 text-emerald-400' },
  visit: { label: 'Visit', className: 'bg-blue-500/20 text-blue-400' },
  rumor: { label: 'Rumor', className: 'bg-amber-500/20 text-amber-400' },
  departure: { label: 'Departure', className: 'bg-red-500/20 text-red-400' },
  general: { label: 'News', className: 'bg-[#333535] text-[#C4C6D0]' },
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
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function NewsCard({ item }: { item: NewsItem }) {
  const config = categoryConfig[item.category];
  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-[var(--surface-container-low)] rounded-lg border border-[var(--outline-variant)]/20 p-4 hover:border-[#FEBB21]/20 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${config.className}`}>
          {config.label}
        </span>
        <span className="text-[10px] text-[#8e909a] font-mono">{timeAgo(item.publishedAt)}</span>
      </div>
      <p className="text-sm text-[#E2E2E2] leading-relaxed">{item.summary}</p>
      <p className="text-[10px] text-[#8e909a] mt-2 font-mono uppercase tracking-wider">
        {item.sourceName}
      </p>
    </a>
  );
}

export function NewsFeed({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return (
      <div className="text-center py-8 text-[#8e909a] text-sm">
        No recent news. Check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {news.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
