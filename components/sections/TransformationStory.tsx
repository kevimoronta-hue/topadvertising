'use client';

import { useEffect, useRef, useState } from 'react';
import { TRANSFORMATION } from '@/data/projects';
import { twoDigits } from '@/lib/dates';
import { Media } from '@/components/ui/Media';

/**
 * Antes → Construcción → Revelación, the same hall in three states.
 * Images are Higgsfield art direction (illustrative scenario, not a client project).
 * Mobile/tablet: three near-full-height cards that stack (sticky) as you scroll;
 * the card underneath recedes (scroll-linked scale + dim, CSS only).
 * Desktop: sticky framed stage, each state wipes in as its text card crosses
 * the reading line. No scroll hijacking.
 */
export function TransformationStory() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = listRef.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && window.innerWidth >= 1080) setActive(Number((e.target as HTMLElement).dataset.tr));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    root.querySelectorAll('[data-tr]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="transf" aria-labelledby="tr-title">
      <div className="wrap transf-head">
        <h2 id="tr-title" className="h2 rv">
          Transformamos espacios en experiencias.
        </h2>
      </div>
      <div className="tr-layout wrap">
        <div className="tr-stage" aria-hidden="true">
          <div className="tr-frame">
            {TRANSFORMATION.map((t, i) => (
              <span key={t.title} className={`tr-layer${i <= active ? ' shown' : ''}`} style={{ zIndex: i + 1 }}>
                <Media visual={t.visual} sizes="(min-width: 1080px) 54vw, 1px" alt="" />
              </span>
            ))}
            <span className="tr-light" key={`l${active}`} />
            <span className="tr-chip">
              <b>{TRANSFORMATION[active].stage}</b>
            </span>
            <span className="tr-big" key={active}>
              {twoDigits(active + 1)}
            </span>
          </div>
        </div>
        <ol className="tr-list stack" ref={listRef} aria-label="Etapas de una transformación">
          {TRANSFORMATION.map((t, i) => (
            <li key={t.title} className={`tr-item stack-item${i === active ? ' on' : ''}`} data-tr={i} style={{ ['--i' as string]: i }}>
              <article className="tr-card stack-card">
                <div className="tr-media">
                  <Media visual={t.visual} sizes="(min-width: 1080px) 1px, (min-width: 760px) 680px, 92vw" />
                  <span className="tr-chip tr-chip--inline">
                    <b>{t.stage}</b>
                  </span>
                </div>
                <div className="tr-text">
                  <span className="tr-num">{twoDigits(i + 1)}</span>
                  <h3 className="h3">{t.title}</h3>
                  <p>{t.text}</p>
                </div>
                <span className="stack-shade" aria-hidden="true" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
