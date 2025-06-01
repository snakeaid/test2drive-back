import type { DynamicModule, OnModuleDestroy } from '@nestjs/common';

import { ConsoleLogger } from '@nestjs/common';

import { Global, Module, Inject } from '@nestjs/common';

import type { RedisClient } from './client-strategies';
import type { RedisModuleOptions, RedisModuleAsyncOptions } from './redis.types';

import { createClient, createAsyncClientOptions } from './client-strategies';

import { RedisService } from './redis.service';
import { REDIS_MODULE_OPTIONS } from './redis.constants';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisBaseModule implements OnModuleDestroy {
  private logger = new ConsoleLogger();

  public constructor(
    @Inject(REDIS_MODULE_OPTIONS)
    private readonly options: RedisModuleOptions,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisBaseModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [RedisService],
    };
  }

  public onModuleDestroy(): void {
    this.logger.log('Closing connection to Redis');
  }
}
