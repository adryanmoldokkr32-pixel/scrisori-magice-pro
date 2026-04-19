"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import AudioButton, { useAudioPlayer } from "./components/AudioPlayer";

const ThreeBackground = dynamic(() => import("./components/ThreeBackground"), { ssr: false });
const ThreeCelebration = dynamic(() => import("./components/ThreeCelebration"), { ssr: false });

/* ================================================================== */
/*  PARALLAX STARS                                                     */
/* ================================================================== */

function ParallaxStars() {
  const layerRef = useRef<HTMLDivElement>(null);

  const stars = useRef(
    Array.from({ length: 90 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      opacity: 0.15 + Math.random() * 0.45,
      depth: 0.3 + Math.random() * 0.7,
    }))
  ).current;

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.transform = `translate(${cx * -12}px, ${cy * -8}px)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={layerRef} className="parallax-layer z-[1]">
      {stars.map((s, i) => (
        <div
          key={i}
          className="parallax-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ================================================================== */
/*  ROSE PETALS (continuous ambient)                                   */
/* ================================================================== */

function useRosePetals(containerRef: React.RefObject<HTMLDivElement | null>, active: boolean) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const colors = ["#e8457a", "#ff6b9d", "#ffb7c5", "#d4536a", "#ff85a2", "#ffd1dc"];

    const spawn = () => {
      const petal = document.createElement("div");
      petal.className = "rose-petal";
      const size = 5 + Math.random() * 9;
      const color = colors[Math.floor(Math.random() * colors.length)];
      petal.style.cssText = `
        width:${size}px; height:${size * 1.3}px;
        background:${color};
        border-radius: 50% 0 50% 50%;
        left:${Math.random() * 100}%;
        top:-20px;
        opacity:0;
        animation-duration:${6 + Math.random() * 8}s;
        animation-delay:${Math.random() * 0.5}s;
      `;
      el.appendChild(petal);
      setTimeout(() => petal.remove(), 15000);
    };

    for (let i = 0; i < 8; i++) setTimeout(spawn, i * 300);
    intervalRef.current = setInterval(spawn, 800);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active, containerRef]);
}

/* ================================================================== */
/*  REVIEWS SECTION                                                    */
/* ================================================================== */

const REVIEWS = [
  {
    name: "Maria",
    text: "Am plâns când am primit-o! Este cea mai frumoasă surpriză digitală pe care am văzut-o vreodată. Copacul cu flori de cireș m-a lăsat fără cuvinte.",
    stars: 5,
    emoji: "💕",
  },
  {
    name: "Andrei",
    text: "Iubita mea a fost super impresionată. Am trimis-o pe WhatsApp și a fost cel mai romantic gest digital posibil. Recomand tuturor!",
    stars: 5,
    emoji: "🔥",
  },
  {
    name: "Elena",
    text: "Animația cu copacul este pur și simplu magică. Fiecare detaliu este gândit cu grijă — de la scrisoare până la artificii. Bravo!",
    stars: 5,
    emoji: "🌸",
  },
  {
    name: "Dragoș",
    text: "Am folosit-o pentru aniversarea noastră. Muzica de pian, animația fluidă, totul a fost perfect. Cea mai frumoasă declarație de dragoste digitală.",
    stars: 5,
    emoji: "💌",
  },
];

function ReviewsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll(".review-card");
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      }
    );
    gsap.fromTo(
      ".reviews-heading",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 px-4 py-20 sm:py-28 max-w-6xl mx-auto">
      <div className="reviews-heading text-center mb-14">
        <span className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#d4a853] font-medium">
          Recenzii
        </span>
        <h2
          className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-[#f0e6d3]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Ce spun cei care au{" "}
          <span className="bg-gradient-to-r from-[#e8457a] to-[#ffb7c5] bg-clip-text text-transparent">
            trăit magia
          </span>
        </h2>
        <p className="mt-4 text-[#8a8a9a] text-sm sm:text-base max-w-xl mx-auto">
          Mii de cupluri au trimis deja scrisori magice. Iată câteva povești.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            className="review-card bg-[#12121a] border border-[#ffffff08] rounded-2xl p-6 hover:border-[#d4a85325] transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-[#d4a85308] to-transparent" />
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: r.stars }).map((_, si) => (
                <svg key={si} className="w-4 h-4 star-gold" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 1l2.39 6.46H19l-5.3 3.83 2 6.46L10 13.99l-5.7 3.76 2-6.46L1 7.46h6.61z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-[#c0b8a8] leading-relaxed mb-5 relative z-10">
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4a85340] to-[#e8457a40] flex items-center justify-center text-base">
                {r.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#f0e6d3]">{r.name}</p>
                <p className="text-xs text-[#8a8a9a]">Utilizator verificat</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================== */
/*  HERO SECTION                                                       */
/* ================================================================== */

function HeroSection({
  onTryDemo,
  onPersonalize,
}: {
  onTryDemo: () => void;
  onPersonalize: (name: string) => void;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline();
    tl.from(".hero-logo", { y: -20, opacity: 0, duration: 0.7, ease: "power3.out" })
      .from(".hero-badge", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
      .from(".hero-title-line", { y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out" }, "-=0.3")
      .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .from(".hero-free-banner", { scale: 0.8, opacity: 0, duration: 0.7, ease: "back.out(1.5)" }, "-=0.2")
      .from(".hero-buttons", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
      .from(".hero-features", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.2");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onPersonalize(name.trim());
  };

  return (
    <>
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 py-20 z-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#d4a85315] via-[#e8457a10] to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="hero-logo mb-6">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="bg-gradient-to-r from-[#d4a853] to-[#e8457a] bg-clip-text text-transparent">Scrisori</span>
              <span className="text-[#f0e6d3]">Magice</span>
            </span>
            <span className="ml-2 text-xs align-top text-[#d4a853] font-medium">PRO+</span>
          </div>

          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00e67640] bg-[#00e67610] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
            <span className="text-xs sm:text-sm tracking-widest uppercase text-[#00e676] font-semibold">100% Gratuit</span>
          </div>

          <h1 className="mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="hero-title-line block text-4xl sm:text-5xl md:text-7xl font-bold text-[#f0e6d3] leading-tight">
              Scrisori de Dragoste,
            </span>
            <span className="hero-title-line block text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#d4a853] via-[#e8457a] to-[#ffb7c5] bg-clip-text text-transparent">
                Care Prind Viață
              </span>
            </span>
          </h1>

          <p className="hero-subtitle text-base sm:text-lg md:text-xl text-[#8a8a9a] max-w-2xl mx-auto mb-6 leading-relaxed">
            Singura scrisoare digitală care prinde viață. Personalizează cu un nume
            și urmărește magia — o experiență cinematică de neuitat.
          </p>

          <div className="hero-free-banner inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4a85320] via-[#e8457a20] to-[#d4a85320] border border-[#d4a85340] mb-10">
            <span className="text-sm sm:text-base font-bold text-[#f0e6d3]">
              🎁 ACUM GRATUIT — Creează-ți scrisoarea magică!
            </span>
          </div>

          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onTryDemo}
              className="group relative px-8 py-4 rounded-xl text-base font-semibold text-[#0a0a0f] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,168,83,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4a853] via-[#e8c96a] to-[#d4a853] animated-gradient" />
              <span className="relative flex items-center gap-2">▶ Vezi Demo</span>
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="gradient-border px-8 py-4 rounded-xl text-base font-semibold text-[#f0e6d3] bg-[#12121a] transition-all duration-300 hover:scale-105 hover:bg-[#1a1a28]"
            >
              ✨ Personalizează acum
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-md bg-[#12121a] border border-[#ffffff10] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-lg">💌</span>
                <h3 className="text-lg font-semibold text-[#f0e6d3]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Creează scrisoarea ta magică
                </h3>
              </div>
              <p className="text-xs text-[#00e676] mb-5 font-medium">Complet gratuit • Fără cont necesar</p>
              <label className="block text-left text-sm text-[#8a8a9a] mb-2 tracking-wide uppercase">
                Numele persoanei dragi
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex. Maria"
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border="#ffffff15] text-[#f0e6d3] placeholder:text-[#555] focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] transition-all text-base"
                autoFocus
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-[#e8457a] to-[#ff6b9d] text-white font-semibold text-base transition-all duration-300 hover:shadow-[0_0_30px_rgba(232,69,122,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Urmărește magia →
              </button>
            </form>
          )}

          <div className="hero-features flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-12 text-xs sm:text-sm text-[#8a8a9a]">
            {["Animație GSAP", "Scrisoare 3D", "Flori de Cireș", "Artificii Magice"].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853]" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="relative z-10 px-4 py-20 bg-[#12121a50] border-y border-[#ffffff05]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-[#f0e6d3]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Colecția Noastră de <span className="text-[#d4a853]">Magie</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="group relative rounded-2xl overflow-hidden border border-[#d4a85340] bg-[#12121a]">
              <div className="aspect-[16/9] bg-gradient-to-br from-[#e8457a20] to-[#d4a85320] flex items-center justify-center">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-500">🌸</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#f0e6d3]">Iubire în Flori</h3>
                <p className="text-xs text-[#8a8a9a] mt-2">Tema actuală: Copacul de cireș și personaje 3D.</p>
                <span className="inline-block mt-4 text-[10px] px-2 py-1 rounded-full bg-[#00e67620] text-[#00e676] font-bold">ACTIVĂ</span>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden border border-[#ffffff10] bg-[#12121a] opacity-60">
              <div className="aspect-[16/9] bg-[#0a0a0f] flex items-center justify-center">
                <span className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-500">🎂</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#8a8a9a]">Aniversare Magică</h3>
                <p className="text-xs text-[#555] mt-2">Tort 3D care crește și explozie de confeti.</p>
                <span className="inline-block mt-4 text-[10px] px-2 py-1 rounded-full bg-[#ffffff10] text-[#8a8a9a] font-bold">ÎN CURÂND</span>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden border border-[#ffffff10] bg-[#12121a] opacity-60">
              <div className="aspect-[16/9] bg-[#0a0a0f] flex items-center justify-center">
                <span className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-500">🕯️</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#8a8a9a]">Mesaj de Pace</h3>
                <p className="text-xs text-[#555] mt-2">O temă calmă pentru iertare și recunoștință.</p>
                <span className="inline-block mt-4 text-[10px] px-2 py-1 rounded-full bg-[#ffffff10] text-[#8a8a9a] font-bold">ÎN CURÂND</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-10 text-center border-t border-[#ffffff06]">
        <p className="text-xs text-[#8a8a9a]">
          © 2026{" "}
          <span className="text-[#d4a853]" style={{ fontFamily: "'Playfair Display', serif" }}>
            ScrisoriMagice
          </span>{" "}
          — Făcut cu 💕 în România
        </p>
      </footer>
    </>
  );
}

function ShareOverlay({ name, onClose }: { name: string; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(".share-card", { y: 80, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.4)", delay: 0.1 });
  }, []);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "https://scrisorimagice.ro";
  const waMessage = `Uite ce scrisoare magică ți-am trimis! ✨ ${pageUrl}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    });
  }, [pageUrl]);

  const handleGenerateVideo = async () => {
    setIsRendering(true);
    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientName: name }),
      });
      if (!response.ok) throw new Error('Render failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (err) {
      console.error(err);
      alert('Eroare la generarea video-ului. Te rugăm să încerci mai târziu.');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-[#0a0a0fcc] backdrop-blur-md">
      <div className="share-card relative w-full max-w-lg bg-[#12121a] border border-[#ffffff10] rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-[#ffffff10] text-[#8a8a9a] hover:text-[#f0e6d3] hover:bg-[#ffffff20] flex items-center justify-center transition-all text-base">
          ✕
        </button>

        <div className="text-center mb-6">
          <span className="text-5xl mb-2 block">💕</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f0e6d3] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Trimite Magia Mai Departe!
          </h2>
          <p className="text-[#8a8a9a] text-sm">
            Scrisoarea pentru <span className="text-[#e8457a] font-semibold">{name}</span> este gata.
          </p>
        </div>

        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#d4a85315] to-[#e8457a15] border border-[#d4a85330]">
          <h3 className="text-[#d4a853] font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#d4a853] animate-ping" />
            Funcție PRO+ (Gratuit Acum)
          </h3>
          <p className="text-[#c0b8a8] text-xs mb-5 leading-relaxed">
            Descarcă animația sub formă de video MP4 HD pentru a o păstra pe veci sau pentru a o posta pe TikTok/Reels.
          </p>
          
          {!videoUrl ? (
            <button
              onClick={handleGenerateVideo}
              disabled={isRendering}
              className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-[#d4a853] to-[#e8457a] text-[#0a0a0f] font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isRendering ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0a0a0f] border-t-transparent rounded-full animate-spin" />
                  <span>Se generează video-ul... (cca. 30 sec)</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>
                  <span>Generează Video MP4</span>
                </>
              )}
            </button>
          ) : (
            <a
              href={videoUrl}
              download={`Scrisoare-Magica-${name}.mp4`}
              className="w-full py-4 px-5 rounded-xl bg-[#00e676] text-[#0a0a0f] font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span>Descarcă Video Gata! ✨</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[#ffffff10]" />
          <span className="text-xs text-[#8a8a9a] uppercase tracking-wider">sau trimite link</span>
          <div className="flex-1 h-px bg-[#ffffff10]" />
        </div>

        <button
          onClick={copyLink}
          className={`w-full mb-4 py-4 px-5 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.97] ${
            linkCopied
              ? "bg-[#00e676] text-[#0a0a0f]"
              : "bg-[#ffffff08] text-[#f0e6d3] border border-[#ffffff10] hover:bg-[#ffffff15]"
          }`}
        >
          {linkCopied ? <span>Link copiat! ✨</span> : <span>Copiază link-ul</span>}
        </button>

        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-2xl bg-[#25D366] text-white font-bold text-base transition-all hover:brightness-110">
          Trimite pe WhatsApp
        </a>
      </div>
    </div>
  );
}

function AnimationScene({ name, onBack, audio }: {
  name: string;
  onBack: () => void;
  audio: ReturnType<typeof useAudioPlayer>;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [phase, setPhase] = useState<"letter" | "animating" | "complete">("letter");
  const [showShare, setShowShare] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useRosePetals(sceneRef, phase === "animating" || phase === "complete");

  useEffect(() => {
    if (phase === "complete") {
      const timer = setTimeout(() => setShowShare(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const stageEl = el.querySelector(".stage") as HTMLElement | null;

    const onMove = (e: MouseEvent) => {
      if (!stageEl) return;
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      stageEl.style.transform = `translate(${cx * -6}px, ${cy * -4}px)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const startAnimation = () => {
    if (phase !== "letter") return;
    setPhase("animating");
    audio.play();

    const tl = gsap.timeline({ onComplete: () => setPhase("complete") });
    tlRef.current = tl;

    tl.to(".envelope-flap", { rotateX: -180, duration: 1.2, ease: "power2.inOut" });
    tl.to(".letter-paper-inner", { y: -80, opacity: 1, duration: 1, ease: "power2.out" }, "-=0.3");
    tl.to(".envelope-wrapper", { scale: 0.8, opacity: 0, duration: 0.8, ease: "power2.in" }, "+=0.5");

    tl.set(".stage", { display: "flex" });
    tl.from(".stage", { opacity: 0, duration: 0.6 });

    tl.fromTo(".character-boy", { x: -300, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power2.out" }, "-=0.2");
    tl.to(".boy-leg-left", { rotation: 20, duration: 0.15, repeat: 7, yoyo: true, ease: "sine.inOut" }, "<");
    tl.to(".boy-leg-right", { rotation: -20, duration: 0.15, repeat: 7, yoyo: true, ease: "sine.inOut" }, "<");

    tl.fromTo(".character-girl", { x: 300, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power2.out" }, "-=0.8");
    tl.to(".girl-leg-left", { rotation: -20, duration: 0.15, repeat: 7, yoyo: true, ease: "sine.inOut" }, "<");
    tl.to(".girl-leg-right", { rotation: 20, duration: 0.15, repeat: 7, yoyo: true, ease: "sine.inOut" }, "<");

    tl.to(".boy-arm-right", { rotation: -60, duration: 0.5, ease: "power2.out" });
    tl.to(".girl-arm-left", { rotation: 60, duration: 0.5, ease: "power2.out" }, "<");

    tl.to(".heart-left", { x: 80, y: -40, rotation: 0, duration: 0.8, ease: "power2.out" });
    tl.to(".heart-right", { x: -80, y: -40, rotation: 0, duration: 0.8, ease: "power2.out" }, "<");

    tl.set(".heart-left, .heart-right", { opacity: 0 });
    tl.set(".full-heart", { display: "block" });
    tl.fromTo(".full-heart", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" });

    tl.to(".full-heart", { scale: 1.3, duration: 0.3, repeat: 2, yoyo: true, ease: "sine.inOut" });
    tl.to(".full-heart", { y: 80, scale: 0.5, opacity: 0, duration: 0.6, ease: "power2.in" });

    tl.set(".tree-group", { display: "block" });
    tl.fromTo(".trunk-main", { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: "power2.out" });
    tl.fromTo(".branch", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power2.out" }, "-=0.4");
    tl.fromTo(".blossom-flower", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: "back.out(2)" }, "-=0.3");

    tl.call(() => { createFallingPetals(sceneRef.current); });

    tl.call(() => {
      launchFireworks(sceneRef.current);
      setShowCelebration(true);
    }, [], "+=0.3");

    tl.fromTo(".love-text", { scale: 0, opacity: 0, display: "none" }, { scale: 1, opacity: 1, display: "block", duration: 1.2, ease: "elastic.out(1, 0.4)" }, "+=0.3");
    tl.to(".love-text", { textShadow: "0 0 20px rgba(232,69,122,0.8), 0 0 40px rgba(232,69,122,0.5), 0 0 80px rgba(232,69,122,0.3)", duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" });
  };

  const handleReset = () => {
    if (tlRef.current) tlRef.current.kill();
    setPhase("letter");
    setShowShare(false);
    setShowCelebration(false);
    audio.stop();
    gsap.set(".envelope-wrapper", { scale: 1, opacity: 1 });
    gsap.set(".envelope-flap", { rotateX: 0 });
    gsap.set(".letter-paper-inner", { y: 0, opacity: 0 });
    gsap.set(".stage", { display: "none" });
    gsap.set(".full-heart", { display: "none", y: 0, scale: 1, opacity: 1 });
    gsap.set(".tree-group", { display: "none" });
    gsap.set(".love-text", { display: "none", scale: 0, opacity: 0 });
    gsap.set(".character-boy", { x: -300, opacity: 0 });
    gsap.set(".character-girl", { x: 300, opacity: 0 });
    gsap.set(".heart-left, .heart-right", { x: 0, y: 0, opacity: 1 });
    gsap.set(".boy-arm-right", { rotation: 0 });
    gsap.set(".girl-arm-left", { rotation: 0 });
  };

  return (
    <div ref={sceneRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden scene-enter">
      <ParallaxStars />
      <AudioButton muted={audio.muted} started={audio.started} onToggle={audio.toggleMute} />

      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button onClick={() => { audio.stop(); onBack(); }}
          className="px-4 py-2 rounded-lg bg-[#12121a] border border-[#ffffff10] text-[#8a8a9a] text-sm hover:text-[#f0e6d3] hover:border-[#d4a85340] transition-all">
          ← Înapoi
        </button>
        {phase === "complete" && (
          <button onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4a85330] to-[#e8457a30] border border-[#d4a85340] text-[#d4a853] text-sm hover:text-[#f0e6d3] transition-all">
            🔄 Reluare
          </button>
        )}
      </div>

      <div className="absolute top-4 right-16 z-50 text-xs text-[#ffffff20]" style={{ fontFamily: "'Playfair Display', serif" }}>
        ScrisoriMagice
      </div>

      <div className="envelope-wrapper letter-container cursor-pointer" onClick={startAnimation}>
        <div className="letter-envelope mx-auto">
          <div className="letter-body bg-gradient-to-b from-[#c9302c] to-[#8b1a1a] shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#d4a853] to-[#b8912e] shadow-lg flex items-center justify-center">
              <span className="text-xl sm:text-2xl">💌</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-full">
              <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[160px] sm:border-l-[210px] border-l-transparent border-b-[110px] sm:border-b-[140px] border-b-[#a52020]" />
              <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[160px] sm:border-r-[210px] border-r-transparent border-b-[110px] sm:border-b-[140px] border-b-[#a52020]" />
            </div>
          </div>
          <div className="envelope-flap" style={{ zIndex: 15 }}>
            <div className="w-0 h-0 mx-auto" style={{ borderLeft: "160px solid transparent", borderRight: "160px solid transparent", borderTop: "110px solid #e04040" }} />
          </div>
          <div className="letter-paper bg-[#faf3e8] flex items-center justify-center">
            <div className="letter-paper-inner text-center opacity-0 px-4">
              <p className="text-[#8b4513] text-sm sm:text-base" style={{ fontFamily: "'Dancing Script', cursive" }}>
                Atinge pentru a deschide scrisoarea...
              </p>
            </div>
          </div>
        </div>
        {phase === "letter" && (
          <p className="text-center mt-6 text-[#8a8a9a] text-sm animate-pulse">
            Apasă pe scrisoare pentru a începe ✨
          </p>
        )}
      </div>

      <div className="stage hidden absolute inset-0 items-end justify-center pb-8 sm:pb-12 transition-transform duration-150 ease-out">
        <div className="absolute bottom-[7%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffffff10] to-transparent" />

        <div className="character character-boy" style={{ left: "25%", opacity: 0 }}>
          <div className="character-body">
            <div className="char-head bg-[#f5d0a9]">
              <div className="absolute top-[40%] left-[25%] w-1.5 h-2 bg-[#333] rounded-full" />
              <div className="absolute top-[40%] right-[25%] w-1.5 h-2 bg-[#333] rounded-full" />
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-3 h-1.5 border-b-2 border-[#c9302c] rounded-b-full" />
              <div className="absolute -top-1 left-0 w-full h-[45%] bg-[#3a2518] rounded-t-full" />
            </div>
            <div className="char-body-shape bg-[#2563eb]" />
            <div className="char-arm boy-arm-left char-arm-left bg-[#2563eb]" />
            <div className="char-arm boy-arm-right char-arm-right bg-[#2563eb]">
              <div className="heart-left absolute -top-4 -right-3">
                <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9" fill="#e8457a"><path d="M12 21.35C12 21.35 2 14 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09L12 21.35Z" /></svg>
              </div>
            </div>
            <div className="char-legs">
              <div className="char-leg boy-leg-left bg-[#1e3a5f]" style={{ transformOrigin: "top center" }} />
              <div className="char-leg boy-leg-right bg-[#1e3a5f]" style={{ transformOrigin: "top center" }} />
            </div>
          </div>
        </div>

        <div className="character character-girl" style={{ right: "25%", opacity: 0 }}>
          <div className="character-body">
            <div className="char-head bg-[#f5d0a9]">
              <div className="absolute top-[40%] left-[25%] w-1.5 h-2 bg-[#333] rounded-full" />
              <div className="absolute top-[40%] right-[25%] w-1.5 h-2 bg-[#333] rounded-full" />
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-3 h-1.5 border-b-2 border-[#c9302c] rounded-b-full" />
              <div className="absolute -top-1 left-0 w-full h-[50%] bg-[#5a2d0c] rounded-t-full" />
              <div className="absolute top-[30%] -left-2 w-3 h-[70%] bg-[#5a2d0c] rounded-b-full" />
              <div className="absolute top-[30%] -right-2 w-3 h-[70%] bg-[#5a2d0c] rounded-b-full" />
            </div>
            <div className="char-body-shape bg-[#e8457a]" />
            <div className="char-arm girl-arm-left char-arm-left bg-[#e8457a]">
              <div className="heart-right absolute -top-4 -left-3">
                <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9" fill="#e8457a"><path d="M12 21.35C12 21.35 22 14 22 8.5C22 5.42 19.58 3 16.5 3C14.76 3 13.09 3.81 12 5.09L12 21.35Z" /></svg>
              </div>
            </div>
            <div className="char-arm girl-arm-right char-arm-right bg-[#e8457a]" />
            <div className="char-legs">
              <div className="char-leg girl-leg-left bg-[#d63384]" style={{ transformOrigin: "top center" }} />
              <div className="char-leg girl-leg-right bg-[#d63384]" style={{ transformOrigin: "top center" }} />
            </div>
          </div>
        </div>

        <div className="full-heart bloom-glow hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_20px_rgba(232,69,122,0.6)]" fill="#e8457a">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <div className="tree-group tree-bloom hidden absolute bottom-[7%] left-1/2 -translate-x-1/2">
          <CherryBlossomTree />
        </div>

        <div className="love-text hidden absolute top-[12%] sm:top-[15%] left-1/2 -translate-x-1/2 text-center z-30" style={{ fontFamily: "'Dancing Script', cursive" }}>
          <p className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#e8457a] glow-text-rose whitespace-nowrap">
            Te iubesc, {name}! 💕
          </p>
        </div>
      </div>

      <ThreeCelebration active={showCelebration} />
      {showShare && <ShareOverlay name={name} onClose={() => setShowShare(false)} />}
    </div>
  );
}

function CherryBlossomTree() {
  const branchData = [
    { bottom: "65%", left: "50%", width: 70, rotate: -35 },
    { bottom: "65%", left: "50%", width: 65, rotate: 30 },
    { bottom: "50%", left: "50%", width: 80, rotate: -45 },
    { bottom: "50%", left: "50%", width: 75, rotate: 40 },
    { bottom: "38%", left: "50%", width: 55, rotate: -30 },
    { bottom: "38%", left: "50%", width: 50, rotate: 35 },
    { bottom: "78%", left: "50%", width: 50, rotate: -25 },
    { bottom: "78%", left: "50%", width: 45, rotate: 20 },
    { bottom: "28%", left: "50%", width: 40, rotate: -40 },
    { bottom: "28%", left: "50%", width: 35, rotate: 45 },
  ];

  const blossomPositions = [
    { bottom: "62%", left: "-20px" }, { bottom: "67%", left: "-35px" },
    { bottom: "60%", left: "30px" }, { bottom: "68%", left: "45px" },
    { bottom: "48%", left: "-45px" }, { bottom: "52%", left: "-60px" },
    { bottom: "47%", left: "40px" }, { bottom: "53%", left: "55px" },
    { bottom: "36%", left: "-25px" }, { bottom: "40%", left: "-40px" },
    { bottom: "35%", left: "20px" }, { bottom: "41%", left: "35px" },
    { bottom: "75%", left: "-15px" }, { bottom: "80%", left: "-30px" },
    { bottom: "76%", left: "15px" }, { bottom: "81%", left: "25px" },
    { bottom: "26%", left: "-20px" }, { bottom: "30%", left: "-30px" },
    { bottom: "25%", left: "15px" }, { bottom: "29%", left: "25px" },
    { bottom: "55%", left: "-50px" }, { bottom: "44%", left: "50px" },
    { bottom: "70%", left: "-45px" }, { bottom: "33%", left: "40px" },
    { bottom: "85%", left: "-10px" }, { bottom: "85%", left: "12px" },
    { bottom: "58%", left: "60px" }, { bottom: "45%", left: "-55px" },
  ];

  const colors = ["#ffb7c5", "#ff9eb5", "#ffc0cb", "#ffaec0", "#ffd1dc", "#ff85a2"];

  return (
    <div className="relative" style={{ width: "200px", height: "300px" }}>
      <div className="trunk-main absolute bottom-0 left-1/2 -translate-x-1/2 rounded-sm"
        style={{ width: "14px", height: "220px", background: "linear-gradient(to top, #4a2c1a, #6b4030, #5a3523)", transformOrigin: "bottom center" }} />
      {branchData.map((b, i) => (
        <div key={i} className="branch absolute"
          style={{
            bottom: b.bottom, left: b.left, width: `${b.width}px`, height: "5px",
            background: `linear-gradient(${b.rotate < 0 ? 'to left' : 'to right'}, #5a3523, #7a5035)`,
            borderRadius: "3px", transform: `rotate(${b.rotate}deg)`, transformOrigin: "center center",
          }} />
      ))}
      {blossomPositions.map((pos, i) => {
        const color = colors[i % colors.length];
        const size = 10 + ((i * 7 + 3) % 8);
        return (
          <div key={i} className="blossom-flower absolute rounded-full"
            style={{
              bottom: pos.bottom, left: `calc(50% + ${pos.left})`,
              width: `${size}px`, height: `${size}px`,
              background: `radial-gradient(circle, white 15%, ${color} 50%, ${color}90 100%)`,
              boxShadow: `0 0 ${size / 2}px ${color}80`,
            }} />
        );
      })}
    </div>
  );
}

function createFallingPetals(el: HTMLDivElement | null) {
  if (!el) return;
  const colors = ["#ffb7c5", "#ff9eb5", "#ffc0cb", "#ffd1dc", "#ff85a2"];

  for (let i = 0; i < 40; i++) {
    const petal = document.createElement("div");
    petal.className = "falling-petal";
    const size = 6 + Math.random() * 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    petal.style.cssText = `
      width:${size}px; height:${size * 1.2}px;
      background:${color};
      border-radius: 50% 50% 50% 0;
      left:${Math.random() * 100}%;
      top:-20px;
      opacity:${0.5 + Math.random() * 0.5};
      animation-duration:${4 + Math.random() * 6}s;
      animation-delay:${Math.random() * 3}s;
    `;
    el.appendChild(petal);
    setTimeout(() => petal.remove(), 12000);
  }
}

function launchFireworks(el: HTMLDivElement | null) {
  if (!el) return;
  const target = el;
  const fwColors = ["#d4a853", "#e8457a", "#ffb7c5", "#ff6b9d", "#ffd700", "#ff4500", "#00ff88", "#7b68ee"];

  function createFirework(cx: number, cy: number) {
    const count = 30 + Math.floor(Math.random() * 20);
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "firework-particle";
      const size = 3 + Math.random() * 4;
      const color = fwColors[Math.floor(Math.random() * fwColors.length)];
      particle.style.cssText = `
        width:${size}px; height:${size}px;
        background:${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        left:${cx}px; top:${cy}px;
      `;
      target.appendChild(particle);
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 60 + Math.random() * 120;
      gsap.to(particle, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 30,
        opacity: 0, scale: 0,
        duration: 1 + Math.random() * 0.8,
        ease: "power2.out",
        onComplete: () => particle.remove(),
      });
    }
  }

  const positions = [
    { x: 0.2, y: 0.2 }, { x: 0.8, y: 0.15 }, { x: 0.5, y: 0.1 },
    { x: 0.3, y: 0.25 }, { x: 0.7, y: 0.3 }, { x: 0.15, y: 0.35 }, { x: 0.85, y: 0.25 },
  ];

  positions.forEach((pos, i) => {
    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      createFirework(rect.width * pos.x, rect.height * pos.y);
    }, i * 400);
  });
}

