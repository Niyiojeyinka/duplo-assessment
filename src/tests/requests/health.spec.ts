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
    afterAll(() => {
    app.close();
  });

  it('should returns 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });
    
    expect(response.statusCode).toEqual(200);
  });
});
