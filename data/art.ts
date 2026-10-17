import type { ArtImage } from '@/types';

/**
 * Art-direction library generated with Higgsfield (GPT Image 2.5, Oct 2026).
 * Sources (PNG) live in /assets-src/higgsfield. Illustrative imagery only:
 * these never document a real client project.
 */
const art = (src: string, width: number, height: number, alt: string, focal = '50% 50%'): ArtImage => ({ kind: 'art', src, width, height, alt, focal });

export const ART = {

  eventos: art('/images/services/eventos-corporativos.webp', 2400, 1357, 'Conferencia corporativa con escenario, pantalla y mesas iluminadas con velas'),
  montajes: art('/images/services/montajes.webp', 2336, 1744, 'Equipo de producción montando un stand de exhibición', '55% 50%'),
  btl: art('/images/services/activaciones-btl.webp', 1792, 2240, 'Embajadora de marca atendiendo a visitantes en un pabellón de madera iluminado', '45% 50%'),
  lanzamientos: art('/images/services/lanzamientos.webp', 2400, 1357, 'Revelación de un producto sobre un pedestal ante invitados', '50% 50%'),
  uniformes: art('/images/services/uniformes.webp', 1792, 2240, 'Equipo de anfitriones con uniformes azul noche a medida', '50% 40%'),
  decoracion: art('/images/services/decoracion.webp', 2048, 2048, 'Lounge decorado con sofás curvos, orquídeas y lámparas cálidas'),

  trEspacio: art('/images/transformacion/01-espacio.webp', 1792, 2240, 'Salón de eventos vacío con ventanales hacia la ciudad al atardecer'),
  trProduccion: art('/images/transformacion/02-produccion.webp', 1792, 2240, 'El mismo salón durante el montaje de escenario y estructuras'),
  trExperiencia: art('/images/transformacion/03-experiencia.webp', 1792, 2240, 'El mismo salón transformado en una recepción corporativa con invitados'),

  galLuz: art('/images/gallery/iluminacion.webp', 1744, 2336, 'Cabezas móviles proyectando haces de luz cálida sobre un escenario', '40% 30%'),
  galMesa: art('/images/gallery/ambientacion.webp', 2400, 1357, 'Mesa de cena corporativa con flores, velas y cristalería'),
  galInstalacion: art('/images/gallery/instalacion.webp', 2400, 1357, 'Invitados recorriendo una instalación inmersiva de luz'),
  galBienvenida: art('/images/gallery/bienvenida.webp', 1792, 2240, 'Anfitriona recibiendo a un invitado en un mostrador de bienvenida'),

  procIdea: art('/images/proceso/01-idea.webp', 1792, 2240, 'Reunión inicial entre un cliente y una productora con muestras de materiales', '50% 45%'),
  procDiseno: art('/images/proceso/02-diseno.webp', 1792, 2240, 'Maqueta iluminada de un escenario y muestras de materiales sobre una mesa de diseño', '45% 45%'),
  procMontaje: art('/images/proceso/03-montaje.webp', 1792, 2240, 'Responsable de producción revisando el escenario terminado antes de abrir el evento', '40% 50%'),

  ctaStageMobile: art('/images/cta/escenario-9x16.webp', 1357, 2400, 'Escenario vacío bajo un haz de luz cálida, con el reflejo en el suelo pulido', '50% 35%'),
  agendaSurface: art('/images/agenda/superficie.webp', 1120, 1400, '', '70% 20%'),

  manifesto: art('/images/manifiesto/abstracto-claro.webp', 1600, 2000, 'Arcos de yeso marfil con una línea de latón y luz natural suave', '50% 42%'),

  ctaStage: art('/images/cta/escenario.webp', 2400, 1029, 'Escenario vacío iluminado minutos antes de abrir las puertas', '70% 50%'),
} as const;
