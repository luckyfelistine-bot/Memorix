import { hashString } from "./utils";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) rateLimitMap.delete(key);
  }
}

setInterval(cleanup, 60000);

export async function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = hashString(identifier);
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}
