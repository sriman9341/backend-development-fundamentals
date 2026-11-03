/**
 * Comprehensive Automated Endpoint Verification Suite - Lab 3
 * Tests REST API endpoints, query parameters, sorting, pagination,
 * price filtering, request validation, and status codes.
 *
 * Student: B. UDAY SAI SRIMAN (252U1R8005)
 * Course: Backend Development Fundamentals (BDF)
 */

const http = require('http');
const { app, initializeDB } = require('./app');

const PORT = process.env.PORT || 3000;

function directAppDispatch(method, path, body = null) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(path, `http://localhost:${PORT}`);
      const req = {
        method: method,
        url: parsedUrl.pathname + parsedUrl.search,
        originalUrl: parsedUrl.pathname + parsedUrl.search,
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json',
        },
        query: Object.fromEntries(parsedUrl.searchParams),
        body: body || {},
        params: {},
      };

      let statusCode = 200;
      let resHeaders = {};

      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        setHeader(k, v) {
          resHeaders[k] = v;
        },
        getHeader(k) {
          return resHeaders[k];
        },
        json(data) {
          resolve({ status: statusCode, headers: resHeaders, data: data });
        },
        send(data) {
          resolve({ status: statusCode, headers: resHeaders, data: data });
        },
        end() {
          resolve({ status: statusCode, headers: resHeaders, data: null });
        },
      };

      app.handle(req, res, (err) => {
        if (err) reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(rawData);
        } catch (e) {
          parsed = rawData;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on('error', async () => {
      // If HTTP server is unreachable or restricted by sandbox, fallback to in-memory dispatch
      try {
        const directRes = await directAppDispatch(method, path, body);
        resolve(directRes);
      } catch (directErr) {
        resolve({
          status: 500,
          headers: {},
          data: { error: directErr.message },
        });
      }
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  await initializeDB();

  console.log('===============================================================');
  console.log('   STARTING LAB 3 AUTOMATED API & QUERY PARAMETERS TEST SUITE  ');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function assertTest(name, condition, details = '') {
    total++;
    if (condition) {
      console.log(`[PASS] Test ${total.toString().padStart(2, '0')}: ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] Test ${total.toString().padStart(2, '0')}: ${name} - Details: ${details}`);
    }
  }

  try {
    // 1. Root route
    const rootRes = await makeRequest('GET', '/');
    assertTest(
      'GET / (Root Route API Info & Metadata)',
      rootRes.status === 200 && rootRes.data.student && rootRes.data.student.registrationNumber === '252U1R8005',
      `Status: ${rootRes.status}`
    );

    // 2. GET /books (Default All Books)
    const allBooksRes = await makeRequest('GET', '/books');
    assertTest(
      'GET /books (Retrieve all books with default parameters)',
      allBooksRes.status === 200 && Array.isArray(allBooksRes.data) && allBooksRes.data.length >= 10,
      `Count: ${allBooksRes.data?.length}`
    );

    // 3. GET /books/:id (Existing Book)
    const singleBookRes = await makeRequest('GET', '/books/1');
    assertTest(
      'GET /books/1 (Retrieve book ID 1 - Status 200)',
      singleBookRes.status === 200 && singleBookRes.data.id === 1 && singleBookRes.data.title.includes('Clean Code'),
      `Received: ${JSON.stringify(singleBookRes.data)}`
    );

    // 4. GET /books/:id (Non-existent Book)
    const notFoundRes = await makeRequest('GET', '/books/999');
    assertTest(
      'GET /books/999 (Non-existent book ID returns 404 Not Found)',
      notFoundRes.status === 404 && notFoundRes.data.error.includes('not found'),
      `Status: ${notFoundRes.status}`
    );

    // 5. GET /books/:id (Invalid Non-numeric ID)
    const invalidIdRes = await makeRequest('GET', '/books/invalid-id');
    assertTest(
      'GET /books/invalid-id (Invalid non-numeric ID returns 400 Bad Request)',
      invalidIdRes.status === 400 && invalidIdRes.data.error.includes('positive integer'),
      `Status: ${invalidIdRes.status}`
    );

    // 6. Query Param: search_q (Partial Title Search)
    const searchRes = await makeRequest('GET', '/books?search_q=Clean');
    assertTest(
      'GET /books?search_q=Clean (Search filter returns matching books)',
      searchRes.status === 200 && Array.isArray(searchRes.data) && searchRes.data.every(b => b.title.toLowerCase().includes('clean')),
      `Found: ${searchRes.data?.length} books`
    );

    // 7. Query Param: Sort ASC
    const sortAscRes = await makeRequest('GET', '/books?order_by=price&order=ASC');
    const isSortedAsc = Array.isArray(sortAscRes.data) && sortAscRes.data.every((b, i, arr) => i === 0 || arr[i - 1].price <= b.price);
    assertTest(
      'GET /books?order_by=price&order=ASC (Sort ascending by price)',
      sortAscRes.status === 200 && isSortedAsc,
      `First: ${sortAscRes.data?.[0]?.price}, Last: ${sortAscRes.data?.[sortAscRes.data.length - 1]?.price}`
    );

    // 8. Query Param: Sort DESC
    const sortDescRes = await makeRequest('GET', '/books?order_by=price&order=DESC');
    const isSortedDesc = Array.isArray(sortDescRes.data) && sortDescRes.data.every((b, i, arr) => i === 0 || arr[i - 1].price >= b.price);
    assertTest(
      'GET /books?order_by=price&order=DESC (Sort descending by price)',
      sortDescRes.status === 200 && isSortedDesc,
      `First: ${sortDescRes.data?.[0]?.price}, Last: ${sortDescRes.data?.[sortDescRes.data.length - 1]?.price}`
    );

    // 9. Query Param: Disallowed Sorting Column (Allowlist & SQL Injection Prevention)
    const sqlInjectRes = await makeRequest('GET', '/books?order_by=unauthorized_col');
    assertTest(
      'GET /books?order_by=unauthorized_col (Disallowed column rejected with 400)',
      sqlInjectRes.status === 400 && sqlInjectRes.data.error.includes('Allowed columns'),
      `Status: ${sqlInjectRes.status}`
    );

    // 10. Query Param: Disallowed Sort Order (Allowlist check)
    const invalidOrderRes = await makeRequest('GET', '/books?order=INVALID');
    assertTest(
      'GET /books?order=INVALID (Disallowed order rejected with 400)',
      invalidOrderRes.status === 400 && invalidOrderRes.data.error.includes('Allowed values are: ASC, DESC'),
      `Status: ${invalidOrderRes.status}`
    );

    // 11. Pagination: limit and offset
    const page1Res = await makeRequest('GET', '/books?limit=3&offset=0');
    assertTest(
      'GET /books?limit=3&offset=0 (Pagination page 1 returns 3 records)',
      page1Res.status === 200 && Array.isArray(page1Res.data) && page1Res.data.length === 3,
      `Count: ${page1Res.data?.length}`
    );

    const page2Res = await makeRequest('GET', '/books?limit=3&offset=3');
    assertTest(
      'GET /books?limit=3&offset=3 (Pagination page 2 returns distinct records)',
      page2Res.status === 200 && Array.isArray(page2Res.data) && page2Res.data.length === 3 && page2Res.data[0].id !== page1Res.data[0].id,
      `Page 1 ID: ${page1Res.data?.[0]?.id}, Page 2 ID: ${page2Res.data?.[0]?.id}`
    );

    // 12. Invalid Pagination Parameter
    const invalidLimitRes = await makeRequest('GET', '/books?limit=-5');
    assertTest(
      'GET /books?limit=-5 (Negative limit rejected with 400)',
      invalidLimitRes.status === 400,
      `Status: ${invalidLimitRes.status}`
    );

    // 13. Min Price Filter
    const minPriceRes = await makeRequest('GET', '/books?min_price=700');
    const allGte700 = Array.isArray(minPriceRes.data) && minPriceRes.data.every(b => b.price >= 700);
    assertTest(
      'GET /books?min_price=700 (Filter books with price >= 700)',
      minPriceRes.status === 200 && allGte700 && minPriceRes.data.length > 0,
      `Count: ${minPriceRes.data?.length}`
    );

    // 14. Max Price Filter
    const maxPriceRes = await makeRequest('GET', '/books?max_price=500');
    const allLte500 = Array.isArray(maxPriceRes.data) && maxPriceRes.data.every(b => b.price <= 500);
    assertTest(
      'GET /books?max_price=500 (Filter books with price <= 500)',
      maxPriceRes.status === 200 && allLte500 && maxPriceRes.data.length > 0,
      `Count: ${maxPriceRes.data?.length}`
    );

    // 15. Combined Price Range Filter
    const rangeRes = await makeRequest('GET', '/books?min_price=600&max_price=800');
    const allBetween = Array.isArray(rangeRes.data) && rangeRes.data.every(b => b.price >= 600 && b.price <= 800);
    assertTest(
      'GET /books?min_price=600&max_price=800 (Filter range [600, 800])',
      rangeRes.status === 200 && allBetween && rangeRes.data.length > 0,
      `Count: ${rangeRes.data?.length}`
    );

    // 16. Invalid Price Range (min > max)
    const invalidRangeRes = await makeRequest('GET', '/books?min_price=900&max_price=500');
    assertTest(
      'GET /books?min_price=900&max_price=500 (min > max rejected with 400)',
      invalidRangeRes.status === 400 && invalidRangeRes.data.error.includes('greater than'),
      `Status: ${invalidRangeRes.status}`
    );

    // 17. POST /books (Valid Creation)
    const newBookPayload = {
      title: 'Designing Data-Intensive Applications: The Big Ideas',
      author: 'Martin Kleppmann',
      price: 850,
      pages: 616,
    };
    const createRes = await makeRequest('POST', '/books', newBookPayload);
    const createdId = createRes.data?.bookId;
    assertTest(
      'POST /books (Create valid book record - Status 201 Created)',
      createRes.status === 201 && createdId !== undefined && createRes.data.message.includes('Added Successfully'),
      `Created ID: ${createdId}`
    );

    // 18. Verify Created Book in Database
    const verifyCreatedRes = await makeRequest('GET', `/books/${createdId}`);
    assertTest(
      `GET /books/${createdId} (Verify created book exists in database)`,
      verifyCreatedRes.status === 200 && verifyCreatedRes.data.title === newBookPayload.title,
      `Title: ${verifyCreatedRes.data?.title}`
    );

    // 19. POST /books Validation: Missing Title
    const missingTitleRes = await makeRequest('POST', '/books', { author: 'Someone', price: 500 });
    assertTest(
      'POST /books (Validation: Missing title rejected with 400)',
      missingTitleRes.status === 400 && missingTitleRes.data.error.includes("'title' is required"),
      `Status: ${missingTitleRes.status}`
    );

    // 20. POST /books Validation: Missing Author
    const missingAuthorRes = await makeRequest('POST', '/books', { title: 'Some Title', price: 500 });
    assertTest(
      'POST /books (Validation: Missing author rejected with 400)',
      missingAuthorRes.status === 400 && missingAuthorRes.data.error.includes("'author' is required"),
      `Status: ${missingAuthorRes.status}`
    );

    // 21. POST /books Validation: Invalid / Non-numeric Price
    const invalidPriceRes = await makeRequest('POST', '/books', { title: 'Some Title', author: 'Author', price: 'cheap' });
    assertTest(
      'POST /books (Validation: Non-numeric price rejected with 400)',
      invalidPriceRes.status === 400 && invalidPriceRes.data.error.includes("'price' is required"),
      `Status: ${invalidPriceRes.status}`
    );

    // 22. PUT /books/:id (Valid Update)
    const updatePayload = {
      title: 'Designing Data-Intensive Applications (Updated 2nd Edition)',
      author: 'Martin Kleppmann',
      price: 999,
      pages: 650,
    };
    const updateRes = await makeRequest('PUT', `/books/${createdId}`, updatePayload);
    assertTest(
      `PUT /books/${createdId} (Update existing book - Status 200 OK)`,
      updateRes.status === 200 && updateRes.data.message.includes('Updated Successfully'),
      `Status: ${updateRes.status}`
    );

    // 23. Verify Updated Book in Database
    const verifyUpdatedRes = await makeRequest('GET', `/books/${createdId}`);
    assertTest(
      `GET /books/${createdId} (Verify updated fields reflected in DB)`,
      verifyUpdatedRes.status === 200 && verifyUpdatedRes.data.price === 999 && verifyUpdatedRes.data.title.includes('2nd Edition'),
      `Price: ${verifyUpdatedRes.data?.price}`
    );

    // 24. PUT /books/999 (Update Non-existent Book)
    const updateMissingRes = await makeRequest('PUT', '/books/999', updatePayload);
    assertTest(
      'PUT /books/999 (Update non-existent book returns 404)',
      updateMissingRes.status === 404 && updateMissingRes.data.error.includes('not found'),
      `Status: ${updateMissingRes.status}`
    );

    // 25. DELETE /books/:id (Valid Delete)
    const deleteRes = await makeRequest('DELETE', `/books/${createdId}`);
    assertTest(
      `DELETE /books/${createdId} (Delete existing book - Status 200 OK)`,
      deleteRes.status === 200 && deleteRes.data.message.includes('Deleted Successfully'),
      `Status: ${deleteRes.status}`
    );

    // 26. Verify Deleted Book No Longer Exists
    const verifyDeletedRes = await makeRequest('GET', `/books/${createdId}`);
    assertTest(
      `GET /books/${createdId} (Confirm deleted book returns 404 Not Found)`,
      verifyDeletedRes.status === 404,
      `Status: ${verifyDeletedRes.status}`
    );

    // 27. DELETE /books/999 (Delete Non-existent Book)
    const deleteMissingRes = await makeRequest('DELETE', '/books/999');
    assertTest(
      'DELETE /books/999 (Delete non-existent book returns 404 Not Found)',
      deleteMissingRes.status === 404 && deleteMissingRes.data.error.includes('not found'),
      `Status: ${deleteMissingRes.status}`
    );

    // 28. Fallback 404 for Unhandled Route
    const fallbackRes = await makeRequest('GET', '/non-existent-route-xyz');
    assertTest(
      'GET /non-existent-route-xyz (Undefined route returns 404)',
      fallbackRes.status === 404 && fallbackRes.data.error.includes('Route not found'),
      `Status: ${fallbackRes.status}`
    );

    console.log('\n===============================================================');
    console.log(`TEST SUITE RESULTS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
    console.log('===============================================================\n');

    if (passed === total) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal Error running test suite:', err.message);
    process.exit(1);
  }
}

runTests();
