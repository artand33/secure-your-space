

# Security Systems Website — Implementation Plan

## Overview
A single-page, high-conversion security systems website with a dark, trust-driven aesthetic. Orange (#FF6B00) accent on near-black (#0A0A0A) base. Mobile-first, fast-loading, focused on driving "Request a Free Security Assessment" consultation requests.

## Sections (top to bottom)

### 1. Hero
- Bold outcome-driven headline (e.g., "Professional Security Systems You Can Rely On")
- Subtitle mentioning Retail, Residential, Commercial coverage
- One supporting line about local, certified installers
- Primary orange CTA: "Request a Free Security Assessment"
- Subtle dark gradient background with slight glow on CTA

### 2. Services
- 4 large cards on dark grey backgrounds with orange accent tags
- **Access Control**, **CCTV Installation**, **Intercom Systems**, **Intruder Alarms**
- Each card: icon, title, short description, Retail/Residential/Commercial tags, inquiry CTA
- Hover glow effect on cards

### 3. Why Us
- 2-3 differentiators in clean icon + text layout
- Local & fast response, certified engineers, tailored solutions
- Minimal, no clutter

### 4. Trust / About
- Company profile section with placeholder for team/founder photo
- 3 credibility bullets (years experience, certifications, response time)
- Placeholder areas for installation imagery

### 5. Social Proof
- 3-4 short testimonials (1-2 lines each) with first name + property/business type
- Placeholder images for completed installation photos

### 6. Logistics
- Areas covered displayed as clean tags/badges (Basildon through Witham)
- Properties covered: Retail, Residential, Commercial
- Installation process steps (visual timeline/stepper)
- Average installation times, aftercare info, who it's for

### 7. FAQ
- Accordion-style FAQ with 4-5 common questions
- Clean, expandable layout

### 8. Final CTA
- Strong closing headline + one reassurance line
- Orange CTA button: "Request a Free Security Assessment"
- Phone number and email displayed below
- Subtle gradient background

## Design System
- **Background**: #0A0A0A (near black)
- **Cards**: #1A1A1A dark grey
- **Accent**: #FF6B00 (orange) — CTAs, tags, highlights only
- **Text**: White headlines, #A0A0A0 light grey body
- **Typography**: Bold heavy headlines, clean readable body
- **Effects**: Scroll-triggered entrance animations, hover glows on cards/buttons
- **Orange divider lines** between major sections

## Technical Approach
- Single page with smooth scroll navigation
- Intersection Observer for scroll animations
- Fully responsive, mobile-first
- All CTA buttons scroll to or open a consultation request form/modal
- No backend needed — CTA can link to a form section or mailto/tel for now

