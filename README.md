# Technician Invoice PWA

Production-ready mobile-first PWA for technician invoicing/reporting (Phase 1).

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- Telegram Login (server-side hash verification)
- PWA manifest + service worker

## Setup
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```

## Railway deployment
1. Create PostgreSQL in Railway.
2. Set `DATABASE_URL`, `ADMIN_TELEGRAM_ID`, `TELEGRAM_BOT_TOKEN`, `APP_URL`, `SESSION_SECRET`.
3. Deploy app service from repo.
4. Run migration command in deploy/start step:
   ```bash
   npm run prisma:deploy && npm run build
   ```
5. Set start command:
   ```bash
   npm run start
   ```

## Notes
- Phase 1 stores only metadata for media files in `ReportMedia` with `storageStatus='pending'`.
- Google Sheets sync intentionally not included yet.
