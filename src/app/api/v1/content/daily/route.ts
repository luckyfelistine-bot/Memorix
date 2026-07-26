import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiAuth, jsonResponse } from "@/lib/api-helper";
import { getTodaySeed } from "@/lib/utils";

type DailyContent = {
  id: string;
  title: string | null;
  body: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  mood: string | null;
  author: string | null;
  popularity: number;
};

const selectFields = {
  id: true,
  title: true,
  body: true,
  category: true,
  subcategory: true,
  tags: true,
  mood: true,
  author: true,
  popularity: true,
} as const;

export async function GET(request: Request) {
  return withApiAuth(request, async (req) => {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = { isDaily: true };
    if (category) where.category = category;

    let daily: DailyContent | null = await prisma.content.findFirst({
      where,
      select: selectFields,
    });

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
          select: selectFields,
        });
      }
    }

    return jsonResponse({ data: daily });
  });
}
