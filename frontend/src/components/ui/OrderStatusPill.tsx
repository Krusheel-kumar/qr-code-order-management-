import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOrderStatus } from '../../hooks/useOrderStatus';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { STORES } from '../../data/stores';

export default function OrderStatusPill() {
  const { activeOrders, recentOrders, mostRecentOrder, isMostRecentRecent } = useOrderStatus();
  const { dismissOrder } = useOrderStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (activeOrders.length === 0 && recentOrders.length === 0) return null;

  // Handle Multi-Order UI
  if (activeOrders.length > 1) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onClick={() => navigate('/order-center')}
          className="fixed bottom-[88px] left-4 right-4 lg:left-auto lg:right-6 lg:bottom-6 lg:w-80 z-50 cursor-pointer"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-4 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center gap-4 overflow-hidden relative group">
            {/* Multi-Order Icon Stack */}
            <div className="relative shrink-0 z-10 w-12 h-12">
              <div className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-orange-200 border-2 border-white shadow-sm flex items-center justify-center text-sm z-0 translate-x-1 -translate-y-1">🧋</div>
              <div className="absolute bottom-0 left-0 w-10 h-10 rounded-xl bg-[#1A0B05] border-2 border-white shadow-md flex items-center justify-center text-sm z-10">🧋</div>
            </div>

            <div className="flex-1 min-w-0 z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-0.5 block">
                Multiple Orders
              </span>
              <h4 className="font-bold text-gray-900 text-sm leading-tight truncate">
                {activeOrders.length} Active Orders
              </h4>
              <p className="text-xs text-[#D4AF37] font-bold truncate mt-0.5 group-hover:translate-x-0.5 transition-transform">
                View Order Center ➔
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Fall back to most recent order if only 1 active or only recent exists
  const order = mostRecentOrder;
  if (!order) return null;

  const currentOrderId = order.id;
  const storeInfo = order.storeId ? STORES.find(s => s.id === order.storeId.toString()) : STORES[0];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'NEW': return 'Order Confirmed';
      case 'PREPARING': return 'Preparing';
      case 'READY': return 'Ready For Pickup';
      case 'DELIVERED':
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED':
      case 'REJECTED': return 'Cancelled';
      default: return 'Processing';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'NEW': return 'bg-blue-500';
      case 'PREPARING': return 'bg-orange-500';
      case 'READY': return 'bg-green-500';
      case 'DELIVERED':
      case 'COMPLETED': return 'bg-green-500';
      case 'CANCELLED':
      case 'REJECTED': return 'bg-red-500';
      default: return 'bg-[#D4AF37]';
    }
  };

  // Recent Order Pill (Single)
  if (isMostRecentRecent) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-[88px] left-4 right-4 lg:left-auto lg:right-6 lg:bottom-6 lg:w-80 z-50"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-3 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center gap-4 overflow-hidden relative">
            <button 
              onClick={(e) => { e.stopPropagation(); dismissOrder(currentOrderId); }}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors z-20 text-[10px]"
            >
              ✕
            </button>

            <div className="relative shrink-0 z-10 ml-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${order.status === 'CANCELLED' || order.status === 'REJECTED' ? 'bg-red-500' : 'bg-green-500'}`}>
                 <span className="text-lg">{order.status === 'CANCELLED' || order.status === 'REJECTED' ? '❌' : '🎉'}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0 z-10 py-1 cursor-pointer" onClick={() => navigate(`/receipt/${currentOrderId}`)}>
              <div className="flex items-center justify-between mb-0.5 pr-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                  Recent Order
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm leading-tight truncate">
                {getStatusText(order.status)}
              </h4>
              <p className="text-xs text-[#D4AF37] font-bold truncate mt-0.5">
                View Receipt ➔
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Active Order Pill (Single)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={() => navigate(`/tracking/${currentOrderId}`)}
        className="fixed bottom-[88px] left-4 right-4 lg:left-auto lg:right-6 lg:bottom-6 lg:w-80 z-50 cursor-pointer"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-4 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center gap-4 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-[#FFC461]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Close Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); dismissOrder(currentOrderId); }}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-400 hover:bg-gray-200 transition-colors z-20 text-[10px]"
          >
            ✕
          </button>

          <div className="relative shrink-0 z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shadow-black/10 ${getStatusColor(order.status)}`}>
               <span className="text-xl">🧋</span>
            </div>
            <div className={`absolute inset-0 rounded-2xl border-2 animate-ping opacity-75 ${getStatusColor(order.status).replace('bg-', 'border-')}`}></div>
          </div>

          <div className="flex-1 min-w-0 z-10">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                {order.orderType === 'PICKUP' ? 'Pickup' : (order.orderType === 'DINE_IN' ? 'Dine In' : 'Delivery')}
              </span>
              <span className="text-[10px] font-bold text-gray-400">Order #{order.orderNumber || currentOrderId.substring(0, 5)}</span>
            </div>
            <h4 className="font-bold text-gray-900 text-sm leading-tight truncate">
              {getStatusText(order.status)}
            </h4>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {storeInfo?.name || 'POP O\'BOB'}
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 z-10">
            <span className="text-gray-400 transform group-hover:translate-x-0.5 transition-transform">➔</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
