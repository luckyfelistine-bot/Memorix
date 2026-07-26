import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiAuth, jsonResponse } from "@/lib/api-helper";
import { getTodaySeed } from "@/lib/utils";

export async function GET(request: Request) {
  return withApiAuth(request, async (req) => {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // First try to get curated daily content
    const where: any = { isDaily: true };
    if (category) where.category = category;

    let daily = await prisma.content.findFirst({ where });

    // Fallback: deterministic random based on date
    if (!daily) {
      const seed = getTodaySeed();
      const allWhere: any = {};
      if (category) allWhere.category = category;
      const total = await prisma.content.count({ where: allWhere });
      if (total > 0) {
        const skip = seed % total;
        daily = await prisma.content.findFirst({
          where: allWhere,
          skip,
          select: {
            id: true, title: true, body: true, category: true, subcategory: true,
            tags: true, mood: true, author: true, popularity: true,
          },
        });
      }
    }

    return jsonResponse({ data: daily });
  });
}
