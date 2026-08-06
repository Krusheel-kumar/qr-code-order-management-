import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useOrderStatus } from '../../hooks/useOrderStatus';
import { useAuthStore } from '../../store/useAuthStore';
import { getUserOrders } from '../../api';
import { STORES } from '../../data/stores';
import { useState, useEffect } from 'react';

export default function OrderCenter() {
  const navigate = useNavigate();
  const { activeOrders, recentOrders, isLoading } = useOrderStatus();
  const { user } = useAuthStore();
  const [historyOrders, setHistoryOrders] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoadingHistory(true);
    getUserOrders(user.id).then(data => {
      // Filter out orders that are currently in 'active' or 'recent' state locally to prevent duplication
      const activeOrRecentIds = [...activeOrders.map(o => o.id), ...recentOrders.map(o => o.id)];
      const filteredHistory = data.filter((o: any) => !activeOrRecentIds.includes(o.id));
      setHistoryOrders(filteredHistory);
      setLoadingHistory(false);
    }).catch(() => setLoadingHistory(false));
  }, [user, activeOrders, recentOrders]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'NEW': return 'Order Confirmed';
      case 'PREPARING': return 'Preparing...';
      case 'READY': return 'Ready For Pickup';
      case 'DELIVERED':
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED':
      case 'REJECTED': return 'Cancelled';
      default: return 'Processing';
    }
  };

  const renderOrderCard = (order: any, isActive: boolean) => {
    const storeInfo = order.storeId ? STORES.find(s => s.id === order.storeId.toString()) : STORES[0];
    const isCancelled = order.status === 'CANCELLED' || order.status === 'REJECTED';
    
    return (
      <div 
        key={order.id}
        onClick={() => navigate(isActive ? `/tracking/${order.id}` : `/receipt/${order.id}`)}
        className="bg-white rounded-3xl p-5 mb-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-3 relative z-10">
          <div className="flex items-center gap-3">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${isActive ? 'bg-[#D4AF37]' : (isCancelled ? 'bg-red-500' : 'bg-green-500')}`}>
                 <span className="text-xl">{isActive ? '🧋' : (isCancelled ? '❌' : '🎉')}</span>
             </div>
             <div>
               <div className="flex items-center gap-1.5 mb-1">
                 {isActive && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>}
                 <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                   {order.orderType === 'PICKUP' ? 'Pickup' : (order.orderType === 'DINE_IN' ? 'Dine In' : 'Delivery')}
                 </span>
               </div>
               <h3 className="font-bold text-gray-900 leading-tight">{getStatusText(order.status)}</h3>
             </div>
          </div>
          <div className="text-right">
            <span className="block text-gray-900 font-black">₹{order.totalAmount || order.total || 0}</span>
            <span className="text-xs text-gray-400 font-bold">#{order.orderNumber || order.id.substring(0, 5)}</span>
            {order.createdAt && (
              <span className="text-[10px] text-gray-400 font-medium block mt-1">
                {new Date(order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 relative z-10">
          <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
            {storeInfo?.name || 'POP O\'BOB'}
          </p>
          <div className={`text-xs font-bold uppercase tracking-wide group-hover:translate-x-1 transition-transform flex items-center gap-1 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
            {isActive ? 'Track' : 'Receipt'} <span className="text-sm">➔</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans flex flex-col pb-6 text-[#1A0B05]">
      <header className="flex justify-between items-center px-6 py-5 sticky top-0 bg-[#FDFCF8]/90 backdrop-blur-xl z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2.5} className="text-[#1A0B05]" />
        </button>
        <h1 className="font-heading font-extrabold text-xl tracking-tight">Order Center</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-5 pt-2">
        {isLoading && activeOrders.length === 0 && recentOrders.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 rounded-full border-4 border-[#D4AF37] border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            {activeOrders.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">Active Orders ({activeOrders.length})</h2>
                <div>
                  {activeOrders.map(order => renderOrderCard(order, true))}
                </div>
              </section>
            )}

            {recentOrders.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Recent Orders</h2>
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">Last 24h</span>
                </div>
                <div>
                  {recentOrders.map(order => renderOrderCard(order, false))}
                </div>
              </section>
            )}

            {activeOrders.length === 0 && recentOrders.length === 0 && (
              <div className="text-center py-20 px-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                  <span className="text-4xl filter grayscale">🧋</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No active orders</h3>
                <p className="text-gray-500 mb-8">You don't have any recent or active orders at the moment.</p>
                <button 
                  onClick={() => navigate('/menu')}
                  className="bg-[#1A0B05] text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-2xl hover:bg-black transition-colors shadow-lg shadow-black/10"
                >
                  Start New Order
                </button>
              </div>
            )}

            <section className="mt-8 mb-4 border-t border-gray-200 pt-8">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 ml-1">Order History</h2>
              
              {loadingHistory ? (
                <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div></div>
              ) : historyOrders.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-[2rem] border border-gray-100 shadow-sm mb-10">
                  <div className="w-16 h-16 rounded-full bg-[#FFFBF2] flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🧋</span>
                  </div>
                  <p className="text-sm font-black text-[#1A0B05]">No order history.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {historyOrders.map((order) => (
                    <div key={order.id} className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #{order?.orderNumber || order?.id?.split('-')[0].toUpperCase() || 'NEW'}</span>
                        <span className="text-[10px] font-black text-[#1A0B05] bg-gray-100 px-2.5 py-1 rounded-full uppercase tracking-wider">{order.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-4">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'} at {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                      
                      <div className="flex flex-col gap-2 mb-4">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="font-bold text-gray-700">{item.quantity}x {item.productName}</span>
                            <span className="font-bold text-gray-500">₹{item.subtotal}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span className="font-bold text-sm text-gray-500">Total</span>
                        <span className="font-black text-lg text-[#1A0B05]">₹{order.totalAmount || order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
