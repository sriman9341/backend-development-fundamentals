/**
 * Lab 3 – REST API, Query Parameters, Validation and Debugging
 * Backend Development Fundamentals (BDF)
 *
 * Student Details:
 *   Name: B. UDAY SAI SRIMAN
 *   Registration Number: 252U1R8005
 *   Section: CSE (AE) – 2A
 *   Course: Backend Development Fundamentals
 *   Year: II Year, Term II
 *   College: Aurora
 *   Faculty: Sai Siva Teja
 */

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(express.json());

// Fallback to empty object if body was not set
app.use((request, response, next) => {
  if (request.body === undefined) {
    request.body = {};
  }
  next();
});

const dbPath = path.join(__dirname, 'books.db');
let db = null;

// Allowlist for sortable columns to prevent SQL Injection
const ALLOWED_ORDER_BY = ['id', 'title', 'author', 'price', 'pages'];
const ALLOWED_ORDER = ['ASC', 'DESC'];

/**
 * Initializes and returns SQLite database connection.
 * Safe against race conditions and missing await pitfalls.
 */
const initializeDB = async () => {
  if (!db) {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Ensure table exists with exact table name 'book' (avoids table-name typo)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER
      );
    `);
  }
  return db;
};

// Middleware ensuring database is initialized before any route executes
app.use(async (request, response, next) => {
  try {
    if (!db) {
      await initializeDB();
    }
    next();
  } catch (err) {
    response.status(500).json({
      error: `Database connection error: ${err.message}`,
      message: 'Failed to connect to the database.',
    });
  }
});

/**
 * Starts the Express server and binds to the configured port.
 * Demonstrates and addresses the EADDRINUSE debugging scenario.
 */
const initializeDBAndServer = async () => {
  try {
    await initializeDB();

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });

    // Handle port collision gracefully (EADDRINUSE demonstration)
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n[DEBUGGING ALERT: EADDRINUSE]`);
        console.error(`Port ${PORT} is already occupied by another running application.`);
        console.error(`Resolution: Terminate the conflicting process using 'Stop-Process' or start with another port:`);
        console.error(`Example: PORT=3001 node app.js\n`);
      } else {
        console.error(`Server Error: ${err.message}`);
      }
      process.exit(1);
    });

    return server;
  } catch (error) {
    console.error(`Database / Server Initialization Error: ${error.message}`);
    process.exit(1);
  }
};

// Start server only when run directly from CLI
if (require.main === module) {
  initializeDBAndServer();
}

/**
 * Root Route: API Information & Health Check
 * GET /
 */
app.get('/', (request, response) => {
  response.status(200).json({
    message: 'Welcome to BDF Lab 3 - REST API, Query Parameters & Validation',
    student: {
      name: 'B. UDAY SAI SRIMAN',
      registrationNumber: '252U1R8005',
      section: 'CSE (AE) – 2A',
      course: 'Backend Development Fundamentals',
      college: 'Aurora',
      faculty: 'Sai Siva Teja',
    },
    supportedQueryParameters: {
      search_q: 'Partial book title search (SQL LIKE %...%)',
      order_by: 'Sort column allowlist [id, title, author, price, pages] (default: id)',
      order: 'Sort direction [ASC, DESC] (default: ASC)',
      limit: 'Number of records to return (default: 10)',
      offset: 'Number of records to skip (default: 0)',
      min_price: 'Filter records with price >= min_price',
      max_price: 'Filter records with price <= max_price',
    },
    endpoints: {
      getAllBooks: 'GET /books',
      getBookById: 'GET /books/:id',
      createBook: 'POST /books',
      updateBook: 'PUT /books/:id',
      deleteBook: 'DELETE /books/:id',
    },
  });
});

/**
 * 1. GET /books – Get all books with Query Parameters & Filtering
 * Supports:
 *   - search_q: partial title search using SQL LIKE
 *   - order_by: sorting column (validated allowlist)
 *   - order: ASC | DESC (validated allowlist)
 *   - limit: number of records (default: 10)
 *   - offset: number of records to skip (default: 0)
 *   - min_price: minimum price filter
 *   - max_price: maximum price filter
 * Status: 200 OK, 400 Bad Request on invalid parameter, 500 Internal Error
 */
