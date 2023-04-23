const express = require('express');
const router = express.Router();
const sqlite = require('better-sqlite3');
const db = new sqlite('./database.js');

router.get('/', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos WHERE user_id = ?').all(req.session.userId);

  res.render('todo', { todos, currentUser: res.locals.currentUser });
});

router.post('/add-task', (req, res) => {
  const { task } = req.body;

  db.prepare('INSERT INTO todos (user_id, task, description, completed) VALUES (?, ?, ?, ?)').run(req.session.userId, task, '', 0);

  res.redirect('/todo');
});

router.post('/delete-task', (req, res) => {
  const { taskId } = req.body;

  db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?').run(taskId, req.session.userId);

  res.redirect('/todo');
});

router.post('/auth/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
});

module.exports = router;
