import type { CaseStudyPhoto, TransformationStep } from '@/types';
import { ART } from './art';

const W = 1080;
const H = 1112;

/**
 * Real photographs of the Changan project, supplied by the client.
 * Never replace these with generated images.
 * Scope (from the client's own material): "Modelos y azafatas" at the Changan stand of a motor show.
 */
export const CHANGAN_PHOTOS: CaseStudyPhoto[] = [
  { kind: 'photo', src: '/projects/changan/changan-01.webp', width: W, height: H, focal: '50% 50%', caption: 'G318 · stand Changan', desktopSlot: 'a', alt: 'Dos integrantes del equipo de imagen junto al G318 blanco, sobre una plataforma con iluminación azul' },
  { kind: 'photo', src: '/projects/changan/changan-02.webp', width: W, height: H, focal: '72% 50%', caption: 'Atención en stand', alt: 'Integrante del equipo de imagen con vestido negro de la marca junto a un SUV gris Changan' },
  { kind: 'photo', src: '/projects/changan/changan-03.webp', width: W, height: H, focal: '70% 50%', caption: 'Presencia de marca', alt: 'Integrante del equipo de imagen sonriendo junto a un SUV gris Changan en el stand' },
  { kind: 'photo', src: '/projects/changan/changan-04.webp', width: W, height: H, focal: '50% 50%', caption: 'Equipo de imagen', desktopSlot: 'b', alt: 'Dos integrantes del equipo de imagen a ambos lados de un SUV gris Changan' },
  { kind: 'photo', src: '/projects/changan/changan-05.webp', width: W, height: H, focal: '50% 28%', caption: 'CS55 Plus · stand Changan', alt: 'Dos integrantes del equipo de imagen frente al Changan CS55 Plus rojo, con letras iluminadas de la marca' },
  // [À CONFIRMER] Avatr is a separate brand — confirm it belongs to the same assignment.
  { kind: 'photo', src: '/projects/changan/changan-06.webp', width: W, height: H, focal: '50% 45%', caption: 'Avatr · motor show', desktopSlot: 'c', alt: 'Dos integrantes del equipo de imagen junto a un vehículo Avatr gris oscuro en el motor show' },
];

/** Index of the hero photo of the case study (CS55 Plus). */
export const CHANGAN_MAIN_INDEX = 4;

/** Illustrative scenario (art direction, same hall in three states), NOT a client project. */
export const TRANSFORMATION: TransformationStep[] = [
  {
    stage: 'Antes',
    title: 'El espacio',
    text: 'Partimos del lugar tal como es: sus medidas, su luz, sus accesos y todo lo que puede llegar a ser.',
    visual: ART.trEspacio,
  },
  {
    stage: 'Construcción',
    title: 'La producción',
    text: 'Estructuras, materiales, iluminación y elementos de marca se instalan siguiendo un plan de montaje claro.',
    visual: ART.trProduccion,
  },
  {
    stage: 'Revelación',
    title: 'La experiencia final',
    text: 'El espacio se abre al público con una identidad coherente, lista para ser vista, recorrida y recordada.',
    visual: ART.trExperiencia,
  },
];
