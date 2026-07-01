import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { STORES } from '../../data/stores';

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

  useEffect(() => {
    if (!id) return;
    
    const fetchStatus = async () => {
      try {
        const { getOrderById } = await import('../../api');
        const order = await getOrderById(id);
        setOrderData(order);
        
        if (order.status === 'PLACED' || order.status === 'NEW') setCurrentStage(0);
        else if (order.status === 'PREPARING') setCurrentStage(1);
        else if (order.status === 'READY' || order.status === 'DELIVERED') setCurrentStage(2);
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
    <div className="min-h-screen bg-[var(--color-background)] font-sans flex flex-col pb-6">
      
      <header className="flex justify-between items-center px-6 py-4 sticky top-0 bg-[var(--color-background)]/90 backdrop-blur-md z-20">
        <button onClick={() => navigate('/home')} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-extrabold text-lg tracking-wide uppercase">{orderData?.orderNumber || `Order #${id?.substring(0, 8)}`}</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-6 pt-4">
        
        {/* Status Card */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm mb-6 text-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 mx-auto bg-[var(--color-cream)] rounded-full flex items-center justify-center mb-4"
          >
            <span className="text-5xl">{currentStage >= 2 ? '🎉' : '🧋'}</span>
          </motion.div>
          <h2 className="font-heading font-extrabold text-2xl mb-1">{STAGES[currentStage]?.label || 'Loading...'}</h2>
          {orderData?.tableNumber && (
            <p className="text-gray-500 text-sm mt-1 font-bold text-primary">Table: {orderData.tableNumber}</p>
          )}
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm mb-6 relative">
          <div className="absolute top-10 bottom-10 left-[31px] w-0.5 bg-gray-100">
             <motion.div 
               className="w-full bg-primary"
               initial={{ height: "0%" }}
               animate={{ height: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
               transition={{ duration: 1 }}
             />
          </div>

          <div className="space-y-8">
            {STAGES.map((stage, idx) => {
              const isCompleted = idx <= currentStage;
              const isCurrent = idx === currentStage;
              return (
                <div key={stage.id} className="flex gap-4 relative z-10">
                  <div className={`w-4 h-4 rounded-full mt-1 shrink-0 ${isCompleted ? 'bg-primary border-4 border-white shadow-sm' : 'bg-gray-200 border-4 border-white'}`}>
                    {isCurrent && (
                      <motion.div 
                        className="absolute inset-0 rounded-full border border-primary/50"
                        animate={{ scale: [1, 2], opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <h4 className={`font-bold text-sm ${isCompleted ? 'text-black' : 'text-gray-400'}`}>{stage.label}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Info */}
        {orderData?.orderType !== 'DINE_IN' && (
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-sm mb-4">Pickup Location</h3>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{storeInfo?.name || "POP O'BOB®"}</h4>
                <p className="text-xs text-gray-500 mb-3">{storeInfo?.address || 'Store Location'}</p>
                <a href={`tel:${storeInfo?.phone || ''}`} className="inline-flex items-center gap-2 text-xs font-bold text-black border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors">
                  <Phone size={12} /> Call Store
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
