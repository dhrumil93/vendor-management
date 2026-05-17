import type { DataCardProps } from './DataCard.types';

const colorMap = {
  blue: {
    bg: 'bg-[rgba(7,141,238,0.08)] border-[rgba(7,141,238,0.2)]',
    icon: 'bg-[rgba(7,141,238,0.15)] text-[#68CDF9]',
    text: 'text-[#68CDF9]',
  },
  green: {
    bg: 'bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)]',
    icon: 'bg-[rgba(34,197,94,0.15)] text-green-400',
    text: 'text-green-400',
  },
  yellow: {
    bg: 'bg-[rgba(245,158,11,0.08)] border-[rgba(245,158,11,0.2)]',
    icon: 'bg-[rgba(245,158,11,0.15)] text-amber-400',
    text: 'text-amber-400',
  },
  purple: {
    bg: 'bg-[rgba(124,58,237,0.08)] border-[rgba(124,58,237,0.2)]',
    icon: 'bg-[rgba(124,58,237,0.15)] text-purple-400',
    text: 'text-purple-400',
  },
};

export const DataCard = ({ title, value, subtitle, icon, color = 'blue' }: DataCardProps) => {
  const c = colorMap[color];

  return (
    <div className={`rounded-xl p-5 border ${c.bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${c.text}`}>{value}</p>
          {subtitle && <p className="text-xs text-text-faint mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${c.icon}`}>{icon}</div>
      </div>
    </div>
  );
};
