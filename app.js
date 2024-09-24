const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method')); 
app.set('view engine', 'ejs');

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'task_manager' // Database you created
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Routes

// 1. GET all tasks (API)
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 2. POST create a task (API)
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  db.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, title, description });
  });
});

// Render the update form for a specific task
app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.render('update', { task: results[0] });
      } else {
        res.status(404).send('Task not found');
      }
    });
  });
  


// 3. PUT update a task (API)
app.put('/api/tasks/:id', (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;
    db.query('UPDATE tasks SET title = ?, description = ? WHERE id = ?', [title, description, id], (err) => {
      if (err) throw err;
      res.json({ message: 'Task updated', id, title, description });
    });
  });
  
  

// 4. DELETE a task (API)
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Task deleted', id });
  });
});

// 5. Render HTML 
app.get('/', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) throw err;
    res.render('index', { tasks: results });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

