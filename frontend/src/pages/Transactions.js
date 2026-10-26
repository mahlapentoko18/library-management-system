import React, { useState, useEffect } from 'react';
import { fetchBooks, fetchUsers, fetchTransactions, processTransaction } from '../services/api';

export default function Transactions() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ book_id: '', user_id: '', type: 'ADD', quantity: 1 });
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = () => {
    // Safely load books
    fetchBooks().then(data => {
      if (Array.isArray(data)) setBooks(data);
    });

    // Safely load users
    fetchUsers().then(data => {
      if (Array.isArray(data)) setUsers(data);
    });
    
    // Safely load transactions
    fetchTransactions().then(data => {
      if (Array.isArray(data)) {
        setHistory(data);
        setErrorMsg('');
      } else {
        console.error("Backend returned an error:", data);
        setErrorMsg("Database Error: " + (data.error || "Check backend terminal for details."));
        setHistory([]); // Force it to be an array so .map never crashes
      }
    }).catch(err => {
      console.error("Network error:", err);
      setErrorMsg("Network Error: Is the backend server running on port 5000?");
      setHistory([]);
    });
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await processTransaction(form);
    if (result.message) {
      alert('Transaction successful!');
      loadData();
    } else {
      alert('Error: ' + (result.error || 'Failed to process transaction'));
    }
  };

  // 100% Safe mapping: if history is somehow not an array, default to []
  const safeHistory = Array.isArray(history) ? history : [];

  return (
    <div>
      <h2>Transactions</h2>
      
      {/* Show the exact backend error if it exists */}
      {errorMsg && (
        <div style={{background: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #ef9a9a'}}>
          <strong> Database Connection Issue:</strong><br/>
          {errorMsg}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="form-grid">
        <select value={form.book_id} onChange={e => setForm({...form, book_id: e.target.value})} required>
          <option value="">Select Book</option>
          {Array.isArray(books) && books.map(b => <option key={b.id} value={b.id}>{b.title} (Stock: {b.quantity})</option>)}
        </select>
        <select value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})} required>
          <option value="">Select User</option>
          {Array.isArray(users) && users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
          <option value="ADD">Add Stock</option>
          <option value="DEDUCT">Deduct Stock (Borrow)</option>
        </select>
        <input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
        <button type="submit">Process</button>
      </form>

      <h3>Transaction History</h3>
      <table className="data-table">
        <thead>
          <tr><th>Date</th><th>Book</th><th>User</th><th>Type</th><th>Qty</th></tr>
        </thead>
        <tbody>
          {safeHistory.length === 0 ? (
            <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No transactions recorded yet.</td></tr>
          ) : (
            safeHistory.map(t => (
              <tr key={t.id}>
                <td>{new Date(t.transaction_date).toLocaleString()}</td>
                <td>{t.title}</td>
                <td>{t.name}</td>
                <td className={t.type === 'DEDUCT' ? 'text-red' : 'text-green'}>{t.type}</td>
                <td>{t.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}