import { useAdminStore } from '../../store/useAdminStore';
import { Clock, Percent, Package, Truck, Save } from 'lucide-react';

export default function StoreSettings() {
  const { storeSettings, updateStoreSettings } = useAdminStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to save settings
    alert('Store settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-500 mt-1">Configure operations, wait times, and financial parameters.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Operations & Wait Times */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900">Operations & Wait Times</h2>
          </div>
          <div className="p-6">
            <div className="max-w-md">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-900">Current Prep Time (Minutes)</label>
                <span className="text-sm font-bold text-blue-600">{storeSettings.prepTime} mins</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Adjust this slider during busy hours. This time will be displayed to customers before they place an order.
              </p>
              <input 
                type="range" 
                min="5" 
                max="90" 
                step="5" 
                value={storeSettings.prepTime}
                onChange={(e) => updateStoreSettings({ prepTime: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>5m</span>
                <span>45m</span>
                <span>90m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
            <Percent className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900">Financials & Fees</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-1">
                Tax Rate (%)
              </label>
              <p className="text-xs text-gray-500 mb-3">Applied to the cart subtotal.</p>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  step="0.1"
                  value={storeSettings.taxRate}
                  onChange={(e) => updateStoreSettings({ taxRate: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 pl-4 pr-8 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-1">
                <Package className="w-4 h-4 text-gray-400" /> Packing Charge (₹)
              </label>
              <p className="text-xs text-gray-500 mb-3">Flat fee added to takeaways.</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input 
                  type="number" 
                  min="0"
                  value={storeSettings.packingCharge}
                  onChange={(e) => updateStoreSettings({ packingCharge: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 pl-8 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-1">
                <Truck className="w-4 h-4 text-gray-400" /> Delivery Fee (₹)
              </label>
              <p className="text-xs text-gray-500 mb-3">Flat fee added to deliveries.</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input 
                  type="number" 
                  min="0"
                  value={storeSettings.deliveryFee}
                  onChange={(e) => updateStoreSettings({ deliveryFee: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 pl-8 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm">
            <Save className="w-4 h-4" /> Save Store Settings
          </button>
        </div>

      </form>
    </div>
  );
}
