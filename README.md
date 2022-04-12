# Type Safe Cache implementation with Redis, Memcached & DynamoB

A cache module for nodejs that allows easy wrapping of cache operations like read, write and delete. We can configure the underlying engine while creating the adapter classes.

- Easy setup
- Support Memcached, Redis & DynamoDB
- 100% test coverage with functions

## Installation

```
npm i node-multicache-manager
```

## Method overview

```
write<Type>(key: string, item: Type, ttl?: number): Promise<any>;
read<Type>(key: string): Promise<Type>;
delete(key: string): Promise<boolean>;
```

An example in Redis

```javascript
import { CacheManager, CacheEngines } from 'node-multicache-manager';

const RedisConfig = {
  port: 6379,
  host: '127.0.0.1',
  db: 0,
};

const cacheManager = new CacheManager(CacheEngines.redis, RedisConfig);

type Employee = {
  name: string,
  email: string,
  salary: number,
  address: string,
};

const writeData: Employee = {
  name: 'Adam',
  email: 'adam@xxx.com',
  salary: 200000,
  address: 'Dubai spots city',
};

async function writeExamples() {
  const written = await cacheManager.write('hello2', writeData, 120000);
  const writtenData = (await cacheManager.read) < Employee > 'hello2';

  console.log(writtenData);
}

writeExamples();
```
