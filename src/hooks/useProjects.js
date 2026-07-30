import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PROJECTS as STATIC, AXES } from '../data/projects'

const TABLE = 'portfolio_projects'

function normalize(row) {
  return {
    ...row,
    image: row.image_url || '',
    tags:  row.tags    || [],
    gallery: row.gallery || [],
    details: {
      surface:       row.surface       || '—',
      programme:     row.programme     || '—',
      statut:        row.statut        || '—',
      maîtreOuvrage: row.maitre_ouvrage || '—',
    },
  }
}

export function useProjects(axisFilter = null) {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!supabase) {
      setProjects(axisFilter ? STATIC.filter(p => p.axis === axisFilter) : STATIC)
      setLoading(false)
      return
    }

    let q = supabase
      .from(TABLE)
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true })

    if (axisFilter) q = q.eq('axis', axisFilter)

    q.then(({ data, error }) => {
      if (error || !data?.length) {
        setProjects(axisFilter ? STATIC.filter(p => p.axis === axisFilter) : STATIC)
      } else {
        setProjects(data.map(normalize))
      }
      setLoading(false)
    })
  }, [axisFilter])

  return { projects, loading }
}

export function useProject(id) {
  const [project, setProject] = useState(null)
  const [loading, setLoading]  = useState(true)

  useEffect(() => {
    if (!id) return

    if (!supabase) {
      const p = STATIC.find(p => String(p.id) === String(id))
      setProject(p || null)
      setLoading(false)
      return
    }

    supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          const p = STATIC.find(p => String(p.id) === String(id))
          setProject(p || null)
        } else {
          setProject(normalize(data))
        }
        setLoading(false)
      })
  }, [id])

  return { project, loading }
}
