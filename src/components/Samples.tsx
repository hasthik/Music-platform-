'use client';

import { useRef } from 'react';
import RevealWrapper from './RevealWrapper';

interface SampleSong {
  id: string;
  tag: string;
  title: string;
  description: string;
  src: string;
  duration: string;
}

const SAMPLES: SampleSong[] = [
  {
    id: 'audio1',
    tag: 'Birthday · Emotional',
    title: '"A birthday surprise she\'ll never forget"',
    description:
      "A tender ballad woven from years of small moments, inside jokes, and unconditional love — written to make her cry and laugh in the same breath.",
    src: '',
    duration: '2:34',
  },
  {
    id: 'audio2',
    tag: 'Friendship · Funny',
    title: '"Roasting my best friend 😂"',
    description:
      "Playful, uptempo, and absolutely ruthless — calling out every embarrassing memory while still saying “I love you” between the verses.",
    src: '',
    duration: '1:58',
  },
  {
    id: 'audio3',
    tag: 'Anniversary · Romantic',
    title: '"For the one who means everything"',
    description:
      "A cinematic love letter set to music — capturing the quiet, extraordinary feeling of being completely known by another person.",
    src: '',
    duration: '3:12',
  },
];

function AudioPlayer({ song }: { song: SampleSong }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const wvRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const btn = btnRef.current;
    const wv = wvRef.current;
    const audio = audioRef.current;
    if (!btn || !wv) return;

    const playing = btn.classList.contains('paused');

    // Stop all other players first
    document.querySelectorAll('.pbtn.paused').forEach((b) => {
      b.classList.remove('paused');
      b.closest('.player')?.querySelector('.wv')?.classList.remove('live');
      const a = b.closest('.card')?.querySelector('audio') as HTMLAudioElement | null;
      a?.pause();
      if (a) a.currentTime = 0;
    });

    if (!playing) {
      btn.classList.add('paused');
      wv.classList.add('live');
      if (audio?.src && audio.src !== window.location.href) {
        audio.play().catch(console.error);
      }
      audio?.addEventListener('ended', () => {
        btn.classList.remove('paused');
        wv.classList.remove('live');
      }, { once: true });
    }
  };

  return (
    <div className="player" onClick={toggle}>
      <audio ref={audioRef} id={song.id} src={song.src} preload="none" />
      <button ref={btnRef} className="pbtn" aria-label="Play/Pause">
        <span className="pring" />
        <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
      </button>
      <div ref={wvRef} className="wv">
        {Array.from({ length: 12 }).map((_, i) => <div key={i} className="wb" />)}
      </div>
      <span className="pdur">{song.duration}</span>
    </div>
  );
}

export default function Samples() {
  return (
    <section id="samples">
      <RevealWrapper className="samples-intro">
        <p className="sec-label">Sample Songs</p>
        <h2 className="sec-h">Hear what we <em>craft</em></h2>
        <p className="sec-sub">
          Every song is composed, written, and recorded from scratch. Here&apos;s a taste of what we create.
        </p>
      </RevealWrapper>

      <div className="cards">
        {SAMPLES.map((song) => (
          <RevealWrapper key={song.id} className="card">
            <span className="card-tag">{song.tag}</span>
            <h3>{song.title}</h3>
            <p>{song.description}</p>
            <AudioPlayer song={song} />
          </RevealWrapper>
        ))}
      </div>
    </section>
  );
}
