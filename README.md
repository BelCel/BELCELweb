# BelCel Studio — sitio web

Sitio institucional de BelCel Studio hecho con **React 19 + Vite + Tailwind CSS 4**.

## Cómo correrlo

```bash
npm install
cp .env.example .env   # en Windows: copy .env.example .env
npm run dev            # servidor local en http://localhost:5173
npm run build          # genera la versión final en /dist
npm run preview        # sirve /dist para probar el build
npm run lint           # revisa errores comunes antes de subir
```

## Formulario de contacto (envío de emails)

El formulario envía las consultas a **belcel.devs@gmail.com** usando:

- **`api/contact.js`**: una función serverless de Vercel (el "backend"). Recibe el formulario, lo valida de nuevo en el servidor y manda el email.
- **[Resend](https://resend.com)**: el servicio que entrega el email (plan gratis: 3.000 emails por mes).

La API key vive **solo en el servidor**. Nunca llega al navegador ni queda en el código.

**Protecciones incluidas:**
- Validación en el navegador y otra vez en el servidor (reglas compartidas en `src/lib/contact.js`).
- Anti-spam: un campo trampa invisible y un tiempo mínimo de llenado. A los bots se les responde "ok", pero no se envía nada.
- Límite de 5 envíos cada 10 minutos por IP.
- Solo acepta envíos desde el propio dominio.
- Escape de HTML (nadie puede inyectar código en el email) y asunto sin saltos de línea.
- Idempotencia: si el usuario hace doble clic o reintenta, no llegan emails duplicados.

El email llega con nombre, email, servicio elegido y mensaje. Tiene **"Responder" configurado al email del cliente**, así que se le contesta directo desde Gmail.

### Configuración (una sola vez)

1. Crear una cuenta gratis en [resend.com](https://resend.com) **con belcel.devs@gmail.com**.
   Esto importa: sin dominio propio, Resend solo permite enviar a la casilla con la que se creó la cuenta.
2. En Resend, ir a *API Keys* → *Create API Key* (permiso "Sending access") y copiarla.
3. En Vercel, ir a *Project → Settings → Environment Variables* y cargar:

| Variable | Valor |
|---|---|
| `RESEND_API_KEY` | la key de Resend (`re_...`) |
| `CONTACT_TO_EMAIL` | `belcel.devs@gmail.com` |
| `CONTACT_FROM_EMAIL` | `BelCel Web <onboarding@resend.dev>` |
| `VITE_SITE_URL` | el dominio del sitio, ej. `https://belcel.com.ar` |

4. Hacer *Redeploy*.

**Cuando tengan dominio propio** (recomendado): verificarlo en Resend (*Domains*) y cambiar `CONTACT_FROM_EMAIL` a algo como `BelCel Web <web@belcel.com.ar>`. Mejora la entrega y evita que los mails caigan en spam.

### Probar en local

Copiá `.env.example` a `.env`, completá `RESEND_API_KEY` y corré `npm run dev`. El proyecto ya trae un puente para que `/api/contact` funcione también en local, sin instalar nada extra.

> **Hosting:** está preparado para **Vercel**. Si publican en Netlify o Cloudflare, la función usa el formato estándar `fetch(Request)`, así que se adapta moviendo el archivo a la carpeta de funciones de ese servicio.

## Dónde editar el contenido

- **Textos, servicios y datos de contacto:** `src/data/site.js`
- **Proyectos:** `src/data/projects.js`. Ahí está la plantilla comentada con todos los campos.
  1. Guardá la captura en `src/assets/projects/` (`.webp`, 1200 px de ancho).
  2. Importala en `projects.js` y agregá un objeto con la plantilla.
  3. `status: 'en-desarrollo'` muestra la etiqueta "En desarrollo". La imagen y el link son opcionales.
  4. Los textos del encabezado de la sección están en `projectsSection`.
  5. Si la lista queda vacía, la sección muestra "próximamente" en vez de romperse.

## Estructura

```
public/            favicon, íconos, imagen para redes, video del hero
src/
  assets/          imágenes de proyectos (optimizadas)
  components/      Navbar, Hero, About, Services, Projects, Contact, Footer…
  data/site.js     contenido editable
  data/projects.js proyectos (con plantilla)
  lib/contact.js   reglas de validación del formulario (navegador + servidor)
api/
  contact.js       función serverless que envía los emails
  hooks/           animaciones al hacer scroll y sección activa del menú
  index.css        tokens de diseño (colores, tipografías) y utilidades
```
