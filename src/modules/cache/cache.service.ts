import { Inject, Injectable } from '@nestjs/common';
import { Cluster, Redis } from 'ioredis';
import { RedisService } from '../../core/redis';

@Injectable()
export class CacheService {
  private readonly redisClient: Redis | Cluster;

  public constructor(@Inject(RedisService) redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

  public async get<T>(key: string, index = 0): Promise<T | null> {
    const [, [, result]] = await this.redisClient.multi().select(index).get(key).exec();
    try {
      return JSON.parse(result as any);
    } catch {
      return result as any;
    }
  }

  public async set(key: string, value: any, index = 0, ttl?: number): Promise<void> {
    if (!!ttl) {
      await this.redisClient.multi().select(index).set(key, JSON.stringify(value), 'EX', ttl).exec();
    }

    await this.redisClient.multi().select(index).set(key, JSON.stringify(value)).exec();
  }
}
