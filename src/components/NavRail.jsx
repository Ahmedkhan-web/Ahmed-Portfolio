import { useEffect, useState } from 'react'
import { navItems } from '../data/portfolio'

export default function NavRail() {
  /* Seeded with the first item's id, not a literal. The old 'home' default
     matched no id at all — every link went inactive until the first observer
     callback landed, which is a visible flash on load. */
  const [active, setActive] = useState(() => navItems[0]?.id ?? '')

  /* Highlights whichever section owns the middle of the viewport.
   *
      Sections that do not exist yet are filtered out, so the rail never sets an
      active state for a target that is not on the page.

      `root` is left null, which means the viewport — the correct root now that
      the document is the only scrollport. It used to name the centre scroll
      column, and had to: that column was the scroller at `lg`, so measuring
      against the viewport would have found every section occupying the same
      rect at once and flickered the highlight between them on each frame.

      With one scroller there is nothing to choose between. The `-45%` band leaves
      the middle tenth of the viewport, so the highlight belongs to whichever
      section is actually being read rather than to the one that merely started
      scrolling out of view.

      No resize listener any more: the answer no longer depends on the layout.
      Whether the page scrolls in a column or in the document, `root: null` is
      right, so crossing `lg` changes nothing about this observer. */
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

  return (
    <nav aria-label="Primary" className="nav-rail">
      <ul className="glass-rail flex flex-col items-center gap-0.5 rounded-full border border-edge/80 p-1 shadow-xl lg:gap-1 lg:p-2.5">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'page' : undefined}
              title={item.label}
              data-active={active === item.id}
              className="group relative grid size-8 place-items-center rounded-full text-dim transition-colors hover:bg-white/5 hover:text-fg lg:size-10"
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
  )
}