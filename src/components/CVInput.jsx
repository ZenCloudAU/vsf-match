import React from 'react'

const SAMPLE_CV = `Alex Morgan — Enterprise Architect
Melbourne, VIC, Australia
TOGAF 9.2 Certified · AWS Solutions Architect Professional · AZ-305 · PMP

SUMMARY
Enterprise Architect with 12 years across financial services, government, and technology sectors.
Proven track record delivering large-scale transformation programmes, cloud migration strategies,
and enterprise-wide governance frameworks. Experienced operating at executive and board level.

EXPERIENCE

Enterprise Architect — Financial Services (2019–2024)
Commonwealth Bank of Australia · Sydney, NSW
Led cloud-first architecture strategy across 6 business units impacting 4.2M retail customers.
Chaired Architecture Review Board with sign-off authority on $28M technology investment portfolio.
Delivered zero-disruption core banking migration for 1.8M accounts. Produced 22 TOGAF-aligned
architecture artefacts. Established Design Authority and uplifted team of 14 solution architects.
Presented quarterly architecture position to CTO and board technology committee.

Solution Architect — Government Digital Transformation (2016–2019)
Services Australia · Canberra, ACT
Designed cloud migration architecture for three high-volume citizen-facing services (2.1M users).
Azure and AWS hybrid architecture. Security architecture aligned to ISM and Essential Eight.
Delivered $12M programme on time and 8% under budget. Coordinated across six agency stakeholders.

Senior Systems Architect — Infrastructure (2012–2016)
Telstra · Melbourne, VIC
Architecture design for national network modernisation programme across 11 states and territories.
Multi-vendor coordination across Cisco, HPE, and Ericsson. Resolved two failed predecessor engagements.
Introduced architecture pattern library adopted by 40+ engineers across the business.

EDUCATION & CERTIFICATIONS
Bachelor of Computer Science — University of Melbourne (2011)
TOGAF 9.2 Certified — The Open Group
AWS Solutions Architect Professional — Amazon Web Services
Microsoft Azure Solutions Architect (AZ-305) — Microsoft
PMP — Project Management Institute`

const VSF_DIMS = [
  ['Scale of Impact',       '25%'],
  ['Complexity Governed',   '25%'],
  ['Authority Held',        '20%'],
  ['Outcome Integrity',     '20%'],
  ['Capability Transferred','10%'],
]

export default function CVInput({ cvText, setCvText, role, setRole, region, setRegion, onRun, error }) {
  const hasApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY &&
    import.meta.env.VITE_ANTHROPIC_API_KEY !== 'sk-ant-...'

  return (
    <div className="input-screen">
      <div className="input-hero">
        <div className="hero-eyebrow">Velocity Success Factor™</div>
        <h1>Know exactly <span className="hero-gradient">where you stand.</span></h1>
        <p className="hero-sub">
          Paste your CV and target role. The engine pulls live jobs, scores your fit across
          five dimensions, identifies every gap, and builds your pathway forward.
        </p>
      </div>

      {!hasApiKey && (
        <div className="alert alert-warning">
          <strong>API key required.</strong> Add your Anthropic API key to <code>.env</code> to enable scoring.
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
            <div className="field-label-row">
              <label htmlFor="cv-text">Your CV</label>
              {!cvText && (
                <button className="btn-ghost" onClick={() => setCvText(SAMPLE_CV)}>
                  Load sample CV
                </button>
              )}
            </div>
            <p className="field-hint">Plain text — copy from Word, PDF, or LinkedIn. More detail = better scoring.</p>
            <textarea
              id="cv-text"
              className="cv-textarea"
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              placeholder="Paste your CV here..."
              rows={22}
            />
          </div>
        </div>

        <div className="input-col-side">
          <div className="side-card">
            <div className="field">
              <label htmlFor="role">Target Role</label>
              <p className="field-hint">Job title to search the live market</p>
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
              <h3>Five VSF Dimensions</h3>
              {VSF_DIMS.map(([name, weight]) => (
                <div key={name} className="dim-row">
                  <span className="dim-name">{name}</span>
                  <span className="dim-weight">{weight}</span>
                </div>
              ))}
            </div>

            <button
              className="btn-primary run-btn"
              onClick={onRun}
              disabled={!cvText.trim() || !role.trim()}
            >
              Run VSF Match →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
