import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import ItemFilter from '../components/ItemFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [type, setType] = useState(searchParams.get('type') || 'All');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params on load
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'All';
    const urlType = searchParams.get('type') || 'All';

    setSearch(urlSearch);
    setCategory(urlCategory);
    setType(urlType);
  }, [searchParams]);

  // Fetch filtered items from backend API
  useEffect(() => {
    const fetchFilteredItems = async () => {
      setLoading(true);
      try {
        const response = await api.get('/items', {
          params: {
            search: search || undefined,
            category: category !== 'All' ? category : undefined,
            type: type !== 'All' ? type : undefined
          }
        });
        setItems(response.data.items || []);
      } catch (err) {
        console.error('Error fetching items on browse page:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFilteredItems();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [search, category, type]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Browse Campus Belongings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Search and filter all lost and found item reports submitted by students across campus.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <ItemFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        type={type}
        setType={setType}
        totalResults={items.length}
      />

      {/* Items Grid */}
      {loading ? (
        <LoadingSpinner message="Searching campus database..." />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Matching Items Found"
          description="Try adjusting your search terms or category filters to locate your item."
        />
      )}
    </div>
  );
};

export default BrowsePage;
