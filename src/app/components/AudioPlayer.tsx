"use client";

import { useState, useEffect, useRef } from "react";

export function useAudioPlayer() {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Minimalist peaceful piano audio source
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const play = () => {
    if (audioRef.current && !started) {
      audioRef.current.play().catch(console.error);
      setStarted(true);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setStarted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setMuted(audioRef.current.muted);
    }
  };

  return { muted, started, play, stop, toggleMute };
}

export default function AudioButton({ muted, started, onToggle }: { 
  muted: boolean; 
  started: boolean; 
  onToggle: () => void; 
}) {
  if (!started) return null;

  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-[60] w-10 h-10 rounded-full bg-[#12121a] border border-[#ffffff10] flex items-center justify-center text-[#f0e6d3] hover:bg-[#1a1a28] transition-all"
    >
      {muted ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15L4 13.414V10.586L5.586 9M10.121 16.5l-4.535-4.536L5.586 12M17 11a1 1 0 112 0 1 1 0 01-2 0z" /></svg>
      ) : (
        <div className="flex items-end gap-0.5 h-3">
          <div className="w-0.5 bg-[#d4a853] animate-[eq-bar_0.5s_ease-in-out_infinite_alternate]" />
          <div className="w-0.5 bg-[#d4a853] animate-[eq-bar_0.7s_ease-in-out_infinite_alternate_0.1s]" />
          <div className="w-0.5 bg-[#d4a853] animate-[eq-bar_0.6s_ease-in-out_infinite_alternate_0.2s]" />
        </div>
      )}
    </button>
  );
}
