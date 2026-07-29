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

export const sanitizeTelemetryText = (value: string) =>
  value
    .replace(/(\/invite\/)[^/?#\s"'<>]+/gi, `$1${REDACTED}`)
    .replace(/(\/verify\/)[^/?#\s"'<>]+/gi, `$1${REDACTED}`)
    .replace(
      /([?&](?:code|token|verificationCode|resetToken|inviteToken|accessToken|refreshToken)=)[^&#\s"'<>]*/gi,
      `$1${REDACTED}`,
    );

const redactSensitivePath = (pathname: string) =>
  sanitizeTelemetryText(pathname);

export const sanitizeTelemetryUrl = (value?: string | null) => {
  if (!value) return value ?? "";

  try {
    const isAbsolute = /^[a-z][a-z\d+\-.]*:/i.test(value);
    const baseOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://app.local";

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
    return sanitizeTelemetryText(value);
  }
};
