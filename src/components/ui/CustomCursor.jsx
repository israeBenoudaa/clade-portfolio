import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const pos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const raf = useRef(null)

  useEffect(() => {
    // Ne pas activer sur écran tactile
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }

    const lerp = (a, b, n) => a + (b - a) * n

    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12)
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12)
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`
      }
      raf.current = requestAnimationFrame(animate)
    }

    const onEnterLink = () => {
      if (ring.current) ring.current.style.transform += ' scale(1.8)'
      if (ring.current) ring.current.style.borderColor = 'rgba(200,184,154,0.6)'
      if (dot.current) dot.current.style.opacity = '0'
    }

    const onLeaveLink = () => {
      if (ring.current) ring.current.style.borderColor = 'rgba(123,167,212,0.5)'
      if (dot.current) dot.current.style.opacity = '1'
    }

    document.addEventListener('mousemove', onMove)

    const links = document.querySelectorAll('a, button, [data-cursor]')
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    raf.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dot}
        style={{
          position: 'fixed', top: 0, left: 0, width: 8, height: 8,
          borderRadius: '50%', backgroundColor: '#7BA7D4',
          pointerEvents: 'none', zIndex: 99999,
          transition: 'opacity 0.2s',
          willChange: 'transform',
          display: 'none',
        }}
        className="custom-cursor-el"
      />
      <div
        ref={ring}
        style={{
          position: 'fixed', top: 0, left: 0, width: 40, height: 40,
          borderRadius: '50%', border: '1px solid rgba(123,167,212,0.5)',
          pointerEvents: 'none', zIndex: 99998,
          transition: 'border-color 0.3s, transform 0.05s linear',
          willChange: 'transform',
          display: 'none',
        }}
        className="custom-cursor-el"
      />
      <style>{`
        @media (pointer: fine) {
          .custom-cursor-el { display: block !important; }
        }
      `}</style>
    </>
  )
}
