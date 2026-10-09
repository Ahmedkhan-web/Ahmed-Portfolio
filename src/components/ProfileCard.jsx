import { ArrowRight } from 'lucide-react'

import { metaIcon, profile, socials } from '@/data/portfolio.js'
import BrandIcon from './BrandIcon.jsx'
import Button from './ui/Button.jsx'
import Reveal from './ui/Reveal.jsx'

/* ---------------------------------------------------------------------------
 *  Meta rows. `icon` keys resolve against `metaIcon` in the data file.
 * -------------------------------------------------------------------------*/
const META = [
  { icon: 'email', key: 'email', link: true },
  { icon: 'location', key: 'location' },
  { icon: 'work', key: 'work' },
]

export default function ProfileCard() {
  return (
    <Reveal
      as="aside"
      delay={0}
      y={28}
      aria-label="Profile"
      /* Capped rather than viewport-scaled so the card never outgrows a tablet,
         and a fixed rem width from `lg` up (see `--card-w`) so its height stays
         predictable — which is what lets the shell centre it on the viewport. */
      className="w-full max-w-[27rem] lg:w-[var(--card-w)] lg:max-w-none lg:shrink-0"
    >
      <div className="glass-panel relative overflow-hidden rounded-[22px] border border-white/[0.07] p-4 shadow-[0_36px_90px_-40px_rgba(0,0,0,0.95)] sm:p-5 lg:rounded-[26px] lg:p-6">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-44 rounded-full bg-accent-400/[0.08] blur-3xl"
        />
        {/* ---- Identity header -------------------------------------------
            Phones lay it on its side — circle beside the name — because a
            stacked card is far taller than a phone needs. From `lg` the card
            goes upright and centred, which is what a circular portrait wants:
            a circle has no edges to bleed into, so centring it above the name
            is the only arrangement that reads as deliberate. */}
        <div className="flex items-center gap-4 lg:flex-col lg:gap-0">
          {/* ---- Avatar ---------------------------------------------------
              Square frame, `rounded-full`, sized in fixed rem at every
              breakpoint so the portrait is identical on a 360px phone and a
              1920px desktop.

              Two stacked copies of the photograph. The sharp one is the portrait
              and carries the alt text; the blurred one is decorative and sits
              behind it. The photograph is 768x850 — taller than the square
              frame — so `contain` leaves a few percent of height unused at the
              top and bottom. The blurred copy fills exactly that remainder, so
              the circle shows the complete photograph with no empty band and,
              critically, with nothing cropped. */}
          <div
            className="group/portrait relative size-[var(--avatar)] shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.09] lg:size-[var(--avatar-lg)]"
            style={{ boxShadow: '0 18px 40px -18px rgba(0,0,0,0.85)' }}
          >
            <img
              src={profile.portrait}
              alt=""
              aria-hidden="true"
              /* Same URL as the portrait below, so this costs no extra request —
                 just no high-priority hint either, since it is decoration and
                 the sharp copy is the one that has to arrive first. */
              width={768}
              height={850}
              decoding="async"
              className="absolute inset-0 scale-[1.3] object-cover blur-xl"
            />
            <img
              src={profile.portrait}
              alt={profile.portraitAlt}
              width={768}
              height={850}
              fetchPriority="high"
              decoding="async"
              className="avatar-frame absolute inset-0 size-full object-contain transition-transform duration-700 ease-out group-hover/portrait:scale-[1.04] motion-reduce:transform-none"
            />

            {/* Emerald rim, brightest along the top edge, so the circle reads
                as lit from the same direction as the fill on the buttons. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(160deg,rgba(110,231,183,0.28),transparent_46%)]"
            />
          </div>

          {/* ---- Availability + name -----------------------------------
              The name is the largest type in the card and the only thing here
              set in the display face: it is read at a glance from across a room,
              so it is given the size and the tracking the headline uses. */}
          <div className="min-w-0 flex-1 text-left lg:mt-4 lg:flex lg:w-full lg:flex-col lg:items-center lg:text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/20 bg-accent-400/[0.07] px-3 py-1 text-[11.5px] font-medium tracking-wide text-accent-200">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-[status-pulse_2.6s_ease-out_infinite] rounded-full bg-accent-400 opacity-55" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent-400" />
              </span>
              {profile.status}
            </span>

            <h2 className="mt-2.5 font-display text-[1.5rem] font-semibold leading-[1.08] tracking-[-0.025em] text-fg lg:text-[1.72rem]">
              {profile.name}
            </h2>
            <p className="mt-1.5 text-[0.94rem] leading-snug text-dim lg:text-[1rem]">
              {profile.role} <span className="text-accent-400">{profile.roleAccent}</span>
            </p>
          </div>
        </div>

        {/* ---- Hairline divider ----------------------------------------- */}
        <div
          aria-hidden="true"
          className="my-4 h-px w-full bg-gradient-to-r from-transparent via-edge-2 to-transparent"
        />

        {/* ---- Contact details ------------------------------------------
            Every string here is Ahmed's own, so the list is a fixed three.
            One step up from the size these started at: this is the card's body
            copy, and at the width the card now holds, one more pixel of size is
            the difference between a value that reads as information and one that
            reads as a label. */}
        <ul className="space-y-2.5">
          {META.map(({ icon, key, link }) => {
            const Icon = metaIcon[icon]
            const value = profile[key]
            const body = <span className="text-[0.92rem] leading-snug lg:text-[0.94rem]">{value}</span>

            return (
              <li key={key} className="flex items-start gap-2.5">
                <Icon className="mt-[3px] size-4 shrink-0 text-faint" strokeWidth={1.5} aria-hidden="true" />
                {link ? (
                  <a
                    href={`mailto:${value}`}
                    className="min-w-0 text-dim transition-colors duration-300 hover:text-fg"
                  >
                    {body}
                  </a>
                ) : (
                  <span className="min-w-0 text-dim">{body}</span>
                )}
              </li>
            )
          })}
        </ul>

        {/* ---- Socials ---------------------------------------------------
            `url` is empty until Ahmed adds his real profile links. An <a>
            without an href is inert and not focusable, so there are no dead
            links — the icon simply isn't a link yet.

            `justify-center` because everything else in the card's header is
            centred from `lg` up: with the row left-aligned the four chips
            hung off one side and the card had a visible imbalance against its
            own avatar and name. The row is centred at every width, so the gap
            either side of it is the same.

            Like the CTAs, the chips are still on hover — the border, the fill
            and the glyph change colour, nothing shifts.

            The two treatments are deliberately close so a placeholder does not
            read as broken, and deliberately not identical so an unlinked chip
            cannot be mistaken for a live one: a placeholder has no tinted fill
            and a dimmer glyph, and says so on hover. */}
        <ul aria-label="Social profiles" className="mt-4 flex items-center justify-center gap-2.5">
          {socials.map(({ label, icon, url }) =>
            url ? (
              <li key={label}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-white/[0.07] bg-white/[0.02] text-dim transition-[border-color,background-color,color,box-shadow] duration-300 ease-out hover:border-accent-400/50 hover:bg-accent-400/[0.08] hover:text-accent-300 hover:shadow-[0_10px_26px_-12px_rgba(52,211,153,0.55)]"
                >
                  <BrandIcon name={icon} className="size-[18px]" />
                </a>
              </li>
            ) : (
              <li key={label}>
                <span
                  aria-label={`${label} — link not yet added`}
                  title={`TODO: add your ${label} URL in src/data/portfolio.js`}
                  className="grid size-10 place-items-center rounded-full border border-white/[0.05] bg-white/[0.015] text-faint"
                >
                  <BrandIcon name={icon} className="size-[18px]" />
                </span>
              </li>
            ),
          )}
        </ul>

        {/* ---- Primary action -------------------------------------------- */}
        <div className="mt-4">
          <Button
            href="#contact"
            variant="primary"
            size="md"
            spread
            iconEnd={ArrowRight}
            aria-label={`${profile.hireMeLabel} - open contact section`}
          >
            {profile.hireMeLabel}
          </Button>
        </div>
      </div>
    </Reveal>
  )
}
