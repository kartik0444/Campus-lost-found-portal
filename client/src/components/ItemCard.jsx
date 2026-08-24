import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Phone, Tag, Edit3, Trash2, Laptop, BookOpen, CreditCard, Key, Shirt, HelpCircle, Package } from 'lucide-react';
import { BACKEND_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ItemCard = ({ item, onDelete, onEdit }) => {
  const { user } = useAuth();
  const isOwner = user && (user.id === item.userId || user.role === 'admin');

  // Category Icon helper
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Electronics': return <Laptop className="w-4 h-4" />;
      case 'Books': return <BookOpen className="w-4 h-4" />;
      case 'ID Cards': return <CreditCard className="w-4 h-4" />;
      case 'Keys': return <Key className="w-4 h-4" />;
      case 'Clothing': return <Shirt className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const isLost = item.type === 'Lost';
  const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${BACKEND_URL}${item.image}`) : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Top Banner / Image section */}
      <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('fallback-bg');
            }}
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-slate-400 ${
            isLost ? 'bg-rose-50/50' : 'bg-emerald-50/50'
          }`}>
            <div className={`p-4 rounded-full ${isLost ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'}`}>
              {getCategoryIcon(item.category)}
            </div>
            <span className="mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">No Photo Provided</span>
          </div>
        )}

        {/* Type Pill (Lost vs Found) */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md backdrop-blur-sm ${
            isLost
              ? 'bg-rose-600 text-white shadow-rose-600/30'
              : 'bg-emerald-600 text-white shadow-emerald-600/30'
          }`}>
            {item.type}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 text-xs font-medium bg-slate-900/80 text-white rounded-lg backdrop-blur-sm flex items-center gap-1">
            {getCategoryIcon(item.category)}
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
            {item.title}
          </h3>

          <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>

          <div className="space-y-2 text-xs text-slate-500 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span className="truncate font-medium text-slate-700">{item.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{isLost ? 'Lost on' : 'Found on'}: <strong className="text-slate-700">{item.date}</strong></span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/items/${item.id}`}
            className="flex-1 py-2 px-3 text-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200"
          >
            View Details
          </Link>

          {isOwner && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Post"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ItemCard;
