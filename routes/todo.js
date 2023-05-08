const express = require('express');
const router = express.Router();
const sqlite = require('better-sqlite3');
const db = new sqlite('./db/database.db');

router.get('/', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos WHERE user_id = ?').all(req.session.userId);

  res.render('todo', { todos, currentUser: res.locals.currentUser });
});

router.post('/add-task', (req, res) => {
  const { task } = req.body;
  const userId = req.session.userId;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const description = `User ${user.username} added task "${task}"`;
  const stmt = db.prepare('INSERT INTO interactions (user_id, description) VALUES (?, ?)');
  stmt.run(userId, description);
  console.log(description);

  db.prepare('INSERT INTO todos (user_id, task, description, completed) VALUES (?, ?, ?, ?)').run(req.session.userId, task, '', 0);

  res.redirect('/todo');
});

router.post('/delete-task', (req, res) => {
  const { taskId } = req.body;
  const userId = req.session.userId;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const task = db.prepare('SELECT task FROM todos WHERE id = ? AND user_id = ?').get(taskId, req.session.userId).task;
  const description = `User ${user.username} deleted task "${task}"`;
  const stmt = db.prepare('INSERT INTO interactions (user_id, description) VALUES (?, ?)');
  stmt.run(userId, description);
  console.log(description);

  db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?').run(taskId, req.session.userId);

  res.redirect('/todo');
});

// router.get('/auth/logout', (req, res, next) => {
//   console.log('Logout API called');
//   const userId = req.session.userId;
//   const description = `User ${user.usern} logged out`;
//   console.log(description);
//   const stmt = db.prepare('INSERT INTO interactions (user_id, description) VALUES (?, ?)');

//   try {
//     req.session.destroy((err) => {
//       if (err) {
//         console.log(err);
//         return next(err);
//       }

//       stmt.run(userId, description);
//       res.clearCookie('connect.sid');
//       console.log('Redirecting to login page');
//       res.redirect('/auth/login');
//     });
//   } catch (error) {
//     console.log(error);
//     return next(error);
//   }
// });

module.exports = router;
