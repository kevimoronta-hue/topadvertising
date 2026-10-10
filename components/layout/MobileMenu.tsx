'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { LOGO, NAV_LINKS, SITE } from '@/data/site';
import { Icon, type IconName } from '@/components/ui/Icon';

type MenuState = 'open' | 'closing' | 'closed';

interface Props {
  state: MenuState;
  /** Ask the header to close (plays the exit animation). */
  onClose: () => void;
  /** Called after the panel is gone and the page scroll is restored. */
  onClosed: () => void;
}

const SOCIAL: { key: keyof typeof SITE.social; icon: IconName }[] = [
  { key: 'instagram', icon: 'instagram' },
  { key: 'facebook', icon: 'facebook' },
  { key: 'tiktok', icon: 'tiktok' },
  { key: 'linkedin', icon: 'linkedin' },
];

/** Full-viewport menu (100vw × 100dvh). Mounted only while open or closing. */
export function MobileMenu({ state, onClose, onClosed }: Props) {
  if (state === 'closed') return null;
  return <MenuPanel closing={state === 'closing'} onClose={onClose} onClosed={onClosed} />;
}

function MenuPanel({ closing, onClose, onClosed }: { closing: boolean; onClose: () => void; onClosed: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef<string | null>(null);

  // Lock the page behind (iOS-safe: fixed body) and restore it on unmount.
  useEffect(() => {
    const y = window.scrollY;
    const body = document.body.style;
    const prev = { position: body.position, top: body.top, left: body.left, right: body.right, overflow: body.overflow };
    body.position = 'fixed';
    body.top = `-${y}px`;
    body.left = '0';
    body.right = '0';
    body.overflow = 'hidden';
    ref.current?.querySelector<HTMLElement>('.menu-links a')?.focus({ preventScroll: true });
    return () => {
      Object.assign(body, prev);
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
      const href = target.current;
      if (href) {
        const el = document.querySelector(href);
        history.replaceState(null, '', href);
        requestAnimationFrame(() => el?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      }
      onClosed();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    target.current = href;
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !ref.current) return;
    const els = ref.current.querySelectorAll<HTMLElement>('a[href], button');
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div id="menu-movil" ref={ref} className={`menu${closing ? ' is-closing' : ''}`} role="dialog" aria-modal="true" aria-label="Menú" onKeyDown={onKeyDown}>
      <div className="menu-top">
        <a className="menu-logo" href="#inicio" onClick={(e) => go(e, '#inicio')} aria-label="TOP Advertising, ir al inicio">
          <Image src={LOGO.src} alt={LOGO.alt} width={LOGO.width} height={LOGO.height} sizes="96px" />
        </a>
        <button type="button" className="menu-close" aria-label="Cerrar menú" onClick={() => onClose()}>
          <Icon name="close" strokeWidth={1.5} />
        </button>
      </div>
      <nav className="menu-links" aria-label="Menú móvil">
        {NAV_LINKS.map((l, i) => (
          <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} style={{ ['--i' as string]: i }}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="menu-foot">
        <a className="btn btn-primary btn-block" href="#agenda" onClick={(e) => go(e, '#agenda')}>
          Cotiza tu proyecto
        </a>
        <ul className="menu-social" aria-label="Redes sociales">
          {SOCIAL.map((s) => {
            const net = SITE.social[s.key];
            return (
              <li key={s.key}>
                {net.href ? (
                  <a href={net.href} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${net.label} de TOP Advertising`}>
                    <Icon name={s.icon} />
                  </a>
                ) : (
                  <span role="img" aria-label={`${net.label} de TOP Advertising`}>
                    <Icon name={s.icon} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
