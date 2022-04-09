import { CacheInterface } from '../interfaces';
import { Config } from '../interfaces';
import stringify from 'json-stringify-safe';
import Redis from 'ioredis';

export class RedisEngine implements CacheInterface {
  private client: Redis;

  constructor(public engine: string, public config: Config) {
    this.client = this.configureClient();
  }

  configureClient() {
    const client = new Redis(this.config);
    return client;
  }

  async write<Type>(key: string, item: Type, ttl: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.set(key, this.encode(item), (err, data) => {
        if (err) {
          reject(false);
          return;
        }
        this.client.expire(key, ttl);
        resolve(data);
      });
    });
  }

  async read<Type>(key: string): Promise<Type> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) {
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

  private decode<Type>(cacheItem: string | null | undefined): Type {
    return cacheItem ? JSON.parse(cacheItem) : undefined;
  }
}
