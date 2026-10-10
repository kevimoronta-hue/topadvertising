'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { Visual } from '@/types';
import { twoDigits } from '@/lib/dates';
import { Icon } from './Icon';
import { VisualPlaceholder } from './VisualPlaceholder';

export interface LightboxItem {
  visual: Visual;
  caption: string;
}

interface Props {
  items: LightboxItem[];
  index: number | null;
  onChange: (i: number) => void;
  onClose: () => void;
}

/** Accessible modal viewer: focus trap, Escape, arrow keys, body scroll lock, focus restored on close. */
export function Lightbox({ items, index, onChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    ref.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = '';
      returnTo.current?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;
  const item = items[index];
  const move = (d: number) => onChange((index + d + items.length) % items.length);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowLeft') move(-1);
    else if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'Tab' && ref.current) {
      const els = ref.current.querySelectorAll<HTMLElement>('button');
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div ref={ref} className="lb" role="dialog" aria-modal="true" aria-label="Visor de imágenes" tabIndex={-1} onKeyDown={onKeyDown}>
      <button type="button" className="lb-close" aria-label="Cerrar visor" onClick={onClose}>
        <Icon name="close" strokeWidth={1.5} />
      </button>
      <figure className="lb-fig">
        {item.visual.kind !== 'placeholder' ? (
          <Image src={item.visual.src} alt={item.visual.alt} width={item.visual.width} height={item.visual.height} sizes="(min-width: 1200px) 1100px, 100vw" />
        ) : (
          <span className="lb-ph">
            <VisualPlaceholder visual={item.visual} showRatio={false} />
          </span>
        )}
        <figcaption>
          {item.caption} · {twoDigits(index + 1)} / {twoDigits(items.length)}
        </figcaption>
      </figure>
      <button type="button" className="lb-arrow lb-prev" aria-label="Imagen anterior" onClick={() => move(-1)}>
        <Icon name="chevronLeft" />
      </button>
      <button type="button" className="lb-arrow lb-next" aria-label="Imagen siguiente" onClick={() => move(1)}>
        <Icon name="chevronRight" />
      </button>
    </div>
  );
}
