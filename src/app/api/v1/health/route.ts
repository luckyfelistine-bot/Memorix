import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [contentCount, philosopherCount, achievementCount, eventCount, memeCount] = await Promise.all([
      prisma.content.count(),
      prisma.philosopher.count(),
      prisma.achievement.count(),
      prisma.historicalEvent.count(),
      prisma.meme.count(),
    ]);

    return NextResponse.json({
      status: "healthy",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      stats: {
        content: contentCount,
        philosophers: philosopherCount,
        achievements: achievementCount,
        historicalEvents: eventCount,
        memes: memeCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: String(error) },
      { status: 500 }
    );
  }
}
