import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, Clock, Award } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { getUserOrders } from '../../api';

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSheet({ isOpen, onClose }: ProfileSheetProps) {
  const { user, setUser, getLoyaltyTier } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      getUserOrders(user.id).then(data => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [isOpen, user]);

  if (!user) return null;

  const tier = getLoyaltyTier();

  const handleLogout = () => {
    setUser(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 h-[90vh] bg-[#FFFBF2] rounded-t-[2rem] z-[101] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-4">
              <h2 className="font-heading font-black text-2xl text-gray-900">Your Account</h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-10">
              
              {/* Loyalty Card */}
              <div className={`w-full rounded-[1.5rem] p-5 text-white mb-8 bg-gradient-to-br ${tier?.color || 'from-[#CD7F32] to-[#B87333]'} shadow-lg relative overflow-hidden`}>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-0.5">{user?.username || 'Guest'}</h3>
                      <p className="text-xs font-medium opacity-80">{user?.email || ''}</p>
                    </div>
                    <Award size={32} className="opacity-80" />
                  </div>
                  
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">Tier Status</p>
                      <h4 className="font-heading font-black text-2xl drop-shadow-sm">{tier.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">Boba Points</p>
                      <h4 className="font-black text-3xl">{user.loyaltyPoints}</h4>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {tier.progress < 100 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] font-bold mb-1 opacity-80">
                        <span>{user.loyaltyPoints} pts</span>
                        <span>{tier.nextTier} pts to Next Tier</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${tier.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order History */}
              <h3 className="font-extrabold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={18} /> Past Orders
              </h3>

              {loading ? (
                <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-[#FFB300] border-t-transparent rounded-full animate-spin"></div></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-[1.5rem] border border-gray-100">
                  <span className="text-3xl mb-2 block">🧋</span>
                  <p className="text-sm font-bold text-gray-500">No orders yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Your boba journey begins today!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mb-8">
                  {orders?.map((order) => (
                    <div key={order.id} className="bg-white p-4 rounded-[1.2rem] border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-400">Order #{order?.id?.split('-')[0].toUpperCase() || 'NEW'}</span>
                        <span className="text-xs font-extrabold text-[#FF8F00] bg-[#FFF5E5] px-2 py-0.5 rounded-full">{order.status}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-3">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'} at {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                      
                      <div className="flex flex-col gap-1 mb-3">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="font-bold text-gray-800">{item.quantity}x {item.productName}</span>
                            <span className="font-bold">₹{item.subtotal}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                        <span className="font-bold text-sm">Total</span>
                        <span className="font-black text-lg">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
              >
                <LogOut size={18} /> Log Out
              </button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
