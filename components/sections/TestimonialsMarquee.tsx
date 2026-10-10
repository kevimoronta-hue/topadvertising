'use client';

import { useEffect, useRef } from 'react';
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials';
import { Media } from '@/components/ui/Media';

const ROW_A = TESTIMONIALS.slice(0, 5);
const ROW_B = TESTIMONIALS.slice(5).concat(TESTIMONIALS.slice(0, 1));

function Card({ t, hidden }: { t: Testimonial; hidden?: boolean }) {
  return (
    <figure className="tcard" aria-hidden={hidden || undefined}>
      <span className="tcard-img">
        <Media visual={t.image} sizes="(min-width: 1080px) 420px, 300px" alt={hidden ? '' : t.image.alt} />
      </span>
      <blockquote className="tcard-quote">“{t.quote}”</blockquote>
      <figcaption className="tcard-role">{t.role}</figcaption>
    </figure>
  );
}

const LOCK_PX = 6; // movement before deciding the gesture axis
const RESUME_MS = 1200; // pause after the finger leaves (and inertia settles)
const RAMP_S = 0.6; // autoplay eases back in over this time
const FRICTION = 4.5; // inertia decay (per second, exponential)

/**
 * One row = one engine. A single rAF loop is the only writer of the track's transform:
 * - autoplay: constant speed (one copy width per `duration` seconds), direction per row;
 * - drag: the finger sets the offset directly (horizontal gestures only, axis-locked);
 * - inertia: release velocity decays, then a short pause, then autoplay ramps back in.
 * The offset wraps over one copy width, so the loop is seamless in both directions.
 * Vertical gestures are left to the browser (touch-action: pan-y) and never blocked.
 */
function Row({ items, reverse, duration }: { items: Testimonial[]; reverse?: boolean; duration: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const handlers = useRef<{
    down: (e: React.PointerEvent) => void;
    move: (e: React.PointerEvent) => void;
    up: (e: React.PointerEvent) => void;
    enter: (e: React.PointerEvent) => void;
    leave: (e: React.PointerEvent) => void;
  } | null>(null);

  useEffect(() => {
    const row = rowRef.current!;
    const track = trackRef.current!;
    const group = groupRef.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dir = reverse ? 1 : -1;

    let width = group.offsetWidth;
    let x = reverse ? -width / 2 : 0;
    let mode: 'auto' | 'hold' | 'drag' | 'inertia' | 'rest' = 'auto';
    let ramp = 1;
    let resumeAt = 0;
    let vInertia = 0;
    let hover = false;
    let visible = false;
    let raf = 0;
    let last = 0;

    // gesture state
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startOffset = 0;
    let axis: 'x' | 'y' | null = null;
    const samples: { t: number; x: number }[] = [];

    const wrap = (v: number) => {
      if (!width) return v;
      let r = v % width;
      if (r > 0) r -= width;
      return r;
    };
    const paint = () => {
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    };

    const frame = (t: number) => {
      const dt = last ? Math.min(t - last, 50) / 1000 : 0;
      last = t;
      if (mode === 'inertia') {
        x += vInertia * dt;
        vInertia *= Math.exp(-FRICTION * dt);
        if (Math.abs(vInertia) < 12) {
          mode = 'rest';
          resumeAt = t + RESUME_MS;
        }
      } else if (mode === 'rest' && t >= resumeAt) {
        mode = 'auto';
        ramp = 0;
      } else if (mode === 'auto' && !hover && !reduced) {
        ramp = Math.min(1, ramp + dt / RAMP_S);
        const eased = ramp * ramp * (3 - 2 * ramp);
        x += dir * (width / duration) * eased * dt;
      }
      x = wrap(x);
      paint();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(() => {
      width = group.offsetWidth;
      x = wrap(x);
      paint();
    });
    ro.observe(group);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else if (pointerId === null) stop();
    });
    io.observe(row);
    paint();

    const release = (now: number) => {
      pointerId = null;
      axis = null;
      if (mode === 'drag') {
        const recent = samples.filter((s) => now - s.t < 90);
        const a = recent[0];
        const b = recent[recent.length - 1];
        const v = a && b && b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0;
        vInertia = Math.max(-2600, Math.min(2600, v));
        mode = Math.abs(vInertia) > 40 ? 'inertia' : 'rest';
        resumeAt = performance.now() + RESUME_MS;
      } else {
        mode = 'rest';
        resumeAt = performance.now() + RESUME_MS;
      }
      if (!visible) stop();
    };

    handlers.current = {
      down: (e) => {
        if (pointerId !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
        pointerId = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        startOffset = x;
        axis = null;
        samples.length = 0;
        mode = 'hold'; // this row stops under the finger; the other row keeps moving
        start();
      },
      move: (e) => {
        if (e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (axis === null) {
          if (Math.abs(dx) < LOCK_PX && Math.abs(dy) < LOCK_PX) return;
          axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
          if (axis === 'y') {
            // vertical intent: hand the gesture back to the page
            release(e.timeStamp);
            return;
          }
          row.setPointerCapture(e.pointerId);
          mode = 'drag';
          startX = e.clientX; // no jump at lock time
          startOffset = x;
        }
        if (axis === 'x') {
          x = wrap(startOffset + (e.clientX - startX));
          samples.push({ t: e.timeStamp, x: e.clientX });
          if (samples.length > 8) samples.shift();
        }
      },
      up: (e) => {
        if (e.pointerId !== pointerId) return;
        if (row.hasPointerCapture(e.pointerId)) row.releasePointerCapture(e.pointerId);
        release(e.timeStamp);
      },
      enter: (e) => {
        if (e.pointerType === 'mouse') hover = true;
      },
      leave: (e) => {
        if (e.pointerType === 'mouse') hover = false;
      },
    };

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      handlers.current = null;
    };
  }, [reverse, duration]);

  return (
    <div
      ref={rowRef}
      className="marquee"
      onPointerDown={(e) => handlers.current?.down(e)}
      onPointerMove={(e) => handlers.current?.move(e)}
      onPointerUp={(e) => handlers.current?.up(e)}
      onPointerCancel={(e) => handlers.current?.up(e)}
      onPointerEnter={(e) => handlers.current?.enter(e)}
      onPointerLeave={(e) => handlers.current?.leave(e)}
      onDragStart={(e) => e.preventDefault()}
    >
      <div ref={trackRef} className="marquee-track">
        <div ref={groupRef} className="marquee-group">
          {items.map((t) => (
            <Card key={t.id} t={t} />
          ))}
        </div>
        <div className="marquee-group is-copy" aria-hidden="true">
          {items.map((t) => (
            <Card key={`${t.id}-copy`} t={t} hidden />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  return (
    <section className="voices" aria-labelledby="voices-title">
      <div className="wrap voices-head">
        <h2 id="voices-title" className="h2 rv">
          Cuando todo está en su lugar, se nota.
        </h2>
      </div>
      <Row items={ROW_A} duration={70} />
      <Row items={ROW_B} reverse duration={80} />
    </section>
  );
}
