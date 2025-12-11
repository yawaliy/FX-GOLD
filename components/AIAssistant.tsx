import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { ChatMessage, UserBalance, ExchangeRate } from '../types';
import { getMarketAdvice } from '../services/geminiService';

interface AIAssistantProps {
  balance: UserBalance;
  goldPrice: number;
  rates: Record<string, ExchangeRate>;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ balance, goldPrice, rates }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am FX AI. How can I help you with your gold investments or currency exchanges today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const context = `
      Gold Price: $${goldPrice}/oz.
      Rates: 1 USD = ${(1 / rates.NGN.rateToUSD).toFixed(2)} NGN.
      User Portfolio: ${balance.GOLD_OZ.toFixed(2)} oz Gold, ${balance.USD} USD, ${balance.NGN} NGN.
    `;

    try {
      const responseText = await getMarketAdvice(userMsg.text, context);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again later.", isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-gold-600 to-gold-400 text-black p-4 rounded-full shadow-lg shadow-gold-500/20 hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute right-full mr-3 bg-zinc-800 text-gold-300 px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gold-900">
            Ask FX AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm md:max-w-md h-[500px] bg-zinc-900 border border-gold-600/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
            <div className="flex items-center gap-2">
              <div className="bg-gold-500/10 p-2 rounded-full">
                <Bot className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="font-serif text-gold-100 font-semibold">FX AI Advisor</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gold-600 text-black rounded-tr-none'
                      : 'bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-tl-none'
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none border border-zinc-700">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-zinc-900 border-t border-zinc-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about gold prices..."
                className="w-full bg-zinc-800 text-white pl-4 pr-12 py-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder-zinc-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-2 p-1.5 bg-gold-500 text-black rounded-lg hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;