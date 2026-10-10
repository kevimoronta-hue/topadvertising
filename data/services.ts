import type { Service } from '@/types';
import { ART } from './art';

export const SERVICES: Service[] = [
  {
    id: 'eventos-corporativos',
    title: 'Eventos corporativos',
    text: 'Creamos experiencias pensadas para presentar, celebrar, conectar y fortalecer la presencia de tu empresa.',
    visual: ART.eventos,
  },
  {
    id: 'montajes',
    title: 'Montajes y producción',
    text: 'Coordinamos los elementos visuales, técnicos y estructurales necesarios para dar forma a cada concepto.',
    visual: ART.montajes,
  },
  {
    id: 'activaciones-btl',
    title: 'Activaciones BTL',
    text: 'Acercamos las marcas a su público mediante experiencias directas, memorables y participativas.',
    visual: ART.btl,
  },
  {
    id: 'lanzamientos',
    title: 'Lanzamientos de productos',
    text: 'Diseñamos entornos que convierten cada presentación en un momento de marca.',
    visual: ART.lanzamientos,
  },
  {
    id: 'uniformes',
    title: 'Uniformes corporativos',
    text: 'Creamos soluciones de vestuario que refuerzan la identidad y la presencia profesional de cada equipo.',
    visual: ART.uniformes,
  },
  {
    id: 'decoracion',
    title: 'Decoración y ambientación',
    text: 'Transformamos espacios a través del color, los materiales, la iluminación y los detalles.',
    visual: ART.decoracion,
  },
];
