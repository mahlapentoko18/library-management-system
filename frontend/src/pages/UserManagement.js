import React, { useState, useEffect } from 'react';
import { fetchUsers, loginUser, addUser, updateUser, deleteUser } from '../services/api';

export default function UserManagement({ user, setUser }) {
  const [users, setUsers] = useState([]);
  const [loginForm, setLoginForm] = useState({ membership_id: '', password: '' });
  const [form, setForm] = useState({ name: '', membership_id: '', role: '', password: '' });
  const [editId, setEditId] = useState(null);

  const loadUsers = () => fetchUsers().then(setUsers);
  useEffect(() => { if (user) loadUsers(); }, [user]);

   const handleLogin = async (e) => {
    e.preventDefault();
    const res = await loginUser(loginForm);
    const data = await res.json(); // <--- THIS LINE WAS MISSING!
    
    if (data.success) {
      setUser(data.user);
    } else {
      alert('Invalid credentials');
    }
  };
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (editId) await updateUser(editId, form);
    else await addUser(form);
    setForm({ name: '', membership_id: '', role: '', password: '' });
    setEditId(null);
    loadUsers();
  };

  if (!user) {
    return (
      <div className="login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Membership ID" value={loginForm.membership_id} onChange={e => setLoginForm({...loginForm, membership_id: e.target.value})} required />
          <input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>User Management (Admin View)</h2>
      <form onSubmit={handleUserSubmit} className="form-grid">
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Membership ID" value={form.membership_id} onChange={e => setForm({...form, membership_id: e.target.value})} required />
        <input placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button type="submit">{editId ? 'Update' : 'Add'} User</button>
      </form>

      <table className="data-table">
        <thead><tr><th>Name</th><th>ID</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td><td>{u.membership_id}</td><td>{u.role}</td>
              <td>
                <button onClick={() => { setForm(u); setEditId(u.id); }}>Edit</button>
                <button onClick={() => { deleteUser(u.id); loadUsers(); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}