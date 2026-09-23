import { HiArrowUpRight } from 'react-icons/hi2'
import SectionHeading from './SectionHeading.jsx'
import { projects, projectsSection, PROJECT_STATUS } from '../data/projects.js'

function ProjectCard({ project }) {
  const { title, client, type, description, image, url, tech = [], status } = project
  const badge = PROJECT_STATUS[status]
  const Wrapper = url ? 'a' : 'div'
  const wrapperProps = url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${title} (${client}), abre en una pestaña nueva` }
    : {}

  return (
    <article data-reveal>
      <Wrapper {...wrapperProps} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface-2">
          {image ? (
            <img
              src={image}
              alt={`Captura del sitio ${title} de ${client}`}
              width="1200"
              height="750"
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_40%,rgb(255_59_59/0.25),transparent_55%),radial-gradient(circle_at_70%_60%,rgb(62_230_230/0.2),transparent_55%)]">
              <span className="font-display text-2xl font-semibold text-fg/80">{badge ?? title}</span>
            </div>
          )}
          {badge && (
            <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium backdrop-blur">
              {badge}
            </span>
          )}
          {url && (
            <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <HiArrowUpRight aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              {client} · {type}
            </p>
            <h3 className="mt-2 text-xl font-semibold md:text-2xl">
              {title}
              {url && <HiArrowUpRight className="ml-1 inline size-4 text-muted md:hidden" aria-hidden="true" />}
            </h3>
          </div>
        </div>
        <p className="mt-2 leading-relaxed text-muted">{description}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tecnologías">
          {tech.map((t) => (
            <li key={t} className="rounded-md bg-surface-2 px-2 py-1 text-xs text-fg/70">
              {t}
            </li>
          ))}
        </ul>
      </Wrapper>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeading id="proyectos-title" eyebrow={projectsSection.eyebrow} title={projectsSection.title}>
          {projectsSection.intro}
        </SectionHeading>

        {projects.length > 0 ? (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={`${p.client}-${p.title}`} project={p} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted" data-reveal>
            Estamos preparando nuevos proyectos. Muy pronto vas a poder verlos acá.
          </p>
        )}
      </div>
    </section>
  )
}
