import React, { useState } from 'react';
import { 
  Package, 
  Check, 
  Calendar, 
  Sparkles, 
  ShoppingBag, 
  Users, 
  Leaf, 
  Clock 
} from 'lucide-react';
import { SEASONAL_BASKETS } from '../data/mockData';
import { SeasonalBasket, Product } from '../types';

interface BasketsViewProps {
  onAddCustomBasketToCart: (product: Product) => void;
}

export const BasketsView: React.FC<BasketsViewProps> = ({ onAddCustomBasketToCart }) => {
  const [selectedDay, setSelectedDay] = useState<'quarta' | 'sexta' | 'sabado'>('sexta');
  const [selectedFrequency, setSelectedFrequency] = useState<'unica' | 'semanal' | 'quinzenal'>('semanal');

  const handleAddBasket = (basket: SeasonalBasket) => {
    // Transform basket into a Product for cart integration
    const basketProduct: Product = {
      id: `basket_${basket.id}`,
      producerId: 'prod_coletivo',
      producerName: 'Cooperativa de Produtores Locais',
      producerFarm: 'Colheita Compartilhada CampoConeQta',
      producerDistanceKm: 10,
      title: `${basket.name} (${selectedFrequency === 'unica' ? 'Avulsa' : `Assinatura ${selectedFrequency}`})`,
      description: `${basket.description} • Entrega agendada para toda ${selectedDay}.`,
      price: basket.price,
      unit: 'cesta',
      category: 'cestas',
      images: [basket.image],
      stock: 50,
      harvestDate: `Montada na manhã de ${selectedDay}`,
      organic: true,
      certifications: ['organico', 'familiar', 'agroecologico'],
      nutritionHighlights: [`Serve ${basket.serves}`, `${basket.itemsCount} itens frescos da época`],
      freshnessScore: 10,
      isSeasonal: true,
      featured: true,
    };

    onAddCustomBasketToCart(basketProduct);
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-950 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Clube de Assinatura & Cestas da Estação</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2">
            Receba a Feira do Campo Semanalmente na sua Porta
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-4">
            Cestas montadas artesanalmente com a colheita mais fresca da semana de múltiplos sítios familiares da sua região. Sem preocupação, com cancelamento livre a qualquer momento.
          </p>

          {/* Preference Selectors */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
            <div>
              <span className="text-stone-300 font-semibold block mb-1">Dia de Entrega Preferido:</span>
              <div className="flex bg-white/10 p-1 rounded-xl border border-white/10">
                {(['quarta', 'sexta', 'sabado'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                      selectedDay === d ? 'bg-amber-500 text-stone-900 font-bold shadow-xs' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {d === 'sabado' ? 'Sábado' : `${d}-feira`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-stone-300 font-semibold block mb-1">Frequência:</span>
              <div className="flex bg-white/10 p-1 rounded-xl border border-white/10">
                {(['unica', 'semanal', 'quinzenal'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFrequency(f)}
                    className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                      selectedFrequency === f ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {f === 'unica' ? 'Cesta Avulsa' : f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Baskets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SEASONAL_BASKETS.map((basket) => (
          <div
            key={basket.id}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Photo & Badge */}
            <div className="relative h-48 overflow-hidden bg-stone-100">
              <img
                src={basket.image}
                alt={basket.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                {basket.badge}
              </div>
              <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>{basket.serves}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-stone-900 mb-1">
                  {basket.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-800 mb-2">
                  {basket.subtitle}
                </p>
                <p className="text-xs text-stone-500 leading-relaxed mb-4">
                  {basket.description}
                </p>

                {/* Items in the box */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 mb-4">
                  <span className="text-[11px] font-bold text-stone-700 block mb-2">
                    O que vem nesta colheita ({basket.itemsIncluded.length} itens):
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {basket.itemsIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & Add */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">
                    {selectedFrequency === 'unica' ? 'Valor Único' : 'Por Entrega'}
                  </span>
                  <span className="text-2xl font-black text-emerald-900">
                    R$ {basket.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <button
                  onClick={() => handleAddBasket(basket)}
                  className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pedir Cesta</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
