import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiAuth, jsonResponse } from "@/lib/api-helper";

export async function GET(request: Request) {
  return withApiAuth(request, async (req) => {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const mood = searchParams.get("mood");
    const theme = searchParams.get("theme");
    const occasion = searchParams.get("occasion");
    const language = searchParams.get("language") || "en";
    const tags = searchParams.get("tags");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const sortBy = searchParams.get("sortBy") || "popularity";
    const order = searchParams.get("order") || "desc";

    const where: any = { language };
    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (mood) where.mood = mood;
    if (theme) where.theme = theme;
    if (occasion) where.occasion = occasion;
    if (tags) where.tags = { hasSome: tags.split(",") };

    const orderBy: any = {};
    orderBy[sortBy] = order;

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, title: true, body: true, category: true, subcategory: true,
          tags: true, mood: true, theme: true, occasion: true, author: true,
          popularity: true, likes: true, createdAt: true,
        },
      }),
      prisma.content.count({ where }),
    ]);

    return jsonResponse({
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}

export async function POST(request: Request) {
  return withApiAuth(request, async (req, isAdmin) => {
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin required" }, { status: 403 });
    }
    const body = await req.json();
    const content = await prisma.content.create({ data: body });
    return jsonResponse({ data: content }, 201);
  }, true);
}
