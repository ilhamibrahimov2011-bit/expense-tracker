import { useState } from 'react'
import './App.css'

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Bills', 'Health', 'Fun', 'Shopping', 'Other']

export default function App() {
  const today = new Date().toISOString().slice(0, 10)
  const [items, setItems] = useState([])
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(today)
  const [note, setNote] = useState('')

  const total = items.reduce((sum, item) => sum + item.amount, 0)

  function addItem(e) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!(value > 0)) return
    setItems([{ id: Date.now(), amount: value, category, date, note }, ...items])
    setAmount('')
    setNote('')
  }

  function removeItem(id) {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <>
      <h1>Expense Tracker</h1>

      <form onSubmit={addItem}>
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="add" type="submit">Add expense</button>
      </form>

      <p className="total">Total: ${total.toFixed(2)}</p>

      {items.length === 0 ? (
        <p className="empty">No expenses yet. Add your first one above.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <div>
                ${item.amount.toFixed(2)} · {item.category}
                <small>{item.date}{item.note ? ' · ' + item.note : ''}</small>
              </div>
              <button className="del" onClick={() => removeItem(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
