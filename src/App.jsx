import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Experience from './components/Experience.jsx'
import Hero from './components/Hero.jsx'
import NavRail from './components/NavRail.jsx'
import ProfileCard from './components/ProfileCard.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Backdrop from './components/ui/Backdrop.jsx'

/* ---------------------------------------------------------------------------
 *  THE SHELL — what stays put, and what scrolls.
 * ---------------------------------------------------------------------------
 *  Three pieces stay still. One scroller moves. That is the whole architecture:
 *
 *    Backdrop      the background image, `fixed`, so the art never slides
 *    NavRail       the section rail, already `fixed` via .nav-rail
 *    ProfileCard   the left column, `lg:sticky`, so it holds its position
 *    <main>        ordinary content, in ordinary flow, in the one scrollport
 *
 *  THERE IS NO INNER SCROLL CONTAINER, and this is the part worth being blunt
 *  about, because there used to be one. The centre column was given
 *  `overflow-y: auto` inside a shell that was `h-svh overflow: hidden`, so the
 *  document could not scroll and that column was the only thing that could.
 *  (Spelled as declarations rather than class names throughout this comment:
 *  Tailwind reads class-shaped tokens out of comments too, so a class name
 *  written here would keep emitting a utility nobody uses.)
 *
 *  That is a bad trade on every axis that matters to a reader:
 *
 *    - The page's scrollbar belonged to a column, not the page, so the browser's
 *      own scroll affordance — the place people look to see how long a page is,
 *      and the control that works without a pointer — described the wrong thing.
 *    - A wheel gesture only reached the content once the pointer was over the
 *      column. Anywhere else on screen it did nothing at all, so the page felt
 *      broken until you happened to hover the right strip.
 *    - Keyboard paging did the same. The column had to be given `tabIndex` and
 *      focus so that PageDown had something to scroll, which put a focus stop in
 *      the middle of the layout purely to work around the container.
 *    - On a phone it inverts: the inner scroll traps the page gesture, fights
 *      the collapsing address bar, and leaves no scrollbar to drag.
 *
 *  So the document scrolls — one scroller, the browser's own, and every section
 *  in it: Hero, About, Experience, and whatever is added after them. The three
 *  fixed pieces are pinned by CSS instead of by containing the scroll, which is
 *  what lets the content behind them be ordinary page content.
 *
 *  ORDER MATTERS. The backdrop and rail come first so the content paints over
 *  them; the card column comes before <main> so it is the left item in the
 *  desktop flex row.
 * -------------------------------------------------------------------------*/
export default function App() {
  return (
    /* No `bg-base` here, and that is load-bearing rather than tidiness. The
       backdrop is `fixed` at `z-index: -10`, and this element is `position:
       relative` with `z-index: auto` — so it does not form a stacking context,
       and the backdrop is painted into the root one instead. Within that context
       a negative `z-index` child paints *before* this element's own background,
       so an opaque fill here covers the artwork completely. It did: measured over
       the shipped build the image was invisible at every scroll depth, mean
       luminance 6.5/255 flat, identical at 390, 1440 and 1920 wide — the base
       colour and nothing else. Clearing this fill took the same measurement to
       14.7 with 10.5% of the frame lit.

       The base colour is not lost with it: `body` already carries it (see the
       `background-color` in index.css), and the canvas background paints beneath
       everything, including the backdrop. So the page keeps its floor colour and
       the artwork is finally visible under all three sections. */
    <div className="relative">
      <Backdrop />
      <NavRail />

      {/* `flex-col` below `lg`, so the card is the first block in normal flow
          and the sections follow it — which is exactly the mobile layout this
          page had before the shell was introduced, from one DOM node rather than
          two conditionally-rendered copies.

          `pt-14` on phones reserves the height of the fixed mobile top bar, so
          the card begins beneath it rather than under its translucent strip. At
          `lg` the bar is gone and the rail takes over, so the padding is
          dropped. */}
      <div className="mx-auto flex w-full max-w-[1480px] flex-col pt-14 lg:flex-row lg:pt-0 lg:pl-12 lg:pr-[var(--nav-clearance-lg)]">
        {/* ---- The pinned left column -----------------------------------
            `lg:sticky lg:top-0 lg:h-svh lg:items-center` inside a flex row.

            Sticky rather than fixed, deliberately: sticky participates in layout
            and so keeps its own space reserved in the row, which is what stops
            the content column being pushed out by it. `fixed` would have to be
            positioned by hand and would need a matching spacer to keep the row's
            width correct.

            The column is the height of the viewport and the card is centred
            inside it, which is the whole of the centring: a card whose own height
            is not known in CSS cannot be centred by an offset, and the two
            approximations that can be written — `top: 50%` with a -50%
            translate, or a fixed pixel margin — both break. The first puts the
            sticky box half a screen lower than the box it is meant to hold, so
            sticky runs out of travel and the card visibly slides up when the
            reader reaches the end of the page; the second only balances the
            composition at the one card height it was measured at.

            `self-start` stops the default `stretch` from mattering here, and the
            row is as tall as the content beside it, so the column holds for the
            whole length of the page and then travels with the last of it. That is
            the behaviour a fixed column used to be given by a scroll container it
            no longer has.

            The card has its own `max-w-[27rem]` and `lg:w-[var(--card-w)]`
            internally, so the column shrinks to fit it and the content column
            takes the rest.

            ONE card, rendered once. It was briefly rendered twice — once here for
            `lg`, once inside the content column for phones — and that was wrong
            for a reason worth recording: two `<aside aria-label="Profile">`
            landmarks with identical content is a duplicate-landmark failure for
            screen readers, and the hidden copy still answered `querySelector`,
            which is how the portrait-crop check came to measure a `display: none`
            frame as 0x0 and report it as a broken avatar. One node, positioned
            by CSS, cannot fail either way. */}
        {/* Below `lg` the rail is gone, so the card needs no strip reserved on
            its right edge — the page gutters are symmetric now and the card sits
            centred in the full column. At `lg` the padding is dropped because the
            shell's own `lg:pr-[var(--nav-clearance-lg)]` reserves the rail's
            space, and the column becomes a full-height centred box. */}
        <div className="flex shrink-0 justify-center px-5 pt-gutter sm:px-8 lg:sticky lg:top-0 lg:h-svh lg:items-center lg:self-start lg:px-0 lg:pr-0 lg:pt-0 xl:pr-4">
          <ProfileCard />
        </div>

        {/* ---- The content column -----------------------------------------
            Ordinary content. No `overflow`, no fixed height, no `tabIndex`: the
            document scrolls, so a wheel over it, a keyboard page-down, a touch
            drag and the browser's scrollbar all reach it without the reader
            having to click anything first.

            `aria-label` stays. `main` is already a landmark, but a landmark
            holding the whole site needs a name to be worth navigating to. */}
        <main aria-label="Content" className="min-w-0 flex-1">
          <Hero />
          <About />
          {/* Between About and Experience, not after them: the page reads who →
              what the working set is → here it is being used, and each section is
              evidence for the one above it. Placed last, Skills would be a
              summary of the timeline above it — the `stack` on every role is the
              same list of names. */}
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </main>
      </div>
    </div>
  )
}
