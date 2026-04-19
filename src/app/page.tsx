"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ThreeBackground = dynamic(() => import("./components/ThreeBackground"), { ssr: false });

export default function Home() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      <ThreeBackground />
      <div className="z-10 text-center p-8 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gold via-rose-400 to-gold bg-clip-text">ScrisoriMagice PRO+</h1>
        <p className="text-gray-400 mb-8">Creează o scrisoare magică personalizată.</p>
        
        {!started ? (
          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Numele ei/lui..." 
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-pink-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button 
              onClick={() => setStarted(true)}
              disabled={!name}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 font-bold hover:scale-105 transition-all disabled:opacity-50"
            >
              ✨ Personalizează
            </button>
          </div>
        ) : (
          <div>
            <p className="text-2xl mb-4">Te iubesc, {name}! 💕</p>
            <button onClick={() => setStarted(false)} className="text-sm text-gray-500">← Înapoi</button>
          </div>
        )}
      </div>
    </main>
  );
}
