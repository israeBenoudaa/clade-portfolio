import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AXES } from '../data/projects'
import { useProjects } from '../hooks/useProjects'
import { useSiteContent, useSiteContentJson } from '../context/SiteContentContext'
import { useLanguage } from '../context/LanguageContext'
import AnimatedLogo from '../components/ui/AnimatedLogo'
import PageTransition from '../components/ui/PageTransition'
import QuickContact from '../components/ui/QuickContact'

// Phrases par discipline (même format que Hero)
const PHRASES = {
  C: [
    { line1: 'Préserver', line2: "ce qui porte la mémoire des lieux" },
    { line1: 'Restaurer', line2: "sans effacer les traces du temps" },
    { line1: 'Transmettre', line2: "l'héritage bâti aux générations futures" },
  ],
  L: [
    { line1: 'Composer', line2: "avec la nature, pas contre elle" },
    { line1: 'Lire', line2: "le territoire avant de le toucher" },
    { line1: 'Relier', line2: "le vivant et le construit" },
  ],
  A: [
    { line1: 'Concevoir', line2: "des espaces qui habitent le territoire" },
    { line1: 'Construire', line2: "avec la lumière et la matière" },
    { line1: 'Habiter', line2: "le geste juste, toujours" },
  ],
  D: [
    { line1: 'Donner forme', line2: "aux identités singulières" },
    { line1: 'Créer', line2: "des objets qui durent" },
    { line1: 'Révéler', line2: "la beauté de l'utile" },
  ],
  E: [
    { line1: 'Installer', line2: "le temps d'un instant" },
    { line1: 'Marquer', line2: "sans laisser de trace durable" },
    { line1: 'Célébrer', line2: "l'architecture du moment présent" },
  ],
}

const HERO_IMAGES = {
  C: 'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=1800&q=80&auto=format&fit=crop',
  L: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1800&q=80&auto=format&fit=crop',
  A: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1800&q=80&auto=format&fit=crop',
  D: 'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?w=1800&q=80&auto=format&fit=crop',
  E: 'https://images.unsplash.com/photo-1519619091416-f5d55b8d0e39?w=1800&q=80&auto=format&fit=crop',
}

