import * as cacheModule from '../../utils/cache';
import redis from '../../configs/redis';
import sinon from 'sinon';

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
describe('Cache module', () => {
  let setStub: sinon.SinonStub;
  let getStub: sinon.SinonStub;
  let expireStub: sinon.SinonStub;

  beforeEach(() => {
    setStub = sinon.stub(redis, 'set');
    getStub = sinon.stub(redis, 'get');
    expireStub = sinon.stub(redis, 'expire');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('setCache', () => {
    it('should set cache with proper key, data, and expiry', async () => {
      await cacheModule.setCache('testKey', { some: 'data' }, 2);

      expect(setStub.calledOnce).toBeTruthy();
      expect(expireStub.calledOnce).toBeTruthy();

      const expectedKey = 'rise-testKey';
      expect(setStub.firstCall.args[0]).toBe(expectedKey);
      expect(expireStub.firstCall.args[0]).toBe(expectedKey);

      expect(expireStub.firstCall.args[1]).toBe(2 * 60 * 60);
    });
  });

  describe('getCache', () => {
    it('should retrieve cache with the proper key', async () => {
      getStub.resolves(JSON.stringify({ some: 'data' }));

      const result = await cacheModule.getCache('testKey');

      expect(getStub.calledOnce).toBeTruthy();
      expect(result).toEqual({ some: 'data' });
    });

    it('should return null on JSON parse error', async () => {
      getStub.resolves('invalid-json');

      const result = await cacheModule.getCache('testKey');

      expect(result).toBeNull();
    });
  });
});
