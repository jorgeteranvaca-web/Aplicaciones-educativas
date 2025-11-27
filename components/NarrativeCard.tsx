import React, { useEffect, useState, useRef } from 'react';
import { PlayCircle, Loader2 } from 'lucide-react';
import { generateWorldImage, playNarrativeAudio } from '../geminiService';
import { StageData } from '../types';

interface Props {
  stage: StageData;
}

const NarrativeCard: React.FC<Props> = ({ stage }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  
  // Ref for audio context to persist across renders
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Reset state on stage change
    setImageUrl(null);
    setSpeaking(false);
    
    // Auto-generate image
    const fetchImage = async () => {
      setLoadingImage(true);
      const url = await generateWorldImage(stage.imagePrompt);
      setImageUrl(url);
      setLoadingImage(false);
    };

    fetchImage();
  }, [stage]);

  const handleSpeak = async () => {
    if (speaking) return;
    setSpeaking(true);

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }

    // Resume context if suspended (browser policy)
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    await playNarrativeAudio(stage.narrativeFull, audioContextRef.current);
    setSpeaking(false);
  };

  return (
    <div className="w-full max-w-4xl glass-panel rounded-xl overflow-hidden shadow-2xl border-amber-500/30 border">
      {/* Image Section */}
      <div className="w-full h-64 md:h-96 bg-black relative flex items-center justify-center overflow-hidden group">
        {loadingImage ? (
          <div className="flex flex-col items-center text-amber-400">
            <Loader2 className="animate-spin mb-2" size={40} />
            <span className="font-serif italic">Invocando visión...</span>
          </div>
        ) : imageUrl ? (
          <>
             <img 
              src={imageUrl} 
              alt={stage.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
          </>
        ) : (
          <div className="text-slate-500 italic">La visión está nublada...</div>
        )}
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <h2 className="text-3xl md:text-4xl text-amber-400 font-bold drop-shadow-lg title-font">
            {stage.title}
          </h2>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="p-6 md:p-8 space-y-4">
        <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light tracking-wide">
          {stage.narrativeSummary}
        </p>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSpeak}
            disabled={speaking}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all
              ${speaking 
                ? 'bg-amber-900/50 text-amber-500 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg hover:shadow-amber-500/20'
              }`}
          >
            {speaking ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
            {speaking ? 'Narrando...' : 'Escuchar Historia'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NarrativeCard;
