# 🛡️ CyberShield X

A full-stack, AI-assisted cybersecurity platform built for fast threat checks on **IP, URL, email, and domains**.

## ✨ What you can do

- 🔐 Sign up/login with secure auth (JWT + HTTP-only cookies)
- 🧪 Run threat scans for IPs, URLs, emails, and domains
- 🤖 Get AI-generated security summaries
- 📊 Monitor stats and logs from the admin panel
- 📄 Export scan reports as PDF

## 🧱 Tech Stack

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Vercel Serverless Functions (`/api`) + Node.js + TypeScript
- **Database:** Supabase Postgres + Prisma ORM
- **Auth:** JWT + RBAC (Admin/User)
- **AI:** Google Gemini API

## 📁 Project Structure

```txt
/src      Frontend SPA
/api      Vercel serverless functions
/prisma   Prisma schema
```

## 🚀 Quick Start (Local)

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

> `prisma generate` creates the Prisma client only.  
> Run migrations at least once for each new database.

## ✅ Validation Commands

```bash
npm run lint
npm run build
```

## 🔧 Environment Variables

Configure a `.env` file with:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `IPINFO_TOKEN`
- `ABUSEIPDB_API_KEY`
- `ANTIDEO_API_KEY`
- `VIRUSTOTAL_API_KEY`
- `IPQUALITYSCORE_API_KEY`
- `DESTROYLIST_BASE_URL` (default proxy base: `https://cors-bypasser-pro.vercel.app/proxy?url=`)
- `USERCHECK_API_KEY`
- `FIDRO_API_KEY`
- `WHOISXML_API_KEY`
- `BLACKLISTCHECKER_API_KEY`
- `CRON_SECRET` (or `RETENTION_CRON_SECRET`)
- `API_LOG_RETENTION_DAYS` (optional, default `30`)
- `SCAN_RESULT_RETENTION_DAYS` (optional, default `30`)

## 🌐 API Highlights

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `GET /api/auth/me`

### Scan
- `POST /api/scan/ip`
- `POST /api/scan/url`
- `POST /api/scan/email`
- `POST /api/scan/domain`

### AI
- `POST /api/ai-summary`

### Admin
- `GET /api/admin/users`
- `POST /api/admin/users` (ban/unban)
- `GET /api/admin/stats`
- `GET /api/admin/logs`

### Reports
- `GET /api/export-report?scanId=...`

## 📦 Deploy to Vercel

1. Push the repo to GitHub
2. Import it in Vercel
3. Add all environment variables
4. Ensure Supabase is reachable from Vercel
5. Set GitHub repo secrets for DB migration
6. Deploy and verify scan + auth routes

## 🔒 Security Notes

- Passwords are hashed with bcrypt
- JWT is stored in secure HTTP-only cookies
- Role checks protect admin routes
- Inputs are validated and sanitized
- API logs support monitoring and auditing
