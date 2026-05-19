# VSF Match — Polish v2 Update
## What this update fixes

1. Removes your personal CV as the sample — replaces with generic Alex Morgan sample
2. Fixes JSON parse error on learning path (Expected comma or ] after array element)
3. Adds Download Report button on Gap Analysis screen (exports .md file)
4. Adds Download Plan button on Learning Path screen (exports .md file)
5. Adds back/forward nav row on Gap Analysis and Learning Path screens
6. Live job link shown in both results card and gap analysis screen

---

## COST PER RUN

Each full run (3 jobs scored + 1 learning path) costs approximately:
- Scoring 3 jobs:     ~2,500 tokens each = 7,500 tokens
- Learning path:      ~2,000 tokens
- Total per run:      ~9,500–12,000 tokens
- Claude Haiku cost:  ~$0.003–0.005 USD per run (less than 1 cent)
- Claude Sonnet cost: ~$0.03–0.05 USD per run (3–5 cents)

If you are using claude-3-haiku you can run hundreds of times for under $1.
Check your model in src/lib/claude.js to confirm which model is set.

---

## FILES TO REPLACE

Replace these files ENTIRELY with the new versions:

  src/components/CVInput.jsx        → CVInput.jsx
  src/components/GapAnalysis.jsx    → GapAnalysis.jsx
  src/components/LearningPath.jsx   → LearningPath.jsx
  src/lib/gap-analyser.js           → gap-analyser.js

---

## STEP 1 — Replace the four files

For each file:
1. Open the file in VS Code
2. Ctrl+A to select all
3. Delete
4. Paste the new file contents
5. Ctrl+S to save

---

## STEP 2 — Add CSS to styles.css

Open: src/styles.css
Scroll to the very bottom.
Paste the contents of styles-addition.css at the end.
Do NOT delete anything else.

---

## STEP 3 — Commit and push

  git add .
  git commit -m "polish v2: sample CV fix, download plans, nav buttons, JSON parse fix"
  git push origin main

---

## STEP 4 — Verify

1. Hard refresh: Ctrl+F5
2. Click "Load sample CV" — should show Alex Morgan, NOT your CV
3. Run a search
4. Open a gap report — should see Back button and Download Report button
5. Click a gap — should see Back to Gap Analysis and Download Plan buttons
6. Download a plan — should open a .md file with the learning path

---

## IF THE JSON PARSE ERROR STILL HAPPENS

The error "Expected comma or ] after array element" means Claude returned JSON
with unescaped special characters in a string. The new gap-analyser.js includes
a cleanJson() function that strips control characters and fixes common issues.

If it still fails, check src/lib/claude.js — make sure the model is set to
claude-3-haiku-20240307 or claude-3-5-sonnet-20241022 (not an older model).
