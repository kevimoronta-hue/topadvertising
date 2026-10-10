import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { SITE } from '@/data/site';
import './globals.css';

// Self-hosted variable fonts (latin subset, from Google Fonts, SIL OFL).
const sora = localFont({ src: './fonts/Sora-latin.woff2', weight: '300 600', variable: '--font-sora', display: 'swap', preload: true });
const manrope = localFont({ src: './fonts/Manrope-latin.woff2', weight: '400 700', variable: '--font-manrope', display: 'swap', preload: false });

const title = 'TOP Advertising | Eventos y Producción en Panamá';
const description = 'Creamos eventos, montajes corporativos, activaciones BTL, lanzamientos y experiencias visuales para marcas y empresas en Panamá.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
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
    images: [{ url: '/projects/changan/changan-05.webp', width: 1080, height: 1112, alt: 'Equipo de imagen de TOP Advertising en el stand de Changan' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/projects/changan/changan-05.webp'] },
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
