const express = require('express');
const app = express();

app.use(express.json());

const authors = [
  { id: 1, name: 'Susana Cordisco', email: 'scord@gmail.com' },
  { id: 2, name: 'Maria Palomeque', email: 'mpalomeque@gmail.com' },
  { id: 3, name: 'Jorge Pinto', email: 'jpinto@gmail.com' }
];

// GET ALL AUTHORS
app.get('/authors', (req, res) => {
  res.json(authors);
});

// GET AUTHOR BY ID
app.get('/authors/:id', (req, res) => {
  const id = Number(req.params.id);
  const author = authors.find((a) => a.id === id);

  if (!author) {
    return res.status(404).json({ error: 'Author not found' });
  }

  res.json(author);
});

// CREATE A NEW AUTHOR
app.post('/authors', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newId = authors.length > 0 ? authors[authors.length - 1].id + 1 : 1;
  const newAuthor = { id: newId, name, email };
  authors.push(newAuthor);

  res.status(201).json(newAuthor);
});

// UPDATE AN EXISTING AUTHOR
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

// DELETE AN AUTHOR
app.delete('/authors/:id', (req, res) => {
  const id = Number(req.params.id);
  const authorIndex = authors.findIndex((a) => a.id === id);

  if (authorIndex === -1) {
    return res.status(404).json({ error: 'Author not found' });
  }

  authors.splice(authorIndex, 1);
  res.status(204).send();
});

const posts = [
  {
    id: 1,
    title: 'Lluvia de marzo',
    content: 'Poema sobre las tardes de lluvia y los recuerdos que despiertan...',
    author_id: 1,
    published: true,
    created_at: '2026-11-11'
  },
  {
    id: 2,
    title: 'El dragón que tenía miedo a la oscuridad',
    content: 'Cuento infantil sobre un pequeño dragón y su amigo luciérnaga...',
    author_id: 2,
    published: true,
    created_at: '2026-11-11'
  },
  {
    id: 3,
    title: 'Microficción: el último tren',
    content: 'Un hombre espera un tren que nunca llega, hasta que...',
    author_id: 1,
    published: true,
    created_at: '2026-11-11'
  },
  {
    id: 4,
    title: 'Colonia en Marte',
    content: 'Relato de ciencia ficción sobre la primera familia nacida en Marte...',
    author_id: 3,
    published: false,
    created_at: '2026-11-11'
  },
  {
    id: 5,
    title: 'Cuentos para antes de dormir',
    content: 'Borrador de una colección de cuentos cortos para leer en voz alta...',
    author_id: 1,
    published: false,
    created_at: '2026-11-11'
  }
];

// GET ALL POSTS
app.get('/posts', (req, res) => {
  res.json(posts);
});

// GET POST BY ID
app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

// GET POST BY ID
app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

// GET POSTS BY AUTHOR ID
app.get('/posts/author/:authorId', (req, res) => {
  const authorId = Number(req.params.authorId);
  const author = authors.find((a) => a.id === authorId);

  if (!author) {
    return res.status(404).json({ error: 'Author not found' });
  }

  const authorPosts = posts.filter((p) => p.author_id === authorId);

  res.json({ author, posts: authorPosts });
});

//CREATE A NEW POST
app.post('/posts', (req, res) => {)
  const {title, content, author_id, published} = req.body;

  if (!title || !content || !author_id) {
    return res.status(400).json({ error: 'Title, content, and author_id are required' });
  
     const authorExists = authors.find((a) 
  })
mo1dule.exports = app;