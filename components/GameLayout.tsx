import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { BACKGROUND_MUSIC_URL } from '../constants';

interface Props {
  children: React.ReactNode;
}

const GameLayout: React.FC<Props> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Setup audio loop
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3; // Low background volume
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
    setIsPlaying(!isPlaying);
    setHasInteracted(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black opacity-90"></div>
        {/* Animated stars/particles could go here */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        {children}
      </main>

      {/* Music Control */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={toggleMusic}
          className="p-3 rounded-full glass-panel hover:bg-slate-700 transition-colors text-amber-400 shadow-lg shadow-amber-900/20"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={BACKGROUND_MUSIC_URL} />
    </div>
  );
};

export default GameLayout;
