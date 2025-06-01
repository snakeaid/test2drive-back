import type { DynamicModule } from '@nestjs/common';

import { Module } from '@nestjs/common';

import type { RedisModuleAsyncOptions } from './redis.types';

import { RedisBaseModule } from './redis-base.module';

@Module({})
export class RedisModule {
  public static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisBaseModule.forRootAsync(options)],
    };
  }
}