app.get(['/books', '/books/'], async (request, response) => {
  try {
    const {
      search_q = '',
      order_by = 'id',
      order = 'ASC',
      limit = '10',
      offset = '0',
      min_price,
      max_price,
    } = request.query;

    // 1. Validate order_by against allowlist (prevents SQL injection)
    const sanitizedOrderBy = String(order_by).toLowerCase().trim();
    if (!ALLOWED_ORDER_BY.includes(sanitizedOrderBy)) {
      return response.status(400).json({
        error: `Invalid order_by column. Allowed columns are: ${ALLOWED_ORDER_BY.join(', ')}.`,
        message: `Invalid order_by column. Allowed columns are: ${ALLOWED_ORDER_BY.join(', ')}.`,
      });
    }

    // 2. Validate order against allowlist
    const sanitizedOrder = String(order).toUpperCase().trim();
    if (!ALLOWED_ORDER.includes(sanitizedOrder)) {
      return response.status(400).json({
        error: `Invalid order value. Allowed values are: ${ALLOWED_ORDER.join(', ')}.`,
        message: `Invalid order value. Allowed values are: ${ALLOWED_ORDER.join(', ')}.`,
      });
    }

    // 3. Validate pagination parameters
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return response.status(400).json({
        error: 'Invalid limit value. Limit must be a positive integer.',
        message: 'Invalid limit value. Limit must be a positive integer.',
      });
    }

    const parsedOffset = parseInt(offset, 10);
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return response.status(400).json({
        error: 'Invalid offset value. Offset must be a non-negative integer.',
        message: 'Invalid offset value. Offset must be a non-negative integer.',
      });
    }

    // 4. Validate price filters
    let parsedMinPrice = null;
    if (min_price !== undefined) {
      parsedMinPrice = Number(min_price);
      if (isNaN(parsedMinPrice) || parsedMinPrice < 0) {
        return response.status(400).json({
          error: 'Invalid min_price value. min_price must be a non-negative number.',
          message: 'Invalid min_price value. min_price must be a non-negative number.',
        });
      }
    }

    let parsedMaxPrice = null;
    if (max_price !== undefined) {
      parsedMaxPrice = Number(max_price);
      if (isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
        return response.status(400).json({
          error: 'Invalid max_price value. max_price must be a non-negative number.',
          message: 'Invalid max_price value. max_price must be a non-negative number.',
        });
      }
    }

    if (parsedMinPrice !== null && parsedMaxPrice !== null && parsedMinPrice > parsedMaxPrice) {
      return response.status(400).json({
        error: 'min_price cannot be greater than max_price.',
        message: 'min_price cannot be greater than max_price.',
      });
    }

    // Build parameterized SQL query
    const conditions = [];
    const params = [];

    if (search_q && String(search_q).trim() !== '') {
      conditions.push('title LIKE ?');
      params.push(`%${String(search_q).trim()}%`);
    }

    if (parsedMinPrice !== null) {
      conditions.push('price >= ?');
      params.push(parsedMinPrice);
    }

    if (parsedMaxPrice !== null) {
      conditions.push('price <= ?');
      params.push(parsedMaxPrice);
    }

    let sql = 'SELECT * FROM book';
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Append validated sorting
    sql += ` ORDER BY ${sanitizedOrderBy} ${sanitizedOrder}`;

    // Append parameterized pagination
    sql += ' LIMIT ? OFFSET ?;';
    params.push(parsedLimit, parsedOffset);

    // Execute query with missing-await protection
    const books = await db.all(sql, params);
    response.status(200).json(books);
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: 'Internal Server Error while querying books.',
    });
  }
});

/**
 * 2. GET /books/:id – Get a book by ID
 * Status: 200 OK, 400 Bad Request (invalid ID), 404 Not Found (missing record)
 */
app.get(['/books/:id', '/books/:id/'], async (request, response) => {
  try {
    const { id } = request.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
      return response.status(400).json({
        error: 'Invalid book ID. ID must be a positive integer.',
        message: 'Invalid book ID. ID must be a positive integer.',
      });
    }

    const getBookQuery = 'SELECT * FROM book WHERE id = ?;';
    const book = await db.get(getBookQuery, [parsedId]);

    if (!book) {
      return response.status(404).json({
        error: `Book with ID ${parsedId} not found`,
        message: `Book with ID ${parsedId} not found`,
      });
    }

    response.status(200).json(book);
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: 'Internal Server Error while retrieving book.',
    });
  }
});

/**
 * 3. POST /books – Create a book
 * Required fields:
 *   - title: non-empty string
 *   - author: non-empty string
 *   - price: non-negative number
 * Optional fields:
 *   - pages: positive integer
 * Status: 201 Created, 400 Bad Request on validation error
 */
