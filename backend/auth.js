const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sqlite = require('better-sqlite3');
//const db = new sqlite('./database.js');
const db = new sqlite('../db.sqlite');

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM user WHERE username = ?').get(username);

  if (!user) {
    return res.render('login', { error: 'Invalid username or password' });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.render('login', { error: 'Invalid username or password' });
  }

  req.session.userId = user.id;
  res.redirect('/todo');
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const userExists = db.prepare('SELECT * FROM user WHERE username = ?').get(username);
    if (userExists) {
      return res.render('register', { error: 'Username already taken' });
    }
    const result = db.prepare('INSERT INTO user (username, password) VALUES (?, ?)').run(username, hashedPassword);
    const user = db.prepare('SELECT * FROM user WHERE id = ?').get(result.lastInsertRowid);

    req.session.userId = user.id;
    res.redirect('/todo');
  } catch (error) {
    console.log(error);
    res.render('register', { error: 'Error registering user' });
  }
});

router.get('/auth/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
});

module.exports = router;
