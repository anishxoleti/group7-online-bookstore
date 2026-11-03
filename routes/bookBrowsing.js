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

// GET /api/books/top-sellers
router.get('/books/top-sellers', async (req, res) => {
  try {
    const [books] = await db.query(
      'SELECT * FROM book ORDER BY copies_sold DESC, book_id ASC LIMIT 10'
    );

    return res.status(200).json(books);
  } catch (error) {
    console.error('Failed to retrieve top sellers:', error);
    return res.status(500).json({ error: 'Unable to retrieve top sellers' });
  }
});

// GET /api/books/rating/:rating
router.get('/books/rating/:rating', async (req, res) => {
  const rating = Number(req.params.rating);

  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      error: 'Rating must be a number from 1 to 5'
    });
  }

  try {
    const [books] = await db.query(
      `SELECT b.*, ROUND(AVG(r.rating_value), 2) AS average_rating
       FROM book b
       JOIN rating r ON r.book_id = b.book_id
       GROUP BY b.book_id
       HAVING AVG(r.rating_value) >= ?
       ORDER BY average_rating DESC, b.book_id ASC`,
      [rating]
    );

    return res.status(200).json(books);
  } catch (error) {
    console.error('Failed to retrieve books by rating:', error);
    return res.status(500).json({ error: 'Unable to retrieve books by rating' });
  }
});

module.exports = router;