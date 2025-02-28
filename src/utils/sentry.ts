import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://73ad3f8180b4d91f9c16c7a975ca1644@o4508062467096576.ingest.de.sentry.io/4508183727571024",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost" /*/^https:\/\/yourserver\.io\/api/*/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
