import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, PlusCircle, User, LogOut, ShieldAlert, Sparkles, Menu, X, Home, Compass, Package, PackageCheck } from 'lucide-react';

const Navbar = ({ onOpenAIModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
                Campus Find
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-blue-600">
                Student Lost & Found
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/browse?type=Lost"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/browse' && location.search.includes('type=Lost')
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
              }`}
            >
              <Package className="w-4 h-4 text-rose-500" />
              Lost Items
            </Link>
            <Link
              to="/browse?type=Found"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/browse' && location.search.includes('type=Found')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'
              }`}
            >
              <PackageCheck className="w-4 h-4 text-emerald-500" />
              Found Items
            </Link>
            <Link
              to="/browse"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/browse') && !location.search ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Browse All
            </Link>

            {/* AI Assistant Callout Button */}
            {onOpenAIModal && (
              <button
                onClick={onOpenAIModal}
                className="px-3.5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm flex items-center gap-1.5 transition-all hover:shadow hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow text-amber-300" />
                Gemini AI Match
              </button>
            )}
          </nav>

          {/* User Auth Buttons / User Profile Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/post-lost"
                  className="px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Report Lost
                </Link>
                <Link
                  to="/post-found"
                  className="px-3 py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Report Found
                </Link>

                <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 transition-all ${
                    isActive('/dashboard') ? 'bg-blue-50 text-blue-700 font-semibold' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                    title="Admin Panel"
                  >
                    <ShieldAlert className="w-5 h-5" />
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {onOpenAIModal && (
              <button
                onClick={onOpenAIModal}
                className="p-2 rounded-lg bg-indigo-50 text-indigo-600"
                title="AI Match"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
          >
            Home
          </Link>
          <Link
            to="/browse?type=Lost"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-600 font-medium"
          >
            Lost Items
          </Link>
          <Link
            to="/browse?type=Found"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium"
          >
            Found Items
          </Link>
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
          >
            Browse All Items
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/post-lost"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-rose-600 text-white font-medium rounded-xl text-sm"
                >
                  Report Lost Item
                </Link>
                <Link
                  to="/post-found"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-emerald-600 text-white font-medium rounded-xl text-sm"
                >
                  Report Found Item
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-slate-100 text-slate-800 font-medium rounded-xl text-sm"
                >
                  My Dashboard ({user.name})
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-amber-500 text-white font-medium rounded-xl text-sm"
                  >
                    Admin Control Panel
                  </Link>
                )}
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full text-center py-2.5 border border-red-200 text-red-600 font-medium rounded-xl text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl text-sm"
                >
                  Student Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-blue-600 text-white font-medium rounded-xl text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
