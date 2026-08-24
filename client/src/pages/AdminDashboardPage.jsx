import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { ShieldAlert, Users, Layers, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'users'
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const fetchAdminData = async () => {
    try {
      const [usersRes, itemsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/items')
      ]);
      setUsers(usersRes.data.users || []);
      setItems(itemsRes.data.items || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setToast({ message: 'Failed to load administration data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeletePost = async (itemId) => {
    if (!window.confirm(`Are you sure you want to delete item post #${itemId}?`)) return;

    try {
      await api.delete(`/admin/items/${itemId}`);
      setToast({ message: `Post #${itemId} removed by Admin.`, type: 'success' });
      fetchAdminData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to remove post.', type: 'error' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Admin Panel..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <ShieldAlert className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-200">System Control Panel</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Campus Admin Control Center</h1>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-xs text-amber-100 font-semibold">{users.length} Total Users</p>
          <p className="text-xs text-amber-100 font-semibold">{items.length} Total Reports</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'posts'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          All Item Posts ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Registered Users ({users.length})
        </button>
      </div>

      {/* Tab 1: All Item Posts Table */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                  <th className="p-4">ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Posted By</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-400">#{item.id}</td>
                    <td className="p-4 font-bold text-slate-800">{item.title}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        item.type === 'Lost' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{item.category}</td>
                    <td className="p-4 text-slate-600 max-w-[150px] truncate">{item.location}</td>
                    <td className="p-4 text-slate-600">
                      <div className="font-semibold text-slate-800">{item.posterName}</div>
                      <div className="text-xs text-slate-400">{item.posterEmail}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/items/${item.id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                          title="View Detail"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Inappropriate Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: All Registered Users Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                  <th className="p-4">User ID</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-400">#{u.id}</td>
                    <td className="p-4 font-bold text-slate-800">{u.name}</td>
                    <td className="p-4 text-slate-600 font-mono text-xs">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
