'use client';

import { SITE } from '@/data/site';
import { track } from '@/lib/analytics';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SectionLabel } from '@/components/ui/SectionLabel';

const NETWORKS: { key: keyof typeof SITE.social; icon: IconName }[] = [
  { key: 'instagram', icon: 'instagram' },
  { key: 'facebook', icon: 'facebook' },
  { key: 'tiktok', icon: 'tiktok' },
  { key: 'linkedin', icon: 'linkedin' },
];

/**
 * Title, intro and one row of network buttons. No fake feed.
 * A network without a confirmed URL (see data/site.ts) renders as an inactive icon
 * until its link is provided — no invented account, no dead link.
 */
export function SocialSection() {
  return (
    <section id="redes" className="social" aria-labelledby="soc-title">
      <div className="wrap social-in">
        <SectionLabel dark>Redes sociales</SectionLabel>
        <h2 id="soc-title" className="h2 rv">
          Sigue nuestras ideas en movimiento.
        </h2>
        <p className="lead rv">Descubre montajes, procesos y experiencias creadas para transformar la presencia de cada marca.</p>
        <ul className="social-links rv" aria-label="Redes sociales de TOP Advertising">
          {NETWORKS.map((n) => {
            const s = SITE.social[n.key];
            return (
              <li key={n.key}>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${s.label} de TOP Advertising`}
                    onClick={n.key === 'instagram' ? () => track('instagram_click') : undefined}
                  >
                    <Icon name={n.icon} />
                  </a>
                ) : (
                  <span className="is-pending" role="img" aria-label={`${s.label} de TOP Advertising`}>
                    <Icon name={n.icon} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
