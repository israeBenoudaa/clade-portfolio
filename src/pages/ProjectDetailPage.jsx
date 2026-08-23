import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AXES } from '../data/projects'
import { useProject } from '../hooks/useProjects'
import { useSiteContent } from '../context/SiteContentContext'
import { useLanguage } from '../context/LanguageContext'
import { useCmsEditMode } from '../context/CmsEditMode'
import AnimatedLogo from '../components/ui/AnimatedLogo'
import PageTransition from '../components/ui/PageTransition'
import QuickContact from '../components/ui/QuickContact'

const sec = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

/* ── Gallery with lightbox ── */
function Gallery({ images, color }) {
  const [lightbox, setLightbox] = useState(null)
  const { t } = useLanguage()

  const prev = useCallback(() => setLightbox(i => (i - 1 + images.length) % images.length), [images.length])
  const next  = useCallback(() => setLightbox(i => (i + 1) % images.length), [images.length])
  const close = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, close, next, prev])

  /* ── Grid layout variants ── */
  const count = images.length

  /* Thumbnail card */
  const Card = ({ img, idx, style = {} }) => (
    <div
      onClick={() => setLightbox(idx)}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'zoom-in',
        background: '#08090A', ...style,
      }}
    >
      <div
        className="gallery-bg"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${img}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.62) saturate(0.72)',
          transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1), filter 0.4s',
        }}
      />
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,9,10,0.55) 0%, transparent 55%)', pointerEvents: 'none' }} />
      {/* Zoom icon on hover */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.25s', pointerEvents: 'none' }}
        className="gallery-zoom">
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(245,240,234,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', background: 'rgba(8,9,10,0.3)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2h4M2 2v4M14 2h-4M14 2v4M2 14h4M2 14v-4M14 14h-4M14 14v-4" stroke="rgba(245,240,234,0.9)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      {/* Index */}
      <div style={{ position: 'absolute', bottom: 14, right: 16, fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2, color: 'rgba(245,240,234,0.3)', pointerEvents: 'none' }}>
        {String(idx + 1).padStart(2, '0')}
      </div>
      <style>{`
        .gallery-card:hover .gallery-bg { transform: scale(1.07) !important; filter: brightness(0.78) saturate(0.88) !important; }
        .gallery-card:hover .gallery-zoom { opacity: 1 !important; }
      `}</style>
    </div>
  )

  /* Inline hover without class — use onMouseEnter/Leave */
  const HoverCard = ({ img, idx, style = {} }) => {
    const [hovered, setHovered] = useState(false)
    return (
      <div
        onClick={() => setLightbox(idx)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative', overflow: 'hidden', cursor: 'zoom-in', background: '#08090A', ...style }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${img}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hovered ? 'brightness(0.78) saturate(0.88)' : 'brightness(0.62) saturate(0.72)',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1), filter 0.4s',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,9,10,0.55) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.25s', pointerEvents: 'none' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${color}80`, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', background: 'rgba(8,9,10,0.3)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h4M2 2v4M14 2h-4M14 2v4M2 14h4M2 14v-4M14 14h-4M14 14v-4" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 14, right: 16, fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2, color: 'rgba(245,240,234,0.28)', pointerEvents: 'none' }}>
          {String(idx + 1).padStart(2, '0')}
        </div>
      </div>
    )
  }

  /* Build rows: alternate full-bleed and 2-up pairs */
  const buildRows = () => {
    const rows = []
    let i = 0
    while (i < count) {
      if (i === 0 || (count - i) % 2 === 1) {
        // Full-bleed single
        rows.push({ type: 'single', indices: [i] })
        i += 1
      } else {
        // Pair side by side
        rows.push({ type: 'pair', indices: [i, i + 1] })
        i += 2
      }
    }
    return rows
  }

  return (
    <motion.div {...sec(0.25)} style={{ padding: '0 0 clamp(5rem, 8vw, 7rem)' }}>

      {/* Grid — no label, clean editorial */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {buildRows().map((row, ri) =>
          row.type === 'single' ? (
            <HoverCard
              key={ri}
              img={images[row.indices[0]]}
              idx={row.indices[0]}
              style={{ height: count === 1 ? 'clamp(340px, 58vw, 720px)' : 'clamp(300px, 48vw, 620px)' }}
            />
          ) : (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              {row.indices.map(idx => (
                <HoverCard
                  key={idx}
                  img={images[idx]}
                  idx={idx}
                  style={{ height: 'clamp(220px, 32vw, 480px)' }}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(8,9,10,0.96)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Image */}
            <motion.img
              key={lightbox}
              src={images[lightbox]}
              alt=""
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '88vw', maxHeight: '84vh', objectFit: 'contain', userSelect: 'none', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}
            />

            {/* Close */}
            <button
              onClick={close}
              style={{ position: 'fixed', top: 24, right: 28, width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(245,240,234,0.18)', background: 'rgba(245,240,234,0.06)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(245,240,234,0.7)', transition: 'background 0.2s, color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,240,234,0.14)'; e.currentTarget.style.color = '#F5F0EA' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,240,234,0.06)'; e.currentTarget.style.color = 'rgba(245,240,234,0.7)' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Counter */}
            <div style={{ position: 'fixed', top: 32, left: '50%', transform: 'translateX(-50%)', fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, letterSpacing: 2.5, color: 'rgba(245,240,234,0.35)' }}>
              {String(lightbox + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </div>

            {/* Prev / Next (only if multiple) */}
            {count > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); prev() }}
                  style={{ position: 'fixed', left: 24, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(245,240,234,0.14)', background: 'rgba(245,240,234,0.05)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(245,240,234,0.6)', transition: 'background 0.2s, color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,240,234,0.12)'; e.currentTarget.style.color = '#F5F0EA' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,240,234,0.05)'; e.currentTarget.style.color = 'rgba(245,240,234,0.6)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L2 7l7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); next() }}
                  style={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(245,240,234,0.14)', background: 'rgba(245,240,234,0.05)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(245,240,234,0.6)', transition: 'background 0.2s, color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,240,234,0.12)'; e.currentTarget.style.color = '#F5F0EA' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,240,234,0.05)'; e.currentTarget.style.color = 'rgba(245,240,234,0.6)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 1l7 6-7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </>
            )}

            {/* Hint */}
            <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2, color: 'rgba(245,240,234,0.18)', whiteSpace: 'nowrap' }}>
              {t('project.lightbox', count > 1)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ProjectDetailPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { project, loading } = useProject(id)
  const [contactOpen, setContactOpen] = useState(false)
  const { editMode } = useCmsEditMode()
  const { t } = useLanguage()

  /* Call hooks unconditionally — use a fallback axis key until project loads */
  const axisKey   = project?.axis || 'A'
  const heroImage = useSiteContent(`discipline.${axisKey}.hero_image`, AXES[axisKey]?.heroImage || '')

  if (loading) return <div style={{ background: '#08090A', minHeight: '100vh' }} />
  if (!project) { navigate('/'); return null }

  const axis  = AXES[project.axis]
  const color = axis.color

  return (
    <PageTransition style={{ background: '#08090A', minHeight: '100vh', color: '#F5F0EA' }}>

      {/* ── NAVBAR — même structure que DisciplinePage ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64, padding: '0 clamp(2rem, 6vw, 7rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,9,10,0.88)', backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${color}20`,
      }}>
        <AnimatedLogo disciplineKey={project.axis} disciplineLabel={t('disc.' + project.axis + '.label')} color={color} />

        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
            letterSpacing: 2.5, textTransform: 'uppercase',
            color: 'rgba(245,240,234,0.35)', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#F5F0EA'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,234,0.35)'}
        >
          {t('back')}
        </button>
      </nav>

      {/* ── HERO ── */}
      <motion.div {...sec(0)} style={{ position: 'relative', height: '78vh', minHeight: 520, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${project.image || heroImage || axis.heroImage}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.78) saturate(0.85)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #08090A 0%, rgba(8,9,10,0.25) 45%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Admin-only edit button for hero image */}
        {editMode && (
          <div style={{ position: 'absolute', top: 72, right: 20, zIndex: 20 }}>
            <button
              data-cms-key={`discipline.${axisKey}.hero_image`}
              data-cms-type="image"
              data-cms-value={heroImage || axis.heroImage}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 11px',
                background: 'rgba(200,184,154,0.92)', backdropFilter: 'blur(8px)',
                border: 'none', borderRadius: 6,
                color: '#08090A', fontSize: 9, letterSpacing: 1.5,
                textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700, cursor: 'pointer',
              }}
            >
              ✎
            </button>
          </div>
        )}

        {/* Titre hero */}
        <div style={{
          position: 'absolute', bottom: 'clamp(3rem, 6vh, 5rem)',
          left: 'clamp(1.5rem, 5vw, 5rem)', right: 'clamp(1.5rem, 5vw, 5rem)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {project.tags.map(t => (
              <span key={t} style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 9,
                letterSpacing: 2, textTransform: 'uppercase',
                color: `${color}cc`, background: `${color}12`,
                border: `1px solid ${color}30`, borderRadius: 4, padding: '4px 10px',
              }}>{t}</span>
            ))}
          </div>
          <h1
            data-cms-key="title"
            data-cms-type="text"
            data-cms-table="portfolio_projects"
            data-cms-id={String(project.id)}
            data-cms-value={project.title}
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: 'clamp(36px, 6vw, 80px)',
              fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
              color: '#F5F0EA', margin: '0 0 16px',
            }}
          >
            {project.title}
          </h1>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span
              data-cms-key="location"
              data-cms-type="text"
              data-cms-table="portfolio_projects"
              data-cms-id={String(project.id)}
              data-cms-value={project.location}
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'rgba(245,240,234,0.45)', letterSpacing: 0.3 }}
            >
              {project.location}
            </span>
            <span style={{ width: 1, height: 10, background: 'rgba(245,240,234,0.15)' }} />
            <span
              data-cms-key="year"
              data-cms-type="text"
              data-cms-table="portfolio_projects"
              data-cms-id={String(project.id)}
              data-cms-value={project.year}
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'rgba(245,240,234,0.25)', letterSpacing: 1 }}
            >
              {project.year}
            </span>
          </div>
        </div>

        {/* Trait coloré */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
            transformOrigin: 'left',
          }}
        />
      </motion.div>

      {/* ── DÉTAILS ── */}
      <motion.div {...sec(0.1)} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 1, background: `${color}15`,
        borderBottom: `1px solid ${color}18`,
      }}>
        {[
          { label: t('project.surface'),   key: 'surface',   value: project.details.surface },
          { label: t('project.programme'), key: 'programme', value: project.details.programme },
          { label: t('project.statut'),    key: 'statut',    value: project.details.statut },
        ].map(({ label, key, value }) => (
          <div key={label} style={{
            padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 4vw, 3rem)',
            background: '#08090A',
            borderRight: `1px solid ${color}12`,
          }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 8,
              letterSpacing: 3, textTransform: 'uppercase',
              color: 'rgba(245,240,234,0.3)', marginBottom: 8,
            }}>{label}</div>
            <div
              data-cms-key={key}
              data-cms-type="text"
              data-cms-table="portfolio_projects"
              data-cms-id={String(project.id)}
              data-cms-value={value || ''}
              style={{
                fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(16px, 2vw, 22px)',
                fontWeight: 400, color: '#F5F0EA', lineHeight: 1.2,
              }}
            >{value}</div>
          </div>
        ))}
      </motion.div>

      {/* ── STORY ── */}
      <motion.div {...sec(0.18)} style={{
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 5rem)',
        maxWidth: 900, margin: '0 auto',
      }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 9,
          letterSpacing: 3.5, textTransform: 'uppercase', color,
          display: 'block', marginBottom: 32,
        }}>
          {t('project.story')}
        </span>

        <div
          data-cms-key="story"
          data-cms-type="multiline"
          data-cms-table="portfolio_projects"
          data-cms-id={String(project.id)}
          data-cms-value={project.story}
        >
          {project.story.split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontFamily: i === 0 ? 'Instrument Serif, serif' : 'DM Sans, sans-serif',
              fontSize: i === 0 ? 'clamp(22px, 3vw, 32px)' : 'clamp(15px, 1.8vw, 18px)',
              fontWeight: 400, lineHeight: i === 0 ? 1.4 : 1.8,
              color: i === 0 ? '#F5F0EA' : 'rgba(245,240,234,0.55)',
              letterSpacing: i === 0 ? '-0.01em' : 0,
              margin: '0 0 clamp(1.5rem, 3vw, 2.5rem)',
            }}>
              {para}
            </p>
          ))}
        </div>
      </motion.div>

      {/* ── GALERIE ── */}
      {project.gallery?.length > 0 && (
        <Gallery images={project.gallery} color={color} />
      )}

      {/* ── CTA ── */}
      <motion.div {...sec(0.32)} style={{
        margin: '0 clamp(1.5rem, 5vw, 5rem) clamp(5rem, 8vw, 7rem)',
        padding: 'clamp(3rem, 6vw, 5rem)',
        border: `1px solid ${color}22`,
        borderRadius: 4,
        background: `${color}06`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 28,
      }}>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 3.5, textTransform: 'uppercase', color: `${color}aa` }}>
          {t('project.cta_supertitle')}
        </span>
        <h3 style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(28px, 4vw, 52px)',
          fontWeight: 400, color: '#F5F0EA', lineHeight: 1.1,
          letterSpacing: '-0.02em', margin: 0,
        }}>
          {t('project.cta_line1')}<br />
          <em style={{ color: 'rgba(245,240,234,0.28)' }}>{t('project.cta_line2')}</em>
        </h3>
        <button
          onClick={() => setContactOpen(true)}
          style={{
            background: color, color: '#08090A',
            border: 'none', borderRadius: 40,
            padding: '15px 36px',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase',
            cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}40` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
        >
          {t('project.cta_btn')}
        </button>
      </motion.div>

      <QuickContact open={contactOpen} onClose={() => setContactOpen(false)} projectRef={project.title} />

    </PageTransition>
  )
}
