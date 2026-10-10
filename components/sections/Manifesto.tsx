import { ART } from '@/data/art';
import { Media } from '@/components/ui/Media';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * One large manifesto card. Mobile: a full-image "moment" with the statement on a local scrim.
 * Desktop: asymmetric split, image on the left, statement given room on the right.
 */
export function Manifesto() {
  return (
    <section id="manifiesto" className="manifesto" aria-labelledby="mani-title">
      <div className="wrap">
        <article className="mani-card">
          <div className="mani-media reveal-mask">
            <Media visual={ART.manifesto} sizes="(min-width: 1080px) 46vw, 100vw" />
          </div>
          <div className="mani-body">
            <SectionLabel>TOP Advertising</SectionLabel>
            <h2 id="mani-title" className="h2 mani-title rv">
              No organizamos eventos. <span className="soft">Construimos experiencias de marca.</span>
            </h2>
            <p className="mani-text rv">Unimos creatividad, producción y ejecución para convertir ideas en espacios que conectan con las personas y representan el valor de cada marca.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
