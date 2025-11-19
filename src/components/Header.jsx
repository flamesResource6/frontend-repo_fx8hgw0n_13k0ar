import { useEffect, useState } from 'react'

export default function Header({ user, onLogin, onLogout, balance, onTopup }) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setPhone('')
      setName('')
    }
  }, [user])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!phone) return
    setLoading(true)
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      // Try login first
      const res = await fetch(`${baseUrl}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      if (res.ok) {
        const data = await res.json()
        onLogin(data)
      } else if (res.status === 404) {
        // Auto-register
        const reg = await fetch(`${baseUrl}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name || `Player ${phone.slice(-4)}` , phone })
        })
        if (!reg.ok) throw new Error('Registration failed')
        const rj = await reg.json()
        onLogin({ user_id: rj.user_id, name: rj.name, phone: rj.phone, balance: rj.balance })
      } else {
        const txt = await res.text()
        alert(`Login failed: ${txt}`)
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTopup = async (e) => {
    e.preventDefault()
    if (!user) return alert('Login first')
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) return
    setLoading(true)
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/wallet/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, amount: amt })
      })
      if (res.ok) {
        const data = await res.json()
        onTopup(data.balance)
        setAmount('')
      } else {
        const txt = await res.text()
        alert(`Top-up failed: ${txt}`)
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 bg-slate-900/90 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center font-black text-slate-900">YB</div>
          <div>
            <div className="text-white font-semibold leading-tight">YehagerBet Betting</div>
            <div className="text-xs text-slate-300 leading-tight">Play responsibly</div>
          </div>
        </div>

        {!user ? (
          <form onSubmit={handleLogin} className="flex items-center gap-2 text-sm">
            <input className="px-3 py-2 rounded bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="px-3 py-2 rounded bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Name (new users)" value={name} onChange={(e) => setName(e.target.value)} />
            <button disabled={loading} className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-600 text-white font-medium disabled:opacity-60">{loading ? 'Please wait' : 'Login / Register'}</button>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <div className="text-slate-200 text-sm">Hello, <span className="font-semibold">{user.name || user.phone}</span></div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-sm">Balance: {balance.toFixed(2)}</div>
            <button onClick={onLogout} className="px-3 py-1.5 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-sm">Logout</button>
          </div>
        )}

        {user && (
          <form onSubmit={handleTopup} className="flex items-center gap-2 text-sm">
            <input className="w-28 px-3 py-2 rounded bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Top-up" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button disabled={loading} className="px-3 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-medium disabled:opacity-60">Add</button>
          </form>
        )}
      </div>
    </header>
  )
}
