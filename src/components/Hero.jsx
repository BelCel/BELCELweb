import { useEffect, useRef } from 'react'
import { HiArrowRight } from 'react-icons/hi'

const POSTER = '/media/hero-poster.webp'

export default function Hero() {
  const videoRef = useRef(null)

  // Carga el video liviano en celular y el de mayor calidad en pantallas grandes.
  // Si el usuario prefiere menos movimiento o tiene "ahorro de datos", se queda con la imagen fija.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = navigator.connection?.saveData
    if (reduceMotion || saveData) return

    const isSmall = window.matchMedia('(max-width: 767px)').matches
    video.src = isSmall ? '/media/hero-mobile.mp4' : '/media/hero.mp4'
    video.play().catch(() => {})
  }, [])

  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-0">
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 size-full object-cover opacity-70"
        poster={POSTER}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />
      {/* Degradado para asegurar contraste del texto sobre el video */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/30 md:bg-gradient-to-r md:from-ink md:via-ink/70 md:to-transparent" />

      <div className="container-x">
        <div className="max-w-3xl">
          <p className="eyebrow animate-reveal">Estudio de desarrollo web · Buenos Aires</p>
          <h1 className="mt-6 animate-reveal text-[2.6rem] font-semibold leading-[1.02] [animation-delay:100ms] sm:text-6xl md:text-7xl">
            Transformamos tus ideas en <span className="text-red">desarrollos web</span>.
          </h1>
          <p className="mt-6 max-w-xl animate-reveal text-base leading-relaxed text-fg/80 [animation-delay:200ms] md:text-lg">
            Landing pages, tiendas online y webs corporativas rápidas, modernas y pensadas para que tu negocio
            consiga más clientes.
          </p>
          <div className="mt-10 flex animate-reveal flex-col gap-3 [animation-delay:300ms] sm:flex-row">
            <a href="#contacto" className="btn-primary !py-4 sm:!py-3">
              Pedí tu presupuesto <HiArrowRight aria-hidden="true" />
            </a>
            <a href="#proyectos" className="btn-ghost !py-4 backdrop-blur-sm sm:!py-3">
              Ver proyectos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
