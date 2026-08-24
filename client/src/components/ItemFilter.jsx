import React from 'react';
import { Search, Filter, Layers } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Books',
  'ID Cards',
  'Keys',
  'Clothing',
  'Accessories',
  'Other'
];

const ItemFilter = ({ search, setSearch, category, setCategory, type, setType, totalResults = 0 }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 mb-8">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by item name, keywords, location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
          </div>
        </div>

      </div>

      {/* Type Toggle Tabs & Results count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {['All', 'Lost', 'Found'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                type === t
                  ? t === 'Lost'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : t === 'Found'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'All' ? 'All Items' : `${t} Items`}
            </button>
          ))}
        </div>

        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          Showing <span className="text-slate-800 font-bold">{totalResults}</span> item(s)
        </div>
      </div>
    </div>
  );
};

export default ItemFilter;
