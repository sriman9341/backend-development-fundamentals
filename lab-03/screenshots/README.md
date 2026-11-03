# Lab 3 Endpoint Verification Screenshots

This directory is designated for saving actual Postman request and response screenshots, terminal verification, and SQLite CLI output for **Lab 3 – REST API, Query Parameters, Validation and Debugging**.

> **Faculty & Evaluator Notice:**
> Screenshots should be captured directly from your active Postman workspace and terminal while running `lab-03`. Do not generate synthetic mockups.

---

## Screenshot Inventory & File Naming

Save your screenshots in this folder using these exact filenames:

| # | Filename | Method & Endpoint / Test Case | Expected Status |
| :-: | :--- | :--- | :-: |
| **01** | `01-get-all-books.png` | `GET http://localhost:3000/books` | `200 OK` |
| **02** | `02-get-single-book.png` | `GET http://localhost:3000/books/1` | `200 OK` |
| **03** | `03-search-books.png` | `GET http://localhost:3000/books?search_q=Clean` | `200 OK` |
| **04** | `04-sort-asc.png` | `GET http://localhost:3000/books?order_by=price&order=ASC` | `200 OK` |
| **05** | `05-sort-desc.png` | `GET http://localhost:3000/books?order_by=price&order=DESC` | `200 OK` |
| **06** | `06-pagination.png` | `GET http://localhost:3000/books?limit=3&offset=3` | `200 OK` |
| **07** | `07-min-price-filter.png` | `GET http://localhost:3000/books?min_price=700` | `200 OK` |
| **08** | `08-max-price-filter.png` | `GET http://localhost:3000/books?max_price=500` | `200 OK` |
| **09** | `09-price-range.png` | `GET http://localhost:3000/books?min_price=600&max_price=800` | `200 OK` |
| **10** | `10-post-book-valid.png` | `POST http://localhost:3000/books` (Valid payload) | `201 Created` |
| **11** | `11-post-book-invalid.png` | `POST http://localhost:3000/books` (Missing fields) | `400 Bad Request` |
| **12** | `12-put-book.png` | `PUT http://localhost:3000/books/1` | `200 OK` |
| **13** | `13-delete-book.png` | `DELETE http://localhost:3000/books/11` | `200 OK` |
| **14** | `14-not-found-404.png` | `GET http://localhost:3000/books/999` | `404 Not Found` |
| **15** | `15-database-records.png` | Terminal SQLite CLI: `SELECT * FROM book;` | Database View |

---

## Step-by-Step Instructions to Capture Real Screenshots

1. **Start the Lab 3 Express Server:**
   ```bash
   cd lab-03
   npm start
   ```

2. **Open Postman:**
   - Click **Import** in Postman.
   - Select `lab-03/postman_collection.json`.
   - The collection `BDF Lab 3 - REST API, Query Parameters, Validation and Debugging` will load with all 13 pre-configured requests.

3. **Execute Requests & Capture:**
   - Execute each request in Postman.
   - On Windows, press <kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> to clip the Postman window showing the URL, HTTP method, status badge (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`), and JSON response body.
   - Save the image directly into this `screenshots/` directory using the filenames listed above.

4. **Capture SQLite Database CLI:**
   - Open PowerShell:
     ```bash
     cd lab-03
     sqlite3 books.db
     .mode box
     SELECT * FROM book;
     ```
   - Capture the terminal output and save as `15-database-records.png`.

