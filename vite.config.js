import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// En producción (Vercel) las funciones de /api las ejecuta Vercel.
// En local, este plugin hace que `npm run dev` y `npm run preview` también respondan en /api/*,
// usando las variables del archivo .env.
function localApi(env) {
  const handle = (loadModule) => async (req, res, next) => {
    const route = req.originalUrl.split('?')[0].replace(/^\/api\//, '')
    if (!/^[\w-]+$/.test(route)) return next()
    try {
      for (const [k, v] of Object.entries(env)) process.env[k] ??= v
      const mod = await loadModule(`/api/${route}.js`)
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      const headers = new Headers()
      for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
      const request = new Request(`http://${req.headers.host}${req.originalUrl}`, {
        method: req.method,
        headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
      })
      const response = await mod.default.fetch(request)
      res.statusCode = response.status
      response.headers.forEach((value, key) => res.setHeader(key, value))
      res.end(Buffer.from(await response.arrayBuffer()))
    } catch (err) {
      if (err?.code === 'ERR_MODULE_NOT_FOUND' || /Failed to load url/.test(err?.message)) return next()
      console.error(err)
      res.statusCode = 500
      res.end('Error en la API local')
    }
  }

  return {
    name: 'belcel-local-api',
    configureServer(server) {
      server.middlewares.use('/api', handle((path) => server.ssrLoadModule(path)))
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', handle((path) => import(`.${path}?t=${Date.now()}`)))
    },
  }
}

// Completa la URL pública del sitio en index.html (canonical, vista previa en redes, datos para Google).
// Orden de prioridad: VITE_SITE_URL → dominio de producción que asigna Vercel → valor por defecto.
// Nunca queda vacía: una URL vacía rompe el build.
function siteUrl(env) {
  const raw =
    env.VITE_SITE_URL?.trim() ||
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    'https://belcel.vercel.app'
  const url = raw.startsWith('http') ? raw : `https://${raw}`
  return {
    name: 'belcel-site-url',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('__SITE_URL__', url.replace(/\/+$/, '')),
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), siteUrl(env), localApi(env)],
  }
})
