import Reveal from './Reveal'

/** The repeated `// 0N — Label` eyebrow + section heading + optional lede. */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  className = '',
}) {
  return (
    <Reveal className={`${align === 'center' ? 'mx-auto max-w-2xl text-center' : ''} ${className}`}>
      <p className="mb-4 font-mono text-xs tracking-[0.2em] text-accent-400/90 uppercase">
        {index && <span className="text-faint">{index}</span>}
        {index && ' — '}
        {eyebrow}
      </p>

      <h2 className="text-3xl font-semibold text-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
        {title} {accent && <span className="text-gradient">{accent}</span>}
      </h2>

      {description && <p className="mt-5 text-base leading-relaxed text-dim sm:text-lg">{description}</p>}
    </Reveal>
  )
}
