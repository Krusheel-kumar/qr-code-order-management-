import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { products } from '../../../data/mockData';

export default function RecommendationResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const aiResult = state?.aiResult;

  // Find the recommended product, fallback to Mango Fruit Tea if something goes wrong
  const topMatch = products.find(p => p.id === aiResult?.productId) || products[3];
  
  // Use AI reason if available, else fallback
  const reasonText = aiResult?.reason || "Based on your preferences, this is the perfect drink for you!";

  const additionalMatches = [products[5], products[7]]; // Keeping static additional matches for now

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <header className="flex justify-between items-center px-6 py-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold text-xs uppercase tracking-widest text-gray-400">POB AI Match</span>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-6 pb-28 overflow-y-auto">
        
        {/* Top Match Hero */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 mb-8 relative overflow-hidden backdrop-blur-md flex flex-col items-center pt-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full"></div>
          
          <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 mb-6 shadow-sm">
            <Sparkles size={12} className="animate-pulse" /> 99% AI MATCH
          </div>
          
          <h2 className="text-3xl font-heading font-extrabold mb-8 text-center drop-shadow-md">{topMatch.name}</h2>
          
          <div className="w-48 h-48 relative mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
            <img src={topMatch.image} alt={topMatch.name} className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]" />
          </div>

          <div className="w-full">
            <h3 className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-3 text-center flex items-center justify-center gap-2">
               <Sparkles size={10} /> Why POB AI chose this
            </h3>
            <div className="bg-white/5 p-5 rounded-[1.5rem] border border-white/10 shadow-inner">
               <p className="text-sm font-medium leading-relaxed text-white/90 text-center italic">
                 "{reasonText}"
               </p>
            </div>
          </div>
        </div>

        {/* Additional Matches */}
        <h3 className="font-heading font-bold text-lg mb-4 text-white/90">Other great options</h3>
        <div className="flex flex-col gap-3">
          {additionalMatches.map(match => (
            <div key={match.id} className="bg-white/5 border border-white/10 rounded-3xl p-3 flex items-center gap-4 hover:bg-white/10 transition-colors">
               <img src={match.image} className="w-16 h-16 rounded-2xl object-cover bg-black/20" />
               <div className="flex-1">
                 <h4 className="font-bold text-sm mb-1">{match.name}</h4>
                 <div className="flex gap-2 flex-wrap">
                   {match.tags?.slice(0, 2).map((tag: string) => (
                     <span key={tag} className="text-[10px] text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/5">{tag}</span>
                   ))}
                 </div>
               </div>
               <button onClick={() => navigate(`/product/${match.id}`)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                 +
               </button>
            </div>
          ))}
        </div>

      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#111111] via-[#111111] to-transparent z-20 pb-safe">
        <button 
          onClick={() => navigate(`/product/${topMatch.id}`)}
          className="w-full bg-primary text-[var(--color-primary-foreground)] font-extrabold py-4 rounded-full shadow-[0_10px_30px_rgba(255,213,79,0.3)] hover:scale-105 active:scale-95 transition-transform text-lg flex items-center justify-center gap-2"
        >
          Customize & Order
        </button>
      </div>

    </div>
  );
}
