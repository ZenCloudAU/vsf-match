# VSF Match — Velocity Success Factor™ Career Readiness Engine

**A StudioSix / Velocity learning-support product within the ZenCloud Advisory ecosystem.**

> *Stop applying blind. Know exactly where you stand — and what to do about it.*

---

## What This Does

VSF Match is a career readiness engine for senior enterprise architects and solution architects.

It supports the wider Velocity Architecture Academy learning pathway by helping practitioners compare their current experience against target roles, identify capability gaps, and route those gaps into focused learning.

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

## Ecosystem Role

```text
ZenCloud advises.
StudioSix produces.
Velocity decides.
```

Within that model:

- **ZenCloud Advisory** is the commercial advisory front door.
- **StudioSix** is the product and delivery studio.
- **Velocity Architecture Academy** is the learning pathway.
- **VSF Match** is a capability-readiness tool that helps practitioners understand gaps and choose learning actions.

VSF Match is not a recruitment agency, employment guarantee, or certification authority.

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
| 1 | Manual CV + target role input | Planned |
| 2 | Live job retrieval | Planned |
| 3 | VSF scoring | Planned |
| 4 | Gap analysis | Planned |
| 5 | Learning path generation | Planned |
| 6 | Audio brief script | Planned |
