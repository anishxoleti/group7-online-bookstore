-- =====================================================================
-- Group 7 Online Bookstore: database schema + dummy data
-- CEN 4010 Software Engineering I
--
-- HOW TO RUN (MySQL Workbench): File > Open SQL Script > this file >
-- lightning bolt (Execute all).
--
-- Re-running this file DELETES the bookstore database and rebuilds it
-- with fresh dummy data. Use it whenever your local data gets messy.
--
-- All data below is FAKE (made-up people, books, and test card tokens).
-- Matches the merged schema diagram (Sprint 2).
-- =====================================================================

DROP DATABASE IF EXISTS bookstore;
CREATE DATABASE bookstore;
USE bookstore;

-- =====================================================================
-- TABLES (created in foreign-key order)
-- =====================================================================

-- Book Browsing and Sorting --------------------------------------------
CREATE TABLE publisher (
  publisher_id INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL
);

-- Book Details -----------------------------------------------------------
CREATE TABLE author (
  author_id    INT AUTO_INCREMENT PRIMARY KEY,
  first_name   VARCHAR(100) NOT NULL,
  last_name    VARCHAR(100) NOT NULL,
  biography    TEXT,
  publisher_id INT,
  FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

CREATE TABLE book (
  book_id        INT AUTO_INCREMENT PRIMARY KEY,
  isbn           VARCHAR(13)   NOT NULL UNIQUE,
  title          VARCHAR(255)  NOT NULL,
  description    TEXT,
  price          DECIMAL(10,2) NOT NULL,
  genre          VARCHAR(50),
  year_published INT,
  copies_sold    INT NOT NULL DEFAULT 0,
  author_id      INT,
  publisher_id   INT,
  FOREIGN KEY (author_id)    REFERENCES author(author_id),
  FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

-- Profile Management -----------------------------------------------------
CREATE TABLE user (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100),
  last_name     VARCHAR(100),
  email         VARCHAR(254),
  home_address  VARCHAR(500)
);

CREATE TABLE credit_card (
  credit_card_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  payment_token    VARCHAR(255) NOT NULL,
  cardholder_name  VARCHAR(200),
  last_four        CHAR(4),
  expiration_month TINYINT,
  expiration_year  SMALLINT,
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- Shopping Cart ----------------------------------------------------------
CREATE TABLE cart (
  cart_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,              -- one cart per user
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE cart_item (
  cart_id  INT NOT NULL,
  book_id  INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (cart_id, book_id),           -- same book can't be added twice
  FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
  FOREIGN KEY (book_id) REFERENCES book(book_id)
);

-- Book Rating and Commenting ---------------------------------------------
CREATE TABLE rating (
  rating_id    INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  book_id      INT NOT NULL,
  rating_value TINYINT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  FOREIGN KEY (book_id) REFERENCES book(book_id)
);

CREATE TABLE comment (
  comment_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  book_id      INT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  FOREIGN KEY (book_id) REFERENCES book(book_id)
);

-- Wish List Management ---------------------------------------------------
CREATE TABLE wishlist (
  wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  name        VARCHAR(100) NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, name),                   -- names unique per user
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE wishlist_item (
  wishlist_id INT NOT NULL,
  book_id     INT NOT NULL,
  added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (wishlist_id, book_id),       -- same book can't be added twice
  FOREIGN KEY (wishlist_id) REFERENCES wishlist(wishlist_id),
  FOREIGN KEY (book_id)     REFERENCES book(book_id)
);

-- =====================================================================
-- DUMMY DATA
-- IDs auto-increment from 1 in the order rows are inserted below.
-- Don't reorder existing rows; other tables reference these IDs.
-- To add rows, append them to the end of the matching INSERT.
-- =====================================================================

-- publisher_id 1-4
INSERT INTO publisher (name) VALUES
  ('Northwind Press'),          -- 1  (5 books: good for the discount demo)
  ('Bluebird Books'),           -- 2
  ('Lantern House Publishing'), -- 3
  ('Redwood & Pine');           -- 4

-- author_id 1-8
INSERT INTO author (first_name, last_name, biography, publisher_id) VALUES
  ('Mara',   'Ellison', 'Fantasy and romance novelist from Portland.',            1), -- 1
  ('Theo',   'Vance',   'Former engineer who writes science fiction and tech.',  1), -- 2
  ('Priya',  'Raman',   'Mystery writer known for coastal whodunits.',           1), -- 3
  ('Lucas',  'Ortega',  'Writes epic fantasy and beach-town romance.',           2), -- 4
  ('Hannah', 'Kim',     'Science fiction and mystery author.',                   2), -- 5
  ('Samuel', 'Okafor',  'Award-winning author of three genre-bending novels.',   3), -- 6
  ('Sofia',  'Marin',   'Personal finance coach and nonfiction writer.',         3), -- 7
  ('Ethan',  'Brooks',  'Horror author who grew up in a small mountain town.',   4); -- 8

-- book_id 1-15  (6 genres, all copies_sold values different, prices vary)
INSERT INTO book (isbn, title, description, price, genre, year_published, copies_sold, author_id, publisher_id) VALUES
  ('9781000000001', 'Ember Crown of Valdris',          'A reluctant heir must claim a cursed throne.',              18.99, 'Fantasy',         2015, 12500, 1, 1), -- 1
  ('9781000000002', 'The Salt Mage',                   'A sailor discovers she can command the sea.',                14.99, 'Fantasy',         2019,  8300, 4, 2), -- 2
  ('9781000000003', 'Orchard of Glass Wolves',         'Twin siblings guard an enchanted forest.',                   16.50, 'Fantasy',         2021,  4100, 6, 3), -- 3
  ('9781000000004', 'Starlight Protocol 9',            'A rogue AI hides inside a deep-space relay.',                21.00, 'Science Fiction', 2018, 15200, 2, 1), -- 4
  ('9781000000005', 'Orbit of Quiet Machines',         'Robots on a silent moon start dreaming.',                    12.75, 'Science Fiction', 2022,  2900, 5, 2), -- 5
  ('9781000000006', 'The Last Signal from Kepler Bay', 'A radio operator hears a message from the future.',          19.99, 'Science Fiction', 2020,  9700, 6, 3), -- 6
  ('9781000000007', 'Murder at Pelican Pier',          'A detective investigates a death at a seaside festival.',     9.99, 'Mystery',         2017, 18400, 3, 1), -- 7
  ('9781000000008', 'The Lantern Street Cipher',       'A code hidden in old streetlights leads to a crime.',        13.49, 'Mystery',         2023,  1500, 5, 2), -- 8
  ('9781000000009', 'Seven Clocks at Midnight',        'Seven suspects, seven clocks, one stolen hour.',             11.25, 'Mystery',         2016,  6600, 6, 3), -- 9
  ('9781000000010', 'Letters to Marigold Lane',        'Two pen pals fall in love without meeting.',                  8.99, 'Romance',         2014, 21000, 1, 1), -- 10
  ('9781000000011', 'A Summer in Cobalt Bay',          'A summer job turns into a second chance at love.',           10.50, 'Romance',         2024,   750, 4, 2), -- 11
  ('9781000000012', 'Budgeting for Busy Students',     'Simple money habits for college students.',                  24.99, 'Non-Fiction',     2023,  3300, 7, 3), -- 12
  ('9781000000013', 'Code Your First API',             'A beginner guide to building REST APIs.',                    34.95, 'Non-Fiction',     2025,  5200, 2, 1), -- 13
  ('9781000000014', 'The House on Hollow Ridge',       'A family inherits a house that remembers.',                  15.00, 'Horror',          2012, 11000, 8, 4), -- 14
  ('9781000000015', 'Whispers Under Ash Creek',        'Campers hear voices coming from the water.',                  7.99, 'Horror',          2025,   400, 8, 4); -- 15

-- user_id 1-6  (password_hash values are placeholders for testing)
INSERT INTO user (username, password_hash, first_name, last_name, email, home_address) VALUES
  ('alice_reads',  'dummy_hash_1', 'Alice',  'Moreno', 'alice@example.com',  '101 Palm Ave, Miami, FL 33101'),      -- 1
  ('bookworm_ben', 'dummy_hash_2', 'Ben',    'Carter', 'ben@example.com',    '22 Coral Way, Miami, FL 33145'),      -- 2
  ('carla_m',      'dummy_hash_3', 'Carla',  'Mendez', 'carla@example.com',  NULL),                                 -- 3
  ('dev_daniel',   'dummy_hash_4', 'Daniel', 'Lee',    'daniel@example.com', '9 Bayview Dr, Doral, FL 33172'),      -- 4
  ('emma_writes',  'dummy_hash_5', 'Emma',   'Rhodes', 'emma@example.com',   '480 Ocean Blvd, Hollywood, FL 33019'), -- 5
  ('frank_t',      'dummy_hash_6', NULL,     NULL,     NULL,                 NULL);                                 -- 6 (only required fields)

-- credit_card_id 1-6  (fake test tokens; user 1 has two cards, user 6 has none)
INSERT INTO credit_card (user_id, payment_token, cardholder_name, last_four, expiration_month, expiration_year) VALUES
  (1, 'tok_test_0001', 'Alice Moreno', '4242',  8, 2028),
  (1, 'tok_test_0002', 'Alice Moreno', '5555',  1, 2027),
  (2, 'tok_test_0003', 'Ben Carter',   '1111', 11, 2029),
  (3, 'tok_test_0004', 'Carla Mendez', '0005',  3, 2028),
  (4, 'tok_test_0005', 'Daniel Lee',   '4444',  6, 2030),
  (5, 'tok_test_0006', 'Emma Rhodes',  '1881', 12, 2027);

-- cart_id 1-5 belong to user_id 1-5. User 6 has no cart. Cart 5 is empty.
INSERT INTO cart (user_id) VALUES (1), (2), (3), (4), (5);

INSERT INTO cart_item (cart_id, book_id, quantity) VALUES
  (1,  1, 1), (1,  5, 2), (1, 12, 1),   -- Alice: 3 books, one with quantity 2
  (2,  3, 1), (2,  8, 1),               -- Ben: 2 books
  (3, 10, 3),                           -- Carla: 1 book, quantity 3
  (4,  2, 1), (4,  7, 1), (4, 14, 2);   -- Daniel: 3 books
                                        -- Emma (cart 5): empty

-- Ratings: several per book with different values. Books 13-15 have no ratings.
INSERT INTO rating (user_id, book_id, rating_value) VALUES
  (1, 1, 5), (2, 1, 4), (3, 1, 5), (4, 1, 4),   -- book 1  avg 4.50
  (1, 2, 3), (3, 2, 4), (5, 2, 3),              -- book 2  avg 3.33
  (2, 3, 5), (4, 3, 5), (6, 3, 5),              -- book 3  avg 5.00
  (1, 4, 2), (2, 4, 3),                         -- book 4  avg 2.50
  (3, 5, 4), (5, 5, 5), (6, 5, 4),              -- book 5  avg 4.33
  (2, 6, 1), (4, 6, 2),                         -- book 6  avg 1.50
  (1, 7, 4), (6, 7, 3),                         -- book 7  avg 3.50
  (3, 8, 5), (5, 8, 4),                         -- book 8  avg 4.50
  (4, 9, 3),                                    -- book 9  avg 3.00
  (1, 10, 5), (2, 10, 5), (5, 10, 4),           -- book 10 avg 4.67
  (6, 11, 2), (3, 11, 3),                       -- book 11 avg 2.50
  (2, 12, 4);                                   -- book 12 avg 4.00

INSERT INTO comment (user_id, book_id, comment_text) VALUES
  (1,  1, 'Loved the world-building. Could not put it down.'),
  (2,  1, 'Great start, slow middle, amazing ending.'),
  (4,  1, 'Already waiting for the sequel.'),
  (2,  3, 'The forest scenes were beautiful.'),
  (6,  3, 'Best fantasy I read this year.'),
  (3,  5, 'Quiet but thoughtful sci-fi.'),
  (5,  5, 'The robot characters felt real.'),
  (1, 10, 'Sweet and funny. Perfect beach read.'),
  (2, 10, 'The letters format worked really well.'),
  (5,  2, 'Fun adventure with a strong lead.'),
  (3,  8, 'I did not guess the ending.'),
  (4, 14, 'Genuinely creepy. Read it with the lights on.');

-- wishlist_id 1-6. "Summer Reads" is used by two different users (allowed).
INSERT INTO wishlist (user_id, name) VALUES
  (1, 'Summer Reads'),   -- 1
  (1, 'Gift Ideas'),     -- 2
  (2, 'Summer Reads'),   -- 3
  (3, 'Sci-Fi Picks'),   -- 4
  (4, 'To Read Next'),   -- 5
  (4, 'Spooky Season');  -- 6

-- Wishlist books are NOT already in that user's cart (so "move to cart" works).
INSERT INTO wishlist_item (wishlist_id, book_id) VALUES
  (1,  2), (1,  9), (1, 11),
  (2, 13), (2, 15),
  (3,  4), (3, 11),
  (4,  4), (4,  5), (4,  6),
  (5,  9), (5, 10),
  (6, 15), (6,  9);