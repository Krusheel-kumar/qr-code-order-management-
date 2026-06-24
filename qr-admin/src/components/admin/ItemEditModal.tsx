import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import type { MenuItem } from '../../data/menu';
import { X, UploadCloud } from 'lucide-react';

interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null; // null implies we're adding a new item
}

const SUBCATEGORIES: Record<string, string[]> = {
  'Milk Teas': ['Classics', 'Fruit Series', 'Chocolate', 'Coffee', 'Signatures'],
  'Boba Shakes': ['All Time Boba Milkshakes', 'Signature Boba Milkshakes'],
  'Chillers': ['Lemonades', 'Virgin Mojitos']
};

export default function ItemEditModal({ isOpen, onClose, item }: ItemEditModalProps) {
  const { addItem, updateItem, categories } = useAdminStore();
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    story: '',
    category: categories[0],
    subcategory: '',
    image: ''
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        price: 0,
        story: '',
        category: categories[0],
        subcategory: '',
        image: ''
      });
    }
  }, [item, categories, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      updateItem({ ...item, ...formData } as MenuItem);
    } else {
      const newItem: MenuItem = {
        id: `p-${Date.now()}`,
        name: formData.name || 'New Item',
        category: formData.category || categories[0],
        price: formData.price || 0,
        image: formData.image || '',
        story: formData.story || '',
        subcategory: formData.subcategory || '',
        flavorNotes: [],
        mood: 'Happy Mood',
        rating: 0,
        calories: 0,
        flavorProfile: { sweetness: 0, creaminess: 0, refreshment: 0, energy: 0 },
        pairings: []
      };
      addItem(newItem);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{item ? 'Edit Item' : 'Add New Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Matcha Boba"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="299"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={formData.category || categories[0]}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {SUBCATEGORIES[formData.category as string] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <select 
                    value={formData.subcategory || ''}
                    onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Subcategory</option>
                    {SUBCATEGORIES[formData.category as string].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors bg-gray-50">
                {formData.image ? (
                  <div className="relative group w-full flex justify-center">
                    <img src={formData.image} alt="Preview" className="h-32 object-cover rounded-md shadow-sm" />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, image: ''})} 
                      className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setFormData({...formData, image: reader.result as string});
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <input 
                  type="text" 
                  placeholder="Or enter image URL here..." 
                  value={formData.image || ''}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Display Flags Section */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Discovery App Display Flags</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  checked={formData.isFeatured || false}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Feature on Discovery Home</span>
                  <span className="text-xs text-gray-500">Shows up as the giant banner</span>
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  checked={formData.isBestseller || false}
                  onChange={(e) => setFormData({...formData, isBestseller: e.target.checked})}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Mark as Bestseller</span>
                  <span className="text-xs text-gray-500">Shows up in 'Best Sellers' list</span>
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  checked={formData.isNewLaunch || false}
                  onChange={(e) => setFormData({...formData, isNewLaunch: e.target.checked})}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Mark as New Launch</span>
                  <span className="text-xs text-gray-500">Shows up in 'New Launches' list</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              rows={3}
              value={formData.story || ''}
              onChange={(e) => setFormData({...formData, story: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Write a short description..."
            />
          </div>

          {/* Add-ons Section */}
          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Eligible Add-ons (Toppings)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {useAdminStore.getState().addons.map(addon => {
                const isSelected = formData.eligibleAddons?.includes(addon.id) || false;
                return (
                  <label key={addon.id} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      checked={isSelected}
                      onChange={(e) => {
                        const current = formData.eligibleAddons || [];
                        setFormData({
                          ...formData,
                          eligibleAddons: e.target.checked 
                            ? [...current, addon.id]
                            : current.filter(id => id !== addon.id)
                        });
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{addon.name}</span>
                      <span className="text-xs text-gray-500">+₹{addon.price}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            {useAdminStore.getState().addons.length === 0 && (
              <p className="text-sm text-gray-500 italic">No add-ons available. Create them in the "Add-ons & Toppings" tab.</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {item ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
