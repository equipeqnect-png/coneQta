import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ChefHat, 
  Leaf, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  HelpCircle,
  Clock,
  Apple
} from 'lucide-react';
import { askCampoConeQtaAI } from '../services/geminiService';
import { CartItem, Product } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  allProducts: Product[];
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  cart,
  allProducts,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Olá! Sou o **NutriCampo IA**, o assistente especializado em alimentos frescos, receitas da roça e agricultura sustentável do **CampoConeQta**.\n\nComo posso te ajudar hoje? Posso sugerir receitas deliciosas com o que você colocou na cesta, ensinar como conservar alimentos para durarem mais, ou tirar dúvidas sobre cultivo orgânico!`,
      timestamp: 'Agora',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string, actionType?: any) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Agora',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askCampoConeQtaAI({
        action: actionType || 'custom_chat',
        prompt: text,
        context: {
          cartItems: cart.map((c) => ({
            title: c.product.title,
            category: c.product.category,
            unit: c.product.unit,
            quantity: c.quantity,
          })),
          availableSeasonalProducts: allProducts.slice(0, 8).map((p) => p.title),
        },
      });

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response,
        timestamp: 'Agora',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: 'Desculpe, ocorreu uma instabilidade na conexão com o assistente. Tente novamente em alguns instantes.',
        timestamp: 'Agora',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string, action: any) => {
    handleSendMessage(prompt, action);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[85vh] shadow-2xl border border-stone-100 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-serif text-base text-white">NutriCampo & Chef da Roça</h3>
                <span className="bg-emerald-700/80 text-emerald-200 text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">Receitas com o que colheu, conservação & saberes do campo</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-2xl font-bold p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-stone-50 border-b border-stone-200 p-3 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-stone-500 shrink-0">Sugestões:</span>
          
          <button
            onClick={() => handleQuickPrompt('Quais receitas deliciosas posso preparar com os alimentos frescos da minha cesta?', 'recipe_from_cart')}
            className="bg-white hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 px-3 py-1.5 rounded-xl border border-stone-200 shrink-0 font-medium transition-colors flex items-center gap-1.5"
          >
            <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
            Receita com minha Cesta
          </button>

          <button
            onClick={() => handleQuickPrompt('Como armazenar e conservar verduras, queijos artesanais e frutas para durarem mais?', 'storage_tips')}
            className="bg-white hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 px-3 py-1.5 rounded-xl border border-stone-200 shrink-0 font-medium transition-colors flex items-center gap-1.5"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            Guia de Conservação
          </button>

          <button
            onClick={() => handleQuickPrompt('Quais alimentos estão no auge da safra neste mês no Brasil e quais seus benefícios?', 'custom_chat')}
            className="bg-white hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 px-3 py-1.5 rounded-xl border border-stone-200 shrink-0 font-medium transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            Safra do Mês
          </button>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-gradient-to-br from-amber-500 to-emerald-600 text-white shadow-xs'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-none'
                    : 'bg-stone-100 text-stone-800 rounded-tl-none border border-stone-200'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center text-xs text-stone-500 italic">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>NutriCampo IA está pensando na melhor dica da roça...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre receitas, conservação, orgânicos ou manejo..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm bg-stone-100 border border-stone-300 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white p-3 rounded-2xl shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
