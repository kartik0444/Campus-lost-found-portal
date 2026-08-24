import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Search, Sparkles, ShieldCheck, Zap, HeartHandshake, PlusCircle, ArrowRight, Package, PackageCheck } from 'lucide-react';

const HomePage = ({ onOpenAIModal }) => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const res = await api.get('/items');
        setRecentItems(res.data.items.slice(0, 6)); // Top 6 recent items
      } catch (err) {
        console.error('Error fetching recent items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentItems();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/browse?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            University Campus Belongings Recovery Portal
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Lost Something on Campus? <br />
            <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
              We Help You Find It Fast.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Report lost items or return found belongings to fellow students. Powered by real-time updates and Gemini AI smart matching.
          </p>

          {/* Hero Search Form */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl">
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search lost laptop, student ID, keys, water bottle..."
                className="w-full px-3 py-2 text-slate-800 text-sm focus:outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0 shadow-md shadow-blue-600/30"
              >
                Search
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/post-lost"
              className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              Report Lost Item
            </Link>
            <Link
              to="/post-found"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              Report Found Item
            </Link>
            {onOpenAIModal && (
              <button
                onClick={onOpenAIModal}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Try AI Matcher
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Features Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Instant Reporting</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Post lost or found belongings in seconds with photos, locations, and direct contact options.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Gemini AI Matcher</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Smart generative AI cross-references reported items to match lost belongings automatically.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Verified Student Network</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Secure authentication guarantees authentic student posts and safe campus handovers.
            </p>
          </div>

        </div>
      </section>

      {/* Recent Lost & Found Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Recent Campus Reports</h2>
            <p className="text-slate-500 text-sm">Latest reported lost and found belongings</p>
          </div>
          <Link
            to="/browse"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            View All Items
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching latest campus reports..." />
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState title="No Recent Posts" description="Be the first student to report a lost or found item on campus!" />
        )}
      </section>

    </div>
  );
};

export default HomePage;
