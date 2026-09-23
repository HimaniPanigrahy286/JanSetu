import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode | string;
  variant?: 'yellow' | 'white' | 'dark' | 'sage';
  badge?: string;
  onClick?: () => void;
}

export default function StatCard({
  label,
  value,
  subtext,
  trend,
  icon,
  variant = 'white',
  badge,
  onClick,
}: StatCardProps) {
  const variantStyles = {
    yellow: 'bg-brand-yellow text-black border-black shadow-brutal',
    white: 'bg-white text-black border-black shadow-brutal',
    dark: 'bg-brand-charcoal text-white border-black shadow-brutal',
    sage: 'bg-brand-sage text-black border-black shadow-brutal',
  };

  const isDark = variant === 'dark';

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${variantStyles[variant]} ${
        onClick ? 'cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        {icon && (
          <div
            className={`w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center text-xl shrink-0 shadow-brutal-sm ${
              isDark ? 'bg-brand-yellow text-black' : variant === 'yellow' ? 'bg-white text-black' : 'bg-brand-yellow text-black'
            }`}
          >
            {icon}
          </div>
        )}
        {badge && (
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-black ${
              isDark ? 'bg-white/20 text-brand-yellow' : 'bg-black text-white'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div>
        <p className={`font-heading font-extrabold text-3xl md:text-4xl tracking-tight leading-none ${isDark ? 'text-white' : 'text-black'}`}>
          {value}
        </p>
        <p className={`font-bold text-xs uppercase tracking-wider mt-2 ${isDark ? 'text-brand-sage' : 'text-black/75'}`}>
          {label}
        </p>
      </div>

      {(subtext || trend) && (
        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t-2 border-black/10 text-xs">
          {subtext && <span className={isDark ? 'text-white/60' : 'text-black/60'}>{subtext}</span>}
          {trend && (
            <span
              className={`font-extrabold px-1.5 py-0.5 rounded text-[11px] ${
                trend.isPositive
                  ? isDark
                    ? 'text-emerald-400 bg-emerald-950/60'
                    : 'text-emerald-700 bg-emerald-100 border border-emerald-500'
                  : isDark
                    ? 'text-red-400 bg-red-950/60'
                    : 'text-red-700 bg-red-100 border border-red-500'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
