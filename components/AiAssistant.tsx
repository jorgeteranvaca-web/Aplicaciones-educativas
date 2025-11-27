import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { getAiHint } from '../geminiService';

interface Props {
  worldTitle: string;
  riddleQuestion: string;
}

const AiAssistant: React.FC<Props> = ({ worldTitle, riddleQuestion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Saludos, viajero. Si las ecuaciones nublan tu mente, puedo ofrecerte una guía.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const hint = await getAiHint(worldTitle, riddleQuestion, userMsg);

    setMessages(prev => [...prev, { role: 'model', text: hint }]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-xl shadow-indigo-900/50 transition-all hover:scale-110 group"
      >
        <Sparkles className="absolute -top-1 -right-1 text-amber-300 animate-pulse" size={16} />
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 md:w-96 h-[500px] glass-panel rounded-2xl flex flex-col shadow-2xl border border-indigo-500/30">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-indigo-900/40 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" size={18} />
          <h3 className="font-bold text-indigo-100 title-font">Oráculo Matemático</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 p-3 rounded-lg rounded-bl-none">
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pide una pista..."
          className="flex-grow bg-slate-800 border-none rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 p-2 rounded-lg text-white transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
