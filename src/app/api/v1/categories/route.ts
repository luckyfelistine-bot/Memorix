import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiAuth, jsonResponse } from "@/lib/api-helper";

export async function GET(request: Request) {
  return withApiAuth(request, async () => {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true, name: true, slug: true, description: true,
        icon: true, color: true, contentCount: true, parentId: true,
      },
    });

    // Also get distinct categories from content for completeness
    const contentCategories = await prisma.content.groupBy({
      by: ["category"],
      _count: { category: true },
    });

    return jsonResponse({
      data: categories,
      contentStats: contentCategories.map(c => ({
        name: c.category,
        count: c._count.category,
      })),
    });
  });
}
