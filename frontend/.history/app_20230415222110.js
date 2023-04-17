const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// set up view engine
app.set('view engine', 'ejs');

// set up static folder
app.use(express.static('public'));



// start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
