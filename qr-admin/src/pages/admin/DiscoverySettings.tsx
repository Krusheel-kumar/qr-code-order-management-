import { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Search, Star, Image as ImageIcon, Plus, Trash2, Link } from 'lucide-react';
import type { Campaign, Story } from '../../data/models';

export default function DiscoverySettings() {
  const { menuItems, featuredItems, toggleFeaturedItem, campaigns, addCampaign, deleteCampaign, stories, addStory, deleteStory } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'banners' | 'stories' | 'curated'>('banners');
  const [searchQuery, setSearchQuery] = useState('');

  // New Campaign Form State
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({ title: '', subtitle: '', image: '', link: '', ctaText: 'Order Now' });

  // New Story Form State
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [newStory, setNewStory] = useState<Partial<Story>>({ title: '', image: '', badge: '' });

  const displayedItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onClick={() => setActiveTab('curated')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'curated' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Curated Lists
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input required type="text" value={newCampaign.image} onChange={e => setNewCampaign({...newCampaign, image: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input required type="text" value={newStory.image} onChange={e => setNewStory({...newStory, image: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
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

      {/* Curated Tab */}
      {activeTab === 'curated' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[60vh]">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">
              {featuredItems.length} items featured in Trending/Best Sellers
            </span>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search menu items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedItems.map((item) => {
                const isFeatured = featuredItems.includes(item.id);
                return (
                  <div 
                    key={item.id} 
                    onClick={() => toggleFeaturedItem(item.id)}
                    className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer ${
                      isFeatured 
                        ? 'border-yellow-400 bg-yellow-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-gray-400 m-auto mt-4" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className={`text-sm font-bold ${isFeatured ? 'text-gray-900' : 'text-gray-700'}`}>{item.name}</h4>
                      <span className="text-xs text-gray-500">{item.category}</span>
                    </div>
                    <div className="ml-4">
                      <Star className={`w-6 h-6 transition-colors ${isFeatured ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
