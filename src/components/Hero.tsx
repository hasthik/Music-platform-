'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const LANGUAGES = ['Hindi 🇮🇳', 'English 🇬🇧', 'Marathi', 'Tamil', 'Telugu', 'Punjabi', 'Bengali', 'Kannada'];

export default function Hero() {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.unobserve(el);
          let n = 0;
          const timer = setInterval(() => {
            n = Math.min(n + 30, 1926);
            setCount(n);
            if (n >= 1926) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="hero">
      <div className="hero-glow" />
      <div className="hero-grid" />
      <div className="hero-ring">
        <div className="orbit">
          <div className="orbit-dot" />
        </div>
      </div>

      <p className="hero-tag">Handcrafted Personalized Songs</p>
      <h1 className="hero-h">
        Turn your <em>story</em><br />into a song 🎵
        <span className="small">delivered in just 6 hours</span>
      </h1>
      <p className="hero-sub">
        A custom song made from your memories, written and recorded by a real artist — just for you.
      </p>

      <div className="hero-btns">
        <Link href="#order" className="btn-gold">Create Your Song</Link>
        <Link href="#samples" className="btn-outline">Hear Samples</Link>
      </div>

      <div className="lang-row">
        <span className="lang-lbl">Available in</span>
        <div className="langs">
          {LANGUAGES.map((l) => (
            <span key={l} className="lang">{l}</span>
          ))}
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat">
          <h3 ref={counterRef}>{count.toLocaleString()}+</h3>
          <p>Stories Turned Into Songs</p>
        </div>
        <div className="stat">
          <h3>6 hrs</h3>
          <p>Average Delivery Time</p>
        </div>
        <div className="stat">
          <h3>8</h3>
          <p>Languages</p>
        </div>
        <div className="stat">
          <h3>100%</h3>
          <p>Human Written</p>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
