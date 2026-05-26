import React from 'react'

const DIMS = [
  { key: 'scaleOfImpact',         label: 'SCALE',      angle: 0   },
  { key: 'complexityGoverned',     label: 'COMPLEXITY', angle: 72  },
  { key: 'authorityHeld',         label: 'AUTHORITY',  angle: 144 },
  { key: 'outcomeIntegrity',      label: 'OUTCOME',    angle: 216 },
  { key: 'capabilityTransferred', label: 'CAPABILITY', angle: 288 },
]

const CX = 130
const CY = 130
const R  = 82
const LABEL_R = 106
const BENCHMARK = 7.5

function polar(angleDeg, r) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function pts(points) {
  return points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
}

function anchorFor(angle) {
  if (angle === 0 || angle === 180) return 'middle'
  return angle > 0 && angle < 180 ? 'start' : 'end'
}

function baselineFor(angle) {
  if (angle === 0) return 'auto'
  if (angle === 180) return 'hanging'
  return 'middle'
}

export default function VsfRadar({ dimensions, bandColor }) {
  if (!dimensions || Object.keys(dimensions).length === 0) return null

  const scorePoints  = DIMS.map(d => polar(d.angle, ((dimensions[d.key]?.score ?? 0) / 10) * R))
  const benchPoints  = DIMS.map(d => polar(d.angle, (BENCHMARK / 10) * R))
  const rings        = [2.5, 5, 7.5, 10]

  return (
    <div className="vsf-radar-wrap">
      <svg
        width={260} height={260}
        viewBox="0 0 260 260"
        overflow="visible"
        aria-label="VSF dimension radar chart"
        className="vsf-radar-svg"
      >
        {/* Grid rings */}
        {rings.map(v => (
          <polygon
            key={v}
            points={pts(DIMS.map(d => polar(d.angle, (v / 10) * R)))}
            fill="none" stroke="#E2E8F0" strokeWidth="1"
          />
        ))}

        {/* Axis spokes */}
        {DIMS.map(d => {
          const end = polar(d.angle, R)
          return <line key={d.key} x1={CX} y1={CY} x2={end.x} y2={end.y} stroke="#E2E8F0" strokeWidth="1" />
        })}

        {/* Benchmark ring — 7.5 */}
        <polygon
          points={pts(benchPoints)}
          fill="none"
          stroke="#D97706" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.65"
        />

        {/* Score fill */}
        <polygon
          points={pts(scorePoints)}
          fill={bandColor || '#E8630A'} fillOpacity="0.13"
          stroke={bandColor || '#E8630A'} strokeWidth="2" strokeLinejoin="round"
        />

        {/* Vertex dots */}
        {scorePoints.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill={bandColor || '#E8630A'} />
        ))}

        {/* Axis labels */}
        {DIMS.map(d => {
          const lp = polar(d.angle, LABEL_R)
          return (
            <text
              key={d.key}
              x={lp.x} y={lp.y}
              textAnchor={anchorFor(d.angle)}
              dominantBaseline={baselineFor(d.angle)}
              fontSize="8.5"
              fontFamily="'DM Mono', monospace"
              letterSpacing="0.09em"
              fill="#94A3B8"
            >
              {d.label}
            </text>
          )
        })}

        {/* Ring value labels at 5 and 10 */}
        {[5, 10].map(v => {
          const pt = polar(0, (v / 10) * R)
          return (
            <text key={v} x={pt.x + 4} y={pt.y} fontSize="7.5" fontFamily="'DM Mono', monospace"
              fill="#CBD5E1" dominantBaseline="middle">
              {v}
            </text>
          )
        })}
      </svg>

      <div className="vsf-radar-legend">
        <span className="vsf-radar-legend-score" style={{ borderColor: bandColor || '#E8630A' }}>
          Your score
        </span>
        <span className="vsf-radar-legend-bench">
          7.5 benchmark
        </span>
      </div>
    </div>
  )
}
