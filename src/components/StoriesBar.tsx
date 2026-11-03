import React, { useState } from 'react';
import { Plus, Video, Sparkles, Clock, Play } from 'lucide-react';
import { ProducerStory, Producer, AppUser } from '../types';

interface StoriesBarProps {
  stories: ProducerStory[];
  currentUser: AppUser;
  onOpenStory: (index: number) => void;
  onOpenPostStory?: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onOpenStory,
  onOpenPostStory,
}) => {
  const isProducer = currentUser.role === 'producer' || !!currentUser.producerId;

  // Group stories by producer if needed or show direct stories
  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-stone-200/80 mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <Video className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span>Vídeos dos Empreendedores</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                24h
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Acompanhe colheitas, novidades e bastidores em tempo real
            </p>
          </div>
        </div>

        {isProducer && onOpenPostStory && (
          <button
            onClick={onOpenPostStory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Postar Vídeo</span>
          </button>
        )}
      </div>

      {/* Horizontal Stories Carousel */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        
        {/* If user is producer, show "+ Seu Story" bubble */}
        {isProducer && onOpenPostStory && (
          <div 
            onClick={onOpenPostStory}
            className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
          >
            <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center p-1 bg-emerald-50/50 group-hover:scale-105 transition-transform">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                alt="Seu Perfil"
                className="w-full h-full rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-stone-700 text-center max-w-[70px] truncate">
              Seu Vídeo
            </span>
          </div>
        )}

        {/* Stories list */}
        {stories.map((story, idx) => {
          return (
            <div
              key={story.id}
              onClick={() => onOpenStory(idx)}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
            >
              {/* Animated glowing gradient ring like Instagram */}
              <div className="relative w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-400 via-pink-500 to-emerald-500 group-hover:scale-105 transition-transform shadow-xs">
                <div className="w-full h-full bg-white rounded-full p-0.5 overflow-hidden">
                  <img
                    src={story.producerAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                    alt={story.producerName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-0.5 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[9px] shadow-xs">
                  <Play className="w-2.5 h-2.5 fill-white" />
                </div>
              </div>
              <div className="text-center max-w-[76px]">
                <span className="text-[11px] font-bold text-stone-800 block truncate">
                  {story.producerFarm || story.producerName}
                </span>
                <span className="text-[9px] text-emerald-700 font-medium block truncate">
                  {story.tag || '24h'}
                </span>
              </div>
            </div>
          );
        })}

        {stories.length === 0 && !isProducer && (
          <div className="py-2 text-stone-400 text-xs italic">
            Nenhum vídeo publicado nas últimas 24 horas.
          </div>
        )}

      </div>
    </div>
  );
};
