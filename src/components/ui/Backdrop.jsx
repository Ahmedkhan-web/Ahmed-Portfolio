/**
 * Ambient page background: blueprint grid, drifting violet light, and a subtle
 * scanline sweep. Fixed and pointer-events-none so it never intercepts clicks.
 */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-base" />

      {/* Blueprint grid, faded radially */}
      <div className="grid-bg absolute inset-0 opacity-70" />

      {/* Colour sources */}
      <div className="absolute -top-40 -left-32 size-[38rem] animate-float rounded-full bg-accent-600/16 blur-[130px]" />
      <div
        className="absolute top-1/4 -right-40 size-[34rem] animate-float rounded-full bg-indigo-glow/12 blur-[140px]"
        style={{ animationDelay: '-2.5s' }}
      />
      <div
        className="absolute -bottom-48 left-1/3 size-[36rem] animate-float rounded-full bg-glow/10 blur-[150px]"
        style={{ animationDelay: '-4.5s' }}
      />

      {/* Vignette + top glow to seat the hero */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,transparent_20%,var(--color-base)_78%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />
    </div>
  )
}
