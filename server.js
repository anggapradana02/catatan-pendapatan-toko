const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Setup database
const db = new sqlite3.Database('./database/db.sqlite');
db.serialize(() => {
  db.run(\`CREATE TABLE IF NOT EXISTS income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    description TEXT,
    amount REAL
  )\`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// GET home
app.get('/', (req, res) => {
  db.all("SELECT * FROM income ORDER BY date DESC", [], (err, rows) => {
    db.get("SELECT SUM(amount) AS total FROM income", (err2, totalRow) => {
      res.render('index', { incomeList: rows, total: totalRow.total || 0 });
    });
  });
});

// POST new income
app.post('/add', (req, res) => {
  const { date, description, amount } = req.body;
  db.run("INSERT INTO income (date, description, amount) VALUES (?, ?, ?)",
    [date, description, amount], (err) => {
      if (err) console.error(err);
      res.redirect('/');
    });
});

app.listen(PORT, () => console.log(\`Server running on http://localhost:\${PORT}\`));