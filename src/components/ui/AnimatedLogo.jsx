import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const POSITIONS = { C: 0, L: 1, A: 2, D: 3, E: 4 }

/* Chevron angulaire inspiré du signe du logo — forme triangulaire pleine */
function Chevron({ flip = false, color }) {
  return (
    <svg
      width={10} height={18}
      viewBox="0 0 9 18"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {flip
        ? <path d="M9,0 L0,9 L9,18 L9,15 L3,9 L9,3 Z" fill={color} />
        : <path d="M0,0 L9,9 L0,18 L0,15 L6,9 L0,3 Z" fill={color} />
      }
    </svg>
  )
}

export default function AnimatedLogo({ disciplineKey, disciplineLabel, color }) {
  const navigate = useNavigate()
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
      setShowLetter(true)
      setTyped('')
      setIsFull(false)
      after(() => {
        setShowLetter(false)
        let i = 0
        itvId = setInterval(() => {
          i++
          setTyped(label.slice(0, i))
          if (i >= label.length) {
            clearInterval(itvId); itvId = null
            setIsFull(true)
            after(() => {
              setIsFull(false)
              let j = label.length
              itvId = setInterval(() => {
                j--
                setTyped(label.slice(0, j))
                if (j <= 0) {
                  clearInterval(itvId); itvId = null
                  setShowLetter(true)
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
  }, [label])

  const font = { fontFamily: "'Amerika Sans', sans-serif", fontWeight: 400, lineHeight: 1, letterSpacing: '0.06em', color: '#F5F0EA' }
  const sz = 'clamp(18px, 2.5vw, 26px)'

  return (
    <button
      onClick={() => navigate('/')}
      style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 0 }}
    >
      {prefix && <span style={{ ...font, fontSize: sz }}>{prefix}</span>}

      <span style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
        {/* Lettre idle */}
        <motion.span
          animate={{ opacity: showLetter ? 1 : 0, maxWidth: showLetter ? '3em' : '0em' }}
          transition={{ duration: 0.18 }}
          style={{ ...font, fontSize: sz, color, display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap' }}
        >
          {activeLtr}
        </motion.span>

        {/* Chevron gauche + texte tapé + chevron droit */}
        <motion.span
          animate={{ opacity: showLetter ? 0 : 1 }}
          transition={{ duration: 0.18 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          <Chevron color={color} />
          <span style={{ ...font, fontSize: sz, color, letterSpacing: '0.04em', minWidth: 4 }}>
            {typed}
            {!showLetter && !isFull && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.65 }}
                style={{ display: 'inline-block', width: 1.5, height: '0.75em', background: color, marginLeft: 1, verticalAlign: 'middle' }}
              />
            )}
          </span>
          <Chevron flip color={color} />
        </motion.span>
      </span>

      {suffix && <span style={{ ...font, fontSize: sz }}>{suffix}</span>}
    </button>
  )
}
