import * as Redis from 'ioredis';
import { Injectable, Inject } from '@nestjs/common';
import type { RedisClient } from './client-strategies';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  public constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}

  public getClient(): Redis.Redis | Redis.Cluster {
    const redisClient = this.redis.client;

    //TODO: Need await???
    redisClient.ping().catch(async () => redisClient.connect());

    return redisClient;
  }

  public async ping(message: string): Promise<string> {
    return this.redis.client.ping(message);
  }
}
