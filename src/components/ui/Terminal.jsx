const TONE = {
  accent: 'text-accent-300',
  glow: 'text-glow',
  indigo: 'text-indigo-glow',
  fg: 'text-fg',
  dim: 'text-faint',
  ok: 'text-emerald-300',
  warn: 'text-amber-300',
}

/** Fake terminal window used as a recurring visual motif. */
export default function Terminal({ title = 'terminal', lines = [], footer, className = '' }) {
  return (
    <div className={`glass gradient-border-after relative overflow-hidden rounded-xl shadow-2xl shadow-black/50 ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-edge/80 bg-base-2/60 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57] ring-1 ring-black/30" />
        <span className="size-2.5 rounded-full bg-[#febc2e] ring-1 ring-black/30" />
        <span className="size-2.5 rounded-full bg-[#28c840] ring-1 ring-black/30" />
        <span className="ml-2 truncate font-mono text-[11px] text-faint">{title}</span>
      </div>

      {/* Body */}
      <div className="relative px-4 py-5 font-mono text-[12.5px] leading-[1.85] sm:text-[13px]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-10 animate-scan bg-gradient-to-b from-accent-500/8 to-transparent" />
        {lines.map((line, i) => (
          <div key={i} className="term-line" style={{ animationDelay: `${120 + i * 95}ms` }}>
            <span className="select-none text-accent-500/70">$ </span>
            <span className={TONE[line.color] ?? TONE.fg}>{line.text}</span>
          </div>
        ))}

        {footer && (
          <div className="term-line mt-3" style={{ animationDelay: `${140 + lines.length * 95}ms` }}>
            <span className="text-faint">→ </span>
            <span className="text-accent-300">{footer}</span>
            <span className="ml-0.5 inline-block h-[1em] w-2 translate-y-[2px] animate-blink bg-accent-400" />
          </div>
        )}
      </div>
    </div>
  )
}
