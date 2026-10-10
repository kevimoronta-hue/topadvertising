export type AnalyticsEvent =
  | 'hero_cta_click'
  | 'service_view'
  | 'service_select'
  | 'changan_project_view'
  | 'gallery_open'
  | 'appointment_start'
  | 'appointment_step_complete'
  | 'appointment_date_select'
  | 'appointment_submit'
  | 'whatsapp_click'
  | 'instagram_click'
  | 'final_cta_click';

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Analytics stub. Pushes to dataLayer only if a tag manager is installed.
 * Never pass free-text form content or personal data here.
 */
export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === 'undefined') return;
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...params });
}
