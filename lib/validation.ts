import type { BookingErrors, BookingForm, BookingRequest } from '@/types';

export const PROJECT_TYPES = [
  'Evento corporativo',
  'Montaje y producción',
  'Activación BTL',
  'Lanzamiento de producto',
  'Activación automotriz',
  'Experiencia de marca',
  'Uniformes corporativos',
  'Decoración de espacios',
  'Otro proyecto',
] as const;

export const BRAND_OPTIONS = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
  { value: 'nd', label: 'Todavía no está definido' },
] as const;

export const TIME_SLOTS = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] as const;

export interface FieldDef {
  key: Exclude<keyof BookingForm, 'marcaRel' | 'marca'>;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'number';
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  placeholder?: string;
  optional?: boolean;
  message?: string;
}

export const CONTACT_FIELDS: FieldDef[] = [
  { key: 'nombre', label: 'Nombre', type: 'text', autoComplete: 'given-name', message: 'Escribe tu nombre.' },
  { key: 'apellido', label: 'Apellido', type: 'text', autoComplete: 'family-name', message: 'Escribe tu apellido.' },
  { key: 'empresa', label: 'Empresa', type: 'text', autoComplete: 'organization', message: 'Escribe el nombre de tu empresa.' },
  { key: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', inputMode: 'email', placeholder: 'nombre@empresa.com', message: 'Introduce un correo electrónico válido.' },
  { key: 'whatsapp', label: 'WhatsApp', type: 'tel', autoComplete: 'tel', inputMode: 'tel', placeholder: '+507', message: 'Introduce un número de contacto válido.' },
  { key: 'ciudad', label: 'Ciudad o zona', type: 'text', autoComplete: 'address-level2', message: 'Indica la ciudad o zona del evento.' },
  { key: 'fecha', label: 'Fecha estimada del evento', type: 'date', message: 'Indica una fecha estimada.' },
  { key: 'asistentes', label: 'Número aproximado de asistentes', type: 'number', inputMode: 'numeric', optional: true },
];

export const emptyForm = (): BookingForm => ({
  nombre: '', apellido: '', empresa: '', email: '', whatsapp: '', ciudad: '', fecha: '', asistentes: '', marcaRel: '', marca: '',
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Client-side validation per wizard step. Server-side validation must be added with the real integration. */
export function validateStep(step: number, req: BookingRequest): BookingErrors {
  const e: BookingErrors = {};
  const f = req.form;
  if (step === 1 && req.types.length === 0) e.types = 'Selecciona al menos un tipo de proyecto.';
  if (step === 2) {
    for (const d of CONTACT_FIELDS) if (!d.optional && !f[d.key].trim()) e[d.key] = d.message;
    if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) e.email = 'Introduce un correo electrónico válido.';
    if (f.whatsapp.trim() && f.whatsapp.replace(/\D/g, '').length < 7) e.whatsapp = 'Introduce un número de contacto válido.';
    if (!f.marcaRel) e.marcaRel = 'Selecciona una opción.';
    if (f.marcaRel === 'si' && !f.marca.trim()) e.marca = 'Escribe el nombre de la marca o del producto.';
  }
  if (step === 4) {
    if (!req.date) e.date = 'Selecciona una fecha.';
    else if (!req.time) e.time = 'Selecciona un horario.';
  }
  if (step === 5 && !req.consent) e.consent = 'Acepta la autorización de contacto.';
  return e;
}
