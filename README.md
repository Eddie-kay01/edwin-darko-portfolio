# Edwin Darko — Personal Developer Website

A responsive React + TypeScript + Vite portfolio with a cursor-reactive canvas particle field, editable project data, project detail dialogs, responsive navigation, skills and journey sections, and a serverless contact endpoint for Vercel.

## Requirements

- Node.js 20+ (tested with Node 22)
- npm
- A Resend account and a verified sender domain to enable actual contact-form email delivery

## Run locally

```bash
npm install
npm run dev
```

The Vite development server serves the frontend. The `/api/contact` endpoint is a Vercel serverless function and does not run in plain `vite dev` by itself. For end-to-end contact form testing locally, use the Vercel CLI (`npx vercel dev`) after setting environment variables.

## Personalise before publishing

Edit `src/data/site.ts`:

- `email`: replace `YOUR_EMAIL@example.com` with Edwin's real email address. This enables the `mailto:` and copy-email controls.
- `github` and `linkedin`: add real profile URLs. Empty values hide the links.
- `cvPath`: add a real CV file to `public/` and set its path, e.g. `/edwin-darko-cv.pdf`. The CV link stays hidden until configured.
- `projects`: verify project descriptions, status, stack, features, learning notes, and add actual `repo`/`demo` URLs. The three included entries are clearly marked as explorations; they are not claims of live or completed work.
- `skills` and `journey`: replace the editable prompts with accurate technologies and real milestones. No skill percentages or unverified dates are used.
- `currentlyBuilding`, `currentlyLearning`, `currentInterests`, `nextGoal`: update the manually maintained command centre.

The portrait area is an intentional placeholder; it does not use a stock photo or pretend to be Edwin.

## Enable real contact form delivery

The frontend submits to `POST /api/contact`. The Vercel function validates fields server-side and calls Resend. It does not claim delivery unless Resend returns a successful response.

1. Create a Resend account and verify a domain/sender address in its dashboard.
2. Create an API key with the minimum required access.
3. Set these environment variables in Vercel Project Settings → Environment Variables (and in `.env.local` for local Vercel CLI testing):
   - `RESEND_API_KEY` — private Resend API key.
   - `CONTACT_TO_EMAIL` — the real inbox that should receive enquiries.
   - `CONTACT_FROM_EMAIL` — a sender identity on your verified domain, for example `Edwin Portfolio <portfolio@your-domain.com>`.
4. Redeploy after setting variables.
5. Submit a test message on the deployed site and verify receipt in the target inbox. Also test invalid input and a missing-config deployment.

Never add secrets to `src/`, Vite `VITE_*` variables, Git, or client-side JavaScript. The form includes a honeypot and server-side validation. For higher-traffic use, add a managed rate limiter (e.g. Upstash/Vercel Firewall) and CAPTCHA/Turnstile as appropriate; in-memory rate limiting is deliberately not presented as reliable across serverless instances.

If delivery is not configured, the form returns an explicit error and the interface offers the email fallback once a real email is configured.

## Production build

```bash
npm run build
npm run preview
```

Deploy by pushing the project to GitHub, importing it into Vercel, and selecting the Vite framework preset. Vercel detects `api/contact.ts` as a serverless function. The `vercel.json` adds a few defensive response headers. The site currently uses hash navigation between sections and does not need a client-side router or SPA rewrite.

## Accessibility and performance notes

- Semantic landmarks, labels, focus states, keyboard-dismissable project detail dialog, and live form status messages.
- Canvas animation uses bounded particle counts, capped device pixel ratio, pauses meaningful movement for reduced-motion users, and skips animation work while the tab is hidden.
- Mobile uses fewer particles; no WebGL dependency is required.
- Google Fonts are optional; system sans-serif fallback is available.

## Final pre-launch checklist

- [ ] Add real email, GitHub, LinkedIn, and CV path (if available).
- [ ] Verify all project details and technology claims.
- [ ] Replace skill prompts with technologies actually used/being learned.
- [ ] Set all three Resend environment variables in Vercel.
- [ ] Verify the sender domain and test message delivery end-to-end.
- [ ] Test mobile layout, keyboard navigation, reduced motion, and production build.
