const express = require('express');
const router = express.Router();
const sqlite = require('better-sqlite3');
const db = new sqlite('../db.sqlite');


router.get('/', (req, res) => {
  const tasks = db.prepare('SELECT * FROM task_list WHERE user_id = ?').all(req.session.userId);

  res.render('../frontend/index.ejs', { tasks, currentUser: res.locals.currentUser });
});

router.post('/addTask', (req, res) => {
  const { task } = req.body;

  db.prepare('INSERT INTO task_list (user_id, task, description, completed) VALUES (?, ?, ?, ?)').run(req.session.userId, task, '', 0);

  res.redirect('/todo');
});

router.post('/delete-task', (req, res) => {
  const { taskId } = req.body;

  db.prepare('DELETE FROM task_list WHERE id = ? AND user_id = ?').run(taskId, req.session.userId);

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
