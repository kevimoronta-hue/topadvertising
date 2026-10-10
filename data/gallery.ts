import type { GalleryItem } from '@/types';
import { ART } from './art';
import { CHANGAN_PHOTOS } from './projects';

const photo = (i: number, focal: string) => ({ ...CHANGAN_PHOTOS[i], focal });

/**
 * Editorial sequence: one dominant image, then details.
 * Real Changan photos and Higgsfield art direction are labelled distinctly in the UI.
 */
export const GALLERY: GalleryItem[] = [
  { id: 'instalacion', caption: 'Instalación inmersiva', visual: ART.galInstalacion, ratio: '16/9', lead: true },
  { id: 'changan-03', caption: 'Stand Changan', visual: photo(2, '72% 50%'), ratio: '4/5' },
  { id: 'mesa', caption: 'Ambientación de cena', visual: ART.galMesa, ratio: '16/10' },
  { id: 'luz', caption: 'Iluminación escénica', visual: ART.galLuz, ratio: '3/4' },
  { id: 'changan-06', caption: 'Motor show', visual: photo(5, '50% 45%'), ratio: '1080/1112' },
  { id: 'bienvenida', caption: 'Bienvenida y atención', visual: ART.galBienvenida, ratio: '4/5' },
  { id: 'changan-02', caption: 'Atención en stand', visual: photo(1, '72% 50%'), ratio: '4/5' },
];
