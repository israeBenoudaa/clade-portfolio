import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AXES } from '../../data/projects'
import { useProjects } from '../../hooks/useProjects'
import { useLanguage } from '../../context/LanguageContext'

// Max projects to display in the mosaic
const MAX_SHOWCASE = 10

// Explicit CSS grid placement for each slot (12-col grid, 1-based line numbers)
// Row heights: 280 · 280 · 240 · 220 · 200  (desktop)
const PLACEMENTS = [
  { col: '1 / 8',  row: '1 / 3' },  // 0 — hero: 7 cols × 2 rows
  { col: '8 / 13', row: '1 / 2' },  // 1 — top-right: 5 cols × 1 row
  { col: '8 / 13', row: '2 / 3' },  // 2 — mid-right: 5 cols × 1 row
  { col: '1 / 5',  row: '3 / 4' },  // 3 — left strip: 4 cols
  { col: '5 / 9',  row: '3 / 4' },  // 4 — center strip: 4 cols
  { col: '9 / 13', row: '3 / 4' },  // 5 — right strip: 4 cols
  { col: '1 / 7',  row: '4 / 5' },  // 6 — left wide: 6 cols
  { col: '7 / 13', row: '4 / 5' },  // 7 — right wide: 6 cols
  { col: '1 / 6',  row: '5 / 6' },  // 8 — left narrow: 5 cols
  { col: '6 / 13', row: '5 / 6' },  // 9 — right wide: 7 cols
]

// Row heights depend on how many projects we actually render
function templateRows(count) {
  if (count <= 3) return '280px 280px'
  if (count <= 6) return '280px 280px 240px'
  if (count <= 8) return '280px 280px 240px 220px'
  return '280px 280px 240px 220px 200px'
}

// Round-robin across axes C/L/A/D/E to avoid architecture dominance
function balancedShowcase(projects, max) {
  const axes = ['A', 'C', 'L', 'D', 'E']
  const buckets = {}
  axes.forEach(a => { buckets[a] = [] })
  projects.forEach(p => { if (buckets[p.axis]) buckets[p.axis].push(p) })

  const result = []
  let round = 0
  while (result.length < max) {
    let added = false
    for (const axis of axes) {
      if (buckets[axis][round]) {
        result.push(buckets[axis][round])
        if (result.length >= max) return result
        added = true
      }
    }
    if (!added) break
    round++
  }
  return result
}

