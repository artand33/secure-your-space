# n8n Webhook Integration Walkthrough

The integration of the assessment lead capture flow to **n8n** works securely without triggering CORS issues through a Vercel Serverless Function Proxy.

## 🚀 What has been implemented 

### 1. **Secure API Endpoint Proxy**
Created a new Vercel serverless helper script to safely route requests to n8n while hiding credentials:
*   📁 **File:** `/api/send-to-n8n.ts`
*   **Behavior:** Forwards JSON data from questions to `process.env.N8N_WEBHOOK_URL` securely.

### 2. **Dialog Flow & GDPR updates**
Modified variables in `src/components/booking/CalendlyMultiStepDialog.tsx`:
*   **State Helpers:** Added lead states for tracking GDPR consent status `gdprChecked` and webhook submission feedback `isSending`.
*   **GDPR Checkbox:** Loaded before Proceeding/Submitting in **Step 2** right above buttons row. It requires users to consent to data storage explicitly.
*   **Async Trigger Integration:** When clicking "**Schedule Call**" inside Step 2, a fetch triggers to `/api/send-to-n8n`. On success, the container renders Step 3 (Calendly InlineWidget).

---

## 🔧 Action Items Required (You)

To make it fully operational, add the webhook address endpoint to your setup:

### **On your Vercel Dashboard Settings**
Go to Settings ➔ Environment Variables and append:

*   **Key:** `N8N_WEBHOOK_URL`
*   **Value:** *Your secure n8n webhook endpoint URL*

### **Local testing**
To replicate environment variables locally adding them to `.env.local`:
```text
N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-test-hook
```

Let me know if you would like me to refine any validation layouts!
