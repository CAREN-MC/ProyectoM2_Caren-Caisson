const express = require('express');
const pool = require('./db/pool');
const createError = require('./utils/createError');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

app.use(express.json());

// Valida que el parámetro de la URL sea un entero positivo (si no, 400)
function validateIdParam(paramName = 'id') {
  return (req, res, next) => {
    const value = Number(req.params[paramName]);

    if (!Number.isInteger(value) || value <= 0) {
      return next(createError(400, `Invalid ${paramName}`));
    }

    req.params[paramName] = value;
    next();
  };
}

// ---------- AUTHORS ----------

// GET ALL AUTHORS
app.get('/authors', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM authors ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET AUTHOR BY ID
app.get('/authors/:id', validateIdParam(), async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      throw createError(404, 'Author not found');
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// CREATE A NEW AUTHOR
app.post('/authors', async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw createError(400, 'Name and email are required');
    }

    const result = await pool.query(
      'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// UPDATE AN EXISTING AUTHOR
app.put('/authors/:id', validateIdParam(), async (req, res, next) => {
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
      throw createError(404, 'Author not found');
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE AN AUTHOR
app.delete('/authors/:id', validateIdParam(), async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM authors WHERE id = $1', [req.params.id]);

    if (result.rowCount === 0) {
      throw createError(404, 'Author not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// ---------- POSTS ----------

// GET ALL POSTS
app.get('/posts', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET POSTS BY AUTHOR ID
app.get('/posts/author/:authorId', validateIdParam('authorId'), async (req, res, next) => {
  try {
    const authorResult = await pool.query('SELECT * FROM authors WHERE id = $1', [req.params.authorId]);

    if (authorResult.rows.length === 0) {
      throw createError(404, 'Author not found');
    }

    const postsResult = await pool.query(
      'SELECT * FROM posts WHERE author_id = $1 ORDER BY id',
      [req.params.authorId]
    );

    res.json({ author: authorResult.rows[0], posts: postsResult.rows });
  } catch (error) {
    next(error);
  }
});

// GET POST BY ID
app.get('/posts/:id', validateIdParam(), async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      throw createError(404, 'Post not found');
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// CREATE A NEW POST
app.post('/posts', async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;

    if (!title || !content || !author_id) {
      throw createError(400, 'Title, content, and author_id are required');
    }

    const authorResult = await pool.query('SELECT id FROM authors WHERE id = $1', [author_id]);

    if (authorResult.rows.length === 0) {
      throw createError(400, 'Author does not exist');
    }

    const result = await pool.query(
      'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, author_id, published ?? false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// UPDATE AN EXISTING POST
app.put('/posts/:id', validateIdParam(), async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;

    if (author_id !== undefined) {
      const authorResult = await pool.query('SELECT id FROM authors WHERE id = $1', [author_id]);

      if (authorResult.rows.length === 0) {
        throw createError(400, 'Author does not exist');
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
      throw createError(404, 'Post not found');
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE A POST
app.delete('/posts/:id', validateIdParam(), async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);

    if (result.rowCount === 0) {
      throw createError(404, 'Post not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Ruta inexistente -> 404
app.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

// Middleware de errores: SIEMPRE al final, después de todas las rutas
app.use(errorHandler);

module.exports = app;
