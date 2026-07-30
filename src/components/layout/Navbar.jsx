import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import QuickContact from '../ui/QuickContact'
import { useLanguage } from '../../context/LanguageContext'

const LANGS = ['FR', 'EN', 'ES']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()
  const activeLang = lang.toUpperCase()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: 64, padding: '0 clamp(1.5rem, 5vw, 5rem)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'rgba(6,11,24,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => isHome ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')}
          style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'baseline', gap: 10, cursor: 'pointer', flexShrink: 0 }}
        >
          <span style={{ fontFamily: "'Averia Libre', serif", fontSize: 22, fontWeight: 400, letterSpacing: 2, color: '#F5F0EA', whiteSpace: 'nowrap' }}>
            Clade
          </span>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2, color: 'rgba(245,240,234,0.3)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            architects & co
          </span>
        </button>

        {/* Right: language switcher + phone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Language switcher — compact pill */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 40,
            padding: '2px 3px',
          }}>
            {LANGS.map((lang, i) => (
              <button
                key={lang}
                onClick={() => setLang(lang)}
                style={{
                  background: activeLang === lang ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none', borderRadius: 40,
                  padding: '4px 10px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 9, fontWeight: 600, letterSpacing: 1,
                  color: activeLang === lang ? '#F5F0EA' : 'rgba(245,240,234,0.3)',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                  borderRight: i < LANGS.length - 1 && activeLang !== lang && activeLang !== LANGS[i + 1]
                    ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}
                onMouseEnter={e => { if (activeLang !== lang) e.currentTarget.style.color = 'rgba(245,240,234,0.65)' }}
                onMouseLeave={e => { if (activeLang !== lang) e.currentTarget.style.color = 'rgba(245,240,234,0.3)' }}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Phone / contact button */}
          <motion.button
            onClick={() => setContactOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            title={t('nav.contact_title')}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: contactOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
              marginLeft: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.background = contactOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"
                stroke="rgba(245,240,234,0.72)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>
      </motion.nav>

      {/* Contact modal */}
      <QuickContact open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
