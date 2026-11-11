# Waseem Akram Portfolio

A personal portfolio for Waseem Akram built with Next.js App Router, React and TypeScript. Includes the navbar and hero inspired by https://toms.framer.media/ and statement/portfolio sections inspired by https://www.awakeagency.dev/.

## Run

`npm install`, then `npm run dev`. Default URL: http://localhost:3006.

## Edit

- `src/data/siteConfig.ts`: identity, text, navigation and ripple settings. Entrance timing is defined in the small hero/navbar stylesheets.
- `src/components/layout/Navbar.tsx`: responsive navigation, email copy and letter-swap CTA.
- `src/components/sections/Hero.tsx`: accessible hero composition and fitted text.
- `src/components/sections/Statement.tsx`: personal introduction with two scroll-driven paragraphs.
- `src/hooks/useStatementAnimation.ts`: GSAP pinning, measured-line 3D transitions and the blueprint drawing timeline.
- `src/components/visuals/StatementDraft.tsx` and `src/lib/statementDraft.ts`: readable vector artwork and responsive placement.
- `src/components/visuals/RipplePortrait.tsx`: lazy-loaded WebGL effect with a static image fallback.
- `src/lib/ripple`: typed renderer and readable GLSL shader source.
- `src/styles`: handwritten styles and responsive rules, no Framer CSS bundle.

The user-provided portrait, Latin Inter Display fonts and the statement's Syne Medium font are stored locally. Source assets belong to their respective owners; confirm usage rights before commercial publication. About and Projects scroll to their sections; GitHub links to Waseem's profile. Hire Me opens `info@wazemtech.com`; the header email also supports clipboard copying. Identity, content and links are editable in `src/data/siteConfig.ts`.

The hero includes the reference's one-second entrance, 150ms delay, matching easing, image zoom, text reveals, alternating letter hover, clipboard feedback, responsive menu and pointer/click water ripples. Reduced motion and unsupported WebGL retain the static portrait.

The hero is exactly `100vh` on every breakpoint. The replacement portrait is loaded as the original PNG for both the image fallback and ripple texture. Its top edge is preserved, including during the entrance zoom. CSS and the ripple shader share the same responsive image position. `cover` still trims lower or side edges when aspect ratios differ; fitting every source pixel would require letterboxing or a differently composed image.

The hero portrait is lifted by `--hero-image-lift` (16-32px) without moving the copy. Explicit layers keep the image at 0, ripple at 1 inside that image layer, hero text at 2 and header at 10. Both name lines use `mix-blend-mode: difference` against the portrait. Their content wrapper deliberately does not create a stacking context, which would block blending with the image.

The statement uses a native sticky viewport with direct scroll scrubbing, `105` / `-105` degree line rotations, `0.12` stagger and `-620px` transform depth. Its separate drawing timeline uses `top 85%`, `+=150%` and direct scrubbing. The section is an unframed full-width band rather than the reference's rounded panel. Typography uses fixed responsive sizes and personal copy rather than reproducing the agency's identity. Reduced-motion users see both paragraphs without pinning or rotation. Responsive changes rebuild measured lines and all observers, splits and triggers are cleaned up on unmount.

The drawing uses actual pixel-space SVG path lengths: construction guides, seeded pencil strokes, bilateral outline tracing, spring-like control points and clipped traced ink have separate reveal windows. Text masks follow measured lines, rather than hiding a single large rectangle. Guides retract over the last 13% while the traced ink remains. `src/lib/statementGeometry.ts` contains the pure geometry/progress helpers; `npm run test:motion` checks those helpers without pretending to be a browser visual test.

## Portfolio Section

`src/components/sections/Portfolio.tsx` is the third section. `src/data/portfolio.ts` holds its four featured projects. These are Awake reference projects, not claims about Waseem's work; their links intentionally open the original case studies. Replace this data and the local thumbnails with Waseem's projects before publication.

`usePortfolioAnimation.ts` implements the reference's scattered desktop positions, `[14, -10, 20, -16]` parallax offsets and pink scroll-following thread. `portfolioGeometry.ts` keeps spline construction and vertical reach sampling independent of React. Below 1440px the cards become two columns; below 768px they become one column. The additional archive list/slider has been removed.

`useProjectImage.ts` and `projectImageShaders.ts` implement pointer-centred liquid image transitions with edge refraction, noise and 1.06 hover zoom. Three.js loads lazily near visible cards. Static Next Image layers remain the fallback for touch, reduced motion and unavailable/lost WebGL. Aeonik Medium is scoped to this section. No reference scripts or compiled stylesheets are injected.

`npm run test:portfolio` checks the pure drawing geometry and local assets. `scripts/download-portfolio-assets.mjs` can refresh the reference assets; review their usage rights before commercial deployment.

The portfolio thread includes the section's bottom spacing in its SVG height and fits its loop reach to the visible section end. Its scroll trigger finishes at `bottom bottom`, so the fourth loop and final tail are fully drawn before Services arrives, including after resize or content-height changes.

## Services Section

`src/components/sections/Services.tsx` follows the Selected Work section at https://mikewilcockdesign.com/ and appears after Projects. The four services, inquiry links and illustrations are editable in `src/data/services.ts`. Product screenshots illustrate service categories and are not presented as Waseem's client projects. Confirm asset/font licensing or replace the demonstration shots before publication.

