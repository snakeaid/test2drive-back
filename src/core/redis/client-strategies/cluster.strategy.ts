import { Cluster } from 'ioredis';
import type { Cluster as ClusterType, RedisOptions } from 'ioredis';

import type { TlsType, RedisAuthOptions } from '../redis.types';
import { redisConsole } from '../utils';

export async function getClusterClient(
  nodes: RedisOptions[],
  { tls, auth }: { tls: TlsType; auth: RedisAuthOptions },
): Promise<ClusterType> {
  const { username, password } = auth;

  redisConsole('Cluster Mode');

  return new Cluster(nodes, {
    redisOptions: {
      tls,
      password,
      username,
    },
  });
}
