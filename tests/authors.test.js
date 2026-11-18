import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';

let createdAuthorId;
const testEmail = `test.${Date.now()}@example.com`;

afterAll(async () => {
  // Limpieza por si algún test falló antes de borrar el autor
  await pool.query('DELETE FROM authors WHERE email = $1', [testEmail]);
  await pool.end();
});

describe('GET /authors', () => {
  it('devuelve 200 y un array', async () => {
    const res = await request(app).get('/authors');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /authors', () => {
  it('devuelve 201 y el autor creado', async () => {
    const newAuthor = { name: 'Test Author', email: testEmail };
    const res = await request(app).post('/authors').send(newAuthor);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newAuthor.name);

    createdAuthorId = res.body.id;
  });

  it('devuelve 400 si falta el email', async () => {
    const res = await request(app).post('/authors').send({ name: 'Sin email' });
    expect(res.status).toBe(400);
  });
});

describe('GET /authors/:id', () => {
  it('devuelve 200 y el autor por ID', async () => {
    const res = await request(app).get(`/authors/${createdAuthorId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdAuthorId);
  });

  it('devuelve 404 si el autor no existe', async () => {
    const res = await request(app).get('/authors/999999');
    expect(res.status).toBe(404);
  });

  it('devuelve 400 si el id no es un número', async () => {
  const res = await request(app).get('/authors/abc');
  expect(res.status).toBe(400);
});

});

describe('PUT /authors/:id', () => {
  it('devuelve 200 y el autor actualizado', async () => {
    const updatedAuthor = { name: 'Updated Author' };
    const res = await request(app).put(`/authors/${createdAuthorId}`).send(updatedAuthor);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updatedAuthor.name);
  });

  it('devuelve 404 si el autor no existe', async () => {
    const res = await request(app).put('/authors/999999').send({ name: 'Non-existent Author' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /authors/:id', () => {
  it('devuelve 204 si el autor fue eliminado', async () => {
    const res = await request(app).delete(`/authors/${createdAuthorId}`);
    expect(res.status).toBe(204);
  });

  it('devuelve 404 al eliminar un autor que ya no existe', async () => {
    const res = await request(app).delete(`/authors/${createdAuthorId}`);
    expect(res.status).toBe(404);
  });
});