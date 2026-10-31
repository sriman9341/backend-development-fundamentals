/**
 * Lab 2 – SQLite Database and CRUD Routes
 * Backend Development Fundamentals (BDF)
 *
 * Student Details:
 *   Name: B. UDAY SAI SRIMAN
 *   Registration Number: 252U1R8005
 *   Section: CSE AE - 2A
 *   Course: Backend Development Fundamentals
 *   Year: II Year, Term II
 *   College: Aurora
 *   Faculty: Joel Prashanth D
 */

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, 'books.db');
let db = null;

/**
 * Task 3: Initialization function
 * Connects to SQLite database, initializes table if needed,
 * and starts the Express server.
 */
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Task 2: Ensure table exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      );
    `);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`Database / Server Initialization Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Root route: API Information & Health Check
app.get('/', (request, response) => {
  response.status(200).json({
    message: 'Welcome to BDF Lab 2 - SQLite Books CRUD API',
    student: {
      name: 'B. UDAY SAI SRIMAN',
      registrationNumber: '252U1R8005',
      section: 'CSE AE - 2A',
      course: 'Backend Development Fundamentals',
      college: 'Aurora',
      faculty: 'Joel Prashanth D',
    },
    endpoints: {
      getAllBooks: 'GET /books/',
      getSingleBook: 'GET /books/:bookId/',
      addBook: 'POST /books/',
      updateBook: 'PUT /books/:bookId/',
      deleteBook: 'DELETE /books/:bookId/',
    },
  });
});

/**
 * Endpoint A: GET /books/
 * Retrieve all books from the database.
 * Status: 200 OK
 */
app.get(['/books', '/books/'], async (request, response) => {
  try {
    const getBooksQuery = `SELECT * FROM book ORDER BY id ASC;`;
    const booksArray = await db.all(getBooksQuery);
    response.status(200).json(booksArray);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

/**
 * Endpoint B: GET /books/:bookId/
 * Retrieve a specific book by its ID.
 * Status: 200 OK, or 404 Not Found if non-existent, 400 if invalid ID.
 */
app.get(['/books/:bookId', '/books/:bookId/'], async (request, response) => {
  try {
    const { bookId } = request.params;
    const parsedId = parseInt(bookId, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
      return response.status(400).json({
        error: 'Invalid book ID. ID must be a positive integer.',
      });
    }

    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const book = await db.get(getBookQuery, [parsedId]);

    if (!book) {
      return response.status(404).json({
        error: `Book with ID ${parsedId} not found`,
      });
    }

    response.status(200).json(book);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

/**
 * Endpoint C: POST /books/
 * Insert a new book into the database.
 * Request body: { title, author, price, pages }
 * Status: 201 Created, or 400 Bad Request on validation failure.
 */
app.post(['/books', '/books/'], async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    // Data validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return response.status(400).json({
        error: 'Validation failed: "title" is required and must be a non-empty string.',
      });
    }
    if (!author || typeof author !== 'string' || author.trim() === '') {
      return response.status(400).json({
        error: 'Validation failed: "author" is required and must be a non-empty string.',
      });
    }
    if (price === undefined || typeof price !== 'number' || price < 0) {
      return response.status(400).json({
        error: 'Validation failed: "price" is required and must be a non-negative number.',
      });
    }
    if (pages === undefined || typeof pages !== 'number' || pages <= 0 || !Number.isInteger(pages)) {
      return response.status(400).json({
        error: 'Validation failed: "pages" is required and must be a positive integer.',
      });
    }

    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const result = await db.run(addBookQuery, [
      title.trim(),
      author.trim(),
      price,
      pages,
    ]);

    response.status(201).json({
      message: 'Book Added Successfully',
      bookId: result.lastID,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

/**
 * Endpoint D: PUT /books/:bookId/
 * Update an existing book's details by its ID.
 * Status: 200 OK, or 404 Not Found if non-existent, 400 on validation failure.
 */
app.put(['/books/:bookId', '/books/:bookId/'], async (request, response) => {
  try {
    const { bookId } = request.params;
    const parsedId = parseInt(bookId, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
      return response.status(400).json({
        error: 'Invalid book ID. ID must be a positive integer.',
      });
    }

    // Verify existence
    const checkQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [parsedId]);

    if (!existingBook) {
      return response.status(404).json({
        error: `Book with ID ${parsedId} not found`,
      });
    }

    const { title, author, price, pages } = request.body;

    // Data validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return response.status(400).json({
        error: 'Validation failed: "title" is required and must be a non-empty string.',
      });
    }
    if (!author || typeof author !== 'string' || author.trim() === '') {
      return response.status(400).json({
        error: 'Validation failed: "author" is required and must be a non-empty string.',
      });
    }
    if (price === undefined || typeof price !== 'number' || price < 0) {
      return response.status(400).json({
        error: 'Validation failed: "price" is required and must be a non-negative number.',
      });
    }
    if (pages === undefined || typeof pages !== 'number' || pages <= 0 || !Number.isInteger(pages)) {
      return response.status(400).json({
        error: 'Validation failed: "pages" is required and must be a positive integer.',
      });
    }

    const updateBookQuery = `
      UPDATE book
      SET title = ?, author = ?, price = ?, pages = ?
      WHERE id = ?;
    `;
    await db.run(updateBookQuery, [
      title.trim(),
      author.trim(),
      price,
      pages,
      parsedId,
    ]);

    response.status(200).json({
      message: 'Book Updated Successfully',
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

/**
 * Endpoint E: DELETE /books/:bookId/
 * Delete a book from the database by its ID.
 * Status: 200 OK, or 404 Not Found if non-existent, 400 if invalid ID.
 */
app.delete(['/books/:bookId', '/books/:bookId/'], async (request, response) => {
  try {
    const { bookId } = request.params;
    const parsedId = parseInt(bookId, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
      return response.status(400).json({
        error: 'Invalid book ID. ID must be a positive integer.',
      });
    }

    // Verify existence
    const checkQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [parsedId]);

    if (!existingBook) {
      return response.status(404).json({
        error: `Book with ID ${parsedId} not found`,
      });
    }

    const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
    await db.run(deleteBookQuery, [parsedId]);

    response.status(200).json({
      message: 'Book Deleted Successfully',
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Fallback 404 for undefined routes
app.use((request, response) => {
  response.status(404).json({
    error: 'Route not found. Please verify the URL and HTTP method.',
  });
});

module.exports = app;
