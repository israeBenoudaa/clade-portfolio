import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const POSITIONS = { C: 0, L: 1, A: 2, D: 3, E: 4 }

export default function AnimatedLogo({ disciplineKey, disciplineLabel, color }) {
  const navigate  = useNavigate()
  const [typed, setTyped]         = useState('')
  const [showLetter, setShowLetter] = useState(true)
  const [isFull, setIsFull]       = useState(false)
  const timers = useRef([])

  const idx       = POSITIONS[disciplineKey] ?? -1
  const WORD      = 'Clade'
  const prefix    = WORD.slice(0, idx)
  const suffix    = WORD.slice(idx + 1)
  const activeLtr = WORD[idx] ?? disciplineKey
  const raw    = disciplineLabel.normalize('NFD').replace(/[̀-ͯ]/g, '')
  const label  = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
  const target = `[${label}]`

  useEffect(() => {
    let itvId = null

    const clear = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      if (itvId) { clearInterval(itvId); itvId = null }
    }

    const after = (fn, ms) => {
      const id = setTimeout(fn, ms)
      timers.current.push(id)
    }

    const cycle = (initialDelay = 1000) => {
      // état initial : lettre visible
      setShowLetter(true)
      setTyped('')
      setIsFull(false)

      after(() => {
        // début frappe
        setShowLetter(false)
        let i = 0
        itvId = setInterval(() => {
          i++
          setTyped(target.slice(0, i))
          if (i >= target.length) {
            clearInterval(itvId); itvId = null
            setIsFull(true)

            // pause en plein
            after(() => {
              setIsFull(false)
              // effacement lettre par lettre (plus rapide)
              let j = target.length
              itvId = setInterval(() => {
                j--
                setTyped(target.slice(0, j))
                if (j <= 0) {
                  clearInterval(itvId); itvId = null
                  setShowLetter(true)
                  // pause avant le prochain cycle
                  after(() => cycle(0), 700)
                }
              }, 22)
            }, 2200)
          }
        }, 42)
      }, initialDelay)
    }

    cycle(900)
    return clear
  }, [target])

  const base = {
    fontFamily: "'Averia Libre', serif",
    fontWeight: 400, lineHeight: 1, letterSpacing: '0.06em',
    color: '#F5F0EA',
  }
  const sz  = 'clamp(18px, 2.5vw, 24px)'
  const bsz = 'clamp(26px, 3.6vw, 34px)'

  return (
    <button
      onClick={() => navigate('/')}
      style={{ background: 'none', border: 'none', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '0.18em' }}
    >
      {/* Crochet gauche */}
      <span style={{ fontFamily: "'Averia Libre', serif", fontSize: bsz, fontWeight: 400, color: 'rgba(245,240,234,0.45)', lineHeight: 1, userSelect: 'none' }}>[</span>

      {/* Bloc central : Clade animé + subtitle */}
      <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
        {/* Ligne "Clade" animée */}
        <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
          {prefix && <span style={{ ...base, fontSize: sz }}>{prefix}</span>}

          <span style={{ display: 'inline-flex', alignItems: 'baseline', position: 'relative', overflow: 'visible' }}>
            <motion.span
              animate={{ opacity: showLetter ? 1 : 0, width: showLetter ? 'auto' : 0 }}
              transition={{ duration: 0.18 }}
              style={{ ...base, fontSize: sz, color, display: 'inline-block', overflow: 'hidden' }}
            >
              {activeLtr}
            </motion.span>

            <motion.span
              animate={{ opacity: showLetter ? 0 : 1 }}
              transition={{ duration: 0.18 }}
              style={{ ...base, fontSize: sz, color, fontStyle: 'normal', letterSpacing: '0.03em', display: 'inline-block' }}
            >
              {typed}
              {!showLetter && !isFull && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.65 }}
                  style={{ display: 'inline-block', width: 1.5, height: '0.75em', background: color, marginLeft: 1, verticalAlign: 'middle' }}
                />
              )}
            </motion.span>
          </span>

          {suffix && <span style={{ ...base, fontSize: sz }}>{suffix}</span>}
        </span>

        {/* Subtitle */}
        <span style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(6px, 0.82vw, 8px)', fontWeight: 500, color: 'rgba(245,240,234,0.58)', letterSpacing: '0.01em', lineHeight: 1 }}>
          <span>architects</span>
          <span>&amp;</span>
          <span>co</span>
        </span>
      </span>

      {/* Crochet droit */}
      <span style={{ fontFamily: "'Averia Libre', serif", fontSize: bsz, fontWeight: 400, color: 'rgba(245,240,234,0.45)', lineHeight: 1, userSelect: 'none' }}>]</span>
    </button>
  )
}
