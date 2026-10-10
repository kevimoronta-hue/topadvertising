import Image from 'next/image';
import Link from 'next/link';
import { LOGO, SITE } from '@/data/site';
import { Icon, type IconName } from '@/components/ui/Icon';

const NAV = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#agenda', label: 'Agenda' },
];

const SOCIAL: { key: keyof typeof SITE.social; icon: IconName }[] = [
  { key: 'instagram', icon: 'instagram' },
  { key: 'facebook', icon: 'facebook' },
  { key: 'tiktok', icon: 'tiktok' },
  { key: 'linkedin', icon: 'linkedin' },
];

/**
 * Calm footer. The logo mirrors the navbar: same size, same left alignment on desktop;
 * centered on mobile. Order on mobile: logo, nav, Panamá, social icons, legal.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span className="footer-reverb" aria-hidden="true" />
      <div className="footer-in">
        <a className="footer-logo" href="#inicio" aria-label="TOP Advertising, volver al inicio">
          <Image src={LOGO.src} alt={LOGO.alt} width={LOGO.width} height={LOGO.height} sizes="96px" />
        </a>
        <nav className="footer-nav" aria-label="Pie de página">
          {NAV.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <p className="footer-place">{SITE.country}</p>
        <ul className="footer-social" aria-label="Redes sociales">
          {SOCIAL.map((s) => {
            const net = SITE.social[s.key];
            return (
              <li key={s.key}>
                {net.href ? (
                  <a href={net.href} target="_blank" rel="noopener noreferrer" aria-label={net.label}>
                    <Icon name={s.icon} />
                  </a>
                ) : (
                  <span role="img" aria-label={net.label}>
                    <Icon name={s.icon} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="footer-legal">
          <span>
            © {year} {SITE.name}
          </span>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/aviso-legal">Aviso legal</Link>
        </p>
      </div>
    </footer>
  );
}
