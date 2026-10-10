import type { BookingRequest } from '@/types';

export type BookingResult = { status: 'pending' } | { status: 'error'; message: string };

/**
 * Booking adapter. The prototype is front-end only: nothing is stored or sent,
 * and the result is always "pending" so the UI never claims a confirmed meeting.
 *
 * To connect a real service, replace `localAdapter` with one that calls
 * Calendly / Cal.com / Google Calendar / a custom API route / a CRM.
 * Add server-side validation and anti-spam (honeypot, rate limit, captcha) at that point.
 */
export interface BookingAdapter {
  submit(request: BookingRequest): Promise<BookingResult>;
}

const localAdapter: BookingAdapter = {
  submit: () => new Promise((resolve) => setTimeout(() => resolve({ status: 'pending' }), 900)),
};

export const bookingAdapter: BookingAdapter = localAdapter;
