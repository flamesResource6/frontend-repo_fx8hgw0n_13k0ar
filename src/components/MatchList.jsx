import { useEffect, useState } from 'react'

export default function MatchList({ onAddSelection }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
        const res = await fetch(`${baseUrl}/api/matches`)
        const data = await res.json()
        setMatches(data.items || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="text-slate-300">Loading matches...</div>

  return (
    <div className="space-y-3">
      {matches.map(m => (
        <div key={m.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">{m.sport?.toUpperCase()} • {m.league}</div>
              <div className="text-white font-medium">{m.home_team} vs {m.away_team}</div>
            </div>
            <div className="flex items-center gap-2">
              {['home_win','draw','away_win'].map(key => (
                <button key={key} onClick={() => onAddSelection({ match_id: m.id, market: key, odds: m.odds?.[key], description: `${m.home_team} vs ${m.away_team} - ${key.replace('_',' ').toUpperCase()}` })} disabled={!m.odds?.[key]}
                  className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-50">
                  <div className="text-xs uppercase tracking-wide">{key.replace('_',' ')}</div>
                  <div className="font-semibold">{m.odds?.[key] || '-'}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
