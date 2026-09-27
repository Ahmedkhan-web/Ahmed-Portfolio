import { profile, socials, marqueeItems } from '@/data/portfolio'
import { useTypewriter } from '@/hooks/useTypewriter'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import Icon from './Icon'
import Button from './ui/Button'
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
    <section id="top" className="relative flex min-h-svh flex-col justify-center pt-36 pb-16 sm:pt-40">
      <div className="shell">
        <div className="mx-auto max-w-4xl text-center">
          {/* ---------------- Availability ---------------- */}
          <Reveal>
            <a
              href={profile.availabilityHref}
              className="group inline-flex items-center gap-2.5 rounded-pill border border-line px-4 py-2 transition-colors duration-300 hover:border-accent-muted"
            >
              <span className="relative grid size-4 place-items-center">
                <span className="absolute size-2 animate-pulse-ring rounded-full bg-accent" />
                <span className="size-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] text-dim uppercase">{profile.availability}</span>
            </a>
          </Reveal>

          {/* ---------------- Name ---------------- */}
          <Reveal delay={80}>
            <h1 className="mt-9 text-[3.4rem] leading-[0.98] font-light tracking-[-0.035em] text-fg sm:text-[5rem] lg:text-[7rem]">
              {profile.name}
            </h1>
          </Reveal>

          {/* ---------------- Role ---------------- */}
          <Reveal delay={160}>
            <p className="mt-5 text-lg font-light text-accent sm:text-xl lg:text-2xl">{profile.role}</p>
          </Reveal>

          {/* ---------------- Typewriter tagline ---------------- */}
          <Reveal delay={240}>
            <p className="mt-9 font-mono text-[13px] text-dim sm:text-sm">
              <span className="select-none text-accent-muted">&gt; </span>
              <span className="sr-only"> {profile.taglineRotations.join(' ')}</span>
              <span aria-hidden="true">
                {reduced ? profile.taglineRotations[0] : typed}
                <span className="ml-1 inline-block h-[1.05em] w-[0.5ch] translate-y-[0.16em] animate-blink bg-accent" />
              </span>
            </p>
          </Reveal>

          {/* ---------------- Intro ---------------- */}
          <Reveal delay={320}>
            <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-[1.85] text-dim sm:text-[17px]">{profile.intro}</p>
          </Reveal>

          {/* ---------------- CTAs ---------------- */}
          <Reveal delay={400}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3.5">
              <Button as="a" href="#work" size="lg">
                View work
                <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button as="a" href="#contact" variant="outline" size="lg">
                Get in touch
              </Button>
              <Button as="a" href={profile.resumeUrl} variant="ghost" size="lg" download>
                <Icon name="download" className="size-4" />
                Résumé
              </Button>
            </div>
          </Reveal>

          {/* ---------------- Socials ---------------- */}
          <Reveal delay={480}>
            <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target={social.icon === 'mail' ? undefined : '_blank'}
                    rel="noreferrer noopener"
                    className="link-underline group inline-flex items-center gap-2 font-mono text-xs text-faint transition-colors duration-300 hover:text-accent"
                  >
                    <Icon
                      name={social.icon}
                      className="size-[15px] transition-colors duration-300 group-hover:text-accent"
                    />
                    <span className="link-underline-on">{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ---------------- Stats ---------------- */}
          <Reveal delay={560}>
            <dl className="mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-6 border-t border-line pt-12">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-light text-fg sm:text-4xl">{stat.value}</span>
                    <span className="mt-2 block text-[11px] leading-tight tracking-wide text-faint uppercase">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* ---------------- Capability marquee ---------------- */}
      <div className="mt-28 border-y border-line/70 py-5">
        <Marquee items={marqueeItems} />
      </div>
    </section>
  )
}
