import React, { useState, useRef } from 'react';
import { 
  X, 
  Video, 
  Clock, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Film,
  AlertCircle,
  Play,
  Pause,
  FolderOpen,
  Camera,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Producer, ProducerStory, AppUser } from '../types';
import { StorageService } from '../services/storage';

interface StoryPostModalProps {
  producer: Producer;
  currentUser: AppUser;
  onClose: () => void;
  onStoryPosted: () => void;
}

const SAMPLE_VIDEOS = [
  {
    title: 'Hortaliças & Verduras',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-farmer-harvesting-lettuce-in-a-greenhouse-41584-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    tag: 'Produtos Frescos'
  },
  {
    title: 'Preparo Artesanal',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-baker-kneading-dough-42289-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    tag: 'Quitutes'
  },
  {
    title: 'Feira & Mercado',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-a-farmers-market-42571-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    tag: 'Feira Local'
  },
  {
    title: 'Cultivo & Plantio',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-cutting-roses-in-a-flower-shop-41883-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    tag: 'Produção Local'
  }
];

export const StoryPostModal: React.FC<StoryPostModalProps> = ({
  producer,
  currentUser,
  onClose,
  onStoryPosted,
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [attachedFileSize, setAttachedFileSize] = useState('');
  const [tag, setTag] = useState('Produtos Frescos');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState<'device' | 'sample' | 'url'>('device');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // Handle local video file attachment from device gallery / camera
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate video type
    if (!file.type.startsWith('video/')) {
      alert('Por favor, selecione um arquivo de vídeo válido (.mp4, .mov, .webm, etc).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    setAttachedFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setAttachedFileSize(`${sizeMb} MB`);

    // Auto generate title if empty
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    // Try to capture snapshot frame for thumbnail
    try {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = objectUrl;
      tempVideo.muted = true;
      tempVideo.playsInline = true;
      tempVideo.onloadeddata = () => {
        tempVideo.currentTime = 0.5;
      };
      tempVideo.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = tempVideo.videoWidth || 480;
          canvas.height = tempVideo.videoHeight || 854;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
            const thumbData = canvas.toDataURL('image/jpeg', 0.8);
            setThumbnailUrl(thumbData);
          }
        } catch {
          // fallback to producer avatar or cover
          if (!thumbnailUrl) {
            setThumbnailUrl(producer.coverImage || producer.avatar);
          }
        }
      };
    } catch {
      if (!thumbnailUrl) {
        setThumbnailUrl(producer.coverImage || producer.avatar);
      }
    }
  };

  // Handle custom thumbnail file from device photos
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbnailUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_VIDEOS[0]) => {
    setVideoUrl(sample.url);
    setThumbnailUrl(sample.thumbnail);
    setAttachedFileName(`${sample.title}.mp4`);
    setAttachedFileSize('Exemplo');
    if (!title) setTitle(sample.title);
  };

  const togglePreviewPlay = () => {
    if (videoPreviewRef.current) {
      if (videoPreviewRef.current.paused) {
        videoPreviewRef.current.play();
        setIsPlayingPreview(true);
      } else {
        videoPreviewRef.current.pause();
        setIsPlayingPreview(false);
      }
    }
  };

  const handleRemoveAttachedVideo = () => {
    setVideoUrl('');
    setThumbnailUrl('');
    setAttachedFileName('');
    setAttachedFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor, digite um título para o vídeo.');
      return;
    }
    if (!videoUrl.trim()) {
      alert('Por favor, anexe um arquivo de vídeo do seu celular/computador ou selecione uma opção.');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newStory: ProducerStory = {
      id: `story_${Date.now()}`,
      producerId: producer.id,
      producerName: producer.name,
      producerFarm: producer.farmName,
      producerAvatar: producer.avatar,
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || producer.coverImage || producer.avatar,
      title: title.trim(),
      caption: caption.trim(),
      createdAt: now.toISOString(),
      expiresAt: expiresAt,
      likesCount: 0,
      likedByUsers: [],
      comments: [],
      viewsCount: 1,
      tag: tag || 'Produtos Frescos'
    };

    StorageService.saveStory(newStory);
    setIsSubmitting(false);
    onStoryPosted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
              <Film className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Publicar Vídeo Curto (Story 24h)</h3>
              <p className="text-[11px] text-emerald-200">{producer.farmName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 24-Hour Notice Banner */}
        <div className="bg-amber-50 p-3 sm:px-5 border-b border-amber-200 flex items-center gap-2.5 text-xs text-amber-900 shrink-0">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Duração de 24 Horas:</strong> O vídeo ficará disponível para os moradores de Queimados por 24 horas antes de expirar automaticamente.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Source Tabs: Galeria do Dispositivo vs Exemplos */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Origem do Vídeo
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-2xl border border-stone-200">
              <button
                type="button"
                onClick={() => setUploadMode('device')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  uploadMode === 'device'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Meu Dispositivo</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('sample')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  uploadMode === 'sample'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modelos Prontos</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  uploadMode === 'url'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Link Direto</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Local Device Gallery / Camera File Picker */}
          {uploadMode === 'device' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/m4v,video/*"
                onChange={handleVideoFileChange}
                className="hidden"
                id="story-video-file-input"
              />

              {!videoUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-500/60 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-600 rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-sm">
                      Anexar vídeo da galeria do seu celular ou computador
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Toque para abrir a biblioteca de mídia (.mp4, .mov, .webm)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Celular ou PC
                    </span>
                    <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                      Até 24h de visibilidade
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-900 rounded-2xl p-3 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold truncate max-w-[200px] sm:max-w-[300px]">
                        {attachedFileName || 'Vídeo Anexado'}
                      </span>
                      {attachedFileSize && (
                        <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-md text-stone-300">
                          {attachedFileSize}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveAttachedVideo}
                      className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-red-400 transition-colors"
                      title="Remover vídeo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Video preview element */}
                  <div className="relative aspect-16/9 bg-black rounded-xl overflow-hidden flex items-center justify-center">
                    <video
                      ref={videoPreviewRef}
                      src={videoUrl}
                      className="w-full h-full object-contain"
                      playsInline
                      onEnded={() => setIsPlayingPreview(false)}
                    />
                    <button
                      type="button"
                      onClick={togglePreviewPlay}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 transition-transform active:scale-95"
                    >
                      {isPlayingPreview ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-300 pt-1">
                    <span>Vídeo pronto para publicação</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-emerald-400 hover:underline font-semibold"
                    >
                      Trocar arquivo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Sample clips */}
          {uploadMode === 'sample' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Escolha um vídeo de exemplo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_VIDEOS.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      videoUrl === sample.url
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <img
                      src={sample.thumbnail}
                      alt={sample.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs truncate">{sample.title}</p>
                      <span className="text-[10px] text-stone-500">{sample.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode 3: Direct URL */}
          {uploadMode === 'url' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Link do Vídeo (.mp4 / .webm)
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com/meu-video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          )}

          {/* Video Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Título do Vídeo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Produtos frescos chegando hoje!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-xl text-sm focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Descrição / Mensagem para os Clientes
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Confiram nossos produtos disponíveis. Peça diretamente ou venha nos visitar!"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-xl text-sm focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Tag / Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Categoria do Vídeo
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-xl text-xs bg-white focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="Produtos Frescos">🥬 Produtos Frescos</option>
                <option value="Quitutes Artesanais">🥖 Quitutes Artesanais</option>
                <option value="Novidades da Semana">✨ Novidades da Semana</option>
                <option value="Bastidores da Produção">🌱 Bastidores da Produção</option>
                <option value="Oferta Relâmpago">⚡ Oferta Relâmpago</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Capa do Vídeo (Opcional)
              </label>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="hidden"
                id="story-thumb-file-input"
              />
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-full p-2.5 border border-stone-300 hover:bg-stone-50 rounded-xl text-xs text-stone-700 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <ImageIcon className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span className="truncate">{thumbnailUrl ? 'Capa selecionada' : 'Escolher foto de capa'}</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Alterar</span>
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !videoUrl.trim()}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Publicar Vídeo (24h)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
