import { Config } from './interfaces';

export class CacheEngineFactory {
  public getInstance<T>(
    entityClass: new (engine: string, config: Config) => T,
    engine: string,
    config: any
  ): T {
    const entity = new entityClass(engine, config);
    return entity;
  }
}

export class RepositoryFactory {
  public getInstance<T>(
    entityClass: new (engine: string, config: Config) => T,
    engine: string,
    config: any
  ): T {
    const entity = new entityClass(engine, config);
    return entity;
  }
}
