import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { SITE } from '@/data/site';
import './globals.css';

// Self-hosted variable fonts (latin subset, from Google Fonts, SIL OFL).
const sora = localFont({ src: './fonts/Sora-latin.woff2', weight: '300 600', variable: '--font-sora', display: 'swap', preload: true });
const manrope = localFont({ src: './fonts/Manrope-latin.woff2', weight: '400 700', variable: '--font-manrope', display: 'swap', preload: false });

const title = 'TOP Advertising — Experiencias de marca que dejan huella';
const description = 'Eventos, montajes y activaciones de marca en Panamá.';

/**
 * Absolute base for canonical / og:url / og:image: the official domain (SITE.url),
 * overridable with NEXT_PUBLIC_SITE_URL (e.g. for a staging deployment).
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

/** Real photo of the project delivered for Changan (stand, motor show), cropped to 1200×630. */
const ogImage = {
  url: '/og/top-advertising-og-v2.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: 'TOP Advertising · Proyecto realizado para Changan: equipo de imagen en el stand de un motor show',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_PA',
    url: '/',
    siteName: SITE.name,
    title,
    description,
    images: [ogImage],
  },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#001127',
};

// Schema ProfessionalService (address, phone) to add once contact details are validated.
const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/brand/top-advertising-logo.webp`,
  description,
  areaServed: { '@type': 'Country', name: 'Panamá' },
};

/** Show "Higgsfield / placeholder" labels. Set NEXT_PUBLIC_SHOW_ASSET_TAGS=false for a clean client demo. */
const showAssetTags = process.env.NEXT_PUBLIC_SHOW_ASSET_TAGS !== 'false';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sora.variable} ${manrope.variable}`}>
      <body className={showAssetTags ? '' : 'no-tags'}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
        {children}
      </body>
    </html>
  );
}
