import request from 'supertest';
import app from '../../index';
import { buildAuth } from '../builders/author';
import { buildPost } from '../builders/post';

describe('Posts Endpoints', () => {
  describe('POST /posts', ()=> {
    it('should return 201', async () => {
      const { token } = await buildAuth();
      const res = await request(app)
        .post('/posts')
        .send({
          title: 'test',
          content: 'test',
        }).set('Authorization', 'Bearer ' + token);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('title');
      expect(res.body.data).toHaveProperty('content');
    });

    it('should return 400', async () => {
      const { token } = await buildAuth();
      const res = await request(app)
        .post('/posts')
        .send({
          title: 'test',
        }).set('Authorization', 'Bearer ' + token);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBeFalsy();
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /posts', ()=> {
    it('should return 200', async () => {
      const res = await request(app)
        .get('/posts');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toBeInstanceOf(Object);
    });
  });

  describe('GET /posts/:id', ()=> {
    it('should return 200', async () => {
      const post = await buildPost();
      const res = await request(app)
        .get('/posts/' + post.id);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('title');
      expect(res.body.data).toHaveProperty('content');
    });

    it('should return 404', async () => {
      const res = await request(app)
        .get('/posts/999');

      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
      expect(res.body).toHaveProperty('errors');
    });
  });
});
