const API_URL = 'http://localhost:5000/api';

export const fetchBooks = () => fetch(`${API_URL}/books`).then(res => res.json());
export const addBook = (book) => fetch(`${API_URL}/books`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(book) });
export const updateBook = (id, book) => fetch(`${API_URL}/books/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(book) });
export const deleteBook = (id) => fetch(`${API_URL}/books/${id}`, { method: 'DELETE' });

export const fetchUsers = () => fetch(`${API_URL}/users`).then(res => res.json());
export const loginUser = (creds) => fetch(`${API_URL}/users/login`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(creds) });
export const addUser = (user) => fetch(`${API_URL}/users`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user) });
export const updateUser = (id, user) => fetch(`${API_URL}/users/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user) });
export const deleteUser = (id) => fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });

export const fetchTransactions = () => fetch(`${API_URL}/transactions`).then(res => res.json());
export const processTransaction = (data) => fetch(`${API_URL}/transactions`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });