import { navLinks, socials, profile } from '@/data/portfolio'
import Icon from './Icon'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <a href="#top" className="font-display text-lg font-normal tracking-tight text-fg">
              Ahmed<span className="text-accent">.</span>dev
            </a>
            <p className="mt-5 max-w-xs text-sm leading-[1.8] text-faint">
              Full-stack developer building AI-powered products — from retrieval pipelines to the boring parts that keep
              them online.
            </p>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer">
            <p className="font-mono text-[11px] tracking-[0.16em] text-dim uppercase">Navigate</p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="link-underline text-sm text-faint transition-colors duration-300 hover:text-accent"
                  >
                    <span className="link-underline-on">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Elsewhere */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.16em] text-dim uppercase">Elsewhere</p>
            <ul className="mt-5 space-y-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target={social.icon === 'mail' ? undefined : '_blank'}
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2.5 text-sm text-faint transition-colors duration-300 hover:text-accent"
                  >
                    <Icon name={social.icon} className="size-4" />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col-reverse items-center justify-between gap-5 border-t border-line pt-8 sm:flex-row">
          <p className="text-center text-xs text-faint sm:text-left">
            © {year} {profile.name}. Built from scratch, no templates.
          </p>

          <a
            href="#top"
            className="group inline-flex items-center gap-2.5 rounded-pill border border-line px-5 py-2.5 font-mono text-[11px] tracking-[0.1em] text-dim uppercase transition-colors duration-300 hover:border-accent-muted hover:text-accent"
          >
            Back to top
            <Icon
              name="arrowRight"
              className="size-3.5 -rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
