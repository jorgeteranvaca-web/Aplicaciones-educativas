import React, { useState } from 'react';
import GameLayout from './components/GameLayout';
import NarrativeCard from './components/NarrativeCard';
import AiAssistant from './components/AiAssistant';
import { STAGES } from './constants';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none');

  const currentStage = STAGES[currentStageIndex];
  const isLastStage = currentStageIndex === STAGES.length - 1;

  const handleNext = () => {
    setFeedback('none');
    setUserAnswer('');
    if (currentStageIndex < STAGES.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    }
  };

  const checkAnswer = () => {
    if (!currentStage.riddleAnswer) {
      handleNext();
      return;
    }

    const num = parseFloat(userAnswer);
    if (!isNaN(num) && num === currentStage.riddleAnswer) {
      setFeedback('success');
    } else {
      setFeedback('error');
    }
  };

  return (
    <GameLayout>
      <div className="w-full max-w-4xl flex flex-col gap-8 pb-24">
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-indigo-600 transition-all duration-500"
            style={{ width: `${((currentStageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>

        {/* Narrative & Image */}
        <NarrativeCard stage={currentStage} />

        {/* Riddle Interaction Section */}
        {!currentStage.isCinematicOnly && (
          <div className="w-full glass-panel p-6 md:p-8 rounded-xl border border-indigo-500/30 animate-fade-in-up">
            <h3 className="text-2xl text-indigo-300 font-bold mb-4 title-font flex items-center gap-2">
              <span className="text-amber-500">❖</span> El Enigma
            </h3>
            
            <p className="text-xl text-white mb-6 font-serif italic text-center">
              {currentStage.riddleQuestion}
            </p>

            {feedback === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex items-center gap-2 text-green-400 text-xl font-bold animate-bounce">
                  <CheckCircle2 size={32} />
                  <span>¡Correcto! El camino se abre.</span>
                </div>
                <button
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-green-900/50"
                >
                  Continuar Viaje <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="relative w-full md:w-64">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      setFeedback('none');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                    placeholder="Tu respuesta..."
                    className={`w-full bg-slate-800/80 border-2 rounded-lg px-4 py-3 text-center text-xl outline-none transition-colors
                      ${feedback === 'error' ? 'border-red-500 text-red-200' : 'border-slate-600 focus:border-indigo-500 text-white'}
                    `}
                  />
                  {feedback === 'error' && (
                    <div className="absolute -bottom-6 left-0 w-full text-center text-red-400 text-sm flex items-center justify-center gap-1">
                      <AlertCircle size={14} /> Incorrecto, intenta de nuevo.
                    </div>
                  )}
                </div>
                
                <button
                  onClick={checkAnswer}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-indigo-900/50 hover:shadow-indigo-500/30 w-full md:w-auto"
                >
                  Romper el Sello
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Button for Intro/Outro */}
        {currentStage.isCinematicOnly && (
          <div className="flex justify-center">
             {isLastStage ? (
               <div className="text-amber-400 font-bold text-2xl title-font tracking-widest uppercase border-y-2 border-amber-400 py-2">
                 Fin de la Saga
               </div>
             ) : (
               <button
                onClick={handleNext}
                className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-amber-900/40"
              >
                Comenzar Aventura <ArrowRight size={24} />
              </button>
             )}
          </div>
        )}
      </div>

      {/* AI Chat Assistant - Only available during riddles */}
      {!currentStage.isCinematicOnly && currentStage.riddleQuestion && (
        <AiAssistant 
          worldTitle={currentStage.title} 
          riddleQuestion={currentStage.riddleQuestion} 
        />
      )}
    </GameLayout>
  );
};

export default App;
