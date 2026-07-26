"use server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export async function checkRateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime };
}

export async function getApiKeyRateLimit(apiKey: string): Promise<{ limit: number; tier: string }> {
  const { prisma } = await import("./db");

  const key = await prisma.apiKey.findUnique({
    where: { keyHash: apiKey },
  });

  if (!key || !key.isActive) {
    return { limit: 100, tier: "free" };
  }

  if (key.isAdmin || key.tier === "admin") {
    return { limit: 999999, tier: "admin" };
  }

  return { limit: key.rateLimitPerMin || 100, tier: key.tier };
}
