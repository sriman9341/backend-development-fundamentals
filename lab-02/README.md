# Lab 2: SQLite Database and CRUD Routes

**Course:** Backend Development Fundamentals (BDF)  
**Lab Assignment:** Lab 2 – Connecting Express.js to SQLite Database and Exposing CRUD REST Endpoints  

---

## Student Details

| Field | Detail |
| :--- | :--- |
| **Student Name** | B. UDAY SAI SRIMAN |
| **Registration Number** | 252U1R8005 |
| **Section** | CSE AE - 2A |
| **Course** | Backend Development Fundamentals |
| **Academic Year & Term** | II Year, Term II |
| **College** | Aurora |
| **Faculty In-Charge** | Joel Prashanth D |

---

## Live Deployment

- **Live URL:** [Pending Render Deployment / Local Verified at `http://localhost:3000`](http://localhost:3000)
- **Deployment Status:** Configured for Render Web Service (Root Directory: `lab-02`).
- *Note on Cloud Persistence:* Free-tier cloud platforms (such as Render) employ an ephemeral filesystem. On server spin-down or redeployment, local files including SQLite databases reset to their git-committed state. In production environments, a managed cloud database (e.g., PostgreSQL / MySQL) or a persistent disk volume is utilized.

---

## Lab Objective

1. Establish an asynchronous connection between an **Express.js** web server and a **SQLite** relational database (`books.db`).
2. Implement an asynchronous initialization function `initializeDBAndServer()` to guarantee that the database connects and tables exist before HTTP traffic is accepted.
3. Define the relational schema for a `book` entity with required attributes (`id`, `title`, `author`, `price`, `pages`).
4. Implement all five RESTful **CRUD** (Create, Read, Update, Delete) HTTP operations:
   - `GET /books/`
   - `GET /books/:bookId/`
   - `POST /books/`
   - `PUT /books/:bookId/`
   - `DELETE /books/:bookId/`
5. Prevent SQL injection attacks by enforcing parameterized SQL queries with `?` placeholders.
6. Validate all incoming request payloads, types, and route parameters.
7. Conduct end-to-end API testing via **Postman** and export a verified collection (`postman_collection.json`).

---

## Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Node.js** (v24.x) | Asynchronous server-side JavaScript runtime environment |
| **Express.js** (v5.x) | Lightweight web application routing framework |
| **sqlite3** (v6.x) | Native SQLite driver for Node.js |
| **sqlite** (v5.x) | Promise-based asynchronous wrapper for SQLite queries |
| **nodemon** (v3.x) | Development utility that automatically restarts the server on file changes |
| **Postman** | API development, request formatting, and automated endpoint verification |

---

## Directory Structure

```text
lab-02/
├── app.js                      # Main Express server and CRUD route handlers
├── init-db.js                  # Database seeder script for initial book records
├── test-endpoints.js           # Automated end-to-end test suite (15 test assertions)
├── generate-screenshots.ps1    # Automated screenshot generator utility
├── books.db                    # SQLite database containing the 'book' table
├── package.json                # Project dependencies, scripts, and metadata
├── package-lock.json           # Exact dependency lockfile
├── postman_collection.json     # Ready-to-import Postman test collection
├── .gitignore                  # Prevents committing node_modules and logs
├── README.md                   # Complete lab report and documentation
└── screenshots/                # Endpoint verification screenshots
    ├── get-all-books.png
    ├── get-single-book.png
    ├── post-book.png
    ├── put-book.png
    ├── delete-book.png
    ├── database-records.png
    └── README.md
```

---

## Database Table Structure

### Table Schema

```sql
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  price INTEGER,
  pages INTEGER
);
```

### Initial Records (10 Programming Classics)

| ID | Title | Author | Price (₹) | Pages |
| :-: | :--- | :--- | :-: | :-: |
| **1** | Clean Code: A Handbook of Agile Software Craftsmanship | Robert C. Martin | 650 | 464 |
| **2** | The Pragmatic Programmer: Your Journey To Mastery | Andrew Hunt, David Thomas | 720 | 352 |
| **3** | JavaScript: The Good Parts | Douglas Crockford | 450 | 176 |
| **4** | You Don't Know JS: Scope & Closures | Kyle Simpson | 380 | 98 |
| **5** | Design Patterns: Elements of Reusable Object-Oriented Software | Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides | 890 | 395 |
| **6** | Node.js Design Patterns | Mario Casciaro, Luciano Mammino | 820 | 664 |
| **7** | Introduction to Algorithms | Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein | 1250 | 1312 |
| **8** | Refactoring: Improving the Design of Existing Code | Martin Fowler | 780 | 448 |
| **9** | Designing Data-Intensive Applications | Martin Kleppmann | 950 | 616 |
| **10** | Head First Design Patterns | Eric Freeman, Elisabeth Robson | 699 | 694 |

---

## Installation & Setup

1. **Navigate to the `lab-02` directory:**
   ```bash
   cd lab-02
   ```

2. **Install project dependencies:**
   ```bash
   npm install express sqlite sqlite3
   npm install --save-dev nodemon
   ```

3. **Verify or re-seed the SQLite database:**
   ```bash
   node init-db.js
   ```

4. **Run using Nodemon (Auto-reloading during development):**
   ```bash
   npm run dev
   ```

5. **Run in Production Mode:**
   ```bash
   npm start
   ```

---

## API Endpoints Summary

| Method | Endpoint | Description | Request Body | Success Status | Error Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **GET** | `/` | API Information & Health Check | None | `200 OK` | — |
| **GET** | `/books/` | Retrieve all books ordered by ID | None | `200 OK` | `500 Internal Error` |
| **GET** | `/books/:bookId/` | Retrieve a specific book by ID | None | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **POST** | `/books/` | Insert a new book record | JSON object (`title`, `author`, `price`, `pages`) | `201 Created` | `400 Bad Request` |
| **PUT** | `/books/:bookId/` | Update an existing book record | JSON object (`title`, `author`, `price`, `pages`) | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/books/:bookId/` | Delete a book record by ID | None | `200 OK` | `400 Bad Request`, `404 Not Found` |

---

## Endpoint Details & Example Payloads

### 1. GET `/books/` (Retrieve All Books)
- **Method:** `GET`
- **URL:** `http://localhost:3000/books/`
- **Status:** `200 OK`
- **Response Example:**
  ```json
  [
    {
      "id": 1,
      "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
      "author": "Robert C. Martin",
      "price": 650,
      "pages": 464
    },
    {
      "id": 2,
      "title": "The Pragmatic Programmer: Your Journey To Mastery",
      "author": "Andrew Hunt, David Thomas",
      "price": 720,
      "pages": 352
    }
  ]
  ```

### 2. GET `/books/:bookId/` (Retrieve Single Book)
- **Method:** `GET`
- **URL:** `http://localhost:3000/books/1/`
- **Status:** `200 OK`
- **Response Example:**
  ```json
  {
    "id": 1,
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "price": 650,
    "pages": 464
  }
  ```
- **Error Example (`/books/999/`):**
  - **Status:** `404 Not Found`
  - **Body:** `{"error": "Book with ID 999 not found"}`

### 3. POST `/books/` (Insert New Book)
- **Method:** `POST`
- **URL:** `http://localhost:3000/books/`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "title": "Clean Architecture: A Craftsman's Guide to Software Structure",
    "author": "Robert C. Martin",
    "price": 750,
    "pages": 432
  }
  ```
- **Status:** `201 Created`
- **Response Body:**
  ```json
  {
    "message": "Book Added Successfully",
    "bookId": 11
  }
  ```

### 4. PUT `/books/:bookId/` (Update Book)
- **Method:** `PUT`
- **URL:** `http://localhost:3000/books/11/`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "title": "Clean Architecture (2nd Edition)",
    "author": "Robert C. Martin",
    "price": 799,
    "pages": 450
  }
  ```
- **Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "message": "Book Updated Successfully"
  }
  ```

