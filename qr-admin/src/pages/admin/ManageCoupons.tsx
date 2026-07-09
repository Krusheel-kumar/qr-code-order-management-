import { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Ticket, Plus, Trash2 } from 'lucide-react';
import type { Coupon } from '../../data/models';

export default function ManageCoupons() {
  const { coupons, addCoupon, deleteCoupon, toggleCouponActive } = useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    type: 'percentage',
    value: 0,
    active: true
  });

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.value) return;
    
    addCoupon({
      id: `cp-${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type as 'percentage' | 'flat',
      value: Number(newCoupon.value),
      active: true
    });
    setShowForm(false);
    setNewCoupon({ code: '', type: 'percentage', value: 0, active: true });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-black text-[#2A1B16] tracking-tight">Promo Codes & Coupons</h1>
          <p className="text-[#8D6E63] font-medium mt-1">Create and manage discounts for your customers.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddCoupon} className="glass-panel p-6 rounded-2xl border border-[#FAEDCD] bg-white/50 shadow-sm space-y-4">
          <h3 className="text-base font-heading font-bold text-[#2A1B16] mb-4">New Promo Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Coupon Code</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. SUMMER20"
                value={newCoupon.code} 
                onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} 
                className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30 uppercase" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Discount Type</label>
              <select 
                value={newCoupon.type} 
                onChange={e => setNewCoupon({...newCoupon, type: e.target.value as 'percentage' | 'flat'})} 
                className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium cursor-pointer"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Discount Value</label>
              <input 
                required 
                type="number" 
                min="1"
                placeholder={newCoupon.type === 'percentage' ? '20' : '100'}
                value={newCoupon.value || ''} 
                onChange={e => setNewCoupon({...newCoupon, value: Number(e.target.value)})} 
                className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#FAEDCD]/30">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-xs font-bold text-[#8D6E63] bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-xs font-bold text-[#FFD54F] bg-[#2A1B16] hover:bg-[#3D2921] rounded-xl transition-colors shadow-2xs cursor-pointer">Save Coupon</button>
          </div>
        </form>
      )}

      <div className="glass-panel rounded-2xl shadow-xs border border-[#FAEDCD] overflow-hidden">
        <table className="min-w-full divide-y divide-[#FAEDCD]/40">
          <thead className="bg-[#FFF8E8]/60">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left text-2xs font-bold text-[#8D6E63] uppercase tracking-widest border-b border-[#FAEDCD]/40">Code</th>
              <th scope="col" className="px-6 py-3.5 text-left text-2xs font-bold text-[#8D6E63] uppercase tracking-widest border-b border-[#FAEDCD]/40">Discount</th>
              <th scope="col" className="px-6 py-3.5 text-center text-2xs font-bold text-[#8D6E63] uppercase tracking-widest border-b border-[#FAEDCD]/40">Status</th>
              <th scope="col" className="px-6 py-3.5 text-right text-2xs font-bold text-[#8D6E63] uppercase tracking-widest border-b border-[#FAEDCD]/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAEDCD]/30 bg-transparent">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-[#8D6E63] text-sm font-semibold italic">
                  No coupons found. Create one to get started.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/45 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#FFD54F]/20 text-[#2A1B16] border border-[#FFD54F]/30 rounded-xl">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-[#2A1B16] tracking-wide">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-black text-[#2A1B16]">
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={coupon.active}
                        onChange={() => toggleCouponActive(coupon.id)}
                      />
                      <div className="w-10 h-5 bg-[#FAEDCD] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22C55E]"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                    <button onClick={() => { if(confirm('Delete coupon code?')) deleteCoupon(coupon.id); }} className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

