import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { User, PlusCircle, Edit3, Trash2, X, Package, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Books', 'ID Cards', 'Keys', 'Clothing', 'Accessories', 'Other'];

const DashboardPage = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: 'Electronics',
    type: 'Lost',
    description: '',
    location: '',
    date: '',
    contact: ''
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [toast, setToast] = useState({ message: '', type: 'info' });

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data.stats);
      setUserItems(response.data.userItems || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setToast({ message: 'Failed to load user dashboard.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/items/${itemId}`);
      setToast({ message: 'Post deleted successfully.', type: 'success' });
      fetchDashboardData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete post.', type: 'error' });
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title,
      category: item.category,
      type: item.type,
      description: item.description,
      location: item.location,
      date: item.date,
      contact: item.contact
    });
    setEditImageFile(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.title || !editFormData.description || !editFormData.location || !editFormData.contact) {
      setToast({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    setSavingEdit(true);

    try {
      const data = new FormData();
      data.append('title', editFormData.title);
      data.append('category', editFormData.category);
      data.append('type', editFormData.type);
      data.append('description', editFormData.description);
      data.append('location', editFormData.location);
      data.append('date', editFormData.date);
      data.append('contact', editFormData.contact);
      if (editImageFile) {
        data.append('image', editImageFile);
      }

      await api.put(`/items/${editingItem.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setToast({ message: 'Post updated successfully!', type: 'success' });
      setEditingItem(null);
      fetchDashboardData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update post.', type: 'error' });
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      {/* User Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 text-white font-extrabold text-2xl flex items-center justify-center border-2 border-white/30 backdrop-blur-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-200">Student Dashboard</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome, {user?.name}!</h1>
            <p className="text-xs text-blue-100 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/post-lost"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Post Lost Item
          </a>
          <a
            href="/post-found"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Post Found Item
          </a>
        </div>
      </div>

      {/* Statistical Counters */}
      <StatsCard stats={stats} />

      {/* User Posts Header */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">My Submitted Posts</h2>
          <p className="text-slate-500 text-sm">Manage, edit, or remove your lost and found listings</p>
        </div>

        {userItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You Haven't Posted Any Items Yet"
            description="When you report a lost item or turn in a found object, your listings will appear here."
          />
        )}
      </div>

      {/* Edit Modal Popup */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <h3 className="font-bold text-lg">Edit Post #{editingItem.id}</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  >
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact</label>
                  <input
                    type="text"
                    value={editFormData.contact}
                    onChange={(e) => setEditFormData({ ...editFormData, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Replace Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                  className="text-xs text-slate-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {savingEdit ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
