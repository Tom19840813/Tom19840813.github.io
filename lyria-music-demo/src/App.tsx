import React, { useState, useEffect, useRef } from 'react';
import {
  Music, Sparkles, Send, Play, Pause, Save,
  Download, Image as ImageIcon, ExternalLink,
  Settings, Zap, Clock, Mic, Volume2, SkipForward
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_PROMPT = "A cinematic sci-fi soundtrack, 120 BPM, with pulsing techno synths and a deep orchestral brass foundation. Atmospheric and intense.";

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [bpm, setBpm] = useState(120);
  const [energy, setEnergy] = useState(7);
  const [duration, setDuration] = useState(30);
  const [vocalMode, setVocalMode] = useState('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio("/sample.mp3");
    audioRef.current.onended = () => setIsPlaying(false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setHasResult(false);
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();

    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setHasResult(true);
      if (audioRef.current) audioRef.current.currentTime = 0;
    }, 4000);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = "/sample.mp3";
    link.download = `lyria-gen-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen p-6 md:p-12 overflow-hidden bg-black selection:bg-purple-500/30">
      <div className="gradient-bg" />

      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 glass-panel flex items-center justify-center text-purple-400">
            <Music size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-grotesk tracking-tight">Gemini Lyria 3</h1>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mt-1">Audio Synthesis Studio</p>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <button className="glass-btn p-3 rounded-xl hidden md:block">
            <Settings size={20} />
          </button>
          <button className="glass-btn px-6 py-2 rounded-xl flex items-center gap-2 font-medium">
            <Save size={18} />
            <span>Library</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left column: Controls */}
        <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold font-grotesk flex items-center gap-3">
                <Sparkles size={20} className="text-purple-500" />
                Composer
              </h2>
              <button
                onClick={() => setPrompt(DEFAULT_PROMPT)}
                className="text-xs text-zinc-500 hover:text-white transition-colors"
              >
                Try sample
              </button>
            </div>

            <div className="relative mb-8">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the sound you want to create... (e.g., 'Lo-fi hip hop with a rainy atmosphere and a melancholic piano melody')"
                className="w-full h-40 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-lg focus:ring-2 focus:ring-purple-500/20 resize-none transition-all placeholder:text-zinc-600"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="glass-btn p-2 rounded-lg" title="Add Image Ref">
                  <ImageIcon size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Zap size={14} className="text-zinc-500" /> Energy
                    </label>
                    <span className="text-sm font-mono text-purple-400">{energy}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10"
                    value={energy} onChange={(e) => setEnergy(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Clock size={14} className="text-zinc-500" /> Tempo
                    </label>
                    <span className="text-sm font-mono text-cyan-400">{bpm} BPM</span>
                  </div>
                  <input
                    type="range" min="40" max="220"
                    value={bpm} onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-3">
                    <Mic size={14} className="text-zinc-500" /> Vocal Mode
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['none', 'choir', 'solo', 'robot'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setVocalMode(mode)}
                        className={`py-2 rounded-lg text-xs capitalize transition-all ${vocalMode === mode ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'bg-zinc-800/40 text-zinc-500 border border-zinc-700/50'}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Volume2 size={14} className="text-zinc-500" /> Duration
                    </label>
                    <span className="text-sm font-mono text-white">{duration}s</span>
                  </div>
                  <input
                    type="range" min="10" max="30" step="5"
                    value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-lg transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'btn-primary'}`}
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap size={24} />
                    </motion.div>
                    <span>Synthesizing Audio...</span>
                  </>
                ) : (
                  <>
                    <Send size={24} />
                    <span>Generate Masterpiece</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {hasResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-8 border-purple-500/30 border-2"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex-none flex items-center justify-center shadow-xl shadow-purple-500/20 group relative overflow-hidden">
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"
                    >
                      {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </div>
                    <Music size={40} className="text-white/80" />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold font-grotesk">{prompt.slice(0, 30)}...</h3>
                        <p className="text-sm text-zinc-500 mt-1">Generated by Lyria 3 • {duration}s • {bpm} BPM</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDownload}
                          className="glass-btn p-2 rounded-lg text-zinc-400 hover:text-white"
                        >
                          <Download size={18} />
                        </button>
                        <button className="glass-btn p-2 rounded-lg text-zinc-400 hover:text-white"><ExternalLink size={18} /></button>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <button
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/10"
                      >
                        {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
                      </button>

                      <div className="flex-1">
                        <div className="visualizer-container">
                          {[...Array(24)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="visualizer-bar"
                              animate={{
                                height: isPlaying ? [10, Math.random() * 50 + 10, 10] : 10
                              }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.05
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-wrap gap-4">
                  <button className="glass-btn px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold text-purple-400 bg-purple-500/5 border-purple-500/20">
                    <ImageIcon size={18} />
                    Generate Cover Art
                  </button>
                  <button className="glass-btn px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                    <SkipForward size={18} />
                    Bridge to Remotion
                  </button>
                  <div className="ml-auto flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    SynthID Watermarked
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: Recent / Sidebar */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h3 className="text-lg font-bold font-grotesk mb-6">Recent Creations</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-zinc-800/20 transition-colors cursor-pointer group">
                  <div className="w-14 h-14 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-purple-500 group-hover:bg-purple-900/10 transition-all">
                    <Music size={20} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-medium text-zinc-200">Late Night Lo-fi...</p>
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter">14 hours ago • 30s</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 bg-gradient-to-br from-zinc-900/40 to-purple-900/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-yellow-500 flex items-center justify-center text-black font-bold text-xs">NB</div>
              <h3 className="text-sm font-bold font-grotesk">Nano Banana Pro</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Directly connected to the image generation engine for stunning, AI-native album art.
            </p>
            <button className="w-full py-2.5 rounded-lg bg-zinc-800 text-xs font-semibold hover:bg-zinc-700 transition-colors">
              Open Cover Studio
            </button>
          </motion.div>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed -bottom-48 -right-48 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="fixed -top-48 -left-48 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
    </div>
  );
}
