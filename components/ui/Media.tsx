import Image from 'next/image';
import type { ArtImage, RealPhoto } from '@/types';

interface Props {
  visual: RealPhoto | ArtImage;
  sizes: string;
  priority?: boolean;
  /** Show the provenance tag (real client photo vs. illustrative art direction). */
  tag?: boolean;
  className?: string;
  alt?: string;
}

/** Fills its (positioned, sized) parent. Provenance is always explicit: real photo or illustration. */
export function Media({ visual, sizes, priority, tag = false, className = '', alt }: Props) {
  return (
    <>
      <Image
        src={visual.src}
        alt={alt ?? visual.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        style={{ objectFit: 'cover', objectPosition: visual.focal }}
      />
      {tag && <span className={visual.kind === 'photo' ? 'tag tag--real' : 'tag tag--art'}>{visual.kind === 'photo' ? 'Foto real · Changan' : 'Ilustración'}</span>}
    </>
  );
}
