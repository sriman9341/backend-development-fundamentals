# Backend Development Fundamentals (BDF)

Backend Development Fundamentals lab assignments and practical projects completed as part of B.Tech II Year, Term II at Aurora. This repository contains Labs 1–10, covering Node.js, Express.js, databases, APIs, and backend development concepts.

---

## Student Details

- **Student Name:** Uday Sai Sriman
- **Registration Number:** 252U1R8005
- **Branch & Section:** CSE (QE) – 2A
- **College:** Aurora
- **Academic Year:** II Year, Term II
- **Faculty In-Charge:** Sai Siva Teja

---

## Lab Directory Index

| Lab | Title | Tech Stack | Status | Directory Link | Live Deployment |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **Lab 01** | Node.js and Express Server | Node.js, Express.js | Completed | [lab-01/](./lab-01/) | [Render App](https://backend-development-fundamentals-n5u8.onrender.com) |
| **Lab 02** | SQLite Database and CRUD Routes | Express.js, SQLite3 | Completed | [lab-02/](./lab-02/) | Local Verified / Render Ready |
| **Lab 03** | *Upcoming Lab* | — | Planned | — | — |
| **Lab 04** | *Upcoming Lab* | — | Planned | — | — |
| **Lab 05** | *Upcoming Lab* | — | Planned | — | — |
| **Lab 06** | *Upcoming Lab* | — | Planned | — | — |
| **Lab 07** | *Upcoming Lab* | — | Planned | — | — |
| **Lab 08** | *Upcoming Lab* | — | Planned | — | — |
| **Lab 09** | *Upcoming Lab* | — | Planned | — | — |
| **Lab 10** | *Upcoming Lab* | — | Planned | — | — |

---

## Repository Structure

```text
backend-development-fundamentals/
├── README.md               # Course repository overview and student details
├── .gitignore              # Global gitignore for all labs
├── lab-01/                 # Lab 1: Node.js & Express Server
│   ├── basic-server.js     # Native Node HTTP server on port 3000
│   ├── server.js           # Express server with routes /, /about, /time, 404
│   ├── package.json        # Dependencies and scripts
│   ├── package-lock.json
│   ├── .gitignore
│   ├── README.md           # Detailed Lab 1 documentation & report
│   └── screenshots/        # Endpoint verification screenshots
└── lab-02/                 # Lab 2: SQLite Database and CRUD Routes
    ├── app.js              # Express app with initializeDBAndServer & 5 CRUD routes
    ├── books.db            # SQLite database with 10 seeded records
    ├── init-db.js          # SQLite database seeder script
    ├── test-endpoints.js   # Automated endpoint test suite
    ├── postman_collection.json # Complete Postman test collection
    ├── package.json        # Dependencies (express, sqlite, sqlite3, nodemon)
    ├── package-lock.json
    ├── .gitignore
    ├── README.md           # Detailed Lab 2 documentation & lab report
    └── screenshots/        # Route verification screenshots
```
