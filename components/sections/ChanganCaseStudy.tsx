'use client';

import { useEffect, useRef, useState } from 'react';
import { CHANGAN_MAIN_INDEX, CHANGAN_PHOTOS } from '@/data/projects';
import { track } from '@/lib/analytics';
import { PrimaryButton } from '@/components/ui/Buttons';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { HorizontalScroller } from '@/components/ui/HorizontalScroller';
import { Lightbox } from '@/components/ui/Lightbox';
import { Media } from '@/components/ui/Media';

const LB_ITEMS = CHANGAN_PHOTOS.map((p) => ({ visual: p, caption: p.caption }));
/** Secondary photos for the desktop composition, in reading order. */
const SECONDARY = [0, 3, 5];

/**
 * Main credibility proof. Real client photos only, wording limited to what is documented.
 * Desktop: the main photo holds (sticky) while copy and secondary photos scroll past it.
 * Mobile: large photo with the heading on a local scrim, then a swipe strip.
 */
export function ChanganCaseStudy() {
  const [lb, setLb] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const main = CHANGAN_PHOTOS[CHANGAN_MAIN_INDEX];

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track('changan_project_view');
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const open = (i: number) => {
    setLb(i);
    track('gallery_open', { list: 'changan', index: i + 1 });
  };

  return (
    <section id="changan" ref={ref} className="changan" aria-labelledby="chg-title">
      <div className="chg-grid">
        <div className="chg-stage">
          <figure className="chg-main">
            <button type="button" className="img-btn" onClick={() => open(CHANGAN_MAIN_INDEX)} aria-label={`Ampliar foto: ${main.caption}`}>
              <span className="chg-main-img">
                <Media visual={main} sizes="(min-width: 1080px) 56vw, 100vw" />
              </span>
            </button>
          </figure>
        </div>

        <div className="chg-col">
          <header className="chg-head">
            <SectionLabel>Proyecto destacado</SectionLabel>
            <h2 id="chg-title" className="h2 rv">
              Una marca reconocida también se construye en el espacio real.
            </h2>
          </header>
          <div className="chg-copy">
            <p className="lead rv">
              TOP Advertising acompañó la presencia de Changan en su stand de motor show con un equipo de imagen alineado con la identidad de la marca: cuidado, coherente y memorable.
            </p>
            <span className="badge rv">
              <i />
              Proyecto realizado para Changan
            </span>
            <dl className="facts rv">
              <div>
                <dt>Contexto</dt>
                <dd>Stand de marca en motor show</dd>
              </div>
              <div>
                <dt>Alcance</dt>
                <dd>Modelos y azafatas · presencia de marca</dd>
              </div>
              <div>
                <dt>Etapa</dt>
                <dd>La experiencia final</dd>
              </div>
            </dl>
            <div className="chg-cta rv">
              <PrimaryButton href="#agenda" onClick={() => track('final_cta_click', { from: 'changan' })}>
                Cotiza tu proyecto
              </PrimaryButton>
            </div>
          </div>

          <div className="chg-secondary" aria-label="Más fotos del proyecto">
            {SECONDARY.map((i, n) => {
              const p = CHANGAN_PHOTOS[i];
              return (
                <figure key={p.src} className={`chg-sec chg-sec--${n}`}>
                  <button type="button" className="img-btn reveal-mask" onClick={() => open(i)} aria-label={`Ampliar foto: ${p.caption}`}>
                    <Media visual={p} sizes="(min-width: 1080px) 26vw, 50vw" />
                  </button>
                  <figcaption>{p.caption}</figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>

      <div className="chg-strip-wrap">
        <HorizontalScroller className="chg-strip" count={CHANGAN_PHOTOS.length} label="Fotos del proyecto Changan" counter="top" autoplay={3000}>
          {CHANGAN_PHOTOS.map((p, i) => (
            <figure key={p.src} className="chg-item">
              <button type="button" className="img-btn" onClick={() => open(i)} aria-label={`Ampliar foto: ${p.caption}`}>
                <Media visual={p} sizes="86vw" />
              </button>
              <figcaption>{p.caption}</figcaption>
            </figure>
          ))}
        </HorizontalScroller>
      </div>

      <Lightbox items={LB_ITEMS} index={lb} onChange={setLb} onClose={() => setLb(null)} />
    </section>
  );
}
