## Frontend implementation plan

This document tracks implementation of the frontend-only improvements brainstormed for the SecureGuard Systems site.  
Work is grouped by theme; each item should link to a PR or commit when completed.

---

## 1. Navigation & information architecture

- [ ] **Sticky top bar improvements**
  - [ ] Add in-page nav items (e.g. `Services`, `Areas`, `Process`, `FAQ`, `Contact`) to the existing sticky bar
  - [ ] Wire each nav item to the correct section `id` and ensure smooth scroll
  - [ ] Ensure layout looks good on desktop (logo + nav + CTA) and on tablet
  - [ ] Verify the sticky bar height is compact enough on small screens
- [ ] **Mobile navigation behavior**
  - [ ] Decide between compact horizontal scrollable pills or a simple menu button for small screens
  - [ ] Implement chosen pattern and test on narrow viewports
  - [ ] Confirm nav is keyboard navigable and all links are reachable via `Tab`
- [ ] **Primary CTA consistency**
  - [ ] Choose a single canonical CTA label (e.g. “Request a Free Security Assessment”)
  - [ ] Update hero, services buttons, and final CTA to use the same primary label where appropriate
  - [ ] Ensure secondary actions (“Call now”, “Email us”) are visually subordinate but clear

---

## 2. Hero section enhancements

- [ ] **Messaging hierarchy**
  - [ ] Refine or add a short 2–3 item list under the hero paragraph highlighting key benefits (e.g. “Same‑day callouts”, “10+ years experience”, “Certified engineers”)
  - [ ] Check that hero copy, sub-list, and button still fit above the fold on common device sizes
- [ ] **Credibility above the fold**
  - [ ] Add a small trust element near the hero (stars, “Trusted by local businesses”, “10+ years in Essex & Suffolk”)
  - [ ] Ensure it does not visually compete with the primary CTA
- [ ] **Mobile typography**
  - [ ] Review heading sizes on very small screens and adjust Tailwind classes if text wraps awkwardly
  - [ ] Verify line height and spacing keep the hero legible and scannable on mobile

---

## 3. Services & content sections

- [ ] **Services cards**
  - [ ] Add “Best for” or similar hints per service card to clarify typical use cases
  - [ ] Consider adding simple meta info per service (e.g. “Install time”, “From £X”, or “Warranty”) and choose which one(s) to surface
  - [ ] Confirm cards still look clean and not overcrowded at all breakpoints
- [ ] **Why Us / Trust / Logistics roles**
  - [ ] Update section headings and subheadings to clearly differentiate:
    - [ ] `WhyUs`: why the company is different (values/approach)
    - [ ] `Trust`: proof/results (photos, stats, badges)
    - [ ] `Logistics`: how it works (steps, areas, who it’s for)
  - [ ] Add one-sentence intros under each `h2` explaining “why this matters” in plain language
- [ ] **Social proof detail**
  - [ ] Enhance each testimonial with more concrete context (e.g. job type, system installed, property type)
  - [ ] Ensure testimonial layout stays readable with the additional text on small screens

---

## 4. Visual design & branding

- [ ] **Warm, trustworthy dark theme**
  - [ ] Experiment with subtle background gradients or variations per section so the page doesn’t feel like a uniform stack of similar blocks
  - [ ] Introduce or confirm a secondary accent color (e.g. blue/green) for “trust” elements distinct from the orange “action” color
  - [ ] Validate color choices against contrast requirements (especially on dark backgrounds)
- [ ] **Section rhythm & variety**
  - [ ] Vary layouts between sections (e.g. image left / text right, full-width background strips) while maintaining visual cohesion
  - [ ] Use spacing and `section-divider` thoughtfully to make boundaries clear without feeling repetitive
- [ ] **Imagery treatment**
  - [ ] Replace current placeholders in `Trust` and related sections with real or representative imagery (or a placeholder style that can be swapped later)
  - [ ] Apply consistent styling to images (border radius, subtle overlay, caption style)

---

## 5. Responsiveness & layout

