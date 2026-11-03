import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Send, 
  Clock, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Sparkles,
  Share2
} from 'lucide-react';
import { ProducerStory, StoryComment, AppUser } from '../types';
import { StorageService } from '../services/storage';

interface StoryViewerModalProps {
  stories: ProducerStory[];
  initialStoryIndex?: number;
  currentUser: AppUser;
  onClose: () => void;
  onStoryUpdated?: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialStoryIndex = 0,
  currentUser,
  onClose,
  onStoryUpdated,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTimerRef = useRef<number | null>(null);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory) return;
    const isLiked = currentStory.likedByUsers?.includes(currentUser.id) || false;
    setLiked(isLiked);
    setLikesCount(currentStory.likesCount || 0);
    setProgress(0);
  }, [currentIndex, currentStory, currentUser.id]);

  // Calculate 24-hour remaining time
  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expirado';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Expira em ${hours}h ${mins}m`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, stories.length]);

  // Video progress and auto-advance
  useEffect(() => {
    if (!videoRef.current) return;
    
    const updateProgress = () => {
      if (videoRef.current && videoRef.current.duration) {
        const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(p);
      }
    };

    const handleEnded = () => {
      handleNext();
    };

    const video = videoRef.current;
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleLike = () => {
    if (!currentStory) return;
    const res = StorageService.likeStory(currentStory.id, currentUser.id);
    setLiked(res.liked);
    setLikesCount(res.count);
    if (res.liked) {
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 900);
    }
    onStoryUpdated?.();
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentStory) return;

    const newComment: StoryComment = {
      id: `com_${Date.now()}`,
      userName: currentUser.name || 'Consumidor de Queimados',
      userAvatar: currentUser.avatar,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    StorageService.addStoryComment(currentStory.id, newComment);
    currentStory.comments = currentStory.comments || [];
    currentStory.comments.push(newComment);
    setCommentText('');
    onStoryUpdated?.();
  };

  const handleDelete = () => {
    if (!currentStory) return;
    if (window.confirm('Deseja excluir este vídeo story?')) {
      StorageService.deleteStory(currentStory.id);
      onStoryUpdated?.();
      if (stories.length <= 1) {
        onClose();
      } else {
        handleNext();
      }
    }
  };

  if (!currentStory) return null;

  const isOwner = currentUser.producerId === currentStory.producerId || currentUser.role === 'admin';

  return (
    <div 
      id="story-viewer-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 select-none"
    >
      {/* Navigation Arrows for Desktop */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center backdrop-blur-sm z-30 transition-all cursor-pointer"
          title="Vídeo anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center backdrop-blur-sm z-30 transition-all cursor-pointer"
          title="Próximo vídeo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Story Container - Instagram Reel Aspect Ratio */}
      <div className="relative w-full h-full sm:h-[88vh] sm:max-h-[840px] sm:max-w-[420px] bg-stone-900 sm:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl border sm:border-stone-800">
        
        {/* Top Header Over Video */}
        <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent space-y-2.5">
          
          {/* Progress Bars for all stories */}
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div 
                key={s.id} 
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Producer Information & Countdown */}
          <div className="flex items-center justify-between gap-3 text-white pt-1">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.producerAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                alt={currentStory.producerName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 p-0.5 bg-emerald-700"
              />
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm drop-shadow-sm">{currentStory.producerFarm || currentStory.producerName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeRemaining(currentStory.expiresAt)}</span>
                </div>
              </div>
            </div>

            {/* Controls: Audio, Delete, Close */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                title={isMuted ? 'Ativar som' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="w-8 h-8 rounded-full bg-red-600/60 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                  title="Excluir vídeo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Video / Player Area */}
        <div 
          className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer"
          onClick={() => {
            if (videoRef.current) {
              if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
              } else {
                videoRef.current.play();
                setIsPlaying(true);
              }
            }
          }}
          onDoubleClick={handleLike}
        >
          <video
            ref={videoRef}
            src={currentStory.videoUrl}
            poster={currentStory.thumbnailUrl}
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover"
          />

          {/* Heart popping animation on double click or like */}
          {showHeartPop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-ping">
              <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-xl" />
            </div>
          )}

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-20">
              <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
                <span className="text-xl font-bold">❚❚</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Floating Actions (Instagram Reels style) */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
          
          {/* Like button */}
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-transform active:scale-125 cursor-pointer ${
                liked ? 'bg-red-500/90 text-white' : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
            </button>
            <span className="text-white text-[11px] font-bold mt-1 drop-shadow-md">
              {likesCount}
            </span>
          </div>

          {/* Comments button */}
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-transform active:scale-110 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <span className="text-white text-[11px] font-bold mt-1 drop-shadow-md">
              {currentStory.comments?.length || 0}
            </span>
          </div>

        </div>

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white space-y-2">
          {currentStory.tag && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
              {currentStory.tag}
            </span>
          )}

          <h3 className="font-bold text-sm leading-snug drop-shadow-sm">
            {currentStory.title}
          </h3>

          {currentStory.caption && (
            <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed drop-shadow-xs">
              {currentStory.caption}
            </p>
          )}

          {/* Quick Comment Input */}
          <form 
            onSubmit={handleSendComment}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              placeholder="Enviar comentário para o produtor..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-white/20 hover:bg-white/30 focus:bg-white/40 placeholder-stone-300 text-white text-xs px-3.5 py-2.5 rounded-full border border-white/20 backdrop-blur-md focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Sliding Comments Drawer */}
        {showComments && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 top-1/3 bg-stone-900/95 backdrop-blur-lg z-30 rounded-t-3xl p-4 flex flex-col justify-between border-t border-stone-700 animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Comentários ({currentStory.comments?.length || 0})
                </span>
              </div>
              <button 
                onClick={() => setShowComments(false)}
                className="p-1 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
              {(!currentStory.comments || currentStory.comments.length === 0) ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </div>
              ) : (
                currentStory.comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5 text-stone-200">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 overflow-hidden">
                      {c.userAvatar ? (
                        <img src={c.userAvatar} alt={c.userName} className="w-full h-full object-cover" />
                      ) : (
                        c.userName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 bg-stone-800/80 rounded-2xl p-2.5 border border-stone-700/60">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-300 text-[11px]">{c.userName}</span>
                        <span className="text-[9px] text-stone-400">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-stone-100 text-xs mt-0.5 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Form inside drawer */}
            <form onSubmit={handleSendComment} className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Escreva um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-stone-800 text-white placeholder-stone-400 text-xs px-3 py-2 rounded-xl border border-stone-700 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
