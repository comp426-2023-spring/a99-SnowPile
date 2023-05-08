const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const bcrypt = require('bcrypt');
const middlewares = require('./middlewares/middlewares');
const authRouter = require('./auth/auth');
const todoRouter = require('./routes/todo');
const createTables = require('./create-tables');

const app = express();

// set up view engine
app.set('view engine', 'ejs');

// parse form data middleware
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static('public'));

// set up session middleware
app.use(
  session({
    store: new SQLiteStore({
      db: 'db/database.db',
      concurrentDB: true
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
  })
);

// set up middleware functions
app.use(middlewares.setCurrentUser);

// set up routers
app.use('/auth', authRouter);
app.use('/todo', middlewares.requireLogin, todoRouter);

//route to start in login page
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});


// 404 route
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 Internal Server Error');
});

// test API
app.get('/ping', function(req, res) {
  res.status(200).json({ message: 'pong' });
});

// create tables
createTables();

// start server
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;