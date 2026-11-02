"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

type Expense = {
  id: number;
  amount: number;
  category: string;
  date: string;
  note: string | null;
};

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Fun", "Other"];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    async function loadExpenses() {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false })
        .order("id", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setExpenses(data as Expense[]);
      }
      setLoading(false);
    }
    loadExpenses();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0 || !date) return;

    const { data, error } = await supabase
      .from("expenses")
      .insert({ amount: value, category, date, note: note || null })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }
    setError("");
    setExpenses([data as Expense, ...expenses]);
    setAmount("");
    setNote("");
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setError("");
    setExpenses(expenses.filter((expense) => expense.id !== id));
  }

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const inputStyle = "border rounded p-2 text-black bg-white w-full";

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputStyle}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputStyle}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputStyle}
          required
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={inputStyle}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700"
        >
          Add expense
        </button>
      </form>

      {error && <p className="text-red-500">Error: {error}</p>}

      <div>
        <h2 className="text-xl font-semibold mb-3">
          Total: ${total.toFixed(2)}
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500">No expenses yet. Add your first one above.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center justify-between border rounded p-3"
              >
                <div>
                  <p className="font-medium">
                    ${expense.amount.toFixed(2)} · {expense.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {expense.date}
                    {expense.note ? " · " + expense.note : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
