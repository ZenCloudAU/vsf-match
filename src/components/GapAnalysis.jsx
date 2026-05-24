import React from 'react'
import { rankGaps } from '../lib/gap-analyser.js'
import { getBand } from '../lib/vsf-scorer.js'

const PRIORITY_COLOURS = { HIGH: '#DC2626', MEDIUM: '#D97706', LOW: '#16A34A' }
const APPLY_COLOURS = { 'STRONG YES': '#E8630A', 'YES': '#C24F06', 'BORDERLINE': '#D97706', 'NO': '#DC2626' }

function downloadMarkdown(score, rankedGaps) {
  const band = getBand(score.overallScore)
  const date = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const dimLabels = {
    scaleOfImpact: 'Scale of Impact',
    complexityGoverned: 'Complexity Governed',
    authorityHeld: 'Authority Held',
    outcomeIntegrity: 'Outcome Integrity',
    capabilityTransferred: 'Capability Transferred'
  }

  let md = `# VSF Match Report\n`
  md += `**${score.jobTitle}** — ${score.company}\n`
  md += `*Generated ${date}*\n\n`
  md += `---\n\n`
  md += `## Overall Score: ${score.overallScore}/10 — ${band.label}\n`
  md += `**Apply Recommendation:** ${score.applyRecommendation}\n`
  md += `${score.applyRationale}\n\n`
  md += `---\n\n`
  md += `## VSF Dimension Scores\n\n`

  Object.entries(score.dimensions || {}).forEach(([key, dim]) => {
    md += `### ${dimLabels[key] || key} — ${dim.score}/10 (${Math.round(dim.weight * 100)}%)\n`
    md += `${dim.evidence}\n\n`
  })

  md += `---\n\n`
  md += `## Genuine Strengths\n\n`
  ;(score.strengths || []).forEach(s => { md += `- ${s}\n` })

  if (rankedGaps.length > 0) {
    md += `\n---\n\n`
    md += `## Gaps to Bridge\n\n`
    rankedGaps.forEach(gap => {
      md += `### ${gap.skill} — ${gap.priority} priority (${gap.weeksToBridge} weeks)\n`
      md += `**JD requires:** "${gap.jdEvidence}"\n\n`
    })
  }

  md += `\n---\n`
  md += `*VSF Match · ZenCloud Global Consultants · Velocity Success Factor™*\n`

  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `VSF-Report-${score.jobTitle.replace(/\s+/g, '-')}-${score.company.replace(/\s+/g, '-')}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export default function GapAnalysis({ score, cvText, role, onSelectGap, onBack }) {
  const band = getBand(score.overallScore)
  const rankedGaps = rankGaps(score.gaps || [])

  return (
    <div className="gap-screen">
      <div className="gap-nav">
        <button className="btn-back" onClick={onBack}>← Back to Results</button>
        <button className="btn-secondary btn-download" onClick={() => downloadMarkdown(score, rankedGaps)}>
          ↓ Download Report
        </button>
      </div>

      <div className="gap-hero">
        <div>
          <h2>{score.jobTitle}</h2>
          <p className="gap-company">{score.company}</p>
          {score.sourceUrl && score.sourceUrl !== '#' && (
            <a
              className="job-live-link"
              href={score.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: '8px', display: 'inline-block' }}
            >
              Open original job posting ↗
            </a>
          )}
        </div>
        <div className="score-hero-badge" style={{ color: band.color }}>
          <span className="score-hero-num">{score.overallScore}</span>
          <span className="score-hero-band">{band.label}</span>
        </div>
      </div>

      <div className="dim-breakdown">
        {Object.entries(score.dimensions || {}).map(([key, dim]) => {
          const labels = {
            scaleOfImpact: 'Scale of Impact',
            complexityGoverned: 'Complexity Governed',
            authorityHeld: 'Authority Held',
            outcomeIntegrity: 'Outcome Integrity',
            capabilityTransferred: 'Capability Transferred'
          }
          return (
            <div key={key} className="dim-card">
              <div className="dim-card-header">
                <span className="dim-card-name">{labels[key] || key}</span>
                <span className="dim-card-score" style={{ color: band.color }}>{dim.score}/10</span>
                <span className="dim-card-weight">{Math.round(dim.weight * 100)}%</span>
              </div>
              <div className="dim-bar-track">
                <div className="dim-bar-fill" style={{ width: `${(dim.score / 10) * 100}%`, background: band.color }}/>
              </div>
              <p className="dim-evidence">{dim.evidence}</p>
            </div>
          )
        })}
      </div>

      <div className="strengths-block">
        <h3>Genuine Strengths for This Role</h3>
        <ul>
          {(score.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      {rankedGaps.length > 0 && (
        <div className="gaps-block">
          <h3>Gaps to Bridge — Ranked by Priority</h3>
          <p className="gaps-hint">Click any gap to generate your personalised learning path</p>
          <div className="gap-list">
            {rankedGaps.map((gap, i) => (
              <div key={i} className="gap-item" onClick={() => onSelectGap(gap)}>
                <div className="gap-item-header">
                  <span className="gap-skill">{gap.skill}</span>
                  <span className="priority-badge" style={{ background: PRIORITY_COLOURS[gap.priority] }}>
                    {gap.priority}
                  </span>
                  <span className="weeks-badge">{gap.weeksToBridge}w to bridge</span>
                </div>
                <p className="gap-jd-evidence">JD requires: "{gap.jdEvidence}"</p>
                <p className="gap-action">→ Generate learning path</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="apply-block" style={{ borderColor: APPLY_COLOURS[score.applyRecommendation] || '#d19900' }}>
        <strong style={{ color: APPLY_COLOURS[score.applyRecommendation] || '#d19900' }}>{score.applyRecommendation}</strong>
        <p>{score.applyRationale}</p>
      </div>
    </div>
  )
}