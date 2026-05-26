import React, { useState, useEffect } from 'react'
import { generateLearningPath } from '../lib/gap-analyser.js'

export default function LearningPath({ gap, cvText, targetRole, onBack, onReset }) {
  const [path, setPath] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showScript, setShowScript] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setPath(null)
    generateLearningPath(gap, cvText, targetRole)
      .then(setPath)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [gap, cvText, targetRole])

  const TYPE_ICONS = { READ: '📖', WATCH: '▶', PRACTICE: '⚡', BUILD: '🔨' }

  function downloadPlan(path) {
    const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    let md = `# Learning Pathway: ${path.gap}\n`
    md += `**Target Role:** ${targetRole}\n`
    md += `**Duration:** ${path.weeksToBridge} weeks\n`
    md += `*Generated ${date} · VSF Match · ZenCloud Global Consultants*\n\n`
    md += `---\n\n`
    md += `## Bridge Strategy\n${path.bridgeStrategy}\n\n`
    md += `---\n\n`
    ;(path.weeks || []).forEach(week => {
      md += `## Week ${week.week}: ${week.focus}\n`
      md += `*Daily commitment: ${week.dailyCommitment}*\n\n`
      ;(week.activities || []).forEach(act => {
        md += `- **${act.type}** ${act.title} _(${act.duration})_\n`
      })
      md += `\n**Milestone:** ${week.milestone}\n\n`
    })
    if (path.cvLanguage) {
      md += `---\n\n## CV Language — Once Acquired\n> "${path.cvLanguage}"\n\n`
    }
    md += `---\n*Velocity Success Factor™ · ZenCloud Global Consultants*\n`

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Learning-Path-${path.gap.replace(/\s+/g, '-').substring(0, 40)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div className="learning-loading">
      <div className="pulse-ring small"/>
      <p>Building your learning path for <strong>{gap.skill}</strong>...</p>
      <p className="loading-sub">Calibrating to senior EA level</p>
    </div>
  )

  if (error) return (
    <div className="error-screen">
      <p>Failed to generate learning path: {error}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
        <button className="btn-back" onClick={onBack}>← Back to Gap Analysis</button>
        <button className="btn-primary" onClick={onReset}>New Search</button>
      </div>
    </div>
  )

  return (
    <div className="learning-screen">
      <div className="gap-nav">
        <button className="btn-back" onClick={onBack}>← Back to Gap Analysis</button>
        {path && (
          <button className="btn-secondary btn-download" onClick={() => downloadPlan(path)}>
            ↓ Download Plan
          </button>
        )}
      </div>

      <div className="learning-hero">
        <h2>{path.gap}</h2>
        <p className="learning-meta">{path.weeksToBridge} week learning path · {targetRole}</p>
        <p className="bridge-strategy">{path.bridgeStrategy}</p>
      </div>

      {path.audioBriefScript && (
        <div className="audio-brief-prominent">
          <div className="audio-brief-header" onClick={() => setShowScript(!showScript)}>
            <h3>🎙 Audio Brief Script</h3>
            <span className="audio-brief-hint">
              {showScript ? 'Hide' : 'Show'} — paste into NotebookLM or ElevenLabs to generate a podcast
            </span>
          </div>
          {showScript && (
            <div className="audio-script">
              <pre>{path.audioBriefScript}</pre>
              <div className="audio-script-actions">
                <button className="btn-copy-inline" onClick={() => navigator.clipboard.writeText(path.audioBriefScript)}>
                  Copy Script
                </button>
                <a className="btn-copy-inline" href="https://notebooklm.google.com/" target="_blank" rel="noopener">
                  Open NotebookLM →
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="weeks-grid">
        {(path.weeks || []).map((week, i) => (
          <div key={i} className="week-card">
            <div className="week-header">
              <span className="week-num">Week {week.week}</span>
              <span className="week-commit">{week.dailyCommitment}/day</span>
            </div>
            <h4 className="week-focus">{week.focus}</h4>
            <div className="week-activities">
              {(week.activities || []).map((act, j) => (
                <div key={j} className="activity-row">
                  <span className="activity-type">{TYPE_ICONS[act.type] || '·'} {act.type}</span>
                  <span className="activity-title">{act.title}</span>
                  <span className="activity-duration">{act.duration}</span>
                </div>
              ))}
            </div>
            <div className="week-milestone">
              <span className="milestone-label">Milestone:</span> {week.milestone}
            </div>
          </div>
        ))}
      </div>

      {path.cvLanguage && (
        <div className="cv-language-block">
          <h3>CV Language — Once Acquired</h3>
          <p className="cv-language-text">"{path.cvLanguage}"</p>
        </div>
      )}

      <div className="academy-cta-block">
        <p className="academy-cta-label">Ready to build this skill with structured training?</p>
        <a
          className="btn-academy-cta"
          href="https://velocity-academy.pages.dev/#learning-paths"
          target="_blank"
          rel="noopener"
        >
          Explore Velocity Architecture Academy →
        </a>
      </div>

      <div className="learning-actions">
        <button className="btn-secondary" onClick={onBack}>← More Gaps</button>
        <button className="btn-primary" onClick={onReset}>New Search</button>
      </div>
    </div>
  )
}