export default function ProjectsGrid() {
  const [hovered, setHovered] = useState(null)
  const [tapped,  setTapped]  = useState(null)
  const [isTouch, setIsTouch] = useState(false)
  const navigate = useNavigate()
  const { projects, loading } = useProjects()
  const { t } = useLanguage()

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  if (loading) return <section id="projets" style={{ background: '#08090A', minHeight: 400 }} />

  const showcase = balancedShowcase(projects, MAX_SHOWCASE)
  const extra    = projects.length - showcase.length

  return (
    <section id="projets" style={{ background: '#08090A', paddingBottom: '1rem' }}>

      {/* ── Header ── */}
      <div style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(2rem, 6vw, 7rem) 3rem',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(245,240,234,0.06)',
      }}>
        <div>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 9,
            letterSpacing: 3.5, textTransform: 'uppercase', color: 'rgba(245,240,234,0.3)',
          }}>
            {t('projects.supertitle')}
          </span>
          <h2 style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 400,
            color: '#F5F0EA', marginTop: 10, lineHeight: 1, letterSpacing: -0.5,
          }}>
            {t('projects.h2')}
          </h2>
        </div>
      </div>

      {/* ── Mosaic grid ── */}
      <div
        className="projects-mosaic"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: templateRows(showcase.length),
          gap: 3,
          padding: 3,
        }}
      >
        {showcase.map((project, i) => {
          const axis    = AXES[project.axis]
          const place   = PLACEMENTS[i]
          const isHero  = i === 0
          const isH     = hovered === project.id
          const isTap   = isTouch && tapped === project.id
          const show    = isH || isTap

          const handleClick = () => {
            if (!isTouch) return navigate(`/projet/${project.id}`)
            setTapped(prev => prev === project.id ? null : project.id)
          }

          return (
            <div
              key={project.id}
              onMouseEnter={() => !isTouch && setHovered(project.id)}
              onMouseLeave={() => !isTouch && setHovered(null)}
              onClick={handleClick}
              style={{
                gridColumn: place?.col || 'auto',
                gridRow:    place?.row || 'auto',
                position: 'relative', overflow: 'hidden',
                background: '#08090A', cursor: 'pointer',
              }}
            >
              {/* Image — fills the grid cell */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url('${project.image || project.image_url}')`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'transform 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.5s',
                transform: isH ? 'scale(1.05)' : 'scale(1)',
                filter: show ? 'brightness(0.9) saturate(0.95)' : 'brightness(0.82) saturate(0.88)',
              }} />

              {/* Gradient vignette */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(8,9,10,0.88) 0%, rgba(8,9,10,0.06) 45%, transparent 100%)',
                transition: 'opacity 0.4s',
              }} />

              {/* Discipline colour line — top */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(to right, ${axis.color}, transparent)`,
                opacity: show ? 1 : 0.35, transition: 'opacity 0.4s',
              }} />

              {/* Axis label */}
              <div style={{
                position: 'absolute', top: 18, left: 20,
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <div style={{ width: 14, height: 1, background: axis.color + 'cc' }} />
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 8,
                  letterSpacing: 2.5, textTransform: 'uppercase', color: axis.color + 'cc',
                }}>
                  {axis.label}
                </span>
              </div>

              {/* Bottom content */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: isHero
                  ? 'clamp(20px, 3vw, 44px)'
                  : 'clamp(14px, 2vw, 26px)',
                transform: show ? 'translateY(0)' : 'translateY(8px)',
                transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                <h3 style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: isHero
                    ? 'clamp(22px, 3.2vw, 40px)'
                    : 'clamp(13px, 1.6vw, 21px)',
                  fontWeight: 400, color: '#F5F0EA',
                  lineHeight: 1.15, margin: '0 0 8px',
                  opacity: show ? 1 : 0.78, transition: 'opacity 0.4s',
                }}>
                  {project.title}
                </h3>
                <div style={{
                  display: 'flex', gap: 10, alignItems: 'center',
                  opacity: show ? 0.65 : 0, transition: 'opacity 0.3s 0.05s',
                }}>
                  {project.location && (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, color: 'rgba(245,240,234,0.9)', letterSpacing: 0.3 }}>
                      {project.location}
                    </span>
                  )}
                  {project.location && project.year && (
                    <span style={{ width: 1, height: 8, background: 'rgba(245,240,234,0.2)', flexShrink: 0 }} />
                  )}
                  {project.year && (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, color: 'rgba(245,240,234,0.5)', letterSpacing: 1 }}>
                      {project.year}
                    </span>
                  )}
                </div>

              </div>

              {/* Touch "+" — visible by default, hidden on tap (info appears) */}
              {isTouch && (
                <button
                  onClick={e => { e.stopPropagation(); navigate(`/projet/${project.id}`) }}
                  style={{
                    position: 'absolute', bottom: 10, right: 10, zIndex: 10,
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(245,240,234,0.13)',
                    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(245,240,234,0.28)',
                    color: 'rgba(245,240,234,0.9)',
                    fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', lineHeight: 1,
                    opacity: isTap ? 1 : 0,
                    pointerEvents: isTap ? 'auto' : 'none',
                    transition: 'opacity 0.3s',
                  }}
                >
                  +
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* ── & more ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'clamp(20px, 3.5vw, 56px)',
        padding: 'clamp(20px, 2.5vw, 36px) clamp(1.5rem, 4vw, 5rem)',
        borderTop: '1px solid rgba(245,240,234,0.07)',
      }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(245,240,234,0.1))' }} />
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'Instrument Serif, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(22px, 2.8vw, 38px)',
            fontWeight: 400,
            color: 'rgba(245,240,234,0.28)',
            lineHeight: 1,
            letterSpacing: '-0.01em',
            userSelect: 'none',
          }}>
            {t('projects.more')}
          </div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(7px, 0.85vw, 10px)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,234,0.15)',
            marginTop: 8,
            userSelect: 'none',
          }}>
            {t('projects.more_subtitle')}
          </div>
        </div>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(245,240,234,0.1))' }} />
      </div>

      {/* ── Mobile override ── */}
      <style>{`
        @media (max-width: 680px) {
          .projects-mosaic {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: auto !important;
            gap: 2px !important;
          }
          .projects-mosaic > div {
            grid-column: auto !important;
            grid-row: auto !important;
            height: clamp(130px, 40vw, 175px);
          }
          /* Cards 1, 4, 7, 10 → full width, taller — creates a 1-2-1-2 rhythm */
          .projects-mosaic > div:nth-child(3n+1) {
            grid-column: 1 / -1 !important;
            height: clamp(190px, 52vw, 230px);
          }
        }
      `}</style>
    </section>
  )
}
