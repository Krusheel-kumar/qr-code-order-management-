import React, { useState, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function usePageCurtain({ titles }: { titles: string[] }) {
  const [page, setPage] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const go = (index: number) => {
    if (index === page || isPending) return;
    
    // Lock tabs during transition
    setIsPending(true);
    setPage(index);
    
    // Unlock after full curtain cycle (500ms drop + 500ms lift)
    setTimeout(() => {
      setIsPending(false);
    }, 1000);
  };

  return { page, isPending, go, ref };
}

export const PageCurtainStage = React.forwardRef<
  HTMLDivElement,
  { children: ReactNode; announce?: string; className?: string }
>(({ children, announce, className = '' }, ref) => {
  return (
    <div ref={ref} className={`relative overflow-hidden w-full h-full ${className}`}>
      {announce && (
        <div aria-live="polite" className="sr-only">{announce}</div>
      )}
      
      {/* Content wrapper with wait mode */}
      <AnimatePresence mode="wait">
        <motion.div
          key={announce}
          className="w-full h-full relative z-10"
          // Hold the old content in place while the curtain drops
          exit={{ opacity: 1, transition: { duration: 0.5 } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* The Curtain Wipe Effect */}
      <AnimatePresence>
        <motion.div
          key={announce + '-curtain'}
          className="pointer-events-none absolute inset-0 z-50 bg-[#1A0B05]"
          initial={{ scaleY: 1, originY: 1 }} // Start fully covering, lift up
          animate={{ scaleY: 0, originY: 1 }} 
          exit={{ scaleY: 1, originY: 0 }}    // Drop down to cover
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle gold accent on the curtain edge */}
          <div className="w-full h-[2px] bg-[#D4AF37]/50 absolute bottom-0 shadow-[0_4px_12px_#D4AF37]" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

PageCurtainStage.displayName = "PageCurtainStage";

export function PageCurtainContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function PageCurtainTabs({ 
  labels, 
  active, 
  isPending, 
  onSelect 
}: { 
  labels: string[]; 
  active: number; 
  isPending: boolean; 
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 p-2 bg-white/50 backdrop-blur-md rounded-full border border-gray-100 shadow-sm w-fit mt-4">
      {labels.map((label, i) => (
        <button
          key={label}
          disabled={isPending}
          onClick={() => onSelect(i)}
          className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            active === i 
              ? 'bg-[#1A0B05] text-[#D4AF37] shadow-md' 
              : 'bg-transparent text-gray-500 hover:text-[#1A0B05] hover:bg-gray-100'
          } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
