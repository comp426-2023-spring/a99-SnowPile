const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// 设置静态文件夹
app.use(express.static('public'));

// 解析body中的数据
app.use(bodyParser.urlencoded({ extended: true }));

// 假设任务数据保存在全局数组中
let tasks = [];

// 显示任务列表
app.get('/', (req, res) => {
  res.render('index', { tasks });
});

// 添加任务
app.post('/addTask', (req, res) => {
  const { name, date, category } = req.body;
  tasks.push({ name, date, category });
  res.redirect('/');
});

// 修改任务
app.post('/updateTask', (req, res) => {
  const { index, name, date } = req.body;
  tasks[index].name = name;
  tasks[index].date = date;
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
