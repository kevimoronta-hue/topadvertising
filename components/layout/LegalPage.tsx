import Image from 'next/image';
import Link from 'next/link';
import { LOGO } from '@/data/site';

/** Placeholder shell for legal routes; content to be supplied by the client. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="legal">
      <div className="wrap">
        <Link href="/" aria-label="TOP Advertising, volver al inicio" style={{ alignSelf: 'flex-start' }}>
          <Image src={LOGO.src} alt={LOGO.alt} width={LOGO.width} height={LOGO.height} sizes="120px" style={{ height: 52, width: 'auto' }} />
        </Link>
        <h1 className="h2">{title}</h1>
        {children}
        <Link className="btn btn-ghost" href="/" style={{ alignSelf: 'flex-start' }}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
