import type { NewsItem } from '@/lib/types';

const categoryLabels: Record<NewsItem['category'], string> = {
  commitment: 'Commitment',
  visit: 'Visit',
  rumor: 'Rumor',
  departure: 'Departure',
  general: 'News',
};

const categoryColors: Record<NewsItem['category'], string> = {
  commitment: 'bg-emerald-100 text-emerald-800',
  visit: 'bg-blue-100 text-blue-800',
  rumor: 'bg-amber-100 text-amber-800',
  departure: 'bg-red-100 text-red-800',
  general: 'bg-slate-100 text-slate-700',
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
  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${categoryColors[item.category]}`}
            >
              {categoryLabels[item.category]}
            </span>
            <span className="text-xs text-slate-400">{timeAgo(item.publishedAt)}</span>
          </div>
          <p className="text-sm font-medium text-slate-800 leading-snug">{item.summary}</p>
          <p className="text-xs text-slate-400 mt-1.5">
            {item.sourceName}
          </p>
        </div>
      </div>
    </a>
  );
}

export function NewsFeed({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
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
