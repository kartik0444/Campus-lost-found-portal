import React, { useState } from 'react';
import { Sparkles, X, Search, CheckCircle2, AlertTriangle, ArrowRight, Bot } from 'lucide-react';
import { matchItemsWithAI } from '../services/gemini';
import ItemCard from './ItemCard';

const AIAssistantModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Lost');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAIMatch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please type a short description of the item.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const data = await matchItemsWithAI(query, type);
      setResult(data);
    } catch (err) {
      setError('AI assistant failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Bot className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Gemini AI Smart Matcher
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-900">
                  AI Powered
                </span>
              </h2>
              <p className="text-xs text-indigo-100">
                Describe your lost item or found item in natural language. Gemini AI will scan campus posts for matches!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <form onSubmit={handleAIMatch} className="space-y-4">
            
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Report Type:</label>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setType('Lost')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    type === 'Lost' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  I Lost an Item
                </button>
                <button
                  type="button"
                  onClick={() => setType('Found')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    type === 'Found' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  I Found an Item
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Describe Item Details:
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Lost a blue 32oz Hydro Flask with stickers on the side near the library 2nd floor silent zone..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Gemini AI Analyzing Campus Posts...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Find Potential AI Matches
                </>
              )}
            </button>
          </form>

          {/* Results Section */}
          {result && (
            <div className="mt-6 border-t border-slate-100 pt-5 space-y-4">
              <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-extrabold uppercase text-indigo-900 tracking-wider">AI Assessment</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      result.confidence === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {result.confidence} Confidence
                    </span>
                  </div>
                  <p className="text-xs text-indigo-950 font-medium leading-relaxed">{result.summary}</p>
                </div>
              </div>

              {result.matchedItems && result.matchedItems.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Matched Campus Posts ({result.matchedItems.length}):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.matchedItems.map((item) => (
                      <div key={item.id} onClick={onClose}>
                        <ItemCard item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No direct matching posts found in database yet. Try posting your item to let others contact you!
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;
