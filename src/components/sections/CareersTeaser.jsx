import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../../context/LanguageContext'

const ACCENT = '#C8B89A'

const COPY = {
  fr: {
    sup:   'Carrières',
    title: 'Faites partie\nde l\'aventure.',
    sub:   'Nous recrutons des talents passionnés par l\'espace et la matière.',
    cta:   'Rejoindre l\'équipe',
  },
  en: {
    sup:   'Careers',
    title: 'Be part\nof the story.',
    sub:   'We are looking for passionate talents who care about space and matter.',
    cta:   'Join the team',
  },
  es: {
    sup:   'Carreras',
    title: 'Forma parte\nde la aventura.',
    sub:   'Buscamos talentos apasionados por el espacio y la materia.',
    cta:   'Únete al equipo',
  },
}

export default function CareersTeaser() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const copy = COPY[lang] || COPY.fr
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      ref={ref}
      style={{
        background: '#08090A',
        borderTop: '1px solid rgba(245,240,234,0.06)',
        padding: 'clamp(3.5rem, 9vw, 8rem) clamp(2rem, 6vw, 7rem)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 'clamp(2rem, 3.5vw, 3rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Arc décoratif subtil */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60vw',
        height: '60vw',
        borderRadius: '50%',
        border: `1px solid ${ACCENT}08`,
        pointerEvents: 'none',
      }} />

      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 10, fontWeight: 500,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: ACCENT,
        }}
      >
        {copy.sup}
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(42px, 6vw, 80px)',
          fontWeight: 400,
          color: '#F5F0EA',
          lineHeight: 1.08,
          letterSpacing: '-0.01em',
          whiteSpace: 'pre-line',
          margin: 0,
        }}
      >
        {copy.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.4vw, 17px)',
          color: 'rgba(245,240,234,0.4)',
          lineHeight: 1.6,
          maxWidth: 480,
          letterSpacing: '0.01em',
          margin: 0,
        }}
      >
        {copy.sub}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => { navigate('/careers'); window.scrollTo({ top: 0 }) }}
        style={{
          background: ACCENT,
          border: 'none',
          borderRadius: 40,
          padding: 'clamp(14px, 1.4vw, 18px) clamp(28px, 3vw, 44px)',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 11, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#08090A',
          cursor: 'pointer',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          marginTop: 8,
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        {copy.cta} →
      </motion.button>
    </section>
  )
}
