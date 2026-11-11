const express = require('express');
const app = express();
app.use(express.json());

const authors = [
  { id: 1, name: 'Susana Cordisco', email: 'scord@gmail.com' },
  { id: 2, name: 'Maria Palomeque', email: 'mpalomeque@gmail.com' },
  { id: 3, name: 'Jorge Pinto', email: 'jpinto@gmail.com' }
];

app.get('/authors', (req, res) => res.json(authors));

module.exports = app;
