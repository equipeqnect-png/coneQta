import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Star, 
  Award, 
  Calendar, 
  Truck, 
  Plus, 
  Edit3, 
  Save, 
  Image as ImageIcon, 
  Package, 
  Info, 
  CheckCircle2, 
  Lock,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Video,
  Clock,
  Heart,
  Play,
  Send,
  ThumbsUp,
  ShieldCheck,
  Film
} from 'lucide-react';
import { Producer, Product, AppUser, ReviewItem, ProducerStory } from '../types';
import { StorageService } from '../services/storage';
import { StoryViewerModal } from './StoryViewerModal';
import { StoryPostModal } from './StoryPostModal';

interface EntrepreneurProfileModalProps {
  producer: Producer | null;
  products: Product[];
  currentUser: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveProducer: (updated: Producer) => void;
  onAddToCart?: (product: Product) => void;
  onOpenProductDetail?: (product: Product) => void;
}

export const EntrepreneurProfileModal: React.FC<EntrepreneurProfileModalProps> = ({
  producer,
  products,
  currentUser,
  isOpen,
  onClose,
  onSaveProducer,
  onAddToCart,
  onOpenProductDetail
}) => {
  if (!isOpen || !producer) return null;

  const [activeTab, setActiveTab] = useState<'descricao' | 'fotos' | 'catalogo' | 'avaliacoes' | 'stories'>('descricao');
  const [isEditing, setIsEditing] = useState(false);

  // Form State for editing
  const [farmName, setFarmName] = useState(producer.farmName);
  const [name, setName] = useState(producer.name);
  const [tagline, setTagline] = useState(producer.tagline);
  const [bio, setBio] = useState(producer.bio);
  const [story, setStory] = useState(producer.story);
  const [specialty, setSpecialty] = useState(producer.specialty);
  const [phone, setPhone] = useState(producer.phone);
  const [whatsapp, setWhatsapp] = useState(producer.whatsapp);
  const [neighborhood, setNeighborhood] = useState(producer.location.neighborhood || '');
  const [address, setAddress] = useState(producer.location.address || '');
  const [coverImage, setCoverImage] = useState(producer.coverImage);
  const [avatar, setAvatar] = useState(producer.avatar);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [photosList, setPhotosList] = useState<string[]>(producer.galleryImages || [producer.coverImage]);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Stories / 24h short videos state
  const [stories, setStories] = useState<ProducerStory[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isPostStoryModalOpen, setIsPostStoryModalOpen] = useState(false);

  // Check if current user is the owner
  const isOwner = !!currentUser && (currentUser.producerId === producer.id || currentUser.role === 'admin');

  const producerProducts = products.filter(p => p.producerId === producer.id);

  // Load reviews and stories
  const loadData = () => {
    const pReviews = StorageService.getReviewsForProducer(producer.id);
    setReviews(pReviews);
    const pStories = StorageService.getStoriesForProducer(producer.id);
    setStories(pStories);
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('coneqta_storage_updated', handleStorageUpdate);
    window.addEventListener('coneqta_reviews_updated', handleStorageUpdate);
    window.addEventListener('coneqta_stories_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('coneqta_storage_updated', handleStorageUpdate);
      window.removeEventListener('coneqta_reviews_updated', handleStorageUpdate);
      window.removeEventListener('coneqta_stories_updated', handleStorageUpdate);
    };
  }, [producer.id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Producer = {
      ...producer,
      farmName,
      name,
      tagline,
      bio,
      story,
      specialty,
      phone,
      whatsapp,
      coverImage,
      avatar,
      galleryImages: photosList,
      location: {
        ...producer.location,
        neighborhood,
        address,
      }
    };
    onSaveProducer(updated);
    setIsEditing(false);
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setPhotosList([...photosList, newPhotoUrl.trim()]);
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotosList(photosList.filter((_, i) => i !== idx));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    const review: ReviewItem = {
      id: `rev_${Date.now()}`,
      authorName: reviewerName.trim() || 'Morador de Queimados',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      producerId: producer.id,
      producerName: producer.farmName,
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      helpfulCount: 0
    };

    StorageService.addReview(review);
    setNewComment('');
    setIsSubmittingReview(false);
    loadData();
  };

  // Helper for 24h remaining
  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expirado';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m restantes`;
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : producer.rating.toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="entrepreneur-profile-modal"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-stone-200 flex flex-col max-h-[92vh]"
      >
        {/* Header Cover Banner */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-800 shrink-0">
          <img
            src={isEditing ? coverImage : producer.coverImage}
            alt={producer.farmName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent" />
          
          {/* Close button */}
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-stone-900/60 text-white flex items-center justify-center hover:bg-stone-900 transition-colors z-20 backdrop-blur-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Owner Edit Badge */}
          {isOwner && (
            <button
              id="toggle-edit-profile-btn"
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-3.5 left-3.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all z-20 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancelar Edição' : 'Editar Meu Perfil'}</span>
            </button>
          )}

          {/* Info overlaid at bottom of banner */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={isEditing ? avatar : producer.avatar}
                  alt={producer.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                {stories.length > 0 && (
                  <div 
                    onClick={() => setSelectedStoryIndex(0)}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-pink-600 border-2 border-white text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform"
                    title="Ver vídeos stories 24h deste comerciante"
                  >
                    <Play className="w-3 h-3 fill-white" />
                  </div>
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  Empreendimento Local • Queimados, RJ
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                  {producer.farmName}
                </h2>
                <p className="text-xs text-stone-200">{producer.name}</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('avaliacoes')}
              className="hidden sm:flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors"
            >
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{avgRating}</span>
              <span className="text-stone-300">({reviews.length} avaliações)</span>
            </div>
          </div>
        </div>

        {/* 5 Tabs Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50/80 px-2 sm:px-6 shrink-0 overflow-x-auto no-scrollbar">
          <button
            id="tab-btn-descricao"
            onClick={() => setActiveTab('descricao')}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'descricao'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Sobre a empresa</span>
          </button>

          <button
            id="tab-btn-fotos"
            onClick={() => setActiveTab('fotos')}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'fotos'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Fotos ({photosList.length})</span>
          </button>

          <button
            id="tab-btn-catalogo"
            onClick={() => setActiveTab('catalogo')}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'catalogo'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Produtos ({producerProducts.length})</span>
          </button>

          {/* TAB 4: AVALIAÇÕES E COMENTÁRIOS */}
          <button
            id="tab-btn-avaliacoes"
            onClick={() => setActiveTab('avaliacoes')}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'avaliacoes'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Avaliações & Comentários ({reviews.length})</span>
          </button>

          {/* TAB 5: STORIES / VÍDEOS 24H */}
          <button
            id="tab-btn-stories"
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'stories'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Video className="w-4 h-4 text-pink-600" />
            <span>Vídeos 24h ({stories.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
          {/* TAB 1: DESCRIÇÃO DA EMPRESA */}
          {activeTab === 'descricao' && (
            <div>
              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Você está editando o perfil. Todas as alterações serão salvas no banco de dados.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Nome da Empresa / Estabelecimento</label>
                      <input
                        type="text"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Nome do Empreendedor</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Slogan / Frase de Apresentação</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Sobre a Empresa (Biografia)</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nossa História</label>
                    <textarea
                      rows={3}
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Especialidade Principal</label>
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Bairro em Queimados</label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Endereço Completo</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp de Contato</label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Telefone / Fixo</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Alterações no Banco de Dados</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Bio & Story */}
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">Sobre a Empresa</h3>
                    <p className="text-stone-700 text-sm leading-relaxed mb-4">
                      {producer.bio}
                    </p>
                    {producer.story && (
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 mb-1">Nossa História</h4>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                          "{producer.story}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Especialidade</span>
                      <p className="text-sm font-bold text-stone-800">{producer.specialty}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Localização</span>
                      <p className="text-sm font-bold text-stone-800 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>{producer.location.neighborhood || 'Queimados'}, {producer.location.city} - {producer.location.state}</span>
                      </p>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {producer.whatsapp && (
                      <a
                        href={`https://wa.me/${producer.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Conversar no WhatsApp</span>
                      </a>
                    )}
                    {producer.phone && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 text-stone-800 text-sm font-medium border border-stone-200">
                        <Phone className="w-4 h-4 text-stone-600" />
                        <span>{producer.phone}</span>
                      </div>
                    )}
                  </div>

                  {!isOwner && (
                    <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-2">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Este perfil é gerenciado exclusivamente pelo empreendedor.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FOTOS */}
          {activeTab === 'fotos' && (
            <div className="space-y-6">
              {isOwner && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Adicionar Foto à Galeria</h4>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Cole o link da foto (URL)..."
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      className="flex-1 p-2 border border-emerald-300 rounded-xl text-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>
              )}

              {photosList.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-sm">
                  Nenhuma foto adicionada ainda.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {photosList.map((photo, idx) => (
                    <div key={idx} className="relative aspect-4/3 rounded-2xl overflow-hidden border border-stone-200 group bg-stone-100">
                      <img
                        src={photo}
                        alt={`Foto ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/80 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CATÁLOGO DOS PRODUTOS */}
          {activeTab === 'catalogo' && (
            <div>
              {producerProducts.length === 0 ? (
                <div className="text-center py-12 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <h4 className="font-bold text-stone-700 text-sm mb-1">Nenhum produto cadastrado ainda</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {isOwner 
                      ? 'Você pode cadastrar seus produtos e definir preços reais através do seu painel de empreendedor.' 
                      : 'O empreendedor ainda não cadastrou produtos para venda neste catálogo.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {producerProducts.map((prod) => (
                    <div 
                      key={prod.id}
                      className="p-3.5 rounded-2xl border border-stone-200 flex gap-3 hover:border-emerald-600 transition-colors bg-white shadow-2xs"
                    >
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                        alt={prod.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-100"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm">{prod.title}</h4>
                          <p className="text-xs text-stone-500 line-clamp-1">{prod.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-emerald-800 text-sm">
                            R$ {prod.price.toFixed(2)} <span className="text-[10px] font-normal text-stone-500">/ {prod.unit}</span>
                          </span>
                          {onAddToCart && (
                            <button
                              onClick={() => onAddToCart(prod)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Adicionar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AVALIAÇÕES E COMENTÁRIOS DOS CONSUMIDORES (Request 5) */}
          {activeTab === 'avaliacoes' && (
            <div className="space-y-6">
              
              {/* Reviews Summary Banner */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-600 flex flex-col items-center justify-center font-bold">
                    <span className="text-2xl font-black font-serif leading-none">{avgRating}</span>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-2.5 h-2.5 ${star <= Math.round(Number(avgRating)) ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-base">Avaliações da População de Queimados</h3>
                    <p className="text-xs text-stone-500">
                      {reviews.length} {reviews.length === 1 ? 'comentário e avaliação' : 'comentários e avaliações'} de clientes reais
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Comércio Local Verificado</span>
                </div>
              </div>

              {/* Form to leave a review */}
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <h4 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Deixar sua avaliação para este comerciante</span>
                </h4>

                <form onSubmit={handleAddReview} className="space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Star Rating Selector */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Sua Nota (1 a 5 estrelas):
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-1 hover:scale-125 transition-transform cursor-pointer"
                          >
                            <Star 
                              className={`w-6 h-6 ${
                                star <= newRating 
                                  ? 'text-amber-400 fill-amber-400' 
                                  : 'text-stone-300 hover:text-amber-200'
                              }`} 
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-stone-700 ml-2">
                          {newRating === 5 ? 'Excelente (5 estrelas)' : `${newRating} estrela${newRating > 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </div>

                    {/* Reviewer Name */}
                    <div className="w-full sm:w-64">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Seu Nome:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Ana Clara"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Comment Text */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Seu Comentário / Experiência:
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Conte como foi sua experiência com os produtos, atendimento e pontualidade..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingReview || !newComment.trim()}
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar Avaliação</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-800 text-sm">
                  Comentários dos Clientes ({reviews.length})
                </h4>

                {reviews.length === 0 ? (
                  <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200 text-stone-400 text-xs">
                    Nenhum comentário publicado ainda. Seja o primeiro a avaliar!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div 
                      key={rev.id}
                      className="p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-stone-300 transition-colors shadow-2xs space-y-2"
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
                              <span className="text-[10px] text-stone-400 ml-1">
                                {rev.date}
                              </span>
                            </div>
                          </div>
                        </div>

                        {rev.verifiedPurchase && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Comprador em Queimados</span>
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

          {/* TAB 5: STORIES / VÍDEOS CURTOS 24H (Request 6) */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              
              <div className="p-4 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 rounded-2xl border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <span>Vídeos Curtos & Stories (24 Horas)</span>
                      <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">
                        Formato Instagram
                      </span>
                    </h4>
                    <p className="text-xs text-stone-600">
                      Vídeos rápidos com duração de 24 horas para mostrar colheitas, novidades e bastidores.
                    </p>
                  </div>
                </div>

                {isOwner && (
                  <button
                    onClick={() => setIsPostStoryModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Postar Novo Vídeo (24h)</span>
                  </button>
                )}
              </div>

              {/* Stories Cards Grid */}
              {stories.length === 0 ? (
                <div className="text-center py-12 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  <Film className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <h4 className="font-bold text-stone-700 text-sm mb-1">Nenhum vídeo publicado nas últimas 24h</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                    {isOwner 
                      ? 'Grave ou publique um vídeo rápido para mostrar aos seus clientes de Queimados o que há de novo hoje!' 
                      : 'O produtor ainda não postou vídeos nas últimas 24 horas. Volte em breve!'}
                  </p>
                  {isOwner && (
                    <button
                      onClick={() => setIsPostStoryModalOpen(true)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Postar Primeiro Vídeo</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {stories.map((story, idx) => (
                    <div
                      key={story.id}
                      onClick={() => setSelectedStoryIndex(idx)}
                      className="relative aspect-9/16 rounded-2xl overflow-hidden group cursor-pointer shadow-md bg-stone-900 border border-stone-800 transition-transform hover:scale-[1.02]"
                    >
                      {/* Video Poster Image / Thumbnail */}
                      <img
                        src={story.thumbnailUrl || producer.coverImage}
                        alt={story.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

                      {/* Top Expiration Badge */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px]">
                        <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{getTimeRemaining(story.expiresAt)}</span>
                        </span>
                        {story.tag && (
                          <span className="bg-pink-600/80 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px]">
                            {story.tag}
                          </span>
                        )}
                      </div>

                      {/* Play Button Icon in Center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-xs border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-pink-600 transition-all shadow-lg">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>

                      {/* Bottom Title & Stats */}
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

        </div>
      </div>

      {/* Full Screen / Vertical Story Viewer */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
          currentUser={currentUser || {
            id: 'guest',
            name: 'Visitante de Queimados',
            email: '',
            role: 'consumer',
            phone: '',
            createdAt: ''
          }}
          onClose={() => setSelectedStoryIndex(null)}
          onStoryUpdated={loadData}
        />
      )}

      {/* Post Story Modal */}
      {isPostStoryModalOpen && (
        <StoryPostModal
          producer={producer}
          currentUser={currentUser || {
            id: 'guest',
            name: 'Visitante',
            email: '',
            role: 'producer',
            phone: '',
            createdAt: ''
          }}
          onClose={() => setIsPostStoryModalOpen(false)}
          onStoryPosted={loadData}
        />
      )}
    </div>
  );
};
