import { CacheEngines, CacheManager } from '../../src';

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

describe('DynamopDB Cache engine', () => {
  it('Cache item added', async () => {
    await cacheManager.write('hello2', writeData, 220);
  });

  it('Cache item  retrieved', async () => {
    await cacheManager.read<Employee>('hello2');
  });

  it('Cache item  removed', async () => {
    await cacheManager.delete('hello2');
  });

  afterAll(async done => {
    done();
  });
});
