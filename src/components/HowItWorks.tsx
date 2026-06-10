import Link from 'next/link';
import RevealWrapper from './RevealWrapper';

const STEPS = [
  {
    n: '01',
    icon: '✍️',
    title: 'Share your story',
    body: 'Tell us about the person, the occasion, and the memories that matter. The more detail you share, the more personal the song becomes.',
  },
  {
    n: '02',
    icon: '🎼',
    title: 'We turn it into a song',
    body: 'Our artist writes custom lyrics, composes a melody, and records a full track in your chosen language — crafted entirely around your story.',
  },
  {
    n: '03',
    icon: '📩',
    title: 'Receive it in 6 hours',
    body: 'A studio-quality audio file lands in your inbox, ready to share, gift, or play at the perfect moment.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="how-inner">
        <RevealWrapper className="how-top">
          <div>
            <p className="sec-label">The Process</p>
            <h2 className="sec-h">Three steps to <em>something unforgettable</em></h2>
          </div>
          <Link href="#order" className="btn-gold" style={{ flexShrink: 0 }}>Start Now</Link>
        </RevealWrapper>
        <div className="steps">
          {STEPS.map((s) => (
            <RevealWrapper key={s.n} className="step">
              <div className="step-n">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
