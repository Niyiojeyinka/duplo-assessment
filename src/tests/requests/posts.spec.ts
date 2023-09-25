import app from '../../index';
import { buildAuth } from '../builders/author';
import { buildPost } from '../builders/post';

describe('Posts Endpoints', () => {
  describe('POST /posts', ()=> {
    it('should return 201', async () => {
      const { token } = await buildAuth();
      const response = await app.inject({
        method: 'POST',
        url: '/posts',
        headers: {
          Authorization: 'Bearer ' + token,
        },

        payload:
        {
          title: 'test',
          content: 'test',
        }
      }) as any;
      const responseBody = JSON.parse(response.body);

      expect(response.statusCode).toEqual(201);
      expect(responseBody).toHaveProperty('data');
      expect(responseBody.data).toHaveProperty('id');
      expect(responseBody.data).toHaveProperty('title');
      expect(responseBody.data).toHaveProperty('content');
    });

    it('should return 400', async () => {
      const { token } = await buildAuth();
      const response = await app.inject({
        method: 'POST',
        url: '/posts',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        payload:
        {
          title: 'test',
        }
      }) as any;
      const responseBody = JSON.parse(response.body);

      expect(response.statusCode).toEqual(400);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody).toHaveProperty('errors');
    });
  });

  describe('GET /posts', ()=> {
    it('should return 200', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/posts',
      }) as any;
      const responseBody = JSON.parse(response.body);
      
      expect(response.statusCode).toEqual(200);
      expect(responseBody).toHaveProperty('data');
      expect(responseBody.data).toBeInstanceOf(Object);
    });
  });

  describe('GET /posts/:id', ()=> {
    it('should return 200', async () => {
      const post = await buildPost();
      const response = await app.inject({
        method: 'GET',
        url: `/posts/${post.id}`,
      }) as any;
      const responseBody = JSON.parse(response.body);
      
      expect(response.statusCode).toEqual(200);
      expect(responseBody).toHaveProperty('data');
      expect(responseBody.data).toHaveProperty('id');
      expect(responseBody.data).toHaveProperty('title');
      expect(responseBody.data).toHaveProperty('content');
    });

    it('should return 404', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/posts/100',
      }) as any;
      const responseBody = JSON.parse(response.body);

      expect(response.statusCode).toEqual(404);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody).toHaveProperty('errors');
    });
  });
});
