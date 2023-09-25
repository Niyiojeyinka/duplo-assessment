import { url } from 'inspector';
import app from '../../index';
import { buildAuthor } from '../builders/author';
import {  faker } from '@faker-js/faker';
import { Author } from '@prisma/client';

describe('Author Endpoints', () => {
  afterAll(() => {
    app.close();
  });

  describe('POST /authors/register', ()=> {
    it('should return 201', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/authors/register',
        payload:
        {
          email: faker.internet.email(),
          name: faker.person.firstName(),
          password: faker.internet.password()
        }}) as any;
      const responseBody = JSON.parse(response.body);
      
      expect(response.statusCode).toEqual(201);
      expect(responseBody).toHaveProperty('data');
      expect(responseBody.data).toHaveProperty('id');
      expect(responseBody.data).toHaveProperty('email');
      expect(responseBody.data).toHaveProperty('name');
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
      
      const response = await app.inject({
        method: 'POST',
        url: '/authors/login',
        payload: {
          email: author.email,
          password: 'password',
        }
      }) as any;
      const responseBody = JSON.parse(response.body);

      expect(response.statusCode).toEqual(200);
      expect(responseBody.data).toHaveProperty('token');
    });

    it('should return 400', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/authors/login',
        payload: {
        email: faker.internet.email(),
        password: 'password',
        } }) as any;
      const responseBody = JSON.parse(response.body);

      expect(response.statusCode).toEqual(400);
      expect(responseBody).toHaveProperty('errors');
    });
  });
});
