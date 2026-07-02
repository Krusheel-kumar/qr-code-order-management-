import { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Star, Plus, Trash2, UploadCloud, X, Link } from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';
import type { Campaign, Story } from '../../data/models';

export default function DiscoverySettings() {
  const { menuItems, campaigns, addCampaign, deleteCampaign, stories, addStory, deleteStory, discoverySections, addDiscoverySection, deleteDiscoverySection, updateItem } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'banners' | 'stories' | 'sections' | 'featured'>('banners');
  // New Campaign Form State
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({ title: '', subtitle: '', image: '', link: '', ctaText: 'Order Now' });

  // New Story Form State
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [newStory, setNewStory] = useState<Partial<Story>>({ title: '', image: '', badge: '' });

  // New Section Form State
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', displayOrder: 0 });

  // Drink of the week state
  const currentFeatured = menuItems.find(m => m.isFeatured);
  const [selectedFeaturedId, setSelectedFeaturedId] = useState<string>(currentFeatured?.id || '');
  const [featuredImage, setFeaturedImage] = useState<string>('');

  React.useEffect(() => {
    if (currentFeatured && !selectedFeaturedId) {
      setSelectedFeaturedId(currentFeatured.id);
    }
  }, [currentFeatured, selectedFeaturedId]);

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign({
      id: `c-${Date.now()}`,
      title: newCampaign.title || 'New Campaign',
      subtitle: newCampaign.subtitle || '',
      image: newCampaign.image || '',
      link: newCampaign.link || '/menu',
      ctaText: newCampaign.ctaText || 'Order Now'
    });
    setShowCampaignForm(false);
    setNewCampaign({ title: '', subtitle: '', image: '', link: '', ctaText: 'Order Now' });
  };

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    addStory({
      id: `s-${Date.now()}`,
      title: newStory.title || 'New Story',
      image: newStory.image || '',
      badge: newStory.badge || '',
    });
    setShowStoryForm(false);
    setNewStory({ title: '', image: '', badge: '' });
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    addDiscoverySection({
      id: `ds-${Date.now()}`,
      title: newSection.title || 'New Section',
      displayOrder: newSection.displayOrder || discoverySections.length,
      isActive: true,
      products: []
    });
    setShowSectionForm(false);
    setNewSection({ title: '', displayOrder: 0 });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Discovery Management</h1>
        <p className="text-gray-500 mt-1">Manage promotional banners, stories, and curated items on the home screen.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('banners')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'banners' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Hero Banners
        </button>
        <button 
          onClick={() => setActiveTab('stories')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'stories' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Stories
        </button>
        <button 
          onClick={() => setActiveTab('sections')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'sections' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Product Sections
        </button>
        <button 
          onClick={() => setActiveTab('featured')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'featured' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Drink of the Week
        </button>
      </div>

      {/* Hero Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Active Campaigns</h2>
            <button 
              onClick={() => setShowCampaignForm(!showCampaignForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Banner
            </button>
          </div>

          {showCampaignForm && (
            <form onSubmit={handleAddCampaign} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required type="text" value={newCampaign.title} onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input type="text" value={newCampaign.subtitle} onChange={e => setNewCampaign({...newCampaign, subtitle: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors bg-white">
                    {newCampaign.image ? (
                      <div className="relative group w-full flex justify-center">
                        <img src={newCampaign.image} alt="Preview" className="h-32 object-cover rounded-md shadow-sm" />
                        <button 
                          type="button"
                          onClick={() => setNewCampaign({...newCampaign, image: ''})} 
                          className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  // Compress image to 800px width WebP format to reduce size by 99%
                                  const compressedBase64 = await compressImage(file, 800, 0.7);
                                  setNewCampaign({...newCampaign, image: compressedBase64});
                                } catch (err) {
                                  console.error("Compression failed", err);
                                }
                              }
                            }} />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <input type="text" placeholder="Or enter image URL here..." value={newCampaign.image} onChange={e => setNewCampaign({...newCampaign, image: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link / Action</label>
                  <input required type="text" value={newCampaign.link} onChange={e => setNewCampaign({...newCampaign, link: e.target.value})} placeholder="/menu?category=Barista" className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowCampaignForm(false)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Banner</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gray-100 relative">
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                  <button onClick={() => deleteCampaign(campaign.id)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-md hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900">{campaign.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 mb-3">{campaign.subtitle}</p>
                  <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                    <Link className="w-3 h-3" /> {campaign.link}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Active Stories</h2>
            <button 
              onClick={() => setShowStoryForm(!showStoryForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Story
            </button>
          </div>

          {showStoryForm && (
            <form onSubmit={handleAddStory} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required type="text" value={newStory.title} onChange={e => setNewStory({...newStory, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg bg-white relative">
                    {newStory.image ? (
                      <div className="relative flex justify-center w-full">
                        <img src={newStory.image} alt="Preview" className="h-16 w-16 object-cover rounded-full shadow-sm" />
                        <button 
                          type="button"
                          onClick={() => setNewStory({...newStory, image: ''})} 
                          className="absolute top-0 right-0 bg-white text-red-600 rounded-full p-0.5 shadow hover:bg-red-50"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressedBase64 = await compressImage(file, 400, 0.7);
                                  setNewStory({...newStory, image: compressedBase64});
                                } catch (err) {
                                  console.error("Compression failed", err);
                                }
                              }
                            }} />
                          </label>
                        </div>
                        <p className="text-[10px] text-gray-500">PNG, JPG</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <input required type="text" placeholder="Or enter URL..." value={newStory.image} onChange={e => setNewStory({...newStory, image: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge (Optional)</label>
                  <input type="text" placeholder="e.g. NEW or LIVE" value={newStory.badge} onChange={e => setNewStory({...newStory, badge: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowStoryForm(false)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Story</button>
              </div>
            </form>
          )}

          <div className="flex gap-4 flex-wrap">
            {stories.map(story => (
              <div key={story.id} className="flex flex-col items-center gap-2 relative bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-32">
                <button onClick={() => deleteStory(story.id)} className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-orange-400 to-pink-500">
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                    <img src={story.image} className="w-full h-full object-cover" />
                  </div>
                </div>
                {story.badge && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full -mt-4 z-10 border border-white">
                    {story.badge}
                  </span>
                )}
                <span className="text-xs font-medium text-center line-clamp-1">{story.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Dynamic Product Sections</h2>
            <button 
              onClick={() => setShowSectionForm(!showSectionForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Section
            </button>
          </div>

          {showSectionForm && (
            <form onSubmit={handleAddSection} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input required type="text" placeholder="e.g. Trending This Week" value={newSection.title} onChange={e => setNewSection({...newSection, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input required type="number" value={newSection.displayOrder} onChange={e => setNewSection({...newSection, displayOrder: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowSectionForm(false)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Section</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discoverySections.map(section => (
              <div key={section.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
                      {section.displayOrder}
                    </span>
                    <h4 className="font-bold text-gray-900">{section.title}</h4>
                  </div>
                  <button onClick={() => deleteDiscoverySection(section.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 flex-1">
                  <p className="text-sm text-gray-500 mb-3">
                    To add products to this section, go to the <strong>Menu</strong> tab, edit a product, and tick the box for "{section.title}".
                  </p>
                  <div className="flex gap-2 flex-wrap">
                     {section.products && section.products.length > 0 ? (
                       section.products.map(p => (
                         <span key={p.id} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                           {p.name}
                         </span>
                       ))
                     ) : (
                       <span className="text-xs text-gray-400 italic">No products currently in this section.</span>
                     )}
                  </div>
                </div>
              </div>
            ))}
            
            {discoverySections.length === 0 && !showSectionForm && (
               <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                 <Star className="w-12 h-12 text-gray-300 mb-3" />
                 <p className="font-medium">No sections found.</p>
                 <p className="text-sm text-gray-400 mt-1">Create a section like "Summer Specials" to get started.</p>
               </div>
            )}
          </div>
        </div>
      )}

      {/* Drink of the Week Tab */}
      {activeTab === 'featured' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Manage Drink of the Week</h2>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Drink</label>
              <select 
                value={selectedFeaturedId}
                onChange={(e) => {
                  setSelectedFeaturedId(e.target.value);
                  const item = menuItems.find(m => m.id === e.target.value);
                  if (item) setFeaturedImage(item.image || '');
                }}
                className="w-full border border-gray-300 rounded-lg p-2.5 bg-white"
              >
                <option value="">-- Choose a Product --</option>
                {menuItems.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            {selectedFeaturedId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Drink Image (Overrides product image)</label>
                <div className="flex items-center gap-4">
                  {featuredImage ? (
                    <div className="relative group w-32 h-32">
                      <img src={featuredImage} alt="Featured Preview" className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-200" />
                      <button 
                        type="button"
                        onClick={() => setFeaturedImage('')} 
                        className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full p-1 shadow-md hover:bg-red-50 border border-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden">
                      <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500 font-medium">Upload</span>
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const base64 = await compressImage(file, 800, 0.7);
                              setFeaturedImage(base64);
                            } catch (err) {
                              console.error("Compression failed", err);
                            }
                          }
                        }} 
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      Upload a high-quality landscape image for the Drink of the Week card on the home screen.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => {
                  if (!selectedFeaturedId) return;
                  
                  // Reset previous featured
                  if (currentFeatured && currentFeatured.id !== selectedFeaturedId) {
                    updateItem({...currentFeatured, isFeatured: false});
                  }
                  
                  // Set new featured
                  const selectedItem = menuItems.find(m => m.id === selectedFeaturedId);
                  if (selectedItem) {
                    updateItem({...selectedItem, isFeatured: true, image: featuredImage || selectedItem.image});
                    alert('Drink of the week updated successfully!');
                  }
                }}
                disabled={!selectedFeaturedId}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                Set as Drink of the Week
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
