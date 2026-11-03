import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Truck, 
  HelpCircle, 
  ChefHat, 
  Calculator,
  Leaf,
  Layers,
  MapPin,
  Video,
  Star,
  MessageSquare,
  Play,
  Heart,
  MessageCircle,
  Film,
  Upload
} from 'lucide-react';
import { Producer, Product, Order, Category, Certification, ProducerStory, ReviewItem } from '../types';
import { askCampoConeQtaAI } from '../services/geminiService';
import { StorageService } from '../services/storage';
import { StoryViewerModal } from './StoryViewerModal';
import { StoryPostModal } from './StoryPostModal';

interface ProducerDashboardProps {
  producers: Producer[];
  products: Product[];
  orders: Order[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onSaveProducer: (producer: Producer) => void;
}

export const ProducerDashboard: React.FC<ProducerDashboardProps> = ({
  producers,
  products,
  orders,
  onSaveProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onSaveProducer,
}) => {
  // Current active producer workspace
  const [selectedProducerId, setSelectedProducerId] = useState<string>(producers[0]?.id || 'prod_1');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stories' | 'reviews' | 'ai_tools'>('products');

  // Stories & Reviews state
  const [stories, setStories] = useState<ProducerStory[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isPostStoryModalOpen, setIsPostStoryModalOpen] = useState(false);

  const loadProducerData = () => {
    setStories(StorageService.getStoriesForProducer(selectedProducerId));
    setReviews(StorageService.getReviewsForProducer(selectedProducerId));
  };

  useEffect(() => {
    loadProducerData();
    const handleUpdate = () => loadProducerData();
    window.addEventListener('coneqta_stories_updated', handleUpdate);
    window.addEventListener('coneqta_reviews_updated', handleUpdate);
    return () => {
      window.removeEventListener('coneqta_stories_updated', handleUpdate);
      window.removeEventListener('coneqta_reviews_updated', handleUpdate);
    };
  }, [selectedProducerId]);

  // Product modal form state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('10.00');
  const [unit, setUnit] = useState('kg');
  const [category, setCategory] = useState<Category>('hortifruti');
  const [stock, setStock] = useState('30');
  const [harvestDate, setHarvestDate] = useState('Hoje às 06:00h');
  const [imageUrl, setImageUrl] = useState('');
  const [isOrganic, setIsOrganic] = useState(true);
  const [storageTips, setStorageTips] = useState('');

  // AI Tools states
  const [aiStoryInput, setAiStoryInput] = useState('');
  const [aiStoryOutput, setAiStoryOutput] = useState('');
  const [aiStoryLoading, setAiStoryLoading] = useState(false);

  const [aiPricingCrop, setAiPricingCrop] = useState('Tomate Italiano Orgânico');
  const [aiPricingCosts, setAiPricingCosts] = useState('R$ 3,50 por kg com adubação e mão de obra');
  const [aiPricingOutput, setAiPricingOutput] = useState('');
  const [aiPricingLoading, setAiPricingLoading] = useState(false);

  const currentProducer = producers.find((p) => p.id === selectedProducerId) || producers[0];
  const myProducts = products.filter((p) => p.producerId === currentProducer.id);
  const myOrders = orders.filter((o) => o.producerIds?.includes(currentProducer.id) || o.producerIds?.length === 0);

  // Financial summary
  const totalSales = myOrders.reduce((sum, o) => sum + (o.status === 'entregue' ? o.totalAmount : o.totalAmount * 0.8), 0);
  const pendingOrders = myOrders.filter((o) => o.status !== 'entregue');

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setPrice('9.50');
    setUnit('kg');
    setCategory('hortifruti');
    setStock('25');
    setHarvestDate('Hoje pela manhã');
    setImageUrl('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
    setIsOrganic(true);
    setStorageTips('Manter em local seco e fresco.');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setUnit(prod.unit);
    setCategory(prod.category);
    setStock(prod.stock.toString());
    setHarvestDate(prod.harvestDate);
    setImageUrl(prod.images[0] || '');
    setIsOrganic(prod.organic);
    setStorageTips(prod.storageTips || '');
    setShowProductModal(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
      producerId: currentProducer.id,
      producerName: currentProducer.name,
      producerFarm: currentProducer.farmName,
      producerDistanceKm: currentProducer.location.distanceKm,
      title,
      description,
      price: parseFloat(price) || 0,
      unit,
      category,
      images: [imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'],
      stock: parseInt(stock, 10) || 0,
      harvestDate,
      organic: isOrganic,
      certifications: isOrganic ? ['organico', 'familiar', 'sem_agrotoxico'] : ['familiar', 'artesanal'],
      nutritionHighlights: ['Alimento Fresco da Roça', isOrganic ? '100% Sem Agrotóxicos' : 'Artesanal'],
      freshnessScore: 10,
      storageTips,
    };

    onSaveProduct(productToSave);
    setShowProductModal(false);
  };

  const handleGenerateStory = async () => {
    setAiStoryLoading(true);
    setAiStoryOutput('');
    try {
      const result = await askCampoConeQtaAI({
        action: 'producer_story',
        prompt: `Crie um texto comovente e profissional para o perfil do produtor rural "${currentProducer.name}" da propriedade "${currentProducer.farmName}" localizada em ${currentProducer.location.city}. Notas fornecidas pelo agricultor: ${aiStoryInput || 'Cultivamos com muito amor, respeitando a terra e a saúde das pessoas há anos.'}`,
        context: {
          producer: currentProducer,
        }
      });
      setAiStoryOutput(result);
    } catch {
      setAiStoryOutput('Erro ao gerar história. Tente novamente.');
    } finally {
      setAiStoryLoading(false);
    }
  };

  const handleApplyGeneratedStory = () => {
    if (!aiStoryOutput) return;
    const cleanStory = aiStoryOutput.replace(/###|\*|#/g, '').trim();
    onSaveProducer({
      ...currentProducer,
      story: cleanStory,
    });
    alert('História atualizada no seu perfil público com sucesso!');
  };

  const handleCalculatePricing = async () => {
    setAiPricingLoading(true);
    setAiPricingOutput('');
    try {
      const result = await askCampoConeQtaAI({
        action: 'pricing_advisor',
        prompt: `Como pequeno produtor rural, preciso precificar o alimento: "${aiPricingCrop}". Custos informados: "${aiPricingCosts}". Apresente uma análise de custos e preço sugerido por unidade/kg no CampoConeQta para garantir lucro digno sem intermediários.`,
      });
      setAiPricingOutput(result);
    } catch {
      setAiPricingOutput('Erro ao calcular precificação.');
    } finally {
      setAiPricingLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Farm Selector */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-2">
            <Sprout className="w-3.5 h-3.5" />
            <span>Painel de Gestão do Produtor Rural</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            {currentProducer.farmName}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200">
            {currentProducer.name} • {currentProducer.location.city} / {currentProducer.location.state}
          </p>
        </div>

        {/* Switch producer workspace */}
        <div className="flex items-center gap-2 bg-emerald-950/60 p-2 rounded-2xl border border-emerald-800">
          <span className="text-xs text-emerald-300 font-medium">Trocar Sítio:</span>
          <select
            value={selectedProducerId}
            onChange={(e) => setSelectedProducerId(e.target.value)}
            className="bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-700 focus:outline-none"
          >
            {producers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.farmName} ({p.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-stone-400 uppercase block">Vendas Diretas</span>
          <span className="text-xl sm:text-2xl font-black text-stone-900">
            R$ {totalSales.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[10px] text-emerald-700 block mt-1">100% repasse sem taxa abusiva</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-stone-400 uppercase block">Pedidos a Colher</span>
          <span className="text-xl sm:text-2xl font-black text-stone-900">{pendingOrders.length}</span>
          <span className="text-[10px] text-amber-700 block mt-1">Colheita sob demanda</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-stone-400 uppercase block">Produtos Ativos</span>
          <span className="text-xl sm:text-2xl font-black text-stone-900">{myProducts.length}</span>
          <span className="text-[10px] text-teal-700 block mt-1">Visíveis na feira digital</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-stone-400 uppercase block">Avaliação Média</span>
          <span className="text-xl sm:text-2xl font-black text-stone-900">
            {currentProducer.rating.toFixed(1)} ⭐
          </span>
          <span className="text-[10px] text-purple-700 block mt-1">{currentProducer.reviewCount} clientes satisfeitos</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'products' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          📦 Minha Colheita & Estoque ({myProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all relative ${
            activeTab === 'orders' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          📋 Pedidos dos Clientes ({myOrders.length})
          {pendingOrders.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-amber-400 text-stone-950 rounded-full text-[10px]">
              {pendingOrders.length} novos
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('stories')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'stories' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-pink-500" />
          <span>Vídeos Curtos 24h ({stories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'reviews' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span>Avaliações dos Clientes ({reviews.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('ai_tools')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'ai_tools' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Ferramentas Inteligentes (IA)</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-serif">Seus produtos cadastrados</h3>
              <p className="text-xs text-stone-500">Gerencie preços, estoques e produtos adicionados.</p>
            </div>
            <button
              onClick={handleOpenNewProduct}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all hover:scale-105 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Produto</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-stone-100">
              {myProducts.length === 0 ? (
                <div className="p-8 text-center text-stone-500 text-xs">
                  Você ainda não cadastrou produtos para este sítio. Clique no botão acima para adicionar!
                </div>
              ) : (
                myProducts.map((prod) => (
                  <div key={prod.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-stone-900">{prod.title}</h4>
                          {prod.organic && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                              Orgânico
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-1">{prod.description}</p>
                        <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                          <span>Colheita: <strong>{prod.harvestDate}</strong></span>
                          <span>•</span>
                          <span className={prod.stock <= 10 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-semibold'}>
                            Estoque: {prod.stock} {prod.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-900 block">
                          R$ {prod.price.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-[10px] text-stone-400">por {prod.unit}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-2 rounded-xl text-stone-600 hover:bg-stone-200 transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja remover ${prod.title}?`)) {
                              onDeleteProduct(prod.id);
                            }
                          }}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-stone-900 font-serif">Pedidos Recebidos do Campo</h3>
          
          <div className="space-y-3">
            {myOrders.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-stone-200 text-center text-stone-500 text-xs">
                Nenhum pedido registrado no momento.
              </div>
            ) : (
              myOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 font-mono">{order.id}</span>
                        <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                          order.status === 'entregue' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'colhendo' ? 'bg-amber-100 text-amber-900 animate-pulse' :
                          order.status === 'em_transito' ? 'bg-blue-100 text-blue-900' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Cliente: <strong>{order.customerName}</strong> ({order.customerPhone}) • {order.customerAddress}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-900 block">
                        R$ {order.totalAmount.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {order.deliveryType === 'delivery' ? 'Entrega em domicílio' : 'Retirada no sítio'}
                      </span>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="space-y-1.5 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-stone-700">
                        <span>{item.quantity}x {item.product.title}</span>
                        <span className="font-medium">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 text-xs">
                    <span className="text-stone-400 text-[11px]">Atualizar etapa da colheita:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(['recebido', 'colhendo', 'embalado', 'em_transito', 'entregue'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => onUpdateOrderStatus(order.id, st)}
                          className={`px-2.5 py-1 rounded-xl text-xs capitalize font-semibold transition-all ${
                            order.status === st
                              ? 'bg-emerald-800 text-white shadow-2xs'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STORIES & SHORT VIDEOS (24H) */}
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
                  Mostre a colheita do dia, o preparo de produtos ou bastidores. Os vídeos expiram automaticamente em 24h.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPostStoryModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Postar Vídeo da Galeria</span>
            </button>
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-6 space-y-3">
              <Film className="w-12 h-12 text-stone-300 mx-auto mb-1" />
              <h4 className="font-bold text-stone-800 text-base">Nenhum vídeo ativo nas últimas 24 horas</h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Anexe vídeos da biblioteca do seu celular ou computador para mostrar os produtos e o dia a dia da sua propriedade para os clientes de Queimados.
              </p>
              <button
                onClick={() => setIsPostStoryModalOpen(true)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Escolher Vídeo do Dispositivo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {stories.map((story, idx) => (
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
                        <span>{story.likesCount || 0} curtidas</span>
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

      {/* TAB 4: REVIEWS & COMMENTS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex flex-col items-center justify-center font-bold">
                <span className="text-2xl font-black font-serif">{currentProducer.rating.toFixed(1)}</span>
                <div className="flex items-center mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Satisfação dos Moradores de Queimados</h3>
                <p className="text-xs text-stone-500">
                  {reviews.length} {reviews.length === 1 ? 'avaliação registrada' : 'avaliações registradas'}
                </p>
              </div>
            </div>

            <div className="text-xs text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Empreendimento com Excelente Reputação</span>
            </div>
          </div>

          {/* List of Reviews */}
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 text-stone-400 text-xs">
                Nenhum comentário recebido ainda.
              </div>
            ) : (
              reviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.authorAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'}
                        alt={rev.authorName}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover bg-emerald-700"
                      />
                      <div>
                        <span className="font-bold text-stone-900 text-xs block">{rev.authorName}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3 h-3 ${s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} 
                            />
                          ))}
                          <span className="text-[10px] text-stone-400 ml-1">{rev.date}</span>
                        </div>
                      </div>
                    </div>

                    {rev.verifiedPurchase && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Compra Verificada
                      </span>
                    )}
                  </div>
                  <p className="text-stone-700 text-xs leading-relaxed pt-1">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: AI INTELLIGENT TOOLS */}
      {activeTab === 'ai_tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tool 1: Story generator */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ChefHat className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 font-serif">Gerador de História do Sítio (IA)</h4>
                <p className="text-[11px] text-stone-500">Conecte emocionalmente seu trabalho aos clientes da cidade</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Fatos rápidos sobre sua terra ou família:
              </label>
              <textarea
                value={aiStoryInput}
                onChange={(e) => setAiStoryInput(e.target.value)}
                placeholder="Ex: Começamos há 15 anos com meus pais. Usamos esterco curtido e irrigação com nascente. Nossos filhos ajudam na colheita da uva e do tomate..."
                rows={3}
                className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerateStory}
              disabled={aiStoryLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{aiStoryLoading ? 'Criando narrativa com IA...' : 'Gerar História da Propriedade'}</span>
            </button>

            {aiStoryOutput && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-stone-700 space-y-3">
                <div className="whitespace-pre-line leading-relaxed italic">{aiStoryOutput}</div>
                <button
                  onClick={handleApplyGeneratedStory}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 rounded-xl text-xs shadow-xs"
                >
                  Salvar Esta História no Meu Perfil Público
                </button>
              </div>
            )}
          </div>

          {/* Tool 2: Fair Pricing Calculator */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 font-serif">Calculadora de Precificação Justa</h4>
                <p className="text-[11px] text-stone-500">Valorize seu trabalho e cubra todos os custos reais</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Qual alimento deseja precificar?</label>
              <input
                type="text"
                value={aiPricingCrop}
                onChange={(e) => setAiPricingCrop(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Custos e mão de obra estimada:</label>
              <input
                type="text"
                value={aiPricingCosts}
                onChange={(e) => setAiPricingCosts(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <button
              onClick={handleCalculatePricing}
              disabled={aiPricingLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>{aiPricingLoading ? 'Calculando margem justa...' : 'Calcular Preço Recomendado'}</span>
            </button>

            {aiPricingOutput && (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-700 space-y-2 max-h-48 overflow-y-auto">
                <div className="whitespace-pre-line leading-relaxed">{aiPricingOutput}</div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* PRODUCT CREATE/EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h3 className="text-lg font-bold font-serif text-stone-900">
                {editingProduct ? 'Editar Colheita' : 'Cadastrar Novo Alimento'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-stone-400 hover:text-stone-600 text-xl font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Título do Produto</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Tomate Italiano de Rama Orgânico"
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Preço Direto (R$)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Unidade de Venda</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="kg">kg (Quilo)</option>
                    <option value="maço">Maço</option>
                    <option value="dúzia">Dúzia</option>
                    <option value="un">Unidade</option>
                    <option value="pote 500g">Pote 500g</option>
                    <option value="peça ~550g">Peça ~550g</option>
                    <option value="caixa 300g">Caixa 300g</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="hortifruti">Hortifrúti</option>
                    <option value="queijos_laticinios">Queijos & Laticínios</option>
                    <option value="ovos_aves">Ovos & Aves</option>
                    <option value="mel_doces">Mel & Doces</option>
                    <option value="graos_farinhas">Grãos & Farinhas</option>
                    <option value="carnes_artesanais">Carnes Artesanais</option>
                    <option value="cafe_bebidas">Café da Roça</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Qtd em Estoque</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Momento da Colheita</label>
                <input
                  type="text"
                  required
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  placeholder="Ex: Hoje às 05:30h / Colhido na manhã"
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Foto do Produto (URL)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Descrição & Sabor</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Conte um pouco sobre como foi cultivado, sabor e textura..."
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="organic_check"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-emerald-700"
                />
                <label htmlFor="organic_check" className="font-semibold text-emerald-900 cursor-pointer">
                  Certificação 100% Orgânico / Agroecológico
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Salvar Colheita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && stories[selectedStoryIndex] && (
        <StoryViewerModal
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
          currentUser={{
            id: currentProducer.id,
            name: currentProducer.name,
            email: currentProducer.email || '',
            role: 'producer',
            producerId: currentProducer.id,
            avatar: currentProducer.avatar,
            phone: currentProducer.phone || '',
            createdAt: ''
          }}
          onClose={() => setSelectedStoryIndex(null)}
          onStoryUpdated={loadProducerData}
        />
      )}

      {/* Story Post Modal */}
      {isPostStoryModalOpen && (
        <StoryPostModal
          producer={currentProducer}
          currentUser={{
            id: currentProducer.id,
            name: currentProducer.name,
            email: currentProducer.email || '',
            role: 'producer',
            producerId: currentProducer.id,
            avatar: currentProducer.avatar,
            phone: currentProducer.phone || '',
            createdAt: ''
          }}
          onClose={() => setIsPostStoryModalOpen(false)}
          onStoryPosted={loadProducerData}
        />
      )}

    </div>
  );
};
