import { CacheEngineFactory, RepositoryFactory } from './factories';
import { Config } from './interfaces';
import {
  DDBRepository,
  MemcacheRepository,
  RedisRepository,
} from './repositories';

type RepositoryType = DDBRepository | MemcacheRepository | RedisRepository;

export class CacheManager {
  engine: string;
  config: Config = {};
  repo: RepositoryType;

  constructor(engine: string, config?: Config) {
    this.engine = engine;
    if (typeof config !== 'undefined') {
      this.config = config ?? {};
    }
    this.repo = this.buildRepository();
  }

  async write<Type>(key: string, item: Type, ttl: number): Promise<any> {
    return await this.repo.write<typeof item>(key, item, ttl);
  }

  async read<Type>(key: string): Promise<Type> {
    return (await this.repo.read(key)) as Type;
  }

  async delete(key: string): Promise<boolean> {
    return await this.repo.delete(key);
  }

  buildRepository(): RepositoryType {
    let repo: RepositoryType;

    switch (this.engine) {
      case 'DYNAMODB':
        repo = new RepositoryFactory().getInstance(
          DDBRepository,
          this.engine,
          this.config
        );
        break;

      case 'MEMCACHE':
        repo = new CacheEngineFactory().getInstance(
          MemcacheRepository,
          this.engine,
          this.config
        );
        break;

      case 'REDIS':
        repo = new CacheEngineFactory().getInstance(
          RedisRepository,
          this.engine,
          this.config
        );
        break;

      default:
        throw new Error('Repository not found');
    }

    return repo;
  }
}
