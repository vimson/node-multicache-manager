import { Config } from './interfaces';
import { DynamoDBEngine, MemcacheEngine, RedisEngine } from './engines';
import { CacheEngineFactory } from './factories';

export class CacheManager {
  engine: string;
  config: Config;
  cache: DynamoDBEngine | MemcacheEngine | RedisEngine;

  constructor(engine: string, config: Config) {
    this.engine = engine;
    this.config = config;
    this.cache = this.buildClient();
  }

  async write<Type>(key: string, item: Type, ttl: number): Promise<any> {
    return await this.cache.write<typeof item>(key, item, ttl);
  }

  async read<Type>(key: string): Promise<Type> {
    return (await this.cache.read(key)) as Type;
  }

  async delete(key: string): Promise<boolean> {
    return await this.cache.delete(key);
  }

  buildClient(): DynamoDBEngine | RedisEngine | MemcacheEngine {
    switch (this.engine) {
      case 'DYNAMODB':
        return new CacheEngineFactory().getInstance(
          DynamoDBEngine,
          this.engine,
          this.config
        );
        break;

      case 'MEMCACHE':
        return new CacheEngineFactory().getInstance(
          MemcacheEngine,
          this.engine,
          this.config
        );
        break;

      case 'REDIS':
        return new CacheEngineFactory().getInstance(
          RedisEngine,
          this.engine,
          this.config
        );
        break;

      default:
        break;
    }

    throw new Error('Cache engine not specified');
  }
}
