import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface OrderStatusCardProps {
  orderId: string;
  orderNumber: string;
  status: string;
}

const STATUS_MAP: Record<string, { label: string; emoji: string; color: string }> = {
  PLACED:    { label: 'Order Confirmed', emoji: '✅', color: '#22C55E' },
  NEW:       { label: 'Order Confirmed', emoji: '✅', color: '#22C55E' },
  PREPARING: { label: 'Being Prepared',  emoji: '🧋', color: '#F59E0B' },
  READY:     { label: 'Ready!',          emoji: '🎉', color: '#8B5CF6' },
  DELIVERED: { label: 'Delivered',       emoji: '🎊', color: '#10B981' },
};

export default function OrderStatusCard({ orderId, orderNumber, status }: OrderStatusCardProps) {
  const navigate = useNavigate();
  const info = STATUS_MAP[status] ?? { label: status, emoji: '🧋', color: '#FFD54F' };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => navigate(`/tracking/${orderId}`)}
      className="w-full text-left rounded-3xl p-5 border flex items-center gap-4"
      style={{
        background: 'linear-gradient(135deg, #1A0A0A 0%, #2A1510 100%)',
        borderColor: 'rgba(255,213,79,0.2)',
      }}
    >
      {/* Pulsing status indicator */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'rgba(255,213,79,0.12)' }}>
          {info.emoji}
        </div>
        {status === 'PREPARING' && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ background: info.color }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-yellow-400/70 font-bold uppercase tracking-widest mb-0.5">
          Order Status
        </p>
        <h4 className="font-bold text-white text-sm">{info.label}</h4>
        <p className="text-[11px] text-gray-400 mt-0.5">{orderNumber}</p>
      </div>

      <ChevronRight size={18} className="text-gray-500 flex-shrink-0" />
    </motion.button>
  );
}
