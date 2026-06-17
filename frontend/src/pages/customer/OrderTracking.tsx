import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const STAGES = [
  { id: 'received', label: 'Order Confirmed', time: '10:30 AM' },
  { id: 'preparing', label: 'Preparing', time: '10:32 AM' },
  { id: 'almost', label: 'Almost Ready', time: 'Pending' },
  { id: 'ready', label: 'Ready For Pickup', time: 'Pending' },
];

export default function OrderTracking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStage, setCurrentStage] = useState(0); // 'Order Confirmed'

  // Mock progress animation to simulate WebSockets
  useEffect(() => {
    const intervals = [
      setTimeout(() => setCurrentStage(1), 3000), // to Preparing
      setTimeout(() => setCurrentStage(2), 6000), // to Almost Ready
      setTimeout(() => setCurrentStage(3), 9000), // to Ready For Pickup
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans flex flex-col pb-6">
      
      <header className="flex justify-between items-center px-6 py-4 sticky top-0 bg-[var(--color-background)]/90 backdrop-blur-md z-20">
        <button onClick={() => navigate('/home')} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-extrabold text-lg tracking-wide uppercase">Order #{id}</h1>
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
            <span className="text-5xl">🧋</span>
          </motion.div>
          <h2 className="font-heading font-extrabold text-2xl mb-1">{STAGES[currentStage].label}</h2>
          <p className="text-gray-500 text-sm">Estimated Pickup: 10:45 AM</p>
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
                    <p className="text-[10px] text-gray-400 font-medium">{stage.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-sm mb-4">Pickup Location</h3>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">Pop O Bob - Downtown</h4>
              <p className="text-xs text-gray-500 mb-3">123 Main Street, Suite 400<br/>New York, NY 10001</p>
              <button className="flex items-center gap-2 text-xs font-bold text-black border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors">
                <Phone size={12} /> Call Store
              </button>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
