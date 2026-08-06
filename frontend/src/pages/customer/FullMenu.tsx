import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Share2, Menu as MenuIcon, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isMenuMapOpen, setIsMenuMapOpen] = useState(false);
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

  const mobileCategoryRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const desktopCategoryRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Group menu by Main Category -> Subcategory
  const groupedMenu = useMemo(() => {
    const groups: { [mainCat: string]: { [subCat: string]: MenuItem[] } } = {};
    
    MENU.forEach(item => {
      const mainCat = item.category || 'Other';
      const subCat = item.subcategory || mainCat;
      
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }
      
      if (!groups[mainCat]) groups[mainCat] = {};
      if (!groups[mainCat][subCat]) groups[mainCat][subCat] = [];
      
      groups[mainCat][subCat].push(item);
    });
    
    // Cleanup empty categories
    Object.keys(groups).forEach(mainCat => {
      if (Object.keys(groups[mainCat]).length === 0) {
        delete groups[mainCat];
      }
    });
    
    return groups;
  }, [searchQuery, MENU]);

  const mainCategories = Object.keys(groupedMenu);

  // Handle openProductId from location state or URL params
  useEffect(() => {
    let openProductId = location.state?.openProductId;
    
    if (!openProductId) {
      const params = new URLSearchParams(window.location.search);
      openProductId = params.get('p');
    }

    if (openProductId) {
      const productToOpen = MENU.find(p => p.id === openProductId);
      if (productToOpen) {
        setTimeout(() => {
          setSelectedProduct(productToOpen);
        }, 100);
      }
    }
  }, [location.state, location.search]);

  const scrollToCategory = (mainCat: string, subCat: string) => {
    setIsMenuMapOpen(false); // Close the map if open
    
    setTimeout(() => {
      const key = `${mainCat}-${subCat}`;
      const el = window.innerWidth >= 1024 ? desktopCategoryRefs.current[key] : mobileCategoryRefs.current[key];
      if (el) {
        const offset = window.innerWidth >= 1024 ? 140 : 110;
        const y = el.getBoundingClientRect().top + window.scrollY - offset; 
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200);
  };

  const openCustomizer = (product: MenuItem) => {
    if (product.category === 'Bake House' || product.category === 'Quick Bites') {
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
        setShareModal({
          isOpen: true,
          title: `Check out ${product.name} at POP O'BOB®!`,
          url: shareUrl
        });
      }
    );
  };

  const renderProductCard = (product: MenuItem) => {
    const isBlacklisted = blacklistedProductIds.includes(product.id);
    return (
      <div 
        key={product.id}
        onClick={() => !isBlacklisted && openCustomizer(product)}
        className={`bg-white p-3 lg:p-5 rounded-[1.5rem] lg:rounded-[2.2rem] flex flex-col gap-3 lg:gap-4 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all cursor-pointer group hover:shadow-[0_8px_30px_rgb(212,175,55,0.12)] hover:border-[#D4AF37]/30 ${isBlacklisted ? 'opacity-55 cursor-not-allowed' : 'active:scale-[0.98] lg:hover:-translate-y-1'}`}
      >
        <div className="w-full aspect-square lg:aspect-[4/3] rounded-[1rem] lg:rounded-[1.6rem] overflow-hidden bg-[#F5F3EC] relative shadow-inner">
          {isBlacklisted ? (
            <div className="absolute top-2 lg:top-4 left-2 lg:left-4 z-10 bg-[#1A0B05] text-white text-[10px] font-black uppercase tracking-wider px-2 lg:px-3 py-1 rounded-md lg:rounded-full shadow-sm lg:shadow-md">
              Sold Out
            </div>
          ) : product.badge ? (
            <div className="absolute top-2 lg:top-4 left-2 lg:left-4 z-10 bg-white/40 backdrop-blur-md border border-white/60 text-[#5A3825] text-[9px] font-black uppercase tracking-widest px-2.5 lg:px-3 py-1 rounded-full shadow-sm lg:shadow-md">
              {product.badge}
            </div>
          ) : null}
          <button 
            onClick={(e) => handleShare(e, product)}
            className="absolute top-2 right-2 lg:top-4 lg:right-4 z-10 bg-white/80 backdrop-blur-md hover:bg-white text-[#1A0B05] p-1.5 lg:p-2.5 rounded-full shadow-sm transition-all active:scale-95 lg:opacity-0 lg:group-hover:opacity-100"
          >
            <Share2 size={14} className="lg:w-4 lg:h-4" />
          </button>
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#F5F3EC] text-gray-300">
              <ShoppingBag size={32} className="mb-2 opacity-50" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-between flex-1 px-1 lg:px-0">
          <span className="text-[9px] lg:text-[10px] font-black text-[#D4AF37] mb-1 uppercase tracking-widest leading-none block">{product.subcategory || product.category}</span>
          <h3 className="font-bold text-[14px] lg:text-[16px] text-[#1A0B05] leading-snug tracking-tight mb-1 lg:mb-2 line-clamp-2 lg:line-clamp-1 group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
          
          <div className="hidden lg:block">
             <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-6 font-medium">
               {product.story || ''}
             </p>
          </div>
          
          <div className="flex justify-between items-end mt-auto pt-2 lg:pt-4 lg:border-t lg:border-gray-100">
            <span className="font-black text-[15px] lg:text-2xl text-[#1A0B05] tracking-tight">₹{product.price.toFixed(0)}</span>
            
            <div className="lg:hidden">
              <button className="bg-[#1A0B05] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0B05] px-3.5 py-1.5 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95">
                Add
              </button>
            </div>
            <div className="hidden lg:block">
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
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-[#FDFCF9] pb-32 animate-in fade-in duration-500 font-sans max-w-[1440px] mx-auto relative">
      
      {/* ========================================================================= */}
      {/* MOBILE MENU VIEW */}
      {/* ========================================================================= */}
      <div className="lg:hidden">
        {/* Search Header ONLY */}
        <div className="sticky top-0 z-30 bg-[#FDFCF9]/95 backdrop-blur-xl px-4 pt-4 pb-4 border-b border-gray-100 shadow-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] shadow-sm transition-all"
              placeholder="Search our full menu..."
            />
          </div>
        </div>

        {/* Continuous Scroll Sections Grouped by Main -> Sub */}
        <div className="px-4 mt-6 space-y-12">
          {mainCategories.map(mainCat => (
            <div key={mainCat} className="space-y-6">
              
              {/* Level 1: Main Category Header */}
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-black text-[#1A0B05] tracking-tight uppercase">{mainCat}</h1>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              
              {/* Level 2: Subcategories */}
              <div className="space-y-10">
                {Object.keys(groupedMenu[mainCat]).map(subCat => (
                  <div 
                    key={`${mainCat}-${subCat}`} 
                    ref={el => { if(el) mobileCategoryRefs.current[`${mainCat}-${subCat}`] = el; }}
                    className="scroll-mt-28"
                  >
                    <h2 className="text-[14px] font-black text-[#D4AF37] mb-4 uppercase tracking-[0.2em]">
                      {subCat}
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {groupedMenu[mainCat][subCat].map(product => renderProductCard(product))}
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          ))}

          {mainCategories.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <Search className="text-gray-400" size={24} />
              </div>
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
              Our Full Menu
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
              placeholder="Search our massive catalog..."
            />
          </div>
        </div>

        {/* Desktop Sections */}
        <div className="space-y-20 min-h-[50vh]">
          {mainCategories.map(mainCat => (
            <div key={mainCat} className="space-y-12">
              
              <div className="flex items-center gap-6">
                <h1 className="text-5xl font-black text-[#1A0B05] tracking-tighter uppercase">{mainCat}</h1>
                <div className="h-[2px] bg-gray-100 flex-1 mt-3"></div>
              </div>

              <div className="space-y-16 pl-4 border-l-2 border-[#D4AF37]/20">
                {Object.keys(groupedMenu[mainCat]).map(subCat => (
                  <div 
                    key={`${mainCat}-${subCat}`} 
                    ref={el => { if(el) desktopCategoryRefs.current[`${mainCat}-${subCat}`] = el; }}
                    className="scroll-mt-36"
                  >
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                      <h2 className="text-2xl font-black text-[#1A0B05] tracking-tight uppercase">
                        {subCat}
                      </h2>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                        {groupedMenu[mainCat][subCat].length} {groupedMenu[mainCat][subCat].length === 1 ? 'creation' : 'creations'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 xl:grid-cols-5 gap-8">
                      {groupedMenu[mainCat][subCat].map(product => renderProductCard(product))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {mainCategories.length === 0 && (
            <div className="py-28 text-center">
              <h3 className="font-black text-[#1A0B05] text-2xl mb-2">No menu items found</h3>
              <p className="text-gray-500 font-medium text-sm">Try adjusting your search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING MENU MAP (FAB) */}
      {/* ========================================================================= */}
      {mainCategories.length > 0 && !searchQuery && (
        <button 
          onClick={() => setIsMenuMapOpen(true)}
          className="fixed bottom-24 lg:bottom-12 right-6 z-40 bg-[#1A0B05] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0B05] shadow-[0_8px_30px_rgb(0,0,0,0.2)] px-6 py-3.5 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10"
        >
          <MenuIcon size={18} strokeWidth={2.5} />
          <span className="font-black text-xs uppercase tracking-widest">Menu</span>
        </button>
      )}

      {/* FLOATING MENU MAP (BOTTOM SHEET / MODAL) - TWO LEVEL HIERARCHY */}
      <AnimatePresence>
        {isMenuMapOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
              onClick={() => setIsMenuMapOpen(false)}
            />
            <motion.div 
              initial={{ y: "100%", sm: { y: 20, opacity: 0 } }}
              animate={{ y: 0, sm: { y: 0, opacity: 1 } }}
              exit={{ y: "100%", sm: { y: 20, opacity: 0 } }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-[#FDFCF9] w-full max-w-md h-[85vh] sm:h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 flex flex-col pointer-events-auto border-t border-[#D4AF37]/20"
            >
              <div className="p-6 pt-7 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-3xl sm:rounded-3xl shadow-sm z-10 shrink-0">
                <h3 className="font-black text-xl text-[#1A0B05] uppercase tracking-[0.2em]">
                  Menu
                </h3>
                <button 
                  onClick={() => setIsMenuMapOpen(false)}
                  className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 p-6 pb-12 space-y-10">
                {mainCategories.map((mainCat, idx) => (
                  <motion.div 
                    key={mainCat}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                  >
                    <h4 className="text-[13px] font-black text-[#1A0B05] uppercase tracking-[0.25em] mb-4 flex items-center gap-4">
                      {mainCat}
                      <div className="h-[2px] bg-[#D4AF37]/20 flex-1 rounded-full"></div>
                    </h4>
                    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      {Object.keys(groupedMenu[mainCat]).map((subCat, index) => (
                        <button
                          key={subCat}
                          onClick={() => scrollToCategory(mainCat, subCat)}
                          className={`w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#FDFCF9] active:bg-gray-50 transition-all group ${index !== Object.keys(groupedMenu[mainCat]).length - 1 ? 'border-b border-gray-50' : ''}`}
                        >
                          <span className="font-bold text-[14px] text-[#1A0B05] tracking-widest group-hover:text-[#D4AF37] transition-colors uppercase">{subCat}</span>
                          <span className="text-[11px] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">{groupedMenu[mainCat][subCat].length}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CustomizerSheet 
        product={selectedProduct} 
        isOpen={selectedProduct !== null} 
        onClose={closeCustomizer} 
      />

      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal(prev => ({ ...prev, isOpen: false }))}
        title={shareModal.title}
        url={shareModal.url}
      />
    </div>
  );
}
