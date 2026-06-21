import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight } from 'lucide-react';
import { MENU } from '../../data/menu';
import type { MenuItem } from '../../data/menu';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: MenuItem) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectProduct }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = MENU.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q) ||
      (item.story && item.story.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 h-[85vh] bg-white rounded-t-[2rem] z-[101] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header & Search Bar */}
            <div className="p-6 pb-4 border-b border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="font-heading font-black text-2xl text-gray-900">Find your drink</h2>
                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                  <X size={20} />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for boba, matcha, croissants..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#FFB300]/50 transition-all"
                />
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {query.trim() !== '' && results.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <span className="text-4xl mb-3">🥺</span>
                  <p className="text-gray-500 font-medium">No items found for "{query}"</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Results</p>
                  {results.map((item) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={item.id}
                      onClick={() => {
                        onSelectProduct(item);
                        onClose();
                      }}
                      className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-95 transition-all cursor-pointer hover:border-[#FFB300]/30"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-extrabold text-[15px] leading-tight text-gray-900 mb-0.5">{item.name}</h4>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          {item.category.replace('cat_', '')}
                        </span>
                        <span className="font-black text-[#FF8F00]">₹{item.price}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <ChevronRight size={18} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {query.trim() === '' && (
                <div className="flex flex-col gap-3 mt-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Classic Boba', 'Matcha', 'Croissant', 'Coffee'].map(term => (
                      <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 active:scale-95 transition-transform"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
