import type { BookingErrors, BookingForm } from '@/types';
import { BRAND_OPTIONS, CONTACT_FIELDS } from '@/lib/validation';
import { toIso, startOfToday } from '@/lib/dates';
import { FormField } from './FormField';

interface Props {
  form: BookingForm;
  errors: BookingErrors;
  onChange: <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => void;
}

export function ContactFields({ form, errors, onChange }: Props) {
  const today = toIso(startOfToday());
  return (
    <>
      <h3 className="wiz-q" tabIndex={-1}>
        Tus datos
      </h3>
      <p className="wiz-hint">Los usaremos solo para responder a tu solicitud.</p>
      <div className="fields">
        {CONTACT_FIELDS.map((d) => (
          <FormField
            key={d.key}
            id={`f-${d.key}`}
            label={d.label}
            type={d.type}
            optional={d.optional}
            autoComplete={d.autoComplete}
            inputMode={d.inputMode}
            placeholder={d.placeholder}
            min={d.type === 'date' ? today : d.type === 'number' ? 1 : undefined}
            value={form[d.key]}
            error={errors[d.key]}
            onValueChange={(v) => onChange(d.key, v)}
          />
        ))}
      </div>
      <fieldset className="cond" aria-describedby={errors.marcaRel ? 'marca-rel-err' : undefined}>
        <legend className="flabel">¿Tu proyecto está relacionado con una marca, producto o lanzamiento?</legend>
        <div className="chips">
          {BRAND_OPTIONS.map((o) => {
            const on = form.marcaRel === o.value;
            return (
              <label key={o.value} className={`chip radio${on ? ' on' : ''}`}>
                <input className="sr" type="radio" name="marca-rel" checked={on} onChange={() => onChange('marcaRel', o.value)} />
                <span className="chip-box" aria-hidden="true" />
                <span>{o.label}</span>
              </label>
            );
          })}
        </div>
        {errors.marcaRel && (
          <p className="group-err" id="marca-rel-err">
            {errors.marcaRel}
          </p>
        )}
        {form.marcaRel === 'si' && (
          <FormField id="f-marca" label="Nombre de la marca o del producto" type="text" value={form.marca} error={errors.marca} onValueChange={(v) => onChange('marca', v)} style={{ marginTop: 8 }} />
        )}
      </fieldset>
    </>
  );
}
