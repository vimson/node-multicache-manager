import { CacheEngines, CacheManager } from '../../src';
import { RedisRepository } from '../../src/repositories';

const RedisConfig = {
  port: 6379,
  host: '127.0.0.1',
  db: 0,
};

const cacheManager = new CacheManager(CacheEngines.redis, RedisConfig);

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

describe('RedisCache engine test cases', () => {
  beforeAll(() => {
    jest.mock('../../src/repositories');
    RedisRepository.prototype.write = mockRepoFunction;
    RedisRepository.prototype.delete = mockRepoFunction;
    RedisRepository.prototype.read = mockRepoFunction;
  });

  it('Cache item added', async () => {
    mockRepoFunction.mockReturnValue('added');
    const response = await cacheManager.write('hello2', writeData, 120000);
    expect(response).toEqual('added');
    expect(mockRepoFunction).toBeCalledTimes(1);
  });

  it('Cache item  retrieved', async () => {
    mockRepoFunction.mockReturnValue('retrieved');
    const response = await cacheManager.read<Employee>('hello2');
    expect(response).toEqual('retrieved');
    expect(mockRepoFunction).toBeCalledTimes(2);
  });

  it('Cache item  removed', async () => {
    mockRepoFunction.mockReturnValue('deleted');
    const response = await cacheManager.delete('hello2');
    expect(response).toEqual('deleted');
    expect(mockRepoFunction).toBeCalledTimes(3);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
