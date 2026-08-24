import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Heart, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Campus Find</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Official university portal connecting students to reunite lost belongings quickly, securely, and smartly.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/browse?type=Lost" className="hover:text-rose-400 transition-colors">Browse Lost Items</Link>
              </li>
              <li>
                <Link to="/browse?type=Found" className="hover:text-emerald-400 transition-colors">Browse Found Items</Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-blue-400 transition-colors">Search All Belongings</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Actions */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Post & Report</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/post-lost" className="hover:text-rose-400 transition-colors">Report a Lost Item</Link>
              </li>
              <li>
                <Link to="/post-found" className="hover:text-emerald-400 transition-colors">Report a Found Item</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Manage My Posts</Link>
              </li>
              <li>
                <Link to="/admin-login" className="hover:text-amber-400 transition-colors">Campus Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Campus Security</h4>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Verified Student Claims
              </div>
              <p className="text-slate-400">
                High-value items (laptops, phones, wallets) can also be turned into Main Campus Security Desk.
              </p>
              <div className="flex items-center gap-1.5 text-slate-300 pt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>support@campusfind.edu</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Campus Find - Student Lost & Found Portal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for University Students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
