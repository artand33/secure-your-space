# n8n Webhook Integration Walkthrough

The integration of the assessment lead capture flow to **n8n** works securely without triggering CORS issues through a Vercel Serverless Function Proxy.

## What has been implemented

### 1) Secure API Endpoint Proxy
Created a Vercel serverless function that forwards the assessment payload to n8n while keeping the real webhook URL server-side:
*   **File:** `/api/send-to-n8n.ts`
*   **HTTP endpoint:** `POST /api/send-to-n8n`
*   **Behavior:** forwards JSON body to `process.env.N8N_WEBHOOK_URL`

### 2) Dialog Flow & GDPR Updates
Updated `src/components/booking/CalendlyMultiStepDialog.tsx`:
*   **State:** `gdprChecked` (consent) and `isSending` (request in-flight)
*   **GDPR checkbox:** displayed in Step 2 and required to proceed
*   **Submission:** clicking “Schedule Call” in Step 2 posts to `/api/send-to-n8n`; on success it proceeds to Step 3 (Calendly `InlineWidget`)

---

## Action items required (you)

### 1) Configure the webhook URL on Vercel
To make it operational in production, set the env var in Vercel:
*   **Key:** `N8N_WEBHOOK_URL`
*   **Value:** your n8n webhook endpoint URL

### 2) Local testing (Vite + Vercel functions)
This repo is a Vite app. If you run only `npm run dev`, the Vercel function route `POST /api/send-to-n8n` is **not** served by Vite.

Recommended local testing path:
*   Put `N8N_WEBHOOK_URL` in `.env.local`
*   Run the site + functions using the Vercel CLI (so `/api/*` exists locally)

Example `.env.local`:
```text
N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-test-hook
```

### 3) What n8n should expect (payload contract)
The frontend currently sends:
*   `name`, `email`
*   `propertyType`, `serviceNeed`, `urgency`
*   `gdprConsent` (boolean)
*   `submittedAt` (ISO string)

Recommendation:
*   In n8n, validate required fields, normalize email, and optionally generate an idempotency key (or accept one from the client) to avoid duplicates on retry.

### 4) Security hardening (recommended)
The Vercel endpoint is public. To reduce spam/abuse:
*   Add server-side schema validation and body size limits
*   Require a shared secret header (e.g. `X-Webhook-Secret`) and verify it in `/api/send-to-n8n.ts`
*   Add rate limiting / WAF rules on Vercel/Edge
