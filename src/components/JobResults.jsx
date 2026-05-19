import React from 'react'
import { getBand } from '../lib/vsf-scorer.js'

export default function JobResults({ results = [], onSelectJob }) {
  return (
    <div className="results-grid">
      {results.map((job) => {
        const liveUrl = job.sourceUrl || job.link || job.url || ''
        const band = getBand(job.overallScore || 0)

        return (
          <article className="result-card" key={job.jobId || job.id || `${job.jobTitle || job.title}-${job.company}`}>
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
                  <h3 className="result-card__title">{job.jobTitle || job.title}</h3>
                )}

                <p className="result-card__company">{job.company}</p>
                <p className="result-card__location">{job.location}</p>
              </div>

              <div className="result-card__score" style={{ color: band.color }}>
                <div className="result-card__score-num">{job.overallScore}</div>
                <div className="result-card__score-band">{band.label}</div>
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
                  Open original job posting
                </a>
              ) : (
                <span className="btn-apply btn-apply--disabled">No live link available</span>
              )}

              <button className="btn-secondary" onClick={() => onSelectJob?.(job)}>
                View analysis
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}