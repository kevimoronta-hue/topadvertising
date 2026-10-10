'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { twoDigits } from '@/lib/dates';
import { Icon } from './Icon';

interface Props {
  children: ReactNode;
  count: number;
  label: string;
  /** Extra classes on the track (desktop layouts restyle it). */
  className?: string;
  as?: 'div' | 'ol';
  counter?: 'top' | 'bottom' | false;
  counterClassName?: string;
  dots?: { labels: string[]; dark?: boolean };
  /** Prev / next buttons next to the counter. */
  arrows?: boolean;
  /** Autoplay interval in ms. Only runs while the track actually scrolls (mobile/tablet), is on screen, and the user is not touching it. */
  autoplay?: number;
  onIndexChange?: (i: number) => void;
}

const RESUME_AFTER = 4000;

/**
 * Native touch carousel (scroll-snap + momentum). Autoplay is a courtesy:
 * any touch, wheel, key or focus pauses it at once; it resumes after a pause.
 * Wraps from last to first with a smooth scroll (no jump).
 */
export function HorizontalScroller({ children, count, label, className = '', as = 'div', counter = 'bottom', counterClassName = '', dots, arrows = false, autoplay, onIndexChange }: Props) {
  const ref = useRef<HTMLDivElement & HTMLOListElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const pausedUntil = useRef(0);
  const holding = useRef(false);
  const visible = useRef(false);

  const items = () => (ref.current?.children ?? []) as HTMLCollectionOf<HTMLElement>;
  const scrollable = () => {
    const el = ref.current;
    return !!el && el.scrollWidth - el.clientWidth > 8;
  };

  const onScroll = useCallback(() => {
    const el = ref.current;
    const kids = items();
    if (!el || kids.length === 0) return;
    const step = kids.length > 1 ? kids[1].offsetLeft - kids[0].offsetLeft : kids[0].offsetWidth;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
    const i = atEnd ? kids.length - 1 : Math.max(0, Math.min(kids.length - 1, Math.round(el.scrollLeft / (step || 1))));
    if (i !== indexRef.current) {
      indexRef.current = i;
      setIndex(i);
      onIndexChange?.(i);
    }
  }, [onIndexChange]);

  const goTo = useCallback((i: number) => {
    const el = ref.current;
    const kids = items();
    if (!el || !kids[i]) return;
    el.scrollTo({ left: kids[i].offsetLeft - kids[0].offsetLeft, behavior: 'smooth' });
  }, []);

  const pause = (ms = RESUME_AFTER) => {
    pausedUntil.current = Date.now() + ms;
  };

  // Autoplay loop: one timer, no per-frame work.
  useEffect(() => {
    if (!autoplay || !ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const t = setInterval(() => {
      if (!visible.current || holding.current || document.hidden || Date.now() < pausedUntil.current || !scrollable()) return;
      if (el.contains(document.activeElement)) return;
      const next = indexRef.current + 1 >= count ? 0 : indexRef.current + 1;
      goTo(next);
    }, autoplay);
    return () => {
      clearInterval(t);
      io.disconnect();
    };
  }, [autoplay, count, goTo]);

  const Tag = as;
  const atStart = index === 0;
  const atEnd = index >= count - 1;
  const move = (d: number) => {
    pause();
    goTo(Math.max(0, Math.min(count - 1, indexRef.current + d)));
  };

  const counterEl =
    counter || arrows ? (
      <div className={`scroller-bar ${counterClassName}`}>
        {counter && (
          <p className="counter" aria-live="polite">
            <b>{twoDigits(index + 1)}</b> / {twoDigits(count)}
          </p>
        )}
        {arrows && (
          <div className="arrows">
            <button type="button" className="arrow" aria-label="Anterior" disabled={atStart} onClick={() => move(-1)}>
              <Icon name="chevronLeft" />
            </button>
            <button type="button" className="arrow" aria-label="Siguiente" disabled={atEnd} onClick={() => move(1)}>
              <Icon name="chevronRight" />
            </button>
          </div>
        )}
      </div>
    ) : null;

  return (
    <>
      {counter === 'top' && counterEl}
      <Tag
        ref={ref}
        className={`track ${className}`}
        onScroll={onScroll}
        onPointerDown={() => {
          holding.current = true;
          pause();
        }}
        onPointerUp={() => {
          holding.current = false;
          pause();
        }}
        onPointerCancel={() => {
          holding.current = false;
          pause();
        }}
        onTouchStart={() => {
          holding.current = true;
          pause();
        }}
        onTouchEnd={() => {
          holding.current = false;
          pause();
        }}
        onWheel={() => pause()}
        onKeyDown={() => pause()}
        role="region"
        aria-label={label}
        aria-roledescription="carrusel"
        tabIndex={0}
      >
        {children}
      </Tag>
      {counter !== 'top' && counterEl}
      {dots && (
        <div className={`dots${dots.dark ? ' dots--dark' : ''}`}>
          {dots.labels.map((l, i) => (
            <button
              key={l}
              type="button"
              className={`dot${i === index ? ' on' : ''}`}
              aria-label={`Ir a ${l}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => {
                pause();
                goTo(i);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
