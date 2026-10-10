'use client';

import { ART } from '@/data/art';
import { track } from '@/lib/analytics';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Media } from '@/components/ui/Media';

/** The close: an empty, lit stage minutes before doors open. The next event is the visitor's. */
export function FinalCTA() {
  return (
    <section id="contacto" className="final" aria-labelledby="fin-title">
      <div className="final-bg" aria-hidden="true">
        <span className="fill only-d">
          <Media visual={ART.ctaStage} sizes="100vw" alt="" />
        </span>
        <span className="fill only-m">
          <Media visual={ART.ctaStageMobile} sizes="100vw" alt="" />
        </span>
      </div>
      <div className="final-scrim" aria-hidden="true" />
      <div className="wrap final-in">
        <p className="label rv">Contacto</p>
        <h2 id="fin-title" className="final-title rv">
          Tu próximo evento empieza con una idea.
        </h2>
        <p className="lead rv">Nosotros la convertimos en una experiencia que tu público pueda ver, vivir y recordar.</p>
        <div className="final-ctas rv">
          <PrimaryButton href="#agenda" onClick={() => track('final_cta_click')}>
            Hablemos de tu proyecto
          </PrimaryButton>
          <SecondaryButton href="#agenda" onClick={() => track('final_cta_click', { variant: 'cita' })}>
            Solicitar una cita
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}