- [ ] **Grid behavior on small screens**
  - [ ] Review services, testimonials, logistics, and other grid sections on common breakpoints
  - [ ] Adjust gaps and padding so stacked cards do not visually merge
  - [ ] Ensure no important content becomes too narrow or cramped
- [ ] **Sticky bar & viewport usage**
  - [ ] Confirm sticky nav height and spacing are appropriate across breakpoints
  - [ ] Ensure main content is not obscured by the bar and that `scrollIntoView` accounts for the fixed header
- [ ] **Typography & readability**
  - [ ] Audit body copy and small text (`text-sm` uses) on mobile for legibility
  - [ ] Adjust font sizes or line heights where necessary, especially for FAQs and logistics details

---

## 6. Accessibility improvements

- [ ] **Semantic structure**
  - [ ] Verify each major section uses semantic elements (`<section>` with heading and/or `aria-label`)
  - [ ] Ensure in-page nav links reference valid unique `id`s and improve landmark navigation
- [ ] **Focus & keyboard navigation**
  - [ ] Confirm all interactive elements (buttons, links, accordions, nav items) have visible focus states
  - [ ] Ensure focus styles are high contrast and distinguishable from hover-only states
  - [ ] Test full page navigation via keyboard only (Tab/Shift+Tab/Enter/Space)
- [ ] **Reduced motion support**
  - [ ] Update `useScrollAnimation` and animations to respect `prefers-reduced-motion`
  - [ ] Provide a non-animated fallback that shows content immediately when motion is reduced
- [ ] **Icons and color use**
  - [ ] Confirm icons are always accompanied by clear text labels
  - [ ] Avoid relying solely on color to communicate meaning (e.g. muted vs primary text)

---

## 7. Motion, micro-interactions & perceived performance

- [ ] **Scroll animation tuning**
  - [ ] Review animation duration, delay, and easing to keep transitions subtle and responsive
  - [ ] Ensure content is readable even while animating and that animations don’t re-trigger excessively on scroll
- [ ] **Hover and press states**
  - [ ] Add/confirm clear hover and active states for primary CTAs, secondary buttons, and key cards
  - [ ] Keep micro-interactions consistent across components (color shifts, elevation, border changes)
- [ ] **Layout stability**
  - [ ] Avoid layout shifts when content loads or animations trigger
  - [ ] Where future dynamic content is expected, plan container sizes to minimize CLS (cumulative layout shift)

---

## 8. Conversion & contact UX (frontend-only scaffolding)

- [ ] **Guided quote / assessment flow (placeholder)**
  - [ ] Design a simple multi-step “Find the right security solution” flow (questions only, no backend yet)
  - [ ] Implement basic UI for the steps and summary screen, reusing existing UI components where possible
  - [ ] Connect the main CTAs to this flow, or clearly decide when to use the flow vs direct contact
- [ ] **Persistent contact options**
  - [ ] Design a small mobile-friendly bottom bar or similar pattern with primary actions (e.g. “Call”, “Message”, “Assessment”)
  - [ ] Implement it so it appears after scrolling past the hero and does not interfere with content
  - [ ] Confirm accessibility (screen reader labels, focus order, dismiss behavior if needed)
- [ ] **Reassurance microcopy**
  - [ ] Draft copy for reassurance around any contact/quote patterns (response times, no spam, local engineer not call centre)
  - [ ] Place this copy near CTAs and future forms so users see it before committing

---

## 9. QA & polish

- [ ] **Cross-device manual QA**
  - [ ] Test the site on at least one small phone, one large phone, tablet, and desktop viewport
  - [ ] Verify nav, CTAs, and all sections behave as expected across devices
- [ ] **Accessibility smoke test**
  - [ ] Run a quick pass with browser dev tools or a11y extensions for obvious issues (contrast, landmarks, labels)
  - [ ] Fix any low-hanging issues identified
- [ ] **Visual consistency**
  - [ ] Check spacing, border radii, and color usage for consistency across sections and components
  - [ ] Make final small tweaks to ensure the site feels coherent and polished

