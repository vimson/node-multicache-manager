import { CacheInterface } from '../interfaces';
import { Config } from '../interfaces';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class DynamoDBEngine implements CacheInterface {
  private client: DocumentClient;
  private cacheType = 'cache#categorypages';
  private cacheTable = 'cache';

  constructor(public engine: string, public config: Config = {}) {
    this.client = this.configureClient();
  }

  configureClient() {
    const client =
      Object.keys(this.config).length > 0
        ? new DocumentClient({
            region: this.config['region'],
            endpoint: this.config['endpoint'],
            maxRetries: this.config['maxRetries'],
            accessKeyId: this.config['accessKeyId'],
            secretAccessKey: this.config['secretAccessKey'],
          })
        : new DocumentClient({
            maxRetries: 20,
          });
    return client;
  }

  async write<Type>(key: string, item: Type): Promise<any> {
    const params = {
      TableName: this.cacheTable,
      Item: {
        pk: this.cacheType,
        sk: key,
        data: item,
      },
    };

    return new Promise((resolve, reject) => {
      this.client.put(params, function(err, data) {
        if (err) {
          console.log(err);
          reject();
        }
        resolve(data);
      });
    });
  }

  async read<Type>(key: string): Promise<Type> {
    return new Promise((resolve, reject) => {
      this.client.get(
        {
          TableName: this.cacheTable,
          Key: {
            pk: this.cacheType,
            sk: key,
          },
        },
        function(err, data) {
          if (err) {
            console.log(err);
            reject();
          }
          resolve(data?.Item?.data as Type);
        }
      );
    });
  }

  async delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.delete(
        {
          TableName: this.cacheTable,
          Key: {
            pk: this.cacheType,
            sk: key,
          },
        },
        function(err) {
          if (err) {
            console.log(err);
            reject(false);
          }
          resolve(true);
        }
      );
    });
  }
}
