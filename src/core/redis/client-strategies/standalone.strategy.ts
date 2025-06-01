import type { Redis as RedisType, RedisOptions } from 'ioredis';
import Redis from 'ioredis';

import type { RedisAuthOptions, TlsType } from '../redis.types';

import { redisConsole } from '../utils';

export async function getStandaloneClient(
  options: RedisOptions,
  { tls, auth }: { tls: TlsType; auth: RedisAuthOptions },
): Promise<RedisType> {
  const { port, host } = options;
  const { username, password } = auth;

  redisConsole('Standalone Mode');

  return new Redis({
    port,
    host,
    tls,
    password,
    username,
    retryStrategy(times) {
      if (times < 100) {
        return 2000;
      }

      return 4000;
    },
  });
}
