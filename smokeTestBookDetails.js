const assert = require('node:assert/strict');
const { randomInt, randomUUID } = require('node:crypto');
const db = require('./db');

const baseUrl = `http://localhost:${process.env.PORT || 3000}/api`;

async function request(path, expectedStatus, body) {
  const options = body === undefined ? {} : {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };

  const response = await fetch(`${baseUrl}${path}`, options);
  const responseText = await response.text();

  assert.equal(
    response.status,
    expectedStatus,
    `${options.method || 'GET'} ${path} returned ${response.status}. ` +
      `Expected ${expectedStatus}. Body: ${responseText || '(empty)'}`
  );

  console.log(`PASS ${options.method || 'GET'} ${path} → ${response.status}`);
  return responseText ? JSON.parse(responseText) : null;
}

async function runSmokeTest() {
  const author = {
    first_name: 'Smoke Test',
    last_name: randomUUID(),
    biography: 'Created by the Book Details smoke test.'
  };

  await request('/authors', 201, author);

  // The author POST returns an empty body, so look up the generated ID.
  const [authors] = await db.query(
    'SELECT author_id FROM author WHERE first_name = ? AND last_name = ?',
    [author.first_name, author.last_name]
  );
  assert.equal(authors.length, 1, 'Expected exactly one author created by this run');
  const authorId = authors[0].author_id;

  const book = {
    isbn: `978${String(randomInt(10_000_000_000)).padStart(10, '0')}`,
    title: 'The Lantern Archive (Smoke Test)',
    price: 14.99,
    genre: 'Fantasy',
    year_published: 2026,
    author_id: authorId
  };

  await request('/books', 201, book);

  const bookByIsbn = await request(`/books/${book.isbn}`, 200);
  assert.equal(bookByIsbn.isbn, book.isbn);
  assert.equal(bookByIsbn.title, book.title);
  assert.equal(bookByIsbn.author_id, authorId);

  const authorBooks = await request(`/authors/${authorId}/books`, 200);
  assert.ok(Array.isArray(authorBooks), 'Expected an array of books');
  assert.ok(
    authorBooks.some((entry) => entry.isbn === book.isbn && entry.author_id === authorId),
    'Expected the new book in the author’s book list'
  );

  await request('/books', 409, book);
  await request('/books', 400, { ...book, title: '' });

  console.log('Book Details smoke test passed.');
}

runSmokeTest()
  .finally(() => db.end())
  .catch((error) => {
    console.error(`Book Details smoke test failed: ${error.message}`);
    process.exitCode = 1;
  });