import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useLanguage } from './LanguageContext'

const CmsEditCtx = createContext({ editMode: false, overrides: {} })

export function CmsEditModeProvider({ children }) {
  const [editMode, setEditMode] = useState(false)
  const [overrides, setOverrides] = useState({})
  const { lang } = useLanguage()
  const langRef = useRef(lang)
  useEffect(() => { langRef.current = lang }, [lang])

  useEffect(() => {
    if (window === window.parent) return

    const reportPath = () =>
      window.parent.postMessage({ type: 'cms-navigate', path: window.location.pathname }, '*')

    // Patch history API to detect React Router navigation
    const origPush    = window.history.pushState.bind(window.history)
    const origReplace = window.history.replaceState.bind(window.history)
    window.history.pushState    = (...a) => { origPush(...a);    reportPath() }
    window.history.replaceState = (...a) => { origReplace(...a); reportPath() }
    window.addEventListener('popstate', reportPath)
    reportPath()

    const handler = (e) => {
      if (!e.data) return
      if (e.data.type === 'cms-enable')  setEditMode(true)
      if (e.data.type === 'cms-disable') setEditMode(false)
      if (e.data.type === 'cms-reload')  window.location.reload()
      if (e.data.type === 'cms-update' && !e.data.table) {
        setOverrides(o => ({ ...o, [e.data.key]: e.data.value }))
      }
    }
    window.addEventListener('message', handler)
    window.parent.postMessage({ type: 'cms-ready' }, '*')

    return () => {
      window.history.pushState    = origPush
      window.history.replaceState = origReplace
      window.removeEventListener('popstate', reportPath)
      window.removeEventListener('message', handler)
    }
  }, [])

  useEffect(() => {
    if (!editMode) return
    const handleClick = (e) => {
      const el = e.target.closest('[data-cms-key]')
      if (!el) return
      e.stopPropagation()
      e.preventDefault()
      window.parent.postMessage({
        type:        'cms-click',
        key:         el.getAttribute('data-cms-key'),
        lang:        langRef.current,
        elementType: el.getAttribute('data-cms-type') || 'text',
        value:       el.getAttribute('data-cms-value') || el.textContent?.trim() || '',
        table:       el.getAttribute('data-cms-table') || 'site_content',
        entityId:    el.getAttribute('data-cms-id') || null,
      }, '*')
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [editMode])

  return (
    <CmsEditCtx.Provider value={{ editMode, overrides }}>
      {editMode && (
        <style>{`
          [data-cms-key] {
            outline: 1.5px dashed transparent !important;
            outline-offset: 3px !important;
            cursor: pointer !important;
            transition: outline-color 0.15s ease !important;
          }
          [data-cms-key]:hover {
            outline-color: rgba(255, 130, 50, 0.8) !important;
          }
        `}</style>
      )}
      {children}
    </CmsEditCtx.Provider>
  )
}

export function useCmsEditMode() {
  return useContext(CmsEditCtx)
}
