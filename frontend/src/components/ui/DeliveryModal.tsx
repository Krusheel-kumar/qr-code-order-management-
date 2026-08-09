import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeliveryModal({ isOpen, onClose }: DeliveryModalProps) {
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A0B05]/40 backdrop-blur-sm z-[10000]"
          />
          
          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#FDFCF9] rounded-t-[32px] p-6 pb-10 z-[10001] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col font-sans"
          >
            {/* Handle bar for visual cue */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 active:scale-95 transition-all z-10"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <div className="mb-6 pr-12">
              <h2 className="text-3xl font-black text-[#1A0B05] leading-tight font-heading mb-1">
                Delivery Partners
              </h2>
              <p className="text-gray-500 font-medium text-[15px]">
                Order your favorite bubble tea right to your doorstep.
              </p>
            </div>

            {/* Premium Content Cards */}
            <div className="flex flex-col gap-4 relative z-20">
              {/* Zomato Card */}
              {/* Zomato Card */}
              <button 
                onClick={() => window.location.href = 'https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe'}
                className="w-full bg-white p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(226,55,68,0.12)] hover:border-[#E23744]/30 active:scale-[0.98] transition-all flex items-center gap-5 group relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="w-[60px] h-[60px] rounded-[18px] bg-[#E23744] flex items-center justify-center shrink-0 shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-500 relative z-10">
                  <span className="text-white text-[32px] font-black italic mt-1 pr-1">z</span>
                </div>
                
                <div className="flex flex-col items-start text-left flex-1 relative z-10 py-1">
                  <span className="text-[20px] font-black tracking-tight text-gray-900 leading-none mb-2">Zomato</span>
                  <span className="text-[10px] font-black text-[#E23744] tracking-widest uppercase bg-red-50/80 px-2.5 py-1 rounded-md border border-red-100/50">Order Here</span>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center relative z-10 shrink-0 group-hover:bg-[#E23744] transition-colors border border-gray-100 group-hover:border-[#E23744]">
                  <span className="text-xl text-gray-400 group-hover:text-white transform group-hover:translate-x-0.5 transition-all">&rarr;</span>
                </div>
              </button>
              
              {/* Swiggy Card */}
              <button 
                onClick={() => window.location.href = 'https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe'}
                className="w-full bg-white p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(252,128,25,0.12)] hover:border-[#FC8019]/30 active:scale-[0.98] transition-all flex items-center gap-5 group relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="w-[60px] h-[60px] rounded-[18px] bg-[#FC8019] flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-500 relative z-10">
                  <span className="text-white text-[32px] font-black mb-1">S</span>
                </div>
                
                <div className="flex flex-col items-start text-left flex-1 relative z-10 py-1">
                  <span className="text-[20px] font-black tracking-tight text-gray-900 leading-none mb-2">Swiggy</span>
                  <span className="text-[10px] font-black text-[#FC8019] tracking-widest uppercase bg-orange-50/80 px-2.5 py-1 rounded-md border border-orange-100/50">Order Here</span>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center relative z-10 shrink-0 group-hover:bg-[#FC8019] transition-colors border border-gray-100 group-hover:border-[#FC8019]">
                  <span className="text-xl text-gray-400 group-hover:text-white transform group-hover:translate-x-0.5 transition-all">&rarr;</span>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
