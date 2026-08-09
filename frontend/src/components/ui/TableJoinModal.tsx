import React, { useState } from 'react';
import { Sheet } from './Sheet';
import { Input } from './Input';
import { Button } from './Button';
import { useCartStore } from '../../store/useCartStore';

interface TableJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
}

export function TableJoinModal({ isOpen, onClose, tableNumber }: TableJoinModalProps) {
  const [name, setName] = useState('');
  const cartStore = useCartStore();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Save session info
    cartStore.setCustomerName(name);
    cartStore.setTableNumber(tableNumber);
    cartStore.setOrderType('DINE_IN');
    
    onClose();
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <div className="p-8 pt-4 md:pt-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FFFBF2] text-[#D4AF37] flex items-center justify-center mb-6 shadow-sm border border-[#D4AF37]/20">
          <span className="text-3xl">👋</span>
        </div>
        
        <h2 className="text-2xl font-black text-[#1A0B05] mb-2 tracking-tight">
          Joining Table {tableNumber}
        </h2>
        <p className="text-gray-500 font-medium text-sm mb-8">
          Enter your name to start adding items to the table's group order!
        </p>

        <form onSubmit={handleJoin} className="w-full flex flex-col gap-4">
          <Input 
            placeholder="Your Name (e.g. Rahul)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-center font-bold"
            required
            autoFocus
          />
          <Button 
            type="submit" 
            size="lg" 
            className="w-full mt-2"
            disabled={name.trim().length < 2}
          >
            Join Table
          </Button>
        </form>
      </div>
    </Sheet>
  );
}
