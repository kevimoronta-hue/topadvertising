'use client';

import { useEffect, useRef, useState } from 'react';
import { SERVICES } from '@/data/services';
import { track } from '@/lib/analytics';
import { twoDigits } from '@/lib/dates';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { HorizontalScroller } from '@/components/ui/HorizontalScroller';
import { ServicePanel } from '@/components/ui/ServicePanel';

/**
 * Mobile: immersive swipe panels (image dominant, text on image).
 * Desktop: sticky index on the left follows large asymmetric panels on the right.
 */
export function ServicesSection() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = listRef.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || window.innerWidth < 1080) continue;
          const i = Number((e.target as HTMLElement).dataset.svc);
          setActive(i);
          track('service_view', { service: SERVICES[i].id });
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    root.querySelectorAll('[data-svc]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => {
    document.getElementById(`svc-${SERVICES[i].id}`)?.closest('article')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="servicios" className="services" aria-labelledby="svc-title">
      <div className="wrap svc-layout">
        <div className="svc-aside">
          <SectionLabel>Lo que hacemos</SectionLabel>
          <h2 id="svc-title" className="h2 rv">
            Todo lo necesario para llevar una idea al espacio real.
          </h2>
          <p className="lead rv">Diseñamos y producimos soluciones visuales para eventos, marcas y empresas que necesitan destacar con coherencia y profesionalismo.</p>
          <ol className="svc-index" aria-label="Índice de servicios">
            {SERVICES.map((s, i) => (
              <li key={s.id}>
                <button type="button" className={i === active ? 'on' : ''} aria-current={i === active ? 'true' : undefined} onClick={() => jump(i)}>
                  <span>{twoDigits(i + 1)}</span>
                  {s.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="svc-list" ref={listRef}>
          <HorizontalScroller
            className="svc-track"
            count={SERVICES.length}
            label="Servicios"
            counter={false}
            dots={{ labels: SERVICES.map((s) => s.title), dark: true }}
            autoplay={3000}
            onIndexChange={(i) => track('service_view', { service: SERVICES[i].id })}
          >
            {SERVICES.map((s, i) => (
              <ServicePanel key={s.id} service={s} index={i} />
            ))}
          </HorizontalScroller>
        </div>
      </div>
    </section>
  );
}
