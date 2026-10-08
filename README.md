# HSBC Demo

A practice mobile banking app. It is **not** HSBC, it is not connected to HSBC, and it does not move real money.

Customers can log on, see balances, browse transactions, make demo payments between practice accounts, and download a CSV statement. Staff can manage customers, add or deduct demo funds, post and reverse transactions, and read an audit log.

## Demo log on

| | Email | Password |
|---|---|---|
| Customer | user@hsbc.demo | User@12345 |
| Staff | admin@hsbc.demo | Admin@12345 |

John Reed’s current account starts at **£5,000.00**. Other customers use the same password.

## Local setup

PostgreSQL 14+ is required. Docker is not used.

```bash
npm install
copy .env.example .env
```

Edit `.env` and set `DATABASE_URL` and `DIRECT_URL` to your Postgres instance. Create the database, then:

```bash
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open http://localhost:3000. The layout is built for a phone first (375–430px). On a wider screen the same screens sit beside a side menu.

## Vercel

Set these environment variables on the project:

- `DATABASE_URL` — pooled Postgres URL (Neon or Vercel Postgres)
- `DIRECT_URL` — direct Postgres URL, used by Prisma migrations
- `APP_URL` — the public site URL
- `DEMO_EXPOSE_RESET_LINK` — keep this `false` on a public site

The build command is `npm run vercel-build`, which generates the client, applies migrations, and builds Next.js.

## Checks

```bash
npm run typecheck
npm run lint
npm test
```
