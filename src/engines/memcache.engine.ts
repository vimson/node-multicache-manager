import { CacheInterface } from '../interfaces';
import { Config } from '../interfaces';
import Memcached from 'memcached';
import stringify from 'json-stringify-safe';

export class MemcacheEngine implements CacheInterface {
  private client;

  constructor(public engine: string, public config: Config) {
    this.client = this.configureClient();
  }

  configureClient() {
    const client = new Memcached(this.config['hosts'], {
      timeout: this.config['timeout'],
      retries: 1,
    });
    return client;
  }

  async write<Type>(key: string, item: Type, ttl: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.set(key, this.encode<Type>(item), ttl, (err, data) => {
        if (err) {
          console.log(err);
          reject(false);
          return;
        }
        resolve(data);
      });
    });
  }

  async read<Type>(key: string): Promise<Type> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) {
          console.log(err);
          reject(false);
          return;
        }
        resolve(this.decode(data));
      });
    });
  }

  async delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.del(key, err => {
        if (err) {
          console.log(err);
          reject(false);
          return;
        }
        resolve(true);
      });
    });
  }

  private encode<Type>(item: Type): string {
    return stringify(item);
  }

  private decode<Type>(cacheItem: string): Type {
    return cacheItem ? JSON.parse(cacheItem) : undefined;
  }
}