export default function Home() {
  const [scene, setScene] = useState<"landing" | "toAnim" | "animation" | "toLanding">("landing");
  const [recipientName, setRecipientName] = useState("Dragostea Mea");
  const audio = useAudioPlayer();

  const handleTryDemo = useCallback(() => {
    setRecipientName("Dragostea Mea");
    setScene("toAnim");
    setTimeout(() => setScene("animation"), 600);
  }, []);

  const handlePersonalize = useCallback((name: string) => {
    setRecipientName(name);
    setScene("toAnim");
    setTimeout(() => setScene("animation"), 600);
  }, []);

  const handleBack = useCallback(() => {
    audio.stop();
    setScene("toLanding");
    setTimeout(() => setScene("landing"), 600);
  }, [audio]);

  const isLanding = scene === "landing" || scene === "toLanding";

  return (
    <main className="relative min-h-screen bg-[#0a0a0f]">
      {isLanding && <ThreeBackground />}
      {isLanding && <ParallaxStars />}

      {scene === "toAnim" || scene === "toLanding" ? (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0f] flex items-center justify-center scene-enter">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#d4a853] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#8a8a9a]" style={{ fontFamily: "'Dancing Script', cursive" }}>
              {scene === "toAnim" ? "Se pregătește magia..." : "Înapoi la ScrisoriMagice..."}
            </p>
          </div>
        </div>
      ) : null}

      {(scene === "landing" || scene === "toLanding") && (
        <div className={scene === "toLanding" ? "scene-exit" : "scene-enter"}>
          <HeroSection onTryDemo={handleTryDemo} onPersonalize={handlePersonalize} />
        </div>
      )}

      {(scene === "animation" || scene === "toAnim") && (
        <div className={scene === "animation" ? "scene-enter" : ""}>
          {scene === "animation" && (
            <AnimationScene name={recipientName} onBack={handleBack} audio={audio} />
          )}
        </div>
      )}
    </main>
  );
}
