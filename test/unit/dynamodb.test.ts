import { CacheEngines, CacheManager } from '../../src';
import { DDBRepository } from '../../src/repositories';

const DynamoConfig = {
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  maxRetries: 20,
  accessKeyId: 'msh1u9',
  secretAccessKey: '5s8mpp',
  dataType: 'Profiles',
  cacheTable: 'cache',
};

const cacheManager = new CacheManager(CacheEngines.dynamodb, DynamoConfig);

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

describe('DynamopDB Cache engine', () => {
  beforeAll(() => {
    jest.mock('../../src/repositories');
    DDBRepository.prototype.write = mockRepoFunction;
    DDBRepository.prototype.delete = mockRepoFunction;
    DDBRepository.prototype.read = mockRepoFunction;
    mockRepoFunction.mockReturnValue(Promise.resolve(true));
  });

  it('Cache item added', async () => {
    const response = await cacheManager.write('hello2', writeData, 220);
    expect(response).toEqual(true);
    expect(mockRepoFunction).toBeCalledTimes(1);
  });

  it('Cache item  retrieved', async () => {
    const response = await cacheManager.read<Employee>('hello2');
    expect(response).toEqual(true);
    expect(mockRepoFunction).toBeCalledTimes(2);
  });

  it('Cache item  removed', async () => {
    const response = await cacheManager.delete('hello2');
    expect(response).toEqual(true);
    expect(mockRepoFunction).toBeCalledTimes(3);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
