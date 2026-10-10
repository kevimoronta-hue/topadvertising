const pad = (n: number) => String(n).padStart(2, '0');

export const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const startOfToday = () => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatLongDate = (iso: string) =>
  iso ? capitalize(fromIso(iso).toLocaleDateString('es-PA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })) : '';

export const formatMonth = (year: number, month: number) =>
  capitalize(new Date(year, month, 1).toLocaleDateString('es-PA', { month: 'long', year: 'numeric' }));

export const twoDigits = pad;
