export type PlaceholderVariant = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

/** A visual that is still to be produced with Higgsfield (never a real project). */
export interface PendingVisual {
  kind: 'placeholder';
  variant: PlaceholderVariant;
  /** Short description of the shot to generate. */
  shot: string;
  /** Target aspect ratio(s), e.g. "4:5". */
  ratio: string;
  /** Final location once produced. */
  futureSrc: string;
}

/** A real photograph supplied by the client. */
export interface RealPhoto {
  kind: 'photo';
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position, chosen image by image so no face or vehicle is cut. */
  focal: string;
}

/**
 * Art-direction image generated with Higgsfield. Illustrative only:
 * never presented as a documented client project.
 */
export interface ArtImage {
  kind: 'art';
  src: string;
  alt: string;
  width: number;
  height: number;
  focal: string;
}

export type Visual = PendingVisual | RealPhoto | ArtImage;

export interface Service {
  id: string;
  title: string;
  text: string;
  visual: ArtImage;
}

export interface CaseStudyPhoto extends RealPhoto {
  caption: string;
  /** Desktop composition slot; omitted photos only show in the mobile strip. */
  desktopSlot?: 'a' | 'b' | 'c';
}

export interface GalleryItem {
  id: string;
  caption: string;
  visual: RealPhoto | ArtImage;
  /** Display ratio (desktop masonry keeps it; mobile uses it in the swipe strip). */
  ratio: string;
  /** First item spans the full width on desktop. */
  lead?: boolean;
}

export interface TransformationStep {
  title: string;
  stage: string;
  text: string;
  visual: ArtImage;
}

export interface BookingForm {
  nombre: string;
  apellido: string;
  empresa: string;
  email: string;
  whatsapp: string;
  ciudad: string;
  fecha: string;
  asistentes: string;
  marcaRel: '' | 'si' | 'no' | 'nd';
  marca: string;
}

export interface BookingRequest {
  types: string[];
  form: BookingForm;
  description: string;
  /** ISO date (yyyy-mm-dd) of the requested meeting. */
  date: string;
  time: string;
  consent: boolean;
}

export type BookingErrors = Partial<Record<keyof BookingForm | 'types' | 'date' | 'time' | 'consent', string>>;
