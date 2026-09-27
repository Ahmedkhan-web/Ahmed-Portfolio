import { testimonials } from '@/data/portfolio'
import Icon from './Icon'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

/** Renders nothing when there are no testimonials — see portfolio.js. */
export default function Testimonials() {
  if (!testimonials?.length) return null

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading index="04" eyebrow="Testimonials" title="What working" accent="together is like" />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal
              as="figure"
              key={item.name}
              delay={i * 110}
              className="glass gradient-border-after group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-colors duration-500 hover:border-accent-500/40 sm:p-7"
            >
              {/* Oversized quote mark */}
              <Icon
                name="quote"
                className="size-8 shrink-0 text-accent-500/35 transition-colors duration-500 group-hover:text-accent-400/60"
                strokeWidth={1.4}
              />

              <blockquote className="mt-4 flex-1 text-sm leading-[1.75] text-dim">{item.quote}</blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-edge/60 pt-5">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${item.accent} font-display text-sm font-semibold text-white`}
                  aria-hidden="true"
                >
                  {item.name
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{item.name}</p>
                  <p className="truncate text-xs text-faint">{item.role}</p>
                </div>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
