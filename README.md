# VSF Match — Velocity Success Factor™ Career Readiness Engine

**ZenCloud Global Consultants · Brisbane**

> *Stop applying blind. Know exactly where you stand — and what to do about it.*

---

## What This Does

VSF Match is a weekly career readiness engine for senior enterprise architects and solution architects.

Every Monday:
1. Paste your CV
2. Enter your target role and region
3. The engine pulls live job listings, scores your CV against each JD using the VSF five-dimension framework, identifies your gaps, and builds a personalised learning path for each one

**Output:**
- VSF match score per live role
- Gap analysis with evidence
- Prioritised learning path per gap
- Audio brief script (paste into NotebookLM or ElevenLabs)

---

## The Five VSF Dimensions

| # | Dimension | Weight | What it measures |
|---|---|---|---|
| 1 | Scale of Impact | 25% | How far did your work reach? Users, sites, countries, financial consequence |
| 2 | Complexity Governed | 25% | How hard was the environment? M&A, regulation, live operations, multi-vendor |
| 3 | Authority Held | 20% | What level did you actually operate at? ARB chair, Design Authority, sign-off |
| 4 | Outcome Integrity | 20% | Did the work land? Delivered, zero-disruption, clean handover |
| 5 | Capability Transferred | 10% | What did you leave behind? Frameworks, patterns, team uplift |

---

## Repository Structure

```
vsf-match/
├── README.md
├── package.json
├── vite.config.js
├── .env.example
├── index.html
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── CVInput.jsx          — CV paste area + role/region intake
    │   ├── JobResults.jsx       — Live job listings with VSF scores
    │   ├── GapAnalysis.jsx      — Ranked gap report with evidence
    │   ├── LearningPath.jsx     — Personalised learning curve per gap
    │   └── AudioBrief.jsx       — Generated podcast script per gap
    └── lib/
        ├── jooble.js            — Jooble API integration
        ├── vsf-scorer.js        — Five-dimension scoring engine
        ├── gap-analyser.js      — Gap identification and ranking
        ├── learning-path.js     — Learning curve generator
        └── claude.js            — Anthropic API calls
```

---

## Setup

### 1. Get API Keys

**Anthropic (Claude):** https://console.anthropic.com → API Keys → Create Key
**Jooble:** https://jooble.org/api/about → Register → Copy key

### 2. Install

```bash
git clone https://github.com/ZenCloudAU/vsf-match.git
cd vsf-match
npm install
```

### 3. Configure

```bash
cp .env.example .env
# Edit .env — add your Anthropic and Jooble API keys
```

### 4. Run

```bash
npm run dev
# Open http://localhost:5173
```

---

## Phase Roadmap

| Phase | Feature | Status |
|---|---|---|
| 1 | CV intake + Jooble live jobs + VSF match scoring | 🔨 Building |
| 2 | Gap analysis with evidence and ranking | ⏳ Planned |
| 3 | Personalised learning path per gap | ⏳ Planned |
| 4 | Audio brief script generation | ⏳ Planned |
| 5 | Week-on-week progress dashboard | ⏳ Planned |
| 6 | Recruiter mode — score any candidate against any JD | ⏳ Planned |

---

## Built On

- Velocity Success Factor™ framework — ZenCloud Global Consultants
- Claude (Anthropic) for CV analysis and gap intelligence
- Jooble API for live job data across 67 countries
- React + Vite

---

## Licence

© ZenCloud Global Consultants. All rights reserved.
Velocity Success Factor™ is a ZenCloud product.

*ZenCloud Global Consultants · velocityarchitectureframework.com*
