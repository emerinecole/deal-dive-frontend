export function getUrl() {
  const { APP_BASE_URL, VERCEL_URL } = process.env;

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  if (APP_BASE_URL) {
    return APP_BASE_URL;
  }

  if (VERCEL_URL) {
    return `https://${VERCEL_URL}`;
  }

  throw new Error("No URL found");
}
