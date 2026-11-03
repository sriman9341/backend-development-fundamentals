# Lab 3: REST API, Query Parameters, Validation and Debugging

**Course:** Backend Development Fundamentals (BDF)  
**Lab Assignment:** Lab 3 – REST API Design, Query Parameters Filtering, Request Validation, and Server Debugging  

---

## Student Details

| Field | Detail |
| :--- | :--- |
| **Student Name** | B. UDAY SAI SRIMAN |
| **Registration Number** | 252U1R8005 |
| **Section** | CSE (AE) – 2A |
| **Course** | Backend Development Fundamentals |
| **Academic Year & Term** | II Year, Term II |
| **College** | Aurora |
| **Faculty In-Charge** | Sai Siva Teja |

---

## Live Deployment

- **Live URL:** [Pending Deployment / Local Verified at `http://localhost:3000`](http://localhost:3000)
- **Deployment Status:** Configured for Render Web Service (Root Directory: `lab-03`).
- *Note on Cloud Persistence:* Free-tier cloud platforms (such as Render) employ an ephemeral filesystem. On server spin-down or redeployment, local files including SQLite databases reset to their git-committed state. In production environments, a managed cloud database (e.g., PostgreSQL / MySQL) or a persistent disk volume is utilized.

---

## How to Run

### Prerequisites
- **Node.js** (v18.x, v20.x, or v24.x recommended)
- **npm** (v9.x or higher)
- **Postman** (for API testing)

### 1. Navigate to the `lab-03` Directory
```bash
cd lab-03
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize / Seed SQLite Database
Populates `books.db` with 10 programming books across varied price points:
```bash
node init-db.js
# or via npm script:
npm run seed
```

### 4. Run Development Server (Auto-Reloading via Nodemon)
```bash
npm run dev
```

### 5. Run Production Server
```bash
npm start
```

### 6. Run Automated Verification Test Suite
Runs all 29 automated test cases covering endpoints, query parameters, sorting, pagination, and status codes:
```bash
npm test
# or:
node test-endpoints.js
```

---

## Endpoints / Scripts Table

### 1. REST API Endpoints Summary

| Method | Endpoint | Description | Request Body | Success Status | Error Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **GET** | `/` | API Information, Student Details & Query Options | None | `200 OK` | — |
| **GET** | `/books` | Retrieve books with optional search, sorting, pagination & price filtering | None | `200 OK` | `400 Bad Request`, `500 Error` |
| **GET** | `/books/:id` | Retrieve single book by primary key ID | None | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **POST** | `/books` | Create a new book record | JSON (`title`, `author`, `price`, optional `pages`) | `201 Created` | `400 Bad Request`, `500 Error` |
| **PUT** | `/books/:id` | Update an existing book's details by ID | JSON (`title`, `author`, `price`, optional `pages`) | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/books/:id` | Delete an existing book by ID | None | `200 OK` | `400 Bad Request`, `404 Not Found` |

### 2. GET `/books` Query Parameters Specification

| Query Param | Type | Default Value | Description | Validation & Allowlist Rules |
| :--- | :--- | :---: | :--- | :--- |
| `search_q` | String | `""` | Case-insensitive partial title search | Uses SQL `title LIKE ?` with `%search_q%`. |
| `order_by` | String | `"id"` | Column identifier for sorting | Allowlist: `['id', 'title', 'author', 'price', 'pages']`. Rejects invalid with `400`. |
| `order` | String | `"ASC"` | Sort order direction | Allowlist: `['ASC', 'DESC']` (case-insensitive). Rejects invalid with `400`. |
| `limit` | Integer | `10` | Maximum number of records to return | Must be an integer `> 0`. Rejects non-positive or non-numeric with `400`. |
| `offset` | Integer | `0` | Number of records to skip | Must be an integer `>= 0`. Rejects negative or non-numeric with `400`. |
| `min_price` | Number | — | Minimum price lower bound | Must be a non-negative number (`>= 0`). Rejects invalid with `400`. |
| `max_price` | Number | — | Maximum price upper bound | Must be a non-negative number (`>= 0`). Rejects invalid with `400`. |
| *Both* | Range | — | Combined price filter (`price >= min AND price <= max`) | Validates `min_price <= max_price`. Rejects inverted range with `400`. |

### 3. NPM Scripts Summary

| Command | Script | Description |
| :--- | :--- | :--- |
| `npm start` | `node app.js` | Starts the Express server on port 3000 |
| `npm run dev` | `nodemon app.js` | Starts server with live auto-reloading during development |
| `npm run seed` | `node init-db.js` | Recreates and populates `books.db` with 10 initial records |
| `npm test` | `node test-endpoints.js` | Executes the 29-assertion automated end-to-end test suite |

---

## Screenshots

Actual visual verification screenshots captured from live Postman execution and terminal sessions are maintained in [`screenshots/`](./screenshots/):

### 1. Retrieve All Books (`GET /books`)
- **Route:** `GET http://localhost:3000/books`
- **Status:** `200 OK`
- **Screenshot:**
![Retrieve All Books](./screenshots/01-get-all-books.png)

---

### 2. Retrieve Single Book by ID (`GET /books/1`)
- **Route:** `GET http://localhost:3000/books/1`
- **Status:** `200 OK`
- **Screenshot:**
![Retrieve Single Book](./screenshots/02-get-single-book.png)

---

### 3. Search Books by Title (`GET /books?search_q=Clean`)
- **Route:** `GET http://localhost:3000/books?search_q=Clean`
- **Status:** `200 OK`
- **Screenshot:**
![Search Books](./screenshots/03-search-books.png)

---

### 4. Sort Books Ascending (`GET /books?order_by=price&order=ASC`)
- **Route:** `GET http://localhost:3000/books?order_by=price&order=ASC`
- **Status:** `200 OK`
- **Screenshot:**
![Sort Books Ascending](./screenshots/04-sort-asc.png)

---

### 5. Sort Books Descending (`GET /books?order_by=price&order=DESC`)
- **Route:** `GET http://localhost:3000/books?order_by=price&order=DESC`
- **Status:** `200 OK`
- **Screenshot:**
![Sort Books Descending](./screenshots/05-sort-desc.png)

---

### 6. Pagination with Limit & Offset (`GET /books?limit=3&offset=3`)
- **Route:** `GET http://localhost:3000/books?limit=3&offset=3`
- **Status:** `200 OK`
- **Screenshot:**
![Pagination](./screenshots/06-pagination.png)

---

### 7. Minimum Price Filter (`GET /books?min_price=700`)
- **Route:** `GET http://localhost:3000/books?min_price=700`
- **Status:** `200 OK`
- **Screenshot:**
![Min Price Filter](./screenshots/07-min-price-filter.png)

---

### 8. Maximum Price Filter (`GET /books?max_price=500`)
- **Route:** `GET http://localhost:3000/books?max_price=500`
- **Status:** `200 OK`
- **Screenshot:**
![Max Price Filter](./screenshots/08-max-price-filter.png)

---

### 9. Combined Price Range Filter (`GET /books?min_price=600&max_price=800`)
- **Route:** `GET http://localhost:3000/books?min_price=600&max_price=800`
- **Status:** `200 OK`
- **Screenshot:**
![Price Range Filter](./screenshots/09-price-range.png)

---

### 10. Insert New Book Valid (`POST /books`)
- **Route:** `POST http://localhost:3000/books`
- **Status:** `201 Created`
- **Screenshot:**
![Insert New Book](./screenshots/10-post-book-valid.png)

---

### 11. Reject Invalid POST Request (`POST /books`)
- **Route:** `POST http://localhost:3000/books` (Missing required fields)
- **Status:** `400 Bad Request`
- **Screenshot:**
![Reject Invalid POST](./screenshots/11-post-book-invalid.png)

---

### 12. Update Book by ID (`PUT /books/1`)
- **Route:** `PUT http://localhost:3000/books/1`
- **Status:** `200 OK`
- **Screenshot:**
![Update Book](./screenshots/12-put-book.png)

---

### 13. Delete Book by ID (`DELETE /books/11`)
- **Route:** `DELETE http://localhost:3000/books/11`
- **Status:** `200 OK`
- **Screenshot:**
![Delete Book](./screenshots/13-delete-book.png)

---

### 14. Non-Existing Book Record 404 (`GET /books/999`)
- **Route:** `GET http://localhost:3000/books/999`
- **Status:** `404 Not Found`
- **Screenshot:**
![Non Existing Record](./screenshots/14-not-found-404.png)

---

### 15. SQLite Database CLI Verification (`books.db`)
- **Tool:** SQLite CLI (`sqlite3 books.db`)
- **Command:** `SELECT * FROM book;`
- **Screenshot:**
![SQLite Database Records](./screenshots/15-database-records.png)

---

## Notes

### 1. Lab Objectives
1. Implement complete noun-based RESTful API endpoints for the `book` resource (`GET /books`, `GET /books/:id`, `POST /books`, `PUT /books/:id`, `DELETE /books/:id`).
2. Add dynamic query parameters to `GET /books` for partial search (`search_q`), sorting (`order_by`, `order`), and pagination (`limit`, `offset`).
3. Support standalone and combined price range filters (`min_price`, `max_price`) using parameterized SQL conditions.
4. Enforce strict request payload validation on `POST` and `PUT` (verifying required non-empty string `title`, `author`, and numeric non-negative `price`).
5. Ensure proper and consistent HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).
6. Deliver consistent, meaningful JSON responses for all success and error scenarios.
7. Perform the **Debugging Exercise**: understand, diagnose, and resolve four common backend bugs (`EADDRINUSE`, wrong import paths, SQLite table typo, and missing `await`).
8. Create and verify a complete Postman collection (`postman_collection.json`) covering all 12+ required evaluation test cases.

