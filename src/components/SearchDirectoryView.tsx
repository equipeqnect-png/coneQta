import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Leaf, 
  MapPin, 
  Star, 
  Store, 
  ShoppingBag, 
  Plus, 
  ArrowLeft, 
  Filter, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  MessageCircle,
  Sparkles,
  Phone
} from 'lucide-react';
import { Product, Producer, CartItem } from '../types';

interface SearchDirectoryViewProps {
  products: Product[];
  producers: Producer[];
  cart: CartItem[];
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenProductDetail: (product: Product) => void;
  onOpenProducerProfile?: (producer: Producer) => void;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onOpenAbout: () => void;
  onOpenCartDrawer: () => void;
}

export const SearchDirectoryView: React.FC<SearchDirectoryViewProps> = ({
  products,
  producers,
  cart,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onOpenProductDetail,
  onOpenProducerProfile,
  onNavigateHome,
  onNavigateLogin,
  onOpenAbout,
  onOpenCartDrawer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'merchants' | 'products'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyOrganic, setOnlyOrganic] = useState(false);

  // Categories list
  const categoryFilters = [
    { id: 'all', label: 'Todos' },
    { id: 'produtos_agricolas', label: 'Produtos agrícolas' },
    { id: 'gastronomia', label: 'Gastronomia' },
    { id: 'estetica_beleza', label: 'Estética e beleza' },
    { id: 'vestuario', label: 'Vestuário' },
    { id: 'artesanato', label: 'Artesanato' },
  ];

  // Filtered Producers / Merchants
  const filteredProducers = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return producers;

    return producers.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const story = (p.story || p.bio || '').toLowerCase();
      const farm = (p.farmName || '').toLowerCase();
      const city = (p.location?.city || '').toLowerCase();
      const neighborhood = (p.location?.neighborhood || '').toLowerCase();
      const specialty = (p.specialty || '').toLowerCase();
      const matchSpecialties = Array.isArray(p.certifications) && p.certifications.some(c => (c || '').toLowerCase().includes(q));

      return (
        name.includes(q) ||
        story.includes(q) ||
        farm.includes(q) ||
        city.includes(q) ||
        neighborhood.includes(q) ||
        specialty.includes(q) ||
        matchSpecialties
      );
    });
  }, [producers, searchTerm]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();

    return products.filter((prod) => {
      const title = (prod.title || (prod as unknown as { name?: string }).name || '').toLowerCase();
      const description = (prod.description || '').toLowerCase();
      const farm = (prod.producerFarm || prod.producerName || '').toLowerCase();

      const matchesSearch = !q || title.includes(q) || description.includes(q) || farm.includes(q);
      const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;
      const certs = Array.isArray(prod.certifications) ? prod.certifications : [];
      const matchesOrganic = !onlyOrganic || certs.includes('agroecologico') || certs.includes('organico') || !!prod.organic;

      return matchesSearch && matchesCat && matchesOrganic;
    });
  }, [products, searchTerm, selectedCategory, onlyOrganic]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-stone-800 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="bg-[#1F6B38] text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo & Back to Home */}
          <div className="flex items-center gap-4">
            <button
              id="search-view-back-home-btn"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Início</span>
            </button>

            <div 
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={onNavigateHome}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wider uppercase">CONEQTA</span>
                <span className="text-[10px] block text-emerald-200 font-medium">Queimados | RJ</span>
              </div>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              id="search-nav-about-btn"
              onClick={onOpenAbout}
              className="text-xs text-white/90 hover:text-white font-medium hover:underline hidden sm:inline"
            >
              Quem somos
            </button>

            {/* Cart Quick Button */}
            {totalCartCount > 0 && (
              <button
                id="search-open-cart-btn"
                onClick={onOpenCartDrawer}
                className="flex items-center gap-1.5 bg-lime-400 hover:bg-lime-300 text-stone-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{totalCartCount}</span>
              </button>
            )}

            {/* Login button */}
            <button
              id="search-view-login-btn"
              onClick={onNavigateLogin}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 text-xs font-bold px-4 py-1.5 rounded-full transition-all"
            >
              Entrar / Login
            </button>
          </div>

        </div>
      </header>

      {/* Main Search Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Search Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80">
          <div className="max-w-3xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3 border border-emerald-100">
              Queimados • Guia Local & Feira
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
              Busca de Produtos e Empreendedores
            </h1>
            <p className="text-stone-600 text-sm mt-2 leading-relaxed">
              Encontre produtores da agricultura familiar, comércios locais, hortaliças frescas, doces artesanais e muito mais em Queimados.
            </p>

            {/* Big Search Input */}
            <div className="mt-5 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="search-main-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por mandioca, ovos caipiras, Sítio da Vivian, mel, queijo..."
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-stone-900 rounded-2xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm sm:text-base transition-all outline-hidden shadow-inner"
              />
              {searchTerm && (
                <button
                  id="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 bg-stone-200/60 px-2 py-1 rounded-lg"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Tab selection */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                id="tab-search-all"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#1F6B38] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Todos ({filteredProducers.length + filteredProducts.length})
              </button>

              <button
                id="tab-search-merchants"
                onClick={() => setActiveTab('merchants')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'merchants'
                    ? 'bg-[#1F6B38] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Empreendedores & Produtores ({filteredProducers.length})</span>
              </button>

              <button
                id="tab-search-products"
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'products'
                    ? 'bg-[#1F6B38] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Produtos ({filteredProducts.length})</span>
              </button>

              {/* Organic toggle filter */}
              <button
                id="filter-organic-toggle"
                onClick={() => setOnlyOrganic(!onlyOrganic)}
                className={`ml-auto px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  onlyOrganic 
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' 
                    : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Apenas Agroecológicos</span>
                {onlyOrganic && <Check className="w-3 h-3 text-emerald-800" />}
              </button>
            </div>

            {/* Category pills for products */}
            {(activeTab === 'all' || activeTab === 'products') && (
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Categorias:</span>
                {categoryFilters.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs shrink-0 transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-stone-800 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* SECTION 1: MERCHANTS / PRODUCERS */}
        {(activeTab === 'all' || activeTab === 'merchants') && filteredProducers.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#4E553D] text-white flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-stone-900">Empreendedores e Produtores de Queimados</h2>
              </div>
              <span className="text-xs text-stone-500 font-medium">{filteredProducers.length} encontrado(s)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducers.map((producer) => (
                <div 
                  key={producer.id}
                  id={`search-producer-card-${producer.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Producer Cover Banner */}
                    <div className="h-32 bg-stone-200 relative overflow-hidden">
                      <img 
                        src={producer.coverImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'} 
                        alt={producer.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Avatar */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                        <img 
                          src={producer.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'} 
                          alt={producer.name} 
                          className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm bg-white"
                        />
                        <div className="text-white">
                          <h3 className="font-bold text-sm leading-tight drop-shadow-xs">{producer.farmName || producer.name}</h3>
                          <p className="text-[11px] text-lime-200 drop-shadow-xs font-medium">{producer.name}</p>
                        </div>
                      </div>

                      {/* Rating badge */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold text-stone-800 flex items-center gap-1 shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{(producer.rating || 5.0).toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{producer.location?.city || 'Queimados'} • {producer.location?.neighborhood || 'Zona Rural'}</span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {producer.story || producer.bio || producer.tagline}
                      </p>

                      {/* Specialties tags */}
                      {producer.specialty && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          <span className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                            {producer.specialty}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verificado</span>
                    </span>

                    <div className="flex items-center gap-1">
                      {onOpenProducerProfile && (
                        <button
                          onClick={() => onOpenProducerProfile(producer)}
                          className="text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Ver Perfil
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSearchTerm(producer.farmName || producer.name);
                          setActiveTab('products');
                        }}
                        className="text-xs font-bold text-[#1F6B38] hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        Produtos →
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: PRODUCTS */}
        {(activeTab === 'all' || activeTab === 'products') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1F6B38] text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-stone-900">Produtos</h2>
              </div>
              <span className="text-xs text-stone-500 font-medium">{filteredProducts.length} produto(s)</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
                <Leaf className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h3 className="font-bold text-stone-700 text-base">Nenhum produto encontrado</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Tente alterar os termos da busca ou limpar os filtros de categoria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setOnlyOrganic(false);
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((prod) => {
                  const title = prod.title || (prod as unknown as { name?: string }).name || 'Produto';
                  const prodImage = prod.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
                  const farmName = prod.producerFarm || prod.producerName || 'Produtor Local';

                  return (
                    <div
                      key={prod.id}
                      id={`search-prod-card-${prod.id}`}
                      className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="cursor-pointer" onClick={() => onOpenProductDetail(prod)}>
                        {/* Product Image */}
                        <div className="h-36 sm:h-40 bg-stone-100 relative overflow-hidden">
                          <img
                            src={prodImage}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {prod.harvestDate && (
                            <div className="absolute top-2 left-2 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                              {prod.harvestDate}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3.5 space-y-1.5">
                          <p className="text-[10px] text-stone-500 font-medium truncate">
                            {farmName}
                          </p>
                          <h3 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1 leading-snug">
                            {title}
                          </h3>
                          <p className="text-[11px] text-stone-500 line-clamp-1">
                            {prod.unit}
                          </p>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="p-3.5 pt-0 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 block font-normal">Preço</span>
                          <span className="font-extrabold text-sm sm:text-base text-emerald-800">
                            R$ {(prod.price || 0).toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        <button
                          id={`search-add-btn-${prod.id}`}
                          onClick={() => onAddToCart(prod, 1)}
                          className="w-8 h-8 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95"
                          title="Adicionar à cesta"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

      </main>

    </div>
  );
};