The section has scoped Archivo variable/Geist Mono fonts, dark reference colours, numbered rows, a sticky 4:5 preview dock and a cursor-following preview that lifts out of and returns to that dock. The row type interpolates from width 88 / weight 700 to width 118 / weight 400. Preview images start cycling after 600ms, change every 1400ms and crossfade for 700ms. The pause control freezes preview cycling. `src/hooks/useServiceAnimation.ts` owns animation cleanup, viewport observation and keyboard/pointer selection; pure timing, easing and selection helpers live in `src/lib/serviceMotion.ts`.

Below 701px the preview becomes a sticky 16:9 stage with three swipeable images and accessible dot controls. Focus selects the service and brings its row into view. Inquiry links open a prefilled email to `info@wazemtech.com`, without pretending there is a backend. Reduced-motion users retain a static image preview; animation work stops when the section leaves the viewport or the tab is hidden. `npm run test:services` checks the pure motion helpers and local asset availability, not browser visual equivalence.

## Process Section

`src/components/sections/Process.tsx` follows Services. Copy is in `src/data/process.ts`: Discovery, Design, Development and Launch. It is a full-width light band with one teal SVG route, Lucide step icons and a moving route marker. There is no duplicate echo or background track. Desktop descriptions alternate around their nodes: Discovery/Development above the curve, Design/Launch below, matching the user's diagram reference.

The inner `.process-screen` uses native `position: sticky; top: 0; height: 100vh`. Its outer section supplies 240vh of extra travel on desktop and 210vh on mobile. The first 16% of travel shows only the title/eyebrow: curve, nodes, descriptions and footer stay hidden. Drawing occupies 16-94%, with the completed graph held for the last 6%. `useProcessAnimation.ts` uses GSAP only to scrub from `top top` to `bottom bottom`, without a second pin spacer. Nodes and copy reveal at their checkpoints and hide again on reverse scroll. Step navigation includes the heading hold in its scroll target.

`src/lib/processGeometry.ts` defines desktop/horizontal and mobile/vertical routes. Geometry is fitted to actual CSS-pixel dimensions, with a normalized `pathLength=1` dash; this avoids the incomplete drawing caused by stretched SVG units and non-scaling strokes. Checkpoints are measured from full path prefixes outside SVG defs. Reduced motion and no-JavaScript fallbacks show the complete diagram without a long sticky scroll. Resize observers, listeners and GSAP contexts are cleaned up on unmount. `npm run test:process` checks curve continuity, one-path structure, pixel-space geometry and forward/reverse reveal state without claiming browser visual validation.

## Continuous landing page

The final contact viewport shares the hero background. Contact copy scrolls upward while the returning portrait and typography enter from below, with no circular reveal, blur or end-of-page strip. Lenis handles the loop natively with continuous scroll momentum; there is no manual scrollTo restart at the seam. Scrubbed animation state is synchronized when coordinates wrap. A dark contact overlay and cream artwork maintain contrast, and the overlay clears during the handoff. The repeated hero has no duplicate IDs and is inert and hidden from assistive technology. Reduced-motion visitors keep a finite contact section with an explicit back-to-start link. Navigation is contained inside each hero and scrolls away with it.

The About scene now uses a native CSS sticky viewport instead of switching to a GSAP fixed pin. Line-only text splitting avoids hundreds of unused character elements. Its text and drawing scrub directly with scroll without a second catch-up timer. Hero ripple rendering pauses on scroll and resumes on pointer interaction.

## Scroll-driven stack orbit

TechStack replaces the dock rows with an EmpireAI-inspired circular composition. All 18 existing technologies orbit a central laptop image; badges counter-rotate to keep labels upright. While visible, the logo ring rotates counterclockwise continuously (90-second revolution) and the central laptop/person image rotates clockwise (120-second revolution). Scroll adds rotation in those same opposing directions. Badge labels counter-rotate to stay upright. The ticker pauses when the stage is offscreen or the tab is hidden, and is removed on unmount. Mobile retains all 18 icons and accessible names; reduced motion renders a static arrangement. The locally stored reference artwork at public/images/stack-orbit.webp comes from https://framerusercontent.com/images/lnMXZC7NL2klAwOjtdsieCm41CA.webp (EmpireAI's integrations section).

Loop stability: scroll refresh only measures Lenis dimensions; it does not reset or emit scroll events. There is no global completion of scrub tweens on coordinate wrapping. The Projects heading scales inside fixed layout space instead of animating font-size and triggering refresh callbacks. Page scroll anchoring is disabled to prevent browser compensation during a cycle.

The returning hero contains no duplicate navbar. Only after the actual loop crossing, the original navbar plays a 900ms slide/drop entrance; its first-visit CSS entrance is unchanged. Initial document loading disables scroll restoration, clears a fragment target and starts at the hero, including refreshes from Contact or other sections.

Hero name geometry is rendered with responsive SVG text, fixed viewBoxes and textLength. The dimensions match the settled Inter Display composition and no longer depend on post-hydration measurement or document.fonts.ready. The local font and accessible HTML heading are retained.

## Products punctuation transition

After the About sentence, its final period migrates diagonally down-left while a separate white viewport enters from below. Once that 100vh screen reaches the top, it stays CSS-sticky for the expansion scroll. A native SVG circle changes cx/cy/r directly, rather than scaling a small composited layer, and fills with #0B2D26 before Projects arrives. The fixed 200vh passage reserves one viewport for entry and one for expansion; no layout heights or scroll positions change during playback. Reverse scrolling restores the period. Reduced motion skips the decorative scene.
