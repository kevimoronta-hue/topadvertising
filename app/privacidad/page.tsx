import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';

export const metadata: Metadata = { title: 'Política de privacidad | TOP Advertising', alternates: { canonical: '/privacidad' } };

export default function Privacidad() {
  return (
    <LegalPage title="Política de privacidad">
      {/* [POLITIQUE DE CONFIDENTIALITÉ À FOURNIR] */}
      <p>Esta página está en preparación.</p>
    </LegalPage>
  );
}
