const express = require('express');
const pool = require('./db/pool');
const app = express();

app.use(express.json());

const authors = [
  { id: 1, name: 'Susana Cordisco', email: 'scord@gmail.com' },
  { id: 2, name: 'Maria Palomeque', email: 'mpalomeque@gmail.com' },
  { id: 3, name: 'Jorge Pinto', email: 'jpinto@gmail.com' }
];

// GET ALL AUTHORS
app.get('/authors', async (req, res) => {
  try {
    res.json(authors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET AUTHOR BY ID
app.get('/authors/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const author = authors.find((a) => a.id === id);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json(author);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE A NEW AUTHOR
app.post('/authors', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newId = authors.length > 0 ? authors[authors.length - 1].id + 1 : 1;
    const newAuthor = { id: newId, name, email };
    authors.push(newAuthor);

    res.status(201).json(newAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE AN EXISTING AUTHOR
app.put('/authors/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const author = authors.find((a) => a.id === id);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const { name, email } = req.body;
    if (name) author.name = name;
    if (email) author.email = email;

    res.json(author);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE AN AUTHOR
app.delete('/authors/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const authorIndex = authors.findIndex((a) => a.id === id);

    if (authorIndex === -1) {
      return res.status(404).json({ error: 'Author not found' });
    }

    authors.splice(authorIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
app.get('/posts', async (req, res) => {
  try {
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET POST BY ID
app.get('/posts/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const post = posts.find((p) => p.id === id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET POSTS BY AUTHOR ID
app.get('/posts/author/:authorId', async (req, res) => {
  try {
    const authorId = Number(req.params.authorId);
    const author = authors.find((a) => a.id === authorId);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const authorPosts = posts.filter((p) => p.author_id === authorId);

    res.json({ author, posts: authorPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE A NEW POST
app.post('/posts', async (req, res) => {
  try {
    const { title, content, author_id, published } = req.body;

    if (!title || !content || !author_id) {
      return res.status(400).json({ error: 'Title, content, and author_id are required' });
    }

    const authorId = Number(author_id);
    const authorExists = authors.some((a) => a.id === authorId);

    if (!authorExists) {
      return res.status(400).json({ error: 'Author does not exist' });
    }

    const newId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;
    const newPost = {
      id: newId,
      title,
      content,
      author_id: authorId,
      published: published ?? false,
      created_at: new Date().toISOString().slice(0, 10)
    };

    posts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE AN EXISTING POST
app.put('/posts/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const post = posts.find((p) => p.id === id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { title, content, author_id, published } = req.body;

    if (author_id !== undefined) {
      const authorId = Number(author_id);
      const authorExists = authors.some((a) => a.id === authorId);

      if (!authorExists) {
        return res.status(400).json({ error: 'Author does not exist' });
      }
      post.author_id = authorId;
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (published !== undefined) post.published = published;

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE A POST
app.delete('/posts/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const postIndex = posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    posts.splice(postIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;