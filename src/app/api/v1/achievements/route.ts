import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiAuth, jsonResponse } from "@/lib/api-helper";

export async function GET(request: Request) {
  return withApiAuth(request, async (req) => {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const where: any = {};
    if (category) where.category = category;

    const [items, total] = await Promise.all([
      prisma.achievement.findMany({
        where,
        orderBy: { impactScore: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.achievement.count({ where }),
    ]);

    return jsonResponse({
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}
