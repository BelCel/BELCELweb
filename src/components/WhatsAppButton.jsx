import { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { contact, whatsappLink } from '../data/site.js'

// Botón flotante de WhatsApp: aparece al pasar el hero.
export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={whatsappLink(contact.whatsapp[0].number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-3xl text-white shadow-lg shadow-black/40 transition-all duration-300 hover:scale-105 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <FaWhatsapp aria-hidden="true" />
    </a>
  )
}
