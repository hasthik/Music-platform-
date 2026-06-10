# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js 16 landing page for **Solenne Studios** (`solennestudios.net`) — a personalized song creation service. Customers fill an order form, pay via Razorpay, and receive a custom song by email.

Deploy to **Vercel** (not GitHub Pages — server-side API routes are required for payment handling).

## Dev commands

```bash
npm run dev      # start local dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # type-check only
```

## Environment variables

Copy `.env.example` → `.env.local` and fill in real values before running locally. Required:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Same — keep server-side only |
| `FORMSPREE_URL` | Formspree Dashboard → full form URL |

Use `rzp_test_` keys for development, `rzp_live_` in production.

## Architecture

```
src/
├── app/
│   ├── layout.tsx               — root layout, Google Fonts, OrderProvider
│   ├── page.tsx                 — composes all section components
│   ├── globals.css              — all CSS (custom properties, animations, layouts)
│   └── api/
│       ├── create-order/route.ts   — POST: creates Razorpay order server-side
│       └── verify-payment/route.ts — POST: verifies HMAC signature, submits to Formspree
├── components/                  — one file per page section
├── context/OrderContext.tsx     — shared plan/delivery state (Pricing ↔ OrderForm)
├── lib/
│   ├── delivery-tiers.ts        — single source of truth for all pricing
│   └── razorpay.ts              — lazy Razorpay server instance (getRazorpay())
└── types/global.d.ts            — window.Razorpay type declarations
```

## Payment flow (secure, server-verified)

1. User clicks "Pay" → `OrderForm` calls `POST /api/create-order` with `{ plan, delivery }`
2. API route looks up the correct price from `DELIVERY_TIERS` (client cannot spoof the amount), creates a Razorpay order, returns `{ orderId, amount, key }`
3. Client opens Razorpay checkout using the server-issued `orderId`
4. On success, client calls `POST /api/verify-payment` with Razorpay's three-field response
5. API route computes the expected HMAC-SHA256 signature and compares — rejects if mismatch
6. On verified success, server submits order details to Formspree and returns `{ success: true }`

## Pricing

All prices live in `src/lib/delivery-tiers.ts` in the `DELIVERY_TIERS` object. Three delivery speeds × two plans. To change a price, update `amount` (INR, not paise — the API route multiplies by 100), `label`, `display`, `per`, and `feat` for that tier.

## Adding audio samples

Sample song `src` fields are empty strings in `src/components/Samples.tsx`. Add MP3 paths (relative to `public/`) or absolute URLs to enable playback.

## Security headers

`next.config.ts` sets `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` on all routes.

## CSS

No Tailwind — all styles are in `src/app/globals.css` using CSS custom properties defined in `:root`. Primary brand colour is `--gold: #C9A96E`. Edit globals.css to change the visual design.
