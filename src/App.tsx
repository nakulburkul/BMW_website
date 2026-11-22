import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ArrowRight,
  ChevronRight,
  Info,
  Sparkles,
  Eye,
  Sliders,
  Cpu,
  Volume2,
  X,
  Check,
  MapPin,
  Calendar,
  Layers,
  Zap
} from 'lucide-react';
import { M4Color, SpecItem, ViewMode } from './types';
import M4Logo from './components/M4Logo';
import SpecsGrid from './components/SpecsGrid';
import ColorSelector from './components/ColorSelector';
import EngineSound from './components/EngineSound';
import TelemetrySection from './components/TelemetrySection';
import MPerformanceTuner from './components/MPerformanceTuner';
import NakulBanner from './components/NakulBanner';
import ScrollAnimationCanvas from './components/ScrollAnimationCanvas';

const FadeInSection = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-10%" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Premium M4 color lineup
const COLORS: M4Color[] = [
  {
    id: 'isle-of-man-green',
    name: 'Isle of Man Green',
    hex: '#014134',
    imageUrl: '/green.jpg',
    desc: 'The signature launch paint. A deep metallic emerald green that changes dramatically under studio spotlights.',
    price: '$1,500',
    glowColor: 'rgba(1, 65, 52, 0.45)',
  },
  {
    id: 'alpine-white',
    name: 'Alpine White',
    hex: '#f7f9fa',
    imageUrl: '/alphine_white.png',
    desc: 'A stark, pure non-metallic gloss white that emphasizes the raw athletic lines of the M Carbon aerodynamic kit.',
    price: '$0',
    glowColor: 'rgba(255, 255, 255, 0.25)',
  },
  {
    id: 'toronto-red',
    name: 'Toronto Red',
    hex: '#a81616',
    imageUrl: '/red.jpg',
    desc: 'An intensive, fiery metallic red saturated with orange undertones. Born for maximum racetrack visibility.',
    price: '$1,500',
    glowColor: 'rgba(168, 22, 22, 0.45)',
  },
  {
    id: 'brooklyn-grey',
    name: 'Brooklyn Grey',
    hex: '#75828d',
    imageUrl: '/grey.jpg',
    desc: 'A modern, ultra-cool solid grey that delivers a stealthy, concrete-toned fighter jet presence.',
    price: '$1,500',
    glowColor: 'rgba(117, 130, 141, 0.4)',
  },
  {
    id: 'black-sapphire',
    name: 'Black Sapphire',
    hex: '#141517',
    imageUrl: '/black.jpg',
    desc: 'An aggressive, deep metallic black with subtle blue-purple flakes. Ultimate stealth on the street.',
    price: '$1,500',
    glowColor: 'rgba(255, 255, 255, 0.15)',
  },
];

// Technical specifications
const SPECS: SpecItem[] = [
  { label: 'Max Power', value: '503', unit: 'HP' },
  { label: '0-60 MPH', value: '3.4', unit: 'SEC' },
  { label: 'Max Torque', value: '479', unit: 'LB-FT' },
  { label: 'Engine S58', value: '3.0', unit: 'L' },
  { label: 'Top Speed', value: '180', unit: 'MPH' },
];

