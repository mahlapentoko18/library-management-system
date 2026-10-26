const express = require('express');
const router = express.Router();
const db = require('../db');

// POST Add/Deduct Stock
router.post('/', async (req, res) => {
    const { book_id, user_id, type, quantity } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get current book quantity
        const [bookRows] = await connection.query('SELECT quantity FROM books WHERE id = ?', [book_id]);
        if (bookRows.length === 0) throw new Error('Book not found');
        
        let currentQty = bookRows[0].quantity;
        let newQty = type === 'ADD' ? currentQty + quantity : currentQty - quantity;

        if (newQty < 0) throw new Error('Insufficient stock');

        // 2. Update book quantity
        await connection.query('UPDATE books SET quantity = ? WHERE id = ?', [newQty, book_id]);

        // 3. Log transaction
        await connection.query(
            'INSERT INTO transactions (book_id, user_id, type, quantity) VALUES (?, ?, ?, ?)',
            [book_id, user_id, type, quantity]
        );

        await connection.commit();
        res.json({ message: `Stock ${type.toLowerCase()}ed successfully`, newQuantity: newQty });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// GET Transaction History
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.id, b.title, u.name, t.type, t.quantity, t.transaction_date 
            FROM transactions t
            JOIN books b ON t.book_id = b.id
            JOIN users u ON t.user_id = u.id
            ORDER BY t.transaction_date DESC
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;