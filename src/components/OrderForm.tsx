'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOrder } from '@/context/OrderContext';
import { DELIVERY_TIERS, type Plan, type Delivery } from '@/lib/delivery-tiers';
import RevealWrapper from './RevealWrapper';
import PaymentOverlay from './PaymentOverlay';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+]?[\d\s\-().]{8,15}$/;

interface OverlayState {
  visible: boolean;
  icon: string;
  title: string;
  message: string;
  showClose: boolean;
}

const CLOSED_OVERLAY: OverlayState = {
  visible: false, icon: '', title: '', message: '', showClose: false,
};

function showSpinner(title: string, message: string): OverlayState {
  return { visible: true, icon: '', title, message, showClose: false };
}

function showResult(icon: string, title: string, message: string): OverlayState {
  return { visible: true, icon, title, message, showClose: true };
}

// Lazily loads the Razorpay checkout SDK
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const OCCASIONS = [
  'Birthday', 'Anniversary', 'Proposal', 'Wedding',
  'Farewell / Retirement', 'Friendship / Roast',
  "Mother's / Father's Day", 'Just Because', 'Other',
];

const LANGUAGES = ['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Punjabi', 'Bengali', 'Kannada'];
const TONES = ['💛 Emotional', '😂 Funny', '💗 Romantic', '✨ Uplifting'];
const DELIVERY_LABELS: Record<Delivery, string> = {
  '6h':  'Express — within 6 hours',
  '24h': 'Standard — within 24 hours',
  '48h': 'Relaxed — within 48 hours',
};

