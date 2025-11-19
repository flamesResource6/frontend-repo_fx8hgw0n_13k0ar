import { useMemo, useState } from 'react'
import Header from './components/Header'
import MatchList from './components/MatchList'
import BetSlip from './components/BetSlip'
import BetsHistory from './components/BetsHistory'

function App() {
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(0)
  const [selections, setSelections] = useState([])
  const [placing, setPlacing] = useState(false)

  const onLogin = (u) => {
    setUser(u)
    setBalance(u.balance || 0)
  }
  const onLogout = () => {
    setUser(null)
    setSelections([])
    setBalance(0)
  }

  const onTopup = (newBalance) => setBalance(newBalance)

  const addSelection = (s) => {
    if (!s?.odds) return
    const exists = selections.find(x => x.match_id === s.match_id && x.market === s.market)
    if (exists) return
    setSelections(prev => [...prev, s])
  }
  const removeSelection = (idx) => setSelections(prev => prev.filter((_, i) => i !== idx))
  const clearSelections = () => setSelections([])

  const placeBet = async (stake) => {
    if (!user) return alert('Please login first')
    if (!selections.length) return
    setPlacing(true)
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/bets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, stake, selections })
      })
      if (res.ok) {
        const data = await res.json()
        setBalance(data.balance)
        setSelections([])
        alert(`Bet placed! Potential return: ${data.potential_return}`)
      } else {
        const txt = await res.text()
        alert(`Bet failed: ${txt}`)
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header user={user} onLogin={onLogin} onLogout={onLogout} balance={balance} onTopup={onTopup} />

      <main className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="text-2xl font-bold text-white">Today’s Matches</div>
          <MatchList onAddSelection={addSelection} />
        </div>

        <div className="space-y-4">
          <BetSlip selections={selections} onRemove={removeSelection} onClear={clearSelections} onPlaceBet={placeBet} disabled={placing} />
          <BetsHistory user={user} />
        </div>
      </main>

      <footer className="py-10 text-center text-slate-400 text-sm">
        YehagerBet Betting • Play responsibly. 18+
      </footer>
    </div>
  )
}

export default App
