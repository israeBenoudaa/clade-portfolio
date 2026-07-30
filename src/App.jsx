import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useLayoutEffect } from 'react'
import Home from './pages/Home'
import DisciplinePage from './pages/DisciplinePage'
import CareersPage from './pages/CareersPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import CustomCursor from './components/ui/CustomCursor'
import { SiteContentProvider } from './context/SiteContentContext'
import { CmsEditModeProvider } from './context/CmsEditMode'
import { LanguageProvider } from './context/LanguageContext'
import { usePageTracking } from './hooks/usePageTracking'

function AnimatedRoutes() {
  const location = useLocation()
  usePageTracking()
  const [curtain, setCurtain] = useState(true)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    setCurtain(true)
    // Deux frames : garantit que la nouvelle page est peinte avant de lever le rideau
    let raf1 = requestAnimationFrame(() => {
      let raf2 = requestAnimationFrame(() => setCurtain(false))
      return () => cancelAnimationFrame(raf2)
    })
    return () => cancelAnimationFrame(raf1)
  }, [location.pathname])

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/discipline/:key" element={<DisciplinePage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/projet/:id" element={<ProjectDetailPage />} />
      </Routes>

      {/* Rideau sombre — couvre l'instant de transition, puis se lève progressivement */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#08090A',
          opacity: curtain ? 1 : 0,
          transition: curtain ? 'none' : 'opacity 0.45s cubic-bezier(0.22,1,0.36,1)',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <CmsEditModeProvider>
          <SiteContentProvider>
            <div className="grain">
              <CustomCursor />
              <AnimatedRoutes />
            </div>
          </SiteContentProvider>
        </CmsEditModeProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
