import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import CareersSection from '../components/sections/CareersSection'
import Footer from '../components/layout/Footer'
import PageTransition from '../components/ui/PageTransition'

const sec = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function CareersPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <PageTransition style={{ background: '#08090A', minHeight: '100vh', color: '#F5F0EA' }}>

      {/* ── Navbar — fixe, visible instantanément ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64, padding: '0 clamp(1.5rem, 5vw, 5rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,9,10,0.94)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, cursor: 'pointer' }}
        >
          <span style={{ fontFamily: "'Averia Libre', serif", fontSize: 22, fontWeight: 400, letterSpacing: 2, color: '#F5F0EA', lineHeight: 1 }}>
            Clade
          </span>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 7, letterSpacing: 2.5, color: 'rgba(245,240,234,0.3)', textTransform: 'uppercase', lineHeight: 1 }}>
            architects
          </span>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 7, letterSpacing: 2.5, color: 'rgba(245,240,234,0.3)', textTransform: 'uppercase', lineHeight: 1 }}>
            &amp; co
          </span>
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', padding: 0,
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
            letterSpacing: 2.5, textTransform: 'uppercase',
            color: 'rgba(245,240,234,0.35)', transition: 'color 0.2s', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#F5F0EA'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,234,0.35)'}
        >
          {t('back')}
        </button>
      </nav>

      {/* ── Bloc 1 : Hero ── */}
      <motion.section {...sec(0.05)} style={{
        paddingTop: 'clamp(100px, 16vw, 160px)',
        paddingBottom: 'clamp(40px, 6vw, 80px)',
        paddingLeft: 'clamp(1.5rem, 6vw, 6rem)',
        paddingRight: 'clamp(1.5rem, 6vw, 6rem)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '30%',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(184,154,200,0.04) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 720, position: 'relative' }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
            letterSpacing: 3.5, textTransform: 'uppercase', color: 'rgba(184,154,200,0.6)',
          }}>
            {t('careerspage.supertitle')}
          </span>
          <h1 style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(44px, 7vw, 90px)',
            fontWeight: 400, lineHeight: 1,
            color: '#F5F0EA', letterSpacing: '-0.02em',
            marginTop: 16, marginBottom: 0,
          }}>
            {t('careerspage.h1')}
          </h1>
          <div style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(44px, 7vw, 90px)',
            fontWeight: 400, fontStyle: 'italic',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            color: 'rgba(245,240,234,0.25)',
          }}>
            {t('careerspage.sub')}
          </div>
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 15,
            lineHeight: 1.75, color: 'rgba(255,255,255,0.35)',
            marginTop: 28, maxWidth: 540,
          }}>
            {t('careerspage.intro')}
          </p>
        </div>
      </motion.section>

      {/* ── Bloc 2 : Postes + formulaire (interne à CareersSection) ── */}
      <motion.div {...sec(0.22)}>
        <CareersSection hideHeader autoTrigger />
      </motion.div>

      {/* ── Bloc 3 : Footer ── */}
      <motion.div {...sec(0.38)}>
        <Footer />
      </motion.div>

    </PageTransition>
  )
}
