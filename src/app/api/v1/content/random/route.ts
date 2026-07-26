import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiAuth, jsonResponse } from "@/lib/api-helper";

export async function GET(request: Request) {
  return withApiAuth(request, async (req) => {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const mood = searchParams.get("mood");
    const count = Math.min(parseInt(searchParams.get("count") || "1"), 10);

    const where: any = {};
    if (category) where.category = category;
    if (mood) where.mood = mood;

    const total = await prisma.content.count({ where });
    if (total === 0) return jsonResponse({ data: [] });

    const skip = Math.floor(Math.random() * Math.max(total - count, 0));
    const items = await prisma.content.findMany({
      where,
      skip,
      take: count,
      select: {
        id: true, title: true, body: true, category: true, subcategory: true,
        tags: true, mood: true, author: true, popularity: true,
      },
    });

    return jsonResponse({ data: items });
  });
}
