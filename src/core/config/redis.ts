import { registerAs } from '@nestjs/config';
import { RedisModuleOptions } from '../redis';

export default registerAs(
  'redis',
  (): RedisModuleOptions => {
    console.log('🔧 Configuring Redis/Valkey connection...');
    console.log('⚡ Redis Host:', process.env.REDIS_HOST);
    console.log('🚪 Redis Port:', process.env.REDIS_PORT);
    console.log('👤 Redis Username:', process.env.REDIS_USERNAME || 'default');
    
    const redisConfig = {
      nodes: (process.env.REDIS_HOST || 'localhost') + ':' + (process.env.REDIS_PORT || '6379'),
      username: process.env.REDIS_USERNAME || undefined,
      password: process.env.REDIS_PASSWORD || undefined,
    };
    
    console.log('✅ Redis config created:', { nodes: redisConfig.nodes, hasPassword: !!redisConfig.password });
    return redisConfig;
  },
);
