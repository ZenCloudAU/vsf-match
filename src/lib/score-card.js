import { getBand } from './vsf-scorer.js'

export function downloadScoreCard(job) {
  const band  = getBand(job.overallScore || 0)
  const svg   = buildSVG(job, band)
  const blob  = new Blob([svg], { type: 'image/svg+xml' })
  const url   = URL.createObjectURL(blob)
  const a     = document.createElement('a')
  a.href      = url
  a.download  = `VSF-ScoreCard-${(job.jobTitle || 'score').replace(/\s+/g, '-').substring(0, 40)}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function buildSVG(job, band) {
  const W = 500, H = 320
  const dims = job.dimensions || {}
  const dimRows = [
    { label: 'Scale of Impact',   score: dims.scaleOfImpact?.score         ?? 0 },
    { label: 'Complexity',         score: dims.complexityGoverned?.score    ?? 0 },
    { label: 'Authority Held',     score: dims.authorityHeld?.score         ?? 0 },
    { label: 'Outcome Integrity',  score: dims.outcomeIntegrity?.score      ?? 0 },
    { label: 'Capability',         score: dims.capabilityTransferred?.score ?? 0 },
  ]

  const dimBars = dimRows.map((d, i) => {
    const y    = 156 + i * 22
    const barW = Math.round((d.score / 10) * 150)
    return `
  <text x="28" y="${y}" font-family="Courier New,monospace" font-size="10" fill="#64748B">${esc(d.label)}</text>
  <rect x="178" y="${y - 12}" width="150" height="10" rx="2" fill="#1E293B"/>
  <rect x="178" y="${y - 12}" width="${barW}" height="10" rx="2" fill="${esc(band.color)}"/>
  <text x="338" y="${y}" font-family="Courier New,monospace" font-size="10" fill="#94A3B8">${d.score.toFixed(1)}</text>`
  }).join('')

  const location = job.location ? ` · ${esc(job.location)}` : ''
  const rec = esc(job.applyRecommendation || '')
  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)" rx="10"/>
  <rect width="${W}" height="5" fill="${esc(band.color)}" rx="0"/>

  <text x="28" y="40" font-family="Courier New,monospace" font-size="11" fill="#E8630A" letter-spacing="2">VSF MATCH</text>
  <text x="28" y="64" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="22" font-weight="700" fill="#F8FAFC">${esc(job.jobTitle || '')}</text>
  <text x="28" y="82" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="13" fill="#64748B">${esc(job.company || '')}${location}</text>
  <text x="28" y="104" font-family="Courier New,monospace" font-size="10" fill="#E8630A" letter-spacing="1">${rec}</text>

  <text x="${W - 28}" y="58" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="52" font-weight="800" fill="${esc(band.color)}" text-anchor="end">${job.overallScore}</text>
  <text x="${W - 28}" y="77" font-family="Courier New,monospace" font-size="9.5" fill="#94A3B8" text-anchor="end" letter-spacing="0.5">${esc(band.label.toUpperCase())}</text>

  <line x1="28" y1="118" x2="${W - 28}" y2="118" stroke="#334155" stroke-width="1"/>
  <text x="28" y="140" font-family="Courier New,monospace" font-size="9" fill="#475569" letter-spacing="1.5">VSF DIMENSIONS</text>
  ${dimBars}

  <line x1="28" y1="${H - 38}" x2="${W - 28}" y2="${H - 38}" stroke="#334155" stroke-width="1"/>
  <text x="28" y="${H - 20}" font-family="Courier New,monospace" font-size="9" fill="#475569">velocity-academy.pages.dev</text>
  <text x="${W - 28}" y="${H - 20}" font-family="Courier New,monospace" font-size="9" fill="#475569" text-anchor="end">Velocity Success Factor™ · ZenCloud · ${esc(date)}</text>
</svg>`
}
