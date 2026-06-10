'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={scrolled ? 'stuck' : ''}>
        <Link href="#" className="logo">
          solenne<span> studios</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="#samples">Samples</Link></li>
          <li><Link href="#how">How It Works</Link></li>
          <li><Link href="#pricing">Pricing</Link></li>
          <li>
            <Link href="#order" className="nav-btn">Create Your Song</Link>
          </li>
        </ul>
        <button
          className="ham"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="#samples" onClick={() => setMenuOpen(false)}>Samples</Link>
        <Link href="#how" onClick={() => setMenuOpen(false)}>How It Works</Link>
        <Link href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
        <Link href="#order" onClick={() => setMenuOpen(false)}>Order</Link>
      </div>
    </>
  );
}
