import { useId, useState } from 'react'
import { HiPlus } from 'react-icons/hi'
import SectionHeading from './SectionHeading.jsx'
import { services } from '../data/site.js'

function ServiceCard({ service, index }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <article
      className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-white/20 md:p-8"
      data-reveal
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-sm text-muted">0{index + 1}</span>
        <span className="h-2 w-2 rounded-full bg-red opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
      </div>
      <h3 className="mt-8 text-2xl font-semibold md:text-3xl">{service.name}</h3>
      <p className="mt-3 leading-relaxed text-muted">{service.summary}</p>

      <ul className="mt-6 mb-0 flex flex-wrap gap-2">
        {service.features.map((f) => (
          <li key={f} className="rounded-full border border-line px-3 py-1 text-xs text-fg/80">
            {f}
          </li>
        ))}
      </ul>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <p className="overflow-hidden text-sm leading-relaxed text-fg/80" inert={!open}>
          <span className="block pt-5">{service.details}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="mt-auto inline-flex w-fit items-center gap-2 pb-2 pt-6 text-sm font-medium text-fg"
      >
        <HiPlus className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`} aria-hidden="true" />
        {open ? 'Ver menos' : 'Más info'}
      </button>
    </article>
  )
}

export default function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="border-t border-line bg-surface/40 py-24 md:py-32">
      <div className="container-x">
        <SectionHeading id="servicios-title" eyebrow="Servicios" title="Lo que podemos hacer por vos.">
          Todos nuestros sitios son responsive: se ven y funcionan perfecto en celulares, tablets y computadoras.
        </SectionHeading>

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <ServiceCard key={s.name} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
