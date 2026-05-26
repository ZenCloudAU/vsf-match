// Gap Analyser — generates ranked gaps and learning paths via Claude
import { callClaude } from './claude.js'

export function rankGaps(gaps) {
  const priority = { HIGH: 0, MEDIUM: 1, LOW: 2 }
  return [...gaps].sort((a, b) => {
    const pd = (priority[a.priority] ?? 3) - (priority[b.priority] ?? 3)
    if (pd !== 0) return pd
    return (b.weeksToBridge || 0) - (a.weeksToBridge || 0)
  })
}

function cleanJson(raw) {
  // Extract the outermost JSON object
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object found in response')
  let str = raw.slice(start, end + 1)

  // Remove control characters that break JSON parsing
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')

  // Escape unescaped newlines inside string values
  str = str.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/gs, (match) => {
    return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
  })

  return str
}

const LEARNING_SYSTEM = `You are a senior career pathway architect specialising in enterprise and solution architecture careers in the Australian market.

Your task: generate a practical, week-by-week learning plan to close a specific skill gap for a professional targeting a senior architecture role.

Rules:
- Be specific: name real frameworks, certifications, books, and vendors — not generic advice
- Calibrate daily commitment realistically (30–90 mins for a working professional)
- The audioBriefScript must be 180–220 words — a compelling spoken introduction to the topic suitable for audio generation (NotebookLM, ElevenLabs). Write it as natural spoken English, not bullet points.
- Return ONLY valid JSON. Use escaped strings — no unescaped quotes, raw newlines, or special characters inside JSON values.`

export async function generateLearningPath(gap, cvText, targetRole) {
  const prompt = `Generate a learning path to close this gap for a professional targeting: ${targetRole}

GAP: ${gap.skill}
PRIORITY: ${gap.priority}
ESTIMATED WEEKS: ${gap.weeksToBridge}
JD REQUIRES: ${gap.jdEvidence}
CV CONTEXT: ${cvText.substring(0, 1000)}

Return JSON in exactly this structure:
{
  "gap": "Gap name",
  "weeksToBridge": 4,
  "bridgeStrategy": "One concrete sentence describing the learning approach",
  "weeks": [
    {
      "week": 1,
      "focus": "Specific week theme",
      "dailyCommitment": "45 mins",
      "activities": [
        { "type": "READ",     "title": "Specific book or article title", "duration": "2h" },
        { "type": "WATCH",    "title": "Specific course or video title",  "duration": "1h" },
        { "type": "PRACTICE", "title": "Hands-on exercise description",   "duration": "3h" }
      ],
      "milestone": "Concrete outcome by end of this week"
    }
  ],
  "cvLanguage": "Exact sentence to add to CV once skill is acquired — make it evidence-quality",
  "audioBriefScript": "180–220 word spoken-English script introducing this topic as a professional development audio brief — natural language, no bullet points, suitable for text-to-speech"
}`

  const raw = await callClaude(LEARNING_SYSTEM, prompt, 2500)

  try {
    const cleaned = cleanJson(raw)
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('Learning path parse error:', err.message)
    console.error('Raw response (first 500):', raw.substring(0, 500))
    throw new Error(`Failed to parse learning path: ${err.message}`)
  }
}