export default function SectionHeading({ eyebrow, title, children, id }) {
  return (
    <header className="mb-12 max-w-2xl md:mb-16" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-4 text-3xl font-semibold sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">{children}</p>}
    </header>
  )
}
