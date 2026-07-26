import { compare } from "bcryptjs";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Memorix.Aevibron.";
const AEVIBRON_KEY = process.env.AEVIBRON_API_KEY || "";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export function isAevibronKey(key: string): boolean {
  return key === AEVIBRON_KEY && AEVIBRON_KEY.length > 0;
}

export async function validateApiKey(key: string): Promise<{ valid: boolean; tier: string; isUnlimited: boolean }> {
  if (isAevibronKey(key)) {
    return { valid: true, tier: "aevibron", isUnlimited: true };
  }
  // For free tier, any non-empty key is accepted (self-service)
  if (key && key.startsWith("mx_") && key.length >= 10) {
    return { valid: true, tier: "free", isUnlimited: false };
  }
  return { valid: false, tier: "none", isUnlimited: false };
}
