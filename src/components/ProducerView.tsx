import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  MessageSquare, 
  Settings, 
  Star, 
  MapPin, 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Truck, 
  User, 
  Send,
  Leaf,
  Video,
  Play,
  Heart,
  MessageCircle,
  Film,
  Upload
} from 'lucide-react';
import { Producer, Product, Order, ChatMessage, AppUser, ProducerStory } from '../types';
import { ProductFormModal } from './ProductFormModal';
import { StorageService } from '../services/storage';
import { StoryPostModal } from './StoryPostModal';
import { StoryViewerModal } from './StoryViewerModal';

interface ProducerViewProps {
  currentProducer: Producer;
  products: Product[];
  orders: Order[];
  chats: ChatMessage[];
  currentUser: AppUser;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onSendMessage: (msg: ChatMessage) => void;
  onSaveProducer: (producer: Producer) => void;
}

export const ProducerView: React.FC<ProducerViewProps> = ({
  currentProducer,
  products,
  orders,
  chats,
  currentUser,
  onSaveProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onSendMessage,
  onSaveProducer,
}) => {
  // Tabs matching Screenshot 2 + Stories
  const [activeTab, setActiveTab] = useState<'pedidos' | 'catalogo' | 'stories' | 'conversas' | 'propriedade'>('pedidos');

  // Stories state
  const [producerStories, setProducerStories] = useState<ProducerStory[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isPostStoryOpen, setIsPostStoryOpen] = useState(false);

  const loadStories = () => {
    setProducerStories(StorageService.getStoriesForProducer(currentProducer.id));
  };

  useEffect(() => {
    loadStories();
    const handleUpdate = () => loadStories();
    window.addEventListener('coneqta_stories_updated', handleUpdate);
    return () => {
      window.removeEventListener('coneqta_stories_updated', handleUpdate);
    };
  }, [currentProducer.id]);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Chat message input
  const [replyText, setReplyText] = useState('');

  // Filter orders relevant to this producer
  const producerOrders = orders.filter(
    o => o.producerIds.includes(currentProducer.id) || o.items.some(i => i.product.producerId === currentProducer.id)
  );

  // Filter products of this producer
  const producerProducts = products.filter(p => p.producerId === currentProducer.id);

  // Filter chats relevant to this producer
  const producerChats = chats.filter(
    c => c.recipientId === currentProducer.id || c.senderId === currentProducer.id
  );

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentProducer.id,
      senderName: currentProducer.name,
      senderRole: 'producer',
      recipientId: 'usr_mariana',
      text: replyText.trim(),
      timestamp: 'Agora mesmo',
    };

    onSendMessage(newMsg);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Panoramic Farm Hero Banner - Matching Screenshot 2 */}
      <div className="bg-stone-800 rounded-3xl overflow-hidden shadow-sm relative border border-stone-300">
        
        {/* Cover Photo */}
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src={currentProducer.coverImage}
            alt={currentProducer.farmName}
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Floating Farm Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white/80 shadow-md bg-stone-100 shrink-0">
              <img
                src={currentProducer.avatar}
                alt={currentProducer.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Farm Title & Location */}
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-[#FAF0CA] text-[#7A5A00] text-[9px] font-extrabold tracking-widest uppercase rounded-full">
                PAINEL DO PRODUTOR
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight leading-tight">
                {currentProducer.farmName}
              </h2>
              <p className="text-xs text-stone-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentProducer.location.address || currentProducer.location.neighborhood} • {currentProducer.location.city}, {currentProducer.location.state}</span>
              </p>
            </div>
          </div>

          {/* Rating Badge on right matching Screenshot 2 */}
          <div className="bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 flex items-center gap-2 self-start sm:self-auto">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div>
              <div className="text-xs font-bold text-white leading-none">
                {currentProducer.rating.toFixed(1)} / 5.0
              </div>
              <div className="text-[9px] text-stone-300 leading-none mt-0.5">
                {currentProducer.reviewCount} avaliação
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Navigation Tabs - Matching Screenshot 2 */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center min-w-max border-b border-stone-200/80">
          
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'pedidos'
                ? 'border-[#D35400] text-[#D35400] bg-orange-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Pedidos de Hoje ({producerOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalogo')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'catalogo'
                ? 'border-[#D35400] text-[#D35400] bg-orange-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catálogo de Produtos</span>
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'stories'
                ? 'border-[#D35400] text-[#D35400] bg-orange-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Video className="w-4 h-4 text-pink-600" />
            <span>Postar Vídeos (24h) ({producerStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('conversas')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'conversas'
                ? 'border-[#D35400] text-[#D35400] bg-orange-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Conversas</span>
          </button>

          <button
            onClick={() => setActiveTab('propriedade')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'propriedade'
                ? 'border-[#D35400] text-[#D35400] bg-orange-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Dados da Propriedade</span>
          </button>

        </div>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB: PEDIDOS DE HOJE */}
      {activeTab === 'pedidos' && (
        <div className="space-y-4">
          
          {/* Card: Controle de Produção e Logística matching Screenshot 2 */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs">
            <h3 className="font-bold text-stone-900 text-sm">Controle de Produção e Logística</h3>
            <p className="text-xs text-stone-500">
              Acompanhe novos pedidos recebidos da feira e mude o status para informar os consumidores.
            </p>
          </div>

          {/* Orders List or Empty State matching Screenshot 2 */}
          {producerOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6 stroke-1" />
              </div>
              <h4 className="font-bold text-stone-800 text-base">Nenhum pedido recebido por enquanto</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Quando os clientes fizerem pedidos na sua propriedade, eles aparecerão aqui!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {producerOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">Pedido #{order.id}</span>
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-full">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Cliente: <strong>{order.customerName}</strong> • {order.customerPhone}
                      </p>
                      <p className="text-xs text-stone-500">
                        📍 {order.customerAddress}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-stone-900">
                        R$ {order.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-bold uppercase">
                        Pago via {order.paymentMethod.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Itens do Pedido:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-800 bg-stone-50 p-2 rounded-xl">
                          <span className="w-5 h-5 rounded-md bg-stone-200 flex items-center justify-center font-bold text-[10px]">
                            {item.quantity}x
                          </span>
                          <span className="font-medium">{item.product.title}</span>
                          <span className="text-stone-400 text-[10px] ml-auto">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Updater */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                    <span className="text-[10px] font-bold uppercase text-stone-500">Alterar Status:</span>
                    {(['recebido', 'colhendo', 'embalado', 'em_transito', 'entregue'] as Order['status'][]).map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateOrderStatus(order.id, st)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          order.status === st
                            ? 'bg-[#D35400] text-white shadow-2xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {st.charAt(0).toUpperCase() + st.slice(1).replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB: CATÁLOGO DE PRODUTOS */}
      {activeTab === 'catalogo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Seus produtos cadastrados</h3>
              <p className="text-xs text-stone-500">Gerencie preços, estoques e produtos adicionados.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 bg-[#D35400] hover:bg-[#BA4A00] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Produto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {producerProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-3">
                  <img src={p.images[0]} alt={p.title} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-stone-900 truncate">{p.title}</h5>
                    <p className="text-[10px] text-stone-500 capitalize">{p.category}</p>
                    <p className="text-xs font-extrabold text-[#D35400] mt-1">R$ {p.price.toFixed(2)} /{p.unit}</p>
                    <p className="text-[10px] text-emerald-700 font-bold">Estoque: {p.stock} {p.unit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setIsProductModalOpen(true);
                    }}
                    className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: STORIES / VÍDEOS 24H */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 p-5 rounded-3xl border border-pink-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white flex items-center justify-center shadow-xs">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Vídeos Curtos & Stories (24h)</h3>
                <p className="text-xs text-stone-600">
                  Poste vídeos curtos direto do seu celular ou computador. Os vídeos ficam disponíveis para os moradores de Queimados por 24 horas.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPostStoryOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Postar Vídeo da Galeria</span>
            </button>
          </div>

          {producerStories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-6 space-y-3">
              <Film className="w-12 h-12 text-stone-300 mx-auto" />
              <h4 className="font-bold text-stone-800 text-base">Nenhum vídeo publicado nas últimas 24 horas</h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Anexe vídeos da biblioteca do seu celular ou computador para mostrar os produtos e o dia a dia da sua propriedade.
              </p>
              <button
                onClick={() => setIsPostStoryOpen(true)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Escolher Vídeo do Dispositivo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {producerStories.map((story, idx) => (
                <div
                  key={story.id}
                  onClick={() => setSelectedStoryIndex(idx)}
                  className="relative aspect-9/16 rounded-2xl overflow-hidden group cursor-pointer shadow-md bg-stone-900 border border-stone-800 transition-transform hover:scale-[1.02]"
                >
                  <img
                    src={story.thumbnailUrl || currentProducer.coverImage}
                    alt={story.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px]">
                    <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>24h</span>
                    </span>
                    <span className="bg-pink-600/90 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px]">
                      {story.tag || 'Ativo'}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-xs border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-pink-600 transition-all shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 inset-x-2.5 text-white">
                    <h5 className="font-bold text-xs line-clamp-1 leading-snug drop-shadow-sm">
                      {story.title}
                    </h5>
                    <div className="flex items-center justify-between text-[10px] text-stone-300 mt-1.5 pt-1.5 border-t border-white/15">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                        <span>{story.likesCount || 0}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-emerald-400" />
                        <span>{story.comments?.length || 0}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: CONVERSAS */}
      {activeTab === 'conversas' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4 max-w-3xl mx-auto">
          <div>
            <h3 className="font-bold text-stone-900 text-base font-serif">Canal Direto com Consumidores</h3>
            <p className="text-xs text-stone-500">Tire dúvidas sobre colheitas, lotes e entregas em Queimados.</p>
          </div>

          <div className="h-64 overflow-y-auto space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            {producerChats.map((c) => {
              const isMe = c.senderRole === 'producer';
              return (
                <div key={c.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs ${
                    isMe
                      ? 'bg-[#D35400] text-white rounded-br-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-2xs'
                  }`}>
                    <div className="font-bold text-[10px] opacity-80 mb-0.5">{c.senderName}</div>
                    <p>{c.text}</p>
                    <div className="text-[9px] opacity-60 text-right mt-1">{c.timestamp}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Responder consumidor de Queimados..."
              className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-hidden focus:border-[#D35400]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#D35400] hover:bg-[#BA4A00] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB: DADOS DA PROPRIEDADE */}
      {activeTab === 'propriedade' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs max-w-2xl mx-auto space-y-4">
          <h3 className="font-bold text-stone-900 text-base font-serif">Configurações da Propriedade</h3>
          
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-400 block uppercase text-[10px] font-bold">Nome da Fazenda / Sítio:</span>
              <span className="font-bold text-stone-800 text-sm">{currentProducer.farmName}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-400 block uppercase text-[10px] font-bold">Localização:</span>
              <span className="font-bold text-stone-800">{currentProducer.location.address} • {currentProducer.location.neighborhood}, Queimados - RJ</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-400 block uppercase text-[10px] font-bold">WhatsApp / Telefone:</span>
              <span className="font-bold text-stone-800">{currentProducer.phone}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-400 block uppercase text-[10px] font-bold">História da Família:</span>
              <p className="text-stone-700 mt-1 leading-relaxed">{currentProducer.story}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Product Add/Edit */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={onSaveProduct}
        currentProducer={currentProducer}
        productToEdit={editingProduct}
      />

      {/* Modal for Posting Story / Video */}
      {isPostStoryOpen && (
        <StoryPostModal
          producer={currentProducer}
          currentUser={currentUser}
          onClose={() => setIsPostStoryOpen(false)}
          onStoryPosted={() => {
            loadStories();
            setIsPostStoryOpen(false);
          }}
        />
      )}

      {/* Modal for Viewing Stories */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          stories={producerStories}
          initialStoryIndex={selectedStoryIndex}
          currentUser={currentUser}
          onClose={() => {
            setSelectedStoryIndex(null);
            loadStories();
          }}
        />
      )}

    </div>
  );
};
