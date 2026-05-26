// VSF Five-Dimension Scoring Engine
// Scores a CV against a job description using the Velocity Success Factor framework

import { callClaude } from './claude.js'

const VSF_SYSTEM_PROMPT = `You are the VSF (Velocity Success Factor) scoring engine for the Velocity Architecture Academy, built by ZenCloud Global Consultants.

Your task: score a CV against a job description across five weighted dimensions. Return ONLY a valid JSON object — no markdown, no preamble, no explanation outside the JSON.

## THE FIVE DIMENSIONS

1. Scale of Impact (25%) — Enterprise reach of the person's work.
   Anchors:
   8–10: Multi-national, multi-billion dollar programmes, 1M+ users or equivalent enterprise scope
   6–8:  Enterprise-wide, $10M+ programmes, hundreds of thousands of users
   4–6:  Divisional/departmental, $1–10M, smaller user base
   2–4:  Team or project-level, limited organisational reach

2. Complexity Governed (25%) — Difficulty of the environment managed.
   Anchors:
   8–10: Multiple simultaneous vectors — M&A integration + regulatory (APRA/GDPR/ISM) + multi-cloud + legacy migration + multi-geography
   6–8:  Two or three significant complexity factors active at once
   4–6:  Standard enterprise complexity, single domain or platform
   2–4:  Greenfield, low-complexity, or well-defined single-vendor environments

3. Authority Held (20%) — Real decision-making power exercised.
   Anchors:
   8–10: Formal architecture governance authority with C-suite/board engagement and investment sign-off
   6–8:  Architecture Review Board chair, Design Authority lead, executive-level presentations
   4–6:  Senior technical lead with some governance influence, advisory capacity
   2–4:  Individual contributor, recommendations only, no formal authority

4. Outcome Integrity (20%) — Whether the work actually landed.
   Anchors:
   8–10: Multiple major programmes delivered on time, on budget, with measurable business outcomes documented
   6–8:  Consistent delivery evidence with specific results cited
   4–6:  Mixed or partially evidenced outcomes, some delivery claims without specifics
   2–4:  Limited outcome evidence, theoretical or incomplete delivery record

5. Capability Transferred (10%) — Lasting capability left behind.
   Anchors:
   8–10: Enterprise-wide frameworks, standards, or patterns adopted broadly; significant team uplift documented
   6–8:  Frameworks/patterns created and adopted by teams; coaching or mentoring with evidence
   4–6:  Some documentation, knowledge sharing, or training delivered
   2–4:  Individual contribution only, minimal durable transfer

## SCORING RULES

- Score each dimension 1.0–10.0 (one decimal place)
- Score relative to THIS specific JD, not as an absolute measure
- Weighted overall = sum(score × weight) across all five dimensions
- Evidence-based: cite exact phrases from the CV in "evidence", exact phrases from the JD in "jdRequirement"
- Gaps: only list genuine gaps where the JD requires something the CV does NOT demonstrate
- Gap priority: HIGH = role-critical, likely to cost the application; MEDIUM = notable but not disqualifying; LOW = minor or nice-to-have
- weeksToBridge: realistic estimate (1–26 weeks) based on complexity of the gap

## BENCHMARK BANDS (Australian Enterprise Market)

< 3.0:   Below threshold
3.0–4.5: Graduate / Junior EA
4.5–6.0: Mid-level Solution Architect
6.0–7.5: Senior Solution Architect / Lead SA
7.5–8.5: Principal / Lead Enterprise Architect
8.5–10.0: Chief Architect / Distinguished Engineer

## APPLY RECOMMENDATION

STRONG YES: Score ≥ 7.5 and CV meets 90%+ of JD requirements
YES:        Score ≥ 6.5 or strong domain/sector match
BORDERLINE: Score 5.5–6.5 or significant gaps but strong overall background
NO:         Score < 5.5 or critical disqualifying gaps present`

function escJson(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, '').trim()
}

export async function scoreCV(cvText, job) {
  const sourceUrl = job.link || job.url || job.sourceUrl || job.redirect_url || null

  const jobTitle   = escJson(job.title)
  const jobCompany = escJson(job.company)
  const jobId      = escJson(job.id)
  const jobLoc     = escJson(job.location)
  const jobSnippet = escJson(job.snippet)
  const srcUrl     = sourceUrl ? escJson(sourceUrl) : null

  const userMessage = `Score this CV against the job description below using the VSF five-dimension framework.

JOB TITLE: ${job.title || ''}
COMPANY: ${job.company || ''}
LOCATION: ${job.location || ''}
JD SNIPPET: ${job.snippet || ''}

CV TEXT:
${cvText}

Return JSON in exactly this structure (no extra keys, no trailing commas):
{
  "jobId": "${jobId}",
  "jobTitle": "${jobTitle}",
  "company": "${jobCompany}",
  "location": "${jobLoc}",
  "sourceUrl": ${srcUrl ? `"${srcUrl}"` : 'null'},
  "overallScore": 0.0,
  "band": "Senior Solution Architect",
  "matchStrength": "STRONG",
  "dimensions": {
    "scaleOfImpact":         { "score": 0.0, "weight": 0.25, "evidence": "CV phrase supporting score", "jdRequirement": "JD phrase requiring this" },
    "complexityGoverned":    { "score": 0.0, "weight": 0.25, "evidence": "...", "jdRequirement": "..." },
    "authorityHeld":         { "score": 0.0, "weight": 0.20, "evidence": "...", "jdRequirement": "..." },
    "outcomeIntegrity":      { "score": 0.0, "weight": 0.20, "evidence": "...", "jdRequirement": "..." },
    "capabilityTransferred": { "score": 0.0, "weight": 0.10, "evidence": "...", "jdRequirement": "..." }
  },
  "gaps": [
    {
      "skill": "Gap name",
      "priority": "HIGH",
      "jdEvidence": "Exact phrase from JD requiring this skill",
      "cvEvidence": "What the CV shows or lacks",
      "weeksToBridge": 4
    }
  ],
  "strengths": [
    "Genuine strength 1 specific to this role",
    "Genuine strength 2",
    "Genuine strength 3"
  ],
  "applyRecommendation": "YES",
  "applyRationale": "One honest sentence summarising the match"
}`

  const result = await callClaude(VSF_SYSTEM_PROMPT, userMessage, 3500)

  try {
    const parsed = JSON.parse(result)
    return { ...parsed, sourceUrl: parsed.sourceUrl || sourceUrl }
  } catch {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return { ...parsed, sourceUrl: parsed.sourceUrl || sourceUrl }
    }
    throw new Error('Failed to parse VSF score response')
  }
}

export function calculateWeightedScore(dimensions) {
  return Object.values(dimensions).reduce((total, dim) => {
    return total + (dim.score * dim.weight)
  }, 0).toFixed(1)
}

export function getBand(score) {
  const s = parseFloat(score)
  if (s >= 8.5) return { label: 'Chief Architect', color: '#01696f' }
  if (s >= 7.5) return { label: 'Principal / Lead EA', color: '#437a22' }
  if (s >= 6.0) return { label: 'Senior Solution Architect', color: '#006494' }
  if (s >= 4.5) return { label: 'Mid-level Solution Architect', color: '#d19900' }
  return { label: 'Graduate / Junior EA', color: '#964219' }
}
