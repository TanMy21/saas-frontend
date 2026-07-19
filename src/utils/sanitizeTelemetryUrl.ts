const REDACTED = "[Filtered]";

const SENSITIVE_QUERY_PARAMS = new Set([
  "code",
  "token",
  "verificationCode",
  "resetToken",
  "inviteToken",
  "accessToken",
  "refreshToken",
]);

const redactSensitivePath = (pathname: string) =>
  pathname
    .replace(/\/invite\/[^/?#]+/gi, `/invite/${REDACTED}`)
    .replace(/\/verify\/[^/?#]+/gi, `/verify/${REDACTED}`);

export const sanitizeTelemetryUrl = (value?: string | null) => {
  if (!value) return value ?? "";

  try {
    const isAbsolute = /^[a-z][a-z\d+\-.]*:/i.test(value);
    const baseOrigin =
      typeof window !== "undefined" ? window.location.origin : "https://app.local";

    const url = new URL(value, baseOrigin);

    SENSITIVE_QUERY_PARAMS.forEach((param) => {
      if (url.searchParams.has(param)) {
        url.searchParams.set(param, REDACTED);
      }
    });

    url.pathname = redactSensitivePath(url.pathname);

    if (isAbsolute) {
      return url.toString();
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return value
      .replace(/([?&](code|token|verificationCode|resetToken|inviteToken|accessToken|refreshToken)=)[^&#]*/gi, `$1${REDACTED}`)
      .replace(/\/invite\/[^/?#]+/gi, `/invite/${REDACTED}`)
      .replace(/\/verify\/[^/?#]+/gi, `/verify/${REDACTED}`);
  }
};