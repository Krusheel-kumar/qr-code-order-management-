import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UnifiedOrder {
  id: string;
  terminalTimestamp: number | null;
  isDismissed: boolean;
}

interface OrderStore {
  orders: UnifiedOrder[];
  // Legacy fields for backward compatibility during migration
  currentOrderId?: string | null;
  terminalTimestamp?: number | null;
  isDismissed?: boolean;
  
  addOrder: (id: string) => void;
  markTerminal: (id: string, timestamp: number) => void;
  dismissOrder: (id: string) => void;
  clearOrder: (id: string) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      
      addOrder: (id) => set((state) => {
        // Prevent duplicates
        if (state.orders.find(o => o.id === id)) return state;
        return {
          orders: [{ id, terminalTimestamp: null, isDismissed: false }, ...state.orders]
        };
      }),
      
      markTerminal: (id, timestamp) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, terminalTimestamp: timestamp } : o)
      })),
      
      dismissOrder: (id) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, isDismissed: true } : o)
      })),
      
      clearOrder: (id) => set((state) => ({
        orders: state.orders.filter(o => o.id !== id)
      })),
    }),
    {
      name: 'popobob-unified-order',
      onRehydrateStorage: () => (state) => {
        // Migration layer for legacy single-order state
        if (state && state.currentOrderId) {
          const legacyOrderExists = state.orders?.find(o => o.id === state.currentOrderId);
          if (!legacyOrderExists) {
             state.orders = [{
               id: state.currentOrderId,
               terminalTimestamp: state.terminalTimestamp || null,
               isDismissed: state.isDismissed || false
             }, ...(state.orders || [])];
          }
          // Clean up legacy fields
          delete state.currentOrderId;
          delete state.terminalTimestamp;
          delete state.isDismissed;
        }
      }
    }
  )
);
