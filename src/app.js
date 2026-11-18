const express = require('express');
const pool = require('./db/pool');
const app = express();

app.use(express.json());

// Valida que el parámetro de la URL sea un entero positivo (si no, responde 400)
function validateIdParam(paramName = 'id') {
  return (req, res, next) => {
    const value = Number(req.params[paramName]);

    if (!Number.isInteger(value) || value <= 0) {
      return res.status(400).json({ error: `Invalid ${paramName}` });
    }

    req.params[paramName] = value;
    next();
  };
}

// GET ALL AUTHORS
app.get('/authors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM authors ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET AUTHOR BY ID
app.get('/authors/:id', validateIdParam(), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json(result.rows[0]);
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

    const result = await pool.query(
      'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE AN EXISTING AUTHOR
app.put('/authors/:id', validateIdParam(), async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      `UPDATE authors
       SET name = COALESCE($1, name),
           email = COALESCE($2, email)
       WHERE id = $3
       RETURNING *`,
      [name || null, email || null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE AN AUTHOR
app.delete('/authors/:id', validateIdParam(), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM authors WHERE id = $1', [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET ALL POSTS
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET POSTS BY AUTHOR ID
app.get('/posts/author/:authorId', validateIdParam('authorId'), async (req, res) => {
  try {
    const authorResult = await pool.query('SELECT * FROM authors WHERE id = $1', [req.params.authorId]);

    if (authorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const postsResult = await pool.query(
      'SELECT * FROM posts WHERE author_id = $1 ORDER BY id',
      [req.params.authorId]
    );

    res.json({ author: authorResult.rows[0], posts: postsResult.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET POST BY ID
app.get('/posts/:id', validateIdParam(), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
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

    const authorResult = await pool.query('SELECT id FROM authors WHERE id = $1', [author_id]);

    if (authorResult.rows.length === 0) {
      return res.status(400).json({ error: 'Author does not exist' });
    }

    const result = await pool.query(
      'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, author_id, published ?? false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE AN EXISTING POST
app.put('/posts/:id', validateIdParam(), async (req, res) => {
  try {
    const { title, content, author_id, published } = req.body;

    if (author_id !== undefined) {
      const authorResult = await pool.query('SELECT id FROM authors WHERE id = $1', [author_id]);

      if (authorResult.rows.length === 0) {
        return res.status(400).json({ error: 'Author does not exist' });
      }
    }

    const result = await pool.query(
      `UPDATE posts
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           author_id = COALESCE($3, author_id),
           published = COALESCE($4, published)
       WHERE id = $5
       RETURNING *`,
      [title || null, content || null, author_id ?? null, published ?? null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE A POST
app.delete('/posts/:id', validateIdParam(), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;