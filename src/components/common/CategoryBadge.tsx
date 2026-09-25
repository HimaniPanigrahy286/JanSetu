import type { Category } from '../../types';

interface CategoryBadgeProps {
  category: Category | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  Roads: '🛣️',
  Water: '💧',
  Streetlights: '💡',
  Drainage: '🌊',
  'Public Transport': '🚌',
  'Schools & Hospitals': '🏥',
  Electricity: '⚡',
  Sanitation: '🗑️',
  'Digital Infrastructure': '📡',
  'Other Development': '🏛️',
  'Public Facilities': '🏛️',
  Healthcare: '🏥',
  Education: '🏫',
  Transport: '🚌',
};

export default function CategoryBadge({ category, size = 'sm', showIcon = true }: CategoryBadgeProps) {
  const icon = CATEGORY_ICONS[category] || '📌';
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-xs font-extrabold' : size === 'md' ? 'px-2.5 py-1 text-[11px] font-extrabold' : 'px-2 py-0.5 text-[10px] font-bold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-white text-black border-2 border-black ${sizeClass} rounded-lg uppercase tracking-wider shadow-brutal-sm`}
    >
      {showIcon && <span>{icon}</span>}
      <span>{category}</span>
    </span>
  );
}
