import { FaWhatsapp, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi'
import SectionHeading from './SectionHeading.jsx'
import ContactForm from './ContactForm.jsx'
import { contact, whatsappLink } from '../data/site.js'

const channels = [
  ...contact.whatsapp.map((w) => ({
    icon: FaWhatsapp,
    label: 'WhatsApp',
    value: w.label,
    href: whatsappLink(w.number),
  })),
  { icon: HiOutlineMail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
  { icon: FaInstagram, label: 'Instagram', value: contact.instagram.handle, href: contact.instagram.url },
  { icon: FaLinkedinIn, label: 'LinkedIn', value: contact.linkedin.handle, href: contact.linkedin.url },
]

export default function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <SectionHeading id="contacto-title" eyebrow="Contacto" title="Hablemos de tu proyecto.">
            Contanos qué necesitás y te enviamos una propuesta sin compromiso. También podés escribirnos directo por
            cualquiera de estos canales.
          </SectionHeading>

          <ul className="divide-y divide-line border-y border-line" data-reveal>
            {channels.map(({ icon: Icon, label, value, href }) => {
              const external = href.startsWith('http')
              return (
                <li key={value}>
                  <a
                    href={href}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="group flex items-center gap-4 py-4"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-lg transition-colors group-hover:border-cyan group-hover:text-cyan">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-[0.15em] text-muted">{label}</span>
                      <span className="block truncate font-medium">{value}</span>
                    </span>
                  </a>
                </li>
              )
            })}
            <li className="flex items-center gap-4 py-4 text-muted">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-lg">
                <HiOutlineLocationMarker aria-hidden="true" />
              </span>
              {contact.location}
            </li>
          </ul>
        </div>

        <div data-reveal>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
