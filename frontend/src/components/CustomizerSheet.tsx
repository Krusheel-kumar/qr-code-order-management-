import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MenuItem } from '../data/menu';
import { useCartStore } from '../store/useCartStore';

const MILK_OPTIONS = ['Fresh Milk', 'Soy Milk', 'Non Dairy', 'Oat Milk', 'Almond Milk'];
const ALL_TOPPINGS = [
  'Tapioca Pearls (Boba)', 'Popping Boba (Strawberry)', 'Popping Boba (Mango)', 
  'Lychee Boba', 'Blueberry Boba', 'Chocolate Boba', 'Brown Sugar Jelly', 
  'Mango Jelly', 'Coffee Foam', 'Cheese Foam', 'Whipped Cream'
];

interface CustomizerSheetProps {
  product: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizerSheet({ product, isOpen, onClose }: CustomizerSheetProps) {
  const navigate = useNavigate();
  const cartStore = useCartStore();

  const [size, setSize] = useState('Regular');
  const [milk, setMilk] = useState(MILK_OPTIONS[0]);
  const [freeTopping, setFreeTopping] = useState('');
  const [extraToppings, setExtraToppings] = useState<string[]>([]);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSize('Regular');
      setMilk(MILK_OPTIONS[0]);
      setFreeTopping('');
      setExtraToppings([]);
    }
  }, [product]);

  if (!product) return null;

  let totalPrice = product.price;
  if (size === 'Large') totalPrice += (product.largePriceAddOn || 30);
  totalPrice += (extraToppings.length * 60);

  const handleAddToCart = () => {
    let customizations = [];
    customizations.push(size);
    if (product.category === 'Milk Teas') customizations.push(milk);
    if (freeTopping) customizations.push(`Free: ${freeTopping}`);
    if (extraToppings.length > 0) customizations.push(`Extra: ${extraToppings.join(', ')}`);
    
    cartStore.addItem({
      product: product,
      customization: customizations.join(' | '),
      price: totalPrice,
      quantity: 1
    });
    
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    onClose();
  };

  const toggleExtraTopping = (t: string) => {
    if (extraToppings.includes(t)) {
      setExtraToppings(extraToppings.filter(item => item !== t));
    } else {
      setExtraToppings([...extraToppings, t]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Bottom Sheet Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-[2rem] z-[101] overflow-y-auto hide-scrollbar shadow-2xl flex flex-col"
          >
            {/* Sticky Header with Title and Image */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl px-6 py-4 flex items-center gap-4 border-b border-gray-100 z-20">
              {product.image ? (
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-gray-100 shadow-sm">
                  <img src={product.image} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-gray-100 shadow-sm bg-orange-50 text-orange-300 flex items-center justify-center">
                  <ShoppingBag size={20}/>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-heading font-extrabold text-xl text-foreground line-clamp-1">{product.name}</h3>
                <span className="font-bold text-primary">₹{product.price}</span>
              </div>

              <button 
                onClick={onClose}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-foreground/50 hover:bg-gray-200 active:scale-95 transition-all shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-8 pb-32">
              
              {/* Story */}
              <p className="text-sm text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-2xl italic border border-gray-100">
                "{product.story}"
              </p>

              {/* Size */}
              <div>
                <h4 className="font-bold text-sm text-foreground mb-3 uppercase tracking-widest text-gray-500 text-xs">Size</h4>
                <div className="flex gap-3">
                  {['Regular', 'Large'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSize(s)}
                      className={`flex-1 py-3 rounded-2xl border text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${size === s ? 'border-primary bg-[var(--color-cream)] text-primary-foreground' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                    >
                      {s}
                      <span className="text-[10px] font-medium opacity-60">
                        {s === 'Regular' ? `₹${product.price}` : `₹${product.price + (product.largePriceAddOn || 30)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Choice of Milk (Only for Milk Teas) */}
              {product.category === 'Milk Teas' && (
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-3 uppercase tracking-widest text-gray-500 text-xs">Choice of Milk</h4>
                  <div className="flex flex-col gap-2">
                    {MILK_OPTIONS.map(m => (
                      <button 
                        key={m} 
                        onClick={() => setMilk(m)}
                        className={`w-full py-3.5 px-5 rounded-2xl border text-sm font-bold transition-all flex justify-between items-center ${milk === m ? 'border-primary bg-primary/10 text-primary-foreground shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
                      >
                        {m}
                        {milk === m && <Check size={18} className="text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Choice of Free Topping */}
              <div>
                <h4 className="font-bold text-sm text-foreground mb-1 uppercase tracking-widest text-gray-500 text-xs">Choice of Free Topping</h4>
                <p className="text-[10px] text-gray-400 mb-3">(Choose 1) • Included</p>
                <div className="flex flex-col gap-2">
                   {ALL_TOPPINGS.map(t => {
                      const isSelected = freeTopping === t;
                      const isExtra = extraToppings.includes(t);
                      return (
                        <button 
                          key={t} 
                          onClick={() => {
                              if (isExtra) setExtraToppings(extraToppings.filter(item => item !== t));
                              setFreeTopping(isSelected ? '' : t);
                          }}
                          className={`w-full py-3.5 px-5 rounded-2xl border text-sm font-bold transition-all flex justify-between items-center ${isSelected ? 'border-primary bg-primary/10 text-primary-foreground shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
                        >
                          <span>{t}</span>
                          {isSelected && <Check size={18} className="text-primary" />}
                        </button>
                      )
                   })}
                </div>
              </div>

              {/* Choice of Extra Toppings */}
              <div>
                <h4 className="font-bold text-sm text-foreground mb-1 uppercase tracking-widest text-gray-500 text-xs">Choice of Extra Toppings</h4>
                <p className="text-[10px] text-primary font-bold mb-3">+₹60 each</p>
                <div className="flex flex-col gap-2">
                   {ALL_TOPPINGS.map(t => {
                      const isSelected = extraToppings.includes(t);
                      const isFree = freeTopping === t;
                      return (
                        <button 
                          key={t} 
                          onClick={() => {
                              if (isFree) setFreeTopping('');
                              toggleExtraTopping(t);
                          }}
                          className={`w-full py-3.5 px-5 rounded-2xl border text-sm font-bold transition-all flex justify-between items-center ${isSelected ? 'border-primary bg-primary/10 text-primary-foreground shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
                        >
                          <span>{t}</span>
                          {isSelected && <Check size={18} className="text-primary" />}
                        </button>
                      )
                   })}
                </div>
              </div>
            </div>

            {/* Fixed Add To Cart Button in Drawer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50">
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-[0_8px_20px_rgba(255,213,79,0.3)] active:scale-95 transition-transform flex justify-between items-center px-6 border border-primary/20"
              >
                <span>Add to Cart</span>
                <span className="opacity-90 text-xl tracking-tight font-extrabold">₹{totalPrice}</span>
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
