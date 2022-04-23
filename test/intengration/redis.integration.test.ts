import { CacheEngines, CacheManager } from '../../src';

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

describe('RedisCache engine test cases', () => {
  it('Cache item added', async () => {
    const written = await cacheManager.write('hello2', writeData, 120000);
    expect(written).toBe('OK');
  });

  it('Cache item  retrieved', async () => {
    const writtenData = await cacheManager.read<Employee>('hello2');
    expect(writtenData).toEqual(writeData);
  });

  it('Cache item  removed', async () => {
    const deleted = await cacheManager.delete('hello2');
    expect(deleted).toBe(true);
  });

  afterAll(async done => {
    done();
  });
});
