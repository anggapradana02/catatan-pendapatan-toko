
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let pendapatan = [];

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { pendapatan });
});

app.post('/tambah', (req, res) => {
  const { tanggal, jumlah } = req.body;
  pendapatan.push({ tanggal, jumlah });
  res.redirect('/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server jalan di port', port));
