import React, { useState } from 'react'
import CVInput from './components/CVInput.jsx'
import JobResults from './components/JobResults.jsx'
import GapAnalysis from './components/GapAnalysis.jsx'
import LearningPath from './components/LearningPath.jsx'
import { fetchLiveJobs } from './lib/jooble.js'
import { scoreCV } from './lib/vsf-scorer.js'
import { saveRun } from './lib/saved-scores.js'

const PHASE_STEPS = ['input', 'results', 'gap', 'learning']
const PHASE_LABELS = ['Input', 'Results', 'Gap Analysis', 'Learning Path']

function PhaseBar({ phase }) {
  const currentIdx =
    phase === 'scanning' ? 1
    : phase === 'input'    ? 0
    : phase === 'results'  ? 1
    : phase === 'gap'      ? 2
    : phase === 'learning' ? 3
    : 0

  return (
    <div className="phase-bar">
      {PHASE_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className={`phase-step${i < currentIdx ? ' done' : ''}${i === currentIdx ? ' current' : ''}`}>
            <span className="phase-dot">{i + 1}</span>
            <span className="phase-label">{PHASE_LABELS[i]}</span>
          </div>
          {i < PHASE_STEPS.length - 1 && (
            <div className={`phase-line${i < currentIdx ? ' done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function App() {
  const [phase, setPhase] = useState('input') // input | scanning | results | gap | learning
  const [cvText, setCvText] = useState('')
  const [role, setRole] = useState('')
  const [region, setRegion] = useState('Brisbane, Australia')
  const [jobs, setJobs] = useState([])
  const [scores, setScores] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedGap, setSelectedGap] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' })

  async function handleRun() {
    if (!cvText.trim() || !role.trim()) return
    setError(null)
    setPhase('scanning')
    setProgress({ current: 0, total: 0, label: 'Fetching live jobs...' })

    try {
      const liveJobs = await fetchLiveJobs({ keywords: role, location: region, resultsPerPage: 5 })

      if (!liveJobs || liveJobs.length === 0) {
        setError('No jobs found for that role and region. Try a broader search term.')
        setPhase('input')
        return
      }

      setJobs(liveJobs)
      setProgress({ current: 0, total: liveJobs.length, label: 'Scoring your CV against live roles...' })

      const results = []
      let lastError = null
      for (let i = 0; i < liveJobs.length; i++) {
        setProgress({ current: i + 1, total: liveJobs.length, label: `Scoring: ${liveJobs[i].title} @ ${liveJobs[i].company}` })
        try {
          const score = await scoreCV(cvText, liveJobs[i])
          results.push(score)
        } catch (err) {
          lastError = err.message
          console.warn(`Scoring failed for ${liveJobs[i].title}:`, err.message)
        }
      }

      if (results.length === 0) {
        setError(lastError || 'Scoring failed for all roles. Check that your Anthropic API key is configured correctly.')
        setPhase('input')
        return
      }

      setScores(results)
      saveRun({ role, region, cvText, scores: results })
      setPhase('results')
    } catch (err) {
      setError(err.message)
      setPhase('input')
    }
  }

  function handleSelectJob(score) {
    setSelectedJob(score)
    setPhase('gap')
  }

  function handleRestoreRun(run) {
    setCvText(run.cvText || '')
    setRole(run.role || '')
    setRegion(run.region || 'Brisbane, Australia')
    setScores(run.scores || [])
    setJobs([])
    setSelectedJob(null)
    setSelectedGap(null)
    setPhase('results')
  }

  function handleSelectGap(gap) {
    setSelectedGap(gap)
    setPhase('learning')
  }

  return (
    <div className="app">
      <div className="ecosystem-bar">
        <div className="ecosystem-bar-inner">
          <a href="https://velocity-academy.pages.dev/" target="_blank" rel="noopener" className="ecosystem-bar-link">
            ← Velocity Architecture Academy
          </a>
          <span className="ecosystem-bar-meta">ZenCloud · StudioSix</span>
        </div>
      </div>
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-block">
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-label="VSF Match logo">
              <rect x="2" y="2" width="28" height="28" rx="2" fill="var(--color-primary)"/>
              <path d="M8 20 L12 12 L16 18 L20 10 L24 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="24" cy="16" r="2.5" fill="white"/>
            </svg>
            <div>
              <span className="logo-title">VSF Match</span>
              <span className="logo-sub">Career Readiness Engine</span>
            </div>
          </div>
          <div className="header-meta">
            <span>Velocity Success Factor™</span>
            <span className="dot">·</span>
            <span>ZenCloud Global Consultants</span>
          </div>
        </div>
      </header>

      <main className="main">
        <PhaseBar phase={phase} />

        {phase === 'input' && (
          <CVInput
            cvText={cvText} setCvText={setCvText}
            role={role} setRole={setRole}
            region={region} setRegion={setRegion}
            onRun={handleRun}
            onRestoreRun={handleRestoreRun}
            error={error}
          />
        )}

        {phase === 'scanning' && (
          <div className="scanning-screen">
            <div className="scanning-inner">
              <div className="pulse-ring"/>
              <p className="scanning-label">{progress.label}</p>
              {progress.total > 0 && (
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(progress.current / progress.total) * 100}%` }}/>
                </div>
              )}
              <p className="scanning-sub">{progress.current > 0 ? `${progress.current} of ${progress.total} roles scored` : 'Connecting to live job market...'}</p>
            </div>
          </div>
        )}

        {phase === 'results' && (
          <JobResults
            results={scores}
            onSelectJob={handleSelectJob}
            onReset={() => setPhase('input')}
          />
        )}

        {phase === 'gap' && selectedJob && (
          <GapAnalysis
            score={selectedJob}
            cvText={cvText}
            role={role}
            onSelectGap={handleSelectGap}
            onBack={() => setPhase('results')}
          />
        )}

        {phase === 'learning' && selectedGap && selectedJob && (
          <LearningPath
            gap={selectedGap}
            cvText={cvText}
            targetRole={`${selectedJob.jobTitle} at ${selectedJob.company}`}
            onBack={() => setPhase('gap')}
            onReset={() => setPhase('input')}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <p className="footer-brand">VSF Match</p>
          <p className="footer-sub">Career Readiness Engine · Velocity Success Factor™ framework · Part of the Velocity Architecture Academy ecosystem.</p>
          <div className="footer-links">
            <a href="https://velocity-academy.pages.dev/" target="_blank" rel="noopener">Velocity Architecture Academy</a>
            <a href="https://velocityarchitectureframework.com/" target="_blank" rel="noopener">Velocity Framework</a>
            <a href="https://zencloudau.github.io/vaf-sa/" target="_blank" rel="noopener">VAF-SA</a>
            <a href="https://github.com/ZenCloudAU/vsf-match" target="_blank" rel="noopener">VSF Match GitHub</a>
            <a href="https://www.zencloud.com.au/" target="_blank" rel="noopener">ZenCloud</a>
            <a href="https://studiosix.com.au/" target="_blank" rel="noopener">StudioSix</a>
          </div>
          <p className="footer-bottom">© 2026 ZenCloud Global Consultants · Velocity Success Factor™ · Brisbane, Australia</p>
        </div>
      </footer>
    </div>
  )
}
