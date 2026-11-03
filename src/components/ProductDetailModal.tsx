import React, { useState } from 'react';
import { 
  X, 
  Leaf, 
  MapPin, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag, 
  Plus, 
  Minus,
  ChefHat,
  Info,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Product, Producer } from '../types';
import { askCampoConeQtaAI } from '../services/geminiService';

interface ProductDetailModalProps {
  product: Product | null;
  producer?: Producer | null;
  quantityInCart: number;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  producer,
  quantityInCart,
  onClose,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [aiRecipeLoading, setAiRecipeLoading] = useState(false);
  const [aiRecipeResult, setAiRecipeResult] = useState<string | null>(null);

  if (!product) return null;

  const handleAskAiRecipe = async () => {
    setAiRecipeLoading(true);
    setAiRecipeResult(null);
    try {
      const response = await askCampoConeQtaAI({
        action: 'recipe_from_cart',
        prompt: `Crie uma sugestão de receita maravilhosa, saudável e simples utilizando o seguinte ingrediente colhido no campo: ${product.title} (${product.description}). Destaque o sabor autêntico do produto fresco.`,
        context: {
          productName: product.title,
          category: product.category,
          unit: product.unit,
        }
      });
      setAiRecipeResult(response);
    } catch (e) {
      setAiRecipeResult('Não foi possível carregar a sugestão de receita no momento.');
    } finally {
      setAiRecipeLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 flex flex-col relative animate-in fade-in zoom-in-95">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/50 hover:bg-stone-900 text-white flex items-center justify-center transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Photos & Producer Summary */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 relative shadow-inner">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.organic && (
                <div className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Leaf className="w-3.5 h-3.5" />
                  100% Orgânico
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-600/30' : 'border-stone-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Producer Profile Box */}
            {producer && (
              <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={producer.avatar}
                    alt={producer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{producer.farmName}</h4>
                    <p className="text-xs text-emerald-800">{producer.name}</p>
                  </div>
                </div>
                <p className="text-xs text-stone-600 italic line-clamp-3 mb-2">
                  "{producer.bio}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-emerald-100">
                  <span className="flex items-center gap-1 text-emerald-900 font-medium">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {producer.location.city} ({producer.location.distanceKm} km)
                  </span>
                  <a
                    href={`https://wa.me/${producer.whatsapp}?text=Olá!%20Vi%20seu%20produto%20${encodeURIComponent(product.title)}%20no%20CampoConeQta.`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              {/* Category tag & harvest date */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  {product.harvestDate}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold font-serif text-stone-900 mb-2">
                {product.title}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-3xl font-black text-emerald-900">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-sm font-medium text-stone-500">/ {product.unit}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Highlights */}
              {product.nutritionHighlights && product.nutritionHighlights.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-bold text-stone-700 block mb-1.5">Destaques Nutricionais & Cultivo:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.nutritionHighlights.map((h, i) => (
                      <span key={i} className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200">
                        ✨ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage tips */}
              {product.storageTips && (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 mb-4 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block">Dica de Conservação da Roça:</strong>
                    <span>{product.storageTips}</span>
                  </div>
                </div>
              )}

              {/* AI Recipe Button */}
              <div className="mb-4">
                <button
                  onClick={handleAskAiRecipe}
                  disabled={aiRecipeLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-50 to-emerald-50 hover:from-amber-100 hover:to-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl py-2.5 px-4 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                >
                  <ChefHat className="w-4 h-4 text-emerald-700" />
                  <span>{aiRecipeLoading ? 'Consultando Chef NutriCampo com IA...' : 'Ideias de Receita com este Ingrediente (IA)'}</span>
                </button>

                {/* AI Recipe output */}
                {aiRecipeResult && (
                  <div className="mt-3 p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 space-y-2 max-h-44 overflow-y-auto">
                    <div className="flex items-center justify-between font-bold text-emerald-800 text-xs border-b border-stone-200 pb-1">
                      <span>Sugestão NutriCampo IA:</span>
                      <button onClick={() => setAiRecipeResult(null)} className="text-stone-400 hover:text-stone-600">Fechar</button>
                    </div>
                    <div className="whitespace-pre-line leading-relaxed">{aiRecipeResult}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
              {quantityInCart === 0 ? (
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-md cursor-pointer text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar à Cesta de Compras</span>
                </button>
              ) : (
                <div className="w-full flex items-center justify-between bg-stone-100 p-2 rounded-2xl border border-stone-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                      className="w-9 h-9 rounded-xl bg-white text-stone-800 hover:bg-stone-200 flex items-center justify-center font-bold text-sm shadow-xs"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm px-2 text-stone-900">
                      {quantityInCart} {product.unit} no carrinho
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                      className="w-9 h-9 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 flex items-center justify-center font-bold text-sm shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-emerald-900 text-sm pr-2">
                    Total: R$ {(product.price * quantityInCart).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
