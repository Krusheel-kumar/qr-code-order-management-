import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, Gift, Sparkles, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { useMenuStore } from '../../store/useMenuStore';

export default function OffersHub() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { coupons } = useMenuStore();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  
  const activeCoupons = coupons?.filter(c => c.active !== false) || [];

  return (
    <div className="min-h-[100dvh] bg-[#FDFCF9] flex flex-col font-sans pb-[100px]">
      {/* Header */}
      <div className="bg-[#1A0B05] px-6 pt-10 pb-6 flex flex-col justify-end sticky top-0 z-20 rounded-b-[2rem] shadow-xl shadow-[#1A0B05]/10">
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Special Offers</p>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none">Exclusive Deals</h1>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 xl:p-12 overflow-y-auto max-w-[1440px] mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-[#1A0B05] leading-tight">Unlock Your<br/><span className="text-[#D4AF37]">Rewards</span></h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">Apply these exclusive codes at checkout to save on your next order!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCoupons.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
              <Gift className="w-16 h-16 mx-auto mb-4 text-gray-200" />
              <h3 className="text-[#1A0B05] font-black text-xl mb-1">No active offers</h3>
              <p className="text-gray-500 font-medium">Check back soon for new exclusive deals!</p>
            </div>
          )}

          {activeCoupons.map((offer, idx) => {
            const isHero = idx === 0;
            
            if (isHero) {
              return (
                <motion.div 
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="col-span-1 md:col-span-2 lg:col-span-3 relative overflow-hidden rounded-[2rem] bg-[#1A0B05] text-white p-8 md:p-10 shadow-[0_15px_40px_rgba(26,11,5,0.15)] group"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[60px] pointer-events-none transition-colors" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-3 py-1.5 rounded-full mb-6">
                        <Tag size={14} className="text-[#D4AF37]" />
                        <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Featured Offer</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-white">
                        {offer.type === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                      </h3>
                      <p className="text-white/60 text-base font-medium mb-6 max-w-md">
                        Use this code to get a discount on orders above ₹{offer.minOrderAmount}. Valid for a limited time only.
                      </p>
                      
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 pl-5 pr-2 py-2 rounded-full">
                          <span className="text-sm font-bold text-white/80 uppercase tracking-widest mr-2">Code:</span>
                          <div className="bg-[#D4AF37] text-[#1A0B05] px-4 py-1.5 rounded-full font-black text-lg tracking-wider">
                            {offer.code}
                          </div>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(offer.code)}
                          className="bg-white text-[#1A0B05] hover:bg-[#D4AF37] px-6 py-3.5 rounded-full text-sm font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2"
                        >
                          {copiedCode === offer.code ? (
                            <span>Copied!</span>
                          ) : (
                            <>
                              <Copy size={16} /> <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div 
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative overflow-hidden rounded-[2rem] bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-[#D4AF37]/30 transition-all group"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#FFFBF2] flex items-center justify-center border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">
                    <Gift className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="inline-block bg-[#1A0B05] text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full mb-2">
                      Special Deal
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-[#1A0B05] mb-1">
                      {offer.type === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                    </h3>
                    <p className="text-gray-500 text-xs font-medium">Min Order: ₹{offer.minOrderAmount}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Code</span>
                    <span className="font-black text-[#1A0B05] text-lg tracking-wider border-b-2 border-[#D4AF37]/30 pb-0.5">
                      {offer.code}
                    </span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(offer.code)}
                    className="w-10 h-10 rounded-full bg-[#FFFBF2] text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1A0B05] active:scale-95 transition-all"
                  >
                    {copiedCode === offer.code ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Loyalty Program Teaser */}
        <div className="mt-8 bg-gradient-to-br from-[#1A0B05] to-[#2D1810] rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(26,11,5,0.15)] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform group overflow-hidden relative border border-[#D4AF37]/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-[40px] pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-[#D4AF37] text-[#1A0B05] rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-black text-xl text-white tracking-tight mb-1">POP O'BOB® Rewards</h4>
              <p className="text-xs text-white/70 font-medium">Earn points on every sip!</p>
            </div>
          </div>
          <ArrowRight className="text-[#D4AF37] group-hover:translate-x-1 transition-transform relative z-10" />
        </div>
      </div>
    </div>
  );
}
