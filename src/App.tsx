import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe } from 'lucide-react';
import { getRandomQuestions, Question } from './data/questions';
import { playSound } from './lib/audio';
import StageBackground from './components/StageBackground';

type GameState = 'intro' | 'quiz' | 'outro';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    let interval: any;
    if (gameState === 'quiz' && !showFeedback) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, showFeedback]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startGame = () => {
    playSound('click');
    setQuestions(getRandomQuestions());
    setCurrentIndex(0);
    setScore(0);
    setTimeElapsed(0);
    setGameState('quiz');
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(idx);
    
    const q = questions[currentIndex];
    const isCorrect = idx === q.correctIndex;
    
    // Play correct/wrong sound
    playSound(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    
    setTimeout(() => {
      setShowFeedback(true);
    }, 1000);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      playSound('click');
      setCurrentIndex(prev => prev + 1);
    } else {
      playSound('finish');
      setGameState('outro');
    }
  };

  const renderIntro = () => (
    <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-12 text-center h-full">
      <h1 className="text-7xl font-black mb-6 tracking-tight">Eurovision 2026</h1>
      <p className="text-2xl font-light italic mb-12 max-w-2xl text-white/80">
        È l'ora di cantare e rivivere alcune delle canzoni più ascoltate dell'Eurovision 2026.
      </p>
      <button 
        onClick={startGame} 
        className="px-10 py-4 bg-white text-black font-black rounded-full hover:scale-105 hover:bg-[#00ff88] transition-all"
      >
        INIZIA IL QUIZ
      </button>
    </main>
  );

  const renderQuiz = () => {
    const q = questions[currentIndex];
    if (!q) return null;
    
    return (
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-12 overflow-y-auto">
        {/* Question Header */}
        <div className="text-center mb-8">
          <span className="px-4 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] uppercase tracking-widest font-bold mb-4 inline-block">
            Question {String(currentIndex + 1).padStart(2, '0')} of {String(questions.length).padStart(2, '0')} • {q.type === 'song' ? 'Complete the song' : 'General Knowledge'}
          </span>
          <h2 className="text-3xl font-light italic mb-2 min-h-[40px]">
            {q.type === 'song' 
              ? (selectedOption !== null ? `${q.flag} ${q.artist} - ${q.songName}` : "Quale strofa completa la canzone?") 
              : q.text[0]}
          </h2>
          
          {q.type === 'song' && (
             <div className="mt-4">
               {q.text.map((line, i) => {
                  const hasBlank = line.includes('_______');
                  return (
                     <p key={i} className="text-4xl font-bold tracking-tight text-white/90">
                        {hasBlank ? (
                           <>
                              {line.split('_______').map((part, index, arr) => (
                                <React.Fragment key={index}>
                                  {part}
                                  {index < arr.length - 1 && <span className="text-[#ff0080] border-b-4 border-[#ff0080]/30 px-2">_______</span>}
                                </React.Fragment>
                              ))}
                           </>
                        ) : (
                           line
                        )}
                     </p>
                  )
               })}
             </div>
          )}
        </div>

        {/* Answers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {q.options.map((opt, idx) => {
            let containerClass = "flex items-center p-6 bg-white/5 border-2 border-white/10 rounded-2xl text-left transition-all hover:bg-white/10 group relative";
            let badgeClass = "w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white font-bold mr-4 shrink-0 transition-all group-hover:bg-white/20";
            
            if (selectedOption !== null) {
                if (idx === q.correctIndex) {
                    containerClass = "relative group flex items-center p-6 bg-[#00ff88]/10 border-2 border-[#00ff88] rounded-2xl text-left transition-all z-10";
                    badgeClass = "w-10 h-10 flex items-center justify-center rounded-lg bg-[#00ff88] text-black font-bold mr-4 shrink-0";
                } else if (idx === selectedOption) {
                    containerClass = "flex items-center p-6 bg-[#ff4444]/10 border-2 border-[#ff4444]/40 rounded-2xl text-left transition-all opacity-80";
                    badgeClass = "w-10 h-10 flex items-center justify-center rounded-lg bg-[#ff4444]/40 text-white font-bold mr-4 shrink-0";
                } else {
                    containerClass = "flex items-center p-6 bg-white/5 border-2 border-white/10 rounded-2xl text-left transition-all opacity-40";
                    badgeClass = "w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white font-bold mr-4 shrink-0";
                }
            }

            return (
              <button key={idx} onClick={() => handleOptionClick(idx)} disabled={selectedOption !== null} className={containerClass}>
                <span className={badgeClass}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xl font-semibold">{opt}</span>
                {selectedOption !== null && idx === q.correctIndex && (
                    <div className="absolute inset-0 bg-[#00ff88]/5 blur-xl -z-10"></div>
                )}
              </button>
            )
          })}
        </div>

        {/* Feedback Popup */}
        <AnimatePresence>
        {showFeedback && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="absolute bottom-10 left-1/2 w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl shadow-2xl flex items-center gap-6 z-50">
            <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg shrink-0">
              {q.type === 'song' ? q.flag : <Globe className="w-10 h-10 text-white" />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className={`${selectedOption === q.correctIndex ? 'text-[#00ff88]' : 'text-[#ff4444]'} text-xs font-bold uppercase tracking-widest mb-1`}>
                {selectedOption === q.correctIndex ? 'Risposta Corretta!' : 'Risposta Sbagliata!'}
              </p>
              
              {q.type === 'song' ? (
                 <>
                   <h3 className="text-xl font-bold mb-1 truncate">{q.songName}</h3>
                   <p className="opacity-70 text-sm truncate">{q.artist}</p>
                   <hr className="my-2 border-white/10" />
                   <p className="text-sm italic opacity-90 truncate max-w-full">
                     "{q.correctLyric.join(' · ')}"
                   </p>
                 </>
              ) : (
                 <>
                   <h3 className="text-xl font-bold mb-1">Cultura Generale</h3>
                   <p className="opacity-70 text-sm">La risposta corretta era:</p>
                   <hr className="my-2 border-white/10" />
                   <p className="text-sm italic opacity-90 truncate max-w-full">
                     "{q.options[q.correctIndex]}"
                   </p>
                 </>
              )}
            </div>
            <button 
              onClick={handleNext} 
              className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-[#00ff88] transition-colors whitespace-nowrap">
              Prossima
            </button>
          </motion.div>
        )}
        </AnimatePresence>
      </main>
    );
  };

  const renderOutro = () => (
    <div className="absolute inset-0 z-50 bg-[#050112] flex flex-col items-center justify-center text-center">
      <div className="mb-8">
        <h1 className="text-6xl font-black mb-2">BRAVO!</h1>
        <p className="text-xl opacity-60 uppercase tracking-widest">Quiz Completato</p>
      </div>
      <div className="flex gap-12 mb-12">
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 min-w-[200px]">
          <p className="text-xs opacity-50 mb-2 font-bold tracking-widest uppercase">Punteggio Totale</p>
          <p className="text-6xl font-black text-[#00ff88]">{score}</p>
        </div>
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 min-w-[200px]">
          <p className="text-xs opacity-50 mb-2 font-bold tracking-widest uppercase">Tempo</p>
          <p className="text-6xl font-black">{formatTime(timeElapsed)}</p>
        </div>
      </div>
      <div className="max-w-md bg-pink-500/10 border border-pink-500/30 p-6 rounded-2xl mb-8">
        <p className="text-sm leading-relaxed">
          Fai uno screenshot della schermata e mandalo alla mail <br/>
          <span className="font-bold text-pink-400">digitalsharedfunction@bper.it</span><br/>
          <span className="text-lg font-bold opacity-100 text-white mt-4 block p-2 bg-pink-500/20 rounded-lg border border-pink-500/50 shadow-sm">Verranno considerate solo le mail inviate prima del 30/05</span>
        </p>
      </div>
      <button 
        onClick={startGame} 
        className="px-10 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform"
      >
        RIPROVA A GIOCARE
      </button>
    </div>
  );

  return (
   <div className="bg-[#050112] text-white font-sans overflow-hidden flex flex-col relative min-h-screen">
      <StageBackground />

      {/* Top Navigation / Status */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-6 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-[#ff0080] to-[#7000ff] p-2 rounded-lg font-black tracking-tighter text-lg text-white">DIGITAL FACTORY</div>
          <div>
            <h1 className="text-xs uppercase tracking-[0.2em] opacity-60 font-bold">Eurovision 2026</h1>
            <p className="text-sm font-medium">Easter Egg Maggio 2026</p>
          </div>
        </div>
        {gameState !== 'intro' && (
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-50 font-bold tracking-widest">Score</p>
            <p className="text-2xl font-mono font-bold text-[#00ff88]">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-50 font-bold tracking-widest">Timer</p>
            <p className="text-2xl font-mono font-bold">{formatTime(timeElapsed)}</p>
          </div>
        </div>
        )}
      </nav>

      <div className="flex-1 relative z-10 w-full overflow-hidden flex flex-col">
          {gameState === 'intro' && renderIntro()}
          {gameState === 'quiz' && renderQuiz()}
          {gameState === 'outro' && renderOutro()}
      </div>
   </div>
  );
}
