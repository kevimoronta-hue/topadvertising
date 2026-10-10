'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BookingErrors, BookingForm, BookingRequest } from '@/types';
import { bookingAdapter } from '@/lib/booking';
import { track } from '@/lib/analytics';
import { twoDigits } from '@/lib/dates';
import { emptyForm, validateStep } from '@/lib/validation';
import { buildWhatsAppMessage } from '@/lib/whatsapp';
import { ART } from '@/data/art';
import { ActionButton } from '@/components/ui/Buttons';
import { Media } from '@/components/ui/Media';
import { Icon } from '@/components/ui/Icon';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Toast } from '@/components/ui/Toast';
import { BookingSummary } from './BookingSummary';
import { ContactFields } from './ContactFields';
import { DatePicker } from './DatePicker';
import { ProjectTypeSelector } from './ProjectTypeSelector';
import { SuccessState } from './SuccessState';
import { TimeSlotSelector } from './TimeSlotSelector';

const STEP_LABELS = ['Proyecto', 'Datos', 'Tu idea', 'Fecha', 'Resumen'];
const TOTAL = STEP_LABELS.length;

const initialRequest = (): BookingRequest => ({ types: [], form: emptyForm(), description: '', date: '', time: '', consent: false });

/** Five-step appointment request. State lives here; nothing is persisted. */
export function AppointmentWizard() {
  const [step, setStep] = useState(1);
  const [req, setReq] = useState<BookingRequest>(initialRequest);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState('');
  const started = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Move focus to the step question and keep the wizard in view on step change.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = box.current;
    if (!el) return;
    el.querySelector<HTMLElement>('.wiz-q')?.focus({ preventScroll: true });
    const top = el.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + top - 96, behavior: 'smooth' });
  }, [step]);

  const clearError = (key: keyof BookingErrors) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      if (Object.keys(next).length === 0) setShowAlert(false);
      return next;
    });

  const setField = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => {
    setReq((r) => ({ ...r, form: { ...r.form, [key]: value } }));
    clearError(key);
  };

  const toggleType = (t: string) => {
    if (!started.current) {
      started.current = true;
      track('appointment_start');
    }
    if (!req.types.includes(t)) track('service_select', { type: t });
    setReq((r) => ({ ...r, types: r.types.includes(t) ? r.types.filter((x) => x !== t) : [...r.types, t] }));
    clearError('types');
  };

  const goTo = (n: number) => {
    setErrors({});
    setShowAlert(false);
    setStep(n);
  };

  const next = () => {
    const e = validateStep(step, req);
    if (Object.keys(e).length) {
      setErrors(e);
      setShowAlert(true);
      return;
    }
    track('appointment_step_complete', { step });
    goTo(step + 1);
  };

  const submit = async () => {
    const e = validateStep(5, req);
    if (Object.keys(e).length) {
      setErrors(e);
      setShowAlert(true);
      return;
    }
    setStatus('loading');
    try {
      const res = await bookingAdapter.submit(req);
      if (res.status === 'error') throw new Error(res.message);
      track('appointment_submit', { types: req.types.length });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    started.current = false;
    setReq(initialRequest());
    setErrors({});
    setShowAlert(false);
    setStatus('idle');
    setConfirmReset(false);
    setStep(1);
  };

  const hasData = req.types.length > 0 || !!req.description || !!req.date || Object.values(req.form).some(Boolean);
  const hideToast = useCallback(() => setToast(''), []);

  return (
    <section id="agenda" className="agenda" aria-labelledby="ag-title">
      <div className="wrap agenda-grid">
        <span className="agenda-surface" aria-hidden="true">
          <Media visual={ART.agendaSurface} sizes="(min-width: 1080px) 1px, 100vw" alt="" />
        </span>
        <div className="agenda-intro">
          <SectionLabel>Agenda</SectionLabel>
          <h2 id="ag-title" className="h2">
            Hablemos de tu próximo proyecto.
          </h2>
          <p className="lead">Cuéntanos qué tienes en mente y selecciona el momento que mejor te convenga.</p>
          <ol className="agenda-meta" aria-hidden="true">
            {STEP_LABELS.map((l, i) => (
              <li key={l} className={status === 'success' || i + 1 < step ? 'done' : i + 1 === step ? 'on' : ''}>
                <span>{twoDigits(i + 1)}</span>
                {l}
              </li>
            ))}
          </ol>
        </div>

        <div className="wiz" ref={box}>
          {status === 'success' ? (
            <SuccessState message={buildWhatsAppMessage(req)} onHome={reset} onToast={setToast} />
          ) : (
            <>
              <div className="wiz-top">
                <p className="wiz-count">
                  <span>
                    Paso <b>{step}</b> de {TOTAL}
                  </span>
                  <span>{STEP_LABELS[step - 1]}</span>
                </p>
                <div className="bar" role="progressbar" aria-label="Progreso de la solicitud" aria-valuemin={1} aria-valuemax={TOTAL} aria-valuenow={step}>
                  <span style={{ width: `${(step / TOTAL) * 100}%` }} />
                </div>
              </div>

              {showAlert && Object.keys(errors).length > 0 && (
                <div className="wiz-alert" role="alert">
                  <Icon name="alert" />
                  <span>Revisa los campos marcados para continuar.</span>
                </div>
              )}

              <div className="wiz-step" key={step}>
              {step === 1 && <ProjectTypeSelector value={req.types} error={errors.types} onToggle={toggleType} />}
              {step === 2 && <ContactFields form={req.form} errors={errors} onChange={setField} />}
              {step === 3 && (
                <>
                  <h3 className="wiz-q" tabIndex={-1}>
                    Cuéntanos un poco más sobre tu idea.
                  </h3>
                  <p className="wiz-hint">Mientras más contexto compartas, mejor preparada estará la primera conversación.</p>
                  <div className="field">
                    <label htmlFor="f-desc" className="sr">
                      Descripción del proyecto
                    </label>
                    <textarea
                      id="f-desc"
                      className="inp"
                      rows={7}
                      maxLength={1200}
                      placeholder="Describe el evento, el espacio, el objetivo de la marca y cualquier detalle que consideres importante."
                      value={req.description}
                      onChange={(e) => setReq((r) => ({ ...r, description: e.target.value }))}
                    />
                    <p className="count-chars">{req.description.length} / 1200</p>
                  </div>
                  {/* Visual only: no upload is implemented in this version. */}
                  <div className="ref-box">
                    <Icon name="image" strokeWidth={1.5} />
                    <div>
                      <b>Añadir una referencia visual — opcional</b>
                      <span>Podrás compartir imágenes o referencias cuando el equipo te contacte.</span>
                    </div>
                  </div>
                </>
              )}
              {step === 4 && (
                <>
                  <h3 className="wiz-q" tabIndex={-1}>
                    Elige una fecha y un horario
                  </h3>
                  <p className="wiz-hint">Selecciona el día que prefieres para conversar sobre tu proyecto.</p>
                  <DatePicker
                    value={req.date}
                    error={errors.date}
                    onSelect={(iso) => {
                      setReq((r) => ({ ...r, date: iso, time: r.date === iso ? r.time : '' }));
                      clearError('date');
                      track('appointment_date_select');
                    }}
                  />
                  {errors.date && (
                    <p className="group-err" id="date-err">
                      {errors.date}
                    </p>
                  )}
                  {req.date && (
                    <TimeSlotSelector
                      date={req.date}
                      value={req.time}
                      error={errors.time}
                      onSelect={(t) => {
                        setReq((r) => ({ ...r, time: t }));
                        clearError('time');
                      }}
                    />
                  )}
                </>
              )}
              {step === 5 && (
                <>
                  <BookingSummary
                    request={req}
                    errors={errors}
                    onEdit={goTo}
                    onConsent={(v) => {
                      setReq((r) => ({ ...r, consent: v }));
                      clearError('consent');
                    }}
                  />
                  {status === 'error' && (
                    <div className="wiz-alert" role="alert" style={{ marginTop: 16 }}>
                      <Icon name="alert" />
                      <span>No pudimos preparar tu solicitud. Inténtalo de nuevo en unos segundos.</span>
                    </div>
                  )}
                </>
              )}

              </div>

              <div className="wiz-nav">
                {step > 1 && (
                  <ActionButton variant="ghost" onClick={() => goTo(step - 1)}>
                    Atrás
                  </ActionButton>
                )}
                {step < TOTAL ? (
                  <ActionButton onClick={next}>
                    Continuar
                  </ActionButton>
                ) : (
                  <ActionButton onClick={submit} loading={status === 'loading'}>
                    Enviar solicitud
                  </ActionButton>
                )}
              </div>

              {hasData && (
                <div className="reset-row">
                  {confirmReset ? (
                    <>
                      <span>¿Borrar todos los datos introducidos?</span>
                      <button type="button" className="link-btn danger" onClick={reset}>
                        Sí, borrar
                      </button>
                      <button type="button" className="link-btn" onClick={() => setConfirmReset(false)}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button type="button" className="link-btn" onClick={() => setConfirmReset(true)}>
                      Empezar de nuevo
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Toast message={toast} onDone={hideToast} />
    </section>
  );
}
