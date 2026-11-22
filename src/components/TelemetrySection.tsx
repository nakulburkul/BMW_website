import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Gauge, 
  Zap, 
  Compass, 
  ChevronDown, 
  Maximize2, 
  RefreshCw, 
  CornerDownRight, 
  Flame, 
  TrendingUp, 
  SlidersHorizontal 
} from 'lucide-react';

// Data types for different telemetry channels
interface TelemetryPoint {
  sector: string;
  boost: number;   // PSI
  power: number;   // HP
  gforce: number;  // G
  speed: number;   // MPH
  rpm: number;     // RPM
}

const TELEMETRY_DATA: TelemetryPoint[] = [
  { sector: 'Start Line', boost: 8.5, power: 220, gforce: 0.35, speed: 65, rpm: 3800 },
  { sector: 'Hatzenbach', boost: 14.8, power: 390, gforce: 1.15, speed: 112, rpm: 5200 },
  { sector: 'Flugplatz', boost: 11.2, power: 310, gforce: 0.72, speed: 134, rpm: 4600 },
  { sector: 'Fuchsröhre', boost: 20.5, power: 485, gforce: 1.38, speed: 158, rpm: 6400 },
  { sector: 'Adenauer Forst', boost: 15.4, power: 345, gforce: 0.95, speed: 84, rpm: 4900 },
  { sector: 'Karussell', boost: 22.4, power: 503, gforce: 1.55, speed: 72, rpm: 6800 },
  { sector: 'Pflanzgarten', boost: 17.8, power: 410, gforce: 1.22, speed: 128, rpm: 5800 },
  { sector: 'Döttinger Höhe', boost: 21.6, power: 495, gforce: 0.45, speed: 180, rpm: 7100 },
];

type TelemetryStream = 'boost' | 'power' | 'gforce' | 'speed';

