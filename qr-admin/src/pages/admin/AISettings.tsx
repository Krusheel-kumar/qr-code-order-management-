import { useState } from 'react';
import { Bot, Save, MessageSquare } from 'lucide-react';

export default function AISettings() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a friendly barista AI. Always recommend the Matcha Boba on hot days. Keep your answers short and sweet."
  );
  const [creativity, setCreativity] = useState(0.7);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <div>
        <h1 className="text-3xl font-heading font-black text-[#2A1B16] tracking-tight">AI Chatbot Settings</h1>
        <p className="text-[#8D6E63] font-medium mt-1">Configure your customer-facing AI assistant.</p>
      </div>

      <div className="glass-panel rounded-2xl border border-[#FAEDCD] overflow-hidden shadow-xs bg-[#FFFDF8]">
        
        {/* Toggle Section */}
        <div className="p-6 border-b border-[#FAEDCD]/60 flex items-center justify-between bg-[#FFF8E8]/40">
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-xl transition-all shrink-0 ${aiEnabled ? 'bg-[#FFD54F]/20 text-[#2A1B16] border border-[#FFD54F]/30 shadow-2xs' : 'bg-[#FAEDCD]/30 text-[#8D6E63]'}`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-[#2A1B16]">Enable AI Assistant</h3>
              <p className="text-xs text-[#8D6E63] font-medium mt-0.5">Allow customers to use the AI Chat on the frontend.</p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={aiEnabled}
              onChange={() => setAiEnabled(!aiEnabled)}
            />
            <div className="w-14 h-7 bg-[#FAEDCD] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#22C55E]"></div>
          </label>
        </div>

        {/* Configuration Section */}
        <div className={`p-6 space-y-8 transition-opacity duration-300 ${!aiEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
          
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A1B16] mb-2">
              <MessageSquare className="w-4 h-4 text-[#8D6E63]" /> System Prompt
            </label>
            <p className="text-xs text-[#8D6E63] font-medium mb-3">
              This dictates how the AI behaves and talks to your customers. Be specific!
            </p>
            <textarea 
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full border border-[#FAEDCD] rounded-xl bg-white/85 p-3 text-sm text-[#2A1B16] focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] outline-none transition-all resize-none font-medium placeholder-[#8D6E63]/30"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2A1B16]">AI Creativity (Temperature)</label>
              <span className="text-sm font-black text-[#B87A42]">{creativity}</span>
            </div>
            <p className="text-xs text-[#8D6E63] font-medium mb-4">
              Lower values make the AI more deterministic and factual. Higher values make it more creative and conversational.
            </p>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={creativity}
              onChange={(e) => setCreativity(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#FAEDCD] rounded-lg appearance-none cursor-pointer accent-[#2A1B16]"
            />
          </div>

          <div className="pt-4 flex justify-end border-t border-[#FAEDCD]/30">
            <button className="bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95">
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

