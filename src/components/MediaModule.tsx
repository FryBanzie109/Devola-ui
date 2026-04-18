import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const MediaModule: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAction = async (action: string) => {
    try {
      await invoke('media_control', { action });
      if (action === 'play_pause') {
        setIsPlaying(!isPlaying);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="absolute top-12 right-4 w-64 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-xl select-none z-40">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-inner">
          <Music className="text-white" size={24} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-white text-sm font-semibold truncate">Weight of the World</h3>
          <p className="text-slate-400 text-xs truncate">Keiichi Okabe - NieR: Automata</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => handleAction('prev')}
          className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={() => handleAction('play_pause')}
          className="text-slate-900 bg-white hover:bg-slate-200 transition-colors p-3 rounded-full shadow-lg"
        >
          {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
        </button>

        <button
          onClick={() => handleAction('next')}
          className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Progress bar mock */}
      <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 w-1/3 rounded-full"></div>
      </div>
    </div>
  );
};

export default MediaModule;