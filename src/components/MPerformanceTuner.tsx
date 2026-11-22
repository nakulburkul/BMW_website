import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sliders,
  Play,
  Square,
  Check,
  Activity,
  Zap,
  Gauge,
  Compass,
  Clock,
  SlidersHorizontal,
  Flame,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface TaskItem {
  id: string;
  label: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export default function MPerformanceTuner() {
  // Drive mode configurations
  const [engineMode, setEngineMode] = useState<'comfort' | 'sport' | 'sport-plus'>('sport-plus');
  const [chassisMode, setChassisMode] = useState<'comfort' | 'sport' | 'sport-plus'>('sport');
  const [steeringMode, setSteeringMode] = useState<'comfort' | 'sport'>('sport');
  const [brakingMode, setBrakingMode] = useState<'comfort' | 'sport'>('sport');
  const [exhaustOpen, setExhaustOpen] = useState<boolean>(true);
  const [drivetrain, setDrivetrain] = useState<'4wd' | '4wd-sport' | '2wd'>('4wd-sport');
  const [tractionLevel, setTractionLevel] = useState<number>(8); // M Traction Control (1-10)

  // Timer states (M Lap Trigger)
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(1500); // starts at 25:00
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Live clock display
  const [currentTime, setCurrentTime] = useState<string>('07:45 PM');

  // Interactive systems check list
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 'lubrication', label: 'S58 Oil Scavenge Pump', status: 'Completed' },
    { id: 'cooling', label: 'Bi-Turbo Water Coolers', status: 'Completed' },
    { id: 'torque', label: 'M xDrive Torque Transfer', status: 'In Progress' },
    { id: 'tyres', label: 'Michelin Cup 2 Thermals', status: 'Pending' }
  ]);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minStr = minutes < 10 ? '0' + minutes : minutes;
      const hrStr = hours < 10 ? '0' + hours : hours;
      setCurrentTime(`${hrStr}:${minStr} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Lap timer effect
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 0) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const minStr = mins < 10 ? '0' + mins : mins;
    const secStr = secs < 10 ? '0' + secs : secs;
    return `${minStr}:${secStr}`;
  };

  // Toggle tasks status
  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed'
          ? 'In Progress'
          : t.status === 'In Progress'
            ? 'Pending'
            : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Throttle power readout based on active engine mode
  const getThrottlePercentage = () => {
    if (engineMode === 'comfort') return 52;
    if (engineMode === 'sport') return 78;
    return 96;
  };

  // Circular math for progress indicators
  const radius = 60;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  return (
    <section
      id="m-performance-tuning-section"
      className="relative z-10 border-t border-white/10 px-6 md:px-12 py-20 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col items-center gap-12"
    >

      {/* HEADER SECTION */}
      <div id="tuner-section-header" className="relative z-10 text-center select-none flex flex-col items-center gap-2">
        <span className="text-xs font-mono tracking-[0.3em] text-[#0066B1] uppercase font-bold">// DYNAMIC CHASSIS MANAGEMENT</span>
        <h3 className="text-2xl md:text-3xl font-black tracking-[0.15em] text-white uppercase font-sans">
          M PERFORMANCE SETUP
        </h3>
        <p className="text-xs text-white/40 mt-1 max-w-lg font-light">
          Configure individual powertrain, suspension, and xDrive dynamics to engineer your perfect racetrack split.
        </p>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* LEFT COLUMN: PARAMETER ADJUSTMENT TUNER */}
        <div
          id="tuner-controls-deck"
          className="lg:col-span-5 backdrop-blur-3xl bg-black/45 border border-white/15 rounded-[24px] p-6 flex flex-col gap-6 shadow-[0_25px_60px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.1)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-black tracking-widest text-white uppercase font-sans">M SETUP DIRECTORY</h4>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">LIVE PROFILE</span>
          </div>

          {/* ENGINE MAPPING SELECTOR */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase font-mono">1. ENGINE RESPONSE MAP</span>
            <div className="grid grid-cols-3 gap-2">
              {(['comfort', 'sport', 'sport-plus'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setEngineMode(mode)}
                  className={`py-2 px-3 text-[10px] font-extrabold tracking-widest uppercase transition-all duration-300 border rounded-none cursor-pointer ${engineMode === mode
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {mode.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* CHASSIS/SUSPENSION SELECTOR */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase font-mono">2. ADAPTIVE M SUSPENSION</span>
            <div className="grid grid-cols-3 gap-2">
              {(['comfort', 'sport', 'sport-plus'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setChassisMode(mode)}
                  className={`py-2 px-3 text-[10px] font-extrabold tracking-widest uppercase transition-all duration-300 border rounded-none cursor-pointer ${chassisMode === mode
                      ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/20'
                      : 'bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {mode.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* STEERING SELECTOR */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase font-mono">3. SERVOTRONIC STEERING</span>
            <div className="grid grid-cols-2 gap-2">
              {(['comfort', 'sport'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSteeringMode(mode)}
                  className={`py-2 px-3 text-[10px] font-extrabold tracking-widest uppercase transition-all duration-300 border rounded-none cursor-pointer ${steeringMode === mode
                      ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* DRIVETRAIN (M xDRIVE) SELECTOR */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase font-mono">4. M xDRIVE VECTOR SYSTEM</span>
            <div className="grid grid-cols-3 gap-2">
              {(['4wd', '4wd-sport', '2wd'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setDrivetrain(mode);
                    if (mode === '2wd') {
                      setTractionLevel(1); // Real drift mode drops traction control!
                    } else if (mode === '4wd') {
                      setTractionLevel(10);
                    } else {
                      setTractionLevel(6);
                    }
                  }}
                  className={`py-2 px-3 text-[9px] font-extrabold tracking-widest uppercase transition-all duration-300 border rounded-none cursor-pointer ${drivetrain === mode
                      ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/20'
                      : 'bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {mode} {mode === '2wd' && 'DRIFT'}
                </button>
              ))}
            </div>
          </div>

          {/* M TRACTION CONTROL SLIDER (1 to 10 STAGES) */}
          <div className="flex flex-col gap-3.5 bg-white/[0.02] border border-white/5 p-4 rounded-none">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase font-mono">5. M TRACTION CONTROL (STAGES 1-10)</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 border ${tractionLevel <= 3
                  ? 'bg-rose-500/10 border-rose-500/35 text-rose-400'
                  : tractionLevel <= 7
                    ? 'bg-purple-500/10 border-purple-500/35 text-purple-400'
                    : 'bg-blue-500/10 border-blue-500/35 text-blue-400'
                }`}>
                {tractionLevel === 1 ? 'STAGE 1 (DRIFT MAX)' : `STAGE ${tractionLevel}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-rose-500 font-bold">1</span>
              <input
                type="range"
                min="1"
                max="10"
                value={tractionLevel}
                onChange={(e) => setTractionLevel(Number(e.target.value))}
                className="flex-1 accent-white h-1 bg-white/10 rounded-none cursor-pointer"
              />
              <span className="text-[9px] font-mono text-blue-400 font-bold">10</span>
            </div>
            <p className="text-[9px] text-white/35 font-mono leading-normal">
              Stage 1-3 enables maximum slip angle (controlled oversteer drift). Stage 8-10 optimizes electronic grip coefficient.
            </p>
          </div>

          {/* RESET PRESETS BUTTON */}
          <button
            onClick={() => {
              setEngineMode('sport-plus');
              setChassisMode('sport');
              setSteeringMode('sport');
              setBrakingMode('sport');
              setExhaustOpen(true);
              setDrivetrain('4wd-sport');
              setTractionLevel(8);
            }}
            className="w-full mt-2 py-3 bg-white text-black font-extrabold text-[10px] tracking-[0.25em] uppercase hover:bg-transparent hover:text-white border border-white rounded-none transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_5px_15px_rgba(255,255,255,0.05)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            SYNCHRONIZE TRACK PRESETS
          </button>

        </div>

        {/* RIGHT COLUMN: INTEGRATED GLASSMORPHIC ANALYTICS DASHBOARD (Exact Replicas of the image widgets!) */}
        <div id="tuner-telemetry-panel" className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* WIDGET 1: HEADING WELCOME BOARD (Top Left widget in image) */}
          <div className="backdrop-blur-3xl bg-black/45 border border-white/15 rounded-[24px] p-5 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] min-h-[180px]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-white/30 tracking-wider uppercase">Active Operator</span>
                <h4 className="text-2xl font-black text-white uppercase tracking-tight">Nakul Burkul</h4>
                <p className="text-[10px] text-white/45 mt-1 leading-normal uppercase font-mono">
                  // Stay focused. Push limits. Dominate the track.
                </p>
              </div>
              <div className="font-mono text-[10px] font-bold text-white/50 px-2 py-1 bg-white/5 border border-white/10">
                {currentTime}
              </div>
            </div>

            {/* Glowing neon vector loop mimicking the line chart under name in image */}
            <div className="w-full h-10 relative mt-4">
              <svg className="w-full h-full" viewBox="0 0 200 40">
                <defs>
                  <filter id="blue-glow-line">
                    <feGaussianBlur stdDeviation="3" result="blur" />
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
                  filter="url(#blue-glow-line)"
                  className="animate-pulse"
                />
                {/* Floating pulses */}
                <circle cx="60" cy="25" r="4" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 5px #3b82f6)' }} />
                <circle cx="120" cy="15" r="4" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 5px #3b82f6)' }} />
              </svg>
            </div>
          </div>

          {/* WIDGET 2: CHASSIS & CLOUD WEATHER STATION (Top Right widget in image) */}
          <div className="backdrop-blur-3xl bg-black/45 border border-white/15 rounded-[24px] p-5 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] min-h-[180px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-white/35 block uppercase tracking-wider">TRACK TRACKING</span>
                <span className="text-xs font-bold text-white uppercase block mt-1">Nürburgring GP Course</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-white">74°F</span>
                <span className="text-[9px] font-mono text-white/40 block uppercase mt-0.5">Dry / Asphalt 82°F</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 bg-white/[0.02] border border-white/5 p-3 rounded-none">
              <Flame className="w-6 h-6 text-[#0066B1] animate-pulse" />
              <div>
                <span className="text-[10px] font-mono text-white/40 block">WEATHER OVERCAST</span>
                <span className="text-xs font-bold text-white uppercase block mt-0.5">Humidity: 31% | Winds: SW 12 MPH</span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-white/30 pt-2 border-t border-white/5">
              <span>LATITUDE: 50.33° N</span>
              <span>LONGITUDE: 6.94° E</span>
            </div>
          </div>

          {/* WIDGET 3: THROTTLE DYNAMIC MAPPING (Middle Left widget) */}
          <div className="backdrop-blur-3xl bg-black/45 border border-white/15 rounded-[24px] p-5 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] min-h-[220px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-white/30 block uppercase">THROTTLE PARAMETER</span>
                <h5 className="text-xl font-black text-white uppercase mt-0.5">S58 BOOST FORCE</h5>
              </div>
              <span className="text-[9px] font-mono text-white/40 uppercase">// ENGINE PROFILE</span>
            </div>

            <div className="flex items-center justify-between gap-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-4xl font-extrabold italic text-white tracking-tighter">{getThrottlePercentage()}%</span>
                <span className="text-[9px] text-[#0066B1] font-mono uppercase font-bold tracking-widest">STAGE 2 TUNING ACTIVE</span>
                <div className="flex items-center gap-3.5 mt-2 text-[9.5px] font-mono text-white/45">
                  <span>LIMITER: OFF</span>
                  <span>OCTANE: 98</span>
                </div>
              </div>

              {/* Circular gauge representing "Productivity" ring */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r={radius}
                    stroke="#3b82f6"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset: circumference - (getThrottlePercentage() / 100) * circumference }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-mono text-white/50 block">PSI</span>
                  <span className="text-sm font-black text-white italic">20.5</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-white/40 border-t border-white/5 pt-3">
              <span>CYLINDER COMP: 10.2:1</span>
              <span>INJECTION MAP: COMP</span>
            </div>
          </div>

          {/* WIDGET 4: LAP FOCUS TIMER / STOPWATCH (Middle Right widget) */}
          <div className="backdrop-blur-3xl bg-black/45 border border-white/15 rounded-[24px] p-5 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] min-h-[220px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-white/35 block uppercase">TRACK SPLIT TRIGGER</span>
                <h5 className="text-xl font-black text-white uppercase mt-0.5">OVERBOOST TIMING</h5>
              </div>
              <span className="text-[9px] font-mono text-white/40 uppercase">// LAP METRICS</span>
            </div>

            <div className="flex items-center justify-between gap-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-4xl font-extrabold italic text-white tracking-tighter font-mono">
                  {formatTime(time)}
                </span>
                <span className="text-[9px] text-purple-400 font-mono uppercase font-bold tracking-wider">
                  {timerRunning ? 'CRITICAL TIME LAPSE' : 'LAP TRIGGER STANDBY'}
                </span>

                {/* Control Trigger buttons */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="flex items-center gap-1 px-3 py-1 bg-white text-black text-[9px] font-bold tracking-wider uppercase hover:bg-white/80 transition-all cursor-pointer rounded-none"
                  >
                    {timerRunning ? (
                      <>
                        <Square className="w-2.5 h-2.5 fill-current" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 fill-current" /> Start Lap
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setTimerRunning(false);
                      setTime(1500);
                    }}
                    className="px-3 py-1 bg-white/5 border border-white/10 text-white text-[9px] font-bold tracking-wider uppercase hover:bg-white/10 transition-all cursor-pointer rounded-none"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Glowing circular timer pathway */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={6}
                    fill="transparent"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r={radius}
                    stroke="#a855f7"
                    strokeWidth={6}
                    fill="transparent"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset: circumference - (time / 1500) * circumference }}
                    transition={{ duration: 0.5, ease: 'linear' }}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.5))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[8px] font-mono text-white/50 block uppercase">LAP DELTA</span>
                  <span className="text-xs font-black text-emerald-400 italic font-mono">-0.42s</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-white/40 border-t border-white/5 pt-3">
              <span>TARGET SPLIT: 07:12.45</span>
              <span>LAPS LOGGED: 3</span>
            </div>
          </div>

          {/* WIDGET 5: DRIVING SYSTEMS CHECKLIST (Lower Left widget) */}
          <div className="backdrop-blur-3xl bg-black/45 border border-white/15 rounded-[24px] p-5 flex flex-col gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] min-h-[220px]">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div>
                <span className="text-[10px] font-mono text-white/35 block uppercase">DIAGNOSTICS MAPPED</span>
                <span className="text-sm font-bold text-white uppercase block">Engine Live Systems</span>
              </div>
              <SlidersHorizontal className="w-4 h-4 text-white/30" />
            </div>

            <div className="flex flex-col gap-2.5">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTaskStatus(task.id)}
                  className="w-full flex justify-between items-center text-left bg-white/[0.02] border border-white/5 p-2.5 rounded-none hover:bg-white/[0.04] hover:border-white/10 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 border flex items-center justify-center ${task.status === 'Completed'
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : task.status === 'In Progress'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'border-white/30'
                      }`}>
                      {task.status === 'Completed' && <Check className="w-3 h-3 stroke-[3]" />}
                      {task.status === 'In Progress' && <div className="w-1.5 h-1.5 bg-purple-400 animate-pulse" />}
                    </div>
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">{task.label}</span>
                  </div>
                  <span className={`font-mono text-[9px] font-bold uppercase ${task.status === 'Completed'
                      ? 'text-blue-400'
                      : task.status === 'In Progress'
                        ? 'text-purple-400 animate-pulse'
                        : 'text-white/30'
                    }`}>
                    {task.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* WIDGET 6: EXHAUST VALVE DYNAMIC SOUNDWAVE (Lower Right widget) */}
          <div className="backdrop-blur-3xl bg-black/45 border border-white/15 rounded-[24px] p-5 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] min-h-[220px]">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div>
                <span className="text-[10px] font-mono text-white/30 block uppercase">ACOUSTICS WAVE</span>
                <span className="text-sm font-bold text-white uppercase block">M Sport Exhaust Valve</span>
              </div>
              <Volume2 className="w-4 h-4 text-purple-400" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/50 block">VALVES OVERRIDE:</span>
                <button
                  onClick={() => setExhaustOpen(!exhaustOpen)}
                  className={`px-3 py-1 font-mono text-[10px] font-extrabold tracking-widest uppercase border rounded-none transition-all cursor-pointer ${exhaustOpen
                      ? 'bg-rose-500/10 border-rose-500/35 text-rose-400'
                      : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                >
                  {exhaustOpen ? 'SPORT (OPEN)' : 'SILENT (CLOSED)'}
                </button>
              </div>

              {/* Live soundwave animation */}
              <div className="w-full bg-white/[0.01] border border-white/5 h-20 rounded-none overflow-hidden relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 80">
                  <path
                    d={exhaustOpen
                      ? "M 0 40 Q 20 10 40 70 T 80 40 T 120 75 T 160 5 T 200 65 T 240 10 T 280 70 T 300 40"
                      : "M 0 40 Q 30 35 60 45 T 120 40 T 180 42 T 240 38 T 300 40"
                    }
                    fill="none"
                    stroke={exhaustOpen ? "#ef4444" : "#a855f7"}
                    strokeWidth="2.5"
                    className="transition-all duration-700 ease-out animate-pulse"
                    strokeLinecap="round"
                  />
                  <path
                    d={exhaustOpen
                      ? "M 0 40 Q 15 65 30 15 T 70 45 T 110 5 T 150 75 T 190 20 T 230 65 T 270 15 T 300 40"
                      : "M 0 40 Q 25 43 50 37 T 100 42 T 150 38 T 200 41 T 300 40"
                    }
                    fill="none"
                    stroke={exhaustOpen ? "#f59e0b" : "#6366f1"}
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-2 left-2 text-[8px] font-mono text-white/30 tracking-widest uppercase">
                  ACTIVE EXHAUST SPECTRUM
                </div>
              </div>
            </div>

            <p className="text-[9px] text-white/35 font-mono leading-relaxed uppercase">
              // Exhaust backpressure reduced by 14.5% in sport plus mode to optimize bi-turbo velocity.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
