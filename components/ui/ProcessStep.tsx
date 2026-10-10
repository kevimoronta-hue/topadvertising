import type { ArtImage } from '@/types';
import { twoDigits } from '@/lib/dates';
import { Media } from './Media';

interface Props {
  index: number;
  title: string;
  text: string;
  visual: ArtImage;
}

/** One card of the process stack: giant number, title, one sentence, one image. */
export function ProcessStep({ index, title, text, visual }: Props) {
  const n = twoDigits(index);
  return (
    <li className="pcard-item stack-item" style={{ ['--i' as string]: index - 1 }}>
      <article className="pcard stack-card" aria-labelledby={`paso-${n}`}>
        <div className="pcard-media">
          <Media visual={visual} sizes="(min-width: 1080px) 34vw, (min-width: 760px) 680px, 92vw" />
        </div>
        <div className="pcard-body">
          <span className="pcard-big" aria-hidden="true">
            {n}
          </span>
          <p className="pcard-step">Paso {n}</p>
          <h3 id={`paso-${n}`} className="h3">
            {title}
          </h3>
          <p className="pcard-text">{text}</p>
        </div>
        <span className="stack-shade" aria-hidden="true" />
      </article>
    </li>
  );
}
