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

// Create an author
router.post('/authors', async (req, res) => {
  const { first_name, last_name, biography = null, publisher_id = null } =
    req.body ?? {};

  if (
    typeof first_name !== 'string' || !first_name.trim() ||
    typeof last_name !== 'string' || !last_name.trim() ||
    first_name.trim().length > 100 || last_name.trim().length > 100
  ) {
    return res.status(400).json({
      error: 'First and last names are required and must be at most 100 characters'
    });
  }

  if (
    (biography !== null && typeof biography !== 'string') ||
    (publisher_id !== null && (!Number.isInteger(publisher_id) || publisher_id < 1))
  ) {
    return res.status(400).json({
      error: 'Biography must be text and publisher_id must be a positive integer'
    });
  }

  try {
    await db.query(
      `INSERT INTO author (first_name, last_name, biography, publisher_id)
       VALUES (?, ?, ?, ?)`,
      [first_name.trim(), last_name.trim(), biography, publisher_id]
    );

    return res.status(201).end();
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Publisher does not exist' });
    }

    console.error('Failed to create author:', error);
    return res.status(500).json({ error: 'Unable to create author' });
  }
});

// Create a book
router.post('/books', async (req, res) => {
  const {
    isbn,
    title,
    price,
    description = null,
    genre = null,
    year_published = null,
    author_id = null,
    publisher_id = null
  } = req.body ?? {};

  if (typeof isbn !== 'string' || !/^\d{13}$/.test(isbn)) {
    return res.status(400).json({ error: 'ISBN must contain exactly 13 digits' });
  }

  if (typeof title !== 'string' || !title.trim() || title.trim().length > 255) {
    return res.status(400).json({
      error: 'Title is required and must be at most 255 characters'
    });
  }

  if (typeof price !== 'number' || !/^\d{1,8}(\.\d{1,2})?$/.test(String(price))) {
    return res.status(400).json({
      error: 'Price must be a nonnegative number with at most two decimal places'
    });
  }

  if (
    (description !== null && typeof description !== 'string') ||
    (genre !== null && (typeof genre !== 'string' || genre.length > 50)) ||
    (year_published !== null && (!Number.isInteger(year_published) || year_published < 1))
  ) {
    return res.status(400).json({
      error: 'Description must be text, genre must be at most 50 characters, and year_published must be a positive integer'
    });
  }

  for (const id of [author_id, publisher_id]) {
    if (id !== null && (!Number.isInteger(id) || id < 1)) {
      return res.status(400).json({
        error: 'author_id and publisher_id must be positive integers'
      });
    }
  }

  try {
    await db.query(
      `INSERT INTO book
         (isbn, title, description, price, genre, year_published, author_id, publisher_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [isbn, title.trim(), description, price, genre, year_published, author_id, publisher_id]
    );

    return res.status(201).end();
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A book with this ISBN already exists' });
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Author or publisher does not exist' });
    }

    console.error('Failed to create book:', error);
    return res.status(500).json({ error: 'Unable to create book' });
  }
});

module.exports = router;