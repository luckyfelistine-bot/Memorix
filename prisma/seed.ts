import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const seedDir = path.join(process.cwd(), "data", "seed");

function loadJson(filename: string): any[] {
  const filepath = path.join(seedDir, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`⚠️  ${filename} not found, skipping...`);
    return [];
  }
  const data = JSON.parse(fs.readFileSync(filepath, "utf-8"));
  console.log(`✅ Loaded ${data.length} items from ${filename}`);
  return data;
}

async function seedCategories() {
  const items = loadJson("categories.json");
  if (items.length === 0) return;
  for (const item of items) {
    await prisma.category.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }
  console.log(`🗂️  Seeded ${items.length} categories`);
}

async function seedContent() {
  const files = [
    "quotes.json",
    "mental-health.json",
    "facts.json",
    "jokes.json",
    "riddles.json",
    "stories.json",
    "wisdom.json",
    "relationships.json",
    "inspiration.json",
  ];

  let total = 0;
  for (const file of files) {
    const items = loadJson(file);
    if (items.length === 0) continue;

    // Batch insert in chunks of 100
    const chunkSize = 100;
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      await prisma.content.createMany({
        data: chunk.map((item: any) => ({
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
        })),
        skipDuplicates: true,
      });
    }
    total += items.length;
    console.log(`📝 Seeded ${items.length} items from ${file}`);
  }
  console.log(`📝 Total content seeded: ${total}`);
}

async function seedPhilosophers() {
  const items = loadJson("philosophers.json");
  if (items.length === 0) return;

  const chunkSize = 50;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await prisma.philosopher.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
  console.log(`🧠 Seeded ${items.length} philosophers`);
}

async function seedAchievements() {
  const items = loadJson("achievements.json");
  if (items.length === 0) return;

  const chunkSize = 50;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await prisma.achievement.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
  console.log(`🏆 Seeded ${items.length} achievements`);
}

async function seedHistory() {
  const items = loadJson("history.json");
  if (items.length === 0) return;

  const chunkSize = 100;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await prisma.historicalEvent.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
  console.log(`📜 Seeded ${items.length} historical events`);
}

async function seedMemes() {
  const items = loadJson("memes.json");
  if (items.length === 0) return;

  const chunkSize = 50;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await prisma.meme.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
  console.log(`😂 Seeded ${items.length} memes`);
}

async function main() {
  console.log("🌱 Starting Memorix seed...\n");

  await seedCategories();
  await seedContent();
  await seedPhilosophers();
  await seedAchievements();
  await seedHistory();
  await seedMemes();

  // Update category content counts
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    const count = await prisma.content.count({
      where: { category: cat.slug },
    });
    await prisma.category.update({
      where: { id: cat.id },
      data: { contentCount: count },
    });
  }
  console.log("\n📊 Updated category content counts");

  console.log("\n✨ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
