import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AXES } from '../../data/projects'
import { useProjects } from '../../hooks/useProjects'
import { useLanguage } from '../../context/LanguageContext'

// Repeating column pattern — rows sum to 12
// [8,4] [4,4,4] [6,6] [4,8] = 9 projects per cycle
const COL_PATTERN = [8, 4, 4, 4, 4, 6, 6, 4, 8]

export default function ProjectsGrid() {
  const [hovered, setHovered] = useState(null)
  const [tapped, setTapped]   = useState(null)
  const [isTouch, setIsTouch] = useState(false)
  const navigate = useNavigate()
  const { projects, loading } = useProjects()
  const { t } = useLanguage()

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  if (loading) return <section id="projets" style={{ background: '#08090A', minHeight: 400 }} />

  return (
    <section id="projets" style={{ background: '#08090A', paddingBottom: '6rem' }}>

      {/* Header */}
      <div style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(2rem, 6vw, 7rem) 3rem',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(245,240,234,0.06)',
      }}>
        <div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 3.5, textTransform: 'uppercase', color: 'rgba(245,240,234,0.3)' }}>
            {t('projects.supertitle')}
          </span>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 400, color: '#F5F0EA', marginTop: 10, lineHeight: 1, letterSpacing: -0.5 }}>
            {t('projects.h2')}
          </h2>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 3, padding: 3,
      }}>
        {projects.map((project, i) => {
          const axis       = AXES[project.axis]
          const cols       = COL_PATTERN[i % COL_PATTERN.length] || 4
          const isFeatured = cols >= 8
          const isH        = hovered === project.id
          const isTapped   = isTouch && tapped === project.id
          const show       = isH || isTapped

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
                gridColumn: `span ${cols}`,
                position: 'relative', overflow: 'hidden',
                background: '#08090A', cursor: 'pointer',
                height: isFeatured
                  ? 'clamp(300px, 40vw, 520px)'
                  : 'clamp(220px, 28vw, 380px)',
              }}
            >
              {/* Image */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url('${project.image || project.image_url}')`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.6s',
                transform: isH ? 'scale(1.04)' : 'scale(1)',
                filter: show
                  ? 'brightness(0.88) saturate(0.9)'
                  : 'brightness(0.28) saturate(0.4)',
              }} />

              {/* Gradient — plus dense en bas */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(8,9,10,0.96) 0%, rgba(8,9,10,0.3) 50%, transparent 100%)',
              }} />

              {/* Filet couleur discipline en haut */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(to right, ${axis.color}, transparent)`,
                opacity: show ? 1 : 0.3,
                transition: 'opacity 0.4s',
              }} />

              {/* Discipline — toujours visible, petit et discret */}
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


              {/* Contenu bas */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: isFeatured ? 'clamp(22px, 3vw, 40px)' : 'clamp(16px, 2.5vw, 26px)',
                transform: show ? 'translateY(0)' : 'translateY(10px)',
                transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                  <h3 style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: isFeatured ? 'clamp(22px, 3vw, 38px)' : 'clamp(16px, 2vw, 24px)',
                    fontWeight: 400, color: '#F5F0EA', lineHeight: 1.15,
                    margin: 0,
                    opacity: show ? 1 : isTouch ? 0.85 : 0.55,
                    transition: 'opacity 0.4s',
                  }}>
                    {project.title}
                  </h3>
                  {isTouch && (
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/projet/${project.id}`) }}
                      style={{
                        flexShrink: 0,
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'rgba(245,240,234,0.08)',
                        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(245,240,234,0.25)',
                        color: '#F5F0EA', fontSize: 22,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: isTapped ? 1 : 0,
                        transform: isTapped ? 'scale(1)' : 'scale(0.7)',
                        transition: 'opacity 0.3s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    >
                      +
                    </button>
                  )}
                </div>
                <div style={{
                  display: 'flex', gap: 10, alignItems: 'center',
                  opacity: show ? 0.55 : 0,
                  transition: 'opacity 0.35s 0.05s',
                }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'rgba(245,240,234,0.8)', letterSpacing: 0.3 }}>
                    {project.location}
                  </span>
                  <span style={{ width: 1, height: 8, background: 'rgba(245,240,234,0.2)' }} />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'rgba(245,240,234,0.5)', letterSpacing: 1 }}>
                    {project.year}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
