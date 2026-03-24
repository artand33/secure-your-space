# SecureGuard Systems | Email Branding Guide

This guide details the exact style references and best practices to write HTML emails that stay consistent with the SecureGuard Systems dashboard and brand identity.

---

## 🎨 1. Color Palette
Use these exact hex codes for email backgrounds, content framing, titles, and text accent triggers.

| Role | Color | Hex Code | Ideal email usage & logic |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | Orange | `#E8640A` | CTAs, Important highlights, dynamic markers. |
| **Backdrop** | Deep Black | `#0A0A0A` | Outer wrapper template backing (Dark Frame support). |
| **Surface** | Dark Gray | `#1A1A1A` | Main Inner Card Background backing content boards. |
| **Headings** | White | `#FFFFFF` | Core titles with absolute reading clarity. |
| **Muted Meta** | Light Gray | `#9CA3AF` | Subtext labels (e.g., footer footnotes). |
| **Dividers** | Charcoal | `#2E2E2E` | Static layout horizontal breaks dividers. |

---

## 🔠 2. Typography
Email parsers often strip external variables; avoid custom stylesheet bundles. For full layout safety use this standard system stack fallback that renders cleanly everywhere:

*   **Font Family Stack:** 
    `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;`
*   **Default Header Weights:**
    *   **Level 1 Title:** `color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: -0.02em;`
    *   **Simulated Logo Frame:** To replicate the dashboard branding title frame, use:
        `color: #FFFFFF; font-weight: bold; font-style: italic; letter-spacing: -0.01em;`

---

## 🔘 3. Principal UI Components (Safe HTML & CSS Rules)

To render with high stability inside native applets (Outlook, Mail), format standard layout boxes (`<table>`) and **always** style directly on the nested wrappers using inline rules.

### **A. Primary Button Frame (Rounded Capsule CTA)**
Standard capsules in modern email frameworks avoid breaks with simple sizing offsets.

```html
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
  <tr>
    <td style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: bold; text-align: center; background-color: #E8640A; border-radius: 9999px;">
      <a href="{{CTA_URL}}" style="display: inline-block; padding: 12px 32px; color: #FFFFFF; text-decoration: none; border: 1px solid #E8640A; border-radius: 9999px;">
        View App Details
      </a>
    </td>
  </tr>
</table>
```

### **B. Framed Card Layout (Inner Sub-board)**
Mimic dashboard dashboards lists wrappers centering on framing parameters:

```html
<table width="100%" border="0" cellspacing="0" cellpadding="20" style="background-color: #1A1A1A; border: 1px solid #2E2E2E; border-radius: 12px;">
  <tr>
    <td>
      <p style="margin: 0 0 8px 0; font-size: 10px; font-weight: 900; letter-spacing: 0.15em; color: #E8640A; text-transform: uppercase;">
        Notification Update
      </p>
      <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: #FFFFFF;">
        System Verification Received
      </h3>
    </td>
  </tr>
</table>
```

---

## 💡 4. Bulletproof Email Workflow Reminders

1.  **Enforce Inline Rules Style-Locks:** Global classes placed in `<style>` blocks inside `<head>` wrappers will fail over iOS or local parsers. All layout styling must be declared inline directly onto tags (`<td style="...">`).
2.  **Dark Mode Compliance Caveat:** Modern setups handle native full inversions based upon canvas definitions. To guarantee full aesthetic lock on the bright-range contrast layers, you should test bounding light modes centering if templates render muddy in default setups.
3.  **Table Nested Outlines:** Div setups run high failure counts horizontally. Wrap body frame layout bounding in fixed width nodes (standard standard widths: `600px`).
