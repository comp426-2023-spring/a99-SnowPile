CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE todos (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  task TEXT NOT NULL,
  description TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE interactions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);