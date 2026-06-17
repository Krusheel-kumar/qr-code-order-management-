import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categories } from '../../data/mockData';

export default function CategoryHub() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-[var(--color-background)] font-sans">
      
      {/* Header */}
      <header className="flex items-center px-6 py-4 sticky top-0 bg-[var(--color-background)]/80 backdrop-blur-md z-10 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-extrabold text-xl ml-2 tracking-wide uppercase">Categories</h1>
      </header>

      {/* Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <button 
            key={category.id}
            onClick={() => navigate(`/menu?category=${category.id}`)}
            className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all aspect-square group"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-cream)] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              {category.icon}
            </div>
            <span className="font-bold text-sm text-[var(--color-foreground)]">{category.name}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
