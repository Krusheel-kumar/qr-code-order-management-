import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Ticket, Wallet } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { getStoreSettings } from '../../api';
import CheckoutAuthGate from '../../components/ui/CheckoutAuthGate';
import AuthModal from '../../components/ui/AuthModal';

export default function Cart() {
  const navigate = useNavigate();
  const cartStore = useCartStore();
  const { user } = useAuthStore();

  const cartItems = cartStore.items;
  const subtotal = cartStore.getSubtotal();
  
  const [storeSettings, setStoreSettings] = useState({ taxRate: 5, deliveryFee: 40, packingCharge: 15 });
  const [usePoints, setUsePoints] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  useEffect(() => {
    getStoreSettings().then(setStoreSettings).catch(console.error);
    import('../../api').then(api => {
      api.getCoupons().then(setCouponsList).catch(console.error);
    });
  }, []);

  // Recalculate coupon discount if subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      const minOrder = appliedCoupon.minOrderAmount || 0;
      if (subtotal < minOrder) {
        setAppliedCoupon(null);
        setCouponDiscount(0);
      } else {
        let discount = 0;
        if (appliedCoupon.type === 'PERCENTAGE' || appliedCoupon.type === 'percentage') {
          discount = subtotal * ((appliedCoupon.value || appliedCoupon.discountValue || 0) / 100);
          if (appliedCoupon.maxDiscount) {
            discount = Math.min(discount, appliedCoupon.maxDiscount);
          }
        } else {
          discount = (appliedCoupon.value || appliedCoupon.discountValue || 0);
        }
        setCouponDiscount(Math.round(discount));
      }
    }
  }, [subtotal, appliedCoupon]);

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    const found = couponsList.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.active);
    if (found) {
      const minOrder = found.minOrderAmount || 0;
      if (subtotal < minOrder) {
        alert(`This coupon code requires a minimum order of ₹${minOrder}`);
        return;
      }
      setAppliedCoupon(found);
      setCouponCode('');
    } else {
      alert('Invalid or expired coupon code');
    }
  };

  // Boba Wallet Math
  const loyaltyPoints = user?.loyaltyPoints || 0;
  const canUsePoints = loyaltyPoints >= 100;
  const loyaltyDiscount = usePoints ? Math.floor(loyaltyPoints / 10) : 0;

  const totalDiscount = loyaltyDiscount + couponDiscount;
  const taxes = Math.round((subtotal - totalDiscount) * (storeSettings.taxRate / 100)); 
  const isPickup = cartStore.orderType === 'PICKUP';
  const appliedPackingCharge = isPickup ? storeSettings.packingCharge : 0;
  const total = Math.max(0, subtotal - totalDiscount + taxes + appliedPackingCharge);

  const initiateCheckout = () => {
    if (cartItems.length === 0) return;
    
    const finalOrderType = cartStore.orderType || 'PICKUP';
    if (finalOrderType === 'DINE_IN' && !cartStore.tableNumber) {
      alert("Please enter your table number or scan the QR code again.");
      return;
    }
    if (finalOrderType === 'PICKUP' && !cartStore.storeId) {
      alert("Store not selected. Please go back and select a store.");
      return;
    }
    
    if (!user) {
      setIsAuthGateOpen(true);
    } else {
      processPayment();
    }
  };

  const handleGuestSubmit = (name: string, phone: string) => {
    cartStore.setCustomerName(name);
    cartStore.setCustomerPhone(phone);
    setIsAuthGateOpen(false);
    setTimeout(() => {
      processPayment();
    }, 300);
  };

  const processPayment = async () => {
    if (cartItems.length === 0) return;
    
    const finalOrderType = cartStore.orderType || 'PICKUP';
    try {
      const { createRazorpayOrder, placeOrder, getUserProfile } = await import('../../api');
      
      const processOrder = async (paymentRef: string, status: string) => {
          const orderPayload: any = {
            customerName: cartStore.customerName || user?.username,
            customerPhone: cartStore.customerPhone,
            tableNumber: finalOrderType === 'PICKUP' ? null : cartStore.tableNumber,
            storeId: cartStore.storeId,
            orderType: finalOrderType,
            paymentReference: paymentRef,
            paymentStatus: status,
            pointsUsed: usePoints ? loyaltyPoints : 0,
            couponCode: appliedCoupon?.code || null,
            items: cartItems.map(item => ({
              productId: item.product.id,
              productName: item.product.name,
              price: item.price,
              quantity: item.quantity,
              subtotal: item.price * item.quantity,
              customizations: item.customization,
              customizationsList: item.customizationsList || []
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
          useOrderStore.getState().addOrder(result.id);
          navigate(`/tracking/${result.id}`);
      };

      if (cartStore.orderType === 'DINE_IN') {
          await processOrder("PAY_AT_COUNTER", "PENDING");
      } else {
          const rzpOrder = await createRazorpayOrder(total);
          const options = {
              key: 'rzp_test_T4aQ5u6TRc7G0O',
              amount: rzpOrder.amount,
              currency: rzpOrder.currency,
              name: "POP O'BOB®",
              description: 'Premium Pickup Order',
              order_id: rzpOrder.id,
              handler: async function (response: any) {
                  try {
                      await processOrder(response.razorpay_payment_id, "PAID");
                  } catch (error: any) {
                      console.error(error);
                      alert("Payment succeeded but order placement failed! Please contact staff.");
                  }
              },
              prefill: {
                  name: cartStore.customerName || user?.username || '',
                  contact: cartStore.customerPhone || '',
                  email: user?.email || ''
              },
              theme: { color: '#1A0B05' }
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (response: any) {
              alert("Payment Failed! " + response.error.description);
          });
          rzp.open();
      }
    } catch (error: any) {
      console.error("Failed to initialize payment", error);
      alert("Could not connect to payment gateway or backend.");
    }
  };

  return (
    <div className="min-h-screen pb-28 bg-[#FDFCF9] font-sans">
      
      {/* ========================================================================= */}
      {/* MOBILE CART VIEW */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 bg-[#FDFCF9]/95 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center -ml-2 text-[#1A0B05] active:scale-95 transition-transform">
              <ArrowLeft size={24} />
            </button>
            <h1 className="font-heading font-extrabold text-xl tracking-tight text-[#1A0B05]">Your Bag</h1>
          </div>
          <button onClick={cartStore.clearCart} className="w-10 h-10 flex items-center justify-center -mr-2 bg-gray-50 hover:bg-red-50 rounded-full text-red-500 active:scale-95 transition-colors">
            <Trash2 size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32 space-y-6">
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-3xl p-4 flex gap-4 border border-gray-100 shadow-sm relative border-l-4 border-l-[#D4AF37]">
                <img src={item.product.image} className="w-20 h-20 rounded-2xl object-cover bg-gray-50" />
                <div className="flex-1 py-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-base text-[#1A0B05] leading-tight w-2/3">{item.product.name}</h4>
                    <span className="font-black text-base text-[#D4AF37]">₹{item.price * item.quantity}</span>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-tight mb-3 w-3/4">{item.customization}</p>
                  
                  <div className="flex items-center justify-between w-full">
                    <button className="text-[12px] font-bold text-red-500 underline" onClick={() => cartStore.removeItem(item.id)}>Remove</button>
                    
                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
                      <button onClick={() => cartStore.updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-white bg-[#1A0B05] font-black active:scale-95 rounded-full transition-transform">-</button>
                      <span className="font-black text-sm">{item.quantity}</span>
                      <button onClick={() => cartStore.updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-white bg-[#1A0B05] font-black active:scale-95 rounded-full transition-transform">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {cartItems.length === 0 && (
              <div className="text-center py-10 text-gray-400 font-bold">Your bag is empty</div>
            )}
          </div>

          <div className="bg-white border border-gray-200 border-dashed rounded-[2rem] p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A0B05] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Ticket size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-[#1A0B05] text-base">Promo Code</h4>
                <p className="text-[12px] text-gray-500 font-medium">
                  {appliedCoupon ? `Applied: ${appliedCoupon.code} (-₹${couponDiscount})` : 'Save more on your order'}
                </p>
              </div>
              {appliedCoupon && (
                <button 
                  onClick={() => { setAppliedCoupon(null); setCouponDiscount(0); setCouponCode(''); }}
                  className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full"
                >
                  Remove
                </button>
              )}
            </div>
            {!appliedCoupon && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SUMMER20"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-black uppercase outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="text-xs font-black text-white uppercase tracking-widest px-6 py-3 bg-[#1A0B05] hover:bg-[#D4AF37] hover:text-[#1A0B05] rounded-2xl transition-all active:scale-95 shadow-md"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {user && (
            <div className={`rounded-3xl p-5 border shadow-sm transition-all ${usePoints ? 'bg-[#FFFBF2] border-[#D4AF37]/50' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${usePoints ? 'bg-[#D4AF37] text-[#1A0B05]' : 'bg-gray-50 text-gray-400 border border-gray-200'}`}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#1A0B05] text-base flex items-center gap-2">
                      Boba Wallet
                      <span className="text-[10px] font-black uppercase bg-[#1A0B05] text-[#D4AF37] px-2.5 py-0.5 rounded-full">
                        {loyaltyPoints} PTS
                      </span>
                    </h4>
                    <p className="text-[12px] text-gray-500 mt-0.5 font-medium">
                      {canUsePoints ? `You can save ₹${Math.floor(loyaltyPoints / 10)} on this order!` : 'Earn 100 pts to unlock discounts.'}
                    </p>
                  </div>
                </div>
                
                {canUsePoints && (
                  <button 
                    onClick={() => setUsePoints(!usePoints)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${usePoints ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${usePoints ? 'translate-x-6' : 'translate-x-1'} shadow-sm`} />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-black text-lg text-[#1A0B05] mb-5">Bill Details</h3>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span className="font-bold text-[#1A0B05]">₹{subtotal}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Total Savings</span>
                  <span>-₹{totalDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Taxes & Charges ({storeSettings.taxRate}%)</span>
                <span className="font-bold text-[#1A0B05]">₹{taxes}</span>
              </div>
              {isPickup && (
                <div className="flex justify-between text-gray-600">
                  <span>Packing Charge</span>
                  <span className="font-bold text-[#1A0B05]">₹{appliedPackingCharge}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-4 flex justify-between font-black text-xl text-[#1A0B05]">
                <span>To Pay</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-heading font-black text-lg text-[#1A0B05]">Order Details</h3>
            
            {!user ? (
              <div className="bg-gradient-to-r from-[#FFFDF8] to-[#FFFBF2] p-5 rounded-2xl border border-[#D4AF37]/30 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#1A0B05] flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <span className="font-black">?</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">Guest Checkout</span>
                  <p className="text-xs text-gray-600 font-semibold mb-2">We'll ask for your details in the next step, or you can log in to earn Boba Points!</p>
                  <button onClick={() => setIsAuthOpen(true)} className="text-xs font-bold text-[#1A0B05] underline">Log in now</button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Customer</span>
                  <span className="font-black text-[#1A0B05] text-sm">{user.username} ({user.email})</span>
                </div>
              </div>
            )}
            
            {cartStore.orderType === 'DINE_IN' && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">
                  Table Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4"
                  value={cartStore.tableNumber}
                  onChange={(e) => cartStore.setTableNumber(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-semibold text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">
                Special Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Less ice, extra hot"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-semibold text-sm"
              />
            </div>
          </div>
        </main>

        <div className="fixed bottom-[80px] left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-5 flex gap-5 z-[80] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col justify-center px-2">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Pay</span>
            <span className="font-black text-3xl leading-none text-[#1A0B05]">₹{total}</span>
          </div>
          <button 
            onClick={initiateCheckout} 
            className="flex-1 bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] font-black py-4 rounded-2xl flex justify-center items-center shadow-lg active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
          >
            {cartStore.orderType === 'DINE_IN' ? 'Order' : 'Checkout'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* APPLE / STARBUCKS RESERVE 2-COLUMN DESKTOP CART (hidden lg:block) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block max-w-[1440px] mx-auto px-8 xl:px-12 pt-12 pb-24">
        
        {/* Luxury Cart Header */}
        <div className="flex items-end justify-between mb-12 pb-6 border-b border-gray-200">
          <div>
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
              POP O'BOB® RESERVE CART
            </span>
            <h1 className="text-5xl font-black text-[#1A0B05] tracking-tight">
              Your Bag
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-extrabold text-gray-500 uppercase tracking-widest">
              {cartItems.length} {cartItems.length === 1 ? 'creation' : 'creations'}
            </span>
            {cartItems.length > 0 && (
              <button 
                onClick={cartStore.clearCart}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Trash2 size={14} />
                <span>Clear Bag</span>
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-28 text-center bg-white rounded-[3rem] border border-gray-100 p-12 shadow-sm">
            <h2 className="text-3xl font-black text-[#1A0B05] mb-3">Your tea bag is empty</h2>
            <p className="text-gray-500 text-base font-medium mb-8">Discover signature creations, estate teas, and reserve combos on our menu.</p>
            <button 
              onClick={() => navigate('/menu')}
              className="bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-12 items-start">
            
            {/* Left 7 Columns: Editorial Cart Item Cards */}
            <div className="col-span-7 space-y-6">
              {cartItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6 border-l-4 border-l-[#D4AF37] group"
                >
                  <img src={item.product.image} className="w-28 h-28 rounded-2xl object-cover bg-gray-50 shadow-sm shrink-0 group-hover:scale-105 transition-transform" />
                  
                  <div className="flex-1 py-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-black text-xl text-[#1A0B05] leading-tight">{item.product.name}</h3>
                      <span className="font-black text-xl text-[#D4AF37]">₹{item.price * item.quantity}</span>
                    </div>

                    <p className="text-xs text-gray-500 font-semibold mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      {item.customization}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                        <button 
                          onClick={() => cartStore.updateQuantity(item.id, -1)} 
                          className="w-7 h-7 flex items-center justify-center text-white bg-[#1A0B05] font-black hover:bg-[#D4AF37] hover:text-[#1A0B05] rounded-full transition-colors"
                        >
                          -
                        </button>
                        <span className="font-black text-sm w-4 text-center text-[#1A0B05]">{item.quantity}</span>
                        <button 
                          onClick={() => cartStore.updateQuantity(item.id, 1)} 
                          className="w-7 h-7 flex items-center justify-center text-white bg-[#1A0B05] font-black hover:bg-[#D4AF37] hover:text-[#1A0B05] rounded-full transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => cartStore.removeItem(item.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 underline transition-colors"
                      >
                        Remove item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right 5 Columns: Sticky Frosted Glass Order Summary Box */}
            <div className="col-span-5 sticky top-28 space-y-6">
              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-[#1A0B05]/5">
                
                <h2 className="text-2xl font-black text-[#1A0B05] mb-6 tracking-tight">
                  Order Summary
                </h2>

                {/* Promo Code Box */}
                <div className="bg-[#FFFBF2] border border-[#D4AF37]/30 rounded-2xl p-5 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#1A0B05] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
                      <Ticket size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm text-[#1A0B05]">Promo Code</h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {appliedCoupon ? `Applied: ${appliedCoupon.code} (-₹${couponDiscount})` : 'Enter voucher or promo code'}
                      </p>
                    </div>
                    {appliedCoupon && (
                      <button 
                        onClick={() => { setAppliedCoupon(null); setCouponDiscount(0); setCouponCode(''); }}
                        className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {!appliedCoupon && (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="e.g. POPRESERVE"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-black uppercase outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        className="bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Boba Wallet */}
                {user && (
                  <div className={`rounded-2xl p-5 border mb-6 transition-all ${usePoints ? 'bg-[#FFFBF2] border-[#D4AF37]/50 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${usePoints ? 'bg-[#D4AF37] text-[#1A0B05]' : 'bg-white text-gray-400 border border-gray-200'}`}>
                          <Wallet size={18} />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-[#1A0B05] flex items-center gap-2">
                            Boba Wallet
                            <span className="text-[10px] font-black uppercase bg-[#1A0B05] text-[#D4AF37] px-2.5 py-0.5 rounded-full">
                              {loyaltyPoints} PTS
                            </span>
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 font-medium">
                            {canUsePoints ? `You save ₹${Math.floor(loyaltyPoints / 10)} on this order!` : 'Earn 100 pts to unlock discounts.'}
                          </p>
                        </div>
                      </div>
                      
                      {canUsePoints && (
                        <button 
                          onClick={() => setUsePoints(!usePoints)}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${usePoints ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}
                        >
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${usePoints ? 'translate-x-6' : 'translate-x-1'} shadow-sm`} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Customer / Table Input */}
                <div className="space-y-4 mb-8 pb-8 border-b border-gray-100">
                  {!user ? (
                    <div className="bg-gradient-to-r from-[#FFFDF8] to-[#FFFBF2] p-5 rounded-2xl border border-[#D4AF37]/30 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#1A0B05] flex items-center justify-center shrink-0 shadow-sm mt-1">
                        <span className="font-black">?</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">Guest Checkout</span>
                        <p className="text-xs text-gray-600 font-semibold mb-2">We'll ask for your details in the next step.</p>
                        <button onClick={() => setIsAuthOpen(true)} className="text-xs font-bold text-[#1A0B05] underline hover:text-[#D4AF37]">Log in to earn points</button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">Customer</span>
                      <span className="font-black text-sm text-[#1A0B05]">{user.username} ({user.email})</span>
                    </div>
                  )}

                  {cartStore.orderType === 'DINE_IN' && (
                    <input
                      type="text"
                      placeholder="Table Number (e.g. 4) *"
                      value={cartStore.tableNumber}
                      onChange={(e) => cartStore.setTableNumber(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-semibold text-sm"
                    />
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 text-sm mb-8 font-medium">
                  <div className="flex justify-between text-gray-600">
                    <span>Item Total</span>
                    <span className="text-[#1A0B05] font-bold">₹{subtotal}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Total Savings</span>
                      <span>-₹{totalDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & Charges ({storeSettings.taxRate}%)</span>
                    <span className="text-[#1A0B05] font-bold">₹{taxes}</span>
                  </div>
                  {isPickup && (
                    <div className="flex justify-between text-gray-600">
                      <span>Packing Charge</span>
                      <span className="text-[#1A0B05] font-bold">₹{appliedPackingCharge}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-5 flex justify-between items-baseline mt-4">
                    <span className="font-black text-base uppercase tracking-wider text-[#1A0B05]">Total to Pay</span>
                    <span className="font-black text-3xl text-[#D4AF37]">₹{total}</span>
                  </div>
                </div>

                {/* Luxury Apple Checkout CTA (Desktop) */}
                <div className="hidden lg:block">
                  <button 
                    onClick={initiateCheckout} 
                    className="w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] py-5 rounded-full font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <span>{cartStore.orderType === 'DINE_IN' ? 'Place Order (Pay at Counter)' : 'Proceed to Checkout'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Checkout Bar (Mobile) */}
            <div className="lg:hidden fixed bottom-[72px] left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-[90] safe-pb shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
              <button 
                onClick={initiateCheckout} 
                className="w-full bg-gradient-to-r from-[#1A0B05] to-[#2A1B16] text-[#D4AF37] py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_8px_20px_rgba(26,11,5,0.4)] active:scale-95 flex items-center justify-between px-6 transition-transform"
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] text-white/70">Total to Pay</span>
                  <span className="text-lg leading-none">₹{total}</span>
                </div>
                <span className="flex items-center gap-2">
                  {cartStore.orderType === 'DINE_IN' ? 'Place Order' : 'Checkout'}
                  <div className="w-6 h-6 bg-[#D4AF37] text-[#1A0B05] rounded-full flex items-center justify-center">
                    <span className="text-[10px]">➔</span>
                  </div>
                </span>
              </button>
            </div>

          </div>
        )}

      </div>

      <CheckoutAuthGate 
        isOpen={isAuthGateOpen}
        onClose={() => setIsAuthGateOpen(false)}
        onLoginClick={() => {
          setIsAuthGateOpen(false);
          setTimeout(() => setIsAuthOpen(true), 300);
        }}
        onGuestSubmit={handleGuestSubmit}
        subtotal={subtotal}
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

    </div>
  );
}
