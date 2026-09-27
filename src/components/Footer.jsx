import { navLinks, socials, profile } from '@/data/portfolio'
import Icon from './Icon'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-edge/70 bg-base-2/50">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <a href="#top" className="group inline-flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg border border-accent-500/30 bg-accent-500/10 font-mono text-[13px] font-bold text-accent-300 transition-colors group-hover:border-accent-400/70">
                AK
              </span>
              <span className="font-display text-[15px] font-semibold text-fg">
                Ahmed<span className="text-accent-400">.</span>dev
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-faint">
              Full-stack developer building AI-powered products — from retrieval pipelines to the boring parts that keep
              them online.
            </p>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer">
            <p className="font-mono text-[11px] tracking-[0.18em] text-dim uppercase">Navigate</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="group inline-flex items-center gap-1.5 text-sm text-faint transition-colors hover:text-accent-300"
                  >
                    <span className="h-px w-0 bg-accent-400 transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Elsewhere */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-dim uppercase">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target={social.icon === 'mail' ? undefined : '_blank'}
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-accent-300"
                  >
                    <Icon
                      name={social.icon}
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                    />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized wordmark, clipped by the footer edge */}
        <p
          aria-hidden="true"
          className="pointer-events-none mt-14 -mb-4 select-none text-center font-display text-[17vw] leading-none font-bold text-transparent opacity-[0.07] sm:-mb-6"
          style={{ WebkitTextStroke: '1px var(--color-accent-400)' }}
        >
          AHMED KHAN
        </p>

        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-edge/60 pt-7 sm:flex-row">
          <p className="text-center text-xs text-faint sm:text-left">
            © {year} {profile.name}. Built from scratch, no templates.
          </p>

          <a
            href="#top"
            className="group inline-flex items-center gap-2 rounded-lg border border-edge-2 px-3.5 py-2 font-mono text-[11px] text-dim transition-colors hover:border-accent-500/50 hover:text-accent-300"
          >
            Back to top
            <Icon name="chevronDown" className="size-3.5 rotate-180 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
