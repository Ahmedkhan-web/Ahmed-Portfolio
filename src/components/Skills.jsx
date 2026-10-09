import { skillIcon, skills } from '@/data/portfolio.js'
import Chip from './ui/Chip.jsx'
import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'

export default function Skills() {
  return (
    <section id="skills" className="relative w-full scroll-mt-gutter px-5 py-rhythm-lg sm:px-8 lg:px-10 lg:pr-10">
      <SectionHeading eyebrow={skills.eyebrow} lines={skills.headline} accentLine={1} lede={skills.summary} rule delay={40} />

      <ul className="mx-auto mt-rhythm-md grid w-full max-w-section gap-3.5 sm:grid-cols-2">
        {skills.groups.map(({ icon, title, body, tools }, index) => {
          const Icon = skillIcon[icon]

          return (
            <Reveal key={title} as="li" delay={290 + index * 90} className="group">
              <article className="relative h-full overflow-hidden rounded-2xl border border-edge bg-base-2/55 p-5 transition-[border-color,background-color] duration-300 hover:border-accent-400/35 hover:bg-white/[0.035] sm:p-6">
                <Icon aria-hidden="true" className="pointer-events-none absolute -right-4 -top-4 size-28 text-accent-400/[0.055] transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-400/[0.09]" strokeWidth={1} />

                <div className="relative flex items-center gap-3.5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent-400/20 bg-accent-400/[0.08] text-accent-300 transition-colors duration-300 group-hover:border-accent-400/40 group-hover:bg-accent-400/[0.12] group-hover:text-accent-200">
                    <Icon className="size-5" strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/80">{String(index + 1).padStart(2, '0')} / Core</p>
                    <h3 className="mt-1 font-display text-[1.2rem] font-semibold leading-none tracking-[-0.025em] text-fg">{title}</h3>
                  </div>
                </div>

                <p className="relative mt-5 max-w-[30rem] text-[0.9375rem] leading-[1.6] text-dim">{body}</p>

                <ul aria-label={`${title} technologies`} className="relative mt-5 flex flex-wrap gap-1.5">
                  {tools.map((tool) => (
                    <li key={tool}>
                      <Chip className="border-white/[0.08] bg-white/[0.025] text-dim group-hover:border-accent-400/20 group-hover:text-fg/80">{tool}</Chip>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
