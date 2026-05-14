# CyberShield X

Production-grade full-stack AI-assisted cybersecurity platform deployable as a **single Vercel project**.

## Stack

- Frontend: React + TypeScript + Vite + TailwindCSS + React Router + Axios + Zustand + Framer Motion + shadcn/ui-style component foundation + Recharts
- Backend: Vercel Serverless Functions (`/api`) + Node.js + TypeScript
- Database: PostgreSQL via **Supabase Postgres** + Prisma ORM
- Auth: JWT + secure HTTP-only cookies + RBAC (Admin/User)
- AI: Google Gemini API

## Architecture

```txt
/src     -> Frontend SPA
/api     -> Vercel serverless functions
/prisma  -> Prisma schema
```

Single deployment routes:
- `/dashboard`, `/scan-center`, `/admin`
- `/api/auth/login`, `/api/scan/ip`, `/api/admin/stats`, etc.

## Implemented APIs

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
- `GET /api/export-report?scanId=...` (PDF)

## External Provider Integrations

- IP: IPInfo Lite, AbuseIPDB, Fidro
- URL: VirusTotal, DestroyList
- Email: UserCheck Email API, EmailRep, Fidro Email Validation
- Domain: RDAP, WhoisXML Subdomains API, Pulsedive, UserCheck Domain API

## Risk Scoring Engine

Rule-based scoring (never AI-based risk determination):
- Inputs: abuse confidence, blacklist hits, phishing indicators, disposable email flags, Fidro risk, VirusTotal malicious detections, recent domain registration
- Outputs:
  - Levels: Safe / Low Risk / Medium Risk / High Risk / Critical
  - `matched_rules`
  - provider confidence score

## API Response Shape

```json
{
  "scan_id": "",
  "target": "",
  "type": "",
  "risk": {
    "score": 0,
    "level": "",
    "matched_rules": []
  },
  "signals": {},
  "providers": {}
}
```

## Prisma Models

- `users`
- `scans`
- `scan_results`
- `api_logs`
- `threat_reports`
- `blocked_users`
- `settings`

Includes enums, relations, indexes, timestamps, and foreign keys.

## Environment Variables

Update `.env` and configure:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `IPINFO_TOKEN`
- `ABUSEIPDB_API_KEY`
- `VIRUSTOTAL_API_KEY`
- `DESTROYLIST_BASE_URL`
- `USERCHECK_API_KEY`
- `FIDRO_API_KEY`
- `WHOISXML_API_KEY`

> `DATABASE_URL` and `DIRECT_URL` are configured for Supabase Postgres.

## Local Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

> `prisma generate` only creates the Prisma client. It does **not** create tables in Supabase.
> You must run migrations at least once for every new database.

For database migration deployment (production):

```bash
npm run prisma:migrate
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env`.
4. Ensure Supabase Postgres is reachable from Vercel.
5. Add `DATABASE_URL` and `DIRECT_URL` as GitHub repository secrets so migrations can run in CI.
6. Push to `main` (or run the workflow manually in Actions) to execute Prisma migrations automatically in GitHub Actions.
7. Deploy after migrations complete successfully.

`vercel.json` is included for SPA rewrites + `/api` function routing under one project.

## Security Notes

- Password hashing with bcrypt
- JWT in HTTP-only secure cookies
- Role-based auth guards for admin APIs
- Input sanitization and validation (zod)
- API logging for monitoring/analytics
