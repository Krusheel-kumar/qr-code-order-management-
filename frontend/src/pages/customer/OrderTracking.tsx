import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Bell, ChevronLeft, FileText, Truck, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORES } from '../../data/stores';
import { useOrderStore } from '../../store/useOrderStore';

const PICKUP_STAGES = [
  { id: 'PLACED', label: 'Order Confirmed' },
  { id: 'PREPARING', label: 'Freshly Brewing' },
  { id: 'READY', label: 'Ready For Pickup' },
];

const DELIVERY_STAGES = [
  { id: 'PLACED', label: 'Order Confirmed' },
  { id: 'PREPARING', label: 'Freshly Brewing with Love' },
  { id: 'READY', label: 'Rider Dispatched & On The Way 🛵' },
];

export default function OrderTracking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStage, setCurrentStage] = useState(0); 
  const [orderData, setOrderData] = useState<any>(null);
  const [isExiting] = useState(false);

  const activeStages = orderData?.orderType === 'DELIVERY' ? DELIVERY_STAGES : PICKUP_STAGES;
  useEffect(() => {
    if (!id) return;
    
    const fetchStatus = async () => {
      try {
        const { getOrderById } = await import('../../api');
        const order = await getOrderById(id);
        setOrderData(order);
        
        if (order.status === 'PLACED' || order.status === 'NEW') setCurrentStage(0);
        else if (order.status === 'PREPARING') setCurrentStage(1);
        if (order.status === 'READY' || order.status === 'DELIVERED') setCurrentStage(2);
        
        const terminalStates = ['DELIVERED', 'COMPLETED', 'CANCELLED', 'REJECTED'];
        if (terminalStates.includes(order.status) && !useOrderStore.getState().orders.find(o => o.id === id)?.terminalTimestamp) {
          useOrderStore.getState().markTerminal(id, Date.now());
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const storeInfo = orderData?.storeId ? STORES.find(s => s.id === orderData.storeId?.toString()) : STORES[0];

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen bg-[#FDFCF8] font-sans flex flex-col pb-6 text-[#1A0B05]"
        >
          {/* Premium Header */}
          <header className="flex justify-between items-center px-6 py-5 sticky top-0 bg-[#FDFCF8]/90 backdrop-blur-xl z-20">
            <button 
              onClick={() => navigate('/home')} 
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <ChevronLeft size={28} strokeWidth={2.5} className="text-[#1A0B05]" />
            </button>
            <h1 className="font-heading font-extrabold text-xl tracking-tight">
              {orderData?.orderNumber || `Order #${id?.substring(0, 8)}`}
            </h1>
            <button 
              onClick={() => window.open(`tel:${storeInfo?.phone || '+911234567890'}`)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFF5E1] hover:bg-[#D4AF37]/20 transition-colors text-[#D4AF37]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </button>
          </header>

          <main className="flex-1 px-5 pt-2">
            
            <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 mb-6 flex flex-col items-center text-center">
              <motion.div 
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                className="w-20 h-20 bg-[#FFF5E1] rounded-[24px] flex items-center justify-center mb-5 rotate-3"
              >
                <span className="text-4xl filter drop-shadow-sm">{currentStage >= 2 ? '🎉' : '🧋'}</span>
              </motion.div>
              
              <h2 className="font-heading font-extrabold text-[28px] leading-tight mb-2 tracking-tight">
                Order Confirmed! 🎉
              </h2>
              {orderData?.createdAt && (
                <p className="text-[#D4AF37] text-xs font-black uppercase tracking-widest mb-2">
                  {new Date(orderData.createdAt).toLocaleString('en-US', { 
                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
                  })}
                </p>
              )}
              <p className="text-[#6B7280] text-sm font-medium leading-relaxed px-4">
                We've received your order and it's being prepared with love! ❤️
              </p>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 ml-2">Order Status</h3>
              
              <div className="relative pl-4">
                {/* Vertical Line Background */}
                <div className="absolute top-2 bottom-6 left-[23px] w-[3px] bg-gray-100 rounded-full" />
                
                {/* Vertical Progress Line */}
                <div className="absolute top-2 left-[23px] w-[3px] rounded-full bg-[#D4AF37]">
                  <motion.div 
                    className="w-full bg-[#D4AF37] rounded-full origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: currentStage / (activeStages.length - 1) }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                <div className="space-y-7">
                  {activeStages.map((stage, idx) => {
                    const isCompleted = idx <= currentStage;
                    const isCurrent = idx === currentStage;
                    
                    return (
                      <div key={stage.id} className="flex gap-5 relative z-10 items-center">
                        <div className={`w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center z-10 transition-colors duration-300 ${
                          isCompleted ? 'bg-[#D4AF37] shadow-[0_0_0_4px_white]' : 'bg-gray-200 shadow-[0_0_0_4px_white]'
                        }`}>
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                          {isCurrent && (
                            <motion.div 
                              className="absolute inset-0 rounded-full border-2 border-[#D4AF37]"
                              animate={{ scale: [1, 1.8], opacity: [1, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-[15px] ${isCompleted ? 'text-[#1A0B05]' : 'text-gray-400'}`}>
                            {stage.label}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Store & Order Context */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 mb-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFFBF2] flex items-center justify-center text-[#D4AF37] shrink-0">
                  {orderData?.orderType === 'DELIVERY' ? (
                    <Truck size={22} className="text-[#D4AF37]" />
                  ) : (
                    <MapPin size={22} fill="currentColor" className="text-[#D4AF37]/20" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-[#1A0B05]">
                    {orderData?.orderType === 'DELIVERY'
                      ? 'Doorstep Delivery'
                      : orderData?.orderType === 'DINE_IN'
                      ? 'Dine-in at'
                      : 'Pickup from'}
                  </h4>
                  {orderData?.orderType === 'DELIVERY' ? (
                    <p className="text-gray-500 text-sm font-medium mt-0.5">
                      {orderData.deliveryAddress || 'Delivery Address'} ({orderData.deliveryPincode || 'Hyderabad'})
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm font-medium mt-0.5">
                      {storeInfo?.name || "POP O'BOB®"} | {storeInfo?.address || 'Film Nagar'}
                    </p>
                  )}
                  {orderData?.tableNumber && (
                    <p className="text-[#D4AF37] font-bold text-sm mt-1">
                      Table No. {orderData.tableNumber}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="h-px w-full bg-gray-100" />
              
              {orderData?.orderType === 'DELIVERY' ? (
                <div className="space-y-4">
                  {/* Swiggy/Zomato Live Delivery Partner Card */}
                  <div className="bg-[#FFFDF7] border border-[#D4AF37]/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                          {currentStage === 0 && 'Assigning Delivery Partner'}
                          {currentStage === 1 && 'Rider Heading to Kitchen'}
                          {currentStage >= 2 && 'Rider Dispatched & On Route'}
                        </span>
                      </div>
                      <span className="font-black text-[10px] text-[#D4AF37] uppercase tracking-wider bg-[#FFF5E1] px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                        Shiprocket Quick
                      </span>
                    </div>

                    {/* Animated Delivery Route Visual */}
                    <div className="relative py-3 my-2">
                      <div className="h-1.5 w-full bg-amber-100 rounded-full relative overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#D4AF37] rounded-full"
                          initial={{ width: '25%' }}
                          animate={{ 
                            width: currentStage === 0 ? '25%' : currentStage === 1 ? '60%' : '95%' 
                          }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 mt-2">
                        <span className="flex items-center gap-1">📍 Film Nagar Hub</span>
                        <span className="text-[#D4AF37] font-black animate-pulse">
                          {currentStage === 0 ? 'Finding Rider 🛵' : currentStage === 1 ? 'Brewing Boba 🧋' : 'En Route 🛵💨'}
                        </span>
                        <span className="flex items-center gap-1">🏠 {orderData.deliveryPincode || 'Destination'}</span>
                      </div>
                    </div>

                    {/* Rider Contact & Details Card */}
                    <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1A0B05] text-white flex items-center justify-center font-black text-sm">
                          🛵
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-sm text-[#1A0B05]">Suresh V.</h5>
                            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">★ 4.9</span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium">Rapido Bike • TS 09 EA 4122</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => window.open('tel:+919876543210')}
                          className="w-9 h-9 rounded-full bg-[#FFF5E1] text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-colors"
                          title="Call Delivery Partner"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </button>
                      </div>
                    </div>

                    {/* Delivery PIN & Live Map Tracking */}
                    <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Delivery PIN</span>
                        <span className="font-mono font-black text-sm text-[#1A0B05] tracking-widest">
                          {orderData?.orderNumber?.replace('POB-', '') || '4829'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Estimated Delivery</span>
                        <span className="font-bold text-xs text-emerald-700">
                          {currentStage >= 2 ? '15 - 20 mins' : '30 - 45 mins'}
                        </span>
                      </div>
                    </div>

                    {/* Official Shiprocket Map Link */}
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <a
                        href={orderData.shiprocketTrackingUrl || `https://shiprocket.co//tracking/${orderData.shiprocketAwb || orderData.orderNumber || 'demo'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:text-[#b89528] w-full py-1.5 bg-white rounded-lg border border-amber-200/60 transition-colors"
                      >
                        <span>Open Live Shiprocket Courier Map</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <Bell size={16} className="text-gray-400" />
                  </div>
                  <p className="text-[13px] text-gray-500 font-medium">
                    We will announce your order number when it's ready!
                  </p>
                </div>
              )}
            </div>

            {/* Local Sandbox Testing Simulator Controls */}
            {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
              <div className="bg-[#F8F9FA] border border-dashed border-gray-300 rounded-[24px] p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-600">
                    🧪 Local Testing Simulator
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold">
                    Current: <strong>{orderData?.status || 'PLACED'}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={async () => {
                      if (!id) return;
                      const { advanceOrderStatus } = await import('../../api');
                      await advanceOrderStatus(id);
                      window.location.reload();
                    }}
                    className="py-2.5 px-2 bg-white hover:bg-amber-50 text-[#1A0B05] rounded-xl border border-gray-200 text-[11px] font-bold shadow-sm transition-all text-center"
                  >
                    {currentStage === 0 ? '🧑‍🍳 Brew in Kitchen' : currentStage === 1 ? '🛵 Dispatch Rider' : '✅ Mark Delivered'}
                  </button>
                  <button 
                    onClick={async () => {
                      if (!id) return;
                      const { apiClient } = await import('../../lib/apiClient');
                      await apiClient.patch(`/orders/${id}/status?status=PREPARING`).catch(() => {});
                      window.location.reload();
                    }}
                    className={`py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center ${
                      orderData?.status === 'PREPARING' ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    Brewing
                  </button>
                  <button 
                    onClick={async () => {
                      if (!id) return;
                      const { apiClient } = await import('../../lib/apiClient');
                      await apiClient.patch(`/orders/${id}/status?status=READY`).catch(() => {});
                      window.location.reload();
                    }}
                    className={`py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center ${
                      orderData?.status === 'READY' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    Dispatched 🛵
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={() => navigate(`/receipt/${id}`)}
              className="w-full py-4 bg-white border-2 border-gray-100 text-[#1A0B05] hover:border-[#D4AF37] hover:bg-[#FFFBF2] rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all mb-4 shadow-sm"
            >
              <FileText size={18} className="text-[#D4AF37]" />
              View E-Receipt
            </button>

            <button 
              onClick={() => navigate('/menu')}
              className="w-full py-4 rounded-full border-2 border-gray-200 text-[#1A0B05] font-bold text-[15px] active:scale-[0.98] transition-transform hover:border-gray-300 hover:bg-gray-50"
            >
              View Menu
            </button>
            
            <div className="h-8" />
          </main>



        </motion.div>
      )}
    </AnimatePresence>
  );
}
