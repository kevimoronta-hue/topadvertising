import { SITE } from '@/data/site';
import type { BookingRequest } from '@/types';
import { formatLongDate } from './dates';
import { BRAND_OPTIONS } from './validation';

export function buildWhatsAppMessage(req: BookingRequest): string {
  const f = req.form;
  const brand = f.marcaRel === 'si' ? f.marca : BRAND_OPTIONS.find((o) => o.value === f.marcaRel)?.label ?? '';
  const lines = [
    'Hola TOP Advertising, quisiera hablar sobre un proyecto.',
    '',
    `• Proyecto: ${req.types.join(', ')}`,
    `• Nombre: ${f.nombre} ${f.apellido}`.trim(),
    `• Empresa: ${f.empresa}`,
    `• Correo: ${f.email}`,
    `• WhatsApp: ${f.whatsapp}`,
    `• Ciudad o zona: ${f.ciudad}`,
    `• Fecha estimada del evento: ${formatLongDate(f.fecha)}`,
    ...(f.asistentes ? [`• Asistentes aprox.: ${f.asistentes}`] : []),
    `• Marca o producto: ${brand}`,
    `• Cita solicitada: ${formatLongDate(req.date)}, ${req.time}`,
    ...(req.description ? ['', 'Idea:', req.description] : []),
  ];
  return lines.join('\n');
}

/** Returns null while the real number has not been provided. */
export function whatsappUrl(text: string): string | null {
  if (!SITE.whatsappNumber) return null;
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
