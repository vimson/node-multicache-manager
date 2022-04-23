import { CacheEngines, CacheManager } from '../../src';
import { MemcacheRepository } from '../../src/repositories';

const MemcacheConfig = {
  hosts: ['127.0.0.1'],
  timeout: 1000,
};

const cacheManager = new CacheManager(CacheEngines.memcache, MemcacheConfig);

type Employee = {
  name: string;
  email: string;
  salary: number;
  address: string;
};

const writeData: Employee = {
  name: 'Vimson Varghese',
  email: 'vimson@gmail.com',
  salary: 200000,
  address: 'Kuyiladan House, Potta P O, 680722',
};

const mockRepoFunction = jest.fn();

describe('Memcached Cache engine', () => {
  beforeAll(() => {
    jest.mock('../../src/repositories');
    MemcacheRepository.prototype.write = mockRepoFunction;
    MemcacheRepository.prototype.delete = mockRepoFunction;
    MemcacheRepository.prototype.read = mockRepoFunction;
  });

  it('Cache item added', async () => {
    mockRepoFunction.mockReturnValue(Promise.resolve('added'));
    const response = await cacheManager.write('hello5', writeData, 120);
    expect(response).toEqual('added');
    expect(mockRepoFunction).toBeCalledTimes(1);
  });

  it('Cache item  retrieved', async () => {
    mockRepoFunction.mockReturnValue(Promise.resolve('retrieved'));
    const response = await cacheManager.read<Employee>('hello5');
    expect(response).toEqual('retrieved');
    expect(mockRepoFunction).toBeCalledTimes(2);
  });

  it('Cache item  removed', async () => {
    mockRepoFunction.mockReturnValue(Promise.resolve('deleted'));
    const response = await cacheManager.delete('hello5');
    expect(response).toEqual('deleted');
    expect(mockRepoFunction).toBeCalledTimes(3);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
