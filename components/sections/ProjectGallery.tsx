'use client';

import { useState } from 'react';
import { GALLERY } from '@/data/gallery';
import { track } from '@/lib/analytics';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { HorizontalScroller } from '@/components/ui/HorizontalScroller';
import { Lightbox } from '@/components/ui/Lightbox';
import { Media } from '@/components/ui/Media';

const LB_ITEMS = GALLERY.map((g) => ({ visual: g.visual, caption: g.caption }));

/** One dominant image, then details at their natural ratios (desktop: editorial columns). */
export function ProjectGallery() {
  const [lb, setLb] = useState<number | null>(null);

  const open = (i: number) => {
    setLb(i);
    track('gallery_open', { list: 'gallery', index: i + 1 });
  };

  return (
    <section id="proyectos" className="gallery" aria-labelledby="gal-title">
      <div className="wrap gal-head">
        <SectionLabel dark>Experiencias visuales</SectionLabel>
        <h2 id="gal-title" className="h2 rv">
          Ideas que toman forma.
        </h2>
        <p className="lead rv">Cada proyecto comienza con una intención y termina convirtiéndose en un espacio que la gente puede ver, recorrer y recordar.</p>
      </div>
      <HorizontalScroller className="gal-track" count={GALLERY.length} label="Galería de proyectos" arrows autoplay={3000}>
        {GALLERY.map((g, i) => {
          const real = g.visual.kind === 'photo';
          return (
            <figure key={g.id} className={`gal-item${g.lead ? ' gal-item--lead' : ''}`} style={{ ['--ratio' as string]: g.ratio }}>
              <button type="button" className="img-btn reveal-mask" onClick={() => open(i)} aria-label={`Ampliar: ${g.caption}`}>
                <Media visual={g.visual} sizes={g.lead ? '(min-width: 1080px) 92vw, 86vw' : '(min-width: 1080px) 30vw, 86vw'} />
              </button>
              <figcaption>
                <b>{g.caption}</b>
                {real && <span>Proyecto realizado para Changan</span>}
              </figcaption>
            </figure>
          );
        })}
      </HorizontalScroller>
      <Lightbox items={LB_ITEMS} index={lb} onChange={setLb} onClose={() => setLb(null)} />
    </section>
  );
}
