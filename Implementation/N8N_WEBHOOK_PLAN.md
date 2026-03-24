# N8N Webhook Integration Plan

## Objective
Replace the current email/placeholder flow with an automated **n8n workflow** triggered via a secure **Vercel Serverless Function** when users submit the security assessment dialog.

## Context & Improvement
Currently, lead responses inside `CalendlyMultiStepDialog.tsx` either use placeholders or proceed solely to Calendly. 
To ensure **Lead Capture even if building dates are not selected on Calendly**, we suggest triggering the **n8n Webhook immediately upon submitting the assessment questions (Step 2)**, while still transitioning to Calendly (Step 3) for optional scheduling.

---

## Proposed Flow

### 1) Vercel Serverless Function (CORS Proxy + Secret Handling)
Direct browser calls to n8n webhook URLs can create **CORS issues** and may leak the webhook URL. Instead we send leads to a first-party endpoint hosted on Vercel, which then forwards to n8n using server-side env vars.

*   **File Location:** `/api/send-to-n8n.ts`
*   **Action:** 
    1.  Receive lead data (Name, Email, Property details, Answers).
    2.  Forward payload securely to `process.env.N8N_WEBHOOK_URL`.
    3.  Return a clean JSON response.

### 2) Frontend Updates (`src/components/booking/CalendlyMultiStepDialog.tsx`)

#### A) GDPR Consent Checkbox
*   **Where:** Step 2, just above the submit/proceed buttons.
*   **Why:** Name + email are personal data; consent must be explicit before processing.
*   **UX requirement:** Disable the submit/proceed CTA until consent is checked.
*   **Copy recommendation:** Add a link to your Privacy Policy (and optionally a retention period and contact email).

#### B) Trigger Webhook Call
*   When a user completes Step 2, POST to `/api/send-to-n8n` and include `gdprConsent: true` and a timestamp (`submittedAt`).
*   Add clear loading feedback while the request is in-flight.

#### C) Decide Failure Behavior (Product Decision)
Choose one and keep it consistent:
*   **Fail-closed:** Do not proceed to Calendly unless lead capture succeeds (strict, current behavior).
*   **Fail-open:** Still proceed to Calendly even if n8n fails, but show a warning and log the error (best conversion, but risk of losing leads).

---

## Implementation Notes

### 1) Vercel Serverless API Route
```typescript
// /api/send-to-n8n.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Webhook URL not configured on Vercel' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) throw new Error('Failed to send to n8n');

    return res.status(200).json({ success: true, message: 'Lead recorded' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Error' });
  }
}
```

### 2) Update the Dialog Component
1.  **Introduce state:** `const [gdprChecked, setGdprChecked] = useState(false);` and `const [sending, setSending] = useState(false);`
2.  **Add Checkbox UI:** Using Radix UI Checkbox or shadcn components.
3.  **Create submission handler:**
    ```typescript
    const triggerWebhook = async () => {
       setSending(true);
       try {
          await fetch('/api/send-to-n8n', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(formData)
          });
          setStep(3); // proceed to calendly
       } catch (e) {
          toast.error("Failed to submit details.");
       } finally {
          setSending(false);
       }
    };
    ```

---

## Requirements / Environment Variables
Set this in Vercel → Settings → Environment Variables:
*   `N8N_WEBHOOK_URL`: your n8n webhook URL (the **real** endpoint)

### Local development (important for Vite projects)
This project uses Vite. The `/api/*` route exists on Vercel, but **won’t exist** if you only run `npm run dev`.
To test end-to-end locally, run via the Vercel CLI (recommended) or add an explicit dev proxy.

### Security hardening (recommended)
Even though the webhook URL is stored server-side, the endpoint is still public:
*   **Validate payload** server-side (schema + size limits).
*   **Require a shared secret** (e.g., `X-Webhook-Secret`) to prevent spam.
*   **Rate limit** to reduce bot abuse.

Let me know if you are happy with the plan and when to start the implementation.
