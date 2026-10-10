import type { ArtImage } from '@/types';

/**
 * ⚠️ DEMO CONTENT — REPLACE BEFORE DELIVERY.
 * These are illustrative feedback lines for the mock-up only (brief §9: no fake testimonials
 * presented as real). They describe the TYPE of feedback expected in events:
 * - no personal names, no companies, no figures, nothing attributed to Changan;
 * - roles are generic sector descriptions;
 * - portraits are Higgsfield art direction (not real clients).
 * Before launch: replace with real, authorised client feedback (quote, name, role, company, photo)
 * or remove the section.
 */
export interface Testimonial {
  id: string;
  quote: string;
  role: string;
  image: ArtImage;
  demo: true;
}

const img = (n: string, alt: string, focal = '50% 35%'): ArtImage => ({ kind: 'art', src: `/images/testimonios/${n}.webp`, width: 1600, height: 900, alt, focal });

export const TESTIMONIALS: Testimonial[] = [
  { id: 't1', quote: 'Todo estuvo cuidado hasta el último detalle.', role: 'Dirección de marketing · Evento corporativo', image: img('01', 'Directora de marketing en un lounge de evento', '66% 30%'), demo: true },
  { id: 't2', quote: 'Entendieron la identidad de la marca desde el primer momento.', role: 'Comunicación corporativa · Gala anual', image: img('02', 'Ejecutivo de comunicación en una recepción nocturna', '40% 35%'), demo: true },
  { id: 't3', quote: 'El montaje se sintió profesional, ordenado y coherente.', role: 'Coordinación de eventos · Congreso', image: img('03', 'Coordinadora de eventos durante el montaje', '60% 30%'), demo: true },
  { id: 't4', quote: 'Lograron transformar el espacio sin perder la esencia de la marca.', role: 'Gerencia de marca · Lanzamiento de producto', image: img('04', 'Gerente de marca en un lanzamiento', '28% 35%'), demo: true },
  { id: 't5', quote: 'Durante todo el proceso sentimos que había una dirección clara.', role: 'Relaciones institucionales · Gala', image: img('05', 'Directora de relaciones institucionales en un foyer', '72% 35%'), demo: true },
  { id: 't6', quote: 'Una ejecución limpia, visual y muy bien coordinada.', role: 'Eventos de hotel · Cena corporativa', image: img('06', 'Gerente de eventos en un salón de hotel'), demo: true },
  { id: 't7', quote: 'Cada decisión tenía sentido dentro de la experiencia completa.', role: 'Dirección comercial · Apertura de showroom', image: img('07', 'Directora comercial en un showroom', '26% 35%'), demo: true },
  { id: 't8', quote: 'El equipo resolvió cada imprevisto con calma y criterio.', role: 'Marketing y comunicación · Evento interno', image: img('08', 'Dos ejecutivos observando un evento en curso'), demo: true },
  { id: 't9', quote: 'La activación se vio y se sintió exactamente como la imaginamos.', role: 'Marca de consumo · Activación BTL', image: img('09', 'Fundador de una marca junto a una activación', '70% 35%'), demo: true },
];
