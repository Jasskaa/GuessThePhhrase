import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, RefreshCw, CheckCircle2, Sparkles, ArrowRight, X, Grid3X3, Brain, Car } from 'lucide-react';

interface WordState {
  original: string;
  isObfuscated: boolean;
  userInputs: string[];
  isCorrect: boolean;
}

interface Phrase {
  text: string;
}

const ROMANTIC_PHRASES: Phrase[] = [
  { text: "Tu mirada ilumina mi mundo" }
];

// Component for the rain of hearts
const HeartsRain = () => {
  const hearts = Array.from({ length: 40 });
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: -100, 
            x: Math.random() * window.innerWidth,
            rotate: 0,
            scale: 0.5 + Math.random()
          }}
          animate={{ 
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 200 + (Math.random() * window.innerWidth),
            rotate: 360,
          }}
          transition={{ 
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          className="absolute text-romantic-deep"
        >
          <Heart fill="currentColor" size={20 + Math.random() * 30} />
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [words, setWords] = useState<WordState[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [showSpecialCelebration, setShowSpecialCelebration] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  const initPhrase = () => {
    const phrase = ROMANTIC_PHRASES[0].text;
    const wordsArray = phrase.split(' ').map(word => {
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      const isObfuscated = cleanWord.length > 2;
      return {
        original: cleanWord,
        isObfuscated,
        userInputs: isObfuscated ? Array(cleanWord.length - 1).fill('') : [],
        isCorrect: !isObfuscated
      };
    });
    setWords(wordsArray);
    setGameWon(false);
    setShowSpecialCelebration(false);
    setShowVideo(false);
    inputRefs.current = wordsArray.map(w => w.isObfuscated ? Array(w.original.length - 1).fill(null) : []);
  };

  useEffect(() => {
    initPhrase();
  }, []);

  const handleInputChange = (wordIdx: number, letterIdx: number, value: string) => {
    if (gameWon) return;

    const char = value.slice(-1).toLowerCase();
    if (!/[a-zñáéíóú]/.test(char) && char !== '') return;

    const newWords = [...words];
    const currentWord = newWords[wordIdx];
    currentWord.userInputs[letterIdx] = char;

    const fullInput = currentWord.original[0].toLowerCase() + currentWord.userInputs.join('').toLowerCase();
    currentWord.isCorrect = fullInput === currentWord.original.toLowerCase();

    setWords(newWords);

    if (char !== '') {
      if (letterIdx < currentWord.userInputs.length - 1) {
        inputRefs.current[wordIdx][letterIdx + 1]?.focus();
      } else {
        let nextWordIdx = wordIdx + 1;
        while (nextWordIdx < newWords.length && !newWords[nextWordIdx].isObfuscated) {
          nextWordIdx++;
        }
        if (nextWordIdx < newWords.length) {
          inputRefs.current[nextWordIdx][0]?.focus();
        }
      }
    }

    if (newWords.every(w => w.isCorrect)) {
      setGameWon(true);
      setShowSpecialCelebration(true);
      setTimeout(() => {
        setShowVideo(true);
      }, 2500);
    }
  };

  const handleKeyDown = (wordIdx: number, letterIdx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && words[wordIdx].userInputs[letterIdx] === '') {
      if (letterIdx > 0) {
        inputRefs.current[wordIdx][letterIdx - 1]?.focus();
      } else {
        let prevWordIdx = wordIdx - 1;
        while (prevWordIdx >= 0 && !words[prevWordIdx].isObfuscated) {
          prevWordIdx--;
        }
        if (prevWordIdx >= 0) {
          const lastIdx = words[prevWordIdx].userInputs.length - 1;
          inputRefs.current[prevWordIdx][lastIdx]?.focus();
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12 font-sans selection:bg-romantic-accent/30 overflow-x-hidden">
      <AnimatePresence>
        {showSpecialCelebration && <HeartsRain />}
      </AnimatePresence>

      {/* Video Overlay */}
      <AnimatePresence>
        {showVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-romantic-accent/20 border border-white/10"
            >
              <button 
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
              <video 
                autoPlay 
                controls 
                className="w-full h-full object-cover"
                src="https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-walking-on-the-beach-at-sunset-4125-large.mp4"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white/90 backdrop-blur-md p-6 md:p-12 rounded-[3rem] shadow-2xl shadow-romantic-accent/20 border border-white/50 relative overflow-hidden mb-12"
      >
        <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
          <Heart size={240} className="text-romantic-deep fill-romantic-deep" />
        </div>
        
        <header className="mb-10 text-center relative">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-4"
          >
            <Heart className="text-romantic-deep fill-romantic-deep" size={36} />
          </motion.div>
          <h1 className="font-serif text-4xl md:text-6xl text-romantic-deep font-medium mb-3 tracking-tight">
            Guess The Phrase
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-romantic-accent/50" />
            <p className="text-romantic-deep/60 text-xs uppercase tracking-[0.3em] font-bold">
              To Play The Trailer
            </p>
            <div className="h-px w-8 bg-romantic-accent/50" />
          </div>
        </header>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 mb-12">
          {words.map((word, wIdx) => (
            <div key={wIdx} className="flex items-center gap-2">
              {!word.isObfuscated ? (
                <span className="font-serif text-3xl md:text-5xl text-romantic-deep/90 px-1">
                  {word.original}
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-10 h-12 md:w-14 md:h-16 flex items-center justify-center rounded-xl border-2 border-romantic-deep bg-romantic-deep text-white shadow-md">
                    <span className="font-serif text-2xl md:text-4xl font-bold uppercase">
                      {word.original[0]}
                    </span>
                  </div>
                  
                  {word.userInputs.map((input, lIdx) => (
                    <div key={lIdx} className="relative">
                      <input
                        ref={el => {
                          if (!inputRefs.current[wIdx]) inputRefs.current[wIdx] = [];
                          inputRefs.current[wIdx][lIdx] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={input}
                        onKeyDown={(e) => handleKeyDown(wIdx, lIdx, e)}
                        onChange={(e) => handleInputChange(wIdx, lIdx, e.target.value)}
                        disabled={gameWon}
                        className={`
                          w-10 h-12 md:w-14 md:h-16 text-center font-serif text-2xl md:text-4xl rounded-xl border-2 
                          outline-none transition-all duration-200 uppercase
                          ${word.isCorrect 
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-600 shadow-inner' 
                            : input !== '' 
                              ? 'bg-romantic-pink/30 border-romantic-deep text-romantic-deep shadow-sm'
                              : 'bg-white border-romantic-accent/40 focus:border-romantic-deep text-romantic-deep'
                          }
                        `}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {gameWon && !showVideo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8"
            >
              <div className="flex items-center justify-center gap-4 text-romantic-deep">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="text-romantic-accent" size={24} />
                </motion.div>
                <p className="font-serif text-3xl md:text-4xl italic font-light tracking-wide">
                  "Has encontrado las palabras perfectas"
                </p>
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="text-romantic-accent" size={24} />
                </motion.div>
              </div>
              
              <button
                onClick={() => setShowVideo(true)}
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-romantic-deep text-white rounded-2xl hover:bg-romantic-deep/90 transition-all shadow-xl shadow-romantic-deep/30 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 font-medium tracking-wide">Ver sorpresa</span>
                <Heart size={20} className="relative z-10 group-hover:scale-125 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!gameWon && (
          <div className="mt-16 flex justify-center">
            <button 
              onClick={() => initPhrase()}
              className="group text-romantic-deep/40 hover:text-romantic-deep transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Reiniciar tablero
            </button>
          </div>
        )}
      </motion.div>

      {/* Need Help Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-4xl text-center px-4"
      >
        <h2 className="font-serif text-3xl text-romantic-deep/80 mb-8 italic">¿Need Help?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "PinkDle", icon: Grid3X3, color: "bg-pink-100", url: "https://wordle-orcin-tau.vercel.app/" },
            { title: "PinkMori", icon: Brain, color: "bg-rose-100", url: "https://memory-cyan-iota.vercel.app/" },
            { title: "Test", icon: Car, color: "bg-fuchsia-100", url: "https://test-school-mu.vercel.app/" }
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-lg shadow-romantic-accent/5 flex flex-col items-center gap-4 cursor-pointer group transition-all no-underline"
            >
              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-romantic-deep group-hover:scale-110 transition-transform`}>
                <item.icon size={32} />
              </div>
              <span className="font-serif text-xl text-romantic-deep font-medium">{item.title}</span>
            </motion.a>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
