'use client';

import Image, { getImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { ART } from '@/data/art';
import { HERO_MEDIA } from '@/data/site';
import { track } from '@/lib/analytics';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';

/**
 * Three-plane hero: the final event (back plane), production and brand detail
 * (front plates). Planes drift at different rates with scroll (CSS scroll timeline,
 * no JS per frame). Mobile uses its own vertical art, never a crop of desktop.
 */
const common = { alt: '', sizes: '100vw', priority: true, quality: 78 };
const {
  props: { srcSet: desktopSet },
} = getImageProps({ ...common, src: ART.heroEvent.src, width: ART.heroEvent.width, height: ART.heroEvent.height });
const {
  props: { srcSet: mobileSet, ...mobileImg },
} = getImageProps({ ...common, src: ART.heroEventMobile.src, width: ART.heroEventMobile.width, height: ART.heroEventMobile.height });

export function HeroVideo() {
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const desktop = window.matchMedia('(min-width: 1080px)').matches;
    setVideoSrc(desktop ? HERO_MEDIA.videoDesktop : HERO_MEDIA.videoMobile);
  }, []);

  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero-back" aria-hidden="true">
        <picture>
          <source media="(min-width: 760px)" srcSet={desktopSet} />
          <source srcSet={mobileSet} />
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img {...mobileImg} className="hero-back-img" />
        </picture>
        {videoSrc && <video src={videoSrc} autoPlay muted loop playsInline preload="metadata" />}
      </div>
      <div className="hero-scrim" aria-hidden="true" />

      <div className="wrap hero-inner">
        <h1 id="hero-title" className="h1 hero-enter" style={{ ['--d' as string]: '0ms' }}>
          Hacemos que tu marca se vea, se viva y se recuerde.
        </h1>
        <p className="hero-lead hero-enter" style={{ ['--d' as string]: '60ms' }}>
          Creamos eventos, montajes y experiencias visuales que transforman cada espacio en una oportunidad para destacar.
        </p>
        <div className="hero-ctas hero-enter" style={{ ['--d' as string]: '120ms' }}>
          <PrimaryButton href="#agenda" onClick={() => track('hero_cta_click')}>
            Cotiza tu proyecto
          </PrimaryButton>
          <SecondaryButton href="#proyectos">Ver proyectos</SecondaryButton>
        </div>
        <p className="hero-proof hero-enter" style={{ ['--d' as string]: '180ms' }}>
          Eventos corporativos · Activaciones BTL · Montajes · Ambientación
        </p>
      </div>

      <div className="hero-plates" aria-hidden="true">
        <figure className="plate plate--a">
          <span className="plate-img">
            <Image src={ART.heroProduction.src} alt="" fill sizes="(min-width: 1080px) 22vw, 44vw" style={{ objectFit: 'cover', objectPosition: ART.heroProduction.focal }} />
          </span>
          <figcaption>Producción</figcaption>
        </figure>
        <figure className="plate plate--b">
          <span className="plate-img">
            <Image src={ART.heroDetail.src} alt="" fill sizes="(min-width: 1080px) 16vw, 44vw" style={{ objectFit: 'cover', objectPosition: ART.heroDetail.focal }} />
          </span>
          <figcaption>Detalle</figcaption>
        </figure>
      </div>
    </section>
  );
}
