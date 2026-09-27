const TONE = {
  accent: 'text-accent',
  fg: 'text-fg',
  dim: 'text-faint',
  ok: 'text-accent',
  warn: 'text-amber-300',
}

/** Fake terminal window, used once as a quiet supporting detail. */
export default function Terminal({ title = 'terminal', lines = [], footer, className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-card border border-line bg-surface ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-2 rounded-full bg-[#ff5f57]/70" />
        <span className="size-2 rounded-full bg-[#febc2e]/70" />
        <span className="size-2 rounded-full bg-[#28c840]/70" />
        <span className="ml-2 truncate font-mono text-[11px] text-faint">{title}</span>
      </div>

      {/* Body */}
      <div className="px-5 py-5 font-mono text-[12.5px] leading-[1.9]">
        {lines.map((line, i) => (
          <div key={i} className="term-line" style={{ animationDelay: `${140 + i * 95}ms` }}>
            <span className="select-none text-accent-muted">&gt; </span>
            <span className={TONE[line.color] ?? TONE.fg}>{line.text}</span>
          </div>
        ))}

        {footer && (
          <div className="term-line mt-3" style={{ animationDelay: `${160 + lines.length * 95}ms` }}>
            <span className="text-faint">└&gt; </span>
            <span className="text-accent">{footer}</span>
            <span className="ml-0.5 inline-block h-[1em] w-1.5 translate-y-[2px] animate-blink bg-accent" />
          </div>
        )}
      </div>
    </div>
  )
}