export default function TelemetrySection() {
  const [activeStream, setActiveStream] = useState<TelemetryStream>('power');
  const [selectedRun, setSelectedRun] = useState<string>('Hot Lap #3 (Nordschleife)');
  const [selectedSession, setSelectedSession] = useState<string>('Session 1 - Dynamic');
  
  // Dropdown UI toggles
  const [runDropdownOpen, setRunDropdownOpen] = useState<boolean>(false);
  const [sessionDropdownOpen, setSessionDropdownOpen] = useState<boolean>(false);

  // Active hover/scrub coordinate state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  // Auto-simulation pulse to make live gauges "vibrate" with engine revs
  const [simulationOffset, setSimulationOffset] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulationOffset(Math.random() * 0.15 - 0.075);
    }, 180);
    return () => clearInterval(timer);
  }, []);

  // Map metadata for selected streams
  const getStreamMeta = (stream: TelemetryStream) => {
    switch (stream) {
      case 'boost':
        return {
          label: 'Twin-Turbo Boost Pressure',
          maxVal: '22.4',
          unit: 'PSI',
          badge: '↑ 8.3% Overboost Active',
          badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          glowHex: '#06b6d4',
          axisTicks: ['5 PSI', '10 PSI', '15 PSI', '20 PSI', '25 PSI'],
          desc: 'Dynamic compression maps from the custom bi-turbo chargers.',
        };
      case 'gforce':
        return {
          label: 'Lateral Cornering G-Force',
          maxVal: '1.55',
          unit: 'G',
          badge: '↑ 0.12 G Dynamic Grip Threshold',
          badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          glowHex: '#a855f7',
          axisTicks: ['0.4 G', '0.8 G', '1.2 G', '1.6 G', '2.0 G'],
          desc: 'M xDrive torque vectoring and active chassis acceleration loads.',
        };
      case 'speed':
        return {
          label: 'Instantaneous GPS Speed',
          maxVal: '180',
          unit: 'MPH',
          badge: '↑ 4.2% V-Max Limiter Removed',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          glowHex: '#10b981',
          axisTicks: ['40 MPH', '80 MPH', '120 MPH', '160 MPH', '200 MPH'],
          desc: 'High-speed track velocity tracked via multi-satellite telemetry.',
        };
      case 'power':
      default:
        return {
          label: 'Engine Crank Shaft Power',
          maxVal: '503',
          unit: 'HP',
          badge: '↑ 12.4% vs Stock Engine Map',
          badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          glowHex: '#f43f5e',
          axisTicks: ['125 HP', '250 HP', '375 HP', '500 HP', '625 HP'],
          desc: 'S58 inline-6 real-time dynamometer feedback and power output.',
        };
    }
  };

  const meta = getStreamMeta(activeStream);

  // Helpers to draw responsive custom SVG paths with curved bezier lines
  const width = 800;
  const height = 280;
  const paddingX = 40;
  const paddingY = 40;

  const getPointsCoords = () => {
    return TELEMETRY_DATA.map((pt, idx) => {
      // Calculate X coordinate
      const x = paddingX + (idx / (TELEMETRY_DATA.length - 1)) * (width - paddingX * 2);
      
      // Calculate Y coordinate based on active stream value mapped to height range
      let val = 0;
      let maxLimit = 1;
      if (activeStream === 'boost') { val = pt.boost; maxLimit = 25; }
      else if (activeStream === 'power') { val = pt.power; maxLimit = 600; }
      else if (activeStream === 'gforce') { val = pt.gforce; maxLimit = 2.0; }
      else if (activeStream === 'speed') { val = pt.speed; maxLimit = 200; }

      // Map value from [0, maxLimit] to [height - paddingY, paddingY]
      const y = (height - paddingY) - (val / maxLimit) * (height - paddingY * 2);
      return { x, y, value: val, sector: pt.sector, raw: pt };
    });
  };

  const coords = getPointsCoords();

  // Generate cubic bezier curve path for SVG
  const generateBezierPath = () => {
    if (coords.length === 0) return '';
    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      // Control points
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  // Generate area path for gradient filling
  const generateAreaPath = () => {
    const bezier = generateBezierPath();
    if (!bezier) return '';
    return `${bezier} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;
  };

  // Handle graph mouse scrubbing
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    
    // Scale local coordinates
    const scaleX = width / rect.width;
    const localX = clientX * scaleX;

    // Find closest node index
    let closestIdx = 0;
    let minDiff = Infinity;
    coords.forEach((coord, idx) => {
      const diff = Math.abs(coord.x - localX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoveredIndex(closestIdx);
  };

  const activeNode = hoveredIndex !== null ? coords[hoveredIndex] : coords[coords.length - 1];
  const displayValue = activeNode.value + (simulationOffset * (activeStream === 'speed' ? 3 : 0.15));

  return (
    <section 
      id="telemetry-analytics-section"
      className="relative z-10 border-t border-white/10 px-6 md:px-12 py-20 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col items-center gap-12"
    >
      


      {/* BRANDING TOP LABEL HEADER */}
      <div id="telemetry-top-branding" className="relative z-10 text-center select-none flex flex-col items-center gap-2">
        <span 
          id="branding-title" 
          className="text-lg md:text-2xl font-light tracking-[0.4em] text-white uppercase font-sans"
        >
          M T R A C E
        </span>
        <span 
          id="branding-subtitle" 
          className="text-[9px] md:text-xs text-white/40 tracking-[0.25em] uppercase font-mono"
        >
          M COUPE PERFORMANCE INTELLIGENCE PLATFORM
        </span>
      </div>

      {/* CORE GLASSMORPHIC ANALYTICS DASHBOARD CARD */}
      <div
        id="telemetry-dashboard-card"
        className="relative z-10 w-full max-w-5xl backdrop-blur-3xl bg-black/45 border border-white/15 rounded-[24px] shadow-[0_30px_100px_rgba(110,68,255,0.12),_inset_0_1px_2px_rgba(255,255,255,0.12)] p-6 md:p-8 flex flex-col gap-8 transition-all duration-300"
      >
        {/* Sub-card decorative glass reflection gloss effect overlay */}
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.01] pointer-events-none" />

        {/* TOP ROW: Header, Controls & Dynamic Dropdowns */}
        <div id="card-header-row" className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-20">
          
          {/* Section title & description */}
          <div className="flex flex-col gap-1">
            <h4 
              id="telemetry-main-title" 
              className="text-lg md:text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2.5"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
              Dynamic Telemetry Graph
            </h4>
            <span id="telemetry-main-sub" className="text-[10px] md:text-xs text-white/50 font-mono tracking-wider uppercase">
              {meta.label} // Live Session Metrics
            </span>
          </div>

          {/* Fully Interactive Dropdowns for Run and Session */}
          <div className="flex flex-wrap items-center gap-3.5">
            
            {/* Session Dropdown Selector */}
            <div className="relative">
              <button
                id="session-selector-btn"
                onClick={() => {
                  setSessionDropdownOpen(!sessionDropdownOpen);
                  setRunDropdownOpen(false);
                }}
                className="px-4 py-2 text-[10px] md:text-xs font-bold tracking-wider uppercase backdrop-blur-md bg-white/[0.05] border border-white/10 hover:border-white/20 text-white rounded-lg flex items-center gap-2 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] cursor-pointer"
              >
                {selectedSession}
                <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform duration-300 ${sessionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {sessionDropdownOpen && (
                  <motion.div
                    id="session-dropdown-menu"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-1.5 w-52 bg-black/90 backdrop-blur-xl border border-white/15 rounded-lg overflow-hidden shadow-2xl z-40"
                  >
                    {['Session 1 - Dynamic', 'Session 2 - Performance', 'Session 3 - Drift Mode'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedSession(opt);
                          setSessionDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10 ${selectedSession === opt ? 'bg-white/5 border-l-2 border-purple-500 text-purple-400' : ''}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Run / Track Dropdown Selector */}
            <div className="relative">
              <button
                id="run-selector-btn"
                onClick={() => {
                  setRunDropdownOpen(!runDropdownOpen);
                  setSessionDropdownOpen(false);
                }}
                className="px-4 py-2 text-[10px] md:text-xs font-bold tracking-wider uppercase backdrop-blur-md bg-white/[0.05] border border-white/10 hover:border-white/20 text-white rounded-lg flex items-center gap-2 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] cursor-pointer"
              >
                {selectedRun}
                <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform duration-300 ${runDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {runDropdownOpen && (
                  <motion.div
                    id="run-dropdown-menu"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-1.5 w-60 bg-black/90 backdrop-blur-xl border border-white/15 rounded-lg overflow-hidden shadow-2xl z-40"
                  >
                    {[
                      'Hot Lap #3 (Nordschleife)', 
                      'Out Lap - Warmup Tires', 
                      'Laguna Seca Time Trial #1', 
                      'Spa-Francorchamps Run'
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedRun(opt);
                          setRunDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10 ${selectedRun === opt ? 'bg-white/5 border-l-2 border-purple-500 text-purple-400' : ''}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu Options Button */}
            <button 
              id="telemetry-opt-btn"
              className="p-2 backdrop-blur-md bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="More telemetry settings"
            >
              <SlidersHorizontal className="w-4 h-4 text-white/70" />
            </button>

          </div>
        </div>

        {/* CORE STATS & INTERACTIVE CHART PANEL */}
        <div id="telemetry-chart-viewport" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* LEFT: Dynamic Massive Value readout inspired by VIREX dashboard */}
          <div id="stats-hero-col" className="lg:col-span-4 flex flex-col justify-center gap-3">
            <span id="current-label text" className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-mono block">
              {hoveredIndex !== null ? `Sector: ${activeNode.sector}` : 'Peak Metric Record'}
            </span>
            
            {/* Value Digits */}
            <div id="stats-digits-row" className="flex items-baseline gap-2">
              <motion.span 
                id="telemetry-hero-value"
                key={activeStream + (hoveredIndex !== null ? hoveredIndex : '')}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-5xl md:text-6xl font-black italic tracking-tighter text-white font-sans leading-none"
              >
                {activeStream === 'power' 
                  ? Math.round(displayValue).toLocaleString() 
                  : displayValue.toFixed(activeStream === 'boost' ? 1 : 2)}
              </motion.span>
              <span id="telemetry-hero-unit" className="text-sm font-bold text-white/50 uppercase tracking-widest font-sans">
                {meta.unit}
              </span>
            </div>

            {/* Stat comparison badge (matching exact layout of the reference image) */}
            <div className="flex items-center gap-2 mt-1">
              <span 
                id="telemetry-stat-badge"
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${meta.badgeColor}`}
              >
                {meta.badge}
              </span>
            </div>

            {/* Micro details panel */}
            <p id="telemetry-micro-desc" className="text-xs text-white/40 leading-relaxed mt-4 font-light max-w-xs">
              {meta.desc} Use mouse overlay on graph to analyze telemetry sectors on-the-fly.
            </p>
          </div>

          {/* RIGHT: Sophisticated Glow Area Curve Chart */}
          <div id="chart-panel-col" className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Interactive SVG graph frame */}
            <div className="relative w-full overflow-x-auto select-none rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-4">
              
              <svg
                id="telemetry-svg-canvas"
                ref={chartRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto cursor-crosshair min-w-[650px]"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* SVG Definitions for linear gradients and filters */}
                <defs>
                  {/* Neon Line Glowing drop-shadow filter */}
                  <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Gradient for area filling */}
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={meta.glowHex} stopOpacity="0.45" />
                    <stop offset="50%" stopColor={meta.glowHex} stopOpacity="0.12" />
                    <stop offset="100%" stopColor={meta.glowHex} stopOpacity="0.0" />
                  </linearGradient>

                  {/* Gradient for line stroke */}
                  <linearGradient id="chart-stroke-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={`${meta.glowHex}cc`} />
                    <stop offset="50%" stopColor={meta.glowHex} />
                    <stop offset="100%" stopColor={`${meta.glowHex}ee`} />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                {[0.25, 0.5, 0.75].map((ratio, idx) => (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={paddingY + ratio * (height - paddingY * 2)}
                    x2={width - paddingX}
                    y2={paddingY + ratio * (height - paddingY * 2)}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                  />
                ))}

                {/* Area under curve */}
                <path
                  d={generateAreaPath()}
                  fill="url(#chart-area-grad)"
                  className="transition-all duration-500 ease-out"
                />

                {/* Bezier line stroke */}
                <path
                  d={generateBezierPath()}
                  fill="none"
                  stroke="url(#chart-stroke-grad)"
                  strokeWidth="4"
                  filter="url(#neon-glow)"
                  className="transition-all duration-500 ease-out"
                  strokeLinecap="round"
                />

                {/* X-Axis Sectors labels */}
                {coords.map((c, idx) => (
                  <text
                    key={idx}
                    x={c.x}
                    y={height - 12}
                    fill={hoveredIndex === idx ? '#ffffff' : 'rgba(255,255,255,0.35)'}
                    fontSize="10"
                    fontWeight={hoveredIndex === idx ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="font-mono uppercase transition-colors duration-150 tracking-wider"
                  >
                    {c.sector.split(' ')[0]}
                  </text>
                ))}

                {/* Y-Axis Value Labels right-aligned */}
                {meta.axisTicks.map((tick, idx) => {
                  const valRatio = idx / (meta.axisTicks.length - 1);
                  const y = (height - paddingY) - valRatio * (height - paddingY * 2);
                  return (
                    <text
                      key={idx}
                      x={width - 15}
                      y={y + 3}
                      fill="rgba(255,255,255,0.25)"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="end"
                      className="font-mono"
                    >
                      {tick}
                    </text>
                  );
                })}

                {/* Live Vertical tracking line */}
                {hoveredIndex !== null && (
                  <line
                    x1={activeNode.x}
                    y1={paddingY}
                    x2={activeNode.x}
                    y2={height - paddingY}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Inactive or active node marker points */}
                {coords.map((c, idx) => {
                  const isActive = hoveredIndex === idx;
                  const isEnd = idx === coords.length - 1;
                  
                  // Only display active indicators or endpoint indicator to match reference image layout
                  if (!isActive && !isEnd) return null;

                  return (
                    <g key={idx}>
                      {/* Pulse halo ripple effect for the active apex node */}
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={isActive ? 12 : 8}
                        fill={meta.glowHex}
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={isActive ? 6 : 4.5}
                        fill="#ffffff"
                        stroke={meta.glowHex}
                        strokeWidth="3.5"
                        style={{ filter: 'drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.8))' }}
                      />
                    </g>
                  );
                })}
              </svg>

            </div>

            {/* TAB SELECTORS: Dynamic telemetry streams */}
            <div id="telemetry-tabs-container" className="flex flex-wrap gap-2 md:gap-3.5 mt-2">
              {([
                { id: 'power', icon: Zap, label: 'S58 Dyno Power' },
                { id: 'boost', icon: Gauge, label: 'Turbochargers Boost' },
                { id: 'gforce', icon: Compass, label: 'Lateral G Loads' },
                { id: 'speed', icon: Activity, label: 'GPS Racetrack Speed' }
              ] as const).map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = activeStream === tab.id;
                return (
                  <button
                    id={`telemetry-tab-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActiveStream(tab.id)}
                    className={`flex-1 min-w-[130px] flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border text-[11px] font-bold tracking-wider uppercase transition-all duration-300 backdrop-blur-md cursor-pointer ${
                      isSelected
                        ? 'border-white bg-white text-black shadow-lg shadow-white/5'
                        : 'border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:border-white/20 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* BOTTOM BRAND FOOTER (Matching "OWN YOUR NUMBERS. RUN YOUR CLINIC" layout) */}
        <div id="card-footer-group" className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center select-none relative z-10">
          <span 
            id="footer-brand-l"
            className="text-[10px] md:text-xs font-light tracking-[0.35em] text-white/35 uppercase font-sans"
          >
            OWN YOUR METRICS.
          </span>
          <span 
            id="footer-brand-r"
            className="text-[10px] md:text-xs font-light tracking-[0.35em] text-white/35 uppercase font-sans"
          >
            DOMINATE THE TRACK.
          </span>
        </div>

      </div>

      {/* THREE GLASSMORPHIC BENTO WIDGET CARDS FOR EXTRA DATA DENSITY */}
      <div id="telemetry-bento-grid" className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Card 1: Track Heat Analyzer */}
        <div className="backdrop-blur-xl bg-black/45 border border-white/15 rounded-2xl p-5 flex flex-col gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">// TIRE & BRAKE THERMALS</span>
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h5 className="text-base font-bold text-white uppercase tracking-wider">Tyre Temperature</h5>
            <span className="text-xs text-white/45 mt-1 block">Optimal thermal drift friction window.</span>
          </div>
          {/* Mock Heat rings */}
          <div className="flex items-center justify-between gap-2 mt-2">
            {[
              { wheel: 'FL', temp: '194°F', status: 'Optimal', col: 'text-emerald-400' },
              { wheel: 'FR', temp: '202°F', status: 'Optimal', col: 'text-emerald-400' },
              { wheel: 'RL', temp: '215°F', status: 'Overheat', col: 'text-rose-400' },
              { wheel: 'RR', temp: '218°F', status: 'Overheat', col: 'text-rose-400' }
            ].map((wh, idx) => (
              <div key={idx} className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg p-2.5 text-center flex flex-col items-center">
                <span className="text-[9px] font-mono font-bold text-white/35">{wh.wheel}</span>
                <span className={`text-xs font-extrabold mt-1.5 font-sans ${wh.col}`}>{wh.temp}</span>
                <span className="text-[8px] font-bold text-white/40 uppercase mt-0.5">{wh.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Sector Segment Progress */}
        <div className="backdrop-blur-xl bg-black/45 border border-white/15 rounded-2xl p-5 flex flex-col gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">// LAP SPLITS SECTORS</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h5 className="text-base font-bold text-white uppercase tracking-wider">Sector Split Analyzer</h5>
            <span className="text-xs text-white/45 mt-1 block">Real-time gap vs delta target records.</span>
          </div>
          <div className="flex flex-col gap-2.5 mt-2">
            {[
              { id: 'Sector 1 (Fuchsröhre)', time: '34.2s', delta: '-0.45s', faster: true },
              { id: 'Sector 2 (Adenauer)', time: '48.9s', delta: '+0.12s', faster: false }
            ].map((sec, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white/[0.03] border border-white/5 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-3.5 h-3.5 text-white/35" />
                  <span className="text-[10px] font-bold uppercase text-white/80">{sec.id}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs text-white/95">{sec.time}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${sec.faster ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {sec.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Adaptive Aero & Overboost Status */}
        <div className="backdrop-blur-xl bg-black/45 border border-white/15 rounded-2xl p-5 flex flex-col gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">// VEHICLE MASS DYNAMICS</span>
            <Gauge className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h5 className="text-base font-bold text-white uppercase tracking-wider">Active Aero & Downforce</h5>
            <span className="text-xs text-white/45 mt-1 block">Rear active wing drag reduction mappings.</span>
          </div>
          <div className="flex flex-col gap-3 mt-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/50 font-bold uppercase">Dynamic Downforce</span>
              <span className="text-white font-mono font-bold">485 lbs @ 150 MPH</span>
            </div>
            <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden border border-white/5">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-[82%]" />
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg p-2 text-center">
                <span className="text-[8px] font-mono text-white/35 block">REAR WING ANGLE</span>
                <span className="text-xs font-extrabold text-white mt-1 block">12.5°</span>
              </div>
              <div className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg p-2 text-center">
                <span className="text-[8px] font-mono text-white/35 block">M-DRS ACTIVATION</span>
                <span className="text-xs font-extrabold text-cyan-400 mt-1 block">READY</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
