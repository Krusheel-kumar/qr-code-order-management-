import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { shareContent } from '../../utils/shareUtils';
import ShareModal from '../../components/ui/ShareModal';

import { useMenuStore } from '../../store/useMenuStore';
import type { MenuItem } from '../../data/menu';
import type { Combo } from '../../data/models';
import StoryModal from '../../components/feed/StoryModal';
import CustomizerSheet from '../../components/CustomizerSheet';
import SearchModal from '../../components/ui/SearchModal';
import AuthModal from '../../components/ui/AuthModal';
import ProfileSheet from '../../components/ui/ProfileSheet';
import GlassHeader from '../../components/ui/GlassHeader';
import DesktopDiscoveryHome from './DesktopDiscoveryHome';
import SocialWidgets from '../../components/ui/SocialWidgets';
import OrderStatusCard from '../../components/ui/OrderStatusCard';

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
  const { user } = useAuthStore();
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
        {/* Minimalist Independence Day Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 bg-white/85 backdrop-blur-md px-2 py-1 rounded-md border border-white/60 shadow-sm flex items-center gap-1.5">
          <div className="flex flex-col w-3 h-[8px] rounded-[1px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
            <div className="h-1/3 w-full bg-[#FF9933]"></div>
            <div className="h-1/3 w-full bg-white relative flex items-center justify-center">
              <div className="w-[1px] h-[1px] bg-[#000080] rounded-full"></div>
            </div>
            <div className="h-1/3 w-full bg-[#138808]"></div>
          </div>
          <span className="text-[8px] font-bold tracking-widest text-[#1A0B05] uppercase mt-[1px]">Special</span>
        </div>
        <img src={product.image || 'https://images.unsplash.com/photo-1558857563-b37102e95cb4?auto=format&fit=crop&q=80&w=800'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </div>
      
      <div className="p-3.5 pt-3 flex flex-col flex-1">
        <h4 className="font-extrabold text-[16px] text-gray-900 leading-tight mb-0.5">{product.name}</h4>
        <span className="text-[12px] font-medium text-gray-400 mb-2 uppercase tracking-wider">{product.category.replace('cat_', '')}</span>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="font-extrabold text-[17px] text-black tracking-tight">₹{Math.round(Number(product.price))}</span>
          <button className="bg-primary text-black hover:bg-[#FF9800] hover:text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold leading-none pb-0.5 transition-colors shadow-sm">
            +
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[100dvh] bg-[var(--color-background)] font-sans">
      
      {/* ========================================================================= */}
      {/* 1. LUXURY DESKTOP EXPERIENCE (>= lg) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block">
        <DesktopDiscoveryHome
          campaigns={campaigns}
          stories={stories}
          discoverySections={discoverySections}
          MENU={MENU}
          featuredProduct={featuredProduct}
          combos={combos}
          onProductClick={handleProductClick}
          onStoryClick={(storyId) => setSelectedStory(storyId)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAI={() => navigate('/ai/home', {
            state: {
              customerName: user?.username || null,
              isGuest: !user
            }
          })}
          onOpenCart={() => navigate('/cart')}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. EXCELLENT MOBILE EXPERIENCE (< lg) */}
      {/* ========================================================================= */}
      <div className="lg:hidden">
        {/* Glassmorphism Header Trial */}
        <GlassHeader 
          onOpenProfile={() => setIsProfileOpen(true)} 
          onOpenSearch={() => setIsSearchOpen(true)} 
          onOpenAuth={() => setIsAuthOpen(true)} 
        />

        <OrderStatusCard />

      {/* Skeletons while loading empty initial state */}
      {isLoading && campaigns.length === 0 && stories.length === 0 && discoverySections.length === 0 && (
        <div className="animate-in fade-in duration-500">
          <section className="mb-10 mt-2 px-0">
            <div className="w-[92vw] mx-auto aspect-[16/9] sm:aspect-[21/9] bg-gray-200/50 animate-pulse rounded-[2rem] shadow-sm" />
          </section>

          <section className="mb-10 pl-5">
            <div className="w-1/3 h-5 bg-gray-200/50 animate-pulse rounded mb-5" />
            <div className="flex gap-5 overflow-x-hidden">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-[76px] h-[76px] bg-gray-200/50 animate-pulse rounded-full" />
                  <div className="w-12 h-2 bg-gray-200/50 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 pl-5">
            <div className="w-1/2 h-6 bg-gray-200/50 animate-pulse rounded mb-5" />
            <div className="flex gap-5 overflow-hidden">
              {[1, 2].map(i => (
                <div key={i} className="w-[280px] h-[120px] bg-gray-200/50 animate-pulse rounded-[1.5rem] shrink-0" />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Screen 02: Hero Campaign Carousel */}
      {campaigns.length > 0 && (
        <section className="mb-10 mt-2">
          <div ref={carouselRef} className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 px-4 pb-4 scroll-smooth">
          {campaigns.map((campaign, idx) => {
            return (
              <div 
                key={idx}
                className="relative shrink-0 snap-center w-[92vw] aspect-[16/9] sm:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)] bg-gray-100 cursor-pointer transition-transform duration-300"
              >
                <img 
                  src={campaign.image} 
                  className="w-full h-full object-cover active:scale-95 transition-transform duration-300" 
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
                        title: `Wow! Check out this special offer at POP O'BOB®! 🎉`,
                        text: `I just found this amazing promotion. Don't miss out on it!`,
                        url: shareUrl,
                        imageUrl: campaign.image,
                      },
                      () => {
                        setShareModal({
                          isOpen: true,
                          title: `Check out this promotion at POP O'BOB®!`,
                          url: shareUrl
                        });
                      }
                    );
                  }}
                  className="absolute top-4 right-4 z-10 bg-white/70 backdrop-blur-xl hover:bg-white text-black p-2.5 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-all active:scale-90"
                >
                  <Share2 size={18} />
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
            Drink Of The <span className="text-[#D4AF37]">Week</span>
          </h3>
        </div>
        
        <div 
          className="rounded-[2rem] bg-gradient-to-r from-[#5A3825] to-[#3E2312] text-white overflow-hidden shadow-xl flex flex-col group cursor-pointer border border-white/10" 
          onClick={() => featuredProduct && setSelectedProduct(featuredProduct)}
        >
          {/* Top: Image (Full width) */}
          <div className="w-full h-56 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#D4AF37]/10 mix-blend-overlay z-10 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#3E2312] to-transparent z-10 pointer-events-none"></div>
            
            <img 
              src={featuredProduct?.image || 'https://images.unsplash.com/photo-1558857563-b37102e95cb4?auto=format&fit=crop&q=80&w=800'} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-sm z-20">
               Spotlight
            </div>
          </div>
          
          {/* Bottom: Content */}
          <div className="p-5 relative z-20 flex flex-col -mt-4">
            <h4 className="font-black text-2xl leading-tight tracking-tight text-white mb-6">
              {featuredProduct?.name}
            </h4>
            
            <div className="flex items-center justify-between mt-2">
              <span className="font-black text-2xl text-white">₹{Math.round(Number(featuredProduct?.price || 0))}</span>
              <button 
                className="bg-[#D4AF37] hover:bg-white text-[#1A0B05] px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-lg transition-all"
              >
                Order
              </button>
            </div>
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
                   <span className="font-bold text-sm">₹{Math.round(Number(combo.price))}</span>
                 </div>
                 <button className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold shrink-0 transition-colors">
                    +
                 </button>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* AI Recommender Intercept - Premium Brand Aligned */}
      <section className="px-4 mb-8">
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/ai/home', {
            state: {
              customerName: user?.username || null,
              isGuest: !user
            }
          })}
          className="bg-gradient-to-r from-[#8E5E35] to-[#5A3825] rounded-[2rem] p-6 relative overflow-hidden shadow-xl cursor-pointer flex flex-col gap-5 group border border-white/10"
        >
          {/* Subtle Gold Blur */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
              <span className="text-sm">🪄</span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">POB AI Assistant</span>
            </div>
            <div className="w-10 h-10 bg-white text-[#5A3825] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
               <span className="text-xl drop-shadow-sm">🤖</span>
            </div>
          </div>

          <div className="relative z-10">
            <h4 className="font-black text-[20px] leading-tight tracking-tight text-white mb-2">
              Not sure what to order? 
            </h4>
            <p className="text-[#FFC461] text-[12px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
              Ask AI Assistant <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </p>
          </div>
        </motion.div>
      </section>

      </div>
      
      {/* Community & Socials (Responsive: shows mobile & desktop layouts respectively) */}
      <SocialWidgets />

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
