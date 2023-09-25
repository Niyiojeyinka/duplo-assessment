jest.mock('../configs/redis', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    expire: jest.fn(),
    disconenect: jest.fn(),
    on: jest.fn()
  },
}));
