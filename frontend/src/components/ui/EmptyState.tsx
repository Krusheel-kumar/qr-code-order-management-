import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionText, onAction, icon }: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-full min-h-[60vh]">
      {/* Playful Boba Mascot Animation */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20 
        }}
        className="w-40 h-40 bg-gradient-to-br from-[#FFFBF2] to-[#FFF0D4] rounded-full flex items-center justify-center mb-8 shadow-[0_10px_40px_rgba(212,175,55,0.15)] border-4 border-white relative"
      >
        {icon ? (
          <div className="text-[#D4AF37] opacity-80">{icon}</div>
        ) : (
          <div className="text-7xl">🧋</div>
        )}
        
        {/* Floating Pearls */}
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-6 right-6 w-4 h-4 bg-[#1A0B05] rounded-full opacity-80"
        />
        <motion.div 
          animate={{ y: [0, -15, 0] }} 
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.2 }}
          className="absolute bottom-10 left-8 w-5 h-5 bg-[#1A0B05] rounded-full opacity-60"
        />
      </motion.div>

      <h2 className="text-3xl font-black text-[#1A0B05] mb-3 tracking-tight">{title}</h2>
      <p className="text-gray-500 text-[15px] font-medium mb-8 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>

      {actionText && (
        <Button 
          size="lg"
          className="min-w-[200px]"
          onClick={onAction || (() => navigate('/menu'))}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
