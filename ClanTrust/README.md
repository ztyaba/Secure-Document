# ClanTrust

Secure wills & trusts portal for Ugandan clans, built with Next.js 14 (App Router), Tailwind, Clerk, Prisma, Google Drive, and Dropbox Sign.

## Features
- Email/SMS OTP auth via Clerk with role-based access (admin, client, paralegal, notary)
- Google Drive storage with clan-based folder hierarchy
- Dropbox Sign embedded signing with offline signature pad fallback
- 4-step onboarding wizard with multilingual support (English, Luganda, Swahili)
- Audit logging, consent capture, retention policy cron stub, and CSV export
- PWA ready, offline fallback, accessibility enhancements, and help drawer
- Prisma schema with seed data for demo users and documents

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm, yarn, or npm
- PostgreSQL database (default connection string in `.env.example`)

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Start PostgreSQL and apply migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

### Credentials
Clerk, Google Drive, Dropbox Sign, and other integrations are configured with safe test values for local development. Replace them with production credentials before deploying.

### Deployment
Deploy on [Vercel](https://vercel.com) or [Render](https://render.com):
- Set all environment variables from `.env.example`
- Provision PostgreSQL (e.g., Neon or Supabase)
- Run `npx prisma migrate deploy` during build
- Configure Clerk redirect URLs to match the deployed domain

### Testing
- `npm run lint` – lint code with ESLint
- `npm run build` – ensure production build succeeds

### Folder Structure
- `app/` – App Router routes and pages
- `components/` – UI and feature components
- `lib/` – utilities for Prisma, Google Drive, Dropbox Sign, audit logging, etc.
- `prisma/` – schema, migrations, and seed data
- `public/` – static assets and PWA manifest

### Notes
- Google Drive and Dropbox Sign operations use stub/test flows for local usage. Replace with production logic and secrets for deployment.
- Sentry integration is stubbed and logs to console unless `SENTRY_DSN` is provided.
- Offline uploads and retry queue are scaffolded via PWA support; extend with service worker logic as needed.
