import type { NewsItem } from '@/lib/types';

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

const dotColors: Record<string, string> = {
  commitment: 'bg-emerald-400',
  visit: 'bg-blue-400',
  rumor: 'bg-amber-400',
  departure: 'bg-red-400',
  general: 'bg-[#8e909a]',
};

export function WhatsNew({ news }: { news: NewsItem[] }) {
  // Show the 3 most recent items from the last 48 hours
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 48);

  const recent = news
    .filter(n => new Date(n.publishedAt) > cutoff)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <div className="bg-[var(--surface-container)]/50 rounded-lg border border-[var(--outline-variant)]/15 px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#FEBB21]">
          What&apos;s New
        </span>
      </div>
      <div className="space-y-1.5">
        {recent.map((item) => (
          <div key={item.id} className="flex items-center gap-2 text-xs">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[item.category]}`} />
            <span className="text-[#E2E2E2] truncate">{item.title}</span>
            <span className="text-[#8e909a] font-mono text-[10px] flex-shrink-0">{timeAgo(item.publishedAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
