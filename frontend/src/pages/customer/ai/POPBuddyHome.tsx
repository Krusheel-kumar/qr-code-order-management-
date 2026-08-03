import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIContext } from './hooks/useAIContext';
import OrderStatusCard from './components/OrderStatusCard';
import { 
  ChevronLeft, 
  Menu, 
  Send, 
  X
} from 'lucide-react';
import { 
  getLlmRecommendation, 
  getLocalRecommendation,
  type FlavorCategory,
  type SubFlavor,
  type ToppingPreference
} from '../../../lib/recommendationEngine';
import { useMenuStore } from '../../../store/useMenuStore';
import CustomizerSheet from '../../../components/CustomizerSheet';
import { type MenuItem } from '../../../data/menu';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
  productRecommendationIds?: string[];
  isTyping?: boolean;
}

export default function POPBuddyHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = location.state as { orderId?: string; customerName?: string; isGuest?: boolean } | null;

  // Extract from query params if state is not present
  const queryGuest = searchParams.get('guest');
  let isGuest = queryGuest !== null ? queryGuest === 'true' : (state?.isGuest ?? true);
  const customerName = searchParams.get('name') || state?.customerName || '';
  const orderId = searchParams.get('orderId') || state?.orderId || '';

  const { data, loading } = useAIContext({
    orderId,
    customerName,
    isGuest
  });

  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'rewards' | 'missions' | 'funfacts' | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<MenuItem | null>(null);
  
  // Guided flow state machine
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [flowState, setFlowState] = useState<'IDLE' | 'ASK_CATEGORY' | 'ASK_SUBFLAVOR' | 'ASK_TOPPING' | 'DONE'>('IDLE');
  const [selectedCategory, setSelectedCategory] = useState<FlavorCategory | null>(null);
  const [selectedSubFlavor, setSelectedSubFlavor] = useState<SubFlavor | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Removed static welcome message as per user request to only show user-selected queries
  useEffect(() => {
    // Initial state is empty, chat starts when user triggers an action
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isChatOpen]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin" />
      </div>
    );
  }

  const customer = data?.customer;
  const order = data?.order;
  const rewards = data?.rewards || [];
  const missions = data?.missions || [];
  const funFact = data?.funFact;
  isGuest = customer?.guest ?? true;

  const addAiMessage = (text: string, options?: string[], productRecommendationIds?: string[]) => {
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, sender: 'ai', text, options, productRecommendationIds }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, sender: 'user', text }]);
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    
    // Clear options on last AI message
    setMessages(prev => {
      const newMessages = [...prev];
      const lastAiIndex = newMessages.map(m => m.sender).lastIndexOf('ai');
      if (lastAiIndex !== -1) {
        newMessages[lastAiIndex].options = undefined;
      }
      return newMessages;
    });

    processGuidedFlow(option);
  };

  const processGuidedFlow = async (choice: string) => {
    if (choice === "Yes, I know what I want") {
      addAiMessage("Awesome! You can head straight to our menu or ask me to find something specific for you.", ["Go to Menu"]);
      return;
    }
    
    if (choice === "Go to Menu") {
      navigate('/menu');
      return;
    }

    if (choice === "No, it's my first time") {
      setFlowState('ASK_CATEGORY');
      addAiMessage("Awesome! Let's find your perfect drink. What flavor profile do you like?", ["Tea", "Fruit", "Chocolate", "Coffee"]);
      return;
    }

    if (flowState === 'ASK_CATEGORY') {
      const category = choice as FlavorCategory;
      setSelectedCategory(category);
      setFlowState('ASK_SUBFLAVOR');
      
      let nextOptions: string[] = [];
      if (category === 'Tea') nextOptions = ['Strong & Authentic', 'Sweet Yam (Taro)', 'Earthy (Matcha)'];
      if (category === 'Fruit') nextOptions = ['Blueberry', 'Mango', 'Melon (Honeydew)'];
      if (category === 'Chocolate') nextOptions = ['Ferrero Rocher', 'Nutella', 'Choco Fantasy'];
      if (category === 'Coffee') nextOptions = ['Mocha', 'Hazelnut'];

      addAiMessage(`Great choice! Within ${category}, which of these specific tastes do you prefer?`, nextOptions);
      return;
    }

    if (flowState === 'ASK_SUBFLAVOR') {
      setSelectedSubFlavor(choice as SubFlavor);
      setFlowState('ASK_TOPPING');
      addAiMessage("Perfect. Finally, what kind of toppings do you prefer?", [
        "Tapioca (Chewy)", "Popping Bubbles", "Jellies", "Recommend for me"
      ]);
      return;
    }

    if (flowState === 'ASK_TOPPING') {
      const topping = choice as ToppingPreference;
      setFlowState('DONE');
      
      const typingId = `msg-typing-${Date.now()}`;
      setMessages(prev => [...prev, { id: typingId, sender: 'ai', text: '', isTyping: true }]);
      
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== typingId));
        const rec = getLocalRecommendation(selectedCategory!, selectedSubFlavor!, topping);
        addAiMessage(rec.reason, ["Go to Menu", "Start over"], rec.productIds);
      }, 1500);
      return;
    }
    
    if (choice === "Start over") {
      setFlowState('IDLE');
      setSelectedCategory(null);
      setSelectedSubFlavor(null);
      addAiMessage("Let's try again! Have you tried bubble tea before?", ["Yes, I know what I want", "No, it's my first time"]);
      return;
    }

    handleFreeTextSubmit(choice);
  };

  const handleFreeTextSubmit = async (text?: string) => {
    const query = text || chatInput.trim();
    if (!query) return;

    // Open chat drawer if it's closed
    if (!isChatOpen) {
      setIsChatOpen(true);
    }

    if (!text) {
      addUserMessage(query);
      setChatInput('');
    }

    setMessages(prev => {
      const newMessages = [...prev];
      const lastAiIndex = newMessages.map(m => m.sender).lastIndexOf('ai');
      if (lastAiIndex !== -1) {
        newMessages[lastAiIndex].options = undefined;
      }
      return newMessages;
    });

    const typingId = `msg-typing-${Date.now()}`;
    setMessages(prev => [...prev, { id: typingId, sender: 'ai', text: '', isTyping: true }]);

    try {
      const rec = await getLlmRecommendation(query);
      setMessages(prev => prev.filter(m => m.id !== typingId));
      addAiMessage(rec.reason, ["Go to Menu", "Start over"], rec.productIds);
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== typingId));
      addAiMessage("Oops! My brain is a little cloudy right now. Let's try again, or you can browse our menu.", ["Go to Menu"]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EE] to-[#FDF3DE] flex flex-col font-sans relative text-[#4A3B32]">
      
      {/* Premium Glass Header */}
      <header className="bg-white/30 backdrop-blur-md border-b border-white/40 text-[#4A3B32] px-5 py-5 flex items-center justify-between z-10 sticky top-0">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/40 active:scale-95 transition-all text-[#4A3B32] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/70 shadow-sm border border-[#F7C948]/30 flex items-center justify-center p-1 overflow-hidden">
            <img src="/Brand%20Emblem.png" alt="POB" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-heading font-black text-[18px] tracking-tight bg-gradient-to-r from-[#D4AF37] to-[#F7C948] bg-clip-text text-transparent">POB AI</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/40 active:scale-95 text-[#4A3B32] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <Menu size={22} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-[130px] relative z-0">
        
        {/* Transparent Main Container */}
        {messages.length === 0 ? (
          <div className="px-6 flex-1 flex flex-col justify-center items-center pb-10 max-w-3xl mx-auto w-full">
          
          {/* Greeting */}
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-[0_8px_25px_rgba(247,201,72,0.2)] bg-white/70 backdrop-blur-md border border-[#F7C948]/30 relative overflow-hidden p-2">
              <img src="/Brand%20Emblem.png" alt="Pop O Bob Emblem" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-[22px] font-heading font-black text-[#4A3B32] leading-tight">
              {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, {isGuest ? 'Guest' : (customer?.name || 'Friend')}
            </h2>
            <p className="text-[#8B7355] text-[15px] font-medium mt-1.5">
              What are you craving today?
            </p>
          </div>

          {/* Active Order Status (If Placed) */}
          {orderId && order && order.status && (
            <div className="mb-8">
              <OrderStatusCard orderId={order.id} orderNumber={order.orderNumber} status={order.status} />
            </div>
          )}

          {/* Premium Light Chips (Glassmorphism) */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-8">
            {[
              { icon: '🔥', title: 'Best Sellers', query: 'Show me your best sellers' },
              { icon: '✨', title: 'Recommend for Me', query: 'Recommend something for me' },
              { icon: '🆕', title: "What's New", query: 'What are the newest drinks?' },
              { icon: '🎲', title: 'Surprise Me', query: 'Surprise me with a random drink' }
            ].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFreeTextSubmit(action.query)}
                className="bg-white/70 backdrop-blur-md border border-[#F7C948]/30 rounded-full px-4 py-2.5 flex items-center gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:border-[#F7C948] hover:shadow-[0_8px_20px_rgba(247,201,72,0.15)] transition-all"
              >
                <span className="text-[14px] text-[#D4AF37]">{action.icon}</span>
                <span className="font-bold text-[#4A3B32] text-[13px] tracking-wide">{action.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Suggestion Chips */}
          <div className="mb-4 flex justify-center w-full">
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {[
                { icon: '🥭', label: 'Fruity' },
                { icon: '🧋', label: 'Milk Tea' },
                { icon: '🍫', label: 'Chocolate' },
                { icon: '💚', label: 'Low Sugar' },
                { icon: '💰', label: 'Under ₹200' },
                { icon: '⚡', label: 'Energy' }
              ].map((chip, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFreeTextSubmit(`I'm looking for ${chip.label.toLowerCase()} drinks`)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md border border-white/60 rounded-full text-[13px] font-bold text-gray-700 shadow-sm hover:border-[#F7C948]/50 hover:bg-white/60 transition-all"
                >
                  <span>{chip.icon}</span>
                  {chip.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6 hide-scrollbar max-w-3xl mx-auto w-full mt-2">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start gap-2.5'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-white border border-[#F7C948]/30 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden mt-1">
                    <img src="/Brand%20Emblem.png" alt="POB" className="w-full h-full object-contain" />
                  </div>
                )}

                <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.isTyping ? (
                    <div className="bg-white/80 border border-[#F7C948]/20 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 h-[40px] shadow-sm">
                      <motion.div animate={{y:[0,-3,0]}} transition={{repeat:Infinity, duration:0.6}} className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                      <motion.div animate={{y:[0,-3,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.2}} className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                      <motion.div animate={{y:[0,-3,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.4}} className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                    </div>
                  ) : (
                    <div className={`px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-[14px] leading-relaxed whitespace-pre-line font-medium ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-[#F7C948] to-[#F9D46C] text-[#4A3B32] rounded-[20px] rounded-tr-sm border border-[#F7C948]/20' 
                        : 'bg-white text-[#4A3B32] border border-gray-100/80 rounded-[20px] rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  {/* Chat Options */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-3 w-full">
                      {msg.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionClick(option)}
                          className="bg-white border border-[#F7C948] hover:bg-[#F7C948]/10 text-[#4A3B32] font-bold text-xs px-4 py-2.5 rounded-full active:scale-[0.98] transition-all shadow-[0_2px_10px_rgba(247,201,72,0.1)]"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Recommendation Carousel inside Chat */}
                  {msg.productRecommendationIds && (
                    <ProductCarousel productIds={msg.productRecommendationIds} onAddClick={(p) => setCustomizingProduct(p)} />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Premium Apple Intelligence-style Light Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-5 pb-8 bg-gradient-to-t from-[#FDF3DE] via-[#FDF3DE]/95 to-transparent pointer-events-none flex justify-center">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleFreeTextSubmit(); }}
          className="pointer-events-auto flex items-center justify-between gap-3 bg-white/90 backdrop-blur-xl border border-white rounded-[28px] px-3 py-3 shadow-[0_8px_30px_rgba(212,175,55,0.15)] focus-within:shadow-[0_8px_30px_rgba(247,201,72,0.25)] transition-all w-full max-w-3xl"
        >
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask POB AI anything..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-[16px] text-[#4A3B32] placeholder:text-gray-400 font-medium"
          />
          <button 
            type="submit"
            disabled={!chatInput.trim()}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#F7C948] to-[#D4AF37] text-white shadow-lg active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 disabled:shadow-none"
          >
            <Send size={20} className="ml-0.5 -mt-0.5 drop-shadow-sm" />
          </button>
        </form>
      </div>



      {/* ── Detail Modals (Rewards / Missions / Fun Facts) ────────────────── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-t-[32px] p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveModal(null)} 
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>

              {/* Modal Contents based on type */}
              {activeModal === 'rewards' && (
                <div>
                  <h3 className="font-heading font-black text-xl mb-4 flex items-center gap-2">
                    <span>🎁</span> My Rewards
                  </h3>
                  <div className="flex flex-col gap-4 overflow-y-auto max-h-[350px] pr-2">
                    {rewards.map(r => (
                      <div key={r.id} className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{r.emoji}</span>
                          <div>
                            <h4 className="font-bold text-sm text-[#1A0B05]">{r.title}</h4>
                            <p className="text-xs text-gray-500">{r.description}</p>
                          </div>
                        </div>
                        <span className="text-xs bg-amber-100 text-amber-800 font-extrabold px-2.5 py-1 rounded-full">
                          {r.pointsRequired} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'missions' && (
                <div>
                  <h3 className="font-heading font-black text-xl mb-4 flex items-center gap-2">
                    <span>🎮</span> Today's Missions
                  </h3>
                  <div className="flex flex-col gap-4 overflow-y-auto max-h-[350px] pr-2">
                    {missions.map(m => (
                      <div key={m.id} className="border border-gray-100 rounded-2xl p-4 space-y-3 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{m.emoji}</span>
                          <div>
                            <h4 className="font-bold text-sm text-[#1A0B05]">{m.title}</h4>
                            <p className="text-xs text-gray-500">{m.description}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase">
                            <span>Progress</span>
                            <span>{m.progress}/{m.total}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${(m.progress / m.total) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'funfacts' && (
                <div className="text-center py-4 space-y-4">
                  <div className="text-4xl">📖</div>
                  <h3 className="font-heading font-black text-xl">Boba Fun Facts!</h3>
                  <div className="bg-[#FFFDF9] border border-amber-100 rounded-2xl p-5 text-[15px] font-medium leading-relaxed text-gray-700 italic">
                    "{funFact?.text || 'Bubble tea makes everything better!'}"
                  </div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Source: {funFact?.source || 'Boba Philosophy'}</p>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full bg-[#1A0B05] text-white font-bold py-3.5 rounded-2xl active:scale-[0.98]"
                  >
                    Awesome!
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CustomizerSheet 
        product={customizingProduct} 
        isOpen={!!customizingProduct} 
        onClose={() => setCustomizingProduct(null)} 
      />
    </div>
  );
}

// Product Recommendation Carousel Component
function ProductCarousel({ productIds, onAddClick }: { productIds: string[], onAddClick: (product: MenuItem) => void }) {
  const { menuItems: MENU } = useMenuStore();
  const navigate = useNavigate();

  const products = productIds
    .map(id => {
      // 1. Exact ID match
      let match = MENU.find(p => p.id === id);
      if (match) return match;
      
      // 2. Exact Name match
      match = MENU.find(p => p.name.toLowerCase() === id.toLowerCase());
      if (match) return match;
      
      // 3. Fuzzy match: extract keywords from ID (e.g., 'p-matcha-green-tea' -> ['matcha', 'green', 'tea'])
      const keywords = id.toLowerCase().replace(/^p-/, '').split('-');
      
      let bestMatch = null;
      let maxScore = 0;
      
      MENU.forEach(p => {
        const productName = p.name.toLowerCase();
        let score = 0;
        keywords.forEach(kw => {
          if (kw.length > 2 && productName.includes(kw)) score++;
        });
        if (score > maxScore) {
          maxScore = score;
          bestMatch = p;
        }
      });
      
      return bestMatch && maxScore > 0 ? bestMatch : undefined;
    })
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (products.length === 0) return null;

  // Single featured card
  if (products.length === 1) {
    const product = products[0];
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 w-full bg-white/70 backdrop-blur-md border border-[#F7C948]/30 rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(212,175,55,0.15)] flex flex-col"
      >
        <div className="w-full h-[160px] bg-gradient-to-br from-[#FFFBF4] to-[#FDF3DE] relative p-4 flex items-center justify-center border-b border-[#F7C948]/10">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full object-contain drop-shadow-xl" />
          ) : (
            <span className="text-5xl drop-shadow-md">🧋</span>
          )}
          {product.rating && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-[#F7C948]/20">
              <span className="text-xs">⭐</span>
              <span className="text-[11px] font-black text-[#4A3B32]">{product.rating}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div>
            <h3 className="font-heading font-black text-[16px] text-[#1A0B05] leading-tight">{product.name}</h3>
            {product.story && (
              <p className="text-xs text-[#8B7355] mt-1 line-clamp-2 leading-relaxed">{product.story}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[#D4AF37] font-black text-lg">₹{product.price}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => {
                onAddClick(product);
                if (navigator.vibrate) navigator.vibrate(50);
              }}
              className="flex-1 bg-gradient-to-r from-[#1A0B05] to-[#3A2B25] text-white font-bold py-2.5 text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => navigate(`/product/${product.id}`)}
              className="px-4 bg-white text-[#1A0B05] border border-[#1A0B05]/20 font-bold py-2.5 text-xs rounded-xl flex items-center justify-center active:scale-95 transition-all hover:bg-gray-50"
            >
              Details
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Multiple products swipeable carousel
  return (
    <div className="mt-4 w-full -mx-5 px-5 overflow-x-auto hide-scrollbar pb-4">
      <div className="flex gap-3 w-max">
        {products.map((product, idx) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="w-[200px] bg-white/80 backdrop-blur-md border border-[#F7C948]/20 rounded-[20px] overflow-hidden shadow-[0_4px_15px_rgba(212,175,55,0.08)] flex flex-col shrink-0"
          >
            <div className="w-full h-[120px] bg-gradient-to-br from-[#FFFBF4] to-[#FDF3DE] relative p-3 flex items-center justify-center border-b border-[#F7C948]/10">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full object-contain drop-shadow-lg" />
              ) : (
                <span className="text-4xl drop-shadow-sm">🧋</span>
              )}
              {product.rating && (
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm border border-[#F7C948]/20">
                  <span className="text-[10px]">⭐</span>
                  <span className="text-[10px] font-black text-[#4A3B32]">{product.rating}</span>
                </div>
              )}
            </div>
            <div className="p-3 flex flex-col gap-1.5 flex-1">
              <h3 className="font-heading font-black text-[14px] text-[#1A0B05] leading-tight truncate">{product.name}</h3>
              <p className="text-[11px] text-[#8B7355] line-clamp-2 leading-snug flex-1">{product.story || 'A delicious choice!'}</p>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[#D4AF37] font-black text-[15px]">₹{product.price}</span>
              </div>
              <div className="flex gap-1.5 mt-1.5">
                <button 
                  onClick={() => {
                    onAddClick(product);
                    if (navigator.vibrate) navigator.vibrate(50);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#1A0B05] to-[#3A2B25] text-white font-bold py-2 text-[11px] rounded-lg flex items-center justify-center active:scale-95 transition-all shadow-sm"
                >
                  Add
                </button>
                <button 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="px-2.5 bg-white text-[#1A0B05] border border-[#1A0B05]/20 font-bold py-2 text-[11px] rounded-lg flex items-center justify-center active:scale-95 transition-all hover:bg-gray-50"
                >
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
