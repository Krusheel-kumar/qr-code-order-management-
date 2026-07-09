import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import type { MenuItem } from '../../data/menu';
import { X, UploadCloud, ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';
import type { CustomizationGroup } from '../../data/models';

interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null; // null implies we're adding a new item
}

export default function ItemEditModal({ isOpen, onClose, item }: ItemEditModalProps) {
  const { addItem, updateItem, categories, categoryDetails, customizationGroups } = useAdminStore();
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    story: '',
    category: categories[0],
    subcategory: '',
    image: ''
  });
  const [assignedGroups, setAssignedGroups] = useState<CustomizationGroup[]>([]);
  const [originalAssignedIds, setOriginalAssignedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData(item);
        const fetchMappings = async () => {
          try {
            const api = await import('../../api');
            const data = await api.getProductCustomizationGroups(item.id);
            setAssignedGroups(data || []);
            setOriginalAssignedIds((data || []).map((g: any) => g.id));
          } catch (err) {
            console.error("Failed to fetch product customization groups:", err);
          }
        };
        fetchMappings();
      } else {
        setFormData({
          name: '',
          price: 0,
          story: '',
          category: categories[0],
          subcategory: '',
          image: ''
        });
        setAssignedGroups([]);
        setOriginalAssignedIds([]);
      }
    }
  }, [item, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let productId = item?.id;
      if (item) {
        await updateItem({ ...item, ...formData } as MenuItem);
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
        const created = await addItem(newItem);
        productId = created?.id || newItem.id;
      }

      // Synchronize mappings if we have a valid product ID
      if (productId) {
        const api = await import('../../api');

        // 1. Determine removed mappings
        const toRemove = originalAssignedIds.filter(id => !assignedGroups.some(g => g.id === id));
        for (const groupId of toRemove) {
          await api.removeProductCustomizationGroup(productId, groupId);
        }

        // 2. Determine added mappings
        const toAdd = assignedGroups.filter(g => !originalAssignedIds.includes(g.id));
        for (const group of toAdd) {
          await api.assignProductCustomizationGroup(productId, group.id);
        }

        // 3. Determine if order changed and run reorder mapping
        const currentGroupIds = assignedGroups.map(g => g.id);
        const originalGroupIds = originalAssignedIds.filter(id => currentGroupIds.includes(id));
        // Check if order of remaining elements differs
        const remainingAssigned = currentGroupIds.filter(id => originalAssignedIds.includes(id));
        const orderChanged = JSON.stringify(remainingAssigned) !== JSON.stringify(originalGroupIds);
        
        if (assignedGroups.length > 0 && (toAdd.length > 0 || orderChanged || toRemove.length > 0)) {
          await api.reorderProductCustomizationGroups(productId, currentGroupIds);
        }
      }

      onClose();
    } catch (err: any) {
      console.error("Failed to save product customization mappings:", err);
      alert(`Error synchronizing customization groups: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="glass-panel rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-[#FAEDCD] shadow-2xl overflow-hidden bg-[#FFFDF8]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#FAEDCD]/50 bg-[#FFF8E8]/70">
          <h2 className="text-xl font-heading font-black text-[#2A1B16]">{item ? 'Edit Item' : 'Add New Item'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#FAEDCD] rounded-full transition-colors text-[#8D6E63] hover:text-[#2A1B16] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Item Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
                  placeholder="e.g. Matcha Boba"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Price (₹)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
                  placeholder="299"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Category</label>
                <select 
                  value={formData.category || categories[0]}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {(() => {
                const selectedCatObj = categoryDetails?.find((c: any) => c.name === formData.category);
                const dynamicSubcategories = selectedCatObj?.subcategories || [];
                if (dynamicSubcategories.length === 0) return null;
                
                return (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Subcategory</label>
                    <select 
                      value={formData.subcategory || ''}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                      className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium cursor-pointer"
                    >
                      <option value="">Select Subcategory</option>
                      {dynamicSubcategories.map((sub: string) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                );
              })()}
            </div>

            {/* Image Section */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Item Image</label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#FAEDCD] border-dashed rounded-2xl hover:border-[#FFD54F] transition-colors bg-[#FFF8E8]/30">
                {formData.image ? (
                  <div className="relative group w-full flex justify-center">
                    <img src={formData.image} alt="Preview" className="h-32 object-cover rounded-xl shadow-sm" />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, image: ''})} 
                      className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1.5 shadow hover:bg-red-50 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-[#8D6E63]/40" />
                    <div className="flex text-sm text-[#8D6E63] justify-center font-bold">
                      <label className="relative cursor-pointer bg-transparent rounded-md text-[#B87A42] hover:text-[#5C3D2E] focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressedBase64 = await compressImage(file, 800, 0.7);
                              setFormData({...formData, image: compressedBase64});
                            } catch (err) {
                              console.error("Compression failed", err);
                            }
                          }
                        }} />
                      </label>
                    </div>
                    <p className="text-2xs text-[#8D6E63]/60">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
              
              <div className="mt-3.5">
                <input 
                  type="text" 
                  placeholder="Or enter image URL here..." 
                  value={formData.image || ''}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-2 text-xs text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Discovery Sections Section */}
          <div className="pt-4 border-t border-[#FAEDCD]/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-3">Discovery App Sections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {useAdminStore.getState().discoverySections.map(section => {
                const isSelected = formData.discoverySections?.some(s => s.id === section.id) || false;
                return (
                  <label key={section.id} className={`flex items-center gap-3.5 p-3.5 border rounded-2xl cursor-pointer transition-all duration-200 ${isSelected ? 'border-[#FFD54F] bg-[#FFD54F]/10' : 'border-[#FAEDCD] hover:bg-[#FFF8E8]/40'}`}>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#2A1B16] rounded border-gray-300 focus:ring-0 cursor-pointer"
                      checked={isSelected}
                      onChange={(e) => {
                        const current = formData.discoverySections || [];
                        setFormData({
                          ...formData,
                          discoverySections: e.target.checked
                            ? [...current, section]
                            : current.filter(s => s.id !== section.id)
                        });
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#2A1B16]">{section.title}</span>
                      <span className="text-[10px] font-semibold text-[#8D6E63]">Home Tab Spotlight</span>
                    </div>
                  </label>
                );
              })}
            </div>
            {useAdminStore.getState().discoverySections.length === 0 && (
              <p className="text-xs text-[#8D6E63] italic mt-2">No sections available. Create them in the Discovery tab.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Description</label>
            <textarea 
              rows={3}
              value={formData.story || ''}
              onChange={(e) => setFormData({...formData, story: e.target.value})}
              className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
              placeholder="Write a short description..."
            />
          </div>

          {/* Customization Groups Section */}
          <div className="pt-4 border-t border-[#FAEDCD]/30 space-y-4">
            <div className="flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8D6E63]">Mapped Customization Groups</h3>
              <p className="text-2xs text-[#8D6E63] mt-0.5">Assigned groups determine order options displayed at checkout.</p>
            </div>

            {/* List of Mapped Groups */}
            <div className="space-y-2">
              {assignedGroups.map((group, index) => (
                <div key={group.id} className="flex items-center justify-between p-3 border border-[#FAEDCD] rounded-2xl bg-white shadow-2xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xs text-[#8D6E63] bg-[#FFF8E8] border border-[#FAEDCD] px-2 py-0.5 rounded-md">{index + 1}</span>
                    <div>
                      <span className="text-sm font-bold text-[#2A1B16]">{group.name}</span>
                      <span className="text-[10px] text-[#8D6E63] ml-2">({group.id})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        const newOrder = [...assignedGroups];
                        const temp = newOrder[index];
                        newOrder[index] = newOrder[index - 1];
                        newOrder[index - 1] = temp;
                        setAssignedGroups(newOrder);
                      }}
                      className="p-1.5 hover:bg-[#FFF8E8] rounded-lg border border-[#FAEDCD] text-[#8D6E63] hover:text-[#2A1B16] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === assignedGroups.length - 1}
                      onClick={() => {
                        const newOrder = [...assignedGroups];
                        const temp = newOrder[index];
                        newOrder[index] = newOrder[index + 1];
                        newOrder[index + 1] = temp;
                        setAssignedGroups(newOrder);
                      }}
                      className="p-1.5 hover:bg-[#FFF8E8] rounded-lg border border-[#FAEDCD] text-[#8D6E63] hover:text-[#2A1B16] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAssignedGroups(assignedGroups.filter(g => g.id !== group.id));
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-lg border border-red-200 text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {assignedGroups.length === 0 && (
                <p className="text-xs text-[#8D6E63] italic">No customization groups mapped. Add one from the list below.</p>
              )}
            </div>

            {/* Add new group selector */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-2">Available Groups</h4>
              <div className="flex flex-wrap gap-2">
                {customizationGroups
                  .filter(cg => !assignedGroups.some(g => g.id === cg.id))
                  .map(cg => (
                    <button
                      key={cg.id}
                      type="button"
                      onClick={() => setAssignedGroups([...assignedGroups, cg])}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8E8] border border-[#FAEDCD] hover:border-[#FFD54F] rounded-full text-xs font-bold text-[#8D6E63] hover:text-[#2A1B16] cursor-pointer transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#B87A42]" /> {cg.name}
                    </button>
                  ))}
                {customizationGroups.filter(cg => !assignedGroups.some(g => g.id === cg.id)).length === 0 && (
                  <p className="text-2xs text-[#8D6E63] italic">All active customization groups have been mapped.</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#FAEDCD]/30 flex justify-end gap-3 mt-8">
            <button 
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-[#8D6E63] bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-xs font-bold text-[#FFD54F] bg-[#2A1B16] hover:bg-[#3D2921] rounded-xl transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : item ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
