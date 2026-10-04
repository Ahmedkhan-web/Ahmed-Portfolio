/* ---------------------------------------------------------------------------
 *  MICRO LABEL — the small uppercase label that titles a group of content.
 * ---------------------------------------------------------------------------
 *  Used wherever a block needs to name what it holds: the two groups inside the
 *  About panel, and the technologies under each Experience entry. A shared
 *  primitive rather than a repeated class string, because the failure mode of
 *  repeating it is that one section's labels drift a few hundredths of a rem
 *  away from the other's and the two sections stop reading as one design.
 *
 *  THE LEADING RULE. A short gradient dash before the words, drawn from
 *  transparent to a dim accent. It is the same emerald hairline the section
 *  rules and the capability borders are cut from, at 1/4 the weight, so the label
 *  belongs to the page's drawing vocabulary without announcing itself.
 *
 *  `text-dim` rather than the `faint` token. These labels are real text at
 *  10px, and `faint` measures 4.2:1 against this page's backdrop — below the
 *  4.5:1 floor for anything smaller than 18px. `dim` measures 8.3:1, and at this
 *  size, weight and tracking the result still reads as a whisper rather than as
 *  a heading.
 *
 *  Decorative dash is `aria-hidden`; the words carry the meaning on their own.
 * -------------------------------------------------------------------------*/
export default function MicroLabel({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-dim ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className="h-px w-4 shrink-0 bg-gradient-to-r from-transparent to-accent-400/60"
      />
      {children}
    </span>
  )
}