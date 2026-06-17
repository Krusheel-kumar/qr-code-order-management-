import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  // Floating boba pearls animation variants
  const pearlVariants = {
    animate: (i: number) => ({
      y: [0, -20, 0],
      x: [0, i % 2 === 0 ? 10 : -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        delay: i * 0.2,
      }
    })
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col relative overflow-hidden font-sans">
      
      {/* Decorative Milk Splash (placeholder until real asset is added) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      >
         <img 
            src="https://placehold.co/800x1200/FFF8E8/FFF8E8?text=Milk+Splash+Asset" 
            alt="Milk Splash Background" 
            className="w-full h-full object-cover opacity-30 mix-blend-multiply"
          />
      </motion.div>

      {/* Floating Boba Pearls */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={pearlVariants}
          animate="animate"
          className="absolute rounded-full bg-[#2A1B14] z-10"
          style={{
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            opacity: 0.8
          }}
        />
      ))}

      <main className="flex-1 flex flex-col items-center justify-center relative z-20">
        
        {/* Logo & Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center space-y-4"
        >
          <h1 className="font-heading font-extrabold text-5xl tracking-tighter text-[var(--color-foreground)]">
            popobob<span className="text-sm align-top">&reg;</span>
          </h1>
          <div className="text-[var(--color-foreground-muted)] font-medium text-lg leading-tight">
            <p>good times.</p>
            <p>on repeat.</p>
          </div>
        </motion.div>

        {/* Loading Indicator */}
        <div className="absolute bottom-16 w-full flex justify-center px-12">
          <motion.div
            className="w-48 h-[2px] bg-black/10 rounded-full overflow-hidden"
          >
            <motion.div 
              className="h-full bg-[var(--color-primary)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

      </main>
    </div>
  );
}
