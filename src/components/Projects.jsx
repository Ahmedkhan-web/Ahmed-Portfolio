import { useState } from 'react'
import { projects } from '@/data/portfolio'
import ProjectCard from './ProjectCard'
import Button from './ui/Button'
import Icon from './Icon'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Projects() {
  // Accordion — one case study open at a time keeps the page scannable.
  const [openId, setOpenId] = useState(null)

  const featured = projects.filter((p) => p.featured)
  const more = projects.filter((p) => !p.featured)

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="00"
          eyebrow="Selected work"
          title="Systems built to"
          accent="do real work"
          description="Each one below started as a problem someone actually had. Open a case study for the problem, the approach, and what the model was actually doing."
        />

        {/* Featured */}
        <div className="mt-14 space-y-5">
          {featured.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              open={openId === project.id}
              onToggle={() => setOpenId(openId === project.id ? null : project.id)}
              delay={i * 70}
            />
          ))}
        </div>

        {/* More work */}
        {more.length > 0 && (
          <>
            <Reveal delay={120}>
              <h3 className="mt-20 flex items-center gap-4 font-mono text-xs tracking-[0.2em] text-faint uppercase">
                Also built
                <span className="h-px flex-1 bg-gradient-to-r from-edge-2 to-transparent" />
              </h3>
            </Reveal>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {more.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={featured.length + i} delay={i * 90} />
              ))}
            </div>
          </>
        )}

        <Reveal delay={140}>
          <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl border border-dashed border-edge-2 bg-surface/30 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-fg">There’s more in the repo</h3>
              <p className="mt-1.5 text-sm text-dim">
                Smaller tools, experiments, and the messy middle of shipping AI features.
              </p>
            </div>
            <Button as="a" href="https://github.com/" target="_blank" rel="noreferrer noopener" variant="outline">
              <Icon name="github" className="size-4" />
              Browse GitHub
              <Icon name="arrowUpRight" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
