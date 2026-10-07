const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new wishlist
router.post('/wishlists', async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: 'userId and name are required' });
    }

    await db.query(
      'INSERT INTO wishlist (user_id, name) VALUES (?, ?)',
      [userId, name]
    );

    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a book to a wishlist
router.post('/wishlists/:wishlistId/books', async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ error: 'bookId is required' });
    }

    await db.query(
      'INSERT INTO wishlist_item (wishlist_id, book_id) VALUES (?, ?)',
      [req.params.wishlistId, bookId]
    );

    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a book from a wishlist
router.delete('/wishlists/:wishlistId/books/:bookId', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM wishlist_item WHERE wishlist_id = ? AND book_id = ?',
      [req.params.wishlistId, req.params.bookId]
    );

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all books in a wishlist
router.get('/wishlists/:wishlistId/books', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT book.*
       FROM book
       JOIN wishlist_item
         ON book.book_id = wishlist_item.book_id
       WHERE wishlist_item.wishlist_id = ?`,
      [req.params.wishlistId]
    );

    res.status(200).json(rows);
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message });
}
});

module.exports = router;