---

### 2. Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Node.js** (v24.x) | Asynchronous server-side JavaScript runtime environment |
| **Express.js** (v5.x) | Minimalist web application framework for routing and middleware |
| **sqlite3** (v6.x) | Native SQLite database driver for Node.js |
| **sqlite** (v5.x) | Promise-based asynchronous abstraction wrapper for SQLite3 queries |
| **nodemon** (v3.x) | Live reload development server |
| **Postman** | REST client for API manual testing and automated test execution |

---

### 3. Directory Structure

```text
lab-03/
├── app.js                   # Express application, routes, query parsing, validation & debug handling
├── books.db                 # SQLite relational database containing the 'book' table
├── init-db.js               # Database initialization and seeder script (10 records)
├── test-endpoints.js        # Automated verification test suite (29 test assertions)
├── package.json             # NPM package manifest with dependencies and scripts
├── package-lock.json        # Pinned dependency lockfile
├── postman_collection.json  # Importable 13-request Postman test collection
├── .gitignore               # Excludes node_modules/, .env, and logs
├── README.md                # Full lab report following exact Lab 2 format
└── screenshots/             # Route and terminal verification screenshots
    └── README.md            # Screenshot inventory and instructions
```

---

### 4. Database Table Structure

#### Table Schema
```sql
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  pages INTEGER
);
```

