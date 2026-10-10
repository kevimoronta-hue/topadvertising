'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { formatLongDate, formatMonth, fromIso, startOfToday, toIso } from '@/lib/dates';
import { Icon } from '@/components/ui/Icon';

interface Props {
  value: string;
  error?: string;
  onSelect: (iso: string) => void;
}

const DOW = [
  ['L', 'lunes'],
  ['M', 'martes'],
  ['X', 'miércoles'],
  ['J', 'jueves'],
  ['V', 'viernes'],
  ['S', 'sábado'],
  ['D', 'domingo'],
];

/** Monthly calendar, Monday first. Past days disabled; roving tabindex + arrow/Home/End keys. */
export function DatePicker({ value, error, onSelect }: Props) {
  const today = startOfToday();
  const todayIso = toIso(today);
  const initial = value ? fromIso(value) : today;
  const [view, setView] = useState({ y: initial.getFullYear(), m: initial.getMonth() });
  const [focusIso, setFocusIso] = useState(value || '');
  const pendingFocus = useRef<string | null>(null);
  const grid = useRef<HTMLDivElement>(null);

  const isCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();

  const days = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const offset = (first.getDay() + 6) % 7;
    const count = new Date(view.y, view.m + 1, 0).getDate();
    const list: ({ blank: true } | { blank: false; iso: string; num: number; past: boolean })[] = [];
    for (let i = 0; i < offset; i++) list.push({ blank: true });
    for (let d = 1; d <= count; d++) {
      const date = new Date(view.y, view.m, d);
      list.push({ blank: false, iso: toIso(date), num: d, past: date < today });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.y, view.m, todayIso]);

  const inView = (iso: string) => days.some((d) => !d.blank && d.iso === iso);
  const firstAvailable = days.find((d) => !d.blank && !d.past) as { iso: string } | undefined;
  const tabIso = inView(focusIso) ? focusIso : inView(value) ? value : firstAvailable?.iso;

  useEffect(() => {
    if (!pendingFocus.current) return;
    grid.current?.querySelector<HTMLButtonElement>(`[data-iso="${pendingFocus.current}"]`)?.focus();
    pendingFocus.current = null;
  });

  const shiftMonth = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
    setFocusIso('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const iso = (e.target as HTMLElement).dataset.iso;
    if (!iso) return;
    const d = fromIso(iso);
    const dow = (d.getDay() + 6) % 7;
    const delta: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -dow, End: 6 - dow };
    if (!(e.key in delta)) return;
    e.preventDefault();
    d.setDate(d.getDate() + delta[e.key]);
    const target = d < today ? today : d;
    const next = toIso(target);
    pendingFocus.current = next;
    setFocusIso(next);
    setView({ y: target.getFullYear(), m: target.getMonth() });
  };

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" className="cal-nav" aria-label="Mes anterior" disabled={isCurrentMonth} onClick={() => shiftMonth(-1)}>
          <Icon name="chevronLeft" />
        </button>
        <p className="cal-month" aria-live="polite">
          {formatMonth(view.y, view.m)}
        </p>
        <button type="button" className="cal-nav" aria-label="Mes siguiente" onClick={() => shiftMonth(1)}>
          <Icon name="chevronRight" />
        </button>
      </div>
      <div className="cal-dow">
        {DOW.map(([short, long]) => (
          <span key={long} title={long} aria-hidden="true">
            {short}
          </span>
        ))}
      </div>
      <div className="cal-grid" ref={grid} onKeyDown={onKeyDown} aria-describedby={error ? 'date-err' : undefined}>
        {days.map((d, i) =>
          d.blank ? (
            <span key={`b${i}`} className="day-empty" />
          ) : (
            <button
              key={d.iso}
              type="button"
              data-iso={d.iso}
              className={`day${d.iso === value ? ' sel' : ''}${d.iso === todayIso ? ' today' : ''}`}
              disabled={d.past}
              tabIndex={d.iso === tabIso ? 0 : -1}
              aria-pressed={d.iso === value}
              aria-label={`${formatLongDate(d.iso)}${d.past ? ', no disponible' : ''}${d.iso === todayIso ? ', hoy' : ''}`}
              onClick={() => {
                setFocusIso(d.iso);
                onSelect(d.iso);
              }}
            >
              {d.num}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
