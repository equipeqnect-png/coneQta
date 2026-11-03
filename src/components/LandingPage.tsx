import React from 'react';
import { 
  Leaf, 
  Search, 
  User, 
  ChevronDown, 
  Menu,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import heroPhoneMarketImg from '../assets/images/hero_phone_market_1793736041014.jpg';

interface LandingPageProps {
  onNavigateHome: () => void;
  onNavigateSearch: () => void;
  onNavigateLogin: () => void;
  onOpenAbout: () => void;
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateHome,
  onNavigateSearch,
  onNavigateLogin,
  onOpenAbout,
  onGetStarted,
}) => {
  return (
    <div className="min-h-screen bg-[#ECEEEA] text-stone-800 flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden font-sans select-none">
      
      {/* 1. Organic Curved Shapes in the Background Canvas (Green Tone per Requirement 1) */}
      {/* Top-Right Large Fluid Wave */}
      <div className="absolute -top-24 -right-24 w-[380px] sm:w-[540px] lg:w-[680px] h-[380px] sm:h-[540px] lg:h-[680px] bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-600 rounded-[45%_55%_65%_35%/55%_45%_55%_45%] opacity-90 blur-xs pointer-events-none transform rotate-12 transition-transform duration-1000" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-teal-300/60 rounded-full blur-2xl pointer-events-none" />

      {/* Bottom-Left Large Fluid Wave */}
      <div className="absolute -bottom-28 -left-28 w-[320px] sm:w-[480px] lg:w-[580px] h-[320px] sm:h-[480px] lg:h-[580px] bg-gradient-to-tr from-[#15803D] via-[#1F6B38] to-emerald-500 rounded-[60%_40%_50%_50%/40%_60%_40%_60%] opacity-90 blur-xs pointer-events-none transform -rotate-12" />
      <div className="absolute bottom-6 left-6 w-60 h-60 bg-emerald-700/40 rounded-full blur-2xl pointer-events-none" />

      {/* 2. Main Central White Card Container matching reference image */}
      <div 
        id="landing-card-container"
        className="w-full max-w-6xl bg-white rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] shadow-2xl shadow-emerald-950/15 border border-stone-100/90 relative z-10 overflow-hidden flex flex-col justify-between min-h-[580px] lg:min-h-[640px] p-6 sm:p-10 lg:p-14"
      >
        
        {/* TOP NAVIGATION BAR */}
        <header className="w-full flex items-center justify-between gap-4 pb-6 sm:pb-8">
          
          {/* Item 4: Logo (ConeQta design) */}
          <div 
            id="landing-logo-btn"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1F6B38] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-lime-300 fill-lime-300/30" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-wider text-stone-900 uppercase block leading-none">
                CONE<span className="text-emerald-500">Q</span>TA
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 tracking-wide">
                Queimados | RJ
              </span>
            </div>
          </div>

          {/* Items 5, 6, 7, 8: Navigation Menu */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 bg-stone-50/80 p-1.5 rounded-full border border-stone-200/60 shadow-xs">
            {/* Item 5: "Início" with active pill styling */}
            <button
              id="landing-nav-home"
              onClick={onNavigateHome}
              className="px-5 py-1.5 rounded-full bg-stone-200/80 text-stone-900 font-bold text-xs sm:text-sm tracking-wide shadow-xs transition-all"
            >
              Início
            </button>

            {/* Item 6: "Quem somos" */}
            <button
              id="landing-nav-about"
              onClick={onOpenAbout}
              className="px-4 py-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-white/80 font-semibold text-xs sm:text-sm transition-all"
            >
              Quem somos
            </button>

            {/* Item 7: "Produtos" */}
            <button
              id="landing-nav-products"
              onClick={onNavigateSearch}
              className="px-4 py-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-white/80 font-semibold text-xs sm:text-sm transition-all"
            >
              Produtos
            </button>

            {/* Item 8: "Contact" is deleted/omitted */}
          </nav>

          {/* Items 9 & 10: Top Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Item 9: 1st Icon -> Search for products and merchants */}
            <button
              id="landing-icon-search"
              onClick={onNavigateSearch}
              title="Buscar produtos e comerciantes de Queimados"
              aria-label="Buscar produtos e comerciantes"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 border border-stone-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xs"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Item 10: 2nd Icon -> Redirects to login page */}
            <button
              id="landing-icon-login"
              onClick={onNavigateLogin}
              title="Acessar conta / Login"
              aria-label="Página de login"
              className="flex items-center gap-1 pl-1 pr-2.5 py-1 rounded-full bg-stone-900 text-white hover:bg-emerald-800 transition-all hover:scale-105 active:scale-95 shadow-xs"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800 flex items-center justify-center text-lime-300">
                <User className="w-4 h-4" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-white" />
            </button>

            {/* Extra Menu Icon for Mobile / Aesthetics */}
            <button
              id="landing-icon-menu"
              onClick={onOpenAbout}
              className="md:hidden w-9 h-9 rounded-full text-stone-700 hover:bg-stone-100 flex items-center justify-center border border-stone-200"
              aria-label="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

          </div>

        </header>

        {/* HERO BODY: TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center flex-1 my-auto py-4">
          
          {/* LEFT COLUMN: HEADLINE, DESCRIPTION & CTA */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 max-w-xl">
            
            <div>
              {/* CONEQTA static headline with Q in lighter green */}
              <div className="inline-block">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight text-[#1F6B38] font-sans leading-[0.95]">
                  <span>CONE</span>
                  <span className="text-[#34D399] drop-shadow-xs">Q</span>
                  <span>TA</span>
                </h1>
              </div>
              <p className="mt-3 text-lg sm:text-xl font-bold text-stone-800 tracking-tight">
                Conectando empreendedores de Queimados à população
              </p>
            </div>

            {/* Highlights bullet points - stacked vertically */}
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-stone-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Contato direto com comerciantes de Queimados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Comércio justo sem atravessadores</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Entrega e retirada local facilitada</span>
              </div>
            </div>

            {/* CTA Button: VER CATÁLOGO */}
            <div className="pt-2 flex items-center">
              <button
                id="landing-btn-get-started"
                onClick={onGetStarted}
                className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-600 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>VER CATÁLOGO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: CARTOON SMARTPHONE FAIR ILLUSTRATION (Hidden on Mobile per Requirement 2) */}
          <div className="hidden lg:flex lg:col-span-6 items-center justify-center relative w-full min-h-[340px] sm:min-h-[420px]">
            {/* Soft Ambient Glow Behind Illustration */}
            <div className="absolute w-[90%] h-[90%] bg-gradient-to-br from-emerald-100/50 via-teal-50/40 to-sky-100/40 rounded-full blur-2xl pointer-events-none" />

            {/* Cartoon Smartphone Fair Image */}
            <div className="relative z-10 w-full flex items-center justify-center p-2">
              <img
                src={heroPhoneMarketImg}
                alt="Feira e comércio local no smartphone em Queimados"
                referrerPolicy="no-referrer"
                className="w-full max-w-[460px] lg:max-w-[500px] rounded-3xl object-contain shadow-xl shadow-emerald-950/10 border border-stone-100 transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>

        </div>

        {/* BOTTOM METADATA BAR */}
        <footer className="w-full pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Feira Local Ativa • Queimados, Rio de Janeiro</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Desafio Liga Jovem • Equipe Q-NECT</span>
          </div>
        </footer>

      </div>

    </div>
  );
};
