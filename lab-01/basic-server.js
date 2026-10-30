/**
 * ====================================================================
 * Lab 1: Node.js and Express Server
 * File: basic-server.js
 * 
 * Student Name: Uday Sai Sriman
 * Registration Number: 252U1R8005
 * Section: CSE (QE) – 2A
 * College: Aurora
 * Year: II Year, Term II
 * Faculty: Sai Siva Teja
 * 
 * Objective:
 * Create a basic HTTP server using Node.js built-in 'http' module
 * that listens on port 3000 and responds with "Hello".
 * ====================================================================
 */

// Step 1: Import the built-in 'http' module in Node.js
const http = require('http');

// Step 2: Define the port number on which the server will listen
const PORT = 3000;

// Step 3: Create the HTTP server using http.createServer()
// The callback function handles incoming requests (req) and outgoing responses (res)
const server = http.createServer((req, res) => {
  // Set the HTTP status code to 200 (OK)
  // Set the response header to indicate plain text content
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send the response body "Hello" and end the response
  res.end('Hello');
});

// Step 4: Start the server and listen on the defined port
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Basic Node.js HTTP Server is running!`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Press Ctrl + C to stop the server.`);
  console.log(`====================================================`);
});
