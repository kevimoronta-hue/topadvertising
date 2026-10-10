import { PROJECT_TYPES } from '@/lib/validation';
import { Icon } from '@/components/ui/Icon';

interface Props {
  value: string[];
  error?: string;
  onToggle: (type: string) => void;
}

export function ProjectTypeSelector({ value, error, onToggle }: Props) {
  return (
    <fieldset aria-describedby={error ? 'types-err types-hint' : 'types-hint'}>
      <legend className="sr">Tipo de proyecto</legend>
      <h3 className="wiz-q" tabIndex={-1}>
        ¿Qué necesitas?
      </h3>
      <p id="types-hint" className="wiz-hint">
        Puedes elegir varias opciones.
      </p>
      <div className="chips">
        {PROJECT_TYPES.map((t) => {
          const on = value.includes(t);
          return (
            <label key={t} className={`chip${on ? ' on' : ''}`}>
              <input className="sr" type="checkbox" checked={on} onChange={() => onToggle(t)} />
              <span className="chip-box" aria-hidden="true">
                <Icon name="check" strokeWidth={2.4} />
              </span>
              <span>{t}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id="types-err" className="group-err" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
