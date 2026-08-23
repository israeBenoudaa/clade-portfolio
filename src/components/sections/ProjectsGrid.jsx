import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AXES } from '../../data/projects'
import { useProjects } from '../../hooks/useProjects'
import { useLanguage } from '../../context/LanguageContext'

// Initial projects shown in the mosaic
const INITIAL_SHOWCASE = 10

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
  const [showAll, setShowAll] = useState(false)
  const navigate = useNavigate()
  const { projects, loading } = useProjects()
  const { t } = useLanguage()

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  if (loading) return <section id="projets" style={{ background: '#08090A', minHeight: 400 }} />

  const showcase = balancedShowcase(projects, showAll ? projects.length : INITIAL_SHOWCASE)
  const hasMore  = projects.length > INITIAL_SHOWCASE && !showAll

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

              {/* Axis label — always visible, bold style */}
              <div style={{
                position: 'absolute', top: 14, left: 16,
                display: 'flex', alignItems: 'center', gap: 6,
                zIndex: 2,
              }}>
                <div style={{
                  width: 16, height: 1.5,
                  background: axis.color,
                  borderRadius: 2,
                  opacity: 0.9,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: isHero ? 10 : 9,
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: axis.color,
                  textShadow: '0 1px 6px rgba(0,0,0,0.7)',
                }}>
                  {axis.label}
                </span>
              </div>

              {/* Bottom content */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: isHero
                  ? 'clamp(20px, 3vw, 44px)'
                  : 'clamp(12px, 1.8vw, 22px)',
                transform: show ? 'translateY(0)' : 'translateY(6px)',
                transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                <h3 className="proj-title" style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: isHero
                    ? 'clamp(24px, 3.2vw, 42px)'
                    : 'clamp(15px, 1.8vw, 22px)',
                  fontWeight: 400, color: '#F5F0EA',
                  lineHeight: 1.15, margin: '0 0 6px',
                  textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  opacity: 1, transition: 'opacity 0.4s',
                }}>
                  {project.title}
                </h3>
                <div style={{
                  display: 'flex', gap: 8, alignItems: 'center',
                  opacity: show ? 0.7 : 0, transition: 'opacity 0.3s 0.05s',
                }}>
                  {project.location && (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, color: 'rgba(245,240,234,0.9)', letterSpacing: 0.3 }}>
                      {project.location}
                    </span>
                  )}
                  {project.location && project.year && (
                    <span style={{ width: 1, height: 8, background: 'rgba(245,240,234,0.25)', flexShrink: 0 }} />
                  )}
                  {project.year && (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, color: 'rgba(245,240,234,0.55)', letterSpacing: 1 }}>
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

      {/* ── Show more button ── */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(16px, 3vw, 48px)',
            padding: 'clamp(28px, 4vw, 52px) clamp(1.5rem, 4vw, 5rem)',
            borderTop: '1px solid rgba(245,240,234,0.07)',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(245,240,234,0.08))' }} />
          <button
            onClick={() => setShowAll(true)}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 10, fontWeight: 600, letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,234,0.65)',
              background: 'transparent',
              border: '1px solid rgba(245,240,234,0.16)',
              borderRadius: 40,
              padding: 'clamp(12px, 1.4vw, 16px) clamp(28px, 3.5vw, 48px)',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'color 0.3s, border-color 0.3s, background 0.3s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#F5F0EA'
              e.currentTarget.style.borderColor = 'rgba(245,240,234,0.4)'
              e.currentTarget.style.background = 'rgba(245,240,234,0.05)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(245,240,234,0.65)'
              e.currentTarget.style.borderColor = 'rgba(245,240,234,0.16)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {t('projects.show_more')}
          </button>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(245,240,234,0.08))' }} />
        </motion.div>
      )}

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
            height: clamp(140px, 42vw, 180px);
          }
          .projects-mosaic > div:nth-child(3n+1) {
            grid-column: 1 / -1 !important;
            height: clamp(200px, 55vw, 240px);
          }
          .projects-mosaic .proj-title {
            font-size: 14px !important;
            line-height: 1.2 !important;
          }
          .projects-mosaic > div:nth-child(3n+1) .proj-title {
            font-size: 20px !important;
          }
        }
      `}</style>
    </section>
  )
}
