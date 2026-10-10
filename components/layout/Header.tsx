'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { LOGO, NAV_LINKS } from '@/data/site';
import { track } from '@/lib/analytics';
import { MobileMenu } from './MobileMenu';

const EXIT_MS = 220;

/** Transparent over the hero, glass after a short scroll. Mobile: logo centred on the viewport. */
export function Header() {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState<'open' | 'closing' | 'closed'>('closed');
  const burger = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(exitTimer.current);
    };
  }, []);

  const close = () => {
    setMenu((m) => (m === 'open' ? 'closing' : m));
    clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => setMenu('closed'), EXIT_MS);
  };
  // After unmount (scroll restored): hand focus back to the burger.
  const onClosed = () => requestAnimationFrame(() => burger.current?.focus({ preventScroll: true }));

  const open = menu === 'open';

  return (
    <>
      <header className={`nav${solid || open ? ' is-solid' : ''}${open ? ' is-menu' : ''}`}>
        <div className="nav-in">
          <a className="nav-logo" href="#inicio" aria-label="TOP Advertising, ir al inicio">
            <Image src={LOGO.src} alt={LOGO.alt} width={LOGO.width} height={LOGO.height} priority sizes="96px" />
          </a>
          <div className="nav-right">
            <nav className="nav-links" aria-label="Navegación principal">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>
            <a className="btn btn-primary btn-sm nav-cta" href="#agenda" onClick={() => track('hero_cta_click', { from: 'nav' })}>
              Cotiza tu proyecto
            </a>
            <button
              ref={burger}
              className={`burger${open ? ' is-open' : ''}`}
              type="button"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="menu-movil"
              onClick={() => (open ? close() : setMenu('open'))}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu state={menu} onClose={close} onClosed={onClosed} />
    </>
  );
}
