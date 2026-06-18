import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../../store/useCartStore';
import { 
  getLocalRecommendation, 
  getLlmRecommendation
} from '../../../lib/recommendationEngine';
import type {
  FlavorCategory,
  SubFlavor,
  ToppingPreference
} from '../../../lib/recommendationEngine';
import { MENU } from '../../../data/menu';

type MessageSender = 'ai' | 'user';

interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  options?: string[];
  productRecommendationId?: string;
  isTyping?: boolean;
}

export default function AIChatScreen() {
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "👋 Welcome to Pop O Bob! I'm POB AI, your personal bubble tea assistant.\n\nHave you tried bubble tea before?",
      options: ["Yes, I know what I want", "No, it's my first time"]
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  
  // State Machine for the "First Time" guided flow
  const [flowState, setFlowState] = useState<'IDLE' | 'ASK_CATEGORY' | 'ASK_SUBFLAVOR' | 'ASK_TOPPING' | 'DONE'>('IDLE');
  const [selectedCategory, setSelectedCategory] = useState<FlavorCategory | null>(null);
  const [selectedSubFlavor, setSelectedSubFlavor] = useState<SubFlavor | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAiMessage = (text: string, options?: string[], productRecommendationId?: string) => {
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, sender: 'ai', text, options, productRecommendationId }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, sender: 'user', text }]);
  };

  const handleOptionClick = (option: string) => {
    // 1. Add user's choice to chat
    addUserMessage(option);
    
    // 2. Remove options from the previous AI message
    setMessages(prev => {
      const newMessages = [...prev];
      const lastAiMessageIndex = newMessages.map(m => m.sender).lastIndexOf('ai');
      if (lastAiMessageIndex !== -1) {
        newMessages[lastAiMessageIndex].options = undefined;
      }
      return newMessages;
    });

    // 3. Process logic
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
      
      // Show typing indicator
      const typingId = `msg-typing-${Date.now()}`;
      setMessages(prev => [...prev, { id: typingId, sender: 'ai', text: '', isTyping: true }]);
      
      setTimeout(() => {
        // Remove typing
        setMessages(prev => prev.filter(m => m.id !== typingId));
        
        // Generate recommendation
        const rec = getLocalRecommendation(selectedCategory!, selectedSubFlavor!, topping);
        addAiMessage(rec.reason, ["Start over", "Go to Menu"], rec.productId);
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

    // Fallback if none of the guided states caught it
    handleFreeTextSubmit(choice);
  };

  const handleFreeTextSubmit = async (text?: string) => {
    const query = text || inputText.trim();
    if (!query) return;

    if (!text) {
      addUserMessage(query);
      setInputText('');
    }

    // Remove options from prev AI message
    setMessages(prev => {
      const newMessages = [...prev];
      const lastAiMessageIndex = newMessages.map(m => m.sender).lastIndexOf('ai');
      if (lastAiMessageIndex !== -1) {
        newMessages[lastAiMessageIndex].options = undefined;
      }
      return newMessages;
    });

    // Show typing
    const typingId = `msg-typing-${Date.now()}`;
    setMessages(prev => [...prev, { id: typingId, sender: 'ai', text: '', isTyping: true }]);

    try {
      const rec = await getLlmRecommendation(query);
      setMessages(prev => prev.filter(m => m.id !== typingId));
      addAiMessage(rec.reason, ["Go to Menu", "Start over"], rec.productId);
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== typingId));
      addAiMessage("Oops! My brain is a little cloudy right now. Let's try again, or you can browse the menu.", ["Go to Menu"]);
    }
  };

  return (
    <div className="h-[100dvh] bg-[var(--color-cream)] flex flex-col font-sans relative">
      
      {/* Header */}
      <header className="flex items-center px-4 py-4 bg-white/90 backdrop-blur-xl border-b border-black/5 z-20 shrink-0 shadow-sm sticky top-0">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 flex justify-center items-center gap-2 pr-10">
          <img src="/assets/logo 2.png" alt="POB AI" className="w-8 h-8 object-contain" />
          <h1 className="font-heading font-extrabold text-lg text-gray-900 tracking-tight">POB AI</h1>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6 hide-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start gap-2'}`}
            >
              {/* AI Avatar */}
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden mt-1">
                  <img src="/assets/logo 2.png" alt="POB" className="w-5 h-5 object-contain" />
                </div>
              )}
              
              <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Message Bubble */}
                {msg.isTyping ? (
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5 h-[52px]">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  </div>
                ) : (
                  <div className={`px-5 py-3.5 shadow-sm whitespace-pre-wrap text-[15px] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-gray-900 text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                )}

                {/* Rich Product Recommendation */}
                {msg.productRecommendationId && (
                  <ProductRecommendationCard productId={msg.productRecommendationId} />
                )}

                {/* Quick Reply Options */}
                {msg.options && msg.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 w-full">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionClick(opt)}
                        className="bg-primary/10 border border-primary/30 text-primary-foreground px-4 py-2 rounded-full text-sm font-bold active:scale-95 transition-transform hover:bg-primary/20 text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} className="h-2" />
      </main>

      {/* Input Area */}
      <div className="shrink-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleFreeTextSubmit(); }}
          className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-2 py-2 focus-within:border-primary/50 focus-within:bg-white transition-colors"
        >
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your craving here..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-[15px] text-gray-800 placeholder:text-gray-400"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// Sub-component for displaying a product inside the chat
function ProductRecommendationCard({ productId }: { productId: string }) {
  const product = MENU.find(p => p.id === productId);
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
      className="mt-4 w-[280px] bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden shadow-md flex flex-col"
    >
      <div className="w-full h-[180px] bg-[var(--color-cream)] relative p-4 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full object-contain drop-shadow-xl" />
        ) : (
          <div className="w-20 h-24 bg-gray-200 rounded-2xl opacity-50" />
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-heading font-extrabold text-lg leading-tight">{product.name}</h3>
        <span className="text-primary font-extrabold text-lg">₹{product.price}</span>
        
        <button 
          onClick={handleAddToCart}
          className={`mt-2 w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all ${
            added ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black'
          }`}
        >
          {added ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}
