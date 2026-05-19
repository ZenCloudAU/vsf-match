import React from 'react'
import { getBand } from '../lib/vsf-scorer.js'

export default function JobResults({ results = [], onSelectJob, onReset }) {
  return (
    <div className="results-screen">
      <div className="results-header">
        <div>
          <h2>Match Results</h2>
          <p className="results-meta">
            {results.length} role{results.length !== 1 ? 's' : ''} scored against your CV
          </p>
        </div>
        <button className="btn-secondary" onClick={onReset}>← New Search</button>
      </div>

      <div className="results-grid">
        {results.map((job, idx) => {
          const liveUrl = job.sourceUrl || job.link || job.url || ''
          const band = getBand(job.overallScore || 0)

          return (
            <article
              className="result-card"
              key={job.jobId || job.id || `${job.jobTitle || job.title}-${job.company}`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="result-card__top">
                <div className="result-card__title-wrap">
                  {liveUrl ? (
                    <a
                      className="result-card__title"
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {job.jobTitle || job.title}
                    </a>
                  ) : (
                    <span className="result-card__title">{job.jobTitle || job.title}</span>
                  )}
                  <p className="result-card__company">{job.company}</p>
                  <p className="result-card__location">{job.location}</p>
                </div>

                <div className="result-card__score" style={{ color: band.color }}>
                  <span className="result-card__score-num">{job.overallScore}</span>
                  <span className="result-card__score-band">{band.label}</span>
                </div>
              </div>

              <div className="result-card__meta">
                <span className="result-card__recommendation">{job.applyRecommendation}</span>
                <span className="result-card__match">{job.matchStrength}</span>
              </div>

              <p className="result-card__summary">
                {job.applyRationale || job.snippet || ''}
              </p>

              <div className="result-card__actions">
                {liveUrl ? (
                  <a
                    className="btn-apply"
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open job posting ↗
                  </a>
                ) : (
                  <span className="btn-apply btn-apply--disabled">No live link</span>
                )}

                <button className="btn-secondary" onClick={() => onSelectJob?.(job)}>
                  View full analysis
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