export default function DisciplinePage() {
  const { key }  = useParams()
  const navigate = useNavigate()
  const K        = key?.toUpperCase()
  const axis     = AXES[K]

  const [phraseIdx, setPhraseIdx]     = useState(0)
  const [contactOpen, setContactOpen] = useState(false)
  const { t } = useLanguage()
  const { projects }                  = useProjects(K)
  const phrasesFromDB                 = useSiteContentJson(`discipline.${K}.phrases`, PHRASES[K] ?? [])
  const phrases                       = phrasesFromDB.length ? phrasesFromDB : (PHRASES[K] ?? [])
  const heroImage                     = useSiteContent(`discipline.${K}.hero_image`, HERO_IMAGES[K] ?? '')

  useEffect(() => {
    if (!axis) { navigate('/'); return }
    if (phrases.length < 2) return
    const id = setInterval(() => setPhraseIdx(i => (i + 1) % phrases.length), 4500)
    return () => clearInterval(id)
  }, [K, axis, navigate, phrases.length])

  if (!axis) return null

  const color = axis.color

  return (
    <PageTransition style={{ background: '#08090A', minHeight: '100vh', color: '#F5F0EA' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64, padding: '0 clamp(2rem, 6vw, 7rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,9,10,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${color}20`,
      }}>
        <AnimatedLogo disciplineKey={K} disciplineLabel={t('disc.' + K + '.label')} color={color} />

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', padding: 0,
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
            letterSpacing: 2.5, textTransform: 'uppercase',
            color: 'rgba(245,240,234,0.35)',
            transition: 'color 0.2s', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#F5F0EA'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,234,0.35)'}
        >
          {t('back')}
        </button>
      </nav>

      {/* ── HERO image ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', height: '42vh', minHeight: 380, overflow: 'hidden' }}
      >
        <div
          data-cms-key={`discipline.${K}.hero_image`}
          data-cms-type="image"
          data-cms-value={heroImage}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${heroImage}')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'brightness(0.28) saturate(0.4)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, #08090A 0%, ${color}12 50%, transparent 100%)`,
        }} />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 1,
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
            transformOrigin: 'left',
          }}
        />
      </motion.section>

      {/* ── TEXTE ANIMÉ (même style que Hero) ── */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          padding: 'clamp(4rem, 9vw, 7rem) clamp(2rem, 6vw, 7rem)',
          borderBottom: '1px solid rgba(245,240,234,0.06)',
        }}
      >
        <div
          data-cms-key={`discipline.${K}.phrases`}
          data-cms-type="json-phrases"
          data-cms-value={JSON.stringify(phrases)}
          style={{ marginBottom: 'clamp(2.5rem, 5vh, 4rem)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIdx}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(40px, 7vw, 100px)',
                fontWeight: 400, lineHeight: 1,
                color: '#F5F0EA', letterSpacing: '-0.025em',
              }}>
                {phrases[phraseIdx]?.line1}
              </div>
              <div style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(40px, 7vw, 100px)',
                fontWeight: 400, fontStyle: 'italic',
                lineHeight: 1.05, letterSpacing: '-0.025em',
                color: 'rgba(245,240,234,0.35)',
              }}>
                {phrases[phraseIdx]?.line2}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicateurs */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {phrases.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhraseIdx(i)}
              style={{
                width: i === phraseIdx ? 28 : 6,
                height: 1,
                background: i === phraseIdx ? color : 'rgba(245,240,234,0.18)',
                border: 'none', padding: 0,
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* ── PROJETS ── */}
      <motion.section
        id="projets"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
        style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(2rem, 6vw, 7rem)' }}
      >
        <div style={{ marginBottom: '3rem' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 3.5, textTransform: 'uppercase', color: 'rgba(245,240,234,0.25)' }}>
            {t('disc.works')}
          </span>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 400, color: '#F5F0EA', marginTop: 10, lineHeight: 1 }}>
            {t('disc.projects_count', projects.length, t('disc.' + K + '.label'))}
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
          gap: 3,
        }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => navigate(`/projet/${project.id}`)}
              style={{ position: 'relative', overflow: 'hidden', height: 340, background: '#0D0E10', cursor: 'pointer' }}
            >
              <div
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url('${project.image}')`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  filter: 'brightness(0.4) saturate(0.6)',
                  transition: 'transform 0.7s, filter 0.4s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.filter = 'brightness(0.55) saturate(0.7)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'brightness(0.4) saturate(0.6)' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, rgba(8,9,10,0.95) 0%, ${color}10 60%, transparent 100%)`,
              }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color + '50' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 28 }}>
                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 400, color: '#F5F0EA', lineHeight: 1.15, margin: '0 0 8px' }}>
                  {project.title}
                </h3>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'rgba(245,240,234,0.4)', letterSpacing: 0.3 }}>{project.location}</span>
                  <span style={{ width: 1, height: 8, background: 'rgba(245,240,234,0.15)' }} />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'rgba(245,240,234,0.25)', letterSpacing: 1 }}>{project.year}</span>
                </div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, lineHeight: 1.65, color: 'rgba(245,240,234,0.4)' }}>
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{
        margin: '0 clamp(2rem, 6vw, 7rem) clamp(4rem, 8vw, 7rem)',
        padding: 'clamp(3rem, 6vw, 5rem)',
        border: `1px solid ${color}22`,
        borderRadius: 4,
        background: `${color}06`,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24,
      }}>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 3.5, textTransform: 'uppercase', color: color + 'aa' }}>
          {t('disc.cta_supertitle')}
        </span>
        <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 400, color: '#F5F0EA', lineHeight: 1.1 }}>
          {t('disc.cta_line1', t('disc.' + K + '.label'))}<br />
          <em style={{ color: 'rgba(245,240,234,0.3)' }}>{t('disc.cta_line2')}</em>
        </h3>
        <button
          onClick={() => setContactOpen(true)}
          style={{
            background: color, color: '#08090A',
            border: 'none', borderRadius: 40,
            padding: '14px 32px',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}40` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
        >
          {t('disc.cta_btn')}
        </button>
      </motion.section>

      <QuickContact open={contactOpen} onClose={() => setContactOpen(false)} />

    </PageTransition>
  )
}
