import SectionHeading from './SectionHeading.jsx'
import { about } from '../data/site.js'

export default function About() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeading id="nosotros-title" eyebrow="Sobre nosotros" title="Hacemos webs que trabajan para tu negocio.">
          {about.intro}
        </SectionHeading>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {about.pillars.map((p) => (
            <article key={p.title} className="bg-ink p-6 md:p-8" data-reveal>
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-muted" data-reveal>
            Cómo trabajamos
          </h3>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {about.steps.map((s, i) => (
              <li key={s.title} className="relative border-t border-line pt-6" data-reveal>
                <span className="absolute -top-px left-0 h-px w-10 bg-red" aria-hidden="true" />
                <span className="font-display text-sm text-cyan">0{i + 1}</span>
                <p className="mt-2 font-display text-lg font-semibold">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
