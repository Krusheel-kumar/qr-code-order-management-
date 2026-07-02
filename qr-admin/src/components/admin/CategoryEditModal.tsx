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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <h2 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Category' : 'Add New Category'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Pastries"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subcategories</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubcategory())}
                className="flex-1 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Croissants"
              />
              <button
                type="button"
                onClick={handleAddSubcategory}
                className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            
            {subcategories.length > 0 && (
              <div className="space-y-2 mt-2">
                {subcategories.map((sub, index) => (
                  <div key={index} className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2">
                    <span className="text-sm text-blue-900 font-medium">{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcategory(sub)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {subcategories.length === 0 && (
              <p className="text-sm text-gray-500 italic mt-2">No subcategories added yet. (Optional)</p>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200"
            >
              {initialData ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
