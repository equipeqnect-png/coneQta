import React from 'react';
import { Leaf, ShieldCheck, HeartHandshake, Sun, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onSearchTagClick: (tag: string) => void;
  onOpenAI: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchTagClick, onOpenAI }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-3xl mb-8 p-6 sm:p-10 shadow-xl">
      {/* Background organic glow & pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        {/* Subtitle tag */}
        <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-4 backdrop-blur-xs">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Colheita da Madrugada Disponível Hoje</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif leading-tight text-white mb-4">
          Comida de verdade, colhida com amor e entregue na sua mesa.
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-6 max-w-2xl">
          Conectamos você diretamente às famílias agricultoras da sua região. Sem atravessadores, com preço justo para quem planta e frescor incomparável para quem consome.
        </p>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs text-emerald-200 font-medium mr-1">Mais procurados:</span>
          {['Tomate Orgânico', 'Queijo Meia Cura', 'Ovos Caipiras', 'Mel Puro', 'Morangos', 'Cesta Semanal'].map((tag) => (
            <button
              key={tag}
              onClick={() => onSearchTagClick(tag)}
              className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/15 transition-all hover:scale-105 active:scale-95 cursor-pointer font-medium"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 3 Pillars / Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-emerald-800/60">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/40 text-emerald-300 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">100% Fresco & Sazonal</h4>
              <p className="text-[11px] text-emerald-200/80">Colhido em até 24h da entrega</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-600/40 text-amber-300 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Comércio Justo</h4>
              <p className="text-[11px] text-emerald-200/80">Valor integral ao agricultor</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
            <div className="w-9 h-9 rounded-xl bg-teal-600/40 text-teal-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Origem Rastreável</h4>
              <p className="text-[11px] text-emerald-200/80">Conheça o sítio e a família</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
