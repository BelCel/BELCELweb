import { useRef, useState } from 'react'
import { HiCheckCircle, HiChevronDown, HiExclamationCircle } from 'react-icons/hi'
import { contact, services } from '../data/site.js'
import { LIMITS, validateContact } from '../lib/contact.js'

const initial = { name: '', email: '', service: '', message: '' }

const newSubmissionId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

export default function ContactForm() {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error | rate_limited
  const startedAt = useRef(null) // momento en que empezó a completar (anti-bots)
  const submissionId = useRef(newSubmissionId()) // evita emails duplicados si reintenta

  const onChange = (e) => {
    const { name, value } = e.target
    startedAt.current ??= Date.now()
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const found = validateContact(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`cf-${Object.keys(found)[0]}`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          website: e.target.elements.website.value, // campo trampa
          startedAt: startedAt.current ?? Date.now(),
          submissionId: submissionId.current,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.ok) {
        setStatus('success')
        setValues(initial)
        startedAt.current = null
        submissionId.current = newSubmissionId()
        return
      }
      if (res.status === 400 && data.fields) {
        setErrors(data.fields)
        setStatus('idle')
        return
      }
      setStatus(res.status === 429 ? 'rate_limited' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="flex h-full flex-col items-start justify-center rounded-2xl border border-line bg-surface p-8">
        <HiCheckCircle className="size-10 text-cyan" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold">¡Mensaje enviado!</h3>
        <p className="mt-2 text-muted">Gracias por escribirnos. Te respondemos dentro de las próximas 24 hs hábiles.</p>
        <button type="button" className="btn-ghost mt-6" onClick={() => setStatus('idle')}>
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  const fieldError = (name) =>
    errors[name] && (
      <p id={`cf-${name}-error`} className="mt-2 flex items-start gap-1.5 text-sm text-red">
        <HiExclamationCircle className="mt-0.5 shrink-0" aria-hidden="true" /> {errors[name]}
      </p>
    )

  const aria = (name) => ({
    id: `cf-${name}`,
    name,
    value: values[name],
    onChange,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `cf-${name}-error` : undefined,
  })

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={status === 'sending'} className="relative rounded-2xl border border-line bg-surface p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-2 block text-sm font-medium">Nombre</label>
          <input {...aria('name')} type="text" autoComplete="name" maxLength={LIMITS.name.max} className="field" placeholder="Tu nombre" />
          {fieldError('name')}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-2 block text-sm font-medium">Email</label>
          <input {...aria('email')} type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email.max} className="field" placeholder="vos@empresa.com" />
          {fieldError('email')}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="cf-service" className="mb-2 block text-sm font-medium">
          ¿Qué necesitás? <span className="font-normal text-muted">(opcional)</span>
        </label>
        <div className="relative">
          <select {...aria('service')} className="field appearance-none pr-10">
            <option value="">Elegí una opción</option>
            {services.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
            <option value="Otro">Otro / No estoy seguro</option>
          </select>
          <HiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
        </div>
        {fieldError('service')}
      </div>

      <div className="mt-5">
        <label htmlFor="cf-message" className="mb-2 block text-sm font-medium">Mensaje</label>
        <textarea {...aria('message')} rows={5} maxLength={LIMITS.message.max} className="field resize-y" placeholder="Contanos sobre tu negocio y lo que tenés en mente." />
        {fieldError('message')}
      </div>

      {/* Campo trampa anti-spam: invisible para personas */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="cf-website">No completar este campo</label>
        <input id="cf-website" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {(status === 'error' || status === 'rate_limited') && (
        <p role="alert" className="mt-5 rounded-xl border border-red/40 bg-red/10 p-4 text-sm">
          {status === 'rate_limited'
            ? 'Recibimos varios mensajes seguidos desde tu conexión. Esperá unos minutos y probá de nuevo, o escribinos a '
            : 'No pudimos enviar el mensaje. Probá de nuevo en unos minutos o escribinos a '}
          <a className="underline" href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      )}

      <button type="submit" className="btn-primary mt-6 w-full !py-4 sm:w-auto sm:!py-3" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
