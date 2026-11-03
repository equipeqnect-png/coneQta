import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Store, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  ChefHat
} from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
  onOpenAIWithCart: () => void;
  deliveryType: 'delivery' | 'pickup';
  onDeliveryTypeChange: (type: 'delivery' | 'pickup') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
  onOpenCheckout,
  onOpenAIWithCart,
  deliveryType,
  onDeliveryTypeChange,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' ? 8.00 : 0.00;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-stone-900 text-base">Meu Carrinho</h3>
              <p className="text-xs text-stone-400">{cart.length} tipo(s) de produtos</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Empty state */}
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-stone-800 text-sm">Seu carrinho está vazio</h4>
            </div>
          ) : (
            <>
              {/* Delivery method selector */}
              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 block mb-2">Forma de Recebimento:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onDeliveryTypeChange('delivery')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      deliveryType === 'delivery'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Em Casa (R$ 8,00)</span>
                  </button>

                  <button
                    onClick={() => onDeliveryTypeChange('pickup')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      deliveryType === 'pickup'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Retirada (Grátis)</span>
                  </button>
                </div>
              </div>

              {/* AI Recipe Helper Banner */}
              <button
                onClick={onOpenAIWithCart}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-200/80 hover:border-emerald-400 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">O que cozinhar com esta cesta?</span>
                    <span className="text-[10px] text-stone-500">Clique para receitas com IA usando seus itens</span>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              </button>

              {/* List of items */}
              <div className="divide-y divide-stone-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-stone-900 truncate">{item.product.title}</h4>
                      <p className="text-[11px] text-emerald-800 font-medium">{item.product.producerFarm || item.product.producerName}</p>
                      <p className="text-xs text-stone-900 font-black mt-0.5">
                        R$ {item.product.price.toFixed(2).replace('.', ',')} <span className="text-[10px] text-stone-400 font-normal">/ {item.product.unit}</span>
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-stone-200 flex items-center justify-center text-xs font-bold shadow-2xs"
                      >
                        <Minus className="w-3 h-3 text-stone-700" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 flex items-center justify-center text-xs font-bold shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear cart action */}
              <div className="text-right">
                <button
                  onClick={onClearCart}
                  className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 ml-auto font-medium"
                >
                  <Trash2 className="w-3 h-3" />
                  Esvaziar Cesta
                </button>
              </div>
            </>
          )}

        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal dos Alimentos</span>
                <span className="font-bold text-stone-900">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete Rural ({deliveryType === 'delivery' ? 'Direto do Produtor' : 'Ponto de Retirada'})</span>
                <span className="font-bold text-stone-900">{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-emerald-950 pt-2 border-t border-stone-200">
                <span>Total a Pagar</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button
              onClick={onOpenCheckout}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Continuar para Pagamento</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-stone-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Pagamento seguro e repasse 100% integral às famílias agricultoras
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
