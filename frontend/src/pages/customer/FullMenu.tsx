import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Share2 } from 'lucide-react';

import type { MenuItem } from '../../data/menu';
import { useCartStore } from '../../store/useCartStore';
import { useMenuStore } from '../../store/useMenuStore';
import { shareContent } from '../../utils/shareUtils';
import CustomizerSheet from '../../components/CustomizerSheet';
import ShareModal from '../../components/ui/ShareModal';

export default function FullMenu() {
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [shareModal, setShareModal] = useState<{isOpen: boolean, title: string, url: string}>({isOpen: false, title: '', url: ''});
  
  const cartStore = useCartStore();
  const { menuItems: MENU } = useMenuStore();

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
    <div className="min-h-screen bg-gray-50 pb-32 animate-in fade-in duration-500 font-sans" ref={containerRef}>
      
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur-xl px-4 pt-4 pb-2 border-b border-black/5">
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={20} className="text-foreground/40" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-black/5 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
            placeholder="Search our menu..."
          />
        </div>

        {/* Main Category Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-4 overflow-x-auto hide-scrollbar">
          {DYNAMIC_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setMainCategory(cat);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-bold rounded-lg transition-all text-center whitespace-nowrap ${
                mainCategory === cat
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-foreground/50 hover:text-foreground/70'
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
                  ? 'bg-foreground text-white shadow-md scale-105' 
                  : 'bg-white text-foreground/70 hover:bg-gray-100 border border-black/5'
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
            className="scroll-mt-36" // Add margin for scroll offset
          >
            <h2 className="text-[19px] font-extrabold text-foreground mb-3 sticky top-[120px] z-20 bg-gray-50/95 backdrop-blur-md py-2 -mx-4 px-4 border-y border-black/5">
              {cat}
            </h2>
            
            {/* Visual Prominent Grid Layout for Premium Feel */}
            <div className="grid grid-cols-2 gap-3.5">
              {groupedMenu[cat].map(product => (
                <div 
                  key={product.id}
                  onClick={() => openCustomizer(product)}
                  className="bg-white p-2 rounded-[1.2rem] flex flex-col gap-2 border border-black/5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer group hover:shadow-md"
                >
                  <div className="w-full aspect-square rounded-[1rem] overflow-hidden bg-gray-100 relative shadow-inner">
                    {product.badge && (
                      <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        {product.badge}
                      </div>
                    )}
                    <button 
                      onClick={(e) => handleShare(e, product)}
                      className="absolute top-2 right-2 z-10 bg-white/60 backdrop-blur-md hover:bg-white/90 text-gray-800 p-1.5 rounded-full shadow-sm transition-all active:scale-95"
                    >
                      <Share2 size={14} />
                    </button>
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-primary/10 text-primary/40">
                        <ShoppingBag size={32} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">POP O'BOB®</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1 px-1">
                    <h3 className="font-bold text-[13px] text-foreground leading-tight mb-1 line-clamp-2">{product.name}</h3>
                    
                    <div className="flex justify-between items-center mt-auto pt-1.5">
                      <span className="font-extrabold text-[13px] text-foreground">₹{product.price.toFixed(2)}</span>
                      <button className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center font-bold text-base transition-colors shadow-sm">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="font-bold text-foreground text-lg mb-1">No items found</h3>
            <p className="text-foreground/50 text-sm">Try adjusting your search.</p>
          </div>
        )}
      </div>

      {/* Smart Sticky Cart removed - now handled globally by FloatingCartButton in MainLayout */}
      {/* Unified Bottom Sheet Customizer */}
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
