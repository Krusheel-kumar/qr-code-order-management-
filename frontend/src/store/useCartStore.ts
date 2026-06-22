import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem } from '../data/menu';

export interface CartItem {
  id: string;
  product: MenuItem;
  customization: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  setTableNumber: (table: string) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: '',
      customerName: '',
      customerPhone: '',
      setTableNumber: (table) => set({ tableNumber: table }),
      setCustomerName: (name) => set({ customerName: name }),
      setCustomerPhone: (phone) => set({ customerPhone: phone }),
      addItem: (item) => set((state) => {
        // Check if identical item already exists (same product and exact same customization)
        const existingItemIndex = state.items.findIndex(
          (i) => i.product.id === item.product.id && i.customization === item.customization
        );

        if (existingItemIndex >= 0) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += item.quantity;
          return { items: newItems };
        }

        return { items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),
      updateQuantity: (id, delta) => set((state) => ({
        items: state.items.map((i) => {
          if (i.id === id) {
            const newQuantity = Math.max(1, i.quantity + delta);
            return { ...i, quantity: newQuantity };
          }
          return i;
        })
      })),
      clearCart: () => set({ items: [] }),
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'popobob-cart',
    }
  )
);
