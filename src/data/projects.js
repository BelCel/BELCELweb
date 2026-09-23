// ─────────────────────────────────────────────────────────────────────────────
//  PROYECTOS — sección "Trabajos recientes"
// ─────────────────────────────────────────────────────────────────────────────
//  Para reemplazar los proyectos:
//   1. Guardá la captura en src/assets/projects/ (WebP, 1200 px de ancho, proporción ~16:10).
//   2. Importala abajo.
//   3. Reemplazá los objetos de `projects` usando la plantilla.
//  El orden del array es el orden en pantalla. Si el array queda vacío, la sección
//  muestra un mensaje de "próximamente" en lugar de romperse.
//
//  Plantilla:
//  {
//    title: 'Nombre del proyecto',             // obligatorio
//    client: 'Cliente',                        // obligatorio
//    type: 'Landing page',                     // obligatorio: Landing page | Tienda online | Catálogo | Web corporativa | ...
//    description: 'Una o dos líneas.',         // obligatorio
//    tech: ['React', 'Tailwind'],              // obligatorio
//    status: 'en-desarrollo',                  // 'publicado' | 'en-desarrollo'
//    image: capturaImportada,                  // opcional: sin imagen se muestra un fondo con la marca
//    url: 'https://...',                       // opcional: sin url la tarjeta no es clickeable
//  },
// ─────────────────────────────────────────────────────────────────────────────

import chempoTintas from '../assets/projects/chempo-tintas.webp'
import chempoWeb from '../assets/projects/chempo-web.webp'
import portfolioPablo from '../assets/projects/portfolio-pablo.webp'

// Textos del encabezado de la sección (por si cambia el enfoque, ej. "Proyectos en desarrollo")
export const projectsSection = {
  eyebrow: 'Proyectos',
  title: 'Trabajos recientes.',
  intro: 'Algunos de los sitios que diseñamos y desarrollamos para nuestros clientes.',
}

export const PROJECT_STATUS = {
  publicado: null, // sin etiqueta
  'en-desarrollo': 'En desarrollo',
}

// TODO: reemplazar por los proyectos en desarrollo actuales (contenido provisorio).
export const projects = [
  {
    title: 'Tintas Penetrantes',
    client: 'Chempo Company',
    type: 'Landing page',
    description: 'Landing page para el producto "Tintas penetrantes" de Chempo Company.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    status: 'publicado',
    image: chempoTintas,
    url: 'https://chempo.com.ar/tintaspenetrantes/',
  },
  {
    title: 'Sitio corporativo',
    client: 'Chempo Company',
    type: 'Web corporativa',
    description: 'Web institucional de Chempo Company con su línea de productos y contacto.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    status: 'publicado',
    image: chempoWeb,
    url: 'https://chempo.com.ar/',
  },
  {
    title: 'Portfolio profesional',
    client: 'Facility Manager',
    type: 'Portfolio',
    description: 'Un CV online mucho más profesional para destacar en la búsqueda laboral.',
    tech: ['React', 'Tailwind'],
    status: 'publicado',
    image: portfolioPablo,
    url: 'https://webpablobelsito.vercel.app/Inicio/Inicio',
  },
  {
    title: 'Bandas',
    client: 'Chempo Company',
    type: 'Landing page',
    description: 'Landing page para la línea de productos Bandas.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    status: 'en-desarrollo',
    image: null,
    url: null,
  },
]
