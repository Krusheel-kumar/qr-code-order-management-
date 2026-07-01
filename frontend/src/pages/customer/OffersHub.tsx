import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Tag, Copy, Gift, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Offers Data tailored for a Bubble Tea brand
const brandOffers = [
  {
    id: 'o1',
    title: 'BOGO BOBA',
    subtitle: 'Buy 1 Get 1 Free on all Classic Milk Teas',
    code: 'BOGOBA',
    validUntil: 'Every Thursday, 2 PM - 6 PM',
    bgColor: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    icon: <Gift className="w-8 h-8 text-white/90" />,
    popular: true,
  },
  {
    id: 'o2',
    title: 'FLAT 50% OFF',
    subtitle: "On your first order! Welcome to POP O'BOB®.",
    code: 'WELCOME50',
    validUntil: 'Valid for new users only',
    bgColor: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    icon: <Sparkles className="w-8 h-8 text-white/90" />,
    popular: false,
  },
  {
    id: 'o3',
    title: 'FREE UPSIZE',
    subtitle: 'Upgrade any Regular drink to Large for free!',
    code: 'UPSIZE',
    validUntil: 'Valid till end of month',
    bgColor: 'bg-gradient-to-br from-pink-500 to-rose-500',
    icon: <Tag className="w-8 h-8 text-white/90" />,
    popular: false,
  },
  {
    id: 'o4',
    title: 'STUDENT SPECIAL',
    subtitle: 'Show your Student ID at pickup & get 15% OFF.',
    code: 'STUDENT15',
    validUntil: 'Always Valid',
    bgColor: 'bg-gradient-to-br from-amber-400 to-orange-500',
    icon: <Clock className="w-8 h-8 text-white/90" />,
    popular: false,
  }
];

export default function OffersHub() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF2] flex flex-col font-sans pb-[100px]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-5 pt-6 pb-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Special Offers</h1>
        <div className="w-10" />
      </div>

      <div className="p-5 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">Exclusive<br/><span className="text-[#FF9800]">Deals & Rewards</span></h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">Apply these codes at checkout to save!</p>
        </div>

        <div className="flex flex-col gap-5">
          {brandOffers.map((offer, idx) => (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative overflow-hidden rounded-[1.5rem] shadow-lg ${offer.bgColor} text-white p-6`}
            >
              {offer.popular && (
                <div className="absolute top-0 right-0 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider">
                  Trending
                </div>
              )}
              
              {/* Decorative Circle */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  {offer.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight mb-1">{offer.title}</h3>
                  <p className="text-white/80 text-sm leading-snug font-medium mb-3">{offer.subtitle}</p>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/70 mb-4">
                    <Clock size={12} />
                    <span>{offer.validUntil}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="mt-2 pt-4 border-t border-white/20 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Code:</span>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-lg font-mono font-bold text-lg tracking-wider border-dashed">
                    {offer.code}
                  </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(offer.code)}
                  className="flex items-center gap-1.5 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-transform"
                >
                  {copiedCode === offer.code ? (
                    <span className="text-emerald-600">Copied!</span>
                  ) : (
                    <>
                      <Copy size={16} /> Copy
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loyalty Program Teaser */}
        <div className="mt-8 bg-white border border-gray-100 rounded-[1.5rem] p-5 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">POP O'BOB® Rewards</h4>
              <p className="text-xs text-gray-500 font-medium">Earn points on every sip!</p>
            </div>
          </div>
          <ArrowRight className="text-gray-300" />
        </div>
      </div>
    </div>
  );
}
