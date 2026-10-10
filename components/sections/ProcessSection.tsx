import { ART } from '@/data/art';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProcessStep } from '@/components/ui/ProcessStep';

const STEPS = [
  { title: 'Cuéntanos tu idea', text: 'Compártenos el tipo de evento, la fecha, el lugar y lo que deseas transmitir.', visual: ART.procIdea },
  { title: 'Diseñamos la experiencia', text: 'Definimos la dirección visual, los elementos necesarios y la forma de aprovechar cada espacio.', visual: ART.procDiseno },
  { title: 'Producimos y montamos', text: 'Coordinamos la ejecución para convertir la propuesta en una experiencia real.', visual: ART.procMontaje },
];

/** Three large cards that settle on top of each other as you scroll (sticky stack, CSS only). */
export function ProcessSection() {
  return (
    <section id="proceso" className="process" aria-labelledby="pro-title">
      <div className="wrap process-head">
        <SectionLabel dark>De la idea al evento</SectionLabel>
        <h2 id="pro-title" className="h2 rv">
          Un proceso claro para dar vida a tu proyecto.
        </h2>
      </div>
      <ol className="pstack stack wrap" aria-label="Pasos del proceso">
        {STEPS.map((s, i) => (
          <ProcessStep key={s.title} index={i + 1} title={s.title} text={s.text} visual={s.visual} />
        ))}
      </ol>
    </section>
  );
}
