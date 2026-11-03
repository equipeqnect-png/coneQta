import React, { useState } from 'react';
import { 
  Sprout, 
  ShoppingBag, 
  Sparkles, 
  MapPin, 
  UserCheck, 
  Store, 
  Search, 
  Clock, 
  ChevronDown,
  Navigation
} from 'lucide-react';
import { UserRole } from '../types';
import { UserLocation } from '../services/storage';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAI: () => void;
  onOpenTracker: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userLocation: UserLocation;
  onUpdateLocation: (loc: UserLocation) => void;
  activeTab: 'marketplace' | 'producers' | 'baskets';
  onTabChange: (tab: 'marketplace' | 'producers' | 'baskets') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  cartCount,
  onOpenCart,
  onOpenAI,
  onOpenTracker,
  searchQuery,
  onSearchChange,
  userLocation,
  onUpdateLocation,
  activeTab,
  onTabChange
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempCity, setTempCity] = useState(userLocation.city);
  const [tempRadius, setTempRadius] = useState(userLocation.maxDistanceKm);

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLocation({
      city: tempCity,
      state: 'SP',
      maxDistanceKm: Number(tempRadius),
    });
    setShowLocationModal(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Feira Direta do Campo: Alimentos colhidos na madrugada e entregues frescos na sua porta</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('marketplace')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-stone-900 font-serif">CampoConeQta</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full">
                  Direto do Produtor
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">Alimentos frescos & agricultura familiar</p>
            </div>
          </div>

          {/* Search bar in center (Consumer mode) */}
          {currentRole === 'consumer' && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar tomate orgânico, queijo meia cura, mel silvestre..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100/80 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-stone-800 placeholder-stone-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Location & Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Location Selector */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium border border-stone-200 transition-colors"
              title="Filtrar produtores por localização e raio de entrega"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[120px] truncate hidden sm:inline">{userLocation.city}</span>
              <span className="text-emerald-700 font-semibold">({userLocation.maxDistanceKm}km)</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-emerald-500/10 hover:from-amber-500/20 hover:to-emerald-500/20 border border-amber-300 text-amber-900 text-xs font-semibold shadow-2xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span className="hidden md:inline">NutriCampo IA</span>
              <span className="md:hidden">IA</span>
            </button>

            {/* Order Tracker Button */}
            <button
              onClick={onOpenTracker}
              className="p-2 rounded-full text-stone-600 hover:bg-stone-100 transition-colors relative"
              title="Acompanhar meus pedidos e colheita"
            >
              <Clock className="w-5 h-5 text-stone-700" />
            </button>

            {/* Cart Drawer Trigger */}
            {currentRole === 'consumer' && (
              <button
                onClick={onOpenCart}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-full text-sm font-semibold shadow-sm transition-all hover:scale-[1.02]"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cesta</span>
              </button>
            )}

            {/* Role Switcher Pill */}
            <div className="bg-stone-100 p-1 rounded-full flex items-center border border-stone-200">
              <button
                onClick={() => onRoleChange('consumer')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  currentRole === 'consumer'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span className="hidden lg:inline">Consumidor</span>
                </span>
              </button>
              <button
                onClick={() => onRoleChange('producer')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  currentRole === 'producer'
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  <span className="hidden lg:inline">Sou Produtor</span>
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Sub-Navigation for Consumer */}
        {currentRole === 'consumer' && (
          <div className="flex items-center justify-between pb-3 overflow-x-auto border-t border-stone-100 pt-2 gap-4 text-xs font-medium text-stone-600">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onTabChange('marketplace')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'marketplace'
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'hover:bg-stone-100'
                }`}
              >
                🌾 Feira de Alimentos
              </button>
              <button
                onClick={() => onTabChange('baskets')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'baskets'
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'hover:bg-stone-100'
                }`}
              >
                🧺 Cestas da Semana
              </button>
              <button
                onClick={() => onTabChange('producers')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'producers'
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'hover:bg-stone-100'
                }`}
              >
                👨‍🌾 Conheça os Produtores
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-stone-500">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Garantia de Origem Familiar
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-serif">Sua Região & Raio de Proximidade</h3>
              </div>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="text-stone-400 hover:text-stone-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <p className="text-xs text-stone-600 mb-5 leading-relaxed">
              O CampoConeQta prioriza produtores locais próximos a você para garantir que a colheita chegue fresca em poucas horas e reduza a pegada de carbono.
            </p>

            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cidade / Região
                </label>
                <input
                  type="text"
                  value={tempCity}
                  onChange={(e) => setTempCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="Ex: Joanópolis, Bragança Paulista, Atibaia, Piracaia"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Raio Máximo de Produtores
                  </label>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Até {tempRadius} km
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={tempRadius}
                  onChange={(e) => setTempRadius(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>5 km (Ultra-local)</span>
                  <span>30 km (Médio)</span>
                  <span>60 km (Regional)</span>
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs"
                >
                  Aplicar Localização
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
