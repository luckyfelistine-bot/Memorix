import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiAuth, jsonResponse } from "@/lib/api-helper";

export async function GET(request: Request) {
  return withApiAuth(request, async (req) => {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    if (!q || q.length < 2) {
      return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
    }

    const where: any = {
      OR: [
        { body: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
        { author: { contains: q, mode: "insensitive" } },
        { tags: { hasSome: [q.toLowerCase()] } },
      ],
    };
    if (category) where.AND = [{ category }];

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: { popularity: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, title: true, body: true, category: true, subcategory: true,
          tags: true, mood: true, author: true, popularity: true,
        },
      }),
      prisma.content.count({ where }),
    ]);

    return jsonResponse({
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit), query: q },
    });
  });
}
