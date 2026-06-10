'use client';

import { useEffect, useRef, ReactNode } from 'react';

export default function RevealWrapper({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(el.parentElement?.querySelectorAll('.reveal') ?? []);
          const idx = siblings.indexOf(el);
          el.style.transitionDelay = `${idx * 0.08}s`;
          el.classList.add('on');
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
