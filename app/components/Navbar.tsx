'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from '../Home.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isRSVP = pathname === '/rsvp';

  const [scrolled, setScrolled] = useState(false);

  // Mobile menu (same logic as your HomePage)
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileVisible(false);
    const t = setTimeout(() => setMobileOpen(false), 220);
    return () => clearTimeout(t);
  }, [pathname]);

  const handleNavClick = () => {
    setMobileVisible(false);
    setTimeout(() => setMobileOpen(false), 220);
  };

  const openMobile = () => {
    setMobileVisible(true);
    setMobileOpen(true);
  };

  const closeMobile = () => {
    setMobileVisible(false);
    setTimeout(() => setMobileOpen(false), 220);
  };

  const navBg = scrolled ? '#EDD3C6' : 'transparent';
  const navText = isRSVP ? '#2f2622' : scrolled ? '#2f2622' : '#ffffff';

  const navShadow = scrolled ? '0 10px 30px rgba(0,0,0,0.12)' : 'none';

  const items = ['Home', 'Our Story', 'Venue', 'FAQ'];

  // Home uses "#", other pages use "/#"
  const hrefFor = (item: string) => {
    const id = item.toLowerCase().replace(/ /g, '-');
    return isHome ? `#${id}` : `/#${id}`;
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: navBg,
          color: navText,
          boxShadow: navShadow,
          transition: 'all 220ms ease',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <a
            href={isHome ? '#home' : '/#home'}
            onClick={handleNavClick}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              letterSpacing: 1,
              textDecoration: 'none',
              color: navText,
            }}
          >
            L &amp; J
          </a>

          <nav className={styles.desktopNav}>
            {items.map((item) => (
              <a
                key={item}
                href={hrefFor(item)}
                onClick={handleNavClick}
                style={linkStyle(navText)}
              >
                {item}
              </a>
            ))}

            {/* RSVP button style same as your landing */}
            {isRSVP ? (
              <span
                style={{
                  ...rsvpButtonStyle(scrolled),
                  opacity: 0.75,
                  cursor: 'default',
                  userSelect: 'none',
                }}
              >
                RSVP
              </span>
            ) : (
              <Link href="/rsvp" style={rsvpButtonStyle(scrolled)}>
                RSVP
              </Link>
            )}
          </nav>

          <button
            onClick={openMobile}
            className={styles.mobileToggle}
            aria-label="Open menu"
            style={{
              borderColor: scrolled ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.4)',
              color: navText,
            }}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Spacer so content doesn’t sit under fixed navbar */}
     

      {/* ================= MOBILE OVERLAY ================= */}
      {mobileOpen && (
        <div className={`${styles.mobileOverlay} ${mobileVisible ? styles.mobileOverlayShow : ''}`}>
          <button className={styles.mobileClose} aria-label="Close menu" onClick={closeMobile}>
            ✕
          </button>

          <nav className={styles.mobileMenu}>
            {items.map((item) => (
              <a key={item} href={hrefFor(item)} onClick={handleNavClick}>
                {item}
              </a>
            ))}

            {isRSVP ? (
              <span style={{ opacity: 0.75, fontWeight: 800 }}>RSVP</span>
            ) : (
              <Link href="/rsvp" onClick={handleNavClick}>
                RSVP
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

/* ================= HELPERS (same as your HomePage) ================= */

function linkStyle(color: string) {
  return {
    textDecoration: 'none',
    color,
    fontWeight: 600,
    fontSize: 13,
    fontFamily: 'Montserrat, sans-serif',
    letterSpacing: 0.5,
  } as const;
}

function rsvpButtonStyle(scrolled: boolean) {
  return {
    textDecoration: 'none',
    padding: '10px 14px',
    borderRadius: 999,
    background: scrolled ? '#DAAB96' : '#EDD3C6',
    color: scrolled ? '#fff' : '#2f2622',
    fontWeight: 800,
    fontFamily: 'Montserrat, sans-serif',
  } as const;
}
