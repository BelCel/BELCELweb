import { useEffect, useState } from 'react'
import { HiOutlineMenuAlt4, HiX } from 'react-icons/hi'
import Logo from './Logo.jsx'
import { navLinks } from '../data/site.js'
import { useActiveSection } from '../hooks/useActiveSection.js'

const SECTION_IDS = navLinks.map((l) => l.id)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll del fondo y permite cerrar con Escape cuando el menú móvil está abierto
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-line bg-ink/80 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20" aria-label="Principal">
        <a href="#inicio" onClick={close} aria-label="BelCel Studio, ir al inicio">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? 'true' : undefined}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  active === link.id ? 'text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contacto" className="btn-primary hidden !py-2.5 md:inline-flex">
          Pedí tu presupuesto
        </a>

        <button
          type="button"
          className="-mr-2 grid size-11 place-items-center rounded-full text-2xl md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <HiX /> : <HiOutlineMenuAlt4 />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-ink md:hidden"
      >
        <ul className="container-x flex flex-col pt-6">
          {navLinks.map((link, i) => (
            <li key={link.id} className="border-b border-line">
              <a
                href={`#${link.id}`}
                onClick={close}
                className="flex items-baseline gap-4 py-5 font-display text-3xl font-medium"
              >
                <span className="text-sm text-muted">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="container-x mt-8">
          <a href="#contacto" onClick={close} className="btn-primary w-full !py-4 text-base">
            Pedí tu presupuesto
          </a>
        </div>
      </div>
    </header>
  )
}
