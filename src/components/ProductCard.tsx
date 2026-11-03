import React from 'react';
import { 
  Plus, 
  Minus, 
  Leaf, 
  MapPin, 
  Clock, 
  Award, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
}) => {
  return (
    <div className="group bg-white rounded-3xl border border-stone-200 hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Image & Badges */}
      <div 
        className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => onOpenDetails(product)}
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.organic && (
            <span className="inline-flex items-center gap-1 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
              <Leaf className="w-3 h-3" />
              100% Orgânico
            </span>
          )}
          {product.isSeasonal && (
            <span className="inline-flex items-center gap-1 bg-amber-500/90 backdrop-blur-xs text-stone-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              Safra da Estação
            </span>
          )}
        </div>

        {/* Harvest Time Badge */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <div className="bg-stone-900/75 backdrop-blur-xs text-emerald-300 text-[11px] font-medium px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-xs">
            <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{product.harvestDate}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Producer Name & Distance */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-emerald-800 hover:underline cursor-pointer truncate max-w-[170px]" onClick={() => onOpenDetails(product)}>
              {product.producerFarm || product.producerName}
            </span>
            {product.producerDistanceKm !== undefined && (
              <span className="flex items-center gap-0.5 text-stone-400 shrink-0 text-[11px]">
                <MapPin className="w-3 h-3 text-stone-400" />
                {product.producerDistanceKm} km
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            className="font-bold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1 mb-1.5"
            onClick={() => onOpenDetails(product)}
          >
            {product.title}
          </h3>

          {/* Description preview */}
          <p className="text-xs text-stone-500 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-stone-100 mt-auto">
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Preço Direto</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-stone-900">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs text-stone-500 font-medium">/ {product.unit}</span>
              </div>
            </div>

            {/* Quick Cart Actions */}
            {quantityInCart === 0 ? (
              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                title="Adicionar à Cesta"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 rounded-xl p-1">
                <button
                  onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                  className="w-6 h-6 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold text-xs shadow-2xs transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-bold text-xs text-stone-900">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                  className="w-6 h-6 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 flex items-center justify-center font-bold text-xs shadow-2xs transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Stock availability indicator */}
          <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400">
            {product.stock <= 10 ? (
              <span className="text-amber-700 font-medium">🔥 Apenas {product.stock} disponíveis hoje</span>
            ) : (
              <span className="text-emerald-700">✓ Em estoque fresco ({product.stock} {product.unit})</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
