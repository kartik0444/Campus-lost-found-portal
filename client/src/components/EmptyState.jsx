import React from 'react';
import { SearchX, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title = "No Items Found",
  description = "We couldn't find any lost or found items matching your search criteria.",
  showAction = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-blue-50/50">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-md leading-relaxed">
        {description}
      </p>
      {showAction && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/post-lost"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            Report Lost Item
          </Link>
          <Link
            to="/post-found"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            Report Found Item
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
