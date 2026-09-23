// Todo el contenido editable del sitio vive acá.
// Para cambiar textos, servicios o datos de contacto no hace falta tocar los componentes.
// Los proyectos tienen su propio archivo: src/data/projects.js

export const contact = {
  email: 'belcel.devs@gmail.com',
  whatsapp: [
    { label: '11 3770-4374', number: '5491137704374' },
    { label: '249 438-0835', number: '5492494380835' },
  ],
  instagram: { handle: '@belcel.devs', url: 'https://www.instagram.com/belcel.devs/' },
  linkedin: { handle: 'BelCel', url: 'https://www.linkedin.com/company/103963905/' },
  location: 'Buenos Aires, Argentina',
}

export const whatsappLink = (number, text = 'Hola BelCel! Quiero consultar por un proyecto web.') =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`

export const navLinks = [
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'contacto', label: 'Contacto' },
]

export const about = {
  intro:
    'En BelCel nos especializamos en desarrollo web. Creamos soluciones digitales a medida que ayudan a nuestros clientes a crecer, usando tecnologías actuales y cuidando cada detalle.',
  pillars: [
    {
      title: 'Equipo',
      text: 'Especialistas de distintas áreas que suman experiencia y conocimiento para que cada proyecto salga con altos estándares de calidad.',
    },
    {
      title: 'Metodología',
      text: 'Un proceso probado que ataca los problemas típicos de los proyectos digitales, para entregar a tiempo, dentro del presupuesto y con el resultado esperado.',
    },
    {
      title: 'Compromiso',
      text: 'Te acompañamos antes, durante y después del lanzamiento. Tu web tiene que funcionar para tu negocio, no solo verse bien.',
    },
  ],
  steps: [
    { title: 'Charla inicial', text: 'Entendemos tu negocio, tus objetivos y a quién le hablás.' },
    { title: 'Diseño', text: 'Proponemos estructura y estética antes de escribir código.' },
    { title: 'Desarrollo', text: 'Construimos un sitio rápido, adaptable a cualquier pantalla.' },
    { title: 'Lanzamiento', text: 'Publicamos, medimos y ajustamos con vos.' },
  ],
}

export const services = [
  {
    name: 'Landing Page',
    summary: 'Web de una sola página diseñada para captar clientes con una llamada a la acción clara.',
    details:
      'Diseño y desarrollo de landing pages optimizadas para convertir visitantes en clientes. Con un mensaje claro y llamadas a la acción efectivas, te ayudamos a maximizar conversiones y alcanzar tus objetivos de marketing.',
    features: ['Diseño responsive', 'Formulario / WhatsApp', 'Optimizada para anuncios'],
  },
  {
    name: 'Tienda Online',
    summary: 'Sitio para vender productos o servicios con carrito de compras y pagos en línea.',
    details:
      'Plataformas de comercio electrónico seguras y eficientes: catálogo de productos, carrito, medios de pago y opciones de envío, con una navegación cómoda desde cualquier dispositivo.',
    features: ['Carrito y pagos', 'Gestión de productos', 'Opciones de envío'],
  },
  {
    name: 'Catálogo',
    summary: 'Vidriera digital que muestra tus productos o servicios, sin compra directa.',
    details:
      'Catálogos online atractivos y detallados para presentar tu oferta de forma profesional y atraer potenciales clientes, con consultas directas por WhatsApp o email.',
    features: ['Filtros y categorías', 'Consulta por WhatsApp', 'Fácil de actualizar'],
  },
  {
    name: 'Web Corporativa',
    summary: 'Tu empresa en línea: quiénes son, qué hacen y cómo contactarlos.',
    details:
      'Sitios que reflejan la identidad y los valores de tu organización, comunicando tu mensaje con secciones clave como Quiénes somos, Misión y visión, Servicios y Contacto.',
    features: ['Identidad de marca', 'SEO básico', 'Secciones a medida'],
  },
]

// Los proyectos están en ./projects.js
