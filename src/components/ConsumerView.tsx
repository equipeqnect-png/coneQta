import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ShoppingCart, 
  TrendingUp, 
  Star, 
  User, 
  MapPin, 
  Plus, 
  Minus, 
  Heart, 
  Sparkles, 
  Filter,
  CheckCircle,
  Leaf,
  Clock,
  MessageSquare,
  Video
} from 'lucide-react';
import { Product, Producer, CartItem, Order, AppUser, ProducerStory } from '../types';
import { UserAddressConfig, StorageService } from '../services/storage';
import { StoriesBar } from './StoriesBar';
import { StoryViewerModal } from './StoryViewerModal';
import { StoryPostModal } from './StoryPostModal';

interface ConsumerViewProps {
  currentUser: AppUser;
  currentAddress: UserAddressConfig;
  onOpenAddressModal: () => void;
  products: Product[];
  producers: Producer[];
  cart: CartItem[];
  orders: Order[];
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onOpenCartDrawer: () => void;
  onOpenProductDetail: (product: Product) => void;
  onOpenOrderTracker: () => void;
  onOpenProducerProfile?: (producer: Producer) => void;
  onOpenChatWithProducer?: (producerId: string) => void;
}

export const ConsumerView: React.FC<ConsumerViewProps> = ({
  currentUser,
  currentAddress,
  onOpenAddressModal,
  products,
  producers,
  cart,
  orders,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenCartDrawer,
  onOpenProductDetail,
  onOpenOrderTracker,
  onOpenProducerProfile,
  onOpenChatWithProducer,
}) => {
  // Navigation pill active state
  const [activePill, setActivePill] = useState<'feirinha' | 'search' | 'cart' | 'orders' | 'favorites' | 'profile'>('feirinha');
  
  // Local quantity buffer for product cards before adding to cart
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>({});
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Stories state
  const [stories, setStories] = useState<ProducerStory[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isPostStoryOpen, setIsPostStoryOpen] = useState(false);

  const loadStories = () => {
    setStories(StorageService.getStories());
  };

  useEffect(() => {
    loadStories();
    const handleUpdate = () => loadStories();
    window.addEventListener('coneqta_stories_updated', handleUpdate);
    return () => window.removeEventListener('coneqta_stories_updated', handleUpdate);
  }, []);

  const getCardQty = (productId: string) => {
    return cardQuantities[productId] || 1;
  };

  const handleIncrement = (productId: string) => {
    setCardQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const handleDecrement = (productId: string) => {
    setCardQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const myOrdersCount = orders.length;

  const categoriesList = [
    { id: 'todos', name: 'Todos' },
    { id: 'produtos_agricolas', name: 'Produtos agrícolas' },
    { id: 'gastronomia', name: 'Gastronomia' },
    { id: 'estetica_beleza', name: 'Estética e beleza' },
    { id: 'vestuario', name: 'Vestuário' },
    { id: 'artesanato', name: 'Artesanato' },
  ];

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'todos' && p.category !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (p.title || (p as unknown as { name?: string }).name || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchFarm = (p.producerFarm || p.producerName || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchFarm) return false;
    }
    return true;
  });

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Olive Banner (#4E553D) - Matching Screenshot 3 */}
      <div className="bg-[#4E553D] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="space-y-2 relative z-10">
          <div className="text-[10px] font-extrabold tracking-widest uppercase text-lime-200">
            FEIRA ORGÂNICA LOCAL
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            Olá, {currentUser.name}!
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-stone-200">
            <MapPin className="w-3.5 h-3.5 text-lime-300 shrink-0" />
            <span>
              Entregar em: <strong className="text-white">{currentAddress.address} • {currentAddress.neighborhood}</strong>
            </span>
          </div>
        </div>

        {/* Right Button inside banner: ALTERAR LOCAL PARA RECALCULAR DISTÂNCIAS */}
        <div className="bg-black/20 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex flex-col items-start sm:items-end justify-center gap-1 relative z-10">
          <div className="text-[9px] font-bold tracking-widest text-stone-300 uppercase">
            ALTERAR LOCAL PARA RECALCULAR DISTÂNCIAS
          </div>
          <button
            onClick={onOpenAddressModal}
            className="px-3.5 py-1.5 bg-white text-[#4E553D] hover:bg-stone-100 font-bold text-xs rounded-xl shadow-2xs transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <span>{currentAddress.label}</span>
          </button>
        </div>

      </div>

      {/* 2. Navigation Pills Bar - Matching Screenshot 3 */}
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-2 border border-stone-200/80 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          
          <button
            onClick={() => setActivePill('feirinha')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePill === 'feirinha'
                ? 'bg-[#4E553D] text-white shadow-2xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Feirinha</span>
          </button>

          <button
            onClick={() => setActivePill('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePill === 'search'
                ? 'bg-[#4E553D] text-white shadow-2xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Pesquisar Produtos</span>
          </button>

          <button
            onClick={() => {
              setActivePill('cart');
              onOpenCartDrawer();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePill === 'cart'
                ? 'bg-[#4E553D] text-white shadow-2xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Carrinho ({totalCartCount})</span>
          </button>

          <button
            onClick={() => setActivePill('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePill === 'favorites'
                ? 'bg-[#4E553D] text-white shadow-2xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Favoritos & Seguidos</span>
          </button>

          <button
            onClick={() => setActivePill('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePill === 'profile'
                ? 'bg-[#4E553D] text-white shadow-2xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Meu Perfil</span>
          </button>

        </div>
      </div>

      {/* 3. Main Views according to Active Pill */}

      {/* Stories Carousel Bar */}
      <StoriesBar
        stories={stories}
        currentUser={currentUser}
        onOpenStory={(idx) => setSelectedStoryIndex(idx)}
        onOpenPostStory={() => setIsPostStoryOpen(true)}
      />

      {/* VIEW: FEIRINHA / PRODUTOS ADICIONADOS NAS ÚLTIMAS 24H */}
      {activePill === 'feirinha' && (
        <div className="space-y-6">
          
          {/* Section Heading */}
          <div className="flex items-baseline justify-between border-b border-stone-200 pb-2">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              Produtos adicionados nas últimas 24h
            </h3>
          </div>

          {/* Product Grid - Matching Screenshot 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const qty = getCardQty(product.id);
              const isFav = favorites.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Image container with badges & favorite */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge: COLHIDO HOJE */}
                    <div className="absolute top-3 left-3 bg-[#E76F51] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs">
                      COLHIDO HOJE
                    </div>

                    {/* Favorite Star Button */}
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-amber-500 shadow-2xs transition-colors"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    
                    <div>
                      {/* Category in small uppercase */}
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                        {product.category}
                      </p>

                      {/* Title */}
                      <h4
                        onClick={() => onOpenProductDetail(product)}
                        className="font-bold text-base text-stone-900 cursor-pointer hover:text-[#4E553D] transition-colors leading-tight"
                      >
                        {product.title}
                      </h4>

                      {/* Producer Info */}
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#4E553D] shrink-0" />
                        <span>{product.producerFarm || 'Sítio Local'} • {product.producerDistanceKm || 0} km</span>
                      </p>
                    </div>

                    {/* Price and Quantity Selector Row */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-extrabold text-stone-900">
                            R$ {product.price.toFixed(2)}
                          </span>
                          <span className="text-xs text-stone-500 font-normal">
                            {' '}/{product.unit}
                          </span>
                        </div>

                        {/* Quantity Counter [-] 1 [+] */}
                        <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => handleDecrement(product.id)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-stone-800">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrement(product.id)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Add to Cart Button (#4E553D) */}
                      <button
                        type="button"
                        onClick={() => onAddToCart(product, qty)}
                        className="w-full py-2.5 bg-[#4E553D] hover:bg-[#3E452E] active:bg-[#323924] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Adicionar ao carrinho</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* VIEW: SEARCH & CATEGORIES */}
      {activePill === 'search' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6 shadow-2xs">
          <div>
            <h3 className="text-xl font-bold font-serif text-stone-900">Pesquisar Produtos em Queimados</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar mandioca, queijo, ovos, couve..."
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-hidden focus:border-[#4E553D]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categoriesList.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#4E553D] text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            {filteredProducts.map(p => (
              <div key={p.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.title} className="w-14 h-14 object-cover rounded-xl" />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">{p.title}</h5>
                    <p className="text-[10px] text-stone-500">{p.producerFarm}</p>
                    <p className="text-xs font-bold text-[#4E553D] mt-0.5">R$ {p.price.toFixed(2)} /{p.unit}</p>
                  </div>
                </div>
                <button
                  onClick={() => onAddToCart(p, 1)}
                  className="p-2.5 bg-[#4E553D] hover:bg-[#3E452E] text-white rounded-xl shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: FAVORITES */}
      {activePill === 'favorites' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6 shadow-2xs">
          <div>
            <h3 className="text-xl font-bold font-serif text-stone-900">Seus Produtos Favoritos & Produtores Seguidos</h3>
            <p className="text-xs text-stone-500">Itens que você favoritou para recomprar com rapidez.</p>
          </div>

          {favoriteProducts.length === 0 ? (
            <div className="text-center py-12 text-stone-400 space-y-2">
              <Star className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs">Nenhum produto favoritado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favoriteProducts.map(p => (
                <div key={p.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.title} className="w-14 h-14 object-cover rounded-xl" />
                    <div>
                      <h5 className="font-bold text-xs text-stone-900">{p.title}</h5>
                      <p className="text-[10px] text-stone-500">{p.producerFarm}</p>
                      <p className="text-xs font-bold text-[#4E553D] mt-0.5">R$ {p.price.toFixed(2)} /{p.unit}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddToCart(p, 1)}
                    className="p-2.5 bg-[#4E553D] text-white rounded-xl"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: PROFILE */}
      {activePill === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6 shadow-2xs max-w-2xl mx-auto">
          <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#4E553D] text-white flex items-center justify-center text-xl font-bold font-serif">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold font-serif text-stone-900">{currentUser.name}</h3>
              <p className="text-xs text-stone-500">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase">
                  Consumidora Verificada
                </span>
                <span className="text-[11px] text-stone-500">Queimados, RJ</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
              <span className="text-stone-500">CPF Cadastrado:</span>
              <span className="font-bold text-stone-800">{currentUser.cpf}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
              <span className="text-stone-500">Endereço Principal:</span>
              <span className="font-bold text-stone-800">{currentAddress.address} • {currentAddress.neighborhood}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
              <span className="text-stone-500">Telefone / WhatsApp:</span>
              <span className="font-bold text-stone-800">{currentUser.phone}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenAddressModal}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors"
            >
              Gerenciar Endereços de Entrega
            </button>
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && stories[selectedStoryIndex] && (
        <StoryViewerModal
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
          currentUser={currentUser}
          onClose={() => setSelectedStoryIndex(null)}
          onStoryUpdated={loadStories}
        />
      )}

      {/* Story Post Modal for Producer */}
      {isPostStoryOpen && currentUser.producerId && (
        <StoryPostModal
          producer={producers.find(p => p.id === currentUser.producerId) || producers[0]}
          currentUser={currentUser}
          onClose={() => setIsPostStoryOpen(false)}
          onStoryPosted={loadStories}
        />
      )}

    </div>
  );
};
