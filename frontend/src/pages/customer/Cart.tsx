import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Ticket, Wallet } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { getStoreSettings } from '../../api';

export default function Cart() {
  const navigate = useNavigate();
  const cartStore = useCartStore();
  const { user } = useAuthStore();

  const cartItems = cartStore.items;
  const subtotal = cartStore.getSubtotal();
  
  const [storeSettings, setStoreSettings] = useState({ taxRate: 5, deliveryFee: 40, packingCharge: 15 });
  const [usePoints, setUsePoints] = useState(false);
  
  useEffect(() => {
    getStoreSettings().then(setStoreSettings).catch(console.error);
  }, []);

  // Boba Wallet Math
  const loyaltyPoints = user?.loyaltyPoints || 0;
  const canUsePoints = loyaltyPoints >= 100;
  const loyaltyDiscount = usePoints ? Math.floor(loyaltyPoints / 10) : 0;

  const taxes = Math.round((subtotal - loyaltyDiscount) * (storeSettings.taxRate / 100)); 
  const total = Math.max(0, subtotal - loyaltyDiscount + taxes + storeSettings.packingCharge);

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

        {/* Boba Wallet */}
        {user && (
          <div className={`rounded-3xl p-5 border shadow-sm transition-all ${usePoints ? 'bg-[#FFFBF2] border-[#FFB300]/30' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${usePoints ? 'bg-[#FFB300] text-white' : 'bg-gray-50 text-gray-400'}`}>
                  <Wallet size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base flex items-center gap-2">
                    Boba Wallet
                    <span className="text-[10px] font-extrabold uppercase bg-black text-[#FFB300] px-2 py-0.5 rounded-full">
                      {loyaltyPoints} PTS
                    </span>
                  </h4>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {canUsePoints ? `You can save ₹${Math.floor(loyaltyPoints / 10)} on this order!` : 'Earn 100 pts to unlock discounts.'}
                  </p>
                </div>
              </div>
              
              {canUsePoints && (
                <button 
                  onClick={() => setUsePoints(!usePoints)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${usePoints ? 'bg-[#FFB300]' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${usePoints ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bill Details */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h4 className="font-bold text-base mb-4 uppercase tracking-widest text-gray-500">Bill Details</h4>
          
          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-[#FF8F00] font-bold">
                <span>Points Used ({loyaltyPoints} pts)</span>
                <span>-₹{loyaltyDiscount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Taxes</span>
              <span className="font-bold">₹{taxes}</span>
            </div>
            {storeSettings.packingCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Packaging Fee</span>
                <span className="font-bold">₹{storeSettings.packingCharge}</span>
              </div>
            )}
            
            <div className="w-full h-[1px] bg-gray-100 my-4" />
            
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-black text-2xl text-[var(--color-premium-dark)]">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h4 className="font-bold text-base uppercase tracking-widest text-gray-500">Order Details</h4>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe" 
              value={cartStore.customerName || user?.username || ''}
              onChange={(e) => cartStore.setCustomerName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Table Number</label>
            <input 
              type="text" 
              placeholder="e.g. 5" 
              value={cartStore.tableNumber}
              onChange={(e) => cartStore.setTableNumber(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input 
              type="tel" 
              placeholder="e.g. 9876543210" 
              value={cartStore.customerPhone}
              onChange={(e) => cartStore.setCustomerPhone(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
            />
          </div>
        </div>

      </main>

      {/* Footer pinned to the bottom of the flex container */}
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 pb-24 flex gap-4 z-20 mt-auto shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
         <div className="flex flex-col justify-center px-2">
           <span className="text-[12px] text-gray-500 font-bold uppercase tracking-widest">Total Pay</span>
           <span className="font-black text-2xl leading-none text-gray-900">₹{total}</span>
         </div>
          <button 
            onClick={async () => {
              if (cartItems.length === 0) return;
              if (!cartStore.customerName && !user?.username) {
                alert("Please enter your name!");
                return;
              }
              if (!cartStore.tableNumber) {
                alert("Please enter your table number or scan the QR code again.");
                return;
              }
              
              try {
                const { createRazorpayOrder, placeOrder, getUserProfile } = await import('../../api');
                
                // 1. Ask backend to generate a Razorpay Order ID
                const rzpOrder = await createRazorpayOrder(total);
                
                // 2. Configure Razorpay Options
                const options = {
                    key: 'rzp_test_T4aQ5u6TRc7G0O',
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    name: 'Pop O Bob',
                    description: 'Premium Order Payment',
                    order_id: rzpOrder.id,
                    handler: async function (response: any) {
                        // 3. Payment Success - Place the actual order!
                        try {
                            const orderPayload: any = {
                              customerName: cartStore.customerName || user?.username,
                              customerPhone: cartStore.customerPhone,
                              tableNumber: cartStore.tableNumber,
                              paymentReference: response.razorpay_payment_id,
                              pointsUsed: usePoints ? loyaltyPoints : 0,
                              items: cartItems.map(item => ({
                                productId: item.product.id,
                                productName: item.product.name,
                                price: item.price,
                                quantity: item.quantity,
                                subtotal: item.price * item.quantity,
                                customizations: item.customization
                              }))
                            };
                            
                            if (user) orderPayload.userId = user.id;
                            
                            const result = await placeOrder(orderPayload);
                            
                            if (user) {
                               try {
                                 const updatedUser = await getUserProfile(user.id);
                                 if (updatedUser) useAuthStore.getState().setUser(updatedUser);
                               } catch (e) {}
                            }
            
                            cartStore.clearCart();
                            navigate(`/tracking/${result.id}`);
                        } catch (error: any) {
                            console.error("Failed to place order after payment", error);
                            alert("Payment succeeded but order placement failed! Please contact staff.");
                        }
                    },
                    prefill: {
                        name: cartStore.customerName || user?.username || '',
                        contact: cartStore.customerPhone || '',
                        email: user?.email || ''
                    },
                    theme: { color: '#000000' }
                };
                
                // Open Razorpay
                const rzp = new (window as any).Razorpay(options);
                rzp.on('payment.failed', function (response: any) {
                    alert("Payment Failed! " + response.error.description);
                });
                rzp.open();

              } catch (error: any) {
                console.error("Failed to initialize payment", error);
                alert("Could not connect to payment gateway.");
              }
            }} 
            className="flex-1 bg-[var(--color-premium-dark)] text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 transition-transform border border-black/10 hover:bg-[var(--color-premium-dark)]"
          >
            Checkout & Pay
          </button>
      </div>

    </div>
  );
}
