/**
 * ====================================================================
 * Lab 1: Node.js and Express Server
 * File: server.js
 * 
 * Student Details:
 * - Name: Uday Sai Sriman
 * - Registration Number: 252U1R8005
 * - Section: CSE (QE) – 2A
 * - College: Aurora
 * - Year: II Year, Term II
 * - Faculty: Sai Siva Teja
 * 
 * Objectives:
 * 1. Initialize Express application.
 * 2. Implement GET / (Welcome message, Status 200).
 * 3. Implement GET /about (JSON with name & section, Status 200).
 * 4. Implement GET /time (Current date & time using new Date(), Status 200).
 * 5. Handle unknown routes with a proper 404 response (Status 404).
 * ====================================================================
 */

// Step 1: Import the Express framework
const express = require('express');

// Step 2: Create an Express application instance
const app = express();

// Step 3: Define the port number
// Uses environment variable PORT (required for cloud deployment like Render) or defaults to 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON payloads (useful for future POST/PUT requests)
app.use(express.json());

// --------------------------------------------------------------------
// ROUTE 1: GET /
// Description: Displays a welcome message
// Expected HTTP Status: 200 OK
// --------------------------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Backend Development Fundamentals - Lab 1 Express Server!');
});

// --------------------------------------------------------------------
// ROUTE 2: GET /about
// Description: Returns student details (name, section, etc.) in JSON format
// Expected HTTP Status: 200 OK
// --------------------------------------------------------------------
app.get('/about', (req, res) => {
  res.status(200).json({
    name: "Uday Sai Sriman",
    registrationNumber: "252U1R8005",
    section: "CSE (QE) – 2A",
    college: "Aurora",
    year: "II Year, Term II",
    faculty: "Sai Siva Teja"
  });
});

// --------------------------------------------------------------------
// ROUTE 3: GET /time
// Description: Returns the current date and time using new Date()
// Expected HTTP Status: 200 OK
// --------------------------------------------------------------------
app.get('/time', (req, res) => {
  const currentDate = new Date();
  res.status(200).json({
    currentTime: currentDate.toString(),
    iso: currentDate.toISOString(),
    timestamp: currentDate.getTime()
  });
});

// --------------------------------------------------------------------
// ROUTE 4: 404 Not Found Handler for unknown routes
// Description: Catches all requests that do not match any defined routes above
// Expected HTTP Status: 404 Not Found
// --------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. This route does not exist on this server.`
  });
});

// --------------------------------------------------------------------
// Step 4: Start the Express server
// --------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Express Server is running successfully!`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` - Welcome Route: http://localhost:${PORT}/`);
  console.log(` - About Route:   http://localhost:${PORT}/about`);
  console.log(` - Time Route:    http://localhost:${PORT}/time`);
  console.log(` - 404 Test Route: http://localhost:${PORT}/invalid-route`);
  console.log(` Press Ctrl + C to stop the server.`);
  console.log(`====================================================`);
});
