/**
 * Ambient page background. Deliberately almost empty: a flat near-black
 * field with one static, very soft accent wash behind the hero. Depth
 * comes from surface tone and whitespace, not from glow.
 */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-bg" />

      {/* Single static wash to seat the hero. No animation, no second orb. */}
      <div className="absolute -top-1/3 left-1/2 h-[46rem] w-[80rem] -translate-x-1/2 rounded-full bg-accent/[0.045] blur-[150px]" />
    </div>
  )
}
