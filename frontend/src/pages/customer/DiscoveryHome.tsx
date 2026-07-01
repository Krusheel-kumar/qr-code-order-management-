import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { shareContent } from '../../utils/shareUtils';
import ShareModal from '../../components/ui/ShareModal';

import { useMenuStore } from '../../store/useMenuStore';
import type { MenuItem } from '../../data/menu';
import type { Offer, Combo } from '../../data/models';
import StoryModal from '../../components/feed/StoryModal';
import CustomizerSheet from '../../components/CustomizerSheet';
import SearchModal from '../../components/ui/SearchModal';
import AuthModal from '../../components/ui/AuthModal';
import ProfileSheet from '../../components/ui/ProfileSheet';
import GlassHeader from '../../components/ui/GlassHeader';

import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';


export default function DiscoveryHome() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [_activeBanner, setActiveBanner] = useState(0);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [shareModal, setShareModal] = useState<{isOpen: boolean, title: string, url: string}>({isOpen: false, title: '', url: ''});
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const hasHandledDeepLink = useRef(false);
  const { } = useAuthStore();
  const { menuItems: MENU, getFeaturedProducts, campaigns, stories, discoverySections, isLoading } = useMenuStore();
  const featuredProduct = getFeaturedProducts()[0] || MENU[0];
  

  const combos: Combo[] = [];
  useEffect(() => {
    // Handle deep links after data loads
    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get('campaign');
    if (campaignId && campaigns.length > 0 && !hasHandledDeepLink.current) {
      const targetCampaign = campaigns.find(c => c.id === campaignId);
      if (targetCampaign) {
        setShareModal({
          isOpen: true,
          title: `Check out this promotion!`,
          url: window.location.href,
        });
      }
      hasHandledDeepLink.current = true;
    }
  }, [campaigns]);

  // Handle campaign deep links
  useEffect(() => {
    if (campaigns.length > 0 && carouselRef.current) {
      const params = new URLSearchParams(window.location.search);
      const campaignParam = params.get('campaign');
      if (campaignParam) {
        const idx = campaigns.findIndex(c => c.id === campaignParam);
        if (idx !== -1) {
          setTimeout(() => {
            const carousel = carouselRef.current;
            if (carousel) {
              const slide = carousel.children[idx] as HTMLElement;
              if (slide) {
                const scrollLeft = slide.offsetLeft - carousel.offsetLeft - 16;
                carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });
              }
            }
          }, 300);
        }
      }
    }
  }, [campaigns, location.search]);

  // Auto-rotate Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => {
        if (campaigns.length === 0) return 0;
        const next = (prev + 1) % campaigns.length;
        if (carouselRef.current) {
          const slide = carouselRef.current.children[next] as HTMLElement;
          if (slide) {
             const scrollLeft = slide.offsetLeft - carouselRef.current.offsetLeft - 16;
             carouselRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [campaigns.length]);

  const cartStore = useCartStore();

  const handleProductClick = (product: MenuItem) => {
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

  const renderProductCard = (product: MenuItem, index: number, badgeText?: string) => (
    <motion.div 
      key={product.id}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={() => handleProductClick(product)}
      className="snap-start shrink-0 w-[160px] bg-white rounded-[1.5rem] border border-black/[0.03] shadow-[0_8px_24px_rgba(0,0,0,0.04)] relative group hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all cursor-pointer flex flex-col overflow-hidden"
    >
      <div className="w-full aspect-[4/5] bg-gray-50 relative overflow-hidden">
        {badgeText && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-white/90 backdrop-blur-md text-black text-[8px] font-extrabold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-widest border border-white/50">
            {badgeText}
          </div>
        )}
        <img src={product.image || 'https://images.unsplash.com/photo-1558857563-b37102e95cb4?auto=format&fit=crop&q=80&w=800'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </div>
      
      <div className="p-3.5 pt-3 flex flex-col flex-1">
        <h4 className="font-extrabold text-[16px] text-gray-900 leading-tight mb-0.5">{product.name}</h4>
        <span className="text-[12px] font-medium text-gray-400 mb-2 uppercase tracking-wider">{product.category.replace('cat_', '')}</span>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="font-extrabold text-[17px] text-black tracking-tight">₹{product.price}</span>
          <button className="bg-primary text-black hover:bg-[#FF9800] hover:text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold leading-none pb-0.5 transition-colors shadow-sm">
            +
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[100dvh] bg-[var(--color-background)] font-sans">
      
      {/* Glassmorphism Header Trial */}
      <GlassHeader 
        onOpenProfile={() => setIsProfileOpen(true)} 
        onOpenSearch={() => setIsSearchOpen(true)} 
        onOpenAuth={() => setIsAuthOpen(true)} 
      />

      {/* Skeletons while loading empty initial state */}
      {isLoading && campaigns.length === 0 && stories.length === 0 && discoverySections.length === 0 && (
        <div className="animate-in fade-in duration-500">
          <section className="mb-8 mt-1 px-4">
            <div className="w-[85vw] aspect-[16/9] sm:aspect-[21/9] bg-gray-200 animate-pulse rounded-[1.25rem] shadow-sm" />
          </section>

          <section className="mb-8 pl-4">
            <div className="w-1/3 h-5 bg-gray-200 animate-pulse rounded mb-4" />
            <div className="flex gap-4 overflow-x-hidden">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="w-[72px] h-[72px] bg-gray-200 animate-pulse rounded-full" />
                  <div className="w-12 h-2.5 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10 pl-4">
            <div className="w-1/2 h-6 bg-gray-200 animate-pulse rounded mb-4" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2].map(i => (
                <div key={i} className="w-[280px] h-[120px] bg-gray-200 animate-pulse rounded-2xl shrink-0" />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Screen 02: Hero Campaign Carousel */}
      {campaigns.length > 0 && (
        <section className="mb-8 mt-1">
          <div ref={carouselRef} className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 px-4 pb-2 scroll-smooth">
          {campaigns.map((campaign, idx) => {
            return (
              <div 
                key={idx}
                className="relative shrink-0 snap-center w-[85vw] aspect-[16/9] sm:aspect-[21/9] rounded-[1.25rem] overflow-hidden shadow-sm bg-gray-100 cursor-pointer transition-transform"
              >
                <img 
                  src={campaign.image} 
                  className="w-full h-full object-cover active:scale-[0.98]" 
                  onClick={() => {
                    if (campaign.link) {
                      // Support internal routing and query params like /menu?category=Barista
                      if (campaign.link.startsWith('/')) {
                        const [path, query] = campaign.link.split('?');
                        const state: any = {};
                        if (query) {
                          const params = new URLSearchParams(query);
                          if (params.get('category')) state.mainCategory = params.get('category');
                        }
                        navigate(path, { state });
                      } else {
                        window.open(campaign.link, '_blank');
                      }
                    }
                  }}
                />
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const shareUrl = `${window.location.origin}/?campaign=${campaign.id}`;
                    shareContent(
                      {
                        title: `Wow! Check out this special offer at Pop O Bob! 🎉`,
                        text: `I just found this amazing promotion. Don't miss out on it!`,
                        url: shareUrl,
                        imageUrl: campaign.image,
                      },
                      () => {
                        setShareModal({
                          isOpen: true,
                          title: `Check out this promotion at Pop O Bob!`,
                          url: shareUrl
                        });
                      }
                    );
                  }}
                  className="absolute top-4 right-4 z-10 bg-white/60 backdrop-blur-md hover:bg-white/90 text-gray-800 p-2 rounded-full shadow-md transition-all active:scale-95"
                >
                  <Share2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
        </section>
      )}

      {/* Screen 03: Stories / Highlights */}
      {stories.length > 0 && (
        <section className="mb-8 pl-4">
          <div className="flex justify-between items-end pr-4 mb-3">
          <h3 className="font-extrabold text-[20px] font-heading tracking-tight text-gray-900 leading-none">Highlights</h3>
          <span className="text-xs font-bold text-[#FF9800] mb-0.5 active:scale-95 transition-transform">See all &gt;</span>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-2 pr-4">
          {stories.map(story => (
            <button key={story.id} onClick={() => setSelectedStory(story.id)} className="flex flex-col items-center gap-1.5 snap-start shrink-0 relative group">
              <div className="w-[72px] h-[72px] rounded-full p-[3px] bg-gradient-to-tr from-[#FF9800] via-[#FF5722] to-[#FFC461] shadow-sm group-active:scale-95 transition-transform">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-100">
                  <img src={story.image} className="w-full h-full object-cover" />
                </div>
              </div>
              {story.badge && (
                <span className="absolute bottom-[22px] bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                  {story.badge}
                </span>
              )}
              <span className="text-[11px] font-bold text-gray-800 tracking-tight">{story.title}</span>
            </button>
          ))}
        </div>
      </section>
      )}

      {/* Dynamic Discovery Sections */}
      {discoverySections.map((section) => {
        // Find products from MENU that have this section's ID in their discoverySections array
        // (Since backend returns products in discoverySection, we could use that, but we have full MENU loaded locally, so we can just use the products provided in section.products)
        // Note: We need to map the section.products to our full MenuItem so we get all local fields (like icons, etc.)
        const sectionProducts = (section.products || [])
          .map((sp: any) => {
            const localProduct = MENU.find(m => m.id === sp.id);
            if (localProduct) return localProduct;
            return {
              id: sp.id,
              name: sp.name,
              price: sp.price,
              category: typeof sp.category === 'string' ? sp.category : (sp.category?.name || 'Unknown'),
              image: sp.imageUrl || sp.image || '',
            } as MenuItem;
          })
          .filter(Boolean) as MenuItem[];
          
        if (sectionProducts.length === 0) return null;
        
        return (
          <section key={section.id} className="mb-10">
            <div className="flex justify-between items-end px-4 mb-3">
              <h3 className="font-extrabold text-[22px] font-heading tracking-tight text-gray-900 leading-none">{section.title}</h3>
              <span className="text-xs font-bold text-gray-400 mb-0.5">See all &gt;</span>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x px-4 pb-4">
              {sectionProducts.map((product, i) => renderProductCard(product, i))}
            </div>
          </section>
        );
      })}



      {/* Screen 07: Drink Of The Week */}
      <section className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-2xl tracking-tighter text-[#1A0B05]">
            Drink Of The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] to-[#FFC461]">Week</span>
          </h3>
        </div>
        
        <div className="bg-white rounded-[2rem] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-100 relative overflow-hidden flex flex-col">
          {/* Big Image Top Half - Fixed Cropping */}
          <div className="w-full relative h-72 bg-gray-100 overflow-hidden flex items-center justify-center">
             {/* Blurred Background Layer for Context */}
             <img 
               src={featuredProduct?.image || 'https://images.unsplash.com/photo-1558857563-b37102e95cb4?auto=format&fit=crop&q=80&w=800'} 
               className="absolute inset-0 w-full h-full object-cover blur-[20px] opacity-40 scale-110" 
             />
             {/* Actual Uncropped Image */}
             <img 
               src={featuredProduct?.image || 'https://images.unsplash.com/photo-1558857563-b37102e95cb4?auto=format&fit=crop&q=80&w=800'} 
               className="relative w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500 z-10 drop-shadow-2xl" 
             />
             <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#FF9800] text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-md z-20">
                Spotlight
             </div>
          </div>
          
          {/* Content Bottom Half */}
          <div className="w-full p-5 flex flex-col bg-white relative z-20 -mt-6 rounded-t-[2rem]">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-black text-xl leading-tight tracking-tight text-[#1A0B05] max-w-[70%]">
                {featuredProduct?.name}
              </h4>
              <span className="font-black text-xl text-[#FF9800]">₹{featuredProduct?.price}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[#FF9800] text-[12px] font-bold mb-3">
              <span>★</span> {featuredProduct?.rating} 
              <span className="text-gray-400 font-medium">({featuredProduct?.ordersToday || '1.2k'} reviews)</span>
            </div>
            
            <p className="text-gray-500 text-[13px] line-clamp-2 mb-5 font-medium leading-relaxed">
              {featuredProduct?.story}
            </p>
            
            <button 
              onClick={() => featuredProduct && setSelectedProduct(featuredProduct)} 
              className="bg-[#1A0B05] text-white w-full py-3.5 rounded-[1rem] flex items-center justify-center gap-2 font-black text-[14px] shadow-md hover:bg-[#FF9800] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Order Now <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Screen 08: Best Combos */}
      {combos.length > 0 && (
        <section className="mb-10">
          <div className="flex justify-between items-center px-4 mb-4">
            <h3 className="font-bold text-lg font-heading">Best Combos</h3>
          </div>
          <div className="flex flex-col gap-4 px-4">
            {combos.map((combo) => (
              <div key={combo.id} className="bg-white p-3 rounded-3xl flex items-center gap-4 border border-gray-100 shadow-sm">
                 <img src={combo.image} className="w-20 h-20 rounded-2xl object-cover" />
                 <div className="flex-1 py-1">
                   <h4 className="font-bold text-sm leading-tight mb-1">{combo.title}</h4>
                   <p className="text-xs text-gray-500 mb-2">Combo</p>
                   <span className="font-bold text-sm">${combo.price}</span>
                 </div>
                 <button className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold shrink-0 transition-colors">
                    +
                 </button>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* AI Recommender Intercept - Gen Z Vibrant Holographic */}
      <section className="px-4 mb-4">
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/quiz')}
          className="relative rounded-[2rem] p-5 overflow-hidden shadow-[0_15px_40px_rgba(255,152,0,0.2)] cursor-pointer group flex flex-col gap-3"
        >
          {/* Vibrant Holographic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF9800] via-[#FF512F] to-[#F09819] z-0"></div>
          {/* Animated Mesh Blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD700] rounded-full mix-blend-overlay filter blur-[30px] opacity-80 animate-pulse z-0"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FF007F] rounded-full mix-blend-overlay filter blur-[30px] opacity-60 z-0"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-white/20 backdrop-blur-md border border-white/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="text-[14px]">🤖</span>
              <span className="text-white text-[10px] font-black tracking-[0.15em] uppercase">POB AI Assistant</span>
            </div>
            
            <div className="w-8 h-8 bg-white text-[#FF512F] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </div>

          <div className="relative z-10 mt-1">
            <h4 className="font-black text-[22px] leading-[1.1] tracking-tighter text-white drop-shadow-md">
              First timer? <br/>
              <span className="text-[#FFD700]">Not sure what to order?</span> 🧋✨
            </h4>
            <p className="text-white/90 text-[13px] font-bold mt-2 flex items-center gap-2">
              Let AI build your perfect cup <span className="inline-block animate-bounce">👇</span>
            </p>
          </div>
          
          {/* Floating Elements for Gen Z Vibe */}
          <span className="absolute bottom-4 right-4 text-3xl opacity-20 transform rotate-12 z-0 group-hover:scale-125 transition-transform duration-500">🪄</span>
          <span className="absolute top-1/2 right-12 text-2xl opacity-20 transform -rotate-12 z-0 group-hover:scale-125 transition-transform duration-500 delay-100">🔮</span>
        </motion.div>
      </section>

      {/* Fullscreen Story Modal (Screen 03 details) */}
      <AnimatePresence>
        {selectedStory && (
          <StoryModal 
            storyId={selectedStory} 
            onClose={() => {
              setSelectedStory(null);
              // Clean up URL so it doesn't re-open on refresh
              const url = new URL(window.location.href);
              url.searchParams.delete('story');
              window.history.replaceState({}, '', url);
            }} 
          />
        )}
      </AnimatePresence>

      <CustomizerSheet 
        product={selectedProduct} 
        isOpen={selectedProduct !== null} 
        onClose={() => setSelectedProduct(null)} 
      />

      {/* Share Modal Fallback */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal(prev => ({ ...prev, isOpen: false }))}
        title={shareModal.title}
        url={shareModal.url}
      />

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelectProduct={handleProductClick} 
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      <ProfileSheet 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

    </div>
  );
}
