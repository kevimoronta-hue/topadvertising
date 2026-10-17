'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ART } from '@/data/art';
import { HERO_MEDIA } from '@/data/site';
import { track } from '@/lib/analytics';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';

/**
 * Three-plane hero: the event loop (back plane), production and brand detail
 * (front plates). Planes drift at different rates with scroll (CSS scroll timeline,
 * no JS per frame). Portrait screens (phones, tablets upright) get the vertical loop,
 * landscape screens the 16:9 one, never a crop of the other.
 * The posters are the first frame of each loop, so the video starts without a jump.
 */
const DESKTOP_MQ = '(min-aspect-ratio: 1/1)';

export function HeroVideo() {
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mq = window.matchMedia(DESKTOP_MQ);
    const pick = () => setVideoSrc(mq.matches ? HERO_MEDIA.videoDesktop : HERO_MEDIA.videoMobile);
    pick();
    mq.addEventListener('change', pick);
    return () => mq.removeEventListener('change', pick);
  }, []);

  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero-back" aria-hidden="true">
        <picture>
          <source media={DESKTOP_MQ} srcSet={HERO_MEDIA.posterDesktop} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_MEDIA.posterMobile} alt="" width={1080} height={1920} fetchPriority="high" className="hero-back-img" />
        </picture>
        {videoSrc && <video src={videoSrc} autoPlay muted loop playsInline preload="auto" />}
      </div>
      <div className="hero-scrim" aria-hidden="true" />

      <div className="wrap hero-inner">
        {/* Mobile: title + CTAs sit on the first screen over the loop, lead + proof follow below.
            From 760px the wrappers dissolve (display: contents) into one column. */}
        <div className="hero-stage">
          <h1 id="hero-title" className="h1 hero-enter" style={{ ['--d' as string]: '0ms' }}>
            Hacemos que tu marca se vea, se viva y se recuerde.
          </h1>
          <div className="hero-ctas hero-enter" style={{ ['--d' as string]: '120ms' }}>
            <PrimaryButton href="#agenda" onClick={() => track('hero_cta_click')}>
              Cotiza tu proyecto
            </PrimaryButton>
            <SecondaryButton href="#proyectos">Ver proyectos</SecondaryButton>
          </div>
        </div>
        <div className="hero-more">
          <p className="hero-lead hero-enter" style={{ ['--d' as string]: '60ms' }}>
            Creamos eventos, montajes y experiencias visuales que transforman cada espacio en una oportunidad para destacar.
          </p>
          <p className="hero-proof hero-enter" style={{ ['--d' as string]: '180ms' }}>
            Eventos corporativos · Activaciones BTL · Montajes · Ambientación
          </p>
        </div>
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
