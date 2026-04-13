import type { PlayerStatus } from '@/lib/types';

const statusConfig: Record<PlayerStatus, { label: string; className: string }> = {
  target: {
    label: 'Target',
    className: 'bg-[#333535] text-[#C4C6D0] border-[#43474f]',
  },
  visiting: {
    label: 'Visiting',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  committed: {
    label: 'Committed',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  signed: {
    label: 'Signed',
    className: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40',
  },
  gone: {
    label: 'Gone',
    className: 'bg-[#282a2b] text-[#8e909a] border-[#43474f]',
  },
};

export function StatusBadge({ status }: { status: PlayerStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
