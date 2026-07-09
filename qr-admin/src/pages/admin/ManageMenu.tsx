import React, { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import type { MenuItem } from '../../data/menu';
import { Search, Plus, Edit2, Trash2, MoreVertical, ChevronRight, ChevronDown, Coffee, Sparkles } from 'lucide-react';
import ItemEditModal from '../../components/admin/ItemEditModal';
import CategoryEditModal from '../../components/admin/CategoryEditModal';
import CustomizationManager from '../../components/admin/CustomizationManager';

export default function ManageMenu() {
  const { 
    categories, 
    categoryDetails, 
    deleteCategory, 
    menuItems, 
    activeItems, 
    activeCategories, 
    toggleItemActive, 
    toggleCategoryActive,
    deleteItem,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'items' | 'customizations'>('items');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || '');
  const [searchQuery, setSearchQuery] = useState('');
  
  React.useEffect(() => {
    if (categories.length > 0) {
      if (!selectedCategory || !categories.includes(selectedCategory)) {
        setSelectedCategory(categories[0]);
      }
    } else {
      setSelectedCategory('');
    }
  }, [categories, selectedCategory]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNewItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const displayedItems = menuItems.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && (searchQuery ? matchesSearch : true);
  });

  return (
    <div className="flex flex-col h-full space-y-6 pb-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-heading font-black text-[#2A1B16] tracking-tight">Menu Management</h2>
        <p className="text-[#8D6E63] font-medium mt-1">Manage categories, items, pricing, and customization groups.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#FAEDCD]">
        <button 
          onClick={() => setActiveTab('items')}
          className={`px-6 py-3.5 font-heading font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === 'items' ? 'border-[#FFD54F] text-[#2A1B16]' : 'border-transparent text-[#8D6E63] hover:text-[#2A1B16]'}`}
        >
          Menu Items
        </button>
        <button 
          onClick={() => setActiveTab('customizations')}
          className={`px-6 py-3.5 font-heading font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === 'customizations' ? 'border-[#FFD54F] text-[#2A1B16]' : 'border-transparent text-[#8D6E63] hover:text-[#2A1B16]'}`}
        >
          Customizations
        </button>
      </div>

      {activeTab === 'items' && (
        <div className="flex flex-col flex-1 glass-panel rounded-2xl border border-[#FAEDCD] overflow-hidden shadow-xs">
          
          {/* Table Header controls */}
          <div className="flex items-center justify-between p-4 border-b border-[#FAEDCD]/60 bg-white/40">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 border border-[#FAEDCD] rounded-xl bg-white/80 py-2 pl-4 pr-10 text-sm text-[#2A1B16] focus:outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/40 shadow-inner"
              />
              <Search className="w-4 h-4 text-[#8D6E63]/60 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button 
              onClick={handleAddNewItem}
              className="bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Categories Sidebar */}
            <div className="w-72 border-r border-[#FAEDCD]/60 bg-[#FFF8E8]/40 flex flex-col shrink-0">
              <div className="p-4 border-b border-[#FAEDCD]/50 bg-[#FFF8E8]/80 flex justify-between items-center">
                <h3 className="text-2xs font-bold text-[#8D6E63] uppercase tracking-widest flex items-center gap-1.5"><Coffee className="w-4 h-4" /> CATEGORY ({categories.length})</h3>
                <button 
                  onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
                  className="text-[#2A1B16] hover:text-[#5C3D2E] flex items-center gap-0.5 text-2xs font-bold tracking-wider uppercase bg-[#FFD54F] px-2.5 py-1.5 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD NEW
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 pb-20 hide-scrollbar">
                {categoryDetails.map((catObj) => {
                  const categoryName = catObj.name;
                  const isActiveCat = activeCategories[categoryName];
                  const isSelected = selectedCategory === categoryName;
                  const isExpanded = expandedCategories[categoryName] || false;
                  
                  return (
                    <div key={catObj.id} className="mb-1.5">
                      <div
                        onClick={() => setSelectedCategory(categoryName)}
                        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-[#FFD54F]/20 text-[#2A1B16] border-[#FFD54F]/40 shadow-2xs font-bold' 
                            : 'hover:bg-[#FFF8E8] text-[#8D6E63] hover:text-[#2A1B16] border-transparent font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {catObj.subcategories && catObj.subcategories.length > 0 ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCategories({...expandedCategories, [categoryName]: !isExpanded});
                              }}
                              className="text-[#8D6E63] hover:text-[#2A1B16] focus:outline-none p-0.5 rounded hover:bg-black/5"
                            >
                              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                          ) : (
                            <div className="w-5" />
                          )}
                          <span className="text-sm truncate">{categoryName}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={isActiveCat}
                              onChange={() => toggleCategoryActive(categoryName)}
                            />
                            <div className="w-8 h-4.5 bg-[#FAEDCD] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#22C55E]"></div>
                          </label>
                          
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(openDropdownId === catObj.id ? null : catObj.id);
                              }}
                              className="p-1 rounded hover:bg-black/5 text-[#8D6E63] hover:text-[#2A1B16] transition-colors"
                            >
                              <MoreVertical size={15} />
                            </button>
                            
                            {openDropdownId === catObj.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }} />
                                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-[#FAEDCD] z-20 py-1.5" onClick={e => e.stopPropagation()}>
                                  <button 
                                    className="w-full text-left px-4 py-2 text-xs font-semibold text-[#2A1B16] hover:bg-[#FFF8E8] flex items-center gap-2"
                                    onClick={() => {
                                      setEditingCategory(catObj);
                                      setIsCategoryModalOpen(true);
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    <Edit2 size={13} /> Edit Category
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50 mt-1"
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this category?')) {
                                        deleteCategory(catObj.id);
                                        if (isSelected) setSelectedCategory('');
                                      }
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    <Trash2 size={13} /> Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Subcategories Dropdown */}
                      {isExpanded && catObj.subcategories && catObj.subcategories.length > 0 && (
                        <div className="ml-9 mt-1 space-y-1 border-l-2 border-[#FAEDCD]/50 pl-2">
                          {catObj.subcategories.map((sub: string, idx: number) => (
                            <div key={idx} className="text-xs text-[#8D6E63] py-1 px-2 hover:bg-[#FFF8E8] rounded-lg truncate cursor-default font-medium">
                              {sub}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Table */}
            <div className="flex-1 flex flex-col bg-white/40 overflow-hidden">
              <div className="overflow-y-auto flex-1 hide-scrollbar">
                <table className="min-w-full divide-y divide-[#FAEDCD]/40">
                  <thead className="bg-[#FFF8E8]/60 sticky top-0 z-10 backdrop-blur-xs">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-2xs font-bold text-[#8D6E63] uppercase tracking-widest border-b border-[#FAEDCD]/40">Item Details</th>
                      <th scope="col" className="px-6 py-3 text-left text-2xs font-bold text-[#8D6E63] uppercase tracking-widest border-b border-[#FAEDCD]/40">Price</th>
                      <th scope="col" className="px-6 py-3 text-center text-2xs font-bold text-[#8D6E63] uppercase tracking-widest border-b border-[#FAEDCD]/40">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-2xs font-bold text-[#8D6E63] uppercase tracking-widest border-b border-[#FAEDCD]/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAEDCD]/30 bg-transparent">
                    {displayedItems.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center text-[#8D6E63] text-sm font-semibold italic">
                          No menu items found under this category.
                        </td>
                      </tr>
                    ) : (
                      Object.entries(
                        displayedItems.reduce((acc, item) => {
                          const sub = item.subcategory || 'Uncategorized';
                          if (!acc[sub]) acc[sub] = [];
                          acc[sub].push(item);
                          return acc;
                        }, {} as Record<string, MenuItem[]>)
                      ).map(([subcategory, items]) => (
                        <React.Fragment key={subcategory}>
                          <tr className="bg-[#FFF8E8]/20">
                            <td colSpan={4} className="px-6 py-2.5 text-2xs font-black text-[#2A1B16] uppercase tracking-widest border-y border-[#FAEDCD]/20 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-[#B87A42]" /> {subcategory}
                            </td>
                          </tr>
                          {items.map((item) => {
                            const isActiveItem = activeItems[item.id];
                            return (
                              <tr key={item.id} className="hover:bg-white/45 transition-colors duration-150">
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-11 w-11 bg-white border border-[#FAEDCD] rounded-xl overflow-hidden shadow-2xs">
                                      {item.image ? (
                                        <img className="h-full w-full object-cover" src={item.image} alt={item.name} />
                                      ) : (
                                        <div className="h-full w-full flex items-center justify-center text-[#8D6E63]/40 text-2xs font-bold bg-[#FFF8E8]/40">No Img</div>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className={`text-sm font-bold text-[#2A1B16] ${!isActiveItem ? 'opacity-50 line-through' : ''}`}>
                                        {item.name}
                                      </div>
                                      <div className="text-xs text-[#8D6E63] line-clamp-1 w-64 mt-0.5">{item.story}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-[#2A1B16] font-black">₹{item.price}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer"
                                      checked={isActiveItem}
                                      onChange={() => toggleItemActive(item.id)}
                                    />
                                    <div className="w-10 h-5 bg-[#FAEDCD] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22C55E]"></div>
                                  </label>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                                  <button onClick={() => handleEditItem(item)} className="text-[#8D6E63] hover:text-[#2A1B16] mx-1.5 p-2 rounded-xl hover:bg-[#FFF8E8] transition-all cursor-pointer">
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => { if(confirm('Delete this item?')) deleteItem(item.id); }} className="text-red-500 hover:text-red-700 mx-1.5 p-2 rounded-xl hover:bg-red-50 transition-all cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customizations' && (
        <div className="max-w-4xl">
          <CustomizationManager />
        </div>
      )}

      {/* Item Edit Modal */}
      <ItemEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={editingItem}
      />

      {/* Category Edit Modal */}
      <CategoryEditModal
        isOpen={isCategoryModalOpen}
        onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
        initialData={editingCategory}
      />
    </div>
  );
}
