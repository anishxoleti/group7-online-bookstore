const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const [cartRows] = await db.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
        if (cartRows.length === 0) {
            return res.status(200).json({ cartId: null, items: [] });
        }
        const cartId = cartRows[0].cart_id;
        const [items] = await db.query(
            'SELECT ci.cart_id, ci.book_id, ci.quantity, b.title, b.price FROM cart_item ci JOIN book b ON ci.book_id = b.book_id WHERE ci.cart_id = ?',
            [cartId]
        );
        res.status(200).json({ cartId, items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { userId, bookId, quantity } = req.body;
        let [cartRows] = await db.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
        let cartId;
        if (cartRows.length === 0) {
            const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
            cartId = result.insertId;
        } else {
            cartId = cartRows[0].cart_id;
        }
        const [existingItem] = await db.query(
            'SELECT * FROM cart_item WHERE cart_id = ? AND book_id = ?',
            [cartId, bookId]
        );
        if (existingItem.length > 0) {
            const newQty = existingItem[0].quantity + (quantity || 1);
            await db.query('UPDATE cart_item SET quantity = ? WHERE cart_id = ? AND book_id = ?', [newQty, cartId, bookId]);
        } else {
            await db.query('INSERT INTO cart_item (cart_id, book_id, quantity) VALUES (?, ?, ?)', [cartId, bookId, quantity || 1]);
        }
        res.status(201).json({ message: 'Item added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/item/:cartId/:bookId', async (req, res) => {
    try {
        const { cartId, bookId } = req.params;
        await db.query('DELETE FROM cart_item WHERE cart_id = ? AND book_id = ?', [cartId, bookId]);
        res.status(200).json({ message: 'Item removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/subtotal/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const [result] = await db.query(
            `SELECT SUM(ci.quantity * b.price) AS subtotal
             FROM cart_item ci
             JOIN cart c ON ci.cart_id = c.cart_id
             JOIN book b ON ci.book_id = b.book_id
             WHERE c.user_id = ?`,
            [userId]
        );

        const subtotal = result[0].subtotal || 0;
        res.status(200).json({ subtotal: parseFloat(subtotal).toFixed(2) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;