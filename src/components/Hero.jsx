import { profile, heroTerminal, socials, marqueeItems } from '@/data/portfolio'
import { useTypewriter } from '@/hooks/useTypewriter'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import Icon from './Icon'
import Button from './ui/Button'
import Terminal from './ui/Terminal'
import Marquee from './ui/Marquee'
import Reveal from './ui/Reveal'

const STATS = [
  { value: `${profile.yearsExperience}+`, label: 'Years shipping' },
  { value: `${profile.projectsShipped}+`, label: 'Projects live' },
  { value: `${profile.aiSystemsDeployed}`, label: 'AI systems in prod' },
]

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const typed = useTypewriter(profile.taglineRotations, { enabled: !reduced })

  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center pt-28 pb-14 sm:pt-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* ---------------- Left column ---------------- */}
          <div>
            <Reveal>
              <a
                href={profile.availabilityHref}
                className="group inline-flex items-center gap-2.5 rounded-full border border-edge-2 bg-surface/60 py-1.5 pr-4 pl-2 backdrop-blur-sm transition-colors hover:border-accent-500/50"
              >
                <span className="relative grid size-5 place-items-center">
                  <span className="absolute size-2 animate-pulse-ring rounded-full bg-emerald-400" />
                  <span className="size-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-xs text-dim">{profile.availability}</span>
              </a>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-7 font-display text-[2.75rem] leading-[1.03] font-semibold tracking-tight sm:text-6xl lg:text-[4.25rem]">
                <span className="block text-fg">{profile.name}</span>
                <span className="mt-1.5 block text-lg font-normal tracking-tight text-dim sm:text-xl lg:text-2xl">
                  {profile.role}
                </span>
              </h1>
            </Reveal>

            {/* Typewriter tagline */}
            <Reveal delay={160}>
              <p className="mt-7 font-mono text-base text-accent-300 sm:text-lg">
                <span className="select-none text-faint">&gt; </span>
                {profile.tagline}
                <span className="sr-only"> {profile.taglineRotations.join(' ')}</span>
                <span aria-hidden="true" className="text-fg">
                  {reduced ? profile.taglineRotations[0] : typed}
                  <span className="ml-0.5 inline-block h-[1.05em] w-[0.5ch] translate-y-[0.18em] animate-blink bg-accent-400" />
                </span>
              </p>
            </Reveal>

            <Reveal delay={240}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-dim sm:text-lg">{profile.intro}</p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={320}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button as="a" href="#work" size="lg">
                  View Work
                  <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button as="a" href="#contact" variant="outline" size="lg">
                  Contact Me
                </Button>
                <Button as="a" href={profile.resumeUrl} variant="ghost" size="lg" download>
                  <Icon name="download" className="size-4" />
                  Résumé
                </Button>
              </div>
            </Reveal>

            {/* Socials */}
            <Reveal delay={400}>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target={social.icon === 'mail' ? undefined : '_blank'}
                    rel="noreferrer noopener"
                    className="group flex items-center gap-2 text-sm text-faint transition-colors hover:text-accent-300"
                  >
                    <Icon name={social.icon} className="size-[18px] transition-transform duration-300 group-hover:-translate-y-0.5" />
                    <span className="font-mono text-xs">{social.handle}</span>
                  </a>
                ))}
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={480}>
              <dl className="mt-11 grid max-w-lg grid-cols-3 gap-4 border-t border-edge/70 pt-7">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-display text-2xl font-semibold text-gradient sm:text-3xl">{stat.value}</span>
                      <span className="mt-1 block text-xs leading-tight text-faint">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* ---------------- Right column ---------------- */}
          <Reveal delay={200} className="relative">
            {/* Glow pad behind the terminal */}
            <div
              aria-hidden="true"
              className="absolute -inset-8 -z-10 rounded-[2rem] bg-gradient-to-br from-accent-600/22 via-glow/10 to-transparent blur-2xl"
            />
            <Terminal title={heroTerminal.title} lines={heroTerminal.lines} footer={heroTerminal.footer} />

            {/* Floating chips */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6">
              {[
                { icon: 'sparkle', label: 'LLM + RAG systems' },
                { icon: 'terminal', label: 'Full-stack, end to end' },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="glass flex items-center gap-2.5 rounded-lg px-3.5 py-3 text-xs text-dim transition-colors hover:border-accent-500/40 hover:text-fg"
                >
                  <Icon name={chip.icon} className="size-4 shrink-0 text-accent-400" />
                  {chip.label}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Capability marquee */}
      <div className="mt-16 border-y border-edge/50 bg-base-2/40 py-3 sm:mt-20">
        <Marquee items={marqueeItems} />
      </div>
    </section>
  )
}
