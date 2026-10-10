import type { BookingErrors, BookingRequest } from '@/types';
import { BRAND_OPTIONS } from '@/lib/validation';
import { formatLongDate } from '@/lib/dates';
import { Icon } from '@/components/ui/Icon';

interface Props {
  request: BookingRequest;
  errors: BookingErrors;
  onEdit: (step: number) => void;
  onConsent: (value: boolean) => void;
}

export function BookingSummary({ request, errors, onEdit, onConsent }: Props) {
  const f = request.form;
  const brand = f.marcaRel === 'si' ? f.marca : BRAND_OPTIONS.find((o) => o.value === f.marcaRel)?.label;
  const rows: { k: string; v: string; step: number }[] = [
    { k: 'Servicio', v: request.types.join(', '), step: 1 },
    { k: 'Nombre', v: `${f.nombre} ${f.apellido}`.trim(), step: 2 },
    { k: 'Empresa', v: f.empresa, step: 2 },
    { k: 'Contacto', v: [f.email, f.whatsapp].filter(Boolean).join('\n'), step: 2 },
    { k: 'Ciudad o zona', v: f.ciudad, step: 2 },
    { k: 'Fecha del evento', v: [formatLongDate(f.fecha), f.asistentes && `${f.asistentes} asistentes aprox.`].filter(Boolean).join('\n'), step: 2 },
    { k: 'Marca o producto', v: brand ?? '', step: 2 },
    { k: 'Fecha deseada', v: formatLongDate(request.date), step: 4 },
    { k: 'Hora deseada', v: request.time, step: 4 },
    { k: 'Descripción', v: request.description || 'Sin descripción', step: 3 },
  ];

  return (
    <>
      <h3 className="wiz-q" tabIndex={-1}>
        Revisa tu solicitud
      </h3>
      <p className="wiz-hint">Confirma que todo está correcto antes de enviarla.</p>
      <dl className="sum">
        {rows.map((r) => (
          <div key={r.k} className="sum-row">
            <dt>{r.k}</dt>
            <dd>{r.v || '—'}</dd>
            <button type="button" className="link-btn" onClick={() => onEdit(r.step)} aria-label={`Editar ${r.k.toLowerCase()}`}>
              Editar
            </button>
          </div>
        ))}
      </dl>
      <label className={`consent${request.consent ? ' on' : ''}${errors.consent ? ' bad' : ''}`}>
        <input className="sr" type="checkbox" checked={request.consent} onChange={(e) => onConsent(e.target.checked)} aria-describedby={errors.consent ? 'consent-err' : undefined} aria-required="true" />
        <span className="chip-box" aria-hidden="true">
          <Icon name="check" strokeWidth={2.4} />
        </span>
        <span>Acepto que TOP Advertising me contacte para dar seguimiento a mi solicitud.</span>
      </label>
      {errors.consent && (
        <p className="group-err" id="consent-err">
          {errors.consent}
        </p>
      )}
    </>
  );
}
