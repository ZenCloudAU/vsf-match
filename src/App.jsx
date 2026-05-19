import React, { useState } from 'react'
import CVInput from './components/CVInput.jsx'
import JobResults from './components/JobResults.jsx'
import GapAnalysis from './components/GapAnalysis.jsx'
import LearningPath from './components/LearningPath.jsx'
import { fetchLiveJobs } from './lib/jooble.js'
import { scoreCV } from './lib/vsf-scorer.js'

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
      setJobs(liveJobs)
      setProgress({ current: 0, total: liveJobs.length, label: 'Scoring your CV against live roles...' })

      const results = []
      for (let i = 0; i < liveJobs.length; i++) {
        setProgress({ current: i + 1, total: liveJobs.length, label: `Scoring: ${liveJobs[i].title} @ ${liveJobs[i].company}` })
        try {
          const score = await scoreCV(cvText, liveJobs[i])
          results.push(score)
        } catch (err) {
          console.warn(`Scoring failed for ${liveJobs[i].title}:`, err.message)
        }
      }

      setScores(results)
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

  function handleSelectGap(gap) {
    setSelectedGap(gap)
    setPhase('learning')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-block">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="VSF Match logo">
              <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--color-primary)"/>
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
        {phase === 'input' && (
          <CVInput
            cvText={cvText} setCvText={setCvText}
            role={role} setRole={setRole}
            region={region} setRegion={setRegion}
            onRun={handleRun}
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
        <p>© 2026 ZenCloud Global Consultants · Velocity Success Factor™ · Brisbane, Australia</p>
      </footer>
    </div>
  )
}
