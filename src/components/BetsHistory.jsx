import { useEffect, useState } from 'react'

export default function BetsHistory({ user }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
        const res = await fetch(`${baseUrl}/api/bets?user_id=${user.user_id}`)
        const data = await res.json()
        setItems(data.items || [])
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [user])

  if (!user) return null

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="text-white font-semibold mb-3">Recent Bets</div>
      <div className="space-y-2 max-h-72 overflow-auto pr-2">
        {items.length === 0 && <div className="text-slate-400 text-sm">No bets yet.</div>}
        {items.map(b => (
          <div key={b._id} className="bg-slate-900 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="text-slate-200 text-sm">Stake: {b.stake}</div>
              <div className={"text-xs px-2 py-1 rounded-full border " + (b.status === 'pending' ? 'text-amber-300 border-amber-500/30 bg-amber-500/10' : b.status === 'won' ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' : 'text-rose-300 border-rose-500/30 bg-rose-500/10')}>{b.status}</div>
            </div>
            <div className="text-slate-400 text-xs">Potential: {b.potential_return}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
