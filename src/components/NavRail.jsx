import { ChevronRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { navItems } from '../data/portfolio'

/* ---------------------------------------------------------------------------
 *  NAVIGATION — a rail on desktop, a top bar with a menu on phones.
 * ---------------------------------------------------------------------------
 *  One component, two presentations, and exactly one `aria-label="Primary"`
 *  landmark between them at any moment:
 *
 *    - from `lg` up, the vertical rail pinned to the right edge, unchanged;
 *    - below `lg`, the rail is hidden and a compact top bar carries a menu
 *      button. Tapping it opens a panel with the same sections, so the phone
 *      gets the same destinations in a touch-sized list instead of a strip of
 *      icons too small to hit.
 *
 *  The active section is shared by both: one observer, one `active` value.
 * -------------------------------------------------------------------------*/
export default function NavRail() {
  /* Seeded with the first item's id, not a literal. The old 'home' default
     matched no id at all — every link went inactive until the first observer
     callback landed, which is a visible flash on load. */
  const [active, setActive] = useState(() => navItems[0]?.id ?? '')
  const [menuOpen, setMenuOpen] = useState(false)

  /* Highlights whichever section owns the middle of the viewport. `root` is
     left null — the viewport — because the document is the only scrollport. */
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { root: null, rootMargin: '-45% 0px -45% 0px' },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  /* The mobile menu: Escape closes it, and while it is open the page behind it
     is locked so a touch drag moves the menu rather than the document. */
  useEffect(() => {
    if (!menuOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  return (
    <>
      {/* ---- Mobile top bar ------------------------------------------------
          Fixed, `lg:hidden`. The shell reserves its height with a `pt-14`, so
          the profile card starts below it rather than under it. The brand mark
          is here purely so the bar has a left anchor; the name is otherwise
          the card's. */}
      <header className="fixed inset-x-0 top-0 z-50 lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 border-b border-white/[0.06] bg-base/70 px-5 backdrop-blur-xl">
          <a
            href="#hero"
            className="font-display text-[1.05rem] font-semibold tracking-[-0.02em] text-fg"
          >
            Ahmed Khan<span className="text-accent-400">.</span>
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            className="grid size-10 place-items-center rounded-full border border-white/[0.09] bg-white/[0.04] text-fg transition-colors duration-300 hover:border-accent-400/35 hover:text-accent-200"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.8} />
            ) : (
              <Menu aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </header>

      {/* ---- Mobile menu panel ---------------------------------------------
          Rendered only while open, so the links are out of the accessibility
          tree and the tab order the rest of the time — and so the page never
          has two "Experience" links for a screen reader to choose between. */}
      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 cursor-default bg-base/80 backdrop-blur-xl [animation:nav-fade_200ms_ease-out]"
          />
          <nav aria-label="Mobile" className="absolute inset-x-3 top-[4.25rem]">
            <ul className="grid gap-1 rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(12,18,17,0.98),rgba(5,7,6,0.96))] p-2.5 shadow-[0_34px_120px_-50px_rgba(0,0,0,0.95)] [animation:nav-pop_260ms_var(--ease-out-expo)]">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active === item.id ? 'page' : undefined}
                    data-active={active === item.id}
                    className="flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-[1.02rem] font-medium text-dim transition-colors duration-300 hover:bg-white/[0.05] hover:text-fg data-[active=true]:bg-accent-400/[0.1] data-[active=true]:text-accent-200"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-accent-300">
                      <item.icon aria-hidden="true" strokeWidth={1.6} className="size-[1.05rem]" />
                    </span>
                    {item.label}
                    <ChevronRight
                      aria-hidden="true"
                      className="ml-auto size-4 text-faint"
                      strokeWidth={1.7}
                    />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2.5 flex h-12 items-center justify-center rounded-full bg-gradient-to-b from-accent-300 to-accent-500 text-[0.96rem] font-semibold text-[#04120b] transition-[background-image] duration-300 hover:from-accent-200 hover:to-accent-400"
            >
              Hire Me
            </a>
          </nav>
        </div>
      ) : null}

      {/* ---- Desktop rail --------------------------------------------------
          `hidden lg:block` is the whole difference: the fixed rail is present
          in the DOM at every size (so the shell and the checks can rely on it)
          but only painted from `lg` up, where the menu bar steps aside. */}
      <nav aria-label="Primary" className="nav-rail hidden lg:block">
        <ul className="glass-rail flex flex-col items-center gap-1 rounded-full border border-edge/80 p-1.5 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.9)] lg:gap-1.5 lg:p-2.5">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-label={item.label}
                aria-current={active === item.id ? 'page' : undefined}
                title={item.label}
                data-active={active === item.id}
                className="group relative grid size-8 place-items-center rounded-full text-dim transition-[background-color,color,box-shadow] duration-300 hover:bg-white/[0.06] hover:text-fg data-[active=true]:bg-accent-400/[0.13] data-[active=true]:text-accent-200 data-[active=true]:shadow-[inset_0_0_0_1px_rgba(52,211,153,0.13)] lg:size-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full bg-accent-400/20 opacity-0 blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 lg:size-8"
                />
                {/* `strokeWidth` is set explicitly rather than left at Lucide's default of 2.
                    The social marks are filled brand glyphs, so they have no stroke to
                    match — this is about the rail against the card's own line icons, which
                    are 1.5. One outline system on the page should share one weight. */}
                <item.icon
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="relative size-4 transition-[color,transform] duration-300 group-hover:scale-110 group-data-[active=true]:text-accent-300 lg:size-[1.15rem]"
                />
                <span className="pointer-events-none absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-lg border border-edge bg-base-2/95 px-2.5 py-1 text-xs text-fg opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 lg:flex">
                  {item.label}
                  <span aria-hidden="true" className="absolute right-full top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-b border-l border-edge bg-base-2/95" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
