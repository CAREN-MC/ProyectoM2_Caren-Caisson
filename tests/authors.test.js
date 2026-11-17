import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';

afterAll(async () => {
  await pool.end();
});

describe('GET /authors', () => {
  it('devuelve 200 y un array', async () => {
    const res = await request(app).get('/authors');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});