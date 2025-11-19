import { useMemo, useState } from 'react'

export default function BetSlip({ selections, onRemove, onClear, onPlaceBet, disabled }) {
  const [stake, setStake] = useState('')

  const totalOdds = useMemo(() => {
    if (!selections.length) return 0
    return selections.reduce((acc, s) => acc * (parseFloat(s.odds) || 1), 1)
  }, [selections])

  const potentialReturn = useMemo(() => {
    const st = parseFloat(stake) || 0
    return st > 0 ? +(st * totalOdds).toFixed(2) : 0
  }, [stake, totalOdds])

  const handlePlace = () => {
    const st = parseFloat(stake)
    if (!st || st <= 0) return
    onPlaceBet(st)
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white font-semibold">Bet Slip</div>
        <button onClick={onClear} className="text-xs text-slate-300 hover:text-white">Clear</button>
      </div>

      <div className="space-y-2 max-h-60 overflow-auto pr-2">
        {selections.length === 0 && (
          <div className="text-slate-400 text-sm">No selections yet.</div>
        )}
        {selections.map((s, idx) => (
          <div key={idx} className="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-700">
            <div>
              <div className="text-slate-200 text-sm">{s.description}</div>
              <div className="text-xs text-slate-400 uppercase">{s.market.replace('_',' ')} • {s.odds}</div>
            </div>
            <button onClick={() => onRemove(idx)} className="text-slate-400 hover:text-white text-sm">Remove</button>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <input value={stake} onChange={(e) => setStake(e.target.value)} placeholder="Stake" className="w-full px-3 py-2 rounded bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <button onClick={handlePlace} disabled={disabled || !selections.length} className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-600 text-white font-medium disabled:opacity-60">Place</button>
        </div>
        <div className="text-slate-300 text-sm">Total odds: <span className="font-semibold text-white">{totalOdds ? totalOdds.toFixed(2) : '-'}</span></div>
        <div className="text-slate-300 text-sm">Potential return: <span className="font-semibold text-white">{potentialReturn ? potentialReturn.toFixed(2) : '-'}</span></div>
      </div>
    </div>
  )
}
