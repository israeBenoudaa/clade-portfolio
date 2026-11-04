import { useRef, useState, useEffect } from 'react'

export default function LazyBg({ src, style, children, ...props }) {
  const ref    = useRef(null)
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Step 1 — watch viewport
  useEffect(() => {
    if (!src || !ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { rootMargin: '400px' }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [src])

  // Step 2 — preload image, reveal only when fully ready
  useEffect(() => {
    if (!inView || !src) return
    const img = new Image()
    img.onload  = () => setLoaded(true)
    img.onerror = () => setLoaded(true) // show something even on error
    img.src = src
  }, [inView, src])

  // Separate bg-specific props from layout props
  const { backgroundSize, backgroundPosition, backgroundRepeat, ...layoutStyle } = style || {}

  return (
    <div ref={ref} style={{ position: 'relative', ...layoutStyle }} {...props}>
      {/* Image layer: invisible until fully loaded, then fades in */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: inView ? `url('${src}')` : 'none',
        backgroundSize: backgroundSize || 'cover',
        backgroundPosition: backgroundPosition || 'center',
        backgroundRepeat: backgroundRepeat || 'no-repeat',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.9s ease',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  )
}
