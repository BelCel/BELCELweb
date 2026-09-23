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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), localApi(env)],
  }
})
