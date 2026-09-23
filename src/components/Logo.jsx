export default function Logo({ className = '' }) {
  return (
    <span className={`font-display text-lg font-bold tracking-tight ${className}`}>
      BELCEL<span className="text-red">.</span>
      <span className="ml-1.5 hidden text-xs font-medium tracking-[0.2em] text-muted sm:inline">STUDIO</span>
    </span>
  )
}
