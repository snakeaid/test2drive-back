import { registerAs } from '@nestjs/config';
import { RedisModuleOptions } from '../redis';

export default registerAs(
  'redis',
  (): RedisModuleOptions => ({
    nodes: process.env.REDIS_HOST + ':' + process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  }),
);
