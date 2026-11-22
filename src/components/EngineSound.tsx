import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, Square, Activity } from 'lucide-react';

export default function EngineSound() {
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReving, setIsReving] = useState(false);
  const [rpm, setRpm] = useState(800); // 800 RPM base idle

  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Oscillators for engine frequencies
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const osc3Ref = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioWorkletNode | AudioScheduledSourceNode | null>(null);
  
  // Filter and gain nodes
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const exhaustGainRef = useRef<GainNode | null>(null);

  // Stop synthesis
  const stopEngine = () => {
    try {
      if (osc1Ref.current) osc1Ref.current.stop();
      if (osc2Ref.current) osc2Ref.current.stop();
      if (osc3Ref.current) osc3Ref.current.stop();
      if (noiseNodeRef.current && 'stop' in noiseNodeRef.current) {
        noiseNodeRef.current.stop();
      }
    } catch (e) {
      // already stopped
    }
    
    setIsRunning(false);
    setRpm(0);
  };

  // Start synthesis representing the M twin-turbo inline-6
  const startEngine = async () => {
    // Initialize AudioContext
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Create Nodes
    const mainGain = ctx.createGain();
    mainGainRef.current = mainGain;
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    
    // Lowpass filter representing car cabin & exhaust dampening
    const filter = ctx.createBiquadFilter();
    filterRef.current = filter;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime);
    filter.Q.setValueAtTime(3.5, ctx.currentTime);

    // Deep sub-harmonic rumble (Cylinder 1-2-3-4-5-6 balance)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    
    osc1Ref.current = osc1;
    osc2Ref.current = osc2;
    osc3Ref.current = osc3;

    // Throaty sawtooth and triangle oscillators
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(45, ctx.currentTime); // Deep rumbling baseline

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(90, ctx.currentTime); // Second harmonic

    osc3.type = 'sawtooth';
    osc3.frequency.setValueAtTime(135, ctx.currentTime); // Third harmonic

    // Exhaust crackle/white noise node
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;
    noiseNodeRef.current = noiseNode;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(100, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.2, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.015, ctx.currentTime);

    // Connect noise path
    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(filter);

    // Connect oscillator gains
    const osc1Gain = ctx.createGain();
    const osc2Gain = ctx.createGain();
    const osc3Gain = ctx.createGain();
    
    osc1Gain.gain.setValueAtTime(0.5, ctx.currentTime);
    osc2Gain.gain.setValueAtTime(0.35, ctx.currentTime);
    osc3Gain.gain.setValueAtTime(0.2, ctx.currentTime);

    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    osc3.connect(osc3Gain);

    osc1Gain.connect(filter);
    osc2Gain.connect(filter);
    osc3Gain.connect(filter);

    // Master volume routing
    filter.connect(mainGain);
    mainGain.connect(ctx.destination);

    // 1. Starter Crank simulation
    let crankTime = 0.6; // duration of starter motor
    let startTime = ctx.currentTime;
    
    // Modulate gain to create "crank cranking" clicks
    mainGain.gain.setValueAtTime(0, startTime);
    mainGain.gain.linearRampToValueAtTime(0.08, startTime + 0.15);
    mainGain.gain.linearRampToValueAtTime(0.03, startTime + 0.3);
    mainGain.gain.linearRampToValueAtTime(0.09, startTime + 0.45);
    
    // Play starter sounds (rapid low freq sweeps)
    osc1.frequency.setValueAtTime(30, startTime);
    osc1.frequency.linearRampToValueAtTime(65, startTime + 0.5);
    osc2.frequency.setValueAtTime(60, startTime);
    osc2.frequency.linearRampToValueAtTime(130, startTime + 0.5);

    // 2. Combustion catch (Roar to 2,200 RPM, then settle to Idle 800 RPM)
    let catchTime = startTime + crankTime;
    setIsRunning(true);
    setRpm(1800);
    
    // Catch Volume burst
    mainGain.gain.setValueAtTime(0.12, catchTime);
    mainGain.gain.exponentialRampToValueAtTime(isMuted ? 0 : 0.45, catchTime + 0.05);
    
    // Settle volume to idle
    mainGain.gain.exponentialRampToValueAtTime(isMuted ? 0 : 0.28, catchTime + 1.2);

    // Settle frequencies
    osc1.frequency.setValueAtTime(120, catchTime); // ~2200 RPM catch peak
    osc1.frequency.exponentialRampToValueAtTime(45, catchTime + 1.2); // ~800 RPM idle

    osc2.frequency.setValueAtTime(240, catchTime);
    osc2.frequency.exponentialRampToValueAtTime(90, catchTime + 1.2);

    osc3.frequency.setValueAtTime(360, catchTime);
    osc3.frequency.exponentialRampToValueAtTime(135, catchTime + 1.2);

    // Adjust filter frequency on catch and idle
    filter.frequency.setValueAtTime(350, catchTime);
    filter.frequency.exponentialRampToValueAtTime(150, catchTime + 1.2);

    // Start playback
    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    noiseNode.start(startTime);

    // After settle time (1.2 seconds), finalize idle state
    setTimeout(() => {
      setRpm(800);
    }, 1200);
  };

  // Settle back to Idle 800 RPM
  const startReving = () => {
    if (!isRunning || !audioCtxRef.current) return;
    setIsReving(true);
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Rev up to 5,500 RPM
    setRpm(5500);

    if (osc1Ref.current && osc2Ref.current && osc3Ref.current && filterRef.current && mainGainRef.current) {
      // Speed up oscillators
      osc1Ref.current.frequency.exponentialRampToValueAtTime(110, now + 0.4); // 5500 RPM baseline
      osc2Ref.current.frequency.exponentialRampToValueAtTime(220, now + 0.4);
      osc3Ref.current.frequency.exponentialRampToValueAtTime(330, now + 0.4);

      // Open the filter to make it louder and brighter
      filterRef.current.frequency.exponentialRampToValueAtTime(480, now + 0.4);
      
      // Dynamic loudness curve during revving
      mainGainRef.current.gain.linearRampToValueAtTime(isMuted ? 0 : 0.62, now + 0.35);
    }
  };

  const stopReving = () => {
    if (!isRunning || !audioCtxRef.current) return;
    setIsReving(false);
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Settle back to idle
    setRpm(800);

    if (osc1Ref.current && osc2Ref.current && osc3Ref.current && filterRef.current && mainGainRef.current) {
      // Settle down frequencies slowly
      osc1Ref.current.frequency.exponentialRampToValueAtTime(45, now + 0.8);
      osc2Ref.current.frequency.exponentialRampToValueAtTime(90, now + 0.8);
      osc3Ref.current.frequency.exponentialRampToValueAtTime(135, now + 0.8);

      // Settle filter cutoff back to dark rumble
      filterRef.current.frequency.exponentialRampToValueAtTime(140, now + 0.8);

      // Settle master gain
      mainGainRef.current.gain.linearRampToValueAtTime(isMuted ? 0 : 0.28, now + 0.8);
    }
  };

  // Toggle Mute
  useEffect(() => {
    if (mainGainRef.current && audioCtxRef.current) {
      const targetVolume = isMuted ? 0 : (isReving ? 0.62 : 0.28);
      mainGainRef.current.gain.linearRampToValueAtTime(targetVolume, audioCtxRef.current.currentTime + 0.1);
    }
  }, [isMuted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopEngine();
    };
  }, []);

  const handleIgnition = () => {
    if (isRunning) {
      stopEngine();
    } else {
      startEngine();
    }
  };

  return (
    <div
      id="engine-sound-widget"
      className="p-4 border border-white/10 rounded-xl bg-black/60 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 w-full"
    >
      {/* Engine Status info */}
      <div id="engine-status-text" className="flex items-center gap-3">
        <div
          id="ignition-led"
          className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}
        />
        <div>
          <h4
            id="engine-widget-title"
            className="text-xs font-bold tracking-wider text-white uppercase"
          >
            M TwinPower Turbo V6 Audio
          </h4>
          <p id="engine-widget-rpm" className="text-[10px] text-white/50 font-mono tracking-tight mt-0.5">
            {isRunning ? `${rpm.toLocaleString()} RPM` : 'ENGINE STANDBY'}
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div id="engine-controls" className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* Mute button */}
        <button
          id="engine-mute-toggle"
          onClick={() => setIsMuted(!isMuted)}
          disabled={!isRunning}
          className={`p-2 rounded-lg border transition-all ${
            isRunning
              ? 'border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
              : 'border-white/5 text-white/25 cursor-not-allowed'
          }`}
          title={isMuted ? 'Unmute exhaust' : 'Mute exhaust'}
        >
          {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
        </button>

        {/* Ignition Button */}
        <motion.button
          id="engine-ignition-button"
          onClick={handleIgnition}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
            isRunning
              ? 'bg-red-900/30 text-red-400 border border-red-500/30 hover:bg-red-950/40'
              : 'bg-white text-black font-semibold border border-transparent hover:bg-white/90'
          }`}
        >
          {isRunning ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop M4 Engine
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Ignite Engine
            </>
          )}
        </motion.button>

        {/* Throttle Pedal / Rev Button */}
        <AnimatePresence>
          {isRunning && (
            <motion.button
              id="engine-rev-button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onMouseDown={startReving}
              onMouseUp={stopReving}
              onMouseLeave={stopReving}
              onTouchStart={startReving}
              onTouchEnd={stopReving}
              className={`px-5 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all select-none border flex items-center gap-1.5 ${
                isReving
                  ? 'bg-[#e50013] border-[#e50013] text-white shadow-lg shadow-red-500/20'
                  : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isReving ? 'animate-bounce' : ''}`} />
              Throttle Rev
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