export default function OrderForm() {
  const { activePlan, activeDelivery, setPlan } = useOrder();
  const [tone, setTone] = useState('');
  const [overlay, setOverlay] = useState<OverlayState>(CLOSED_OVERLAY);
  const [loading, setLoading] = useState(false);

  const [hours,   setHours]   = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(23, 59, 59, 0);
      let diff = Math.max(0, midnight.getTime() - now.getTime());
      const h = Math.floor(diff / 3_600_000); diff %= 3_600_000;
      const m = Math.floor(diff /    60_000); diff %=    60_000;
      const s = Math.floor(diff /     1_000);
      setHours(String(h).padStart(2, '0'));
      setMinutes(String(m).padStart(2, '0'));
      setSeconds(String(s).padStart(2, '0'));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const getField = (id: string) =>
    (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value.trim() ?? '';

  const validate = useCallback((): boolean => {
    const name  = getField('f-name');
    const email = getField('f-email');
    const occasion = getField('f-occasion');
    const story = getField('f-story');
    const phone = getField('f-phone');

    if (!name)                        { alert('Please enter your name.');                              return false; }
    if (!EMAIL_RE.test(email))        { alert('Please enter a valid email address.');                  return false; }
    if (phone && !PHONE_RE.test(phone)) { alert('Please enter a valid phone number.');                 return false; }
    if (!occasion)                    { alert('Please select an occasion.');                           return false; }
    if (story.length < 20)            { alert('Please share a bit more about your story!');            return false; }
    return true;
  }, []);

  const startPayment = async () => {
    if (!validate()) return;
    setLoading(true);

    const tier = DELIVERY_TIERS[activeDelivery][activePlan];
    const formData = {
      name:      getField('f-name'),
      email:     getField('f-email'),
      phone:     getField('f-phone'),
      occasion:  getField('f-occasion'),
      recipient: getField('f-recipient'),
      story:     getField('f-story'),
      favsong:   getField('f-favsong'),
      language:  getField('f-language'),
      delivery:  DELIVERY_LABELS[activeDelivery],
      tone:      tone || 'Not selected',
      plan:      tier.name,
      amount:    tier.label,
    };

    // Step 1 — create order server-side (amount is set on the server, not by client JS)
    setOverlay(showSpinner('Creating your order…', 'Just a moment.'));
    let orderId: string, amount: number, key: string;
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: activePlan, delivery: activeDelivery }),
      });
      if (!res.ok) throw new Error(await res.text());
      ({ orderId, amount, key } = await res.json());
    } catch {
      setOverlay(showResult('❌', 'Error', 'Could not create order. Please try again.'));
      setLoading(false);
      return;
    }

    // Step 2 — load Razorpay SDK
    const loaded = await loadRazorpay();
    if (!loaded) {
      setOverlay(showResult('❌', 'Error', 'Could not load payment gateway. Check your connection.'));
      setLoading(false);
      return;
    }

    setOverlay(CLOSED_OVERLAY);
    setLoading(false);

    // Step 3 — open checkout (amount comes from server, not local state)
    const rzp = new window.Razorpay({
      key,
      amount,
      currency: 'INR',
      name: 'Solenne Studios',
      description: tier.name,
      order_id: orderId,
      prefill: { name: formData.name, email: formData.email, contact: formData.phone },
      notes: { plan: formData.plan, occasion: formData.occasion, language: formData.language },
      theme: { color: '#C9A96E' },
      handler: async (response) => {
        // Step 4 — verify signature server-side before showing success
        setOverlay(showSpinner('Verifying payment…', 'Confirming your payment.'));
        try {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              formData,
            }),
          });
          if (!verifyRes.ok) throw new Error('Verification failed');
          setOverlay(showResult(
            '🎵',
            'Order Confirmed!',
            `Payment of ${formData.amount} received. Your custom song will be delivered to ${formData.email} within your chosen timeframe. Thank you!`,
          ));
        } catch {
          setOverlay(showResult(
            '⚠️',
            'Payment Received — Contact Us',
            `We received your payment (ID: ${response.razorpay_payment_id}) but could not confirm your order automatically. Please email us with this ID and we will take care of it.`,
          ));
        }
      },
      modal: { ondismiss: () => setOverlay(CLOSED_OVERLAY) },
    });

    rzp.on('payment.failed', () => {
      setOverlay(showResult('❌', 'Payment Failed', 'Payment was unsuccessful. Please try again.'));
    });

    rzp.open();
  };

  const tier = DELIVERY_TIERS[activeDelivery][activePlan];

  return (
    <>
      <PaymentOverlay {...overlay} onClose={() => setOverlay(CLOSED_OVERLAY)} />

      <section id="order">
        <div className="order-inner">
          {/* Left column */}
          <div className="order-left">
            <RevealWrapper><p className="sec-label">Place Your Order</p></RevealWrapper>
            <RevealWrapper><h2 className="sec-h">Tell us <em>everything</em></h2></RevealWrapper>
            <RevealWrapper>
              <p>The smallest detail — a nickname, a shared joke, a first memory — becomes the most powerful line in the song.</p>
            </RevealWrapper>

            <RevealWrapper className="promises">
              {[
                ['✍️', 'Written from your words',       'We read every detail before writing a single note.'],
                ['⏱️', 'Delivered on time',              'Express or standard — we always stick to our timelines.'],
                ['🎧', 'Real artist, real recording',    'Studio-quality vocals. No AI shortcuts, ever.'],
                ['🔒', 'Secure payment via Razorpay',   'Pay after filling the form. Order confirmed only on payment.'],
              ].map(([icon, heading, body]) => (
                <div key={heading} className="promise">
                  <div className="p-icon">{icon}</div>
                  <div className="p-text"><h4>{heading}</h4><p>{body}</p></div>
                </div>
              ))}
            </RevealWrapper>

            <RevealWrapper className="timer-box">
              <p className="timer-label">Today&apos;s slots</p>
              <p className="timer-sub">Closes at midnight tonight</p>
              <div className="dials">
                <div className="dial"><span className="dial-num">{hours}</span><span className="dial-lbl">Hrs</span></div>
                <span className="dial-sep">:</span>
                <div className="dial"><span className="dial-num">{minutes}</span><span className="dial-lbl">Min</span></div>
                <span className="dial-sep">:</span>
                <div className="dial"><span className="dial-num">{seconds}</span><span className="dial-lbl">Sec</span></div>
              </div>
            </RevealWrapper>
          </div>

          {/* Right column — form */}
          <RevealWrapper className="form-box">
            <h3>Order Your Song</h3>

            <div className="row">
              <label>Select Your Plan</label>
              <div className="plan-tabs">
                {(['single', 'bundle'] as Plan[]).map((p) => (
                  <button
                    key={p}
                    className={`plan-tab ${activePlan === p ? 'on' : ''}`}
                    onClick={() => setPlan(p)}
                  >
                    {p === 'single' ? '1 Song' : '2 Songs Bundle'}
                    <span className="ptab-price">{DELIVERY_TIERS[activeDelivery][p].label}</span>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted2)', marginTop: '0.5rem', textAlign: 'center', letterSpacing: '0.04em' }}>
                Price reflects your selected delivery speed above
              </p>
            </div>

            <div className="row"><label>Your Name</label><input type="text" id="f-name" placeholder="e.g. Priya Sharma" autoComplete="name" /></div>
            <div className="row"><label>Your Email (for delivery)</label><input type="email" id="f-email" placeholder="you@example.com" autoComplete="email" /></div>
            <div className="row"><label>Your Phone</label><input type="tel" id="f-phone" placeholder="+91 98765 43210" autoComplete="tel" /></div>

            <div className="row">
              <label>Occasion</label>
              <select id="f-occasion" defaultValue="">
                <option value="" disabled>Select an occasion</option>
                {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="row"><label>Recipient&apos;s Name</label><input type="text" id="f-recipient" placeholder="Who is this song for?" /></div>
            <div className="row">
              <label>Your Story &amp; Details</label>
              <textarea id="f-story" placeholder="Share memories, moments, inside jokes — the more you tell us, the more personal the song will be." />
            </div>
            <div className="row"><label>Your Favourite Song</label><input type="text" id="f-favsong" placeholder="e.g. Tum Hi Ho, Perfect by Ed Sheeran…" /></div>

            <div className="row">
              <label>Song Language</label>
              <select id="f-language">
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div className="row">
              <label>Tone</label>
              <div className="tone-btns">
                {TONES.map((t) => (
                  <button key={t} className={`tone ${tone === t ? 'on' : ''}`} onClick={() => setTone(t === tone ? '' : t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="row">
              <label>Delivery Preference</label>
              <select id="f-delivery" defaultValue={DELIVERY_LABELS[activeDelivery]}>
                {(Object.entries(DELIVERY_LABELS) as [Delivery, string][]).map(([, label]) => (
                  <option key={label}>{label}</option>
                ))}
              </select>
            </div>

            <button className="pay-btn" onClick={startPayment} disabled={loading}>
              <span className="pay-lock">🔒</span>
              <span>Pay &amp; Confirm Order —</span>
              <span>{tier.label}</span>
            </button>
            <p className="pay-sub">Secured by Razorpay · UPI, Cards, Net Banking accepted</p>
          </RevealWrapper>
        </div>
      </section>
    </>
  );
}
