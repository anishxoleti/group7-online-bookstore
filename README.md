# Group 7 Online Bookstore API

REST API backend for a fictitious online bookstore, built with **Express.js (Node.js)** and **MySQL** for CEN 4010 Software Engineering I.

All six features run as **one web service** with **one shared database**. Each team member owns one feature end to end: its tables, its dummy data, its routes and its final demo.

---

## Contents

1. [Team and feature ownership](#1-team-and-feature-ownership)
2. [Install these first](#2-install-these-first)
3. [First-time project setup](#3-first-time-project-setup)
4. [Environment variables (.env)](#4-environment-variables-env)
5. [Project structure](#5-project-structure)
6. [Database setup](#6-database-setup)
7. [Adding your routes](#7-adding-your-routes)
8. [Git workflow](#8-git-workflow)
9. [Testing with Postman](#9-testing-with-postman)
10. [Sprint timeline](#10-sprint-timeline)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Team and feature ownership

| Feature | Owner | Route file | Tables owned |
|---|---|---|---|
| Book Browsing and Sorting | Anish Oleti | `routes/bookBrowsing.js` | `publisher` |
| Book Details | Alfonso Oramas Jr | `routes/bookDetails.js` | `book`, `author` |
| Profile Management | Tobias Ordonez | `routes/profile.js` | `user`, `credit_card` |
| Shopping Cart | Edip Nedim Ozbek | `routes/cart.js` | `cart_item` |
| Book Rating and Commenting | Humberto Padron | `routes/ratings.js` | `rating`, `comment` |
| Wish List Management | Rodolfo Paez Piedrahita | `routes/wishlists.js` | `wishlist`, `wishlist_book` |

### How grading works

- Each feature has **4 HTTP routes** from the Feature Checklist. Each route is worth **10 points** (40 per feature).
- After Sprint 5, **each person records their own demo** (max 6 minutes) in Postman showing their routes work. It's submitted individually.
- The tables and dummy data you build are what your routes use. No tables means nothing to demo.

### Suggested endpoints

Everything lives under one base URI, `/api`, organized by entity, per the REST API Expectations doc. Owners can rename their paths, but **update this table first** so nobody collides.

| Feature | Method | Path | Sends | Returns |
|---|---|---|---|---|
| **Book Browsing** | GET | `/api/books/genre/:genre` | genre | JSON list of books |
| | GET | `/api/books/top-sellers` | none | Top 10 books by copies sold |
| | GET | `/api/books/rating/:rating` | rating | Books with rating ≥ value |
| | PATCH | `/api/books/discount` | body: `publisher`, `discountPercent` | none |
| **Book Details** | POST | `/api/books` | body: book object | none |
| | GET | `/api/books/:isbn` | ISBN | Book JSON |
| | POST | `/api/authors` | body: author object | none |
| | GET | `/api/authors/:authorId/books` | author ID | JSON list of books |
| **Profile Mgmt** | POST | `/api/users` | body: user object | none |
| | GET | `/api/users/:username` | username | User JSON |
| | PATCH | `/api/users/:username` | body: fields to update (**not email**) | none |
| | POST | `/api/users/:username/credit-cards` | body: card object | none |
| **Shopping Cart** | GET | `/api/cart/:userId/subtotal` | user ID | Subtotal |
| | POST | `/api/cart/:userId/books` | body: `bookId` | none |
| | GET | `/api/cart/:userId/books` | user ID | JSON list of books |
| | DELETE | `/api/cart/:userId/books/:bookId` | user ID, book ID | none |
| **Rating & Commenting** | POST | `/api/books/:bookId/ratings` | body: `userId`, `rating` (1–5) | none |
| | POST | `/api/books/:bookId/comments` | body: `userId`, `comment` | none |
| | GET | `/api/books/:bookId/comments` | book ID | JSON list of comments |
| | GET | `/api/books/:bookId/average-rating` | book ID | Average as a decimal |
| **Wish List** | POST | `/api/wishlists` | body: `userId`, `name` | none |
| | POST | `/api/wishlists/:wishlistId/books` | body: `bookId` | none |
| | DELETE | `/api/wishlists/:wishlistId/books/:bookId` | wishlist ID, book ID | none |
| | GET | `/api/wishlists/:wishlistId/books` | wishlist ID | JSON list of books |

**Notes from the Feature Checklist:**
- Profile: a user can update any field **except email**.
- Wish List: the checklist says remove a book from the wishlist "into the user's shopping cart". The owner decides whether DELETE also adds the book to the cart. Coordinate with the Shopping Cart owner.
- Rating and comment rows need a **datestamp**.

---

## 2. Install these first

| Tool | Version | Download | Check it works |
|---|---|---|---|
| Git | Latest | https://git-scm.com/downloads | `git --version` |
| Node.js | **LTS** (18 or newer, required by Express 5) | https://nodejs.org | `node -v` and `npm -v` |
| MySQL Community Server | 8.0 or newer | https://dev.mysql.com/downloads/mysql/ | MySQL Workbench connects |
| MySQL Workbench | Latest | https://dev.mysql.com/downloads/workbench/ | Opens and connects to `localhost` |
| IntelliJ IDEA | Team IDE | https://www.jetbrains.com/idea/ | Any editor works; everything runs from the terminal |
| Postman | Latest | https://www.postman.com/downloads/ | Used for testing and demos |
| GitHub Desktop | Optional | https://desktop.github.com | Easiest way to push and pull |

**MySQL install tips**
- **Write down the root password** you set during install. You need it for your `.env` and there's no way to look it up later.
- Keep the default port **3306**.
- Windows: the MySQL Installer can install Server and Workbench together.

---

## 3. First-time project setup

**1. Clone the repo**
- IntelliJ: **File → New → Project from Version Control** (welcome screen: **Get from VCS**), then paste the URL below.
- Or in a terminal:
```
git clone https://github.com/anishxoleti/group7-online-bookstore.git
cd group7-online-bookstore
```

**2. Install dependencies** (express, mysql2, dotenv)
```
npm install
```

**3. Create your `.env` file** from the template
```
copy .env.example .env      # Windows
cp .env.example .env        # Mac
```
Open `.env` and put your MySQL root password in `DB_PASSWORD`.

**4. Set up the database.** See [Database setup](#6-database-setup).

**5. Start the server**
```
npm start
```
You should see:
```
◇ injected env (5) from .env
Server running on port 3000
```

**6. Test it.** Open http://localhost:3000/health and you should see `{"status":"ok"}`. Stop the server with **Ctrl+C**.

**7. Create your sprint branch.** See [Git workflow](#8-git-workflow).

---

## 4. Environment variables (.env)

| Variable | Example | What it is |
|---|---|---|
| `DB_HOST` | `localhost` | Where MySQL runs (your own machine) |
| `DB_USER` | `root` | Your MySQL username |
| `DB_PASSWORD` | `your_mysql_password` | **Your own** MySQL password |
| `DB_NAME` | `bookstore` | Database name. Everyone uses `bookstore` |
| `PORT` | `3000` | Port the API runs on |

**Rules**
- **Never commit `.env`.** It holds your password, and this repo is public. `.gitignore` already blocks it.
- `.env.example` **is** committed. It's the blank template. If you add a new variable, add it there too (without real values).
- Restart the server after changing `.env`.

---

## 5. Project structure

```
group7-online-bookstore/
├── app.js              # Express app; every feature's routes get mounted here
├── db.js               # Shared MySQL connection pool (import this in your routes)
├── routes/             # One file per feature (see ownership table)
├── db/
│   ├── schema.sql      # Combined CREATE TABLE + dummy data for ALL features (main)
│   └── features/       # Each person's own .sql file (optional, on your branch)
├── .env.example        # Template for your local .env
├── package.json        # Dependencies + npm start script
└── package-lock.json   # Exact dependency versions. Don't edit by hand.
```

---

## 6. Database setup

Everyone runs their **own local MySQL**, but it's the **same schema** for everyone: one database, all features' tables in it.

### Run the combined script

Once `db/schema.sql` is on main:

**MySQL Workbench (easiest)**
1. Connect to your local instance.
2. **File → Open SQL Script** and pick `db/schema.sql` from the project folder.
3. Click the **lightning bolt** to run it.

**Or the command line**
```
mysql -u root -p
source db/schema.sql;
```
(Run `mysql` from the project folder. On Windows, if `mysql` isn't recognized, use Workbench.)

`schema.sql` starts with `DROP DATABASE IF EXISTS bookstore;`, so **re-running it resets everything** back to fresh dummy data. Use it whenever your data gets messy.

**Until `schema.sql` exists**, just create the empty database:
```sql
CREATE DATABASE bookstore;
```

### Table order (foreign keys need this)

```
publisher → author → book → user → credit_card → cart_item → rating → comment → wishlist → wishlist_book
```
A table can only reference tables created before it.

### Naming conventions (match the merged diagram exactly)

- Table names: lowercase, snake_case, singular (`book`, `cart_item`, `wishlist_book`)
- Columns: snake_case (`copies_sold`, `year_published`)
- Primary key: `<table>_id INT AUTO_INCREMENT PRIMARY KEY` (ex: `book_id`)
- Foreign key: the same name as the column it points to (`book_id` in `cart_item` → `book.book_id`)
- Money: `DECIMAL(10,2)`
- Datestamps: `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`

### Your feature's .sql file

Each person writes **one file** for their own tables, named after the feature (ex: `db/features/shopping_cart.sql`):
1. `CREATE TABLE` for each of your tables
2. `INSERT` statements with about 10 rows of dummy data per table

Send it to Alfonso, who combines everyone's files into `db/schema.sql` on main.

### What "dummy data" means

- **Fake** sample rows for testing: made-up names, emails and titles, never real people or info.
- About 10 rows per table.
- **Varied enough that your routes return something useful**: books in 3+ genres, different prices and ratings, 2+ publishers, users with different carts and wishlists.
- IDs must exist in the tables they reference (a `book_id` in `cart_item` must be a real `book.book_id`).
- Credit cards: **fake test numbers only** (ex: `4111111111111111`), never real cards.

---

## 7. Adding your routes

### 1. Create your route file in `routes/`

Example `routes/bookBrowsing.js`:
```js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/books/genre/:genre
router.get('/books/genre/:genre', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM book WHERE genre = ?',
      [req.params.genre]
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

### 2. Mount it in `app.js` (one line per feature)

```js
app.use('/api', require('./routes/bookBrowsing'));
app.use('/api', require('./routes/bookDetails'));
app.use('/api', require('./routes/profile'));
app.use('/api', require('./routes/cart'));
app.use('/api', require('./routes/ratings'));
app.use('/api', require('./routes/wishlists'));
```
**Keep Book Browsing above Book Details.** Otherwise `/api/books/top-sellers` gets read as an ISBN by `/api/books/:isbn`.

### Rules for route code

- **Always use `?` placeholders** for values in SQL. Never paste user input into the query string. That's how SQL injection happens.
    - Good: `db.query('SELECT * FROM book WHERE genre = ?', [genre])`
    - Bad: ``db.query(`SELECT * FROM book WHERE genre = '${genre}'`)``
- Request data:
    - URL params: `req.params.genre`
    - Query string: `req.query.x`
    - JSON body: `req.body.x`
- Return JSON for anything that returns data.
- Use the right status codes (from the REST API Expectations doc):

| Situation | Code |
|---|---|
| GET success | `200 OK` |
| POST created | `201 Created` |
| PUT/PATCH/DELETE success, nothing to return | `204 No Content` (or `200` with a message) |
| Bad or missing input | `400 Bad Request` |
| Thing doesn't exist | `404 Not Found` |
| Server or database error | `500 Internal Server Error` |

- Keep the API **stateless**: every request carries everything it needs. Don't store anything between requests in server memory.

---

## 8. Git workflow

The course requires **your own feature branch every sprint**.

### Branch naming

```
feature/<your-feature>-sprint<N>
```
Examples:
- `feature/book-browsing-sprint2`
- `feature/shopping-cart-sprint3`

### Start of every sprint
```
git checkout main
git pull
git checkout -b feature/<your-feature>-sprint<N>
git push -u origin feature/<your-feature>-sprint<N>
```

### While working
```
git add .
git commit -m "Add GET books by genre route"
git push
```
Commit small and often, with messages that say what changed.

### Merging into main (starts Sprint 3)

1. Push your branch.
2. On GitHub: **Pull requests → New pull request**, with base `main` and compare set to your branch.
3. Ask one teammate to look it over, then **Merge**.
4. Everyone else updates their local main:
```
git checkout main
git pull
```
If you get a **merge conflict in `app.js`**, it's usually two people adding their `app.use(...)` line. Keep **both** lines.

### Rules

- **Don't push straight to main.** Shared setup files (skeleton, `schema.sql`) are the only exception.
- **Never commit** `.env`, `node_modules/` or `.idea/`. All are already in `.gitignore`. Run `git status` before committing to check.
- **Pull main before starting new work.**

### Push authentication

GitHub doesn't accept your account password for `git push`. Use one of these:
- **GitHub Desktop:** sign in, then use **Push origin**.
- **IntelliJ:** **Settings → Version Control → GitHub → + → Log In via GitHub**, then **Git → Push**.
- **Personal access token:** GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic), with the `repo` scope. Paste it as the password when `git push` asks.

---

## 9. Testing with Postman

1. Start the server with `npm start`.
2. In Postman, choose the method (GET, POST, etc.) and enter the URL, ex: `http://localhost:3000/api/books/genre/Fantasy`.
3. For POST, PUT and PATCH: **Body → raw → JSON**, then enter your data:
```json
{ "publisher": "Penguin", "discountPercent": 10 }
```
4. Click **Send** and check the status code and response.

### What the final demo must show (from the Project Sequence doc)

| Request | Must show |
|---|---|
| GET | The correct data in the response |
| POST | The new data **was created in the database** |
| DELETE | The data **was deleted from the database** |
| PUT/PATCH | The **before and after** data in the database |

For POST, DELETE and PUT/PATCH, show the table in MySQL Workbench before and after the request.

---

## 10. Sprint timeline

| Sprint | Focus |
|---|---|
| 1 | Setup and framework learning: tools, GitHub, ERDs |
| 2 | Data modeling and seeding: merged schema, tables, dummy data, example GET, feature branches. **Team video** |
| 3 | Implement half of your HTTP routes, merge to main. **Team video** |
| 4 | Implement the rest of your routes, merge to main. UML diagrams due week 1. **Team video** |
| 5 | Smoke test all routes, developer documentation, merge to main. GitHub integration due week 1 |
| After 5 | **Individual** feature demo in Postman (max 6 min) |

---

## 11. Troubleshooting

| Error | Fix |
|---|---|
| `npm ERR! Missing script: "start"` | `package.json` needs `"start": "node app.js"` under `scripts`. Run `node app.js` meanwhile. |
| `Cannot find module 'express'` | Run `npm install`. |
| `EADDRINUSE: address already in use :::3000` | The server is already running in another terminal. Stop it with Ctrl+C, or change `PORT` in `.env`. |
| `ER_ACCESS_DENIED_ERROR` | Wrong `DB_USER` or `DB_PASSWORD` in `.env`. |
| `ER_BAD_DB_ERROR: Unknown database 'bookstore'` | Run `db/schema.sql`, or `CREATE DATABASE bookstore;`. |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL isn't running. Windows: **Services → MySQL80 → Start**. |
| `ER_NO_SUCH_TABLE` | Tables don't exist yet. Run `db/schema.sql`. |
| `ER_NO_REFERENCED_ROW_2` on INSERT | You're referencing an ID that doesn't exist. Insert the parent row first, or fix the ID. |
| `'mysql' is not recognized` (Windows) | Use MySQL Workbench, or add `C:\Program Files\MySQL\MySQL Server 8.x\bin` to your PATH. |
| `Authentication failed` on `git push` | See [Push authentication](#push-authentication). |
| `LF will be replaced by CRLF` | Harmless Windows line-ending notice. Ignore it. |
| Changed `.env` but nothing happened | Restart the server. |

Questions or blockers? Post them in the group chat or bring them to stand-up.