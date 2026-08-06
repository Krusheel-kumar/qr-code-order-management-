import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02, filter: "blur(4px)", y: 15 }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)", y: -10 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] // Native Apple spring feel
      }}
      className="w-full h-full min-h-[100dvh]"
    >
      {children}
    </motion.div>
  );
}
