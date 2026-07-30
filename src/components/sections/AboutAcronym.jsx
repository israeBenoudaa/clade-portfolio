import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AXES } from '../../data/projects'
import { useLanguage } from '../../context/LanguageContext'

const ENTRIES = Object.entries(AXES)

export default function AboutAcronym() {
  const [active, setActive] = useState(null)
  const { t } = useLanguage()

  return (
    <section id="approche" style={{
      padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 6vw, 6rem)',
      maxWidth: 1280, margin: '0 auto',
    }}>
      <div style={{ marginBottom: '5rem' }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
          letterSpacing: 3, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>{t('about.supertitle')}</span>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 400, color: '#FAFAF8',
          marginTop: 12, lineHeight: 1.15, maxWidth: 560,
        }}>
          {t('about.h2_1')}<br />
          <em style={{ color: 'rgba(255,255,255,0.4)' }}>{t('about.h2_2')}</em>
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {ENTRIES.map(([key, axis], i) => (
          <div
            key={key}
            onClick={() => setActive(active === key ? null : key)}
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}
          >
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 'clamp(16px, 4vw, 48px)',
              padding: 'clamp(20px, 3vw, 32px) 0',
            }}>
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(52px, 8vw, 100px)',
                fontWeight: 300, lineHeight: 1,
                color: active === key ? axis.color : 'rgba(255,255,255,0.1)',
                transition: 'color 0.4s',
                width: 'clamp(50px, 8vw, 100px)', flexShrink: 0,
              }}>
                {key}
              </span>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(22px, 4vw, 40px)',
                  fontWeight: 400, color: '#FAFAF8', letterSpacing: -0.5,
                }}>
                  {axis.label}
                </div>
                <AnimatePresence>
                  {active === key && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 14, lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.5)',
                        marginTop: 10, maxWidth: 480,
                      }}>
                        {t('disc.' + key + '.desc')}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
                letterSpacing: 2, color: 'rgba(255,255,255,0.18)', marginLeft: 'auto', flexShrink: 0,
              }}>0{i + 1}</span>

              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                border: `1px solid ${active === key ? axis.color + '60' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.3s, border-color 0.3s',
                transform: active === key ? 'rotate(45deg)' : 'none',
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke={active === key ? axis.color : 'rgba(255,255,255,0.35)'} strokeWidth="1.2" />
                </svg>
              </div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
      </div>
    </section>
  )
}
