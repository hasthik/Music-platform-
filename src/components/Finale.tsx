import Link from 'next/link';
import RevealWrapper from './RevealWrapper';

export default function Finale() {
  return (
    <section id="finale">
      <div className="finale-notes">♩ ♫ ♪ ♬ 𝄞</div>
      <RevealWrapper><p className="sec-label">The Gift That Outlasts Everything</p></RevealWrapper>
      <RevealWrapper>
        <h2>Make someone feel something <span>unforgettable.</span></h2>
      </RevealWrapper>
      <RevealWrapper>
        <p>A song made from their story. A moment they&apos;ll carry for the rest of their life.</p>
      </RevealWrapper>
      <RevealWrapper>
        <Link href="#order" className="btn-gold">Order Now</Link>
      </RevealWrapper>
    </section>
  );
}