#### Initial Seeded Records (10 Books)
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

### 5. SQL Security: Parameterization vs. Allowlisting

#### Why Input Concatenation is Dangerous
Directly inserting user values into SQL strings creates severe SQL Injection vulnerabilities:
```javascript
// DANGEROUS - HIGH VULNERABILITY:
const sql = `SELECT * FROM book WHERE title LIKE '%${request.query.search_q}%' ORDER BY ${request.query.order_by};`;
```
An attacker could pass `search_q=' OR '1'='1` or pass `order_by=price; DROP TABLE book;--` to tamper with or completely delete database tables.

#### Safe Defense Strategy Used in Lab 3
1. **Parameterized Queries for Values:**  
   Every dynamic data filter (`search_q`, `min_price`, `max_price`, `limit`, `offset`, and record IDs) is passed strictly using SQLite `?` placeholders:
   ```javascript
   conditions.push('title LIKE ?');
   params.push(`%${search_q.trim()}%`);
   ```
   The SQLite engine interprets `?` strictly as data literals, never as executable SQL instructions.

2. **Allowlisting for SQL Identifiers:**  
   SQL identifiers like column names (`ORDER BY`) and direction keywords (`ASC`, `DESC`) cannot be parameterized with `?`. Therefore, they must be validated against a strict in-memory allowlist:
   ```javascript
   const ALLOWED_ORDER_BY = ['id', 'title', 'author', 'price', 'pages'];
   const ALLOWED_ORDER = ['ASC', 'DESC'];

   const sanitizedOrderBy = String(order_by).toLowerCase().trim();
   if (!ALLOWED_ORDER_BY.includes(sanitizedOrderBy)) {
     return response.status(400).json({ error: 'Invalid order_by column.' });
   }
   ```
   Any unauthorized string is immediately rejected with HTTP `400 Bad Request` before the query is built.

