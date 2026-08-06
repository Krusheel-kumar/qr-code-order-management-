import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Bell, ChevronLeft, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORES } from '../../data/stores';
import { useOrderStore } from '../../store/useOrderStore';

const STAGES = [
  { id: 'PLACED', label: 'Order Confirmed' },
  { id: 'PREPARING', label: 'Preparing' },
  { id: 'READY', label: 'Ready For Pickup' },
];

export default function OrderTracking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStage, setCurrentStage] = useState(0); 
  const [orderData, setOrderData] = useState<any>(null);
  const [isExiting] = useState(false);
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
                    animate={{ scaleY: currentStage / (STAGES.length - 1) }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                <div className="space-y-7">
                  {STAGES.map((stage, idx) => {
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
                  <MapPin size={22} fill="currentColor" className="text-[#D4AF37]/20" />
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-[#1A0B05]">
                    {orderData?.orderType === 'DINE_IN' ? 'Dine-in at' : 'Pickup from'}
                  </h4>
                  <p className="text-gray-500 text-sm font-medium mt-0.5">
                    {storeInfo?.name || "POP O'BOB®"} | {storeInfo?.address || 'Film Nagar'}
                  </p>
                  {orderData?.tableNumber && (
                    <p className="text-[#D4AF37] font-bold text-sm mt-1">
                      Table No. {orderData.tableNumber}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="h-px w-full bg-gray-100" />
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Bell size={16} className="text-gray-400" />
                </div>
                <p className="text-[13px] text-gray-500 font-medium">
                  We will announce your order number when it's ready!
                </p>
              </div>
            </div>

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
