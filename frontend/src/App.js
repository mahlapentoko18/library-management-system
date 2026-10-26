import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BookManagement from './pages/BookManagement';
import UserManagement from './pages/UserManagement';
import Transactions from './pages/Transactions';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h2>Library Management System</h2>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/books">Books</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/users">Users</Link>
            {user ? <span className="welcome">Welcome, {user.name}</span> : <Link to="/users">Login</Link>}
          </div>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<BookManagement />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/users" element={<UserManagement user={user} setUser={setUser} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;