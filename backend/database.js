var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");

    db.run(
      `CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, 
        email TEXT UNIQUE, 
        password TEXT
    )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          var insertUser =
            "INSERT INTO user (name, email, password) VALUES (?,?,?)";
          db.run(insertUser, ["amy", "amy@example.com", md5("amy123456")]);
          db.run(insertUser, ["bob", "bob@example.com", md5("bob123456")]);
          db.run(insertUser, [
            "carol",
            "carol@example.com",
            md5("carol123456"),
          ]);
          db.run(insertUser, ["dave", "dave@example.com", md5("dave123456")]);
          db.run(insertUser, ["emma", "emma@example.com", md5("emma123456")]);
          db.run(insertUser, [
            "frank",
            "frank@example.com",
            md5("frank123456"),
          ]);
          db.run(insertUser, [
            "grace",
            "grace@example.com",
            md5("grace123456"),
          ]);
        }
      }
    );

    db.run(
      `CREATE TABLE category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT
    )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          var insertCategory =
            "INSERT INTO category (category_name) VALUES (?)";
          db.run(insertCategory, ["Personal"]);
          db.run(insertCategory, ["Work"]);
          db.run(insertCategory, ["Errands"]);
          db.run(insertCategory, ["Shopping"]);
          db.run(insertCategory, ["Fitness"]);
          db.run(insertCategory, ["School"]);
          db.run(insertCategory, ["Not Categoried"]);
        }
      }
    );

    db.run(
      `CREATE TABLE task_list (
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
          // Table already created
        } else {
          // Table just created, creating some rows
          var insertTask =
            "INSERT INTO task_list (task_title, user_id, task_due_date, task_status, task_description,category_id) VALUES (?,?,?,?,?,?)";
          db.run(insertTask, [
            "Buy groceries for the week",
            1,
            "2023-04-18",
            "Not started",
            "Milk, bread, eggs, cheese, chicken",
            4,
          ]);
          db.run(insertTask, [
            "Finish project proposal",
            2,
            "2023-04-20",
            "In progress",
            "Include budget estimates and timeline",
            6,
          ]);
          db.run(insertTask, [
            "Call doctor for appointment",
            4,
            "2023-04-19",
            "Not started",
            "",
            3,
          ]);
          db.run(insertTask, [
            "Clean the house",
            2,
            "2023-04-17",
            "Completed",
            "Vacuum the floors and dust the furniture",
            1,
          ]);
          db.run(insertTask, [
            "Submit monthly report",
            6,
            "2023-04-30",
            "Not started",
            "Include sales figures and revenue analysis",
            2,
          ]);
        }
      }
    );
  }
});

module.exports = db;
