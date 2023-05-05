// Define app using express
var express = require("express")
var app = express()
const sqlite = require('better-sqlite3');

// Require database SCRIPT file
//const db = require("./database.js")
const db = new sqlite('../db.sqlite');
const path = require('path');
const ejs = require('ejs')
app.set('view engine', 'ejs');
const authRouter = require('./auth.js');
const todoRouter = require('./todo.js');
//const createTables = require('./create-tables.js');
const createTables = require('./database.js');
// {createTables} from './database.js'
const middlewares = require('./middlewares.js');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);


app.get('/', function(req, res) {
//   res.render('login');
  // for test
  res.render('index');
});

// parse form data middleware
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static('public'));

// set up session middleware
app.use(session({store: new SQLiteStore({db:'./database.js',concurrentDB: true}),secret: 'secret',resave: false,saveUninitialized: true,cookie: { maxAge: 7 *24 * 60 * 60 * 1000 } }));

app.use(middlewares.setCurrentUser);
app.use('/auth', authRouter);
app.use('/todo', middlewares.requireLogin, todoRouter);
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

//app.use(express.static(path.join(__dirname, '../frontend')));

// Route to serve the login page
//app.get('/login', (req, res) => {
//  ejs.renderFile(path.join(__dirname, '../frontend', 'login.ejs'), {}, (err, html) => {
//    if (err) {
//      console.error(err);
//      res.status(500).send('Internal Server Error');
//    } else {
//      res.send(html);
//    }
//  });
//});
////
createTables();

// Server port
var HTTP_PORT = 5555;
// Start server
const server = app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});


// Define other CRUD API endpoints using express.js and better-sqlite3
// CREATE a new user (HTTP method POST) at endpoint /app/new/
app.post("/app/new/user", (req, res, next) => {
    let data = {
        user: req.body.username,
        pass: req.body.password
    }
    const stmt = db.prepare('INSERT INTO user (username, password) VALUES (?, ?)')
    const info = stmt.run(data.user, data.pass)
    res.status(200).json(info)
});
// READ a list of users (HTTP method GET) at endpoint /app/users/
app.get("/app/users", (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM user').all()
        res.status(200).json(stmt)
    } catch {
        console.error(e)
    }
});

// READ a single user (HTTP method GET) at endpoint /app/user/:id
app.get("/app/user/:id", (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM user WHERE id = ?').get(req.params.id);
        res.status(200).json(stmt)
    } catch (e) {
        console.error(e)
    }

});

// UPDATE a single user (HTTP method PATCH) at endpoint /app/update/user/:id
app.patch("/app/update/user/:id", (req, res) => {
    let data = {
        user: req.body.username,
        pass: req.body.password
    }
    const stmt = db.prepare('UPDATE user SET username = COALESCE(?,username), password = COALESCE(?,password) WHERE id = ?')
    const info = stmt.run(data.user, data.pass, req.params.id)
    res.status(200).json(info)
});

// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id
app.delete("/app/delete/user/:id", (req, res) => {
    const stmt = db.prepare('DELETE FROM user WHERE id = ?')
    const info = stmt.run(req.params.id)
    res.status(200).json(info)
});
// Default response for any other request
//app.use(function(req, res){
//    res.json({"message":"Endpoint not found. (404)"});
//    res.status(404);
//});
// set up routers
