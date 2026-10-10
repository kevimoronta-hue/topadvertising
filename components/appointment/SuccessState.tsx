'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/data/site';
import { track } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/whatsapp';
import { ActionButton } from '@/components/ui/Buttons';
import { Icon } from '@/components/ui/Icon';

interface Props {
  message: string;
  onHome: () => void;
  onToast: (text: string) => void;
}

/** Honest confirmation: the request is prepared, the meeting is NOT confirmed. */
export function SuccessState({ message, onHome, onToast }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  const sendWhatsApp = () => {
    track('whatsapp_click', { from: 'appointment' });
    const url = whatsappUrl(message);
    if (url) window.open(url, '_blank', 'noopener');
    else {
      setPreview(true);
      onToast('Mensaje de WhatsApp preparado');
    }
  };

  return (
    <div ref={ref} className="success" role="status" tabIndex={-1}>
      <span className="success-mark" aria-hidden="true">
        <Icon name="check" />
      </span>
      <h3 className="wiz-q">Tu solicitud está lista.</h3>
      <p>TOP Advertising se pondrá en contacto contigo para confirmar la fecha, el horario y los detalles del proyecto.</p>
      <p className="small">La cita quedará confirmada después de validar la disponibilidad.</p>
      <div className="btns">
        <ActionButton onClick={sendWhatsApp}>
          <Icon name="whatsapp" />
          Enviar por WhatsApp
        </ActionButton>
        <a className="btn btn-ghost" href="#inicio" onClick={onHome}>
          Volver al inicio
        </a>
      </div>
      {preview && (
        <div className="wa-preview">
          {/* [NUMÉRO WHATSAPP À FOURNIR] — once SITE.whatsappNumber is set, the button opens wa.me directly. */}
          <p>Este es el mensaje que se enviará por WhatsApp:</p>
          <pre>{message}</pre>
        </div>
      )}
    </div>
  );
}
