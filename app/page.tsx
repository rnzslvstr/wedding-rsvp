'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Home.module.css';

/* ===================== CONFIG ===================== */
// Force PH time (UTC+08:00) so countdown is correct for all viewers
const WEDDING_DATE = new Date('2026-04-30T17:00:00+08:00'); // April 30, 2026 – 5:00 PM (Asia/Manila)
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
        day: '10', // fixed to match fullDate below
        year: '2016',
        fullDate: 'August 10, 2016',
        title: 'The early days',
        desc: `Funny how it all began. Jayson half-jokingly asked his officemate (who happened to be Louise’s high school friend) this: “May kaibigan ka bang chicks diyan?”  

Jayson was 27 at that time. No girlfriend since birth. Full-time torpe. But something in him stirred that day—enough for him to finally take a chance at finding “the one.” Meanwhile, Louise was 22, fresh out of college and happily single, when life decided to surprise her.

Their mutual friend became the bridge. Louise’s first impression? Tall, dark, and handsome (she wasn’t wearing her glasses at the time). Jayson noticed her chinky eyes and thought she was cute (he had 20-20 vision). They weren’t exactly each other’s type, but opposites have their way of finding each other.

Still shy, Jayson first asked for a double date. Until he found the courage to ask Louise out on his own. Their first official date ended on a parking lot rooftop, talking about the moon, the stars, and everything in between. Both had no expectations, but little did they know that night marked the beginning of countless adventures they’d share for years to come.
`,
        bg: "url('/1.jpg')",
      },
      {
        label: 'FEB',
        day: '18',
        year: '2017',
        fullDate: 'February 18, 2017',
        title: 'The little things in between',
        desc: `It wasn’t a picture-perfect day for Louise and Jayson. They were drenched as the rain poured hard. But it didn’t matter, because that was the day Louise gave her sweetest “yes,” written in a letter.

They both share a love for nature—whether hiking a trail or swimming in the sea. They also enjoy traveling locally and abroad to discover new cultures and food together.
Jayson’s the sporty one; Louise, the bookworm. He’d hit the gym while she’d curl up with a book—until he sparked her interest in fitness. Now, they’re gym buddies who trade reps for laughter.

Different yet perfectly balanced, Louise is a coffee lover while Jayson started out a Milo guy. Coffee dates soon became their favorite ritual, and she gradually introduced him to new flavors—from his usual Jollibee and McDonald’s picks to new, diverse cuisines.
`,
        bg: "url('/2.jpg')",
      },
      {
        label: 'FEB',
        day: '7',
        year: '2025',
        fullDate: 'February 7, 2025',
        title: 'A lifetime of us',
        desc: `It was a cold morning on a quiet farm in Bataan when Jayson finally popped the question. Louise thought it was just another ordinary day—barefaced, messy hair, still in pajamas—but it became one of their most beautiful moments, wrapped in their own carefree bubble. She had been waiting to give her second “yes,” and soon she’ll say her final one at the altar.

Over the years, Louise and Jayson have grown together, turning dreams into reality—from learning to drive, to celebrating their first car, to looking forward to their new home in Laguna. They’ve faced challenges, but always held on to each other. One of the best parts of their relationship is how they bring out each other’s inner child—laughing, healing, and savoring the joy of being a little silly together.

Now, they are ready to spend a lifetime of adventures—exploring new places and cuisines, dancing and singing like nobody’s watching, and teaming up for endless co-op games in the little home they’ll build with love.`,
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

  const faqs = useMemo(
    () => [
      {
        q: 'When is the wedding day?',
        a: (
          <>
            Our big day is on <strong>April 30, 2026 (Thursday)</strong>. We can’t wait to celebrate it
            with you!
          </>
        ),
      },
      {
        q: 'Where is the ceremony?',
        a: (
          <>
            The ceremony will be held at the{' '}
            <strong>Parish of the Immaculate Heart of Mary, Antipolo City</strong>. It starts at{' '}
            <strong>4:00 PM</strong>. Please arrive at least <strong>45 minutes early</strong>, as the entourage will be marching in beforehand and to allow time for everyone to get settled.
          </>
        ),
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
        q: 'Can we take photos during the ceremony?',
        a: (
          <>
            To keep it sacred, we kindly ask that all phones and cameras be put away. Our photographers will take care of capturing the moments. And we’d love for you to be fully present with us!
          </>
        ),
      },
      {
        q: 'Where is the reception?',
        a: (
          <>
            We’ll be celebrating right after at <strong>Jardin de Miramar Events Place</strong>, Antipolo
            City. And it’s just about <strong>10 minutes away</strong> from the church.
          </>
        ),
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
        a: (
          <>
            Dinner and the program will begin at <strong>6:00 PM</strong>. Feel free to arrive early to
            enjoy the garden views and mingle before the festivities begin. The reception will conclude at{' '}
            <strong>10:00 PM</strong>.
          </>
        ),
      },
      {
        q: 'What should we wear?',
        a: (
          <>
            Gentlemen: <strong>Black suit and tie</strong>
            <br />
            Ladies: <strong>Long dresses in soft, muted tones</strong>
          </>
        ),
        extra: (
          <div>
            <img
              src="/colortheme.jpg"
              alt="Dress code color palette"
              className={styles.faqPaletteImg}
              draggable={false}
            />
            <div className={styles.faqDressNote}>
              We kindly ask everyone to follow the dress code to help make the day and the photos even
              lovelier.
            </div>
          </div>
        ),
      },
          {
        q: 'Can we give gifts?',
        a: (
          <>
            Your love and presence are the greatest gifts. If you wish to give something, monetary gifts to help us build our home would be warmly appreciated.
          </>
        ),
      },
      {
        q: 'Is it required to RSVP on the website?',
        a: (
          <>
            Yes! Kindly RSVP through the website by the end of February, so we can carefully finalize our
            preparations. As we’re keeping our celebration intimate, we’re only able to welcome confirmed
            guests.
          </>
        ),
      },
      {
        q: 'Can I bring a plus-one?',
        a: (
          <>
            We’re celebrating with a small circle of loved ones, so we’re unable to accommodate plus-ones.
            We truly appreciate your understanding.
          </>
        ),
      },
  
     
      {
        q: 'Are there nearby places to stay?',
        a: (
          <>
            Yes! There are several hotels and resorts around Antipolo, including{' '}
            <strong>LeBlanc Hotel and Resort</strong>, <strong>Altaroca Mountain Resort Antipolo</strong>,
            and <strong>Casa Azul Femar Resort and Hotel</strong>. There are also plenty of Airbnbs
            available in the area.
          </>
        ),
      },
      {
        q: 'Is there parking available?',
        a: <>Yes! Both the church and reception venue have ample parking spaces for your convenience.</>,
      },
    ],
    []
  );

  return (
    <div>
      {/* ================= HERO ================= */}
      <section id="home" style={{ position: 'relative', minHeight: '100vh' }}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <h1 className={styles.heroNames}>LOUISE &amp; JAYSON</h1>

          <p className={styles.heroMessage}>
            We’re celebrating a really special chapter in our lives. After nine years together, we’ve shared
            so much with the people who’ve  <br />been part of our story—the laughter, the adventures, and the
            little wins. Our journey simply wouldn’t be the same without you.
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
                <span>4:00 PM</span>
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
            From the beginning through every milestone, our love story unfolded through small, intentional
            moments, shared dreams, and the people who stood beside us.
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
              Reception
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
            onClick={() => openLightbox(venueSrc)}
            aria-label="Open map in fullscreen"
          >
            <img src={venueSrc} alt="Venue directions map" className={styles.venueImage} draggable={false} />
            <div className={styles.venueHint}>Tap to enlarge</div>
          </button>
        </div>
      </section>

   {/* ================= ENTOURAGE ================= */}
<section id="entourage" className={styles.section}>
  <div className={styles.entourageBoard}>

    <h2 className={styles.entourageTitle}>ENTOURAGE</h2>
    <p className={styles.entourageSubtitle}>Joined by those closest to our hearts</p>

    {/* Parents */}
    <div className={styles.twoCol}>
      <div>
        <div className={styles.role}>PARENTS OF THE BRIDE</div>
        <div>Henry Silvestre</div>
        <div>Flordeliza Silvestre</div>
      </div>
      <div>
        <div className={styles.role}>PARENTS OF THE GROOM</div>
        <div>Isidro Porte</div>
        <div>
          Nita Porte <span className={styles.cross}>✝</span>
        </div>
      </div>
    </div>

    {/* MOH / Best Man */}
    <div className={styles.twoCol}>
      <div>
        <div className={styles.role}>MAID OF HONOR</div>
        <div>Franz Silvestre</div>
      </div>
      <div>
        <div className={styles.role}>BEST MAN</div>
        <div>Aaron Javal</div>
      </div>
    </div>

    {/* Principal Sponsors */}
    <div className={styles.sectionLabel}>PRINCIPAL SPONSORS</div>

    <div className={styles.twoCol}>
      <div>
        <div>Cristina Meer</div>
        <div>Rosalina Licas</div>
        <div>Malou Arceo</div>
        <div>Joshene Bersales</div>
      </div>
      <div>
        <div>Jeffrey Meer</div>
        <div>Eddie Licas</div>
        <div>Joma Robles</div>
        <div>Jordan Santos</div>
      </div>
    </div>

    <div className={styles.centerNames}>
      <div>Melanie Silvestre</div>
      <div>Beverly Silvestre</div>
    </div>

    {/* Secondary Sponsors */}
    <div className={styles.sectionLabel}>SECONDARY SPONSORS</div>

    <div className={styles.threeCol}>
      <div>
        <div className={styles.roleSub}>CANDLE</div>
        <div>Kaizz Silvestre</div>
        <div>Koleen Robinos</div>
      </div>
      <div>
        <div className={styles.roleSub}>VEIL</div>
        <div>Renz Silvestre</div>
        <div>Jheraldine Perez</div>
      </div>
      <div>
        <div className={styles.roleSub}>CORD</div>
        <div>Noah Loyola</div>
        <div>Jhayle Loyola</div>
      </div>
    </div>

    {/* Bridesmaids / Groomsmen */}
    <div className={styles.twoCol}>
      <div>
        <div className={styles.role}>BRIDESMAIDS</div>
        <div>Krizia Porte</div>
        <div>Joselle Porte</div>
        <div>Francheska Zulueta</div>
      </div>
      <div>
        <div className={styles.role}>GROOMSMEN</div>
        <div>Awie Maningat</div>
        <div>Daniel Osila</div>
        <div>Ronald Bartolome</div>
      </div>
    </div>

    {/* Symbol Bearers */}
    <div className={styles.sectionLabel}>SYMBOL BEARERS</div>

    <div className={styles.threeCol}>
      <div>
        <div className={styles.roleSub}>RING</div>
        <div>Camille Maximo</div>
      </div>
      <div>
        <div className={styles.roleSub}>COIN</div>
        <div>Janica Santos</div>
      </div>
      <div>
        <div className={styles.roleSub}>BIBLE</div>
        <div>Emerald Sumalde</div>
      </div>
    </div>

  </div>
</section>



      {/* ================= PRENUP GALLERY ================= */}
      <section id="prenup-gallery" className={styles.section}>
        <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
          <div className={styles.sectionKicker}>PRENUP GALLERY</div>
          <h2 className={styles.sectionTitle}>A few snapshots we love</h2>
          <p className={styles.sectionCopy}>Captured in Taipei, Taiwan · March 30, 2025</p>
        </div>

        <div className={styles.galleryFullBleed}>
          <div className={styles.prenupGrid}>
            {galleryImages.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`${styles.prenupTile} ${styles[`t${i + 1}`]}`}
                onClick={() => openLightbox(galleryImages, i)}
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
            We know weddings come with lots of little details, so we’ve rounded up some answers to help make
            things easier before the big day.
          </p>

          <div className={styles.faqList}>
            {faqs.map((item, idx) => {
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
