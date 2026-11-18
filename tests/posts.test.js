import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';

let testAuthorId;
let createdPostId;
const testEmail = `test.posts.${Date.now()}@example.com`;

beforeAll(async () => {
  const res = await request(app)
    .post('/authors')
    .send({ name: 'Autor de prueba', email: testEmail });
    
  testAuthorId = res.body.id;
});

afterAll(async () => {
  if (createdPostId) {
    await pool.query('DELETE FROM posts WHERE id = $1', [createdPostId]);
  }
  await pool.query('DELETE FROM authors WHERE email = $1', [testEmail]);
  await pool.end();
});

describe('GET /posts', () => {
  it('devuelve 200 y un array', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /posts', () => {
  it('devuelve 201 y crea un nuevo post', async () => {
    const nuevoPost = {
      title: 'Título de prueba',
      content: 'Contenido de prueba para el post',
      author_id: testAuthorId
    };

    const res = await request(app)
      .post('/posts')
      .send(nuevoPost);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(nuevoPost.title);
    expect(res.body.content).toBe(nuevoPost.content);
    expect(res.body.author_id).toBe(testAuthorId);

    createdPostId = res.body.id;
  });

  it('devuelve 400 si faltan datos obligatorios', async () => {
    const res = await request(app)
      .post('/posts')
      .send({
        title: 'Post incompleto',
        author_id: testAuthorId
      });

    expect(res.status).toBe(400);
  });

  it('devuelve 400 si el author_id no existe', async () => {
    const res = await request(app)
      .post('/posts')
      .send({
        title: 'Título válido',
        content: 'Contenido válido para el post',
        author_id: testAuthorId + 999999
      });

    expect(res.status).toBe(400);
  });
});

describe('GET /posts/:id', () => {
  it('devuelve 200 y el post correspondiente al id', async () => {
    const res = await request(app).get(`/posts/${createdPostId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdPostId);
  });

  it('devuelve 404 si el post no existe', async () => {
    const res = await request(app).get('/posts/999999');

    expect(res.status).toBe(404);
  });
});

describe('GET /posts/author/:authorId', () => {
  it('devuelve 200 y el objeto con las claves author y posts', async () => {
    const res = await request(app).get(`/posts/author/${testAuthorId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('author');
    expect(res.body).toHaveProperty('posts');
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  it('devuelve 404 si el autor no existe', async () => {
    const res = await request(app).get('/posts/author/999999');

    expect(res.status).toBe(404);
  });
});

describe('PUT /posts/:id', () => {
  it('devuelve 200 y actualiza el título del post', async () => {
    const res = await request(app)
      .put(`/posts/${createdPostId}`)
      .send({ title: 'Título nuevo' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Título nuevo');
  });

  it('devuelve 404 si el post a actualizar no existe', async () => {
    const res = await request(app)
      .put('/posts/999999')
      .send({ title: 'Título nuevo' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /posts/:id', () => {
  it('borra el post y devuelve 204', async () => {
    const res = await request(app).delete(`/posts/${createdPostId}`);

    expect(res.status).toBe(204);
  });

  it('devuelve 404 si se intenta borrar el mismo post otra vez', async () => {
    const res = await request(app).delete(`/posts/${createdPostId}`);

    expect(res.status).toBe(404);
  });
});