---

### 6. Debugging Exercise: Common Backend Errors & Solutions

#### A. `EADDRINUSE` – Port Already in Use
- **Root Cause:** Another process (such as a previous unclosed Node instance, background service, or another web server) is already listening on port 3000.
- **Console Symptom:**
  ```text
  Error: listen EADDRINUSE: address already in use :::3000
      at Server.setupListenHandle [as _listen2] (node:net:2145:21)
  ```
- **Diagnostic Command (PowerShell):**
  ```powershell
  Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
  ```
- **Solution:**
  1. Kill the conflicting process:
     ```powershell
     Stop-Process -Id <PID> -Force
     ```
  2. Or configure a dynamic port using environment variables:
     ```bash
     PORT=3001 npm start
     ```
  3. Graceful handling in `app.js`:
     ```javascript
     server.on('error', (err) => {
       if (err.code === 'EADDRINUSE') {
         console.error(`[EADDRINUSE] Port ${PORT} is occupied. Please free port or run with PORT=${Number(PORT)+1}`);
       }
       process.exit(1);
     });
     ```

#### B. Wrong Import Path
- **Root Cause:** Using incorrect relative paths, miscalculated parent directory navigation (`../../`), or filename casing mistakes (e.g., `require('./models/book')` instead of `require('./app')`).
- **Console Symptom:**
  ```text
  Error: Cannot find module '../models/book'
  Require stack:
  - C:\...\lab-03\app.js
  ```
- **Solution:**
  Always resolve filesystem paths using Node's standard `path` module with `__dirname`:
  ```javascript
  const path = require('path');
  const dbPath = path.join(__dirname, 'books.db');
  ```
  Double-check all module relative paths (`./init-db`, `./app`) and verify case sensitivity across operating systems.

#### C. SQLite Table-Name Typo – `no such table`
- **Root Cause:** A query references `books` (plural) or `Books` when the table was defined as `book` (singular), or querying an optional table like `sqlite_sequence` when `AUTOINCREMENT` was not declared.
- **Console Symptom:**
  ```text
  SQLITE_ERROR: no such table: books
  ```
- **Solution:**
  1. Inspect the SQLite schema directly in SQLite CLI:
     ```bash
     sqlite3 books.db ".schema"
     ```
  2. Standardize table naming across all queries:
     ```javascript
     // Ensure exact table name 'book' is used across all endpoints:
     const query = 'SELECT * FROM book WHERE id = ?;';
     ```
  3. Ensure database initialization executes `CREATE TABLE IF NOT EXISTS book (...)` before running queries.

