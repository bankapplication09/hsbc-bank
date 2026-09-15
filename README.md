# Velora Bank — Mobile Banking App

A premium **mobile-only** banking web application inspired by modern fintech UI patterns. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Customer portal**: Login, balance card with show/hide, accounts, transactions, full transaction details
- **Admin portal**: Dashboard, customer management, credit/debit transactions, edit/delete with balance recalculation
- **Real-time sync**: Customer sees admin changes immediately (same browser storage / Supabase realtime)
- **Mobile-first**: Optimized for 360–430px viewports, bottom navigation, bottom sheets, safe areas

## Demo Credentials

| Role     | Email             | Password      |
|----------|-------------------|---------------|
| Customer | user@example.com  | User@12345    |
| Admin    | admin@example.com | Admin@12345   |

Initial customer balance: **₹125,450.00** with 10 sample transactions.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and use Chrome DevTools mobile view (375px recommended).

## Supabase (Optional)

The app runs locally with browser storage by default. To use Supabase:

1. Create a Supabase project
2. Run `supabase/schema.sql` in the SQL editor
3. Copy `.env.example` to `.env` and add your credentials

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- Supabase (optional backend)

## Project Structure

```
src/
  components/   # UI, layout, banking components
  contexts/     # Auth, toast
  lib/          # API, storage, formatting
  pages/        # Customer & admin screens
```

## Mobile Testing Flow

**Customer**: Login → Home → View Balance → Accounts → Transactions → Transaction Details → Profile → Logout

**Admin**: Login → Dashboard → Customers → Customer Account → Credit/Debit → Transactions → Edit/Delete

After admin adds ₹10,000 credit and ₹5,000 debit, customer balance should show **₹130,450**.
