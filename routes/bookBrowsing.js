const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/books/genre/:genre
router.get('/books/genre/:genre', async (req, res) => {
  const { genre } = req.params;

  try {
    const [books] = await db.query(
      'SELECT * FROM book WHERE genre = ? ORDER BY book_id',
      [genre]
    );

    return res.status(200).json(books);
  } catch (error) {
    console.error('Failed to retrieve books by genre:', error);
    return res.status(500).json({ error: 'Unable to retrieve books by genre' });
  }
});

module.exports = router;