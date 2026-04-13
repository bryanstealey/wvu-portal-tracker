function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function LastUpdated({ timestamp }: { timestamp: string }) {
  const diffMs = new Date().getTime() - new Date(timestamp).getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const isStale = diffHours > 12;

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          isStale ? 'bg-amber-400' : 'bg-emerald-400'
        }`}
      />
      <span>
        Updated {formatTimestamp(timestamp)}
        {isStale && ' — data may be outdated'}
      </span>
    </div>
  );
}
