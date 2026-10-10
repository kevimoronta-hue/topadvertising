import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';

export const metadata: Metadata = { title: 'Aviso legal | TOP Advertising', alternates: { canonical: '/aviso-legal' } };

export default function AvisoLegal() {
  return (
    <LegalPage title="Aviso legal">
      {/* [MENTIONS LÉGALES À FOURNIR] */}
      <p>Esta página está en preparación.</p>
    </LegalPage>
  );
}
