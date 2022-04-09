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

//https://2ality.com/2020/04/classes-as-values-typescript.html
