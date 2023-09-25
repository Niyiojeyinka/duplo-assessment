import request from 'supertest';
import app from '../../index';
import { buildAuthor } from '../builders/author';
import {  faker } from '@faker-js/faker';
import { Author } from '@prisma/client';

describe('Author Endpoints', () => {
  describe('POST /authors', ()=> {
    it('should return 201', async () => {
      const res = await request(app)
        .post('/authors')
        .send({
          email: faker.internet.email(),
          name: faker.person.firstName(),
          password: faker.internet.password()
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('email');
      expect(res.body.data).toHaveProperty('name');
    });
  });

  describe('POST authors/login', ()=> {
    it.only('should return 200', async () => {
      const author = await buildAuthor({
        password: 'password',
        name: faker.person.firstName(),
        email: faker.internet.email(),
        id: 2,
      } as Author);
      
      const res = await request(app)
        .post('/authors/login')
        .send({
          email: author.email,
          password: 'password',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('token');
    });

    it('should return 400', async () => {
      const res = await request(app)
        .post('/authors/login')
        .send({
          email: faker.internet.email(),
          password: 'password',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /authors', ()=> {
    it('should return 200', async () => {
      const res = await request(app)
        .get('/authors');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /authors/:id', ()=> {
    it('should return 200', async () => {
      const author = await buildAuthor();
      const res = await request(app)
        .get('/authors/' + author.id);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('email');
      expect(res.body.data).toHaveProperty('name');
    });
  });
});
