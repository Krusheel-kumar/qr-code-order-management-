import { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import ItemEditModal from '../../components/admin/ItemEditModal';
import type { Addon } from '../../data/models'; 

export default function ManageMenu() {
  const { 
    categories, 
    menuItems, 
    activeItems, 
    activeCategories, 
    toggleItemActive, 
    toggleCategoryActive,
    deleteItem,
    addons,
    addAddon,
    updateAddon,
    deleteAddon,
    toggleAddonActive
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'items' | 'addons'>('items');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || '');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // We'll just use any for local type safety ease

  // Addon form state
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [newAddon, setNewAddon] = useState<Partial<Addon>>({ name: '', price: 0, isActive: true });

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNewItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSaveAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddon.name) return;
    
    if (newAddon.id) {
      updateAddon(newAddon as Addon);
    } else {
      addAddon({
        id: `a-${Date.now()}`,
        name: newAddon.name,
        price: Number(newAddon.price) || 0,
        isActive: true
      });
    }
    setShowAddonForm(false);
    setNewAddon({ name: '', price: 0, isActive: true });
  };

  const displayedItems = menuItems.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && (searchQuery ? matchesSearch : true);
  });

  return (
    <div className="flex flex-col h-full space-y-6 pb-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
        <p className="text-sm text-gray-500 mt-1">Manage categories, items, pricing, and toppings.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('items')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'items' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Menu Items
        </button>
        <button 
          onClick={() => setActiveTab('addons')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'addons' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Add-ons & Toppings
        </button>
      </div>

      {activeTab === 'items' && (
        <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <button 
              onClick={handleAddNewItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Categories Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-100 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Categories</h3>
                <button className="text-blue-600 hover:text-blue-800"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {categories.map((category) => {
                  const isActiveCat = activeCategories[category];
                  const isSelected = selectedCategory === category;
                  
                  return (
                    <div
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center justify-between p-3 rounded-lg mb-1 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className={`text-sm font-medium ${isSelected ? 'font-bold' : ''}`}>{category}</span>
                      
                      <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={isActiveCat}
                          onChange={() => toggleCategoryActive(category)}
                        />
                        <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Table */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              <div className="overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedItems.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                          No items found.
                        </td>
                      </tr>
                    ) : (
                      displayedItems.map((item) => {
                        const isActiveItem = activeItems[item.id];
                        return (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                                  {item.image ? (
                                    <img className="h-10 w-10 object-cover" src={item.image} alt="" />
                                  ) : (
                                    <div className="h-10 w-10 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className={`text-sm font-semibold text-gray-900 ${!isActiveItem ? 'text-gray-400' : ''}`}>
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-gray-500 line-clamp-1 w-64">{item.story}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-medium">₹{item.price}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={isActiveItem}
                                  onChange={() => toggleItemActive(item.id)}
                                />
                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                              </label>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => handleEditItem(item)} className="text-blue-600 hover:text-blue-900 mx-2 p-1 rounded hover:bg-blue-50">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-red-900 mx-2 p-1 rounded hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'addons' && (
        <div className="max-w-4xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Global Add-ons Library</h3>
            <button 
              onClick={() => {
                setNewAddon({ name: '', price: 0, isActive: true });
                setShowAddonForm(!showAddonForm);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Add-on
            </button>
          </div>

          {showAddonForm && (
            <form onSubmit={handleSaveAddon} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{newAddon.id ? 'Edit Add-on' : 'New Add-on'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topping Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Extra Boba Pearls"
                    value={newAddon.name} 
                    onChange={e => setNewAddon({...newAddon, name: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg p-2.5" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    required 
                    type="number" 
                    min="0"
                    placeholder="e.g. 40"
                    value={newAddon.price || ''} 
                    onChange={e => setNewAddon({...newAddon, price: Number(e.target.value)})} 
                    className="w-full border border-gray-300 rounded-lg p-2.5" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAddonForm(false)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Add-on</button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Topping Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {addons.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No add-ons found.
                    </td>
                  </tr>
                ) : (
                  addons.map((addon) => (
                    <tr key={addon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900 tracking-wide">{addon.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">₹{addon.price}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={addon.isActive}
                            onChange={() => toggleAddonActive(addon.id)}
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => {
                            setNewAddon(addon);
                            setShowAddonForm(true);
                          }} 
                          className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteAddon(addon.id)} className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors">
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
      )}

      {/* Item Edit Modal */}
      <ItemEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={editingItem}
      />
    </div>
  );
}