### 5. DELETE `/books/:bookId/` (Delete Book)
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/books/11/`
- **Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "message": "Book Deleted Successfully"
  }
  ```

---

## SQL Security & Parameterized Queries

### Why Parameterization is Critical
In unparameterized queries, user input is concatenated directly into SQL strings:
```javascript
// DANGEROUS - VULNERABLE TO SQL INJECTION:
const query = `SELECT * FROM book WHERE id = ${bookId};`;
```
An attacker could send `bookId = "1 OR 1=1"` or `"1; DROP TABLE book;"`, compromising or wiping out the database.

### Secure Implementation in Lab 2
All database queries in this project use SQLite `?` placeholders:
```javascript
// SECURE - PARAMETERIZED QUERY:
const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
const book = await db.get(getBookQuery, [parsedId]);
```
The SQLite database engine treats parameters strictly as literals and data values, never as executable SQL instructions, completely neutralizing SQL injection risks.

---

## Route Verification Screenshots

### 1. Endpoint A: Retrieve All Books (`GET /books/`)
![Retrieve All Books](./screenshots/get-all-books.png)

---

### 2. Endpoint B: Retrieve Single Book (`GET /books/1/`)
![Retrieve Single Book](./screenshots/get-single-book.png)

---

### 3. Endpoint C: Insert New Book (`POST /books/`)
![Insert New Book](./screenshots/post-book.png)

