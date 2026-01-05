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

  // Init audio + load saved preference
  useEffect(() => {
    const audio = new Audio('/bgmusic.mp3');
    audio.loop = true;
    audio.volume = 0.5; // 50%
    audioRef.current = audio;

    const savedEnabled = localStorage.getItem('bgm_enabled') === '1';
    const savedMuted = localStorage.getItem('bgm_muted') === '1';

    setEnabled(savedEnabled);
    setMuted(savedMuted);

    // If previously enabled, try to start (may still require a gesture depending on browser)
    if (savedEnabled) {
      audio.muted = savedMuted;
      audio.play().catch(() => {
        // blocked until gesture
      });
    }

    setReady(true);

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Keep audio mute state in sync
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = muted;
    localStorage.setItem('bgm_muted', muted ? '1' : '0');
  }, [muted]);

  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.muted = muted;
      await audio.play();
      setEnabled(true);
      localStorage.setItem('bgm_enabled', '1');
    } catch {
      // user can tap again
    }
  };

  const toggleMute = () => {
    if (!enabled) {
      startMusic();
      return;
    }
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
