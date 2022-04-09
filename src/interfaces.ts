export enum CacheEngines {
  'dynamodb' = 'DYNAMODB',
  'redis' = 'REDIS',
  'memcache' = 'MEMCACHE',
}

export interface Config {
  [key: string]: any;
}

export interface CacheInterface {
  engine: string;
  config: Config;

  write<Type>(key: string, item: Type, ttl?: number): Promise<any>;
  read<Type>(key: string): Promise<Type>;
  delete(key: string): Promise<boolean>;
}
