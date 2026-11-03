import React, { useState } from 'react';
import { 
  MapPin, 
  Leaf, 
  Award, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Star, 
  Sprout,
  HeartHandshake
} from 'lucide-react';
import { Producer, Product } from '../types';

interface ProducerDirectoryViewProps {
  producers: Producer[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenProducerProfile?: (producer: Producer) => void;
}

export const ProducerDirectoryView: React.FC<ProducerDirectoryViewProps> = ({
  producers,
  products,
  onSelectProduct,
  onAddToCart,
  onOpenProducerProfile
}) => {
  const [selectedProducerId, setSelectedProducerId] = useState<string | null>(null);

  const activeProducer = producers.find((p) => p.id === selectedProducerId) || null;
  const producerProducts = activeProducer ? products.filter((p) => p.producerId === activeProducer.id) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Transparência & Rastreabilidade do Campo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2">
            Conheça as Famílias que Alimentam a Nossa Região
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Ao comprar pelo CampoConeQta, você sabe exatamente quem plantou, onde fica a propriedade e apoia a permanência digna da agricultura familiar na terra.
          </p>
        </div>
      </div>

      {/* Grid of Producers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {producers.map((producer) => {
          const farmProducts = products.filter((p) => p.producerId === producer.id);

          return (
            <div
              key={producer.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Cover Photo & Farm Badge */}
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <img
                  src={producer.coverImage}
                  alt={producer.farmName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
                      Agricultura Familiar desde {producer.establishedYear}
                    </span>
                    <h3 className="text-lg font-bold font-serif">{producer.farmName}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold">
                    <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span>{producer.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-white/80">({producer.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Farmer profile pic + name */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={producer.avatar}
                      alt={producer.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-600 shadow-xs"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{producer.name}</h4>
                      <p className="text-xs text-emerald-800 flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {producer.location.city} ({producer.location.distanceKm} km de você)
                      </p>
                    </div>
                  </div>

                  {/* Bio & Story preview */}
                  <p className="text-xs text-stone-600 leading-relaxed mb-4 line-clamp-3">
                    {producer.story}
                  </p>

                  {/* Specialty & Certifications */}
                  <div className="space-y-2 mb-4 bg-stone-50 rounded-2xl p-3 border border-stone-100 text-xs">
                    <div>
                      <span className="text-stone-400 font-semibold block text-[10px] uppercase">Especialidade:</span>
                      <span className="font-bold text-stone-800">{producer.specialty}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {producer.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="bg-emerald-100/80 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                        >
                          <Leaf className="w-2.5 h-2.5" />
                          {cert.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available Products Chips */}
                <div className="pt-3 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-500 block mb-2">
                    Colheitas disponíveis hoje ({farmProducts.length} itens):
                  </span>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {farmProducts.slice(0, 3).map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => onSelectProduct(prod)}
                        className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 px-2.5 py-1 rounded-xl border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Sprout className="w-3 h-3 text-emerald-600" />
                        <span>{prod.title}</span>
                        <span className="font-bold text-stone-900">R$ {prod.price.toFixed(2)}</span>
                      </button>
                    ))}
                    {farmProducts.length > 3 && (
                      <span className="text-xs text-stone-400 self-center">+{farmProducts.length - 3} mais</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`https://wa.me/${producer.whatsapp}?text=Olá%20${encodeURIComponent(producer.name)}!%20Encontrei%20sua%20propriedade%20no%20CampoConeQta.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-2.5 rounded-xl border border-stone-200 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Falar no WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        if (onOpenProducerProfile) {
                          onOpenProducerProfile(producer);
                        } else {
                          setSelectedProducerId(producer.id);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs"
                    >
                      <span>Ver Perfil da Empresa</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Farm Detail Modal */}
      {activeProducer && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-700">Propriedade Rural Familiar</span>
                <h2 className="text-2xl font-bold font-serif text-stone-900">{activeProducer.farmName}</h2>
                <p className="text-xs text-stone-500">{activeProducer.name} • {activeProducer.location.city} ({activeProducer.location.distanceKm} km)</p>
              </div>
              <button 
                onClick={() => setSelectedProducerId(null)}
                className="text-stone-400 hover:text-stone-600 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="aspect-16/9 rounded-2xl overflow-hidden bg-stone-100">
              <img src={activeProducer.coverImage} alt={activeProducer.farmName} className="w-full h-full object-cover" />
            </div>

            <div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">História e Métodos de Cultivo</h3>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                {activeProducer.story}
              </p>
            </div>

            {/* List of Products */}
            <div>
              <h3 className="font-bold text-stone-900 text-sm mb-3">Produtos desta Família Disponíveis Hoje</h3>
              <div className="space-y-2">
                {producerProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-stone-900">{p.title}</h4>
                        <p className="text-[11px] text-stone-500">Colhido: {p.harvestDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-emerald-900">R$ {p.price.toFixed(2)} / {p.unit}</span>
                      <button
                        onClick={() => {
                          onAddToCart(p);
                        }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs"
                      >
                        + Cesta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedProducerId(null)}
                className="px-5 py-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
