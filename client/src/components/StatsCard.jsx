import React from 'react';
import { Package, PackageCheck, Layers, UserCheck } from 'lucide-react';

const StatsCard = ({ stats }) => {
  const cards = [
    {
      title: 'Total Lost Items',
      value: stats?.totalLost ?? 0,
      sub: stats?.userLost !== undefined ? `${stats.userLost} reported by you` : 'Campus-wide lost items',
      icon: <Package className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50 border-rose-100',
      text: 'text-rose-600'
    },
    {
      title: 'Total Found Items',
      value: stats?.totalFound ?? 0,
      sub: stats?.userFound !== undefined ? `${stats.userFound} turned in by you` : 'Safely recovered items',
      icon: <PackageCheck className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
      text: 'text-emerald-600'
    },
    {
      title: 'Total Active Reports',
      value: stats?.totalItems ?? 0,
      sub: 'All active database posts',
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      text: 'text-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-6 rounded-2xl border ${card.bg} shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02]`}
        >
          <div className={`p-3 rounded-xl bg-white shadow-sm flex-shrink-0`}>
            {card.icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
            <h3 className={`text-2xl font-extrabold mt-0.5 ${card.text}`}>{card.value}</h3>
            <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
