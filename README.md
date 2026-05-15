# OPDLink 🏥

**India's OPD Space Marketplace** — connecting verified doctors with healthcare centres using AI-powered matching.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/opdlink&env=ANTHROPIC_API_KEY&envDescription=Required%20for%20AI%20ma[...]

---

## What It Does

OPDLink solves a real friction point in Indian healthcare: **doctors who want OPD space** struggle to find **healthcare centres with available rooms** that match their schedule, specialty, and budget.

| Role | What they do |
|------|-------------|
| **Healthcare Centre** | Register their facility (single clinic, polyclinic, nursing home OPD, hospital OPD, remote clinic, health camp) with rental model, available days/timings, and supported specialties |
| **Doctor** | Register their specialty, required days/timings, and rent budget |
| **Platform** | Runs a weighted scoring algorithm and generates AI summaries of top matches |

---

## Matching Algorithm

The core engine uses **Weighted Multi-Criteria Decision Analysis (MCDA)** — fully transparent, explainable, and tunable.

### Score Breakdown (0–100)

| Criterion | Weight | Rationale |
|-----------|--------|-----------|
| Specialty Fit | **35 pts** | Non-negotiable clinical fit — centre must support the doctor's specialty |
| Days Overlap | **25 pts** | Proportional to % of required days covered by the centre |
| Rent Compatibility | **20 pts** | Inverse of relative deviation: 0% gap = 20 pts, ≥67% gap = 0 pts |
| Timing Overlap | **15 pts** | Hours of overlap / required hours, capped at 1.0 |
| Rental Type Match | **5 pts** | Binary: does centre offer doctor's preferred rental model? |

### Score Tiers

| Score | Tier |
|-------|------|
| 80–100 | 🟢 Excellent Match |
| 60–79 | 🟩 Good Match |
| 40–59 | 🟡 Fair Match |
| 0–39 | 🟠 Low Match |

### Why MCDA (not ML)?

- **Explainability**: every score is decomposable — doctors and centres can see *why* they matched
- **No cold-start problem**: works with zero historical data
- **Tunable**: weights can be adjusted per market segment (e.g. weight rent higher for budget clinics)
- **Regulatory-friendly**: auditable decisions for a regulated healthcare context

### AI Layer (Claude)

Top 3 matches per search get a 2-sentence plain-English summary via the Anthropic API — highlighting the strengths and surfacing any caveats (e.g. specialty not explicitly listed, rent above budget).

---

## Centre Types Supported

| Type | Description |
|------|-------------|
| **Single Clinic** | Independent consultation room for single-specialty practice |
| **Polyclinic** | Multi-specialty facility with shared infrastructure |
| **OPD at Nursing Home** | OPD space within an operational nursing home |
| **Hospital OPD** | Outpatient department within a registered hospital |
| **Remote Clinic (Monthly)** | Monthly remote consultation clinic via telemedicine platform |
| **Health Camp** | Community health camps with scheduled outreach visits |

## Rental Models

- **Hourly** — flexible, per-hour billing
- **Daily / Session** — per OPD session
- **Monthly** — fixed monthly tenancy (including remote clinics and health camps)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Storage | `localStorage` (client-side, no DB required) |
| Deployment | Vercel (Mumbai `bom1` region) |
| CI | GitHub Actions |

> **Storage note**: This MVP uses `localStorage` — data is per-browser. For a production system, replace `lib/storage.ts` with a Supabase/PostgreSQL backend while keeping the matching algorithm [...]

---

## Project Structure

```
opdlink/
├── app/
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout + Navbar
│   ├── globals.css             # Design system + animations
│   ├── centres/
│   │   ├── page.tsx            # Centres directory + filters
│   │   └── register/page.tsx  # 5-step centre registration
│   ├── doctors/
│   │   ├── page.tsx            # Doctors directory + filters
│   │   └── register/page.tsx  # 4-step doctor registration
│   ├── matches/
│   │   └── page.tsx            # Matching engine UI
│   └── api/match/route.ts      # AI summary API route
├── components/
│   ├── Navbar.tsx
│   ├── CentreCard.tsx
│   ├── DoctorCard.tsx
│   └── MatchCard.tsx           # Score ring + breakdown bars
├── lib/
│   ├── types.ts                # All TypeScript interfaces
│   ├── constants.ts            # Labels, specialties, demo data
│   ├── storage.ts              # localStorage CRUD
│   └── matching.ts             # MCDA scoring engine
├── .github/workflows/ci.yml   # GitHub Actions
└── vercel.json                 # Vercel config (Mumbai region)
```

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/opdlink.git
cd opdlink

# 2. Install
npm install

# 3. Environment
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY from https://console.anthropic.com

# 4. Run
npm run dev
# → http://localhost:3000
```

---

## Vercel Deployment

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy → auto-deploys on every push to `main`

Or click the one-click deploy button at the top of this README.

---

## Roadmap

- [ ] Supabase backend (replace localStorage)
- [ ] OTP-based NMC registration verification
- [ ] In-app messaging between matched parties
- [ ] ABDM integration for doctor credential pull
- [ ] Geo-based proximity scoring (add 10 pts to algorithm)
- [ ] Admin dashboard with verification queue
- [ ] SMS/WhatsApp notifications on new matches
- [ ] Mobile app (React Native)
- [x] Remote monthly clinic support
- [x] Health camp integration

---

## Built By

**EMC Digitals (EMC Digicare)** — Healthcare technology at the intersection of clinical practice and AI.

> Dr. Shivesh Kumar, MD | Consultant Cardiologist & CTO, EMC Digitals
