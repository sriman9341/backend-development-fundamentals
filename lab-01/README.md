# Lab 1: Node.js and Express Server

**Course:** Backend Development Fundamentals (BDF)  
**Lab Assignment:** Lab 1 – Getting Started with Node.js HTTP Server and Express.js REST Endpoints  

---

## Student Details

| Field | Detail |
| :--- | :--- |
| **Student Name** | Uday Sai Sriman |
| **Registration Number** | 252U1R8005 |
| **Section** | CSE (QE) – 2A |
| **College** | Aurora |
| **Academic Year & Term** | II Year, Term II |
| **Faculty In-Charge** | Sai Siva Teja |

---

## Project Objective

The objective of this laboratory assignment is to:
1. Initialize and manage a Node.js project environment using npm (`npm init -y`).
2. Understand core backend concepts by building a basic HTTP server with Node's native `http` module (`http.createServer()`) responding on port 3000.
3. Install and configure the industry-standard **Express.js** web framework (`npm install express`).
4. Develop modular REST API endpoints handling `GET` requests with distinct responses (text, structured JSON, dynamic date & time).
5. Implement proper HTTP response status codes (`200 OK`, `404 Not Found`).
6. Configure catch-all middleware for handling undefined/unknown routes with user-friendly 404 error responses.
7. Prepare the application for cloud deployment (e.g., Render) and version control using Git and GitHub.

---

## Technologies Used

