import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateApiKey } from "@/lib/auth";

export async function withApiAuth(
  request: Request,
  handler: (req: Request, isAdmin: boolean) => Promise<NextResponse>,
  requireAdmin: boolean = false
) {
  const apiKey = request.headers.get("x-api-key") || request.headers.get("X-API-Key") || "";
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // Check for admin session (for dashboard use)
  const session = await getServerSession(authOptions);
  const isAdminSession = session?.user?.role === "admin";

  // Check API key
  let isAdminKey = false;
  let keyValid = false;
  if (apiKey) {
    const validation = await validateApiKey(apiKey);
    keyValid = validation.valid;
    if (!validation.valid && !isAdminSession) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }
    isAdminKey = validation.isUnlimited;
  }

  const isAdmin = isAdminKey || isAdminSession;

  if (requireAdmin && !isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  // Rate limit ONLY applies to external API consumers who provide a key
  // The Memorix app frontend itself browses without limits
  if (!isAdmin && apiKey && keyValid) {
    const rateLimit = await checkRateLimit(ip + ":" + apiKey, 100, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. 100 requests per minute." },
        { status: 429, headers: { "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(rateLimit.resetAt) } }
      );
    }
  }

  // App frontend and public browsing: no key required, no rate limit
  return handler(request, isAdmin);
}

export function jsonResponse(data: any, status: number = 200, headers?: Record<string, string>) {
  return NextResponse.json(data, { status, headers });
}