export default function App() {
  const [activeColor, setActiveColor] = useState<M4Color>(COLORS[1]); // Default Alpine White
  const [viewMode, setViewMode] = useState<ViewMode>('exterior');

  // Live clock display for Operator card
  const [currentTime, setCurrentTime] = useState<string>('09:49 PM');

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minStr = minutes < 10 ? '0' + minutes : minutes;
      const hrStr = hours < 10 ? '0' + hours : hours;
      setCurrentTime(`${hrStr}:${minStr} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(false);
  const [activeNavLink, setActiveNavLink] = useState<string>('Models');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Configurator Modal States
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState<boolean>(false);
  const [selectedWheels, setSelectedWheels] = useState<string>('826m');
  const [carbonKitSelected, setCarbonKitSelected] = useState<boolean>(true);
  const [selectedInterior, setSelectedInterior] = useState<string>('orange');

  // Custom visual views
  const getDisplayImage = () => {
    switch (viewMode) {
      case 'performance':
        // Headlights detail image
        return 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1600';
      case 'cockpit':
        // Cockpit interior image
        return 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1600';
      case 'exterior':
      default:
        return activeColor.imageUrl;
    }
  };

  const getPriceSum = () => {
    let base = 79100;
    if (activeColor.id !== 'alpine-white') base += 1500;
    if (selectedWheels === '827m') base += 2200;
    if (carbonKitSelected) base += 4700;
    if (selectedInterior === 'yas-marina') base += 1200;
    return base;
  };

  return (
    <div
      id="app-container"
      className="min-h-screen text-white relative flex flex-col font-sans selection:bg-white selection:text-black"
    >
      <ScrollAnimationCanvas />

      {/* BACKGROUND DECORATIONS: Pure Plain Black Theme as requested, with a subtle glow strictly matching selected car */}
      <div
        id="ambient-glow"
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full filter blur-[150px] transition-all duration-1000 opacity-20 pointer-events-none"
        style={{ backgroundColor: activeColor.hex === '#f7f9fa' ? 'rgba(255,255,255,0.4)' : activeColor.hex }}
      />

      {/* M Division Minimalist Stripes Accents (Top Right background decoration) */}
      <div id="m-stripes-accent" className="absolute top-28 right-12 flex flex-col gap-1.5 opacity-40 z-0 pointer-events-none hidden lg:flex">
        <div className="w-24 h-1 bg-[#0066B1]"></div>
        <div className="w-24 h-1 bg-[#000080]"></div>
        <div className="w-24 h-1 bg-[#FF0000]"></div>
      </div>

      {/* Sophisticated Side Decoration Rail */}
      <div id="side-decoration-rail" className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-20 items-center opacity-25 z-20 pointer-events-none hidden xl:flex">
        <span className="rotate-90 text-[9px] tracking-[0.8em] uppercase whitespace-nowrap text-white font-mono font-medium">THE ULTIMATE DRIVING MACHINE</span>
        <div className="h-24 w-[1px] bg-white/40"></div>
      </div>



      {/* TOP NAVIGATION HEADER */}
      <header id="main-header" className="relative z-20 px-6 py-8 md:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        {/* BMW Roundel and M Brand */}
        <div id="brand-logo-group" className="flex items-center gap-4">
          <svg
            id="bmw-roundel-svg"
            className="w-10 h-10 cursor-pointer hover:opacity-90 transition-opacity"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="46" fill="black" stroke="#ffffff" strokeWidth="2.2" />
            <circle cx="50" cy="50" r="32" fill="#000000" stroke="#ffffff" strokeWidth="1" />
            
            <path d="M 50 18 A 32 32 0 0 1 82 50 L 50 50 Z" fill="#0066B1" />
            <path d="M 50 50 L 82 50 A 32 32 0 0 1 50 82 Z" fill="#ffffff" />
            <path d="M 50 50 L 50 82 A 32 32 0 0 1 18 50 Z" fill="#0066B1" />
            <path d="M 18 50 A 32 32 0 0 1 50 18 L 50 50 Z" fill="#ffffff" />

            <text x="31" y="16" fill="#ffffff" fontSize="10.5" fontWeight="900" transform="rotate(-32, 31, 16)" fontFamily="sans-serif">B</text>
            <text x="50" y="12" fill="#ffffff" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">M</text>
            <text x="69" y="16" fill="#ffffff" fontSize="10.5" fontWeight="900" transform="rotate(32, 69, 16)" fontFamily="sans-serif">W</text>
          </svg>

          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-white">Bayerische Motoren Werke</span>
            <span className="text-[9px] text-white/40 tracking-widest uppercase">// M DIVISION / PROJECT 2026</span>
          </div>

          <M4Logo size="sm" className="hidden sm:flex border-l border-white/20 pl-4" />
        </div>

        {/* Menu Items */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase">
          {['Home', 'Models', 'Offers', 'Contact'].map((link) => (
            <button
              id={`nav-link-${link.toLowerCase()}`}
              key={link}
              onClick={() => setActiveNavLink(link)}
              className={`transition-colors relative py-1.5 ${
                activeNavLink === link ? 'text-white font-bold' : 'text-white/40 hover:text-white/80'
              }`}
            >
              {link}
              {activeNavLink === link && (
                <motion.span
                  id="nav-link-underline"
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Search Toggle */}
        <div id="search-container" className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end border-r border-white/15 pr-6">
            <span className="text-[9px] tracking-[0.25em] text-white/40 uppercase font-mono">SPECIFICATION CONTROL</span>
            <span className="text-xs font-bold text-white uppercase tracking-widest">EDITION 2026</span>
          </div>

          <motion.div
            id="search-input-motion-wrapper"
            animate={{ width: searchOpen ? 220 : 0, opacity: searchOpen ? 1 : 0 }}
            className="overflow-hidden relative"
          >
            <input
              id="search-input-field"
              type="text"
              placeholder="Search BMW models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/10 text-white border border-white/10 rounded-none px-4 py-1.5 text-xs focus:outline-none w-full tracking-wide pr-8"
            />
            {searchQuery && (
              <button
                id="search-clear-button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
          <button
            id="search-toggle-button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 rounded-none border border-white/10 hover:bg-white/5 text-white hover:text-white transition-all"
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* CORE HERO SECTION */}
      <main id="hero-main" className="flex-1 grid grid-cols-1 lg:grid-cols-12 px-6 md:px-12 py-6 md:py-10 gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Narrative & Configuration Controls */}
        <div id="left-column-container" className="lg:col-span-5 flex flex-col justify-center gap-6 md:gap-8 h-full">
          
          {/* Price Tag & Badging */}
          <div id="pricing-badge-row" className="flex items-center gap-4">
            <span
              id="price-text"
              className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase"
            >
              Cost $79,100 MSRP
            </span>
            <div id="divider-dot" className="w-1.5 h-1.5 rounded-full bg-[#FF0000]" />
            <span
              id="m-badge-text"
              className="text-xs font-bold tracking-[0.2em] text-[#0066B1] uppercase flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" /> M xDrive
            </span>
          </div>

          {/* Bold Header block */}
          <div id="hero-heading-block" className="flex flex-col gap-1 select-none">
            <motion.h1
              id="heading-brand"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-[84px] font-black leading-[0.85] tracking-tighter text-white uppercase font-sans"
            >
              BMW M4<br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px white', textStroke: '1.5px white' }}>COMPETITION</span>
            </motion.h1>
            <div className="flex items-center gap-3 mt-3">
              <M4Logo size="md" />
              <span className="text-xs font-mono tracking-widest text-white/40 uppercase">// S58 BI-TURBO ENGINE</span>
            </div>
          </div>

          {/* Description Paragraph */}
          <motion.p
            id="car-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 text-sm md:text-base font-light leading-relaxed max-w-lg"
          >
            {viewMode === 'exterior' && (
              <>
                Uncompromising dynamics and high-precision handling. The BMW M4 Competition Coupe sets the absolute gold standard for high-performance sports cars. Equipped with a {activeColor.desc}
              </>
            )}
            {viewMode === 'performance' && (
              <>
                Engineered for adrenaline. The track-ready high-performance chassis, combined with adaptive M Suspension, provides exceptional mechanical grip and razor-sharp steering feedback.
              </>
            )}
            {viewMode === 'cockpit' && (
              <>
                A perfect fusion of luxurious craftsmanship and track ergonomics. Experience absolute control with M Carbon bucket seats, the customizable M Head-Up Display, and carbon paddle shifters.
              </>
            )}
          </motion.p>

          {/* View Mode Pill Selectors */}
          <div id="view-mode-selector" className="flex items-center gap-2 border-b border-white/10 pb-5">
            {(['exterior', 'performance', 'cockpit'] as ViewMode[]).map((mode) => (
              <button
                id={`view-mode-${mode}`}
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all rounded-none border ${
                  viewMode === mode
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/50 border-white/15 hover:border-white/40 hover:text-white'
                }`}
              >
                {mode === 'exterior' && 'Exterior View'}
                {mode === 'performance' && 'Laser Light Show'}
                {mode === 'cockpit' && 'M Cockpit'}
              </button>
            ))}
          </div>

          {/* Interactive Color selection Swatches - only shown when in exterior view */}
          <AnimatePresence mode="wait">
            {viewMode === 'exterior' && (
              <motion.div
                id="swatches-animate-container"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ColorSelector
                  colors={COLORS}
                  activeColor={activeColor}
                  onChangeColor={(color) => {
                    setActiveColor(color);
                    // If black, maybe turn on headlights for dynamic look
                    if (color.id === 'black-sapphire') {
                      setHeadlightsOn(true);
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Headlights Interactive Feature Toggle */}
          <div id="headlight-toggle-group" className="flex items-center justify-between p-4 border border-white/15 rounded-none bg-black/60">
            <div id="headlight-info-col" className="flex items-center gap-2.5">
              <Eye className={`w-5 h-5 ${headlightsOn ? 'text-blue-400' : 'text-white/40'}`} />
              <div>
                <span id="headlight-label" className="text-xs font-bold text-white uppercase block tracking-[0.1em]">Adaptive Laser Headlights</span>
                <span id="headlight-desc" className="text-[10px] text-white/40 font-mono block">Daytime running icon illumination</span>
              </div>
            </div>
            <button
              id="headlight-toggle-button"
              onClick={() => setHeadlightsOn(!headlightsOn)}
              className={`w-12 h-6 rounded-none p-0.5 transition-all ${
                headlightsOn ? 'bg-[#0066B1]' : 'bg-white/10'
              }`}
            >
              <div
                id="headlight-toggle-dot"
                className={`w-5 h-5 rounded-none bg-white transition-all transform ${
                  headlightsOn ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Web Audio Ignition sound board */}
          <EngineSound />

          {/* Glassmorphic Information Cards */}
          <div id="left-glass-info-cards" className="grid grid-cols-2 gap-3">
            <div id="info-card-1" className="backdrop-blur-md bg-white/[0.02] border border-white/10 p-3.5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 rounded-none flex flex-col justify-between min-h-[140px]">
              <div>
                <div className="flex items-center gap-2 mb-1.5 text-blue-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider">M Chassis</span>
                </div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-wider mb-1">Adaptive M Setup</h5>
                <p className="text-[9px] text-white/45 leading-relaxed">
                  8-speed Drivelogic automatic gearbox. Millisecond damper response adapts instantly to track topography.
                </p>
              </div>
              <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest mt-2 border-t border-white/5 pt-1.5">
                // SYSTEM: OPERATIONAL
              </div>
            </div>

            {/* Active Operator Introduction Card */}
            <div id="info-card-active-operator" className="backdrop-blur-md bg-white/[0.02] border border-white/10 p-3.5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 rounded-none flex flex-col justify-between min-h-[140px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <div className="flex justify-between items-start gap-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] font-mono text-white/30 tracking-wider uppercase">Active Operator</span>
                  <h4 className="text-[13px] font-black text-white uppercase tracking-tight">Nakul Burkul</h4>
                  <p className="text-[8px] text-white/45 leading-normal uppercase font-mono mt-0.5">
                    // Stay focused. Push limits. Dominate the track.
                  </p>
                </div>
                <div className="font-mono text-[8px] font-bold text-white/50 px-1.5 py-0.5 bg-white/5 border border-white/10 shrink-0">
                  {currentTime}
                </div>
              </div>

              {/* Glowing neon vector loop mimicking the line chart under name in image */}
              <div className="w-full h-8 relative mt-2">
                <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <defs>
                    <filter id="blue-glow-line-left">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path 
                    d="M 0 30 Q 30 10 60 25 T 120 15 T 180 32 T 200 10" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="2.5" 
                    filter="url(#blue-glow-line-left)"
                    className="animate-pulse"
                  />
                  <circle cx="60" cy="25" r="3" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #3b82f6)' }} />
                  <circle cx="120" cy="15" r="3" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #3b82f6)' }} />
                </svg>
              </div>
            </div>
          </div>

          {/* Configure CTA Button */}
          <div id="cta-group" className="flex items-center gap-4 mt-2">
            <motion.button
              id="main-configure-cta"
              onClick={() => setIsConfiguratorOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-white text-black font-extrabold text-xs md:text-sm tracking-[0.25em] uppercase px-8 py-4 rounded-none flex items-center justify-center gap-2 hover:bg-transparent hover:text-white border border-white transition-all duration-300 cursor-pointer shadow-md"
            >
              Configure Yours
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <button
              id="spec-info-cta"
              onClick={() => {
                const specSection = document.getElementById('technical-specs-section');
                if (specSection) {
                  specSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-4 rounded-none border border-white/15 hover:bg-white/5 text-white/80 hover:text-white transition-all"
              title="Technical Data"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Highly polished, overlapping car showcase */}
        <div id="right-column-container" className="lg:col-span-7 flex flex-col justify-center items-center h-full relative min-h-[350px] lg:min-h-[500px]">
          
          {/* Active Color Palette Overlay Name tag on right background */}
          <div
            id="right-brand-watermark"
            className="absolute top-[10%] left-0 text-white/[0.02] font-black text-7xl md:text-8xl select-none uppercase tracking-widest pointer-events-none hidden lg:block"
          >
            COMPETITION
          </div>

          {/* Outer Showcase Canvas */}
          <div id="car-canvas-frame" className="w-full h-full relative flex items-center justify-center">
            
            {/* Ambient dynamic shadow under the vehicle */}
            <div
              id="car-floor-shadow"
              className="absolute bottom-[10%] w-[80%] h-12 bg-black rounded-full filter blur-xl opacity-80 z-0 pointer-events-none"
            />

            {/* Glowing Laser Light Beam simulation */}
            <AnimatePresence>
              {headlightsOn && (
                <motion.div
                  id="laser-beams-simulation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none z-10 mix-blend-screen overflow-hidden"
                >
                  {viewMode === 'performance' ? (
                    /* THEATRICAL INTERACTIVE LASER SHOW IN PERFORMANCE VIEW MODE */
                    <div id="theatrical-laser-show" className="absolute inset-0">
                      {/* 1. M Division Blue Sweep Laser */}
                      <div 
                        id="theatrical-beam-blue"
                        className="absolute top-[48%] left-[25%] w-[70%] h-[15%] bg-gradient-to-r from-transparent via-[#0066B1]/20 to-[#0066B1]/70 origin-left rotate-[10deg] filter blur-sm"
                        style={{ animation: 'laserSweep 3s infinite alternate ease-in-out' }}
                      />
                      
                      {/* 2. M Division Purple Sweep Laser */}
                      <div 
                        id="theatrical-beam-purple"
                        className="absolute top-[52%] left-[36%] w-[60%] h-[12%] bg-gradient-to-r from-transparent via-[#8b5cf6]/25 to-[#a855f7]/70 origin-left rotate-[-5deg] filter blur-sm"
                        style={{ animation: 'laserSweepOpposite 4s infinite alternate ease-in-out' }}
                      />
                      
                      {/* 3. M Division Red Sweep Laser */}
                      <div 
                        id="theatrical-beam-red"
                        className="absolute top-[49%] left-[30%] w-[65%] h-[10%] bg-gradient-to-r from-transparent via-[#FF0000]/15 to-[#FF0000]/75 origin-left rotate-[22deg] filter blur-xs"
                        style={{ animation: 'laserSweepFast 2s infinite alternate ease-in-out' }}
                      />

                      {/* Moving Ambient Laser Scanlines */}
                      <div 
                        id="scanline-1"
                        className="absolute bottom-[20%] left-0 right-0 h-[2px] bg-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.7)]"
                        style={{ animation: 'scanlineMove 5s infinite linear' }}
                      />
                      <div 
                        id="scanline-2"
                        className="absolute bottom-[35%] left-0 right-0 h-[1.5px] bg-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                        style={{ animation: 'scanlineMoveOpposite 6s infinite linear' }}
                      />

                      {/* High-intensity Headlamp Flares */}
                      <div id="flare-left" className="absolute top-[48%] left-[24%] w-10 h-10 rounded-full bg-cyan-300 filter blur-[15px] animate-pulse" />
                      <div id="flare-right" className="absolute top-[52%] left-[35%] w-10 h-10 rounded-full bg-indigo-400 filter blur-[15px] animate-pulse" />
                    </div>
                  ) : (
                    /* STANDARD COMPACT DAYTIME DRIVING BEAMS */
                    <>
                      {/* Angled glowing gradients representing actual front headlamps */}
                      <div
                        id="beam-left"
                        className="absolute top-[48%] left-[25%] w-[45%] h-[30%] bg-gradient-to-tr from-transparent via-blue-500/10 to-blue-300/35 origin-top-left transform -skew-x-12 filter blur-md"
                      />
                      <div
                        id="beam-right"
                        className="absolute top-[52%] left-[40%] w-[45%] h-[20%] bg-gradient-to-tr from-transparent via-blue-500/5 to-blue-300/25 origin-top-left transform -skew-x-6 filter blur-md"
                      />
                      
                      {/* Floating particles represent atmospheric lighting */}
                      <div id="laser-particles-glow" className="absolute top-[48%] left-[20%] w-4 h-4 bg-blue-400 rounded-full filter blur-[15px] animate-pulse" />
                      <div id="laser-particles-glow-r" className="absolute top-[52%] left-[36%] w-4 h-4 bg-blue-400 rounded-full filter blur-[15px] animate-pulse" />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Interactive Image Frame */}
            {viewMode !== 'exterior' && (
              <motion.div
              id="car-image-container"
              key={viewMode + (viewMode === 'exterior' ? activeColor.id : '')}
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-2xl relative z-10 flex items-center justify-center p-4"
            >
              <img
                id="showcase-car-image"
                src={getDisplayImage()}
                alt={`BMW M4 Competition ${activeColor.name}`}
                className="w-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                referrerPolicy="no-referrer"
              />
              </motion.div>
            )}

             {/* View Mode HUD labels overlaying on Right Side */}
            <div id="hud-labels" className="absolute bottom-4 right-4 flex flex-col items-end gap-1.5 z-20 bg-black/80 backdrop-blur-md border border-white/15 rounded-none p-4">
              <span id="hud-name" className="text-[9px] tracking-[0.2em] text-white/40 uppercase font-mono font-bold">ACTIVE SELECTION</span>
              <span id="hud-value" className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                {viewMode === 'exterior' ? `M4 - ${activeColor.name}` : `M4 - ${viewMode}`}
              </span>
            </div>

            {/* Navigation Dots representing color palette index */}
            {viewMode === 'exterior' && (
              <div id="carousel-dots" className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
                {COLORS.map((color, index) => (
                  <button
                    id={`carousel-dot-${color.id}`}
                    key={color.id}
                    onClick={() => setActiveColor(color)}
                    className={`h-1 rounded-none transition-all ${
                      activeColor.id === color.id ? 'w-6 bg-white' : 'w-2 bg-white/20 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </main>

      {/* SECTION 2: HIGH-PERFORMANCE INTERACTIVE TELEMETRY & ANALYTICS */}
      <FadeInSection>
        <TelemetrySection />
      </FadeInSection>

      {/* SECTION 3: M PERFORMANCE PARAMETERS TUNER */}
      <FadeInSection>
        <MPerformanceTuner />
      </FadeInSection>

      {/* SECTION 4: INTRODUCTORY PORTFOLIO BANNER */}
      <FadeInSection>
        <NakulBanner />
      </FadeInSection>

      {/* LOWER FULL-WIDTH TECHNICAL SPECIFICATIONS GRID */}
      <FadeInSection>
        <section
          id="technical-specs-section"
          className="relative z-10 border-t border-white/10 px-6 md:px-12 py-16 bg-black/40 backdrop-blur-md flex flex-col gap-8"
        >
          <div id="specs-header" className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3
                id="specs-section-title"
                className="text-lg md:text-xl font-black tracking-[0.2em] text-white uppercase"
              >
                M performance parameters
              </h3>
              <p id="specs-section-subtitle" className="text-xs text-white/40 mt-1.5 font-mono tracking-wider uppercase">
                // Precision metrics engineered for dominant racetrack performance.
              </p>
            </div>
            <div id="specs-logo-col" className="flex items-center gap-4">
              <M4Logo size="md" />
              <span id="specs-engine-name" className="text-xs font-mono tracking-widest text-white/40 uppercase">// BMW S58 TWIN-TURBO INLINE-6</span>
            </div>
          </div>

          {/* Specifications Grid Component */}
          <SpecsGrid specs={SPECS} />
        </section>
      </FadeInSection>

      {/* FOOTER METADATA */}
      <footer id="main-footer" className="relative z-10 border-t border-white/5 px-6 md:px-12 py-8 bg-black/40 backdrop-blur-md text-center flex flex-col sm:flex-row justify-between items-center gap-4">
        <span id="footer-copyright" className="text-[10px] text-white/30 tracking-widest uppercase">
          © {new Date().getFullYear()} BMW NORTH AMERICA, LLC. THE BMW NAME, MODEL NAMES AND LOGOS ARE REGISTERED TRADEMARKS.
        </span>
        <div id="footer-links" className="flex items-center gap-6">
          <a id="footer-link-privacy" href="#" className="text-[10px] text-white/30 hover:text-white transition-colors tracking-widest uppercase">Privacy Policy</a>
          <a id="footer-link-terms" href="#" className="text-[10px] text-white/30 hover:text-white transition-colors tracking-widest uppercase">Terms of Use</a>
          <a id="footer-link-cookies" href="#" className="text-[10px] text-white/30 hover:text-white transition-colors tracking-widest uppercase">Cookie Settings</a>
        </div>
      </footer>

      {/* OUTRO SECTION (Displays hero-like text at the end) */}
      <section className="relative z-10 w-full min-h-[100vh] flex flex-col justify-center px-6 md:px-12 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto"
        >
          <div className="flex flex-col gap-1 select-none">
            <h1 className="text-5xl md:text-7xl lg:text-[84px] font-black leading-[0.85] tracking-tighter text-white uppercase font-sans drop-shadow-2xl">
              BMW M4<br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px white', textStroke: '1.5px white' }}>COMPETITION</span>
            </h1>
            
            <p className="text-white/80 mt-6 text-sm md:text-base font-light leading-relaxed max-w-lg drop-shadow-md">
              Leave compromise in the rearview. The absolute standard. No exceptions.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
              <button 
                onClick={() => setIsConfiguratorOpen(true)}
                className="group relative overflow-hidden bg-white text-black font-extrabold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-none border-2 border-white hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer flex items-center gap-2"
              >
                <span className="relative z-10">BUILD YOUR OWN</span>
                <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
              </button>

              <button 
                className="group relative overflow-hidden bg-transparent text-white font-extrabold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-none border-2 border-white/30 hover:border-white transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <span className="relative z-10">START THE ENGINE</span>
                <Zap className="w-4 h-4 relative z-10 text-white/50 group-hover:text-white transition-colors" />
                <div className="absolute inset-0 bg-white/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
              </button>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-16 flex flex-col gap-1.5 max-w-sm relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white drop-shadow-md">Join the Inner Circle.</h3>
              <p className="text-[11px] text-white/50 mb-3 leading-relaxed">
                Get the latest updates on M performance parts and exclusive track events.
              </p>
              <div className="relative w-full">
                <input 
                  type="email" 
                  placeholder="Enter your email address." 
                  className="w-full bg-black/20 backdrop-blur-sm border border-white/20 text-white text-xs py-3 pl-4 pr-12 focus:outline-none focus:border-white focus:bg-black/40 transition-all placeholder:text-white/30 rounded-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]"
                />
                <button 
                  className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer text-white border-l border-white/20"
                  aria-label="Submit email"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MODAL: INTERACTIVE CONFIGURATOR */}
      <AnimatePresence>
        {isConfiguratorOpen && (
          <motion.div
            id="configurator-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              id="configurator-modal"
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              className="bg-black border border-white/20 rounded-none w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 md:p-8 flex flex-col gap-8 relative text-white"
            >
              {/* Close Button */}
              <button
                id="close-configurator"
                onClick={() => setIsConfiguratorOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-none border border-white/15 hover:bg-white/5 text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div id="modal-header" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/15">
                <div>
                  <h2 className="text-xl md:text-2xl font-black tracking-widest uppercase">M Performance Configuration</h2>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
