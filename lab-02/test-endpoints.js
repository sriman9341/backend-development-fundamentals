/**
 * Comprehensive Automated Endpoint Verification Script
 * Tests all 5 CRUD routes + error cases against http://localhost:3000
 */

const http = require('http');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING LAB 2 CRUD ENDPOINT TEST SUITE ===\n');
  let passed = 0;
  let total = 0;

  async function assertTest(name, condition, details = '') {
    total++;
    if (condition) {
      console.log(`[PASS] Test ${total}: ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] Test ${total}: ${name} - ${details}`);
    }
  }

  try {
    // 1. Root route
    const rootRes = await makeRequest('GET', '/');
    assertTest('GET / (Root API Info)', rootRes.status === 200 && rootRes.data.student !== undefined);

    // 2. GET /books/
    const allBooksRes = await makeRequest('GET', '/books/');
    assertTest(
      'GET /books/ - Retrieve all books (Status 200 & Array of books)',
      allBooksRes.status === 200 && Array.isArray(allBooksRes.data) && allBooksRes.data.length >= 8,
      `Received count: ${allBooksRes.data?.length}`
    );
    console.log(`       Initial book count in DB: ${allBooksRes.data.length}`);

    // 3. GET /books/1/
    const singleBookRes = await makeRequest('GET', '/books/1/');
    assertTest(
      'GET /books/1/ - Retrieve book ID 1 (Status 200)',
      singleBookRes.status === 200 && singleBookRes.data.id === 1 && singleBookRes.data.title.includes('Clean Code')
    );

    // 4. GET /books/999/ (Non-existent book)
    const notFoundBookRes = await makeRequest('GET', '/books/999/');
    assertTest(
      'GET /books/999/ - Non-existent book (Status 404)',
      notFoundBookRes.status === 404 && notFoundBookRes.data.error !== undefined
    );

    // 5. GET /books/abc/ (Invalid ID)
    const invalidIdRes = await makeRequest('GET', '/books/abc/');
    assertTest(
      'GET /books/abc/ - Invalid non-numeric ID (Status 400)',
      invalidIdRes.status === 400 && invalidIdRes.data.error !== undefined
    );

    // 6. POST /books/ - Add a new book
    const newBookPayload = {
      title: 'Clean Architecture: A Craftsman\'s Guide to Software Structure and Design',
      author: 'Robert C. Martin',
      price: 750,
      pages: 432,
    };
    const postRes = await makeRequest('POST', '/books/', newBookPayload);
    const createdBookId = postRes.data.bookId;
    assertTest(
      'POST /books/ - Insert new book (Status 201 & Returns bookId)',
      postRes.status === 201 && createdBookId !== undefined,
      `Response: ${JSON.stringify(postRes.data)}`
    );
    console.log(`       Inserted new book with ID: ${createdBookId}`);

    // 7. Verify new book via GET /books/:id
    const verifyPostRes = await makeRequest('GET', `/books/${createdBookId}/`);
    assertTest(
      `GET /books/${createdBookId}/ - Verify inserted book exists in DB`,
      verifyPostRes.status === 200 && verifyPostRes.data.title.includes('Clean Architecture')
    );

    // 8. POST /books/ with invalid/missing body
    const badPostRes = await makeRequest('POST', '/books/', { title: 'Incomplete Book' });
    assertTest(
      'POST /books/ - Missing required fields (Status 400 Validation Error)',
      badPostRes.status === 400 && badPostRes.data.error !== undefined
    );

    // 9. PUT /books/:id - Update the newly added book
    const updatePayload = {
      title: 'Clean Architecture (2nd Edition)',
      author: 'Robert C. Martin',
      price: 799,
      pages: 450,
    };
    const putRes = await makeRequest('PUT', `/books/${createdBookId}/`, updatePayload);
    assertTest(
      `PUT /books/${createdBookId}/ - Update existing book (Status 200)`,
      putRes.status === 200 && putRes.data.message === 'Book Updated Successfully'
    );

    // 10. Verify update
    const verifyPutRes = await makeRequest('GET', `/books/${createdBookId}/`);
    assertTest(
      `GET /books/${createdBookId}/ - Verify updated title and price in DB`,
      verifyPutRes.status === 200 &&
      verifyPutRes.data.title === 'Clean Architecture (2nd Edition)' &&
      verifyPutRes.data.price === 799
    );

    // 11. PUT /books/999/ - Non-existent book update
    const putNotFoundRes = await makeRequest('PUT', '/books/999/', updatePayload);
    assertTest(
      'PUT /books/999/ - Update non-existent book (Status 404)',
      putNotFoundRes.status === 404
    );

    // 12. DELETE /books/:id - Delete the book
    const deleteRes = await makeRequest('DELETE', `/books/${createdBookId}/`);
    assertTest(
      `DELETE /books/${createdBookId}/ - Delete existing book (Status 200)`,
      deleteRes.status === 200 && deleteRes.data.message === 'Book Deleted Successfully'
    );

    // 13. Verify deletion via GET
    const verifyDeleteRes = await makeRequest('GET', `/books/${createdBookId}/`);
    assertTest(
      `GET /books/${createdBookId}/ - Verify book is no longer in DB (Status 404)`,
      verifyDeleteRes.status === 404
    );

    // 14. DELETE /books/999/ - Non-existent book deletion
    const deleteNotFoundRes = await makeRequest('DELETE', '/books/999/');
    assertTest(
      'DELETE /books/999/ - Delete non-existent book (Status 404)',
      deleteNotFoundRes.status === 404
    );

    // 15. Verify final book count matches original
    const finalAllRes = await makeRequest('GET', '/books/');
    assertTest(
      'GET /books/ - Final count restored to 10 records',
      finalAllRes.status === 200 && finalAllRes.data.length === 10
    );

    console.log(`\n========================================`);
    console.log(`TEST SUITE RESULTS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
    console.log(`========================================\n`);

    if (passed === total) {
      console.log('ALL CRUD ENDPOINTS & SECURITY VALIDATIONS VERIFIED SUCCESSFULLY!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exit(1);
  }
}

runTests();
