import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, FolderOpen, Music } from 'lucide-react';

const MediaModule: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songName, setSongName] = useState('No Media Selected');
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current || !audioRef.current.src) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
      // Remove extension for cleaner display
      setSongName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = x / bounds.width;

    audioRef.current.currentTime = percentage * audioRef.current.duration;
    setProgress(percentage * 100);
  };

  return (
    <div className="absolute top-12 right-4 w-64 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-xl select-none z-40">
      <audio ref={audioRef} className="hidden" />
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-inner">
          <Music className="text-white" size={24} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-white text-sm font-semibold truncate">{songName}</h3>
          <p className="text-slate-400 text-xs truncate">Custom Local Player</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-6 px-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
          title="Open Audio File"
        >
          <FolderOpen size={20} />
        </button>

        <button
          onClick={handlePlayPause}
          className="text-slate-900 bg-white hover:bg-slate-200 transition-colors p-3 rounded-full shadow-lg"
        >
          {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="mt-4 h-2 w-full bg-slate-800 rounded-full overflow-hidden cursor-pointer"
        onClick={handleProgressBarClick}
      >
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-linear pointer-events-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default MediaModule;