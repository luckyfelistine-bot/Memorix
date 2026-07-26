import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiAuth, jsonResponse } from "@/lib/api-helper";

export async function GET(request: Request) {
  return withApiAuth(request, async (req, isAdmin) => {
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalContent,
      totalPhilosophers,
      totalAchievements,
      totalEvents,
      totalMemes,
      dailyRequests,
      weeklyRequests,
      topEndpoints,
      categoryBreakdown,
    ] = await Promise.all([
      prisma.content.count(),
      prisma.philosopher.count(),
      prisma.achievement.count(),
      prisma.historicalEvent.count(),
      prisma.meme.count(),
      prisma.usageLog.count({ where: { createdAt: { gte: dayAgo } } }),
      prisma.usageLog.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.usageLog.groupBy({
        by: ["endpoint"],
        _count: { endpoint: true },
        orderBy: { _count: { endpoint: "desc" } },
        take: 10,
      }),
      prisma.content.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { _count: { category: "desc" } },
      }),
    ]);

    return jsonResponse({
      totals: {
        content: totalContent,
        philosophers: totalPhilosophers,
        achievements: totalAchievements,
        historicalEvents: totalEvents,
        memes: totalMemes,
      },
      activity: {
        dailyRequests,
        weeklyRequests,
      },
      topEndpoints: topEndpoints.map(e => ({
        endpoint: e.endpoint,
        count: e._count.endpoint,
      })),
      categoryBreakdown: categoryBreakdown.map(c => ({
        category: c.category,
        count: c._count.category,
      })),
    });
  }, true);
}
