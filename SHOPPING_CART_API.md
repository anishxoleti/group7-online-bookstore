# Shopping Cart API Documentation

This document outlines the RESTful endpoints, request formats, and responses for the **Shopping Cart** feature in the Group 7 Online Bookstore API.

**Base URL:** `http://localhost:3000/cart`

---

## 1. Add Item to Cart
Adds a book to a user's shopping cart or increments its quantity if it already exists.

* **Endpoint:** `POST /cart/add`
* **Request Body (JSON):**
  ```json
  {
    "userId": 1,
    "bookId": 2,
    "quantity": 1
  }
  ```
* **Success Response (`201 Created`):**
  ```json
  {
    "message": "Item added successfully"
  }
  ```

---

## 2. Retrieve Cart Items
Fetches all books currently in a specific user's shopping cart along with quantities and prices.

* **Endpoint:** `GET /cart/:userId`
* **URL Parameter:** `userId` (Integer)
* **Success Response (`200 OK`):**
  ```json
  {
    "cartId": 1,
    "items": [
      {
        "cart_id": 1,
        "book_id": 2,
        "quantity": 1,
        "title": "Clean Code",
        "price": "34.99"
      }
    ]
  }
  ```

---

## 3. Update Cart Item Quantity
Updates the quantity of an existing book inside a specific shopping cart.

* **Endpoint:** `PUT /cart/item`
* **Request Body (JSON):**
  ```json
  {
    "cartId": 1,
    "bookId": 2,
    "quantity": 3
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Cart item quantity updated successfully"
  }
  ```
* **Error Responses:** `400 Bad Request` (invalid input), `404 Not Found` (item not in cart).

---

## 4. Calculate Cart Subtotal
Calculates the total cost of all items in a user's shopping cart (`SUM(quantity * price)`).

* **Endpoint:** `GET /cart/subtotal/:userId`
* **URL Parameter:** `userId` (Integer)
* **Success Response (`200 OK`):**
  ```json
  {
    "subtotal": "104.97"
  }
  ```

---

## 5. Remove Item from Cart
Deletes a specific book from a shopping cart.

* **Endpoint:** `DELETE /cart/item/:cartId/:bookId`
* **URL Parameters:** `cartId` (Integer), `bookId` (Integer)
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Item removed successfully"
  }
  ```