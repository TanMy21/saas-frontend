import { useEffect } from "react";

import * as Sentry from "@sentry/react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

import {
  sanitizeTelemetryText,
  sanitizeTelemetryUrl,
} from "./sanitizeTelemetryUrl";

const sanitizeTelemetryValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return sanitizeTelemetryText(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeTelemetryValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sanitizeTelemetryValue(nestedValue),
      ]),
    );
  }

  return value;
};

Sentry.init({
  dsn: "https://73ad3f8180b4d91f9c16c7a975ca1644@o4508062467096576.ingest.de.sentry.io/4508183727571024",
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  // Tracing
  tracesSampleRate: 0.5, //  Capture 50% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost" /*/^https:\/\/yourserver\.io\/api/*/],
  // Session Replay
  replaysSessionSampleRate: import.meta.env.PROD ? 0 : 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  beforeSendTransaction(event) {
    return sanitizeTelemetryValue(event) as typeof event;
  },

  beforeSendSpan(span) {
    return sanitizeTelemetryValue(span) as typeof span;
  },

  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers.Authorization;
      delete event.request.headers.authorization;
      delete event.request.headers.Cookie;
      delete event.request.headers.cookie;
    }

    if (event.request?.data) {
      event.request.data = "[Filtered]";
    }

    if (event.request?.url) {
      event.request.url = sanitizeTelemetryUrl(event.request.url);
    }

    if (
      typeof event.request?.query_string === "string" &&
      /(code|token|verificationCode|resetToken|inviteToken|accessToken|refreshToken)=/i.test(
        event.request.query_string,
      )
    ) {
      event.request.query_string = "[Filtered]";
    }

    return sanitizeTelemetryValue(event) as typeof event;
  },
  beforeBreadcrumb(breadcrumb) {
    if (typeof breadcrumb.data?.url === "string") {
      breadcrumb.data.url = sanitizeTelemetryUrl(breadcrumb.data.url);
    }

    if (typeof breadcrumb.data?.from === "string") {
      breadcrumb.data.from = sanitizeTelemetryUrl(breadcrumb.data.from);
    }

    if (typeof breadcrumb.data?.to === "string") {
      breadcrumb.data.to = sanitizeTelemetryUrl(breadcrumb.data.to);
    }

    return sanitizeTelemetryValue(breadcrumb) as typeof breadcrumb;
  },
});
