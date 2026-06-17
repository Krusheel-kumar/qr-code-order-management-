import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizScreen() {
  const navigate = useNavigate();
  const [craving, setCraving] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskAI = async () => {
    if (!craving.trim()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ craving })
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation from AI');
      }

      const data = await response.json();
      
      // Navigate to recommendation screen with the AI response
      navigate('/recommendation', { state: { aiResult: data } });

    } catch (err) {
      console.error(err);
      setError('Oops! POB AI took a nap. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col font-sans p-6 items-center justify-center relative overflow-hidden">
      <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white flex items-center justify-center z-10 shadow-sm">
        <ArrowLeft size={20} />
      </button>

      <AnimatePresence mode="wait">
        {!isLoading ? (
          <motion.div 
            key="input-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md z-10 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] mb-6 border border-primary/10">
              <span className="text-4xl">✨</span>
            </div>
            
            <h1 className="text-3xl font-heading font-extrabold mb-3 text-center text-gray-900">What are you craving?</h1>
            <p className="text-gray-500 mb-8 text-center text-sm font-medium">Tell POB AI what you feel like, and we'll find your perfect match.</p>

            <div className="w-full relative mb-8">
              <textarea
                value={craving}
                onChange={(e) => setCraving(e.target.value)}
                placeholder="E.g., 'Something fruity and refreshing with a little sweetness...'"
                className="w-full h-32 p-5 rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:ring-2 focus:ring-primary/30 resize-none text-gray-700 bg-white"
              />
              {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}
            </div>

            <button 
              onClick={handleAskAI}
              disabled={!craving.trim()}
              className={`w-full font-extrabold py-4 rounded-full shadow-xl transition-all flex justify-center items-center gap-2 uppercase tracking-wider ${
                craving.trim() 
                  ? 'bg-gray-900 text-white hover:scale-105 active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Ask POB AI <Sparkles size={18} className={craving.trim() ? "text-primary" : "text-gray-400"} />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md z-10 flex flex-col items-center justify-center text-center"
          >
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-primary/30 border-l-transparent"
               />
               <span className="text-5xl animate-pulse">✨</span>
            </div>
            <h2 className="text-2xl font-heading font-extrabold mb-2 text-gray-900">POB AI is thinking...</h2>
            <p className="text-gray-500 font-medium">Brewing the perfect recommendation based on your craving.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
