import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Clock, Percent, Package, Truck, Save, ShieldAlert, Search } from 'lucide-react';
import { STORES } from '../../data/stores';

export default function StoreSettings() {
  const { storeSettings, updateStoreSettings, menuItems, customizationOptions, customizationGroups } = useAdminStore();
  
  const [selectedStoreId, setSelectedStoreId] = useState('1');
  const [blacklistedProductIds, setBlacklistedProductIds] = useState<string[]>([]);
  const [blacklistedOptionIds, setBlacklistedOptionIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [optionSearch, setOptionSearch] = useState('');

  const loadBlacklists = async (storeId: string) => {
    setIsLoading(true);
    try {
      const api = await import('../../api');
      const [products, options] = await Promise.all([
        api.getStoreProductBlacklist(storeId),
        api.getStoreOptionBlacklist(storeId)
      ]);
      setBlacklistedProductIds(products || []);
      setBlacklistedOptionIds(options || []);
    } catch (err: any) {
      console.error("Failed to load store blacklist:", err);
      alert(`Error loading store blacklist: ${err.message}. Please select store again to retry.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStoreId) {
      loadBlacklists(selectedStoreId);
    }
  }, [selectedStoreId]);

  const handleToggleProductBlacklist = async (productId: string) => {
    const isCurrentlyBlacklisted = blacklistedProductIds.includes(productId);
    try {
      const api = await import('../../api');
      if (isCurrentlyBlacklisted) {
        await api.removeProductFromStoreBlacklist(selectedStoreId, productId);
        setBlacklistedProductIds(prev => prev.filter(id => id !== productId));
      } else {
        await api.blacklistProductAtStore(selectedStoreId, productId);
        setBlacklistedProductIds(prev => [...prev, productId]);
      }
    } catch (err: any) {
      console.error("Failed to toggle product blacklist:", err);
      alert(`Failed to update blacklist: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleToggleOptionBlacklist = async (optionId: string) => {
    const isCurrentlyBlacklisted = blacklistedOptionIds.includes(optionId);
    try {
      const api = await import('../../api');
      if (isCurrentlyBlacklisted) {
        await api.removeOptionFromStoreBlacklist(selectedStoreId, optionId);
        setBlacklistedOptionIds(prev => prev.filter(id => id !== optionId));
      } else {
        await api.blacklistOptionAtStore(selectedStoreId, optionId);
        setBlacklistedOptionIds(prev => [...prev, optionId]);
      }
    } catch (err: any) {
      console.error("Failed to toggle option blacklist:", err);
      alert(`Failed to update blacklist: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStoreSettings(storeSettings);
      alert('Store settings saved successfully!');
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <div>
        <h1 className="text-3xl font-heading font-black text-[#2A1B16] tracking-tight">Store Settings</h1>
        <p className="text-[#8D6E63] font-medium mt-1">Configure operations, wait times, and financial parameters.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Operations & Wait Times */}
        <div className="glass-panel rounded-2xl border border-[#FAEDCD] overflow-hidden shadow-xs bg-[#FFFDF8]">
          <div className="p-6 border-b border-[#FAEDCD]/60 bg-[#FFF8E8]/40 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#8D6E63]" />
            <h2 className="text-lg font-heading font-bold text-[#2A1B16]">Operations & Wait Times</h2>
          </div>
          <div className="p-6">
            <div className="max-w-md">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2A1B16]">Current Prep Time (Minutes)</label>
                <span className="text-sm font-black text-[#B87A42]">{storeSettings.prepTime} mins</span>
              </div>
              <p className="text-xs text-[#8D6E63] font-medium mb-4">
                Adjust this slider during busy hours. This time will be displayed to customers before they place an order.
              </p>
              <input 
                type="range" 
                min="5" 
                max="90" 
                step="5" 
                value={storeSettings.prepTime}
                onChange={(e) => updateStoreSettings({ prepTime: Number(e.target.value) })}
                className="w-full h-2 bg-[#FAEDCD] rounded-lg appearance-none cursor-pointer accent-[#2A1B16]"
              />
              <div className="flex justify-between text-2xs text-[#8D6E63]/70 font-semibold mt-2">
                <span>5m</span>
                <span>45m</span>
                <span>90m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="glass-panel rounded-2xl border border-[#FAEDCD] overflow-hidden shadow-xs bg-[#FFFDF8]">
          <div className="p-6 border-b border-[#FAEDCD]/60 bg-[#FFF8E8]/40 flex items-center gap-3">
            <Percent className="w-5 h-5 text-[#8D6E63]" />
            <h2 className="text-lg font-heading font-bold text-[#2A1B16]">Financials & Fees</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A1B16] mb-1">
                Tax Rate (%)
              </label>
              <p className="text-2xs text-[#8D6E63] font-semibold mb-3">Applied to the cart subtotal.</p>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  step="0.1"
                  value={storeSettings.taxRate}
                  onChange={(e) => updateStoreSettings({ taxRate: Number(e.target.value) })}
                  className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 pr-8 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D6E63] font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A1B16] mb-1">
                <Package className="w-4 h-4 text-[#8D6E63]/50" /> Packing Charge (₹)
              </label>
              <p className="text-2xs text-[#8D6E63] font-semibold mb-3">Flat fee added to takeaways.</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6E63] font-bold">₹</span>
                <input 
                  type="number" 
                  min="0"
                  value={storeSettings.packingCharge}
                  onChange={(e) => updateStoreSettings({ packingCharge: Number(e.target.value) })}
                  className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 pl-8 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A1B16] mb-1">
                <Truck className="w-4 h-4 text-[#8D6E63]/50" /> Delivery Fee (₹)
              </label>
              <p className="text-2xs text-[#8D6E63] font-semibold mb-3">Flat fee added to deliveries.</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6E63] font-bold">₹</span>
                <input 
                  type="number" 
                  min="0"
                  value={storeSettings.deliveryFee}
                  onChange={(e) => updateStoreSettings({ deliveryFee: Number(e.target.value) })}
                  className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 pl-8 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
                />
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#FAEDCD]/30">
          <button type="submit" className="bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] px-8 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95">
            <Save className="w-4 h-4" /> Save Store Settings
          </button>
        </div>

      </form>

      {/* Store Branch Specific Blacklists */}
      <div className="glass-panel rounded-2xl border border-[#FAEDCD] overflow-hidden shadow-xs bg-[#FFFDF8] mt-8">
        <div className="p-6 border-b border-[#FAEDCD]/60 bg-[#FFF8E8]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="text-lg font-heading font-bold text-[#2A1B16]">Branch Availability & Blacklists</h2>
              <p className="text-xs text-[#8D6E63] font-semibold mt-0.5">Deactivate specific products or toppings at individual branches.</p>
            </div>
          </div>
          {/* Store Select Dropdown */}
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="border border-[#FAEDCD] rounded-xl bg-white p-2.5 text-xs font-bold text-[#2A1B16] outline-none cursor-pointer focus:ring-4 focus:ring-[#FFD54F]/20"
          >
            {STORES.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-[#FAEDCD] border-t-[#B87A42] rounded-full animate-spin"></div>
            <p className="text-xs text-[#8D6E63] font-semibold">Loading branch availability overrides...</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Product Blacklist Column */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-heading font-black text-[#2A1B16] uppercase tracking-wider">Blacklist Products</h3>
                <span className="text-2xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  {blacklistedProductIds.length} hidden
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]/50" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-2.5 pl-9 text-xs text-[#2A1B16] outline-none placeholder-[#8D6E63]/30"
                />
              </div>
              <div className="max-h-[350px] overflow-y-auto border border-[#FAEDCD]/50 rounded-xl divide-y divide-[#FAEDCD]/30 p-2 space-y-1 bg-white">
                {menuItems
                  .filter(item => item.name.toLowerCase().includes(productSearch.toLowerCase()))
                  .map(item => {
                    const isBlacklisted = blacklistedProductIds.includes(item.id);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-2 hover:bg-[#FFF8E8]/20 transition-colors">
                        <div className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt="" className="w-8 h-8 object-cover rounded-lg" />}
                          <div>
                            <p className="text-xs font-bold text-[#2A1B16]">{item.name}</p>
                            <p className="text-[10px] text-[#8D6E63] font-semibold">{item.category}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isBlacklisted}
                            onChange={() => handleToggleProductBlacklist(item.id)}
                          />
                          <div className="w-9 h-5 bg-[#FAEDCD] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                    );
                  })}
                {menuItems.filter(item => item.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                  <p className="text-center py-8 text-xs text-[#8D6E63] italic">No products found matching query.</p>
                )}
              </div>
            </div>

            {/* Option Blacklist Column */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-heading font-black text-[#2A1B16] uppercase tracking-wider">Blacklist Toppings & Choices</h3>
                <span className="text-2xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  {blacklistedOptionIds.length} hidden
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]/50" />
                <input
                  type="text"
                  placeholder="Search customization options..."
                  value={optionSearch}
                  onChange={(e) => setOptionSearch(e.target.value)}
                  className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-2.5 pl-9 text-xs text-[#2A1B16] outline-none placeholder-[#8D6E63]/30"
                />
              </div>
              <div className="max-h-[350px] overflow-y-auto border border-[#FAEDCD]/50 rounded-xl p-3 bg-white space-y-4">
                {customizationGroups.map(group => {
                  const groupOptions = customizationOptions.filter(
                    o => o.groupId === group.id && o.name.toLowerCase().includes(optionSearch.toLowerCase())
                  );
                  if (groupOptions.length === 0) return null;
                  return (
                    <div key={group.id} className="space-y-2">
                      <h4 className="text-2xs font-black uppercase text-[#B87A42] border-b border-[#FAEDCD]/40 pb-1">{group.name}</h4>
                      <div className="space-y-1">
                        {groupOptions.map(option => {
                          const isBlacklisted = blacklistedOptionIds.includes(option.id);
                          return (
                            <div key={option.id} className="flex items-center justify-between p-1.5 hover:bg-[#FFF8E8]/10 rounded-lg">
                              <span className="text-xs font-bold text-[#2A1B16]">{option.name}</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={isBlacklisted}
                                  onChange={() => handleToggleOptionBlacklist(option.id)}
                                />
                                <div className="w-9 h-5 bg-[#FAEDCD] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {customizationOptions.filter(o => o.name.toLowerCase().includes(optionSearch.toLowerCase())).length === 0 && (
                  <p className="text-center py-8 text-xs text-[#8D6E63] italic">No customization options found.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

