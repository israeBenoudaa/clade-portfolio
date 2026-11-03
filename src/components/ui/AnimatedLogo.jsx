import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const POSITIONS = { C: 0, L: 1, A: 2, D: 3, E: 4 }

function Chevron({ flip = false, color }) {
  return (
    <svg width={7} height={13} viewBox="0 0 7 13"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {flip
        ? <polyline points="6,1 1,6.5 6,12" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        : <polyline points="1,1 6,6.5 1,12" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      }
    </svg>
  )
}

export default function AnimatedLogo({ disciplineKey, disciplineLabel, color }) {
  const navigate = useNavigate()
  const [typed, setTyped]           = useState('')
  const [showLetter, setShowLetter] = useState(true)
  const [isFull, setIsFull]         = useState(false)
  const timers = useRef([])

  const idx       = POSITIONS[disciplineKey] ?? -1
  const WORD      = 'Clade'
  const prefix    = WORD.slice(0, idx)
  const suffix    = WORD.slice(idx + 1)
  const activeLtr = WORD[idx] ?? disciplineKey
  const raw   = disciplineLabel.normalize('NFD').replace(/[̀-ͯ]/g, '')
  const label = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()

  useEffect(() => {
    let itvId = null
    const clear = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      if (itvId) { clearInterval(itvId); itvId = null }
    }
    const after = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id) }
    const cycle = (delay = 1000) => {
      setShowLetter(true); setTyped(''); setIsFull(false)
      after(() => {
        setShowLetter(false)
        let i = 0
        itvId = setInterval(() => {
          i++; setTyped(label.slice(0, i))
          if (i >= label.length) {
            clearInterval(itvId); itvId = null
            setIsFull(true)
            after(() => {
              setIsFull(false); let j = label.length
              itvId = setInterval(() => {
                j--; setTyped(label.slice(0, j))
                if (j <= 0) {
                  clearInterval(itvId); itvId = null
                  setShowLetter(true)
                  after(() => cycle(0), 700)
                }
              }, 22)
            }, 2200)
          }
        }, 42)
      }, delay)
    }
    cycle(900)
    return clear
  }, [label])

  const font = { fontFamily: "'Amerika Sans', sans-serif", fontWeight: 400, lineHeight: 1, letterSpacing: '0.06em', color: '#F5F0EA' }
  const sz   = 'clamp(18px, 2.5vw, 26px)'

  return (
    <button
      onClick={() => navigate('/')}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 0 }}
    >
      {prefix && <span style={{ ...font, fontSize: sz }}>{prefix}</span>}

      {/* Slot actif — exit instantané, entrée en fondu → pas de flash vide */}
      <AnimatePresence>
        {showLetter && (
          <motion.span key="letter"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            style={{ ...font, fontSize: sz, color }}
          >
            {activeLtr}
          </motion.span>
        )}
        {!showLetter && (
          <motion.span key="brackets"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}
          >
            <Chevron color={color} />
            <span style={{ ...font, fontSize: sz, color, letterSpacing: '0.04em' }}>
              {typed}
              {!isFull && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.65 }}
                  style={{ display: 'inline-block', width: 1.5, height: '0.75em', background: color, marginLeft: 1, verticalAlign: 'middle' }}
                />
              )}
            </span>
            <Chevron flip color={color} />
          </motion.span>
        )}
      </AnimatePresence>

      {suffix && <span style={{ ...font, fontSize: sz }}>{suffix}</span>}
    </button>
  )
}
