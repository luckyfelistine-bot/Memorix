import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiAuth, jsonResponse } from "@/lib/api-helper";

export async function GET(request: Request) {
  return withApiAuth(request, async (req, isAdmin) => {
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.content.count(),
    ]);

    return jsonResponse({ data: items, meta: { page, limit, total } });
  }, true);
}

export async function POST(request: Request) {
  return withApiAuth(request, async (req, isAdmin) => {
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const content = await prisma.content.create({ data: body });
    return jsonResponse({ data: content }, 201);
  }, true);
}

export async function DELETE(request: Request) {
  return withApiAuth(request, async (req, isAdmin) => {
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.content.delete({ where: { id } });
    return jsonResponse({ success: true, message: "Content deleted" });
  }, true);
}
