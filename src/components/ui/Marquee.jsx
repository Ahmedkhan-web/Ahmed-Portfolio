/**
 * Infinite horizontal capability strip. The track is duplicated so the -50%
 * translate loops seamlessly, and it pauses on hover.
 */
export default function Marquee({ items = [], className = '' }) {
  if (!items.length) return null
  const track = [...items, ...items]

  return (
    <div className={`group relative flex overflow-hidden ${className}`} aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-bg to-transparent" />

      <div className="flex w-max shrink-0 animate-marquee items-center gap-10 pr-10 group-hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-3 font-mono text-xs whitespace-nowrap text-faint">
            <span className="size-1 rounded-full bg-accent/70" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
