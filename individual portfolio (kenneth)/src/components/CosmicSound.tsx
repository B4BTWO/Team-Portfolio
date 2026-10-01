import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const CosmicSound: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Lowpass Filter for deep cosmic warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, ctx.currentTime);
      filter.connect(masterGain);

      // Deep drone oscillator 1 (55Hz = A1)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime);
      osc1.connect(filter);
      osc1.start();
      osc1Ref.current = osc1;

      // Deep drone oscillator 2 (110Hz with slight detune)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110.5, ctx.currentTime);
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      osc2.start();
      osc2Ref.current = osc2;

      setIsPlaying(true);
    } catch (e) {
      console.warn('AudioContext not allowed yet:', e);
    }
  };

  const stopSound = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
      setTimeout(() => {
        try {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
          audioCtxRef.current?.close();
        } catch {}
        setIsPlaying(false);
      }, 500);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startSound();
    }
  };

  // Play a microscopic high-tech blip on hover
  useEffect(() => {
    const handleTrigger = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button, a, .project-node, .nav-orb');
      if (target && isPlaying && audioCtxRef.current) {
        try {
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.02, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } catch {}
      }
    };

    window.addEventListener('mouseover', handleTrigger);
    return () => window.removeEventListener('mouseover', handleTrigger);
  }, [isPlaying]);

  return (
    <button
      onClick={toggleSound}
      className="sound-toggle-btn"
      title={isPlaying ? 'Mute ambient space audio' : 'Activate ambient space audio'}
      aria-label="Sound synthesizer"
    >
      <div className="sound-wave-bars">
        <span className={`bar ${isPlaying ? 'animated' : ''}`} style={{ animationDelay: '0ms' }} />
        <span className={`bar ${isPlaying ? 'animated' : ''}`} style={{ animationDelay: '150ms' }} />
        <span className={`bar ${isPlaying ? 'animated' : ''}`} style={{ animationDelay: '300ms' }} />
        <span className={`bar ${isPlaying ? 'animated' : ''}`} style={{ animationDelay: '75ms' }} />
      </div>
      <span className="mono sound-label">
        {isPlaying ? 'AUDIO: TRANSMITTING' : 'AUDIO: MUTED'}
      </span>
      {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  );
};

export default CosmicSound;
