'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Home.module.css';

/* ===================== CONFIG ===================== */
const WEDDING_DATE = new Date('2026-04-30T17:00:00'); // April 30, 2026 – 5:00 PM
/* ================================================== */

export default function HomePage() {
  // Our Story
  const [storyOpen, setStoryOpen] = useState(false);
  const [activeMoment, setActiveMoment] = useState(0);
  const [momentKey, setMomentKey] = useState(0);

  // Venue
  const [venueView, setVenueView] = useState<'church' | 'reception' | 'both'>('church');

  const venueSrc =
    venueView === 'church'
      ? '/Church.svg'
      : venueView === 'reception'
      ? '/reception.svg'
      : '/Churchreception.svg';

  // Prenup Gallery list (for arrows)
  const galleryImages = useMemo(
    () => [
      '/prenup/1.jpg',
      '/prenup/2.jpg',
      '/prenup/3.jpg',
      '/prenup/4.jpg',
      '/prenup/5.jpg',
      '/prenup/6.jpg',
      '/prenup/7.jpg',
      '/prenup/8.jpg',
      '/prenup/9.jpg',
      '/prenup/10.jpg',
      '/prenup/11.jpg',
      '/prenup/12.jpg',
      '/prenup/13.jpg',
      '/prenup/14.jpg',
      '/prenup/15.jpg',
      '/prenup/16.jpg',
      '/prenup/17.jpg',
      '/prenup/18.jpg',
      '/prenup/19.jpg',
    ],
    []
  );

  // Shared Lightbox (venue + gallery)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (items: string[] | string, startIndex = 0) => {
    const arr = Array.isArray(items) ? items : [items];
    setLightboxItems(arr);
    setLightboxIndex(Math.min(Math.max(startIndex, 0), arr.length - 1));
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxItems([]);
    setLightboxIndex(0);
  };

  const hasMultiple = lightboxItems.length > 1;

  const goPrev = () => {
    if (!hasMultiple) return;
    setLightboxIndex((i) => (i - 1 + lightboxItems.length) % lightboxItems.length);
  };

  const goNext = () => {
    if (!hasMultiple) return;
    setLightboxIndex((i) => (i + 1) % lightboxItems.length);
  };

  // FAQ (multi-open)
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  // ESC + arrows for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, hasMultiple, lightboxItems.length]);

  const storyMoments = useMemo(
    () => [
      {
        label: 'AUG',
        day: '25',
        year: '2016',
        fullDate: 'August 25, 2016',
        title: 'Where it started',
        desc: `Funny how it all started. Jayson half-jokingly asked his officemate (who happened to be Louise’s high school bff) this question: “May kaibigan ka bang chicks diyan?”  

Jayson was 27 at that time. No girlfriend since birth. Full-time torpe. But something in him stirred that day—maybe it was hope, or maybe curiosity—because for the first time, he decided to start looking for “the one.”  

Meanwhile, Louise was 22, fresh out of college. She was embracing her single season when life decided to surprise her in the most unexpected way.  

Their mutual friend became their bridge. Louise’s first thought when she saw Jayson was that he was tall, dark, and handsome (she wasn’t wearing her eyeglasses at the time).  

Jayson, on the other hand, noticed Louise’s chinky eyes and couldn’t help but think she was cute (he had perfect 20-20 vision). They weren’t exactly each other’s type, but as it turns out, opposites really do attract.  

Still shy as ever, Jayson asked for a double date with their mutual friend. But soon, he gathered enough courage to ask Louise out—just the two of them.  

On their first official date, they found themselves on the rooftop of a parking lot, talking about the moon, the stars, and the universe. Somewhere in between those conversations, a quiet connection began to form. Neither of them had expectations. But little did they know, that night marked the beginning of countless adventures they’d share for years to come.`,
        bg: "url('/1.jpg')",
      },
      {
        label: 'FEB',
        day: '18',
        year: '2017',
        fullDate: 'February 18, 2017',
        title: 'The day we chose “us”',
        desc: `It wasn’t a picture-perfect day for Louise and Jayson. They were drenched as the rain poured hard. But it didn’t matter—because that was the day Louise gave her sweetest first “yes” through a letter. And just like that, their story began.  

Louise and Jayson share a love for nature, whether they’re hiking up a trail or swimming in the sea, they always find joy in being outdoors together.  

Jayson’s the sporty one; Louise, the bookworm. He’d hit the gym while she’d curl up with a book–until he sparked her interest in fitness. Now, they’re gym buddies who trade reps for laughter.  

They couldn’t be more different, yet perfectly balanced. Louise is a coffee enthusiast; Jayson was more of a Milo guy. But soon, coffee dates became their favorite ritual. She also opened his world to new flavors—from his usual Jollibee-and-McDonald’s picks to shared plates of new dishes.`,
        bg: "url('/2.jpg')",
      },
      {
        label: 'FEB',
        day: '7',
        year: '2025',
        fullDate: 'February 7, 2025',
        title: 'The next chapter',
        desc: `This was the day Jayson finally popped the question. It was a cold morning on a quiet farm in Bataan. Louise thought it was just another ordinary day, with her barefaced, messy hair, and still in pajamas. But it became the most beautiful moment for them, wrapped in their own little carefree bubble. She had been waiting to give her second “yes” for the longest time. And soon, she’ll give her final “yes” in front of the altar.  

Louise and Jayson have grown together over the years—turning dreams into reality, one step at a time. They learned to drive together, celebrated the joy of their first car, and are now looking forward to having their own home in Laguna.  

They started with humble beginnings, but little by little, they’ve worked hard toward their bigger dreams. They’ve faced rough patches along the way. But through it all, they’ve chosen to hold on to each other. One of the best things about their relationship is how they bring out each other’s inner child. When they’re together, they heal, they laugh, and they remind each other how good it feels to be a little silly and truly happy.  

Now, Louise and Jayson can’t wait to spend a lifetime of adventures together—traveling to new places, discovering new cuisines, dancing and singing like nobody’s watching, and teaming up for endless co-op games in the little home they’ll build with love.`,
        bg: "url('/3.jpg')",
      },
    ],
    []
  );

  const currentMoment = storyMoments[activeMoment];

  const onPickMoment = (idx: number) => {
    if (idx === activeMoment) return;
    setActiveMoment(idx);
    setMomentKey((k) => k + 1);
  };

  return (
    <div>
      {/* ================= HERO ================= */}
      <section id="home" style={{ position: 'relative', minHeight: '100vh' }}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <h1 className={styles.heroNames}>LOUISE &amp; JAYSON</h1>

          <p className={styles.heroMessage}>
            We’re celebrating a really special chapter in our lives. After nine years together, we’ve
            shared so much with the people who’ve been part of our story—the laughter, the adventures,
            and the little wins. Our journey simply wouldn’t be the same without you.
            <br />
            <br />
            We’d love for you to join us for an intimate gathering filled with love, joy, and meaningful
            memories as we begin this next chapter together.
            <br />
            <br />
            Your presence would make the day even more special.
          </p>

          <div className={styles.eventStamp} aria-label="Wedding date, time, and location">
            <div className={styles.stampMonth}>April</div>

            <div className={styles.stampMidRow}>
              <div className={styles.stampSide}>
                <span>THURSDAY</span>
              </div>

              <div className={styles.stampDay}>30</div>

              <div className={styles.stampSide}>
                <span>3:00 PM</span>
              </div>
            </div>

            <div className={styles.stampYear}>2026</div>

            <div className={styles.stampLocation}>Antipolo, Metro Manila</div>
          </div>

          <Link href="/rsvp" className={styles.heroRsvp}>
            RSVP
          </Link>
        </div>
      </section>

      {/* ================= COUNTDOWN SECTION ================= */}
      <section className={styles.countdownSection}>
        <div className={styles.countdownWrap}>
          <div className={styles.countdownTagline}>Counting down the days</div>
          <Countdown target={WEDDING_DATE} />
        </div>
      </section>

      {/* ================= SAVE THE DATE VIDEO ================= */}
      <section id="save-the-date" className={styles.section}>
        <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
          <div className={styles.sectionKicker}>SAVE THE DATE</div>
          <h2 className={styles.sectionTitle}>A little preview of our day</h2>
          <p className={styles.sectionCopy}>
            Here’s our save-the-date video. Turn on sound for the full experience.
          </p>

          <div className={styles.videoWrap}>
            <div className={styles.videoFrame}>
              <video className={styles.videoEl} controls playsInline preload="metadata">
                <source src="/save-the-date.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section id="our-story" className={styles.section}>
        <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
          <div className={styles.sectionKicker}>OUR STORY</div>
          <h2 className={styles.sectionTitle}>How it all came together</h2>
          <p className={styles.sectionCopy}>
            From the beginning through every milestone, our love story unfolded through small,
            intentional moments, shared dreams, and the people who stood beside us.
          </p>

          <button
            className={styles.btnSecondary}
            onClick={() => setStoryOpen((v) => !v)}
            aria-expanded={storyOpen}
          >
            {storyOpen ? 'Hide full story' : 'Read our story'}
          </button>
        </div>

        <div
          className={`${styles.storyPanel} ${storyOpen ? styles.storyPanelOpen : ''}`}
          style={{ ['--story-bg' as any]: currentMoment.bg }}
        >
          <div className={styles.storyPanelInner}>
            <div className={styles.timeline}>
              <div className={styles.timelineLine} />

              {storyMoments.map((m, idx) => {
                const active = idx === activeMoment;

                return (
                  <button
                    key={m.fullDate}
                    type="button"
                    className={`${styles.timelineDot} ${active ? styles.timelineDotActive : ''}`}
                    onClick={() => onPickMoment(idx)}
                    aria-label={m.fullDate}
                  >
                    <span
                      className={`${styles.dotCircle} ${active ? styles.dotCircleActive : ''}`}
                      style={{ background: active ? '#DAAB96' : 'rgba(47,38,34,0.30)' }}
                    />
                    <span className={styles.dotDate}>
                      {m.label} {m.day}, {m.year}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={styles.storyDetail}>
              <div key={momentKey} className={styles.storyDetailCard}>
                <div className={styles.storyDetailDate}>{currentMoment.fullDate}</div>
                <div className={styles.storyDetailTitle}>{currentMoment.title}</div>
                <div className={styles.storyDetailDesc}>{currentMoment.desc}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VENUE ================= */}
      <section id="venue" className={styles.section}>
        <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
          <div className={styles.sectionKicker}>VENUE</div>
          <h2 className={styles.sectionTitle}>How to get there</h2>
          <p className={styles.sectionCopy}>Select a route view below. Tap the map to enlarge and zoom.</p>

          <div className={styles.venueTabs}>
            <button
              type="button"
              className={`${styles.venueTab} ${venueView === 'church' ? styles.venueTabActive : ''}`}
              onClick={() => setVenueView('church')}
            >
              Church
            </button>
            <button
              type="button"
              className={`${styles.venueTab} ${venueView === 'reception' ? styles.venueTabActive : ''}`}
              onClick={() => setVenueView('reception')}
            >
              Venue
            </button>
            <button
              type="button"
              className={`${styles.venueTab} ${venueView === 'both' ? styles.venueTabActive : ''}`}
              onClick={() => setVenueView('both')}
            >
              Church + Venue
            </button>
          </div>

          <button
            type="button"
            className={styles.venueImageBtn}
            onClick={() => openLightbox(venueSrc)} // single image (no arrows)
            aria-label="Open map in fullscreen"
          >
            <img src={venueSrc} alt="Venue directions map" className={styles.venueImage} draggable={false} />
            <div className={styles.venueHint}>Tap to enlarge</div>
          </button>
        </div>
      </section>

      {/* ================= PRENUP GALLERY ================= */}
      <section id="prenup-gallery" className={styles.section}>
        <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
          <div className={styles.sectionKicker}>PRENUP GALLERY</div>
          <h2 className={styles.sectionTitle}>A few snapshots we love</h2>
          <p className={styles.sectionCopy}>Tap any photo to view it larger.</p>
        </div>

        <div className={styles.galleryFullBleed}>
          <div className={styles.prenupGrid}>
            {galleryImages.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`${styles.prenupTile} ${styles[`t${i + 1}`]}`}
                onClick={() => openLightbox(galleryImages, i)} // gallery mode (has arrows)
                aria-label="Open photo"
              >
                <img src={src} alt="Prenup photo" loading="lazy" draggable={false} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className={styles.section}>
        <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
          <div className={styles.sectionKicker}>FAQ</div>
          <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
          <p className={styles.sectionCopy}>
            We know weddings come with lots of little details, so we’ve rounded up some answers to help
            make things easier before the big day.
          </p>

          <div className={styles.faqList}>
            {[
              {
                q: 'When is the wedding day?',
                a: `Our big day is on April 30, 2026 (Thursday). We can’t wait to celebrate it with you!`,
              },
              {
                q: 'Where is the ceremony?',
                a: `The ceremony will be held at the Parish of the Immaculate Heart of Mary, Antipolo City. It starts at 3:00 PM.`,
                extra: (
                  <a
                    href="https://maps.app.goo.gl/DXUbTzFmgEyjbsZJ6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.faqQrLink}
                    aria-label="Scan or click the QR code to get directions."
                  >
                    <img
                      src="/churchqr.svg"
                      alt="Ceremony map QR code"
                      className={styles.faqQrImg}
                      draggable={false}
                    />
                    <div className={styles.faqQrHint}>Scan or click the QR code to get directions.</div>
                  </a>
                ),
              },
              {
                q: 'Where’s the reception?',
                a: `We’ll be celebrating right after at Jardin de Miramar Events Place, Antipolo City. And it’s just about 10 minutes away from the church.`,
                extra: (
                  <a
                    href="https://maps.app.goo.gl/mAYAqN5pZrmfKk5E8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.faqQrLink}
                    aria-label="Open reception location in Google Maps"
                  >
                    <img
                      src="/receptionqr.svg"
                      alt="Reception map QR code"
                      className={styles.faqQrImg}
                      draggable={false}
                    />
                    <div className={styles.faqQrHint}>Scan or click the QR code to get directions.</div>
                  </a>
                ),
              },
              {
                q: 'What time does the reception start?',
                a: `Dinner and program will begin at 6:00 PM, but feel free to come early, enjoy the garden views, and mingle before the festivities start.`,
              },
              {
                q: 'What should I wear?',
                a: `Gentlemen: Black suit and tie\nLadies: Long dresses in soft, neutral tones\n\nWe kindly ask everyone to follow the dress code. It’ll make the photos (and the day!) even lovelier.`,
                extra: (
                  <img
                    src="/colortheme.png"
                    alt="Dress code color palette"
                    className={styles.faqPaletteImg}
                    draggable={false}
                  />
                ),
              },
              {
                q: 'Can we take photos during the ceremony?',
                a: `We’ve hired professionals to capture every moment, so we’d love for you to be fully present during the ceremony. Feel free to take photos during the reception instead!`,
              },
              {
                q: 'Can we give gifts?',
                a: `Your love and presence are truly the best gifts. But if you wish to give something, monetary gifts would be deeply appreciated as we start this new chapter together.`,
              },
              {
                q: 'Is there parking available?',
                a: `Yes! Both the church and reception venue have ample parking spaces for your convenience.`,
              },
            ].map((item, idx) => {
              const isOpen = openFaqs.includes(idx);

              return (
                <div key={item.q} className={styles.faqItem}>
                  <button
                    type="button"
                    className={styles.faqQ}
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <span className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ''}`}>+</span>
                  </button>

                  <div className={`${styles.faqAWrap} ${isOpen ? styles.faqAOpen : ''}`}>
                    <div className={styles.faqA}>
                      <div className={styles.faqText}>{item.a}</div>
                      {item.extra ? <div className={styles.faqExtra}>{item.extra}</div> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className={styles.faqFooter}>
            If you have any other questions, feel free to reach out to the bride or groom. We’re happy to
            help.
          </p>
        </div>
      </section>

      {/* ================= LIGHTBOX (shared) ================= */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={closeLightbox} role="dialog" aria-modal="true">
          <button className={styles.lightboxClose} aria-label="Close" onClick={closeLightbox}>
            ✕
          </button>

          {hasMultiple && (
            <button
              type="button"
              className={styles.lightboxPrev}
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
            >
              ‹
            </button>
          )}

          <div className={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxItems[lightboxIndex]}
              alt="Fullscreen"
              className={styles.lightboxImg}
              draggable={false}
            />
          </div>

          {hasMultiple && (
            <button
              type="button"
              className={styles.lightboxNext}
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ================= COUNTDOWN ================= */

function Countdown({ target }: { target: Date }) {
  const [time, setTime] = useState(getTimeLeft(target));

  useEffect(() => {
    const i = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(i);
  }, [target]);

  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          display: 'flex',
          gap: 18,
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 2,
          color: '#2f2622',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TimeBox value={time.days} />:<TimeBox value={time.hours} />:<TimeBox value={time.minutes} />:
        <TimeBox value={time.seconds} />
      </div>
      <div
        style={{
          fontSize: 12,
          opacity: 0.8,
          marginTop: 6,
          fontFamily: 'Montserrat, sans-serif',
          color: '#2f2622',
          textAlign: 'center',
        }}
      >
        Days &nbsp;&nbsp; Hours &nbsp;&nbsp; Mins &nbsp;&nbsp; Secs
      </div>
    </div>
  );
}

function TimeBox({ value }: { value: number }) {
  return <span>{String(value).padStart(2, '0')}</span>;
}

function getTimeLeft(target: Date) {
  const diff = Math.max(target.getTime() - Date.now(), 0);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
