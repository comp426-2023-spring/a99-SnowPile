const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sqlite = require('better-sqlite3');
const db = new sqlite('./db/database.db');

router.get('/', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos WHERE user_id = ?').all(req.session.userId);

  res.render('todo', { todos, currentUser: res.locals.currentUser });
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) {
    return res.render('login', { error: 'Invalid username or password' });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.render('login', { error: 'Invalid username or password' });
  }

  req.session.userId = user.id;

  // Add interaction to database
  const description = `${user.username} logged in`;
  const stmt = db.prepare('INSERT INTO interactions (user_id, description) VALUES (?, ?)');
  stmt.run(user.id, description);
  console.log(`User ${user.username} logged in`);

  res.redirect('/todo');
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const userExists = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (userExists) {
      return res.render('register', { error: 'Username already taken' });
    }
    const result = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

    const description = `${user.username} registered an account`;
    const stmt = db.prepare('INSERT INTO interactions (user_id, description) VALUES (?, ?)');
    stmt.run(user.id, description);
    console.log(`User ${user.username} registered with id ${user.id}`);

    req.session.userId = user.id;
    res.redirect('/todo');
  } catch (error) {
    console.log(error);
    res.render('register', { error: 'Error registering user' });
  }
});

router.get('/update-user', (req, res) => {
  const userId = req.session.userId;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  res.render('update-user', { user, error: null });
});

router.post('/update-user', (req, res, next) => {
  const { username, password } = req.body;
  const userId = req.session.userId;
  
  try {
    const userExists = db.prepare('SELECT * FROM users WHERE username = ? AND id != ?').get(username, userId);
    if (userExists) {
      return res.redirect('/todo?error=' + encodeURIComponent('Username already taken'));
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE users SET username = ?, password = ? WHERE id = ?').run(username, hashedPassword, userId);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    const description = `${user.username} updated their account details`;
    const stmt = db.prepare('INSERT INTO interactions (user_id, description) VALUES (?, ?)');
    stmt.run(user.id, description);
    console.log(`User ${user.username} updated account details`);

    res.render('login', { error: null, currentUser: user });
  } catch (error) {
    console.log(error);
    res.render('update-user', { error: 'Error updating user', currentUser: res.locals.currentUser });
  }
});

router.post('/delete-user', (req, res, next) => {
  const { password } = req.body;
  const userId = req.session.userId;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.redirect('/todo?error=' + encodeURIComponent('Invalid password'));
  }

  try {
    console.log(`User ${user.username} deleted account`);
    db.prepare('DELETE FROM todos WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM interactions WHERE user_id = ?').run(userId); // delete interactions as well
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    //const description = `${user.username} deleted their account`;
    //const stmt = db.prepare('INSERT INTO interactions (user_id, description) VALUES (?, ?)');
    //stmt.run(user.id, description);
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/auth/login');
    });
  } catch (error) {
    console.log(error);
    res.redirect('/todo?error=' + encodeURIComponent('Error deleting user'));
  }
  
});


router.post('/logout', (req, res) => {
  const userId = req.session.userId;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const description = `${user.username} logged out`;
  const stmt = db.prepare('INSERT INTO interactions (user_id, description) VALUES (?, ?)');
  stmt.run(user.id, description);

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/todo?error=' + encodeURIComponent('Error logging out'));
    }
    res.clearCookie('connect.sid');
    console.log(`User ${user.username} logged out`); // add console.log here
    res.redirect('/auth/login');
  });
});

module.exports = router;
