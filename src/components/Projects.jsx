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
    <section id="work" className="section relative">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="Selected work"
          title="Systems built to"
          accent="do real work"
          description="Each one below started as a problem someone actually had. Open a case study for the problem, the approach, and what the model was really doing."
        />

        {/* Featured */}
        <div className="mt-20 space-y-6">
          {featured.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              open={openId === project.id}
              onToggle={() => setOpenId(openId === project.id ? null : project.id)}
              delay={i * 80}
            />
          ))}
        </div>

        {/* More work */}
        {more.length > 0 && (
          <>
            <Reveal delay={120}>
              <h3 className="mt-28 flex items-center gap-6 font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
                Also built
                <span className="h-px flex-1 bg-line" />
              </h3>
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {more.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={featured.length + i} delay={i * 90} />
              ))}
            </div>
          </>
        )}

        <Reveal delay={140}>
          <div className="mt-24 flex flex-col items-start justify-between gap-6 rounded-card border border-line p-9 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-light text-fg">There’s more in the repo</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-dim">
                Smaller tools, experiments, and the messy middle of shipping AI features.
              </p>
            </div>
            <Button as="a" href="https://github.com/" target="_blank" rel="noreferrer noopener" variant="outline">
              <Icon name="github" className="size-4" />
              Browse GitHub
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
