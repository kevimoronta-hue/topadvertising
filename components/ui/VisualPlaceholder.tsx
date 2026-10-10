import type { PendingVisual } from '@/types';

/**
 * PLACEHOLDER — art-direction frame for a visual still to be produced with Higgsfield.
 * Replace by an <Image> pointing to `visual.futureSrc` once the asset exists.
 */
export function VisualPlaceholder({ visual, showRatio = true, label }: { visual: PendingVisual; showRatio?: boolean; label?: string }) {
  return (
    <span className={`ph ph--${visual.variant}`} role="img" aria-label={`Visual pendiente: ${visual.shot.toLowerCase()}`} data-asset={visual.futureSrc} style={{ display: 'block' }}>
      <span className="ph-obj" />
      <span className="ph-obj" />
      {showRatio && <span className="ph-cap">{visual.ratio}</span>}
      <span className="asset-tag">{label ?? `Higgsfield · ${visual.shot}`}</span>
    </span>
  );
}
