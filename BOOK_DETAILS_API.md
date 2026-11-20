# Book Details API

The Book Details API creates authors and books, looks up books by ISBN,
and lists books by author. The default local base URL is
`http://localhost:3000/api`.

## Endpoints

| Method | Path | Successful response |
| --- | --- | --- |
| POST | `/authors` | `201 Created` with an empty body |
| POST | `/books` | `201 Created` with an empty body |
| GET | `/books/:isbn` | `200 OK` with a book object |
| GET | `/authors/:authorId/books` | `200 OK` with an array of books |

## Create an author

Send `POST /api/authors` with `Content-Type: application/json`.

`first_name` and `last_name` are required and must each be at most 100
characters. `biography` and `publisher_id` are optional. If supplied,
`publisher_id` must be a positive integer that identifies an existing publisher.

```json
{
  "first_name": "Maya",
  "last_name": "Chen",
  "biography": "A fictional author for the demo."
}
```

The response body is empty. To find the generated `author_id` for this example,
run the following query in MySQL Workbench against your local demo database.

```sql
SELECT author_id
FROM bookstore.author
WHERE first_name = 'Maya' AND last_name = 'Chen'
ORDER BY author_id DESC
LIMIT 1;
```

## Create a book

Send `POST /api/books` with `Content-Type: application/json`.

- `isbn` is a required string containing exactly 13 digits. It must be unique.
- `title` is required and must be at most 255 characters.
- `price` is a required nonnegative JSON number with up to eight digits before
  the decimal point and two after it.
- `description`, `genre`, `year_published`, `author_id`, and `publisher_id`
  are optional. `genre` can be at most 50 characters. `year_published` must
  be a positive integer. When supplied, author and publisher IDs must be
  positive integers that identify existing records.

Replace `9` with the ID from your author lookup. If you already used the
example ISBN, choose a different unused 13-digit string.

```json
{
  "isbn": "9781000000016",
  "title": "The Lantern Archive",
  "price": 14.99,
  "genre": "Fantasy",
  "year_published": 2026,
  "author_id": 9
}
```

## Look up a book or list an author's books

- `GET /api/books/9781000000016` returns the book for that ISBN.
- `GET /api/authors/9/books` returns books linked to author `9`. An existing
  author with no books gets an empty array (`[]`).

## Error responses

| Status | When it occurs |
| --- | --- |
| `400 Bad Request` | Invalid or missing input, or a POST references an author or publisher that does not exist |
| `404 Not Found` | A GET looks up an ISBN or author ID that does not exist |
| `409 Conflict` | A book POST uses an ISBN that already exists |
| `500 Internal Server Error` | An unexpected server or database error occurs |

## Run the smoke test

Start MySQL and configure the local `.env` to point to your demo database.
Run `npm start` from the repository root. In a second terminal, run:

```powershell
node smokeTestBookDetails.js
```

The script creates an author and a book, checks that both GET endpoints
return the new book, and checks the duplicate-ISBN and invalid-input
responses. A successful run prints `Book Details smoke test passed.`
The test leaves its author and book in the local database for inspection.