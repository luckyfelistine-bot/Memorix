import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiAuth, jsonResponse } from "@/lib/api-helper";

export async function GET(request: Request) {
  return withApiAuth(request, async () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;

    const events = await prisma.historicalEvent.findMany({
      where: { day, month },
      orderBy: { year: "desc" },
    });

    return jsonResponse({
      data: events,
      meta: { day, month, count: events.length },
    });
  });
}
