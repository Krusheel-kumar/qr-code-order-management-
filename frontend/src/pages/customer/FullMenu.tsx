import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Share2 } from 'lucide-react';

import type { MenuItem } from '../../data/menu';
import { useCartStore } from '../../store/useCartStore';
import { useMenuStore } from '../../store/useMenuStore';
import { shareContent } from '../../utils/shareUtils';
import CustomizerSheet from '../../components/CustomizerSheet';
import ShareModal from '../../components/ui/ShareModal';
import { getBlacklistedProducts } from '../../api';

export default function FullMenu() {
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [blacklistedProductIds, setBlacklistedProductIds] = useState<string[]>([]);
  
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [shareModal, setShareModal] = useState<{isOpen: boolean, title: string, url: string}>({isOpen: false, title: '', url: ''});
  
  const cartStore = useCartStore();
  const { menuItems: MENU } = useMenuStore();

  useEffect(() => {
    if (cartStore.storeId) {
      getBlacklistedProducts(cartStore.storeId)
        .then(setBlacklistedProductIds)
        .catch(console.error);
    } else {
      setBlacklistedProductIds([]);
    }
  }, [cartStore.storeId]);

  const DYNAMIC_CATEGORIES = useMemo(() => {
    const cats = new Set(MENU.map(item => item.category).filter(Boolean));
    const result: string[] = [];
    for (const c of Array.from(cats)) {
      result.push(c as string);
    }
    return result;
  }, [MENU]);

  const [mainCategory, setMainCategory] = useState(() => {
    return location.state?.mainCategory || DYNAMIC_CATEGORIES[0] || 'Milk Teas';
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Group menu by display categories
  const groupedMenu = useMemo(() => {
    const groups: { [key: string]: MenuItem[] } = {};
    MENU.forEach(item => {
      // Only include items from the selected main category
      if (item.category !== mainCategory && mainCategory !== 'All') return;

      // Use subcategory if exists, else category
      const cat = item.subcategory || item.category;
      if (!groups[cat]) groups[cat] = [];
      
      // Filter by search
      if (searchQuery) {
        if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          groups[cat].push(item);
        }
      } else {
        groups[cat].push(item);
      }
    });
    
    // Remove empty categories
    Object.keys(groups).forEach(k => {
      if (groups[k].length === 0) delete groups[k];
    });
    
    return groups;
  }, [searchQuery, mainCategory, MENU]);

  const categories = Object.keys(groupedMenu);

  // Set initial active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Handle openProductId from location state or URL params
  useEffect(() => {
    let openProductId = location.state?.openProductId;
    
    // Check URL params for deep link
    if (!openProductId) {
      const params = new URLSearchParams(window.location.search);
      openProductId = params.get('p');
    }

    if (openProductId) {
      const productToOpen = MENU.find(p => p.id === openProductId);
      if (productToOpen) {
        // Wait a small delay to ensure UI is ready
        setTimeout(() => {
          setSelectedProduct(productToOpen);
        }, 100);
      }
    }
  }, [location.state, location.search]);

  // ScrollSpy logic
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      
      let currentCat = categories[0];
      for (const cat of categories) {
        const el = categoryRefs.current[cat];
        if (el && el.offsetTop - 150 <= scrollY) {
          currentCat = cat;
        }
      }
      
      if (currentCat !== activeCategory) {
        setActiveCategory(currentCat);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, activeCategory]);

  const scrollToCategory = (cat: string) => {
    const el = categoryRefs.current[cat];
    if (el) {
      const top = el.offsetTop - 140; // Offset for sticky headers
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const openCustomizer = (product: MenuItem) => {
    if (product.category === 'Bake House' || product.category === 'Quick Bites') {
      // Add directly to cart without customization
      cartStore.addItem({
        product: product,
        customization: 'Standard',
        price: product.price,
        quantity: 1
      });
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      setSelectedProduct(product);
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  const closeCustomizer = () => {
    setSelectedProduct(null);
  };

  const handleShare = (e: React.MouseEvent, product: MenuItem) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/menu?p=${product.id}`;
    shareContent(
      {
        title: `Hey! You have to try ${product.name} at POP O'BOB®! 🧋`,
        text: product.story ? `"${product.story}"` : `It's absolutely delicious and I thought you'd love it.`,
        url: shareUrl,
        imageUrl: product.image,
      },
      () => {
        // Fallback
        setShareModal({
          isOpen: true,
          title: `Check out ${product.name} at POP O'BOB®!`,
          url: shareUrl
        });
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] pb-32 animate-in fade-in duration-500 font-sans max-w-[1440px] mx-auto" ref={containerRef}>
      
      {/* ========================================================================= */}
      {/* MOBILE MENU VIEW */}
      {/* ========================================================================= */}
      <div className="lg:hidden">
        {/* Search Header */}
        <div className="sticky top-0 z-30 bg-[#FDFCF9]/95 backdrop-blur-xl px-4 pt-4 pb-2 border-b border-gray-100">
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] shadow-sm transition-all"
              placeholder="Search our menu..."
            />
          </div>

          {/* Main Category Switcher */}
          <div className="flex bg-white border border-gray-100 p-1 rounded-2xl mb-4 overflow-x-auto hide-scrollbar shadow-sm">
            {DYNAMIC_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setMainCategory(cat);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-black rounded-xl transition-all text-center whitespace-nowrap ${
                  mainCategory === cat
                    ? 'bg-[#1A0B05] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#1A0B05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scrollable Category Pills */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 snap-x">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`snap-center shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                  activeCategory === cat 
                    ? 'bg-[#1A0B05] text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D4AF37]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Sections */}
        <div className="px-4 mt-6 space-y-8">
          {categories.map(cat => (
            <div 
              key={cat} 
              ref={el => { if(el) categoryRefs.current[cat] = el; }}
              className="scroll-mt-36"
            >
              <h2 className="text-xl font-black text-[#1A0B05] mb-3 sticky top-[120px] z-20 bg-[#FDFCF9]/95 backdrop-blur-md py-2 -mx-4 px-4 border-y border-gray-100">
                {cat}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {groupedMenu[cat].map(product => {
                  const isBlacklisted = blacklistedProductIds.includes(product.id);
                  return (
                    <div 
                      key={product.id}
                      onClick={() => !isBlacklisted && openCustomizer(product)}
                      className={`bg-white p-3 rounded-[1.5rem] flex flex-col gap-3 border border-gray-100 shadow-sm transition-all cursor-pointer group hover:shadow-md hover:border-[#D4AF37]/30 ${isBlacklisted ? 'opacity-55 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                    >
                      <div className="w-full aspect-square rounded-[1rem] overflow-hidden bg-gray-50 relative shadow-inner">
                        {isBlacklisted ? (
                          <div className="absolute top-2 left-2 z-10 bg-[#1A0B05] text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                            Sold Out
                          </div>
                        ) : product.badge ? (
                          <div className="absolute top-2 left-2 z-10 bg-[#1A0B05] text-[#D4AF37] text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                            {product.badge}
                          </div>
                        ) : null}
                        <button 
                          onClick={(e) => handleShare(e, product)}
                          className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-md hover:bg-white text-[#1A0B05] p-1.5 rounded-full shadow-sm transition-all active:scale-95"
                        >
                          <Share2 size={14} />
                        </button>
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
                            <ShoppingBag size={32} className="mb-2 opacity-50" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col justify-between flex-1 px-1">
                        <h3 className="font-black text-[13px] text-[#1A0B05] leading-tight mb-1 line-clamp-2">{product.name}</h3>
                        
                        <div className="flex justify-between items-center mt-auto pt-2">
                          <span className="font-black text-[14px] text-[#D4AF37]">₹{product.price.toFixed(0)}</span>
                          <button className="bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] w-7 h-7 rounded-full flex items-center justify-center font-black text-lg transition-colors shadow-sm">
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="py-20 text-center">
              <h3 className="font-black text-[#1A0B05] text-lg mb-1">No items found</h3>
              <p className="text-gray-500 text-sm font-medium">Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP MENU VIEW (hidden lg:block) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block max-w-[1440px] mx-auto px-8 xl:px-12 pt-10 pb-24">
        
        {/* Editorial Menu Header + Search Row */}
        <div className="flex items-end justify-between mb-10 pb-8 border-b border-gray-200">
          <div>
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
              POP O'BOB® MENU
            </span>
            <h1 className="text-5xl font-black text-[#1A0B05] tracking-tight">
              Our Menu
            </h1>
          </div>

          <div className="w-96 relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full py-3.5 pl-12 pr-6 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] shadow-sm transition-all"
              placeholder="Search drinks, toppings, treats..."
            />
          </div>
        </div>

        {/* Main Category Pills */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto hide-scrollbar">
          {DYNAMIC_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setMainCategory(cat);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-7 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                mainCategory === cat
                  ? 'bg-[#1A0B05] text-[#D4AF37] shadow-lg scale-105'
                  : 'bg-white hover:bg-[#FFFBF2] text-gray-700 hover:text-[#1A0B05] border border-gray-200 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Subcategory Chips */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 mb-12 pb-6 border-b border-gray-200 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#1A0B05] text-white font-black shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D4AF37]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Desktop Luxury Menu Sections */}
        <div className="space-y-16">
          {categories.map(cat => (
            <div 
              key={cat} 
              ref={el => { if(el) categoryRefs.current[cat] = el; }}
              className="scroll-mt-36"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-[#1A0B05] tracking-tight">
                  {cat}
                </h2>
                <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                  {groupedMenu[cat].length} {groupedMenu[cat].length === 1 ? 'creation' : 'creations'}
                </span>
              </div>
              
              <div className="grid grid-cols-4 xl:grid-cols-5 gap-8">
                {groupedMenu[cat].map(product => {
                  const isBlacklisted = blacklistedProductIds.includes(product.id);
                  return (
                    <div 
                      key={product.id}
                      onClick={() => !isBlacklisted && openCustomizer(product)}
                      className={`bg-white p-5 rounded-[2.2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer ${
                        isBlacklisted ? 'opacity-55 cursor-not-allowed' : 'hover:-translate-y-1'
                      }`}
                    >
                      <div>
                        <div className="w-full aspect-[4/3] rounded-[1.6rem] overflow-hidden bg-gray-50 relative mb-5 shadow-inner">
                          {isBlacklisted ? (
                            <div className="absolute top-4 left-4 z-10 bg-[#1A0B05] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                              Sold Out
                            </div>
                          ) : product.badge ? (
                            <div className="absolute top-4 left-4 z-10 bg-[#1A0B05] text-[#D4AF37] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                              {product.badge}
                            </div>
                          ) : null}
                          <button 
                            onClick={(e) => handleShare(e, product)}
                            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md hover:bg-white text-[#1A0B05] p-2.5 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
                            title="Share"
                          >
                            <Share2 size={14} />
                          </button>
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
                              <ShoppingBag size={40} className="mb-2 opacity-50" />
                            </div>
                          )}
                        </div>

                        {product.category && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">
                            {product.category}
                          </span>
                        )}
                        <h3 className="text-lg font-black text-[#1A0B05] tracking-tight mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                          {product.story || ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-2xl font-black text-[#1A0B05]">
                          ₹{product.price.toFixed(0)}
                        </span>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isBlacklisted) openCustomizer(product);
                          }}
                          className="bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <span>+ Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="py-28 text-center">
              <h3 className="font-black text-[#1A0B05] text-2xl mb-2">No menu items found</h3>
              <p className="text-gray-500 font-medium text-sm">Try adjusting your search query or selecting another category.</p>
            </div>
          )}
        </div>
      </div>

      <CustomizerSheet 
        product={selectedProduct} 
        isOpen={selectedProduct !== null} 
        onClose={closeCustomizer} 
      />

      {/* Share Modal Fallback */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal(prev => ({ ...prev, isOpen: false }))}
        title={shareModal.title}
        url={shareModal.url}
      />
    </div>
  );
}
