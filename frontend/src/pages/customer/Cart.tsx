import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Ticket } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function Cart() {
  const navigate = useNavigate();
  const cartStore = useCartStore();

  const cartItems = cartStore.items;
  const subtotal = cartStore.getSubtotal();
  const discount = 0; 
  const taxes = Math.round(subtotal * 0.05); 
  const total = subtotal - discount + taxes;

  return (
    <div className="min-h-screen pb-28 bg-[var(--color-background)] font-sans flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center -ml-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-heading font-extrabold text-xl uppercase tracking-wide">Your Cart</h1>
        </div>
        <button onClick={cartStore.clearCart} className="w-10 h-10 flex items-center justify-center -mr-2 bg-gray-50 rounded-full text-red-500 active:scale-95 transition-transform">
          <Trash2 size={18} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        
        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white rounded-3xl p-4 flex gap-4 border border-gray-100 shadow-sm relative">
              <img src={item.product.image} className="w-20 h-20 rounded-2xl object-cover bg-gray-50" />
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-base text-[var(--color-foreground)] leading-tight w-2/3">{item.product.name}</h4>
                  <span className="font-bold text-base">₹{item.price}</span>
                </div>
                <p className="text-[12px] text-gray-500 leading-tight mb-3 w-3/4">{item.customization}</p>
                
                <div className="flex items-center justify-between w-full">
                  <button className="text-[12px] font-bold text-primary underline" onClick={() => cartStore.removeItem(item.id)}>Remove</button>
                  
                  <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
                    <button onClick={() => cartStore.updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold active:bg-gray-200 rounded-full">-</button>
                    <span className="font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => cartStore.updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold active:bg-gray-200 rounded-full">+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {cartItems.length === 0 && (
            <div className="text-center py-10 text-gray-400 font-bold">Your cart is empty</div>
          )}
        </div>

        {/* Promo Code */}
        <div className="bg-white border border-gray-200 border-dashed rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Ticket size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-base">Apply Coupon</h4>
            <p className="text-[12px] text-gray-500">Save more on your order</p>
          </div>
          <button className="text-sm font-bold text-primary uppercase tracking-widest px-3 py-1.5 bg-primary/10 rounded-full">
            Apply
          </button>
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h4 className="font-bold text-base mb-4 uppercase tracking-widest text-gray-500">Bill Details</h4>
          
          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount</span>
                <span className="font-bold">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Taxes & Fees</span>
              <span className="font-bold">₹{taxes}</span>
            </div>
            
            <div className="w-full h-[1px] bg-gray-100 my-4" />
            
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl">₹{total}</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer pinned to the bottom of the flex container */}
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 pb-24 flex gap-4 z-20 mt-auto shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
         <div className="flex flex-col justify-center px-2">
           <span className="text-[12px] text-gray-500 font-bold uppercase tracking-widest">Total Pay</span>
           <span className="font-bold text-xl leading-none text-gray-900">₹{total}</span>
         </div>
          <button onClick={() => {
            if (cartItems.length > 0) {
              cartStore.clearCart();
              navigate(`/tracking/${Math.floor(Math.random() * 9000) + 1000}`);
            }
          }} className="flex-1 bg-[var(--color-premium-dark)] text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 transition-transform border border-black/10 hover:bg-[var(--color-premium-dark)]">
            Checkout & Pay
          </button>
      </div>

    </div>
  );
}
