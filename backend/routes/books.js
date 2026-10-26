const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all books
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM books');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST add book
router.post('/', async (req, res) => {
    const { title, author, genre, isbn, quantity } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?)',
            [title, author, genre, isbn, quantity]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update book
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, genre, isbn, quantity } = req.body;
    try {
        await db.query(
            'UPDATE books SET title=?, author=?, genre=?, isbn=?, quantity=? WHERE id=?',
            [title, author, genre, isbn, quantity, id]
        );
        res.json({ message: 'Book updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE book
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM books WHERE id=?', [id]);
        res.json({ message: 'Book deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;