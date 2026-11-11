const express = require('express');
const app = express();
app.use(express.json());

const authors = [
  { id: 1, name: 'Susana Cordisco', email: 'scord@gmail.com' },
  { id: 2, name: 'Maria Palomeque', email: 'mpalomeque@gmail.com' },
  { id: 3, name: 'Jorge Pinto', email: 'jpinto@gmail.com' }
];

// OBTENER TODOS LOS AUTORES
app.get('/authors', (req, res) => {
  res.json(authors);
});

// OBTENER UN AUTOR POR ID
app.get('/authors/:id', (req, res) => {
  const id = Number(req.params.id);
  const author = authors.find((a) => a.id === id);
  if (!author) {
    return res.status(404).json({ error: 'Author not found' });
  }
  res.json(author);
});

// CREAR UN NUEVO AUTOR
app.post('/authors', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Faltan name o email' });
  }

  const newId = authors.length > 0 ? authors[authors.length - 1].id + 1 : 1;
  const newAuthor = { id: newId, name, email };

  authors.push(newAuthor);
  res.status(201).json(newAuthor);
});

// ACTUALIZAR UN AUTOR EXISTENTE
app.put('/authors/:id', (req, res) => {
  const id = Number(req.params.id);
  const author = authors.find((a) => a.id === id);
  if (!author) {
    return res.status(404).json({ error: 'Author not found' });
  }

  const { name, email } = req.body;
  if (name) author.name = name;
  if (email) author.email = email;

  res.json(author);
});

// ELIMINAR UN AUTOR
app.delete('/authors/:id', (req, res) => {
  const id = Number(req.params.id);
  const authorIndex = authors.findIndex((a) => a.id === id);
  if (authorIndex === -1) {
    return res.status(404).json({ error: 'Author not found' });
  }

  authors.splice(authorIndex, 1);
  res.status(204).send();
});

module.exports = app;