import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { BACKEND_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { MapPin, Calendar, Phone, User, Tag, Edit3, Trash2, ArrowLeft, ShieldCheck, Mail, Package, Sparkles } from 'lucide-react';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data.item);
      } catch (err) {
        console.error('Error fetching item details:', err);
        setToast({ message: 'Item post not found or removed.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item report?')) return;

    try {
      await api.delete(`/items/${id}`);
      setToast({ message: 'Item post deleted successfully.', type: 'success' });
      setTimeout(() => {
        navigate('/browse');
      }, 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete post.', type: 'error' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading item details..." />;
  if (!item) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Item Not Found</h2>
        <p className="text-slate-500 text-sm">The report you are looking for does not exist or was deleted.</p>
        <Link to="/browse" className="inline-block px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl text-sm">
          Return to Browse
        </Link>
      </div>
    );
  }

  const isOwner = user && (user.id === item.userId || user.role === 'admin');
  const isLost = item.type === 'Lost';
  const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${BACKEND_URL}${item.image}`) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Large Image Showcase */}
        <div className="relative bg-slate-900 min-h-[320px] md:min-h-[460px] flex items-center justify-center p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-full object-contain max-h-[440px] rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
              <Package className="w-16 h-16 stroke-[1.5]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">No Image Uploaded</span>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-lg ${
              isLost ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {item.type} Item
            </span>
          </div>

          {/* Category Tag */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-slate-900 rounded-xl backdrop-blur-md flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {item.category}
            </span>
          </div>
        </div>

        {/* Details & Metadata Section */}
        <div className="p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Post #{item.id} • Reported on {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-tight">
                {item.title}
              </h1>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-slate-500">Location:</span>
                <span className="font-bold text-slate-900">{item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span className="font-semibold text-slate-500">{isLost ? 'Date Lost:' : 'Date Found:'}</span>
                <span className="font-bold text-slate-900">{item.date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="font-semibold text-slate-500">Reported By:</span>
                <span className="font-bold text-slate-900">{item.posterName || 'Campus Student'}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Item Description</h4>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                {item.description}
              </p>
            </div>

          </div>

          {/* Contact & Owner Controls */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            
            {showContact ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fade-in">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full mb-1">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">Student Contact Phone</h4>
                <p className="text-xl font-extrabold text-emerald-800 select-all">{item.contact}</p>
                <a
                  href={`tel:${item.contact}`}
                  className="inline-block text-xs font-bold text-emerald-700 underline hover:text-emerald-900"
                >
                  Click to Call / SMS
                </a>
              </div>
            ) : (
              <button
                onClick={() => setShowContact(true)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Phone className="w-4 h-4" />
                Reveal Contact Information
              </button>
            )}

            {isOwner && (
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleDelete}
                  className="w-full py-2.5 px-4 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ItemDetailPage;
