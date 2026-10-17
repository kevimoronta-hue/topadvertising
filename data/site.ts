/**
 * Site-wide facts. Every bracketed value is a placeholder that MUST be replaced
 * before a public launch — never invent these.
 */
export const SITE = {
  name: 'TOP Advertising',
  url: 'https://www.topadvertisingpa.com',
  tagline: 'Eventos, producción y experiencias de marca en Panamá.',
  country: 'Panamá',
  /** Digits only, international format (e.g. 507XXXXXXXX). Empty = not provided yet. */
  whatsappNumber: '',
  whatsappLabel: '[NUMÉRO WHATSAPP À FOURNIR]',
  email: '[EMAIL À FOURNIR]',
  address: '[ADRESSE À FOURNIR]',
  social: {
    instagram: { label: 'Instagram', href: 'https://www.instagram.com/topadvertising.pa/', handle: '@topadvertising.pa', placeholder: '' },
    facebook: { label: 'Facebook', href: '', placeholder: '' }, // [URL À FOURNIR] — not shown in UI
    tiktok: { label: 'TikTok', href: '', placeholder: '' }, // [URL À FOURNIR]
    linkedin: { label: 'LinkedIn', href: '', placeholder: '' }, // [URL À FOURNIR]
  },
} as const;

export const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#changan', label: 'Proyecto Changan' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#agenda', label: 'Agenda' },
  { href: '#contacto', label: 'Contacto' },
] as const;

export const LOGO = {
  src: '/brand/top-advertising-logo.webp', // replace with /brand/top-advertising-logo.svg when delivered
  width: 900,
  height: 452,
  alt: 'TOP Advertising',
};

/**
 * Hero loop (5 × 2 s, locked-off Kling 3.0 clips from Unsplash photos + the real Changan
 * photos, with a linear slide added in the montage),
 * built by scripts/build-hero-video.sh, which reads this version. Bump it for a new
 * montage so browsers never keep a stale file under the same name.
 */
export const HERO_VERSION = 'v2';

const heroBase = `/videos/hero-top-${HERO_VERSION}`;

export const HERO_MEDIA = {
  videoMobile: `${heroBase}-mobile-9x16.mp4`,
  videoDesktop: `${heroBase}-desktop-16x9.mp4`,
  posterMobile: `${heroBase}-mobile-poster.webp`,
  posterDesktop: `${heroBase}-desktop-poster.webp`,
};
