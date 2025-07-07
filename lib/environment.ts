export function getEnv(): string {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV;

  if (!env) {
    throw new Error("Environment is not set");
  }

  return env;
}
