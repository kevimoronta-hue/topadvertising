import type { InputHTMLAttributes } from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  onValueChange: (value: string) => void;
}

/** Labelled input with its error linked through aria-describedby. */
export function FormField({ id, label, optional, error, onValueChange, className = '', ...rest }: Props) {
  const errId = `${id}-err`;
  return (
    <div className={`field${error ? ' bad' : ''} ${className}`}>
      <label htmlFor={id}>
        {label} {optional && <span className="opt">(opcional)</span>}
      </label>
      <input
        id={id}
        className="inp"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        aria-required={optional ? undefined : true}
        onChange={(e) => onValueChange(e.target.value)}
        {...rest}
      />
      {error && (
        <p className="field-err" id={errId}>
          {error}
        </p>
      )}
    </div>
  );
}
