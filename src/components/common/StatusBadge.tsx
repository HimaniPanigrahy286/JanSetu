import type { RequestStatus } from '../../types';

interface StatusBadgeProps {
  status: RequestStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; border: string; text: string; dot: string }> = {
  pending: {
    label: 'Submitted',
    bg: 'bg-brand-yellow',
    border: 'border-black',
    text: 'text-black',
    dot: 'bg-black',
  },
  under_review: {
    label: 'Under Review',
    bg: 'bg-brand-sage',
    border: 'border-black',
    text: 'text-black',
    dot: 'bg-black',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-black',
    border: 'border-black',
    text: 'text-brand-yellow',
    dot: 'bg-brand-yellow animate-ping',
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-100',
    border: 'border-emerald-600',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-100',
    border: 'border-red-600',
    text: 'text-red-800',
    dot: 'bg-red-600',
  },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const conf = STATUS_CONFIG[status.toLowerCase()] || {
    label: status.toUpperCase().replace('_', ' '),
    bg: 'bg-gray-100',
    border: 'border-black',
    text: 'text-black',
    dot: 'bg-black',
  };

  const sizeClass = size === 'lg' ? 'px-3.5 py-1.5 text-xs' : size === 'md' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${conf.bg} ${conf.text} border-2 ${conf.border} ${sizeClass} rounded-lg font-extrabold uppercase tracking-wider shadow-brutal-sm`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
      {conf.label}
    </span>
  );
}
