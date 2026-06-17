import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft, Star, ShoppingBag } from 'lucide-react';
import { products, categories } from '../../data/mockData';

const TABS = ['Popular', 'New', 'Seasonal', 'All'];

export default function Menu() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category') || 'cat_fruit'; // default to Fruit Tea for example
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery] = useState('');

  const category = categories.find(c => c.id === categoryId) || categories[1];
  
  // Filter products
  let filteredProducts = products.filter(p => p.category === category.id);
  
  if (activeTab === 'Popular') filteredProducts = filteredProducts.filter(p => p.rating >= 4.8);
  if (activeTab === 'New') filteredProducts = filteredProducts.filter(p => p.isNew);
  if (searchQuery) filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen pb-24 bg-[var(--color-background)] font-sans">
      
      {/* Header */}
      <header className="flex items-center px-6 py-4 sticky top-0 bg-[var(--color-background)]/90 backdrop-blur-md z-20">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-extrabold text-xl ml-2 uppercase tracking-wide flex-1">{category.name}</h1>
        <button className="w-10 h-10 flex items-center justify-center -mr-2">
          <Search size={20} />
        </button>
      </header>

      {/* Tabs */}
      <div className="px-6 mb-6 overflow-x-auto hide-scrollbar sticky top-[72px] bg-[var(--color-background)]/90 backdrop-blur-md z-10 pb-2 pt-2">
        <div className="flex gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-primary text-[var(--color-primary-foreground)]' 
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="px-6 space-y-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white rounded-3xl p-3 flex gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer items-center"
          >
            {/* Image */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 relative shrink-0">
              {product.isNew && (
                <div className="absolute top-1 left-1 z-10 bg-primary text-[var(--color-primary-foreground)] text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                  NEW
                </div>
              )}
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/40">
                  <ShoppingBag size={20} />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 py-1">
              <h4 className="font-bold text-sm text-[var(--color-foreground)] leading-tight mb-1">{product.name}</h4>
              <span className="font-bold text-sm block mb-1">${product.price}</span>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-primary fill-primary" />
                <span className="text-[10px] font-bold text-gray-500">{product.rating}</span>
              </div>
            </div>

            {/* Quick Add */}
            <button className="w-10 h-10 rounded-full bg-[var(--color-foreground)] text-white flex items-center justify-center shrink-0 mr-1 pb-0.5 text-xl font-light hover:bg-primary hover:text-black transition-colors">
              +
            </button>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-400 font-medium">
            No products found for this category.
          </div>
        )}
      </div>

    </div>
  );
}
