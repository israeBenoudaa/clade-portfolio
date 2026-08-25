import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function usePageTracking() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!supabase) return
    // Éviter de tracker les visites depuis l'iframe de l'éditeur
    if (window.self !== window.top) return

    const device = window.matchMedia('(pointer: coarse)').matches ? 'mobile' : 'desktop'
    supabase.from('site_visits').insert({
      page: pathname,
      referrer: document.referrer || null,
      device,
      screen_width: window.innerWidth,
      language: navigator.language?.slice(0, 5) || null,
    }).then(({ error }) => {
      if (error) console.error('[tracking] site_visits insert error:', error.code, error.message)
    })
  }, [pathname])
}
