# Sentry Setup Guide

**Issue Reference:** [#4](https://github.com/artand33/secure-your-space/issues/4)

## 1. Account & Project Creation
1. Go to [Sentry.io](https://sentry.io/) and sign up/log in.
2. Click **Create Project**.
3. Select **React** as the platform.
4. Set the project name to `secure-your-space`.
5. Click **Create Project**.

## 2. Obtain DSN
1. In your project settings, go to **Client Keys (DSN)**.
2. Copy the **DSN** URL (e.g., `https://example@sentry.io/123`).

## 3. Local Configuration
1. Install the SDK:
   ```bash
   npm install --save @sentry/react
   ```
2. Create or update your `.env.local` file:
   ```env
   VITE_SENTRY_DSN=your_copied_dsn_here
   ```

## 4. Initialization
Add the following to your `src/main.tsx` (before the `root.render` call):

```typescript
import * as Sentry from "@sentry/react";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, 
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

## 5. Verification
Trigger a test error in any component to verify the connection:
```typescript
<button onClick={() => { throw new Error("Sentry Test Error"); }}>
  Test Sentry
</button>
```
