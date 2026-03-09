import React, { useEffect, useState } from 'react';
import { Play, Square, SkipBack, SkipForward } from 'lucide-react';
import { AppState } from '../types';

interface TimelineProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function Timeline({ state, setState }: TimelineProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      if (state.isPlaying) {
        const deltaTime = time - lastTime;
        setProgress(p => {
          const newProgress = p + (deltaTime / 15000) * 100; // 15 seconds loop
          return newProgress > 100 ? 0 : newProgress;
        });
      }
      lastTime = time;
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [state.isPlaying]);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 flex items-center gap-6 shadow-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => setProgress(0)} className="text-zinc-400 hover:text-white transition-colors">
          <SkipBack size={20} />
        </button>
        <button
          onClick={() => setState(s => ({ ...s, isPlaying: !s.isPlaying }))}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors shadow-lg shadow-blue-500/20"
        >
          {state.isPlaying ? <Square size={20} /> : <Play size={20} className="ml-1" />}
        </button>
        <button onClick={() => setProgress(100)} className="text-zinc-400 hover:text-white transition-colors">
          <SkipForward size={20} />
        </button>
      </div>
      
      <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-xs font-mono text-zinc-500 w-24 text-right">
        {Math.floor((progress / 100) * 15).toString().padStart(2, '0')}:{(Math.floor(((progress / 100) * 15) * 100) % 100).toString().padStart(2, '0')} / 15:00
      </div>
    </div>
  );
}
