'use client';

import Link from 'next/link';
import { useOrder } from '@/context/OrderContext';
import { DELIVERY_TIERS, type Delivery, type Plan } from '@/lib/delivery-tiers';
import RevealWrapper from './RevealWrapper';

const DELIVERY_OPTIONS: { id: Delivery; label: string }[] = [
  { id: '6h',  label: '⚡ 6 Hours'  },
  { id: '24h', label: '🕐 24 Hours' },
  { id: '48h', label: '📅 48 Hours' },
];

const SINGLE_FEATURES = [
  'Custom lyrics written from your story',
  'Professionally recorded vocals',
  'Your choice of language & tone',
  'High-quality audio file delivered',
];

const BUNDLE_FEATURES = [
  'Everything in Single Song',
  'Two fully custom songs',
  'Different tones or languages',
  'Perfect for two occasions at once',
];

function preselectAndScroll(plan: Plan, setPlan: (p: Plan) => void) {
  setPlan(plan);
  document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
}

export default function Pricing() {
  const { activeDelivery, setDelivery, setPlan } = useOrder();
  const tier = DELIVERY_TIERS[activeDelivery];

  return (
    <section id="pricing">
      <div className="pricing-inner">
        <RevealWrapper className="pricing-top">
          <p className="sec-label" style={{ justifyContent: 'center' }}>Pricing</p>
          <h2 className="sec-h" style={{ margin: '0 auto' }}>Simple, <em>honest</em> pricing</h2>
          <p className="sec-sub" style={{ margin: '0.9rem auto 0' }}>
            No subscriptions. No hidden fees. Just a song that will be remembered forever.
          </p>
        </RevealWrapper>

        <RevealWrapper className="delivery-tabs">
          {DELIVERY_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              className={`dtab ${activeDelivery === id ? 'on' : ''}`}
              onClick={() => setDelivery(id)}
            >
              {label}
            </button>
          ))}
        </RevealWrapper>

        <div className="p-cards">
          <RevealWrapper className="pc basic">
            <p className="pc-label">Single Song</p>
            <div className="pc-price"><sup>₹</sup>{tier.single.display}</div>
            <p className="pc-per">{tier.single.per}</p>
            <div className="pc-divider" />
            <div className="pc-features">
              {SINGLE_FEATURES.map((f) => <div key={f} className="pc-feat">{f}</div>)}
              <div className="pc-feat">{tier.single.feat}</div>
            </div>
            <button className="pc-cta" onClick={() => preselectAndScroll('single', setPlan)}>
              Order Now
            </button>
          </RevealWrapper>

          <RevealWrapper className="pc pro">
            <div className="pc-badge">Best Value</div>
            <p className="pc-label">Double Bundle</p>
            <div className="pc-price"><sup>₹</sup>{tier.bundle.display}</div>
            <p className="pc-per">{tier.bundle.per}</p>
            <div className="pc-divider" />
            <div className="pc-features">
              {BUNDLE_FEATURES.map((f) => <div key={f} className="pc-feat">{f}</div>)}
              <div className="pc-feat">{tier.bundle.feat}</div>
            </div>
            <button className="pc-cta" onClick={() => preselectAndScroll('bundle', setPlan)}>
              Order Bundle
            </button>
          </RevealWrapper>
        </div>

        <RevealWrapper>
          <p className="p-note">
            Each song is written from scratch based on your story — never templated, never recycled.
          </p>
        </RevealWrapper>
      </div>
    </section>
  );
}
