import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { STORES } from '../../data/stores';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function StoreSelectorSheet({ isOpen, onClose }: Props) {
  const { setOrderType, setStoreId } = useCartStore();

  const handlePickup = (storeId: string) => {
    setOrderType('PICKUP');
    setStoreId(storeId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#FFFBF2] rounded-t-3xl z-[10000] p-6 pb-12 max-h-[85vh] overflow-y-auto"
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
            <h2 className="text-xl font-black text-[#1A0B05] mb-6 text-center tracking-tight">Select Pickup Store</h2>
            
            <div className="grid grid-cols-1 gap-3">
              {STORES.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handlePickup(store.id)}
                  className={`w-full bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border ${!store.isOpen ? 'opacity-60 border-red-100 bg-red-50/30 cursor-not-allowed' : 'border-gray-100 hover:border-[#FFB300]/50 active:scale-[0.98]'} flex flex-col text-left transition-all`}
                  disabled={!store.isOpen}
                >
                  <div className="flex justify-between w-full items-start mb-1">
                    <span className="font-bold text-[#1A0B05] text-[15px]">{store.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${store.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {store.isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  <span className="text-xs text-[#8D6E63] mt-0.5">{store.address}</span>
                  <span className="text-xs text-gray-400 mt-2 font-medium flex items-center gap-2">
                    <span>🕒 Closes {store.closesAt}</span>
                    <span>📍 {store.distance}</span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
