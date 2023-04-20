const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const md5 = require("md5");

const app = express();

const DBSOURCE = "db.sqlite";
const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, 
        email TEXT UNIQUE, 
        password TEXT
      )`,
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log("User table created successfully.");
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS task_list (
        task_id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_title TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        task_due_date DATETIME, 
        task_status TEXT NOT NULL, 
        task_description TEXT,
        category_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (category_id) REFERENCES category(id)
      )`,
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Task list table created successfully.");
        }
      }
    );
  }
});

// Enable JSON request body parsing
app.use(express.json());

// Add a new user
app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = md5(password);

  const insertUser = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
  db.run(insertUser, [name, email, hashedPassword], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to add user" });
    } else {
      console.log(`User ${this.lastID} added successfully`);
      res.status(201).json({ id: this.lastID });
    }
  });
});

// Get all users
app.get("/users", (req, res) => {
  db.all("SELECT * FROM user", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to retrieve users" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Get a specific user by ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM user WHERE id=?", [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to retrieve user" });
    } else if (!row) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(row);
    }
  });
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { task_title, user_id, task_due_date, task_status, task_description, category_id } =
    req.body;

  const insertTask =
    "INSERT

