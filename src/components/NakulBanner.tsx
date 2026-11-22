import React from 'react';
import { motion } from 'motion/react';
import {
  Github,
  Linkedin,
  Mail,
  Compass,
  ArrowUpRight,
  Sparkles,
  Monitor,
  BrainCircuit,
  Layers
} from 'lucide-react';

export default function NakulBanner() {
  return (
    <section
      id="nakul-portfolio-banner"
      className="relative z-10 border-t border-white/10 px-6 md:px-12 py-24 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center min-h-[600px]"
    >

      {/* 
        CHATGPT NEURAL FUTURE NETWORK BACKGROUND 
        Combines a modern tech grid with deep violet-blue node points resembling 
        an advanced AI canvas or neural network.
      */}


      {/* MASSIVE WATERMARK DISPLAY BACKGROUND TEXT (Sultan Karimi Style) */}
      <div
        id="banner-giant-watermark"
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-white/[0.02] font-black text-7xl md:text-9xl xl:text-[180px] select-none uppercase tracking-[0.15em] pointer-events-none z-0 font-sans leading-none"
      >
        CREATIVE
      </div>

      {/* CORE PORTFOLIO GLASS BANNER FRAME */}
      <div
        id="portfolio-banner-card"
        className="relative z-10 w-full max-w-5xl backdrop-blur-3xl bg-black/50 border border-white/15 rounded-[28px] overflow-hidden shadow-[0_40px_100px_rgba(110,68,255,0.1),_inset_0_1px_2px_rgba(255,255,255,0.12)] grid grid-cols-1 lg:grid-cols-12 items-stretch"
      >
        {/* Glossy overlay sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.03] pointer-events-none" />

        {/* LEFT COLUMN: INTRODUCTION & BIO CONTENT (7 cols) */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between gap-10 relative z-10">

          {/* Header Track labels */}
          <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-6 text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
            <span>FRONTEND ARCHITECTURE</span>
            <span>•</span>
            <span>UI/UX INNOVATION</span>
            <span>•</span>
            <span>PORTFOLIO PLATFORM</span>
          </div>

          {/* Main Title Block */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#0066B1]">
              <Sparkles className="w-4 h-4 fill-current animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold">MEET THE DESIGNER</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none">
              NAKUL BURKUL
            </h2>

            <span className="text-sm md:text-base font-medium tracking-[0.25em] text-[#0066B1] uppercase font-sans mt-1">
              STUDENT & CREATIVE WEB DESIGNER
            </span>
          </div>

          {/* Core Biography Paragraph */}
          <p className="text-white/60 text-sm md:text-base font-light leading-relaxed max-w-xl">
            Between code and visual strategy lies the space where I build. As a designer and student,
            my work revolves around absolute clarity, high-end structure, and interactive engineering.
            I build responsive, high-performance web applications that bridge clean typography with immersive, tactile layout experiences.
          </p>

          {/* Social Links & Connections */}
          <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
            <a
              href="https://github.com/nakulburkul"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              <Github className="w-4 h-4" />
              GitHub Profile
              <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
            </a>

            <a
              href="https://linkedin.com/in/nakulburkul"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn Connect
              <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
            </a>

            <a
              href="mailto:nakulburkul@gmail.com"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>

        </div>

        {/* RIGHT COLUMN: HIGH-POLISHED PORTRAIT & WORK SAMPLES (5 cols) */}
        <div className="lg:col-span-5 relative bg-white/[0.01] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between p-8 md:p-10 z-10">

          {/* Top text labels */}
          <div className="text-right select-none hidden lg:block">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] block">DESIGN PHILOSOPHY</span>
            <span className="text-xs font-bold text-white uppercase block mt-1 italic">"Design that speaks. Visuals that convert."</span>
          </div>

          {/* 
            DYNAMIC PORTRAIT FRAME
            Using a premium vector illustration or gorgeous atmospheric portrait 
            that captures Nakul's photo layout (looking side-ways, green sweatshirt, shadow play)
          */}
          <div className="w-full flex items-center justify-center py-6">
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-[20px] overflow-hidden border border-white/15 bg-[#171b12] shadow-2xl group">

              {/* Soft warm shadow overlay recreating his uploaded photo's lighting */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-[#f59e0b]/10 z-10 mix-blend-color-burn" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80 z-10" />

              {/* Real Profile Image: We can use a highly matching, professional portrait of a creative designer looking aside in green shirt, which can also be easily overwritten by him! */}
              <img
                src="/profile.png"
                alt="Nakul Burkul"
                className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.05] grayscale-[0.1] group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Adaptive floating label in bottom left of portrait */}
              <div className="absolute bottom-4 left-4 z-20 bg-black/85 border border-white/15 px-3 py-1.5 rounded-none text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Freelancer
              </div>
            </div>
          </div>

          {/* Lower Credentials list */}
          <div className="flex flex-col gap-2.5 mt-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pb-2 border-b border-white/5">
              <span>SPECIALTIES</span>
              <span className="text-white font-bold uppercase font-sans">Full Stack Creative</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>BASED IN</span>
              <span className="text-white font-bold uppercase font-sans">India</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
