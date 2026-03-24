# N8N Webhook Integration Plan

## Objective
Replace current email submission/placeholder flow with an automated **n8n workflow** triggered via a secure Vercel Serverless Function callback, when users answer questions on the security assessment dialog. 

## Context & Improvement
Currently, lead responses inside `CalendlyMultiStepDialog.tsx` either use placeholders or proceed solely to Calendly. 
To ensure **Lead Capture even if building dates are not selected on Calendly**, we suggest triggering the **n8n Webhook immediately upon submitting the assessment questions (Step 2)**, while still transitioning to Calendly (Step 3) for optional scheduling.

---

## 📅 Proposed Workflow

### 1. Vercel Serverless Function (Cors Proxy & Security)
Since making direct calls to n8n webhook URLs from browsers creates **CORS issues** and **exposes environment credentials**, we will create a lightweight Vercel Serverless Function.

*   **File Location:** `/api/send-to-n8n.ts`
*   **Action:** 
    1.  Receive lead data (Name, Email, Property details, Answers).
    2.  Forward payload securely to `process.env.N8N_WEBHOOK_URL`.
    3.  Return a clean JSON response.

### 2. Frontend Updates (`CalendlyMultiStepDialog.tsx`)

#### **A. Add GDPR Compliance Checkbox**
*   **Where:** Place inside **Step 1** or **Step 2** just above the submission button. 
*   **Reasoning:** Name/Email is personal data. Consent must be given before storing or processing it.
*   **Validation:** Enable buttons only when the Checkbox is `checked`.

#### **B. Trigger Webhook Call**
*   When a user completes the questions (currently Step 2), making an API call to `/api/send-to-n8n` before switching state component to Calendly Widget (Step 3).
*   Add loader/feedback so the transition feels smooth and elite.

---

## 🛠️ Step-by-Step implementation

### Step 1: Vercel Serverless API Route
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

### Step 2: Update `CalendlyMultiStepDialog.tsx`
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

## ⚠️ Requirements / Env Variables
Ensure you add to your Vercel Dashboard Settings:
| Variable Name | Value |
| :--- | :--- |
| `N8N_WEBHOOK_URL` | *Your n8n webhook URL address* |

Let me know if you are happy with the plan and when to start the implementation.