- **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+ / v20+ / v24+)
- **Package Manager:** [npm](https://www.npmjs.com/)
- **Web Framework:** [Express.js](https://expressjs.com/) (v5.x)
- **Built-in Core Modules:** `http` module
- **Language:** JavaScript (ES6+ CommonJS)
- **Deployment Platform:** [Render](https://render.com/)

---

## Project Structure

```text
lab-01/
├── basic-server.js     # Native Node.js HTTP server (responds with "Hello" on port 3000)
├── server.js           # Express.js server with routes /, /about, /time, and 404 handler
├── package.json        # Project metadata, dependencies, and start scripts
├── package-lock.json   # Exact dependency tree lockfile
├── .gitignore          # Prevents committing node_modules, .env, and temporary logs
├── README.md           # Complete project documentation and lab report
└── screenshots/        # Directory containing browser screenshots of all routes
    ├── welcome-route.png
    ├── about-route.png
    ├── time-route.png
    ├── 404-route.png
    └── README.md
```

---

## Installation & Setup Instructions

### Prerequisites
Make sure you have Node.js and npm installed on your computer. You can verify by opening your terminal or command prompt and running:
```bash
node -v
npm -v
```

### Installation Steps

1. **Clone or navigate to the project directory:**
   ```bash
   cd lab-01
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```
   *(This reads `package.json` and installs Express into the `node_modules` folder).*

---

## Commands to Run the Project

### 1. Run the Basic Node.js HTTP Server (`basic-server.js`)
To run the server built with the native `http` module:
```bash
npm run basic
# or directly:
node basic-server.js
```
The server will start listening at:
`http://localhost:3000`

### 2. Run the Express.js Server (`server.js`)
To run the Express.js server containing all routes:
```bash
npm start
# or directly:
node server.js
```
The Express server will start listening at:
`http://localhost:3000`

*(Optional) Development mode with file auto-reload:*
```bash
npm run dev
```

> **Note:** Both servers default to port 3000. Stop one server using `Ctrl + C` before running the other, or pass a custom port like `$env:PORT=5000; node server.js` in PowerShell.

---

## API Endpoints Documentation

The Express server implements the following endpoints:

| HTTP Method | Route | HTTP Status | Response Format | Description & Example Response |
| :--- | :--- | :---: | :--- | :--- |
| **GET** | `/` | `200 OK` | `text/html` | **Welcome Message**<br>`Welcome to Backend Development Fundamentals - Lab 1 Express Server!` |
| **GET** | `/about` | `200 OK` | `application/json` | **Student Details**<br>`{"name":"Uday Sai Sriman","registrationNumber":"252U1R8005","section":"CSE (QE) – 2A","college":"Aurora","year":"II Year, Term II","faculty":"Sai Siva Teja"}` |
| **GET** | `/time` | `200 OK` | `application/json` | **Current Server Date & Time**<br>`{"currentTime":"Fri Oct 30 2026 10:12:47 GMT+0530 (India Standard Time)","iso":"2026-10-30T04:42:47.145Z","timestamp":1793335367145}` |
| **ALL** | Any undefined route (e.g. `/unknown`) | `404 Not Found` | `application/json` | **404 Error Handler**<br>`{"success":false,"statusCode":404,"error":"Not Found","message":"Cannot GET /unknown. This route does not exist on this server."}` |

---

## Live Deployment Link

- **Production URL:** [https://backend-development-fundamentals-n5u8.onrender.com](https://backend-development-fundamentals-n5u8.onrender.com)
- **Live Endpoints:**
  - **Welcome (`GET /`):** [https://backend-development-fundamentals-n5u8.onrender.com/](https://backend-development-fundamentals-n5u8.onrender.com/)
  - **About (`GET /about`):** [https://backend-development-fundamentals-n5u8.onrender.com/about](https://backend-development-fundamentals-n5u8.onrender.com/about)
  - **Time (`GET /time`):** [https://backend-development-fundamentals-n5u8.onrender.com/time](https://backend-development-fundamentals-n5u8.onrender.com/time)
  - **404 Route (`GET /invalid-route`):** [https://backend-development-fundamentals-n5u8.onrender.com/invalid-route](https://backend-development-fundamentals-n5u8.onrender.com/invalid-route)

---

## Testing Endpoints in a Browser

Follow these steps to verify every endpoint and inspect the status codes:

1. Start the Express server: `npm start`
2. Open your web browser (Chrome, Edge, Firefox, or Brave).
3. Open **Developer Tools** by pressing `F12` (or `Ctrl + Shift + I`) and switch to the **Network** tab.
4. Visit each URL in the browser address bar:
   - `http://localhost:3000/` → Status **200**, message appears on the screen.
   - `http://localhost:3000/about` → Status **200**, JSON object with student details appears.
   - `http://localhost:3000/time` → Status **200**, JSON object with current timestamp and date appears.
   - `http://localhost:3000/invalid-route` → Status **404**, structured error JSON appears.

---

## Screenshots of Working Routes

Place the screenshots in the `./screenshots/` folder. They will automatically be displayed below:

### 1. Root Endpoint (`GET /`) – Welcome Message
*Shows HTTP 200 OK and welcome text.*
![Welcome Route Screenshot](./screenshots/welcome-route.png)

---

### 2. About Endpoint (`GET /about`) – Student Information (JSON)
*Shows HTTP 200 OK and student credentials.*
![About Route Screenshot](./screenshots/about-route.png)

---

### 3. Time Endpoint (`GET /time`) – Current Date & Time (JSON)
*Shows HTTP 200 OK and dynamically generated system time using `new Date()`.*
![Time Route Screenshot](./screenshots/time-route.png)

---

### 4. 404 Response for Unknown Routes (`GET /invalid-route`)
*Shows HTTP 404 Not Found and custom error response.*
![404 Error Screenshot](./screenshots/404-route.png)

---

## Problems Faced and Solutions

During the implementation of Lab 1, the following challenges were encountered and resolved:

### 1. Port Conflict (`EADDRINUSE`)
- **Problem:** Attempting to start `server.js` while `basic-server.js` was already running triggered `Error: listen EADDRINUSE: address already in use :::3000`.
- **Solution:** Identified that two processes cannot bind to the same network port simultaneously. Terminated the existing process using `Ctrl + C` in the terminal (or killed the background process) before launching the other server. Also configured `const PORT = process.env.PORT || 3000;` to allow port customization via environment variables.

### 2. 404 Middleware Intercepting Valid Routes
- **Problem:** If the 404 catch-all middleware is placed before defined routes (`/`, `/about`, `/time`), all incoming requests hit the 404 handler first and valid routes become unreachable.
- **Solution:** In Express middleware pipelines, request handlers are executed in the exact order they are registered. The 404 handler `app.use((req, res) => ...)` was placed at the very bottom of `server.js`, after all valid route definitions, so it only captures unhandled requests.

### 3. Cloud Deployment Port Binding (Render)
- **Problem:** Cloud hosting platforms like Render dynamically assign a port using the `PORT` environment variable rather than hardcoding port 3000.
- **Solution:** Utilized `process.env.PORT || 3000` so the server dynamically adapts to cloud environment variables when deployed and defaults to 3000 during local development.

### 4. Ensuring Clean Version Control
- **Problem:** `node_modules` contains thousands of third-party dependency files that should never be pushed to a Git repository.
- **Solution:** Created a `.gitignore` file including `node_modules/` and `.env` before initializing Git, keeping the repository lightweight and adhering to industry best practices.
