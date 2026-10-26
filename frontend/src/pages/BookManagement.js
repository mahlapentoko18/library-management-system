import React, { useState, useEffect } from 'react';
import { fetchBooks, addBook, updateBook, deleteBook } from '../services/api';

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', genre: '', isbn: '', quantity: 0 });
  const [editId, setEditId] = useState(null);

  const loadBooks = () => fetchBooks().then(setBooks);
  useEffect(() => { loadBooks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateBook(editId, form);
    } else {
      await addBook(form);
    }
    setForm({ title: '', author: '', genre: '', isbn: '', quantity: 0 });
    setEditId(null);
    loadBooks();
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditId(book.id);
  };

  return (
    <div>
      <h2>Book Management</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <input placeholder="Author" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required />
        <input placeholder="Genre" value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} />
        <input placeholder="ISBN" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} required />
        <input type="number" placeholder="Qty" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
        <button type="submit">{editId ? 'Update' : 'Add'} Book</button>
      </form>

      <table className="data-table">
        <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Qty</th><th>Actions</th></tr></thead>
        <tbody>
          {books.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td><td>{b.author}</td><td>{b.isbn}</td><td>{b.quantity}</td>
              <td>
                <button onClick={() => handleEdit(b)} className="btn-edit">Edit</button>
                <button onClick={() => { deleteBook(b.id); loadBooks(); }} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}