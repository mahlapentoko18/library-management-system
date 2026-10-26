const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all users
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST Login
router.post('/login', async (req, res) => {
    const { membership_id, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE membership_id = ? AND password = ?', [membership_id, password]);
        if (rows.length > 0) {
            res.json({ success: true, user: rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST add user
router.post('/', async (req, res) => {
    const { name, membership_id, role, password } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO users (name, membership_id, role, password) VALUES (?, ?, ?, ?)',
            [name, membership_id, role, password]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, membership_id, role, password } = req.body;
    try {
        await db.query(
            'UPDATE users SET name=?, membership_id=?, role=?, password=? WHERE id=?',
            [name, membership_id, role, password, id]
        );
        res.json({ message: 'User updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id=?', [id]);
        res.json({ message: 'User deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;