#### D. Missing `await` in Asynchronous Database Operation
- **Root Cause:** Forgetting the `await` keyword before a promise-returning database call:
  ```javascript
  // BUG: Missing await
  const books = db.all('SELECT * FROM book;');
  response.status(200).json(books);
  ```
- **Symptom:** Because `db.all()` returns a `Promise`, `books` holds `Promise { <pending> }`. Express serializes this to `{}` (an empty JSON object) or throws `TypeError: books.map is not a function`. The client receives empty or incorrect data, and asynchronous errors escape the try-catch block unhandled.
- **Solution:**
  Always mark route handlers as `async` and prefix every database method (`db.all()`, `db.get()`, `db.run()`, `db.exec()`) with `await`:
  ```javascript
  // CORRECT:
  app.get('/books', async (request, response) => {
    try {
      const books = await db.all(sql, params);
      response.status(200).json(books);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });
  ```

---

### 7. Automated Testing Suite & Verification Results

The test suite in `test-endpoints.js` validates all 5 CRUD routes, query parameters, sorting allowlists, pagination, price ranges, request validations, and HTTP error codes.

Run tests:
```bash
node test-endpoints.js
```

#### Actual Console Execution Log
```text
===============================================================
   STARTING LAB 3 AUTOMATED API & QUERY PARAMETERS TEST SUITE  
===============================================================

[PASS] Test 01: GET / (Root Route API Info & Metadata)
[PASS] Test 02: GET /books (Retrieve all books with default parameters)
[PASS] Test 03: GET /books/1 (Retrieve book ID 1 - Status 200)
[PASS] Test 04: GET /books/999 (Non-existent book ID returns 404 Not Found)
[PASS] Test 05: GET /books/invalid-id (Invalid non-numeric ID returns 400 Bad Request)
[PASS] Test 06: GET /books?search_q=Clean (Search filter returns matching books)
[PASS] Test 07: GET /books?order_by=price&order=ASC (Sort ascending by price)
[PASS] Test 08: GET /books?order_by=price&order=DESC (Sort descending by price)
[PASS] Test 09: GET /books?order_by=unauthorized_col (Disallowed column rejected with 400)
[PASS] Test 10: GET /books?order=INVALID (Disallowed order rejected with 400)
[PASS] Test 11: GET /books?limit=3&offset=0 (Pagination page 1 returns 3 records)
[PASS] Test 12: GET /books?limit=3&offset=3 (Pagination page 2 returns distinct records)
[PASS] Test 13: GET /books?limit=-5 (Negative limit rejected with 400)
[PASS] Test 14: GET /books?min_price=700 (Filter books with price >= 700)
[PASS] Test 15: GET /books?max_price=500 (Filter books with price <= 500)
[PASS] Test 16: GET /books?min_price=600&max_price=800 (Filter range [600, 800])
[PASS] Test 17: GET /books?min_price=900&max_price=500 (min > max rejected with 400)
[PASS] Test 18: POST /books (Create valid book record - Status 201 Created)
[PASS] Test 19: GET /books/11 (Verify created book exists in database)
[PASS] Test 20: POST /books (Validation: Missing title rejected with 400)
[PASS] Test 21: POST /books (Validation: Missing author rejected with 400)
[PASS] Test 22: POST /books (Validation: Non-numeric price rejected with 400)
[PASS] Test 23: PUT /books/11 (Update existing book - Status 200 OK)
[PASS] Test 24: GET /books/11 (Verify updated fields reflected in DB)
[PASS] Test 25: PUT /books/999 (Update non-existent book returns 404)
[PASS] Test 26: DELETE /books/11 (Delete existing book - Status 200 OK)
[PASS] Test 27: GET /books/11 (Confirm deleted book returns 404 Not Found)
[PASS] Test 28: DELETE /books/999 (Delete non-existent book returns 404 Not Found)
[PASS] Test 29: GET /non-existent-route-xyz (Undefined route returns 404)

===============================================================
TEST SUITE RESULTS: 29/29 PASSED (100%)
===============================================================
```

