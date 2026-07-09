import React, { useState } from 'react';
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans">
      <div>
        <h1 className="text-3xl font-heading font-black text-[#2A1B16] tracking-tight">Discovery Management</h1>
        <p className="text-[#8D6E63] font-medium mt-1">Manage promotional banners, stories, and curated items on the home screen.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#FAEDCD]">
        <button 
          onClick={() => setActiveTab('banners')}
          className={`px-6 py-3.5 font-heading font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === 'banners' ? 'border-b-2 border-[#FFD54F] text-[#2A1B16]' : 'border-transparent text-[#8D6E63] hover:text-[#2A1B16]'}`}
        >
          Hero Banners
        </button>
        <button 
          onClick={() => setActiveTab('stories')}
          className={`px-6 py-3.5 font-heading font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === 'stories' ? 'border-b-2 border-[#FFD54F] text-[#2A1B16]' : 'border-transparent text-[#8D6E63] hover:text-[#2A1B16]'}`}
        >
          Stories
        </button>
        <button 
          onClick={() => setActiveTab('sections')}
          className={`px-6 py-3.5 font-heading font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === 'sections' ? 'border-b-2 border-[#FFD54F] text-[#2A1B16]' : 'border-transparent text-[#8D6E63] hover:text-[#2A1B16]'}`}
        >
          Product Sections
        </button>
        <button 
          onClick={() => setActiveTab('featured')}
          className={`px-6 py-3.5 font-heading font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === 'featured' ? 'border-b-2 border-[#FFD54F] text-[#2A1B16]' : 'border-transparent text-[#8D6E63] hover:text-[#2A1B16]'}`}
        >
          Drink of the Week
        </button>
      </div>

      {/* Hero Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-heading font-bold text-[#2A1B16]">Active Campaigns</h2>
            <button 
              onClick={() => setShowCampaignForm(!showCampaignForm)}
              className="bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Banner
            </button>
          </div>

          {showCampaignForm && (
            <form onSubmit={handleAddCampaign} className="glass-panel p-6 rounded-2xl border border-[#FAEDCD] bg-white/50 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Title</label>
                  <input required type="text" value={newCampaign.title} onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Subtitle</label>
                  <input type="text" value={newCampaign.subtitle} onChange={e => setNewCampaign({...newCampaign, subtitle: e.target.value})} className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Image Upload</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#FAEDCD] border-dashed rounded-2xl hover:border-[#FFD54F] transition-colors bg-[#FFF8E8]/30">
                    {newCampaign.image ? (
                      <div className="relative group w-full flex justify-center">
                        <img src={newCampaign.image} alt="Preview" className="h-32 object-cover rounded-xl shadow-sm" />
                        <button 
                          type="button"
                          onClick={() => setNewCampaign({...newCampaign, image: ''})} 
                          className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1.5 shadow hover:bg-red-50 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-10 w-10 text-[#8D6E63]/40" />
                        <div className="flex text-sm text-[#8D6E63] justify-center font-bold">
                          <label className="relative cursor-pointer bg-transparent rounded-md text-[#B87A42] hover:text-[#5C3D2E] focus-within:outline-none">
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
                        <p className="text-2xs text-[#8D6E63]/60">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3.5">
                    <input type="text" placeholder="Or enter image URL here..." value={newCampaign.image} onChange={e => setNewCampaign({...newCampaign, image: e.target.value})} className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-2 text-xs text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Link / Action</label>
                  <input required type="text" value={newCampaign.link} onChange={e => setNewCampaign({...newCampaign, link: e.target.value})} placeholder="/menu?category=Barista" className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#FAEDCD]/30">
                <button type="button" onClick={() => setShowCampaignForm(false)} className="px-5 py-2.5 text-xs font-bold text-[#8D6E63] bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-xs font-bold text-[#FFD54F] bg-[#2A1B16] hover:bg-[#3D2921] rounded-xl transition-colors shadow-2xs cursor-pointer">Save Banner</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="glass-panel border border-[#FAEDCD] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 bg-white">
                <div className="h-36 bg-gray-100 relative">
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                  <button onClick={() => deleteCampaign(campaign.id)} className="absolute top-2.5 right-2.5 p-2 bg-white/95 text-red-600 rounded-xl hover:bg-red-50 shadow-2xs hover:shadow-xs transition-all cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5">
                  <h4 className="font-heading font-bold text-[#2A1B16] text-base">{campaign.title}</h4>
                  <p className="text-xs text-[#8D6E63] mt-1 mb-4 font-semibold">{campaign.subtitle}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#B87A42] bg-[#D4A373]/10 border border-[#D4A373]/25 p-2.5 rounded-xl">
                    <Link className="w-3.5 h-3.5" /> {campaign.link}
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
            <h2 className="text-lg font-heading font-bold text-[#2A1B16]">Active Stories</h2>
            <button 
              onClick={() => setShowStoryForm(!showStoryForm)}
              className="bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Story
            </button>
          </div>

          {showStoryForm && (
            <form onSubmit={handleAddStory} className="glass-panel p-6 rounded-2xl border border-[#FAEDCD] bg-white/50 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Title</label>
                  <input required type="text" value={newStory.title} onChange={e => setNewStory({...newStory, title: e.target.value})} className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Image</label>
                  <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-[#FAEDCD] border-dashed rounded-xl bg-[#FFF8E8]/30 relative hover:border-[#FFD54F] transition-colors">
                    {newStory.image ? (
                      <div className="relative flex justify-center w-full">
                        <img src={newStory.image} alt="Preview" className="h-16 w-16 object-cover rounded-full shadow-sm border border-[#FAEDCD]" />
                        <button 
                          type="button"
                          onClick={() => setNewStory({...newStory, image: ''})} 
                          className="absolute -top-1 right-0 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-50 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-7 w-7 text-[#8D6E63]/40" />
                        <div className="flex text-xs text-[#8D6E63] justify-center font-bold">
                          <label className="relative cursor-pointer bg-transparent rounded-md text-[#B87A42] hover:text-[#5C3D2E] focus-within:outline-none">
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
                        <p className="text-[10px] text-[#8D6E63]/60">PNG, JPG</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <input required type="text" placeholder="Or enter URL..." value={newStory.image} onChange={e => setNewStory({...newStory, image: e.target.value})} className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-2 text-xs text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Badge (Optional)</label>
                  <input type="text" placeholder="e.g. NEW or LIVE" value={newStory.badge} onChange={e => setNewStory({...newStory, badge: e.target.value})} className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#FAEDCD]/30">
                <button type="button" onClick={() => setShowStoryForm(false)} className="px-5 py-2.5 text-xs font-bold text-[#8D6E63] bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-xs font-bold text-[#FFD54F] bg-[#2A1B16] hover:bg-[#3D2921] rounded-xl transition-colors shadow-2xs cursor-pointer">Save Story</button>
              </div>
            </form>
          )}

          <div className="flex gap-4 flex-wrap">
            {stories.map(story => (
              <div key={story.id} className="flex flex-col items-center gap-2.5 relative bg-white p-4.5 rounded-2xl border border-[#FAEDCD] shadow-2xs w-32 hover:shadow-xs transition-shadow duration-300">
                <button onClick={() => deleteStory(story.id)} className="absolute top-1.5 right-1.5 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-[#FFD54F] to-[#D4A373]">
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden shadow-2xs bg-gray-50">
                    <img src={story.image} className="w-full h-full object-cover" />
                  </div>
                </div>
                {story.badge && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full -mt-5 z-10 border-2 border-white uppercase tracking-wider shadow-2xs">
                    {story.badge}
                  </span>
                )}
                <span className="text-xs font-bold text-[#2A1B16] text-center line-clamp-1 w-full mt-0.5">{story.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-heading font-bold text-[#2A1B16]">Dynamic Product Sections</h2>
            <button 
              onClick={() => setShowSectionForm(!showSectionForm)}
              className="bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Section
            </button>
          </div>

          {showSectionForm && (
            <form onSubmit={handleAddSection} className="glass-panel p-6 rounded-2xl border border-[#FAEDCD] bg-white/50 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Section Title</label>
                  <input required type="text" placeholder="e.g. Trending This Week" value={newSection.title} onChange={e => setNewSection({...newSection, title: e.target.value})} className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Display Order</label>
                  <input required type="number" value={newSection.displayOrder} onChange={e => setNewSection({...newSection, displayOrder: parseInt(e.target.value) || 0})} className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#FAEDCD]/30">
                <button type="button" onClick={() => setShowSectionForm(false)} className="px-5 py-2.5 text-xs font-bold text-[#8D6E63] bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-xs font-bold text-[#FFD54F] bg-[#2A1B16] hover:bg-[#3D2921] rounded-xl transition-colors shadow-2xs cursor-pointer">Save Section</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discoverySections.map(section => (
              <div key={section.id} className="glass-panel border border-[#FAEDCD] rounded-2xl overflow-hidden shadow-xs flex flex-col bg-white">
                <div className="p-4.5 border-b border-[#FAEDCD]/50 flex justify-between items-center bg-[#FFF8E8]/40">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#2A1B16] text-[#FFD54F] flex items-center justify-center text-xs font-bold shadow-2xs">
                      {section.displayOrder}
                    </span>
                    <h4 className="font-heading font-bold text-[#2A1B16] text-sm">{section.title}</h4>
                  </div>
                  <button onClick={() => deleteDiscoverySection(section.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 flex-1">
                  <p className="text-xs text-[#8D6E63] font-semibold mb-4 leading-relaxed">
                    To add products to this section, go to the <strong className="text-[#2A1B16]">Menu</strong> tab, edit a product, and tick the box for "{section.title}".
                  </p>
                  <div className="flex gap-2 flex-wrap">
                     {section.products && section.products.length > 0 ? (
                       section.products.map(p => (
                         <span key={p.id} className="inline-flex items-center px-2.5 py-1 bg-[#FFD54F]/15 border border-[#FFD54F]/30 text-[#2A1B16] text-2xs font-bold rounded-lg shadow-2xs">
                           {p.name}
                         </span>
                       ))
                     ) : (
                       <span className="text-xs text-[#8D6E63]/40 italic">No products currently in this section.</span>
                     )}
                  </div>
                </div>
              </div>
            ))}
            
            {discoverySections.length === 0 && !showSectionForm && (
               <div className="col-span-full py-16 flex flex-col items-center justify-center text-[#8D6E63] bg-[#FFF8E8]/20 border-2 border-dashed border-[#FAEDCD] rounded-2xl">
                 <Star className="w-12 h-12 text-[#FAEDCD] mb-3" />
                 <p className="font-heading font-bold text-base text-[#2A1B16]">No sections found.</p>
                 <p className="text-xs text-[#8D6E63] mt-1 font-semibold">Create a section like "Summer Specials" to get started.</p>
               </div>
            )}
          </div>
        </div>
      )}

      {/* Drink of the Week Tab */}
      {activeTab === 'featured' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-heading font-bold text-[#2A1B16]">Manage Drink of the Week</h2>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border border-[#FAEDCD] bg-white/50 space-y-6 shadow-sm">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-2">Select Drink</label>
              <select 
                value={selectedFeaturedId}
                onChange={(e) => {
                  setSelectedFeaturedId(e.target.value);
                  const item = menuItems.find(m => m.id === e.target.value);
                  if (item) setFeaturedImage(item.image || '');
                }}
                className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium cursor-pointer"
              >
                <option value="">-- Choose a Product --</option>
                {menuItems.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            {selectedFeaturedId && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-2.5">Drink Image (Overrides product image)</label>
                <div className="flex items-center gap-5">
                  {featuredImage ? (
                    <div className="relative group w-32 h-32">
                      <img src={featuredImage} alt="Featured Preview" className="w-full h-full object-cover rounded-2xl shadow-sm border border-[#FAEDCD]" />
                      <button 
                        type="button"
                        onClick={() => setFeaturedImage('')} 
                        className="absolute -top-2.5 -right-2.5 bg-white text-red-600 rounded-full p-1.5 shadow hover:bg-red-50 cursor-pointer border border-[#FAEDCD]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-[#FAEDCD] rounded-2xl flex flex-col items-center justify-center bg-white hover:border-[#FFD54F] transition-colors cursor-pointer relative overflow-hidden">
                      <UploadCloud className="w-8 h-8 text-[#8D6E63]/40 mb-1" />
                      <span className="text-[10px] text-[#8D6E63] font-bold">Upload image</span>
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
                    <p className="text-xs text-[#8D6E63] font-semibold leading-relaxed">
                      Upload a high-quality landscape image for the Drink of the Week card on the home screen.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#FAEDCD]/30 flex justify-end">
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
                className="bg-[#2A1B16] hover:bg-[#3D2921] disabled:opacity-40 text-[#FFD54F] px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
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

