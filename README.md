# Memorix

> **The Living Matrix of Human Memory**
>
> Every word ever spoken, every hope, every tear, every laugh — archived and accessible.
>
> Built by [Aevibron](https://aevibron.com)

## What is Memorix?

Memorix is a comprehensive content API and web application that archives the full spectrum of human expression. From ancient wisdom to modern memes, from heartbreak to hope — millions of curated content pieces are searchable, browsable, and integrable into any application.

## Features

- **15+ Content Categories**: Quotes, relationships, wisdom, fun, brain teasers, stories, entertainment, lifestyle, games, creativity, knowledge, productivity, events, social media, health & wellness, education, finance, travel, technology, pets & nature, kids & family, inspiration, media, mental health, memes, philosophy
- **Philosopher Profiles**: 80+ thinkers with bios, eras, schools of thought, and influence scores
- **Human Achievements**: Timeline of milestones that defined our species
- **This Day in History**: Historical events for every day of the year
- **Meme Gallery**: Curated memes with masonry layout
- **Depression & Hope Hub**: A place with all answers — mental health support, breathing exercises, affirmations
- **Powerful REST API**: Simple, well-documented endpoints with rate limiting
- **Admin Dashboard**: Analytics, content management, API key generation
- **4 Themes**: Midnight, Aurora, Ember, Serenity
- **Semantic Search**: Full-text search across all content
- **Rate Limiting**: 100 requests/minute free tier

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS variables
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/content` | Browse content (filter, sort, paginate) |
| GET | `/api/v1/content/random` | Random content |
| GET | `/api/v1/content/daily` | Daily featured content |
| GET | `/api/v1/search?q=` | Full-text search |
| GET | `/api/v1/categories` | List categories |
| GET | `/api/v1/philosophers` | Browse philosophers |
| GET | `/api/v1/achievements` | Browse achievements |
| GET | `/api/v1/history/today` | This day in history |
| GET | `/api/v1/memes` | Browse memes |
| GET | `/api/v1/health` | API health & stats |

## Authentication

Include your API key in the `X-API-Key` header:

```bash
curl -H "X-API-Key: mx_your_key_here" \
  "https://memorix.vercel.app/api/v1/content/random"
```

Free tier: Generate any key starting with `mx_` followed by random characters.

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/luckyfelistine-bot/Memorix.git
cd Memorix
npm install
```

### 2. Environment Variables

Create `.env` file:

```bash
DATABASE_URL="postgresql://postgres:PASSWORD@db.hhzinnignvyoxfywazpv.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:PASSWORD@db.hhzinnignvyoxfywazpv.supabase.co:5432/postgres"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_PASSWORD="Memorix.Aevibron."
AEVIBRON_API_KEY="your-aevibron-master-key"
SUPABASE_URL="https://hhzinnignvyoxfywazpv.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_Mq7g2G1oo_EffhAyCaUSXQ_d5n_acD4"
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Data

Place JSON files in `data/seed/` directory, then run:

```bash
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Admin Access

Navigate to `/admin` and sign in with the admin password.

## Project Structure

```
/memorix
├── .github/workflows/     # CI/CD
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── public/
│   ├── icons/             # App icons (you provide)
│   └── images/            # Images (you provide)
├── src/
│   ├── app/
│   │   ├── (public)/      # Public pages
│   │   │   ├── page.tsx   # Home
│   │   │   ├── explore/   # Browse content
│   │   │   ├── philosophers/
│   │   │   ├── achievements/
│   │   │   ├── history/
│   │   │   ├── memes/
│   │   │   ├── api-docs/
│   │   │   ├── search/
│   │   │   └── depression-hope/
│   │   ├── admin/         # Admin dashboard
│   │   ├── api/v1/        # API routes
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   └── lib/               # Utilities, DB, auth
└── data/seed/             # JSON seed files (you provide)
```

## GitHub Secrets

Add these to your GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | Supabase connection string |
| `DIRECT_URL` | Same as DATABASE_URL |
| `NEXTAUTH_SECRET` | Random 32-byte string |
| `NEXTAUTH_URL` | Your Vercel domain |
| `ADMIN_PASSWORD` | Admin login password |
| `AEVIBRON_API_KEY` | Master key for unlimited access |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `VERCEL_TOKEN` | Vercel deployment token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

## Icon Placement

Place your generated icons at these paths:

- `public/icons/favicon.ico` — Browser tab icon
- `public/icons/logo.svg` — Main logo
- `public/icons/icon-192.png` — PWA icon (192x192)
- `public/icons/icon-512.png` — PWA icon (512x512)
- `public/images/philosophers/` — Philosopher portraits
- `public/images/achievements/` — Achievement images
- `public/images/memes/` — Meme images

## License

Built by Aevibron. All rights reserved.

---

**Memorix** — Where Memory Becomes Infinite.
