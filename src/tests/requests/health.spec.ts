import request from 'supertest';
import app from '../../index';

jest.mock('../../configs/redis', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    expire: jest.fn(),
    disconenect: jest.fn(),
    on: jest.fn()
  },
}));

describe('Health Check', () => {
  it('should returns 200', async () => {
    const res = await request(app)
      .get('/health')
      .send({});
    expect(res.statusCode).toEqual(200);
  });
});
