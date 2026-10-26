import React, { useState, useEffect } from 'react';
import { fetchBooks } from '../services/api';

export default function Dashboard() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks()
      .then(data => {
        if (Array.isArray(data)) {
          setBooks(data); // Success! We got an array of books.
        } else {
          // If it's not an array, it's an error object from the backend!
          console.error("Backend Error:", data);
          alert("Database Connection Failed!\n\nError: " + (data.error || "Unknown error. Press F12 and check the Console tab."));
          setBooks([]); // Set to empty array to prevent the .map() crash
        }
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setBooks([]);
      });
  }, []);

  return (
    <div>
      <h2>Dashboard - Book Availability</h2>
      <table className="data-table">
        <thead>
          <tr><th>Title</th><th>Author</th><th>Genre</th><th>Stock</th></tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id} className={book.quantity < 2 ? 'low-stock' : ''}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.quantity} {book.quantity < 2 && <span className="badge">LOW STOCK</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}