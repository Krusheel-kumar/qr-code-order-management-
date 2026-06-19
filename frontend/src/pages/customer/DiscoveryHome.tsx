import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Star } from 'lucide-react';

import { MENU, getBestSellers, getNewLaunches, getBakeHouseItems, getBaristaItems } from '../../data/menu';
import type { MenuItem } from '../../data/menu';
import type { Campaign, Story, Offer, Combo } from '../../data/models';
import StoryModal from '../../components/feed/StoryModal';
import CustomizerSheet from '../../components/CustomizerSheet';
import { useCartStore } from '../../store/useCartStore';
import { getCampaigns, getStories } from '../../api';

import logoImg from '../../assets/logo 2.png';
import { campaigns as initialCampaigns, stories as initialStories } from '../../data/mockData';

export default function DiscoveryHome() {
  const navigate = useNavigate();
  
  // State
  const [_activeBanner, setActiveBanner] = useState(0);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Dynamic CMS State
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [stories, setStories] = useState<Story[]>(initialStories);
  
  // Mock data for offers and combos until they are fully integrated
  const offers: Offer[] = [{ id: 'o1', title: 'Special Discount', description: '20% OFF', image: '', code: 'DISC20', validUntil: 'Valid until Sunday', ctaText: 'Order Now' }];
  const combos: Combo[] = [];

  useEffect(() => {
    getCampaigns().then(data => {
      if (data && data.length > 0) setCampaigns(data);
    }).catch(console.error);
    
    getStories().then(data => {
      if (data && data.length > 0) setStories(data);
    }).catch(console.error);
  }, []);

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
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </div>
      
      <div className="p-3.5 pt-3 flex flex-col flex-1">
        <h4 className="font-extrabold text-[16px] text-gray-900 leading-tight mb-0.5">{product.name}</h4>
        <span className="text-[12px] font-medium text-gray-400 mb-2 uppercase tracking-wider">{product.category.replace('cat_', '')}</span>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="font-extrabold text-[17px] text-black tracking-tight">₹{product.price}</span>
          <button className="bg-[var(--color-premium-dark)] text-white hover:bg-primary hover:text-black w-8 h-8 rounded-full flex items-center justify-center text-lg font-light leading-none pb-0.5 transition-colors shadow-sm">
            +
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[100dvh] pb-24 bg-[var(--color-background)] font-sans">
      
      {/* Top Navigation Bar */}
      <header className="flex justify-center items-center px-6 pt-4 pb-3 bg-white/90 backdrop-blur-xl sticky top-0 z-40 border-b border-black/5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 bg-white flex items-center justify-center shrink-0 shadow-sm">
            <img src={logoImg} alt="Logo" className="w-[120%] h-[120%] object-cover" />
          </div>
          <div className="flex flex-col items-start pt-1">
            <div className="flex items-start">
              <h1 className="font-heading font-black text-[32px] tracking-tighter lowercase flex items-center leading-none text-gray-900">
                pop<span className="text-primary">o</span>bob
              </h1>
              <span className="text-[10px] font-extrabold ml-1 mt-1 text-gray-400">&reg;</span>
            </div>
            <span className="text-[8.5px] font-extrabold uppercase tracking-[0.25em] text-gray-500 mt-1">Specialty Bubble Tea</span>
          </div>
        </div>
        
        <div className="absolute right-6 top-1/2 -translate-y-1/2 mt-1">
          <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black border border-gray-100 hover:bg-gray-100 active:scale-95 transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* Screen 02: Hero Campaign Carousel */}
      <section className="mb-8 mt-1">
        <div ref={carouselRef} className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 px-4 pb-2 scroll-smooth">
          {campaigns.map((campaign, idx) => {
            let targetCategory = 'All';
            if (campaign.image.includes('herobanner1')) targetCategory = 'Barista';
            if (campaign.image.includes('herobanner2')) targetCategory = 'All';
            if (campaign.image.includes('herobanner3')) targetCategory = 'Bake House';

            return (
              <div 
                key={idx}
                onClick={() => navigate('/menu', { state: { mainCategory: targetCategory } })}
                className="relative shrink-0 snap-center w-full aspect-square rounded-[1.5rem] overflow-hidden shadow-sm bg-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <img src={campaign.image} className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Screen 03: Stories / Highlights */}
      <section className="mb-10 pl-4">
        <div className="flex justify-between items-center pr-4 mb-4">
          <h3 className="font-bold text-sm tracking-widest uppercase text-gray-500">Stories</h3>
          <span className="text-xs font-bold text-gray-400">See all &gt;</span>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-2 pr-4">
          {stories.map(story => (
            <button key={story.id} onClick={() => setSelectedStory(story.id)} className="flex flex-col items-center gap-2 snap-start shrink-0 relative">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary to-orange-400">
                <div className="w-full h-full rounded-full border-2 border-[var(--color-background)] overflow-hidden">
                  <img src={story.image} className="w-full h-full object-cover" />
                </div>
              </div>
              {story.badge && (
                <span className="absolute bottom-6 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border-2 border-[var(--color-background)]">
                  {story.badge}
                </span>
              )}
              <span className="text-xs font-medium">{story.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Screen 04: Trending This Week */}
      <section className="mb-10">
        <div className="flex justify-between items-end px-4 mb-3">
          <h3 className="font-extrabold text-[22px] font-heading tracking-tight text-gray-900 leading-none">Trending This Week</h3>
          <span className="text-xs font-bold text-gray-400 mb-0.5">See all &gt;</span>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x px-4 pb-4">
          {getBestSellers().map((product, i) => renderProductCard(product, i, 'TRENDING'))}
        </div>
      </section>

      {/* Screen 05: New Arrivals */}
      <section className="mb-10">
        <div className="flex justify-between items-end px-4 mb-3">
          <h3 className="font-extrabold text-[22px] font-heading tracking-tight text-gray-900 leading-none">New Arrivals</h3>
          <span className="text-xs font-bold text-gray-400 mb-0.5">See all &gt;</span>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x px-4 pb-4">
          {getNewLaunches().map((product, i) => renderProductCard(product, i, 'NEW'))}
        </div>
      </section>

      {/* Pop O Bob Bake House */}
      <section className="mb-10">
        <div className="flex justify-between items-end px-4 mb-3">
          <h3 className="font-extrabold text-[22px] font-heading tracking-tight text-gray-900 leading-none">Pop O Bob Bake House</h3>
          <span className="text-xs font-bold text-gray-400 mb-0.5">See all &gt;</span>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x px-4 pb-4">
          {getBakeHouseItems().map((product, i) => renderProductCard(product, i))}
        </div>
      </section>

      {/* Pop O Bob Barista */}
      <section className="mb-10">
        <div className="flex justify-between items-end px-4 mb-3">
          <h3 className="font-extrabold text-[22px] font-heading tracking-tight text-gray-900 leading-none">Pop O Bob Barista</h3>
          <span className="text-xs font-bold text-gray-400 mb-0.5">See all &gt;</span>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x px-4 pb-4">
          {getBaristaItems().map((product, i) => renderProductCard(product, i))}
        </div>
      </section>

      {/* Screen 06: Offers Snippet */}
      <section className="px-4 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg font-heading uppercase tracking-wider text-[var(--color-foreground)]">Offers</h3>
          <span className="text-xs font-bold text-gray-400">See all &gt;</span>
        </div>
        <div className="bg-[#FFF5F5] rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 opacity-20 rotate-12">
             {/* Using an emoji placeholder since we have no complex vector art */}
             <span className="text-[120px]">🎁</span>
          </div>
          <div className="relative z-10 w-2/3">
            <h4 className="font-extrabold text-xl mb-1">{offers[0].title}</h4>
            <p className="text-xs font-bold text-red-500 mb-2">{offers[0].description}</p>
            <p className="text-[12px] text-gray-500 mb-4">{offers[0].validUntil}</p>
            <button className="bg-primary text-primary-foreground text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-1 shadow-md">
              Order Now <span className="text-[12px]">&rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* Screen 07: Drink Of The Week */}
      <section className="px-4 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg font-heading uppercase tracking-wider text-[var(--color-foreground)]">Drink Of The Week</h3>
        </div>
        <div className="bg-[var(--color-foreground)] rounded-[1.5rem] p-5 text-white relative overflow-hidden flex flex-col justify-between aspect-[4/3]">
          <div className="relative z-10">
            <h4 className="font-extrabold text-2xl font-heading mb-1">{MENU[1]?.name.split(' ')[0]}<br/>{MENU[1]?.name.split(' ').slice(1).join(' ')}</h4>
            <p className="text-white/60 text-[13px] w-[55%] line-clamp-3 mb-2">{MENU[1]?.story}</p>
            <div className="flex items-center gap-1 text-primary text-[13px] font-bold mb-3">
              <Star size={10} className="fill-primary" /> {MENU[1]?.rating} ({MENU[1]?.ordersToday || '1.2k'} reviews)
            </div>
            <p className="font-bold text-lg mb-3">₹{MENU[1]?.price}</p>
            <button onClick={() => MENU[1] && setSelectedProduct(MENU[1])} className="bg-primary text-[var(--color-primary-foreground)] text-[13px] font-bold px-5 py-2.5 rounded-full flex items-center gap-1 w-max">
              Order Now <span className="text-[12px]">&rarr;</span>
            </button>
          </div>
          <img src={MENU[1]?.image || 'https://images.unsplash.com/photo-1558857563-b37102e95cb4?auto=format&fit=crop&q=80&w=800'} className="absolute right-0 top-0 w-[55%] h-full object-cover" style={{ maskImage: 'linear-gradient(to right, transparent, black 25%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%)' }} />
        </div>
      </section>

      {/* Screen 08: Best Combos */}
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
      
      {/* AI Recommender Intercept */}
      <section className="px-4 mb-10">
        <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-br from-primary/40 via-white to-gray-50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/10">
          <div className="bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-xl rounded-[2rem] p-6 flex items-center gap-4 relative z-10">
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center bg-white border border-primary/10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] shrink-0">
              <span className="text-2xl">✨</span>
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-[13px] mb-1 tracking-widest uppercase bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">New Here?</h4>
              <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">Ask our POB AI to find your perfect match!</p>
            </div>
            <button onClick={() => navigate('/quiz')} className="bg-[var(--color-premium-dark)] text-white text-[13px] font-extrabold px-4 py-2.5 rounded-full shrink-0 flex items-center gap-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-gray-800 hover:scale-105 transition-all uppercase tracking-wider">
              POB AI <span className="text-primary text-sm">✦</span>
            </button>
          </div>
        </div>
      </section>

      {/* Fullscreen Story Modal (Screen 03 details) */}
      <AnimatePresence>
        {selectedStory && (
          <StoryModal 
            storyId={selectedStory} 
            onClose={() => setSelectedStory(null)} 
          />
        )}
      </AnimatePresence>

      <CustomizerSheet 
        product={selectedProduct} 
        isOpen={selectedProduct !== null} 
        onClose={() => setSelectedProduct(null)} 
      />

    </div>
  );
}
