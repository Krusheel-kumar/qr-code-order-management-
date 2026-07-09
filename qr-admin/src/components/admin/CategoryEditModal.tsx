import React, { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { X, Plus, Trash2 } from 'lucide-react';

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export default function CategoryEditModal({ isOpen, onClose, initialData }: CategoryEditModalProps) {
  const { addCategory, updateCategory } = useAdminStore();
  const [name, setName] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setSubcategories(initialData.subcategories || []);
      } else {
        setName('');
        setSubcategories([]);
      }
      setNewSubcategory('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleAddSubcategory = () => {
    if (newSubcategory.trim() && !subcategories.includes(newSubcategory.trim())) {
      setSubcategories([...subcategories, newSubcategory.trim()]);
      setNewSubcategory('');
    }
  };

  const handleRemoveSubcategory = (sub: string) => {
    setSubcategories(subcategories.filter((s) => s !== sub));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const trimmedName = name.trim();
    const newCategory = {
      id: trimmedName.toLowerCase().replace(/\s+/g, '-'),
      name: trimmedName,
      icon: 'Tag', // Default icon
      description: '',
      subcategories: subcategories
    };

    if (initialData) {
      await updateCategory(initialData.id, newCategory);
    } else {
      await addCategory(newCategory);
    }
    
    // Reset form
    setName('');
    setSubcategories([]);
    setNewSubcategory('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
      <div className="glass-panel rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#FAEDCD]">
        <div className="p-6 border-b border-[#FAEDCD]/50 flex justify-between items-center bg-[#FFF8E8]/70">
          <h2 className="text-xl font-heading font-black text-[#2A1B16]">{initialData ? 'Edit Category' : 'Add New Category'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#FAEDCD] rounded-full transition-colors cursor-pointer text-[#8D6E63] hover:text-[#2A1B16]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Category Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
              placeholder="e.g. Special Milkteas"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Subcategories</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubcategory())}
                className="flex-1 border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
                placeholder="e.g. Cheese Foam"
              />
              <button
                type="button"
                onClick={handleAddSubcategory}
                className="px-4 bg-[#FFD54F]/20 hover:bg-[#FFD54F]/30 text-[#2A1B16] border border-[#FFD54F]/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            
            {subcategories.length > 0 && (
              <div className="space-y-2 mt-2 max-h-40 overflow-y-auto pr-1 hide-scrollbar">
                {subcategories.map((sub, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#FFF8E8]/50 border border-[#FAEDCD] rounded-xl px-3 py-2">
                    <span className="text-sm text-[#2A1B16] font-semibold">{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcategory(sub)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {subcategories.length === 0 && (
              <p className="text-xs text-[#8D6E63] italic mt-2">No subcategories added yet. (Optional)</p>
            )}
          </div>

          <div className="pt-4 border-t border-[#FAEDCD]/30 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-[#8D6E63] bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-[#FFD54F] bg-[#2A1B16] hover:bg-[#3D2921] rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
