import type { PlayerStatus } from '@/lib/types';

const statusConfig: Record<PlayerStatus, { label: string; className: string }> = {
  target: {
    label: 'Target',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  visiting: {
    label: 'Visiting',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  committed: {
    label: 'Committed',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  signed: {
    label: 'Signed',
    className: 'bg-green-50 text-green-800 border-green-300',
  },
  gone: {
    label: 'Gone',
    className: 'bg-gray-50 text-gray-500 border-gray-200',
  },
};

export function StatusBadge({ status }: { status: PlayerStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
