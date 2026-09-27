import { testimonials } from '@/data/portfolio'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

/** Renders nothing when there are no testimonials — see portfolio.js. */
export default function Testimonials() {
  if (!testimonials?.length) return null

  return (
    <section id="testimonials" className="section relative">
      <div className="shell">
        <SectionHeading index="05" eyebrow="Testimonials" title="What working" accent="together is like" />

        {/* Open columns divided by hairlines, not boxed cards */}
        <div className="mt-20 grid gap-y-14 md:grid-cols-3 md:gap-x-12">
          {testimonials.map((item, i) => (
            <Reveal
              as="figure"
              key={item.name}
              delay={i * 110}
              className="flex flex-col border-t border-line pt-8"
            >
              <blockquote className="flex-1 text-[15px] leading-[1.85] text-dim">“{item.quote}”</blockquote>

              <figcaption className="mt-8 flex items-center gap-4">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface font-display text-sm text-accent"
                  aria-hidden="true"
                >
                  {item.name
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">{item.name}</p>
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
