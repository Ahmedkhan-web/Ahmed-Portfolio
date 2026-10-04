/* ============================================================================
 *  BUTTON — the two CTA treatments, sized from the same tokens.
 * ----------------------------------------------------------------------------
 *  `iconStart` / `iconEnd` take Lucide components. Everything is driven by
 *  `1em` so an icon tracks its label's size and the two can never drift apart.
 *
 *  NOTHING MOVES ON HOVER. No lift, no press, and the trailing arrow holds
 *  still too. That is a deliberate constraint rather than an omission: a
 *  translating hover target is motion the visitor did not ask for, and on a hero
 *  it is the thing that makes the composition feel restless. Every animated
 *  property is named explicitly below, because leaving `transform` out of the
 *  list is what makes "static" a guarantee rather than a hope.
 *
 *  NOTHING GLOWS EITHER — not at rest and not under the pointer. The hero's two
 *  buttons and the card's are all this component, so the rule is one rule for
 *  the three of them: hover changes the fill's colour stops and the border, and
 *  that is the whole response.
 *
 *  The glow used to be the page's `glow-emerald` utility, applied at rest and
 *  deepened by `glow-emerald-hover`. It was dropped because on this background
 *  it was not a highlight but a second light source: the artwork behind the page
 *  is already an emerald glow, so a lit button read as a hole in it rather than
 *  as a control, and the effect was strongest exactly where the composition is
 *  busiest — under the headline, and on a card that is itself frosted glass
 *  catching the same light. The buttons are the only saturated fill on the
 *  screen; they do not need a shadow to be found.
 * ==========================================================================*/

const VARIANTS = {
  /* Emerald with a dark label. The vertical gradient keeps the top edge reading
     as lit without adding a shadow layer on top of it. */
  primary:
    'bg-gradient-to-b from-accent-300 to-accent-500 ' +
    'text-[#04120b] font-semibold hover:from-accent-200 hover:to-accent-400',
  /* Transparent with a hairline border; picks up a green cast on hover. */
  secondary:
    'border border-white/12 bg-white/[0.035] text-fg font-medium ' +
    'hover:border-accent-400/45 hover:bg-accent-400/[0.08] hover:text-accent-200',
}

const SIZES = {
  md: 'h-12 gap-2.5 px-6 text-[0.94rem]',
  lg: 'h-[3.3rem] gap-2.5 px-7 text-[0.97rem]',
}

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  /* Pushes the trailing icon to the far edge — used by the Hire Me button. */
  spread = false,
  iconStart: IconStart = null,
  iconEnd = null,
  delay,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'group relative inline-flex select-none items-center justify-center rounded-full',
    /* Background-image carries the primary's vertical gradient, so it is in the
       transition list alongside the colour properties — without it the fill
       would snap while everything else eased. No `transform`, no `translate`:
       those are what a lift would animate, and no `box-shadow` either, because
       nothing here casts one. */
    'transition-[background-image,background-color,border-color,color] duration-300 ease-out motion-reduce:transition-none',
    SIZES[size],
    VARIANTS[variant],
    spread && 'w-full justify-between',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const Arrow = iconEnd

  const content = (
    <>
      {IconStart && <IconStart className="size-[1.05em] shrink-0" aria-hidden="true" />}
      <span className="truncate">{children}</span>
      {Arrow && <Arrow className="size-[1.05em] shrink-0" aria-hidden="true" />}
    </>
  )

  /* The `reveal-rise` animation carries its timing through a CSS variable.
     `backwards` fill (not `both`) so the finished entrance stops contributing a
     transform at all — the button settles to `transform: none` and nothing is
     left over that a later state change could trip over. */
  const animation =
    delay === undefined
      ? undefined
      : { animation: 'reveal-rise 0.72s var(--ease-out-expo) backwards', animationDelay: `${delay}ms` }

  if (href) {
    return (
      <a href={href} className={classes} style={animation} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} style={animation} {...rest}>
      {content}
    </button>
  )
}
