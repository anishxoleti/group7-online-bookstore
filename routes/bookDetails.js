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

// Get all books by an author
router.get('/authors/:authorId/books', async (req, res) => {
  const { authorId } = req.params;

  if (!/^[1-9]\d*$/.test(authorId)) {
    return res.status(400).json({
      error: 'Author ID must be a positive whole number'
    });
  }

  try {
    const [authors] = await db.query(
      'SELECT author_id FROM author WHERE author_id = ?',
      [authorId]
    );

    if (authors.length === 0) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    const [books] = await db.query(
      'SELECT * FROM book WHERE author_id = ? ORDER BY book_id',
      [authorId]
    );

    return res.status(200).json(books);
  } catch (error) {
    console.error('Failed to retrieve author books:', error);

    return res.status(500).json({
      error: 'Unable to retrieve author books'
    });
  }
});
module.exports = router;