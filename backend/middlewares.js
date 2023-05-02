const bcrypt = require('bcrypt');
const saltRounds = 10;
const sqlite = require('better-sqlite3');
const db = new sqlite('../db.sqlite');

function hashPassword(password) {
  return bcrypt.hashSync(password, saltRounds);
}

function comparePasswords(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function setCurrentUser(req, res, next) {
  // Check if user is authenticated
  if (req.session && req.session.userId) {
    // Set current user
    const user = db.prepare('SELECT * FROM user WHERE id = ?').get(req.session.userId);
    res.locals.currentUser = user;
  } else {
    // Clear current user
    res.locals.currentUser = null;
  }
  next();
}

function requireLogin(req, res, next) {
  if (res.locals.currentUser) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}

module.exports = {
  hashPassword,
  comparePasswords,
  setCurrentUser,
  requireLogin
};
