/* ---------------------------------------------------------------------------
 *  CHIP — one pill of reference text.
 * ---------------------------------------------------------------------------
 *  Used by the tooling band in About and by the stack under each Experience
 *  entry. A shared primitive rather than a class string copied into both
 *  files, because the failure mode of copying it is invisible until it isn't:
 *  one section's pills end up a few hundredths of a rem shorter than the
 *  other's, or a shade dimmer, and the two sections stop reading as one page.
 *
 *  Sits deliberately quiet. These are references, not claims — what a role was
 *  built with, which layer a tool acts on — so the pill is a hairline border on
 *  the page's own surface with `dim` type, and nothing more. The only motion it
 *  has is a row-level hover, and it is written to be harmless where there is no
 *  row: `group-hover` with no `.group` ancestor simply never matches, so the
 *  About band can use this unchanged without inheriting a hover it does not want.
 *
 *  `leading-none` with vertical padding rather than a line-height: the pill's
 *  height then comes from its own padding, so pills of different label lengths
 *  are the same height and a wrapped row still lines up.
 * -------------------------------------------------------------------------*/
export default function Chip({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] leading-none tracking-[0.02em] text-dim transition-colors duration-300 group-hover:border-accent-400/20 group-hover:text-accent-200 ${className}`.trim()}
    >
      {children}
    </span>
  )
}
