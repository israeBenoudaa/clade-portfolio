// Simple wrapper — les animations sont gérées par chaque section individuellement.
// Le rideau dans App.jsx remplace les transitions de page Framer Motion.
export const reveal = {
  initial: { opacity: 0, y: 28 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function PageTransition({ children, style, className }) {
  return <div style={style} className={className}>{children}</div>
}
