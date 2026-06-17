import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function FloatingCartButton() {
  const navigate = useNavigate();
  const cartStore = useCartStore();
  
  const cartCount = cartStore.items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartStore.getSubtotal();

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="fixed bottom-[90px] left-0 right-0 z-40 pointer-events-none flex justify-center"
        >
          <div 
            onClick={() => navigate('/cart')}
            className="pointer-events-auto bg-primary text-primary-foreground py-3 px-5 rounded-full flex justify-center items-center gap-4 shadow-[0_10px_25px_rgba(255,213,79,0.5)] cursor-pointer active:scale-95 transition-transform border border-primary/20"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} strokeWidth={2.5} />
              <span className="font-bold text-sm tracking-tight">{cartCount} Item{cartCount > 1 ? 's' : ''}</span>
            </div>
            
            <div className="w-[1.5px] h-4 bg-black/15 rounded-full" />
            
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight">₹{cartTotal.toFixed(2)}</span>
              <span className="text-lg font-bold leading-none mb-0.5">&rarr;</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
