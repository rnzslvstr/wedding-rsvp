'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import './globals.css';
import Navbar from '@/app/components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false); // prevents hydration mismatch
  const [enabled, setEnabled] = useState(false); // user allowed music
  const [muted, setMuted] = useState(false); // user muted

  // Load saved preference (DOM <audio> handles the actual audio)
  useEffect(() => {
    const savedEnabled = localStorage.getItem('bgm_enabled') === '1';
    const savedMuted = localStorage.getItem('bgm_muted') === '1';

    setEnabled(savedEnabled);
    setMuted(savedMuted);
    setReady(true);
  }, []);

  // Keep audio mute state in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = muted;
    localStorage.setItem('bgm_muted', muted ? '1' : '0');
  }, [muted]);

  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      // force audible on first enable
      audio.muted = false;
      setMuted(false);

      // volume must be set on element
      audio.volume = 0.5;

      await audio.play();

      setEnabled(true);
      localStorage.setItem('bgm_enabled', '1');
      localStorage.setItem('bgm_muted', '0');
    } catch (e) {
      console.log('Play failed:', e);
    }
  };

  const toggleMute = async () => {
  const audio = audioRef.current;
  if (!audio) return;

  // if audio isn't playing (common after refresh), start it on user tap
  if (audio.paused) {
    try {
      audio.volume = 0.5;
      audio.muted = false;
      setMuted(false);
      await audio.play();
      setEnabled(true);
      localStorage.setItem('bgm_enabled', '1');
      localStorage.setItem('bgm_muted', '0');
      return;
    } catch (e) {
      console.log('Play failed:', e);
      return;
    }
  }

  // otherwise just mute/unmute
  setMuted((v) => !v);
};


  const MusicControl = () => {
    if (!ready) return null;

    if (!enabled) {
      return (
        <button
          onClick={startMusic}
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            zIndex: 100000,
            borderRadius: 999,
            padding: '10px 14px',
            border: '1px solid rgba(255,255,255,0.35)',
            background: 'rgba(47,38,34,0.70)',
            color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: 0.5,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
          aria-label="Tap to enable background music"
        >
          🔊 Tap to enable music
        </button>
      );
    }

    return (
      <button
        onClick={toggleMute}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 100000,
          borderRadius: 999,
          padding: '10px 14px',
          border: '1px solid rgba(255,255,255,0.35)',
          background: 'rgba(47,38,34,0.70)',
          color: '#fff',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 800,
          fontSize: 12,
          letterSpacing: 0.5,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        aria-label={muted ? 'Unmute background music' : 'Mute background music'}
      >
        {muted ? '🔇 Muted' : '🔊 Music on'}
      </button>
    );
  };

  return (
    <html lang="en">
      <body>
        <Navbar />

        {/* DOM audio element (more reliable on mobile/Safari) */}
        <audio ref={audioRef} src="/bgmusic.mp3" loop preload="auto" />

        <MusicControl />

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
  );
}