---

### 8. Postman Collection Verification Guide

The file [`postman_collection.json`](./postman_collection.json) contains pre-configured requests covering all 12 evaluation requirements:

1. **Importing into Postman:**
   - Open Postman, click **Import** in the upper left corner.
   - Drag or choose `lab-03/postman_collection.json`.
   - The collection contains a collection variable `baseUrl = http://localhost:3000`.

2. **Requests Included:**
   - `0. Root - API Information` (`GET /`)
   - `1. GET All Books (Default)` (`GET /books`)
   - `2. GET Book by ID (Existing)` (`GET /books/1`)
   - `3. Search Books (search_q=Clean)` (`GET /books?search_q=Clean`)
   - `4a. Sort Books ASC` (`GET /books?order_by=price&order=ASC`)
   - `4b. Sort Books DESC` (`GET /books?order_by=price&order=DESC`)
   - `5. Pagination` (`GET /books?limit=3&offset=3`)
   - `6. Minimum Price Filter` (`GET /books?min_price=700`)
   - `7. Maximum Price Filter` (`GET /books?max_price=500`)
   - `7b. Combined Price Range Filter` (`GET /books?min_price=600&max_price=800`)
   - `8. Create Valid Book` (`POST /books`)
   - `9. Reject Invalid POST Request` (`POST /books`)
   - `10. Update Book` (`PUT /books/1`)
   - `11. Delete Book` (`DELETE /books/11`)
   - `12. Test Non-Existing ID (Verify 404)` (`GET /books/999`)
   - `13. SQL Injection Prevention Test` (`GET /books?order_by=invalid_column;--`)

---

### 9. Viva Questions & Answers

#### Q1: What is the difference between Route Parameters and Query Parameters?
**Answer:**  
- **Route Parameters (`req.params`):** Embedded in the URL path (e.g., `/books/:id`) and used to uniquely identify a specific resource.
- **Query Parameters (`req.query`):** Appended after a `?` in the URL (e.g., `/books?search_q=Clean&limit=5`) and used to filter, sort, search, or paginate resources without changing the resource identity.

#### Q2: Why can't we use SQL `?` parameterization for `ORDER BY` column names?
**Answer:**  
Database engines treat `?` placeholders strictly as data values (literals like `'title'`). If you write `ORDER BY ?`, the database orders by the string literal itself rather than by the column's data. Therefore, column identifiers must be placed into the query string, but MUST be strictly validated against an in-memory allowlist to prevent SQL injection.

#### Q3: What is the difference between HTTP status codes 400, 404, and 500?
**Answer:**  
- **`400 Bad Request`:** Client error caused by invalid input, missing required parameters, or failed validation.
- **`404 Not Found`:** The requested endpoint URL or specific resource ID does not exist.
- **`500 Internal Server Error`:** Unhandled server-side failure or unexpected database exception.

#### Q4: What happens if an `await` is omitted in an asynchronous database operation?
**Answer:**  
The method immediately returns an unresolved `Promise` object instead of the actual data array or row. Express will serialize `{}` or crash when trying to access properties on the promise, leading to empty responses or runtime errors.

#### Q5: How does pagination work using `LIMIT` and `OFFSET`?
**Answer:**  
- `LIMIT`: Specifies the maximum number of rows returned per request (page size).
- `OFFSET`: Specifies how many rows to skip before beginning to return records.  
For example, to fetch page 3 with 5 items per page: `limit = 5`, `offset = (3 - 1) * 5 = 10`.

#### Q6: How do you resolve an `EADDRINUSE` error?
**Answer:**  
Identify the process occupying the port using `Get-NetTCPConnection -LocalPort <PORT>` or `netstat -ano`, terminate it with `Stop-Process -Id <PID>`, or start the application on a different port using the `PORT` environment variable (`PORT=3001 npm start`).

