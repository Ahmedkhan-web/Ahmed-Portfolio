import { ArrowRight, ExternalLink, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

import { projects } from '@/data/portfolio.js'
import Chip from './ui/Chip.jsx'
import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'

export default function Projects() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!active) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActive(null)
    }

    document.addEventListener('keydown', closeOnEscape)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [active])

  return (
    <section
      id="projects"
      className="relative w-full scroll-mt-gutter px-5 pr-[var(--nav-clearance)] py-rhythm-lg sm:px-8 sm:pr-[var(--nav-clearance)] lg:px-10 lg:pr-10"
    >
      <SectionHeading
        eyebrow={projects.eyebrow}
        lines={projects.headline}
        accentLine={1}
        lede={projects.summary}
        rule
        delay={40}
      />

      <ul className="mx-auto mt-rhythm-lg grid w-full max-w-section gap-4 xl:grid-cols-2">
        {projects.items.map((project, index) => (
          <ProjectBox
            key={project.title}
            project={project}
            index={index}
            onOpen={() => setActive(project)}
          />
        ))}
      </ul>

      {active ? <ProjectModal project={active} onClose={() => setActive(null)} /> : null}
    </section>
  )
}

function ProjectBox({ project, index, onOpen }) {
  const featured = index === 0

  return (
    <Reveal
      as="li"
      delay={300 + index * 90}
      className={`group ${featured ? 'xl:[&:first-child]:col-span-2' : ''}`}
    >
      <article
        className={`relative h-full rounded-[1.55rem] border bg-base-2/48 transition-[border-color,background-color] duration-300 hover:border-accent-400/32 hover:bg-white/[0.035] ${
          featured ? 'border-accent-400/20' : 'border-white/[0.075]'
        }`}
      >
        <button
          type="button"
          onClick={onOpen}
          className={`grid h-full w-full min-w-0 text-left focus:outline-none ${
            featured ? 'xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]' : ''
          }`}
          aria-label={`Open project details for ${project.title}`}
        >
            <span className={`relative block overflow-hidden bg-base-2 ${featured ? 'aspect-[16/9] xl:aspect-auto' : 'aspect-[16/10]'}`}>
            <img
              src={project.image}
              alt={project.imageAlt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transform-none"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/65 via-transparent to-transparent"
            />
            <span className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-base/72 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-accent-200 backdrop-blur-md">
              Details
              <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
            </span>
          </span>

          <span className="flex min-w-0 flex-col p-5 sm:p-6">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/85">
              {project.type} / {project.role}
            </span>
            <span
              data-project-title
              className={`mt-2 block min-w-0 break-words font-display font-semibold leading-tight tracking-[-0.025em] text-fg ${
                featured ? 'text-[1.55rem] sm:text-[1.9rem]' : 'text-[1.22rem]'
              }`}
            >
              {project.title}
            </span>
            <span data-project-description className="mt-3 block max-w-measure text-[0.94rem] leading-[1.65] text-dim">
              {project.summary}
            </span>
            <span className="mt-5 flex flex-wrap gap-1.5">
              {project.stack.slice(0, featured ? 4 : 3).map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </span>
          </span>
        </button>
      </article>
    </Reveal>
  )
}

function ProjectModal({ project, onClose }) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <button
        type="button"
        aria-label="Close project details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-base/78 backdrop-blur-xl"
      />

      <article className="relative grid max-h-[min(90svh,54rem)] w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-[linear-gradient(145deg,rgba(12,18,17,0.96),rgba(5,7,6,0.92))] shadow-[0_34px_120px_-50px_rgba(0,0,0,0.95)] lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)]">
        <div className="relative flex min-h-0 items-center justify-center overflow-hidden bg-base-2">
          <img
            src={project.image}
            alt={project.imageAlt}
            className="max-h-[44svh] w-full object-contain lg:max-h-full"
          />
        </div>

        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/85">
                {project.type} / {project.role}
              </p>
              <h3
                id={titleId}
                className="mt-2 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] text-fg sm:text-[2.2rem]"
              >
                {project.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-dim transition-colors duration-300 hover:border-accent-400/35 hover:text-fg"
            >
              <X aria-hidden="true" className="size-4.5" strokeWidth={1.8} />
            </button>
          </div>

          <p id={descriptionId} className="mt-5 text-[1rem] leading-[1.75] text-dim">
            {project.summary}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/80">
                Category
              </dt>
              <dd className="mt-2 text-[0.95rem] font-medium text-fg">{project.type}</dd>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/80">
                Role
              </dt>
              <dd className="mt-2 text-[0.95rem] font-medium text-fg">{project.role}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/80">
              Stack
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-accent-300 to-accent-500 px-5 text-[0.94rem] font-semibold text-[#04120b] transition-[background-image] duration-300 hover:from-accent-200 hover:to-accent-400"
            >
              View online
              <ExternalLink aria-hidden="true" className="size-[1em]" strokeWidth={1.8} />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] px-5 text-[0.94rem] font-medium text-fg transition-colors duration-300 hover:border-accent-400/35 hover:text-accent-200"
            >
              Back to projects
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
