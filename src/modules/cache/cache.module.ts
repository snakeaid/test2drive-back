import { Global, Module } from '@nestjs/common';
import { RedisModule } from '../../core/redis';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [RedisModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
