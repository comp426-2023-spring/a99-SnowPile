const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const EventEmitter = require('events');
const myEmitter = new EventEmitter();

//Add an erro event lister
myEmitter.on('errot',(err)=>{
  console.error('An error occured:',err);
});
// Emit an error event
myEmitter.emit('error', new Error('Something went wrong'));

// set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// set up view engine
app.set('view engine', 'ejs');

// set up static folder
app.use(express.static('public'));

// initialize tasks array
let tasks = [];

// render index page with tasks array
app.get('/', (req, res) => {
  res.render('index', { tasks: tasks });
});

// create new task and add to tasks array
app.post('/addTask', (req, res) => {
  const taskName = req.body.taskName;
  const dueDate = req.body.dueDate;
  const category = req.body.category;

  const newTask = {
    name: taskName,
    due: dueDate,
    category: category,
  };

  tasks.push(newTask);
  res.redirect('/');
});

// edit existing task
app.post('/editTask/:id', (req, res) => {
  const id = req.params.id;
  const taskName = req.body.taskName;
  const dueDate = req.body.dueDate;

  tasks[id].name = taskName;
  tasks[id].due = dueDate;

  res.redirect('/');
});

// start server
app.listen(3000, () => {
  console.log(`App listening at http://localhost:3000`);
});
