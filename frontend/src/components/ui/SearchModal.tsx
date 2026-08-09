import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, Coffee } from 'lucide-react';
import { useMenuStore } from '../../store/useMenuStore';
import type { MenuItem } from '../../data/menu';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: MenuItem) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectProduct }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MenuItem[]>([]);
  const { menuItems: MENU } = useMenuStore();

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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-2xl h-[85vh] md:h-[600px] bg-[#FDFCF9] md:rounded-[2rem] rounded-t-[2rem] z-[101] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header & Search Bar (Clean Brand Theme) */}
            <div className="p-6 pb-6 bg-white border-b border-gray-100 flex flex-col gap-5 relative">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#FF9800] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Explore Menu</p>
                  <h2 className="font-heading font-black text-2xl text-gray-900">Find your drink</h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors active:scale-95 border border-gray-100 shadow-sm"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} strokeWidth={2.5} />
                <input
                  autoFocus
                  type="text"
                  placeholder="What are you craving today?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-[#FFC461] focus:border-[#FFC461] shadow-sm transition-all placeholder:text-gray-400 placeholder:font-semibold"
                />
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-gray-200/50 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#FDFCF9]">
              {query.trim() !== '' && results.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1A0B05]/5 flex items-center justify-center mb-4 text-[#D4AF37]">
                    <Coffee size={32} />
                  </div>
                  <h4 className="text-[#1A0B05] font-black text-lg mb-1">No items found</h4>
                  <p className="text-gray-500 font-medium text-sm">We couldn't find anything matching "{query}".</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Search Results</p>
                  {results.map((item) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={item.id}
                      onClick={() => {
                        onSelectProduct(item);
                        onClose();
                      }}
                      className="group flex items-stretch gap-3.5 p-2 bg-white border border-gray-100 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-[#FFC461]/60 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <div className="w-[72px] h-[72px] rounded-[16px] overflow-hidden bg-gray-50 shrink-0 border border-gray-100 relative shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center py-1">
                        <h4 className="font-black text-[15px] leading-snug text-gray-900 mb-1 line-clamp-2 pr-2">{item.name}</h4>
                        <div className="flex items-center mb-1.5">
                          <span className="bg-gray-50 border border-gray-200 text-gray-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                            {item.category.replace('cat_', '')}
                          </span>
                        </div>
                        <span className="font-black text-[14px] text-[#FF9800]">₹{item.price}</span>
                      </div>
                      <div className="flex items-center justify-center px-1">
                        <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#FFC461] border border-gray-100 group-hover:border-[#FFC461] flex items-center justify-center text-gray-400 group-hover:text-black transition-all shadow-sm group-hover:-translate-x-0.5 group-hover:shadow-md">
                          <ChevronRight size={16} strokeWidth={3} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {query.trim() === '' && (
                <div className="flex flex-col gap-4 mt-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Popular Searches</p>
                  <div className="flex flex-wrap gap-2.5">
                    {['Classic Boba', 'Matcha', 'Croissant', 'Coffee'].map(term => (
                      <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:border-[#FFC461] hover:bg-[#FFFDF8] hover:text-[#FF9800] active:scale-95 transition-all shadow-sm"
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