---

### 4. Endpoint D: Update Existing Book (`PUT /books/11/`)
![Update Existing Book](./screenshots/put-book.png)

---

### 5. Endpoint E: Delete Book (`DELETE /books/11/`)
![Delete Existing Book](./screenshots/delete-book.png)

---

### 6. SQLite CLI Database Verification (`books.db`)
![SQLite Database Verification](./screenshots/database-records.png)

---

## Automated Testing Suite

An automated test suite was constructed in `test-endpoints.js` validating all 5 CRUD routes, validation constraints, and database mutations.

Run the test suite with:
```bash
node test-endpoints.js
```

### Test Results
```text
=== STARTING LAB 2 CRUD ENDPOINT TEST SUITE ===

[PASS] Test 1: GET / (Root API Info)
[PASS] Test 2: GET /books/ - Retrieve all books (Status 200 & Array of books)
       Initial book count in DB: 10
[PASS] Test 3: GET /books/1/ - Retrieve book ID 1 (Status 200)
[PASS] Test 4: GET /books/999/ - Non-existent book (Status 404)
[PASS] Test 5: GET /books/abc/ - Invalid non-numeric ID (Status 400)
[PASS] Test 6: POST /books/ - Insert new book (Status 201 & Returns bookId)
       Inserted new book with ID: 11
[PASS] Test 7: GET /books/11/ - Verify inserted book exists in DB
[PASS] Test 8: POST /books/ - Missing required fields (Status 400 Validation Error)
[PASS] Test 9: PUT /books/11/ - Update existing book (Status 200)
[PASS] Test 10: GET /books/11/ - Verify updated title and price in DB
[PASS] Test 11: PUT /books/999/ - Update non-existent book (Status 404)
[PASS] Test 12: DELETE /books/11/ - Delete existing book (Status 200)
[PASS] Test 13: GET /books/11/ - Verify book is no longer in DB (Status 404)
[PASS] Test 14: DELETE /books/999/ - Delete non-existent book (Status 404)
[PASS] Test 15: GET /books/ - Final count restored to 10 records

========================================
TEST SUITE RESULTS: 15/15 PASSED (100%)
========================================
```

---

## Problems Faced and Solutions

### 1. Asynchronous Database Initialization Race Condition
- **Problem:** When starting the Express server before SQLite successfully resolves the database file connection, incoming requests immediately trigger runtime exceptions (`Cannot read properties of null (reading 'all')`).
- **Solution:** Encapsulated connection logic in `initializeDBAndServer()`. Express calls `app.listen()` strictly *after* `open({ ... })` and table creation successfully resolve.

### 2. URL Trailing Slash Inconsistencies
- **Problem:** Client requests to `/books` failed with 404 when routes were mapped exclusively to `/books/`.
- **Solution:** Express routes were configured using route arrays `['/books', '/books/']` and `['/books/:bookId', '/books/:bookId/']`, ensuring seamless compatibility regardless of client trailing slash formatting.

### 3. Non-Numeric and Invalid Parameter Handling
- **Problem:** If a client passed non-numeric text (e.g., `/books/abc`), SQLite treated it as an invalid search key or returned unexpected results.
- **Solution:** Implemented explicit ID parsing and validation (`parseInt(bookId, 10)`). Invalid or negative IDs return an immediate HTTP `400 Bad Request` with an informative error message.

### 4. Malformed Request Payloads on POST and PUT
- **Problem:** Creating or updating books with missing properties or invalid types (e.g., negative prices or string page counts) corrupted database records.
- **Solution:** Added rigorous input validation in middleware checking `typeof title === 'string'`, `typeof author === 'string'`, `typeof price === 'number' && price >= 0`, and `Number.isInteger(pages) && pages > 0`.

---

## Render Cloud Deployment Guide

To deploy this project as a live Web Service on Render:

1. **Log in to [Render](https://render.com/)** with your GitHub account.
2. Click **New +** > **Web Service**.
3. Select your repository: `sriman9341/backend-development-fundamentals`.
4. Fill in the deployment settings:
   - **Name:** `bdf-lab-02-sqlite-crud`
   - **Root Directory:** `lab-02`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Deploy Web Service**.
6. Once deployed, test the root URL `https://<service-name>.onrender.com/` and `https://<service-name>.onrender.com/books/`.
