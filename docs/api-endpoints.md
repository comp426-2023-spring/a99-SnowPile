# API Endpoints

## `server.js`

### app.get('/')
- Renders the login page of the application

## `auth/auth.js`

### router.get('/')
- Retrieves a list of todos from a SQLite database that match the current user's id
- The list of todos is then passed as an object to the 'render' method to be displayed on the frontend

### router.get('/login')
- Renders the login template file
- A key-value pair for 'error' and 'null' are passed in to pass any error information into the login template

### router.post('/login')
- Retrieves 'username' and 'password values from the request body as a query for database to find the matching username
- The passwords are then compared
- If the password is not valid, the function renders the 'login' view template with an error message
- If the password is valid, the function sets the 'userId' property of the session object to the 'id' of the user
- The interaction is then logged into the database

### router.get('/register')
- Renders the registration form to the client, allowing them to create a new account

### router.post('/register')
- Allows clients to register an account
- First checks if the username already exists. If it does, an error is provided
- If the username does not already exist, the new username is inserted into te database along with the hashed password
- The interaction is then logged into the database
- The client is then automatically logged in, and the todos page is rendered

### router.get('/update-user')
- Renders the client's information from the database

### router.post('/update-user')
- Takes in the new username and password and updates the client's information in the database
- It first checks if the username is already taken (excluding the current user)
- If the new username is already taken, the client is redirected back to the '/todo' page with an error message
- If the username is not taken, the upser information is updated in the database
- The interaction is logged in the database
- Upon successful update, the 'login' template is rendered and the client must log in again

### router.post('/delete-user')
- Allows for a client to delete their account
- Retrieves the current user information from the database
- Checks if the provided password is valid by comparing it with the hashed password stored in the database
- If the password is invalid, it redirects the user to the todo page with an error message.
- If the password is valid, it deletes all the user's todos and interactions from the database
- The user's account is then deleted. It also destroys the user's session and clears the session cookie. 
- Finally, it redirects the user to the login page.

### router.post('/logout')
- Logs out the user by destroying their session and clearing the session cookie.
- Before doing so, it logs the event in the database 
- The client is then redirected back to the login page

## `routes/todo.js`

### router.get('/')
- Retrieves all the todos from the current user from the database
- Renders the 'todo' view

### router.post('/add-task')
- Adds a new task to the current user's todo list
- Extracts the task description from the request body, and inserts it into the database with the user id
- The interaction is logged into the database
- Refreshes the todo list view

### router.post('/delete-task')
- Deletes a task from the current user's todo list
- Extracts the task id from the request body and deletes it from the database if it belongs to the current user
- The interaction is logged into the database
- Refreshes the todo list view
