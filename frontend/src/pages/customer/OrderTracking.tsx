import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Bell, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORES } from '../../data/stores';
import { useAuthStore } from '../../store/useAuthStore';
import { getGuestRewardByOrderId } from '../../api';

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
  const [isExiting, setIsExiting] = useState(false);
  const { user } = useAuthStore();
  const hasTriggeredAI = useRef(false);
  const [showGuestRewardModal, setShowGuestRewardModal] = useState(false);
  const [guestRewardPoints, setGuestRewardPoints] = useState(0);

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
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [id]);

  // Guest Reward Check
  const [guestRewardChecked, setGuestRewardChecked] = useState(false);

  useEffect(() => {
    if (orderData && id) {
      if (user) {
        setGuestRewardChecked(true);
        return;
      }
      const dismissed = localStorage.getItem(`guest_reward_dismissed_${id}`);
      if (!dismissed) {
        getGuestRewardByOrderId(id).then(reward => {
          if (reward && reward.points > 0 && reward.status === 'PENDING') {
            setGuestRewardPoints(reward.points);
            setShowGuestRewardModal(true);
            // Mark AI onboarding as complete since we are showing the reward modal
            localStorage.setItem(`ai_onboarding_completed_${id}`, 'true');
          }
        }).catch(console.error).finally(() => {
          setGuestRewardChecked(true);
        });
      } else {
        setGuestRewardChecked(true);
      }
    }
  }, [orderData, user, id]);

  // AI Engagement Layer Trigger
  useEffect(() => {
    if (!guestRewardChecked || showGuestRewardModal) return; // Wait for reward check to complete

    if (orderData && id && !hasTriggeredAI.current) {
      const storageKey = `ai_onboarding_completed_${id}`;
      const hasCompletedOnboarding = localStorage.getItem(storageKey);

      if (!hasCompletedOnboarding) {
        hasTriggeredAI.current = true;
        
        const timer = setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            navigate('/ai/welcome', {
              state: {
                orderId: id,
                orderNumber: orderData.orderNumber,
                customerName: orderData.customerName || user?.username || null,
                isGuest: !user
              }
            });
          }, 600); // Wait for exit animation
        }, 2500); 
        
        return () => {
          clearTimeout(timer);
          hasTriggeredAI.current = false;
        };
      }
    }
  }, [orderData, navigate, id, user, showGuestRewardModal]);

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
            <div className="w-10"></div>
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
                <div className="absolute top-2 left-[23px] w-[3px] rounded-full bg-[#FFB800]">
                  <motion.div 
                    className="w-full bg-[#FFB800] rounded-full origin-top"
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
                          isCompleted ? 'bg-[#FFB800] shadow-[0_0_0_4px_white]' : 'bg-gray-200 shadow-[0_0_0_4px_white]'
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
                              className="absolute inset-0 rounded-full border-2 border-[#FFB800]"
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
                <div className="w-12 h-12 rounded-full bg-[#FFF5E1] flex items-center justify-center text-[#FFB800] shrink-0">
                  <MapPin size={22} fill="currentColor" className="text-[#FFB800]/20" />
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-[#1A0B05]">
                    {orderData?.orderType === 'DINE_IN' ? 'Dine-in at' : 'Pickup from'}
                  </h4>
                  <p className="text-gray-500 text-sm font-medium mt-0.5">
                    {storeInfo?.name || "POP O'BOB®"} | {storeInfo?.address || 'Film Nagar'}
                  </p>
                  {orderData?.tableNumber && (
                    <p className="text-[#FFB800] font-bold text-sm mt-1">
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
              onClick={() => navigate('/menu')}
              className="w-full py-4 rounded-full border-2 border-gray-200 text-[#1A0B05] font-bold text-[15px] active:scale-[0.98] transition-transform hover:border-gray-300 hover:bg-gray-50"
            >
              View Menu
            </button>
            
            <div className="h-8" />
          </main>

          {/* Guest Reward Modal */}
          <AnimatePresence>
            {showGuestRewardModal && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
                >
                  <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl pointer-events-auto border border-gray-100">
                    <div className="w-20 h-20 bg-[#FFF5E1] rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner">
                      <span className="text-4xl">🎁</span>
                    </div>
                    <h2 className="font-heading font-black text-2xl mb-2 text-[#1A0B05]">🎉 Congratulations!</h2>
                    <p className="text-gray-500 font-medium mb-6">You earned:</p>
                    <div className="bg-[#FFF5E1] rounded-[20px] py-4 px-6 mb-6 inline-block">
                      <p className="font-black text-2xl text-[#FFB800] tracking-tight">
                        ⭐ {guestRewardPoints} POP Points
                      </p>
                    </div>
                    <p className="text-gray-600 text-[15px] font-medium leading-relaxed mb-8 px-2">
                      Create your free account to unlock your rewards.
                    </p>
                    <div className="space-y-3 w-full">
                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full bg-[#FFB800] text-[#1A0B05] font-bold py-4 rounded-[16px] active:scale-[0.98] transition-transform shadow-[0_8px_24px_rgba(255,184,0,0.25)]"
                      >
                        Claim My Rewards
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem(`guest_reward_dismissed_${id}`, 'true');
                          setShowGuestRewardModal(false);
                        }}
                        className="w-full bg-white text-gray-500 font-bold py-4 rounded-[16px] active:scale-[0.98] transition-transform border border-gray-200"
                      >
                        Maybe Later
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
