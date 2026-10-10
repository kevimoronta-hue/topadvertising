import type { Service } from '@/types';
import { twoDigits } from '@/lib/dates';
import { Media } from './Media';

/** One large visual panel: image dominant, short copy laid on a local scrim. */
export function ServicePanel({ service, index }: { service: Service; index: number }) {
  const { visual } = service;
  return (
    <article className="svc" data-svc={index} aria-labelledby={`svc-${service.id}`} style={{ ['--ratio' as string]: `${visual.width}/${visual.height}` }}>
      <div className="svc-media reveal-mask">
        <Media visual={visual} sizes="(min-width: 1080px) 58vw, (min-width: 760px) 60vw, 86vw" />
        <span className="svc-scrim" aria-hidden="true" />
      </div>
      <div className="svc-body">
        <span className="svc-num">{twoDigits(index + 1)}</span>
        <h3 id={`svc-${service.id}`} className="h3">
          {service.title}
        </h3>
        <p>{service.text}</p>
      </div>
    </article>
  );
}
