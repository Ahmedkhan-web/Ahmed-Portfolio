import Reveal from './Reveal'

/**
 * Section header: a pill eyebrow above a large, lightweight heading, then an
 * optional lede. The pill is the recurring "this is a section" marker used
 * across the whole page.
 */
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
    <Reveal className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : ''} ${className}`}>
      <p
        className={`mb-7 inline-flex items-center gap-2.5 rounded-pill border border-line px-4 py-2 font-mono text-[11px] tracking-[0.16em] text-dim uppercase ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      >
        {index && <span className="text-accent">{index}</span>}
        {eyebrow}
      </p>

      <h2 className="text-[2.1rem] leading-[1.08] text-fg sm:text-[2.9rem] lg:text-[3.5rem]">
        {title} {accent && <span className="text-accent">{accent}</span>}
      </h2>

      {description && (
        <p className="mt-7 max-w-2xl text-[15px] leading-[1.8] text-dim sm:text-base lg:text-[17px]">{description}</p>
      )}
    </Reveal>
  )
}
