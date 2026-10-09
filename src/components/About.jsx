import { about, capabilityIcon, hero } from '@/data/portfolio.js'
import MicroLabel from './ui/MicroLabel.jsx'
import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'

export default function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-svh w-full scroll-mt-gutter flex-col justify-center px-5 py-rhythm-lg sm:px-8 lg:px-10 lg:pr-10"
    >
      <SectionHeading
        eyebrow={about.eyebrow}
        lines={about.headline}
        accentLine={2}
        lede={about.lede}
        rule
        delay={40}
      />

      <div className="mx-auto mt-rhythm-lg w-full max-w-section">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_15rem]">
          <Reveal
            delay={300}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(12,18,17,0.78),rgba(5,7,6,0.42))] p-5 sm:p-6"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 top-2 font-display text-[6rem] font-semibold leading-none tracking-[-0.08em] text-accent-400/[0.045] sm:text-[8rem]"
            >
              01
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/65 to-transparent"
            />

            <MicroLabel>Working thesis</MicroLabel>
            <div className="relative mt-5 max-w-measure">
              {about.paragraphs.map((text, index) => (
                <p
                  key={text.slice(0, 28)}
                  className={`text-[1rem] leading-[1.82] text-dim ${index ? 'mt-4' : ''}`}
                >
                  {text}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal
            delay={420}
            className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6"
          >
            <MicroLabel>Proof points</MicroLabel>
            <dl className="mt-5 grid grid-cols-3 gap-3 xl:grid-cols-1">
              {about.practice.metrics.map(({ label, stat }) => (
                <div key={label} className="border-t border-edge pt-3">
                  <dt className="font-mono text-[9.5px] font-medium uppercase leading-[1.35] tracking-[0.16em] text-dim">
                    {label}
                  </dt>
                  <dd className="mt-2 font-display text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-fg tabular-nums">
                    {hero.stats.find((s) => s.label === stat).value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {about.capabilities.map(({ icon, title, body }, index) => {
            const Icon = capabilityIcon[icon]

            return (
              <Reveal key={title} as="li" delay={560 + index * 80} className="group">
                <article className="relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-base-2/38 p-5 transition-[border-color,background-color] duration-300 hover:border-accent-400/30 hover:bg-white/[0.035]">
                  <div className="flex items-start gap-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-accent-400/18 bg-accent-400/[0.07] text-accent-300 transition-colors duration-300 group-hover:border-accent-400/36 group-hover:text-accent-200">
                      <Icon aria-hidden="true" className="size-4.5" strokeWidth={1.55} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/80">
                        {String(index + 1).padStart(2, '0')} / Principle
                      </p>
                      <h3 className="mt-1 font-display text-[1.08rem] font-semibold leading-tight tracking-[-0.02em] text-fg">
                        {title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-[0.94rem] leading-[1.66] text-dim">{body}</p>
                </article>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
