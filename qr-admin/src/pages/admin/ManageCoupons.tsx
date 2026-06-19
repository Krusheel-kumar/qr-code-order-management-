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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promo Codes & Coupons</h1>
          <p className="text-gray-500 mt-1">Create and manage discounts for your customers.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddCoupon} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">New Promo Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. SUMMER20"
                value={newCoupon.code} 
                onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} 
                className="w-full border border-gray-300 rounded-lg p-2.5 uppercase" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
              <select 
                value={newCoupon.type} 
                onChange={e => setNewCoupon({...newCoupon, type: e.target.value as 'percentage' | 'flat'})} 
                className="w-full border border-gray-300 rounded-lg p-2.5"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
              <input 
                required 
                type="number" 
                min="1"
                placeholder={newCoupon.type === 'percentage' ? '20' : '100'}
                value={newCoupon.value || ''} 
                onChange={e => setNewCoupon({...newCoupon, value: Number(e.target.value)})} 
                className="w-full border border-gray-300 rounded-lg p-2.5" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Coupon</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Code</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Discount</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                  No coupons found. Create one to get started.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-gray-900 tracking-wide">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">
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
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => deleteCoupon(coupon.id)} className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors">
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
