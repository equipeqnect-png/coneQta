import React from 'react';
import { X, Leaf, Users, Award, MapPin, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreProducts: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onExploreProducts,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="about-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="about-modal-content"
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1F6B38] text-white p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle curved background decoration */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-emerald-400/20 pointer-events-none" />

          <button
            id="about-modal-close-btn"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <Leaf className="w-5 h-5 text-lime-300 fill-lime-300/30" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-200">Sobre o Projeto</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">Quem Somos</h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-normal">
            O <strong>ConeQta</strong> nasceu em Queimados (RJ) como uma ponte solidária e tecnológica para aproximar os produtores da agricultura familiar e pequenos comerciantes aos moradores da nossa cidade.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Section 1: Initiative */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Desafio Liga Jovem</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
                Idealizado por estudantes da Escola Municipal Leopoldo Machado para o Desafio Liga Jovem, com o objetivo de valorizar o comércio de Queimados.
              </p>
            </div>
          </div>

          {/* Section 2: Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="w-8 h-8 rounded-lg bg-[#4E553D] text-white flex items-center justify-center mb-2.5">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-stone-800 text-sm">Comércio Justo & Direto</h4>
              <p className="text-xs text-stone-600 leading-relaxed mt-1">
                Sem atravessadores. O valor pago chega diretamente a quem planta e produz em Queimados, garantindo renda digna e sustentável.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center mb-2.5">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-stone-800 text-sm">Fortalecimento Econômico</h4>
              <p className="text-xs text-stone-600 leading-relaxed mt-1">
                Incentivo à economia de Queimados e pequenos comerciantes locais
              </p>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-end border-t border-stone-100">
            <button
              id="about-modal-back-btn"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
            >
              Fechar
            </button>
            <button
              id="about-modal-explore-btn"
              type="button"
              onClick={() => {
                onClose();
                onExploreProducts();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#1F6B38] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Ver Produtos & Comerciantes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
