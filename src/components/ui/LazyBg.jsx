import { useRef, useState, useEffect } from 'react'

export default function LazyBg({ src, style, ...props }) {
  const ref   = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!src) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setReady(true); obs.disconnect() } },
      { rootMargin: '400px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [src])

  return (
    <div
      ref={ref}
      {...props}
      style={{ ...style, backgroundImage: ready ? `url('${src}')` : 'none' }}
    />
  )
}
