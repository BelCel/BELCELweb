// Función serverless (Vercel) que recibe el formulario de contacto y lo envía por email con Resend.
// Endpoint: POST /api/contact
//
// Variables de entorno (se configuran en Vercel, NUNCA en el código ni con prefijo VITE_):
//   RESEND_API_KEY      API key de Resend (https://resend.com/api-keys)
//   CONTACT_TO_EMAIL    Casilla que recibe las consultas (por defecto belcel.devs@gmail.com)
//   CONTACT_FROM_EMAIL  Remitente. Sin dominio propio verificado usar: BelCel Web <onboarding@resend.dev>
//   ALLOWED_ORIGINS     (opcional) Orígenes extra permitidos, separados por coma. Ej: https://www.belcel.com.ar

import { normalize, validateContact } from '../src/lib/contact.js'

const MAX_BODY_BYTES = 16 * 1024
const MIN_FILL_TIME_MS = 3000 // un humano no completa el formulario en menos de 3 s
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } // 5 envíos cada 10 minutos por IP

// Límite por IP en memoria. Es "best effort": cada instancia de la función tiene el suyo.
// Si algún día reciben spam fuerte, pasar esto a Vercel KV / Upstash.
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear() // evita que el mapa crezca sin límite
  return recent.length > RATE_LIMIT.max
}

const json = (status, data, extraHeaders = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders },
  })

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function originAllowed(request) {
  const origin = request.headers.get('origin')
  if (!origin) return true // algunos navegadores/clientes no lo envían en same-origin
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
  try {
    return new URL(origin).host === new URL(request.url).host || allowed.includes(origin)
  } catch {
    return false
  }
}

function buildEmail({ name, email, service, message }, meta) {
  const rows = [
    ['Nombre', name],
    ['Email', email],
    ['Servicio', service || 'No especificado'],
  ]
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  const html = `<!doctype html>
<html lang="es"><body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
    <tr><td style="background:#0a0a0b;padding:20px 24px;color:#ffffff;font-size:18px;font-weight:bold">
      Nueva consulta desde la web <span style="color:#ff3b3b">●</span>
    </td></tr>
    <tr><td style="padding:24px">
      <table role="presentation" width="100%" style="border-collapse:collapse;font-size:15px">
        ${rows
          .map(
            ([k, v]) => `<tr>
          <td style="padding:8px 0;color:#71717a;width:110px;vertical-align:top">${k}</td>
          <td style="padding:8px 0;font-weight:bold">${escapeHtml(v)}</td>
        </tr>`,
          )
          .join('')}
      </table>
      <p style="margin:24px 0 8px;color:#71717a;font-size:13px;text-transform:uppercase;letter-spacing:1px">Mensaje</p>
      <div style="padding:16px;background:#f4f4f5;border-radius:8px;font-size:15px;line-height:1.6">${safeMessage}</div>
      <p style="margin:24px 0 0;font-size:13px;color:#71717a">
        Respondé este email para contestarle directamente a ${escapeHtml(name)}.<br>
        Recibido el ${escapeHtml(meta.date)} (hora Argentina).
      </p>
    </td></tr>
  </table>
</body></html>`

  const text = [
    'Nueva consulta desde la web',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Mensaje:',
    message,
    '',
    `Recibido el ${meta.date} (hora Argentina).`,
  ].join('\n')

  // Sin saltos de línea en el asunto (evita inyección de encabezados)
  const subject = `Nueva consulta web · ${service || 'General'} · ${name}`.replace(/[\r\n]+/g, ' ').slice(0, 150)

  return { subject, html, text }
}

async function handlePost(request) {
  if (!originAllowed(request)) return json(403, { ok: false, error: 'forbidden' })

  if (!(request.headers.get('content-type') || '').includes('application/json'))
    return json(415, { ok: false, error: 'unsupported_media_type' })

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, error: 'payload_too_large' })

  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return json(400, { ok: false, error: 'invalid_json' })
  }
  if (!body || typeof body !== 'object') return json(400, { ok: false, error: 'invalid_json' })

  // Anti-spam: campo trampa completado o envío demasiado rápido → respondemos "ok" sin enviar nada,
  // para que el bot no se entere de que fue bloqueado.
  const elapsed = Date.now() - Number(body.startedAt)
  if (body.website || !Number.isFinite(elapsed) || elapsed < MIN_FILL_TIME_MS) return json(200, { ok: true })

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) return json(429, { ok: false, error: 'rate_limited' }, { 'Retry-After': '600' })

  const errors = validateContact(body)
  if (Object.keys(errors).length) return json(400, { ok: false, error: 'validation', fields: errors })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] Falta la variable RESEND_API_KEY')
    return json(500, { ok: false, error: 'server_misconfigured' })
  }

  const data = normalize(body)
  const date = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date())
  const { subject, html, text } = buildEmail(data, { date })

  // Si el usuario reintenta (doble clic, mala conexión), Resend no manda el email dos veces.
  const idempotencyKey = /^[\w-]{8,64}$/.test(body.submissionId || '') ? `contact-${body.submissionId}` : undefined

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(idempotencyKey && { 'Idempotency-Key': idempotencyKey }),
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'BelCel Web <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO_EMAIL || 'belcel.devs@gmail.com'],
        reply_to: data.email,
        subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      // Se registra el motivo técnico, pero no los datos personales del cliente.
      console.error('[contact] Resend respondió', res.status, (await res.text()).slice(0, 300))
      return json(502, { ok: false, error: 'send_failed' })
    }
    return json(200, { ok: true })
  } catch (err) {
    console.error('[contact] Error al contactar a Resend:', err?.name, err?.message)
    return json(502, { ok: false, error: 'send_failed' })
  }
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' }, { Allow: 'POST' })
    return handlePost(request)
  },
}
