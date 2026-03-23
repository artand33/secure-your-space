# Calendly Integration Plan

This document outlines the proposed architecture and steps for integrating Calendly as the primary booking mechanics following smooth design alignment without paid Scheduling API pricing tiers.

---

## 📅 A. Recommended Embed Approach
We recommend utilizing the **`react-calendly`** package (or a light client-side wrapper dynamically injecting the Calendly `widget.js` script) rather than raw generic `<iframe>` tags.

### 🌟 Why?
- **Safe State Handling**: Prevents hydration failures or double-rendering bugs natively inside single-page React environments.
- **Parametric Injection triggers**: Native props supporting `prefill`, `pageSettings`, and `styles` seamlessly.
- **Modals Wrapper**: Simple overlay trigger nodes provided elegantly out of the box absolute bounds.

---

## 🛠️ B. Step-by-Step Tasks
- [ ] **Setup Configuration**: Add absolute configuration parameters inside variables files safely.
- [ ] **Component: Inline Embed (`CalendlySection.tsx`)**: Build a section capable of responsive dimensions that hides GDPR boundaries where appropriate overlay maps safely.
- [ ] **Component: Popup Modal (`CalendlyPopup.tsx`)**: Build a fallback trigger capable of full screen overlay execution inside standalone button triggers.
- [ ] **Hook Up Landing Page Triggers**: In `Index.tsx` or `<Hero />` to replace modal Enquiry form absolute mappings triggers supporting Calendly instead.
- [ ] **Prefill Sync testing overlay**: Set temporary fallback defaults logging session mapping details if applicable safely.
- [ ] **Audit/Lighthouse Check**: Ensure `widget.js` script correctly defers absolute loads overlay prior to first paint.

---

## 📂 C. Files & Components to Add / Modify

### 🆕 Add 
| File Path | Description |
| :--- | :--- |
| `src/components/booking/CalendlySection.tsx` | Inline container layout capable of wrapping `<InlineWidget>` triggers responsive overlays. |
| `src/components/booking/CalendlyPopup.tsx` | Popup dialogue wrapping `<PopupWidget>` inside fallback support nodes components. |
| `src/pages/BookCall.tsx` | Standalone Page containing full viewport inline configurations maps triggers. |

### 🛠️ Modify
| File Path | Description |
| :--- | :--- |
| `src/pages/Index.tsx` | Connect `<Hero />` triggers fallback to modal popup execution mechanics instead of standalone forms dialogue when requested. |
| `src/components/sections/Hero.tsx` | Tweak CTA handler to accept generic dispatch handles triggers framing the overlay correctly. |

---

## ⚙️ D. Environment / Configuration Sizing
We will store link limits and layout colors params securely inside standard variables bounds to avoid strictly hardcoded parameters collisions during rollout:

```env
# .env 
VITE_CALENDLY_URL=https://calendly.com/YOUR_ACCOUNT/EVENT_TYPE
VITE_CALENDLY_BG_COLOR=0D0D0D
VITE_CALENDLY_TEXT_COLOR=FFFFFF
VITE_CALENDLY_PRIMARY_COLOR=E8640A
```

---

## ✅ E. QA CheckList 
- [ ] **Mobile & Tablet sizing**: Calendly's absolute inline responsive layouts safely scale inside standard parent overlays container limits bounds.
- [ ] **Cross-Browser Safari layout**: Inspect standard cookie block defaults if the layout blocks rendering, recommending prompt layouts where applicable triggers absolute overlay tests flawlessly.
- [ ] **LightHouse Speed limits verification**: Verify load times score averages above thresholds safely supporting standard deferred setups smoothly.
- [ ] **Prefill validation setup parameter tests**: Setup dummy variables confirming details pass correctly overlay limit parameters flawlessly without bugs.

---

## 🚀 F. Rollout Plan
1. **Local Preview checks setup**: Execute manual inspection confirming responsiveness alignment frames passes review prior to merge layers layout triggers.
2. **Staging Verify checks**: Deploy branch confirm load speed average collision doesn't break metrics benchmarks.
3. **Master Merge rollout**: Enable default absolute trigger fallback.

---

## 🔮 G. Future Upgrades Limits parameters
- **Session Prefiller structures automatic**: Sync with `AuthContext` variables mapping logged-in profile fields details securely overlay triggers without input loops collision bounds.
- **Tracker triggers absolute setups**: Add `onEventscheduled` event trigger setups monitoring layout conversions inside user lands setups safely. 
- **Automatic Webhooks setups updates parameters**: Coordinate backwards backwards updates trigger pipelines supporting database rows writes confirmation inserts triggers flawlessly later.
