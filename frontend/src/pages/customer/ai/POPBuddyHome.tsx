import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIContext } from './hooks/useAIContext';
import OrderStatusCard from './components/OrderStatusCard';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Send, 
  Compass, 
  X
} from 'lucide-react';
import { 
  getLlmRecommendation, 
  getLocalRecommendation,
  type FlavorCategory,
  type SubFlavor,
  type ToppingPreference
} from '../../../lib/recommendationEngine';
import { useCartStore } from '../../../store/useCartStore';
import { useMenuStore } from '../../../store/useMenuStore';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
  productRecommendationId?: string;
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
  
  // Guided flow state machine
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [flowState, setFlowState] = useState<'IDLE' | 'ASK_CATEGORY' | 'ASK_SUBFLAVOR' | 'ASK_TOPPING' | 'DONE'>('IDLE');
  const [selectedCategory, setSelectedCategory] = useState<FlavorCategory | null>(null);
  const [selectedSubFlavor, setSelectedSubFlavor] = useState<SubFlavor | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize the guided chat flow on mount
  useEffect(() => {
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: "👋 Welcome to POP O'BOB®! I'm POB AI, your personal bubble tea assistant.\n\nHave you tried bubble tea before?",
        options: ["Yes, I know what I want", "No, it's my first time"]
      }
    ]);
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
  const wallet = data?.wallet;
  const order = data?.order;
  const rewards = data?.rewards || [];
  const missions = data?.missions || [];
  const funFact = data?.funFact;
  isGuest = customer?.guest ?? true;

  const addAiMessage = (text: string, options?: string[], productRecommendationId?: string) => {
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, sender: 'ai', text, options, productRecommendationId }]);
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
        addAiMessage(rec.reason, ["Go to Menu", "Start over"], rec.productId);
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
      addAiMessage(rec.reason, ["Go to Menu", "Start over"], rec.productId);
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== typingId));
      addAiMessage("Oops! My brain is a little cloudy right now. Let's try again, or you can browse our menu.", ["Go to Menu"]);
    }
  };

  const pointsProgress = Math.min(100, (((wallet?.points || 0) / (wallet?.nextTierPoints || 100)) * 100));

  return (
    <div className="min-h-screen bg-[#FFF9EE] flex flex-col font-sans relative text-[#1A0B05]">
      
      {/* Dark Slate Header */}
      <header className="bg-[#0F172A] text-white px-5 py-5 flex items-center justify-between z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-white"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-heading font-black text-[17px] tracking-tight">POB AI</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Online</span>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 text-white">
          <Menu size={22} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-[110px] relative z-0">
        
        {/* Rounded Mockup Main Container */}
        <div className="bg-white rounded-t-[36px] mt-[-24px] pt-7 px-5 flex-1 flex flex-col">
          
          {/* Greeting */}
          <div className="mb-6">
            <h2 className="text-[25px] font-heading font-black text-[#1A0B05] leading-tight flex items-center gap-1">
              Good Afternoon,
            </h2>
            <h2 className="text-[25px] font-heading font-black text-[#1A0B05] leading-tight">
              {isGuest ? 'Guest' : (customer?.name || 'Friend')}! 👋
            </h2>
            <p className="text-gray-400 text-sm font-semibold mt-1">
              Here's what's happening while you wait! ✨
            </p>
          </div>

          {/* POP Points Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => isGuest ? navigate('/ai/join', { state }) : setActiveModal('rewards')}
            className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col gap-4 mb-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E8DDFF] text-[#7E57C2]">
                  <Compass size={22} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Your POP Points</p>
                  <h3 className="font-heading font-black text-2xl text-[#1A0B05] leading-none">
                    {isGuest ? '0' : (wallet?.points || 0)}
                  </h3>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>

            {/* Custom Progress Bar inside card */}
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${isGuest ? 0 : pointsProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-[#FFA000] rounded-full" 
                />
              </div>
              <p className="text-[11px] font-black text-gray-400 tracking-wider">
                {isGuest ? 'Start exploring to earn points!' : `${(wallet?.nextTierPoints || 500) - (wallet?.points || 0)} pts away from Free Drink`}
              </p>
            </div>
          </motion.div>

          {/* Active Order Status (If Placed) */}
          {orderId && order && order.status && (
            <div className="mb-6">
              <OrderStatusCard orderId={order.id} orderNumber={order.orderNumber} status={order.status} />
            </div>
          )}

          {/* List Items (5 rows matching mockup) */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              
              {/* Row 1: My Rewards */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => isGuest ? navigate('/ai/join', { state }) : setActiveModal('rewards')}
                className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">🎁</div>
                  <div>
                    <h4 className="font-extrabold text-[15px] text-[#1A0B05]">My Rewards</h4>
                    <p className="text-[12px] text-gray-400 font-semibold">View points, offers & gifts</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </motion.div>

              {/* Row 2: Recommended For You */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => { setIsChatOpen(true); addAiMessage("Let's build your perfect cup! What flavor profiles do you like?", ["Tea", "Fruit", "Chocolate", "Coffee"]); }}
                className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">🧋</div>
                  <div>
                    <h4 className="font-extrabold text-[15px] text-[#1A0B05]">Recommended For You</h4>
                    <p className="text-[12px] text-gray-400 font-semibold">Drinks you'll love</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </motion.div>

              {/* Row 3: Trending Today */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => { setIsChatOpen(true); handleFreeTextSubmit("What are the trending bubble teas today?"); }}
                className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">🔥</div>
                  <div>
                    <h4 className="font-extrabold text-[15px] text-[#1A0B05]">Trending Today</h4>
                    <p className="text-[12px] text-gray-400 font-semibold">What's popular right now</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </motion.div>

              {/* Row 4: Today's Mission */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModal('missions')}
                className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">🎮</div>
                  <div>
                    <h4 className="font-extrabold text-[15px] text-[#1A0B05]">Today's Mission</h4>
                    <p className="text-[12px] text-gray-400 font-semibold">Fun tasks, big rewards</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </motion.div>

              {/* Row 5: Fun Facts */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModal('funfacts')}
                className="flex items-center justify-between py-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">📖</div>
                  <div>
                    <h4 className="font-extrabold text-[15px] text-[#1A0B05]">Fun Facts</h4>
                    <p className="text-[12px] text-gray-400 font-semibold">Boba tea & more</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </motion.div>

            </div>
          </div>
        </div>
      </main>

      {/* Sticky Dark Slate Bottom Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A] rounded-t-[30px] p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] max-w-md mx-auto">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleFreeTextSubmit(); }}
          className="flex items-center justify-between gap-3 bg-white/10 border border-white/5 rounded-full px-2 py-2 focus-within:bg-white/15 transition-colors"
        >
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onFocus={() => { if (!isChatOpen) setIsChatOpen(true); }}
            placeholder="Ask POB AI anything..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-[14px] text-white placeholder:text-gray-400 font-medium"
          />
          <button 
            type="submit"
            disabled={!chatInput.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#7E57C2] text-white shadow-md active:scale-95 transition-all shrink-0"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </form>
      </div>

      {/* ── Slide-up POB AI Chat Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-[#FFF9EE] z-50 flex flex-col max-w-md mx-auto"
          >
            {/* Drawer Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <div className="flex-1 flex justify-center items-center gap-2 pr-10">
                <div className="w-7 h-7 rounded-full bg-gray-100 p-0.5 overflow-hidden">
                  <img src="/assets/mascotpob.png" alt="POB" className="w-full h-full object-contain" />
                </div>
                <h1 className="font-heading font-extrabold text-md text-gray-900">POB AI</h1>
              </div>
            </header>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6 hide-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start gap-2.5'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden mt-1">
                      <img src="/assets/mascotpob.png" alt="POB" className="w-5 h-5 object-contain" />
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.isTyping ? (
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 h-[40px]">
                        <motion.div animate={{y:[0,-3,0]}} transition={{repeat:Infinity, duration:0.6}} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <motion.div animate={{y:[0,-3,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.2}} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <motion.div animate={{y:[0,-3,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.4}} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      </div>
                    ) : (
                      <div className={`px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-[14px] leading-relaxed whitespace-pre-line font-medium ${
                        msg.sender === 'user' 
                          ? 'bg-[#1A0B05] text-white rounded-[20px] rounded-tr-sm' 
                          : 'bg-white text-gray-800 border border-gray-100/50 rounded-[20px] rounded-tl-sm'
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
                            className="bg-white border border-gray-200 hover:border-[#FFB800] text-[#1A0B05] font-bold text-xs px-4 py-2.5 rounded-full active:scale-[0.98] transition-all shadow-sm"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Recommendation Card inside Chat */}
                    {msg.productRecommendationId && (
                      <ProductRecommendationCard productId={msg.productRecommendationId} />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar in Drawer */}
            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleFreeTextSubmit(); }}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-2 py-1.5"
              >
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask POB AI anything..."
                  className="flex-1 bg-transparent border-none outline-none px-4 text-[14px] text-[#1A0B05] placeholder:text-gray-400 font-medium"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#7E57C2] text-white active:scale-95 shrink-0"
                >
                  <Send size={15} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

    </div>
  );
}

// Product Recommendation Component
function ProductRecommendationCard({ productId }: { productId: string }) {
  const { menuItems: MENU } = useMenuStore();
  const product = MENU.find(p => 
    p.id === productId || 
    p.name.toLowerCase() === productId.toLowerCase() || 
    p.id === 'p-' + productId.toLowerCase().replace(/ /g, '-') ||
    p.name.toLowerCase().includes(productId.toLowerCase().replace('boba tea', '').trim())
  );
  
  const cartStore = useCartStore();
  const [added, setAdded] = useState(false);
  
  if (!product) return null;

  const handleAddToCart = () => {
    cartStore.addItem({
      product,
      customization: 'Regular • As recommended by POB AI',
      price: product.price,
      quantity: 1
    });
    setAdded(true);
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 w-[220px] bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-md flex flex-col"
    >
      <div className="w-full h-[120px] bg-[#FFFBF4] relative p-3 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full object-contain drop-shadow-md" />
        ) : (
          <span className="text-3xl">🧋</span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="font-extrabold text-[13px] text-[#1A0B05] leading-tight truncate">{product.name}</h3>
        <span className="text-[#FFB800] font-black text-sm">₹{product.price}</span>
        
        <button 
          onClick={handleAddToCart}
          className={`mt-1 w-full font-bold py-2 text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all ${
            added ? 'bg-emerald-500 text-white' : 'bg-[#1A0B05] text-white hover:bg-black'
          }`}
        >
          {added ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}
