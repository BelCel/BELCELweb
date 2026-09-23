import { FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import Logo from './Logo.jsx'
import { contact, navLinks, whatsappLink } from '../data/site.js'

const socials = [
  { icon: FaWhatsapp, label: 'WhatsApp', href: whatsappLink(contact.whatsapp[0].number) },
  { icon: FaInstagram, label: 'Instagram', href: contact.instagram.url },
  { icon: FaLinkedinIn, label: 'LinkedIn', href: contact.linkedin.url },
]

export default function Footer() {
  return (
    <footer className="border-t border-line pb-24 pt-12 md:pb-12">
      <div className="container-x flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted">Transformamos tus ideas en desarrollos web.</p>
        </div>

        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="hover:text-fg">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-white/30 hover:bg-white/5"
              >
                <Icon aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="container-x mt-10 text-xs text-muted">
        © {new Date().getFullYear()} BelCel Studio. Todos los derechos reservados.
      </p>
    </footer>
  )
}
