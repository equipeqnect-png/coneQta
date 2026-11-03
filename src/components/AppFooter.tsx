import React from 'react';
import { Leaf, Heart } from 'lucide-react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="bg-[#18231C] text-stone-300 border-t border-stone-800/80 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand, Tagline & Liga Jovem */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-extrabold text-white text-base tracking-tight">ConeQta</span>
            <span className="text-stone-500">•</span>
            <span className="text-xs text-stone-300 font-medium">Conectando empreendedores de Queimados à população</span>
          </div>
          <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
            DESAFIO LIGA JOVEM • EQUIPE Q-NECT • QUEIMADOS, RJ
          </p>
        </div>

        {/* Right side info */}
        <div className="text-xs text-stone-400 text-center md:text-right">
          <span>Queimados, Baixada Fluminense - RJ</span>
        </div>

      </div>
    </footer>
  );
};
