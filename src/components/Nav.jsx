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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? 'border-b border-edge/70 bg-base/80 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
          {/* Wordmark */}
          <a href="#top" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="relative grid size-8 place-items-center rounded-lg border border-accent-500/30 bg-accent-500/10 font-mono text-[13px] font-bold text-accent-300 transition-colors group-hover:border-accent-400/70 group-hover:bg-accent-500/20">
              AK
              <span className="absolute inset-0 animate-pulse-ring rounded-lg border border-accent-400/40" />
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-fg">
              Ahmed<span className="text-accent-400">.</span>dev
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`relative rounded-md px-3.5 py-2 text-sm transition-colors ${
                    active === link.id ? 'text-fg' : 'text-dim hover:text-fg'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-3.5 -bottom-px h-px origin-left bg-gradient-to-r from-accent-400 to-glow transition-transform duration-300 ${
                      active === link.id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <Button as="a" href={profile.resumeUrl} variant="outline" size="sm" className="hidden sm:inline-flex" download>
              <Icon name="download" className="size-4" />
              Résumé
            </Button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-lg border border-edge-2 text-fg transition-colors hover:border-accent-500/50 hover:text-accent-300 md:hidden"
            >
              <Icon name={open ? 'close' : 'menu'} className="size-5" />
            </button>
          </div>
        </nav>

        {/* Scroll progress */}
        <div className="h-px w-full bg-transparent">
          <div
            className="h-px origin-left bg-gradient-to-r from-accent-500 via-glow to-indigo-glow"
            style={{ transform: `scaleX(${progress})` }}
          />
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
          className={`absolute inset-0 bg-base/80 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`relative flex h-full flex-col justify-center gap-1 px-8 transition-all duration-400 ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {navLinks.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 border-b border-edge/60 py-5 font-display text-3xl font-medium text-fg transition-colors hover:text-accent-300"
              style={{ transitionDelay: `${i * 45}ms` }}
            >
              <span className="font-mono text-xs text-faint">0{i + 1}</span>
              {link.label}
            </a>
          ))}

          <Button
            as="a"
            href={profile.resumeUrl}
            variant="outline"
            size="lg"
            className="mt-10 w-full"
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