app.post(['/books', '/books/'], async (request, response) => {
  try {
    const { title, author, price, pages } = request.body || {};

    // Validate Title
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return response.status(400).json({
        error: "Validation failed: 'title' is required and must be a non-empty string.",
        message: "Validation failed: 'title' is required and must be a non-empty string.",
      });
    }

    // Validate Author
    if (!author || typeof author !== 'string' || author.trim() === '') {
      return response.status(400).json({
        error: "Validation failed: 'author' is required and must be a non-empty string.",
        message: "Validation failed: 'author' is required and must be a non-empty string.",
      });
    }

    // Validate Price
    if (price === undefined || typeof price !== 'number' || isNaN(price) || price < 0) {
      return response.status(400).json({
        error: "Validation failed: 'price' is required and must be a non-negative number.",
        message: "Validation failed: 'price' is required and must be a non-negative number.",
      });
    }

    // Validate Pages (optional, but must be positive integer if provided)
    if (pages !== undefined && (typeof pages !== 'number' || !Number.isInteger(pages) || pages <= 0)) {
      return response.status(400).json({
        error: "Validation failed: 'pages' must be a positive integer.",
        message: "Validation failed: 'pages' must be a positive integer.",
      });
    }

    const insertBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;

    const result = await db.run(insertBookQuery, [
      title.trim(),
      author.trim(),
      price,
      pages || null,
    ]);

    response.status(201).json({
      message: 'Book Added Successfully',
      bookId: result.lastID,
      data: {
        id: result.lastID,
        title: title.trim(),
        author: author.trim(),
        price: price,
        pages: pages || null,
      },
    });
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: 'Internal Server Error while creating book.',
    });
  }
});

/**
 * 4. PUT /books/:id – Update a book
 * Status: 200 OK, 400 Bad Request, 404 Not Found
 */
app.put(['/books/:id', '/books/:id/'], async (request, response) => {
  try {
    const { id } = request.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
      return response.status(400).json({
        error: 'Invalid book ID. ID must be a positive integer.',
        message: 'Invalid book ID. ID must be a positive integer.',
      });
    }

    // Check if book exists
    const checkQuery = 'SELECT * FROM book WHERE id = ?;';
    const existingBook = await db.get(checkQuery, [parsedId]);

    if (!existingBook) {
      return response.status(404).json({
        error: `Book with ID ${parsedId} not found`,
        message: `Book with ID ${parsedId} not found`,
      });
    }

    const { title, author, price, pages } = request.body || {};

    // Validate Title
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return response.status(400).json({
        error: "Validation failed: 'title' is required and must be a non-empty string.",
        message: "Validation failed: 'title' is required and must be a non-empty string.",
      });
    }

    // Validate Author
    if (!author || typeof author !== 'string' || author.trim() === '') {
      return response.status(400).json({
        error: "Validation failed: 'author' is required and must be a non-empty string.",
        message: "Validation failed: 'author' is required and must be a non-empty string.",
      });
    }

    // Validate Price
    if (price === undefined || typeof price !== 'number' || isNaN(price) || price < 0) {
      return response.status(400).json({
        error: "Validation failed: 'price' is required and must be a non-negative number.",
        message: "Validation failed: 'price' is required and must be a non-negative number.",
      });
    }

    // Validate Pages
    if (pages !== undefined && (typeof pages !== 'number' || !Number.isInteger(pages) || pages <= 0)) {
      return response.status(400).json({
        error: "Validation failed: 'pages' must be a positive integer.",
        message: "Validation failed: 'pages' must be a positive integer.",
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
      pages || null,
      parsedId,
    ]);

    response.status(200).json({
      message: 'Book Updated Successfully',
      data: {
        id: parsedId,
        title: title.trim(),
        author: author.trim(),
        price: price,
        pages: pages || null,
      },
    });
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: 'Internal Server Error while updating book.',
    });
  }
});

/**
 * 5. DELETE /books/:id – Delete a book
 * Status: 200 OK, 400 Bad Request, 404 Not Found
 */
app.delete(['/books/:id', '/books/:id/'], async (request, response) => {
  try {
    const { id } = request.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
      return response.status(400).json({
        error: 'Invalid book ID. ID must be a positive integer.',
        message: 'Invalid book ID. ID must be a positive integer.',
      });
    }

    // Check if book exists
    const checkQuery = 'SELECT * FROM book WHERE id = ?;';
    const existingBook = await db.get(checkQuery, [parsedId]);

    if (!existingBook) {
      return response.status(404).json({
        error: `Book with ID ${parsedId} not found`,
        message: `Book with ID ${parsedId} not found`,
      });
    }

    const deleteBookQuery = 'DELETE FROM book WHERE id = ?;';
    await db.run(deleteBookQuery, [parsedId]);

    response.status(200).json({
      message: 'Book Deleted Successfully',
      bookId: parsedId,
    });
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: 'Internal Server Error while deleting book.',
    });
  }
});

// Fallback 404 handler for undefined routes
app.use((request, response) => {
  response.status(404).json({
    error: 'Route not found. Please verify the URL and HTTP method.',
    message: 'Route not found. Please verify the URL and HTTP method.',
  });
});

// Centralized error handler
app.use((err, request, response, next) => {
  console.error('Unhandled Server Error:', err.stack);
  response.status(500).json({
    error: err.message || 'Internal Server Error',
    message: 'An unexpected server error occurred.',
  });
});

// Export app, initializeDB, and initializeDBAndServer
module.exports = { app, initializeDB, initializeDBAndServer };
