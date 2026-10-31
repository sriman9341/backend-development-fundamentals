/**
 * Database Seeder Script - Lab 2
 * Creates books.db and populates it with 10 realistic programming books.
 * Student: B. UDAY SAI SRIMAN (252U1R8005)
 */

const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const dbPath = path.join(__dirname, 'books.db');

const initialBooks = [
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    price: 650,
    pages: 464,
  },
  {
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'Andrew Hunt, David Thomas',
    price: 720,
    pages: 352,
  },
  {
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    price: 450,
    pages: 176,
  },
  {
    title: "You Don't Know JS: Scope & Closures",
    author: 'Kyle Simpson',
    price: 380,
    pages: 98,
  },
  {
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    price: 890,
    pages: 395,
  },
  {
    title: 'Node.js Design Patterns',
    author: 'Mario Casciaro, Luciano Mammino',
    price: 820,
    pages: 664,
  },
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    price: 1250,
    pages: 1312,
  },
  {
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    price: 780,
    pages: 448,
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    price: 950,
    pages: 616,
  },
  {
    title: 'Head First Design Patterns',
    author: 'Eric Freeman, Elisabeth Robson',
    price: 699,
    pages: 694,
  },
];

async function seedDatabase() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log('Connected to SQLite database at:', dbPath);

    // Create table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      );
    `);
    console.log('Table "book" verified/created successfully.');

    // Check existing count
    const existing = await db.get('SELECT COUNT(*) as count FROM book;');
    if (existing.count > 0) {
      console.log(`Table already contains ${existing.count} records. Clearing for fresh seed...`);
      await db.exec('DELETE FROM book;');
      await db.exec('DELETE FROM sqlite_sequence WHERE name="book";');
    }

    const insertQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;

    for (const book of initialBooks) {
      await db.run(insertQuery, [book.title, book.author, book.price, book.pages]);
    }

    const countResult = await db.get('SELECT COUNT(*) as count FROM book;');
    console.log(`Successfully seeded ${countResult.count} book records.`);

    const allBooks = await db.all('SELECT * FROM book;');
    console.table(allBooks);

    await db.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
