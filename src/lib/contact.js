// Reglas del formulario de contacto.
// Se usan en el navegador (para avisar al usuario) y en el servidor (para no confiar en el navegador).

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  service: { max: 60 },
  message: { min: 10, max: 5000 },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function normalize(input = {}) {
  const str = (v) => (typeof v === 'string' ? v.trim() : '')
  return {
    name: str(input.name).replace(/\s+/g, ' '),
    email: str(input.email).toLowerCase(),
    service: str(input.service),
    message: str(input.message),
  }
}

// Devuelve un objeto { campo: 'mensaje de error' }. Vacío = todo bien.
export function validateContact(values) {
  const v = normalize(values)
  const errors = {}

  if (v.name.length < LIMITS.name.min) errors.name = 'Contanos tu nombre.'
  else if (v.name.length > LIMITS.name.max) errors.name = `El nombre no puede superar los ${LIMITS.name.max} caracteres.`

  if (!EMAIL_RE.test(v.email) || v.email.length > LIMITS.email.max) errors.email = 'Ingresá un email válido.'

  if (v.service.length > LIMITS.service.max) errors.service = 'Elegí una opción de la lista.'

  if (v.message.length < LIMITS.message.min)
    errors.message = `Contanos un poco más sobre tu proyecto (mínimo ${LIMITS.message.min} caracteres).`
  else if (v.message.length > LIMITS.message.max)
    errors.message = `El mensaje no puede superar los ${LIMITS.message.max} caracteres.`

  return errors
}
