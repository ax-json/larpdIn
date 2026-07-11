# YOUR TASKS — things only you can do

Everything in here needs a human (accounts, keys, money, clicking "submit").
I can't do these. Do them after the build is finished, in roughly this order.
Nothing here blocks me building — mock mode covers the whole game offline.

---

## 🔑 1. OpenAI API key  (REQUIRED for the live judges)

The courtroom calls OpenAI (`gpt-4o`). Without a key the game still runs, but
only on the 3 cached demo verdicts (mock mode) — real typed LARPs won't get
judged live.

- [ ] Get a key: https://platform.openai.com → API keys → create.
- [ ] Add a few dollars of credit (billing). A whole demo session costs cents.
- [ ] Paste it into `.env` in the project root (file already exists):
      `OPENAI_API_KEY=sk-...`
- [ ] Never commit `.env` (already gitignored — `git status` must never show it).

Note: plain `npm run dev` has no serverless layer, so local play falls back to
mock verdicts even with a key. The key goes live on Vercel (step 2), or locally
via `npx vercel dev`.

## 🚀 2. Deploy (Vercel — free)

- [ ] Push the repo to GitHub (I'll prep the commit; you click through auth).
- [ ] vercel.com → New Project → import the repo → deploy.
- [ ] In Vercel project settings → Environment Variables, add the SAME
      `OPENAI_API_KEY`. (The key must live on the server, not the browser.)
- [ ] Redeploy so the env var takes effect. Confirm the live URL judges a LARP.

## 🎥 3. Demo video  (the Devpost judges watch THIS, not the code)

- [ ] 60–90s screen recording: get a prompt → type a LARP → courtroom plays →
      rating drops. Show one split verdict (VC loves it, Recruiter suspicious).
- [ ] Say the one-liner out loud: "LinkedIn is everyone larping — we made it a sport."
- [ ] Upload (YouTube unlisted or Loom), grab the link for Devpost.

## 📝 4. Devpost submission

- [ ] Fill the Devpost form: title `larpYourself`, the tagline, the video link,
      the live URL, the GitHub link.
- [ ] Paste the "What is a LARP?" blurb from the README as the description.
- [ ] Hit submit BEFORE the deadline (~1–2 AM IST). Do not leave this to the last 5 min.

---

## Nice-to-have (only if time)

- [ ] Custom domain `larpyourself.com` pointed at Vercel.
- [ ] A couple of real example LARPs of your own for the demo (funnier if personal).
