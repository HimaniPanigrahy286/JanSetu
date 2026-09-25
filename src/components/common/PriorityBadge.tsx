import type { PriorityLevel } from '../../types';

interface PriorityBadgeProps {
  priority: PriorityLevel | string;
  size?: 'sm' | 'md' | 'lg';
}

const PRIORITY_CONFIG: Record<string, { label: string; bg: string; border: string; text: string; icon: string }> = {
  critical: {
    label: 'CRITICAL',
    bg: 'bg-red-500',
    border: 'border-black',
    text: 'text-white',
    icon: '🚨',
  },
  high: {
    label: 'HIGH',
    bg: 'bg-[#ff5f57]',
    border: 'border-black',
    text: 'text-white',
    icon: '⚡',
  },
  medium: {
    label: 'MEDIUM',
    bg: 'bg-brand-yellow',
    border: 'border-black',
    text: 'text-black',
    icon: '🟡',
  },
  low: {
    label: 'LOW',
    bg: 'bg-brand-sage',
    border: 'border-black',
    text: 'text-black',
    icon: '🟢',
  },
};

export default function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const key = priority?.toLowerCase() || 'medium';
  const conf = PRIORITY_CONFIG[key] || PRIORITY_CONFIG['medium'];

  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-xs' : size === 'md' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      className={`inline-flex items-center gap-1 ${conf.bg} ${conf.text} border-2 ${conf.border} ${sizeClass} rounded-lg font-extrabold uppercase tracking-wider shadow-brutal-sm`}
    >
      <span>{conf.icon}</span>
      {conf.label}
    </span>
  );
}
