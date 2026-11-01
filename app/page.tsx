import ExpenseTracker from "../components/ExpenseTracker";

export default function Home() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-3xl font-bold mb-6">Expense Tracker</h1>
      <ExpenseTracker />
    </main>
  );
}
