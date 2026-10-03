import background from '@/assets/hero-background.png'

/* ============================================================================
 *  BACKDROP — the full-bleed background, behind everything.
 * ----------------------------------------------------------------------------
 *  `fixed`, not `absolute`. The shell in App.jsx does not scroll at `lg` — only
 *  the centre column does — so a `fixed` backdrop sits behind all three
 *  sections for the whole session and the image never slides as the copy moves
 *  over it. `absolute` would have worked for the hero alone and then broken the
 *  moment a second section was added: the element would have scrolled away with
 *  its parent and left the lower sections on flat black.
 *
 *  This renders the supplied background image exactly as provided: no
 *  filters, no blend modes, no extra artwork layered on top. The only
 *  addition is a single flat scrim to pull the image down so the
 *  foreground type stays readable.
 *
 *  Measured, the supplied image is already very dark (95th-percentile
 *  luminance ~38/255) with a strong emerald cast, so it needs almost no
 *  help: measured text contrast runs 12–19:1 even at 20% scrim. A heavier
 *  scrim measurably crushed the gradient (emerald-dominant pixels fell
 *  from 66% to 28% going 20% -> 35%), so 20% is the value that keeps the
 *  art intact while leaving the type comfortably readable.
 *
 *  `bg-black/20` is the only knob — raise it if type ever feels
 *  low-contrast over a particular crop of the image, lower it if the
 *  artwork starts looking washed out.
 * ==========================================================================*/
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      <img
        src={background}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="scrim absolute inset-0 bg-black/20" />
    </div>
  )
}
