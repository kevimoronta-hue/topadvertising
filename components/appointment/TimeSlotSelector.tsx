import { TIME_SLOTS } from '@/lib/validation';
import { formatLongDate } from '@/lib/dates';

interface Props {
  date: string;
  value: string;
  error?: string;
  onSelect: (time: string) => void;
}

/** Temporary visual slots — not connected to a real calendar. */
export function TimeSlotSelector({ date, value, error, onSelect }: Props) {
  return (
    <fieldset className="slots-wrap">
      <legend className="flabel">Horarios disponibles · {formatLongDate(date)}</legend>
      <div className="slots">
        {TIME_SLOTS.map((t) => (
          <button key={t} type="button" className={`slot${value === t ? ' sel' : ''}`} aria-pressed={value === t} onClick={() => onSelect(t)}>
            {t}
          </button>
        ))}
      </div>
      {error && <p className="group-err">{error}</p>}
      <p className="slot-note">Horarios de referencia. La disponibilidad se confirma con el equipo de TOP Advertising.</p>
    </fieldset>
  );
}
