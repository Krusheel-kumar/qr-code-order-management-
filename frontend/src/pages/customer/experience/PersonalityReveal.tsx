import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PersonalityReveal() {
  const navigate = useNavigate();

  // Auto-navigate to Recommendation Result after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/recommendation');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* Decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-green-500/20 rounded-full blur-[80px]"></div>

      {/* Floating fruits animation */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '100vh', x: Math.random() * 300 - 150, opacity: 0 }}
          animate={{ y: '-20vh', x: Math.random() * 300 - 150, opacity: 0.8, rotate: Math.random() * 360 }}
          transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
          className="absolute text-3xl z-0"
          style={{ left: `${20 + Math.random() * 60}%` }}
        >
          {['🥭', '🍓', '🥥', '🌿', '🍍'][i % 5]}
        </motion.div>
      ))}

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <span className="text-xs font-bold tracking-widest uppercase opacity-60 mb-4 block">You Are A</span>
          <h1 className="text-5xl font-heading font-extrabold text-primary mb-6 leading-tight drop-shadow-[0_0_15px_rgba(255,213,79,0.5)]">
            🌴 Tropical<br/>Explorer
          </h1>
          <p className="text-lg opacity-90 max-w-xs mx-auto mb-10 leading-relaxed font-medium">
            You love refreshing, fruity drinks and exciting flavors!
          </p>

          <div className="relative w-64 h-64 mx-auto">
             {/* Drink illustration placeholder */}
             <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
             <img src="https://images.unsplash.com/photo-1558857563-b37102e99e06?auto=format&fit=crop&q=80&w=800&bg=transparent" className="w-full h-full object-contain mix-blend-luminosity brightness-150 relative z-10 drop-shadow-2xl" />
          </div>
        </motion.div>
      </main>

      <div className="p-6 relative z-10">
        <button 
          onClick={() => navigate('/recommendation')}
          className="w-full bg-primary text-[var(--color-primary-foreground)] font-bold py-4 rounded-full shadow-[0_10px_20px_rgba(255,213,79,0.3)] hover:scale-105 active:scale-95 transition-transform"
        >
          See My Match
        </button>
      </div>

    </div>
  );
}
