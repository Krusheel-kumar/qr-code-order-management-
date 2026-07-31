import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, ArrowRight } from 'lucide-react';
import type { MenuItem } from '../../data/menu';
import type { Campaign, Story, DiscoverySection, Combo } from '../../data/models';
import { shareContent } from '../../utils/shareUtils';

export interface DesktopDiscoveryHomeProps {
  campaigns: Campaign[];
  stories: Story[];
  discoverySections: DiscoverySection[];
  MENU: MenuItem[];
  featuredProduct?: MenuItem;
  combos: Combo[];
  onProductClick: (product: MenuItem) => void;
  onStoryClick: (storyId: string) => void;
  onOpenSearch: () => void;
  onOpenAI: () => void;
  onOpenCart: () => void;
}

export default function DesktopDiscoveryHome({
  campaigns,
  stories,
  discoverySections,
  MENU,
  featuredProduct,
  combos,
  onProductClick,
  onStoryClick,
  onOpenAI
}: DesktopDiscoveryHomeProps) {
  const navigate = useNavigate();
  const [activeCampaignIdx, setActiveCampaignIdx] = useState(0);
  const activeCampaign = campaigns[activeCampaignIdx] || null;

  // Use featuredProduct fallback or first item
  const spotlightProduct = featuredProduct || MENU[0];

  const handleCampaignClick = (campaign: Campaign | null) => {
    if (!campaign) {
      if (spotlightProduct) onProductClick(spotlightProduct);
      return;
    }
    if (campaign.link) {
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
    } else if (spotlightProduct) {
      onProductClick(spotlightProduct);
    }
  };

  const handleShareProduct = (e: React.MouseEvent, product: MenuItem) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/menu?p=${product.id}`;
    shareContent({
      title: `Try ${product.name} at POP O'BOB®!`,
      text: product.story || '',
      url: shareUrl,
      imageUrl: product.image,
    }, () => {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    });
  };

  return (
    <div className="w-full font-sans text-[#1A0B05] pt-8 pb-20 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO CAMPAIGNS SECTION (Massive Pure Image Banner) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-6 xl:px-12 mb-16 lg:mb-24">
        <div 
          onClick={() => handleCampaignClick(activeCampaign)}
          className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[2.5/1] rounded-[2rem] lg:rounded-[3rem] overflow-hidden group cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-black/5"
        >
          {/* Main Image Banner */}
          <img
            src={activeCampaign?.image || spotlightProduct?.image || 'https://images.unsplash.com/photo-1558857563-b37102e95cb4?auto=format&fit=crop&q=80&w=2400'}
            alt="Promotion"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
          />

          {/* Subtle gradient overlay at the bottom so the button pops clearly */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

          {/* Single "Order Now" Button overlay */}
          <div className="absolute inset-0 flex items-end justify-center pb-8 lg:pb-12 pointer-events-none z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCampaignClick(activeCampaign);
              }}
              className="pointer-events-auto bg-[#1A0B05]/90 hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] px-10 py-4 lg:px-14 lg:py-4 rounded-full font-black text-xs lg:text-sm uppercase tracking-[0.2em] shadow-2xl transition-all transform hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] backdrop-blur-md border border-white/20"
            >
              Order Now
            </button>
          </div>
        </div>

        {/* Campaign Indicator Dots (Only if > 1 campaign) */}
        {campaigns.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {campaigns.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCampaignIdx(idx)}
                className={`transition-all rounded-full ${activeCampaignIdx === idx ? 'w-10 h-2 bg-[#1A0B05] shadow-sm' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. HIGHLIGHTS (Exact Wording & Content from Mobile) */}
      {/* ========================================================================= */}
      {stories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 xl:px-12 mb-20 lg:mb-32">
          {/* Header */}
          <div className="flex items-end justify-between mb-8 xl:mb-10">
            <div>
              <h2 className="text-3xl xl:text-4xl font-black text-[#1A0B05] tracking-tight">
                Highlights
              </h2>
            </div>
            <button
              onClick={() => stories[0] && onStoryClick(stories[0].id)}
              className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1A0B05] transition-colors"
            >
              View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 xl:gap-6">
            {stories.map((story) => (
              <motion.button
                key={story.id}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStoryClick(story.id)}
                className="relative aspect-[3/4] xl:aspect-[4/5] rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* Full Background Image */}
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />

                {/* Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Card Content Overlay */}
                <div className="absolute inset-0 p-5 xl:p-6 flex flex-col justify-between text-left">
                  {/* Top: Badges */}
                  <div className="flex justify-end">
                    {story.badge && (
                      <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.1em] shadow-sm border border-white/30">
                        {story.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Bottom: Typography */}
                  <div className="mt-auto">
                    <h3 className="text-white font-bold text-base xl:text-lg leading-tight tracking-wide drop-shadow-md">
                      {story.title}
                    </h3>
                    {/* Animated Accent Line */}
                    <div className="w-0 h-[2px] bg-[#D4AF37] mt-3 group-hover:w-8 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. PRODUCT DISCOVERY SECTIONS */}
      {/* ========================================================================= */}
      {discoverySections.map((section) => {
        const sectionProducts = (section.products || [])
          .map((sp: any) => {
            const localProduct = MENU.find(m => m.id === sp.id);
            if (localProduct) return localProduct;
            return {
              id: sp.id,
              name: sp.name,
              price: sp.price,
              category: typeof sp.category === 'string' ? sp.category : (sp.category?.name || ''),
              image: sp.imageUrl || sp.image || '',
            } as MenuItem;
          })
          .filter(Boolean) as MenuItem[];

        if (sectionProducts.length === 0) return null;

        return (
          <section key={section.id} className="max-w-[1440px] mx-auto px-8 xl:px-12 mb-20">
            <div className="flex items-end justify-between mb-8 border-b border-black/5 pb-4">
              <h2 className="text-3xl xl:text-4xl font-black text-[#1A0B05] tracking-tight">
                {section.title}
              </h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                See all &gt;
              </span>
            </div>

            <div className="grid grid-cols-4 gap-8">
              {sectionProducts.map((product, idx) => {
                const badgeText = product.badge || (idx === 0 ? 'Best Seller' : undefined);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    onClick={() => onProductClick(product)}
                    className="bg-white rounded-[2.2rem] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.09)] transition-all duration-500 overflow-hidden flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="w-full aspect-[4/3] bg-gradient-to-b from-[#FFFDF8] to-[#F5EBE0]/60 relative overflow-hidden">
                      {badgeText && (
                        <div className="absolute top-4 left-4 z-10 bg-[#1A0B05] text-[#FFC461] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                          {badgeText}
                        </div>
                      )}
                      <button
                        onClick={(e) => handleShareProduct(e, product)}
                        className="absolute top-4 right-4 z-10 bg-white/70 backdrop-blur-md hover:bg-white text-gray-800 p-2.5 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
                        title="Share Creation"
                      >
                        <Share2 size={14} />
                      </button>
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1558857563-b37102e95cb4?auto=format&fit=crop&q=80&w=800'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        {product.category && (
                          <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">
                            {product.category.replace('cat_', '')}
                          </span>
                        )}
                        <h3 className="text-lg font-black text-[#1A0B05] tracking-tight mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                          {product.story || ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-black/5">
                        <div>
                          <span className="text-2xl font-black text-[#1A0B05]">
                            ₹{Math.round(Number(product.price))}
                          </span>
                          {product.rating && (
                            <span className="text-[11px] font-bold text-gray-400 block mt-0.5">
                              ★ {product.rating}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onProductClick(product);
                          }}
                          className="bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* ========================================================================= */}
      {/* 4. BEST COMBOS SECTION (Exact Mobile Wording) */}
      {/* ========================================================================= */}
      {combos.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-8 xl:px-12 mb-20">
          <div className="flex items-end justify-between mb-8 border-b border-black/5 pb-4">
            <h2 className="text-3xl xl:text-4xl font-black text-[#1A0B05] tracking-tight">
              Best Combos
            </h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              See all &gt;
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="bg-white p-6 rounded-[2.2rem] flex items-center gap-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.08)] transition-all group"
              >
                <img src={combo.image} alt={combo.title} className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                <div className="flex-1 py-1">
                  <h4 className="font-black text-lg text-[#1A0B05] leading-tight mb-1">{combo.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">Combo</p>
                  <span className="font-black text-xl text-[#1A0B05]">₹{Math.round(Number(combo.price))}</span>
                </div>
                <button
                  className="bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0 transition-colors shadow-sm"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. DRINK OF THE WEEK (Exact Mobile Content) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-8 xl:px-12 mb-20">
        <div className="rounded-[3rem] bg-gradient-to-r from-[#5A3825] to-[#3E2312] text-white overflow-hidden shadow-2xl relative flex flex-col lg:flex-row group border border-white/10">
          
          {/* Left: Content (60%) */}
          <div className="lg:w-[60%] p-10 xl:p-14 flex flex-col justify-center relative z-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6 w-fit shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4AF37]">
                Spotlight
              </span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.1] mb-2">
              Drink Of The <span className="text-[#D4AF37]">Week</span>
            </h2>

            <h3 className="text-2xl font-bold text-[#FFC461] mb-8">
              {spotlightProduct?.name}
            </h3>

            <p className="text-white/80 text-base leading-relaxed max-w-xl mb-10 font-medium">
              {spotlightProduct?.story}
            </p>

            <div className="flex items-center gap-8">
              <span className="text-4xl font-black text-white block">
                ₹{Math.round(Number(spotlightProduct?.price || 349))}
              </span>

              <button
                onClick={() => spotlightProduct && onProductClick(spotlightProduct)}
                className="bg-[#D4AF37] hover:bg-white text-[#1A0B05] px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <span>Order Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Image (40% Full Bleed) */}
          <div className="lg:w-[40%] relative min-h-[400px] lg:min-h-full">
            <div className="absolute inset-0 bg-[#D4AF37]/10 mix-blend-overlay z-10 pointer-events-none"></div>
            
            {/* Desktop Gradient Fade to blend the straight edge */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#3E2312] to-transparent z-10 hidden lg:block pointer-events-none"></div>
            
            {/* Mobile Gradient Fade */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#3E2312] to-transparent z-10 lg:hidden pointer-events-none"></div>

            <img
              src={spotlightProduct?.image || 'https://images.unsplash.com/photo-1558857563-b37102e95cb4?auto=format&fit=crop&q=80&w=800'}
              alt={spotlightProduct?.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
              onClick={() => spotlightProduct && onProductClick(spotlightProduct)}
            />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. AI RECOMMENDER BANNER (Exact Mobile Content & Wording) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-8 xl:px-12 mb-20">
        <motion.div 
          whileHover={{ scale: 1.01, y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={onOpenAI}
          className="relative rounded-[2.5rem] p-10 xl:p-12 overflow-hidden shadow-2xl cursor-pointer group flex items-center justify-between bg-gradient-to-r from-[#8E5E35] to-[#5A3825] border border-white/10"
        >
          {/* Subtle Gold Blur Background */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-[60px] pointer-events-none" />

          {/* Left: Content & Headline */}
          <div className="relative z-10 flex flex-col gap-3">
            <div className="bg-white/20 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm w-fit">
              <span className="text-base">🪄</span>
              <span className="text-white text-[11px] font-black tracking-[0.2em] uppercase">POB AI Assistant</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-[1.1] mt-2">
              Not sure what to order?
            </h2>

            <p className="text-[#FFC461] text-sm font-bold flex items-center gap-2 uppercase tracking-widest mt-1">
              Let AI build your perfect cup <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </p>
          </div>

          {/* Right: Interactive Action Button */}
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 xl:w-20 xl:h-20 bg-white text-[#5A3825] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all">
              <span className="text-4xl drop-shadow-sm">🤖</span>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
