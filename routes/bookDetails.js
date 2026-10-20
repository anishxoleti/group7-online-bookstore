const express = require('express');
const router = express.Router();
const db = require('../db');

// Find a book by its ISBN
router.get('/books/:isbn', async (req, res) => {
  const { isbn } = req.params;

  if (!/^\d{13}$/.test(isbn)) {
    return res.status(400).json({
      error: 'ISBN must contain exactly 13 digits'
    });
  }

  try {
    const [books] = await db.query(
      'SELECT * FROM book WHERE isbn = ?',
      [isbn]
    );

    if (books.length === 0) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    return res.status(200).json(books[0]);
  } catch (error) {
    console.error('Failed to retrieve book:', error);

    return res.status(500).json({
      error: 'Unable to retrieve book'
    });
  }
});

module.exports = router;