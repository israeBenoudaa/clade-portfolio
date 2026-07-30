import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteContent, useSiteContentJson } from '../../context/SiteContentContext'
import { useLanguage } from '../../context/LanguageContext'

const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

const DEFAULT_PHRASES = [
  { line1: 'Préserver', line2: 'ce qui a été construit avant nous', image: 'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=1800&q=80&auto=format&fit=crop' },
  { line1: 'Concevoir', line2: 'avec le territoire, pas contre lui', image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1800&q=80&auto=format&fit=crop' },
  { line1: 'Du patrimoine', line2: "à l'éphémère", image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1800&q=80&auto=format&fit=crop' },
  { line1: 'Donner forme', line2: "à ce qui n'existe pas encore", image: 'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?w=1800&q=80&auto=format&fit=crop' },
  { line1: 'Cinq disciplines,', line2: 'une exigence', image: 'https://images.unsplash.com/photo-1519619091416-f5d55b8d0e39?w=1800&q=80&auto=format&fit=crop' },
]
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1800&q=80&auto=format&fit=crop'

export default function Hero() {
  const [idx, setIdx] = useState(0)
  const phrases  = useSiteContentJson('hero.phrases', DEFAULT_PHRASES)
  const imageUrl = useSiteContent('hero.image_url', DEFAULT_IMAGE)
  const { t } = useLanguage()

  useEffect(() => {
    if (phrases.length < 2) return
    const id = setInterval(() => setIdx(i => (i + 1) % phrases.length), 4500)
    return () => clearInterval(id)
  }, [phrases.length])

  const currentImage = phrases[idx]?.image || imageUrl

  return (
    <section style={{
      position: 'relative',
      height: '92vh', minHeight: 580,
      overflow: 'hidden',
      background: '#08090A',
    }}>
      {/* Background slideshow — crossfades when phrase (and its image) changes */}
      <AnimatePresence>
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${currentImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 55%',
            filter: 'brightness(0.62) saturate(0.65) sepia(0.10)',
          }}
        />
      </AnimatePresence>

      {/* Gradients */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient(to top, #08090A 0%, rgba(8,9,10,0.5) 45%, transparent 100%),
          linear-gradient(to right, rgba(8,9,10,0.5) 0%, transparent 55%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(3.5rem, 9vh, 7rem)',
        left: 'clamp(2rem, 6vw, 7rem)',
        right: 'clamp(2rem, 6vw, 7rem)',
      }}>

        {/* Animated phrase — main hero text */}
        <div
          data-cms-key="hero.phrases"
          data-cms-type="json-phrases"
          data-cms-value={JSON.stringify(phrases)}
          style={{ marginBottom: 'clamp(2rem, 5vh, 4rem)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Line 1 — upright, heavy weight feel */}
              <div style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(44px, 7.5vw, 110px)',
                fontWeight: 400,
                lineHeight: 1,
                color: '#F5F0EA',
                letterSpacing: '-0.02em',
                display: 'block',
              }}>
                {phrases[idx]?.line1}
              </div>

              {/* Line 2 — italic, lighter */}
              <div style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(44px, 7.5vw, 110px)',
                fontWeight: 400,
                fontStyle: 'italic',
                lineHeight: 1.05,
                color: 'rgba(245,240,234,0.4)',
                letterSpacing: '-0.02em',
                display: 'block',
              }}>
                {phrases[idx]?.line2}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Phrase counter + CTAs */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
          animation: 'fadeIn 0.8s 1s both',
        }}>
          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {phrases.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? 24 : 6,
                  height: 1,
                  background: i === idx ? 'rgba(245,240,234,0.7)' : 'rgba(245,240,234,0.2)',
                  border: 'none', padding: 0,
                  transition: 'all 0.4s ease',
                }}
              />
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <motion.button
              whileHover={{ color: '#F5F0EA', borderColor: 'rgba(245,240,234,0.45)' }}
              onClick={() => scrollTo('#approche')}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 10, fontWeight: 500, letterSpacing: 2.5,
                textTransform: 'uppercase', color: 'rgba(245,240,234,0.3)',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'color 0.2s',
              }}
            >
              {t('hero.approach_cta')}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </motion.button>

            <div style={{ width: 1, height: 14, background: 'rgba(245,240,234,0.15)' }} />

            <motion.button
              whileHover={{ color: '#F5F0EA', borderColor: 'rgba(245,240,234,0.45)' }}
              onClick={() => scrollTo('#projets')}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 10, fontWeight: 500, letterSpacing: 2.5,
                textTransform: 'uppercase', color: 'rgba(245,240,234,0.3)',
                transition: 'color 0.2s',
              }}
            >
              {t('hero.projects_cta')}
            </motion.button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </section>
  )
}
