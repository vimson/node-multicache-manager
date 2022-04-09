import { CacheEngines, CacheManager } from '../src';

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

describe('Memcached Cache engine', () => {
  it('Cache item added', async () => {
    await cacheManager.write('hello5', writeData, 120);
  });

  it('Cache item  retrieved', async () => {
    await cacheManager.read<Employee>('hello5');
  });

  it('Cache item  removed', async () => {
    await cacheManager.delete('hello5');
  });

  afterAll(async done => {
    done();
  });
});
