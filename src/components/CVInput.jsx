import React from 'react'

const SAMPLE_CV = `Phil Myint — Enterprise & Solution Architect
ZenCloud Global Consultants · Brisbane, Australia
TOGAF Certified · CBA Certified · AZ-305 Renewed 92% (March 2026)

EXPERIENCE

Principal Architect / Delivery Lead — Global Operations (2020–2024)
Led enterprise architecture across 14 data centres on four continents. Zero-disruption migration of 2.3M+ customer records across M&A integration. Chaired Architecture Review Board. Presented architecture position to C-suite and board-level stakeholders. Delivered $35M programme on time and within governance constraints.

Enterprise Architect — Financial Services (2018–2020)
Defined target state architecture for core banking transformation. Established Design Authority. Produced 18 EA artefacts aligned to ISO 42010. Resolved institutional paralysis engagement — three failed predecessor programmes.

Solution Architect — Government / Infrastructure (2015–2018)
Cloud migration strategy for QLD government services. Azure architecture design. Security architecture aligned to Essential Eight.`

export default function CVInput({ cvText, setCvText, role, setRole, region, setRegion, onRun, error }) {
  const hasApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY && import.meta.env.VITE_ANTHROPIC_API_KEY !== 'sk-ant-...'

  return (
    <div className="input-screen">
      <div className="input-hero">
        <h1>Know exactly where you stand.<br/>Every Monday.</h1>
        <p className="hero-sub">Paste your CV. Enter your target role. The engine pulls live jobs, scores your match across five dimensions, identifies your gaps, and builds your learning path.</p>
      </div>

      {!hasApiKey && (
        <div className="alert alert-warning">
          <strong>API key required.</strong> Add your Anthropic API key to <code>.env</code> to enable scoring. See README for setup instructions.
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="input-grid">
        <div className="input-col-main">
          <div className="field">
            <label htmlFor="cv-text">Your CV</label>
            <p className="field-hint">Plain text. Copy from Word, PDF, or LinkedIn. The more detail the better.</p>
            <textarea
              id="cv-text"
              className="cv-textarea"
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              placeholder="Paste your CV here..."
              rows={20}
            />
            {!cvText && (
              <button className="btn-ghost sample-btn" onClick={() => setCvText(SAMPLE_CV)}>
                Load sample CV
              </button>
            )}
          </div>
        </div>

        <div className="input-col-side">
          <div className="field">
            <label htmlFor="role">Target Role</label>
            <p className="field-hint">Job title to search live market</p>
            <input
              id="role"
              type="text"
              className="input"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Enterprise Architect"
            />
          </div>

          <div className="field">
            <label htmlFor="region">Region</label>
            <p className="field-hint">City, state, or country</p>
            <input
              id="region"
              type="text"
              className="input"
              value={region}
              onChange={e => setRegion(e.target.value)}
              placeholder="e.g. Brisbane, Australia"
            />
          </div>

          <div className="vsf-explainer">
            <h3>The Five VSF Dimensions</h3>
            {[
              ['Scale of Impact', '25%', 'How far did your work reach?'],
              ['Complexity Governed', '25%', 'How hard was the environment?'],
              ['Authority Held', '20%', 'What level did you actually operate at?'],
              ['Outcome Integrity', '20%', 'Did the work land?'],
              ['Capability Transferred', '10%', 'What did you leave behind?'],
            ].map(([name, weight, desc]) => (
              <div key={name} className="dim-row">
                <div className="dim-header">
                  <span className="dim-name">{name}</span>
                  <span className="dim-weight">{weight}</span>
                </div>
                <p className="dim-desc">{desc}</p>
              </div>
            ))}
          </div>

          <button
            className="btn-primary run-btn"
            onClick={onRun}
            disabled={!cvText.trim() || !role.trim()}
          >
            Run VSF Match
          </button>
        </div>
      </div>
    </div>
  )
}
