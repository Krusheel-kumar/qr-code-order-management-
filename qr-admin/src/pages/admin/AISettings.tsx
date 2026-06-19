import { useState } from 'react';
import { Bot, Save, MessageSquare } from 'lucide-react';

export default function AISettings() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a friendly barista AI. Always recommend the Matcha Boba on hot days. Keep your answers short and sweet."
  );
  const [creativity, setCreativity] = useState(0.7);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Chatbot Settings</h1>
        <p className="text-gray-500 mt-1">Configure your customer-facing AI assistant.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Toggle Section */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${aiEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Enable AI Assistant</h3>
              <p className="text-sm text-gray-500">Allow customers to use the AI Chat on the frontend.</p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={aiEnabled}
              onChange={() => setAiEnabled(!aiEnabled)}
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Configuration Section */}
        <div className={`p-6 space-y-8 ${!aiEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <MessageSquare className="w-4 h-4 text-gray-500" /> System Prompt
            </label>
            <p className="text-xs text-gray-500 mb-3">
              This dictates how the AI behaves and talks to your customers. Be specific!
            </p>
            <textarea 
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-900">AI Creativity (Temperature)</label>
              <span className="text-sm font-bold text-blue-600">{creativity}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Lower values make the AI more deterministic and factual. Higher values make it more creative and conversational.
            </p>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={creativity}
              onChange={(e) => setCreativity(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
