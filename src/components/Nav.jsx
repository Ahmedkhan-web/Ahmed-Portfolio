import { useEffect, useState } from 'react'
import { navLinks, profile } from '@/data/portfolio'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import Icon from './Icon'
import Button from './ui/Button'

const NAV_IDS = navLinks.map((link) => link.id)

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(NAV_IDS)
  const progress = useScrollProgress()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page behind the mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-pill focus:bg-accent focus:px-5 focus:py-2.5 focus:text-xs focus:font-medium focus:tracking-wider focus:text-bg focus:uppercase"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled || open ? 'border-b border-line bg-bg/85 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <nav className="shell flex items-center justify-between py-6 sm:py-7">
          {/* Wordmark */}
          <a href="#top" className="font-display text-lg font-normal tracking-tight text-fg" onClick={() => setOpen(false)}>
            Ahmed<span className="text-accent">.</span>dev
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`link-underline font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-300 ${
                    active === link.id ? 'link-underline-on text-fg' : 'text-faint hover:text-dim'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button
              as="a"
              href={profile.resumeUrl}
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
              download
            >
              Résumé
            </Button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-pill border border-line text-fg transition-colors duration-300 hover:border-accent-muted hover:text-accent md:hidden"
            >
              <Icon name={open ? 'close' : 'menu'} className="size-5" />
            </button>
          </div>
        </nav>

        {/* Scroll progress */}
        <div className="h-px w-full">
          <div className="h-px origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
        {...(!open && { inert: '' })}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-bg/90 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`relative flex h-full flex-col justify-center gap-2 px-8 transition-all duration-500 ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {navLinks.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-5 border-b border-line/70 py-6 text-[2rem] leading-tight font-light text-fg transition-colors duration-300 hover:text-accent sm:text-[2.4rem]"
              style={{ transitionDelay: `${i * 45}ms` }}
            >
              <span className="font-mono text-[11px] text-accent">0{i + 1}</span>
              {link.label}
            </a>
          ))}

          <Button
            as="a"
            href={profile.resumeUrl}
            variant="outline"
            size="lg"
            className="mt-12 w-full"
            download
          >
            <Icon name="download" className="size-4" />
            Download résumé
          </Button>
        </div>
      </div>
    </>
  )
}
