"use client";

import { useState, useEffect, useRef } from "react";

export function useAudioPlayer() {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audio.loop = true;
    audioRef.current = audio;
    return () => { audio.pause(); audioRef.current = null; };
  }, []);

  const play = () => { if (audioRef.current && !started) { audioRef.current.play(); setStarted(true); } };
  const stop = () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; setStarted(false); } };
  const toggleMute = () => { if (audioRef.current) { audioRef.current.muted = !audioRef.current.muted; setMuted(audioRef.current.muted); } };

  return { muted, started, play, stop, toggleMute };
}

export default function AudioButton({ muted, started, onToggle }: { muted: boolean; started: boolean; onToggle: () => void; }) {
  if (!started) return null;
  return (
    <button onClick={onToggle} className="fixed top-4 right-4 z-[60] w-10 h-10 rounded-full bg-[#12121a] border border-[#ffffff10] flex items-center justify-center text-[#f0e6d3]">
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
