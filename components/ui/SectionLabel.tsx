export function SectionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return <p className={`label rv${dark ? ' label--dark' : ''}`}>{children}</p>;
}
