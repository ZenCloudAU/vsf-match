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

const LEARNING_SYSTEM = `You are a senior career pathway architect for enterprise architects.
Generate a practical learning path to close a specific skill gap.
Return ONLY valid JSON. Use short strings — avoid any unescaped quotes, newlines, or special characters inside JSON string values.`

export async function generateLearningPath(gap, cvText, targetRole) {
  const prompt = `Generate a learning path to close this gap for an enterprise architect targeting: ${targetRole}

GAP: ${gap.skill}
PRIORITY: ${gap.priority}
WEEKS TO BRIDGE: ${gap.weeksToBridge}
JD EVIDENCE: ${gap.jdEvidence}
CV CONTEXT: ${cvText.substring(0, 800)}

Return JSON in exactly this structure:
{
  "gap": "Gap name",
  "weeksToBridge": 4,
  "bridgeStrategy": "One sentence strategy",
  "weeks": [
    {
      "week": 1,
      "focus": "Week theme",
      "dailyCommitment": "45 mins",
      "activities": [
        { "type": "READ", "title": "Resource title", "duration": "2h" },
        { "type": "WATCH", "title": "Video title", "duration": "1h" },
        { "type": "PRACTICE", "title": "Exercise", "duration": "3h" }
      ],
      "milestone": "What you can do by end of week"
    }
  ],
  "cvLanguage": "One sentence to add to CV once skill is acquired",
  "audioBriefScript": "Short 3 sentence audio brief about this topic"
}`

  const raw = await callClaude(LEARNING_SYSTEM, prompt, 2000)

  try {
    const cleaned = cleanJson(raw)
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('Learning path parse error:', err.message)
    console.error('Raw response (first 500):', raw.substring(0, 500))
    throw new Error(`Failed to parse learning path: ${err.message}`)
  }
}