import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOrderStatus } from '../../hooks/useOrderStatus';
import { useOrderStore } from '../../store/useOrderStore';
import { STORES } from '../../data/stores';

export default function OrderStatusCard() {
  const { mostRecentOrder, isMostRecentRecent } = useOrderStatus();
  const { dismissOrder } = useOrderStore();
  const navigate = useNavigate();

  if (!mostRecentOrder) return null;

  const order = mostRecentOrder;
  const currentOrderId = order.id;

  const storeInfo = order.storeId ? STORES.find(s => s.id === order.storeId.toString()) : STORES[0];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'NEW': return 'We\'re preparing your boba!';
      case 'PREPARING': return 'Crafting your drinks now...';
      case 'READY': return 'Ready for Pickup!';
      case 'DELIVERED':
      case 'COMPLETED': return 'Order Completed!';
      case 'CANCELLED': 
      case 'REJECTED': return 'Order Cancelled';
      default: return 'Order is in progress.';
    }
  };

  const getProgressWidth = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'NEW': return '30%';
      case 'PREPARING': return '65%';
      case 'READY': return '90%';
      case 'DELIVERED':
      case 'COMPLETED': return '100%';
      case 'CANCELLED':
      case 'REJECTED': return '100%';
      default: return '10%';
    }
  };

  if (isMostRecentRecent) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="px-5 mb-8"
      >
        <div className="bg-white rounded-[2rem] p-6 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100">
          <button 
            onClick={(e) => { e.stopPropagation(); dismissOrder(currentOrderId); }}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors z-20"
          >
            ✕
          </button>
          
          <div className="flex items-center gap-4 mb-4 relative z-10">
             <div className="w-14 h-14 rounded-[18px] bg-green-50 text-green-500 flex items-center justify-center text-2xl shadow-inner">
               {order.status === 'CANCELLED' || order.status === 'REJECTED' ? '❌' : '🎉'}
             </div>
             <div>
               <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] block mb-1">Recent Order</span>
               <h3 className="text-[#1A0B05] text-xl font-bold leading-tight">{getStatusText(order.status)}</h3>
             </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-5 relative z-10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-500 text-xs font-semibold">Order #{order.orderNumber || currentOrderId.substring(0, 5)}</span>
              <span className="text-gray-900 font-bold">₹{order.totalAmount || order.total || 0}</span>
            </div>
            <p className="text-gray-400 text-xs">{storeInfo?.name || 'POP O\'BOB'}</p>
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={() => navigate(`/receipt/${currentOrderId}`)}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Receipt
            </button>
            <button 
              onClick={() => navigate('/menu')}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFC461] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Order Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Active Order State
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 mb-8"
    >
      <div 
        onClick={() => navigate(`/tracking/${currentOrderId}`)}
        className="bg-[#1A0B05] rounded-[2rem] p-6 relative overflow-hidden shadow-2xl shadow-black/20 cursor-pointer group"
      >
        {/* Abstract Gold Swirls */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-[#D4AF37]/30 to-[#FFC461]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em]">Active Order</span>
            </div>
            <h3 className="text-white text-xl font-bold leading-tight">{getStatusText(order.status)}</h3>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 shrink-0 border border-white/10">
            <span className="text-2xl drop-shadow-sm filter">🧋</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#D4AF37] to-[#FFC461] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: getProgressWidth(order.status) }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between mt-2 pt-4 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-0.5">Order Details</span>
            <span className="text-white/90 text-xs font-semibold">Order #{order.orderNumber || currentOrderId.substring(0, 5)} • {storeInfo?.name || 'POP O\'BOB'}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-bold uppercase tracking-wide group-hover:translate-x-1 transition-transform">
            View <span className="text-lg leading-none">&rarr;</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
