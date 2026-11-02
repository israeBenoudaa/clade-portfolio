import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const POSITIONS = { C: 0, L: 1, A: 2, D: 3, E: 4 }

/* Chevron épais angulaire — inspiré du signe du logo */
function Chevron({ flip = false, color }) {
  return (
    <svg width={12} height={20} viewBox="0 0 12 20"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {flip
        ? <path d="M12,0 L0,10 L12,20 L12,16 L4,10 L12,4 Z" fill={color} />
        : <path d="M0,0 L12,10 L0,20 L0,16 L8,10 L0,4 Z" fill={color} />
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
  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }

  return (
    <button
      onClick={() => navigate('/')}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 0 }}
    >
      {prefix && <span style={{ ...font, fontSize: sz }}>{prefix}</span>}

      {/* Slot actif — lettre OU [chevron + texte + chevron], sans espace résiduel */}
      <AnimatePresence mode="wait">
        {showLetter ? (
          <motion.span key="letter" {...fade}
            style={{ ...font, fontSize: sz, color }}
          >
            {activeLtr}
          </motion.span>
        ) : (
          <motion.span key="brackets" {...fade}
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
